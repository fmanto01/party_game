import { Express } from 'express-serve-static-core';
import { setupUpload } from './questions';
import { setupServerStatus } from './serverStatus';

// IMPORTA TUTTE LE API DEI VARI FILE
export const setupAPI = (app: Express) => {
  setupUpload(app);
  setupServerStatus(app);
}
