import { colors } from '../../../../configuration/colors';
//import { gameDefinition } from '../../../../configuration/gameDefinition';
import { Coordinates, Tile } from '../../../../types';
import { Preview } from '../../../../types/actions/preview';
import { ActionState } from '../../../../types/game';
import { getKey } from '../../../../utils/coordinates/getKey';
import { mapApplyIndex } from '../../../../utils/record/mapApplyIndex';
import { evalIf } from '../../if/if-engine/eval-if';
import { assert } from '../../util/assert';
import { generateTileSet } from '../hex/generateTileSet';

type PreviewTile = { tile: Tile; preview: Record<string, Preview> };

export const generateUnitPreview = (actionState: ActionState, unitKind: string, coordinates: Coordinates) => {
  let previewTiles: Record<string, PreviewTile> = {};
  const unitDefinition = actionState.gameDefinition.units[unitKind];
  assert(unitDefinition, `No definition for selected unit ${unitKind}`);

  for (const interaction of unitDefinition.interactions) {
    //console.log('Preview for', interaction.type);
    if (
      interaction.if &&
      !evalIf(interaction.if, {
        subject: { parent: actionState.mapState, field: getKey(coordinates) },
        context: { parent: actionState, field: 'gameState' },
      })
    ) {
      continue;
    }
    previewTiles = applyTiles(
      previewTiles,
      generateTileSet(interaction.targeting.tiles, coordinates, actionState, false),
      interaction.kind
    );
  }
  return previewTiles;
};

const applyTiles = (
  previewTiles: Record<string, PreviewTile>,
  interactionTiles: Record<string, Tile>,
  interactionName: string
) => {
  return mapApplyIndex(previewTiles, interactionTiles, (prev, item) => ({
    tile: item,
    preview: {
      ...(prev?.preview ?? {}),
      [interactionName]: getPreview(interactionName, item),
    },
  }));
};

function getPreview(tileType: string, tile: Tile): Preview {
  return {
    type: tileType,
    color: colors.hex[tileType],
    tile,
  } as Preview;
}
