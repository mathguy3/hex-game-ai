# Sequencer Flow Documentation

This document describes the flow of the sequencer system, focusing on the server-side implementation. The sequencer is responsible for executing game sequences step-by-step, handling player interactions, and managing the game state progression.

## Overview

The sequencer uses a recursive/iterative approach to process game sequences. The main entry point is `doSequence`, which processes operations and can recursively call itself to continue through sequences automatically or when certain conditions are met.

## Client-to-Server Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE                                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  useActionHandler.ts                                             │
│  └─> handleAction(request: ActionRequest)                      │
│      ├─> Optimistic update (client-side doSequence)              │
│      └─> client.handleAction({ roomCode, request })             │
│          │                                                       │
│          │ HTTP POST                                            │
│          ▼                                                       │
│  ClientProvider.tsx                                              │
│  └─> handler('handleAction')                                     │
│      └─> POST http://host:3006/handleAction                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ SERVER SIDE                                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  startup.ts                                                     │
│  └─> Route: /handleAction                                       │
│      └─> handleAction(params)                                   │
│          │                                                       │
│          ▼                                                       │
│  server/games/handleAction.ts                                   │
│  └─> gameManager.handleAction(roomCode, userId, request)        │
│      │                                                           │
│      ▼                                                           │
│  server/games/gameManager.ts                                    │
│  └─> handleAction()                                             │
│      └─> doSequence(game, request, broadcast)                    │
│          │                                                       │
│          ▼                                                       │
│  logic/game-controller/sequencer/doSequence.ts  ⭐ MAIN FILE    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Recursive/Iterative Flow in doSequence

The `doSequence` function implements a recursive flow pattern. Here's how it works:

```
┌─────────────────────────────────────────────────────────────────┐
│ doSequence(game, request, broadcast, allowAutoContinue)         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. VALIDATION & GUARDS                                          │
│     ├─> Check if it's player's turn                             │
│     ├─> Check if request type matches nextOperation             │
│     └─> Skip steps that require userId but seat has none       │
│         └─> RECURSIVE CALL: doSequence(continue)               │
│                                                                  │
│  2. CHECK FOR NEXT OPERATION                                     │
│     │                                                             │
│     ├─> IF nextOperation EXISTS:                                │
│     │   ├─> Evaluate 'if' condition (if present)                │
│     │   │   └─> If false: RECURSIVE CALL: doSequence(continue)  │
│     │   │                                                       │
│     │   ├─> Find sequence handler                               │
│     │   │   └─> handlers[nextOperation]                        │
│     │   │       (from sequences/index.ts)                       │
│     │   │                                                       │
│     │   └─> Call handler.startOp(game, request)                │
│     │       └─> Updates game state                              │
│     │       └─> Sets up next operation in sequenceState         │
│     │                                                           │
│     └─> ELSE (no nextOperation):                                │
│         ├─> Check if path == 'start' (game over)               │
│         └─> Call handler.continueOp(game, request)              │
│             └─> Processes current operation completion          │
│             └─> May set isComplete = true                       │
│             └─> May pop back to previousContext                 │
│                                                                  │
│  3. AUTO-CONTINUE LOGIC                                         │
│     │                                                             │
│     ├─> IF autoContinue && allowAutoContinue:                  │
│     │   ├─> IF withBroadcast: broadcast()                       │
│     │   │                                                       │
│     │   ├─> IF delayedContinue:                                │
│     │   │   └─> setTimeout(() => {                             │
│     │   │       doSequence(continue)                            │
│     │   │       broadcast()                                     │
│     │   │     }, 1000)                                         │
│     │   │                                                       │
│     │   └─> ELSE:                                              │
│     │       └─> RECURSIVE CALL: doSequence(continue)           │
│     │                                                           │
│     └─> ELSE:                                                    │
│         └─> Return game (waiting for user input)                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Key Files and Their Roles

### Main Entry Point

- **`src/logic/game-controller/sequencer/doSequence.ts`** ⭐
  - Main sequencer function
  - Handles request validation
  - Manages recursive flow
  - Coordinates sequence handlers
  - Implements auto-continue logic

### Server Entry Points

- **`src/server/startup.ts`**
  - HTTP server setup
  - Routes requests to handlers
- **`src/server/games/handleAction.ts`**
  - HTTP endpoint handler for `/handleAction`
  - Validates request
  - Calls gameManager.handleAction
- **`src/server/games/gameManager.ts`**
  - GameManager class
  - `handleAction()` method calls `doSequence()`
  - Manages game sessions
  - Broadcasts state updates

### Sequence Handlers

Located in `src/logic/game-controller/sequencer/sequences/`:

- **`sequences/index.ts`** - Exports all handlers
- **`sequencing/start.ts`** - Game start sequence
- **`sequencing/round.ts`** - Round management
- **`sequencing/turn.ts`** - Turn management
- **`actions/action.ts`** - Action execution
- **`interactions/interact.ts`** - Player interaction handling
- **`interactions/playCard.ts`** - Card play interaction
- **`interactions/selectCards.ts`** - Card selection
- **`interactions/space.ts`** - Space selection
- **`announce.ts`** - Announcements
- **`ackAnnounce.ts`** - Acknowledgment of announcements

Each handler implements:

- `startOp(game, request)` - Initializes the operation
- `continueOp(game, request)` - Continues/completes the operation (optional)

### Supporting Files

- **`sequences/indexer/nextSequenceOperation.ts`** - Determines next operation type
- **`sequences/indexer/nextIndex.ts`** - Advances to next sequence item
- **`sequences/indexer/setIndex.ts`** - Sets sequence index
- **`utils/sIf.ts`** - Conditional evaluation
- **`utils/sSet.ts`** - State updates

## Recursive Call Points

The `doSequence` function calls itself recursively in these scenarios:

1. **Skipping unplayable steps** (line 82)

   ```typescript
   if ((nextOperation == 'ackAnnounce' || nextOperation == 'interact') && !currentSeat.userId) {
     return doSequence(game, { type: 'continue', playerId: request.playerId }, broadcast, allowAutoContinue);
   }
   ```

2. **Skipping failed if conditions** (line 103)

   ```typescript
   if (!result) {
     sequenceState.next = undefined;
     return doSequence(game, { type: 'continue', playerId: request.playerId }, broadcast, allowAutoContinue);
   }
   ```

3. **Auto-continue (immediate)** (line 171)

   ```typescript
   if (game.sequenceState.autoContinue && allowAutoContinue) {
     return doSequence(game, { type: 'continue', playerId: request.playerId }, broadcast, allowAutoContinue);
   }
   ```

4. **Auto-continue (delayed)** (line 165)
   ```typescript
   if (game.sequenceState.delayedContinue) {
     setTimeout(() => {
       doSequence(game, { type: 'continue', playerId: request.playerId }, broadcast, allowAutoContinue);
       broadcast();
     }, 1000);
   }
   ```

## Sequence State Structure

The `sequenceState` object tracks:

- `path` - Current sequence path (e.g., "start.round.turn.action")
- `operationType` - Current operation type (e.g., "action", "interact", "round")
- `next` - Next operation to execute
- `isComplete` - Whether current operation is complete
- `autoContinue` - Whether to automatically continue to next step
- `delayedContinue` - Whether to delay auto-continue
- `previousContext` - Previous sequence context (for backtracking)
- `bag` - Data bag for references and functions
- `localBag` - Local data for current operation

## Request Types

- `start` - Start the game
- `continue` - Continue to next step (auto or manual)
- `interact` - Player interaction (card play, selection, etc.)
- `ackAnnounce` - Acknowledge an announcement

## Flow Example

1. Client sends `{ type: 'start', playerId: 'p1' }`
2. Server: `doSequence` receives request
3. Handler `start.startOp()` executes, sets up first round
4. `autoContinue: true` triggers recursive call with `continue`
5. `doSequence` processes round operation
6. Round sets up turn, `autoContinue` triggers another recursive call
7. Turn sets up action, continues recursively
8. Action completes, pops back to turn context
9. Process continues until `autoContinue: false` or user interaction required
10. If interaction needed, waits for `interact` request
11. After interaction, continues recursively

## Notes

- The sequencer uses a stack-like structure with `previousContext` to backtrack
- `activeContexts` tracks all active sequence contexts
- `gameState.history` logs all sequence paths executed
- Broadcasts occur when `withBroadcast` is true or after delayed continues
- The system supports both synchronous and asynchronous (delayed) continues
