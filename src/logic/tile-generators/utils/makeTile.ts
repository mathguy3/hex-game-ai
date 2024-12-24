import { Coordinates, Tile } from '../../../types';
import { getKey } from '../../../utils/coordinates/getKey';

export const makeTile = (coord: Coordinates): Tile => ({
  type: 'tile',
  coordinates: coord,
  key: getKey(coord),
});
