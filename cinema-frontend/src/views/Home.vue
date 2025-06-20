<template>
  <div class="container py-5">
    <header class="text-center mb-5">
      <h1 class="display-4 mb-3">🎬 Witamy w Kinie Kinema</h1>
      <p class="lead mb-4">Zarezerwuj miejsce na najnowsze premiery filmowe!</p>
      <router-link to="/films" class="btn btn-danger btn-lg">Przeglądaj Filmy</router-link>
    </header>

    <section>
      <div class="row justify-content-center g-4">
        <div class="col-12 col-md-4">
          <router-link to="/screenings" class="text-decoration-none">
            <div class="card h-100 shadow-sm text-center hover-shadow">
              <div class="card-body">
                <h3 class="card-title mb-2">Seanse</h3>
                <p class="card-text">Wybierz seans i zobacz dostępne miejsca.</p>
              </div>
            </div>
          </router-link>
        </div>
        <div class="col-12 col-md-4">
          <router-link to="/reservations" class="text-decoration-none">
            <div class="card h-100 shadow-sm text-center hover-shadow">
              <div class="card-body">
                <h3 class="card-title mb-2">Rezerwacje</h3>
                <p class="card-text">Wygodny wybór miejsc w sali kinowej.</p>
              </div>
            </div>
          </router-link>
        </div>
        <div class="col-12 col-md-4">
          <router-link to="/historia" class="text-decoration-none">
            <div class="card h-100 shadow-sm text-center hover-shadow">
              <div class="card-body">
                <h3 class="card-title mb-2">Historia</h3>
                <p class="card-text">Śledź swoje rezerwacje i ulubione filmy.</p>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
};
</script>
