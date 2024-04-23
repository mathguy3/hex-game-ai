import { Action, Interaction } from './actions/interactions';
import { UnitDefinition } from './entities/unit/unit';
import { HexItem, MapState } from './map';

export type GameDefinition = {
  name: string;
  unit: Record<string, UnitDefinition>;
  preTurn?: (Interaction | Action)[];
  turn?: (Interaction | Action)[];
  postTurn?: (Interaction | Action)[];
};

export type ActionState = {
  mapState: MapState;
  selectionState: MapState;
  previewState: MapState;
  targetHex: HexItem;
};
