import { Coordinates, Tile } from '../../../types';
import { RangeTileSelect } from '../../../types/interactions';
import { getKey } from '../../../utils/coordinates/getKey';
import { getS } from '../../../utils/coordinates/getS';
import { isMatch } from '../../../utils/coordinates/isMatch';

export function range(
  tileSet: RangeTileSelect,
  coords: Coordinates,
  includeSelf: boolean = true
): Tile[] {
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
  return finalCoords;
}
