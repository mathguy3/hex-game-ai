import { User } from '../user/id';
import { MapState } from '../../types';
import { GameState, LocalState } from '../../types/game';
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

export const joinGame = (params: { roomCode: string; user: User }): { gameSession: GameSession } => {
  const { roomCode, user } = params;
  if (!gameManager.hasGame(roomCode)) {
    throw new Error('Game not found');
  }

  try {
    gameManager.joinGame(roomCode, user.userId, user.userName);

    const gameSession = gameManager.getGameState(roomCode, user.userId);

    return { gameSession };
  } catch (error) {
    console.error('Failed to join game:', error);
    throw error;
  }
};
