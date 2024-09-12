import { Express } from 'express-serve-static-core';
import { setupUpload } from './questions.js';
import { setupServerStatus } from './serverStatus.js';
import { setupGame } from './game.js';

// IMPORTA TUTTE LE API DEI VARI FILE
export const setupAPI = (app: Express) => {
  setupUpload(app);
  setupServerStatus(app);
  setupGame(app);
}
