import { Coordinates } from '../../types';
import { getS } from '../coordinates/getS';

export const isNeighbor = (coordA: Coordinates, coordB: Coordinates) => {
  const qD = coordA.q - coordB.q;
  const rD = coordA.r - coordB.r;
  const sD = getS(coordA) - getS(coordB);
  return !(qD > 1 || rD > 1 || sD > 1);
};
