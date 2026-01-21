import { gameManager } from './gameManager';

interface DeleteGameDefinitionParams {
  id: string;
}

export const deleteGameDefinition = async (params: DeleteGameDefinitionParams) => {
  return { definition: gameManager.deleteGameDefinition(params.id) };
};
