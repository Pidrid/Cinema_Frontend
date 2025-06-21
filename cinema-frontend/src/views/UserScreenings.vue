<template>
  <div class="container py-4">
    <h2 class="mb-4">Seanse</h2>

    <div class="d-flex align-items-center mb-3">
      <button
        class="btn btn-outline-primary me-2"
        :disabled="isPrevDateDisabled"
        @click="changeDate(-1)"
      >
        ‹
      </button>

      <input
        type="date"
        v-model="selectedDateString"
        :min="todayString"
        class="form-control me-2"
        style="max-width: 200px"
      />

      <button class="btn btn-outline-primary" @click="changeDate(1)">›</button>
    </div>

    <div v-if="loading">Ładowanie seansów...</div>
    <div v-else-if="filteredScreenings.length === 0">Brak seansów na wybrany dzień.</div>

    <ul class="list-group">
      <li
        v-for="screening in sortedFilteredScreenings"
        :key="screening.screeningId"
        class="list-group-item"
      >
        <strong
          class="link-primary"
          style="cursor: pointer"
          @click="openModal(screening)"
        >
          {{ screening.filmName }}
        </strong>
        <div>
          Sala: {{ screening.roomName }} |
          Godzina: {{ formatTime(screening.dateTime) }} |
          Język: {{ screening.language }} |
          Napisy: {{ screening.subtitles || 'Brak' }}
        </div>
        <div>Cena: {{ screening.price.toFixed(2) }} PLN</div>
        <button
          class="btn btn-sm btn-success mt-2"
          @click="goToReservation(screening.screeningId)"
        >
          Rezerwuj
        </button>
      </li>
    </ul>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="modal fade show d-block"
      tabindex="-1"
      style="background-color: rgba(0,0,0,0.5)"
      @click.self="closeModal"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ modalFilm.filmName }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <p>{{ modalFilm.description || 'Brak opisu filmu.' }}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeModal">Zamknij</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UserScreenings',
  data() {
    return {
      selectedDate: new Date(),
      screenings: [],
      loading: false,
      showModal: false,
      modalFilm: {},
    };
  },
  computed: {
    selectedDateString: {
      get() {
        return this.selectedDate.toISOString().slice(0, 10);
      },
      set(value) {
        const newDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (newDate < today) {
          this.selectedDate = today;
        } else {
          this.selectedDate = newDate;
        }
      },
    },
    todayString() {
      return new Date().toISOString().slice(0, 10);
    },
    isPrevDateDisabled() {
      const yesterday = new Date(this.selectedDate);
      yesterday.setDate(yesterday.getDate() - 1);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return yesterday < today;
    },
    filteredScreenings() {
      const now = new Date();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDateMidnight = new Date(this.selectedDate);
      selectedDateMidnight.setHours(0, 0, 0, 0);
      
      // Jeśli wybrany dzień to dzisiaj, filtruj tylko przyszłe seanse
      if (selectedDateMidnight.getTime() === today.getTime()) {
        return this.screenings.filter(screening => {
          const screeningDate = new Date(screening.dateTime);
          return screeningDate > now;
        });
      }
      
      // Jeśli to przyszły dzień, pokaż wszystkie seanse
      return this.screenings;
    },
    sortedFilteredScreenings() {
      return this.filteredScreenings.slice().sort(
        (a, b) => new Date(a.dateTime) - new Date(b.dateTime)
      );
    }
  },
  watch: {
    selectedDate() {
      this.fetchScreenings();
    },
  },
  methods: {
    async fetchScreenings() {
      this.loading = true;
      try {
        const dateStr = this.selectedDate.toISOString().slice(0, 10);
        const response = await axios.get(`/api/screenings/byday?date=${dateStr}`);
        this.screenings = response.data;
      } catch (error) {
        console.error('Błąd ładowania seansów:', error);
        this.screenings = [];
      } finally {
        this.loading = false;
      }
    },
    changeDate(days) {
      const newDate = new Date(this.selectedDate);
      newDate.setDate(newDate.getDate() + days);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (newDate < today) {
        this.selectedDate = today;
      } else {
        this.selectedDate = newDate;
      }
    },
    formatTime(dateTimeString) {
      const date = new Date(dateTimeString);
      if (isNaN(date)) return 'Invalid Date';
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    openModal(screening) {
      this.modalFilm = {
        filmName: screening.filmName,
        description: screening.filmDescription || 'Brak opisu filmu.',
      };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.modalFilm = {};
    },
    goToReservation(screeningId) {
      this.$router.push({ name: 'Reservation', params: { screeningId } });
    },
  },
  mounted() {
    this.fetchScreenings();
  },
};
</script>

<style scoped>
.list-group-item {
  margin-bottom: 10px;
}
.link-primary:hover {
  text-decoration: underline;
  cursor: pointer;
}
.modal {
  display: block;
}
</style>