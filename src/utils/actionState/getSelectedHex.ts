import { ActionState } from '../../types/game';

export const getSelectedHex = (actionState: ActionState) => {
  return actionState.selectionState[0];
};
