import { HexItem } from '../../../../types';
import { ActionState } from '../../../../types/game';

const shouldKeepSelection = false;
export const moveUnit = (actionState: ActionState): ActionState => {
  let { mapState, selectionState, previewState, targetHex } = actionState;
  const selectedHex = Object.values(selectionState)[0];
  console.log('move', selectedHex);
  targetHex = {
    ...mapState[targetHex.key],
    contains: [...selectedHex.contains],
    isSelected: shouldKeepSelection,
  };
  const updatedSelectedHex: HexItem = {
    ...mapState[selectedHex.key],
    contains: [],
    isSelected: false,
  };

  mapState[targetHex.key] = targetHex;
  mapState[selectedHex.key] = updatedSelectedHex;

  if (shouldKeepSelection) {
    selectionState[targetHex.key] = targetHex;
  }
  const { [selectedHex.key]: _, ...nextUpdatedSelectionState } = selectionState;

  return {
    mapState,
    selectionState: nextUpdatedSelectionState,
    previewState,
    targetHex,
  };
};
