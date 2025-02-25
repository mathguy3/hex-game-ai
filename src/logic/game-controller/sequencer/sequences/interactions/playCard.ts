import { InteractActionRequest } from '../..';
import { ServerSession } from '../../../../../server/games/gameManager';
import { PlayerState } from '../../../../../types/game';

export const playCard = {
  resolve: (serverSession: ServerSession, option: any, request: InteractActionRequest) => {
    const gameState = serverSession.gameSession.gameState;
    // Request.subjects length should equal option.card.select?.count
    const subject = request.subjects[0];
    if (subject.type !== 'card') {
      throw new Error('Invalid subject');
    }
    if (!subject.action) {
      throw new Error('Action not found');
    }
    console.log('playCard', subject, option);
    const playerState = gameState.data[gameState.activeId] as PlayerState;
    const sourceType = option.card.play?.from;
    const source = sourceType === 'hand' ? playerState.hand : playerState.selectedCards;
    const card = source.find((x) => x.id === subject.id);
    if (!card) {
      throw new Error('Card not found');
    }
    const action = card.actions[subject.action];
    if (!action) {
      throw new Error('Action not found');
    }

    const nextPath = serverSession.sequenceState.path + '.interact';
    serverSession.gameSession.gameState.activeStep = nextPath;
    serverSession.gameSession.localControl = null;

    console.log('playCard', action);

    const nextOperation = Object.keys(action)[0];
    const nextSequenceItem = action[nextOperation];

    serverSession.sequenceState = {
      previousContext: serverSession.sequenceState,
      path: nextPath,
      operationType: 'interact',
      isComplete: false,
      autoContinue: true,
      nextOperation,
      sequenceItem: nextSequenceItem,
      bag: serverSession.sequenceState.bag,
    };
    return serverSession;
  },
};
