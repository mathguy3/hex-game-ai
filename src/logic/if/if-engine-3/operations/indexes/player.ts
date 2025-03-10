import { selectNext } from '../../utils/select-next';
import { Context } from '../types';

export const player = {
  requiredFields: ['player'],
  alternateFields: [],
  optionalFields: [],
  startOp: (context: Context) => {
    const activeId = context.bag.model.context?.activeId;
    const player = context.bag.model.context?.data?.[activeId];
    if (!player) {
      throw new Error('Player not found');
    }
    if (!('player' in context.ifItem)) {
      throw new Error('Wrong value type for player operation');
    }
    const updatedContext = selectNext(context);

    return {
      ...updatedContext,
      modelItem: player,
      operationType: 'player',
    };
  },
  revisitOp: (context: Context) => {
    return { ...context, isComplete: true };
  },
};
