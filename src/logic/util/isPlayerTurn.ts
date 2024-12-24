import { GameState, LocalState } from '../../types/game';

export const isPlayerTurn = (gameState: GameState, localState: LocalState) => {
  return gameState.activePlayerId === localState.meId;
};
