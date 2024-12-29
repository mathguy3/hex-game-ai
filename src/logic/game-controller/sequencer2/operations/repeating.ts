import { ActionState } from '../../../../types/game';
import { SequencerContext } from '../../../if/if-engine-3/operations/types';
import { addPath } from '../../../if/if-engine-3/utils/addPath';
import { selectNextStep } from '../selectNextStep';

export const repeating = {
  start: (context: SequencerContext, actionState: ActionState) => {
    if (context.nextOperation != 'repeating') {
      throw new Error('Next operation is not repeating');
    }
    return selectNextStep(context);
  },
  revisit: (context: SequencerContext, actionState: ActionState) => {
    const areMoreActions = context.sequenceItem.actions.length > context.sequenceIndex + 1;
    if (areMoreActions) {
      const nextIndex = context.sequenceIndex + 1;
      const nextOperation = context.sequenceItem.actions[nextIndex].type;
      return {
        ...context,
        sequenceIndex: nextIndex,
        nextOperation,
      };
    }
    return {
      ...context,
      isComplete: true,
      nextOperation: null,
    };
  },
};
