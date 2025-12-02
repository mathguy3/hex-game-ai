import { useMemo } from 'react';
import { doEval } from './doEval';
import { doIf } from './doIf';
import { doSet } from './doSet';
import { useUIPlayer } from '../../game-controller/context/UIPlayerProvider';
import { GameSession } from '../../../server/games/gameManager';

export const useIf = (gameSession: GameSession, shouldDebug?: boolean) => {
  const uiPlayer = useUIPlayer();
  const gameState = gameSession.gameState;
  return useMemo(() => {
    console.log('useIf', gameSession);
    const context = {
      functions: gameSession.gameDefinition.definitions.functions,
      references: gameSession.gameDefinition.definitions.references,
      model: {
        context: gameState.data,
        activeId: gameState.activeId,
        hasStarted: gameState.hasStarted,
      },
      shouldDebug,
    };
    return {
      doIf: (ifItem: any, referenceValues?: any, shouldDebug?: boolean) =>
        doIf({ ...context, ifItem, referenceValues, shouldDebug }),
      doEval: (ifItem: any, referenceValues?: any, shouldDebug?: boolean) =>
        doEval({ ...context, ifItem, referenceValues, shouldDebug }),
      doSet: (ifItem: any, referenceValues?: any, shouldDebug?: boolean) =>
        doSet({ ...context, ifItem, referenceValues, shouldDebug }),
    };
  }, [gameState, uiPlayer]);
};
