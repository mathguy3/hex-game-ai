import { Coordinates } from '../../../../types';
import { RangeTileSelect } from '../../../../types/actions/tiles';
import { getS } from '../../../../utils/coordinates/getS';
import { isMatch } from '../../../../utils/coordinates/isMatch';
import { TileGenerator } from '../types';
import { makeTile } from '../utils/makeTile';

export const range: TileGenerator<RangeTileSelect> = (
  tileSet: RangeTileSelect,
  coords: Coordinates
) => rangeSimple(tileSet, coords);

export const rangeSimple = (
  tileSet: RangeTileSelect,
  coords: Coordinates,
  includeSelf?: boolean
) => {
  const { range } = tileSet;
  const coordsS = getS(coords);
  const finalCoords = {};
  for (let q = -range + coords.q; q <= range + coords.q; q++) {
    for (let r = -range + coords.r; r <= range + coords.r; r++) {
      for (let s = -range + coordsS; s <= range + coordsS; s++) {
        if (q + r + s === 0 && (includeSelf || !isMatch({ q, r, s }, coords))) {
          const tile = makeTile({ q, r, s });
          finalCoords[tile.key] = tile;
        }
      }
    }
  }
  return finalCoords;
};
