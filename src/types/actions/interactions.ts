import { IF } from './if';
import { TileSet } from './tiles';

export type InteractionType = 'movement' | 'attack';

export type Interaction = {
  type: InteractionType;
  tiles: TileSet;
  fromMovement?: boolean;
  if?: IF;
  actions: Action[];
};

export type Action = {
  type?: string;
  set: IF[];
};
