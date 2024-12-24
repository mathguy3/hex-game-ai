import { Coordinates } from '../../../types';
import { vectorAdd } from './vectorAdd';

const vectors: Coordinates[] = [
  { q: 1, r: 0, s: -1 },
  { q: 1, r: -1, s: 0 },
  { q: 0, r: -1, s: 1 },
  { q: -1, r: 0, s: 1 },
  { q: -1, r: 1, s: 0 },
  { q: 0, r: 1, s: -1 },
];

export function getDirection(direction: string | number) {
  return vectors[direction];
}

export function getNeighbor(cube: Coordinates, direction: string | number) {
  return vectorAdd(cube, getDirection(direction));
}
