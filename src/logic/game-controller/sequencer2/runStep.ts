import { ActionState } from '../../../types/game';
import { SequencerContext } from '../../if/if-engine-3/operations/types';
import { popUp } from '../../if/if-engine-3/utils/pop-up';
import * as operations from './operations';

export const runStep = (actionState: ActionState) => {
  const context = actionState.sequenceState;
  const nextStep = context.nextOperation;
  const activeSteps = context.bag.activeContexts;

  console.log('starting', context.path, nextStep ? '-> ' + nextStep : '<--');

  if (nextStep) {
    const operation = operations[nextStep];
    const newContext = operation.start(actionState);
    return { ...actionState, sequenceState: newContext };
  } else {
    if (!activeSteps[context.path]) {
      if (context.path != '') {
        throw new Error('Breaking on non-start path');
      }
      // we are at the end of the sequence
      return actionState;
    }
    const operation = operations[context.operationType];
    const newContext = operation.revisit(actionState);
    if (newContext.isComplete) {
      delete activeSteps[context.path];
      const newContext = popUp(context);
      activeSteps[newContext.path] = true;
      return { ...actionState, sequenceState: newContext };
    }
    activeSteps[newContext.path] = true;
    return { ...actionState, sequenceState: newContext };
  }
};
