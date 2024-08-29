import { Action, BoardInteraction, SystemAction, UIInteraction } from './actions/interactions';
import { UnitDefinition } from './entities/unit/unit';
import { HexItem, MapState } from './map';

type Event = BoardInteraction | UIInteraction | Action | SystemAction;

type Events = {
  preTurn?: Event[];
  postTurn?: Event[];
  postInteraction?: Event[];
};

type PlayerDefinition = {
  canBeAI?: boolean;
  canBeNone?: boolean;
};

export type GameDefinition = {
  name: string;
  units: Record<string, UnitDefinition>;
  game: Events & {
    map: Record<string, HexItem>;
    sequencing?: Sequence;
    playerInteractions?: UIInteraction[];
  };
  players?: Record<string, PlayerDefinition>;
};

export type Sequence = {
  type: 'alternating' | 'continuous';
  events: (Sequence | Event)[][];
};

export type PlayerState = {
  properties: Record<string, any>;
};

export type GameState = {
  player: Record<string, PlayerState>;
  activePlayerId: string;
  meId: string;
};

export type ActionState = {
  mapState: MapState;
  selectionState: MapState;
  previewState: MapState;
  targetHex: HexItem;
  selectedHex: HexItem | undefined;
  gameState: GameState;
  activePlayer: PlayerState;
};
