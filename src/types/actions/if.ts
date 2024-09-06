export type IFCompare = {
  equal?: IFValue;
  not?: IFValue;
  greaterThan?: IFValue; // numbers only
  lessThan?: IFValue; // numbers only
  greaterThanEqual?: IFValue; // numbers only
  lessThanEqual?: IFValue; // numbers only
};
export type IFMath = {
  add?: IFValue; // numbers only
  subtract?: IFValue; // numbers only
  multiply?: IFValue; // numbers only
  divide?: IFValue; // numbers only
};
export type IFKeyValue = {
  key: IFValue;
  value: IFValue;
};
export type IFElse = {
  if: IFValue;
  then: IFValue;
  else?: IFValue;
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

export type IFConstValue = IFStringConst | IFFloatConst | IFIntConst | IFBooleanConst | IFObjectConst | IFArrayConst;
export type IFObject = { [key: string]: IFValue };
export type IFArray = IFValue[];
export type IFVector = { q: IFValue; r: IFValue; s: IFValue };
export type IFValue =
  | IFNumber
  | IFString
  | IFBoolean
  | IFVector
  | IFObject
  | IFTargetSelector
  | IFKeyValue
  | IFArray
  | IFCompare
  | IFConstValue
  | IFMath
  | IF;

export type IFTargetSelector =
  | {
      target: IFValue;
    }
  | {
      subject: IFValue;
    }
  | {
      context: IFValue;
    };

export type IF =
  | IFTargetSelector
  | {
      or: IFValue[]; // inclusive or
    }
  | {
      and: IFValue[]; // exclusive and
    };
