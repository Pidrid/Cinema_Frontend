<template>
  <div class="container py-4">
    <h2 class="mb-4">Zarządzanie salami</h2>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Nazwa</th>
          <th>Liczba miejsc</th>
          <th>Akcje</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="room in rooms" :key="room.id">
          <td>{{ room.name }}</td>
          <td>{{ room.capacity }}</td>
          <td>
            <button class="btn btn-sm btn-primary">Edytuj</button>
            <button class="btn btn-sm btn-danger ms-2">Usuń</button>
          </td>
        </tr>
      </tbody>
    </table>
    <button class="btn btn-success mt-3">Dodaj nową salę</button>
  </div>
</template>

<script>
export default {
  name: 'AdminRooms',
  data() {
    return {
      rooms: []
    };
  },
  mounted() {
    // Załaduj dane sal z API
  }
}
</script>
