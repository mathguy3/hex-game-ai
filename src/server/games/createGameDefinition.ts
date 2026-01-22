import { GameDefinitionV2 } from '../../types/gamev2/game';
import { gameManager } from './gameManager';

interface CreateGameDefinitionParams {
  definition?: GameDefinitionV2;
}

const defaultGameDefinition: GameDefinitionV2 = {
  config: {
    name: 'New Game',
    description: 'Describe your game',
  },
  seats: {
    player1: { isOpen: true, isAi: false },
    player2: { isOpen: true, isAi: false },
  },
  sequence: {},
  data: {},
  definitions: {
    cards: {},
    tokens: {},
    hexes: {},
  },
  ui: {
    shared: {},
    player: {},
  },
};

export const createGameDefinition = async (params: CreateGameDefinitionParams) => {
  const definition = params.definition ?? structuredClone(defaultGameDefinition);
  return { definition: gameManager.createGameDefinition(definition as any) };
};
