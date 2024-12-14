import { Preview } from './actions/preview';
import { Aspect } from './aspect';
import { CoordinateKey, Coordinates } from './coordinates';
import { BuildingState } from './entities/building/building';
import { UnitState } from './entities/unit/unit';

type ContainState = {
  unit?: UnitState;
  building?: BuildingState;
};

export type MapState = Record<string, HexItem>;

export type HexItem = {
  type: 'hex';
  key: CoordinateKey;
  coordinates: Coordinates;
  kind: string;
  properties: Record<string, Aspect>;
  isSelected: boolean;
  contains: ContainState;
  preview: Record<string, Preview>;
};
