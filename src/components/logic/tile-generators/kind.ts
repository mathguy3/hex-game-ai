import { HexItem } from '../../../types';
import { KindTileSelect } from '../../../types/actions/tiles';
import { mapToRecord } from '../../../utils/record/mapToRecord';
import { TileGenerator } from './types';

export const kind: TileGenerator<KindTileSelect> = (
  tileSelect,
  target,
  actionState,
  isValidTile,
  initialSearch
) => {
  const initialRange = initialSearch ?? actionState.mapState;
  const hexList = Object.values(initialRange);

  let targets: HexItem[] = hexList;
  let matchingTargets: HexItem[];
  if (tileSelect.target === 'hex') {
    matchingTargets = targets.filter((x) => tileSelect.kind === x.kind);
  } else {
    targets = hexList.filter((x) => x.contains.length);
    matchingTargets = targets.filter(
      (x) => tileSelect.kind === x.contains[0].kind
    );
  }

  const validTargets = matchingTargets.filter(isValidTile);
  return mapToRecord(validTargets, (item) => ({
    [item.key]: {
      type: 'tile' as const,
      coordinates: item.coordinates,
      key: item.key,
    },
  }));
};
