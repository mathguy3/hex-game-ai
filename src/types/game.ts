import { UIModel } from '../components/GameUI/UI/UI';
import { ActionSubject } from '../logic/game-controller/sequencer';
import { SequencerContext } from '../logic/if/if-engine-3/operations/types';
import { IF } from './actions/if';
import { CardInteraction, HexInteraction, Interaction, Targeting, UIInteraction } from './actions/interactions';
import { TileSet } from './actions/tiles';
import { UnitDefinition, UnitState } from './entities/unit/unit';
import { HexItem, MapState } from './map';

type PlayerDefinition = {
  canBeAI?: boolean;
  canBeNone?: boolean;
};

type GameConfig = {
  description: string;
  isPrivate?: boolean;
  rotateTable?: boolean;
  useHand?: boolean;
};

type Definitions = {
  units: Record<string, UnitDefinition>;
  cards: Record<string, CardDefinition>;
  map: Record<string, HexItem>;
  sequencing: Sequence;
  actions: Record<string, Sequence | Interaction>;
};

export type GameDefinition = {
  name: string;
  config: GameConfig;
  initialState?: Record<string, any>;
  players: Record<string, PlayerDefinition>;
  definitions: Definitions;
  ui?: UIModel;
  winCondition?: IF;
};

export type CardDefinition = {
  actions?: Record<string, Sequence[]>;
  requirements?: {}[];
  properties?: Record<string, any>;
  targeting?: Targeting;
};

export type Sequence =
  | {
      type: 'continuous';
      actions: (Interaction | Sequence)[];
    }
  | { type: 'repeating'; breakOn?: IF; actions: (Interaction | Sequence)[] }
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
  userId?: string;
  playerId: string;
  name?: string;
  properties?: Record<string, any>;
  hand?: CardState[];
  selected?: CardState[];
  type?: 'player' | 'ai';
  status: 'active' | 'inactive';
};

export type OtherPlayerState = {
  userId?: string;
  playerId: string;
  name?: string;
  properties?: Record<string, any>;
  cardsInHand?: number;
  type: 'player' | 'ai';
  status: 'active' | 'inactive';
};

export type CardState = {
  id: string;
  kind: string;
  properties: Record<string, any>;
  isFaceDown?: boolean;
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
};

export type ActionHistory = {
  id: string;
  action: Interaction | Sequence;
  subjects?: ActionSubject[];
};

export type GameState = {
  roomCode: string;
  players: Record<string, PlayerState | OtherPlayerState>;
  activePlayerId: string;
  model: {
    maps: Record<string, MapState>;
    cards: Record<string, CardState[]>;
    tokens: Record<string, any>;
  };
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
  gameState: GameState;
  sequenceState?: SequencerContext;
  localState: LocalState;
  localControl: LocalControl;

  // Readonly
  gameDefinition: GameDefinition;
  indexes: {
    cards: Record<string, CardState[]>;
    maps: Record<string, MapState>;
    spaces: Record<string, HexItem>;
    units: Record<string, UnitState>;
    activePlayer: PlayerState | OtherPlayerState;
    //subjects: ActionSubject[];
  };
};
