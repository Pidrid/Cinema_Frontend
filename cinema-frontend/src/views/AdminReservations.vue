<template>
  <div class="container py-4">
    <h2 class="mb-4">Lista rezerwacji</h2>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Użytkownik</th>
          <th>Film</th>
          <th>Seans</th>
          <th>Miejsca</th>
          <th>Akcje</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="res in reservations" :key="res.id">
          <td>{{ res.userName }}</td>
          <td>{{ res.filmTitle }}</td>
          <td>{{ res.datetime }}</td>
          <td>{{ res.seats.join(', ') }}</td>
          <td>
            <button class="btn btn-sm btn-danger">Usuń</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'AdminReservations',
  data() {
    return {
      reservations: []
    };
  },
  mounted() {
    // Załaduj dane rezerwacji z API
  }
}
</script>