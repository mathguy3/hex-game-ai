import Bun from 'bun';
import { chat } from './chat/chat';
import { info } from './game';
import { play } from './play';
import { getUser, id } from './user/id';

const serverRoutes = {
  id,
  chat,
  info,
  play,
};

type ClientType<T> = T extends (params: infer A) => infer R ? (params: Omit<A, 'user'>) => Promise<R> : unknown;
export type ServerRoutes = {
  [Key in keyof typeof serverRoutes]: ClientType<(typeof serverRoutes)[Key]>;
};
console.log('Server startup');
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
      const response = new Response(JSON.stringify(handler({ ...params, user })), { headers });

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
      console.log('WebSocket connected');
    },
    error(ws, error) {
      console.error('WebSocket error:', error);
    },
    close(ws) {
      console.log('WebSocket closed');
    },
    message(ws, message) {
      try {
        // Your message handling
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        }));
      }
    }
  }
});
