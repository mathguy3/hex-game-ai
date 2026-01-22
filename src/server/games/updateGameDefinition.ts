import { GameDefinition } from '../../types/game';
import { gameManager } from './gameManager';

interface UpdateGameDefinitionParams {
  id: string;
  definition: GameDefinition;
  user: {
    userId: string;
    userName: string;
  };
}

export const updateGameDefinition = async (params: UpdateGameDefinitionParams) => {
  return { definition: gameManager.updateGameDefinition(params.id, params.definition) };
};
