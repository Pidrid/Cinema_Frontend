<template>
  <div class="container mt-4" v-if="user">
    <h2 class="mb-4">Profil użytkownika</h2>

    <!-- Formularz danych użytkownika -->
    <form @submit.prevent="updateProfile">
      <div class="card p-4 mb-4 shadow-sm">
        <div class="mb-3">
          <label for="firstName" class="form-label">Imię</label>
          <input type="text" class="form-control" id="firstName" v-model="user.firstName" required />
        </div>

        <div class="mb-3">
          <label for="lastName" class="form-label">Nazwisko</label>
          <input type="text" class="form-control" id="lastName" v-model="user.lastName" required />
        </div>

        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input type="email" class="form-control" id="email" v-model="user.email" disabled />
        </div>

        <button type="submit" class="btn btn-primary" :disabled="loading">
          Zapisz zmiany
        </button>
      </div>
    </form>

    <!-- Formularz zmiany hasła -->
    <form @submit.prevent="changePassword">
      <div class="card p-4 shadow-sm">
        <h5 class="mb-3">Zmiana hasła</h5>

        <div class="mb-3">
          <label for="currentPassword" class="form-label">Aktualne hasło</label>
          <input type="password" class="form-control" id="currentPassword" v-model="passwordData.currentPassword" required />
        </div>

        <div class="mb-3">
          <label for="newPassword" class="form-label">Nowe hasło</label>
          <input type="password" class="form-control" id="newPassword" v-model="passwordData.newPassword" required />
        </div>
        <div class="mb-3">
          <label for="confirmPassword" class="form-label">Powtórz nowe hasło</label>
          <input
            type="password"
            class="form-control"
            id="confirmPassword"
            v-model="passwordData.confirmPassword"
            required
          />
        </div>

        <button type="submit" class="btn btn-warning" :disabled="loading">
          Zmień hasło
        </button>
      </div>
    </form>

    <!-- Wiadomości -->
    <div class="alert alert-success mt-3" v-if="successMessage" role="alert">
      {{ successMessage }}
    </div>

    <div class="alert alert-danger mt-3" v-if="errorMessage" role="alert">
      {{ errorMessage }}
    </div>
  </div>

  <div v-else class="text-center mt-5">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Ładowanie...</span>
    </div>
    <p class="mt-2">Ładowanie profilu...</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "UserProfile",
  data() {
    return {
      user: null,
      passwordData: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      successMessage: "",
      errorMessage: "",
      loading: false,
    };
  },
  async mounted() {
    await this.fetchUser();
  },
  methods: {
    async fetchUser() {
      this.loading = true;
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user.id;

        const res = await axios.get(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.user = res.data;
      } catch (e) {
        this.errorMessage = "Nie udało się pobrać danych użytkownika.";
      } finally {
        this.loading = false;
      }
    },
    async updateProfile() {
      this.successMessage = "";
      this.errorMessage = "";
      try {
        const token = localStorage.getItem("token");
        await axios.put(
          "/api/users/profile",
          {
            firstName: this.user.firstName,
            lastName: this.user.lastName,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        this.successMessage = "Profil został zaktualizowany.";
      } catch (e) {
        this.errorMessage = "Błąd podczas aktualizacji profilu.";
      }
    },
    async changePassword() {
      this.successMessage = "";
      this.errorMessage = "";

      if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
        this.errorMessage = "Nowe hasła nie są zgodne.";
        return;
      }
      try {
        const token = localStorage.getItem("token");
        await axios.put(
          "/api/users/password",
          {
            currentPassword: this.passwordData.currentPassword,
            newPassword: this.passwordData.newPassword,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        this.successMessage = "Hasło zostało zmienione.";
        this.passwordData.currentPassword = "";
        this.passwordData.newPassword = "";
      } catch (e) {
        this.errorMessage = "Błąd podczas zmiany hasła.";
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
}
</style>
