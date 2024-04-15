import { ActionState } from '../../../types/game';
import { updateMap } from '../../../utils/record/updateRecord';
import { unselectCoordinates } from '../Map/unselectCoordinates';
import { moveUnit } from './move/moveUnit';

export const doAction = (actionState: ActionState): ActionState => {
  if (
    actionState.targetHex.preview.movement ||
    actionState.targetHex.preview['pathrange']
  ) {
    actionState = moveUnit(actionState);
  } else if (actionState.targetHex.preview.attack) {
    actionState.mapState = unselectCoordinates(
      actionState.mapState,
      actionState.selectionState
    );
  }

  const oldPreview = Object.keys(actionState.previewState);
  if (oldPreview.length) {
    updateMap(actionState.mapState, oldPreview, (hex) => ({
      ...hex,
      preview: {},
    }));
  }
  actionState.previewState = {};

  return actionState;
};
