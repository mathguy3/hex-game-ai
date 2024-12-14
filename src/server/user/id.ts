import { getRandomName } from '../names';
import { getNewId } from '../util/id';

export type User = {
  id: string;
  name: string;
};

const sessionIds: Record<string, string> = {};
export const userRecord: Record<string, User> = {};

export function id({ sessionId }: { sessionId: string }) {
  if (sessionIds[sessionId]) {
    //console.log('session found', sessionId, sessionIds[sessionId], userRecord[sessionIds[sessionId]]);
    return userRecord[sessionIds[sessionId]];
  }

  const newId = getNewId();
  sessionIds[sessionId] = newId;
  userRecord[newId] = {
    id: newId,
    name: getRandomName(),
  };
  return userRecord[newId];
}

export function getUser(sessionId: string) {
  return userRecord[sessionIds[sessionId]];
}
