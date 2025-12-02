import { ServerSession } from '../../../../../server/games/gameManager';
import { ActionRequest } from '../../doSequence';
import { sEval } from '../../utils/sEval';
import { nextIndex } from '../indexer/nextIndex';
import { setIndex } from '../indexer/setIndex';

export const turn = {
  startOp: (serverSession: ServerSession, request: ActionRequest) => {
    const { sequenceState, gameSession } = serverSession;
    const { next } = sequenceState;
    const { sequenceItem } = next;
    const nextPath = sequenceState.path + '.turn';
    gameSession.gameState.activeStep = nextPath;
    const order =
      (sequenceItem.order && sEval(sequenceItem.order, serverSession)) ||
      Object.entries(gameSession.gameState.seats)
        .filter(([id, seat]) => seat.isActive)
        .map(([id, seat]) => id);
    serverSession.sequenceState = setIndex(serverSession, {
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
      bag: {
        ...sequenceState.bag,
        references: {
          ...sequenceState.bag.references,
          player: gameSession.gameState.data[gameSession.gameState.activeId],
        },
      },
    });
    return serverSession;
  },
  continueOp: (serverSession: ServerSession, request: ActionRequest) => {
    serverSession.sequenceState = nextIndex(serverSession, serverSession.sequenceState);
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

        console.log('turns complete', serverSession.gameSession.gameState.activePath);
        return serverSession;
      }
      const nextPlayerId = serverSession.sequenceState.localBag.order[nextOrderIndex];
      serverSession.gameSession.gameState.activeId = nextPlayerId;

      console.log('turns continue', serverSession.sequenceState.localBag.index);
      console.log('turns continue', serverSession.sequenceState.previousContext.next.sequenceItem);
      serverSession.sequenceState = setIndex(serverSession, {
        ...serverSession.sequenceState,
        localBag: {
          ...serverSession.sequenceState.localBag,
          orderIndex: nextOrderIndex,
        },
        references: serverSession.sequenceState.references,
        bag: {
          ...serverSession.sequenceState.bag,
          references: {
            ...serverSession.sequenceState.bag.references,
            player: serverSession.gameSession.gameState.data[nextPlayerId],
          },
        },
      });
      console.log(
        'turns continue',
        serverSession.sequenceState.localBag.index,
        serverSession.gameSession.gameState.activeId,
        serverSession.gameSession.gameState.activePath
      );
    }

    return serverSession;
  },
};
