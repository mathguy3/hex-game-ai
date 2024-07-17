import { ActionState } from '../../../../types/game';
import { mapApplyState } from '../../../../utils/record/mapApplyState';

export const clearPreviews = (actionState: ActionState) => {
  mapApplyState(actionState.mapState, actionState.previewState, (hex) => ({
    ...hex,
    preview: {},
  }));
  actionState.previewState = {};
};
