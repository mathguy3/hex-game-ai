import { ActionState } from '../../../../types/game';
import { SequencerContext } from '../../../if/if-engine-3/operations/types';

export const sequence = {
  start: (context: SequencerContext, actionState: ActionState) => {
    return {
      ...context,
      isComplete: true,
    };
  },
  revisit: (context: SequencerContext, actionState: ActionState) => {
    return {
      ...context,
      isComplete: true,
    };
  },
};
