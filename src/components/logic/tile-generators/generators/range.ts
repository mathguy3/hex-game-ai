import { Coordinates } from '../../../../types';
import { RangeTileSelect } from '../../../../types/actions/tiles';
import { getKey } from '../../../../utils/coordinates/getKey';
import { getS } from '../../../../utils/coordinates/getS';
import { isMatch } from '../../../../utils/coordinates/isMatch';
import { TileGenerator } from '../types';
import { coordsToTiles } from '../utils/coordsToTiles';

const includeSelf = false;

export const range: TileGenerator<RangeTileSelect> = (
  tileSet: RangeTileSelect,
  coords: Coordinates
) => rangeSimple(tileSet, coords);

export const rangeSimple = (tileSet: RangeTileSelect, coords: Coordinates) => {
  const { range } = tileSet;
  const coordsS = getS(coords);
  const finalCoords = [];
  for (let q = -range + coords.q; q <= range + coords.q; q++) {
    for (let r = -range + coords.r; r <= range + coords.r; r++) {
      for (let s = -range + coordsS; s <= range + coordsS; s++) {
        if (q + r + s === 0 && (includeSelf || !isMatch({ q, r, s }, coords))) {
          finalCoords.push({
            coordinates: { q, r, s },
            key: getKey({ q, r, s }),
          });
        }
      }
    }
  }
  return coordsToTiles(finalCoords);
};
