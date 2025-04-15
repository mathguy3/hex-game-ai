import { ServerSession } from '../../../../../server/games/gameManager';
import { sEval } from '../../utils/sEval';

export const move = {
  resolve: (serverSession: ServerSession, action: any) => {
    const { from, to } = action;
    //console.log('move action', action);
    const { source, id, slot } = from;
    const { source: toSource, id: toId, slot: toSlot } = to;

    const fromResolvedId = sEval(id, serverSession);

    const toResolvedId = toSource !== 'supply' ? sEval(toId, serverSession) : null;

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
