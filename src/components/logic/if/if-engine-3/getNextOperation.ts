import * as operations from './operations';
import { Context } from './operations/types';

const operationsArray: [string, Set<string>][] = Object.entries(operations).map(([key, value]) => [key, new Set(value.requiredFields)] as const);

export const getNextOperation = (context: Context) => {
    return getOperation(context.ifItem);
};

export const getOperation = (ifItem: Context['ifItem']) => {
    const fields = Object.keys(ifItem);
    const simpleType = isSimpleType(ifItem);
    const operationType =
        simpleType ? 'simple' : operationsArray.find((operation) => fields.some(field => operation[1].has(field)))?.[0] ?? 'field';
    return { operationType, fields };
}

const isSimpleType = (type: Context['ifItem']) => {
    return ['string', 'number', 'boolean'].includes(typeof type);
}