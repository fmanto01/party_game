import { join } from 'node:path';

export function setupRoutes(app, __dirname) {
  app.get('/', (req, res) => {
    res.sendFile(join(__dirname, '../public/html/index.html'));
  });

  app.get('/lobby.html', (req, res) => {
    res.sendFile(join(__dirname, '../public/html/lobby.html'));
  });

  app.get('/game.html', (req, res) => {
    res.sendFile(join(__dirname, '../public/html/game.html'));
  });
}
