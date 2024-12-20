import { ActionSubject } from '../components/logic/game-controller/sequencer';
import { IF } from './actions/if';
import { CardInteraction, HexInteraction, Interaction, Targeting, UIInteraction } from './actions/interactions';
import { TileSet } from './actions/tiles';
import { UnitDefinition } from './entities/unit/unit';
import { HexItem, MapState } from './map';

type PlayerDefinition = {
  canBeAI?: boolean;
  canBeNone?: boolean;
};

export type GameDefinition = {
  name: string;
  description: string;
  units: Record<string, UnitDefinition>;
  players: Record<string, PlayerDefinition>;
  actions: Record<string, Sequence | Interaction>;
  cards?: Record<string, CardDefinition>;
  map: Record<string, HexItem>;
  sequencing: Sequence;
};

export type CardDefinition = {
  actions: Record<string, Sequence[]>;
  requirements?: {}[];
  properties?: Record<string, any>;
  targeting?: Targeting;
};

export type Sequence =
  | {
    type: 'continuous';
    actions: (Interaction | Sequence)[];
  }
  | { type: 'repeating'; breakOn: IF; actions: (Interaction | Sequence)[] }
  | {
    type: 'options';
    multi?: number;
    interactions: {
      card?: CardInteraction;
      hex?: HexInteraction;
      ui?: UIInteraction;
    };
  };

// This data should not be available to everyone
export type PlayerState = {
  playerId?: string;
  name?: string;
  teamId: string;
  properties?: Record<string, any>;
  hand?: CardState[];
  selected?: CardState[];
  type?: 'player' | 'ai';
  status: 'active' | 'inactive';
};

export type OtherPlayerState = {
  playerId?: string;
  name?: string;
  teamId: string;
  properties?: Record<string, any>;
  cardsInHand?: number;
  type: 'player' | 'ai';
  status: 'active' | 'inactive';
};

export type CardState = {
  id: string;
  kind: string;
  properties: Record<string, any>;
};

export type CardManagerState = {
  state: 'view' | 'select' | 'play';
  selectionSlots: number;
};

export type MapManagerState = {
  state: 'view' | 'play';
  selector?: TileSet;
};

export type ActiveAction = {
  activeAction: string;
};

export type ActionContext = {
  id: string;
  action: Interaction | Sequence;
  subjects?: ActionSubject[];
  previousContext?: ActionContext;
  currentIndex?: number;
  isComplete?: boolean;
}

export type ActionHistory = {
  id: string;
  action: Interaction | Sequence;
  subjects?: ActionSubject[];
}

export type GameState = {
  gameId: string;
  hasStarted: boolean;
  players: Record<string, PlayerState | OtherPlayerState>;
  activeAction?: Interaction | Sequence;
  activeActions: Record<string, Sequence | Interaction>;
  actionContext: ActionContext;
  actionHistory: ActionHistory[];
  activeStep: string;
  activePlayerId: string;
};

export type LocalState = {
  // These are the states that the local client can change
  mapManager: MapManagerState;
  cardManager: CardManagerState;
  selectionState: MapState;
  previewState: MapState;

  // readonly state
  meId: string;
  playerState: PlayerState;
};

export type LocalControl = {
  activeActions: Record<string, TileSet>;
};

export type ActionState = {
  mapState: MapState;
  gameState: GameState;
  localState: LocalState;
  localControl: LocalControl;

  // don't return
  autoContinue?: boolean;

  // Readonly
  gameDefinition: GameDefinition;
  targetHex: HexItem;
  selectedHex: HexItem | undefined;
  selectedCard: CardState | undefined;
  activePlayer: PlayerState | OtherPlayerState;
};

// This is all stuff that needs to come back from the api
export type SharedState = {
  mapState: MapState;
  gameState: GameState;
  playerState: PlayerState; // me maybe doesn't come back from the api?
};
