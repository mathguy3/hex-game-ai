import { validateFields } from '../../utils/validateFields';
import { evalArrayField, revisitArrayField } from '../../utils/evalArrayField';
import { Context } from '../types';

export const min = {
  requiredFields: ['min'],
  alternateFields: [],
  optionalFields: [],
  startOp: (context: Context) => {
    validateFields(context, min);
    return { ...evalArrayField(context, 'min'), type: 'eval' };
  },
  revisitOp: (context: Context) => {
    context.localBag.itemResults = [...(context.localBag.itemResults ?? []), context.bag.result];

    return revisitArrayField(context, 'min', (context) => {
      context.bag.result = Math.min(...context.localBag.itemResults);
      return context;
    });
  },
};
