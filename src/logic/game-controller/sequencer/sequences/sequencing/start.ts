import { ServerSession } from '../../../../../server/games/gameManager';
import { ActionRequest } from '../../doSequence';
import { nextSequenceOperation } from '../indexer/nextSequenceOperation';

export const start = {
  startOp: (serverSession: ServerSession, request: ActionRequest) => {
    if (request.type !== 'start') {
      throw new Error('Request is not a start');
    }

    serverSession.gameSession.gameState.hasStarted = true;
    const nextOperation = nextSequenceOperation(serverSession.sequenceState.next.sequenceItem);
    serverSession.sequenceState = {
      previousContext: serverSession.sequenceState,
      path: 'start',
      operationType: 'start',
      next: {
        operationType: nextOperation,
        sequenceItem: serverSession.sequenceState.next.sequenceItem[nextOperation],
      },
      isComplete: false,
      autoContinue: true,
      bag: {
        ...serverSession.sequenceState.bag,
        references: serverSession.sequenceState.bag.references ?? {},
        functions: serverSession.sequenceState.bag.functions ?? {},
      },
      references: serverSession.sequenceState.references ?? {},
      functions: serverSession.sequenceState.functions ?? {},
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
