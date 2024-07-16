import { colors } from '../../../../configuration/colors';
import { gameDefinition } from '../../../../configuration/gameDefinition';
import { Coordinates, Tile } from '../../../../types';
import { InteractionType } from '../../../../types/actions/interactions';
import { Preview } from '../../../../types/actions/preview';
import { ActionState } from '../../../../types/game';
import { getKey } from '../../../../utils/coordinates/getKey';
import { mapApplyIndex } from '../../../../utils/record/mapApplyIndex';
import { evalIf } from '../../if/getIf';
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
  for (const interaction of unitDefinition.interactions) {
    console.log('Preview for', interaction.type);
    if (
      interaction.if &&
      !evalIf(interaction.if, {
        subject: { parent: actionState.mapState, field: getKey(coordinates) },
      })
    ) {
      continue;
    }
    applyPreviewTiles(
      previewTiles,
      generateTileSet(interaction.tiles, coordinates, actionState),
      interaction.type
    );
  }
  return previewTiles;
};

const applyPreviewTiles = (
  previewTiles: Record<string, PreviewTile>,
  interactionTiles: Record<string, Tile>,
  interactionName: InteractionType
) => {
  mapApplyIndex(previewTiles, interactionTiles, (prev, item) => ({
    tile: item,
    preview: {
      ...(prev?.preview ?? {}),
      [interactionName]: getPreview(interactionName, item),
    },
  }));
};

function getPreview<T extends InteractionType>(
  tileType: T,
  tile: Tile
): Preview {
  return {
    type: tileType,
    color: colors.hex[tileType],
    tile,
  } as Preview;
}
