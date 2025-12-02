import { ServerSession } from '../../../../../server/games/gameManager';
import { getProcedure } from '../../../../if/if-engine-3/getProcedure';
import { ActionRequest } from '../../doSequence';
import { sIf } from '../../utils/sIf';
import { sSet } from '../../utils/sSet';
import { actionHandlers } from '.';
import { nextSequenceOperation } from '../indexer/nextSequenceOperation';

export const action = {
  startOp: (serverSession: ServerSession, request: ActionRequest) => {
    const isSingleAction = !('actions' in serverSession.sequenceState.next.sequenceItem);
    const actions = isSingleAction
      ? [serverSession.sequenceState.next.sequenceItem]
      : serverSession.sequenceState.next.sequenceItem.actions;
    const ifItem = isSingleAction ? null : serverSession.sequenceState.next.sequenceItem.if;
    const ifResult = ifItem ? sIf(ifItem, serverSession) : true;
    if (ifItem != undefined) {
      console.log('ifResult', serverSession.sequenceState.path, ifResult);
    }
    if (!ifResult) {
      serverSession.sequenceState.isComplete = true;
      return serverSession;
    }
    //console.log('data', serverSession.gameSession.gameState.data);
    let hasTransitions = false;
    let shouldTransition = true;
    for (const action of actions) {
      const proceduredAction = getProcedure(action, serverSession.gameSession.gameDefinition.definitions.references);
      //console.log('action', serverSession.sequenceState.bag, action);

      // Check if there's a specific handler for this action type
      const actionKey = nextSequenceOperation(proceduredAction);
      if (actionHandlers[actionKey]) {
        serverSession = actionHandlers[actionKey].resolve(serverSession, proceduredAction[actionKey]);
        hasTransitions = true;
      } else {
        shouldTransition = false;
        // Fall back to default doSet behavior
        if (serverSession.sequenceState.references) {
          console.log('Taking action with this reference', serverSession.sequenceState.references);
        }
        //console.log('test result1', serverSession.gameSession.gameState.data.player1.modifiers);
        const setResult = sSet(proceduredAction, serverSession);
        //console.log('setResult', setResult);
        serverSession.gameSession.gameState.data = setResult as any;
        //console.log('test result2', serverSession.gameSession.gameState.data.player1.modifiers);
      }
    }
    //console.log('dataq', serverSession.gameSession.gameState.data);

    serverSession.gameSession.gameState.activeStep = serverSession.sequenceState.path + '.action';

    serverSession.sequenceState = {
      previousContext: serverSession.sequenceState,
      path: serverSession.sequenceState.path + '.action',
      operationType: 'action',
      isComplete: false,
      autoContinue: true,
      delayedContinue: hasTransitions && shouldTransition,
      //next: serverSession.sequenceState.next,
      bag: serverSession.sequenceState.bag,
    };
    return serverSession;
  },
  continueOp: (serverSession: ServerSession, request: ActionRequest) => {
    serverSession.sequenceState.isComplete = true;
    serverSession.sequenceState.delayedContinue = false;
    return serverSession;
  },
};
