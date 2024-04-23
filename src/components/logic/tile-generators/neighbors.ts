import { Coordinates } from '../../../types';
import { getNeighbor } from './utils/getNeighbor';

export const neighbors = (coords: Coordinates) => {
  return [0, 1, 2, 3, 4, 5].map((x) => getNeighbor(coords, x));
};
