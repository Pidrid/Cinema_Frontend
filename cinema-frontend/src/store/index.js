import { createStore } from 'vuex';
import axios from 'axios';

function getStoredUser() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('Błąd parsowania danych użytkownika z localStorage');
    return null;
  }
}

export default createStore({
  state: {
    token: localStorage.getItem('token') || '',
    user: getStoredUser(),
    films: [],
    reservations: [],
  },
  getters: {
    isAuthenticated: state => !!state.token,
    isAdmin: state => state.user?.role === 'Admin',
  },
  mutations: {
    SET_AUTH(state, { token, user }) {
      state.token = token;
      state.user = user;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },
    LOGOUT(state) {
      state.token = '';
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
    },
    SET_FILMS(state, films) {
      state.films = films;
    },
    SET_RESERVATIONS(state, reservations) {
      state.reservations = reservations;
    },
  },
  actions: {
    async register(_context, payload) {
      await axios.post('/api/auth/register', payload);
    },
    async login({ commit }, payload) {
      const { data } = await axios.post('/api/auth/login', payload);
      commit('SET_AUTH', { token: data.token, user: data.user });
    },
    async fetchFilms({ commit }) {
      const { data } = await axios.get('/api/films');
      commit('SET_FILMS', data);
    },
    async fetchReservations({ commit }) {
      const { data } = await axios.get('/api/reservations');
      commit('SET_RESERVATIONS', data);
    },
  },
});
