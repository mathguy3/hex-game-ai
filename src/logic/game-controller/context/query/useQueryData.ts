import { getProcedure } from '../../../if/if-engine-3/getProcedure';
import { distance } from './generators/distance';
import { range } from './generators/range';
import { adjacent } from './generators/adjacent';
import { direction } from './generators/direction';
import { offset } from './generators/offset';
import { useIf } from '../../../if/if-engine-3/useIf';
import { useGameSession } from '../GameSessionProvider';

const handlers = {
  distance,
  range,
  adjacent,
  direction,
  offset,
};

export const useQueryData = () => {
  const { gameSession } = useGameSession();
  const { doIf } = useIf(gameSession);
  return (model: any, procedures: any, query: any) => {
    const { context, subjectSpace } = model;
    const sourceData = gameSession.gameState.data[subjectSpace.source];
    const { from, filter } = query;

    let items = [];
    for (const queryItem of from) {
      if (typeof queryItem === 'string') {
        items = items.concat(Object.values(context.data[queryItem]));
      } else {
        if (typeof queryItem !== 'object') {
          console.log('invalid query', queryItem, query);
          throw new Error('Invalid query');
        }
        const queryType = Object.keys(queryItem)[0];
        const handler = handlers[queryType];
        if (!handler) {
          throw new Error(`Invalid query type: ${queryType}`);
        }
        items = items.concat(
          Object.values(handler(model, queryItem[queryType], doIf)).map((item: any) => ({
            ...item,
            ...sourceData[item.id],
          }))
        );
      }
    }

    if (filter) {
      for (const filterItem of filter) {
        const queryType = Object.keys(filterItem)[0];
        const handler = handlers[queryType];
        if (!handler) {
          const ifItem = getProcedure(filterItem, procedures);
          console.log('filter pre', model, ifItem, items);
          items = items.filter((item) => doIf(ifItem, { space: item }));
          console.log('filter post', model, ifItem, items);
        } else {
          const filterResult = handler(model, filterItem[queryType]);
          // includes probably needs to be a deep comparison
          items = items.filter((item) => filterResult[item.id]);
        }
      }
    }

    if (query.type === 'token') {
      console.log('token', items);
      return items.map((item) => item.slot);
    }
    console.log('queryData post', items);
    return items;
  };
};
