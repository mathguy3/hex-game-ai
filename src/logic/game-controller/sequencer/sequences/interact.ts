import { ServerSession } from '../../../../server/games/gameManager';
import { ActionRequest, InteractActionRequest } from '../doSequence';
import { selectCards } from './interactions/selectCards';
import { playCard } from './interactions/playCard';
import { space } from './interactions/space';
const interactionHandlers = {
  selectCards,
  playCard,
  space,
};

export const interact = {
  startOp: (serverSession: ServerSession, request: InteractActionRequest) => {
    if (request.type !== 'interact') {
      throw new Error('wrong request type, should be interact');
    }
    const interactionHandler = interactionHandlers[request.kind];

    console.log('interact', serverSession.sequenceState.sequenceItem);

    const option = serverSession.sequenceState.sequenceItem.options.find(
      (x) =>
        Object.keys(x)[0] === (request.kind === 'selectCards' || request.kind === 'playCard' ? 'card' : request.kind)
    );

    if (!interactionHandler) {
      throw new Error(`No handler found for subject type: ${request.kind}`);
    }

    return interactionHandler.resolve(serverSession, option, request);
  },
  continueOp: (serverSession: ServerSession, request: ActionRequest) => {
    serverSession.sequenceState.isComplete = true;
    return serverSession;
  },
};
