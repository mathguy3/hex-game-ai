import { Coordinates, Tile } from '../../../../types';
import { TileSet } from '../../../../types/actions/tiles';
import { ActionState } from '../../../../types/game';
import { getKey } from '../../../../utils/coordinates/getKey';
import { diffRecord } from '../../../../utils/record/diffRecord';
import { intersectRecords } from '../../../../utils/record/intersectRecords';
import { mapToRecord } from '../../../../utils/record/mapToRecord';
import { evalIf } from '../../if/getIf';
import { generateTiles } from './generateTiles';

export function generateTileSet(
  tileGen: TileSet,
  target: Coordinates,
  actionState: ActionState
): Record<string, Tile> {
  const tileAddsToUse = tileGen.add.filter(
    (x) =>
      !x.if ||
      evalIf(x.if, {
        subject: { parent: actionState.mapState, field: getKey(target) },
      })
  );
  const initial = mapToRecord(tileAddsToUse, (select) =>
    generateTiles(select, target, actionState)
  );

  //console.log('initial generation', initial);
  const limitTo = tileGen.limit?.length
    ? mapToRecord(tileGen.limit, (select) =>
        generateTiles(select, target, actionState)
      )
    : undefined;

  //console.log('limit generation', limitTo);
  const limited = limitTo ? intersectRecords(initial, limitTo) : initial;

  const toRemove = tileGen.not?.length
    ? mapToRecord(tileGen.not, (select) =>
        generateTiles(select, target, actionState)
      )
    : undefined;

  //console.log('remove generation', toRemove);
  const final = toRemove ? diffRecord(limited, toRemove) : limited;
  //console.log('final generation', final);
  return final;
}
