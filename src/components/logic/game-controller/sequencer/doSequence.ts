import { ActionState } from '../../../../types/game';
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
);

export const doSequence = (actionState: ActionState, request: ActionRequest) => {
  // We don't move to the next step if we are interacting
  const { nextStep, nextAction } = moveToNextStep(actionState);

  const handlerType: keyof typeof handlers = when([
    ['interact', request.type === 'interact'],
    ['action', isAction(nextAction)],
    ['options', isOptions(nextAction)],
    ['sequence'] // fallback case
  ]);
  console.log('nextStep', nextStep, handlerType);

  // Need to make sure subject and target are setup first
  const sequenceHandler = handlers[handlerType];

  actionState = sequenceHandler(actionState, nextStep, nextAction, request);

  return actionState;
};



