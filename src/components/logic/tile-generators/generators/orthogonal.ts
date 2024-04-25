import { Coordinates } from '../../../../types';
import { OrthogonalTileSelect } from '../../../../types/actions/tiles';
import { TileGenerator } from '../types';
import { coordsToTiles } from '../utils/coordsToTiles';
import { getDirection } from '../utils/getNeighbor';
import { vectorAdd } from '../utils/vectorAdd';
import { vectorScale } from '../utils/vectorScale';

export const orthogonal: TileGenerator<OrthogonalTileSelect> = (
  tileSet: OrthogonalTileSelect,
  coords: Coordinates
) => {
  const { range } = tileSet;
  let finalSet = [];
  for (let direction = 0; direction < 6; direction++) {
    for (let r = 1; r <= range; r++) {
      finalSet.push(vectorAdd(coords, vectorScale(getDirection(direction), r)));
    }
  }
  return coordsToTiles(finalSet);
};
