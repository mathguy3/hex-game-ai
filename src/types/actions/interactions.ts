import { Sequence } from '../game';
import { IF } from './if';
import { TileSet } from './tiles';

export type BoardAction = {
  type: 'board';
  targeting: Targeting;
  fromMovement?: boolean;
  if?: IF;
  actions: (Action | SystemAction)[];
};

export type Targeting = {
  userSelect?: boolean;
  tiles: TileSet;
};

export type Action = {
  type: 'action';
  name: string;
  description: string;
  set: IF | IF[];
};

export type SystemAction = { type: 'system' } & (
  | {
      kind: 'end-sequence';
    }
  | {
      kind: 'end-turn';
    }
  | {
      kind: 'give-control';
      target: string;
    }
  | {
      kind: 'player-turn';
      actions: CardInteraction[];
    }
);

export type CardInteraction =
  | {
      type: 'card';
      kind: 'select';
      slots: number;
    }
  | {
      type: 'card';
      kind: 'play';
    };

export type HexInteraction = {
  type: 'hex';
  kind: string; // Helps with targeting coloring, could just change to color?
  targeting: Targeting;
  if?: IF;
  actions: (string | Sequence | Interaction)[];
};

export type UIInteraction = {
  type: 'ui';
  kind: string;
  id?: string;
  if?: IF;
  actions?: (string | Sequence | Interaction)[];
};

export type Interaction = HexInteraction | CardInteraction | UIInteraction | Action | SystemAction;
