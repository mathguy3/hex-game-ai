import { HexMap } from './components/HexMap';
import { Button } from './components/Button';
import { CardStack } from './components/CardStack';
import { TokenStack } from './components/TokenStack';
import { Zone } from './components/Zone';

export const UIType = {
  Zone: 'zone',
  Button: 'button',
  CardStack: 'cardStack',
  TokenStack: 'tokenStack',
  HexMap: 'hexMap',
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
    border?: string | any;
    borderRadius?: number | string | any;
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
  action?: string | any;
  disabled?: boolean | any;
};

export type CardStackUIModel = BaseUIModel & {
  type: typeof UIType.CardStack;
  filter?: any;
  content?: string | any;
  disabled?: boolean | any;
};

export type TokenStackUIModel = BaseUIModel & {
  type: typeof UIType.TokenStack;
  content?: string | any;
  disabled?: boolean | any;
};

export type HexMapUIModel = BaseUIModel & {
  type: typeof UIType.HexMap;
  spaces?: {
    [key: string]: any;
  };
};

export type UIModel =
  | { zone: ZoneUIModel }
  | { button: ButtonUIModel }
  | { cardStack: CardStackUIModel }
  | { tokenStack: TokenStackUIModel }
  | { hexMap: HexMapUIModel };

export const UI = (model: UIModel) => {
  const modelType = getType(model);
  const UIComponent = UIComponentMap[modelType];
  return <UIComponent {...(model[modelType] as any)} />;
};
export const UIComponentMap = {
  [UIType.Zone]: Zone,
  [UIType.Button]: Button,
  [UIType.CardStack]: CardStack,
  [UIType.TokenStack]: TokenStack,
  [UIType.HexMap]: HexMap,
};

function getType(model: any) {
  const keys = Object.keys(model);
  return keys[0];
}
