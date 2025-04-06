import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './index.css';

import { setupMockData } from './utils/mockData';
setupMockData();

const app = createApp(App);
app.use(router);
app.mount('#app');