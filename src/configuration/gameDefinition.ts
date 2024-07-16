import { GameDefinition } from '../types/game';
import { bishop } from './units/chess/bishop';
import { king } from './units/chess/king';
import { knight } from './units/chess/knight';
import { pawn } from './units/chess/pawn';
import { queen } from './units/chess/queen';
import { rook } from './units/chess/rook';
import { swordsman } from './units/swordsman';

const team1HasMoved = {
  context: {
    player: {
      team1: {
        properties: {
          hasMoved: {
            value: true,
          },
        },
      },
    },
  },
};

const team2HasMoved = {
  context: {
    player: {
      team2: {
        properties: {
          hasMoved: {
            value: true,
          },
        },
      },
    },
  },
};

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
  player: {
    team1: {
      postInteraction: [
        {
          set: [team1HasMoved],
        },
      ],
    },
    team2: {
      postInteraction: [
        {
          set: [team2HasMoved],
        },
      ],
    },
  },
};
