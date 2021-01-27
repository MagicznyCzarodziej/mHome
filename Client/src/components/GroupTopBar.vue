<template>
  <div class="topbar">
    <div class="group-name">{{ name }}</div>
    <div class="group-icon">
      <LivingRoomIcon size="10vw" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LivingRoomIcon from "vue-material-design-icons/BedKingOutline.vue";

export default {
  name: "GroupTopBar",
  components: { LivingRoomIcon },
  props: ["name"],
  data: () => ({}),
};
</script>

<style lang="stylus" scoped>
.topbar
  display flex
  justify-content space-between
  align-items center
  margin 0 1rem
  padding 0 1rem
  height 70px
  border-bottom 1px solid cGray800
  noSelect()

  @media desktop
    display none

.group-icon
  color cGreen500
  color cGray500

.group-name
  color cGray200
  font-size 1.75rem
</style>
