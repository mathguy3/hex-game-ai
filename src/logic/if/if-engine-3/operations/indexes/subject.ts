import { selectNext } from '../../utils/select-next';
import { Context } from '../types';

export const subject = {
  requiredFields: ['subject'],
  optionalFields: [],
  alternateFields: [],
  startOp: (context: Context) => {
    if (!('subject' in context.ifItem)) {
      throw new Error('Wrong value type for subject operation');
    }
    const updatedContext = selectNext(context);
    return {
      ...updatedContext,
      modelItem: context.bag.model.subject,
      operationType: 'subject',
    };
  },
  revisitOp: (context: Context) => {
    return { ...context, isComplete: true };
  },
};
