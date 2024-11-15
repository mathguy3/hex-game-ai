import { bishop } from '../../configuration/units/chess/bishop';
import { moveToHex } from '../../configuration/units/chess/helpers/moveToHex';
import { king } from '../../configuration/units/chess/king';
import { knight } from '../../configuration/units/chess/knight';
import { pawn } from '../../configuration/units/chess/pawn';
import { queen } from '../../configuration/units/chess/queen';
import { rook } from '../../configuration/units/chess/rook';
import { IFStringValue } from '../../types/actions/if';
import { GameDefinition } from '../../types/game';
import { mapGen } from '../map-gen/map-gen';

const isMyTeam = {
  subject: {
    contains: {
      unit: {
        aspects: {
          team: {
            value: {
              context: { activePlayerId: IFStringValue },
            },
          },
        },
      },
    },
  },
};

const currentPlayerHasWon = {
  context: {
    players: {
      key: { context: { activePlayerId: IFStringValue } },
      value: { properties: {} },
    },
  },
};

const noMoreEnemies = {};

export const hexChess: GameDefinition = {
  players: {
    player1: {},
    player2: {},
  },
  map: mapGen().radius(6).tile('7.-4.-3').spawn('queen', '0.0.0', 'team1').spawn('queen', '1.1.-2', 'team2').result(),
  sequencing: {
    type: 'repeating',
    breakOn: currentPlayerHasWon,
    actions: [
      {
        type: 'options',
        interactions: {
          hex: {
            type: 'hex',
            kind: 'selection',
            targeting: {
              tiles: {
                add: [
                  {
                    type: 'hex',
                    tileIf: isMyTeam,
                  },
                ],
              },
            },
            actions: [],
          },
        },
      },
    ],
  },
  actions: {
    movement: {
      type: 'action',
      description: 'Swaps subject unit to target unit',
      name: 'movement',
      set: moveToHex,
    },
  },
  cards: {
    'time-1': {
      actions: {
        top: [],
        bottom: [],
      },
      requirements: [{}],
      properties: {},
    },
  },
  units: {
    pawn,
    rook,
    knight,
    bishop,
    queen,
    king,
  },
  name: 'Hex Chess',
};
