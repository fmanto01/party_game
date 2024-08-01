export class Game {
  constructor(lobbyCode, numQuestions) {
    this.lobbyCode = lobbyCode;
    this.players = [];
    this.numOfVoters = 0;
    this.currentQuestionIndex = 0;
    this.numQuestions = numQuestions >= 5 ? numQuestions : 5;; // Default value
    this.selectedQuestions = [];
    this.iterator = this.createIterator();
    // player denormalizzato, sono 3 Map
    this.votes = {};
    this.playerScores = {}; // For tracking player scores
    this.readyForNextQuestion = {}; // Track readiness for next question
  }

  calculateScores() {
    const maxVotes = Math.max(...Object.values(this.votes));
    const winners = Object.keys(this.votes).filter(player => this.votes[player] === maxVotes);

    let resultMessage;
    if (winners.length > 1) {
      resultMessage = 'Pareggio! Nessun punto assegnato';
    } else {
      const winner = winners[0];
      this.playerScores[winner] += 1;
      resultMessage = `+ 1 punto a chi ha scelto ${winner}`;
    }
    this.resetVoters();
    return resultMessage;
  }

  resetVoters(){
    this.numOfVoters = 0;
    Object.keys(this.votes).forEach(player => this.votes[player] = 0);
  }

  // Method to add a new player
  addPlayer(playerName) {
    if (!this.players.includes(playerName)) {
      this.players.push(playerName);
      this.playerScores[playerName] = 0; // Initialize score for new player
      this.readyForNextQuestion[playerName] = false; // Set readiness status
      this.votes[playerName] = 0;
    }
  }

  removePlayer(playerName) {
    const index = this.players.indexOf(playerName);
    if (index !== -1) {
      this.players.splice(index, 1);
      delete this.playerScores[playerName];
      delete this.readyForNextQuestion[playerName];
    }
  }

  // Method to set number of questions
  setNumQuestions(num) {
    if (num >= 5) {
      this.numQuestions = num;
    } else {
      console.error('Il numero minimo di domande è 5.');
    }
  }

  // Method to select questions
  selectQuestions(questions) {
    if (questions.length >= this.numQuestions) {
      this.selectedQuestions = questions.slice(0, this.numQuestions);
    } else {
      console.error('Non ci sono abbastanza domande.');
    }
  }

  // Method to handle votes
  castVote(playerName, vote) {
    if (this.players.includes(playerName)) {
      this.votes[vote]++;
    } else {
      console.error('Giocatore non trovato.');
    }
    this.numOfVoters++;
  }

  isAllPlayerVoter(){
    return this.numOfVoters === this.players.length;
  }

  // Method to update player scores
  updateScore(playerName, score) {
    if (this.players.includes(playerName)) {
      this.playerScores[playerName] = (this.playerScores[playerName] || 0) + score;
    } else {
      console.error('Giocatore non trovato.');
    }
  }

  // Method to set readiness for next question
  setReadyForNextQuestion(playerName) {
    if (this.players.includes(playerName)) {
      this.readyForNextQuestion[playerName] = true;
    } else {
      console.error('Giocatore non trovato.');
    }
  }

  // Method to get current question
  getCurrentQuestion() {
    return this.selectedQuestions[this.currentQuestionIndex] || null;
  }

  // Method to move to the next question
  nextQuestion() {
    if (this.currentQuestionIndex < this.selectedQuestions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      console.log('No more questions.');
    }
  }

  // Method to check if all players are ready
  isAllPlayersReady() {
    return this.players.every(player => this.readyForNextQuestion[player]);
  }

  getNextQuestion() {
    return this.iterator.next();
  }

  *createIterator() {
    for (const question of this.selectedQuestions) {
      yield question;
    }
  }
  
  resetReadyForNextQuestion() {
    this.players.forEach(player => {
      this.readyForNextQuestion[player] = false;
    });
  }
}
