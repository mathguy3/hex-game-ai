import { Coordinates } from '../../../../../types';
import { getKey } from '../utils/getHexKey';
import { getS } from '../utils/getS';
import { hexCoordsMatch } from '../utils/hexCoordsMatch';

export const range = (model: any, query: any) => {
  const { subjectSpace } = model;
  if (!subjectSpace) {
    throw new Error('subjectSpace is required');
  }
  let range;
  let includeSelf;
  if (typeof query == 'number') {
    range = query;
    includeSelf = true;
  } else {
    range = query.range;
    includeSelf = query.includeSelf;
  }
  return rangeSimple(subjectSpace.coordinates, range, includeSelf);
};

export const rangeSimple = (coords: Coordinates, range: number, includeSelf?: boolean) => {
  const coordsS = getS(coords);
  const finalCoords = {};
  for (let q = -range + coords.q; q <= range + coords.q; q++) {
    for (let r = -range + coords.r; r <= range + coords.r; r++) {
      for (let s = -range + coordsS; s <= range + coordsS; s++) {
        if (q + r + s === 0 && (includeSelf || !hexCoordsMatch({ q, r, s }, coords))) {
          const tile = { id: getKey({ q, r, s }), coordinates: { q, r, s } };
          finalCoords[tile.id] = tile;
        }
      }
    }
  }
  return finalCoords;
};
