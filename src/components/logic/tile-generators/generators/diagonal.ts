import { Coordinates } from '../../../../types';
import { DiagonalTileSelect } from '../../../../types/actions/tiles';
import { TileGenerator } from '../types';
import { coordsToTiles } from '../utils/coordsToTiles';
import { getDiagonal } from '../utils/getDiagonal';
import { vectorAdd } from '../utils/vectorAdd';
import { vectorScale } from '../utils/vectorScale';

export const diagonal: TileGenerator<DiagonalTileSelect> = (
  tileSet: DiagonalTileSelect,
  coords: Coordinates
) => {
  const { range } = tileSet;
  let finalSet = [];
  for (let direction = 0; direction < 6; direction++) {
    for (let r = 1; r <= range; r++) {
      finalSet.push(vectorAdd(coords, vectorScale(getDiagonal(direction), r)));
    }
  }
  return coordsToTiles(finalSet);
};
