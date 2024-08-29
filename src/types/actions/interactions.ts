import { IF } from './if';
import { TileSet } from './tiles';

export type BoardInteractionType = 'movement' | 'attack';

export type BoardInteraction = {
  type: BoardInteractionType;
  tiles: TileSet;
  fromMovement?: boolean;
  if?: IF;
  actions: (Action | SystemAction)[];
};

export type Action = {
  type?: string;
  set: IF[];
};

export type SystemAction =
  | {
      type: 'end-sequence';
    }
  | {
      type: 'give-control';
      target: string;
    }
  | {
      type: 'player-turn';
      actions: (BoardInteraction | UIInteraction)[];
    };

export type UIInteractionType = 'card' | 'button';

export type UIInteraction = {
  type: UIInteractionType;
  target: string;
  nextInteractions?: (BoardInteraction | UIInteraction)[];
};
