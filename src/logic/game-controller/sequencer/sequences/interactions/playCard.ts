import { ActionRequest, InteractActionRequest } from '../..';
import { ServerSession } from '../../../../../server/games/gameManager';
import { PlayerState } from '../../../../../types/game';
import { nextIndex } from '../indexer/nextIndex';
import { setIndex } from '../indexer/setIndex';

export const playCard = {
  startOp: (serverSession: ServerSession, continueRequest: InteractActionRequest) => {
    const { interactRequest: request } = serverSession.sequenceState.localBag;
    const gameState = serverSession.gameSession.gameState;
    const option = serverSession.sequenceState.nextSequenceItem;
    // Request.subjects length should equal option.card.select?.count
    const subject = request.subjects[0];
    if (subject.type !== 'card') {
      throw new Error('Invalid subject');
    }
    if (!subject.action) {
      throw new Error('Action not found');
    }
    //console.log('playCard', subject, option);
    const playerState = gameState.data[gameState.activeId] as PlayerState;
    const sourceType = option.play?.from;
    const source = sourceType === 'hand' ? playerState.hand : playerState.selectedCards;
    const card = source.find((x) => x.id === subject.id);
    if (!card) {
      throw new Error('Card not found');
    }
    const action = card.actions[subject.action];
    if (!action) {
      throw new Error('Action not found');
    }
    //console.log('card', card);

    const nextPath = serverSession.sequenceState.path + '.playCard';
    serverSession.gameSession.gameState.activeStep = nextPath;
    serverSession.gameSession.localControl = null;

    //console.log('playCard action', action);

    const nextOperation = Object.keys(action)[0];
    const nextSequenceItem = action[nextOperation];

    serverSession.sequenceState = {
      previousContext: serverSession.sequenceState,
      path: nextPath,
      operationType: 'playCard',
      isComplete: false,
      autoContinue: true,
      bag: serverSession.sequenceState.bag,
      nextSequenceItem,
      nextOperation,
    };
    //console.log(
    //  'playCard sequenceState',
    //  serverSession.sequenceState.nextSequenceItem,
    //  serverSession.sequenceState.nextOperation
    //);

    return serverSession;
  },
  continueOp: (serverSession: ServerSession, request: ActionRequest) => {
    serverSession.sequenceState.isComplete = true;
    return serverSession;
  },
};
