import { DiagonalTileSelect } from '../../../../types/actions/tiles';
import { getKey } from '../../../../utils/coordinates/getKey';
import { evalIf } from '../../if/if-engine/eval-if';
import { defaultIsValidTile } from '../../map/hex/defaultIsValidTile';
import { TileGenerator } from '../types';
import { getDiagonal } from '../utils/getDiagonal';
import { vectorAdd } from '../utils/vectorAdd';
import { vectorScale } from '../utils/vectorScale';

export const diagonal: TileGenerator<DiagonalTileSelect> = (tileSet, subject, actionState) => {
  const { range, isBlocking } = tileSet;
  const finalSet = {};
  for (let direction = 0; direction < 6; direction++) {
    for (let r = 1; r <= range; r++) {
      const next = vectorAdd(subject, vectorScale(getDiagonal(direction), r));
      const nextKey = getKey(next);
      const nextTile = {
        type: 'tile' as const,
        coordinates: next,
        key: nextKey,
      };

      finalSet[nextKey] = nextTile;

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
    }
  }
  return finalSet;
};
