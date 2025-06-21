import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';
import Home from '../views/Home.vue';
import Login from '../views/UserLogin.vue';
import Register from '../views/UserRegister.vue';
import Films from '../views/UserFilms.vue';
import UserScreenings from '../views/UserScreenings.vue';
import UserReservation from '../views/UserReservation.vue';
import UserHistory from '../views/UserHistory.vue';
import Profile from '../views/UserProfile.vue';

import AdminFilms from '../views/AdminFilms.vue';
import AdminRooms from '../views/AdminRooms.vue';
import AdminScreenings from '../views/AdminScreenings.vue';
import AdminReservations from '../views/AdminReservations.vue';
import AdminSeats from '../views/AdminSeats.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/films', component: Films },
  { path: '/screenings', component: UserScreenings },
  { path: '/history', component: UserHistory, meta: { requiresAuth: true } },
  { path: '/reservations/:screeningId', component: UserReservation, name: 'Reservation', meta: { requiresAuth: true }, props: route => ({
  screeningId: Number(route.params.screeningId)}) },
  { path: '/profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/admin/films', component: AdminFilms, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/rooms', component: AdminRooms, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/screenings', component: AdminScreenings, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/reservations', component: AdminReservations, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/seats', component: AdminSeats, meta: { requiresAuth: true, requiresAdmin: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuth = store.getters.isAuthenticated;
  const isAdmin = store.getters.isAdmin;

  if (to.meta.requiresAuth && !isAuth) return next('/login');
  if (to.meta.requiresAdmin && !isAdmin) return next('/');
  next();
});

export default router;