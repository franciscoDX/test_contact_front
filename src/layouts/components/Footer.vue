<template>
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; {{ currentYear }} <a href="https://franciscofernandez.dev" target="_blank">franciscofernandez</a>. Todos os direitos reservados.</p>
        <div class="footer-links">
          <a href="mailto:contact@franciscofernandez.dev">Contato</a>
        </div>
      </div>
    </footer>
</template>
  
<script setup>
import { computed } from 'vue';
  
const currentYear = computed(() => new Date().getFullYear());
</script>
  
<style scoped>
    .footer {
        padding: 1rem 1.5rem;
        background-color: #fff;
        border-top: 1px solid #eaeaea;
    }
    
    .footer-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.875rem;
        color: #666;
    }
    
    .footer-links {
        display: flex;
        gap: 1.5rem;
    }
    
    .footer-links a {
        color: #666;
        text-decoration: none;
    }
    
    .footer-links a:hover {
        color: #2196F3;
    }
    
    @media (max-width: 768px) {
        .footer-content {
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
        }
        
        .footer-links {
        justify-content: center;
        }
    }
</style>