import { doSequence2, ServerSession2 } from './doSequence2';
import { ActionRequest, InteractActionRequest } from '../sequencer/doSequence';
import { GameSession } from '../../../server/games/gameManager';
import { GameDefinition, GameState } from '../../../types/game';

const makeGameDefinition = (sequence: any, data?: any) => ({
  config: {
    name: 'test',
    description: 'test',
    useHand: true,
  },
  definitions: {
    seats: {
      player1: { isOpen: true, isAi: false },
    },
    cards: {
      card1: {},
    },
    sequence: sequence,
    references: {},
    functions: {
      activeTeam: { context: { activePlayer: { team: '$String' } } },
      isMySpace: {
        space: {
          unit: {
            team: { equals: { use: 'activeTeam' } },
          },
        },
      },
      myPieces: {
        query: {
          type: 'space',
          from: [{ context: { board: '$Array' } }],
          filter: [{ use: 'isMySpace' }],
        },
      },
    },
  },
  data: data || {
    player1: {
      hand: [
        {
          id: 'card1',
          kind: 'card1',
        },
      ],
    },
    testValue: 1,
    testValue2: 3,
  },
});

const makeGameState = (gameDefinition: GameDefinition): GameSession => ({
  roomConfig: {
    isPrivate: false,
    seats: gameDefinition.definitions.seats,
  },
  roomCode: 'TEST01',
  gameDefinition: gameDefinition,
  gameState: {
    history: [],
    data: gameDefinition.data || {},
    seats: {
      player1: { id: 'player1', isActive: true },
    },
    activeId: 'player1',
    hasStarted: false,
    activeStep: '',
    activePath: '',
    isComplete: false,
  },
});

const makeServerSession2 = (sequence: any, data?: any): ServerSession2 => {
  const gameDefinition = makeGameDefinition(sequence, data);
  return {
    roomCode: 'TEST01',
    gameSession: makeGameState(gameDefinition),
    sequenceState: {
      path: 'start',
      currentOp: 'start',
      currentSequence: sequence,
    },
  };
};

const captureConsoleLog = () => {
  const logs: string[] = [];
  const originalLog = console.log;

  console.log = (...args: any[]) => {
    const formatted = args
      .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)))
      .join(' ');
    logs.push(formatted);
    originalLog(...args);
  };

  return {
    getLogs: () => logs.join('\n'),
    getLogsArray: () => logs,
    restore: () => {
      console.log = originalLog;
    },
  };
};

describe('sequencer2', () => {
  let logCapture: ReturnType<typeof captureConsoleLog>;

  beforeEach(() => {
    logCapture = captureConsoleLog();
  });

  afterEach(() => {
    const logOutput = logCapture.getLogs();
    console.log('--- Test completed (pass or fail) ---');
    console.log('Captured logs:', logOutput);
    logCapture.restore();
  });

  it('should walk through the sequence', () => {
    const sequence = {
      round: {
        turn: {
          actions: [
            {
              set: {
                context: {
                  testValue: {
                    equals: 2,
                  },
                },
              },
            },
            {
              actionGroup: [
                {
                  context: {
                    testValue: {
                      equals: 3,
                    },
                  },
                },
                {
                  context: {
                    testValue2: {
                      equals: 1,
                    },
                  },
                },
              ],
            },
            {
              interaction: {
                play: {
                  card: {
                    from: [{ context: { board: '$Array' } }],
                    filter: [
                      {
                        item: {
                          unit: {
                            team: { equals: { use: 'activeTeam' } },
                          },
                        },
                      },
                    ],
                    action: {
                      use: {
                        subjectSpace: {
                          unit: {
                            action: '$Action',
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
    };

    const game = makeServerSession2(sequence);
    expect(game.sequenceState.currentOp).toBe('start');
    expect(Object.keys(game.sequenceState.currentSequence)).toEqual(['round']);

    const request: ActionRequest = {
      type: 'start',
      playerId: 'player1',
    };

    const continueRequest: ActionRequest = {
      type: 'continue',
      playerId: 'player1',
    };

    console.log('--1--');
    // start
    const result = doSequence2(game, request);

    //console.log(result.sequenceState);
    expect(result.sequenceState.currentOp).toBe('round');
    expect(result.sequenceState.parentState).toBeDefined();
    if (result.sequenceState.parentState) {
      expect(result.sequenceState.parentState.currentOp).toBe('start');
    }

    console.log('--2--');
    // round
    const result2 = doSequence2(result, continueRequest);
    //console.log(result2.sequenceState);

    console.log('--3--');
    // turn
    const result3 = doSequence2(result2, continueRequest);
    //console.log(result3.sequenceState);

    console.log('--4--');
    // action 1: set
    const result4 = doSequence2(result3, continueRequest);
    //console.log('--4--test sequence state', result4.sequenceState);

    expect(result4.gameSession.gameState.data.testValue).toBe(2);
    expect(result4.gameSession.gameState.data.testValue2).toBe(3);

    console.log('--5--');
    // pop set
    const result5 = doSequence2(result4, continueRequest);
    console.log(result5.sequenceState);

    console.log('--6--');
    // repeat turn
    const result6 = doSequence2(result5, continueRequest);
    //console.log(result6.sequenceState);

    // action 2: actionGroup
    const result7 = doSequence2(result6, continueRequest);
    //console.log(result7.sequenceState);

    expect(result7.gameSession.gameState.data.testValue).toBe(3);
    expect(result7.gameSession.gameState.data.testValue2).toBe(1);

    console.log('--7--');
    // action 3: interaction
    const result8 = doSequence2(result7, continueRequest);
    expect(result8.sequenceState.currentOp).toBe('interaction');
    console.log(result8.sequenceState);

    console.log('--8--');
    // interaction
    const result9 = doSequence2(result8, continueRequest);
    console.log(result9.sequenceState.currentSequence);
    expect(result9.sequenceState.currentOp).toBe('interaction');

    console.log('--9--');
    const interactRequest: InteractActionRequest = {
      type: 'interact',
      playerId: 'player1',
      kind: 'move',
      subjects: [
        {
          from: { board: { hex1: 'unit' } },
          type: 'token',
          targets: [
            {
              from: { board: { hex2: 'unit' } },
              type: 'space',
            },
          ],
        },
      ],
    };
    // interaction
    const result10 = doSequence2(result9, interactRequest);
    console.log(result10.sequenceState.currentSequence);
    expect(result10.sequenceState.currentOp).toBe('interaction');
  });
});
