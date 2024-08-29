import { ActionState, GameDefinition } from '../../../../types/game';
import { mapApplyIndex } from '../../../../utils/record/mapApplyIndex';
import { mapApplyState } from '../../../../utils/record/mapApplyState';
import { clearPreviews } from './clearMapPreview';
import { generateUnitPreview } from './generateUnitPreview';

export const showPreview = (actionState: ActionState, gameDefinition: GameDefinition): ActionState => {
  //console.log('Clearing old previews', actionState.previewState);
  let { mapState, selectionState, previewState, selectedHex, targetHex, gameState, activePlayer } =
    clearPreviews(actionState);

  if (!selectedHex || !selectedHex.contains.unit || !selectedHex.isSelected) {
    console.log('Unit not selected, skipping preview');
    return {
      mapState,
      selectionState,
      previewState,
      selectedHex,
      targetHex,
      gameState,
      activePlayer,
    };
  }

  const generatedTiles = generateUnitPreview(
    actionState,
    gameDefinition,
    selectedHex.contains.unit.kind,
    selectedHex.coordinates
  );

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
    mapState,
    selectionState,
    previewState,
    selectedHex,
    targetHex,
    gameState,
    activePlayer,
  };
};
