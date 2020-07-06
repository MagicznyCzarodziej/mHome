<template>
  <div class="layout">
    <Header :icon="icon" class="header">
      <slot name="header" />
    </Header>
    <div class="main">
      <slot />
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';

export default {
  name: 'Dashboard',
  props: ['icon'],
  components: {
    Header,
  },
};
</script>

<style scoped lang="stylus">
.layout
  overflow-y auto

.main
  padding 1rem
  @media desktop
    padding 3rem
</style>
