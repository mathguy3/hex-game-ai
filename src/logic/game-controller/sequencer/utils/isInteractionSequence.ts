import { Interaction } from '../../../../types/actions/interactions';
import { Sequence } from '../../../../types/game';

export const isInteractionSequence = (action: Sequence | Interaction) => {
  // if the type is hex card or ui
  return action.type === 'hex' || action.type === 'card' || action.type === 'ui';
};
