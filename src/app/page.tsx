const steps = [
  {
    number: "01",
    title: "Capire da dove partire",
    description:
      "Individua la tua situazione e i documenti che potresti dover verificare.",
  },
  {
    number: "02",
    title: "Preparare i passaggi",
    description:
      "Organizza le domande da porre agli enti e i prossimi passi, senza perdere il filo.",
  },
  {
    number: "03",
    title: "Avvicinarsi al lavoro",
    description:
      "Raccogli competenze, aggiorna il curriculum e prepara la ricerca di opportunità.",
  },
];

export default function Home() {
  return (
    <main>
      <a className="skip-link" href="#contenuto">Vai al contenuto</a>
      <header className="topbar">
        <a className="brand" href="/" aria-label="L68 Navigator, pagina iniziale">
          <span className="brand-mark" aria-hidden="true">L68</span>
          <span>L68 Navigator</span>
        </a>
        <span className="topbar-note">Orientamento accessibile al lavoro</span>
      </header>

      <section className="hero" id="contenuto">
        <div className="hero-copy">
          <p className="eyebrow">INFORMAZIONI · ORGANIZZAZIONE · LAVORO</p>
          <h1>Un passo alla volta, verso il lavoro.</h1>
          <p className="hero-intro">
            Uno spazio pensato per aiutarti a orientarti tra documenti,
            collocamento mirato e ricerca di lavoro, con indicazioni chiare
            e percorsi da seguire al tuo ritmo.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#percorso">Scopri il percorso</a>
            <a className="button button-secondary" href="#come-funziona">Come funziona</a>
          </div>
          <p className="notice">
            Le informazioni sono orientative: requisiti e procedure vanno
            verificati con gli enti competenti del proprio territorio.
          </p>
        </div>
        <aside className="welcome-card" aria-label="Il metodo L68 Navigator">
          <div className="welcome-icon" aria-hidden="true">✓</div>
          <p className="card-kicker">IL TUO PERCORSO</p>
          <h2>Chiarezza, senza fretta.</h2>
          <ul>
            <li>Passaggi spiegati in linguaggio semplice</li>
            <li>Checklist per organizzare le attività</li>
            <li>Preparazione alla ricerca di lavoro</li>
          </ul>
          <p className="small-note">Non devi fare tutto oggi.</p>
        </aside>
      </section>

      <section className="section" id="percorso">
        <div className="section-heading">
          <p className="eyebrow">IL PERCORSO</p>
          <h2>Da dove vuoi cominciare?</h2>
          <p>Tre aree per trasformare una procedura complessa in passi più gestibili.</p>
        </div>
        <div className="step-grid">
          {steps.map((step) => (
            <article className="step-card" key={step.number}>
              <span className="step-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              <span className="coming-soon">In preparazione</span>
            </article>
          ))}
        </div>
      </section>

      <section className="how-section" id="come-funziona">
        <div>
          <p className="eyebrow">PROGETTATO PER LE PERSONE</p>
          <h2>Un servizio comprensibile e rispettoso.</h2>
        </div>
        <div className="principles">
          <p><strong>Accessibile:</strong> testi leggibili, pulsanti grandi e navigazione semplice.</p>
          <p><strong>Trasparente:</strong> le indicazioni dovranno citare fonti ufficiali e data di verifica.</p>
          <p><strong>Riservato:</strong> non caricare documenti personali finché l’area protetta non è pronta.</p>
        </div>
      </section>

      <section className="status-panel" aria-label="Stato del progetto">
        <div>
          <p className="eyebrow">STATO DEL PROGETTO</p>
          <h2>Fondazione applicativa avviata</h2>
          <p>La prima versione prepara struttura e interfaccia. Autenticazione, database e percorsi verificati verranno aggiunti e testati prima di raccogliere dati personali.</p>
        </div>
        <span className="status-pill">In sviluppo</span>
      </section>

      <footer className="footer">
        <span>L68 Navigator</span>
        <span>Progetto in costruzione · Informazioni da verificare con fonti ufficiali</span>
      </footer>
    </main>
  );
}
