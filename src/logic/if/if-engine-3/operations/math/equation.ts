import { evalIfArrayField, revisitIfArrayField } from '../../utils/evalIfArrayField';
import { validateFields } from '../../utils/validateFields';
import { Context } from '../types';

export const equation = {
  requiredFields: ['equation'],
  alternateFields: [],
  optionalFields: [],
  startOp: (context: Context) => {
    validateFields(context, equation);
    return { ...evalIfArrayField(context), type: 'eval' };
  },
  revisitOp: ({ previousContext, ...context }: Context) => {
    const result = revisitIfArrayField({ ...context, previousContext });
    return { ...result, next: { ...result.next, modelItem: context.bag.result } };
  },
};
