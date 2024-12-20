import { getNextOperation } from "./getNextOperation";
import { Context } from "./operations/types";
import { runIf } from "./runIf";
import { ContextProps } from "./types";

export const doEval = (context: ContextProps) => {
    const { ifItem, model } = context;
    const runContext: Context = {
        ifItem,
        type: 'eval',
        path: '',
        bag: { history: [], model },
        isComplete: false,
        operationType: '',
    };
    const { operationType } = getNextOperation(runContext);
    runContext.nextOperation = operationType;
    const updatedContext = runIf(runContext);
    return updatedContext.bag.result;
}