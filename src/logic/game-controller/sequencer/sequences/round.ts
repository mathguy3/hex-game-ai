import { ServerSession } from '../../../../server/games/gameManager';
import { doIf } from '../../../if/if-engine-3/doIf';
import { ActionRequest } from '../doSequence';
import { nextIndex } from './indexer/nextIndex';
import { setIndex } from './indexer/setIndex';

export const round = {
  startOp: (serverSession: ServerSession, request: ActionRequest) => {
    const nextPath = serverSession.sequenceState.path + '.round';
    serverSession.gameSession.gameState.activeStep = nextPath;
    console.log('round startOp', serverSession.sequenceState);
    serverSession.sequenceState = setIndex(
      {
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
        bag: serverSession.sequenceState.bag,
      },
      serverSession.gameSession.gameDefinition.definitions.procedures
    );
    console.log('round startOp', serverSession.sequenceState);
    return serverSession;
  },
  continueOp: (serverSession: ServerSession, request: ActionRequest) => {
    serverSession.sequenceState = nextIndex(
      serverSession.sequenceState,
      serverSession.gameSession.gameDefinition.definitions.procedures
    );
    //console.log('continueOp round', serverSession.sequenceState);

    if (serverSession.sequenceState.isComplete && serverSession.sequenceState.previousContext.nextSequenceItem.repeat) {
      const breakIf = serverSession.sequenceState.previousContext.nextSequenceItem.breakIf;
      if (breakIf) {
        const breakIfResult = doIf({
          ifItem: breakIf,
          model: {
            context: serverSession.gameSession.gameState,
            ...(serverSession.sequenceState.bag.references || {}),
          },
          procedures: serverSession.gameSession.gameDefinition.definitions.procedures,
        });
        console.log('breakIfResult', breakIfResult);
        if (breakIfResult) {
          return serverSession;
        }
      }
      serverSession.gameSession.gameState.activeId = serverSession.sequenceState.localBag.initialPlayerId;

      serverSession.sequenceState = setIndex(
        {
          ...serverSession.sequenceState,
          isComplete: false,
          localBag: {
            ...serverSession.sequenceState.localBag,
            roundNumber: serverSession.sequenceState.localBag.roundNumber + 1,
          },
        },
        serverSession.gameSession.gameDefinition.definitions.procedures
      );
    }

    return serverSession;
  },
};
