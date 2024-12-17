import { getNextOperation } from "./getNextOperation";
import * as operations from './operations';
import { Context } from "./operations/types";

export const doIf = (context: Context) => {
    let currentContext = context;
    let finalValue = null;
    let iteration = 0;
    do {
        const { operationType } = getNextOperation(currentContext);
        const operation = operations[operationType];
        currentContext = operation.op(currentContext);
        iteration++;
    } while (iteration < 2);
    console.log(currentContext.path);

    return currentContext;
}