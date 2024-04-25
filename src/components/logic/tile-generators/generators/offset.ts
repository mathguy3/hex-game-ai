import { OffsetTileSelect } from '../../../../types/actions/tiles';
import { getKey } from '../../../../utils/coordinates/getKey';
import { TileGenerator } from '../types';
import { vectorAdd } from '../utils/vectorAdd';

export const offset: TileGenerator<OffsetTileSelect> = (
  tileSelect,
  target,
  actionState,
  isValidTile,
  initialSearch
) => {
  const coordinates = vectorAdd(target, tileSelect.offset);
  const key = getKey(coordinates);
  if (!isValidTile({ key, coordinates })) {
    return {};
  }
  return {
    [key]: {
      type: 'tile',
      coordinates,
      key,
    },
  };
};
