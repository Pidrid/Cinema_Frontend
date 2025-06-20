<template>
  <div class="container py-4">
    <h2 class="mb-4">Lista rezerwacji</h2>

    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Ładowanie...</span>
      </div>
    </div>

    <div v-else>
      <div class="mb-3 row g-2">
        <div class="col-md-6">
          <input
            v-model="filter"
            class="form-control"
            placeholder="Szukaj po nazwie użytkownika lub filmu..."
          />
        </div>
      </div>

      <table class="table table-striped">
        <thead>
          <tr>
            <th @click="sortBy('userName')" style="cursor: pointer">
              Użytkownik
              <span v-if="sortColumn === 'userName'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
            </th>
            <th @click="sortBy('filmTitle')" style="cursor: pointer">
              Film
              <span v-if="sortColumn === 'filmTitle'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
            </th>
            <th @click="sortBy('datetime')" style="cursor: pointer">
              Seans
              <span v-if="sortColumn === 'datetime'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
            </th>
            <th>Miejsca</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="res in filteredReservations" :key="res.id">
            <td>{{ res.userName }}</td>
            <td>{{ res.filmTitle }}</td>
            <td>{{ formatDateTime(res.datetime) }}</td>
            <td>{{ res.seats.join(', ') }}</td>
            <td>
              <button class="btn btn-sm btn-danger" @click="deleteReservation(res.id)">
                Usuń
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AdminReservations',
  data() {
    return {
      reservations: [],
      loading: true,
      filter: '',
      sortColumn: 'datetime',
      sortDirection: 'asc'
    };
  },
  computed: {
    filteredReservations() {
      let result = this.reservations.filter(r =>
        r.userName.toLowerCase().includes(this.filter.toLowerCase()) ||
        r.filmTitle.toLowerCase().includes(this.filter.toLowerCase())
      );

      result.sort((a, b) => {
        let aVal = a[this.sortColumn];
        let bVal = b[this.sortColumn];

        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }

        if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });

      return result;
    }
  },
  methods: {
    sortBy(column) {
      if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortColumn = column;
        this.sortDirection = 'asc';
      }
    },
    async fetchReservations() {
      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/reservations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.reservations = response.data;
      } catch (error) {
        console.error('Błąd podczas pobierania rezerwacji:', error);
      } finally {
        this.loading = false;
      }
    },
    formatDateTime(dateStr) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
      return new Date(dateStr).toLocaleString('pl-PL', options);
    },
    async deleteReservation(id) {
      if (!confirm('Czy na pewno chcesz usunąć tę rezerwację?')) return;

      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/reservations/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.fetchReservations();
      } catch (error) {
        console.error('Błąd podczas usuwania rezerwacji:', error);
      }
    }
  },
  mounted() {
    this.fetchReservations();
  }
};
</script>

<style scoped>
.table th {
  vertical-align: middle;
}
</style>
