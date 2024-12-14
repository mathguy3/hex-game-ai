import { HexItem } from '../../../../types';
import { AspectTileSelect } from '../../../../types/actions/tiles';
import { mapToRecord } from '../../../../utils/record/mapToRecord';
import { TileGenerator } from '../types';
import { areEqualShallow } from '../utils/areEqualShallow';

export const aspect: TileGenerator<AspectTileSelect> = (
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
    matchingTargets = targets.filter((x) =>
      areEqualShallow(tileSelect.aspect, x.properties)
    );
  } else {
    targets = hexList.filter((x) => x.contains.length);
    matchingTargets = targets.filter((x) =>
      areEqualShallow(tileSelect.aspect, x.contains[0].properties)
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
