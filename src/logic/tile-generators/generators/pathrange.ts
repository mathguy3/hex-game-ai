import { Tile } from '../../../types';
import { RangeTileSelect } from '../../../types/actions/tiles';
import { getKey } from '../../../utils/coordinates/getKey';
import { TileGenerator } from '../types';
import { getNeighbor } from '../utils/getNeighbor';

export const pathrange: TileGenerator<RangeTileSelect> = (tileSet, coords, actionState, isValidTile) => {
  const startTile = {
    type: 'pathrange' as const,
    key: getKey(coords),
    coordinates: coords,
    pathRange: 0,
  };
  const visited: Record<string, Tile> = isValidTile(startTile)
    ? {
        [startTile.key]: startTile,
      }
    : {};
  const fringes = [[startTile]];
  for (let i = 1; i <= tileSet.range; i++) {
    fringes.push([]);
    for (const hex of fringes[i - 1]) {
      for (let direction = 0; direction < 6; direction++) {
        const neighbor = getNeighbor(hex.coordinates, direction);
        const key = getKey(neighbor);

        if (!visited[key] && isValidTile({ key, coordinates: neighbor })) {
          const neighborTile = {
            type: 'pathrange' as const,
            key,
            coordinates: neighbor,
            pathRange: i,
          };
          visited[key] = neighborTile;
          fringes[i].push(neighborTile);
        }
      }
    }
  }

  return visited;
};
