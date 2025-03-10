import { getProcedure } from '../../../../if/if-engine-3/getProcedure';

export const nextIndex = (sequenceState: any, procedures: any) => {
  const groupItem = sequenceState.previousContext.nextSequenceItem;
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
  const nextItem = getProcedure(grouping[nextIndex], procedures);
  const nextOperation = Object.keys(nextItem)[0];
  sequenceState.nextOperation = nextOperation;
  sequenceState.nextSequenceItem = nextItem[nextOperation];
  sequenceState.localBag = { ...sequenceState.localBag, index: nextIndex };
  return sequenceState;
};
