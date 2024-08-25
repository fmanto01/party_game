import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// Verifica se il file .env esiste
const envFilePath = path.resolve('.env');
const hasEnvFile = fs.existsSync(envFilePath);
console.log('hasEnvFile:', hasEnvFile);

// Comando da eseguire basato sull'esistenza del file .env
const args = hasEnvFile ? ['--env-file=.env', 'dist/index.js'] : ['dist/index.js'];

// Esegui il comando
const child = spawn('nodemon', args, { stdio: 'inherit', shell: true });

// Gestisci l'uscita del processo
child.on('error', (err) => {
  console.error(`Errore: ${err.message}`);
  process.exit(1);
});

child.on('exit', (code, signal) => {
  if (code !== null) {
    console.error(`Processo terminato con codice ${code}`);
    process.exit(code);
  }
  if (signal !== null) {
    console.error(`Processo terminato per segnale ${signal}`);
    process.exit(1);
  }
});
