import { User } from '../user/id';
import { gameManager } from '../games/gameManager';

export type ChatMessage = {
  userId: string;
  message?: string;
};
export type ChatLog = {
  gameId: string;
  messages: ChatMessage[];
};
const chatLog: Record<string, ChatLog> = {};

const newGame = (gameId: string): ChatLog => ({
  gameId,
  messages: [],
});

export const chat = ({ gameId, user, message }: { gameId: string; user: User; message?: string }) => {
  if (!chatLog[gameId]) {
    chatLog[gameId] = newGame(gameId);
  }
  if (message) {
    const current = chatLog[gameId];
    chatLog[gameId] = {
      ...current,
      messages: [...current.messages, { userId: user.userId, message }],
    };
  }
  //console.log('Returning chat', gameId, message, chatLog);
  return { chatLog: chatLog[gameId], users: gameManager.getUsers() };
};
