import { Game } from './Game.mjs';

export class GameManager {
  constructor() {
    this.games = {}; // A map of lobby codes to game instances
  }

  // Method to create a new game
  createGame(lobbyCode, numQuestionsParam) {
    if (!this.games[lobbyCode]) {
      this.games[lobbyCode] = new Game(lobbyCode, numQuestionsParam);
      return this.games[lobbyCode];
    }
    console.error('Lobby code already exists.');
    return null;

  }

  // Method to get a game by lobby code
  getGame(lobbyCode) {
    return this.games[lobbyCode] || null;
  }

  // Method to delete a game
  deleteGame(lobbyCode) {
    if (this.games[lobbyCode]) {
      delete this.games[lobbyCode];
    } else {
      console.error('Game not found.');
    }
  }

  // Method to list all games
  listGames() {
    return Object.values(this.games);
  }
}
