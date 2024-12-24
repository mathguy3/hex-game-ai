import { IFValue } from '../../../types/actions/if';

export type TargetContext = {
  parent: any;
  field: string;
};

export type GameModel = {
  subject?: any;
  target?: any;
  context?: any;
};

export type IFContext<T extends IFValue = IFValue, Model = GameModel> = {
  type: 'if' | 'set' | 'eval';
  ifValue?: T;
  model: Model;
  selected?: TargetContext;
  selectedParent?: TargetContext;
  path: string;
  state: any;
};
