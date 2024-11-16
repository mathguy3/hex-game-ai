import { gameManager } from './gameManager';

export const leaveGame = ({ gameId, user }) => {
    try {
        gameManager.leaveGame(gameId, user.id);
        return { success: true };
    } catch (error) {
        console.error('Failed to leave game:', error);
        throw error;
    }
}; 