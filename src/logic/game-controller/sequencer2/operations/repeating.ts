import { ActionState } from '../../../../types/game';
import { continueSequence } from '../continueSequence';
import { selectNextStep } from '../selectNextStep';

export const repeating = {
  start: (actionState: ActionState) => {
    const context = actionState.sequenceState;
    console.log(actionState);
    if (context.nextOperation != 'repeating') {
      throw new Error('Next operation is not repeating');
    }
    return selectNextStep(context);
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
      nextOperation: null,
    };
  },
};
