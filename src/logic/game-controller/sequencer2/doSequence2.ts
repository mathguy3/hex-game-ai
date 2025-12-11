import { GameSession } from '../../../server/games/gameManager';
import { ActionRequest } from '../sequencer/doSequence';
import * as sequences from './sequences/index';
import { verify } from './verify';
import { act } from './act';
import { setup } from './setup';
import { getGroupArray } from './utils/getGroupArray';

export type SequenceState = {
  path: string;
  parentState?: SequenceState;
  currentOp: keyof typeof sequences;
  currentSequence: Record<string, any> | any[];
  hasStarted?: boolean;
  next?: NextContext;
};

export type ServerSession2 = {
  roomCode: string;
  gameSession: GameSession;
  sequenceState: SequenceState;
};

export type NextContext = {
  isComplete?: boolean;
  continueUntilComplete?: boolean;
  index?: number;
};

const makeSequenceLogger = (...args1: any[]) => {
  return (...args: any[]) => {
    console.log(...args1, ...args);
  };
};
export let cons = { log: makeSequenceLogger('start') };

export function doSequence2(game: ServerSession2, request: ActionRequest): ServerSession2 {
  const isGroup = !!getGroupArray(game.sequenceState.currentSequence);
  cons.log = makeSequenceLogger(
    '|' +
      game.sequenceState.path +
      (isGroup ? game.sequenceState.next?.index ?? 0 : '') +
      (game.sequenceState.hasStarted ? '|' : '')
  );
  cons.log('gear turn', game.sequenceState.currentOp, request);
  // 1. Verify - check that the playerId is on their turn, etc.
  const verificationResult = verify(game, request);
  if (!verificationResult.valid) {
    cons.log('verificationResult', verificationResult);
    return game;
  }

  // 2. Act - do the actual operation
  const updatedGame = act(game, request);
  //console.log('updatedGame', updatedGame);

  // 3. Setup - setup the next session object for the result based on the output of Act
  return setup(updatedGame);
}
