import { Coordinates } from '../../../../../types';

export function hexVectorScale(coordinates: Coordinates, factor: number) {
  return {
    q: coordinates.q * factor,
    r: coordinates.r * factor,
    s: coordinates.s * factor,
  };
}
