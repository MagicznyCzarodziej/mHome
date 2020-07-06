<template>
  <div class="mobile-menu">
    <router-link class="mobile-menu__item" to="/">
      <Icon icon="th" />
    </router-link>
    <router-link class="mobile-menu__item" to="Temperatures">
        <Icon icon="thermometer-half" />
    </router-link>
    <router-link class="mobile-menu__item" to="Settings">
        <Icon icon="sliders-h" />
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'MobileMenu',
};
</script>

<style scoped lang="stylus">
.mobile-menu
  font-family Raleway
  background-color cBaseDarker
  display flex
  flex-direction row
.mobile-menu__item
  text-align center
  flex 1
  font-size 1rem
  color cTextLight
  text-decoration none
  padding 0.6rem 1.2rem
  transition 0.3s
.selected
  color cAccent
</style>
