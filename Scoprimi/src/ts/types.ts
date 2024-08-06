export interface QuestionData {
    question: string;
    players: string[];
}

export interface ResultsData {
    resultMessage: string;
    players: string[];
}

export interface FinalResultsData {
    [player: string]: number;
}
