import { ServerSession } from '../../../../server/games/gameManager';
import { ActionRequest } from '../doSequence';

export const option = {
  startOp: (serverSession: ServerSession, request: ActionRequest) => {
    const nextPath = serverSession.sequenceState.path + '.option';
    serverSession.gameSession.gameState.activeStep = nextPath;

    serverSession.sequenceState = {
      previousContext: serverSession.sequenceState,
      path: nextPath,
      operationType: 'option',
      nextOperation: 'interact',
      isComplete: false,
      sequenceItem: serverSession.sequenceState.sequenceItem,
      bag: serverSession.sequenceState.bag,
    };

    console.log('option', serverSession.sequenceState.sequenceItem);

    serverSession.gameSession.localControl = {
      activeOptions: serverSession.sequenceState.sequenceItem.options,
    };

    // activate options

    /*for (const option of serverSession.sequenceState.sequenceItem.options) {
      const optionType = Object.keys(option)[0];
      const optionValue = option[optionType];
      const optionHandler = optionHandlers[optionType];
      if (!optionHandler) {
        throw new Error(`No handler found for option type: ${optionType}`);
      }

      serverSession = optionHandler.activate(serverSession, optionValue);
    }*/

    return serverSession;
  },
  continueOp: (serverSession: ServerSession, request: ActionRequest) => {
    console.log('continueOp option', serverSession.sequenceState.path);
    serverSession.sequenceState.isComplete = true;
    return serverSession;
  },
};
