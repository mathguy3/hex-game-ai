import { evalArrayField, revisitArrayField } from '../../utils/evalArrayField';
import { validateFields } from '../../utils/validateFields';
import { Context } from '../types';

export const max = {
  requiredFields: ['max'],
  alternateFields: [],
  optionalFields: [],
  startOp: (context: Context) => {
    validateFields(context, max);
    return { ...evalArrayField(context, 'max'), type: 'eval' };
  },
  revisitOp: (context: Context) => {
    context.localBag.itemResults = [...(context.localBag.itemResults ?? []), context.bag.result];

    return revisitArrayField(context, 'max', (context) => {
      context.bag.result = Math.max(...context.localBag.itemResults);
      return context;
    });
  },
};
