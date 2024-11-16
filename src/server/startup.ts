import Bun from 'bun';
import { chat } from './chat/chat';
import { createGame } from './games/createGame';
import { handleAction } from './games/handleAction';
import { joinGame } from './games/joinGame';
import { leaveGame } from './games/leaveGame';
import { listGames } from './games/listGames';
import { getUser, id } from './user/id';


const serverRoutes = {
  id,
  chat,
  joinGame,
  createGame,
  listGames,
  handleAction,
  leaveGame
};

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

Bun.serve({
  port: 3004,
  development: true,
  error(error: Error) {
    console.error('Server error:', error);
    return new Response(`Error: ${error.message}`, {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  async fetch(req: Request) {
    try {
      console.log('Server fetch');
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
        console.log(routeName, params, user);
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

      return new Response(
        JSON.stringify({
          error: error instanceof Error ? error.message : 'Unknown error occurred',
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  },

  websocket: {
    open(ws) {
      // When a client connects, they should send a "join" message first
      console.log("Client connected");
    },
    message(ws, message) {
      try {
        const data = JSON.parse(message as string);

        switch (data.type) {
          case 'join':
            const gameId = data.gameId;
            if (!gameConnections.has(gameId)) {
              gameConnections.set(gameId, new Set());
            }
            gameConnections.get(gameId)?.add(ws);

            // Broadcast to other players in the game
            broadcastToGame(gameId, {
              type: 'playerJoined',
              playerId: data.playerId,
              // ... other player data
            }, ws); // Exclude the sender
            break;

          case 'leave':
            leaveGameWS(ws, data.gameId);
            break;
        }
      } catch (e) {
        console.error('WebSocket message error:', e);
      }
    },
    close(ws) {
      // Clean up when client disconnects
      removeFromAllGames(ws);
    }
  }
});

function broadcastToGame(gameId: string, message: any, exclude?: WebSocket) {
  const connections = gameConnections.get(gameId);
  if (!connections) return;

  const messageStr = JSON.stringify(message);
  for (const client of connections) {
    if (client !== exclude) {
      client.send(messageStr);
    }
  }
}

function leaveGameWS(ws: WebSocket, gameId: string) {
  const connections = gameConnections.get(gameId);
  if (connections) {
    connections.delete(ws);
    if (connections.size === 0) {
      gameConnections.delete(gameId);
    }
  }
}

function removeFromAllGames(ws: WebSocket) {
  for (const [gameId, connections] of gameConnections.entries()) {
    if (connections.has(ws)) {
      leaveGameWS(ws, gameId);
      broadcastToGame(gameId, {
        type: 'playerLeft',
        // ... player data
      });
    }
  }
}