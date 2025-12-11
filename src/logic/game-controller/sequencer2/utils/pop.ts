import { ServerSession2 } from '../doSequence2';

export const pop = (serverSession: ServerSession2): ServerSession2 => {
  return {
    ...serverSession,
    sequenceState: serverSession.sequenceState.parentState,
  };
};
