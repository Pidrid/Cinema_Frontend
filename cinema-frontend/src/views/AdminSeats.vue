<template>
  <div class="container py-4">
    <h2 class="mb-4">Zarządzanie miejscami</h2>

    <div class="mb-3">
      <label for="roomSelect" class="form-label">Wybierz salę:</label>
      <select id="roomSelect" class="form-select" v-model="selectedRoom" @change="fetchSeats">
        <option disabled value="">-- Wybierz salę --</option>
        <option v-for="room in rooms" :key="room.roomId" :value="room.roomId">
          {{ room.name }}
        </option>
      </select>
    </div>

    <div class="row g-2 mb-3" v-if="selectedRoom">
      <div class="col">
        <input v-model="filterRow" type="number" class="form-control" placeholder="Filtruj po rzędzie" />
      </div>
      <div class="col">
        <input v-model="filterColumn" type="number" class="form-control" placeholder="Filtruj po kolumnie" />
      </div>
    </div>

    <div v-if="selectedRoom">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Rząd</th>
            <th>Kolumna</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="seat in filteredSeats" :key="seat.seatId">
            <td>{{ seat.row }}</td>
            <td>{{ seat.column }}</td>
            <td>
              <button class="btn btn-sm btn-primary me-2" @click="editSeat(seat)">Edytuj</button>
              <button class="btn btn-sm btn-danger" @click="deleteSeat(seat.seatId)">Usuń</button>
            </td>
          </tr>
        </tbody>
      </table>
      <button class="btn btn-success mt-3" @click="showModal = true">Dodaj miejsce</button>
    </div>

    <!-- Modal -->
    <div class="modal fade" tabindex="-1" :class="{ show: showModal }" style="display: block" v-if="showModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? 'Edytuj miejsce' : 'Dodaj miejsce' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Rząd</label>
              <input v-model.number="form.row" class="form-control" type="number" min="1" />
              <div v-if="form.row < 1" class="text-danger mt-1">Rząd musi być większy od zera.</div>
            </div>
            <div class="mb-3">
              <label class="form-label">Kolumna</label>
              <input v-model.number="form.column" class="form-control" type="number" min="1" />
              <div v-if="form.column < 1" class="text-danger mt-1">Kolumna musi być większa od zera.</div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeModal">Anuluj</button>
            <button class="btn btn-primary" :disabled="!isFormValid" @click="saveSeat">Zapisz</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AdminSeats',
  data() {
    return {
      rooms: [],
      seats: [],
      selectedRoom: '',
      showModal: false,
      isEditing: false,
      form: {
        seatId: null,
        row: '',
        column: ''
      },
      filterRow: '',
      filterColumn: ''
    };
  },
  computed: {
    isFormValid() {
      return this.form.row > 0 && this.form.column > 0;
    },
    filteredSeats() {
      return this.seats.filter(seat => {
        const matchRow = !this.filterRow || seat.row === Number(this.filterRow);
        const matchColumn = !this.filterColumn || seat.column === Number(this.filterColumn);
        return matchRow && matchColumn;
      });
    }
  },
  methods: {
    async fetchRooms() {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/rooms', {
        headers: { Authorization: `Bearer ${token}` }
      });
      this.rooms = res.data;
    },
    async fetchSeats() {
      if (!this.selectedRoom) return;
      const res = await axios.get(`/api/seats?roomId=${this.selectedRoom}`);
      this.seats = res.data;
    },
    closeModal() {
      this.showModal = false;
      this.isEditing = false;
      this.form = { seatId: null, row: '', column: '' };
    },
    editSeat(seat) {
      this.form = { ...seat };
      this.isEditing = true;
      this.showModal = true;
    },
    async saveSeat() {
      if (!this.isFormValid) return;
      const token = localStorage.getItem('token');
      const payload = {
        roomId: this.selectedRoom,
        row: this.form.row,
        column: this.form.column
      };

      if (this.isEditing) {
        await axios.put(`/api/seats/${this.form.seatId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('/api/seats', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      this.closeModal();
      this.fetchSeats();
    },
    async deleteSeat(id) {
      const confirmDelete = confirm('Czy na pewno chcesz usunąć to miejsce?');
      if (!confirmDelete) return;

      const token = localStorage.getItem('token');
      try {
        await axios.delete(`/api/seats/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.fetchSeats();
      } catch (err) {
        alert('Nie można usunąć miejsca: może być zarezerwowane.');
      }
    }
  },
  mounted() {
    this.fetchRooms();
  }
};
</script>

<style scoped>
.modal.show {
  display: block;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
