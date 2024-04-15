import { CoordinateKey, MapState } from '../../../types';
import { updateMap } from '../../../utils/record/updateRecord';

export function unselectCoordinates(
  mapState: MapState,
  coordinatesKeys: Record<CoordinateKey, any>
) {
  const justKeys = Object.keys(coordinatesKeys);
  return updateMap(mapState, justKeys, (item) => ({
    ...item,
    isSelected: false,
  }));
}
