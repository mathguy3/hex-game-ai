import { getProcedure } from '../../../../if/if-engine-3/getProcedure';

export const setIndex = (sequenceState: any, procedures: any, groupItemOverride?: any) => {
  const groupItem = groupItemOverride ?? sequenceState.previousContext.nextSequenceItem;
  const initialIndex = 0;
  const grouping = groupItem.actions ?? groupItem.phases ?? groupItem.turns;
  if (!grouping) {
    return sequenceState;
  }
  const initialItem = getProcedure(grouping[initialIndex], procedures);
  console.log('initialItem', grouping[initialIndex], procedures);
  const initialOperation = Object.keys(initialItem)[0];
  sequenceState.nextSequenceItem = initialItem[initialOperation];
  sequenceState.nextOperation = initialOperation;
  sequenceState.localBag = { ...sequenceState.localBag, index: 0 };
  return sequenceState;
};
