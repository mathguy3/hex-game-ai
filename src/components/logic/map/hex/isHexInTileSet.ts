import { originHex } from '../../../../configuration/constants';
import { Coordinates } from '../../../../types';
import { TileSet } from '../../../../types/actions/tiles';
import { ActionState } from '../../../../types/game';
import { getKey } from '../../../../utils/coordinates/getKey';
import { generateTileSet } from './generateTileSet';

export function isHexInTileSet(
  hex: Coordinates,
  tileSet: TileSet,
  actionState: ActionState
): boolean {
  const generatedTileSet = generateTileSet(tileSet, hex, actionState, true);
  const hexKey = getKey(hex);
  return hexKey in generatedTileSet;
}
