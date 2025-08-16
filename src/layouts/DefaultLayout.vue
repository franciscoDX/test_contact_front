<template>
  <div class="layout-wrapper" :class="{ 'sidebar-collapsed': collapsed, 'sidebar-mobile-active': mobileActive }">
    <!-- Sidebar -->
    <TheSidebar :collapsed="collapsed" />

    <!-- Main Content Wrapper -->
    <div class="main-wrapper">
      <!-- Navbar -->
      <TheNavbar 
        :collapsed="collapsed" 
        :page-title="pageTitle" 
        @toggle-sidebar="toggleSidebar"
        @toggle-mobile="toggleMobileSidebar"
      />

      <!-- Main Content -->
      <main class="main-content">
        <slot></slot>
      </main>

      <!-- Footer -->
      <TheFooter />
    </div>
    
    <!-- Overlay for mobile -->
    <div class="sidebar-overlay" v-if="mobileActive" @click="closeMobileSidebar"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import TheSidebar from './components/Sidebar.vue';
import TheNavbar from './components/Navbar.vue';
import TheFooter from './components/Footer.vue';

// Props
const props = defineProps({
  pageTitle: {
    type: String,
    default: 'Dashboard'
  }
});

// State
const collapsed = ref(false);
const mobileActive = ref(false);
const windowWidth = ref(window.innerWidth);

// Methods
const toggleSidebar = () => {
  collapsed.value = !collapsed.value;
  localStorage.setItem('sidebarCollapsed', collapsed.value);
};

const toggleMobileSidebar = () => {
  mobileActive.value = !mobileActive.value;
};

const closeMobileSidebar = () => {
  mobileActive.value = false;
};

const handleResize = () => {
  windowWidth.value = window.innerWidth;
  if (windowWidth.value > 768) {
    mobileActive.value = false;
  }
};

// Lifecycle hooks
onMounted(() => {
  // Check localStorage for saved preference
  const savedState = localStorage.getItem('sidebarCollapsed');
  if (savedState !== null) {
    collapsed.value = savedState === 'true';
  } else {
    collapsed.value = windowWidth.value <= 1024;
  }
  
  // Add resize event listener
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.layout-wrapper {
  display: flex;
  min-height: 100vh;
  position: relative;
}

/* Sidebar Styles */
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

.sidebar-collapsed .sidebar {
  width: 70px;
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
  height: 40px;
  transition: all 0.3s ease;
}

.logo-small {
  height: 30px;
  max-width: 30px;
}

.toggle-button {
  color: #666 !important;
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

.sidebar-collapsed .menu-item i {
  margin-right: 0;
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
  border-radius: 0 2px 2px 0;
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

/* Main Content Styles */
.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #f5f7fa;
}

/* Navbar Styles */
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

/* Main Content Styles */
.main-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

/* Footer Styles */
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

/* Mobile Styles */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.mobile-only {
  display: none;
}

.mr-2 {
  margin-right: 0.5rem;
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: -250px;
    top: 0;
    bottom: 0;
    transition: left 0.3s ease;
  }
  
  .sidebar-mobile-active .sidebar {
    left: 0;
  }
  
  .mobile-only {
    display: block;
  }
  
  .desktop-only {
    display: none;
  }
  
  .page-title {
    font-size: 1.1rem;
  }
  
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