import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// PrimeVue Core
import PrimeVue from 'primevue/config';
import Lara from '@primeuix/themes/lara';

// PrimeVue Components
import Button from "primevue/button";
import Menu from "primevue/menu";
import Toolbar from "primevue/toolbar";
import Avatar from "primevue/avatar";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

import Dropdown from "primevue/dropdown";
import Tag from "primevue/tag";
import InputText from "primevue/inputtext";
import Tooltip from 'primevue/tooltip';
import Badge from 'primevue/badge';

// PrimeVue Services
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';

// PrimeIcons - importado separadamente
import 'primeicons/primeicons.css';


import './services/api'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// PrimeVue Config 
app.use(PrimeVue, {
    theme: {
        preset: Lara
    },
    ripple: true
});

// Servicios
app.use(ToastService);
app.use(ConfirmationService);

// Directivas
app.directive('tooltip', Tooltip);

// Registrar componentes globalmente
app.component("Button", Button);
app.component("Menu", Menu);
app.component("Toolbar", Toolbar);
app.component("Avatar", Avatar);
app.component("DataTable", DataTable);
app.component("Column", Column);

app.component("Dropdown", Dropdown);
app.component("Tag", Tag);
app.component("InputText", InputText);
app.component("Badge", Badge);

app.mount('#app')