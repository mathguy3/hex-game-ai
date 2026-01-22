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
};

export type TextUIModel = BaseUIModel & {
  type: typeof UIType.Text;
  content?: string | any;
};

export type TokenUIModel = BaseUIModel & {
  type: typeof UIType.Token;
  //image?: string;
};

export type UIModel =
   (
      | { zone: ZoneUIModel }
      | { button: ButtonUIModel }
      | { cardStack: CardStackUIModel }
      | { tokenStack: TokenStackUIModel }
      | { hexMap: HexMapUIModel }
      | { hex: HexUIModel }
      | { text: TextUIModel }
      | { token: TokenUIModel }
    );
