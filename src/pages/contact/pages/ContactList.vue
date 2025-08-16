<template>
    <div class="contacts-page">
        <!-- Header con botón de nuevo contato -->
        <div class="page-header mb-4">
            <div class="header-content">
                <h1 class="page-title">📞 Gestão de Contatos</h1>
                <p class="page-subtitle">Gerencie seus contatos de forma fácil e eficiente</p>
            </div>
            <div class="header-actions">
                <Button 
                    label="Novo Contato"
                    icon="pi pi-plus" 
                    class="p-button-success"
                    @click="goToCreateContact"
                    v-tooltip="'Criar novo contato'"
                />
            </div>
        </div>

        <!-- Lista de contatos em cartas -->
        <ContactsCards
            :developers="developers"
            :loading="loading"
            @view-dev="viewContact"
            @edit-dev="editContact"
            @delete-dev="showDeleteDialogs"
        />

        <!-- Modal de confirmação de eliminação -->
        <DeleteContactDialog
            v-model:visible="showDeleteDialog"
            :contact="contactToDelete"
            :loading="deleteLoading"
            @confirm="confirmDelete"
            @cancel="cancelDelete"
        />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'

import ContactsCards from '../components/ContactCards.vue'
import DeleteContactDialog from '../components/DeleteContactDialog.vue'

import { contactService } from '@/services/contactService'
import { useApi } from '@/composables/useApi'

const router = useRouter()
const { loading, handleRequest } = useApi()

// Data
const developers = ref([])
const contactToDelete = ref(null)

// Dialog states
const showDeleteDialog = ref(false)
const deleteLoading = ref(false)

// Methods
const loadContacts = async () => {
    const data = await handleRequest(
        () => contactService.getAllContacts(),
        null,
        'Erro ao carregar contatos'
    )
    
    if (data) {
        developers.value = data
    }
}

const goToCreateContact = () => {
    router.push('/new')
}

const viewContact = (contact) => {
    // Navega para a página de detalhes completa
    router.push(`/${contact.id}`)
}

const editContact = (contact) => {
    router.push(`/edit/${contact.id}`)
}

const showDeleteDialogs = (contact) => {
    contactToDelete.value = contact
    showDeleteDialog.value = true
}

const confirmDelete = async () => {
    if (!contactToDelete.value) return
    
    deleteLoading.value = true
    
    try {
        const result = await handleRequest(
            () => contactService.deleteContact(contactToDelete.value.id),
            'Contato eliminado com sucesso',
            'Erro ao eliminar contato'
        )
        
        if (result) {
            // Remove from local list
            developers.value = developers.value.filter(
                dev => dev.id !== contactToDelete.value.id
            )
            cancelDelete()
        }
    } finally {
        deleteLoading.value = false
    }
}

const cancelDelete = () => {
    showDeleteDialog.value = false
    contactToDelete.value = null
}

// Lifecycle
onMounted(() => {
    loadContacts()
})
</script>

<style scoped>
.contacts-page {
    padding: 1rem;
    max-width: 1400px;
    margin: 0 auto;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    color: white;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.header-content {
    flex: 1;
}

.page-title {
    margin: 0 0 0.5rem 0;
    font-size: 2rem;
    font-weight: 700;
}

.page-subtitle {
    margin: 0;
    opacity: 0.9;
    font-size: 1.1rem;
}

.header-actions {
    display: flex;
    gap: 0.75rem;
}

.mb-4 {
    margin-bottom: 1.5rem;
}

/* Responsive */
@media (max-width: 768px) {
    .contacts-page {
        padding: 0.5rem;
    }
    
    .page-header {
        flex-direction: column;
        text-align: center;
        padding: 1rem;
    }
    
    .page-title {
        font-size: 1.5rem;
    }
    
    .page-subtitle {
        font-size: 1rem;
    }
    
    .header-actions {
        width: 100%;
        justify-content: center;
    }
    
    .header-actions .p-button {
        flex: 1;
        max-width: 300px;
    }
}
</style>