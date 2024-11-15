import { ActionSubject } from '../components/logic/game-controller/sequencer';
import { IF } from './actions/if';
import { CardInteraction, HexInteraction, Interaction, Targeting, UIInteraction } from './actions/interactions';
import { TileSelect } from './actions/tiles';
import { UnitDefinition } from './entities/unit/unit';
import { HexItem, MapState } from './map';

type PlayerDefinition = {
  canBeAI?: boolean;
  canBeNone?: boolean;
};

export type GameDefinition = {
  name: string;
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
  properties?: Record<string, any>;
  hand?: CardState[];
  selected?: CardState[];
  type?: 'player' | 'ai';
};

export type OtherPlayerState = {
  properties?: Record<string, any>;
  cardsInHand?: number;
  type: 'player' | 'ai';
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
  selector?: TileSelect;
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
  players: Record<string, PlayerState | OtherPlayerState>;
  activeAction?: Interaction | Sequence;
  activeActions: Record<string, Sequence | Interaction>;
  actionContext: ActionContext;
  actionHistory: ActionHistory[];
  activeStep: string;
  activePlayerId: string;
};

export type LocalState = {
  meId: string;
  mapManager: MapManagerState;
  cardManager: CardManagerState;
  selectionState: MapState;
  previewState: MapState;
  playerState: PlayerState;
};

export type ActionState = {
  mapState: MapState; // Contains local data (preview, isSelected etc)
  gameState: GameState;
  localState: LocalState; // Can not go to the api

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
