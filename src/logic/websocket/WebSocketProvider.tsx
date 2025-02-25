import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useClient } from '../client/ClientProvider';

export type WebSocketMessage = {
  type: 'gameUpdate' | 'connectPlayer' | 'disconnectPlayer' | 'connectToRoom' | 'disconnectFromRoom' | 'getGameUpdate';
  roomCode: string;
  payload: any;
  requestId?: string;
};

interface WebSocketContextType {
  sendMessage: (message: WebSocketMessage) => void;
}

const WebSocketContext = createContext<WebSocketContextType>(null);

const baseUrl = `http://${window.location.hostname}:3006`;

export const WebSocketProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { user } = useClient();
  const wsRef = useRef<WebSocket>();
  const isRegistered = useRef(false);

  useEffect(() => {
    const ws = new WebSocket(baseUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
      if (user && !ws.CONNECTING) {
        console.log('registering player', user, user.userId, user.userName);
        wsRef.current.send(JSON.stringify({ type: 'connectPlayer', userId: user.userId, userName: user.userName }));
        isRegistered.current = true;
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');

      if (isRegistered.current) {
        wsRef.current.send(JSON.stringify({ type: 'disconnectPlayer', userId: user.userId }));
        isRegistered.current = false;
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onmessage = (event) => {
      try {
        //const message = JSON.parse(event.data);
        //console.log('websocket message', event.data);
        // Dispatch message to window for other components to listen
        window.dispatchEvent(new MessageEvent('message', { data: event.data }));
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    wsRef.current = ws;

    return () => {
      if (isRegistered.current) {
        wsRef.current.send(JSON.stringify({ type: 'disconnectPlayer', userId: user.userId }));
        isRegistered.current = false;
      }
      ws.close();
      console.log('WebSocket closed');
    };
  }, [user]);

  const sendMessage = (message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  return <WebSocketContext.Provider value={{ sendMessage }}>{children}</WebSocketContext.Provider>;
};

export const useWebSocket = () => useContext(WebSocketContext);
