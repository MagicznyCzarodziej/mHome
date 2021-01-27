<template>
  <div class="topbar">
    <div class="header">
      <span class="app-name">mHome</span>
      <span class="breadcrumbs"> {{ $route.meta.breadcrumbs }}</span>
    </div>
    <div class="buttons">
      <router-link to="security"><ShieldOutlineIcon /></router-link>
      <router-link to="settings"><CogIcon /></router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ShieldOutlineIcon from "vue-material-design-icons/ShieldOutline.vue";
import CogIcon from "vue-material-design-icons/Cog.vue";

export default {
  name: "TopBar",
  components: {
    ShieldOutlineIcon,
    CogIcon,
  },
  data: () => ({}),
};
</script>

<style lang="stylus" scoped>
.topbar
  display flex
  justify-content space-between
  align-items center
  margin 0 1rem
  padding-left 1rem
  height 70px
  border-bottom 1px solid cGray800
  noSelect()

.header
  font-size 1.5rem

.app-name
  color cGreen500

.breadcrumbs
  color cGray600

.buttons
  display flex

  a
    display block
    padding 1rem
    width 100%
    height 100%
    color cGray500

  .router-link-active
    color cGreen500
</style>
