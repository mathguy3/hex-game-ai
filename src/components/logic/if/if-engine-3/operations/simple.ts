import { Context } from "./types";

// type Map from $String/Object/Array/Number/Boolean to the value
const map = {
    $String: 'string',
    $Object: 'object',
    $Array: 'array',
    $Number: 'number',
    $Boolean: 'boolean',
}

export const simple = {
    requiredFields: [],
    op: (context: Context) => {
        const item = context.ifItem;
        if (typeof item !== 'string' && typeof item !== 'number' && typeof item !== 'boolean') {
            throw new Error("Simple operation requires a simple type");
        }
        if (typeof item === 'number' || typeof item === 'boolean') {
            context.result = item;
            return context;
        }
        if (map[context.modelItem]) {
            context.result = context.modelItem;
            return context;
        }

        context.result = item;
        context.
        return context;
    },
    postOp: (context: Context) => {
        return { ...context.previousContext, result: context.result };
    }
};