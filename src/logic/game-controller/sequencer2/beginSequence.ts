import { ActionState, Sequence } from '../../../types/game';
import { runStep } from './runStep';

export const beginSequence = (actionState: ActionState, firstSequence: Sequence) => {
  const context = {
    sequenceItem: firstSequence,
    nextOperation: firstSequence.type,
    operationType: '',
    path: '',
    isComplete: false,
    bag: {
      activeContexts: {},
      history: [],
    },
  };
  return runStep({ ...actionState, sequenceState: context });
};
