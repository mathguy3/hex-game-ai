import * as sequences from '../sequences';

export function findPrimaryKey(currentSequence: Record<string, any>): string | undefined {
  if (!currentSequence || typeof currentSequence !== 'object') {
    return undefined;
  }
  const sequenceKeys = Object.keys(sequences);
  return sequenceKeys.find((key) => key in currentSequence);
}
