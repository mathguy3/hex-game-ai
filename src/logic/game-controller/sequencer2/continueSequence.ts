import { SequencerContext } from '../../if/if-engine-3/operations/types';
import { addPath } from '../../if/if-engine-3/utils/addPath';

export const continueSequence = (context: SequencerContext) => {
  const areMoreActions = context.sequenceItem.actions.length > context.sequenceIndex + 1;
  let newContext = context;
  if (areMoreActions) {
    const nextIndex = context.sequenceIndex + 1;
    const nextOperation = context.sequenceItem.actions[nextIndex].type;
    newContext = {
      ...context,
      sequenceIndex: nextIndex,
      nextOperation,
    };
  }
  return { areMoreActions, context: newContext };
};
