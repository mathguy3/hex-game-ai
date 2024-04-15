import { HexItem, MapState } from './map';
import { UnitDefinition } from './unit/unit';

export type GameDefinition = {
  name: string;
  unit: Record<string, UnitDefinition>;
};

export type ActionState = {
  mapState: MapState;
  selectionState: MapState;
  previewState: MapState;
  targetHex: HexItem;
};
