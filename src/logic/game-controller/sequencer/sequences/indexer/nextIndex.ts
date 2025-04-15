import { ServerSession } from '../../../../../server/games/gameManager';
import { getProcedure } from '../../../../if/if-engine-3/getProcedure';

export const nextIndex = (sequenceState: ServerSession['sequenceState']) => {
  const groupItem = sequenceState.previousContext.next.sequenceItem;
  const grouping = groupItem.actions ?? groupItem.phases ?? groupItem.turns;
  if (!grouping) {
    sequenceState.isComplete = true;
    return sequenceState;
  }
  const nextIndex = sequenceState.localBag.index + 1;
  if (nextIndex >= grouping.length) {
    sequenceState.isComplete = true;
    return sequenceState;
  }
  const nextItem = getProcedure(grouping[nextIndex], sequenceState.references);
  const nextOperation = Object.keys(nextItem)[0];
  sequenceState.next = {
    operationType: nextOperation,
    sequenceItem: nextItem[nextOperation],
  };
  sequenceState.localBag = { ...sequenceState.localBag, index: nextIndex };
  return sequenceState;
};
