import { gameManager, GameSession } from './gameManager';

export const listGames = (): { games: GameSession[] } => {
    try {
        const games = gameManager.listGames();
        return { games };
    } catch (error) {
        console.error('Failed to list games:', error);
        throw error;
    }
};