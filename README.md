# Party_game
Party game ispirato a "Dimmi chi sei!"

## Fuzionamento
In questo gioco un gruppo di persone si connette ad una lobby e gli vengono proposte delle domande, ognuno deve votare chi secondo lui è la persona più adatta al tipo di domanda. Guadagnano punto tutti coloro che hanno votato la maggioranza (se presente)

### Flusso di Gioco
1. I giocatori si connettono a una lobby inserendo un codice o tramite invito dall'host.
2. Viene presentata una domanda a tutti i partecipanti.
3. Ogni giocatore vota chi, secondo lui, meglio risponde alla descrizione della domanda.
4. Punti vengono assegnati a coloro che hanno votato per la maggioranza.
5. Il gioco continua per un certo numero di turni, e il giocatore con più punti alla fine vince.

## Stack Tecnologico
- **Frontend**: React, Bootstrap, CSS per lo stile.
- **Backend**: Express, Node.js.
- **Database**: Attualmente non in utilizzo


## Installazione e avvio

Clone del repository
```
git clone https://github.com/fmanto01/party_game.git && cd Party_game/
cd Party_game/

```
Server
```
cd Server/
npm install
npm run start
```

Client - Scoprimi
```
cd Scoprimi/
npm install
npm run dev

```
