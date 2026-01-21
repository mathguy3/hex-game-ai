import { GameDefinition } from '../../types/game';
import { gameManager } from './gameManager';

interface UpdateGameDefinitionParams {
  id: string;
  definition: GameDefinition;
}

export const updateGameDefinition = async (params: UpdateGameDefinitionParams) => {
  return { definition: gameManager.updateGameDefinition(params.id, params.definition) };
};
