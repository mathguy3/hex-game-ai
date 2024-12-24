import { Button } from './Button';
import { CardStack } from './CardStack';
import { TokenStack } from './TokenStack';
import { Zone } from './Zone';

export const UIType = {
  Zone: 'Zone',
  Button: 'Button',
  CardStack: 'CardStack',
  TokenStack: 'TokenStack',
} as const;
type BaseUIModel = {
  id: string;
  styles?: {
    top?: number | string | any;
    left?: number | string | any;
    right?: number | string | any;
    bottom?: number | string | any;
    width?: number | string | any;
    height?: number | string | any;
    position?: string | any;
    color?: string | any;
    backgroundColor?: string | any;
  };
  properties?: {
    [key: string]: any;
  };
};
export type ZoneUIModel = BaseUIModel & {
  type: typeof UIType.Zone;
  children?: UIModel[];
};

export type ButtonUIModel = BaseUIModel & {
  type: typeof UIType.Button;
  content?: string | any;
};

export type CardStackUIModel = BaseUIModel & {
  type: typeof UIType.CardStack;
  content?: string | any;
  disabled?: boolean | any;
};

export type TokenStackUIModel = BaseUIModel & {
  type: typeof UIType.TokenStack;
  content?: string | any;
  disabled?: boolean | any;
};

export type UIModel = ZoneUIModel | ButtonUIModel | CardStackUIModel | TokenStackUIModel;

export const UI = (model: UIModel) => {
  const UIComponent = UIComponentMap[model.type];
  return <UIComponent {...(model as any)} />;
};
export const UIComponentMap = {
  [UIType.Zone]: Zone,
  [UIType.Button]: Button,
  [UIType.CardStack]: CardStack,
  [UIType.TokenStack]: TokenStack,
};
