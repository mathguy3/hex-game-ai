import { GameDefinition } from '../../types/game';
import { gameManager } from './gameManager';

interface CreateGameDefinitionParams {
  definition?: GameDefinition;
}

const defaultGameDefinition: GameDefinition = {
  config: {
    name: 'New Game',
    description: 'Describe your game',
  },
  data: {},
  definitions: {
    seats: {
      player1: { isOpen: true, isAi: false },
      player2: { isOpen: true, isAi: false },
    },
    references: {},
    functions: {},
    cards: {},
    sequence: {},
  },
  ui: {
    shared: {},
    player: {},
  },
};

export const createGameDefinition = async (params: CreateGameDefinitionParams) => {
  const definition = params.definition ?? structuredClone(defaultGameDefinition);
  return { definition: gameManager.createGameDefinition(definition) };
};
