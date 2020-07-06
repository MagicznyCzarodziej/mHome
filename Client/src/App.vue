<template>
  <div id="app">
    <Sidebar class="sidebar" v-if="this.isDesktop" />
    <router-view class="router__view " @showNotification="showNotification" />
    <Notification class="notification" v-if="notification" :notification="notification" />
    <MobileMenu class="mobile__menu" v-if="!this.isDesktop" />
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue';
import MobileMenu from '@/components/MobileMenu.vue';
import Notification from '@/components/Notification.vue';

export default {
  components: {
    Sidebar,
    MobileMenu,
    Notification,
  },
  mounted() {
    window.addEventListener('resize', this.handleResizing);
    this.handleResizing();
  },
  data() {
    return {
      isDesktop: false,
      notification: null,
    };
  },
  methods: {
    handleResizing() {
      this.isDesktop = (window.innerWidth >= 800);
    },
    showNotification(notification) {
      this.notification = notification;
      setTimeout(() => {
        this.notification = null;
      }, 2000);
    },
  },
};
</script>

<style lang="stylus">
@font-face
  font-family Raleway
  src url('~@/assets/fonts/Raleway/Raleway-ExtraLight.ttf')
  font-weight 200

@font-face
  font-family Raleway
  src url('~@/assets/fonts/Raleway/Raleway-Medium.ttf')
  font-weight bold
*
  user-select none
  margin 0
  padding 0
  box-sizing border-box

html
  font-size 20px
  font-family 'Raleway', sans-serif
  height 100%
  -webkit-tap-highlight-color: transparent;

body
  height 100%
  background-color cBase

#app
  height 100%
  display grid
  grid-template-rows 1fr auto auto
  grid-template-areas 'routerView'\
                      'notification'\
                      'mobileMenu'

.router__view
  grid-area routerView
  overflow hidden
.sidebar
  grid-area sidebar
.notification
  grid-area notification
@media desktop
  #app
    grid-template-columns 12rem auto
    grid-template-rows 1fr auto
    grid-template-areas 'sidebar routerView'\
                        'sidebar notification'

</style>
