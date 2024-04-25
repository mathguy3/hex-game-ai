import { GameDefinition } from '../types/game';
import { bishop } from './units/chess/bishop';
import { king } from './units/chess/king';
import { knight } from './units/chess/knight';
import { pawn } from './units/chess/pawn';
import { queen } from './units/chess/queen';
import { rook } from './units/chess/rook';
import { swordsman } from './units/swordsman';

export const gameDefinition: GameDefinition = {
  name: 'Base',
  unit: {
    swordsman,
    pawn,
    knight,
    rook,
    bishop,
    king,
    queen,
  },
};
