import { getNextOperation } from "./getNextOperation";
import * as operations from './operations';
import { Context } from "./operations/types";

export const doIf = (context: Context) => {
    const { operationType } = getNextOperation(context);
    const operation = operations[operationType];
    const result = operation.op(context);

    return result;
}