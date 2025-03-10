import { HexMap } from './components/HexMap';
import { Button } from './components/Button';
import { CardStack } from './components/CardStack';
import { TokenStack } from './components/TokenStack';
import { Zone } from './components/Zone';
import { Text } from './components/Text';
import { Hex } from './components/Hex';
import { Token } from './components/Token';
import React from 'react';

export const UIType = {
  Zone: 'zone',
  Button: 'button',
  CardStack: 'cardStack',
  TokenStack: 'tokenStack',
  HexMap: 'hexMap',
  Hex: 'hex',
  Text: 'text',
  Token: 'token',
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
  data?: any;
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
  cardStyles?: any;
};

export type TokenStackUIModel = BaseUIModel & {
  type: typeof UIType.TokenStack;
  content?: string | any;
  disabled?: boolean | any;
};

export type HexMapUIModel = BaseUIModel & {
  type: typeof UIType.HexMap;
  hex?: any;
};

export type HexUIModel = BaseUIModel & {
  type: typeof UIType.Hex;
  data?: any;
  onClick?: () => void;
};

export type TextUIModel = BaseUIModel & {
  type: typeof UIType.Text;
  content?: string | any;
};

export type TokenUIModel = BaseUIModel & {
  type: typeof UIType.Token;
  image?: string;
};

export type UIModel =
  | { data?: any; onClick?: () => void } & (
      | { zone: ZoneUIModel }
      | { button: ButtonUIModel }
      | { cardStack: CardStackUIModel }
      | { tokenStack: TokenStackUIModel }
      | { hexMap: HexMapUIModel }
      | { hex: HexUIModel }
      | { text: TextUIModel }
      | { token: TokenUIModel }
    );

export const UI = React.memo((model: any) => {
  const modelType = getType(model);
  const UIComponent = UIComponentMap[modelType];
  const { [modelType]: modelItem, ...rest } = model;
  return <UIComponent {...modelItem} {...rest} />;
});
export const UIComponentMap = {
  [UIType.Zone]: Zone,
  [UIType.Button]: Button,
  [UIType.CardStack]: CardStack,
  [UIType.TokenStack]: TokenStack,
  [UIType.HexMap]: HexMap,
  [UIType.Text]: Text,
  [UIType.Hex]: Hex,
  [UIType.Token]: Token,
};

function getType(model: any) {
  const keys = Object.keys(model);
  return keys[0];
}
