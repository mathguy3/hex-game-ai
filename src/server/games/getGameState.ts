import { User } from '../user/id';
import { gameManager } from './gameManager';

export const getGameState = ({ roomCode, user }: { roomCode: string; user: User }) => {
  if (!gameManager.hasGame(roomCode)) {
    throw new Error('Game not found ' + roomCode);
  }
  console.log('getGameState', roomCode, user);
  const gameSession = gameManager.getGameState(roomCode, user.id);
  const myId = gameManager.getPlayerByUserId(roomCode, user.id)?.playerId;
  return { gameSession, myId };
};
