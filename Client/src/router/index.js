import Vue from 'vue';
import VueRouter from 'vue-router';
import Dashboard from 'views/Dashboard.vue';
import Thermometers from 'views/Thermometers.vue';
import Group from 'views/Group.vue';
import Settings from 'views/Settings.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    exact: true,
    name: 'Dashboard',
    meta: {
      breadcrumbs: ''
    },
    component: Dashboard
  },
  {
    path: '/thermometers',
    name: 'Thermometers',
    meta: {
      breadcrumbs: ' \\ Termometry'
    },
    component: Thermometers
  },
  {
    path: '/group/:groupId',
    name: 'Group',
    meta: {
      breadcrumbs: ''
    },
    component: Group
  },
  {
    path: '/settings',
    name: 'Settings',
    meta: {
      breadcrumbs: ' \\ Ustawienia'
    },
    component: Settings
  },
  {
    path: '*',
    redirect: '/'
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
