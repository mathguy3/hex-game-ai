import { ServerSession } from '../../../../server/games/gameManager';
import { ActionRequest } from '../doSequence';

export const announce = {
  startOp: (serverSession: ServerSession, request: ActionRequest) => {
    serverSession.sequenceState = {
      previousContext: serverSession.sequenceState,
      path: serverSession.sequenceState.path + '.announce',
      operationType: 'announce',
      autoContinue: true,
      withBroadcast: true,
      isComplete: true,
      bag: serverSession.sequenceState.bag,
      nextOperation: 'ackAnnounce',
      nextSequenceItem: serverSession.sequenceState.nextSequenceItem,
    };
    serverSession.gameSession.localControl = {
      activeOptions: [],
      activeAnnounce: {
        to: serverSession.sequenceState.nextSequenceItem.to,
        message: serverSession.sequenceState.nextSequenceItem.message,
      },
    };
    return serverSession;
  },
  continueOp: (serverSession: ServerSession, request: ActionRequest) => {
    serverSession.sequenceState.isComplete = true;
    return serverSession;
  },
};
