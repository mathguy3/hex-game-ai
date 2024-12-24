import { GameDefinition } from '../../types/game';
import { gameManager, GameSession } from './gameManager';

interface CreateGameParams {
  gameDefinition: GameDefinition;
  user: {
    id: string;
    name: string;
  };
}

export const createGame = async (params: CreateGameParams): Promise<GameSession> => {
  try {
    if (!params.gameDefinition || !params.user) {
      throw new Error('Missing required parameters');
    }

    const game = gameManager.createGame({
      gameDefinition: params.gameDefinition,
      creatorId: params.user.id,
      creatorName: params.user.name,
    });

    return game;
  } catch (error) {
    console.error('Failed to create game:', error);
    throw new Error(`Failed to create game: ${error.message}`);
  }
};
