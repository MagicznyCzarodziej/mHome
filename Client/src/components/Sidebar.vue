<template>
  <div class="sidebar">
    <div class="sidebar__header">MagicHome</div>
      <router-link class="sidebar__item" to="/">
        <Icon icon="th" />Dashboard
      </router-link>
      <router-link class="sidebar__item" to="Temperatures">
         <Icon icon="thermometer-half" />Temperatury
      </router-link>
      <router-link class="sidebar__item" to="Settings">
         <Icon icon="sliders-h" />Ustawienia
      </router-link>
    <div class="sidebar__spacer"></div>
    <Icon icon="circle" class="light-update-indicator" />
    <Icon icon="circle" class="light-switch-indicator" />
    <div class="sidebar__clock">
      {{ time }}
    </div>
  </div>
</template>

<script>

export default {
  name: 'Sidebar',
  data() {
    return {
      time: null,
      clockInterval: null,
    };
  },
  mounted() {
    this.clockInterval = setInterval(this.updateClock, 60000);
    this.updateClock();
  },
  methods: {
    updateClock() {
      this.time = new Date().toTimeString().substring(0, 5);
    },
  },
};

</script>

<style scoped lang="stylus">
.sidebar
  font-size 1.6rem
  background-color cBaseDarker
  color cTextLight
  display flex
  flex-direction column

.sidebar__header
  text-align center
  padding 0.8rem 0
  background-color cBaseDarkest
  font-weight bold
  @media desktop
    margin-bottom 1.2rem

.sidebar__item
  font-size 1rem
  color cTextLight
  text-decoration none
  padding 0.6rem 1.2rem
  cursor pointer
  border 0 solid cAccent
  transition 0.1s
  &:hover:not(.selected)
    background-color cBaseDarker

.selected
  background-color cBase
  border-left 0.4rem solid cAccent

.sidebar__item svg
  text-align center
  width 2rem !important

.sidebar__spacer
  @media desktop
    flex-grow 1

.sidebar__clock
  text-align center
  margin-bottom 1rem
  background-color cBaseDarkest
  padding 0.6rem 0

.light-update-indicator
  font-size 0.5rem
  position absolute
  left 2rem
  bottom 2.2rem
  color cAccent

.light-switch-indicator
  font-size 0.5rem
  position absolute
  left 9rem
  bottom 2.2rem
  color cYellow

// Hide on mobile
.sidebar__header
.sidebar__clock
.light-update-indicator
.light-switch-indicator
  display none;
  @media desktop
    display block
</style>
