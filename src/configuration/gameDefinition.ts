import { GameDefinition } from '../types/game';
import { pawn } from './units/chess/pawn';
import { swordsman } from './units/swordsman';

export const gameDefinition: GameDefinition = {
  name: 'Base',
  unit: {
    swordsman,
    pawn,
  },
};
