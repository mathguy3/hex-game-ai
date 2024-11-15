import { UIInteraction } from '../../../../types/actions/interactions';
import { ActionState } from '../../../../types/game';

export const pickCards = (actionState: ActionState, interaction: UIInteraction) => {
  const { gameState } = actionState;
  const { cardManager } = gameState;
  // This is local state now
  return {
    ...actionState,
    gameState: {
      ...gameState,
      cardManager: {
        ...cardManager,
        selectionSlots: interaction.kind === 'play' ? 1 : interaction.slots,
        state: interaction.kind,
      },
    },
  };
};
