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
  it('should be able to take an action per item', () => {
    const sequence = {
      round: {
        repeat: true,
        phases: [
          {
            foreach: {
              items: {
                context: {
                  testValues: '$Array',
                },
              },
              actions: [
                {
                  action: {
                    context: {
                      testValue: {
                        equals: {
                          context: {
                            testValue: {
                              plus: {
                                sequenceItem: {
                                  value: '$Number',
                                },
                              },
                            },
                          },
                        },
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
    const newServerSession = makeServerSession(sequence, {
      testValues: [{ value: 1 }, { value: 2 }, { value: 3 }],
      testValue: 1,
    });
    const result = doSequence(newServerSession, { type: 'start', playerId: 'player1' }, () => {}, false);
    // start
    const result2 = doSequence(result, { type: 'continue', playerId: 'player1' }, () => {}, false);
    // round
    const result3 = doSequence(result2, { type: 'continue', playerId: 'player1' }, () => {}, false);
    // foreach
    const result4 = doSequence(result3, { type: 'continue', playerId: 'player1' }, () => {}, false);
    // action
    expect(result4.gameSession.gameState.data.testValue).toBe(2);
    const result5 = doSequence(result4, { type: 'continue', playerId: 'player1' }, () => {}, false);
    // post-action (foreach)
    expect(result5.gameSession.gameState.activeStep).toBe('foreach');
    const result6 = doSequence(result5, { type: 'continue', playerId: 'player1' }, () => {}, false);
    // foreach revisit
    expect(result6.gameSession.gameState.activeStep).toBe('foreach');
    const result7 = doSequence(result6, { type: 'continue', playerId: 'player1' }, () => {}, false);
    // action
    expect(result7.gameSession.gameState.activeStep).toBe('action');
    expect(result7.gameSession.gameState.data.testValue).toBe(4);
    const result8 = doSequence(result7, { type: 'continue', playerId: 'player1' }, () => {}, false);
    // post-action (foreach)
    expect(result8.gameSession.gameState.activeStep).toBe('foreach');
    console.log('result8', result8.gameSession.gameState.data);
    const result9 = doSequence(result8, { type: 'continue', playerId: 'player1' }, () => {}, false);
    // foreach revisit
    expect(result9.gameSession.gameState.activeStep).toBe('foreach');
    console.log('result9', result9.gameSession.gameState.data);
    const result10 = doSequence(result9, { type: 'continue', playerId: 'player1' }, () => {}, false);
    // action
    expect(result10.gameSession.gameState.activeStep).toBe('action');
    expect(result10.gameSession.gameState.data.testValue).toBe(7);
  });
});
