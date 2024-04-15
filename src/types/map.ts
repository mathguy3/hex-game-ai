import { Aspect } from './aspect';
import { BuildingState } from './building/building';
import { Coordinates } from './coordinates';
import { Preview } from './preview';
import { UnitState } from './unit/unit';

type ContainState = UnitState | BuildingState;

export type MapState = Record<string, HexItem>;

export type HexItem = {
  key: string;
  coordinates: Coordinates;
  kind: string;
  aspects: Record<string, Aspect>;
  isSelected: boolean;
  contains: ContainState[];
  preview: Record<string, Preview>;
};
