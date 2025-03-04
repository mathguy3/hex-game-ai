import { getOperation } from '../../getNextOperation';
import { addPath } from '../../utils/addPath';
import { Context } from '../types';
import { getProcedure } from '../../getProcedure';

export const filter = {
  requiredFields: ['filter', 'then'],
  alternateFields: [],
  optionalFields: [],
  startOp: (context: Context) => {
    const ifNext = context.ifItem.filter;
    const operationType = getOperation(ifNext).operationType;
    const initialIndex = 0;

    return {
      previousContext: context,
      type: context.type,
      path: addPath(context.path, 'filter'),
      modelItem: context.modelItem[initialIndex],
      operationType: 'filter',
      nextOperation: operationType,
      ifItem: getProcedure(ifNext, context.procedures),
      localBag: { filteredResults: [], index: initialIndex, isFiltered: false },
      bag: context.bag,
    };
  },
  revisitOp: (context: Context) => {
    const filterContext = context.previousContext;
    //console.log('filter revisit', context.localBag.index, context.modelItem);
    if (context.localBag.isFiltered) {
      return {
        ...context,
        isComplete: true,
      };
    }

    const arrayContext = context.previousContext;
    if (typeof arrayContext.modelItem !== 'object' || !Array.isArray(arrayContext.modelItem)) {
      throw new Error('Filter operation can only be used on arrays');
    }

    if (context.bag.result) {
      context.localBag.filteredResults.push(arrayContext.modelItem[context.localBag.index]);
    }

    context.localBag.index++;
    context.modelItem = arrayContext.modelItem[context.localBag.index];
    //console.log('ifNext', context);
    const operationType = getOperation(context.ifItem).operationType;
    //console.log('next operation', operationType);
    context.nextOperation = operationType;

    if (context.localBag.index >= arrayContext.modelItem.length) {
      context.bag.result = context.localBag.filteredResults;
      //console.log('filter complete', context.localBag.filteredResults);
      const thenItem = filterContext.ifItem.then;
      const thenOperation = getOperation(thenItem).operationType;

      return {
        ...context,
        modelItem: context.localBag.filteredResults,
        ifItem: thenItem,
        nextOperation: thenOperation,
        localBag: {
          ...context.localBag,
          isFiltered: true,
        },
      };
    }

    return { ...context };
  },
};
