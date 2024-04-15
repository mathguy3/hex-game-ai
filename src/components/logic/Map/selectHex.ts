import { allowMultiSelect } from '../../../configuration/constants';
import { ActionState } from '../../../types/game';
import { unselectCoordinates } from './unselectCoordinates';

export const selectHex = (
  actionState: ActionState,
  isMultiSelect?: boolean
): ActionState => {
  let { mapState, selectionState, previewState, targetHex } = actionState;
  const shouldMultiSelect = isMultiSelect && allowMultiSelect;
  const isSelecting = !selectionState[targetHex.key];
  const shouldSelectItem =
    isSelecting ||
    (!shouldMultiSelect && Object.keys(selectionState).length > 1);

  targetHex = { ...targetHex, isSelected: shouldSelectItem };

  // Always remove target item from selection state
  const { [targetHex.key]: _, ...removed } = selectionState;
  const updatedSelection = shouldMultiSelect ? removed : {};

  // Remove everything else from map state if not holding left control
  if (!shouldMultiSelect) {
    mapState = unselectCoordinates(mapState, selectionState);
  }

  // Add it if the current action is selection
  const added = shouldSelectItem ? { [targetHex.key]: targetHex } : {};
  selectionState = { ...updatedSelection, ...added };

  // Select item in mapState
  mapState[targetHex.key] = targetHex;

  return { mapState, selectionState, previewState, targetHex };
};
