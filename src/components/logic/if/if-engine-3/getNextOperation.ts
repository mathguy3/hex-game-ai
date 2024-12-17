import * as operations from './operations';
import { Context } from './operations/types';

const operationsArray = Object.entries(operations).map(([key, value]) => [key, new Set(value.requiredFields)] as const);

export const getNextOperation = (context: Context) => {
    const fields = Object.keys(context.ifItem);
    const operationType =
        operationsArray.find((operation) => fields.some(field => operation[1].has(field)))[0] ?? 'field';
    return { operationType };
};
