"use client";

import { useEffect, useMemo, useState } from "react";

type Answer = "yes" | "no" | "unsure";
type Task = { id: string; title: string; why: string; where: string; link?: string; caution?: string };

const baseTasks: Task[] = [
  { id: "cpi", title: "Individua il Centro per l'impiego competente", why: "Il collocamento mirato viene gestito territorialmente: prima di recarti allo sportello, verifica quale ufficio segue il tuo Comune e come prendere appuntamento.", where: "Centro per l'impiego della tua zona", link: "https://www.lavoro.gov.it/" },
  { id: "did", title: "Verifica la tua situazione lavorativa e la DID", why: "Chiedi al Centro per l'impiego se devi presentare o aggiornare la Dichiarazione di immediata disponibilità (DID) e quali passaggi sono necessari nel tuo caso.", where: "Centro per l'impiego / portale regionale", link: "https://www.lavoro.gov.it/" },
  { id: "register", title: "Chiedi come iscriversi al collocamento mirato", why: "Fatti confermare i requisiti, i documenti e la procedura per l'elenco previsto dalla Legge 68/99 nella tua provincia.", where: "Ufficio Collocamento Mirato del territorio", link: "https://www.lavoro.gov.it/" },
  { id: "cv", title: "Prepara un curriculum orientato alle competenze", why: "Raccogli esperienze, capacità, formazione e mansioni che puoi svolgere. Non è necessario inserire diagnosi o dettagli sanitari nel CV.", where: "Area personale L68 Navigator" },
  { id: "jobs", title: "Organizza la ricerca di lavoro", why: "Definisci ruoli desiderati, distanza, orari e modalità di lavoro. Chiedi al servizio competente quali offerte o servizi di accompagnamento sono disponibili.", where: "Centro per l'impiego / servizi per il lavoro" },
];

const lombardiaTasks: Task[] = [
  { id: "lombardia-portal", title: "Controlla i servizi ufficiali di Regione Lombardia", why: "Consulta il portale regionale per trovare le informazioni aggiornate sui servizi per il lavoro e sul collocamento mirato. Le modalità possono variare in base alla provincia.", where: "Regione Lombardia", link: "https://www.regione.lombardia.it/" },
];

const questions = [
  { id: "recognition", title: "Hai già un verbale di riconoscimento dell'invalidità civile?", help: "Non serve indicare percentuali o caricare il verbale. Scegli solo la risposta che descrive la situazione.", answers: [{ value: "yes", label: "Sì, ce l'ho" }, { value: "no", label: "No, devo capire come fare" }, { value: "unsure", label: "Non so / devo verificare" }] },
  { id: "conclusion", title: "Hai già la documentazione conclusiva utile per il collocamento mirato?", help: "Potrebbe essere chiamata Relazione conclusiva o documentazione relativa alle capacità lavorative. Il nome e il percorso da seguire vanno verificati con gli enti competenti.", answers: [{ value: "yes", label: "Sì, ce l'ho" }, { value: "no", label: "No / non l'ho mai richiesta" }, { value: "unsure", label: "Non so quale documento sia" }] },
  { id: "registered", title: "Sei già iscritta al collocamento mirato (Legge 68/99)?", help: "Se hai un dubbio, puoi scegliere “Non so” e chiedere una verifica al Centro per l'impiego.", answers: [{ value: "yes", label: "Sì, sono già iscritta" }, { value: "no", label: "No, devo iscrivermi" }, { value: "unsure", label: "Non so / devo verificare" }] },
];

const answerText: Record<Answer, string> = { yes: "Sì", no: "No", unsure: "Da verificare" };

export default function Home() {
  const [region, setRegion] = useState("Lombardia");
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [checked, setChecked] = useState<string[]>([]);
  const [started, setStarted] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("l68navigator-v1");
      if (saved) {
        const data = JSON.parse(saved) as { region?: string; answers?: Record<string, Answer>; checked?: string[]; started?: boolean };
        if (data.region) setRegion(data.region);
        if (data.answers) setAnswers(data.answers);
        if (data.checked) setChecked(data.checked);
        if (data.started) setStarted(true);
      }
    } catch { /* local progress is optional */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem("l68navigator-v1", JSON.stringify({ region, answers, checked, started }));
    } catch { /* app remains usable if storage is unavailable */ }
  }, [region, answers, checked, started, loaded]);

  const tasks = useMemo(() => {
    const items: Task[] = [];
    const recognition = answers.recognition;
    const conclusion = answers.conclusion;
    const registered = answers.registered;
    if (recognition !== "yes") items.push({
      id: "recognition-first",
      title: recognition === "no" ? "Informati sulla procedura di riconoscimento" : "Verifica il verbale di riconoscimento",
      why: recognition === "no" ? "Chiedi al medico di base e all'INPS quali passaggi aggiornati sono necessari per avviare la procedura nel tuo caso." : "Prima di procedere, verifica se esiste già un verbale valido e dove recuperarlo. Non inviare documenti personali a siti non ufficiali.",
      where: "INPS / medico di base", link: "https://www.inps.it/"
    });
    if (conclusion !== "yes") items.push({
      id: "conclusion-first",
      title: conclusion === "no" ? "Chiedi come ottenere la documentazione conclusiva" : "Verifica quale documentazione conclusiva ti serve",
      why: "Contatta l'ufficio competente o il servizio che ti segue per sapere quale documento è richiesto nel tuo caso, chi lo rilascia e se occorre una valutazione specifica.",
      where: "Servizio competente / ASST / ufficio territoriale", link: "https://www.inps.it/",
      caution: "Non tutte le procedure sono uguali: fatti confermare il documento esatto prima di fissare visite o sostenere spese."
    });
    if (registered !== "yes") items.push({
      id: "registration-first",
      title: registered === "no" ? "Chiedi i requisiti per l'iscrizione al collocamento mirato" : "Verifica se risulti già iscritta",
      why: "Chiedi all'ufficio competente quali requisiti e documenti servono, se occorre la DID e come fissare l'appuntamento.",
      where: "Centro per l'impiego / Ufficio Collocamento Mirato", link: "https://www.lavoro.gov.it/"
    });
    if (region === "Lombardia") items.push(...lombardiaTasks);
    items.push(...baseTasks.filter(t => t.id === "cv" || t.id === "jobs"));
    return items;
  }, [answers, region]);

  const progress = tasks.length ? Math.round(tasks.filter(t => checked.includes(t.id)).length / tasks.length * 100) : 0;

  function updateAnswer(id: string, value: Answer) {
    setAnswers(prev => ({ ...prev, [id]: value }));
  }
  function toggleTask(id: string) {
    setChecked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }
  function reset() {
    if (!window.confirm("Vuoi davvero cancellare le risposte e la checklist salvate su questo dispositivo?")) return;
    setAnswers({});
    setChecked([]);
    setStarted(false);
    setRegion("Lombardia");
    window.localStorage.removeItem("l68navigator-v1");
  }

  return (
    <main>
      <a className="skip-link" href="#contenuto">Vai al contenuto</a>
      <header className="topbar">
        <a className="brand" href="/" aria-label="L68 Navigator, pagina iniziale"><span className="brand-mark" aria-hidden="true">L68</span><span>L68 Navigator</span></a>
        <span className="topbar-note">La tua guida pratica al collocamento mirato</span>
      </header>

      <section className="hero" id="contenuto">
        <div className="hero-copy">
          <p className="eyebrow">GUIDA INTERATTIVA GRATUITA</p>
          <h1>Facciamo ordine. Un passo alla volta.</h1>
          <p className="hero-intro">Rispondi a poche domande e ottieni una checklist di cose da verificare per orientarti tra documenti, collocamento mirato e ricerca di lavoro.</p>
          <div className="hero-actions">
            <button className="button button-primary" onClick={() => { setStarted(true); document.getElementById("percorso")?.scrollIntoView({ behavior: "smooth" }); }}>Inizia il mio percorso</button>
            <a className="button button-secondary" href="#come-funziona">Come funziona</a>
          </div>
          <p className="notice">Non è necessario registrarsi. Le risposte restano in questo browser. Non inserire diagnosi, percentuali d'invalidità o altri dati sanitari.</p>
        </div>
        <aside className="welcome-card">
          <div className="welcome-icon" aria-hidden="true">✓</div>
          <p className="card-kicker">IL TUO SPAZIO</p>
          <h2>Una checklist concreta.</h2>
          <ul><li>Risposte semplici, senza moduli complicati</li><li>Passi da spuntare e riprendere in seguito</li><li>Collegamenti a siti istituzionali</li></ul>
          <p className="small-note">Le informazioni salvate non vengono inviate a un server.</p>
        </aside>
      </section>

      <section className="section" id="percorso">
        <div className="section-heading">
          <p className="eyebrow">IL TUO PERCORSO</p>
          <h2>Costruiamo la tua checklist</h2>
          <p>Puoi cambiare le risposte in qualsiasi momento. Se non sai una risposta, scegli “Non so”.</p>
        </div>
        <div className="region-panel">
          <label htmlFor="region">In quale regione vivi?</label>
          <select id="region" value={region} onChange={e => { setRegion(e.target.value); setStarted(true); }}>
            <option>Lombardia</option><option>Piemonte</option><option>Veneto</option><option>Emilia-Romagna</option><option>Lazio</option><option>Toscana</option><option>Liguria</option><option>Campania</option><option>Puglia</option><option>Sicilia</option><option>Sardegna</option><option>Marche</option><option>Umbria</option><option>Abruzzo</option><option>Calabria</option><option>Basilicata</option><option>Molise</option><option>Friuli-Venezia Giulia</option><option>Trentino-Alto Adige</option><option>Valle d'Aosta</option>
          </select>
          <p>La regione aiuta a orientarti, ma le procedure possono cambiare anche tra province. Per ora i collegamenti regionali specifici sono disponibili solo per la Lombardia.</p>
        </div>

        <div className="question-list">
          {questions.map((q, index) => (
            <fieldset className="question-card" key={q.id}>
              <legend><span className="question-number">{index + 1}</span>{q.title}</legend>
              <p>{q.help}</p>
              <div className="answer-options">
                {q.answers.map(a => <label className={answers[q.id] === a.value ? "answer-option selected" : "answer-option"} key={a.value}>
                  <input type="radio" name={q.id} value={a.value} checked={answers[q.id] === a.value} onChange={() => { updateAnswer(q.id, a.value as Answer); setStarted(true); }} />
                  <span>{a.label}</span>
                </label>)}
              </div>
            </fieldset>
          ))}
        </div>

        <div className="checklist-heading">
          <div><p className="eyebrow">PROSSIMI PASSI</p><h2>La tua checklist personale</h2><p>Spunta ogni attività quando l'hai completata o verificata.</p></div>
          <div className="progress-box"><strong>{checked.filter(id => tasks.some(t => t.id === id)).length} / {tasks.length}</strong><span>passi completati</span></div>
        </div>
        <div className="progress-track" role="progressbar" aria-label="Avanzamento checklist" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span style={{ width: progress + "%" }} /></div>
        <div className="task-list">
          {tasks.map((task, index) => <article className={checked.includes(task.id) ? "task-card completed" : "task-card"} key={task.id}>
            <label className="task-check"><input type="checkbox" checked={checked.includes(task.id)} onChange={() => toggleTask(task.id)} /><span className="task-index">{String(index + 1).padStart(2, "0")}</span><span className="task-title">{task.title}</span></label>
            <p>{task.why}</p>
            <p className="task-where"><strong>Dove informarti:</strong> {task.where}</p>
            {task.caution && <p className="task-caution">{task.caution}</p>}
            {task.link && <a className="source-link" href={task.link} target="_blank" rel="noreferrer">Apri il sito istituzionale <span aria-hidden="true">↗</span></a>}
          </article>)}
        </div>
        <div className="actions-row">
          <button className="button button-secondary" onClick={() => window.print()}>Stampa / salva in PDF</button>
          <button className="button button-reset" onClick={reset}>Azzera il percorso</button>
        </div>
        <p className="saved-note" aria-live="polite">Le risposte e le spunte vengono salvate automaticamente su questo dispositivo.</p>
      </section>

      <section className="how-section" id="come-funziona">
        <div><p className="eyebrow">IMPORTANTE</p><h2>Una guida per orientarti, non un sostituto degli uffici competenti.</h2></div>
        <div className="principles">
          <p><strong>Verifica prima di agire:</strong> requisiti, documenti e passaggi possono dipendere dalla tua situazione e dal territorio.</p>
          <p><strong>Usa fonti ufficiali:</strong> INPS, Ministero del Lavoro, Regione e Centro per l'impiego competente.</p>
          <p><strong>Proteggi la tua privacy:</strong> non inviare verbali o documenti sanitari tramite link non verificati e non condividere credenziali.</p>
        </div>
      </section>
      <footer className="footer"><span>L68 Navigator</span><span>Versione iniziale interattiva · Gratuita · Nessuna registrazione</span></footer>
    </main>
  );
}
