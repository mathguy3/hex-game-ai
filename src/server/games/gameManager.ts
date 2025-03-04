import { ActionRequest, doSequence } from '../../logic/game-controller/sequencer';
import { SequencerContext } from '../../logic/if/if-engine-3/operations/types';
import { WebSocketMessage } from '../../logic/websocket/WebSocketProvider';
import {
  GameDefinition,
  GameState,
  LocalControl,
  OtherPlayerState,
  PlayerState,
  SeatDefinition,
} from '../../types/game';
import { broadcastToGame } from '../startup';

export type PlayerConfig = {
  isOpen: boolean;
  isAi: boolean;
  teamId?: string;
};

export type RoomConfig = {
  isPrivate: boolean;
  passwordHash?: string;
  seats: Record<string, SeatDefinition>;
};

export interface ServerSession {
  roomCode: string;
  gameSession: GameSession;
  sequenceState: SequencerContext;
  activeContexts: Record<string, SequencerContext>;
}

export interface GameSession {
  roomCode: string;
  roomConfig: RoomConfig;
  gameDefinition: GameDefinition;
  gameState: GameState;
  localControl?: LocalControl;
}

export class GameManager {
  private games: Record<string, ServerSession> = {};
  private users: Record<string, { userId: string; userName: string; state: string }> = {};

  addUser(userId: string, userName: string) {
    this.users[userId] = { userId, userName, state: 'disconnected' };
  }

  removeUser(userId: string) {
    delete this.users[userId];
  }

  setUserState(userId: string, state: string) {
    this.users[userId].state = state;
  }

  getUser(userId: string) {
    return this.users[userId];
  }

  getUsers() {
    return this.users;
  }

  updateName(userId: string, name: string) {
    this.users[userId].userName = name;
    return this.users[userId];
  }

  // Create a new game session
  createGame(params: { gameDefinition: GameDefinition; creatorId: string; creatorName: string }): GameSession {
    const { definitions, data } = params.gameDefinition;
    const roomCode = crypto.randomUUID().slice(0, 6).toUpperCase();
    const newGame: GameSession = {
      roomConfig: {
        isPrivate: false,
        seats: definitions.seats,
      },
      roomCode,
      gameDefinition: params.gameDefinition,
      gameState: {
        history: [],
        data,
        seats: {
          ...Object.fromEntries(
            Object.entries(definitions.seats).map(([key, _]) => [key, { id: key, isActive: false }])
          ),
          player1: {
            id: 'player1',
            userId: params.creatorId,
            userName: params.creatorName,
            isActive: true,
          },
        },
        activeId: 'player1',
        hasStarted: false,
        activeStep: 'not started',
        isComplete: false,
      },
    };

    this.games[newGame.roomCode] = {
      roomCode: newGame.roomCode,
      gameSession: newGame,
      sequenceState: {
        path: '',
        operationType: '',
        isComplete: false,
        autoContinue: true,
        nextOperation: 'start',
        nextSequenceItem: definitions.sequence,
        bag: {
          history: [],
        },
      },
      activeContexts: {},
    };

    return newGame;
  }

  // Add a player to a game
  joinGame(roomCode: string, userId: string, playerName: string): GameSession {
    const game = this.games[roomCode];
    console.log('joinGame', roomCode, userId, playerName);
    if (!game) throw new Error('Game not found');

    const firstOpenSeat = Object.entries(game.gameSession.gameState.seats).find(([playerId, seat]) => !seat.userId);
    console.log('firstOpenSeat', firstOpenSeat);
    if (!firstOpenSeat) {
      throw new Error('Game is full');
    }

    const filledPlayers = Object.values(game.gameSession.gameState.seats).filter((seat) => seat.userId);
    console.log('filledPlayers', filledPlayers);
    game.gameSession.gameState.seats[firstOpenSeat[0]] = {
      ...game.gameSession.gameState.seats[firstOpenSeat[0]],
      userId,
      userName: playerName,
      isActive: true,
    };
    console.log('game.gameSession.gameState.seats', game.gameSession.gameState.seats);
    // If this is the first player, make them active
    if (filledPlayers.length === 0) {
      console.log('first player', firstOpenSeat[0]);
      game.gameSession.gameState.activeId = firstOpenSeat[0];
    }

    this.broadcastState(roomCode);

    return game.gameSession;
  }

  connectToRoom(roomCode: string, userId: string) {
    const game = this.games[roomCode];
    if (!game) throw new Error('Game not found');
    Object.values(game.gameSession.gameState.seats).forEach((seat) => {
      if (seat.userId === userId) {
        seat.isActive = true;
      }
    });
    this.broadcastState(roomCode);
  }

  disconnectFromRoom(roomCode: string, userId: string) {
    const game = this.games[roomCode];
    if (!game) throw new Error('Game not found');
    Object.values(game.gameSession.gameState.seats).forEach((seat) => {
      if (seat.userId === userId) {
        seat.isActive = false;
      }
    });
    this.broadcastState(roomCode);
  }

  // Get list of available games
  listGames(userId: string): { yourGames: GameSession[]; otherGames: GameSession[] } {
    const yourGames = Object.values(this.games)
      .filter((game) => Object.values(game.gameSession.gameState.seats).some((player) => player.userId === userId))
      .map((game) => game.gameSession);
    const otherGames = Object.values(this.games)
      .filter(
        (game) =>
          !game.gameSession.roomConfig.isPrivate &&
          !Object.values(game.gameSession.gameState.seats).some((player) => player.userId === userId)
      )
      .map((game) => game.gameSession);
    //console.log('yourGames', yourGames);
    //console.log('otherGames', otherGames);
    return { yourGames, otherGames };
  }

  // Get detailed game state with mapped player info
  getGameState(roomCode: string, userId: string): GameSession {
    const game = this.games[roomCode];
    if (!game) throw new Error('Game not found');

    return {
      ...game.gameSession,
      /// gameState: this.mapPlayerInfo(game.gameState, userId),
    };
  }

  // Handle a game action with mapped player info
  handleAction(
    roomCode: string,
    userId: string,
    request: ActionRequest
  ): {
    gameState: GameState;
    localControl: LocalControl;
  } {
    const game = this.games[roomCode];
    if (!game) throw new Error('Game not found');

    const { gameState, localControl } = game.gameSession;

    // Check if game has started (unless it's a start game action)
    if (!gameState.hasStarted && request.type !== 'start') {
      return {
        gameState: gameState, //this.mapPlayerInfo(game.gameState, userId),
        localControl: localControl,
      };
    }

    var meId = this.getPlayerIdForRoom(roomCode, userId);

    if (gameState.activeId !== meId && request.type !== 'continue' && request.type !== 'ackAnnounce') {
      console.log('Not your turn', gameState.activeId, meId);
      throw new Error('Not your turn');
    }

    console.log('doSequence', request);
    // Execute the action sequence
    const updatedServerSession = doSequence(game, request, () => this.broadcastState(roomCode));
    console.log('path', updatedServerSession.sequenceState.path);

    // Broadcast update to all players
    // This needs to broadcast individually to each player and map the player info
    this.broadcastState(roomCode);

    // Map player info before returning
    return {
      gameState: updatedServerSession.gameSession.gameState, //this.mapPlayerInfo(newState.gameState, userId),
      localControl: updatedServerSession.gameSession.localControl,
    };
  }

  broadcastState(roomCode: string) {
    const game = this.games[roomCode];
    if (!game) throw new Error('Game not found');
    this.broadcast(roomCode, {
      type: 'gameUpdate',
      roomCode,
      payload: {
        gameState: game.gameSession.gameState, //this.mapPlayerInfo(newState.gameState, userId),
        localControl: game.gameSession.localControl,
      },
    });
  }

  // Remove a game
  removeGame(roomCode: string): void {
    delete this.games[roomCode];
  }

  // Check if a game exists
  hasGame(roomCode: string): boolean {
    return !!this.games[roomCode];
  }

  getPlayerIdForRoom(roomCode: string, userId: string): string {
    const game = this.games[roomCode];
    if (!game) throw new Error('Game not found ' + roomCode);
    return Object.entries(game.gameSession.gameState.seats).find(([playerId, player]) => player.userId === userId)?.[0];
  }

  private broadcast(roomCode: string, message: WebSocketMessage) {
    broadcastToGame(roomCode, message);
  }
}

// Create singleton instance
export const gameManager = new GameManager();
