import { ServerSession2 } from '../../sequencer2/doSequence2';
import { doOp } from '../../../if/if-engine-3/doOp';

export const sDo2 = (ifItem: any, serverSession: ServerSession2, type: 'if' | 'eval' | 'set', references?: any) => {
  return doOp(
    {
      ifItem,
      model: {
        context: { ...serverSession.gameSession.gameState.data, ...(references ?? {}) },
        activeId: serverSession.gameSession.gameState.activeId,
        hasStarted: serverSession.gameSession.gameState.hasStarted,
      },
    },
    type
  );
};
