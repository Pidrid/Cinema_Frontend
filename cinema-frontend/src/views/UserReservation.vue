<template>
  <div class="container py-4">
    <h2 class="mb-4">Wybierz miejsca</h2>
    <div v-if="loading">Ładowanie miejsc...</div>

    <!-- Screening zakończony -->
    <div v-else-if="isScreeningInPast" class="alert alert-warning">
      Ten seans już się odbył. Rezerwacja niedostępna.
    </div>

    <!-- Sala kinowa -->
    <div v-else>
      <div class="cinema-hall bg-dark p-4 rounded mb-4">

        <!-- Ekran -->
        <div class="screen-container text-center mb-4">
          <div class="screen bg-light rounded-pill py-2 px-4 mx-auto">
            <span class="text-dark fw-bold">EKRAN</span>
          </div>
        </div>

        <!-- Miejsca -->
        <div class="seats-container mt-5">
          <div
            v-for="row in totalRows"
            :key="row"
            class="seat-row d-flex align-items-center justify-content-center mb-2"
          >
            <div class="row-number text-light me-3 fw-bold">{{ row }}</div>
            <div class="seats d-flex gap-1">
              <template v-for="(col, index) in seatsWithGaps[row]" :key="`seat-${row}-${index}`">
                <button
                  v-if="col !== null"
                  :class="getSeatClass(row, col)"
                  :disabled="isSeatUnavailable(row, col)"
                  @click="toggleSeat(row, col)"
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

        <!-- Legenda -->
        <div class="legend mt-4 d-flex justify-content-center gap-4 flex-wrap">
          <div class="legend-item d-flex align-items-center">
            <div class="seat available me-2"></div>
            <span class="text-light">Dostępne</span>
          </div>
          <div class="legend-item d-flex align-items-center">
            <div class="seat available selected me-2"></div>
            <span class="text-light">Wybrane</span>
          </div>
          <div class="legend-item d-flex align-items-center">
            <div class="seat unavailable me-2"></div>
            <span class="text-light">Zajęte</span>
          </div>
        </div>
      </div>

      <!-- POD ekranem i salą -->
      <div v-if="selectedSeats.length" class="selected-summary mt-4 p-3 bg-primary rounded">
        <h5 class="text-light mb-3">Wybrane miejsca ({{ selectedSeats.length }}):</h5>
        <div class="selected-seats text-light mb-2">
          <span
            v-for="(seat, index) in selectedSeats"
            :key="index"
            class="badge bg-light text-dark me-2 mb-1"
          >
            Rząd {{ seat.row }}, Miejsce {{ seat.column }}
          </span>
        </div>

        <div class="text-light">
          <p>Kwota netto: {{ subtotal.toFixed(2) }} zł</p>
          <p>Podatek (8%): {{ tax.toFixed(2) }} zł</p>
          <p class="fw-bold">Razem: {{ total.toFixed(2) }} zł</p>
        </div>

        <!-- Płatność -->
        <div class="mt-4 bg-light p-3 rounded">
          <h5 class="mb-3">Dane płatności</h5>

          <div class="mb-3">
            <label class="form-label">Metoda płatności</label>
            <select v-model="paymentMethod" class="form-select">
              <option value="card">Karta</option>
              <option value="external">Zewnętrzny dostawca</option>
            </select>
          </div>

          <div v-if="paymentMethod === 'card'">
            <div class="mb-3">
              <label class="form-label">Numer karty</label>
              <input type="text" class="form-control" v-model="cardNumber" />
            </div>
            <div class="mb-3">
              <label class="form-label">Data ważności</label>
              <input type="text" class="form-control" v-model="expiryDate" placeholder="MM/RR" />
            </div>
            <div class="mb-3">
              <label class="form-label">CVV</label>
              <input type="text" class="form-control" v-model="cvv" />
            </div>
          </div>

          <button
            class="btn btn-success mt-3"
            @click="makeReservation"
            :disabled="reservationLoading"
          >
            {{ reservationLoading ? 'Rezerwuję...' : 'Zarezerwuj i zapłać' }}
          </button>
        </div>

        <div v-if="reservationSuccess === true" class="alert alert-success mt-3">
          Rezerwacja zakończona sukcesem!
        </div>
        <div v-else-if="reservationSuccess === false" class="alert alert-danger mt-3">
          Wystąpił błąd podczas rezerwacji.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.seat {
  width: 35px;
  height: 35px;
  border-radius: 8px 8px 15px 15px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  position: relative;
}
.seat.available {
  background: #dc3545;
  border: 2px solid #dc3545;
  color: white;
}
.seat.available.selected {
  background: #28a745;
  border: 2px solid #28a745;
}
.seat.unavailable {
  background: #6c757d;
  border: 2px solid #6c757d;
  color: #adb5bd;
  cursor: not-allowed;
}
.empty-seat {
  width: 35px;
  height: 35px;
  background: transparent;
  border-radius: 8px 8px 15px 15px;
}
</style>

<script>
import axios from 'axios';

export default {
  name: 'UserReservation',
  props: {
    screeningId: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      screeningDate: '',
      screeningPrice: 0,
      occupiedSeats: [],
      availableSeats: [],
      selectedSeats: [],
      loading: true,
      reservationLoading: false,
      reservationSuccess: null,
      paymentMethod: 'card',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
    };
  },
  computed: {
    priceNumber() {
      // Konwertuj screeningPrice na liczbę (obsługuje stringi)
      const val = Number(this.screeningPrice);
      return isNaN(val) ? 0 : val;
    },
    allSeats() {
      return [...this.availableSeats, ...this.occupiedSeats];
    },
    seatsByRow() {
      // Zbuduj mapę rzędów do pełnej tablicy kolumn, brakujące kolumny = null
      const map = {};
      const allSeats = this.allSeats;

      // Zbierz max i min kolumn dla każdego rzędu
      const rowColumns = {};
      allSeats.forEach(({ row, column }) => {
        if (!rowColumns[row]) rowColumns[row] = { min: column, max: column };
        else {
          if (column < rowColumns[row].min) rowColumns[row].min = column;
          if (column > rowColumns[row].max) rowColumns[row].max = column;
        }
      });

      // Dla każdego rzędu stwórz tablicę pełną kolumn z przerwami
      for (const row in rowColumns) {
        const { min, max } = rowColumns[row];
        map[row] = [];
        for (let c = min; c <= max; c++) {
          const seatExists = allSeats.some((s) => s.row == row && s.column === c);
          map[row].push(seatExists ? c : null);
        }
      }

      return map;
    },
    totalRows() {
      return Object.keys(this.seatsByRow)
        .map(Number)
        .sort((a, b) => a - b);
    },
    subtotal() {
      return this.selectedSeats.length * this.priceNumber;
    },
    tax() {
      return this.subtotal * 0.08;
    },
    total() {
      return this.subtotal;
    },
    isScreeningInPast() {
      // Prosta walidacja daty seansu
      return new Date(this.screeningDate) < new Date();
    },
     maxColumn() {
      // Znajdź maksymalną kolumnę spośród wszystkich miejsc
      let max = 0;
      for (const row in this.seatsByRow) {
        const cols = this.seatsByRow[row];
        if (cols.length) {
          const rowMax = Math.max(...cols);
          if (rowMax > max) max = rowMax;
        }
      }
      return max;
    },
    seatsWithGaps() {
      // Zwraca obiekt z rzędami, gdzie kolumny to tablica z liczbami lub null (gap)
      const result = {};
      for (const row of this.totalRows) {
        result[row] = [];
        const existingCols = this.seatsByRow[row] || [];
        for (let col = 1; col <= this.maxColumn; col++) {
          if (existingCols.includes(col)) {
            result[row].push(col);
          } else {
            result[row].push(null); // null oznacza przerwę
          }
        }
      }
      return result;
    },
  },
  methods: {
    async fetchSeats() {
      this.loading = true;
      try {
        const [occupied, available] = await Promise.all([
          axios.get(`/api/seats/occupied?screeningId=${this.screeningId}`),
          axios.get(`/api/seats/available?screeningId=${this.screeningId}`),
        ]);
        this.occupiedSeats = occupied.data;
        this.availableSeats = available.data;
      } catch (e) {
        console.error('Błąd ładowania miejsc:', e);
      } finally {
        this.loading = false;
      }
    },
    async fetchScreeningInfo() {
      try {
        const response = await axios.get(`/api/screenings/${this.screeningId}`);
        this.screeningDate = response.data.date;
        this.screeningPrice = response.data.price;
      } catch (e) {
        console.error('Błąd ładowania danych seansu:', e);
      }
    },
    isSeatUnavailable(row, col) {
      return this.occupiedSeats.some((s) => s.row === row && s.column === col);
    },
    isSeatSelected(row, col) {
      return this.selectedSeats.some((s) => s.row === row && s.column === col);
    },
    toggleSeat(row, col) {
      if (this.isSeatUnavailable(row, col)) return;
      const idx = this.selectedSeats.findIndex((s) => s.row === row && s.column === col);
      if (idx >= 0) this.selectedSeats.splice(idx, 1);
      else this.selectedSeats.push({ row, column: col });
    },
    getSeatClass(row, col) {
      if (this.isSeatUnavailable(row, col)) return 'seat unavailable';
      if (this.isSeatSelected(row, col)) return 'seat available selected';
      return 'seat available';
    },
    async makeReservation() {
      if (!this.selectedSeats.length || this.isScreeningInPast) return;

      this.reservationLoading = true;

      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Brak tokenu logowania");

        const seatIds = this.selectedSeats
          .map(sel => {
            const match = this.availableSeats.find(
              s => s.row === sel.row && s.column === sel.column
            );
            return match?.seatId;
          })
          .filter(id => id);

        if (!seatIds.length) throw new Error("Brak poprawnych SeatId");

        await axios.post('/api/reservations', {
          screeningId: this.screeningId,
          seatIds: seatIds
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        this.reservationSuccess = true;
        this.selectedSeats = [];

        setTimeout(() => {
          this.$router.push('/');
        }, 2000);
      } catch (e) {
        console.error('Błąd rezerwacji:', e);
        this.reservationSuccess = false;
      } finally {
        this.reservationLoading = false;
      }
    }
  },
  mounted() {
    this.fetchScreeningInfo();
    this.fetchSeats();
  },
};
</script>
