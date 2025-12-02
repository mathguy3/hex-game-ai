// you know what this does, it generates a 'list' of a single hex that is at a given direction and distance

import { getHexDirection } from '../utils/getHexDirection';
import { getKey } from '../utils/getHexKey';
import { hexVectorAdd } from '../utils/hexVectorAdd';
import { hexVectorScale } from '../utils/hexVectorScale';

export const offset = (model: any, query: any) => {
  const { subjectSpace } = model;
  const { direction, distance } = query;
  const directionVector = getHexDirection(direction);
  const scaledVector = hexVectorScale(directionVector, distance);
  const next = hexVectorAdd(subjectSpace.coordinates, scaledVector);
  const nextKey = getKey(next);
  return { [nextKey]: { id: nextKey, coordinates: next } };
};
