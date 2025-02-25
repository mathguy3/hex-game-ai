import { ActionRequest, InteractActionRequest } from '../..';
import { ServerSession } from '../../../../../server/games/gameManager';
import { PlayerState } from '../../../../../types/game';

export const space = {
  resolve: (serverSession: ServerSession, option: any, request: InteractActionRequest) => {
    const gameState = serverSession.gameSession.gameState;
    // Request.subjects length should equal option.card.select?.count
    const subject = request.subjects[0];
    if (subject.type !== 'space') {
      throw new Error('Invalid subject');
    }
    const { space, actions } = option;

    // todo, validate that the subject and target match the token

    const nextPath = serverSession.sequenceState.path + '.interact';
    serverSession.gameSession.gameState.activeStep = nextPath;
    serverSession.gameSession.localControl = null;

    const nextOperation = Object.keys(actions[0])[0];
    if (!nextOperation) {
      throw new Error('No next operation found');
    }
    const nextSequenceItem = actions[0][nextOperation];

    const subjectSpace = serverSession.gameSession.gameState.data[subject.from][subject.id];
    const targetSpace = serverSession.gameSession.gameState.data[subject.targets[0].from][subject.targets[0].id];

    console.log('space subject', subject, subjectSpace, targetSpace);

    serverSession.sequenceState = {
      previousContext: serverSession.sequenceState,
      path: nextPath,
      operationType: 'interact',
      isComplete: false,
      nextOperation,
      sequenceItem: nextSequenceItem,
      localBag: {
        index: 0,
      },
      autoContinue: true,
      bag: {
        ...serverSession.sequenceState.bag,
        reference: {
          subjectSpace,
          targetSpace,
        },
      },
    };
    return serverSession;
  },
  continueOp: (serverSession: ServerSession, request: ActionRequest) => {
    // There might be a phases, or a turn, or.. another round?
    // If there is a phases, or a turn, or.. another round, then we need to get the next item
    const roundItem = serverSession.sequenceState.previousContext.sequenceItem;
    const nextGroup = roundItem.actions;
    const nextIndex = serverSession.sequenceState.localBag.index + 1;
    if (nextIndex >= nextGroup.length) {
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
        index: nextIndex,
      },
    };

    return serverSession;
  },
};
