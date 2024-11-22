import Bun from 'bun';
import { chat } from './chat/chat';
import { createGame } from './games/createGame';
import { gameManager } from './games/gameManager';
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

const server = Bun.serve({
  port: 3006,
  development: true,
  async fetch(req, server) {
    // Upgrade the request to WebSocket if it's a WebSocket request
    if (req.headers.get("Upgrade") === "websocket") {
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
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  },
  error(error) {
    console.error('Server error:', error);
  },
  websocket: {
    open(ws) {
      console.log("WebSocket connection opened", new Date().toISOString());
    },
    message(ws, message) {
      //console.log("WebSocket message received:", message);
      try {
        const data = JSON.parse(message as string);

        switch (data.type) {
          case 'playerJoined': {
            const gameId = data.gameId;
            if (!gameConnections.has(gameId)) {
              gameConnections.set(gameId, new Set());
            }
            gameConnections.get(gameId)?.add(ws);

            broadcastToGame(gameId, {
              type: 'playerJoined',
              gameId,
              payload: {
                playerId: data.playerId,
              }
            }, ws);
            break;
          }

          case 'playerLeft': {
            leaveGameWS(ws, data.gameId);
            break;
          }

          case 'getGameUpdate': {
            const gameId = data.gameId;
            const gameState = gameManager.getGameState(gameId, data.payload.userId);
            ws.send(JSON.stringify({
              type: 'gameUpdate',
              gameId,
              payload: {
                gameState: gameState.gameState,
                mapState: gameState.mapState,
                localControl: gameState.localControl
              }
            }));
            break;
          }
        }
      } catch (e) {
        console.error('WebSocket message error:', e);
      }
    },
    close(ws) {
      console.log("WebSocket connection closed", new Date().toISOString());
      removeFromAllGames(ws);
    }
  }
});

console.log(server);

export function broadcastToGame(gameId: string, message: any, exclude?: WebSocket) {
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