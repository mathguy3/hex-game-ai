import { Coordinates } from '../../../types';

var vectors: Coordinates[] = [
  { q: 1, r: 0, s: -1 },
  { q: 1, r: -1, s: 0 },
  { q: 0, r: -1, s: 1 },
  { q: -1, r: 0, s: 1 },
  { q: -1, r: 1, s: 0 },
  { q: 0, r: 1, s: -1 },
];

function getDirection(direction: string | number) {
  return vectors[direction];
}

function vectorAdd(hex: Coordinates, vec: Coordinates) {
  return { q: hex.q + vec.q, r: hex.r + vec.r, s: hex.s + vec.s };
}

export function getNeighbor(cube: Coordinates, direction: string | number) {
  return vectorAdd(cube, getDirection(direction));
}

export const neighbors = (coords: Coordinates) => {
  return Object.keys(vectors).map((x) => getNeighbor(coords, x));
};
