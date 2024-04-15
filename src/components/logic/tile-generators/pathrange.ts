import { Coordinates, Tile } from '../../../types';
import { PathRangeTileSelect } from '../../../types/interactions';
import { getKey } from '../../../utils/coordinates/getKey';
import { getNeighbor } from './neighbors';

export function pathrange(
  tileSet: PathRangeTileSelect,
  coords: Coordinates,
  includeSelf: boolean = true
): Record<string, Tile> {
  const startTile = {
    type: 'pathrange' as const,
    key: getKey(coords),
    coordinates: coords,
    pathRange: 0,
  };
  const visited: Record<string, Tile> = {
    [startTile.key]: startTile,
  };
  const fringes = [[startTile]];
  for (let i = 1; i <= tileSet.range; i++) {
    fringes.push([]);
    for (const hex of fringes[i - 1]) {
      for (let direction = 0; direction < 6; direction++) {
        const neighbor = getNeighbor(hex.coordinates, direction);
        const key = getKey(neighbor);
        if (!visited[key]) {
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
  if (includeSelf) {
    return visited;
  }
  const { [startTile.key]: _removed, ...final } = visited;
  return final;
}
