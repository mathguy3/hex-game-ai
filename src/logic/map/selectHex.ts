import { ActionState } from '../../types/game';
import { unselectCoordinates } from './unselectCoordinates';

export const selectHex = (actionState: ActionState): ActionState => {
  let { localState, selectedHex, targetHex } = unselectCoordinates(actionState, actionState.localState.selectionState);

  selectedHex = targetHex;

  return {
    ...actionState,
    localState: { ...localState, selectionState: { [targetHex.key]: targetHex } },
    selectedHex,
  };
};
