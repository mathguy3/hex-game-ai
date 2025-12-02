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
      next: {
        operationType: 'ackAnnounce',
        sequenceItem: serverSession.sequenceState.next.sequenceItem,
      },
    };
    serverSession.gameSession.localControl = {
      activeOptions: [],
      activeAnnounce: {
        to: serverSession.sequenceState.next.sequenceItem.to,
        message: serverSession.sequenceState.next.sequenceItem.message,
      },
    };
    return serverSession;
  },
  continueOp: (serverSession: ServerSession, request: ActionRequest) => {
    serverSession.sequenceState.isComplete = true;
    return serverSession;
  },
};
