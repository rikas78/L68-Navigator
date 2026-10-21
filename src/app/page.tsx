"use client";

import { useEffect, useMemo, useState } from "react";

type Answer = "yes" | "no" | "unsure";
type Task = { id:string; title:string; action:string; where:string; link?:string; detail?:string };

const questions = [
  { id:"recognition", title:"Hai il verbale d'invalidità?", options:[{value:"yes",label:"Sì"},{value:"no",label:"No"},{value:"unsure",label:"Non lo so"}] },
  { id:"conclusion", title:"Hai la documentazione per il collocamento mirato?", options:[{value:"yes",label:"Sì"},{value:"no",label:"No"},{value:"unsure",label:"Non lo so"}] },
  { id:"registered", title:"Sei già iscritta alla Legge 68/99?", options:[{value:"yes",label:"Sì"},{value:"no",label:"No"},{value:"unsure",label:"Non lo so"}] },
];

export default function Home() {
  const [region,setRegion]=useState("Lombardia");
  const [answers,setAnswers]=useState<Record<string,Answer>>({});
  const [checked,setChecked]=useState<string[]>([]);
  const [loaded,setLoaded]=useState(false);
  const [guided,setGuided]=useState(false);
  const [guideStep,setGuideStep]=useState(0);
  const guideSteps = [
    {title:"Apri il sito INPS",text:"Prova a usare il sito nel pannello a sinistra. Se non si apre, usa il link per aprirlo in una nuova scheda."},
    {title:"Trova Accedi o MyINPS",text:"Cerca la voce di accesso. La posizione cambia tra computer e telefono."},
    {title:"Scegli il tuo metodo",text:"Segui le istruzioni del servizio SPID, CIE o CNS che utilizzi. Non condividere PIN o codici."},
    {title:"Cerca il servizio indicato",text:"Usa la ricerca INPS per trovare il servizio indicato dall’ufficio competente. Alcuni passaggi si fanno al Centro per l’impiego."},
    {title:"Verifica prima di confermare",text:"Leggi i dati e le istruzioni con attenzione. Se qualcosa non è chiaro, fermati e chiedi assistenza."}
  ];

  useEffect(()=>{
    try {
      const raw=window.localStorage.getItem("l68navigator-v3");
      if(raw){const d=JSON.parse(raw);setRegion(d.region||"Lombardia");setAnswers(d.answers||{});setChecked(Array.isArray(d.checked)?d.checked:[]);}
    } catch {}
    setLoaded(true);
  },[]);
  useEffect(()=>{
    if(!loaded)return;
    try {window.localStorage.setItem("l68navigator-v3",JSON.stringify({region,answers,checked}));} catch {}
  },[region,answers,checked,loaded]);

  const tasks=useMemo<Task[]>(()=>{
    const a=answers.recognition;
    const b=answers.conclusion;
    const c=answers.registered;
    return [
      {id:"recognition",title:a==="yes"?"Verbale d'invalidità: verificato":a==="no"?"Informati sul verbale d'invalidità":"Verifica il verbale d'invalidità",action:a==="yes"?"Hai indicato che hai già il verbale. Tienilo a disposizione e passa al prossimo punto.":a==="no"?"Contatta il medico di base o l'INPS e chiedi da dove iniziare.":"Controlla i documenti che hai oppure chiedi all'INPS come verificare la tua situazione.",where:"INPS",link:"https://www.inps.it/"},
      {id:"documents",title:b==="yes"?"Documentazione: verificata":b==="no"?"Chiedi quale documento manca":"Verifica i documenti necessari",action:b==="yes"?"Hai indicato che hai la documentazione. Chiedi all'ufficio se è completa e aggiornata.":"Contatta il Centro per l'impiego o il servizio che ti segue. Chiedi il nome esatto del documento necessario e chi deve rilasciarlo.",where:"Centro per l'impiego / servizio competente",link:"https://www.lavoro.gov.it/",detail:"Prima di prenotare visite o sostenere spese, fatti confermare la procedura adatta al tuo caso."},
      {id:"registration",title:c==="yes"?"Iscrizione: già effettuata":c==="no"?"Chiedi come iscriverti al collocamento mirato":"Verifica se sei già iscritta",action:c==="yes"?"Hai indicato che sei già iscritta. Chiedi se devi aggiornare la tua posizione.":"Contatta l'ufficio competente e chiedi quali requisiti e documenti servono e come fissare un appuntamento.",where:"Centro per l'impiego – Collocamento mirato",link:"https://www.lavoro.gov.it/"},
      {id:"region",title:"Apri i servizi della tua Regione",action:"Cerca le informazioni ufficiali sui servizi per il lavoro nella tua provincia.",where:region,link:region==="Lombardia"?"https://www.regione.lombardia.it/":"https://www.lavoro.gov.it/"},
      {id:"cv",title:"Prepara il curriculum",action:"Scrivi esperienze, competenze e lavori che ti interessano. Non inserire diagnosi o dettagli sanitari.",where:"Il tuo computer o telefono"},
      {id:"work",title:"Scegli il prossimo obiettivo",action:"Annota 2–3 lavori che vorresti fare e la zona in cui puoi lavorare.",where:"Il tuo elenco personale"}
    ];
  },[answers,region]);

  const completed=checked.filter(id=>tasks.some(t=>t.id===id)).length;
  const progress=Math.round(completed/tasks.length*100);
  function toggleTask(id:string){setChecked(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);}
  function reset(){if(window.confirm("Vuoi cancellare il percorso salvato su questo dispositivo?")){setAnswers({});setChecked([]);setRegion("Lombardia");window.localStorage.removeItem("l68navigator-v3");}}

  return <main className="app-shell">
    <header className="topbar"><a className="brand" href="/"><span className="brand-mark">68</span><span>L68 <b>Navigator</b></span></a><span className="free-label">GRATUITO · SENZA REGISTRAZIONE</span></header>
    <section className="hero"><div className="hero-copy"><p className="eyebrow">IL TUO PROSSIMO PASSO, CHIARO</p><h1>Troviamo la strada.<br/><span>Un passo alla volta.</span></h1><p>Rispondi alle 3 domande: la checklist qui sotto si aggiorna subito.</p><div className="hero-actions"><a className="start-button" href="#domande">Inizia da qui <span aria-hidden="true">↓</span></a><button className="guided-button" onClick={()=>{setGuided(v=>!v);setGuideStep(0);}}>{guided?"Chiudi guida":"Apri guida affiancata ↗"}</button></div></div><div className="hero-art" aria-hidden="true"><div className="art-circle"><span>✓</span></div><div className="art-card art-card-one"><b>01</b> Capisci da dove partire</div><div className="art-card art-card-two"><b>02</b> Segui la checklist</div></div></section>
    {guided && <section className="guided-workspace" id="guida-affiancata"><div className="guided-heading"><div><p className="eyebrow">MODALITÀ ACCOMPAGNATA</p><h2>INPS + guida passo passo</h2><p>Segui le istruzioni a destra mentre consulti il sito a sinistra.</p></div><button className="reset-button" onClick={()=>setGuided(false)}>Chiudi</button></div><div className="guided-columns"><div className="inps-panel"><div className="panel-bar"><b>Sito ufficiale INPS</b><a href="https://www.inps.it/" target="_blank" rel="noreferrer">Apri in una nuova scheda ↗</a></div><iframe title="Sito ufficiale INPS" src="https://www.inps.it/" loading="lazy" /><p className="iframe-note">Se il sito non si carica qui, aprilo in una nuova scheda. Alcuni portali impediscono l’apertura incorporata.</p></div><aside className="guide-panel"><div className="guide-count">PASSAGGIO {guideStep+1} DI {guideSteps.length}</div><div className="guide-progress"><span style={{width:((guideStep+1)/guideSteps.length*100)+"%"}} /></div><h3>{guideSteps[guideStep].title}</h3><p>{guideSteps[guideStep].text}</p><div className="guide-nav"><button className="reset-button" disabled={guideStep===0} onClick={()=>setGuideStep(s=>Math.max(0,s-1))}>← Indietro</button><button className="print-button" onClick={()=>setGuideStep(s=>s===guideSteps.length-1?0:s+1)}>{guideStep===guideSteps.length-1?"Ricomincia":"Avanti →"}</button></div><a className="guide-official-link" href="https://www.inps.it/" target="_blank" rel="noreferrer">Vai al sito INPS ↗</a></aside></div></section>}
    <section className="content" id="domande">
      <div className="section-title"><span className="step-dot">1</span><div><h2>Facciamo il punto</h2><p>Scegli una risposta per ogni domanda. Le attività sotto cambiano in base alle risposte.</p></div></div>
      <div className="question-grid">{questions.map((q,i)=><fieldset className="question-card" key={q.id}><legend><span className="question-number">{String(i+1).padStart(2,"0")}</span>{q.title}</legend><div className="answer-options">{q.options.map(o=><label className={answers[q.id]===o.value?"answer-option selected":"answer-option"} key={o.value}><input type="radio" name={q.id} value={o.value} checked={answers[q.id]===o.value} onChange={()=>setAnswers(prev=>({...prev,[q.id]:o.value as Answer}))}/><span>{o.label}</span></label>)}</div></fieldset>)}</div>
      <div className="region-row"><label htmlFor="region">Dove vivi?</label><select id="region" value={region} onChange={e=>setRegion(e.target.value)}><option>Lombardia</option><option>Piemonte</option><option>Veneto</option><option>Emilia-Romagna</option><option>Lazio</option><option>Toscana</option><option>Liguria</option><option>Campania</option><option>Puglia</option><option>Sicilia</option><option>Sardegna</option><option>Marche</option><option>Umbria</option><option>Abruzzo</option><option>Calabria</option><option>Basilicata</option><option>Molise</option><option>Friuli-Venezia Giulia</option><option>Trentino-Alto Adige</option><option>Valle d'Aosta</option></select><span>La provincia può cambiare i passaggi: chiedi conferma all'ufficio competente.</span></div>
      <div className="section-title next-title"><span className="step-dot purple">2</span><div><h2>I tuoi prossimi passi</h2><p>La checklist resta sempre visibile. Spunta ogni attività quando l'hai completata.</p></div></div>
      <div className="progress-card"><div className="progress-copy"><b>{completed} di {tasks.length}</b><span>passi completati</span></div><div className="progress-track" role="progressbar" aria-label="Avanzamento checklist" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span style={{width:progress+"%"}}/></div><strong>{progress}%</strong></div>
      <div className="task-grid">{tasks.map((t,i)=><article key={t.id} className={checked.includes(t.id)?"task-card done":"task-card"}><div className="task-top"><span className="task-number">{String(i+1).padStart(2,"0")}</span><label className="task-toggle"><input type="checkbox" checked={checked.includes(t.id)} onChange={()=>toggleTask(t.id)}/><span>{checked.includes(t.id)?"Fatto":"Da fare"}</span></label></div><h3>{t.title}</h3><p>{t.action}</p>{t.detail&&<details><summary>Perché è importante?</summary><p>{t.detail}</p></details>}<div className="task-footer"><span>📍 {t.where}</span>{t.link&&<a href={t.link} target="_blank" rel="noreferrer">Apri sito ufficiale ↗</a>}</div></article>)}</div>
      <div className="bottom-actions"><button className="print-button" onClick={()=>window.print()}>Stampa / salva PDF</button><button className="reset-button" onClick={reset}>Ricomincia</button></div>
      <p className="privacy-note"><span>🔒</span> Le risposte restano su questo dispositivo. Non caricare documenti o dati sanitari.</p>
    </section>
    <footer><b>L68 Navigator</b><span>Una guida pratica gratuita. Verifica sempre i passaggi con gli uffici competenti.</span></footer>
  </main>;
}
