<template>
  <MainLayout />
</template>


<script>
import MainLayout from './layouts/MainLayout.vue';

export default {
  name: 'App',
  components: { MainLayout }
}
</script>

<style>
html, body {
  background-color: #f8f9fa;
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>