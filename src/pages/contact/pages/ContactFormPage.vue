<template>
    <div class="contact-form-page">
        <div class="page-header mb-4">
            <Button 
                icon="pi pi-arrow-left" 
                label="Voltar"
                class="p-button-text"
                @click="goBack"
            />
            <h2 class="page-title">
                {{ isEdit ? 'Editar Contato' : 'Novo Contato' }}
            </h2>
        </div>

        <Card class="form-card">
            <template #content>
                <ContactFormComponent
                    :contact="contactData"
                    :loading="loading"
                    :is-edit="isEdit"
                    :api-error="apiError"
                    @save="saveContact"
                    @cancel="goBack"
                />
            </template>
        </Card>

        <Toast />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Toast from 'primevue/toast'

import ContactFormComponent from '../components/ContactForm.vue'
import { contactService } from '@/services/contactService'
import { useApi } from '@/composables/useApi'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { loading, handleRequest } = useApi()

const contactData = ref(null)
const isEdit = ref(false)
const apiError = ref(null)

const loadContact = async () => {
    if (route.params.id) {
        isEdit.value = true
        const data = await handleRequest(
            () => contactService.getContactById(route.params.id),
            null,
            'Erro ao carregar contato'
        )
        
        if (data) {
            contactData.value = data
        } else {
            goBack()
        }
    }
}

const saveContact = async (formData) => {
    // Clear previous API errors
    apiError.value = null
    
    let result = null
    
    if (isEdit.value) {
        result = await contactService.updateContact(route.params.id, formData)
    } else {
        result = await contactService.createContact(formData)
    }
    
    if (result && result.success) {
        const successMessage = isEdit.value ? 'Contato atualizado com sucesso' : 'Contato criado com sucesso'
        
        toast.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: successMessage,
            life: 3000
        })
        
        goBack()
    } else {
        apiError.value = result?.error || 'Erro ao processar solicitação'
        
        console.log('API Error:', result) // Debug log
    }
}

const goBack = () => {
    router.push('/')
}

onMounted(() => {
    loadContact()
})
</script>

<style scoped>
.contact-form-page {
    padding: 1rem;
    max-width: 800px;
    margin: 0 auto;
}

.page-header {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.page-title {
    margin: 0;
    color: #2c3e50;
    font-size: 1.5rem;
    font-weight: 600;
}

.form-card {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.mb-4 {
    margin-bottom: 1rem;
}
</style>