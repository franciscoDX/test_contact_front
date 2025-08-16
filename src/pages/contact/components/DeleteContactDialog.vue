<template>
    <Dialog 
        :visible="visible" 
        @update:visible="$emit('update:visible', $event)"
        modal 
        :style="{ width: '450px' }"
        :closable="!loading"
        :close-on-escape="!loading"
        header=" "
    >
        <template #header>
            <div class="dialog-header">
                <i class="pi pi-exclamation-triangle warning-icon"></i>
                <span class="dialog-title">Confirmar Eliminação</span>
            </div>
        </template>

        <div class="dialog-content">
            <div v-if="contact" class="contact-info">
                <div class="contact-preview">
                    <img 
                        :src="getContactImage(contact)" 
                        :alt="contact.name"
                        class="contact-avatar"
                        @error="onImageError"
                    />
                    <div class="contact-details">
                        <h4 class="contact-name">{{ contact.name }}</h4>
                        <p class="contact-data">📞 {{ contact.contact }}</p>
                        <p class="contact-data">✉️ {{ contact.email }}</p>
                    </div>
                </div>
            </div>

            <div class="warning-message">
                <p><strong>Tem a certeza que deseja eliminar este contato?</strong></p>
                <p class="warning-text">
                    Esta ação não pode ser desfeita. Todos os dados do contato serão permanentemente removidos.
                </p>
            </div>
        </div>

        <template #footer>
            <div class="dialog-footer">
                <Button 
                    label="Cancelar" 
                    icon="pi pi-times"
                    class="p-button-text"
                    @click="$emit('cancel')"
                    :disabled="loading"
                />
                <Button 
                    label="Eliminar" 
                    icon="pi pi-trash"
                    class="p-button-danger"
                    @click="$emit('confirm')"
                    :loading="loading"
                    autofocus
                />
            </div>
        </template>
    </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    contact: {
        type: Object,
        default: null
    },
    loading: {
        type: Boolean,
        default: false
    }
})

defineEmits(['update:visible', 'confirm', 'cancel'])

const API_BASE_URL = import.meta.env.VITE_API_URL;

const getContactImage = (contact) => {
  return `${API_BASE_URL}${contact.picture}`;
};
const onImageError = (event) => {
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgODBDODkuNTQzMSA4MCA4MSA4OC41NDMxIDgxIDk5QzgxIDEwOS40NTcgODkuNTQzMSAxMTggMTAwIDExOEMxMTAuNDU3IDExOCAxMTkgMTA5LjQ1NyAxMTkgOTlDMTE5IDg4LjU0MzEgMTEwLjQ1NyA4MCAxMDAgODBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xMDAgMTIwQzc3LjkwODYgMTIwIDYwIDEzNy45MDkgNjAgMTYwSDE0MEM1NCAxMzcuOTA5IDEyMi4wOTEgMTIwIDEwMCAxMjBaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPg=='
}
</script>

<style scoped>
.dialog-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0;
}

.warning-icon {
    color: #f59e0b;
    font-size: 1.5rem;
}

.dialog-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2c3e50;
}

.dialog-content {
    padding: 1rem 0;
}

.contact-preview {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background-color: #f8f9fa;
    border-radius: 8px;
    margin-bottom: 1.5rem;
}

.contact-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #e9ecef;
}

.contact-details {
    flex: 1;
}

.contact-name {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: #2c3e50;
}

.contact-data {
    margin: 0.25rem 0;
    font-size: 0.9rem;
    color: #6c757d;
}

.warning-message {
    text-align: left;
}

.warning-message p {
    margin: 0 0 1rem 0;
    line-height: 1.5;
}

.warning-text {
    color: #6c757d;
    font-size: 0.9rem;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 0;
}

/* Responsive */
@media (max-width: 480px) {
    .contact-preview {
        flex-direction: column;
        text-align: center;
    }
    
    .dialog-footer {
        flex-direction: column-reverse;
    }
    
    .dialog-footer .p-button {
        width: 100%;
    }
}
</style>