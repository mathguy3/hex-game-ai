export type Operation = {
    requiredFields: string[];
    startOp: (context: Context) => any;
    endOp?: (context: Context) => any;
}

export type Context = {
    ifItem: any;
    modelItem?: any
    path: string;
    previousContext?: Context;
    lastItem?: number;
    isComplete: boolean;
    operationType: string;
    type: 'if' | 'eval' | 'set';
    bag: {
        history: string[];
        result?: any;
        contextModel: any;
    }
}