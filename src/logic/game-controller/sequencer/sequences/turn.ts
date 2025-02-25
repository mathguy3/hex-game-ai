import { ServerSession } from '../../../../server/games/gameManager';
import { ActionRequest } from '../doSequence';

export const turn = {
  startOp: (serverSession: ServerSession, request: ActionRequest) => {
    // There might be a phases, or a turn, or.. another round?
    const roundItem = serverSession.sequenceState.sequenceItem;
    const nextGroup = roundItem.phases ?? roundItem.turns ?? roundItem.actions;
    const initialIndex = 0;
    const firstItem = nextGroup[initialIndex];
    const nextOperation = Object.keys(firstItem)[0];
    if (!nextOperation) {
      throw new Error('No next operation found');
    }

    const nextPath = serverSession.sequenceState.path + '.turn';
    serverSession.gameSession.gameState.activeStep = nextPath;
    serverSession.sequenceState = {
      previousContext: serverSession.sequenceState,
      path: nextPath,
      operationType: 'turn',
      nextOperation,
      isComplete: false,
      sequenceItem: firstItem[nextOperation],
      localBag: {
        index: initialIndex,
        initialPlayerId: serverSession.gameSession.gameState.activeId,
        completedPlayers: [],
      },
      autoContinue: true,
      withBroadcast: true,
      bag: serverSession.sequenceState.bag,
    };
    return serverSession;
  },
  continueOp: (serverSession: ServerSession, request: ActionRequest) => {
    // There might be a phases, or a turn, or.. another round?
    // If there is a phases, or a turn, or.. another round, then we need to get the next item
    const turnItem = serverSession.sequenceState.previousContext.sequenceItem;
    const nextGroup = turnItem.phases ?? turnItem.turns ?? turnItem.actions;
    const nextIndex = serverSession.sequenceState.localBag.index + 1;
    if (nextIndex >= nextGroup.length) {
      if (turnItem.allPlayers) {
        // move to next player
        const activePlayerId = serverSession.gameSession.gameState.activeId;
        if (!serverSession.sequenceState.localBag.completedPlayers) {
          console.log('no completed players', serverSession.sequenceState.localBag);
        }
        const nextPlayerId = Object.values(serverSession.gameSession.gameState.seats).find(
          (seat) =>
            seat.id !== activePlayerId &&
            !serverSession.sequenceState.localBag.completedPlayers.includes(seat.id) &&
            !!seat.userId
        )?.id;
        if (!nextPlayerId) {
          console.log('completing turn', serverSession.sequenceState.path, serverSession.sequenceState.localBag);
          serverSession.gameSession.gameState.activeId = serverSession.sequenceState.localBag.initialPlayerId;
          serverSession.sequenceState.isComplete = true;
          return serverSession;
        }
        console.log('next player', nextPlayerId);
        serverSession.gameSession.gameState.activeId = nextPlayerId;

        const initialIndex = 0;
        const firstItem = nextGroup[initialIndex];
        const nextOperation = Object.keys(firstItem)[0];
        serverSession.sequenceState = {
          ...serverSession.sequenceState,
          nextOperation,
          sequenceItem: firstItem[nextOperation],
          localBag: {
            ...serverSession.sequenceState.localBag,
            index: initialIndex,
            completedPlayers: [...serverSession.sequenceState.localBag.completedPlayers, activePlayerId],
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
