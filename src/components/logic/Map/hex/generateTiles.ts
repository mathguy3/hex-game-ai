import { Coordinates, Tile } from '../../../../types';
import { TileSelect } from '../../../../types/interactions';
import * as tileGenerators from '../../tile-generators';

export const generateTiles = <T extends TileSelect>(
  context: Coordinates,
  tiles: T
): Record<string, Tile> => {
  const generator = tileGenerators[tiles.type] as (
    tileSet: T,
    coords: Coordinates,
    includeCoords?: boolean
  ) => Record<string, Tile>;

  if (!generator) {
    console.error('no tile generator for', tiles.type);
    return {};
  }

  return generator(tiles, context, false);
};
