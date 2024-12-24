import { selectNext } from '../../utils/select-next';
import { Context } from '../types';

export const context = {
  requiredFields: ['context'],
  startOp: (context: Context) => {
    if (!('context' in context.ifItem)) {
      throw new Error('Wrong value type for context operation');
    }
    const updatedContext = selectNext(context);
    return {
      ...updatedContext,
      modelItem: context.bag.model.context,
      operationType: 'context',
    };
  },
  revisitOp: (context: Context) => {
    return { ...context, isComplete: true };
  },
};
