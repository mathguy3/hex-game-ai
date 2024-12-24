import { useMemo } from 'react';
import { doEval } from './doEval';
import { doIf } from './doIf';
import { doSet } from './doSet';

export const useIf = (context: any) => {
  return useMemo(
    () => ({
      doIf: (ifItem: any, extraContext?: any) => doIf({ ifItem, model: { context, ...extraContext } }),
      doEval: (ifItem: any, extraContext?: any) => doEval({ ifItem, model: { context, ...extraContext } }),
      doSet: (ifItem: any, extraContext?: any) => doSet({ ifItem, model: { context, ...extraContext } }),
    }),
    [context]
  );
};
