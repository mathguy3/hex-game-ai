import { ModelBase } from "../types";

export type Operation = {
    fields: string[];
    op: <T extends Record<string, any>, GameModel extends ModelBase>(ifValue: T, model: GameModel) => any;
}

export type Context = {
    ifItem: any;
    modelItem?: any
    contextModel: any;
    path: string;
    history: string[];
    previousContext?: Context;
    result?: any;
    isComplete
}