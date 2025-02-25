import { getNextOperation } from './getNextOperation';
import { Context } from './operations/types';
import { runIf } from './runIf';
import { ContextProps } from './types';
import { getProcedure } from './getProcedure';
export const doEval = (context: ContextProps) => {
  const { ifItem, model, procedures } = context;
  const runContext: Context = {
    ifItem: getProcedure(ifItem, procedures),
    type: 'eval',
    path: '',
    bag: { history: [], model },
    isComplete: false,
    operationType: '',
    procedures,
  };
  const { operationType } = getNextOperation(runContext);
  runContext.nextOperation = operationType;
  const updatedContext = runIf(runContext);
  return updatedContext.bag.result;
};
