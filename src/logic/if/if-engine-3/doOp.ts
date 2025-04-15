import { getNextOperation } from './getNextOperation';
import { getProcedure } from './getProcedure';
import { Context } from './operations/types';
import { runIf } from './runIf';
import { ContextProps } from './types';

export const doOp = (context: ContextProps, type: 'if' | 'set' | 'eval') => {
  const { ifItem, model, references, functions } = context;
  const runContext: Context = {
    next: { ifItem: getProcedure(ifItem, references), modelItem: model },
    type,
    path: '',
    bag: { history: [], model, references: context.referenceValues ?? {} },
    isComplete: false,
    operationType: '',
    references: references ?? {},
    functions: functions ?? {},
    modelItem: model,
  };
  const { operationType } = getNextOperation(runContext);
  runContext.next.operationType = operationType;
  const updatedContext = runIf(runContext);
  return updatedContext;
};
