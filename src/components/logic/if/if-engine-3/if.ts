import { getNextOperation } from './getNextOperation';
import * as operations from './operations';
import { Context, Operation } from './operations/types';

const operationsObject: Record<string, Operation> = operations;

export const doIf = (context: { ifItem: any; contextModel: any }) => {
    let currentContext: Context = {
        ifItem: context.ifItem,
        type: 'if',
        path: 'start',
        bag: { history: ['start'], contextModel: context.contextModel },
        isComplete: false,
        operationType: 'start',
    };
    let iteration = 0;
    let finalResult = undefined;
    const activeOperations = {}
    const { operationType } = getNextOperation(currentContext);
    let nextOperation = operationType;
    do {
        /*if (currentContext.isComplete) {
            const { endOp } = operationsObject[currentContext.operationType];
            currentContext = endOp ? endOp(currentContext) : currentContext;
            console.log("---operation ended", currentContext.path)
            currentContext = { ...currentContext.previousContext, bag: currentContext.bag };

            if (iteration > 0 && currentContext.operationType == 'start') {
                console.log(currentContext.bag)
                break;
            } else {
                continue;
            }
        }*/


        if (nextOperation) {
            const operation = operationsObject[nextOperation];
            currentContext = operation.startOp(currentContext);
            activeOperations[currentContext.path] = currentContext;

            console.log("---starting operation", nextOperation, currentContext.path)

            if (operation.isLeaf) {
                console.log("---operation ended", currentContext.path)
                currentContext = { ...currentContext.previousContext, bag: currentContext.bag };
                nextOperation = undefined;
            } else {
                const { operationType } = getNextOperation(currentContext);
                nextOperation = operationType;
                console.log("---next operation", nextOperation)
            }
        } else {
            // At some point this may 'continue' the operation instead of just ending
            const activeOperation = activeOperations[currentContext.path];
            if (!activeOperation) {
                break;
            }
            console.log(currentContext.path)
            console.log("---ending operation", activeOperation.path)
            if (activeOperation.endOp) {
                currentContext = activeOperation.endOp(currentContext);
            }
            currentContext = { ...currentContext.previousContext, bag: currentContext.bag };
            nextOperation = undefined;
            delete activeOperations[currentContext.path];
            continue;
        }

        currentContext.bag.history.push(currentContext.path);

        iteration++;
    } while (currentContext);

    console.log(currentContext.bag.history)
    return currentContext.bag.result;
};
