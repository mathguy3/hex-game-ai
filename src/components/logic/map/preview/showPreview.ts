import { ActionState } from '../../../../types/game';
import { mapApplyIndex } from '../../../../utils/record/mapApplyIndex';
import { mapApplyState } from '../../../../utils/record/mapApplyState';
import { clearPreviews } from './clearMapPreview';
import { generateUnitPreview } from './generateUnitPreview';

export const showPreview = (actionState: ActionState): ActionState => {
  //console.log('Clearing old previews', actionState.previewState);
  const updatedState = clearPreviews(actionState);
  const { selectedHex, mapState, previewState } = updatedState;

  if (!selectedHex || !selectedHex.contains.unit || !selectedHex.isSelected) {
    console.log('Unit not selected, skipping preview');
    return updatedState;
  }

  const generatedTiles = generateUnitPreview(actionState, selectedHex.contains.unit.kind, selectedHex.coordinates);

  //console.log('Applying generated tiles', generatedTiles);
  mapApplyState(mapState, generatedTiles, (hex, tile) => ({
    ...hex,
    preview: tile.preview,
  }));

  mapApplyIndex(previewState, generatedTiles, (hex, tile) => ({
    ...hex,
    preview: tile.preview,
  }));

  //console.log('updated preview state', selectionState, previewState);

  return {
    ...updatedState,
    mapState,
    previewState,
  };
};
