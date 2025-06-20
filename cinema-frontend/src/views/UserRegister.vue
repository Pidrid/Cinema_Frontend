<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">Rejestracja</h2>
    <form @submit.prevent="register" class="mx-auto" style="max-width: 400px;">
      <div class="mb-3">
        <label class="form-label">Imię</label>
        <input v-model="form.firstName" type="text" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Nazwisko</label>
        <input v-model="form.lastName" type="text" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input v-model="form.email" type="email" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Hasło</label>
        <input v-model="form.password" type="password" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-primary w-100 mb-2">Zarejestruj się</button>
      <button type="button" class="btn btn-secondary w-100" @click="goToLogin">Powrót do logowania</button>
    </form>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

export default {
  name: 'UserRegister',
  setup() {
    const store = useStore();
    const router = useRouter();
    const form = ref({ firstName: '', lastName: '', email: '', password: '' });

    const register = async () => {
      try {
        await store.dispatch('register', form.value);
        router.push('/login');
      } catch (error) {
        alert('Rejestracja nie powiodła się.');
      }
    };

    const goToLogin = () => {
      router.push('/login');
    };

    return { form, register, goToLogin };
  }
};
</script>