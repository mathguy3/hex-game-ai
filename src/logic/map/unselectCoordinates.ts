import { CoordinateKey } from '../../types';
import { ActionState } from '../../types/game';
import { updateRecord } from '../../utils/record/updateRecord';

export function unselectCoordinates(actionState: ActionState, coordinatesKeys: Record<CoordinateKey, any>) {
  const updatedSelectionState = updateRecord(
    actionState.localState.selectionState,
    Object.keys(coordinatesKeys),
    () => undefined
  );
  return { ...actionState, selectionState: updatedSelectionState };
}

export const clearSelection = (actionState: ActionState) => {
  return { ...actionState, localState: { ...actionState.localState, selectionState: {} } };
};
