<template>
  <div class="menu">
    <router-link class="menu__item" to="/favourites">
      <StarOutlineIcon size="1.7rem" />
    </router-link>
    <router-link class="menu__item" to="/">
      <ViewGridIcon size="1.7rem" />
    </router-link>
    <router-link class="menu__item" to="/thermometers">
      <ThermometerLowIcon size="1.7rem" />
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ViewGridIcon from "vue-material-design-icons/ViewGrid.vue";
import ThermometerLowIcon from "vue-material-design-icons/ThermometerLow.vue";
import StarOutlineIcon from "vue-material-design-icons/Star.vue";

export default {
  name: "BottomMenu",
  components: { ViewGridIcon, ThermometerLowIcon, StarOutlineIcon },
  data: () => ({
    active: "DASHBOARD",
  }),
};
</script>

<style lang="stylus" scoped>
.menu
  display flex
  justify-content space-between
  align-items center
  padding 0 1rem
  height 60px
  background-color cGray800

.menu__item
  display grid
  width 100%
  height 100%
  color cGray600
  place-items center
  noSelect()

.router-link-exact-active
  color cGreen500
</style>
