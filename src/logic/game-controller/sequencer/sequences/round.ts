import { ServerSession } from '../../../../server/games/gameManager';
import { ActionRequest } from '../doSequence';

export const round = {
  startOp: (serverSession: ServerSession, request: ActionRequest) => {
    // There might be a phases, or a turn, or.. another round?

    const roundItem = serverSession.sequenceState.sequenceItem;
    const nextGroup = roundItem.phases ?? roundItem.turns;
    const firstItem = nextGroup[0];
    const nextOperation = Object.keys(firstItem)[0];
    if (!nextOperation) {
      throw new Error('No next operation found');
    }

    const nextPath = serverSession.sequenceState.path + '.round';
    serverSession.gameSession.gameState.activeStep = nextPath;
    console.log('starting round', serverSession.gameSession.gameState.activeId);
    serverSession.sequenceState = {
      previousContext: serverSession.sequenceState,
      path: nextPath,
      operationType: 'round',
      nextOperation,
      isComplete: false,
      sequenceItem: nextGroup[0][nextOperation],
      localBag: {
        index: 0,
        initialPlayerId: serverSession.gameSession.gameState.activeId,
      },
      autoContinue: true,
      withBroadcast: true,
      bag: serverSession.sequenceState.bag,
    };
    return serverSession;
  },
  continueOp: (serverSession: ServerSession, request: ActionRequest) => {
    console.log('state', serverSession.gameSession.gameState);
    // There might be a phases, or a turn, or.. another round?
    // Repeat will be important here
    const roundItem = serverSession.sequenceState.previousContext.sequenceItem;
    const nextGroup = roundItem.phases ?? roundItem.turns ?? roundItem.actions;
    const nextIndex = serverSession.sequenceState.localBag.index + 1;
    if (nextIndex >= nextGroup.length) {
      if (roundItem.repeat) {
        const initialIndex = 0;
        serverSession.sequenceState.localBag.index = initialIndex;
        console.log('repeating round', serverSession.sequenceState.localBag);
        serverSession.gameSession.gameState.activeId = serverSession.sequenceState.localBag.initialPlayerId;
        const firstItem = nextGroup[initialIndex];
        const nextOperation = Object.keys(firstItem)[0];
        serverSession.sequenceState = {
          ...serverSession.sequenceState,
          nextOperation,
          sequenceItem: firstItem[nextOperation],
          localBag: {
            ...serverSession.sequenceState.localBag,
            index: initialIndex,
          },
        };
        return serverSession;
      }
      serverSession.sequenceState.isComplete = true;
      return serverSession;
    }

    const nextItem = nextGroup[nextIndex];

    const nextOperation = Object.keys(nextItem)[0];
    //if the next item isn't a built in operation.... maybe we just need to make it an 'action' type
    if (!nextOperation) {
      return serverSession;
    }

    if (!nextOperation) {
      throw new Error('No next operation found');
    }

    serverSession.gameSession.gameState.activeStep = serverSession.sequenceState.path;
    serverSession.sequenceState = {
      ...serverSession.sequenceState,
      nextOperation,
      sequenceItem: nextItem[nextOperation],
      localBag: {
        ...serverSession.sequenceState.localBag,
        index: nextIndex,
      },
    };

    return serverSession;
  },
};
