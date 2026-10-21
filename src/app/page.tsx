"use client";

import { useEffect, useMemo, useState } from "react";

type Answer = "yes" | "no" | "unsure";
type Task = { id: string; title: string; action: string; where: string; link?: string; detail?: string };

const questions = [
  { id: "recognition", title: "Hai il verbale d'invalidità?", options: [{value:"yes",label:"Sì"},{value:"no",label:"No"},{value:"unsure",label:"Non lo so"}] },
  { id: "conclusion", title: "Hai la documentazione per il collocamento mirato?", options: [{value:"yes",label:"Sì"},{value:"no",label:"No"},{value:"unsure",label:"Non lo so"}] },
  { id: "registered", title: "Sei già iscritta alla Legge 68/99?", options: [{value:"yes",label:"Sì"},{value:"no",label:"No"},{value:"unsure",label:"Non lo so"}] },
];

export default function Home() {
  const [region, setRegion] = useState("Lombardia");
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [checked, setChecked] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("l68navigator-v2");
      if (raw) { const d = JSON.parse(raw); setRegion(d.region || "Lombardia"); setAnswers(d.answers || {}); setChecked(d.checked || []); }
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => { if (loaded) try { localStorage.setItem("l68navigator-v2", JSON.stringify({region,answers,checked})); } catch {} }, [region,answers,checked,loaded]);

  const tasks = useMemo<Task[]>(() => {
    const list: Task[] = [];
    if (answers.recognition !== "yes") list.push({
      id:"recognition", title: answers.recognition === "no" ? "1. Informati sul verbale d'invalidità" : "1. Verifica se hai il verbale d'invalidità",
      action: answers.recognition === "no" ? "Contatta il medico di base o l'INPS e chiedi da dove iniziare." : "Controlla i documenti che hai oppure chiedi all'INPS come verificarlo.",
      where:"INPS", link:"https://www.inps.it/"
    });
    if (answers.conclusion !== "yes") list.push({
      id:"documents", title: answers.conclusion === "no" ? "2. Chiedi quale documento manca" : "2. Verifica i documenti necessari",
      action:"Contatta il Centro per l'impiego o il servizio che ti segue. Chiedi il nome esatto del documento e chi deve rilasciarlo.",
      where:"Centro per l'impiego / servizio competente", link:"https://www.lavoro.gov.it/",
      detail:"Non tutte le situazioni sono uguali: prima di prenotare visite o sostenere spese, fatti confermare la procedura."
    });
    if (answers.registered !== "yes") list.push({
      id:"registration", title: answers.registered === "no" ? "3. Chiedi come iscriverti" : "3. Verifica se sei già iscritta",
      action:"Chiedi quali requisiti e documenti servono e come fissare un appuntamento per il collocamento mirato.",
      where:"Centro per l'impiego – Collocamento mirato", link:"https://www.lavoro.gov.it/"
    });
    if (region === "Lombardia") list.push({id:"region",title:"4. Apri i servizi della tua Regione",action:"Cerca le informazioni ufficiali sui servizi per il lavoro nella tua provincia.",where:"Regione Lombardia",link:"https://www.regione.lombardia.it/"});
    list.push({id:"cv",title:"5. Prepara il curriculum",action:"Scrivi esperienze, competenze e lavori che ti interessano. Non inserire diagnosi o dettagli sanitari.",where:"Il tuo computer o telefono"});
    list.push({id:"work",title:"6. Scegli il prossimo obiettivo",action:"Annota 2–3 lavori che vorresti fare e la zona in cui puoi lavorare.",where:"Il tuo elenco personale"});
    return list;
  },[answers,region]);
  const completed = tasks.filter(t=>checked.includes(t.id)).length;
  const progress = tasks.length ? Math.round(completed/tasks.length*100) : 0;
  function reset(){ if(confirm("Vuoi cancellare il percorso salvato su questo dispositivo?")) {setAnswers({});setChecked([]);setRegion("Lombardia");localStorage.removeItem("l68navigator-v2");} }

  return <main className="app-shell">
    <header className="topbar"><a className="brand" href="/"><span className="brand-mark">68</span><span>L68 <b>Navigator</b></span></a><span className="free-label">GRATUITO · SENZA REGISTRAZIONE</span></header>
    <section className="hero">
      <div className="hero-copy"><p className="eyebrow">IL TUO PROSSIMO PASSO, CHIARO</p><h1>Troviamo la strada.<br/><span>Un passo alla volta.</span></h1><p>Rispondi a 3 domande. Ti diciamo cosa fare dopo.</p><a className="start-button" href="#domande">Inizia da qui <span aria-hidden="true">↓</span></a></div>
      <div className="hero-art" aria-hidden="true"><div className="art-circle"><span>✓</span></div><div className="art-card art-card-one"><b>01</b> Capisci da dove partire</div><div className="art-card art-card-two"><b>02</b> Segui la checklist</div></div>
    </section>
    <section className="content" id="domande">
      <div className="section-title"><span className="step-dot">1</span><div><h2>Facciamo il punto</h2><p>Scegli una risposta per ogni domanda.</p></div></div>
      <div className="question-grid">
        {questions.map((q,i)=><fieldset className="question-card" key={q.id}><legend><span className="question-number">{String(i+1).padStart(2,"0")}</span>{q.title}</legend><div className="answer-options">{q.options.map(o=><label className={answers[q.id]===o.value?"answer-option selected":"answer-option"} key={o.value}><input type="radio" name={q.id} checked={answers[q.id]===o.value} onChange={()=>setAnswers(prev=>({...prev,[q.id]:o.value as Answer}))}/><span>{o.label}</span></label>)}</div></fieldset>)}
      </div>
      <div className="region-row"><label htmlFor="region">Dove vivi?</label><select id="region" value={region} onChange={e=>setRegion(e.target.value)}><option>Lombardia</option><option>Piemonte</option><option>Veneto</option><option>Emilia-Romagna</option><option>Lazio</option><option>Toscana</option><option>Liguria</option><option>Campania</option><option>Puglia</option><option>Sicilia</option><option>Sardegna</option><option>Marche</option><option>Umbria</option><option>Abruzzo</option><option>Calabria</option><option>Basilicata</option><option>Molise</option><option>Friuli-Venezia Giulia</option><option>Trentino-Alto Adige</option><option>Valle d'Aosta</option></select><span>La provincia può cambiare i passaggi: chiedi conferma all'ufficio competente.</span></div>
      <div className="section-title next-title"><span className="step-dot purple">2</span><div><h2>Questi sono i tuoi prossimi passi</h2><p>Fai una cosa alla volta. Spunta quando hai finito.</p></div></div>
      <div className="progress-card"><div className="progress-copy"><b>{completed} di {tasks.length}</b><span>passi completati</span></div><div className="progress-track" role="progressbar" aria-label="Avanzamento" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span style={{width:progress+"%"}}/></div><strong>{progress}%</strong></div>
      <div className="task-grid">{tasks.map((t,i)=><article key={t.id} className={checked.includes(t.id)?"task-card done":"task-card"}><div className="task-top"><span className="task-number">{String(i+1).padStart(2,"0")}</span><label className="task-toggle"><input type="checkbox" checked={checked.includes(t.id)} onChange={()=>setChecked(prev=>prev.includes(t.id)?prev.filter(x=>x!==t.id):[...prev,t.id])}/><span>{checked.includes(t.id)?"Fatto":"Da fare"}</span></label></div><h3>{t.title.replace(/^\d+\. /,"")}</h3><p>{t.action}</p>{t.detail&&<details><summary>Perché è importante?</summary><p>{t.detail}</p></details>}<div className="task-footer"><span>📍 {t.where}</span>{t.link&&<a href={t.link} target="_blank" rel="noreferrer">Apri sito ufficiale ↗</a>}</div></article>)}</div>
      <div className="bottom-actions"><button className="print-button" onClick={()=>window.print()}>Stampa / salva PDF</button><button className="reset-button" onClick={reset}>Ricomincia</button></div>
      <p className="privacy-note"><span>🔒</span> Le risposte restano su questo dispositivo. Non caricare documenti o dati sanitari.</p>
    </section>
    <footer><b>L68 Navigator</b><span>Una guida pratica gratuita. Verifica sempre i passaggi con gli uffici competenti.</span></footer>
  </main>;
}
