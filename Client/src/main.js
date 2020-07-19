import Vue from 'vue';
import VueSocketIO from 'vue-socket.io';

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

Vue.use(new VueSocketIO({
  debug: true,
  connection: 'http://192.168.100.33:3000',
}));

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
