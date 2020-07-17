<template>
  <DefaultLayout icon="th">
    <template #header>Dashboard</template>
    <Box>
      <button @click="on">ON</button>
      <button @click="off">OFF</button>
    </Box>
  </DefaultLayout>
</template>

<script>
import DefaultLayout from '@/components/DefaultLayout.vue';
import Box from '@/components/Box.vue';

export default {
  name: 'Dashboard',
  components: {
    DefaultLayout,
    Box,
  },
  methods: {
    on() {
      fetch('http://192.168.100.33:3000/lights/LIGHT_000/set/ON');
    },
    off() {
      fetch('http://192.168.100.33:3000/lights/LIGHT_000/set/OFF');
    },
  },
};
</script>
