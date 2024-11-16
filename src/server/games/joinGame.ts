import { MapState } from '../../types';
import { GameState, LocalState, PlayerState } from '../../types/game';
import { gameManager, GameSession } from './gameManager';

export interface JoinGameResponse {
    meId: string;
    players: Array<{
        id: string;
        name: string;
        teamId: string;
        type: string;
    }>;
    gameState: GameState;
    mapState: MapState;
    localState: LocalState;
}

export const joinGame = ({ gameId, user }): GameSession => {
    if (!gameManager.hasGame(gameId)) {
        throw new Error('Game not found');
    }

    try {
        // Try to rejoin first in case they're reconnecting
        let playerState: PlayerState;
        try {
            playerState = gameManager.rejoinGame(gameId, user.id, user.name);
        } catch {
            // If rejoin fails, add as new player
            playerState = gameManager.addPlayer(gameId, user.id, user.name);
        }

        return gameManager.getGameState(gameId, user.id);
    } catch (error) {
        console.error('Failed to join game:', error);
        throw error;
    }
};