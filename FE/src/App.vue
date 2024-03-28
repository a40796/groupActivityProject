<template>
  <router-view></router-view>
  <ToastComponent></ToastComponent>
</template>

<script>
import ToastComponent from './components/Toast.vue';
export default {
  name: 'App',
  components: {
    ToastComponent
  }
}
</script>

<style>
#app {
    display: flex;
    flex-direction: column;
    height: 100vh;
    font-family: HelveticaLTWXX-BoldCond;
}
</style>
