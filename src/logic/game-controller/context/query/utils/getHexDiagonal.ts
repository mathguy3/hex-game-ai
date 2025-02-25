import { Coordinates } from '../../../../../types';

var diagonalVectors: Coordinates[] = [
  { q: 1, r: 1, s: -2 },
  { q: 2, r: -1, s: -1 },
  { q: 1, r: -2, s: 1 },
  { q: -1, r: -1, s: 2 },
  { q: -2, r: 1, s: 1 },
  { q: -1, r: 2, s: -1 },
];

export function getHexDiagonal(direction: string | number) {
  return diagonalVectors[direction];
}
