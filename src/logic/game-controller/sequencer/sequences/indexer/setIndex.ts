export const setIndex = (sequenceState: any, groupItemOverride?: any) => {
  const groupItem = groupItemOverride ?? sequenceState.previousContext.nextSequenceItem;
  const initialIndex = 0;
  const grouping = groupItem.actions ?? groupItem.phases ?? groupItem.turns;
  if (!grouping) {
    return sequenceState;
  }
  const initialItem = grouping[initialIndex];
  const initialOperation = Object.keys(initialItem)[0];
  sequenceState.nextSequenceItem = initialItem[initialOperation];
  sequenceState.nextOperation = initialOperation;
  sequenceState.localBag = { ...sequenceState.localBag, index: 0 };
  return sequenceState;
};
