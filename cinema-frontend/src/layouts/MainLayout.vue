<template>
  <div class="layout-root d-flex flex-column min-vh-100">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div class="container">
        <router-link to="/" class="navbar-brand fw-bold fs-3">🎬 Kinema</router-link>
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
          <ul class="navbar-nav ms-auto align-items-center">
            <li class="nav-item" v-if="isAdmin">
              <router-link to="/admin/films" class="nav-link">Filmy</router-link>
            </li>
            <li class="nav-item">
              <router-link :to="isAdmin ? '/admin/screenings' : '/screenings'" class="nav-link">Seanse</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/history" class="nav-link">Historia rezerwacji</router-link>
            </li>
            <li class="nav-item" v-if="isAdmin">
              <router-link to="/admin/reservations" class="nav-link">Rezerwacje</router-link>
            </li>
            <li class="nav-item" v-if="isAdmin">
              <router-link to="/admin/rooms" class="nav-link">Sale</router-link>
            </li>
            <li class="nav-item" v-if="isAdmin">
              <router-link to="/admin/seats" class="nav-link">Siedzenia</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/profile" class="nav-link">Profil</router-link>
            </li>
            <li class="nav-item" v-if="!isAuthenticated">
              <router-link to="/login" class="nav-link">Logowanie</router-link>
            </li>
            <li class="nav-item" v-if="isAuthenticated">
              <a href="#" @click.prevent="logout" class="nav-link btn-logout">Wyloguj</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Dodane flex-grow-1, żeby wypełniał pozostałą przestrzeń -->
    <main class="container flex-grow-1 py-4">
      <router-view />
    </main>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "MainLayout",
  computed: {
    ...mapGetters(["isAuthenticated", "isAdmin"]),
  },
  methods: {
    ...mapMutations(["LOGOUT"]),
    logout() {
      this.LOGOUT();
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.layout-root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.navbar {
  position: sticky;
  top: 0;
  z-index: 1030;
}

.navbar-nav .btn-logout {
  cursor: pointer;
  padding: 0;
  color: #fff;
  text-decoration: none;
  line-height: 1.5;
  transition: color 0.2s ease;
}
.navbar-nav .btn-logout:hover {
  color: #dc3545; /* bootstrap danger red */
  text-decoration: underline;
}
.navbar-nav li {
  display: flex;
  align-items: center;
}
</style>
