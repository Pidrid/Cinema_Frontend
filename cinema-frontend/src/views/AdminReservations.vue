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
            <th @click="sortBy('userEmail')" style="cursor: pointer">
              Użytkownik
              <span v-if="sortColumn === 'userEmail'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
            </th>
            <th @click="sortBy('filmName')" style="cursor: pointer">
              Film
              <span v-if="sortColumn === 'filmName'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
            </th>
            <th @click="sortBy('screeningDateTime')" style="cursor: pointer">
              Seans
              <span v-if="sortColumn === 'screeningDateTime'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
            </th>
            <th>Miejsca</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="res in filteredReservations" :key="res.reservationId">
            <td>{{ res.userEmail || '-' }}</td>
            <td>{{ res.filmName || '-' }}</td>
            <td>{{ formatDateTime(res.screeningDateTime) }}</td>
            <td>
              <span v-if="Array.isArray(res.seats)">
                {{ res.seats.map(seat => `R${seat.row}C${seat.column}`).join(', ') }}
              </span>
              <span v-else>-</span>
            </td>
            <td>
              <button class="btn btn-sm btn-danger" @click="deleteReservation(res.reservationId)">
                Usuń
              </button>
            </td>
          </tr>
          <tr v-if="filteredReservations.length === 0">
            <td colspan="5" class="text-center">Brak wyników</td>
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
      sortColumn: 'screeningDateTime',
      sortDirection: 'asc',
    };
  },
  computed: {
    filteredReservations() {
      const filterText = this.filter.toLowerCase();
      let result = this.reservations.filter(r =>
        (r.userEmail && r.userEmail.toLowerCase().includes(filterText)) ||
        (r.filmName && r.filmName.toLowerCase().includes(filterText))
      );

      result.sort((a, b) => {
        let aVal = a[this.sortColumn];
        let bVal = b[this.sortColumn];

        if (aVal == null) aVal = '';
        if (bVal == null) bVal = '';

        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();

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
        const resResponse = await axios.get('/api/reservations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.reservations = resResponse.data;
      } catch (error) {
        console.error('Błąd podczas pobierania rezerwacji:', error);
      } finally {
        this.loading = false;
      }
    },
    formatDateTime(dateStr) {
      if (!dateStr) return '-';
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      };
      return new Date(dateStr).toLocaleString('pl-PL', options);
    },
    async deleteReservation(id) {
      if (!confirm('Czy na pewno chcesz usunąć tę rezerwację?')) return;

      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/reservations/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        await this.fetchReservations();
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
  user-select: none;
}
</style>
