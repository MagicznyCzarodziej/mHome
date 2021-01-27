<template>
  <DefaultLayout>
    <template #topbar>
      <GroupTopBar :name="group.name" />
    </template>
    <div
      v-if="elements.thermometers && elements.thermometers.length"
      class="group-temperatures"
    >
      <div
        v-for="thermometer in elements.thermometers"
        class="temperature"
        :class="{
          'temperature--low': thermometer.latestTemperature < 20,
          'temperature--medium':
            thermometer.latestTemperature >= 20 &&
            thermometer.latestTemperature < 25,
          'temperature--high': thermometer.latestTemperature >= 25,
        }"
      >
        <div class="temperature__value">
          {{ thermometer.latestTemperature }}&deg;C
        </div>
        <div class="temperature__label">{{ thermometer.name }}</div>
      </div>
    </div>
    <div class="elements">
      <div
        v-for="element in elements.lights"
        :key="'light' + element.id"
        class="element"
      >
        <div class="element__name">{{ element.name }}</div>
        <div class="element__control" @click="toggleLight(element.id)">
          <LightbulbOnIcon
            class="light--on"
            v-if="element.state === 'ON'"
            size="2rem"
          />
          <LightbulbOffIcon class="light--off" v-else size="2rem" />
        </div>
      </div>
      <div
        v-for="element in elements.reeds"
        :key="'reed' + element.id"
        class="element"
      >
        <div class="element__name">{{ element.name }}</div>
        <div class="element__control">
          <div v-if="element.state === 'CLOSED'" class="reed--closed">
            Zamkniete
          </div>
          <div v-else class="reed--open">Otwarte</div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DefaultLayout from "components/DefaultLayout.vue";
import GroupTopBar from "components/GroupTopBar.vue";
import LightbulbOnIcon from "vue-material-design-icons/Lightbulb";
import LightbulbOffIcon from "vue-material-design-icons/LightbulbOutline";
import { getAllGroupElements, getGroupById } from "services/api";

export default {
  name: "Group",
  components: {
    DefaultLayout,
    GroupTopBar,
    LightbulbOnIcon,
    LightbulbOffIcon,
  },
  data() {
    return {
      group: {},
      elements: [],
    };
  },
  created: async function () {
    this.group = await getGroupById(this.$route.params.groupId);
    this.elements = await getAllGroupElements(this.$route.params.groupId);
  },
  sockets: {
    "lights/state": function (received) {
      this.elements.lights.find((light) => light.id === received.id).state =
        received.state;
    },
  },
  methods: {
    toggleLight(id) {
      const state =
        this.elements.lights.find((light) => light.id === id).state === "ON"
          ? "OFF"
          : "ON";
      this.$socket.emit("lights/set", {
        id,
        state,
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.elements
  padding 0 1rem

.element
  display flex
  justify-content space-between
  align-items center
  padding 1rem
  min-height 2.5rem
  border-bottom 1px solid cGray800
  font-size 1.2rem

.element__name
  color cGray500

.element__control
  .light--on
    filter drop-shadow(0 0 2px cGreen500)
    color cGreen500

  .light--off
    color cGray500

  .reed--open
    color cRed500

  .reed--closed
    color cGray500

.group-temperatures
  display flex
  justify-content space-evenly
  margin 0 1rem
  padding 1rem
  border-bottom 1px solid cGray800
  font-size 1.25rem
  gap 1rem

.temperature
  text-align center
  text-shadow 0 0 2px @color

  &__label
    margin-top 0.2rem
    color cGray400
    text-shadow none
    font-size 1rem

  &--low
    color cBlue500

  &--medium
    color cGreen500

  &--high
    color cRed300
</style>
