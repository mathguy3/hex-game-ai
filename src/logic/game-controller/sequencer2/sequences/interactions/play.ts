import { ServerSession2 } from '../../doSequence2';
import { InteractActionRequest } from '../../../sequencer/doSequence';
import { useQueryData } from '../../../context/query/useQueryData';
import { query } from '../../utils/query';

export const play = {
  setup: (serverSession: ServerSession2, continueRequest: InteractActionRequest) => {
    return serverSession;
  },
  interact: (serverSession: ServerSession2, request: InteractActionRequest) => {
    const { currentSequence } = serverSession.sequenceState;
    if (Array.isArray(currentSequence)) {
      throw new Error('nah');
    }
    const { play } = currentSequence;
    const { card } = play;
    const queryResults = query(card, serverSession, request);

    return serverSession;
  },
};
