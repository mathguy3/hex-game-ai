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
    do {
        if (currentContext.isComplete) {
            const endOperation = operationsObject[currentContext.operationType];
            currentContext = endOperation.endOp ? endOperation.endOp(currentContext) : currentContext;
            console.log("---operation ended", currentContext.path)
            currentContext = { ...currentContext.previousContext, bag: currentContext.bag };

            if (iteration > 0 && currentContext.operationType == 'start') {
                console.log(currentContext.bag)
                break;
            } else {
                continue;
            }
        }

        const { operationType } = getNextOperation(currentContext);
        const operation = operationsObject[operationType];
        currentContext = operation.startOp(currentContext);

        iteration++;
    } while (currentContext);

    return finalResult;
};
