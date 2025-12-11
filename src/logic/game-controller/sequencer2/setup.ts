import { cons, ServerSession2 } from './doSequence2';
import { pop } from './utils/pop';
import { sIf } from '../sequencer/utils/sIf';
import { ServerSession } from '../../../server/games/gameManager';
import { findPrimaryKey } from './utils/findPrimaryKey';
import * as sequences from './sequences/index';
import { getGroupArray } from './utils/getGroupArray';
import { findGroupKey } from './utils/findGroupKey';

export const setup = (game: ServerSession2): ServerSession2 => {
  const { sequenceState } = game;
  const { currentSequence, next } = sequenceState;

  // If the current operation is complete, return to the parent state
  if (next?.isComplete) {
    cons.log('setup isComplete', next);
    return pop(game);
  }

  // If the current operation has an if condition, check if it is true
  if (currentSequence && 'if' in currentSequence) {
    if (!sIf(currentSequence.if, game as unknown as ServerSession)) {
      cons.log('setup if is false', currentSequence.if);
      return pop(game);
    }
  }

  const groupArray = getGroupArray(currentSequence);
  cons.log('setup groupArray', groupArray);
  if (groupArray) {
    cons.log('setup groupArray next', sequenceState.next);
    const currentIndex = sequenceState.next?.index;
    const nextIndex = currentIndex === undefined ? 0 : currentIndex + 1;
    // When we get to it, repeating the group will happen here
    if (nextIndex >= groupArray.length) {
      cons.log('setup group complete', nextIndex, groupArray.length);
      return pop(game);
    }
    const nextSequenceObject = groupArray[nextIndex];
    const nextSequenceKey = findPrimaryKey(nextSequenceObject) as keyof typeof sequences;
    const nextSequence = nextSequenceObject[nextSequenceKey];
    const groupKey = findGroupKey(currentSequence);

    return {
      ...game,
      sequenceState: {
        parentState: { ...sequenceState, next: { index: nextIndex } },
        currentOp: nextSequenceKey,
        currentSequence: nextSequence,
        path: sequenceState.path + '.' + groupKey + '.' + nextIndex + '.' + nextSequenceKey,
      },
    };
  }

  //console.log('next', next);
  // Default check for the next operation
  if (!next) {
    //console.log('no next', sequenceState.currentOp, currentSequence);
    const foundKey = findPrimaryKey(currentSequence) as keyof typeof sequences;
    cons.log('setup foundKey', sequenceState.currentOp, foundKey);
    if (foundKey) {
      return {
        ...game,
        sequenceState: {
          parentState: sequenceState,
          currentOp: foundKey,
          currentSequence: currentSequence[foundKey],
          path: sequenceState.path + '.' + foundKey,
        },
      };
    } else {
      cons.log('setup no foundKey', sequenceState.currentOp, currentSequence);
      throw new Error('No primary key found for default setup');
    }
  }

  return game;
};
