<template>
  <div>
    <h2>Rezerwacja seansu {{ screeningId }}</h2>
    <div class="seat-grid">
      <div
        v-for="seat in seats" 
        :key="seat.seatId"
        :class="['seat', seat.isTaken ? 'taken' : selected.includes(seat.seatId) ? 'selected' : 'available']"
        @click="toggle(seat)"
      >
        {{ seat.row }}-{{ seat.column }}
      </div>
    </div>
    <button @click="reserve">Rezerwuj</button>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data: () => ({ seats: [], selected: [] }),
  computed: {
    screeningId() { return this.$route.params.screeningId; }
  },
  async created() {
    const { data } = await axios.get(`/api/seats/by-screening/${this.screeningId}`);
    this.seats = data;
  },
  methods: {
    toggle(seat) {
      if (seat.isTaken) return;
      const i = this.selected.indexOf(seat.seatId);
      i >= 0 ? this.selected.splice(i, 1) : this.selected.push(seat.seatId);
    },
    async reserve() {
      await axios.post('/api/reservations', {
        screeningId: this.screeningId,
        seatIds: this.selected
      });
      this.$router.push('/profile');
    }
  }
};
</script>

<style>
.seat-grid { display: grid; grid-template-columns: repeat(10, 1fr); gap: .5rem; }
.seat { padding: .5rem; text-align: center; border: 1px solid #333; }
.taken { background: #faa; }
.selected { background: #afa; }
.available { background: #fff; }
</style>