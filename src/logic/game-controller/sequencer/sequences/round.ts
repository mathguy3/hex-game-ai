import { ServerSession } from '../../../../server/games/gameManager';
import { ActionRequest } from '../doSequence';
import { sIf } from '../utils/sIf';
import { nextIndex } from './indexer/nextIndex';
import { setIndex } from './indexer/setIndex';

export const round = {
  startOp: (serverSession: ServerSession, request: ActionRequest) => {
    const nextPath = serverSession.sequenceState.path + '.round';
    serverSession.sequenceState = setIndex({
      previousContext: serverSession.sequenceState,
      path: nextPath,
      operationType: 'round',
      isComplete: false,
      localBag: {
        roundNumber: 0,
        initialPlayerId: serverSession.gameSession.gameState.activeId,
      },
      autoContinue: true,
      withBroadcast: true,
      references: serverSession.sequenceState.references ?? {},
      functions: serverSession.sequenceState.functions ?? {},
      bag: serverSession.sequenceState.bag,
    });
    //console.log('round startOp', serverSession.sequenceState);
    return serverSession;
  },
  continueOp: (serverSession: ServerSession, request: ActionRequest) => {
    const { previousContext, ...rest } = serverSession.sequenceState;
    console.log('continueOp round', rest);
    serverSession.sequenceState = nextIndex(serverSession.sequenceState);
    const { previousContext: _, ...rest2 } = serverSession.sequenceState.previousContext;
    console.log('continueOp round', rest2);

    if (
      serverSession.sequenceState.isComplete &&
      serverSession.sequenceState.previousContext.next.sequenceItem.repeat
    ) {
      const breakIf = serverSession.sequenceState.previousContext.next.sequenceItem.breakIf;
      if (breakIf) {
        const breakIfResult = sIf(breakIf, serverSession);
        console.log('breakIfResult', breakIfResult);
        if (breakIfResult) {
          return serverSession;
        }
      }
      serverSession.gameSession.gameState.activeId = serverSession.sequenceState.localBag.initialPlayerId;

      serverSession.sequenceState = setIndex({
        ...serverSession.sequenceState,
        isComplete: false,
        localBag: {
          ...serverSession.sequenceState.localBag,
          roundNumber: serverSession.sequenceState.localBag.roundNumber + 1,
        },
        references: serverSession.sequenceState.references,
      });
      console.log('round continueOp', serverSession.sequenceState);
    }

    return serverSession;
  },
};
