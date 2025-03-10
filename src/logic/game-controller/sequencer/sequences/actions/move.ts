import { ServerSession } from '../../../../../server/games/gameManager';
import { doEval } from '../../../../if/if-engine-3/doEval';

export const move = {
  resolve: (serverSession: ServerSession, action: any) => {
    const { from, to } = action;
    //console.log('move action', action);
    const { source, id, slot } = from;
    const { source: toSource, id: toId, slot: toSlot } = to;

    const fromResolvedId = doEval({
      ifItem: id,
      model: {
        context: serverSession.gameSession.gameState as any,
        ...(serverSession.sequenceState.bag.references || {}),
      },
      procedures: serverSession.gameSession.gameDefinition.definitions.procedures,
    });

    const toResolvedId =
      toSource !== 'supply'
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

    if (toSource !== 'supply') {
      console.log('move', toSource, toResolvedId, toSlot, source, fromResolvedId, slot);
      serverSession.gameSession.gameState.data[toSource][toResolvedId][toSlot] =
        serverSession.gameSession.gameState.data[source][fromResolvedId][slot];
    }

    serverSession.gameSession.gameState.data[source][fromResolvedId][slot] = undefined;

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
