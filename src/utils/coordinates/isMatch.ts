import { Coordinates } from '../../types';
import { getS } from './getS';

export const isMatch = (coordA: Coordinates, coordB: Coordinates) => {
  return (
    coordA.q === coordB.q &&
    coordA.r === coordB.r &&
    getS(coordA) === getS(coordB)
  );
};
