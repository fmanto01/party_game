import * as c from '../public/js/socketConsts.mjs';
import { setupSocket } from '../src/socket.mjs';
import { GameManager } from '../src/data/GameManager.mjs';

jest.mock('../src/data/GameManager.mjs');

const mockIo = {
  on: jest.fn(),
  to: jest.fn().mockReturnThis(),
  emit: jest.fn(),
  join: jest.fn(),
};

const mockSocket = {
  on: jest.fn(),
  emit: jest.fn(),
  join: jest.fn(),
};

const mockQuestions = ['Question 1', 'Question 2', 'Question 3'];

beforeEach(() => {
  jest.clearAllMocks();
});

describe('setupSocket', () => {
  it('should handle LOBBY_CODE event correctly', () => {
    const code = '1234';
    const numQuestionsParam = 2;

    setupSocket(mockIo, mockQuestions);

    mockIo.on.mock.calls[0][1]([code, numQuestionsParam]);

    expect(GameManager.prototype.createGame).toHaveBeenCalledWith(code, numQuestionsParam);
    expect(GameManager.prototype.getGame).toHaveBeenCalledWith(code);
    expect(GameManager.prototype.getGame().selectedQuestions).toEqual(
      expect.arrayContaining(mockQuestions),
    );
  });

  it('should handle JOIN_LOBBY event correctly when lobby exists', () => {
    const data = { lobbyCode: '1234', playerName: 'Player 1' };
    const mockGame = { addPlayer: jest.fn() };
    GameManager.prototype.getGame.mockReturnValue(mockGame);

    setupSocket(mockIo, mockQuestions);

    mockIo.on.mock.calls[1][1](data);

    expect(mockGame.addPlayer).toHaveBeenCalledWith(data.playerName);
    expect(mockIo.emit).toHaveBeenCalledWith(c.ADD_NEW_PLAYER, data.playerName);
  });

  it('should handle JOIN_LOBBY event with non-existing lobby', () => {
    const data = { lobbyCode: '5678', playerName: 'Player 2' };

    setupSocket(mockIo, mockQuestions);

    mockIo.on.mock.calls[1][1](data);

    expect(mockIo.emit).toHaveBeenCalledWith(c.ERROR, 'Codice lobby non esistente');
  });

  it('should handle START_GAME event correctly', () => {
    const data = { lobbyCode: '1234' };

    setupSocket(mockIo, mockQuestions);

    mockIo.on.mock.calls[2][1](data);

    expect(mockIo.to).toHaveBeenCalledWith(data.lobbyCode);
    expect(mockIo.emit).toHaveBeenCalledWith(c.INIZIA);
  });

  it('should handle READY event correctly', () => {
    const data = { lobbyCode: '1234' };
    const mockGame = {
      getNextQuestion: jest.fn().mockReturnValue({ value: 'Question 1' }),
      players: ['Player 1'],
    };
    GameManager.prototype.getGame.mockReturnValue(mockGame);

    setupSocket(mockIo, mockQuestions);

    mockIo.on.mock.calls[3][1](data);

    expect(mockIo.to).toHaveBeenCalledWith(data.lobbyCode);
    expect(mockIo.emit).toHaveBeenCalledWith(c.SEND_QUESTION, {
      question: 'Question 1',
      players: ['Player 1'],
    });
  });

  it('should handle VOTE event correctly and show results', () => {
    const data = { lobbyCode: '1234', voter: 'Player 1', vote: 'Option A' };
    const mockGame = {
      castVote: jest.fn(),
      isAllPlayersVoter: jest.fn().mockReturnValue(true),
      calculateScores: jest.fn().mockReturnValue('Result'),
      players: ['Player 1'],
    };
    GameManager.prototype.getGame.mockReturnValue(mockGame);

    setupSocket(mockIo, mockQuestions);

    mockIo.on.mock.calls[4][1](data);

    expect(mockGame.castVote).toHaveBeenCalledWith(data.voter, data.vote);
    expect(mockIo.to).toHaveBeenCalledWith(data.lobbyCode);
    expect(mockIo.emit).toHaveBeenCalledWith(c.SHOW_RESULTS, {
      resultMessage: 'Result',
      players: ['Player 1'],
    });
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
    GameManager.prototype.getGame.mockReturnValue(mockGame);

    setupSocket(mockIo, mockQuestions);

    mockIo.on.mock.calls[5][1](data);

    expect(mockGame.setReadyForNextQuestion).toHaveBeenCalledWith(data.playerName);
    expect(mockGame.resetReadyForNextQuestion).toHaveBeenCalled();
    expect(mockIo.to).toHaveBeenCalledWith(data.lobbyCode);
    expect(mockIo.emit).toHaveBeenCalledWith(c.SEND_QUESTION, {
      question: 'Question 2',
      players: ['Player 1'],
    });
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
    GameManager.prototype.getGame.mockReturnValue(mockGame);

    setupSocket(mockIo, mockQuestions);

    mockIo.on.mock.calls[5][1](data);

    expect(mockGame.setReadyForNextQuestion).toHaveBeenCalledWith(data.playerName);
    expect(mockIo.to).toHaveBeenCalledWith(data.lobbyCode);
    expect(mockIo.emit).toHaveBeenCalledWith(c.GAME_OVER);
    expect(mockIo.emit).toHaveBeenCalledWith(c.FINAL_RESULTS, mockGame.playerScores);
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
    GameManager.prototype.getGame.mockReturnValue(mockGame);

    setupSocket(mockIo, mockQuestions);

    mockIo.on.mock.calls[5][1](data);

    expect(mockGame.setReadyForNextQuestion).toHaveBeenCalledWith(data.playerName);
    expect(mockGame.resetReadyForNextQuestion).not.toHaveBeenCalled();
  });

  it('should handle multiple JOIN_LOBBY events correctly', () => {
    const data1 = { lobbyCode: '1234', playerName: 'Player 1' };
    const data2 = { lobbyCode: '1234', playerName: 'Player 2' };
    const mockGame = { addPlayer: jest.fn() };
    GameManager.prototype.getGame.mockReturnValue(mockGame);

    setupSocket(mockIo, mockQuestions);

    mockIo.on.mock.calls[1][1](data1);
    mockIo.on.mock.calls[1][1](data2);

    expect(mockGame.addPlayer).toHaveBeenCalledWith('Player 1');
    expect(mockGame.addPlayer).toHaveBeenCalledWith('Player 2');
    expect(mockIo.emit).toHaveBeenCalledWith(c.ADD_NEW_PLAYER, 'Player 1');
    expect(mockIo.emit).toHaveBeenCalledWith(c.ADD_NEW_PLAYER, 'Player 2');
  });

  it('should not send a question if READY event is fired before game start', () => {
    const data = { lobbyCode: '1234' };
    const mockGame = {
      getNextQuestion: jest.fn().mockReturnValue({ value: null }),
    };
    GameManager.prototype.getGame.mockReturnValue(mockGame);

    setupSocket(mockIo, mockQuestions);

    mockIo.on.mock.calls[3][1](data);

    expect(mockIo.emit).not.toHaveBeenCalledWith(c.SEND_QUESTION);
  });
});
