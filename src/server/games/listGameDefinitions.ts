import { gameManager } from './gameManager';

export const listGameDefinitions = async () => {
  return { definitions: gameManager.listGameDefinitions() };
};
