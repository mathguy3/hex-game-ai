import { ActionRequest } from '../../sequencer/doSequence';
import { sDo2 } from '../../sequencer/utils/sDo2';
import { cons, ServerSession2 } from '../doSequence2';
import { completeOperation } from '../utils/completeOperation';
import { getGroupArray } from '../utils/getGroupArray';

export const actionGroup = {
  start: (serverSession: ServerSession2, request: ActionRequest): ServerSession2 => {
    const { sequenceState } = serverSession;
    const { currentSequence } = sequenceState;
    cons.log('actionGroup start', currentSequence);
    if (!Array.isArray(currentSequence)) {
      throw new Error('currentSequence is not an array');
    }
    let updatedSession = serverSession;
    for (const action of currentSequence) {
      const updatedGameData = sDo2(action, updatedSession, 'set').modelItem.context;
      updatedSession = {
        ...updatedSession,
        gameSession: {
          ...updatedSession.gameSession,
          gameState: { ...updatedSession.gameSession.gameState, data: updatedGameData },
        },
      };
      cons.log('actionGroup updatedGameData', updatedGameData);
    }

    return {
      ...updatedSession,
      sequenceState: {
        ...updatedSession.sequenceState,
        next: { isComplete: true },
      },
    };
  },
  continue: (serverSession: ServerSession2, request: ActionRequest): ServerSession2 => {
    const { index } = serverSession.sequenceState.next;
    if (index == null || index >= getGroupArray(serverSession.sequenceState.currentSequence)?.length) {
      cons.log('actionGroup complete', index, getGroupArray(serverSession.sequenceState.currentSequence)?.length);
      return completeOperation(serverSession);
    }

    return {
      ...serverSession,
      sequenceState: {
        ...serverSession.sequenceState,
        next: { index: index + 1 },
      },
    };
  },
};
