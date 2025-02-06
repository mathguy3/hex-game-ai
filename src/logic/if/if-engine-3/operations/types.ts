import { ActionState } from '../../../../types/game';

export type Operation = {
  requiredFields: string[];
  optionalFields?: string[];
  isLeaf?: boolean;
  startOp: (context: Context) => any;
  revisitOp?: (context: Context) => any;
};

export type Context = {
  previousContext?: Context;
  type: 'if' | 'eval' | 'set';
  operationType: string;
  path: string;

  field?: string;
  isComplete: boolean;
  localBag?: Record<string, any>;

  nextOperation?: string;
  ifItem: any;
  modelItem?: any;

  bag: {
    history: string[];
    result?: any;
    model: any;
  };
};

export type SequencerContext = {
  previousContext?: SequencerContext;
  operationType: string;
  path: string;

  sequenceIndex?: number;
  isComplete: boolean;

  nextOperation?: string;
  sequenceItem: any;

  bag: {
    history: string[];
    result?: any;
    activeContexts: Record<string, boolean>;
  };
};
