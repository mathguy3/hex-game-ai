// Define all possible message types that match server endpoints
export type WebSocketMessage = {
    type: 'gameUpdate' | 'playerJoined' | 'playerLeft' | 'getGameUpdate';
    gameId: string;
    payload: any;
    requestId?: string;
};

type GameServerEvents = {
    'player:join': { gameId: string; playerId: string };
    'player:leave': { gameId: string; playerId: string };
    'game:state': { gameState: any };
    'game:action': { action: string; data: any };
    'turn:end': { playerId: string };
    // Add other server events as needed
}

type GameClientEvents = {
    'player:joined': { playerId: string; gameId: string };
    'player:left': { playerId: string; gameId: string };
    'game:stateUpdate': { gameState: any };
    'game:actionComplete': { action: string; result: any };
    // Add other client events as needed
}

export class GameWebSocket {
    private ws: WebSocket;
    private messageHandlers: Map<string, Set<(payload: any) => void>>;
    private pendingRequests: Map<string, { resolve: Function; reject: Function }>;

    constructor(private readonly url: string = 'ws://localhost:3006') {
        this.messageHandlers = new Map();
        this.pendingRequests = new Map();
        this.connect();
    }

    private connect() {
        this.ws = new WebSocket(this.url);
        this.setupWebSocket();
    }

    private setupWebSocket() {
        this.ws.onmessage = (event) => {
            const message: WebSocketMessage = JSON.parse(event.data);

            // Handle response to specific request
            if (message.requestId) {
                const pending = this.pendingRequests.get(message.requestId);
                if (pending) {
                    pending.resolve(message.payload);
                    this.pendingRequests.delete(message.requestId);
                    return;
                }
            }

            // Handle event listeners
            const handlers = this.messageHandlers.get(message.type);
            handlers?.forEach(handler => handler(message.payload));
        };

        this.ws.onclose = () => {
            // Implement reconnection logic if needed
            setTimeout(() => this.connect(), 1000);
        };
    }

    // Send a message and wait for response
    async send<T extends keyof GameServerEvents>(
        type: T,
        payload: GameServerEvents[T]
    ): Promise<any> {
        const requestId = crypto.randomUUID();

        return new Promise((resolve, reject) => {
            this.pendingRequests.set(requestId, { resolve, reject });

            this.ws.send(JSON.stringify({
                type,
                payload,
                requestId
            }));

            // Timeout after 5 seconds
            setTimeout(() => {
                if (this.pendingRequests.has(requestId)) {
                    this.pendingRequests.delete(requestId);
                    reject(new Error('Request timeout'));
                }
            }, 5000);
        });
    }

    // Subscribe to specific event types
    on<T extends keyof GameClientEvents>(
        type: T,
        handler: (payload: GameClientEvents[T]) => void
    ) {
        if (!this.messageHandlers.has(type)) {
            this.messageHandlers.set(type, new Set());
        }
        this.messageHandlers.get(type)?.add(handler);
    }

    // Unsubscribe from events
    off<T extends keyof GameClientEvents>(
        type: T,
        handler: (payload: GameClientEvents[T]) => void
    ) {
        this.messageHandlers.get(type)?.delete(handler);
    }

    // Convenience methods that mirror server endpoints
    async joinGame(gameId: string, playerId: string) {
        return this.send('player:join', { gameId, playerId });
    }

    async leaveGame(gameId: string, playerId: string) {
        return this.send('player:leave', { gameId, playerId });
    }

    async sendGameAction(action: string, data: any) {
        return this.send('game:action', { action, data });
    }

    async endTurn(playerId: string) {
        return this.send('turn:end', { playerId });
    }

    // Cleanup
    disconnect() {
        this.messageHandlers.clear();
        this.pendingRequests.clear();
        this.ws.close();
    }
}