import { useMemo } from 'react';
import { doEval } from './doEval';
import { doIf } from './doIf';
import { doSet } from './doSet';
import { useUIPlayer } from '../../game-controller/context/UIPlayerProvider';

export const useIf = (context: any) => {
  const uiPlayer = useUIPlayer();
  return useMemo(
    () => ({
      doIf: (ifItem: any, extraContext?: any) =>
        doIf({ ifItem, model: { context, player: uiPlayer?.playerState, ...extraContext } }),
      doEval: (ifItem: any, extraContext?: any) =>
        doEval({ ifItem, model: { context, player: uiPlayer?.playerState, ...extraContext } }),
      doSet: (ifItem: any, extraContext?: any) =>
        doSet({ ifItem, model: { context, player: uiPlayer?.playerState, ...extraContext } }),
    }),
    [context]
  );
};
