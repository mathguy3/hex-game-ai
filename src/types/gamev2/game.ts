import { UIModel } from "./ui";

export type SeatDefinition = {
  isOpen?: boolean;
  isAi?: boolean;
};

export type GameConfig = {
  name: string;
  description: string;
};

export type Definitions = {
  cards: Record<string, unknown>;
  tokens: Record<string, unknown>;
  hexes: Record<string, unknown>;
  other: Record<string, unknown>;
};

export type GameDefinitionV2 = {
  config: GameConfig;
  seats: Record<string, SeatDefinition>;
  sequence: Record<string, unknown>;
  data: Record<string, unknown>;
  definitions: Definitions;
  ui: {
    shared: UIModel;
    player: UIModel;
  };
};
