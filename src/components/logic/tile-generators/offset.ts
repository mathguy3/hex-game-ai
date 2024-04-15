import { Coordinates, Tile } from '../../../types';
import { OffsetTileSelect } from '../../../types/interactions';
import { getKey } from '../../../utils/coordinates/getKey';

//should use coordinates
export function offset(
  tileSet: OffsetTileSelect,
  coordinates: Coordinates
): Record<string, Tile> {
  return {
    [getKey(coordinates)]: {
      type: 'tile',
      coordinates,
      key: getKey(coordinates),
    },
  };
}
