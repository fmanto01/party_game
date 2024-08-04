import * as c from '../../../server/src/socketConsts.js';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

export function handleToggleisReadyToGame(data: { currentLobbyCode: string, currentPlayer: string }) {
    socket.emit(c.TOGGLE_IS_READY_TO_GAME, data);
}

// TODO fix
export function listenToInizia(navigate: (url: string) => void) {

    socket.on('inizia', (data) => {
        const queryParams = new URLSearchParams({ lobbyCode: data.lobbyCode, playerName: data.playerName });
        navigate(`/lobby?${queryParams.toString()}`);
    });
}

export function listenToRenderLobby(callback: (data: { game: any }) => void) {
    socket.on(c.RENDER_LOBBY, callback);
}

export function emitRequestRenderLobby(currentLobbyCode: string) {
    socket.emit(c.REQUEST_RENDER_LOBBY, currentLobbyCode);
}
