import { ActionState } from '../../../../types/game';
import { mapApplyIndex } from '../../../../utils/record/mapApplyIndex';
import { mapApplyState } from '../../../../utils/record/mapApplyState';
import { clearPreviews } from './clearMapPreview';
import { generateUnitPreview } from './generateUnitPreview';

export const showPreview = (actionState: ActionState): ActionState => {
  console.log('Clearing old previews', actionState.previewState);
  // Clear old state
  clearPreviews(actionState);
  let { mapState, selectionState, previewState, targetHex } = actionState;
  const selectedHex = Object.values(selectionState)[0];

  console.log('selected hex', previewState, selectionState, selectedHex);
  if (!selectedHex || !selectedHex.contains.unit || !selectedHex.isSelected) {
    console.log('Unit not selected, skipping preview');
    return { mapState, selectionState, previewState, targetHex };
  }
  const targetUnit = selectedHex.contains.unit;
  const generatedTiles = generateUnitPreview(
    actionState,
    targetUnit.kind,
    selectedHex.coordinates
  );

  console.log('Applying generated tiles', generatedTiles);
  mapApplyState(mapState, generatedTiles, (hex, tile) => ({
    ...hex,
    preview: tile.preview,
  }));

  mapApplyIndex(previewState, generatedTiles, (hex, tile) => ({
    ...hex,
    preview: tile.preview,
  }));

  console.log('updated preview state', selectionState, previewState);

  return { mapState, selectionState, previewState, targetHex };
};
