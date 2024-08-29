import { ActionState } from '../../../types/game';
import { unselectCoordinates } from './unselectCoordinates';

export const selectHex = (actionState: ActionState): ActionState => {
  let { mapState, selectionState, previewState, selectedHex, targetHex, gameState, activePlayer } = actionState;

  mapState = unselectCoordinates(mapState, selectionState);

  targetHex = { ...targetHex, isSelected: true };
  selectionState = { [targetHex.key]: targetHex };
  mapState[targetHex.key] = targetHex;
  selectedHex = targetHex;

  return { mapState, selectionState, previewState, selectedHex, targetHex, gameState, activePlayer };
};
