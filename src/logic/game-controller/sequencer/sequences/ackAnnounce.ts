import { ServerSession } from '../../../../server/games/gameManager';
import { ActionRequest } from '../doSequence';

export const ackAnnounce = {
  startOp: (serverSession: ServerSession, request: ActionRequest) => {
    const { sequenceState } = serverSession;
    const nextPath = sequenceState.path + '.ackAnnounce';
    serverSession.sequenceState = {
      previousContext: sequenceState,
      path: nextPath,
      operationType: 'ackAnnounce',
      isComplete: false,
      autoContinue: true,
      withBroadcast: true,
      bag: serverSession.sequenceState.bag,
      references: serverSession.sequenceState.references,
      functions: serverSession.sequenceState.functions,
    };
    return serverSession;
  },
  continueOp: (serverSession: ServerSession, request: ActionRequest) => {
    console.log('ackAnnounce continueOp', serverSession.sequenceState);
    serverSession.sequenceState.isComplete = true;
    return serverSession;
  },
};
