import { ActionState } from '../../../types/game';
import { unselectCoordinates } from './unselectCoordinates';

export const selectHex = (actionState: ActionState): ActionState => {
  let { mapState, selectionState, selectedHex, targetHex } = actionState;

  mapState = unselectCoordinates(mapState, selectionState);

  targetHex = { ...targetHex, isSelected: true };
  selectionState = { [targetHex.key]: targetHex };
  mapState[targetHex.key] = targetHex;
  selectedHex = targetHex;

  return { ...actionState, mapState, selectionState, selectedHex, targetHex };
};
