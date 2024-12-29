import { ActionRequest } from '../../logic/game-controller/sequencer';
import { MapState } from '../../types';
import { GameState, LocalState } from '../../types/game';
import { createPatch, Patch } from '../../utils/statePatch';
import { User } from '../user/id';
import { gameManager } from './gameManager';

interface ActionResponse {
  gameState: GameState;
  mapState: MapState;
  localState: LocalState;
  patch: Patch<{ gameState: GameState; mapState: MapState }>;
}

export const handleAction = (params: {
  roomCode: string;
  user: User;
  localState: LocalState;
  request: ActionRequest;
}): ActionResponse => {
  const { roomCode, user, localState, request } = params;
  console.log('handleAction', params);
  if (!roomCode || !user) {
    throw new Error('Missing required parameters: roomCode and user are required');
  }

  if (!gameManager.hasGame(roomCode)) {
    throw new Error(`Game with id ${roomCode} not found`);
  }

  try {
    // Validate the action request
    if (!request || !request.type) {
      throw new Error('Invalid action request');
    }

    //console.log('handleAction', request);

    const { gameState, mapState, localControl } = gameManager.getGameState(roomCode, user.id);
    // Handle the action and get the response
    const response = gameManager.handleAction(roomCode, user.id, localState, request);

    // Validate the response
    if (!response.gameState || !response.mapState) {
      throw new Error('Invalid game state after action');
    }

    const patch = createPatch(
      { gameState, mapState, localControl },
      { gameState: response.gameState, mapState: response.mapState, localControl: response.localControl }
    );

    return { ...response, patch };
  } catch (error) {
    console.error('Error handling action:', {
      roomCode,
      userId: user.id,
      actionType: request.type,
      error: error.message,
    });

    // Rethrow with more context
    throw error;
  }
};
