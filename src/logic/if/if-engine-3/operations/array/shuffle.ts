import { evalIfField } from '../../utils/evalIfField';
import { validateFields } from '../../utils/validateFields';
import { Context } from '../types';

export const shuffle = {
  requiredFields: ['shuffle'],
  alternateFields: [],
  optionalFields: [],
  startOp: (context: Context) => {
    validateFields(context, shuffle);
    return {
      ...evalIfField(context, 'shuffle'),
      type: 'eval',
    };
  },
  revisitOp: (context: Context) => {
    const copy = [...context.modelItem];

    if (context.previousContext.type == 'set') {
      context.bag.result = shuffleArray(context.modelItem);
      if (context.bag.result.every((item, index) => item === copy[index])) {
        context.bag.result = shuffleArray(context.modelItem);
      }

      return { ...context, isComplete: true };
    } else {
      context.bag.result = shuffleArray(context.modelItem);
      if (context.bag.result.every((item, index) => item === copy[index])) {
        context.bag.result = shuffleArray(context.modelItem);
      }
      return { ...context, isComplete: true };
    }
  },
};

const shuffleArray = (array: any[]) => {
  return array.toSorted(() => Math.random() - 0.5);
};
