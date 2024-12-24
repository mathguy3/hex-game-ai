import { HexInteraction } from '../../../types/actions/interactions';
import { ActionState } from '../../../types/game';

export const activateHexOption = (actionState: ActionState, hexOption: HexInteraction) => ({
  ...actionState,
  gameState: {
    ...actionState.gameState,
    mapManager: {
      ...actionState.gameState.mapManager,
      state: 'play' as const,
      selector: hexOption.tiles,
    },
  },
});
