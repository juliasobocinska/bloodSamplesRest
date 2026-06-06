  <template>
    <div class="page-container">
      <MainNav />

      <header class="hero">
        <div class="hero-inner">
          <div class="hero-left">
            <h1>Center Lab - szybkie i pewne badania krwi</h1>
            <p class="lead">Zamów badanie, śledź wyniki online i odbierz raporty - prosto, bezpiecznie i szybko.</p>
          </div>
        </div>
      </header>

      <section class="features">
        <div class="container">
          <h2>Dlaczego warto?</h2>
          <div class="grid">
            <div class="feature">
              <h4>Szybkie wyniki</h4>
              <p>Automatyzacja procesu gwarantuje krótszy czas oczekiwania na wyniki.</p>
            </div>
            <div class="feature">
              <h4>Bezpieczeństwo</h4>
              <p>Dane i raporty przechowywane są zgodnie z dobrymi praktykami.</p>
            </div>
            <div class="feature">
              <h4>Cena</h4>
              <p>W pełni darmowe badania krwi raz na pół roku.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>



<style scoped>

  .page-container {
    padding-top: 24px;
    min-height: 100vh;
    background: linear-gradient(180deg,#faf9f6 0%, #f2f0ea 100%);
    font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
    color: #2e2b28;
  }

  .hero {
    padding: 48px 16px;
  }
  .hero-inner {
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    gap: 32px;
    align-items: center;
  }
  .hero-left {
    flex: 1;
  }
  .hero h1 {
    font-size: 32px;
    margin: 0 0 12px 0;
  }
  .lead { color: #555; font-size: 16px; margin-bottom: 18px; }

  .features { padding: 40px 16px; }
  .features .container { max-width: 1100px; margin: 0 auto; }
  .features h2 { margin-bottom: 18px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
  .feature { background: #fff; padding: 18px; border-radius: 10px; box-shadow: 0 4px 16px rgba(44,44,44,0.05); }

  @media (max-width: 800px) {
    .hero-inner { flex-direction: column-reverse; }
    .hero-right { width: 100%; }
    .hero h1 { font-size: 24px; }
  }
  </style>