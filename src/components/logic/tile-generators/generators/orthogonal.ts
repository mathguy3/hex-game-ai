import { Coordinates } from '../../../../types';
import { OrthogonalTileSelect } from '../../../../types/actions/tiles';
import { applyRecord } from '../../../../utils/record/applyRecord';
import { TileGenerator } from '../types';
import { direction } from './direction';

export const orthogonal: TileGenerator<OrthogonalTileSelect> = (
  tileSet: OrthogonalTileSelect,
  coords: Coordinates,
  ...args
) => {
  const finalSet = {};
  for (let dir = 0; dir < 6; dir++) {
    applyRecord(
      finalSet,
      direction(
        { ...tileSet, type: 'direction', direction: dir },
        coords,
        ...args
      )
    );
  }
  return finalSet;
};
