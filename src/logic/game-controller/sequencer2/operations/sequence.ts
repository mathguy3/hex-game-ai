import { ActionState } from '../../../../types/game';
import { SequencerContext } from '../../../if/if-engine-3/operations/types';
import { continueSequence } from '../continueSequence';

export const sequence = {
  start: (actionState: ActionState) => {
    const context = actionState.sequenceState;
    return {
      ...context,
      isComplete: true,
    };
  },
  revisit: (actionState: ActionState) => {
    const context = actionState.sequenceState;
    const { areMoreActions, context: newContext } = continueSequence(context);
    if (areMoreActions) {
      return newContext;
    }
    return {
      ...context,
      isComplete: true,
    };
  },
};
