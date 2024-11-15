import { HexItem } from '../../../../types';
import { HexTileSelect } from '../../../../types/actions/tiles';
import { mapToRecord } from '../../../../utils/record/mapToRecord';
import { evalIf } from '../../if/if-engine/eval-if';
import { TileGenerator } from '../types';

export const hex: TileGenerator<HexTileSelect> = (tileSelect, subject, actionState, isValidTile, initialSearch) => {
  const initialRange = initialSearch ?? actionState.mapState;
  const hexList = Object.values(initialRange);

  let targets: HexItem[] = hexList;
  let matchingTargets: HexItem[] = targets.filter((x) => {
    const result = !tileSelect.tileIf || evalIf(tileSelect.tileIf, {
      subject: { parent: actionState.mapState, field: x.key },
      context: { parent: actionState, field: 'gameState' },
    });
    if (x.key === '0.0.0') {
      console.log('RESULTS', tileSelect.tileIf, x, result);
    }
    return result;
  });

  console.log('matching targets', matchingTargets);

  return mapToRecord(matchingTargets, (item) => ({
    [item.key]: {
      type: 'tile' as const,
      coordinates: item.coordinates,
      key: item.key,
    },
  }));
};
