import { ActionState } from '../../../../types/game';
import { diffRecord } from '../../../../utils/record/diffRecord';
import { mapApplyRecord } from '../../../../utils/record/mapApplyRecord';
import { generateUnitPreview } from './generateUnitPreview';

export const showPreview = (actionState: ActionState): ActionState => {
  let { mapState, selectionState, previewState, targetHex } = actionState;

  // Clear old state
  diffRecord(mapState, previewState);

  if (!targetHex.contains.length || !targetHex.isSelected) {
    return { mapState, selectionState, previewState, targetHex };
  }
  const targetUnit = targetHex.contains[0];
  const generatedTiles = generateUnitPreview(
    actionState,
    targetUnit.kind,
    targetHex.coordinates
  );

  mapApplyRecord(mapState, generatedTiles, (hex, tile) => ({
    ...hex,
    preview: tile.preview,
  }));

  mapApplyRecord(previewState, generatedTiles, (hex, tile) => ({
    ...hex,
    preview: tile.preview,
  }));

  return { mapState, selectionState, previewState, targetHex };
};
