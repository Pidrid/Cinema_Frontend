<template>
  <div class="home-page">
    <main class="content text-center px-3 d-flex flex-column">
      <header class="mb-4">
        <h1 class="display-3 fw-bold mb-2">Kinema 🎬</h1>
        <p class="lead text-secondary mb-3">
          Wybierz seans lub sprawdź swoje rezerwacje w kilka sekund.
        </p>
      </header>

      <section class="action-cards row g-4 justify-content-center flex-grow-1">
        <div class="col-12 col-md-5 col-lg-4">
          <router-link to="/screenings" class="card-link">
            <div class="card action-card h-100">
              <div class="card-body d-flex flex-column justify-content-center align-items-center">
                <i class="bi bi-calendar-event display-1 mb-3 text-danger"></i>
                <h4 class="card-title mb-2">Seanse</h4>
                <p class="card-text text-muted">
                  Przeglądaj dostępne seanse i rezerwuj miejsca.
                </p>
              </div>
            </div>
          </router-link>
        </div>

        <div class="col-12 col-md-5 col-lg-4">
          <router-link to="/history" class="card-link">
            <div class="card action-card h-100">
              <div class="card-body d-flex flex-column justify-content-center align-items-center">
                <i class="bi bi-clock-history display-1 mb-3 text-danger"></i>
                <h4 class="card-title mb-2">Historia rezerwacji</h4>
                <p class="card-text text-muted">
                  Zobacz wszystkie swoje dotychczasowe rezerwacje.
                </p>
              </div>
            </div>
          </router-link>
        </div>
      </section>
    </main>
    <footer class="footer text-center py-3 w-100">
      <small class="text-muted">
        © {{ new Date().getFullYear() }} Kinema | Piotr Schubert
      </small>
    </footer>
  </div>
</template>

<script>
export default {
  name: "HomePage",
};
</script>

<style scoped>
.home-page {
  margin: 0 auto;
  border-radius: 1rem;
  min-height: 100%;      
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
}

.content {
  padding: 1rem 0;
  flex-grow: 1;           
  display: flex;
  flex-direction: column;
}

header {
  margin-bottom: 1.5rem;  
}

footer.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fafafa;
  border-top: 1px solid #ddd;
  padding: 1rem 0;
  text-align: center;
  z-index: 1030; /* nad innymi elementami */
}

.action-cards {
  flex-grow: 1;           
}

.action-cards .action-card {
  background-color: #fff;
  border-radius: 1rem;
  border: 1px solid #ddd;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.07);
}

.action-cards .action-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
}

.card-link {
  text-decoration: none;
}

.card-link .card {
  color: inherit;
}
</style>
