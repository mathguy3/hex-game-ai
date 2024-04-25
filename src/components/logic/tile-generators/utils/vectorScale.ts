import { Coordinates } from '../../../../types';

export function vectorScale(coordinates: Coordinates, factor: number) {
  return {
    q: coordinates.q * factor,
    r: coordinates.r * factor,
    s: coordinates.s * factor,
  };
}
