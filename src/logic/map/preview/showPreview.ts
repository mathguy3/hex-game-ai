import { ActionState } from '../../../types/game';
import { mapApplyIndex } from '../../../utils/record/mapApplyIndex';
import { clearPreviews } from './clearMapPreview';
import { generateUnitPreview } from './generateUnitPreview';

export const showPreview = (actionState: ActionState): ActionState => {
  const updatedState = clearPreviews(actionState);
  const { selectedHex, localState } = updatedState;

  if (!selectedHex || !selectedHex.contains.unit) {
    return updatedState;
  }

  const generatedTiles = generateUnitPreview(actionState, selectedHex.contains.unit.kind, selectedHex.coordinates);

  mapApplyIndex(localState.previewState, generatedTiles, (hex, tile) => ({
    ...hex,
    preview: tile.preview,
  }));

  return {
    ...updatedState,
    localState: { ...localState },
  };
};
