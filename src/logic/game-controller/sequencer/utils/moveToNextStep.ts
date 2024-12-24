import { ActionState } from '../../../../types/game';
import { isAction } from './isAction';
import { isOptions } from './isOptions';
import { resolveAction } from './resolveAction';

export const moveToNextStep = (actionState: ActionState, readOnly?: boolean) => {
  const { activeStep, activeAction, activeActions, actionContext, hasStarted } = actionState.gameState;

  const noChange = {
    nextStep: activeStep,
    nextAction: activeAction,
  };

  function popContext() {
    const parentStep = actionContext.previousContext.id;
    const parentAction = actionContext.previousContext.action;
    if (!readOnly) {
      actionState.gameState.actionContext = actionContext.previousContext;
      actionState.gameState.actionHistory.push({
        id: parentStep,
        action: parentAction,
      });
      actionState.gameState.activeStep = parentStep;
      actionState.gameState.activeAction = parentAction;
      delete activeActions[activeStep];
    }
    return {
      nextStep: parentStep,
      nextAction: parentAction, // This will already be resolved
    };
  }

  if (activeStep == 'setup' && !hasStarted) {
    return noChange;
  }

  // Handle options completion
  if (isOptions(activeAction)) {
    if (actionContext.isComplete) {
      return popContext();
    } else {
      return noChange;
    }
  }

  // Handle sequence progression
  if ('actions' in activeAction) {
    const nextIndex = actionContext.currentIndex == null ? 0 : actionContext.currentIndex + 1;

    if (actionContext.isComplete) {
      return popContext();
    } else if (nextIndex < activeAction.actions.length) {
      actionContext.currentIndex = nextIndex;
      const nextStep = `${activeStep}.${nextIndex}`;
      const nextAction = resolveAction(actionState, activeAction.actions[nextIndex]);
      const nextContextBase = {
        id: nextStep,
        action: nextAction,
      };
      if (!readOnly) {
        actionState.gameState.actionContext = {
          ...nextContextBase,
          subjects: actionContext.subjects,
          previousContext: actionContext,
        };
        actionState.gameState.actionHistory.push(nextContextBase);
        actionState.gameState.activeStep = nextStep;
        actionState.gameState.activeAction = nextAction;
      }
      return {
        nextStep,
        nextAction,
      };
    } else {
      return noChange;
    }
  }

  if (isAction(activeAction)) {
    return popContext();
  }

  console.error('Unknown action type', activeAction);

  // Default case - stay on current action
  return noChange;
};
