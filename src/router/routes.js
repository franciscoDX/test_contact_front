import ContactList from "@/pages/contact/pages/ContactList.vue";

const routes = [
      { 
        path: "/", 
        component: ContactList, 
        meta: { layout: "default" },
        name: "contacts.list"
    },
    
    // Formulário para criar novo contato
    { 
        path: "/new", 
        component: () => import("@/pages/contact/pages/ContactFormPage.vue"), 
        meta: { layout: "default" },
        name: "contacts.create"
    },
    
    // Formulário para editar contato existente
    { 
        path: "/edit/:id", 
        component: () => import("@/pages/contact/pages/ContactFormPage.vue"), 
        meta: { layout: "default" },
        name: "contacts.edit",
        props: true // Permite que o :id seja passado como prop
    },
    
    // Página de detalhes do contato (opcional - se quiseres uma página separada)
    { 
        path: "/:id", 
        component: () => import("@/pages/contact/pages/ContactDetailPage.vue"), 
        meta: { layout: "default" },
        name: "contacts.view",
        props: true
    }
];
  
export default routes
  