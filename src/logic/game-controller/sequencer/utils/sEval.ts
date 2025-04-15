import { ServerSession } from '../../../../server/games/gameManager';
import { sDo } from './sDo';

export const sEval = (ifItem: any, serverSession: ServerSession) => {
  return sDo(ifItem, serverSession, 'eval').bag.result;
};
