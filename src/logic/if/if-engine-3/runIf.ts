import * as operations from './operations';
import { Context, Operation } from './operations/types';
import { popUp } from './utils/pop-up';

const operationsObject: Record<string, Operation> = operations;

export const runIf = (context: Context) => {
  let currentContext: Context = context;
  const activeContexts = {};
  do {
    const nextOperation = currentContext.nextOperation;
    //console.log('starting', currentContext.path, nextOperation ? '-> ' + nextOperation : '<--');
    //console.log('currentContext', currentContext);
    // Going down the tree
    if (nextOperation) {
      const operation = operationsObject[nextOperation];
      currentContext = operation.startOp(currentContext);
      activeContexts[currentContext.path] = currentContext;
    } else {
      // revisit the operation
      if (!activeContexts[currentContext.path]) {
        if (currentContext.path != '') {
          throw new Error('Breaking on non-start path');
        }
        break;
      }

      const operation = operationsObject[currentContext.operationType];
      //console.log('revisiting run', currentContext.path, currentContext.operationType, operation);
      if (operation.revisitOp) {
        currentContext = operation.revisitOp(currentContext);
      }
      if (currentContext.isComplete) {
        delete activeContexts[currentContext.path];
        currentContext = popUp(currentContext);
      }
    }

    if (currentContext.path) {
      currentContext.bag.history.push(currentContext.path);
    }
  } while (currentContext);

  //console.log('end', currentContext.bag.result);
  return currentContext;
};
