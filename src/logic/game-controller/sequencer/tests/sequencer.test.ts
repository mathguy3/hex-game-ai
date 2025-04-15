import { GameDefinition } from '../../../../types/game';
import { doSequence } from '../doSequence';

const jestConsole = console;

beforeEach(() => {
  global.console = require('console');
});

afterEach(() => {
  global.console = jestConsole;
});

const defaultSequence = {
  round: {
    repeat: true,
    phases: [
      {
        action: {
          actions: [
            {
              context: {
                testValue: {
                  equals: { value: 2 },
                },
              },
            },
          ],
        },
      },
    ],
  },
};

const makeGameDefinition = (sequence: any, data?: any, references?: any) => ({
  config: {
    name: 'test',
    description: 'test',
    useHand: true,
  },
  definitions: {
    seats: {
      player1: { isOpen: true, isAi: false },
      enemy1: { isOpen: false, isAi: true },
    },
    cards: {},
    sequence: sequence,
    references: references || {},
    functions: {},
  },
  data: data || {
    player1: {},
    enemy1: {},
    testValue: 1,
  },
});

const makeGameState = (gameDefinition: GameDefinition) => ({
  roomConfig: {
    isPrivate: false,
    seats: gameDefinition.definitions.seats,
  },
  roomCode: '123456',
  gameDefinition: gameDefinition,
  gameState: {
    history: [],
    data: gameDefinition.data,
    seats: {
      player1: { id: 'player1', isActive: true },
      enemy1: { id: 'enemy1', isActive: true },
    },
    activeId: 'player1',
    hasStarted: false,
    activeStep: '',
    activePath: '',
    isComplete: false,
  },
});

const makeServerSession = (sequence: any, data?: any, references?: any) => {
  const gameDefinition = makeGameDefinition(sequence, data, references);
  return {
    roomCode: '123456',
    gameSession: makeGameState(gameDefinition),
    sequenceState: {
      path: '',
      operationType: '',
      isComplete: false,
      autoContinue: false,
      next: {
        operationType: 'start',
        sequenceItem: gameDefinition.definitions.sequence,
      },
      bag: {
        history: [],
      },
    },
    activeContexts: {},
  };
};

describe('sequencer', () => {
  it('should be able to start the game', () => {
    const sequence = { round: { repeat: true, phases: [] } };
    const newServerSession = makeServerSession(sequence);
    const result = doSequence(newServerSession, { type: 'start', playerId: 'player1' }, () => {}, false);
    expect(result.gameSession.gameState.activeStep).toBe('start');
  });

  it('should load round and update model with an action', () => {
    const sequence = {
      round: {
        repeat: true,
        phases: [
          {
            action: {
              context: {
                testValue: {
                  equals: 2,
                },
              },
            },
          },
        ],
      },
    };
    const newServerSession = makeServerSession(sequence, { testValue: 1 });
    const result = doSequence(newServerSession, { type: 'start', playerId: 'player1' }, () => {}, false);
    expect(result.gameSession.gameState.activeStep).toBe('start');
    const result2 = doSequence(newServerSession, { type: 'continue', playerId: 'player1' }, () => {}, false);
    expect(result2.gameSession.gameState.activeStep).toBe('round');
    expect(result2.gameSession.gameState.activePath).toBe('start.round');
    const result3 = doSequence(result2, { type: 'continue', playerId: 'player1' }, () => {}, false);
    expect(result3.gameSession.gameState.activeStep).toBe('action');
    expect(result3.gameSession.gameState.activePath).toBe('start.round.action');
    console.log('result3', result3.gameSession.gameState.data);
    expect(result3.gameSession.gameState.data.testValue).toBe(2);
  });

  it('should reference activePlayer with an action', () => {
    const sequence = {
      round: {
        repeat: true,
        phases: [
          {
            action: {
              activePlayer: {
                testValue: {
                  equals: 2,
                },
              },
            },
          },
        ],
      },
    };
    const newServerSession = makeServerSession(
      sequence,
      { player1: { testValue: 1 } },
      {
        activePlayer: {
          context: {
            key: 'player1',
            value: '$Object',
          },
        },
      }
    );
    const result = doSequence(newServerSession, { type: 'start', playerId: 'player1' }, () => {}, false);
    const result2 = doSequence(result, { type: 'continue', playerId: 'player1' }, () => {}, false);
    const result3 = doSequence(result2, { type: 'continue', playerId: 'player1' }, () => {}, false);
    expect(result3.gameSession.gameState.data.player1.testValue).toBe(2);
  });

  it('should load next player at the end of the round ', () => {
    const sequence = {
      round: {
        repeat: true,
        phases: [
          {
            action: {
              context: {
                testValue: {
                  equals: 2,
                },
              },
            },
          },
        ],
      },
    };
    const newServerSession = makeServerSession(sequence, { testValue: 1 });
    const result = doSequence(newServerSession, { type: 'start', playerId: 'player1' }, () => {}, false);
    const result2 = doSequence(result, { type: 'continue', playerId: 'player1' }, () => {}, false);
    const result3 = doSequence(result2, { type: 'continue', playerId: 'player1' }, () => {}, false);
    expect(result3.gameSession.gameState.activeStep).toBe('action');
  });
  it('should load round and update model with an action', () => {
    const sequence = {
      round: {
        repeat: true,
        phases: [
          {
            turn: {
              allPlayers: true,
              actions: [
                {
                  action: {
                    context: {
                      testValue: {
                        equals: 2,
                      },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    };
    const newServerSession = makeServerSession(sequence, { testValue: 1 });
    const result = doSequence(newServerSession, { type: 'start', playerId: 'player1' }, () => {}, false);
    //start
    const result2 = doSequence(result, { type: 'continue', playerId: 'player1' }, () => {}, false);
    //round
    const result3 = doSequence(result2, { type: 'continue', playerId: 'player1' }, () => {}, false);
    //turn
    const result4 = doSequence(result3, { type: 'continue', playerId: 'player1' }, () => {}, false);
    //action
    const result5 = doSequence(result4, { type: 'continue', playerId: 'player1' }, () => {}, false);
    // post-action
    expect(result5.gameSession.gameState.activeStep).toBe('turn');
    expect(result5.gameSession.gameState.activeId).toBe('player1');
    const result6 = doSequence(result5, { type: 'continue', playerId: 'player1' }, () => {}, false);
    //turn start, new active player
    expect(result6.gameSession.gameState.activeStep).toBe('turn');
    expect(result6.gameSession.gameState.activeId).toBe('enemy1');
    const result7 = doSequence(result6, { type: 'continue', playerId: 'enemy1' }, () => {}, false);
    //action
    expect(result7.gameSession.gameState.activeStep).toBe('action');
    expect(result7.gameSession.gameState.activeId).toBe('enemy1');
    const result8 = doSequence(result7, { type: 'continue', playerId: 'enemy1' }, () => {}, false);
    //post-action
    expect(result8.gameSession.gameState.activeStep).toBe('turn');
    expect(result8.gameSession.gameState.activeId).toBe('enemy1');
    const result9 = doSequence(result8, { type: 'continue', playerId: 'enemy1' }, () => {}, false);
    //turn end should return to round
    expect(result9.gameSession.gameState.activeStep).toBe('round');
    expect(result9.gameSession.gameState.activeId).toBe('player1');
  });
});
