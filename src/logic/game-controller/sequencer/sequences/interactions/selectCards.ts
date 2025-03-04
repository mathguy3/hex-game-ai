import { ActionRequest, InteractActionRequest } from '../..';
import { ServerSession } from '../../../../../server/games/gameManager';
import { PlayerState } from '../../../../../types/game';
import { nextIndex } from '../indexer/nextIndex';
import { setIndex } from '../indexer/setIndex';

export const selectCards = {
  startOp: (serverSession: ServerSession, continueRequest: InteractActionRequest) => {
    const { interactRequest: request } = serverSession.sequenceState.localBag;
    const gameState = serverSession.gameSession.gameState;
    const option = serverSession.sequenceState.nextSequenceItem;
    console.log(request);
    // Request.subjects length should equal option.card.select?.count
    if (request.subjects.length !== option.select?.count) {
      throw new Error('Invalid number of subjects');
    }
    if (option.select?.from === 'hand') {
      // For each subject, find the card in the hand and move it to the selectedCards array
      const playerState = gameState.data[request.playerId] as PlayerState;
      const selectedCards = [];
      for (const subject of request.subjects) {
        const card = playerState.hand.find((x) => x.id === subject.id);

        if (!card) {
          throw new Error('Card not found in hand');
        }
        selectedCards.push(card);
      }
      // Move the selected cards to the selectedCards array
      playerState.hand = playerState.hand.filter((x) => !selectedCards.includes(x));
      playerState.selectedCards = selectedCards;
    }

    const nextPath = serverSession.sequenceState.path + '.selectCards';
    serverSession.gameSession.gameState.activeStep = nextPath;
    serverSession.gameSession.localControl = null;

    serverSession.sequenceState = setIndex({
      previousContext: serverSession.sequenceState,
      path: nextPath,
      operationType: 'selectCards',
      isComplete: true,
      autoContinue: true,
      bag: serverSession.sequenceState.bag,
    });
    return serverSession;
  },
  continueOp: (serverSession: ServerSession, request: ActionRequest) => {
    serverSession.sequenceState = nextIndex(serverSession.sequenceState);
    return serverSession;
  },
};
