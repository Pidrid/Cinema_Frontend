<template>
  <div>
    <h1>Filmy</h1>
    <ul>
      <li v-for="f in films" :key="f.id">
        <router-link :to="`/films/${f.id}/screenings`">{{ f.name }}</router-link>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  computed: {
    films() { return this.$store.state.films; }
  },
  created() {
    this.$store.dispatch('fetchFilms');
  }
};
</script>