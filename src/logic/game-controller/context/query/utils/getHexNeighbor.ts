import { Coordinates } from '../../../../../types';
import { getHexDirection } from './getHexDirection';
import { hexVectorAdd } from './hexVectorAdd';

export function getHexNeighbor(cube: Coordinates, direction: string | number) {
  return hexVectorAdd(cube, getHexDirection(direction));
}
