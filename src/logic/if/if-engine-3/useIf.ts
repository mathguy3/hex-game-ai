import { useMemo } from 'react';
import { doEval } from './doEval';
import { doIf } from './doIf';
import { doSet } from './doSet';
import { useUIPlayer } from '../../game-controller/context/UIPlayerProvider';
import { GameSession } from '../../../server/games/gameManager';

export const useIf = (gameSession: GameSession) => {
  const uiPlayer = useUIPlayer();
  const gameState = gameSession.gameState;
  return useMemo(() => {
    console.log('useIf', gameSession);
    const context = {
      functions: gameSession.gameDefinition.definitions.functions,
      references: gameSession.gameDefinition.definitions.references,
      model: {
        context: gameState,
      },
    };
    return {
      doIf: (ifItem: any, referenceValues?: any) => doIf({ ...context, ifItem, referenceValues }),
      doEval: (ifItem: any, referenceValues?: any) => doEval({ ...context, ifItem, referenceValues }),
      doSet: (ifItem: any, referenceValues?: any) => doSet({ ...context, ifItem, referenceValues }),
    };
  }, [gameState, uiPlayer]);
};
