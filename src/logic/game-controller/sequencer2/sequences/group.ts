import { ActionRequest } from '../../sequencer/doSequence';
import { cons, NextContext, ServerSession2 } from '../doSequence2';

const group = {
  start: (serverSession: ServerSession2, request: ActionRequest): ServerSession2 => {
    // By default, we will select the next operation automatically
    return serverSession;
  },
  continue: (serverSession: ServerSession2, request: ActionRequest): ServerSession2 => {
    cons.log('group continue', serverSession.sequenceState.currentOp, request);
    return serverSession;
  },
};

export const round = group;
export const turn = group;
export const phase = group;
