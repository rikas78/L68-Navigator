# L68 Navigator

L68 Navigator è un progetto web accessibile per aiutare le persone a orientarsi tra documenti, collocamento mirato ai sensi della Legge 68/99 e ricerca di lavoro.

## Stato

Fondazione iniziale del progetto. Non è ancora un servizio di consulenza legale, medica o di collocamento. Le indicazioni procedurali dovranno essere verificate su fonti istituzionali, con riferimento al territorio e alla data di aggiornamento.

## Obiettivi

- Spiegare le procedure con linguaggio chiaro e passaggi verificabili.
- Organizzare checklist e progressi dell'utente.
- Preparare in una fase successiva un'area personale protetta.
- Supportare curriculum, competenze e ricerca di opportunità.
- Progettare per accessibilità, mobile e navigazione da tastiera.

## Stack previsto

- Next.js e TypeScript
- Nhost per PostgreSQL, autenticazione, GraphQL e storage
- Hosting web da configurare dopo la fondazione applicativa

## Principi di sicurezza

- Non usare dati personali o documenti reali durante i test iniziali.
- Non committare password, token, chiavi segrete o file .env.
- Prima di conservare dati personali, definire e testare autorizzazioni, accessi per ruolo, conservazione e cancellazione.
- Ogni guida procedurale deve citare fonti ufficiali, territorio di riferimento e data di verifica.

## Avvio

La procedura di installazione verrà documentata quando saranno stati aggiunti i file applicativi e verificate le dipendenze.

## Roadmap

1. Fondazione dell'applicazione e interfaccia accessibile.
2. Configurazione del client Nhost tramite variabili d'ambiente.
3. Schema PostgreSQL e autorizzazioni per ruolo.
4. Autenticazione e area personale.
5. Percorsi guidati basati su fonti ufficiali.
6. Test funzionali, sicurezza, privacy e deploy.

## Pubblicazione

Per pubblicare l'applicazione con deploy automatici dal repository GitHub, segui [`docs/DEPLOY_VERCEL.md`](docs/DEPLOY_VERCEL.md). Vercel deve essere collegato al repository dall'account del proprietario; questa autorizzazione va confermata nella dashboard Vercel.
