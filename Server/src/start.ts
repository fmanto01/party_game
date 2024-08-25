import { spawn } from 'child_process';
import * as fs from 'fs';

// Verifica se il file .env esiste
const hasEnvFile = fs.existsSync('.env');
console.log('hasEnvFile', hasEnvFile);

// Comando da eseguire basato sull'esistenza del file .env
const command = hasEnvFile ? 'nodemon' : 'nodemon';
const args = hasEnvFile ? ['--env-file=.env', 'dist/index.js'] : ['dist/index.js'];

// Esegui il comando
const child = spawn(command, args, { stdio: 'inherit' });

// Gestisci l'uscita del processo
child.on('error', (err) => {
  console.error(`Errore: ${err.message}`);
  process.exit(1);
});

child.on('exit', (code, signal) => {
  if (code) {
    console.error(`Processo terminato con codice ${code}`);
    process.exit(code);
  }
  if (signal) {
    console.error(`Processo terminato per segnale ${signal}`);
    process.exit(1);
  }
});
