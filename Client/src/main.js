import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faTh,
  faThermometerHalf,
  faSlidersH,
  faCircle,
  faCheck,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

library.add(faTh, faThermometerHalf, faSlidersH,
  faCircle, faCheck, faExclamationTriangle);

Vue.component('Icon', FontAwesomeIcon);

Vue.config.productionTip = false;

store.loadFromLocalStorage();

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
