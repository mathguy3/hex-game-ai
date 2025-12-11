import { cons, ServerSession2 } from './doSequence2';
import { ActionRequest } from '../sequencer/doSequence';
import * as sequences from './sequences/index';

export function act(game: ServerSession2, request: ActionRequest): ServerSession2 {
  const { currentOp } = game.sequenceState;
  const handler = sequences[currentOp as keyof typeof sequences];
  //console.log('handler', handler, currentOp);
  if (!handler) {
    throw new Error(`No handler found for operation: ${currentOp}`);
  }

  if (game.sequenceState.hasStarted) {
    cons.log('-continue', game.sequenceState.hasStarted);
    return handler.continue(game, request);
  }

  cons.log('-start', game.sequenceState.hasStarted);
  const result = handler.start(game, request);
  return {
    ...result,
    sequenceState: {
      ...result.sequenceState,
      hasStarted: true,
    },
  };
}
