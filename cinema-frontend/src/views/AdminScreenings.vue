<template>
  <div class="container mt-5">
    <h2 class="mb-4">Lista seansów</h2>

    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Ładowanie...</span>
      </div>
    </div>

    <div v-else-if="screenings.length === 0" class="alert alert-info">
      Brak dostępnych seansów.
    </div>

    <table v-else class="table table-striped">
      <thead>
        <tr>
          <th>Film</th>
          <th>Sala</th>
          <th>Data i godzina</th>
          <th>Akcje</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="screening in screenings" :key="screening.screeningId">
          <td>{{ screening.filmName }}</td>
          <td>{{ screening.roomName }}</td>
          <td>{{ formatDateTime(screening.dateTime) }}</td>
          <td>
            <button class="btn btn-sm btn-outline-primary me-2" @click="editScreening(screening)">Edytuj</button>
            <button class="btn btn-sm btn-outline-danger" @click="deleteScreening(screening.screeningId)">Usuń</button>
          </td>
        </tr>
      </tbody>
    </table>

    <button class="btn btn-success mt-3" @click="showModal = true">Dodaj nowy seans</button>

    <div class="modal fade" tabindex="-1" :class="{ show: showModal }" style="display: block" v-if="showModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? 'Edytuj' : 'Dodaj' }} seans</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Film</label>
              <input v-model="filmSearch" class="form-control" placeholder="Wyszukaj film...">
              <select v-model="form.filmId" class="form-select mt-2">
                <option v-for="film in filteredFilms" :key="film.filmId" :value="film.filmId">
                  {{ film.name }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Sala</label>
              <select v-model="form.roomId" class="form-select">
                <option v-for="room in rooms" :key="room.roomId" :value="room.roomId">
                  {{ room.name }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Data i godzina</label>
              <input v-model="form.dateTime" type="datetime-local" class="form-control">
            </div>

            <div class="mb-3">
              <label class="form-label">Cena</label>
              <input v-model="form.price" type="number" class="form-control">
            </div>

            <div class="mb-3">
              <label class="form-label">Język</label>
              <input v-model="form.language" class="form-control">
            </div>

            <div class="mb-3">
              <label class="form-label">Napisy</label>
                <input v-model="form.subtitles" type="text" class="form-control">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeModal">Anuluj</button>
            <button class="btn btn-primary" @click="saveScreening">Zapisz</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AdminScreenings',
  data() {
    return {
      screenings: [],
      films: [],
      rooms: [],
      filmSearch: '',
      showModal: false,
      isEditing: false,
      form: {
        screeningId: null,
        filmId: '',
        roomId: '',
        dateTime: '',
        price: '',
        language: '',
        subtitles: ''
      },
      loading: true
    };
  },
  computed: {
    filteredFilms() {
      return this.films.filter(f => f.name.toLowerCase().includes(this.filmSearch.toLowerCase()));
    }
  },
  methods: {
    async fetchScreenings() {
      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/screenings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.screenings = res.data;
      } catch (error) {
        console.error('Błąd podczas ładowania seansów:', error);
      } finally {
        this.loading = false;
      }
    },
    async fetchFilmsAndRooms() {
      try {
        const token = localStorage.getItem('token');
        const [filmsRes, roomsRes] = await Promise.all([
          axios.get('/api/films', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/rooms', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        this.films = filmsRes.data;
        this.rooms = roomsRes.data;
      } catch (error) {
        console.error('Błąd przy ładowaniu filmów i sal:', error);
      }
    },
    formatDateTime(dateTime) {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateTime).toLocaleDateString('pl-PL', options);
    },
    closeModal() {
      this.showModal = false;
      this.isEditing = false;
      this.filmSearch = '';
      this.form = {
        screeningId: null,
        filmId: '',
        roomId: '',
        dateTime: '',
        price: '',
        language: '',
        subtitles: ''
      };
    },
    editScreening(screening) {
      this.form = { ...screening };
      this.showModal = true;
      this.isEditing = true;
    },
    async saveScreening() {
      const token = localStorage.getItem('token');
      try {
        if (this.isEditing) {
          await axios.put(`/api/screenings/${this.form.screeningId}`, this.form, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else {
          await axios.post('/api/screenings', this.form, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
        this.closeModal();
        this.fetchScreenings();
      } catch (error) {
        console.error('Błąd przy zapisie seansu:', error);
      }
    },
    async deleteScreening(id) {
      const confirmed = confirm('Czy na pewno chcesz usunąć ten seans?');
      if (!confirmed) return;

      const token = localStorage.getItem('token');
      try {
        await axios.delete(`/api/screenings/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.fetchScreenings();
      } catch (error) {
        console.error('Błąd przy usuwaniu seansu:', error);
      }
    }
  },
  mounted() {
    this.fetchScreenings();
    this.fetchFilmsAndRooms();
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