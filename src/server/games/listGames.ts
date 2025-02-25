import { User } from '../user/id';
import { gameManager, GameSession } from './gameManager';

export const listGames = (params: { user: User }): { yourGames: GameSession[]; otherGames: GameSession[] } => {
  const { user } = params;
  try {
    const { yourGames, otherGames } = gameManager.listGames(user.userId);
    return { yourGames, otherGames };
  } catch (error) {
    console.error('Failed to list games:', error);
    throw error;
  }
};
