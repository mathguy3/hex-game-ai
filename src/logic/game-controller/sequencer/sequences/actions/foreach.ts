import { ServerSession } from '../../../../../server/games/gameManager';
import { ActionRequest } from '../../doSequence';
import { sEval } from '../../utils/sEval';
import { nextIndex } from '../indexer/nextIndex';
import { setIndex } from '../indexer/setIndex';

export const foreach = {
  startOp: (serverSession: ServerSession, request: ActionRequest) => {
    const { sequenceState, gameSession } = serverSession;
    const { next } = sequenceState;
    const { sequenceItem } = next;
    const nextPath = sequenceState.path + '.foreach';
    gameSession.gameState.activeStep = nextPath;
    const items = sEval(sequenceItem.items, serverSession);
    const refName = sequenceItem.name;

    serverSession.sequenceState = setIndex(serverSession, {
      previousContext: serverSession.sequenceState,
      path: nextPath,
      operationType: 'foreach',
      isComplete: false,
      localBag: {
        initialPlayerId: gameSession.gameState.activeId,
        items,
        itemIndex: 0,
      },
      autoContinue: true,
      withBroadcast: true,
      references: serverSession.sequenceState.references,
      functions: serverSession.sequenceState.functions,
      bag: {
        ...sequenceState.bag,
        references: {
          ...sequenceState.bag.references,
          [refName ?? 'sequenceItem']: items[0],
        },
      },
    });
    return serverSession;
  },
  continueOp: (serverSession: ServerSession, request: ActionRequest) => {
    serverSession.sequenceState = nextIndex(serverSession, serverSession.sequenceState);
    if (serverSession.sequenceState.isComplete) {
      const nextItemIndex = serverSession.sequenceState.localBag.itemIndex + 1;
      serverSession.sequenceState.isComplete = false;
      if (nextItemIndex > serverSession.sequenceState.localBag.items.length) {
        serverSession.sequenceState.isComplete = true;
        serverSession.gameSession.gameState.activeId = serverSession.sequenceState.localBag.initialPlayerId;
        return serverSession;
      }
      const nextItem = serverSession.sequenceState.localBag.items[nextItemIndex];
      //serverSession.gameSession.gameState.activeId = nextPlayerId;
      serverSession.sequenceState = setIndex(serverSession, {
        ...serverSession.sequenceState,
        localBag: {
          ...serverSession.sequenceState.localBag,
          itemIndex: nextItemIndex,
        },
        references: serverSession.sequenceState.references,
        functions: serverSession.sequenceState.functions,
        bag: {
          ...serverSession.sequenceState.bag,
          references: {
            ...serverSession.sequenceState.bag.references,
            sequenceItem: nextItem,
          },
        },
      });
    }

    return serverSession;
  },
};
