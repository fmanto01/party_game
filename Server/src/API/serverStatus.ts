import { Express } from 'express-serve-static-core';

export const setupServerStatus = (app: Express) => {

  app.get('/api/status', (req, res) => {
    res.send('Server is up');
  });

}
