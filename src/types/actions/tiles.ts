import { Aspect } from '../aspect';
import { Coordinates } from '../coordinates';
import { IF } from './if';

interface TileSelectBase {
  if?: IF;
  tileIf?: IF;
  isBlocking?: IF;
}
export interface DirectionTileSelect extends TileSelectBase {
  type: 'direction';
  direction: number;
  range: number;
}

export interface DiagonalTileSelect extends TileSelectBase {
  type: 'diagonal';
  range: number;
}

export interface OrthogonalTileSelect extends TileSelectBase {
  type: 'orthogonal';
  range: number;
}

export interface DistanceTileSelect extends TileSelectBase {
  type: 'distance';
  range: number;
}

export interface RangeTileSelect extends TileSelectBase {
  type: 'range';
  range: number;
}
export interface PathRangeTileSelect extends TileSelectBase {
  type: 'pathrange';
  range: number;
}
export interface OffsetTileSelect extends TileSelectBase {
  type: 'offset';
  offset: Coordinates;
}
export interface KindTileSelect extends TileSelectBase {
  type: 'kind';
  target: 'unit' | 'hex';
  kind: string;
}
export interface AspectTileSelect extends TileSelectBase {
  type: 'aspect';
  target: 'unit' | 'hex' | 'building';
  aspect: Aspect;
}
export type TileSelect =
  | DirectionTileSelect
  | DiagonalTileSelect
  | OrthogonalTileSelect
  | DistanceTileSelect
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
