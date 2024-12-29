import { SequencerContext } from '../../if/if-engine-3/operations/types';
import { addPath } from '../../if/if-engine-3/utils/addPath';

export const selectNextStep = (context: SequencerContext) => {
  const nextOperation = context.sequenceItem.actions[0].type;
  const nextPath = addPath(context.path, context.nextOperation);
  const updatedContext = {
    ...context,
    path: nextPath,
    sequenceIndex: 0,
    isComplete: false,
    nextOperation,
  };
  return {
    ...updatedContext,
    bag: {
      ...context.bag,
      activeContexts: {
        ...context.bag.activeContexts,
        [nextPath]: updatedContext,
      },
    },
  };
};
