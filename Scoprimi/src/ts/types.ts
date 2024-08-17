export interface QuestionData {
  question: string;
  players: string[];
}


export interface PlayerScores {
  [player: string]: number;
}

export interface PlayerImages {
  [player: string]: string;
}

// Interfaccia per i risultati di un singolo giocatore
export interface PlayerResult {
  score: number;
  image: string;
}

// Interfaccia per i risultati finali del gioco
export interface FinalResultData {
  [playerName: string]: PlayerResult;
}
