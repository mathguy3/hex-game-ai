import { colors } from '../../../../configuration/constants';
import { gameDefinition } from '../../../../configuration/gameDefinition';
import { Coordinates, Tile } from '../../../../types';
import { ActionState } from '../../../../types/game';
import { Preview, PreviewType } from '../../../../types/preview';
import { mapApplyRecord } from '../../../../utils/record/mapApplyRecord';
import { generateTileSet } from '../hex/generateTileSet';

type PreviewTile = { tile: Tile; preview: Record<string, Preview> };

export const generateUnitPreview = (
  actionState: ActionState,
  unitKind: string,
  coordinates: Coordinates
) => {
  let previewTiles: Record<string, PreviewTile> = {};
  const unitDefinition = gameDefinition.unit[unitKind];
  if (!unitDefinition) {
    return {};
  }
  const movementTiles = generateTileSet(
    coordinates,
    unitDefinition.interactions.movement.tiles,
    actionState
  );

  applyPreviewTiles(previewTiles, movementTiles, 'movement');

  for (const interaction of unitDefinition.interactions.fromMovement) {
    const movementTileList = Object.values(movementTiles);
    for (const coordinate of movementTileList) {
      applyPreviewTiles(
        previewTiles,
        generateTileSet(coordinate.coordinates, interaction.tiles, actionState),
        interaction.type
      );
    }
  }
  for (const interaction of unitDefinition.interactions.other) {
    applyPreviewTiles(
      previewTiles,
      generateTileSet(coordinates, interaction.tiles, actionState),
      interaction.type
    );
  }
  return previewTiles;
};

const applyPreviewTiles = (
  previewTiles: Record<string, PreviewTile>,
  interactionTiles: Record<string, Tile>,
  interactionName: PreviewType
) => {
  mapApplyRecord(previewTiles, interactionTiles, (prev, item) => ({
    tile: item,
    preview: {
      ...prev.preview,
      [interactionName]: {
        type: interactionName,
        color: colors.hex[interactionName],
      },
    },
  }));
};
