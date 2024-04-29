import { DirectionTileSelect } from '../../../../types/actions/tiles';
import { getKey } from '../../../../utils/coordinates/getKey';
import { defaultIsValidTile } from '../../Map/hex/defaultIsValidTile';
import { evalIf } from '../../if/getIf';
import { TileGenerator } from '../types';
import { getDirection } from '../utils/getNeighbor';
import { vectorAdd } from '../utils/vectorAdd';
import { vectorScale } from '../utils/vectorScale';

export const direction: TileGenerator<DirectionTileSelect> = (
  tileSet,
  subject,
  actionState,
  isValidTile
) => {
  const { range, direction, isBlocking } = tileSet;
  const finalSet = {};
  for (let r = 1; r <= range; r++) {
    const next = vectorAdd(subject, vectorScale(getDirection(direction), r));
    const nextKey = getKey(next);
    const nextTile = {
      type: 'tile' as const,
      coordinates: next,
      key: nextKey,
    };

    if (
      isBlocking &&
      (!defaultIsValidTile(nextTile, subject, actionState) ||
        evalIf(isBlocking, {
          subject: { parent: actionState.mapState, field: getKey(subject) },
          target: { parent: actionState.mapState, field: nextKey },
        }))
    ) {
      break;
    }
    finalSet[nextKey] = nextTile;
  }
  return finalSet;
};
