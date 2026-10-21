# Pubblicazione su Vercel tramite GitHub

## Scelta consigliata

Vercel è la scelta iniziale per questa applicazione perché riconosce Next.js e può distribuire automaticamente gli aggiornamenti quando vengono inviati al branch collegato di GitHub.

## Importare il repository

1. Accedi a https://vercel.com/ usando il tuo account.
2. Scegli **Add New → Project**.
3. Collega GitHub, se richiesto, e autorizza soltanto il repository `rikas78/L68-Navigator`.
4. Seleziona **Import** accanto a `L68-Navigator`.
5. Lascia che Vercel rilevi Next.js. Root Directory: `./`; Build Command e Output Directory: usa i valori predefiniti rilevati.
6. Prima del primo deploy puoi lasciare non configurate le variabili Nhost: la homepage attuale non richiede ancora il backend per essere visualizzata.
7. Avvia il deploy.

## Deploy automatico

Dopo l'importazione, Vercel crea un webhook GitHub. I commit sul branch di produzione selezionato avviano un nuovo deploy; i branch e le pull request possono produrre preview in base alle impostazioni del progetto.

## Collegamento a Nhost (fase successiva)

Quando il client Nhost verrà effettivamente integrato nell'applicazione:

1. Apri **Project Settings → Environment Variables** in Vercel.
2. Aggiungi `NHOST_SUBDOMAIN` e `NHOST_REGION` per gli ambienti necessari.
3. Usa il subdomain e la regione mostrati nella dashboard Nhost; non inventare o copiare chiavi segrete in file versionati.
4. Esegui un nuovo deploy dopo aver salvato le variabili.

La homepage iniziale non usa ancora l'autenticazione Nhost né interroga il database. Non considerare completata l'integrazione finché non sono implementati e testati login, permessi Hasura e gestione degli errori.

## Controlli prima di considerare il sito pronto

- Verificare che il deploy termini senza errori.
- Aprire la homepage da desktop e telefono.
- Verificare navigazione da tastiera e riduzione delle animazioni.
- Configurare e testare le autorizzazioni prima di salvare dati personali.
- Non caricare documenti sanitari o certificati nella versione attuale.
