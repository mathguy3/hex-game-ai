import { CoordinateKey, Coordinates } from '../../types';

export function fromKey(coordinates: CoordinateKey): Coordinates {
  const list = coordinates.split('.');
  return { q: parseInt(list[0]), r: parseInt(list[1]), s: parseInt(list[2]) };
}
