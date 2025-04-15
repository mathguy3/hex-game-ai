import { ServerSession } from '../../../../server/games/gameManager';
import { doEval } from '../../../if/if-engine-3/doEval';
import { ActionRequest } from '../doSequence';
import { sEval } from '../utils/sEval';
import { nextIndex } from './indexer/nextIndex';
import { setIndex } from './indexer/setIndex';
export const turn = {
  startOp: (serverSession: ServerSession, request: ActionRequest) => {
    const { sequenceState, gameSession } = serverSession;
    const { next } = sequenceState;
    const { sequenceItem } = next;
    const nextPath = sequenceState.path + '.turn';
    gameSession.gameState.activeStep = nextPath;
    const order = sequenceItem.order
      ? sEval(sequenceItem.order, serverSession)
      : Object.entries(gameSession.gameState.seats)
          .filter(([id, seat]) => seat.isActive)
          .map(([id, seat]) => id);
    serverSession.sequenceState = setIndex({
      previousContext: serverSession.sequenceState,
      path: nextPath,
      operationType: 'turn',
      isComplete: false,
      localBag: {
        initialPlayerId: gameSession.gameState.activeId,
        order,
        orderIndex: 0,
      },
      autoContinue: true,
      withBroadcast: true,
      references: serverSession.sequenceState.references,
      bag: sequenceState.bag,
    });
    return serverSession;
  },
  continueOp: (serverSession: ServerSession, request: ActionRequest) => {
    serverSession.sequenceState = nextIndex(serverSession.sequenceState);
    if (
      serverSession.sequenceState.isComplete &&
      (serverSession.sequenceState.previousContext.next?.sequenceItem.allPlayers ||
        serverSession.sequenceState.previousContext.next?.sequenceItem.order)
    ) {
      const nextOrderIndex = serverSession.sequenceState.localBag.orderIndex + 1;
      serverSession.sequenceState.isComplete = false;
      if (nextOrderIndex >= serverSession.sequenceState.localBag.order.length) {
        serverSession.sequenceState.isComplete = true;
        serverSession.gameSession.gameState.activeId = serverSession.sequenceState.localBag.initialPlayerId;
        return serverSession;
      }
      const nextPlayerId = serverSession.sequenceState.localBag.order[nextOrderIndex];
      serverSession.gameSession.gameState.activeId = nextPlayerId;

      serverSession.sequenceState = setIndex({
        ...serverSession.sequenceState,
        localBag: {
          ...serverSession.sequenceState.localBag,
          orderIndex: nextOrderIndex,
        },
        references: serverSession.sequenceState.references,
      });
    }

    return serverSession;
  },
};
