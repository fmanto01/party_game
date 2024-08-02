import * as c from '../public/js/socketConsts.mjs';
import { setupSocket } from '../src/socket.mjs';
import { GameManager } from '../src/data/GameManager.mjs';

// Mock del GameManager
jest.mock('../src/data/GameManager.mjs');

const mockIo = {
  on: jest.fn(),
  to: jest.fn().mockReturnThis(),
  emit: jest.fn(),
  join: jest.fn(),
};

const mockQuestions = ['Question 1', 'Question 2', 'Question 3'];

beforeEach(() => {
  jest.clearAllMocks();
  setupSocket(mockIo, mockQuestions);
});

describe('setupSocket', () => {
  it('should handle CONNECTION event correctly', () => {
    const mockSocket = {
      on: jest.fn(),
    };
    mockIo.on.mock.calls[0][1](mockSocket);
    expect(mockSocket.on).toHaveBeenCalled();
  });

  it('should handle LOBBY_CODE event correctly', () => {
    const code = '1234';
    const numQuestionsParam = 2;
    const mockGame = { selectedQuestions: ['Q1', 'Q2'] };

    const createGameSpy = jest.spyOn(GameManager.prototype, 'createGame');
    const getGameSpy = jest.spyOn(GameManager.prototype, 'getGame').mockReturnValue(mockGame);

    mockIo.on.mock.calls[0][1]({
      on: (event, callback) => {
        if (event === c.LOBBY_CODE) {
          callback([code, numQuestionsParam]);
        }
      },
    });

    expect(createGameSpy).toHaveBeenCalledWith(code, numQuestionsParam);
    expect(getGameSpy).toHaveBeenCalled();
    expect(mockGame.selectedQuestions).toHaveLength(numQuestionsParam);

    // Ripristina le funzioni originali
    createGameSpy.mockRestore();
    getGameSpy.mockRestore();
  });

  it('should handle JOIN_LOBBY event correctly', () => {
    const data = { lobbyCode: '1234', playerName: 'Player 1' };
    const mockGame = { addPlayer: jest.fn() };

    const getGameSpy = jest.spyOn(GameManager.prototype, 'getGame').mockReturnValue(mockGame);

    mockIo.on.mock.calls[0][1]({
      on: (event, callback) => {
        if (event === c.JOIN_LOBBY) {
          callback(data);
        }
      },
      join: jest.fn(),
    });

    expect(mockGame.addPlayer).toHaveBeenCalledWith(data.playerName);
    expect(mockIo.emit).toHaveBeenCalledWith(c.ADD_NEW_PLAYER, data.playerName);

    // Ripristina la funzione originale
    getGameSpy.mockRestore();
  });

  it('should handle JOIN_LOBBY event with non-existing lobby', () => {
    const data = { lobbyCode: '5678', playerName: 'Player 2' };

    mockIo.on.mock.calls[0][1]({
      on: (event, callback) => {
        if (event === c.JOIN_LOBBY) {
          callback(data);
        }
      },
      emit: jest.fn(),
    });

    expect(mockIo.emit).toHaveBeenCalledWith(c.ERROR, 'Codice lobby non esistente');
  });

  it('should handle START_GAME event correctly', () => {
    const data = { lobbyCode: '1234' };

    mockIo.on.mock.calls[0][1]({
      on: (event, callback) => {
        if (event === c.START_GAME) {
          callback(data);
        }
      },
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    });

    expect(mockIo.to).toHaveBeenCalledWith(data.lobbyCode);
    expect(mockIo.emit).toHaveBeenCalledWith(c.INIZIA);
  });

  it('should handle READY event correctly', () => {
    const data = { lobbyCode: '1234' };
    const mockGame = {
      getNextQuestion: jest.fn().mockReturnValue({ value: 'Question 1' }),
      players: ['Player 1'],
    };

    const getGameSpy = jest.spyOn(GameManager.prototype, 'getGame').mockReturnValue(mockGame);

    mockIo.on.mock.calls[0][1]({
      on: (event, callback) => {
        if (event === c.READY) {
          callback(data);
        }
      },
      join: jest.fn(),
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    });

    expect(mockIo.to).toHaveBeenCalledWith(data.lobbyCode);
    expect(mockIo.emit).toHaveBeenCalledWith(c.SEND_QUESTION, {
      question: 'Question 1',
      players: ['Player 1'],
    });

    // Ripristina la funzione originale
    getGameSpy.mockRestore();
  });

  it('should handle VOTE event correctly and show results', () => {
    const data = { lobbyCode: '1234', voter: 'Player 1', vote: 'Option A' };
    const mockGame = {
      castVote: jest.fn(),
      isAllPlayersVoter: jest.fn().mockReturnValue(true),
      calculateScores: jest.fn().mockReturnValue('Result'),
      players: ['Player 1'],
    };

    const getGameSpy = jest.spyOn(GameManager.prototype, 'getGame').mockReturnValue(mockGame);

    mockIo.on.mock.calls[0][1]({
      on: (event, callback) => {
        if (event === c.VOTE) {
          callback(data);
        }
      },
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    });

    expect(mockGame.castVote).toHaveBeenCalledWith(data.voter, data.vote);
    expect(mockIo.to).toHaveBeenCalledWith(data.lobbyCode);
    expect(mockIo.emit).toHaveBeenCalledWith(c.SHOW_RESULTS, {
      resultMessage: 'Result',
      players: ['Player 1'],
    });

    // Ripristina la funzione originale
    getGameSpy.mockRestore();
  });

  it('should handle READY_FOR_NEXT_QUESTION event and send next question', () => {
    const data = { lobbyCode: '1234', playerName: 'Player 1' };
    const mockGame = {
      setReadyForNextQuestion: jest.fn(),
      isAllPlayersReady: jest.fn().mockReturnValue(true),
      getNextQuestion: jest.fn().mockReturnValue({ value: 'Question 2', done: false }),
      resetReadyForNextQuestion: jest.fn(),
      players: ['Player 1'],
    };

    const getGameSpy = jest.spyOn(GameManager.prototype, 'getGame').mockReturnValue(mockGame);

    mockIo.on.mock.calls[0][1]({
      on: (event, callback) => {
        if (event === c.READY_FOR_NEXT_QUESTION) {
          callback(data);
        }
      },
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    });

    expect(mockGame.setReadyForNextQuestion).toHaveBeenCalledWith(data.playerName);
    expect(mockGame.resetReadyForNextQuestion).toHaveBeenCalled();
    expect(mockIo.to).toHaveBeenCalledWith(data.lobbyCode);
    expect(mockIo.emit).toHaveBeenCalledWith(c.SEND_QUESTION, {
      question: 'Question 2',
      players: ['Player 1'],
    });

    // Ripristina la funzione originale
    getGameSpy.mockRestore();
  });

  it('should handle READY_FOR_NEXT_QUESTION event when no more questions are available', () => {
    const data = { lobbyCode: '1234', playerName: 'Player 1' };
    const mockGame = {
      setReadyForNextQuestion: jest.fn(),
      isAllPlayersReady: jest.fn().mockReturnValue(true),
      getNextQuestion: jest.fn().mockReturnValue({ value: null, done: true }),
      resetReadyForNextQuestion: jest.fn(),
      players: ['Player 1'],
      playerScores: { 'Player 1': 10 },
    };

    const getGameSpy = jest.spyOn(GameManager.prototype, 'getGame').mockReturnValue(mockGame);

    mockIo.on.mock.calls[0][1]({
      on: (event, callback) => {
        if (event === c.READY_FOR_NEXT_QUESTION) {
          callback(data);
        }
      },
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    });

    expect(mockGame.setReadyForNextQuestion).toHaveBeenCalledWith(data.playerName);
    expect(mockIo.to).toHaveBeenCalledWith(data.lobbyCode);
    expect(mockIo.emit).toHaveBeenCalledWith(c.GAME_OVER);
    expect(mockIo.emit).toHaveBeenCalledWith(c.FINAL_RESULTS, mockGame.playerScores);

    // Ripristina la funzione originale
    getGameSpy.mockRestore();
  });

  it('should handle READY_FOR_NEXT_QUESTION event correctly when all players are not ready', () => {
    const data = { lobbyCode: '1234', playerName: 'Player 1' };
    const mockGame = {
      setReadyForNextQuestion: jest.fn(),
      isAllPlayersReady: jest.fn().mockReturnValue(false),
      getNextQuestion: jest.fn(),
      resetReadyForNextQuestion: jest.fn(),
      players: ['Player 1'],
    };

    const getGameSpy = jest.spyOn(GameManager.prototype, 'getGame').mockReturnValue(mockGame);

    mockIo.on.mock.calls[0][1]({
      on: (event, callback) => {
        if (event === c.READY_FOR_NEXT_QUESTION) {
          callback(data);
        }
      },
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    });

    expect(mockGame.setReadyForNextQuestion).toHaveBeenCalledWith(data.playerName);
    expect(mockGame.resetReadyForNextQuestion).not.toHaveBeenCalled();

    // Ripristina la funzione originale
    getGameSpy.mockRestore();
  });

  // it('should handle LEAVE_LOBBY event correctly', () => {
  //   const data = { lobbyCode: '1234', playerName: 'Player 1' };
  //   const mockGame = {
  //     removePlayer: jest.fn(),
  //     players: [],
  //   };
  //   const deleteGameSpy = jest.spyOn(GameManager.prototype, 'deleteGame').mockImplementation(() => {});

  //   const getGameSpy = jest.spyOn(GameManager.prototype, 'getGame').mockReturnValue(mockGame);

  //   mockIo.on.mock.calls[0][1]({
  //     on: (event, callback) => {
  //       if (event === c.LEAVE_LOBBY) {
  //         callback(data);
  //       }
  //     },
  //     to: jest.fn().mockReturnThis(),
  //     emit: jest.fn(),
  //   });

  //   expect(mockGame.removePlayer).toHaveBeenCalledWith(data.playerName);
  //   expect(mockIo.emit).toHaveBeenCalledWith(c.REMOVED_PLAYER, data.playerName);
  //   expect(deleteGameSpy).toHaveBeenCalledWith(data.lobbyCode);

  //   // Ripristina le funzioni originali
  //   getGameSpy.mockRestore();
  //   deleteGameSpy.mockRestore();
  // });
});
