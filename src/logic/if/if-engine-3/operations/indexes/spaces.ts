import { selectNext } from '../../utils/select-next';
import { Context } from '../types';

export const spaces = {
  requiredFields: ['spaces'],
  alternateFields: [],
  optionalFields: [],
  startOp: (context: Context) => {
    const board = context.bag.model.context?.data?.board;
    if (!board) {
      throw new Error('Board not found');
    }
    const spaces = Object.values(board);
    if (!spaces) {
      throw new Error('Spaces not found');
    }
    if (!('spaces' in context.ifItem)) {
      throw new Error('Wrong value type for spaces operation');
    }
    const updatedContext = selectNext(context);

    return {
      ...updatedContext,
      modelItem: spaces,
      operationType: 'spaces',
    };
  },
  revisitOp: (context: Context) => {
    return { ...context, isComplete: true };
  },
};
