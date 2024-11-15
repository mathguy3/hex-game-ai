import { colors } from '../../../../configuration/colors';
import { originHex } from '../../../../configuration/constants';
import { Coordinates, Tile } from '../../../../types';
import { Preview } from '../../../../types/actions/preview';
import { HexTileSelect, TileSelect, TileSet } from '../../../../types/actions/tiles';
import { ActionState } from '../../../../types/game';
import { mapApplyIndex } from '../../../../utils/record/mapApplyIndex';
import { mapApplyState } from '../../../../utils/record/mapApplyState';
import { asTileSet } from '../../util/asTileSet';
import { generateTileSet } from '../hex/generateTileSet';

type PreviewTile = { tile: Tile; preview: Record<string, Preview> };

export const applyPreviewTiles = (
  actionState: ActionState,
  tiles: TileSelect | TileSet | undefined,
  type: string,
  start?: Coordinates
) => {
  const { mapState, localState } = actionState;
  const { previewState } = localState;
  let previewTiles: Record<string, PreviewTile> = {};
  const selector = tiles ?? {
    type: 'hex',
  } as HexTileSelect;
  previewTiles = applyTiles(previewTiles, generateTileSet(asTileSet(selector), start ?? originHex, actionState), type);

  console.log('applying preview tiles', previewTiles, type);
  mapApplyState(mapState, previewTiles, (hex, tile) => ({
    ...hex,
    preview: tile.preview,
  }));

  mapApplyIndex(previewState, previewTiles, (hex, tile) => ({
    ...hex,
    preview: tile.preview,
  }));
  return { ...actionState, mapState, localState: { ...localState, previewState } };
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
