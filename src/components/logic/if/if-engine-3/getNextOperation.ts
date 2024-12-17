import * as operations from './operations';
import { Context } from './operations/types';

const operationsArray: [string, Set<string>][] = Object.entries(operations).map(([key, value]) => [key, new Set(value.requiredFields)] as const);


export const getNextOperation = (context: Context) => {
    const fields = Object.keys(context.ifItem);
    const simpleType = isSimpleType(context.modelItem);
    const operationType =
        simpleType ? 'simple' : operationsArray.find((operation) => fields.some(field => operation[1].has(field)))?.[0] ?? 'field';
    return { operationType };
};


const isSimpleType = (type: Context['modelItem']) => {
    return ['string', 'number', 'boolean'].includes(typeof type);
}