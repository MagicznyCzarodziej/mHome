<template>
  <div class="header">
    <Icon class="header__icon" v-if="icon" :icon="icon"></Icon>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Header',
  props: [
    'icon',
  ],
};
</script>

<style scoped lang="stylus">
.header
  color cTextLight
  font-family inherit
  font-weight bold
  font-size 1.6rem
  background-color cAccent
  padding 0.8rem 2rem
.header__icon
  margin-right 0.8rem
</style>
