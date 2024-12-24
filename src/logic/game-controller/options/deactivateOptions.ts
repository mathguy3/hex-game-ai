import { ActionState } from '../../../types/game';

export const deactivateOptions = (actionState: ActionState): ActionState => ({
  ...actionState,
  gameState: {
    ...actionState.gameState,
    cardManager: {
      ...actionState.gameState.cardManager,
      selectionSlots: 1,
      state: 'view',
    },
    mapManager: {
      state: 'view',
      selector: undefined,
    },
  },
});
