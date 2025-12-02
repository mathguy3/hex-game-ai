import { Context } from '../types';
import { validateFields } from '../../utils/validateFields';
import { evalIfArrayField, revisitIfArrayField } from '../../utils/evalIfArrayField';

export const and = {
  requiredFields: ['and'],
  alternateFields: ['&&'],
  optionalFields: [],
  startOp: (context: Context) => {
    validateFields(context, and);

    return { ...evalIfArrayField({ ...context, localBag: { result: true } }), type: 'if' };
  },
  revisitOp: (context: Context) => {
    console.log(
      'and revisit',
      context.bag.result,
      context.localBag.result,
      context.bag.result && context.localBag.result
    );
    const nextContext = revisitIfArrayField(context);
    console.log(
      'and revisit2',
      nextContext.bag.result,
      nextContext.localBag.result,
      nextContext.bag.result && nextContext.localBag.result
    );
    const nextResult = nextContext.bag.result && nextContext.localBag.result;
    return {
      ...nextContext,
      localBag: { ...nextContext.localBag, result: nextResult },
      bag: { ...nextContext.bag, result: nextResult },
    };
  },
};
