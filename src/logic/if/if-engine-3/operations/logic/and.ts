import { Context } from '../types';
import { validateFields } from '../../utils/validateFields';
import { evalIfArrayField, revisitIfArrayField } from '../../utils/evalIfArrayField';

export const and = {
  requiredFields: ['and'],
  alternateFields: ['&&'],
  optionalFields: [],
  startOp: (context: Context) => {
    validateFields(context, and);

    return { ...evalIfArrayField(context), type: 'if' };
  },
  revisitOp: (context: Context) => {
    const nextContext = revisitIfArrayField(context);
    const nextResult = nextContext.bag.result && nextContext.localBag.result;
    return {
      ...nextContext,
      localBag: { ...nextContext.localBag, result: nextResult },
      bag: { ...nextContext.bag, result: nextResult },
    };
  },
};
