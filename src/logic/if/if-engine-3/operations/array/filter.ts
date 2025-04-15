import { Context } from '../types';
import { evalArrayField, revisitArrayField } from '../../utils/evalArrayField';
import { validateFields } from '../../utils/validateFields';

export const filter = {
  requiredFields: ['filter'],
  alternateFields: [],
  optionalFields: [],
  startOp: (context: Context) => {
    validateFields(context, filter);
    return { ...evalArrayField(context, 'filter'), type: 'if' };
  },
  revisitOp: (context: Context) => {
    const arrayContext = context.previousContext;
    if (context.bag.result) {
      context.localBag.filteredResults = [
        ...(context.localBag.filteredResults ?? []),
        arrayContext.next.modelItem[context.localBag.index],
      ];
    }
    return revisitArrayField(context, 'filter', (context) => {
      context.bag.result = context.localBag.filteredResults;
      return context;
    });
  },
};
