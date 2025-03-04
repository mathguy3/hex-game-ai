import { GameSession } from '../../server/games/gameManager';

export const isUserActive = (gameSession: GameSession, userId: string) => {
  const playerId = Object.entries(gameSession.gameState.seats).find((seat) => seat[1].userId === userId)?.[0];
  return gameSession.gameState.activeId === playerId;
};
