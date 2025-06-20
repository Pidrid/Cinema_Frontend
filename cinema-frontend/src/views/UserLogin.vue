<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">Logowanie</h2>
    <form @submit.prevent="login" class="mx-auto" style="max-width: 400px;">
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input v-model="form.email" type="email" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Hasło</label>
        <input v-model="form.password" type="password" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-success w-100 mb-2">Zaloguj się</button>
      <button type="button" class="btn btn-link w-100" @click="goToRegister">Nie masz konta? Zarejestruj się</button>
    </form>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

export default {
  name: 'UserLogin',
  setup() {
    const store = useStore();
    const router = useRouter();
    const form = ref({ email: '', password: '' });

    const login = async () => {
      try {
        await store.dispatch('login', form.value);
        router.push('/');
      } catch (error) {
        alert('Logowanie nie powiodło się.');
      }
    };

    const goToRegister = () => {
      router.push('/register');
    };

    return { form, login, goToRegister };
  }
};
</script>