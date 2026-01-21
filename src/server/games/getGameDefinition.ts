import { gameManager } from './gameManager';

interface GetGameDefinitionParams {
  id: string;
}

export const getGameDefinition = async (params: GetGameDefinitionParams) => {
  return { definition: gameManager.getGameDefinition(params.id) };
};
