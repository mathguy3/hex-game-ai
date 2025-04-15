import { ServerSession } from '../../../../server/games/gameManager';
import { sDo } from './sDo';

export const sIf = (ifItem: any, serverSession: ServerSession) => {
  return sDo(ifItem, serverSession, 'if');
};
