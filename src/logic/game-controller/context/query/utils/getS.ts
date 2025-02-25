import { Coordinates } from '../../../../../types';

export function getS(coordinates: Coordinates) {
  return coordinates.s ?? -coordinates.q - coordinates.r;
}
