import { selectNext } from "../../utils/select-next";
import { Context } from "../types";

export const target = {
    requiredFields: ['target'],
    startOp: (context: Context) => {
        if (!('target' in context.ifItem)) {
            throw new Error("Wrong value type for target operation");
        }
        const updatedContext = selectNext(context);
        return {
            ...updatedContext,
            modelItem: context.bag.model.target,
            operationType: 'target',
        }
    },
    revisitOp: (context: Context) => {
        return { ...context, isComplete: true };
    }
}