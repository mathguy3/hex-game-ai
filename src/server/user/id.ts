import { getRandomName } from '../names';
import { getNewId } from '../util/id';
import { gameManager } from '../games/gameManager';

export type User = {
  userId: string;
  userName: string;
};

const sessionIds: Record<string, string> = {};

export function id({ sessionId }: { sessionId: string }) {
  if (sessionIds[sessionId]) {
    return gameManager.getUser(sessionIds[sessionId]);
  }

  const newId = getNewId();
  sessionIds[sessionId] = newId;
  gameManager.addUser(newId, getRandomName());
  return gameManager.getUser(newId);
}

export function getUser(sessionId: string) {
  return gameManager.getUser(sessionIds[sessionId]);
}
