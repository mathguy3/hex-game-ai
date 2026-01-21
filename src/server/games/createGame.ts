import { GameDefinition } from '../../types/game';
import { gameManager, GameSession } from './gameManager';

interface CreateGameParams {
  gameDefinition?: GameDefinition;
  gameDefinitionId?: string;
  user: {
    userId: string;
    userName: string;
  };
}

export const createGame = async (params: CreateGameParams): Promise<GameSession> => {
  try {
    if ((!params.gameDefinition && !params.gameDefinitionId) || !params.user) {
      throw new Error('Missing required parameters');
    }

    const definitionRecord = params.gameDefinitionId
      ? gameManager.getGameDefinition(params.gameDefinitionId)
      : undefined;
    const gameDefinition = params.gameDefinition ?? definitionRecord?.definition;

    if (!gameDefinition) {
      throw new Error('Game definition not found');
    }

    const game = gameManager.createGame({
      gameDefinition,
      creatorId: params.user.userId,
      creatorName: params.user.userName,
    });

    return game;
  } catch (error) {
    console.error('Failed to create game:', error);
    throw new Error(`Failed to create game: ${error.message}`);
  }
};
