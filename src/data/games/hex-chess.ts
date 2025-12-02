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
              context: { activeId: IFStringValue },
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
      key: { context: { activeId: IFStringValue } },
      value: { properties: {} },
    },
  },
};

export const hexChess: GameDefinition = {
  config: {
    name: 'Hex Chess',
    description: 'A strategic board game',
    rotateTable: true,
  },
  data: {
    player1: {},
    player2: {},
    board: mapGen()
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
    unit: {
      pawnWhite,
      pawnBlack,
      rook,
      knight,
      bishop,
      queen,
      king,
    },
  },
  definitions: {
    sequence: {
      round: {
        repeat: true,
        phases: [
          {
            turn: {
              name: 'Your Turn',
              allPlayers: true,
              rotate: true,
              actions: [
                {
                  option: {
                    options: [
                      {
                        space: {
                          query: {
                            type: 'space',
                            from: ['board'],
                            filter: ['%isMyTeam'],
                          },
                          defined: {
                            context: {
                              unit: {
                                key: {
                                  subjectSpace: {
                                    unit: {
                                      kind: '$String',
                                    },
                                  },
                                },
                                value: {
                                  action: '$Action',
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
          },
        ],
      },
    },
    cards: {},
    references: {},
    functions: {},
    seats: {
      player1: { isOpen: true, isAi: false },
      player2: { isOpen: true, isAi: false },
    },
  },
  ui: {
    shared: {
      zone: {
        id: 'primary',
        styles: {
          width: 1500,
          height: 1000,
          border: '1px solid #777',
          borderRadius: 10,
        },
        children: [
          {
            hexMap: {
              id: 'board',
              styles: {
                position: 'absolute',
                left: 500,
                top: 500,
              },
              hex: {
                slots: {
                  unit: {
                    token: {
                      type: 'unit',
                      styles: {
                        width: 60,
                        height: 75,
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
    player: {
      zone: {
        id: 'playerZone',
        styles: {
          position: 'absolute',
          left: 500,
          top: 1050,
        },
      },
    },
  },
};
