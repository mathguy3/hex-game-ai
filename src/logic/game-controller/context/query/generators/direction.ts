import { getHexDirection } from '../utils/getHexDirection';
import { hexVectorAdd } from '../utils/hexVectorAdd';
import { hexVectorScale } from '../utils/hexVectorScale';
import { getKey } from '../utils/getHexKey';

type Direction =
  | 'up'
  | 'diagUpRight'
  | 'upRight'
  | 'right'
  | 'downRight'
  | 'diagDownRight'
  | 'down'
  | 'diagDownLeft'
  | 'downLeft'
  | 'left'
  | 'upLeft'
  | 'diagUpLeft';

export const orthogonalDirections: Direction[] = ['up', 'upRight', 'downRight', 'down', 'downLeft', 'upLeft'];
export const diagonalDirections: Direction[] = [
  'diagUpRight',
  'right',
  'diagDownRight',
  'diagDownLeft',
  'left',
  'diagUpLeft',
];

// Should generate a list of hex keys in a direction
export const direction = (model: any, query: any, doIf: any) => {
  const { subjectSpace, context } = model;
  if (!subjectSpace) {
    throw new Error('Subject is required');
  }
  const { direction, distance } = query;

  const finalSet = {};

  // Generate tiles from 1 to distance (matching tile generator logic)
  for (let r = 1; r <= distance; r++) {
    const directionVector = getHexDirection(direction);
    const scaledVector = hexVectorScale(directionVector, r);
    const next = hexVectorAdd(subjectSpace.coordinates, scaledVector);
    const nextKey = getKey(next);

    const blocking = query.blocking
      ? doIf(query.blocking, { space: context.data[subjectSpace.source][nextKey] }, true)
      : false;
    if (blocking) {
      break;
    }
    finalSet[nextKey] = { id: nextKey, coordinates: next };
  }

  return finalSet;
};
