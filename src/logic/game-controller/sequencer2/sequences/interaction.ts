import { ServerSession2 } from '../doSequence2';
import { ActionRequest } from '../../sequencer/doSequence';

export const interaction = {
  start: (serverSession: ServerSession2, request: ActionRequest): ServerSession2 => {
    return {
      ...serverSession,
      sequenceState: {
        ...serverSession.sequenceState,
        next: { isComplete: false },
      },
    };
  },
  continue: (serverSession: ServerSession2, request: ActionRequest): ServerSession2 => {
    if (request.type == 'continue') {
      return serverSession;
    }
    if (request.type !== 'interact') {
      throw new Error('wrong request type, should be interact');
    }
    const interactionKind = Object.keys(serverSession.sequenceState.currentSequence)[0];
    if (request.kind !== interactionKind) {
      throw new Error('wrong kind, should be ' + interactionKind);
    }
    return serverSession;
  },
};
