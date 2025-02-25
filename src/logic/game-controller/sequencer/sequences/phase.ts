import { ServerSession } from '../../../../server/games/gameManager';
import { ActionRequest } from '../doSequence';

export const phase = {
  startOp: (serverSession: ServerSession, request: ActionRequest) => {
    // There might be a phases, or a turn, or.. another round?
    const roundItem = serverSession.sequenceState.sequenceItem;
    const nextOperation = roundItem.rounds ? 'round' : roundItem.turns ? 'turn' : 'action';
    if (!nextOperation) {
      throw new Error('No next operation found');
    }

    serverSession.sequenceState = {
      path: serverSession.sequenceState.path + '.phase',
      operationType: 'phase',
      nextOperation,
      isComplete: false,
      sequenceItem: roundItem.phases ?? roundItem.turns,
      bag: serverSession.sequenceState.bag,
    };

    return serverSession;
  },
  continueOp: (serverSession: ServerSession, request: ActionRequest) => {
    // There might be a phases, or a turn, or.. another round?
    return serverSession;
  },
};
