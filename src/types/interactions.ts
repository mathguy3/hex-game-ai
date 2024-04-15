import { Aspect } from './aspect';

export type RangeTileSelect = {
  type: 'range';
  range: number;
};
export type PathRangeTileSelect = {
  type: 'pathrange';
  range: number;
};
export type OffsetTileSelect = {
  type: 'offset';
  offset: number;
};
export type KindTileSelect = {
  type: 'kind';
  target: 'unit' | 'hex';
  kind: string;
};
export type AspectTileSelect = {
  type: 'aspect';
  target: 'unit' | 'hex';
  aspect: Aspect;
};
export type TileSelect =
  | PathRangeTileSelect
  | RangeTileSelect
  | OffsetTileSelect
  | KindTileSelect
  | AspectTileSelect;

export type TileSet = {
  add: TileSelect[];
  not?: TileSelect[];
  limit?: TileSelect[];
};

export type InteractionType = 'movement' | 'attack';

export type Interaction = {
  type: InteractionType;
  tiles: TileSet;
  fromMovement?: boolean;
};

export type Interactions = {
  movement: Interaction;
  fromMovement: Interaction[];
  other: Interaction[];
};
