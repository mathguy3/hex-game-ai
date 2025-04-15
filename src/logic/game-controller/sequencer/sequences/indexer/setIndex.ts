import { ServerSession } from '../../../../../server/games/gameManager';
import { getProcedure } from '../../../../if/if-engine-3/getProcedure';

export const setIndex = (sequenceState: ServerSession['sequenceState'], groupItemOverride?: any) => {
  const groupItem = groupItemOverride ?? sequenceState.previousContext.next.sequenceItem;
  const initialIndex = 0;
  const grouping = groupItem.actions ?? groupItem.phases ?? groupItem.turns;
  if (!grouping) {
    return sequenceState;
  }
  const initialItem = getProcedure(grouping[initialIndex], sequenceState.references);
  //console.log('initialItem', grouping[initialIndex], procedures);
  const initialOperation = Object.keys(initialItem)[0];
  sequenceState.next = {
    sequenceItem: initialItem[initialOperation],
    operationType: initialOperation,
  };
  sequenceState.localBag = { ...sequenceState.localBag, index: 0 };
  return sequenceState;
};
