import { Coordinates } from '../../../../../types';

const vectors: Coordinates[] = [
  { q: 0, r: -1, s: 1 }, // up
  { q: 1, r: -2, s: 1 }, // diagUpRight
  { q: 1, r: -1, s: 0 }, // upRight
  { q: 2, r: -1, s: -1 }, // right
  { q: 1, r: 0, s: -1 }, // downRight
  { q: 1, r: 1, s: -2 }, // diagDownRight
  { q: 0, r: 1, s: -1 }, // down
  { q: -1, r: 2, s: -1 }, // diagDownLeft
  { q: -1, r: 1, s: 0 }, // downLeft
  { q: -2, r: 1, s: 1 }, // left
  { q: -1, r: 0, s: 1 }, // upLeft
  { q: -1, r: -1, s: 2 }, // diagUpLeft
];

export function getHexDirection(direction: string | number) {
  if (typeof direction === 'string') {
    const directionMap: Record<string, number> = {
      up: 0,
      diagUpRight: 1,
      upRight: 2,
      right: 3,
      downRight: 4,
      diagDownRight: 5,
      down: 6,
      diagDownLeft: 7,
      downLeft: 8,
      left: 9,
      upLeft: 10,
      diagUpLeft: 11,
    };
    direction = directionMap[direction];
  }
  return vectors[direction];
}
