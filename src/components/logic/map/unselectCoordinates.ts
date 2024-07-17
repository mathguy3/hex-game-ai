import { CoordinateKey, MapState } from '../../../types';
import { updateRecord } from '../../../utils/record/updateRecord';

export function unselectCoordinates(
  mapState: MapState,
  coordinatesKeys: Record<CoordinateKey, any>
) {
  const justKeys = Object.keys(coordinatesKeys);
  return updateRecord(mapState, justKeys, (item) => ({
    ...item,
    isSelected: false,
  }));
}
