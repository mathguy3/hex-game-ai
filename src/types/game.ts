import { Action, Interaction } from './actions/interactions';
import { UnitDefinition } from './entities/unit/unit';
import { HexItem, MapState } from './map';

type Events = {
  preTurn?: (Interaction | Action)[];
  postTurn?: (Interaction | Action)[];
  postInteraction?: (Interaction | Action)[];
};

export type GameDefinition = Events & {
  name: string;
  unit: Record<string, UnitDefinition>;
  turn?: (Interaction | Action)[];
  player?: Record<string, Events>;
};

export type PlayerState = {
  properties: Record<string, any>;
};

export type GameState = {
  player: Record<string, PlayerState>;
};

export type ActionState = {
  mapState: MapState;
  selectionState: MapState;
  previewState: MapState;
  targetHex: HexItem;
  gameState: GameState;
};
