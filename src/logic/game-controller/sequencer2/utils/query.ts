import { InteractActionRequest } from '../../sequencer/doSequence';
import { sDo2 } from '../../sequencer/utils/sDo2';
import { ServerSession2 } from '../doSequence2';

export const query = (q: any, serverSession: ServerSession2, request: InteractActionRequest) => {
  const { from, filter } = q;
  let items = [];

  for (const queryItem of from) {
    const fromItems = sDo2(queryItem, serverSession, 'eval');
    items = items.concat(fromItems);
  }

  for (const filterItem of filter) {
    items = items.filter((item) => sDo2(filterItem, serverSession, 'if', { item }));
  }

  return items;
};
