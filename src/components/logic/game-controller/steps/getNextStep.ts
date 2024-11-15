import { Interaction } from '../../../../types/actions/interactions';
import { ActionState, Sequence } from '../../../../types/game';

export const getNextStep = (actionState: ActionState, sequenceMap: Record<string, Sequence | Interaction>) => {
  const { activeStep: path, lastStep } = actionState.gameState;
  const sequence = sequenceMap[path];

  const pathUp = path.slice(0, path.lastIndexOf('.'));
  const justPoppedUp = lastStep.includes(path);

  let nextPath = path;
  if (Array.isArray(sequence)) {
    const lastI = Number(path.slice(-1));
    const nextIndex = lastI + 1;
    const possibleNextPath = path.substring(0, -1) + nextIndex;
    if (sequenceMap[possibleNextPath]) {
      nextPath = possibleNextPath;
    } else {
      nextPath = pathUp;
    }
  } else if ('actions' in sequence) {
    if (justPoppedUp) {
      // TODO: Depending on the type, this may need to wait or pop up
      nextPath = pathUp;
    } else {
      nextPath = path + '.actions';
    }
  }
  return nextPath;
};
