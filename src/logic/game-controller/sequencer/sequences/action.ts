import { ServerSession } from '../../../../server/games/gameManager';
import { doIf } from '../../../if/if-engine-3/doIf';
import { doSet } from '../../../if/if-engine-3/doSet';
import { ActionRequest } from '../doSequence';
import { actionHandlers } from './actions';

export const action = {
  startOp: (serverSession: ServerSession, request: ActionRequest) => {
    const actions = serverSession.sequenceState.nextSequenceItem.actions;
    const ifItem = serverSession.sequenceState.nextSequenceItem.if;
    const ifResult = ifItem
      ? doIf({
          ifItem,
          model: {
            context: serverSession.gameSession.gameState,
            ...(serverSession.sequenceState.bag.references || {}),
          },
          procedures: serverSession.gameSession.gameDefinition.definitions.procedures,
        })
      : true;
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
      ///console.log('action', action);
      //console.log('action', serverSession.sequenceState.bag, action);

      // Check if there's a specific handler for this action type
      const actionKey = Object.keys(action)[0];
      if (actionHandlers[actionKey]) {
        serverSession = actionHandlers[actionKey].resolve(serverSession, action[actionKey]);
        hasTransitions = true;
      } else {
        shouldTransition = false;
        // Fall back to default doSet behavior
        if (serverSession.sequenceState.bag.references) {
          console.log('Taking action with this reference', serverSession.sequenceState.bag.references);
        }
        serverSession.gameSession.gameState = doSet({
          ifItem: action,
          model: {
            context: serverSession.gameSession.gameState as any,
            ...(serverSession.sequenceState.bag.references || {}),
          },
          procedures: serverSession.gameSession.gameDefinition.definitions.procedures,
        })?.context as any;
      }
    }
    //console.log('dataq', serverSession.gameSession.gameState.data);

    serverSession.gameSession.gameState.activeStep = serverSession.sequenceState.path + '.action';

    serverSession.sequenceState = {
      previousContext: serverSession.sequenceState,
      path: serverSession.sequenceState.path + '.action',
      operationType: 'action',
      isComplete: false,
      autoContinue: !hasTransitions || !shouldTransition,
      nextSequenceItem: serverSession.sequenceState.nextSequenceItem,
      bag: serverSession.sequenceState.bag,
    };
    return serverSession;
  },
  continueOp: (serverSession: ServerSession, request: ActionRequest) => {
    serverSession.sequenceState.isComplete = true;
    return serverSession;
  },
};
