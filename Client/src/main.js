import Vue from 'vue';
import VueSocketIO from 'vue-socket.io';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

store.loadFromLocalStorage();

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: 'http://192.168.1.16:3000'
  })
);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
