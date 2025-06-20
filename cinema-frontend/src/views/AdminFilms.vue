<template>
  <div class="container mt-5">
    <h2 class="mb-4">Lista filmów</h2>

    <div class="mb-3 d-flex justify-content-between">
      <input v-model="searchQuery" type="text" class="form-control me-2" placeholder="Wyszukaj po tytule...">
      <button class="btn btn-success" @click="showAddModal = true">Dodaj film</button>
    </div>

    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Ładowanie...</span>
      </div>
    </div>

    <div v-else-if="filteredFilms.length === 0" class="alert alert-info">
      Brak dostępnych filmów.
    </div>

    <ul v-else class="list-group">
      <li v-for="film in filteredFilms" :key="film.filmId" class="list-group-item d-flex justify-content-between align-items-start">
        <div>
          <h5>{{ film.name }}</h5>
          <p class="mb-1">{{ film.description }}</p>
        </div>
        <div>
          <button class="btn btn-sm btn-outline-primary me-2" @click="openEditModal(film)">Edytuj</button>
          <button class="btn btn-sm btn-outline-danger" @click="deleteFilm(film.filmId)">Usuń</button>
        </div>
      </li>
    </ul>

    <!-- Modal dodawania i edycji -->
    <div class="modal fade show" tabindex="-1" style="display: block;" v-if="showEditModal || showAddModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ showAddModal ? 'Dodaj film' : 'Edytuj film' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Tytuł</label>
              <input v-model="currentFilm.name" type="text" class="form-control">
            </div>
            <div class="mb-3">
              <label class="form-label">Opis</label>
              <textarea v-model="currentFilm.description" class="form-control"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Anuluj</button>
            <button type="button" class="btn btn-primary" @click="saveFilm">Zapisz</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AdminFilms',
  data() {
    return {
      films: [],
      loading: true,
      searchQuery: '',
      showEditModal: false,
      showAddModal: false,
      currentFilm: {
        filmId: null,
        name: '',
        description: ''
      }
    };
  },
  computed: {
    filteredFilms() {
      return this.films.filter(film =>
        film.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    async fetchFilms() {
      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/films', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.films = res.data;
      } catch (error) {
        console.error('Błąd podczas ładowania filmów:', error);
      } finally {
        this.loading = false;
      }
    },
    async deleteFilm(id) {
      if (!confirm('Czy na pewno chcesz usunąć ten film?')) return;
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/films/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.films = this.films.filter(f => f.filmId !== id);
      } catch (error) {
        console.error('Błąd podczas usuwania filmu:', error);
      }
    },
    openEditModal(film) {
      this.currentFilm = { ...film };
      this.showEditModal = true;
    },
    closeModal() {
      this.showEditModal = false;
      this.showAddModal = false;
      this.currentFilm = { filmId: null, name: '', description: '' };
    },
    async saveFilm() {
      const token = localStorage.getItem('token');
      try {
        if (this.showAddModal) {
          const res = await axios.post('/api/films', {
            name: this.currentFilm.name,
            description: this.currentFilm.description
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          this.films.push(res.data);
        } else if (this.showEditModal) {
          await axios.put(`/api/films/${this.currentFilm.filmId}`, {
            name: this.currentFilm.name,
            description: this.currentFilm.description
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const index = this.films.findIndex(f => f.filmId === this.currentFilm.filmId);
          if (index !== -1) {
            this.films[index] = { ...this.currentFilm };
          }
        }
        this.closeModal();
      } catch (error) {
        console.error('Błąd podczas zapisu filmu:', error);
      }
    }
  },
  mounted() {
    this.fetchFilms();
  }
};
</script>

<style scoped>
.card {
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.modal {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>