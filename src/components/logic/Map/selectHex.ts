import { allowMultiSelect } from '../../../configuration/constants';
import { HexItem } from '../../../types';
import { ActionState } from '../../../types/game';
import { unselectCoordinates } from './unselectCoordinates';

export const selectHex = (
  actionState: ActionState,
  selectHex?: HexItem,
  isMultiSelect?: boolean
): ActionState => {
  let { mapState, selectionState, previewState, targetHex } = actionState;
  let hexToSelect = selectHex ?? targetHex;
  const shouldMultiSelect = isMultiSelect && allowMultiSelect;
  const isSelecting = !selectionState[targetHex.key];
  const shouldSelectItem =
    isSelecting ||
    (!shouldMultiSelect && Object.keys(selectionState).length > 1);

  hexToSelect = { ...hexToSelect, isSelected: shouldSelectItem };

  // Always remove target item from selection state
  const { [hexToSelect.key]: _, ...removed } = selectionState;
  const updatedSelection = shouldMultiSelect ? removed : {};

  // Remove everything else from map state if not holding left control
  if (!shouldMultiSelect) {
    mapState = unselectCoordinates(mapState, selectionState);
  }

  // Add it if the current action is selection
  const added = shouldSelectItem ? { [hexToSelect.key]: hexToSelect } : {};
  selectionState = { ...updatedSelection, ...added };

  // Select item in mapState
  mapState[hexToSelect.key] = hexToSelect;

  return { mapState, selectionState, previewState, targetHex };
};
