<template>
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo-container">
          <img src="@/assets/developer-icon.png" alt="Logo" class="logo" v-if="!collapsed" />
          <img src="@/assets/developer-icon.png" alt="Logo" class="logo-small" v-else />
        </div>
      </div>
      
      <div class="sidebar-content">
        <div class="menu">
          <div v-for="(item, i) in menuItems" :key="i" class="menu-item">
            <router-link 
              :to="item.to" 
              custom 
              v-slot="{ navigate, isActive }"
            >
              <a 
                @click="navigate" 
                @keypress.enter="navigate" 
                :class="[isActive && 'active-route']"
                role="menuitem"
              >
                <i :class="['pi', item.icon]"></i>
                <span v-if="!collapsed">{{ item.label }}</span>
                <div v-if="isActive" class="active-indicator"></div>
              </a>
            </router-link>
          </div>
        </div>
      </div>
      
      <div class="sidebar-footer">
        <div class="user-info" v-if="!collapsed">
          <Avatar icon="pi pi-user" size="large" shape="circle" />
          <div class="user-details">
            <span class="user-name">Admin</span>
            <small class="user-role">Administrator</small>
          </div>
        </div>
        <Avatar v-else icon="pi pi-user" size="large" shape="circle" />
      </div>
    </aside>
</template>
  
<script setup>
import { defineProps } from 'vue';
import menuItems from './MenuItems';
  
const props = defineProps({
    collapsed: {
    type: Boolean,
    default: false
    }
});
</script>

<style scoped>
.sidebar {
    width: 250px;
    background: linear-gradient(135deg, #36334d 0%, #2b2b3d 100%);
    color: #fff;
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
    overflow: hidden;
    z-index: 1000;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar-header {
    padding: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    height: 64px;
}

.logo-container {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.logo {
    height: 50px;
    transition: all 0.3s ease;
    border-radius: 10px;
}

.logo-small {
    height: 30px;
    max-width: 30px;
    border-radius: 5px;
}

.sidebar-content {
    flex: 1;
    overflow-y: auto;
    padding: 1rem 0;
}

.menu {
    list-style: none;
    padding: 0;
    margin: 0;
}

.menu-item {
    margin-bottom: 0.25rem;
}

.menu-item a {
    display: flex;
    align-items: center;
    padding: 0.75rem 1.5rem;
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: all 0.2s ease;
    position: relative;
    cursor: pointer;
    white-space: nowrap;
}

.menu-item a:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
}

.menu-item i {
    margin-right: 1rem;
    font-size: 1.2rem;
    width: 1.2rem;
    text-align: center;
}

.active-route {
    background: rgba(255, 255, 255, 0.15);
    color: #fff !important;
    font-weight: 500;
}

.active-indicator {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: #2196F3;
    
}

.sidebar-footer {
    padding: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: center;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.user-details {
    display: flex;
    flex-direction: column;
}

.user-name {
    font-weight: 500;
}

.user-role {
    opacity: 0.7;
    font-size: 0.8rem;
}


</style>