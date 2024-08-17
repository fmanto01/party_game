export interface QuestionData {
  question: string;
  players: string[];
}


export interface PlayerResults {
  score: number;
  image: string;
}

export interface FinalResultsData {
  [player: string]: PlayerResults;
}
