import { selectNext } from '../../utils/select-next';
import { Context } from '../types';

export const field = {
  requiredFields: [],
  optionalFields: [],
  alternateFields: [],
  startOp: (context: Context) => {
    const keys = Object.keys(context.ifItem);
    if (keys.length !== 1) {
      //console.log('field', context, keys);
      throw new Error('Field operation requires exactly one field');
    }
    const updatedContext = selectNext(context);
    //console.log('field', context.path, updatedContext.path);
    //console.log('field', context.modelItem, updatedContext.modelItem);
    return {
      ...updatedContext,
      operationType: 'field',
      field: keys[0],
    };
  },
  revisitOp: (context: Context) => {
    return { ...context, isComplete: true };
  },
};
