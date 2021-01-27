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
  padding 2rem
</style>
