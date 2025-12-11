import { ServerSession2 } from '../doSequence2';

export function completeOperation(serverSession: ServerSession2): ServerSession2 {
  return {
    ...serverSession,
    sequenceState: {
      ...serverSession.sequenceState,
      next: { isComplete: true },
    },
  };
}
