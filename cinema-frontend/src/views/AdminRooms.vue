<template>
  <div class="container py-4">
    <h2 class="mb-4">Zarządzanie salami</h2>

    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Ładowanie...</span>
      </div>
    </div>

    <div v-else>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Nazwa</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="room in rooms" :key="room.roomId">
            <td>{{ room.name }}</td>
            <td>
              <button class="btn btn-sm btn-primary me-2" @click="editRoom(room)">Edytuj</button>
              <button class="btn btn-sm btn-danger" @click="deleteRoom(room.roomId)">Usuń</button>
            </td>
          </tr>
        </tbody>
      </table>

      <button class="btn btn-success mt-3" @click="showModal = true">Dodaj nową salę</button>
    </div>

    <div class="modal fade" tabindex="-1" :class="{ show: showModal }" style="display: block" v-if="showModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? 'Edytuj salę' : 'Dodaj salę' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Nazwa sali</label>
              <input v-model="form.name" class="form-control" />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeModal">Anuluj</button>
            <button class="btn btn-primary" @click="saveRoom">Zapisz</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AdminRooms',
  data() {
    return {
      rooms: [],
      loading: true,
      showModal: false,
      isEditing: false,
      form: {
        roomId: null,
        name: ''
      }
    };
  },
  methods: {
    async fetchRooms() {
      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/rooms', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.rooms = response.data;
      } catch (err) {
        console.error('Błąd podczas ładowania sal:', err);
      } finally {
        this.loading = false;
      }
    },
    closeModal() {
      this.showModal = false;
      this.isEditing = false;
      this.form = { roomId: null, name: '' };
    },
    editRoom(room) {
      this.form = { ...room };
      this.isEditing = true;
      this.showModal = true;
    },
    async saveRoom() {
      const token = localStorage.getItem('token');
      try {
        if (this.isEditing) {
          await axios.put(`/api/rooms/${this.form.roomId}`, this.form, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else {
          await axios.post('/api/rooms', this.form, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
        this.closeModal();
        this.fetchRooms();
      } catch (err) {
        console.error('Błąd podczas zapisu sali:', err);
      }
    },
    async deleteRoom(roomId) {
      const confirmed = confirm('Czy na pewno chcesz usunąć tę salę?');
      if (!confirmed) return;

      const token = localStorage.getItem('token');
      try {
        await axios.delete(`/api/rooms/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.fetchRooms();
      } catch (err) {
        console.error('Błąd podczas usuwania sali:', err);
      }
    }
  },
  mounted() {
    this.fetchRooms();
  }
};
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
}
.modal.show {
  display: block;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
