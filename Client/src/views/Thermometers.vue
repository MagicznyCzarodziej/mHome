<template>
  <DefaultLayout>
    <template #topbar>
      <TopBar />
    </template>
    <div class="thermometers">
      <div
        v-for="thermometer in thermometers"
        class="thermometer"
        :class="{
          'temperature--low': thermometer.latestTemperature < 20,
          'temperature--medium':
            thermometer.latestTemperature >= 20 &&
            thermometer.latestTemperature < 25,
          'temperature--high': thermometer.latestTemperature >= 25,
        }"
      >
        <div class="thermometer__label">{{ thermometer.name }}</div>
        <div class="thermometer__value">
          {{ thermometer.latestTemperature }}&deg;C
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DefaultLayout from "components/DefaultLayout.vue";
import TopBar from "components/TopBar.vue";
import { getAllThermometers } from "services/api";

export default {
  name: "Thermometers",
  components: {
    DefaultLayout,
    TopBar,
  },
  data() {
    return {
      thermometers: [],
    };
  },
  created: async function () {
    this.thermometers = await getAllThermometers();
  },
};
</script>

<style lang="stylus" scoped>
.thermometers
  padding 0 1rem

.thermometer
  display flex
  justify-content space-between
  align-items center
  padding 0.5rem 1rem
  min-height 2.5rem
  border-bottom 1px solid cGray800
  font-size 1.2rem

  &__label
    color cGray500

.temperature
  text-shadow 0 0 2px @color

  &--low
    color cBlue500

  &--medium
    color cGreen500

  &--high
    color cRed300
</style>
