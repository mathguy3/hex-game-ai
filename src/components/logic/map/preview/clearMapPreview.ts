import { ActionState } from '../../../../types/game';
import { mapApplyState } from '../../../../utils/record/mapApplyState';

export const clearPreviews = (actionState: ActionState) => {
  const mapState = mapApplyState(actionState.mapState, actionState.previewState, (hex) => ({
    ...hex,
    preview: {},
  }));
  return { ...actionState, mapState, previewState: {} as (typeof actionState)['previewState'] };
};
