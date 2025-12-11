import { isPlayerTurn } from '../../util/isPlayerTurn';
import { cons, ServerSession2 } from './doSequence2';
import { ActionRequest } from '../sequencer/doSequence';

export function verify(game: ServerSession2, request: ActionRequest): { valid: boolean } {
  // Check that playerId is on their turn (except for 'continue' requests)
  if (request.type !== 'continue' && !isPlayerTurn(game.gameSession.gameState, request)) {
    cons.log('verify not your turn', request.type, game.gameSession.gameState.activeId, request.playerId);
    return { valid: false };
  }

  // Check that only 'start' type is allowed when next operation is 'start'
  const { currentOp } = game.sequenceState;
  if ((currentOp === 'start' && request.type !== 'start') || (currentOp !== 'start' && request.type === 'start')) {
    cons.log('verify not allowed', currentOp, request.type);
    return { valid: false };
  }

  return { valid: true };
}
