import { join } from 'node:path';

export function setupRoutes(app, __dirname) {
  app.get('/', (req, res) => {
    res.sendFile(join(__dirname, '../public/html/index.html'));
  });

  app.get('/client.html', (req, res) => {
    res.sendFile(join(__dirname, '../public/html/client.html'));
  });

  app.get('/game.html', (req, res) => {
    res.sendFile(join(__dirname, '../public/html/game.html'));
  });
}
