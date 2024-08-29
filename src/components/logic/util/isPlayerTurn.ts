import { GameState } from '../../../types/game';

export const isPlayerTurn = (gameState: GameState) => {
  return gameState.activePlayerId === gameState.meId;
};
