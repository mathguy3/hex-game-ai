import { ServerSession } from '../../../../server/games/gameManager';
import { ActionRequest } from '../doSequence';

export const ackAnnounce = {
  startOp: (game: ServerSession, request: ActionRequest) => {
    const { gameSession, sequenceState } = game;
    const nextPath = sequenceState.path + '.ackAnnounce';
    gameSession.gameState.activeStep = nextPath;
    game.sequenceState = {
      previousContext: sequenceState,
      path: nextPath,
      operationType: 'ackAnnounce',
      isComplete: true,
      autoContinue: true,
      withBroadcast: true,
      bag: sequenceState.bag,
      nextSequenceItem: sequenceState.nextSequenceItem,
    };
    return game;
  },
  continueOp: (game: ServerSession, request: ActionRequest) => {
    game.sequenceState.isComplete = true;
    return game;
  },
};
