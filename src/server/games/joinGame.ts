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

export const joinGame = ({ roomCode, user }): { gameSession: GameSession; myId: string } => {
  if (!gameManager.hasGame(roomCode)) {
    throw new Error('Game not found');
  }

  try {
    // Try to rejoin first in case they're reconnecting
    let playerState: PlayerState;
    try {
      playerState = gameManager.rejoinGame(roomCode, user.id, user.name);
    } catch {
      // If rejoin fails, add as new player
      playerState = gameManager.addPlayer(roomCode, user.id, user.name);
    }

    const gameSession = gameManager.getGameState(roomCode, user.id);
    const myId = gameManager.getPlayerByPlayerId(roomCode, user.id).teamId;

    return { gameSession, myId };
  } catch (error) {
    console.error('Failed to join game:', error);
    throw error;
  }
};
