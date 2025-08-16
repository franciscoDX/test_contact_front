<template>
    <form @submit.prevent="submitForm" class="contact-form">
        <div class="form-grid">
            <!-- Nome -->
            <div class="form-field">
                <label for="name" class="form-label">Nome completo *</label>
                <InputText
                    id="name"
                    v-model="formData.name"
                    :class="{ 'p-invalid': errors.name }"
                    placeholder="Digite o nome completo (mínimo 6 caracteres)"
                    class="form-input"
                />
                <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
            </div>

            <!-- Contacto -->
            <div class="form-field">
                <label for="contact" class="form-label">Telemóvel *</label>
                <InputText
                    id="contact"
                    v-model="formData.contact"
                    :class="{ 'p-invalid': errors.contact }"
                    placeholder="Digite 9 dígitos (ex: 123456789)"
                    class="form-input"
                    maxlength="9"
                    @input="onContactInput"
                />
                <small v-if="errors.contact" class="p-error">{{ errors.contact }}</small>
            </div>

            <!-- Email -->
            <div class="form-field">
                <label for="email" class="form-label">Email *</label>
                <InputText
                    id="email"
                    v-model="formData.email"
                    :class="{ 'p-invalid': errors.email }"
                    placeholder="Digite o email"
                    class="form-input"
                    type="email"
                />
                <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
            </div>

            <!-- Imagem -->
            <div class="form-field full-width">
                <label for="picture" class="form-label">
                    Foto {{ isEdit ? '(opcional - deixe vazio para manter a atual)' : '*' }}
                </label>
                
                <!-- Preview da imagem atual/selecionada -->
                <div v-if="imagePreview || (isEdit && contact?.picture)" class="image-preview">
                    <img 
                        :src="imagePreview || getContactImage(contact)" 
                        alt="Preview"
                        class="preview-image"
                    />
                    <Button 
                        icon="pi pi-times" 
                        class="p-button-rounded p-button-danger p-button-sm remove-image-btn"
                        @click="removeImage"
                        type="button"
                        v-tooltip="'Remover imagem'"
                    />
                </div>

                <FileUpload
                    mode="basic"
                    :auto="false"
                    accept="image/*"
                    :maxFileSize="5000000"
                    @select="onFileSelect"
                    @clear="onFileClear"
                    choose-label="Escolher imagem"
                    class="file-upload"
                />
                <small class="help-text">Formatos aceitos: JPG, PNG, GIF. Máximo: 5MB</small>
                <small v-if="errors.picture" class="p-error">{{ errors.picture }}</small>
            </div>
        </div>

        <!-- Mensagem de erro geral -->
        <div v-if="errors.general" class="error-message">
            <i class="pi pi-exclamation-triangle"></i>
            {{ errors.general }}
        </div>

        <!-- Botões -->
        <div class="form-actions">
            <Button
                type="submit"
                :label="isEdit ? 'Atualizar Contato' : 'Criar Contato'"
                :icon="isEdit ? 'pi pi-check' : 'pi pi-plus'"
                class="p-button-success"
                :loading="loading"
                :disabled="!isFormValid"
            />
            <Button
                label="Cancelar"
                icon="pi pi-times"
                class="p-button-secondary"
                @click="emit('cancel')"
                type="button"
                :disabled="loading"
            />
        </div>
    </form>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import FileUpload from 'primevue/fileupload'

const props = defineProps({
    contact: {
        type: Object,
        default: null
    },
    loading: {
        type: Boolean,
        default: false
    },
    isEdit: {
        type: Boolean,
        default: false
    },
    apiError: {
        type: String,
        default: null
    }
})

const emit = defineEmits(['save', 'cancel'])

// Form data
const formData = ref({
    name: '',
    contact: '',
    email: '',
    picture: null
})

// Image preview
const imagePreview = ref(null)

// Validation errors
const errors = ref({})

// Computed
const isFormValid = computed(() => {
    return formData.value.name.length >= 6 &&
           /^\d{9}$/.test(formData.value.contact) &&
           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email) &&
           (props.isEdit || formData.value.picture) // Picture required only for new contacts
})

// Methods
const validateForm = () => {
    errors.value = {}
    
    // Nome validation
    if (!formData.value.name || formData.value.name.length < 6) {
        errors.value.name = 'Nome deve ter pelo menos 6 caracteres'
    }
    
    // Contact validation
    if (!formData.value.contact || !/^\d{9}$/.test(formData.value.contact)) {
        errors.value.contact = 'Telemóvel deve ter exatamente 9 dígitos'
    }
    
    // Email validation
    if (!formData.value.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
        errors.value.email = 'Digite um email válido'
    }
    
    // Picture validation (only for new contacts)
    if (!props.isEdit && !formData.value.picture) {
        errors.value.picture = 'Foto é obrigatória'
    }
    
    return Object.keys(errors.value).length === 0
}

const handleApiError = (errorMessage) => {
    // Clear previous errors
    errors.value = {}
    
    if (!errorMessage) return
    
    // Check for specific error messages and map to form fields
    const errorLower = errorMessage.toLowerCase()
    
    if (errorLower.includes('number') && (errorLower.includes('exists') || errorLower.includes('already'))) {
        errors.value.contact = 'Este número de contacto já existe'
    } else if (errorLower.includes('email') && (errorLower.includes('exists') || errorLower.includes('already'))) {
        errors.value.email = 'Este email já existe'
    } else if (errorLower.includes('name')) {
        errors.value.name = errorMessage
    } else if (errorLower.includes('contact') || errorLower.includes('phone') || errorLower.includes('number')) {
        errors.value.contact = errorMessage
    } else if (errorLower.includes('email')) {
        errors.value.email = errorMessage
    } else if (errorLower.includes('picture') || errorLower.includes('image') || errorLower.includes('file')) {
        errors.value.picture = errorMessage
    } else {
        // Generic error
        errors.value.general = errorMessage
    }
}

const onContactInput = (event) => {
    const value = event.target.value.replace(/\D/g, '')
    formData.value.contact = value.slice(0, 9) // Limit to 9 digits
}

const onFileSelect = (event) => {
    const file = event.files[0]
    console.log('File selected:', file)
    
    if (file) {
        formData.value.picture = file
        
        const reader = new FileReader()
        reader.onload = (e) => {
            imagePreview.value = e.target.result
        }
        reader.readAsDataURL(file)
        
        // Clear picture error if exists
        if (errors.value.picture) {
            delete errors.value.picture
        }
        
    }
}

const onFileClear = () => {
    formData.value.picture = null
    imagePreview.value = null
}

const removeImage = () => {
    formData.value.picture = null
    imagePreview.value = null
}

const API_BASE_URL = import.meta.env.VITE_API_URL;

const getContactImage = (contact) => {
    if (contact.picture) {
        return `${API_BASE_URL}${contact.picture}`;
    }
    return null
}

const submitForm = () => {
    if (!validateForm()) {
        return
    }
    
    console.log('FormData before submit:', formData.value) // Debug log
    console.log('Picture file:', formData.value.picture) // Debug log
    
    // Create FormData
    const submitData = new FormData()
    submitData.append('name', formData.value.name)
    submitData.append('contact', formData.value.contact)
    submitData.append('email', formData.value.email)
    
    if (formData.value.picture) {
        submitData.append('picture', formData.value.picture)
        console.log('Picture added to FormData:', formData.value.picture) // Debug log
    } else {
        console.log('No picture to add to FormData') // Debug log
    }
    
    // Debug: Ver el contenido del FormData
    for (let pair of submitData.entries()) {
        console.log('FormData entry:', pair[0], pair[1])
    }
    
    // Clear previous errors
    errors.value = {}
    
    // Emit save event
    emit('save', submitData)
}

// Watch for API errors from parent
watch(() => props.apiError, (newError) => {
    if (newError) {
        handleApiError(newError)
    }
}, { immediate: true })

// Watch for contact prop changes (when editing)
watch(() => props.contact, (newContact) => {
    if (newContact && props.isEdit) {
        formData.value.name = newContact.name || ''
        formData.value.contact = newContact.contact || ''
        formData.value.email = newContact.email || ''
        formData.value.picture = null // Don't load the existing picture file
        imagePreview.value = null
    }
}, { immediate: true })

// Reset form when not editing
watch(() => props.isEdit, (isEdit) => {
    if (!isEdit) {
        formData.value = {
            name: '',
            contact: '',
            email: '',
            picture: null
        }
        imagePreview.value = null
        errors.value = {}
    }
})
</script>

<style scoped>
.contact-form {
    padding: 1rem;
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.form-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-field.full-width {
    grid-column: 1 / -1;
}

.form-label {
    font-weight: 600;
    color: #2c3e50;
    font-size: 0.9rem;
}

.form-input {
    width: 100%;
}

.image-preview {
    position: relative;
    display: inline-block;
    margin-bottom: 1rem;
}

.preview-image {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #e9ecef;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.remove-image-btn {
    position: absolute;
    top: -5px;
    right: -5px;
    width: 30px;
    height: 30px;
}

.file-upload {
    width: 100%;
}

.help-text {
    color: #6c757d;
    font-size: 0.8rem;
}

.error-message {
    background-color: #ffeaea;
    border: 1px solid #ff6b6b;
    border-radius: 6px;
    padding: 1rem;
    margin-bottom: 1rem;
    color: #d63031;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    padding-top: 1rem;
    border-top: 1px solid #e9ecef;
}

/* Responsive */
@media (max-width: 768px) {
    .form-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .form-actions {
        flex-direction: column-reverse;
    }
    
    .form-actions .p-button {
        width: 100%;
    }
}
</style>