import { getNextOperation } from './getNextOperation';
import { getProcedure } from './getProcedure';
import { Context } from './operations/types';
import { runIf } from './runIf';
import { ContextProps } from './types';

export const doIf = (context: ContextProps) => {
  const { ifItem, model, procedures } = context;
  const runContext: Context = {
    ifItem: getProcedure(ifItem, procedures),
    type: 'if',
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
