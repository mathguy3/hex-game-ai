import * as operations from './operations';
import { Context, Operation } from './operations/types';
import { addPath } from './utils/addPath';
import { evalIfField, revisitIfField } from './utils/evalIfField';
import { popUp } from './utils/pop-up';

const operationsObject: Record<string, Operation> = operations;

const logRun = true;
const flaggedLog = (shouldDebug: boolean, ...args: any[]) => {
  if (logRun && shouldDebug) {
    console.log(...args);
  }
};

export const runIf = (context: Context) => {
  let currentContext: Context = context;
  const activeContexts = {};
  try {
    do {
      const nextOperation = currentContext.next?.operationType;
      const operationName = nextOperation
        ? nextOperation === 'field' && Object.keys(currentContext.next.ifItem).length === 1
          ? Object.keys(currentContext.next.ifItem)[0]
          : nextOperation
        : '';
      if (operationName) {
        flaggedLog(
          currentContext.shouldDebug,
          'starting',
          currentContext.path,
          (operationName ? '-> ' + operationName : '<--') + (nextOperation === 'field' ? '(field)' : '')
        );
      } else {
        flaggedLog(currentContext.shouldDebug, 'revisiting', currentContext.path, '<--', currentContext.bag.result);
      }

      // Going down the tree
      if (nextOperation) {
        const operation = operationsObject[nextOperation];
        currentContext = operation.startOp(currentContext);
        activeContexts[currentContext.path] = currentContext;
      } else {
        // revisit the operation
        if (!activeContexts[currentContext.path]) {
          if (currentContext.path != '') {
            flaggedLog(currentContext.shouldDebug, 'invalid break', currentContext);
            throw new Error('Breaking on non-start path' + currentContext.bag.history.join(', '));
          }
          break;
        }

        const operation = operationsObject[currentContext.operationType];
        //console.log('revisiting op', currentContext.bag.result);
        if (!operation) {
          flaggedLog(currentContext.shouldDebug, 'operation not found', currentContext);
          throw new Error('Operation not found');
        }
        if (operation.revisitOp) {
          currentContext = operation.revisitOp(currentContext);
          if (currentContext.isArray) {
            currentContext.bag.history.push(addPath(currentContext.path, currentContext.localBag.index));
          }
        }
        //console.log(currentContext.operationType, currentContext.isComplete ? 'is complete' : 'is not complete');
        if (currentContext.isComplete) {
          const shouldDoThen = currentContext.previousContext.next.ifItem?.then && currentContext.isArray;
          delete activeContexts[currentContext.path];
          currentContext = popUp(currentContext);

          if (shouldDoThen) {
            currentContext = {
              ...evalIfField(currentContext, 'then'),
              next: { ...currentContext, modelItem: currentContext.bag.result },
            };
          }
        }
      }

      if (currentContext.path) {
        currentContext.bag.history.push(currentContext.path);
      }
    } while (currentContext);
  } catch (error) {
    flaggedLog(currentContext.shouldDebug, 'error', currentContext);
    /*const { previousContext, bag, ...rest } = currentContext;
    const { previousContext: _, bag: _2, ...rest2 } = previousContext;
    console.error('Error running if', error, rest, rest2);*/
    throw error;
  }

  //console.log('end', currentContext.bag.result);
  return currentContext;
};
