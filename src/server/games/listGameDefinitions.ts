import { gameManager } from './gameManager';

interface ListGameDefinitionsParams {
  user: {
    userId: string;
    userName: string;
  };
}

export const listGameDefinitions = async (_params: ListGameDefinitionsParams) => {
  return { definitions: gameManager.listGameDefinitions() };
};
