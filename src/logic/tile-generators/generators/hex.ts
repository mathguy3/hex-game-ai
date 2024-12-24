import { HexItem } from '../../../types';
import { HexTileSelect } from '../../../types/actions/tiles';
import { getKey } from '../../../utils/coordinates/getKey';
import { mapToRecord } from '../../../utils/record/mapToRecord';
import { evalIf } from '../../if/if-engine/eval-if';
import { TileGenerator } from '../types';

export const hex: TileGenerator<HexTileSelect> = (tileSelect, subject, actionState, isValidTile, initialSearch) => {
  const initialRange = initialSearch ?? actionState.mapState;
  const hexList = Object.values(initialRange);

  let targets: HexItem[] = hexList;
  let matchingTargets: HexItem[] = targets.filter((x) => {
    const result =
      !tileSelect.tileIf ||
      evalIf(tileSelect.tileIf, {
        target: { parent: actionState.mapState, field: x.key },
        subject: { parent: actionState.mapState, field: getKey(subject) },
        context: { parent: actionState, field: 'gameState' },
      });
    return result;
  });

  return mapToRecord(matchingTargets, (item) => ({
    [item.key]: {
      type: 'tile' as const,
      coordinates: item.coordinates,
      key: item.key,
    },
  }));
};
