<template>
  <div class="container py-4">
    <h2 class="mb-4">Historia rezerwacji</h2>

    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Ładowanie...</span>
      </div>
    </div>

    <div v-else>
      <div v-if="reservations.length === 0" class="alert alert-info">
        Nie masz jeszcze żadnych rezerwacji.
      </div>

      <div
        v-for="res in reservations"
        :key="res.reservationId"
        class="card mb-3"
      >
        <div class="card-header d-flex justify-content-between align-items-center">
            <div>
                <strong>Rezerwacja #{{ res.reservationId }}</strong>
                <br />
                <small class="text-muted">{{ formatDate(res.dateTime) }}</small>
            </div>
            <div class="text-end">
                <span class="badge bg-secondary me-1">
                {{ res.filmName || 'Ładowanie...' }}
                </span>
                <span class="badge bg-info">
                {{ res.roomName || 'Ładowanie sali...' }}
                </span>
            </div>
            </div>
        <div class="card-body">
          <h5 class="card-title">Miejsca</h5>
          <div class="mb-3">
            <span
              v-for="seat in res.seats"
              :key="seat.seatId"
              class="badge bg-primary me-1 mb-1"
            >
              Rząd {{ seat.row }}, Miejsce {{ seat.column }}
            </span>
          </div>

          <h5 class="card-title">Podsumowanie</h5>
          <ul class="list-unstyled mb-0">
            <li>Kwota netto: {{ res.subtotal.toFixed(2) }} zł</li>
            <li>Podatek: {{ res.tax.toFixed(2) }} zł</li>
            <li class="fw-bold">Razem: {{ res.total.toFixed(2) }} zł</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "UserHistory",
  data() {
    return {
      reservations: [],
      loading: true,
    };
  },
  methods: {
   async fetchHistory() {
    this.loading = true;
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("/api/reservations", {
            headers: { Authorization: `Bearer ${token}` },
            });

            const sortedReservations = res.data.sort(
            (a, b) => new Date(b.dateTime) - new Date(a.dateTime)
            );

            const reservationsWithDetails = await Promise.all(
            sortedReservations.map(async (reservation) => {
                try {
                const screeningRes = await axios.get(`/api/screenings/${reservation.screeningId}`);
                return {
                    ...reservation,
                    filmName: screeningRes.data.filmName,
                    roomName: screeningRes.data.roomName, // dodaj nazwę sali
                };
                } catch (err) {
                console.warn("Nie udało się pobrać danych seansu:", err);
                return {
                    ...reservation,
                    filmName: "Nieznany film",
                    roomName: "Nieznana sala",
                };
                }
            })
            );

            this.reservations = reservationsWithDetails;
        } catch (e) {
            console.error("Błąd ładowania historii:", e);
            this.reservations = [];
        } finally {
            this.loading = false;
        }
    },
    formatDate(dt) {
      const d = new Date(dt);
      return d.toLocaleString("pl-PL", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  mounted() {
    this.fetchHistory();
  },
};
</script>

<style scoped>
.card {
  border-radius: 8px;
}
.badge {
  font-size: 0.9rem;
}
</style>
