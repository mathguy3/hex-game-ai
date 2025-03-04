import { ServerSession } from '../../../../../server/games/gameManager';
import { doEval } from '../../../../if/if-engine-3/doEval';

export const move = {
  resolve: (serverSession: ServerSession, action: any) => {
    const { from, to } = action;
    //console.log('move action', action);
    const { store, id, link } = from;
    const { store: toStore, id: toId, link: toLink } = to;

    const fromResolvedId = doEval({
      ifItem: id,
      model: {
        context: serverSession.gameSession.gameState as any,
        ...(serverSession.sequenceState.bag.references || {}),
      },
      procedures: serverSession.gameSession.gameDefinition.definitions.procedures,
    });

    const toResolvedId =
      toStore !== 'supply'
        ? doEval({
            ifItem: toId,
            model: {
              context: serverSession.gameSession.gameState as any,
              ...(serverSession.sequenceState.bag.references || {}),
            },
            procedures: serverSession.gameSession.gameDefinition.definitions.procedures,
          })
        : null;

    //console.log('move action', action, fromResolvedId, toResolvedId);

    if (toStore !== 'supply') {
      serverSession.gameSession.gameState.data[toStore][toResolvedId][toLink] =
        serverSession.gameSession.gameState.data[store][fromResolvedId][link];
    }

    serverSession.gameSession.gameState.data[store][fromResolvedId][link] = undefined;

    serverSession.gameSession.localControl = {
      activeOptions: [],
      ...(serverSession.gameSession.localControl || {}),
      transitions: {
        move: {
          ...action,
          from: {
            ...from,
            id: fromResolvedId,
          },
          to: {
            ...to,
            id: toResolvedId,
          },
        },
      },
    };

    return serverSession;
  },
};
