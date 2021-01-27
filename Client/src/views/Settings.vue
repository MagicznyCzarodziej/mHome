<template>
  <DefaultLayout>
    <template #topbar>
      <TopBar />
    </template>
    <div class="settings">
      <div class="setting">
        <div class="setting__label">Adres API</div>
        <div class="setting__control">
          <input type="text" v-model="settings.apiIp" />
        </div>
      </div>
      <div class="setting">
        <div class="setting__label">Inne</div>
        <div class="setting__control">
          <input type="text" />
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DefaultLayout from "components/DefaultLayout.vue";
import TopBar from "components/TopBar.vue";

export default {
  name: "Settings",
  components: {
    DefaultLayout,
    TopBar,
  },
  data() {
    return {
      settings: {
        apiIp: "192.168.1.16:3000",
      },
    };
  },
};
</script>

<style lang="stylus" scoped>
.settings
  padding 1rem

.setting
  display grid
  padding 1rem
  border-bottom 1px solid cGray800
  font-size 1.2rem
  grid-template-columns 50% 50%

.setting__control
  input
    position relative
    padding 0
    max-width 100%
    border none
    background-color transparent
    color cGray500
    text-align right
    font-size 1.2rem

    &:focus
      outline none
      color cGray300
</style>
