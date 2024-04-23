import { Aspect } from '../aspect';
import { Coordinates } from '../coordinates';
import { IF } from './if';

export type RangeTileSelect = {
  type: 'range';
  range: number;
  if?: IF;
  tileIf?: IF;
};
export type PathRangeTileSelect = {
  type: 'pathrange';
  range: number;
  if?: IF;
  tileIf?: IF;
};
export type OffsetTileSelect = {
  type: 'offset';
  offset: Coordinates;
  if?: IF;
  tileIf?: IF;
};
export type KindTileSelect = {
  type: 'kind';
  target: 'unit' | 'hex';
  kind: string;
  if?: IF;
  tileIf?: IF;
};
export type AspectTileSelect = {
  type: 'aspect';
  target: 'unit' | 'hex' | 'building';
  aspect: Aspect;
  if?: IF;
  tileIf?: IF;
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
