import { ServerSession } from '../../../../server/games/gameManager';
import { sDo } from './sDo';

export const sSet = (ifItem: any, serverSession: ServerSession) => {
  return sDo(ifItem, serverSession, 'set').modelItem.context;
};
