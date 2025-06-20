<template>
  <div>
    <h2>Seans dla filmu {{ filmId }}</h2>
    <ul>
      <li v-for="s in screenings" :key="s.screeningId">
        <router-link :to="`/reservations/${s.screeningId}`">
          {{ new Date(s.dateTime).toLocaleString() }} – {{ s.price }} zł
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  data: () => ({ screenings: [] }),
  computed: {
    filmId() { return this.$route.params.filmId; }
  },
  async created() {
    const { data } = await axios.get(`/api/screenings/by-film/${this.filmId}`);
    this.screenings = data;
  }
};
</script>