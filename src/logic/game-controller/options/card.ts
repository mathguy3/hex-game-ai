import { UIInteraction } from '../../../types/actions/interactions';
import { ActionState } from '../../../types/game';

export const activateCardOption = (actionState: ActionState, option: UIInteraction) => ({
  ...actionState,
  gameState: {
    ...actionState.gameState,
    cardManager: {
      ...actionState.gameState.cardManager,
      selectionSlots: option.kind === 'play' ? 1 : option.slots,
      state: option.kind,
    },
  },
});
