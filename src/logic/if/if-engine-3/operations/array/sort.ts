import { validateFields } from '../../utils/validateFields';
import { evalArrayField, revisitArrayField } from '../../utils/evalArrayField';
import { Context } from '../types';

export const sort = {
  requiredFields: ['sort'],
  alternateFields: [],
  optionalFields: [],
  startOp: (context: Context) => {
    validateFields(context, sort);
    return { ...evalArrayField(context, 'sort'), type: 'eval' };
  },
  revisitOp: (context: Context) => {
    const arrayContext = context.previousContext;
    context.localBag.mappedResults.push([context.localBag.index, context.bag.result]);

    return revisitArrayField(context, 'sort', (context) => {
      context.bag.result = context.localBag.mappedResults
        .toSorted((a, b) => compareForSort(a[1], b[1]))
        .map((index) => arrayContext.modelItem[index[0]]);

      return context;
    });
  },
};

function compareForSort(a: any, b: any): number {
  // Handle null/undefined - push to end
  if (a == null) return b == null ? 0 : 1;
  if (b == null) return -1;

  // If types are different, sort by type name
  if (typeof a !== typeof b) {
    return typeof a < typeof b ? -1 : 1;
  }

  // Handle numbers
  if (typeof a === 'number') {
    return a - b;
  }

  // Handle strings
  if (typeof a === 'string') {
    return a.localeCompare(b);
  }

  // Handle booleans
  if (typeof a === 'boolean') {
    return a === b ? 0 : a ? 1 : -1;
  }

  // Handle dates
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime();
  }

  // For objects/arrays, stringify (could be customized based on needs)
  return JSON.stringify(a).localeCompare(JSON.stringify(b));
}
