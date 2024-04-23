import { CoordinateKey, Coordinates, Tile } from '../../../../types';
import { TileSelect } from '../../../../types/actions/tiles';
import { ActionState } from '../../../../types/game';
import { evalIf } from '../../if/getIf';
import * as tileGenerators from '../../tile-generators';
import { TileGenerator } from '../../tile-generators/types';
import { defaultIsValidTile } from './defaultIsValidTile';

export const generateTiles = (
  tileSelect: TileSelect,
  target: Coordinates,
  actionState: ActionState,
  isValidTile?: (tile: {
    key: CoordinateKey;
    coordinates: Coordinates;
  }) => boolean,
  initialSearch?: Record<string, Tile>
): Record<string, Tile> => {
  const generator = tileGenerators[
    tileSelect.type
  ] as TileGenerator<TileSelect>;

  if (!generator) {
    console.error('no tile generator for', tileSelect.type);
    return {};
  }

  console.log('running generator for', tileSelect, target);
  return generator(
    tileSelect,
    target,
    actionState,
    (tile) => {
      const isUniversallyValid = defaultIsValidTile(tile, target, actionState);
      const isValid = !isValidTile || isValidTile?.(tile);
      //console.log('-----------------------------');
      const passesCheck =
        !tileSelect.tileIf ||
        evalIf(tileSelect.tileIf, {
          target: { parent: actionState.mapState, field: tile.key },
        });
      /*console.log(
        tileSelect,
        'tile',
        actionState.mapState[tile.key],
        'at',
        tile.key,
        'is',
        isUniversallyValid,
        isValid,
        passesCheck
      );*/
      return isUniversallyValid && isValid && passesCheck;
    },
    initialSearch
  );
};
