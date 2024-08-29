import { ActionState } from '../../../../types/game';
import { clearPreviews } from '../../map/preview/clearMapPreview';
import { unselectCoordinates } from '../../map/unselectCoordinates';

export const deselect = (actionState: ActionState): ActionState => {
  const updatedMapState = unselectCoordinates(actionState.mapState, actionState.selectionState);
  return clearPreviews({ ...actionState, mapState: updatedMapState });
};
