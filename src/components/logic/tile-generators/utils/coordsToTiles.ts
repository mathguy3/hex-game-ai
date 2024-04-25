import { Coordinates, Tile } from '../../../../types';
import { getKey } from '../../../../utils/coordinates/getKey';
import { mapToRecord } from '../../../../utils/record/mapToRecord';

export const coordsToTiles = (coords: Coordinates[]) =>
  mapToRecord(coords, (item) => {
    const key = getKey(item);
    return {
      [key]: {
        type: 'tile' as const,
        coordinates: item,
        key: key,
      } as Tile,
    };
  });
