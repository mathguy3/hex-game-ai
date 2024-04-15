import { Coordinates, Tile } from '../../../../types';
import { ActionState } from '../../../../types/game';
import { TileSet } from '../../../../types/interactions';
import { diffRecord } from '../../../../utils/record/diffRecord';
import { intersectRecords } from '../../../../utils/record/intersectRecords';
import { mapToRecord } from '../../../../utils/record/mapToRecord';
import { generateTiles } from './generateTiles';

export function generateTileSet(
  coords: Coordinates,
  tileGen: TileSet,
  actionState: ActionState
): Record<string, Tile> {
  const initial = mapToRecord(tileGen.add, (select) =>
    generateTiles(coords, select)
  );

  const limitTo = tileGen.limit
    ? mapToRecord(tileGen.limit, (select) => generateTiles(coords, select))
    : undefined;

  const limited = limitTo ? intersectRecords(initial, limitTo) : undefined;

  const toRemove = tileGen.not
    ? mapToRecord(tileGen.not, (select) => generateTiles(coords, select))
    : undefined;

  const final = toRemove ? diffRecord(limited, toRemove) : limited;

  return final;
}
