import { ActionRequest, ActionSubject } from '../../logic/game-controller/sequencer';
import { GameState } from '../../types/game';
import { createPatch, Patch } from '../../utils/statePatch';
import { User } from '../user/id';
import { gameManager } from './gameManager';

interface ActionResponse {
  gameState: GameState;
  patch: Patch<{ gameState: GameState }>;
}

export const ackAnnounce = (params: { roomCode: string; user: User }): ActionResponse => {
  const { roomCode, user } = params;
  const request: ActionRequest = {
    type: 'ackAnnounce',
    playerId: gameManager.getPlayerIdForRoom(roomCode, user.userId),
  };
  if (!roomCode || !user) {
    throw new Error('Missing required parameters: roomCode and user are required');
  }

  if (!gameManager.hasGame(roomCode)) {
    throw new Error(`Game with id ${roomCode} not found`);
  }

  try {
    // Handle the action and get the response
    const response = gameManager.handleAction(roomCode, user.userId, request);

    // Validate the response
    if (!response.gameState) {
      throw new Error('Invalid game state after action');
    }

    const { gameState, localControl } = gameManager.getGameState(roomCode, user.userId);

    const patch = createPatch(
      { gameState, localControl },
      { gameState: response.gameState, localControl: response.localControl }
    );

    console.log(patch);

    return { ...response, patch };
  } catch (error) {
    console.error('Error handling action:', {
      roomCode,
      userId: user.userId,
      actionType: request.type,
      error: error.message,
    });

    // Rethrow with more context
    throw error;
  }
};
