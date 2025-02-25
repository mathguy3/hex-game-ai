import { GameDefinition } from '../../types/game';
import { gameManager, GameSession } from './gameManager';

interface CreateGameParams {
  gameDefinition: GameDefinition;
  user: {
    userId: string;
    userName: string;
  };
}

export const createGame = async (params: CreateGameParams): Promise<GameSession> => {
  try {
    if (!params.gameDefinition || !params.user) {
      throw new Error('Missing required parameters');
    }

    const game = gameManager.createGame({
      gameDefinition: params.gameDefinition,
      creatorId: params.user.userId,
      creatorName: params.user.userName,
    });

    return game;
  } catch (error) {
    console.error('Failed to create game:', error);
    throw new Error(`Failed to create game: ${error.message}`);
  }
};
