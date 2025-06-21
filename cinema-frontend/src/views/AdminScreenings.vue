<template>
  <div class="container mt-5">
    <h2 class="mb-4">Lista seansów</h2>

    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Ładowanie...</span>
      </div>
    </div>

    <div v-else>
      <div class="mb-4">
        <h4>Filtruj</h4>
        <div class="row g-2">
          <div class="col-md-4">
            <input v-model="filters.name" class="form-control" placeholder="Nazwa filmu lub sali...">
          </div>
          <div class="col-md-4">
            <input v-model="filters.date" type="date" class="form-control">
          </div>
          <div class="col-md-4">
            <button class="btn btn-success" @click="showModal = true">Dodaj nowy seans</button>
          </div>
        </div>
      </div>

      <h4>Przyszłe seanse</h4>
      <table class="table table-striped">
        <thead>
          <tr>
            <th @click="sortBy('filmName')" style="cursor: pointer">
              Film
              <span v-if="sortColumn === 'filmName'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
            </th>
            <th @click="sortBy('roomName')" style="cursor: pointer">
              Sala
              <span v-if="sortColumn === 'roomName'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
            </th>
            <th @click="sortBy('dateTime')" style="cursor: pointer">
              Data i godzina
              <span v-if="sortColumn === 'dateTime'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
            </th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="screening in filteredFutureScreenings" :key="screening.screeningId">
            <td>{{ screening.filmName }}</td>
            <td>{{ screening.roomName }}</td>
            <td>{{ formatDateTime(screening.dateTime) }}</td>
            <td>
              <button class="btn btn-sm btn-outline-primary me-2" @click="editScreening(screening)">Edytuj</button>
              <button class="btn btn-sm btn-outline-danger" @click="deleteScreening(screening.screeningId)">Usuń</button>
              <button class="btn btn-sm btn-outline-info" @click="openSeatMap(screening)">Pokaż miejsca</button>
            </td>
          </tr>
        </tbody>
      </table>

      <h4 class="mt-5">Przeszłe seanse</h4>
      <table class="table table-striped">
        <thead>
          <tr>
            <th @click="sortBy('filmName')" style="cursor: pointer">
              Film
              <span v-if="sortColumn === 'filmName'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
            </th>
            <th @click="sortBy('roomName')" style="cursor: pointer">
              Sala
              <span v-if="sortColumn === 'roomName'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
            </th>
            <th @click="sortBy('dateTime')" style="cursor: pointer">
              Data i godzina
              <span v-if="sortColumn === 'dateTime'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
            </th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="screening in filteredPastScreenings" :key="screening.screeningId">
            <td>{{ screening.filmName }}</td>
            <td>{{ screening.roomName }}</td>
            <td>{{ formatDateTime(screening.dateTime) }}</td>
            <td>
              <button class="btn btn-sm btn-outline-primary me-2" @click="editScreening(screening)">Edytuj</button>
              <button class="btn btn-sm btn-outline-danger" @click="deleteScreening(screening.screeningId)">Usuń</button>
              <button class="btn btn-sm btn-outline-info" @click="openSeatMap(screening)">Pokaż miejsca</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
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

    <!-- Modal z mapą miejsc -->
    <div
      class="modal fade"
      tabindex="-1"
      :class="{ show: showSeatMapModal }"
      style="display: block"
      v-if="showSeatMapModal"
      @click.self="closeSeatMapModal"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              Miejsca na seans: {{ currentScreening.filmName }}
              ({{ currentScreening.roomName }})
            </h5>
            <button type="button" class="btn-close" @click="closeSeatMapModal"></button>
          </div>
          <div class="modal-body bg-dark p-4 rounded">
            <!-- ekran -->
            <div class="screen-container text-center mb-4">
              <div class="screen bg-light rounded-pill py-2 px-4 mx-auto">
                <span class="text-dark fw-bold">EKRAN</span>
              </div>
            </div>

            <!-- siatka miejsc -->
            <div class="seats-container mt-5">
              <div
                v-for="row in totalRows"
                :key="row"
                class="seat-row d-flex align-items-center justify-content-center mb-2"
              >
                <div class="row-number text-light me-3 fw-bold">{{ row }}</div>
                <div class="seats d-flex gap-1">
                  <template
                    v-for="(col, idx) in seatsWithGaps[row]"
                    :key="`seat-${row}-${idx}`"
                  >
                    <button
                      v-if="col !== null"
                      :class="getSeatClass(row, col)"
                      :disabled="isSeatUnavailable(row, col)"
                    >
                      {{ col }}
                    </button>
                    <div
                      v-else
                      class="seat empty-seat"
                      style="visibility: hidden; width: 35px; height: 35px;"
                    ></div>
                  </template>
                </div>
                <div class="row-number text-light ms-3 fw-bold">{{ row }}</div>
              </div>
            </div>

            <!-- legenda -->
            <div class="legend mt-4 d-flex justify-content-center gap-4 flex-wrap">
              <div class="legend-item d-flex align-items-center">
                <div class="seat available me-2"></div>
                <span class="text-light">Dostępne</span>
              </div>
              <div class="legend-item d-flex align-items-center">
                <div class="seat unavailable me-2"></div>
                <span class="text-light">Zajęte</span>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeSeatMapModal">
              Zamknij
            </button>
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
      sortColumn: 'filmName',
      sortDirection: 'asc',
      form: {
        screeningId: null,
        filmId: '',
        roomId: '',
        dateTime: '',
        price: '',
        language: '',
        subtitles: ''
      },
      filters: {
        name: '',
        date: ''
      },
      loading: true,

      showSeatMapModal: false,
      currentScreening: {},
      occupiedSeats: [],
      availableSeats: [],
      loadingSeats: false,
    };
  },
  computed: {
    filteredFilms() {
      return this.films.filter(f => f.name.toLowerCase().includes(this.filmSearch.toLowerCase()));
    },
    futureScreenings() {
      const now = new Date();
      return this.screenings.filter(s => new Date(s.dateTime) >= now);
    },
    pastScreenings() {
      const now = new Date();
      return this.screenings.filter(s => new Date(s.dateTime) < now);
    },
    filteredFutureScreenings() {
      return this.applyFilters(this.futureScreenings);
    },
    filteredPastScreenings() {
      return this.applyFilters(this.pastScreenings);
    },
    allSeats() {
      return [...this.availableSeats, ...this.occupiedSeats];
    },
    seatsByRow() {
      const map = {};
      for (const s of this.allSeats) {
        if (!map[s.row]) map[s.row] = [];
        if (!map[s.row].includes(s.column)) map[s.row].push(s.column);
      }
      for (const row in map) map[row].sort((a, b) => a - b);
      return map;
    },
    totalRows() {
      return Object.keys(this.seatsByRow).sort();
    },
    maxColumn() {
      let m = 0;
      for (const cols of Object.values(this.seatsByRow)) {
        m = Math.max(m, ...cols);
      }
      return m;
    },
    seatsWithGaps() {
      const result = {};
      for (const row of this.totalRows) {
        const cols = this.seatsByRow[row];
        result[row] = [];
        for (let c = 1; c <= this.maxColumn; c++) {
          result[row].push(cols.includes(c) ? c : null);
        }
      }
      return result;
    },
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
    applyFilters(list) {
      const filtered = list.filter(s => {
        const nameMatch = s.filmName.toLowerCase().includes(this.filters.name.toLowerCase()) || s.roomName.toLowerCase().includes(this.filters.name.toLowerCase());
        const dateMatch = !this.filters.date || s.dateTime.startsWith(this.filters.date);
        return nameMatch && dateMatch;
      });

      const sorted = [...filtered].sort((a, b) => {
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

      return sorted;
    },
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
    },
      async openSeatMap(screening) {
      this.currentScreening = screening;
      this.showSeatMapModal = true;
      this.loadingSeats = true;

      try {
        const token = localStorage.getItem('token');
        const [occ, avail] = await Promise.all([
          axios.get(
            `/api/seats/occupied?screeningId=${screening.screeningId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.get(
            `/api/seats/available?screeningId=${screening.screeningId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
        ]);
        this.occupiedSeats = occ.data;
        this.availableSeats = avail.data;
      } catch (e) {
        console.error('Błąd ładowania miejsc:', e);
        this.occupiedSeats = [];
        this.availableSeats = [];
      } finally {
        this.loadingSeats = false;
      }
    },
    closeSeatMapModal() {
      this.showSeatMapModal = false;
      this.occupiedSeats = [];
      this.availableSeats = [];
    },
    isSeatUnavailable(row, col) {
      return this.occupiedSeats.some((s) => s.row === row && s.column === col);
    },
    getSeatClass(row, col) {
      if (this.isSeatUnavailable(row, col)) return 'seat unavailable';
      return 'seat available';
    },
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

.seat-map {
  display: grid;
  grid-template-columns: repeat(auto-fit, 40px);
  gap: 8px;
  justify-content: center;
  max-height: 400px;
  overflow-y: auto;
  padding: 20px;
  background: #f0f0f0;
  border-radius: 8px;
  border: 1px solid #ccc;
}
.seat {
  width: 40px;
  height: 40px;
  line-height: 40px;
  border-radius: 6px;
  text-align: center;
  font-weight: 600;
  user-select: none;
  border: 1px solid #888;
  cursor: default;
  transition: background-color 0.3s ease, transform 0.2s ease;
}
.seat.available {
  background-color: #d4edda;
  color: #155724;
  border-color: #28a745;
}
.seat.reserved {
  background-color: #f8d7da;
  color: #721c24;
  border-color: #dc3545;
}
.seat:hover {
  transform: scale(1.1);
}
</style>
