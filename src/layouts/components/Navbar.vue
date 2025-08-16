<template>
    <header class="navbar">
      <div class="navbar-start">
        <Button 
          icon="pi pi-bars" 
          @click="toggleMobile" 
          class="toggle-button p-button-text p-button-rounded mobile-only" 
        />
        
        <Button 
          :icon="collapsed ? 'pi pi-arrow-right' : 'pi pi-arrow-left'" 
          @click="toggleSidebar" 
          class="toggle-button p-button-text p-button-rounded desktop-only mr-2" 
        />
        
        <h2 class="page-title">{{ pageTitle }}</h2>
      </div>
      
    </header>
</template>
  
<script setup>
import { defineProps, defineEmits } from 'vue';
  
const props = defineProps({
    collapsed: {
        type: Boolean,
        default: false
    },
    pageTitle: {
        type: String,
        default: 'Dashboard'
    }
});

const emit = defineEmits(['toggle-sidebar', 'toggle-mobile']);

const toggleSidebar = () => {
    emit('toggle-sidebar');
};

const toggleMobile = () => {
    emit('toggle-mobile');
};
</script>
  
<style scoped>
    .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 1.5rem;
        background-color: #fff;
        border-bottom: 1px solid #eaeaea;
        height: 64px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
    }
    
    .navbar-start, .navbar-end {
        display: flex;
        align-items: center;
    }
    
    .navbar-items {
        display: flex;
        gap: 0.5rem;
    }
    
    .page-title {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 500;
        color: #333;
    }
    
    .toggle-button {
        color: #666 !important;
    }
    
    .mr-2 {
        margin-right: 0.5rem;
    }
    .mobile-only {
        display: none;
    }
    
    @media (max-width: 768px) {
        .mobile-only {
        display: block;
        }
        
        .desktop-only {
        display: none;
        }
        
        .page-title {
        font-size: 1.1rem;
        }
    }
</style>