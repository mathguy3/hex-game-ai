import { ActionState, LocalState } from '../../../../types/game';

export const clearPreviews = (actionState: ActionState) => {
  return { ...actionState, localState: { ...actionState.localState, previewState: {} as LocalState['previewState'] } };
};
