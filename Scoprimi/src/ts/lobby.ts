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
    console.log('stai ricevendo il render fratello');
    socket.on(c.RENDER_LOBBY, (data) => {
        console.log('Received data:', data); // Log the data received from the socket
        callback(data); // Call the provided callback with the received data
    });
}

export function emitRequestRenderLobby(currentLobbyCode: string) {
    console.log('te quiero render');
    socket.emit(c.REQUEST_RENDER_LOBBY, currentLobbyCode);
}
