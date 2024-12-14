import { ActionState } from '../../../../types/game';
import { clearPreviews } from '../../map/preview/clearMapPreview';

export const deselect = (actionState: ActionState): ActionState => {
  let state = clearPreviews(actionState);
  //state = unselectCoordinates(state, state.selectionState);
  //console.log('unselect', state);
  return { ...state, selectedHex: undefined, targetHex: { ...actionState.targetHex, isSelected: false, preview: {} } };
};
