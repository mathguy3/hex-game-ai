import React, { createContext, useContext, useEffect, useRef } from 'react';
import { WebSocketMessage } from '../../../game/websocket';

interface WebSocketContextType {
    sendMessage: (message: WebSocketMessage) => void;
}

const WebSocketContext = createContext<WebSocketContextType>(null);

export const WebSocketProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const wsRef = useRef<WebSocket>();

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3006');

        ws.onopen = () => {
            console.log('WebSocket connected');
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                // Dispatch message to window for other components to listen
                window.dispatchEvent(new MessageEvent('message', { data: event.data }));
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        wsRef.current = ws;

        return () => {
            ws.close();
        };
    }, []);

    const sendMessage = (message: WebSocketMessage) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message));
        }
    };

    return (
        <WebSocketContext.Provider value={{ sendMessage }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext); 