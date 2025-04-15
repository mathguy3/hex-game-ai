import { evalIfArrayField } from '../../utils/evalIfArrayField';
import { validateFields } from '../../utils/validateFields';
import { Context } from '../types';

export const or = {
  requiredFields: ['or'],
  alternateFields: ['||'],
  optionalFields: [],
  startOp: (context: Context) => {
    validateFields(context, or);
    return { ...evalIfArrayField(context), type: 'if' };
  },
  revisitOp: (context: Context) => {
    if (context.previousContext.type == 'set') {
      throw new Error('Or operation cannot be used for a set operation');
    }
    const nextResult = context.bag.result || context.localBag.result;
    return {
      ...context,
      bag: { ...context.bag, result: nextResult },
      localBag: { ...context.localBag, result: nextResult },
    };
  },
};
