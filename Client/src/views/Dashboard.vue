<template>
  <DefaultLayout icon="th">
    <template #header>Dashboard</template>
    <Box>
      <button @click="toggle" >{{state?'OFF':'ON'}}</button>
      
      {{ state }}
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
  data() {
    return {
      state: 0,
    }
  },
  sockets: {
    'lights/update': function (data) {
        console.log(data);
        this.state = data.value;
    },
  },

  methods: {
    on() {
      // fetch('http://192.168.100.33:3000/lights/LIGHT_000/set/ON');
      this.$socket.emit('lights/set', {
        element: 'LIGHT_000',
        state: 'ON',
      });
    },
    off() {
      // fetch('http://192.168.100.33:3000/lights/LIGHT_000/set/OFF');
      this.$socket.emit('lights/set', {
        element: 'LIGHT_000',
        state: 'OFF',
      });
    },
    toggle() {

      this.$socket.emit('lights/set', {
        element: 'LIGHT_000',
        state: this.state?'OFF':'ON',
      });
    }
  },
};
</script>
