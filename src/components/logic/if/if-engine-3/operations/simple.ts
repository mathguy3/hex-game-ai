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
    isLeaf: true,
    startOp: (context: Context) => {
        const item = context.modelItem;
        if (typeof item !== 'string' && typeof item !== 'number' && typeof item !== 'boolean') {
            throw new Error("Simple operation requires a simple type" + JSON.stringify(item));
        }
        context.bag.result = item;
        if (map[context.modelItem]) {
            context.bag.result = context.modelItem;
        }
        context.bag.history.push(context.path + "." + context.bag.result);
        return {
            previousContext: context,
            bag: context.bag
        };
    }
};