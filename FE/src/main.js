import { createApp } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSignOutAlt,faBan,faEdit, faTrash, faCheckCircle, faEye, faEyeSlash, faLocationDot, faHeart, faCalendar, faUser, faPlus, faCircleInfo, faX, faCloudArrowUp, faComments} from '@fortawesome/free-solid-svg-icons';

import App from './App.vue'
import router from './router';
import store from '../store';
import 'bootstrap/dist/css/bootstrap.css'; 
import 'bootstrap'; // 引入 Bootstrap 的 JavaScript
import './styles/global.css';
import VueAwesomePaginate from "vue-awesome-paginate";
import "vue-awesome-paginate/dist/style.css";

library.add(faSignOutAlt,faBan, faEdit, faTrash, faCheckCircle, faEye, faEyeSlash, faLocationDot, faHeart, faCalendar, faUser, faPlus, faCircleInfo, faX, faCloudArrowUp, faComments); 

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(router);
app.use(store);
app.use(VueAwesomePaginate);
app.mount('#app')
