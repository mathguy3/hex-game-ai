import { getHexDiagonal } from '../utils/getHexDiagonal';
import { hexVectorAdd } from '../utils/hexVectorAdd';
import { hexVectorScale } from '../utils/hexVectorScale';
import { getHexNeighbor } from '../utils/getHexNeighbor';
import { getKey } from '../utils/getHexKey';
import { orthogonalDirections } from './direction';

// Circle at a distance of range
export const distance = (model: any, query: any) => {
  const { subjectSpace } = model;
  if (!subjectSpace) {
    throw new Error('Subject is required');
  }
  let range = 1;
  if (typeof query === 'number') {
    range = query;
  }
  const finalCoords = [];
  console.log('distance', subjectSpace, range);
  let currentHex = hexVectorAdd(subjectSpace.coordinates, hexVectorScale(getHexDiagonal(4), range));
  for (let direction = 0; direction < orthogonalDirections.length; direction++) {
    for (let r = 0; r < range; r++) {
      finalCoords.push(currentHex);
      currentHex = getHexNeighbor(currentHex, orthogonalDirections[direction]);
    }
  }
  return Object.fromEntries(finalCoords.map((x) => [getKey(x), { id: getKey(x), coordinates: x }]));
};
