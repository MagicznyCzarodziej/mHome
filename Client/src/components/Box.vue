<template>
  <div class="box">
    <div class="box__header" v-if="this.$slots.header">
      <slot name="header" />
    </div>
    <div class="box__content"><slot /></div>
    <div class="box__button" v-if="this.$slots.button" @click="() => this.$emit('save')">
      <slot name="button" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Box',
};
</script>

<style scoped lang="stylus">
.box
  background-color cBgBox
  box-shadow 0rem 0.4rem 0.5rem rgba(0, 0, 0, 0.18)
  &:not(:last-child)
    margin-bottom 2rem

.box__header
  color cTextDark
  font-weight bold
  padding 0.5rem 1rem
  font-size 1.3rem
  background-color: cBoxHeader
.box__content
  padding 1rem
.box__button
  color cTextLight
  font-weight bold
  padding 0.5rem
  font-size 1.3rem
  cursor pointer
  text-align center
  background-color cAccent
  transition 0.1s
  &:hover
    background-color cAccentDarker
  &:active
    background cAccentDarkest

</style>
