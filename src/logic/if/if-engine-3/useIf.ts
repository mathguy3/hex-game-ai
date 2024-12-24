import { useMemo } from 'react';
import { doEval } from './doEval';
import { doIf } from './doIf';
import { doSet } from './doSet';

export const useIf = (context: any) => {
  return useMemo(
    () => ({
      doIf: (ifItem: any) => doIf({ ifItem, model: { context } }),
      doEval: (ifItem: any) => doEval({ ifItem, model: { context } }),
      doSet: (ifItem: any) => doSet({ ifItem, model: { context } }),
    }),
    [context]
  );
};
