import { Coordinates } from '../../../../../types';

function isValidOffset(vec: Coordinates) {
  return vec.q + vec.r + vec.s === 0;
}

export function hexVectorAdd(hex: Coordinates, vec: Coordinates) {
  if (!isValidOffset(vec)) {
    throw new Error(`Invalid vector ${JSON.stringify(vec)}`);
  }
  return { q: hex.q + vec.q, r: hex.r + vec.r, s: hex.s + vec.s };
}
