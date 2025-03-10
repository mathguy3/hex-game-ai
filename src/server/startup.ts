import Bun from 'bun';
import { chat } from './chat/chat';
import { createGame } from './games/createGame';
import { gameManager } from './games/gameManager';
import { getGameState } from './games/getGameState';
import { handleAction } from './games/handleAction';
import { joinGame } from './games/joinGame';
import { leaveGame } from './games/leaveGame';
import { listGames } from './games/listGames';
import { getUser, id } from './user/id';
import { startGame } from './games/startGame';
import { continueGame } from './games/continueGame';
import { interact } from './games/interact';
import { ackAnnounce } from './games/ackAnnounce';
import { updateName } from './games/updateName';
const serverRoutes = {
  id,
  chat,
  joinGame,
  createGame,
  listGames,
  handleAction,
  leaveGame,
  getGameState,
  startGame,
  continueGame,
  interact,
  listUsers,
  ackAnnounce,
  updateName,
};

function listUsers() {
  return {
    users: Object.values(gameManager.getUsers()).filter((user) => user.state === 'connected'),
  };
}

// Helper type to check if a function has parameters
type HasParams<T> = T extends (params: infer P) => any
  ? P extends { user: any }
    ? keyof Omit<P, 'user'> extends never
      ? false
      : true
    : false
  : false;

// Modified ClientType to handle parameterless routes
type ClientType<T> = T extends (params: any) => infer R
  ? HasParams<T> extends true
    ? (params: Omit<Parameters<T>[0], 'user'>) => Promise<R>
    : () => Promise<R>
  : unknown;

export type ServerRoutes = {
  [Key in keyof typeof serverRoutes]: ClientType<(typeof serverRoutes)[Key]>;
};
console.log('Server startup');
const gameConnections = new Map<string, Set<WebSocket>>();
const playerConnections = new Map<string, { userId: string; userName: string; ws: string }>();

const server = Bun.serve({
  port: 3006,
  development: true,
  async fetch(req, server) {
    // Upgrade the request to WebSocket if it's a WebSocket request
    if (req.headers.get('Upgrade') === 'websocket') {
      const { response } = server.upgrade(req);
      return response;
    }

    try {
      const headers = new Headers();
      headers.set('Access-Control-Allow-Origin', '*');
      headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      headers.set('Access-Control-Allow-Headers', 'Content-Type');

      const url = new URL(req.url);
      const routeName = url.pathname.slice(1);
      const handler = serverRoutes[routeName];
      if (!handler) {
        return new Response('aw turtles 404', { headers, status: 404, statusText: "can't find that path" });
      }
      const params = await req.json();

      const user = getUser(params.sessionId);
      if ((!params.sessionId || !user) && routeName !== 'id') {
        console.log('sessionId not found, use /id first', routeName, params, user);
        //console.log(routeName, params, user);
        return new Response('401', { headers, status: 401, statusText: 'sessionId not found, use /id first' });
      }
      const result = await handler({ ...params, user });
      const response = new Response(JSON.stringify(result), { headers });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      console.error('Server error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
  error(error) {
    console.error('Server error:', error);
  },
  websocket: {
    open(ws) {
      console.log('WebSocket connection opened', new Date().toISOString());
    },
    message(ws, message) {
      //console.log("WebSocket message received:", message);
      try {
        let data = JSON.parse(message as string);
        data = { ...data, ...data.payload };
        console.log('websocket message', data);

        switch (data.type) {
          case 'connectPlayer': {
            console.log('connecting player', data, data.userId, data.userName);
            console.log('playerConnections', playerConnections);

            playerConnections.set(data.userId, { userId: data.userId, userName: data.userName, ws });
            gameManager.setUserState(data.userId, 'connected');
            break;
          }
          case 'disconnectPlayer': {
            console.log('disconnecting player', data.userId);
            playerConnections.delete(data.userId);
            gameManager.setUserState(data.userId, 'disconnected');
            break;
          }
          case 'connectToRoom': {
            console.log('connecting to room', data, data.userId, data.roomCode);
            connectToRoom(ws, data.userId, data.roomCode);
            break;
          }

          case 'disconnectFromRoom': {
            console.log('disconnecting from room', data, data.userId, data.roomCode);
            disconnectFromRoom(ws, data.userId, data.roomCode);
            break;
          }

          case 'getGameUpdate': {
            const roomCode = data.roomCode;
            const gameState = gameManager.getGameState(roomCode, data.payload.userId);
            ws.send(
              JSON.stringify({
                type: 'gameUpdate',
                roomCode,
                payload: {
                  gameState: gameState.gameState,
                  localControl: gameState.localControl,
                },
              })
            );
            break;
          }
        }
      } catch (e) {
        console.error('WebSocket message error:', e);
      }
    },
    close(ws) {
      console.log('WebSocket connection closed', new Date().toISOString());
      playerConnections.forEach((player, id) => {
        if (player.ws === ws) {
          console.log('forcibly disconnecting player', player.userId, player.userName);
          playerConnections.delete(player.userId);
          removeFromAllGames(ws, player.userId);
        }
      });
    },
  },
});

console.log(`Server running at ${server.url}`);

export function broadcastToGame(roomCode: string, message: any, exclude?: WebSocket) {
  const connections = gameConnections.get(roomCode);
  if (!connections) return;

  let messageStr;
  try {
    messageStr = JSON.stringify(message);
  } catch (e) {
    console.dir(message, { depth: 5 });
    console.error('Error stringifying message:');
    throw e;
  }
  for (const client of connections) {
    if (client !== exclude) {
      client.send(messageStr);
    }
  }
}

function connectToRoom(ws: WebSocket, userId: string, roomCode: string) {
  if (!gameConnections.has(roomCode)) {
    gameConnections.set(roomCode, new Set());
  }
  gameConnections.get(roomCode)?.add(ws);

  gameManager.connectToRoom(roomCode, userId);

  broadcastToGame(
    roomCode,
    {
      type: 'userConnected',
      payload: {
        userId,
      },
    },
    ws
  );
}

function disconnectFromRoom(ws: WebSocket, userId: string, roomCode: string) {
  const connections = gameConnections.get(roomCode);
  if (connections) {
    connections.delete(ws);
    gameManager.disconnectFromRoom(roomCode, userId);
    broadcastToGame(roomCode, {
      type: 'userDisconnected',
      payload: {
        userId,
      },
      ws,
    });
    if (connections.size === 0) {
      gameConnections.delete(roomCode);
    }
  }
}

function removeFromAllGames(ws: WebSocket, userId: string) {
  for (const [roomCode, connections] of gameConnections.entries()) {
    if (connections.has(ws)) {
      disconnectFromRoom(ws, userId, roomCode);
    }
  }
}
