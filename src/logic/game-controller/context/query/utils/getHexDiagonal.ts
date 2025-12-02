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
  if (typeof direction === 'string') {
    const directionMap: Record<string, number> = {
      downLeft: 0,
      left: 1,
      upLeft: 2,
      upRight: 3,
      right: 4,
      downRight: 5,
    };
    direction = directionMap[direction];
  }
  return diagonalVectors[direction];
}
