import { ServerSession } from '../../../../server/games/gameManager';
import { ActionRequest } from '../doSequence';

export const start = {
  startOp: (serverSession: ServerSession, request: ActionRequest) => {
    if (request.type !== 'start') {
      throw new Error('Request is not a start');
    }

    serverSession.gameSession.gameState.hasStarted = true;
    serverSession.gameSession.gameState.activeStep = 'start';
    const nextOperation = Object.keys(serverSession.sequenceState.nextSequenceItem)[0];
    serverSession.sequenceState = {
      previousContext: serverSession.sequenceState,
      path: 'start',
      operationType: 'start',
      nextOperation,
      isComplete: false,
      autoContinue: true,
      nextSequenceItem: serverSession.sequenceState.nextSequenceItem[nextOperation],
      bag: serverSession.sequenceState.bag,
    };
    return serverSession;
  },
  continueOp: (serverSession: ServerSession, request: ActionRequest) => {
    serverSession.sequenceState.isComplete = true;
    serverSession.sequenceState.isGameOver = true;
    serverSession.sequenceState.autoContinue = false;
    serverSession.gameSession.gameState.activeStep = 'end';
    return serverSession;
  },
};
