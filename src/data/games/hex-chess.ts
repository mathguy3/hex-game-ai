import { bishop } from '../../configuration/units/chess/bishop';
import { moveToHex } from '../../configuration/units/chess/helpers/moveToHex';
import { king } from '../../configuration/units/chess/king';
import { knight } from '../../configuration/units/chess/knight';
import { pawnBlack, pawnWhite } from '../../configuration/units/chess/pawn';
import { queen } from '../../configuration/units/chess/queen';
import { rook } from '../../configuration/units/chess/rook';
import { IFStringValue } from '../../types/actions/if';
import { GameDefinition } from '../../types/game';
import { mapGen } from '../map-gen/map-gen';

const isMyTeam = {
  target: {
    contains: {
      unit: {
        properties: {
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

export const hexChess: GameDefinition = {
  name: 'Hex Chess',
  config: {
    description: 'A strategic board game',
    rotateTable: true,
  },
  players: {
    team1: {},
    team2: {},
  },
  initialState: {
    testCards: [
      {
        id: '1',
        kind: 'ace',
        properties: { value: 1 },
      },
      {
        id: '2',
        kind: 'ace',
        properties: { value: 1 },
      },
      {
        id: '3',
        kind: 'ace',
        properties: { value: 1 },
      },
      {
        id: '4',
        kind: 'ace',
        properties: { value: 1 },
      },
      {
        id: '5',
        kind: 'ace',
        properties: { value: 1 },
      },
      {
        id: '6',
        kind: 'ace',
        properties: { value: 1 },
      },
      {
        id: '7',
        kind: 'ace',
        properties: { value: 1 },
      },
      {
        id: '8',
        kind: 'ace',
        properties: { value: 1 },
      },
      {
        id: '9',
        kind: 'ace',
        properties: { value: 1 },
      },
      {
        id: '10',
        kind: 'ace',
        properties: { value: 1 },
      },
      {
        id: '11',
        kind: 'ace',
        properties: { value: 1 },
      },
      {
        id: '12',
        kind: 'ace',
        properties: { value: 1 },
      },
      {
        id: '13',
        kind: 'ace',
        properties: { value: 1 },
      },
    ],
  },
  definitions: {
    map: mapGen()
      .radius(5)
      // Team 1 (White) back row - bottom
      .spawn('rook', '3.-5.2', 'team2')
      .spawn('knight', '2.-5.3', 'team2')
      .spawn('bishop', '0.-5.5', 'team2')
      .spawn('bishop', '0.-4.4', 'team2')
      .spawn('bishop', '0.-3.3', 'team2')
      .spawn('queen', '1.-5.4', 'team2')
      .spawn('king', '-1.-4.5', 'team2')
      .spawn('knight', '-2.-3.5', 'team2')
      .spawn('rook', '-3.-2.5', 'team2')

      // Team 1 (White) pawns
      .spawn('pawnBlack', '-3.-1.4', 'team2')
      .spawn('pawnBlack', '-2.-1.3', 'team2')
      .spawn('pawnBlack', '2.-3.1', 'team2')
      .spawn('pawnBlack', '0.-1.1', 'team2')
      .spawn('pawnBlack', '1.-2.1', 'team2')
      .spawn('pawnBlack', '-1.-1.2', 'team2')
      .spawn('pawnBlack', '3.-4.1', 'team2')
      .spawn('pawnBlack', '4.-5.1', 'team2')
      .spawn('pawnBlack', '-4.-1.5', 'team2')

      // Team 2 (Black) back row - top
      .spawn('rook', '-3.5.-2', 'team1')
      .spawn('knight', '-2.5.-3', 'team1')
      .spawn('bishop', '0.4.-4', 'team1')
      .spawn('bishop', '0.5.-5', 'team1')
      .spawn('bishop', '0.3.-3', 'team1')
      .spawn('queen', '-1.5.-4', 'team1')
      .spawn('king', '1.4.-5', 'team1')
      .spawn('knight', '2.3.-5', 'team1')
      .spawn('rook', '3.2.-5', 'team1')

      // Team 2 (Black) pawns
      .spawn('pawnWhite', '-4.5.-1', 'team1')
      .spawn('pawnWhite', '-3.4.-1', 'team1')
      .spawn('pawnWhite', '-2.3.-1', 'team1')
      .spawn('pawnWhite', '-1.2.-1', 'team1')
      .spawn('pawnWhite', '0.1.-1', 'team1')
      .spawn('pawnWhite', '1.1.-2', 'team1')
      .spawn('pawnWhite', '2.1.-3', 'team1')
      .spawn('pawnWhite', '3.1.-4', 'team1')
      .spawn('pawnWhite', '4.1.-5', 'team1')

      .result(),
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
            card: {
              type: 'card',
              kind: 'play',
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
      ace: {
        actions: {
          top: [],
          bottom: [],
        },
        requirements: [{}],
        properties: {},
      },
    },
    units: {
      pawnWhite,
      pawnBlack,
      rook,
      knight,
      bishop,
      queen,
      king,
    },
  },
  ui: {
    type: 'Zone',
    id: 'hex-chess-ui',
    children: [
      {
        id: 'testCards',
        type: 'CardStack',
        disabled: {
          not: {
            context: {
              hasStarted: '$Boolean',
            },
          },
        },
        styles: {
          position: 'absolute',
          bottom: 0,
          left: 0,
        },
        content: {
          context: {
            cardStacks: {
              testCards: '$Array',
            },
          },
        },
      },
      {
        id: 'otherCards',
        type: 'CardStack',
        styles: {
          position: 'absolute',
          bottom: 0,
          left: 400,
          width: '150px',
          height: '190px',
          backgroundColor: '#ccc',
        },
        disabled: {
          not: {
            context: {
              hasStarted: '$Boolean',
            },
          },
        },
        content: {
          context: {
            cardStacks: {
              otherCards: '$Array',
            },
          },
        },
      },
      {
        id: 'move-button',
        type: 'Button',
        styles: {
          position: 'absolute',
          bottom: 10,
          left: -600,
          color: {
            context: {
              if: {
                hasStarted: '$Boolean',
              },
              then: 'secondary',
              else: 'primary',
            },
          },
        },
        properties: {
          disabled: {
            not: {
              context: {
                hasStarted: '$Boolean',
              },
            },
          },
        },
        content: 'Move',
      },
    ],
  },
};
