import { gloomhaven } from '../../../../data/games/gloomhaven/gloomhaven';
import { ServerSession } from '../../../../server/games/gameManager';
import { GameDefinition } from '../../../../types/game';
import { doSequence } from '../doSequence';

const jestConsole = console;

beforeEach(() => {
  global.console = require('console');
});

afterEach(() => {
  global.console = jestConsole;
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
      player1: { id: 'player1', userId: 'player1', userName: 'player1', isActive: true },
      enemy1: { id: 'enemy1', isActive: true },
    },
    activeId: 'player1',
    hasStarted: false,
    activeStep: '',
    activePath: '',
    isComplete: false,
  },
});

const makeServerSession = () => {
  return {
    roomCode: '123456',
    gameSession: makeGameState(gloomhaven),
    sequenceState: {
      path: '',
      operationType: '',
      isComplete: false,
      autoContinue: false,
      next: {
        operationType: 'start',
        sequenceItem: gloomhaven.definitions.sequence,
      },
      bag: {
        history: [],
      },
      references: gloomhaven.definitions.references,
      functions: gloomhaven.definitions.functions,
    },
    activeContexts: {},
  };
};
function cont(serverSession: ServerSession, count?: number) {
  let sanity = 0;
  let temp = serverSession;
  console.log('cont1', temp.gameSession.gameState.activeStep, temp.sequenceState.next);
  for (let i = 1; i <= (count ?? 1); i++) {
    console.log('cont', i);
    temp = doSequence(temp, { type: 'continue', playerId: temp.gameSession.gameState.activeId }, () => {}, false);
    console.log('cont', i);
    console.log('cont2', temp.gameSession.gameState.activeStep, temp.sequenceState.next);
    sanity++;
  }
  console.log('cont3', temp.gameSession.gameState.activeStep, temp.sequenceState.next);
  console.log('sanity', sanity);
  return temp;
}

describe('sequencer', () => {
  it('should run the game', () => {
    const newServerSession = makeServerSession();
    const result = doSequence(newServerSession, { type: 'start', playerId: 'player1' }, () => {});
    expect(result.gameSession.gameState.activeStep).toBe('announce');
    const result2 = doSequence(result, { type: 'ackAnnounce', playerId: 'player1' }, () => {});
    expect(result2.gameSession.gameState.activeStep).toBe('option');
    const result3 = doSequence(result2, { type: 'continue', playerId: 'player1' }, () => {});
    expect(result3.gameSession.gameState.activeStep).toBe('option');
    const result4 = doSequence(
      result3,
      {
        type: 'interact',
        playerId: 'player1',
        kind: 'selectCards',
        subjects: [
          { id: 'first', type: 'card' },
          { id: 'second', type: 'card' },
        ],
      },
      () => {},
      false
    );
    expect(result3.gameSession.gameState.activeStep).toBe('option');
    /*expect(result4.gameSession.gameState.data.player1.selectedCards.length).toBe(2);
    expect(result4.gameSession.gameState.data.player1.selectedCards[0].id).toBe('first');
    expect(result4.gameSession.gameState.activeId).toBe('enemy1');
    //console.log('result4', result4.sequenceState);
    expect(result4.gameSession.gameState.activeStep).toBe('turn');*/
  });
  it.only('should run the game step by step', () => {
    const newServerSession = makeServerSession();
    let result = doSequence(newServerSession, { type: 'start', playerId: 'player1' }, () => {}, false);
    expect(result.gameSession.gameState.activeStep).toBe('start');

    result = cont(result, 4);
    expect(result.gameSession.gameState.activeStep).toBe('announce');

    result = doSequence(result, { type: 'ackAnnounce', playerId: 'player1' }, () => {}, false);
    console.log(result.gameSession.gameState.activePath);
    expect(result.gameSession.gameState.activeStep).toBe('ackAnnounce');

    result = cont(result, 4);
    expect(result.gameSession.gameState.activeStep).toBe('option');

    result = doSequence(
      result,
      {
        type: 'interact',
        playerId: 'player1',
        kind: 'selectCards',
        subjects: [
          { id: 'first', type: 'card' },
          { id: 'second', type: 'card' },
        ],
      },
      () => {},
      false
    );
    expect(result.gameSession.gameState.activeStep).toBe('interact');
    result = doSequence(result, { type: 'continue', playerId: 'player1' }, () => {}, false);
    expect(result.gameSession.gameState.activeStep).toBe('selectCards');
    const { previousContext, references, ...rest } = result.sequenceState;
    console.log(result.gameSession.gameState.data.player1.selectedCards);

    result = cont(result, 7);
    expect(result.gameSession.gameState.activeStep).toBe('turn');
    expect(result.gameSession.gameState.activeId).toBe('enemy1');
    console.log('result', result.sequenceState.next);
    console.log('result', result.gameSession.gameState.activePath);
    result = cont(result, 1);
    console.log('result', result.gameSession.gameState.data.enemy1.selectedCards);

    result = cont(result, 10);
    expect(result.gameSession.gameState.activeStep).toBe('option');

    result = doSequence(
      result,
      {
        type: 'interact',
        playerId: 'player1',
        kind: 'playCard',
        subjects: [{ id: 'first', type: 'card', action: 'bottom' }],
      },
      () => {},
      false
    );
    expect(result.gameSession.gameState.activeStep).toBe('interact');
    result = doSequence(result, { type: 'continue', playerId: 'player1' }, () => {}, false);
    expect(result.gameSession.gameState.activeStep).toBe('playCard');
    result = doSequence(result, { type: 'continue', playerId: 'player1' }, () => {}, false);
    expect(result.gameSession.gameState.activeStep).toBe('option');
    result = doSequence(
      result,
      {
        type: 'interact',
        playerId: 'player1',
        kind: 'space',
        subjects: [
          { id: '2.1.-3', type: 'space', from: 'board', targets: [{ id: '0.1.-1', type: 'space', from: 'board' }] },
        ],
      },
      () => {},
      false
    );

    result = doSequence(result, { type: 'continue', playerId: 'player1' }, () => {}, false);
    expect(result.gameSession.gameState.activeStep).toBe('space');
    result = doSequence(result, { type: 'continue', playerId: 'player1' }, () => {}, false);
    expect(result.gameSession.gameState.activeStep).toBe('action');
    result = doSequence(result, { type: 'continue', playerId: 'player1' }, () => {}, false);
    expect(result.gameSession.gameState.activeStep).toBe('space');
    expect(result.gameSession.gameState.data.board['0.1.-1'].character?.kind).toBe('blinkblade');

    result = cont(result, 8);
    expect(result.gameSession.gameState.activeStep).toBe('option');

    result = doSequence(
      result,
      {
        type: 'interact',
        playerId: 'player1',
        kind: 'playCard',
        subjects: [{ id: 'second', type: 'card', action: 'top' }],
      },
      () => {},
      false
    );
    expect(result.gameSession.gameState.activeStep).toBe('interact');
    result = doSequence(result, { type: 'continue', playerId: 'player1' }, () => {}, false);
    expect(result.gameSession.gameState.activeStep).toBe('playCard');
    result = doSequence(result, { type: 'continue', playerId: 'player1' }, () => {}, false);
    expect(result.gameSession.gameState.activeStep).toBe('option');
    result = doSequence(
      result,
      {
        type: 'interact',
        playerId: 'player1',
        kind: 'space',
        subjects: [
          { id: '0.1.-1', type: 'space', from: 'board', targets: [{ id: '0.0.0', type: 'space', from: 'board' }] },
        ],
      },
      () => {},
      false
    );
    expect(result.gameSession.gameState.activeStep).toBe('interact');
    result = doSequence(result, { type: 'continue', playerId: 'player1' }, () => {}, false);
    expect(result.gameSession.gameState.activeStep).toBe('space');
    result = doSequence(result, { type: 'continue', playerId: 'player1' }, () => {}, false);
    expect(result.gameSession.gameState.activeStep).toBe('action');
    expect(result.gameSession.gameState.data.board['0.0.0'].character?.properties.health).toBe(0);
    console.log('result', result.gameSession.gameState.activeId);

    result = cont(result, 3);

    expect(result.gameSession.gameState.activeStep).toBe('action');
    expect(result.gameSession.gameState.data.board['0.0.0'].character).toBe(undefined);

    result = cont(result, 8);

    //console.log('result', result.sequenceState);
    console.log('result', result.sequenceState.localBag);
    console.log('result', result.gameSession.gameState.activePath);
    expect(result.gameSession.gameState.activeStep).toBe('turn');
    expect(result.gameSession.gameState.activeId).toBe('enemy1');

    //result = cont(result, 1);
    //expect(result.gameSession.gameState.activeStep).toBe('asdf');
  });
});
