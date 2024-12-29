import { ActionState } from '../../../types/game';
import { SequencerContext } from '../../if/if-engine-3/operations/types';
import { popUp } from '../../if/if-engine-3/utils/pop-up';
import * as operations from './operations';

export const runStep = (
  actionState: ActionState,
  context: SequencerContext,
  activeSteps: Record<string, SequencerContext>
) => {
  const nextStep = context.nextOperation;

  if (nextStep) {
    const operation = operations[nextStep];
    const newContext = operation.start(context, actionState);
    activeSteps[newContext.path] = newContext;
    return { context: newContext, actionState, activeSteps };
  } else {
    if (!activeSteps[context.path]) {
      if (context.path != '') {
        throw new Error('Breaking on non-start path');
      }
      // we are at the end of the sequence
      return { context, actionState, activeSteps };
    }
    const operation = operations[context.operationType];
    const newContext = operation.revisit(context, actionState);
    if (newContext.isComplete) {
      delete activeSteps[context.path];
      const newContext = popUp(context);
      activeSteps[newContext.path] = newContext;
      return { context: newContext, actionState, activeSteps };
    }
    activeSteps[newContext.path] = newContext;
    return { context: newContext, actionState, activeSteps };
  }
};
