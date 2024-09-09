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

type ResponseEvent = {
  type: string;
  actions: Action[] | Action;
};

export type GameDefinition = {
  name: string;
  units: Record<string, UnitDefinition>;
  game: Events & {
    map: Record<string, HexItem>;
    sequencing?: Sequence;
    playerInteractions?: UIInteraction[];
    events?: Record<string, ResponseEvent>;
    cards?: Record<string, CardDefinition>;
  };
  players?: Record<string, PlayerDefinition>;
};

export type CardDefinition = {
  actions: Record<string, Sequence[]>;
  requirements: {}[];
  properties: Record<string, any>;
};

export type Sequence = {
  type: 'alternating' | 'continuous';
  events: (Sequence | Event)[][];
};

export type PlayerState = {
  properties: Record<string, any>;
  hand?: CardState[];
};

type CardState = {
  id: string;
  kind: string;
  properties: Record<string, any>;
};

export type GameState = {
  players: Record<string, PlayerState>;
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
