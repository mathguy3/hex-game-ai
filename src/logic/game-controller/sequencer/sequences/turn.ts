import { ServerSession } from '../../../../server/games/gameManager';
import { doEval } from '../../../if/if-engine-3/doEval';
import { ActionRequest } from '../doSequence';
import { nextIndex } from './indexer/nextIndex';
import { setIndex } from './indexer/setIndex';
export const turn = {
  startOp: (serverSession: ServerSession, request: ActionRequest) => {
    const { sequenceState, gameSession } = serverSession;
    const { nextSequenceItem } = sequenceState;
    const nextPath = sequenceState.path + '.turn';
    gameSession.gameState.activeStep = nextPath;
    const specifiedOrder = nextSequenceItem.order
      ? doEval({
          ifItem: nextSequenceItem.order,
          model: {
            context: gameSession.gameState,
            ...sequenceState.bag.references,
          },
          procedures: gameSession.gameDefinition.definitions.procedures,
        })
      : undefined;
    const order = specifiedOrder
      ? specifiedOrder
      : Object.entries(gameSession.gameState.seats)
          .filter(([id, seat]) => seat.userId)
          .map(([id, seat]) => id);
    console.log('turn', order, gameSession.gameState.activeId);
    serverSession.sequenceState = setIndex(
      {
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
        bag: sequenceState.bag,
      },
      serverSession.gameSession.gameDefinition.definitions.procedures
    );
    return serverSession;
  },
  continueOp: (serverSession: ServerSession, request: ActionRequest) => {
    serverSession.sequenceState = nextIndex(
      serverSession.sequenceState,
      serverSession.gameSession.gameDefinition.definitions.procedures
    );
    if (serverSession.sequenceState.isComplete) {
      console.log(
        'end of turn??',
        serverSession.sequenceState.localBag.orderIndex,
        serverSession.sequenceState.localBag.order.length,
        serverSession.sequenceState.previousContext.nextSequenceItem.allPlayers
      );
    }
    if (
      serverSession.sequenceState.isComplete &&
      (serverSession.sequenceState.previousContext.nextSequenceItem.allPlayers ||
        serverSession.sequenceState.previousContext.nextSequenceItem.order)
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

      serverSession.sequenceState = setIndex(
        {
          ...serverSession.sequenceState,
          localBag: {
            ...serverSession.sequenceState.localBag,
            orderIndex: nextOrderIndex,
          },
        },
        serverSession.gameSession.gameDefinition.definitions.procedures
      );
      const { previousContext, ...rest } = serverSession.sequenceState;
      console.log('should keep going?', rest);
    }

    return serverSession;
  },
};
