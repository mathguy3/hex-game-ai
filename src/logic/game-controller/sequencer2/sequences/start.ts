import { ServerSession } from '../../../../server/games/gameManager';
import { ActionRequest } from '../../sequencer/doSequence';

export const start = {
  start: (serverSession: ServerSession, request: ActionRequest): { game: ServerSession; next: unknown } => {
    // TODO: Implement start logic
    return { game: serverSession, next: null };
  },
  continue: (serverSession: ServerSession, request: ActionRequest): ServerSession => {
    // TODO: Implement continue logic
    // If we get here, we end the game
    return serverSession;
  },
};
