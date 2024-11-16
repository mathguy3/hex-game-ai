import { ActionRequest, doSequence } from "../../components/logic/game-controller/sequencer";
import { MapState } from "../../types";
import { ActionState, GameDefinition, GameState, LocalState, OtherPlayerState, PlayerState } from "../../types/game";

export interface GameSession {
    id: string;
    gameDefinition: GameDefinition;
    gameState: GameState;
    mapState: MapState;
    maxPlayers: number;
}

export class GameManager {
    private games: Record<string, GameSession> = {};

    // Create a new game session
    createGame(params: {
        gameDefinition: GameDefinition,
        creatorId: string,
        creatorName: string
    }): GameSession {
        const gameId = crypto.randomUUID();

        const newGame: GameSession = {
            id: gameId,
            gameDefinition: params.gameDefinition,
            gameState: {
                hasStarted: false,
                activePlayerId: 'team1',
                players: Object.fromEntries(Object.entries(params.gameDefinition.players).map(([key, playerSlot], index) => (
                    [key, {
                        teamId: `team${index + 1}`,
                        type: 'player',
                        status: 'inactive'
                    }]
                ))),
                gameId,
                activeActions: {},
                actionContext: null,
                actionHistory: [],
                activeStep: 'setup'
            },
            mapState: structuredClone(params.gameDefinition.map),
            maxPlayers: 2
        };
        console.log(newGame.gameState.players);
        newGame.gameState.players.team1 = {
            playerId: params.creatorId,
            name: params.creatorName,
            teamId: 'team1',
            type: 'player',
            status: 'active'
        }

        this.games[gameId] = newGame;
        return newGame;
    }

    // Add a player to a game
    addPlayer(gameId: string, userId: string, playerName: string): PlayerState {
        const game = this.games[gameId];
        if (!game) throw new Error('Game not found');

        const filledPlayers = Object.values(game.gameState.players).filter(player => player.playerId);
        if (filledPlayers.length >= game.maxPlayers) {
            throw new Error('Game is full');
        }

        // Assign team based on join order (1 for first player, 2 for second)
        const team = filledPlayers.length + 1;

        const teamId = `team${team}`;
        game.gameState.players[teamId] = {
            playerId: userId,
            name: playerName,
            teamId,
            type: 'player',
            status: 'active'
        };

        // If this is the first player, make them active
        if (filledPlayers.length === 0) {
            game.gameState.activePlayerId = teamId;
        }

        return game.gameState.players[teamId];
    }

    // Get list of available games
    listGames(): Array<GameSession> {
        return Object.values(this.games);
    }

    // Map player info for all players from perspective of requesting user
    private mapPlayerInfo(gameState: GameState, userId: string): GameState {
        const mappedPlayers = {};

        for (const [teamId, player] of Object.entries(gameState.players)) {
            mappedPlayers[teamId] = this.getPlayerInfo(gameState.gameId, userId, player.playerId);
        }

        return {
            ...gameState,
            players: mappedPlayers
        };
    }

    // Get detailed game state with mapped player info
    getGameState(gameId: string, userId: string): GameSession {
        const game = this.games[gameId];
        if (!game) throw new Error('Game not found');

        return {
            ...game,
            gameState: this.mapPlayerInfo(game.gameState, userId)
        };
    }

    // Handle a game action with mapped player info
    handleAction(gameId: string, userId: string, localState: LocalState, request: ActionRequest): {
        gameState: GameState;
        mapState: MapState;
        localState: LocalState;
    } {
        const game = this.games[gameId];
        if (!game) throw new Error('Game not found');

        // Check if game has started (unless it's a start game action)
        if (!game.gameState.hasStarted && request.type !== 'start') {
            return {
                gameState: this.mapPlayerInfo(game.gameState, userId),
                mapState: game.mapState,
                localState,
            };
        }

        var meId = game.gameState.players[userId].teamId;
        // Verify it's the player's turn
        if (game.gameState.activePlayerId !== meId) {
            throw new Error('Not your turn');
        }

        // Build action state
        const actionState: ActionState = {
            mapState: game.mapState,
            gameState: game.gameState,
            localState: { ...localState, meId: userId, playerState: this.getPlayerInfo(gameId, userId, userId) },
            gameDefinition: game.gameDefinition,
            targetHex: null,
            selectedHex: null,
            selectedCard: null,
            activePlayer: game.gameState.players[userId],
        }

        // Execute the action sequence
        const newState = doSequence(actionState, request);

        // If this was a start action and it succeeded, mark game as started
        if (request.type === 'start' && newState.gameState.activeStep === 'play') {
            this.startGame(gameId);
        }

        game.gameState = newState.gameState;
        game.mapState = newState.mapState;

        // Map player info before returning
        return {
            gameState: this.mapPlayerInfo(game.gameState, userId),
            mapState: game.mapState,
            localState: newState.localState
        };
    }

    // Remove a game
    removeGame(gameId: string): void {
        delete this.games[gameId];
    }

    // Check if a game exists
    hasGame(gameId: string): boolean {
        return !!this.games[gameId];
    }

    // Get player info for a game
    getPlayerInfo(gameId: string, userId: string, playerId: string): PlayerState | OtherPlayerState {
        const game = this.games[gameId];
        if (!game) throw new Error('Game not found');
        return userId != playerId ? this.mapPlayerStateToOtherPlayerState(this.getPlayerByPlayerId(gameId, playerId)) : this.getPlayerByPlayerId(gameId, playerId);
    }

    getPlayerByPlayerId(gameId: string, playerId: string): PlayerState | OtherPlayerState {
        const game = this.games[gameId];
        if (!game) throw new Error('Game not found');
        return Object.values(game.gameState.players).find(player => player.playerId === playerId);
    }

    mapPlayerStateToOtherPlayerState(playerState: PlayerState): OtherPlayerState {
        if (!playerState) return null;
        return {
            playerId: playerState.playerId,
            name: playerState.name,
            teamId: playerState.teamId,
            type: playerState.type,
            cardsInHand: playerState.hand?.length,
            status: playerState.status
        }
    }

    // Remove a player from a game but preserve their state
    removePlayer(gameId: string, playerId: string): void {
        const game = this.games[gameId];
        if (!game) throw new Error('Game not found');
        const playerByPlayerId = Object.values(game.gameState.players).find(player => player.playerId === playerId);
        // Check if player is in the game
        if (!playerByPlayerId) {
            throw new Error('Player not in game');
        }

        // Remove from active players but keep their state in gameState.players
        game.gameState.players[playerByPlayerId.teamId].playerId = null;
        game.gameState.players[playerByPlayerId.teamId].name = null;

        // If no players left, consider cleaning up the game
        if (Object.keys(game.gameState.players).length === 0) {
            // Optional: Add a timeout to remove the game if no one rejoins
            setTimeout(() => {
                const currentGame = this.games[gameId];
                if (currentGame && Object.keys(currentGame.gameState.players).length === 0) {
                    this.removeGame(gameId);
                }
            }, 1000 * 60 * 30); // 30 minutes
        }
    }

    // Add a helper method to rejoin a game
    rejoinGame(gameId: string, playerId: string, playerName: string): PlayerState {
        const game = this.games[gameId];
        if (!game) throw new Error('Game not found');

        // Find the player's existing state by checking all players
        const existingPlayerState = Object.values(game.gameState.players)
            .find(player => player.playerId === playerId);

        if (!existingPlayerState) {
            throw new Error('No existing player state found');
        }

        // Re-add to active players with their original team
        game.gameState.players[existingPlayerState.teamId] = {
            playerId,
            name: playerName,
            teamId: existingPlayerState.teamId,
            type: 'player',
            status: 'active'
        };

        return game.gameState.players[existingPlayerState.teamId];
    }

    // Start a game
    startGame(gameId: string): void {
        const game = this.games[gameId];
        if (!game) throw new Error('Game not found');

        // Check if game is already started
        if (game.gameState.hasStarted) {
            throw new Error('Game already started');
        }

        // Start the game
        game.gameState = {
            ...game.gameState,
            hasStarted: true,
            activeStep: 'start',
            activePlayerId: 'team1' // First player starts
        };
    }

    // Add a helper method to check if a game has started
    isGameStarted(gameId: string): boolean {
        const game = this.games[gameId];
        if (!game) throw new Error('Game not found');
        return game.gameState.hasStarted;
    }

    leaveGame(gameId: string, userId: string): void {
        const game = this.games[gameId];
        if (!game) throw new Error('Game not found');

        // Remove player from the game
        this.removePlayer(gameId, userId);

        // If game hasn't started and no players left, remove the game
        if (!game.gameState.hasStarted && Object.keys(game.gameState.players).length === 0) {
            this.removeGame(gameId);
        }
    }
}

// Create singleton instance
export const gameManager = new GameManager();
