import { ServerSession } from '../../../server/games/gameManager';
import { doIf } from '../../if/if-engine-3/doIf';
import { isPlayerTurn } from '../../util/isPlayerTurn';
import * as handlers from './sequences';

type ActionTarget = { id: string } & (
  | {
      type: 'card';
    }
  | {
      type: 'space';
    }
  | {
      type: 'token';
    }
  | {
      type: 'ui';
    }
);

export type ActionSubject = { id: string; from?: string; targets?: ActionSubject[] } & (
  | {
      type: 'space';
    }
  | {
      type: 'token';
    }
  | {
      type: 'card';
      action?: string;
    }
  | {
      type: 'ui';
      value?: string;
    }
);

export type InteractActionRequest = { type: 'interact'; kind: string; playerId: string } & {
  subjects: ActionSubject[];
};

export type ActionRequest = { playerId: string; kind?: string } & (
  | {
      type: 'continue';
    }
  | InteractActionRequest
  | {
      type: 'start';
    }
  | {
      type: 'ackAnnounce';
    }
);

export const doSequence = (game: ServerSession, request: ActionRequest, broadcast: () => void) => {
  if (!isPlayerTurn(game.gameSession.gameState, request)) {
    console.log('not your turn', game.gameSession.gameState.activeId, request.playerId);
    return game;
  }
  const { gameSession, sequenceState } = game;
  const { gameState } = gameSession;
  const nextOperation = sequenceState.nextOperation;
  console.log('starting', sequenceState.path, nextOperation ? '-> ' + nextOperation : '<--');
  if (nextOperation == 'start' && request.type !== 'start') {
    return game;
  }

  if (nextOperation == 'interact' && request.type !== 'interact') {
    return game;
  }

  if (nextOperation == 'ackAnnounce' && request.type !== 'ackAnnounce') {
    return game;
  }

  if (nextOperation) {
    //console.log('nextOperation', nextOperation);
    if (sequenceState.nextSequenceItem.if) {
      const { if: ifCondition } = sequenceState.nextSequenceItem;
      //console.log('if condition', ifCondition, sequenceState.bag.references);
      const result = doIf({
        ifItem: ifCondition,
        model: {
          context: game.gameSession.gameState,
          ...sequenceState.bag.references,
        },
        procedures: game.gameSession.gameDefinition.definitions.procedures,
      });
      //console.log('if result', result);
      if (!result) {
        console.log('skipping', sequenceState.path + '-> ' + nextOperation);
        sequenceState.nextOperation = undefined;
        sequenceState.nextSequenceItem = undefined;
        return doSequence(game, { type: 'continue', playerId: request.playerId }, broadcast);
      }
    }
    // Need to make sure subject and target are setup first
    const optionWithInteract = nextOperation.includes('interact') ? request.type : nextOperation;
    const sequenceHandler = handlers[optionWithInteract];

    if (!sequenceHandler) {
      console.log('No sequence handler found for', nextOperation);
      return game;
    }

    game = sequenceHandler.startOp(game, request);
    game.activeContexts[sequenceState.path] = game.sequenceState;
    gameSession.gameState.activeStep = game.sequenceState.path;
    gameSession.gameState.history.push(game.sequenceState.path);
  } else {
    if (sequenceState.path == 'start') {
      console.log('END OF GAME', sequenceState.isGameOver);
      game.gameSession.gameState.isComplete = true;
      broadcast();
      return game;
    }
    //console.log('no next operation', sequenceState.path);
    const operation = handlers[sequenceState.operationType];
    console.log('revisiting seq', sequenceState.path, sequenceState.operationType, operation);

    if (operation.continueOp) {
      game = operation.continueOp(game, request);
    }

    if (game.sequenceState.isComplete) {
      delete game.activeContexts[sequenceState.path];
      game.sequenceState = {
        ...game.sequenceState.previousContext,
        nextOperation: undefined,
        autoContinue: true,
        bag: game.sequenceState.bag,
      };
    }
    gameSession.gameState.activeStep = game.sequenceState.path;
    gameSession.gameState.history.push(game.sequenceState.path);
  }

  if (nextOperation == 'start') {
    // That means the game is over actually
    console.log('game over');
    return { ...game, gameState: { ...gameState, isComplete: true } };
  }
  if (game.sequenceState.autoContinue) {
    console.log('auto continuing');
    if (game.sequenceState.withBroadcast) {
      broadcast();
    }
    return doSequence(game, { type: 'continue', playerId: request.playerId }, broadcast);
  } else {
    return game;
  }
};
