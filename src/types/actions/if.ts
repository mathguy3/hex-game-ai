export type IFCompare = {
  not?: IFValue;
  greaterThan?: IFValue; // numbers only
  lessThan?: IFValue; // numbers only
  greaterEqualThan?: IFValue; // numbers only
  lessEqualThan?: IFValue; // numbers only
};
export type IFMath = {
  add?: IFValue; // numbers only
  subtract?: IFValue; // numbers only
  multiplyBy?: IFValue; // numbers only
  divideBy?: IFValue; // numbers only
};

export type IFNumber = number;
export type IFString = string;
export type IFBoolean = boolean;

export type IFStringConst = 'STRING_VALUE';
export const IFStringValue = 'STRING_VALUE';
export type IFFloatConst = 'FLOAT_VALUE';
export const IFFloatValue = 'FLOAT_VALUE';
export type IFIntConst = 'INT_VALUE';
export const IFIntValue = 'INT_VALUE';
export type IFBooleanConst = 'BOOLEAN_VALUE';
export const IFBooleanValue = 'BOOLEAN_VALUE';
export type IFObjectConst = 'OBJECT_VALUE';
export const IFObjectValue = 'OBJECT_VALUE';
export type IFArrayConst = 'ARRAY_VALUE';
export const IFArrayValue = 'ARRAY_VALUE';

export type IFConstValue =
  | IFStringConst
  | IFFloatConst
  | IFIntConst
  | IFBooleanConst
  | IFObjectConst
  | IFArrayConst;
export type IFObject = { [key: string]: IFValue };
export type IFArray = IFValue[];
export type IFVector = { q: IFValue; r: IFValue; s: IFValue };
export type IFValue =
  | IFNumber
  | IFString
  | IFBoolean
  | IFVector
  | IFObject
  | IFArray
  | IFCompare
  | IFConstValue
  | IFMath
  | IF;
export type IFTarget = IFObject;

export type IFTargetSelector =
  | {
      target: IFTarget;
    }
  | {
      subject: IFTarget;
    }
  | {
      context: IFTarget;
    };

export type IF =
  | IFTargetSelector
  | {
      or: IF[]; // inclusive or
    }
  | {
      and: IF[]; // exclusive and
    };

export const test2: IF = {
  target: {
    unit: {
      aspects: {
        teamId: {
          not: 'team1',
        },
      },
    },
  },
};

export const test: IF[] = [
  {
    target: {
      unit: {
        aspects: {
          teamId: {
            not: {
              and: [
                {
                  subject: {
                    unit: {
                      aspects: {
                        teamId: 'team2',
                      },
                    },
                  },
                },
                {
                  target: {
                    unit: {
                      aspects: {
                        teamId: 'gaia',
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        type: 'unit',
      },
    },
  },
];
