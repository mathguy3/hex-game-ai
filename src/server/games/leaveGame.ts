import { gameManager } from './gameManager';

export const leaveGame = ({ roomCode, user }) => {
  try {
    gameManager.leaveGame(roomCode, user.id);
    return { success: true };
  } catch (error) {
    console.error('Failed to leave game:', error);
    throw error;
  }
};
