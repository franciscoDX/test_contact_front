<template>
    <div class="contacts-container">
        <!-- Loading state -->
        <div v-if="loading" class="flex justify-content-center align-items-center" style="min-height: 200px;">
            <ProgressSpinner />
        </div>

        <!-- Empty state -->
        <div v-else-if="!developers || developers.length === 0" class="empty-state">
            <div class="text-center">
                <i class="pi pi-users" style="font-size: 4rem; color: #6c757d;"></i>
                <h3>Nenhum contato encontrado</h3>
                <p class="text-muted">Comece adicionando seu primeiro contato!</p>
            </div>
        </div>

        <!-- Cards Grid -->
        <div v-else class="cards-grid">
            <Card 
                v-for="contact in developers" 
                :key="contact.id" 
                class="contact-card"
            >
                <template #header>
                    <div class="card-image-container">
                        <img 
                            :src="getContactImage(contact)" 
                            :alt="contact.name"
                            class="contact-image"
                            @error="onImageError"
                        />
                    </div>
                </template>

                <template #title>
                    <div class="contact-name">{{ contact.name }}</div>
                </template>

                <template #content>
                    <div class="contact-details">
                        <div class="contact-item">
                            <i class="pi pi-phone contact-icon"></i>
                            <strong>{{ contact.contact }}</strong>
                        </div>
                        
                        <div class="contact-item">
                            <i class="pi pi-envelope contact-icon"></i>
                            <span>{{ contact.email }}</span>
                        </div>
                        
                        <div class="contact-item">
                            <i class="pi pi-calendar contact-icon"></i>
                            <span class="text-muted">{{ formatDate(contact.created_at) }}</span>
                        </div>
                    </div>
                </template>

                <template #footer>
                    <div class="card-actions">
                        <Button 
                            icon="pi pi-eye" 
                            label="Ver"
                            class="p-button-outlined p-button-info p-button-sm"
                            @click="$emit('view-dev', contact)"
                            v-tooltip="'Ver detalhes do contato'"
                        />
                        <Button 
                            icon="pi pi-pencil" 
                            label="Editar"
                            class="p-button-outlined p-button-warning p-button-sm"
                            @click="$emit('edit-dev', contact)"
                            v-tooltip="'Editar contato'"
                        />
                        <Button 
                            icon="pi pi-trash" 
                            label="Eliminar"
                            class="p-button-outlined p-button-danger p-button-sm"
                            @click="$emit('delete-dev', contact)"
                            v-tooltip="'Eliminar contato'"
                        />
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>

<script setup>
import Card from 'primevue/card'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'

defineProps({
    developers: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
})

defineEmits(['view-dev', 'edit-dev', 'delete-dev'])

// Methods
const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
}

const API_BASE_URL = import.meta.env.VITE_API_URL;

const getContactImage = (contact) => {
  return `${API_BASE_URL}${contact.picture}`;
};

const onImageError = (event) => {
    // Imagen de fallback si no se puede cargar la imagen del contacto
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgODBDODkuNTQzMSA4MCA4MSA4OC41NDMxIDgxIDk5QzgxIDEwOS40NTcgODkuNTQzMSAxMTggMTAwIDExOEMxMTAuNDU3IDExOCAxMTkgMTA5LjQ1NyAxMTkgOTlDMTE5IDg4LjU0MzEgMTEwLjQ1NyA4MCAxMDAgODBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xMDAgMTIwQzc3LjkwODYgMTIwIDYwIDEzNy45MDkgNjAgMTYwSDE0MEM1NCAxMzcuOTA5IDEyMi4wOTEgMTIwIDEwMCAxMjBaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPg=='
}
</script>

<style scoped>
.contacts-container {
    padding: 1rem;
}

.cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
    margin: 1rem 0;
}

.contact-card {
    transition: all 0.3s ease;
    height: fit-content;
}

.contact-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.contact-image {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.contact-name {
    font-size: 1.25rem;
    font-weight: 600;
    text-align: center;
    color: #2c3e50;
    margin-bottom: 0.5rem;
}

.contact-details {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background-color: #f8f9fa;
    border-radius: 6px;
}

.contact-icon {
    color: #6c757d;
    font-size: 0.9rem;
    width: 16px;
}

.card-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    flex-wrap: wrap;
}

.card-actions .p-button {
    flex: 1;
    min-width: 80px;
}

.empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
    text-align: center;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .cards-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .card-actions {
        flex-direction: column;
    }
    
    .card-actions .p-button {
        flex: none;
        width: 100%;
    }
}

@media (max-width: 480px) {
    .contacts-container {
        padding: 0.5rem;
    }
    
    .contact-name {
        font-size: 1.1rem;
    }
    
    .contact-item {
        padding: 0.375rem;
    }
}
</style>