import { ServerSession } from '../../../../server/games/gameManager';
import { doSet } from '../../../if/if-engine-3/doSet';
import { ActionRequest } from '../doSequence';

export const action = {
  startOp: (serverSession: ServerSession, request: ActionRequest) => {
    const actions = serverSession.sequenceState.sequenceItem.actions;
    //console.log('data', serverSession.gameSession.gameState.data);
    for (const action of actions) {
      ///console.log('action', action);
      console.log('action', serverSession.gameSession.gameState, serverSession.sequenceState.bag);
      if (serverSession.sequenceState.bag.reference) {
        console.log('Taking action with this reference', serverSession.sequenceState.bag.reference);
      }
      serverSession.gameSession.gameState = doSet({
        ifItem: action,
        model: {
          context: serverSession.gameSession.gameState as any,
          ...(serverSession.sequenceState.bag.reference || {}),
        },
        procedures: serverSession.gameSession.gameDefinition.definitions.procedures,
      })?.context as any;
    }
    console.log('dataq', serverSession.gameSession.gameState.data);

    serverSession.gameSession.gameState.activeStep = serverSession.sequenceState.path + '.action';

    serverSession.sequenceState = {
      previousContext: serverSession.sequenceState,
      path: serverSession.sequenceState.path + '.action',
      operationType: 'action',
      isComplete: false,
      autoContinue: true,
      sequenceItem: serverSession.sequenceState.sequenceItem,
      bag: serverSession.sequenceState.bag,
    };
    return serverSession;
  },
  continueOp: (serverSession: ServerSession, request: ActionRequest) => {
    serverSession.sequenceState.isComplete = true;
    return serverSession;
  },
};
