import { getNextOperation } from './getNextOperation';
import { getProcedure } from './getProcedure';
import { Context } from './operations/types';
import { runIf } from './runIf';
import { ContextProps } from './types';

export const doSet = (context: ContextProps) => {
  const { ifItem, model, procedures } = context;
  const runContext: Context = {
    ifItem: getProcedure(ifItem, procedures),
    type: 'set',
    path: '',
    bag: { history: [], model },
    isComplete: false,
    operationType: '',
    procedures,
  };

  const { operationType } = getNextOperation(runContext);
  runContext.nextOperation = operationType;
  const updatedContext = runIf(runContext);
  // This will need to change somehow but I'm not sure yet
  return updatedContext.bag.model;
};
