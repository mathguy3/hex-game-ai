import { Context } from "./types";
import { Operation } from "./types";

export const start: Operation = {
    requiredFields: [],
    startOp: (context: Context) => {
        return context;
    }
}
