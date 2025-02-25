import { doIf } from '../../../if/if-engine-3/doIf';
import { getProcedure } from '../../../if/if-engine-3/getProcedure';
import { distance } from './generators/distance';
import { range } from './generators/range';
import { adjacent } from './generators/adjacent';

const handlers = {
  distance,
  range,
  adjacent,
};

export const queryData = (model: any, procedures: any, query: any) => {
  const { context } = model;
  const { from, filter } = query;

  console.log('queryData', model, procedures, query);
  let items = [];
  for (const item of from) {
    if (typeof item === 'string') {
      items = items.concat(Object.values(context.data[item]));
    } else {
      if (typeof item !== 'object') {
        console.log('invalid query', item, query);
        throw new Error('Invalid query');
      }
      const queryType = Object.keys(item)[0];
      const handler = handlers[queryType];
      if (!handler) {
        throw new Error(`Invalid query type: ${queryType}`);
      }
      items = items.concat(Object.values(handler(model, item[queryType])));
    }
  }

  if (filter) {
    for (const filterItem of filter) {
      const queryType = Object.keys(filterItem)[0];
      const handler = handlers[queryType];
      if (!handler) {
        const ifItem = getProcedure(filterItem, procedures);
        console.log('filter pre', model, ifItem, items);
        items = items.filter((item) =>
          doIf({
            ifItem,
            model: { ...model, space: item },
            procedures,
          })
        );
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
