<template>
  <DefaultLayout icon="sliders-h">
    <template #header>Ustawienia</template>
    <Box @save="save">
      <div class="setting">
        <label for="API_IP">API IP</label>
        <input
          v-model.trim="apiIp"
          name="API_IP"
          type="text"
          placeholder="ip:port"
          size="1"
        >
      </div>
      <div class="setting">
        <label for="LIGHTS_UPDATE_INTERVAL">Odświeżanie świateł</label>
        <input
          v-model.trim="lightsUpdateInterval"
          name="LIGHTS_UPDATE_INTERVAL"
          type="text"
          placeholder="ms"
          size="1"
        >
      </div>
      <div class="setting">
        <label for="THERMOMETERS_UPDATE_INTERVAL">Odświeżanie termometrów</label>
        <input
          v-model.trim="thermometersUpdateInterval"
          name="THERMOMETERS_UPDATE_INTERVAL"
          type="text"
          placeholder="ms"
          size="1"
        >
      </div>
      <template #button>Zapisz</template>
    </Box>
  </DefaultLayout>
</template>

<script>
import DefaultLayout from '@/components/DefaultLayout.vue';
import Box from '@/components/Box.vue';
import store from '@/store.js';

export default {
  name: 'Dashboard',
  components: {
    DefaultLayout,
    Box,
  },
  data() {
    return {
      apiIp: store.state.API_IP,
      lightsUpdateInterval: store.state.LIGHTS_UPDATE_INTERVAL,
      thermometersUpdateInterval: store.state.THERMOMETERS_UPDATE_INTERVAL,
    };
  },
  methods: {
    save() {
      store.set('API_IP', this.apiIp);
      store.set('LIGHTS_UPDATE_INTERVAL', this.lightsUpdateInterval);
      store.set('THERMOMETERS_UPDATE_INTERVAL', this.thermometersUpdateInterval);
      this.$emit('showNotification', { type: 'success', title: 'Zapisano!', message: '' });
    },
  },
};

</script>

<style scoped lang="stylus">
.setting input
  font-family inherit
  font-size 1rem
  color cTextGray
  text-align center
  width 100%
  max-width 16rem
  padding 0.2rem

.setting label
  font-size 1rem
  flex 1
  font-weight bold
  margin-bottom 0.5rem
  @media desktop
    padding-right 1rem
    margin-bottom 0

.setting
  padding 0.5rem
  display flex
  flex-direction: column;
  align-items center
  @media desktop
    flex-direction: row;
</style>
