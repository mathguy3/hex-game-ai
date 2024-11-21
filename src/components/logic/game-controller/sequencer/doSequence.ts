import { ActionState } from '../../../../types/game';
import { isPlayerTurn } from '../../util/isPlayerTurn';
import { when } from '../../util/when';
import * as handlers from './sequences';
import { isAction } from './utils/isAction';
import { isOptions } from './utils/isOptions';
import { moveToNextStep } from './utils/moveToNextStep';

type ActionTarget = { id: string } & (
  | {
    type: 'card';
  }
  | {
    type: 'hex';
    kind?: string;
  }
  | {
    type: 'ui';
  }
);

export type ActionSubject = { id: string; targets?: ActionTarget[] } & (
  | {
    type: 'card';
  }
  | {
    type: 'hex';
  }
  | {
    type: 'ui';
    value?: string;
  }
);

export type ActionRequest = { playerId: string } & (
  | {
    type: 'continue';
  }
  | {
    type: 'interact';
    subjects: ActionSubject[];
  }
  | {
    type: 'start';
  }
);

export const doSequence = (actionState: ActionState, request: ActionRequest) => {
  if (!isPlayerTurn(actionState.gameState, actionState.localState)) {
    return actionState;
  }
  actionState.autoContinue = false;
  // We don't move to the next step if we are interacting
  const { nextStep, nextAction } = moveToNextStep(actionState);

  if (nextStep == 'setup' && request.type !== 'start') {
    return actionState;
  }

  const handlerType: keyof typeof handlers = when([
    ['interact', request.type === 'interact'],
    ['start', request.type === 'start'],
    ['action', isAction(nextAction)],
    ['options', isOptions(nextAction)],
    ['sequence'] // fallback case
  ]);

  console.log("taking step", nextStep, handlerType);

  // Need to make sure subject and target are setup first
  const sequenceHandler = handlers[handlerType];

  actionState = sequenceHandler(actionState, nextStep, nextAction, request);

  if (actionState.autoContinue) {
    return doSequence(actionState, { type: 'continue', playerId: request.playerId });
  } else {
    return actionState;
  }
};



