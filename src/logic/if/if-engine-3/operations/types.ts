import { ActionState } from '../../../../types/game';

export type Operation = {
  requiredFields: string[];
  optionalFields?: string[];
  isLeaf?: boolean;
  startOp: (context: Context) => any;
  revisitOp?: (context: Context) => any;
};

export type Context = {
  references?: Record<string, any>;
  functions?: Record<string, any>;
  previousContext?: Context;
  type: 'if' | 'eval' | 'set';
  operationType: string;
  modelItem: any;
  isArray?: boolean;
  path: string;

  field?: string;
  isComplete: boolean;
  localBag?: Record<string, any>;

  next: {
    operationType?: string;
    ifItem?: any;
    modelItem?: any;
  };

  bag: {
    history: string[];
    result?: any;
    model: any;
    references?: Record<string, any>;
  };
};

export type SequencerContext = {
  previousContext?: SequencerContext;
  operationType: string;
  path: string;

  sequenceIndex?: number;
  isComplete: boolean;
  isGameOver?: boolean;
  autoContinue?: boolean;
  delayedContinue?: boolean;
  withBroadcast?: boolean;
  localBag?: Record<string, any>;

  next?: {
    operationType: string;
    sequenceItem: any;
  };
  references?: Record<string, any>;
  functions?: Record<string, any>;

  bag: any;
};
