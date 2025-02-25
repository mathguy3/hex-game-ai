import { GameState } from '../../types/game';
import { ActionRequest } from '../game-controller/sequencer/doSequence';

export const isPlayerTurn = (gameState: GameState, request: ActionRequest) => {
  return gameState.activeId === request.playerId;
};
