import { getNextOperation } from './getNextOperation';
import * as operations from './operations';
import { Context, Operation } from './operations/types';

const operationsObject: Record<string, Operation> = operations;

export const doIf = (context: { ifItem: any; contextModel: any }) => {
    let currentContext: Context = {
        ifItem: context.ifItem,
        type: 'if',
        path: '',
        bag: { history: [], contextModel: context.contextModel },
        isComplete: false,
        operationType: '',
    };
    const activeContexts = {}
    const { operationType } = getNextOperation(currentContext);
    let nextOperation = operationType;
    do {

        // Going down the tree
        if (nextOperation) {
            const operation = operationsObject[nextOperation];
            currentContext = operation.startOp(currentContext);
            activeContexts[currentContext.path] = currentContext;

            // operation needs to be updated based on what currentContext is now
            if (operation.isLeaf) {
                // start going up the tree
                currentContext = { ...currentContext.previousContext, bag: currentContext.bag };
                nextOperation = undefined;
            } else {
                // continue going down the tree
                const { operationType } = getNextOperation(currentContext);
                nextOperation = operationType;
            }
        } else {
            // Going up the tree

            // At some point this may 'continue' the operation instead of just ending
            const activeContext = activeContexts[currentContext.path];
            if (!activeContext) {
                if (currentContext.path != '') {
                    throw new Error("Breaking on non-start path")
                }
                break;
            }
            const operation = operationsObject[activeContext.operationType];
            if (operation.endOp) {
                currentContext = operation.endOp(currentContext);
            }
            delete activeContexts[currentContext.path];
            currentContext = { ...currentContext.previousContext, bag: currentContext.bag };
            nextOperation = undefined;
        }

        currentContext.bag.history.push(currentContext.path);
    } while (currentContext);

    console.log(currentContext.bag.history)
    return currentContext.bag.result;
};
