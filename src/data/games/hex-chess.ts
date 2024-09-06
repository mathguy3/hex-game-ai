import { bishop } from '../../configuration/units/chess/bishop';
import { king } from '../../configuration/units/chess/king';
import { knight } from '../../configuration/units/chess/knight';
import { onMove } from '../../configuration/units/chess/onMove';
import { pawn } from '../../configuration/units/chess/pawn';
import { queen } from '../../configuration/units/chess/queen';
import { rook } from '../../configuration/units/chess/rook';
import { GameDefinition } from '../../types/game';
import { mapGen } from '../map-gen/map-gen';

export const hexChess: GameDefinition = {
  units: {
    pawn,
    rook,
    knight,
    bishop,
    queen,
    king,
  },
  game: {
    map: mapGen().radius(6).tile('7.-4.-3').spawn('queen', '0.0.0', 'team1').spawn('queen', '1.1.-2', 'team2').result(),
    events: {
      movement: {
        type: 'movement',
        actions: {
          set: onMove,
        },
      },
      attack: {
        type: 'attack',
        actions: {
          set: onMove,
        },
      },
    },
  },
  name: 'Hex Chess',
};
