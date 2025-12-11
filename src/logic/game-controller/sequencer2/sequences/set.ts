import { ActionRequest } from '../../sequencer/doSequence';
import { sDo2 } from '../../sequencer/utils/sDo2';
import { cons, ServerSession2 } from '../doSequence2';
import { completeOperation } from '../utils/completeOperation';

export const set = {
  start: (serverSession: ServerSession2, request: ActionRequest): ServerSession2 => {
    const { sequenceState } = serverSession;
    const { currentSequence } = sequenceState;
    cons.log('set start', currentSequence);
    const updatedGameData = sDo2(currentSequence, serverSession, 'set').modelItem.context;
    cons.log('set updatedGameData', updatedGameData);
    return completeOperation({
      ...serverSession,
      gameSession: {
        ...serverSession.gameSession,
        gameState: {
          ...serverSession.gameSession.gameState,
          data: updatedGameData,
        },
      },
    });
  },
  continue: (serverSession: ServerSession2, request: ActionRequest): ServerSession2 => {
    return completeOperation(serverSession);
  },
};
