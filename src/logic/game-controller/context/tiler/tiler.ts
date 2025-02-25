import { ServerSession } from '../../../../server/games/gameManager';
import { Tile } from '../../../../types/coordinates';
import { doIf } from '../../../if/if-engine-3/doIf';

export const tiler = {
  add: (tiles: Tile[], add: string, serverSession: ServerSession): Tile[] => {
    const source = serverSession.gameSession.gameState.data[add];
    return tiles.concat(source);
  },
  filter: (tiles: Tile[], filter: any, serverSession: ServerSession): Tile[] => {
    return tiles.filter((tile) => {
      return doIf({
        model: {
          context: serverSession.gameSession.gameState.data,
          subject: tile,
        },
        ifItem: filter,
        procedures: serverSession.gameSession.gameDefinition.definitions.procedures,
      });
    });
  },
};
