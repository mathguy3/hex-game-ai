import { ServerSession } from '../../../../../server/games/gameManager';
import { sEval } from '../../utils/sEval';

const handlers = {
  token: moveToken,
  card: moveCard,
};

export const move = {
  resolve: (serverSession: ServerSession, action: any) => {
    console.log('move', action);
    const actionType = Object.keys(action)[0];
    serverSession = handlers[actionType](serverSession, action[actionType]);
    return serverSession;
  },
};

function moveCard(serverSession: ServerSession, action: any) {
  const { from, to } = action;
  const { source, id, slot } = from;
  const { source: toSource, id: toId, slot: toSlot } = to;

  const sourceId = sEval(source, serverSession);
  let sourceList = serverSession.gameSession.gameState.data[sourceId];
  if (slot) {
    sourceList = sourceList[slot];
  }
  const sourceIndex = sourceList.findIndex((item: any) => item.id === id);
  const sourceItem = sourceList[sourceIndex];
  sourceList.splice(sourceIndex, 1);

  const toSourceId = sEval(toSource, serverSession);
  let toList = serverSession.gameSession.gameState.data[toSourceId];
  if (toSlot) {
    toList = toList[toSlot];
  }
  toList.push(sourceItem);

  return serverSession;
}

function moveToken(serverSession: ServerSession, action: any) {
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
}
