<template>
  <div class="notification" :class="notification.type">
    <Icon
      class="notification__icon"
      :icon="notification.type === 'error' ? 'exclamation-triangle' : 'check'"
    />
    <b>{{ notification.title }}</b> {{ notification.message }}
  </div>
</template>

<script>
export default {
  name: 'Notification',
  props: ['notification'],
};
</script>

<style scoped lang='stylus'>
.notification
  text-align center
  padding 0.5rem 1rem
  color cTextLight
.notification__icon
  margin-right 1rem
.error
  background-color cError
.success
  background-color cSuccess
</style>
