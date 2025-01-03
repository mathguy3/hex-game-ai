import { CoordinateKey, Coordinates } from '../../../types';
import { ActionState } from '../../../types/game';

export function defaultIsValidTile(
  tile: { key: CoordinateKey; coordinates: Coordinates },
  target: Coordinates,
  actionState: ActionState
) {
  const isStartingHex = false; // isMatch(tile.coordinates, target);
  const isPartOfMap = !!actionState.mapState[tile.key];
  /*console.log(
    'is valid?',
    tile.key,
    isStartingHex,
    isPartOfMap,
    !isStartingHex && isPartOfMap
  );*/
  return !isStartingHex && isPartOfMap;
}
