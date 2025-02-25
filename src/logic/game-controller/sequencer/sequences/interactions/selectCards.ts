import { InteractActionRequest } from '../..';
import { ServerSession } from '../../../../../server/games/gameManager';
import { PlayerState } from '../../../../../types/game';

export const selectCards = {
  resolve: (serverSession: ServerSession, option: any, request: InteractActionRequest) => {
    const gameState = serverSession.gameSession.gameState;
    // Request.subjects length should equal option.card.select?.count
    if (request.subjects.length !== option.card.select?.count) {
      throw new Error('Invalid number of subjects');
    }
    if (option.card.select?.from === 'hand') {
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

    const nextPath = serverSession.sequenceState.path + '.interact';
    serverSession.gameSession.gameState.activeStep = nextPath;
    serverSession.gameSession.localControl = null;

    serverSession.sequenceState = {
      previousContext: serverSession.sequenceState,
      path: nextPath,
      operationType: 'interact',
      isComplete: true,
      autoContinue: true,
      sequenceItem: serverSession.sequenceState.sequenceItem,
      bag: serverSession.sequenceState.bag,
    };
    return serverSession;
  },
};
