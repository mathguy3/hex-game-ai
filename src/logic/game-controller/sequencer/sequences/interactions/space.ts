import { ActionRequest, InteractActionRequest } from '../..';
import { ServerSession } from '../../../../../server/games/gameManager';
import { nextIndex } from '../indexer/nextIndex';
import { setIndex } from '../indexer/setIndex';

export const space = {
  startOp: (serverSession: ServerSession, continueRequest: InteractActionRequest) => {
    const { interactRequest: request } = serverSession.sequenceState.localBag;
    const subject = request.subjects[0];
    if (subject.type !== 'space') {
      throw new Error('Invalid subject');
    }

    const nextPath = serverSession.sequenceState.path + '.space';
    serverSession.gameSession.gameState.activeStep = nextPath;
    serverSession.gameSession.localControl = null;

    const subjectSpace = serverSession.gameSession.gameState.data[subject.from][subject.id];
    const targetSpace = serverSession.gameSession.gameState.data[subject.targets[0].from][subject.targets[0].id];
    const targetSpaces = subject.targets.map((x) => serverSession.gameSession.gameState.data[x.from][x.id]);

    serverSession.sequenceState = setIndex({
      previousContext: serverSession.sequenceState,
      path: nextPath,
      operationType: 'space',
      isComplete: false,
      autoContinue: true,
      bag: {
        ...serverSession.sequenceState.bag,
        references: {
          subjectSpace,
          targetSpace,
          targetSpaces,
        },
      },
    });
    return serverSession;
  },
  continueOp: (serverSession: ServerSession, request: ActionRequest) => {
    serverSession.sequenceState = nextIndex(serverSession.sequenceState);
    return serverSession;
  },
};
