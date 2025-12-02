import { ServerSession } from '../../../../../server/games/gameManager';
import { getProcedure } from '../../../../if/if-engine-3/getProcedure';
import { sEval } from '../../utils/sEval';
import { nextSequenceOperation } from './nextSequenceOperation';

export const setIndex = (
  serverSession: ServerSession,
  sequenceState: ServerSession['sequenceState'],
  groupItemOverride?: any
) => {
  serverSession.sequenceState = sequenceState;
  const groupItem = groupItemOverride ?? sequenceState.previousContext.next.sequenceItem;
  const initialIndex = 0;
  const singleTurn = groupItem.turn;
  let grouping = groupItem.actions ?? groupItem.phases ?? (singleTurn ? [singleTurn] : groupItem.turns);
  if (!grouping) {
    if (groupItem.defined) {
      console.log('defined', groupItem.defined);
      const definedGroupItem = sEval(groupItem.defined, serverSession);
      grouping = definedGroupItem
        ? definedGroupItem.actions ?? definedGroupItem.phases ?? definedGroupItem.turns
        : undefined;
      console.log('grouping', grouping);
    }
    if (!grouping) {
      console.log('grouping FAILLED', grouping);
      return sequenceState;
    }
  }
  const initialItem = getProcedure(grouping[initialIndex], sequenceState.references);
  //console.log('initialItem', grouping[initialIndex], procedures);
  const initialOperation = nextSequenceOperation(initialItem);
  sequenceState.next = {
    sequenceItem: initialItem[initialOperation],
    operationType: initialOperation,
  };
  sequenceState.localBag = { ...sequenceState.localBag, index: 0 };
  return sequenceState;
};
