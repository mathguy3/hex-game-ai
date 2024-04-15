import { CoordinateKey, Coordinates } from '../../types';
import { getS } from './getS';

export function getKey(coordinates: Coordinates): CoordinateKey {
  return `${coordinates.q}.${coordinates.r}.${getS(coordinates)}`;
}
