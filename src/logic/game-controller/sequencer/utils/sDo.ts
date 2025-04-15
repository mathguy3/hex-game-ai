import { ServerSession } from '../../../../server/games/gameManager';
import { doOp } from '../../../if/if-engine-3/doOp';

export const sDo = (ifItem: any, serverSession: ServerSession, type: 'if' | 'eval' | 'set') => {
  return doOp(
    {
      ifItem,
      model: {
        context: serverSession.gameSession.gameState.data,
        activeId: serverSession.gameSession.gameState.activeId,
        hasStarted: serverSession.gameSession.gameState.hasStarted,
      },
      references: {
        ...serverSession.gameSession.gameDefinition.definitions.references,
        ...serverSession.sequenceState.references,
      },
      referenceValues: {
        ...serverSession.sequenceState.bag.references,
      },
      functions: {
        ...serverSession.gameSession.gameDefinition.definitions.functions,
        ...serverSession.sequenceState.functions,
      },
    },
    type
  );
};
