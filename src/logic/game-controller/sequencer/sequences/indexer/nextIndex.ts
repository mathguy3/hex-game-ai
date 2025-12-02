import { ServerSession } from '../../../../../server/games/gameManager';
import { getProcedure } from '../../../../if/if-engine-3/getProcedure';
import { sEval } from '../../utils/sEval';
import { nextSequenceOperation } from './nextSequenceOperation';

export const nextIndex = (serverSession: ServerSession, sequenceState: ServerSession['sequenceState']) => {
  serverSession.sequenceState = sequenceState;
  const groupItem = sequenceState.previousContext.next.sequenceItem;
  let grouping = groupItem.actions ?? groupItem.phases ?? groupItem.turns;
  if (!grouping) {
    if (groupItem.defined) {
      console.log('nextIndex defined', groupItem.defined);
      const definedGroupItem = sEval(groupItem.defined, serverSession);
      grouping = definedGroupItem
        ? definedGroupItem.actions ?? definedGroupItem.phases ?? definedGroupItem.turns
        : undefined;
      console.log('nextIndex grouping', grouping);
    }
    if (!grouping) {
      sequenceState.isComplete = true;
      return sequenceState;
    }
  }
  //console.log('nextIndex', sequenceState, grouping.length);
  const nextIndex = sequenceState.localBag.index + 1;
  if (nextIndex >= grouping.length) {
    sequenceState.isComplete = true;
    return sequenceState;
  }
  const nextItem = getProcedure(grouping[nextIndex], sequenceState.references);
  const nextOperation = nextSequenceOperation(nextItem);
  sequenceState.next = {
    operationType: nextOperation,
    sequenceItem: nextItem[nextOperation],
  };
  sequenceState.localBag = { ...sequenceState.localBag, index: nextIndex };
  return sequenceState;
};
