import { cons } from '../doSequence2';

export function findGroupKey(currentSequence: Record<string, any>): string | undefined {
  if (!currentSequence || typeof currentSequence !== 'object') {
    cons.log('findGroupKey currentSequence is not an object', currentSequence);
    return undefined;
  }

  cons.log('findGroupKey currentSequence', currentSequence);
  return ['actions', 'phases', 'turns', 'rounds'].find((key) => key in currentSequence);
}
