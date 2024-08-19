export class Game {

  public lobbyCode: string;
  public isGameStarted: boolean;
  public players: string[];
  public numOfVoters: number;
  public currentQuestionIndex: number;
  public numQuestions: number;
  public selectedQuestions: string[];
  public iterator: Iterator<string>;
  public playerSocketIds: { [key: string]: string };
  public votes: { [key: string]: number };
  public playerScores: { [key: string]: number };
  public readyForNextQuestion: { [key: string]: boolean };
  public isReadyToGame: { [key: string]: boolean };
  public images: { [key: string]: string };

  constructor(lobbyCode: string, numQuestions: number) {
    this.lobbyCode = lobbyCode;
    this.isGameStarted = false;
    this.players = [];
    this.numOfVoters = 0;
    this.currentQuestionIndex = 0;
    this.numQuestions = numQuestions >= 5 ? numQuestions : 5;
    this.selectedQuestions = [];
    this.iterator = this.createIterator();
    // Player denormalizzato
    this.playerSocketIds = {}
    this.votes = {};
    this.playerScores = {};
    this.readyForNextQuestion = {};
    this.isReadyToGame = {};
    this.images = {};
  }

  calculateScores(): string {
    const validVotes = Object.keys(this.votes).filter(player => this.votes[player] > 0 && player !== '');
    const maxVotes = validVotes.length > 0 ? Math.max(...Object.values(this.votes)) : 0;
    const winners = validVotes.filter(player => this.votes[player] === maxVotes);

    let resultMessage: string;

    if (validVotes.length === 0 || winners.length > 1) {
      // Se tutti i voti sono vuoti o c'è un pareggio
      resultMessage = 'Pareggio! Nessun punto assegnato';
    } else {
      // Se c'è un vincitore
      const winner = winners[0];
      this.playerScores[winner] += 1;
      resultMessage = `+ 1 punto a chi ha scelto ${winner}`;
    }

    this.resetVoters();
    return resultMessage;
  }

  resetVoters(): void {
    this.numOfVoters = 0;
    Object.keys(this.votes).forEach(player => this.votes[player] = 0);
  }

  addPlayer(playerName: string, socketId: string, image: string): void {
    if (!this.players.includes(playerName)) {
      this.players.push(playerName);
      this.playerScores[playerName] = 0; // Initialize score for new player
      this.readyForNextQuestion[playerName] = false; // Set readiness status
      this.votes[playerName] = 0;
      this.isReadyToGame[playerName] = false;
      this.playerSocketIds[playerName] = socketId;
      this.images[playerName] = image;
    }
  }

  removePlayer(playerName: string): void {
    const index = this.players.indexOf(playerName);
    if (index !== -1) {
      this.players.splice(index, 1);
      delete this.playerScores[playerName];
      delete this.readyForNextQuestion[playerName];
      delete this.isReadyToGame[playerName];
    }
  }

  toogleIsReadyToGame(playerName: string): void {
    this.isReadyToGame[playerName] = !this.isReadyToGame[playerName];
  }

  setNumQuestions(num: number): void {
    if (num >= 5) {
      this.numQuestions = num;
    } else {
      console.error('Il numero minimo di domande è 5.');
    }
  }

  selectQuestions(questions: string[]): void {
    if (questions.length >= this.numQuestions) {
      this.selectedQuestions = questions.slice(0, this.numQuestions);
    } else {
      console.error('Non ci sono abbastanza domande.');
    }
  }

  castVote(playerName: string, vote: string): void {
    if (this.players.includes(playerName)) {
      if (!this.votes[vote]) {
        this.votes[vote] = 0;
      }
      this.votes[vote]++;
    } else {
      console.error('Giocatore non trovato.');
    }
    this.numOfVoters++;
  }

  didAllPlayersVote(): boolean {
    return this.numOfVoters === this.players.length;
  }

  updateScore(playerName: string, score: number): void {
    if (this.players.includes(playerName)) {
      this.playerScores[playerName] = (this.playerScores[playerName] || 0) + score;
    } else {
      console.error('Giocatore non trovato.');
    }
  }

  setReadyForNextQuestion(playerName: string): void {
    if (this.players.includes(playerName)) {
      this.readyForNextQuestion[playerName] = true;
    } else {
      console.error('Giocatore non trovato.');
    }
  }

  getCurrentQuestion(): string | null {
    return this.selectedQuestions[this.currentQuestionIndex] || null;
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.selectedQuestions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      console.log('No more questions.');
    }
  }

  isAllPlayersReady(): boolean {
    return this.players.every(player => this.readyForNextQuestion[player]);
  }

  isAllPlayersReadyToGame(): boolean {
    return this.players.every(player => this.isReadyToGame[player]);
  }

  getNextQuestion(): IteratorResult<string> {
    return this.iterator.next();
  }

  *createIterator(): IterableIterator<string> {
    for (const question of this.selectedQuestions) {
      yield question;
    }
  }

  resetReadyForNextQuestion(): void {
    this.players.forEach(player => {
      this.readyForNextQuestion[player] = false;
    });
  }
}
