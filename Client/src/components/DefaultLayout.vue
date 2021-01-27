<template>
  <div class="layout">
    <div class="layout__topbar">
      <slot name="topbar"></slot>
    </div>
    <div class="layout__page-content">
      <slot></slot>
    </div>
    <BottomMenu />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BottomMenu from "components/BottomMenu.vue";

export default {
  name: "DefaultLayout",
  components: { BottomMenu },
};
</script>

<style lang="stylus" scoped>
.layout
  display grid
  height 100%
  background-color cGray900
  grid-template-rows auto 1fr auto
  grid-template-columns 1fr
  grid-template-areas 'topbar' 'content' 'menu'

.layout__page-content
  overflow-y auto
  grid-area content

.layout__topbar
  grid-area topbar

.menu
  grid-area menu
</style>
