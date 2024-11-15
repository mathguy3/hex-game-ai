import { ActionState } from '../../../../types/game';
import { mapApplyIndex } from '../../../../utils/record/mapApplyIndex';
import { clearPreviews } from './clearMapPreview';
import { generateUnitPreview } from './generateUnitPreview';

export const showPreview = (actionState: ActionState): ActionState => {
  //console.log('Clearing old previews', actionState.previewState);
  const updatedState = clearPreviews(actionState);
  const { selectedHex, localState } = updatedState;

  if (!selectedHex || !selectedHex.contains.unit) {
    console.log('Unit not selected, skipping preview');
    return updatedState;
  }

  const generatedTiles = generateUnitPreview(actionState, selectedHex.contains.unit.kind, selectedHex.coordinates);

  mapApplyIndex(localState.previewState, generatedTiles, (hex, tile) => ({
    ...hex,
    preview: tile.preview,
  }));

  console.log('updated preview state', localState.selectionState, localState.previewState);

  return {
    ...updatedState,
    localState: { ...localState },
  };
};
