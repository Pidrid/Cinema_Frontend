<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <router-link to="/" class="navbar-brand">🎬 Kinema</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link :to="isAdmin ? '/admin/films' : '/films'" class="nav-link">Filmy</router-link>
          </li>
          <li class="nav-item">
            <router-link v-if="isAdmin" to="/admin/rooms" class="nav-link">Sale</router-link>
          </li>
          <li class="nav-item">
            <router-link :to="isAdmin ? '/admin/screenings' : '/screenings'" class="nav-link">Seanse</router-link>
          </li>
          <li class="nav-item">
            <router-link :to="isAdmin ? '/admin/reservations' : '/reservation'" class="nav-link">Rezerwacje</router-link>
          </li>
          <li class="nav-item">
            <router-link :to="isAdmin ? '/admin/profile' : '/profile'" class="nav-link">Profil</router-link>
          </li>
          <li class="nav-item" v-if="!isAuthenticated">
            <router-link to="/login" class="nav-link">Logowanie</router-link>
          </li>
          <li class="nav-item" v-if="isAuthenticated">
            <button @click="logout" class="btn btn-link nav-link" style="padding: 0;">Wyloguj</button>
          </li>
        </ul>
      </div>
    </nav>

    <main class="container py-4">
      <router-view />
    </main>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'MainLayout',
  computed: {
    ...mapGetters(['isAuthenticated', 'isAdmin'])
  },
  methods: {
    ...mapMutations(['LOGOUT']),
    logout() {
      this.LOGOUT();
      this.$router.push('/');
    }
  }
}
</script>
