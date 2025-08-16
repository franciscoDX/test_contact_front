<template>
    <div class="contact-detail-page">
        <!-- Loading state -->
        <div v-if="loading" class="loading-container">
            <ProgressSpinner />
            <p>Carregando detalhes do contato...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="error-container">
            <div class="error-content">
                <i class="pi pi-exclamation-triangle error-icon"></i>
                <h3>Erro ao carregar contato</h3>
                <p>{{ error }}</p>
                <Button 
                    label="Voltar à lista" 
                    icon="pi pi-arrow-left"
                    class="p-button-secondary"
                    @click="goBack"
                />
            </div>
        </div>

        <!-- Contact details -->
        <div v-else-if="contact" class="contact-detail-container">
            <!-- Header com navegação -->
            <div class="detail-header mb-4">
                <Button 
                    icon="pi pi-arrow-left" 
                    label="Voltar"
                    class="p-button-text"
                    @click="goBack"
                />
                <div class="header-actions">
                    <Button 
                        icon="pi pi-pencil" 
                        label="Editar"
                        class="p-button-warning"
                        @click="editContact"
                        v-tooltip="'Editar este contato'"
                    />
                    <Button 
                        icon="pi pi-trash" 
                        label="Eliminar"
                        class="p-button-danger"
                        @click="showDeleteDialog = true"
                        v-tooltip="'Eliminar este contato'"
                    />
                </div>
            </div>

            <!-- Cartão principal -->
            <Card class="contact-card">
                <template #header>
                    <div class="card-header">
                        <div class="contact-image-container">
                            <img 
                                :src="getContactImage(contact)" 
                                :alt="contact.name"
                                class="contact-image"
                                @error="onImageError"
                            />
                        </div>
                        <div class="contact-main-info">
                            <h1 class="contact-name">{{ contact.name }}</h1>
                        </div>
                    </div>
                </template>

                <template #content>
                    <div class="contact-details">
                        <!-- Informações de contato -->
                        <div class="detail-section">
                            <h3 class="section-title">
                                <i class="pi pi-phone section-icon"></i>
                                Informações de Contato
                            </h3>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <label class="detail-label">Telemóvel</label>
                                    <div class="detail-value">
                                        <i class="pi pi-phone detail-icon"></i>
                                        <span class="phone-number">{{ formatPhoneNumber(contact.contact) }}</span>
                                        <Button 
                                            icon="pi pi-copy" 
                                            class="p-button-text p-button-sm copy-btn"
                                            @click="copyToClipboard(contact.contact)"
                                            v-tooltip="'Copiar número'"
                                        />
                                    </div>
                                </div>

                                <div class="detail-item">
                                    <label class="detail-label">Email</label>
                                    <div class="detail-value">
                                        <i class="pi pi-envelope detail-icon"></i>
                                        <a :href="`mailto:${contact.email}`" class="email-link">
                                            {{ contact.email }}
                                        </a>
                                        <Button 
                                            icon="pi pi-copy" 
                                            class="p-button-text p-button-sm copy-btn"
                                            @click="copyToClipboard(contact.email)"
                                            v-tooltip="'Copiar email'"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Informações do sistema -->
                        <div class="detail-section">
                            <h3 class="section-title">
                                <i class="pi pi-info-circle section-icon"></i>
                                Informações do Sistema
                            </h3>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <label class="detail-label">ID do Contato</label>
                                    <div class="detail-value">
                                        <i class="pi pi-hashtag detail-icon"></i>
                                        <span class="contact-id">{{ contact.id }}</span>
                                    </div>
                                </div>

                                <div class="detail-item">
                                    <label class="detail-label">Data de Criação</label>
                                    <div class="detail-value">
                                        <i class="pi pi-calendar-plus detail-icon"></i>
                                        <span>{{ formatDate(contact.created_at) }}</span>
                                    </div>
                                </div>

                                <div class="detail-item" v-if="contact.updated_at && contact.updated_at !== contact.created_at">
                                    <label class="detail-label">Última Atualização</label>
                                    <div class="detail-value">
                                        <i class="pi pi-calendar detail-icon"></i>
                                        <span>{{ formatDate(contact.updated_at) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </Card>
        </div>

        <!-- Modal de confirmação de eliminação -->
        <DeleteContactDialog
            v-model:visible="showDeleteDialog"
            :contact="contact"
            :loading="deleteLoading"
            @confirm="confirmDelete"
            @cancel="showDeleteDialog = false"
        />

        <!-- Toast para mensagens -->
        <Toast />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'

import Button from 'primevue/button'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import ProgressSpinner from 'primevue/progressspinner'
import Toast from 'primevue/toast'

import DeleteContactDialog from '../components/DeleteContactDialog.vue'
import { contactService } from '@/services/contactService'
import { useApi } from '@/composables/useApi'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { loading, handleRequest } = useApi()

// Data
const contact = ref(null)
const error = ref(null)
const showDeleteDialog = ref(false)
const deleteLoading = ref(false)

// Methods
const loadContact = async () => {
    const contactId = route.params.id
    
    if (!contactId) {
        error.value = 'ID do contato não fornecido'
        return
    }

    const data = await handleRequest(
        () => contactService.getContactById(contactId),
        null,
        'Contato não encontrado'
    )
    
    if (data) {
        contact.value = data
        error.value = null
    } else {
        error.value = 'Contato não encontrado'
    }
}

const API_BASE_URL = import.meta.env.VITE_API_URL;

const getContactImage = (contact) => {
    if (contact.picture) {
        return `${API_BASE_URL}${contact.picture}`;
    }
    return null
}

const onImageError = (event) => {
    // Fallback image
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgODBDODkuNTQzMSA4MCA4MSA4OC41NDMxIDgxIDk5QzgxIDEwOS40NTcgODkuNTQzMSAxMTggMTAwIDExOEMxMTAuNDU3IDExOCAxMTkgMTA5LjQ1NyAxMTkgOTlDMTE5IDg4LjU0MzEgMTEwLjQ1NyA4MCAxMDAgODBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xMDAgMTIwQzc3LjkwODYgMTIwIDYwIDEzNy45MDkgNjAgMTYwSDE0MEM1NCAxMzcuOTA5IDEyMi4wOTEgMTIwIDEwMCAxMjBaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPg=='
}

const formatDate = (dateString) => {
    if (!dateString) return ''
    
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const formatPhoneNumber = (phone) => {
    if (!phone) return ''
    return phone.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
}

const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text)
        toast.add({
            severity: 'success',
            summary: 'Copiado!',
            detail: 'Texto copiado para a área de transferência',
            life: 3000
        })
    } catch (err) {
        toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não foi possível copiar o texto',
            life: 3000
        })
    }
}

const goBack = () => {
    router.push('/')
}

const editContact = () => {
    router.push(`/edit/${contact.value.id}`)
}

const confirmDelete = async () => {
    if (!contact.value) return
    
    deleteLoading.value = true
    
    try {
        const result = await handleRequest(
            () => contactService.deleteContact(contact.value.id),
            'Contato eliminado com sucesso',
            'Erro ao eliminar contato'
        )
        
        if (result) {
            showDeleteDialog.value = false
            // Redirect to list after deletion
            setTimeout(() => {
                router.push('/')
            }, 1000)
        }
    } finally {
        deleteLoading.value = false
    }
}

// Quick actions
const callContact = () => {
    if (contact.value?.contact) {
        window.open(`tel:+351${contact.value.contact}`, '_self')
    }
}

const emailContact = () => {
    if (contact.value?.email) {
        window.open(`mailto:${contact.value.email}`, '_self')
    }
}

const shareContact = async () => {
    const shareData = {
        title: `Contato: ${contact.value.name}`,
        text: `${contact.value.name}\nTel: ${contact.value.contact}\nEmail: ${contact.value.email}`,
        url: window.location.href
    }

    try {
        if (navigator.share) {
            await navigator.share(shareData)
        } else {
            // Fallback: copy to clipboard
            await copyToClipboard(shareData.text)
        }
    } catch (err) {
        console.error('Error sharing:', err)
    }
}

// Lifecycle
onMounted(() => {
    loadContact()
})
</script>

<style scoped>
.contact-detail-page {
    padding: 1rem;
    max-width: 1000px;
    margin: 0 auto;
}

.loading-container, .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    text-align: center;
}

.error-content {
    max-width: 400px;
}

.error-icon {
    font-size: 3rem;
    color: #e74c3c;
    margin-bottom: 1rem;
}

.detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.header-actions {
    display: flex;
    gap: 0.75rem;
}

.contact-card {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    overflow: hidden;
}

.card-header {
    display: flex;
    align-items: center;
    gap: 2rem;
    padding: 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.contact-image-container {
    flex-shrink: 0;
}

.contact-image {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.contact-main-info {
    flex: 1;
}

.contact-name {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 1rem 0;
    color: white;
}

.contact-status {
    display: flex;
    gap: 0.5rem;
}

.contact-details {
    padding: 2rem;
}

.detail-section {
    margin-bottom: 2.5rem;
}

.detail-section:last-child {
    margin-bottom: 0;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.25rem;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #e9ecef;
}

.section-icon {
    color: #667eea;
    font-size: 1.1rem;
}

.detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
}

.detail-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.detail-label {
    font-weight: 600;
    color: #6c757d;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.detail-value {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background-color: #f8f9fa;
    border-radius: 8px;
    border-left: 4px solid #667eea;
    font-size: 1rem;
}

.detail-icon {
    color: #667eea;
    font-size: 1.1rem;
    flex-shrink: 0;
}

.phone-number {
    font-weight: 600;
    font-family: 'Courier New', monospace;
    font-size: 1.1rem;
}

.email-link {
    color: #667eea;
    text-decoration: none;
    font-weight: 500;
}

.email-link:hover {
    text-decoration: underline;
}

.contact-id {
    font-family: 'Courier New', monospace;
    font-weight: 600;
    color: #6c757d;
}

.copy-btn {
    opacity: 0.7;
    transition: opacity 0.2s;
}

.copy-btn:hover {
    opacity: 1;
}

.quick-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.quick-actions .p-button {
    flex: 1;
    min-width: 150px;
}

.mb-4 {
    margin-bottom: 1.5rem;
}

/* Responsive */
@media (max-width: 768px) {
    .contact-detail-page {
        padding: 0.5rem;
    }
    
    .detail-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
    }
    
    .header-actions {
        justify-content: center;
    }
    
    .card-header {
        flex-direction: column;
        text-align: center;
        gap: 1.5rem;
    }
    
    .contact-name {
        font-size: 2rem;
    }
    
    .contact-details {
        padding: 1rem;
    }
    
    .detail-grid {
        grid-template-columns: 1fr;
    }
    
    .quick-actions {
        flex-direction: column;
    }
    
    .quick-actions .p-button {
        width: 100%;
    }
}

@media (max-width: 480px) {
    .contact-image {
        width: 100px;
        height: 100px;
    }
    
    .contact-name {
        font-size: 1.75rem;
    }
    
    .detail-value {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
}
</style>