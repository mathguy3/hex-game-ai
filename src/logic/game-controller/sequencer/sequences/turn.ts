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
    const order = specifiedOrder ? specifiedOrder : Object.keys(gameSession.gameState.seats);
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
      bag: sequenceState.bag,
    });
    return serverSession;
  },
  continueOp: (serverSession: ServerSession, request: ActionRequest) => {
    serverSession.sequenceState = nextIndex(serverSession.sequenceState);
    if (
      serverSession.sequenceState.isComplete &&
      (serverSession.sequenceState.previousContext.nextSequenceItem.allPlayers ||
        serverSession.sequenceState.previousContext.nextSequenceItem.order)
    ) {
      const nextPlayerId = serverSession.sequenceState.localBag.order[serverSession.sequenceState.localBag.orderIndex];
      serverSession.gameSession.gameState.activeId = nextPlayerId;

      serverSession.sequenceState = setIndex({
        ...serverSession.sequenceState,
        localBag: {
          ...serverSession.sequenceState.localBag,
          orderIndex: serverSession.sequenceState.localBag.orderIndex + 1,
        },
      });
    }

    return serverSession;
  },
};
