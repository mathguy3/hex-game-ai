import { Coordinates } from '../../../types';
import { DistanceTileSelect } from '../../../types/actions/tiles';
import { TileGenerator } from '../types';
import { coordsToTiles } from '../utils/coordsToTiles';
import { getDirection, getNeighbor } from '../utils/getNeighbor';
import { vectorAdd } from '../utils/vectorAdd';
import { vectorScale } from '../utils/vectorScale';

export const distance: TileGenerator<DistanceTileSelect> = (tileSet: DistanceTileSelect, coords: Coordinates) => {
  const { range, tileIf } = tileSet;
  const finalCoords = [];
  let currentHex = vectorAdd(coords, vectorScale(getDirection(4), range));
  for (let direction = 0; direction < 6; direction++) {
    for (let r = 0; r < range; r++) {
      finalCoords.push(currentHex);
      currentHex = getNeighbor(currentHex, direction);
    }
  }
  //console.log('Distance gen', finalCoords);
  const tileRecord = coordsToTiles(finalCoords);
  //console.log('distance gen', tileRecord);
  return tileRecord;
};
