<template>
  <DefaultLayout icon="thermometer-half">
  <template #header>Temperatury</template>
    <Box>
      <div v-for="(temp) of temps" :key="temp.element">{{ `${temp.description}: ${temp.value}&deg;C` }}</div>
    </Box>
  </DefaultLayout>
</template>

<script>
import DefaultLayout from '@/components/DefaultLayout.vue';
import Header from '@/components/Header.vue';
import Box from '@/components/Box.vue';

export default {
  components: {
    DefaultLayout,
    Header,
    Box,
  },
  data() {
    return {
      temps: [
        {
          element: 0,
          description: 'Wewnątrz',
          value: '-',
        },
        {
          element: 1,
          description: 'Zewnątrz',
          value: '-',
        },
      ],
    }
  },
  sockets: {
    'thermometer/update': function (data) {
      this.temps = this.temps.map((temp) => {
        if (temp.element === data.element) temp.value = data.value;
        return temp;
      });
    }
  },
  mounted() {
    this.$socket.emit('thermometer/request', {
      element: 'THERMOMETER_000',
    });
    this.$socket.emit('thermometer/request', {
      element: 'THERMOMETER_001',
    });
  },
  methods: {

  },
};
</script>
