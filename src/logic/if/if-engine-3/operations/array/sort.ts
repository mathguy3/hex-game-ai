import { getOperation } from '../../getNextOperation';
import { addPath } from '../../utils/addPath';
import { Context } from '../types';
import { getProcedure } from '../../getProcedure';

export const sort = {
  requiredFields: ['sort', 'then'],
  alternateFields: [],
  optionalFields: [],
  startOp: (context: Context) => {
    const ifNext = context.ifItem.sort;
    const operationType = getOperation(ifNext).operationType;
    const initialIndex = 0;

    return {
      previousContext: context,
      type: context.type,
      path: addPath(context.path, 'sort'),
      modelItem: context.modelItem[initialIndex],
      operationType: 'sort',
      nextOperation: operationType,
      ifItem: getProcedure(ifNext, context.procedures),
      localBag: { mappedResults: [], index: initialIndex, isSorted: false },
      bag: context.bag,
    };
  },
  revisitOp: (context: Context) => {
    const sortContext = context.previousContext;
    //console.log('sort revisit', context.localBag.index, context.modelItem, context.bag.result);
    if (context.localBag.isSorted) {
      return {
        ...context,
        isComplete: true,
      };
    }

    const arrayContext = context.previousContext;
    if (typeof arrayContext.modelItem !== 'object' || !Array.isArray(arrayContext.modelItem)) {
      throw new Error('Sort operation can only be used on arrays');
    }

    context.localBag.mappedResults.push([context.localBag.index, context.bag.result]);

    context.localBag.index++;
    context.modelItem = arrayContext.modelItem[context.localBag.index];
    //console.log('ifNext', context);
    const operationType = getOperation(context.ifItem).operationType;
    //console.log('next operation', operationType);
    context.nextOperation = operationType;

    if (context.localBag.index >= arrayContext.modelItem.length) {
      const sortedIndexes = context.localBag.mappedResults.sort((a, b) => compareForSort(a[1], b[1]));
      context.bag.result = sortedIndexes.map((index) => arrayContext.modelItem[index[0]]);
      //console.log('sort complete', sortedIndexes, context.bag.result);
      const thenItem = sortContext.ifItem.then;
      const thenOperation = getOperation(thenItem).operationType;

      return {
        ...context,
        modelItem: context.bag.result,
        ifItem: thenItem,
        nextOperation: thenOperation,
        localBag: {
          ...context.localBag,
          isSorted: true,
        },
      };
    }

    return { ...context };
  },
};

function compareForSort(a: any, b: any): number {
  // Handle null/undefined - push to end
  if (a == null) return b == null ? 0 : 1;
  if (b == null) return -1;

  // If types are different, sort by type name
  if (typeof a !== typeof b) {
    return typeof a < typeof b ? -1 : 1;
  }

  // Handle numbers
  if (typeof a === 'number') {
    return a - b;
  }

  // Handle strings
  if (typeof a === 'string') {
    return a.localeCompare(b);
  }

  // Handle booleans
  if (typeof a === 'boolean') {
    return a === b ? 0 : a ? 1 : -1;
  }

  // Handle dates
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime();
  }

  // For objects/arrays, stringify (could be customized based on needs)
  return JSON.stringify(a).localeCompare(JSON.stringify(b));
}
