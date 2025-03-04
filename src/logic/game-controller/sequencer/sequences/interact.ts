import { ServerSession } from '../../../../server/games/gameManager';
import { ActionRequest, InteractActionRequest } from '../doSequence';

export const interact = {
  startOp: (serverSession: ServerSession, request: InteractActionRequest) => {
    if (request.type !== 'interact') {
      throw new Error('wrong request type, should be interact');
    }

    //console.log('interact', serverSession.sequenceState.nextSequenceItem);

    const optionKey = request.kind === 'selectCards' || request.kind === 'playCard' ? 'card' : request.kind;
    const option = serverSession.sequenceState.nextSequenceItem.options.find((x) => Object.keys(x)[0] === optionKey);

    const nextPath = serverSession.sequenceState.path + '.interact';
    serverSession.gameSession.gameState.activeStep = nextPath;
    serverSession.gameSession.localControl = null;

    const nextOperation = request.kind;
    if (!nextOperation) {
      throw new Error('No next operation found');
    }
    const nextSequenceItem = option[optionKey];

    serverSession.sequenceState = {
      previousContext: serverSession.sequenceState,
      path: nextPath,
      operationType: 'interact',
      isComplete: false,
      nextOperation,
      nextSequenceItem,
      autoContinue: true,
      localBag: {
        interactRequest: request,
      },
      bag: serverSession.sequenceState.bag,
    };

    return serverSession;
  },
  continueOp: (serverSession: ServerSession, request: ActionRequest) => {
    serverSession.sequenceState.isComplete = true;

    return serverSession;
  },
};
