import { CoordinateKey, Coordinates, Tile } from '../../../types';
import { TileSelect } from '../../../types/actions/tiles';
import { ActionState } from '../../../types/game';
import { getKey } from '../../../utils/coordinates/getKey';
import { evalIf } from '../../if/if-engine/eval-if';
import * as tileGenerators from '../../tile-generators';
import { TileGenerator } from '../../tile-generators/types';
import { defaultIsValidTile } from './defaultIsValidTile';

export const generateTiles = (
  tileSelect: TileSelect,
  subject: Coordinates,
  actionState: ActionState,
  isValidTile?: (tile: { key: CoordinateKey; coordinates: Coordinates }) => boolean,
  initialSearch?: Record<string, Tile>
): Record<string, Tile> => {
  const generator = tileGenerators[tileSelect.type] as TileGenerator<TileSelect>;

  //const generator
  if (!generator) {
    console.error('no tile generator for', tileSelect.type);
    return {};
  }

  //////// NEED TO RUN THE TILE CHECK EVEN IF THE GENERATOR DOESN"T
  function checkTile(tile: Tile) {
    const isUniversallyValid = defaultIsValidTile(tile, subject, actionState);
    const isValid = isUniversallyValid && (!isValidTile || isValidTile?.(tile));

    const passesCheck =
      isValid &&
      (!tileSelect.tileIf ||
        evalIf(tileSelect.tileIf, {
          subject: { parent: actionState.mapState, field: getKey(subject) },
          target: { parent: actionState.mapState, field: tile.key },
          context: { parent: actionState, field: 'gameState' },
        }));

    console.log('log every one', tile, passesCheck);
    return isUniversallyValid && isValid && passesCheck;
  }
  const results = generator(tileSelect, subject, actionState, checkTile, initialSearch);
  const results2 = Object.fromEntries(Object.entries(results).filter((x) => checkTile(x[1])));
  return results2;
};
