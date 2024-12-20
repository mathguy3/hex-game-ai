import { Context } from "../operations/types";

export const popUp = (context: Context) => {
    return {
        ...context.previousContext,
        nextOperation: undefined,
        bag: context.bag
    }
}