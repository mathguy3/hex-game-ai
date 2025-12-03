import { ServerSession } from '../../../server/games/gameManager';
import { ActionRequest } from '../sequencer/doSequence';
import { isPlayerTurn } from '../../util/isPlayerTurn';
import * as sequences from './sequences/index';
import * as sequenceOperations from '../sequencer/sequences';

export type SequenceResult = {
  game: ServerSession;
  next: unknown;
};

const testGame: any = {
  sequenceState: {
    currentOp: 'start',
    currentSequence: {
      round: {
        turn: {
          action: {},
        },
      },
    },
    next: null,
  },
};

export function doSequence2(game: ServerSession, request: ActionRequest): SequenceResult {
  // 1. Verify - check that the playerId is on their turn, etc.
  const verificationResult = verify(game, request);
  if (!verificationResult.valid) {
    return {
      game,
      next: {},
    };
  }

  // 2. Load - prepare and load any necessary data for the operation
  const loadResult = load(game, request);

  // 3. Act - do the actual operation
  const actResult = act(loadResult.game, request, loadResult);

  // 4. Setup - setup the next session object for the result based on the output of Act
  const setupResult = setup(actResult);

  return {
    game: setupResult.game,
    next: setupResult.next,
  };
}

function verify(game: ServerSession, request: ActionRequest): { valid: boolean } {
  // Check that playerId is on their turn (except for 'continue' requests)
  if (request.type !== 'continue' && !isPlayerTurn(game.gameSession.gameState, request)) {
    return { valid: false };
  }

  // Check that only 'start' type is allowed when next operation is 'start'
  const nextOperation = game.sequenceState.next?.operationType;
  if (nextOperation === 'start' && request.type !== 'start') {
    return { valid: false };
  }

  return { valid: true };
}

function load(game: ServerSession, request: ActionRequest): { game: ServerSession; [key: string]: unknown } {
  // TODO: Load and prepare any necessary data for the operation
  return { game };
}

function act(
  game: ServerSession,
  request: ActionRequest,
  loadResult: { game: ServerSession; [key: string]: unknown }
): { game: ServerSession; next: unknown } {
  // TODO: Execute the actual operation
  const handler = sequences[loadResult.currentOp as keyof typeof sequences];
  if (!handler || !handler.start) {
    throw new Error(`No handler found for operation: ${loadResult.currentOp}`);
  }
  return handler.start(game, request);
}

function findPrimaryKey(currentSequence: unknown): string | undefined {
  if (!currentSequence || typeof currentSequence !== 'object') {
    return undefined;
  }

  const sequenceKeys = Object.keys(sequenceOperations);
  return sequenceKeys.find((key) => key in currentSequence);
}

function setup(actResult: { game: ServerSession; next: unknown }): { game: ServerSession; next: unknown } {
  const { game, next } = actResult;

  if (next === null) {
    const { currentSequence } = game.sequenceState;
    const foundKey = findPrimaryKey(currentSequence);

    if (foundKey) {
      const updatedGame = {
        ...game,
        sequenceState: {
          ...game.sequenceState,
          currentOp: foundKey,
          currentSequence: currentSequence[foundKey],
        },
      };

      return { game: updatedGame, next: null };
    }

    return { game, next: null };
  }

  return { game, next };
}
