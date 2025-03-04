import { procedures } from './procedures';
import { basic } from './cards';
import BlinkBlade from '../../../images/backgrounds/blinkblade-board.png';
import { attackCard } from './cards/attack/attackCard';

const basicModifiers = [
  attackCard('attackMinusTwo', -2),
  attackCard('attackMinusOne', -1),
  attackCard('attackMinusOne', -1),
  attackCard('attackMinusOne', -1),
  attackCard('attackMinusOne', -1),
  attackCard('attackMinusOne', -1),
  attackCard('attackPlusOne', 1),
  attackCard('attackPlusOne', 1),
  attackCard('attackPlusOne', 1),
  attackCard('attackPlusOne', 1),
  attackCard('attackPlusOne', 1),
  attackCard('attackPlusTwo', 2),
  attackCard('attackZero', 0),
  attackCard('attackZero', 0),
  attackCard('attackZero', 0),
  attackCard('attackZero', 0),
  attackCard('attackZero', 0),
  attackCard('attackZero', 0),
  attackCard('attackTimesTwo', 0, 2),
  attackCard('attackMiss', 0, 0),
];

export const gloomhaven = {
  config: {
    name: 'Gloomhaven',
    description: 'A strategic board game',
    useHand: true,
  },
  definitions: {
    seats: {
      player1: { isOpen: true, isAi: false },
      player2: { isOpen: true, isAi: false },
      player3: { isOpen: true, isAi: false },
      player4: { isOpen: false, isAi: false },
      enemy1: { isConfigurable: false, isOpen: false, isAi: true },
      enemy2: { isConfigurable: false, isOpen: false, isAi: true },
    },
    procedures,
    cards: {
      basic,
      attackMinusTwo: attackCard('attackMinusTwo', -2),
      attackMinusOne: attackCard('attackMinusOne', -1),
      attackPlusOne: attackCard('attackPlusOne', 1),
      attackPlusTwo: attackCard('attackPlusTwo', 2),
      attackZero: attackCard('attackZero', 0),
      attackTimesTwo: attackCard('attackTimesTwo', 0, 2),
      attackMiss: attackCard('attackMiss', 0, 0),
    },
    sequence: {
      round: {
        repeat: true,
        breakIf: {
          spaces: {
            filter: {
              properties: {
                isEnemy: {
                  equals: true,
                },
              },
            },
            then: {
              length: {
                equals: 0,
              },
            },
          },
        },
        phases: [
          {
            announce: {
              to: 'all',
              message: 'Round Start',
              if: {
                context: {
                  activeId: {
                    equals: 'player2',
                  },
                },
              },
            },
          },
          {
            turn: {
              name: 'Select Card',
              allPlayers: true,
              async: true,
              actions: [
                {
                  announce: {
                    to: 'active',
                    message: 'Select 2 cards',
                  },
                },
                {
                  option: {
                    options: [
                      {
                        card: {
                          select: {
                            count: 2,
                            from: 'hand',
                          },
                        },
                      },
                    ],
                  },
                },
                {
                  action: {
                    actions: [
                      {
                        context: {
                          data: {
                            key: {
                              context: {
                                activeId: '$String',
                              },
                            },
                            value: {
                              properties: {
                                initiative: {
                                  equals: {
                                    context: {
                                      data: {
                                        key: {
                                          context: {
                                            activeId: '$String',
                                          },
                                        },
                                        value: {
                                          selectedCards: {
                                            min: {
                                              properties: {
                                                initiative: '$Number',
                                              },
                                            },
                                          },
                                        },
                                      },
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
              ],
            },
          },
          {
            turn: {
              name: 'Play Card',
              allPlayers: true,
              rotate: true,
              order: {
                properties: {
                  initiative: '$Number',
                },
              },
              actions: [
                {
                  option: {
                    options: [
                      {
                        card: {
                          play: {
                            from: 'selectedCards',
                            remove: true,
                          },
                        },
                      },
                    ],
                  },
                },
                {
                  option: {
                    options: [
                      {
                        card: {
                          play: {
                            from: 'selectedCards',
                            remove: true,
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
    winCondition: {
      spaces: {
        filter: {
          properties: {
            isEnemy: {
              equals: true,
            },
          },
        },
        then: {
          length: {
            equals: 0,
          },
        },
      },
    },
  },
  data: {
    board: {
      // Center
      '0.0.0': {
        id: '0.0.0',
        coordinates: { q: 0, r: 0, s: 0 },
        slot: { type: 'token', kind: 'enemy', properties: { isEnemy: true, health: 2 } },
      },

      // Ring 1
      '0.1.-1': {
        id: '0.1.-1',
        coordinates: { q: 0, r: 1, s: -1 },
      },
      '1.0.-1': {
        id: '1.0.-1',
        coordinates: { q: 1, r: 0, s: -1 },
      },
      '1.-1.0': {
        id: '1.-1.0',
        coordinates: { q: 1, r: -1, s: 0 },
      },
      '0.-1.1': {
        id: '0.-1.1',
        coordinates: { q: 0, r: -1, s: 1 },
      },
      '-1.0.1': {
        id: '-1.0.1',
        coordinates: { q: -1, r: 0, s: 1 },
      },
      '-1.1.0': {
        id: '-1.1.0',
        coordinates: { q: -1, r: 1, s: 0 },
      },

      // Ring 2
      '0.2.-2': {
        id: '0.2.-2',
        coordinates: { q: 0, r: 2, s: -2 },
      },
      '1.1.-2': {
        id: '1.1.-2',
        coordinates: { q: 1, r: 1, s: -2 },
      },
      '2.0.-2': {
        id: '2.0.-2',
        coordinates: { q: 2, r: 0, s: -2 },
      },
      '2.-1.-1': {
        id: '2.-1.-1',
        coordinates: { q: 2, r: -1, s: -1 },
      },
      '2.-2.0': {
        id: '2.-2.0',
        coordinates: { q: 2, r: -2, s: 0 },
      },
      '1.-2.1': {
        id: '1.-2.1',
        coordinates: { q: 1, r: -2, s: 1 },
      },
      '0.-2.2': {
        id: '0.-2.2',
        coordinates: { q: 0, r: -2, s: 2 },
      },
      '-1.-1.2': {
        id: '-1.-1.2',
        coordinates: { q: -1, r: -1, s: 2 },
      },
      '-2.0.2': {
        id: '-2.0.2',
        coordinates: { q: -2, r: 0, s: 2 },
      },
      '-2.1.1': {
        id: '-2.1.1',
        coordinates: { q: -2, r: 1, s: 1 },
      },
      '-2.2.0': {
        id: '-2.2.0',
        coordinates: { q: -2, r: 2, s: 0 },
      },
      '-1.2.-1': {
        id: '-1.2.-1',
        coordinates: { q: -1, r: 2, s: -1 },
      },

      // Ring 3
      '0.3.-3': {
        id: '0.3.-3',
        coordinates: { q: 0, r: 3, s: -3 },
        slot: { type: 'token', kind: 'blinkblade', properties: { playerId: 'player2', health: 10 } },
      },
      '1.2.-3': {
        id: '1.2.-3',
        coordinates: { q: 1, r: 2, s: -3 },
        slot: { type: 'token', kind: 'blinkblade', properties: { playerId: 'player1', health: 10 } },
      },
      '2.1.-3': {
        id: '2.1.-3',
        coordinates: { q: 2, r: 1, s: -3 },
        slot: { type: 'token', kind: 'blinkblade', properties: { playerId: 'player3', health: 10 } },
      },
      '3.0.-3': {
        id: '3.0.-3',
        coordinates: { q: 3, r: 0, s: -3 },
      },
      '3.-1.-2': {
        id: '3.-1.-2',
        coordinates: { q: 3, r: -1, s: -2 },
      },
      '3.-2.-1': {
        id: '3.-2.-1',
        coordinates: { q: 3, r: -2, s: -1 },
      },
      '3.-3.0': {
        id: '3.-3.0',
        coordinates: { q: 3, r: -3, s: 0 },
      },
      '2.-3.1': {
        id: '2.-3.1',
        coordinates: { q: 2, r: -3, s: 1 },
      },
      '1.-3.2': {
        id: '1.-3.2',
        coordinates: { q: 1, r: -3, s: 2 },
      },
      '0.-3.3': {
        id: '0.-3.3',
        coordinates: { q: 0, r: -3, s: 3 },
      },
      '-1.-2.3': {
        id: '-1.-2.3',
        coordinates: { q: -1, r: -2, s: 3 },
      },
      '-2.-1.3': {
        id: '-2.-1.3',
        coordinates: { q: -2, r: -1, s: 3 },
      },
      '-3.0.3': {
        id: '-3.0.3',
        coordinates: { q: -3, r: 0, s: 3 },
      },
      '-3.1.2': {
        id: '-3.1.2',
        coordinates: { q: -3, r: 1, s: 2 },
      },
      '-3.2.1': {
        id: '-3.2.1',
        coordinates: { q: -3, r: 2, s: 1 },
      },
      '-3.3.0': {
        id: '-3.3.0',
        coordinates: { q: -3, r: 3, s: 0 },
      },
      '-2.3.-1': {
        id: '-2.3.-1',
        coordinates: { q: -2, r: 3, s: -1 },
      },
      '-1.3.-2': {
        id: '-1.3.-2',
        coordinates: { q: -1, r: 3, s: -2 },
      },

      // Ring 4
      '0.4.-4': {
        id: '0.4.-4',
        coordinates: { q: 0, r: 4, s: -4 },
      },
      '1.3.-4': {
        id: '1.3.-4',
        coordinates: { q: 1, r: 3, s: -4 },
      },
      '2.2.-4': {
        id: '2.2.-4',
        coordinates: { q: 2, r: 2, s: -4 },
      },
      '3.1.-4': {
        id: '3.1.-4',
        coordinates: { q: 3, r: 1, s: -4 },
      },
      '4.0.-4': {
        id: '4.0.-4',
        coordinates: { q: 4, r: 0, s: -4 },
      },
      '4.-1.-3': {
        id: '4.-1.-3',
        coordinates: { q: 4, r: -1, s: -3 },
      },
      '4.-2.-2': {
        id: '4.-2.-2',
        coordinates: { q: 4, r: -2, s: -2 },
      },
      '4.-3.-1': {
        id: '4.-3.-1',
        coordinates: { q: 4, r: -3, s: -1 },
      },
      '4.-4.0': {
        id: '4.-4.0',
        coordinates: { q: 4, r: -4, s: 0 },
      },
      '3.-4.1': {
        id: '3.-4.1',
        coordinates: { q: 3, r: -4, s: 1 },
      },
      '2.-4.2': {
        id: '2.-4.2',
        coordinates: { q: 2, r: -4, s: 2 },
      },
      '1.-4.3': {
        id: '1.-4.3',
        coordinates: { q: 1, r: -4, s: 3 },
      },
      '0.-4.4': {
        id: '0.-4.4',
        coordinates: { q: 0, r: -4, s: 4 },
      },
      '-1.-3.4': {
        id: '-1.-3.4',
        coordinates: { q: -1, r: -3, s: 4 },
      },
      '-2.-2.4': {
        id: '-2.-2.4',
        coordinates: { q: -2, r: -2, s: 4 },
      },
      '-3.-1.4': {
        id: '-3.-1.4',
        coordinates: { q: -3, r: -1, s: 4 },
      },
      '-4.0.4': {
        id: '-4.0.4',
        coordinates: { q: -4, r: 0, s: 4 },
      },
      '-4.1.3': {
        id: '-4.1.3',
        coordinates: { q: -4, r: 1, s: 3 },
      },
      '-4.2.2': {
        id: '-4.2.2',
        coordinates: { q: -4, r: 2, s: 2 },
      },
      '-4.3.1': {
        id: '-4.3.1',
        coordinates: { q: -4, r: 3, s: 1 },
      },
      '-4.4.0': {
        id: '-4.4.0',
        coordinates: { q: -4, r: 4, s: 0 },
      },
      '-3.4.-1': {
        id: '-3.4.-1',
        coordinates: { q: -3, r: 4, s: -1 },
      },
      '-2.4.-2': {
        id: '-2.4.-2',
        coordinates: { q: -2, r: 4, s: -2 },
      },
      '-1.4.-3': {
        id: '-1.4.-3',
        coordinates: { q: -1, r: 4, s: -3 },
      },
    },
    player1: {
      name: 'Blinkblade1',
      hand: [
        { id: 'first', ...basic, properties: { initiative: 1 } },
        { id: 'second', ...basic, properties: { initiative: 2 } },
        { id: 'third', ...basic, properties: { initiative: 3 } },
        { id: 'fourth', ...basic, properties: { initiative: 4 } },
        { id: 'fifth', ...basic, properties: { initiative: 5 } },
        { id: 'sixth', ...basic, properties: { initiative: 6 } },
      ],
      modifierDiscard: [],
      modifiers: [...basicModifiers],
      properties: {
        initiative: 0,
      },
    },
    player2: {
      name: 'Blinkblade2',
      hand: [
        { id: 'first', ...basic, properties: { initiative: 1 } },
        { id: 'second', ...basic, properties: { initiative: 2 } },
        { id: 'third', ...basic, properties: { initiative: 3 } },
        { id: 'fourth', ...basic, properties: { initiative: 4 } },
        { id: 'fifth', ...basic, properties: { initiative: 5 } },
        { id: 'sixth', ...basic, properties: { initiative: 6 } },
      ],
      modifierDiscard: [],
      modifiers: [...basicModifiers],
      properties: {
        initiative: 0,
      },
    },
    player3: {
      name: 'Blinkblade3',
      hand: [
        { id: 'first', ...basic, properties: { initiative: 1 } },
        { id: 'second', ...basic, properties: { initiative: 2 } },
        { id: 'third', ...basic, properties: { initiative: 3 } },
        { id: 'fourth', ...basic, properties: { initiative: 4 } },
        { id: 'fifth', ...basic, properties: { initiative: 5 } },
        { id: 'sixth', ...basic, properties: { initiative: 6 } },
      ],
      modifierDiscard: [],
      modifiers: [...basicModifiers],
      properties: {
        initiative: 0,
      },
    },
    enemy1: { health: 10 },
    enemy2: { health: 10 },
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
              spaces: {
                // Center
                '0.0.0': {
                  id: '0.0.0',
                  coordinates: { q: 0, r: 0, s: 0 },
                },

                // Ring 1
                '0.1.-1': {
                  id: '0.1.-1',
                  coordinates: { q: 0, r: 1, s: -1 },
                },
                '1.0.-1': {
                  id: '1.0.-1',
                  coordinates: { q: 1, r: 0, s: -1 },
                },
                '1.-1.0': {
                  id: '1.-1.0',
                  coordinates: { q: 1, r: -1, s: 0 },
                },
                '0.-1.1': {
                  id: '0.-1.1',
                  coordinates: { q: 0, r: -1, s: 1 },
                },
                '-1.0.1': {
                  id: '-1.0.1',
                  coordinates: { q: -1, r: 0, s: 1 },
                },
                '-1.1.0': {
                  id: '-1.1.0',
                  coordinates: { q: -1, r: 1, s: 0 },
                },

                // Ring 2
                '0.2.-2': {
                  id: '0.2.-2',
                  coordinates: { q: 0, r: 2, s: -2 },
                },
                '1.1.-2': {
                  id: '1.1.-2',
                  coordinates: { q: 1, r: 1, s: -2 },
                },
                '2.0.-2': {
                  id: '2.0.-2',
                  coordinates: { q: 2, r: 0, s: -2 },
                },
                '2.-1.-1': {
                  id: '2.-1.-1',
                  coordinates: { q: 2, r: -1, s: -1 },
                },
                '2.-2.0': {
                  id: '2.-2.0',
                  coordinates: { q: 2, r: -2, s: 0 },
                },
                '1.-2.1': {
                  id: '1.-2.1',
                  coordinates: { q: 1, r: -2, s: 1 },
                },
                '0.-2.2': {
                  id: '0.-2.2',
                  coordinates: { q: 0, r: -2, s: 2 },
                },
                '-1.-1.2': {
                  id: '-1.-1.2',
                  coordinates: { q: -1, r: -1, s: 2 },
                },
                '-2.0.2': {
                  id: '-2.0.2',
                  coordinates: { q: -2, r: 0, s: 2 },
                },
                '-2.1.1': {
                  id: '-2.1.1',
                  coordinates: { q: -2, r: 1, s: 1 },
                },
                '-2.2.0': {
                  id: '-2.2.0',
                  coordinates: { q: -2, r: 2, s: 0 },
                },
                '-1.2.-1': {
                  id: '-1.2.-1',
                  coordinates: { q: -1, r: 2, s: -1 },
                },

                // Ring 3
                '0.3.-3': {
                  id: '0.3.-3',
                  coordinates: { q: 0, r: 3, s: -3 },
                },
                '1.2.-3': {
                  id: '1.2.-3',
                  coordinates: { q: 1, r: 2, s: -3 },
                },
                '2.1.-3': {
                  id: '2.1.-3',
                  coordinates: { q: 2, r: 1, s: -3 },
                },
                '3.0.-3': {
                  id: '3.0.-3',
                  coordinates: { q: 3, r: 0, s: -3 },
                },
                '3.-1.-2': {
                  id: '3.-1.-2',
                  coordinates: { q: 3, r: -1, s: -2 },
                },
                '3.-2.-1': {
                  id: '3.-2.-1',
                  coordinates: { q: 3, r: -2, s: -1 },
                },
                '3.-3.0': {
                  id: '3.-3.0',
                  coordinates: { q: 3, r: -3, s: 0 },
                },
                '2.-3.1': {
                  id: '2.-3.1',
                  coordinates: { q: 2, r: -3, s: 1 },
                },
                '1.-3.2': {
                  id: '1.-3.2',
                  coordinates: { q: 1, r: -3, s: 2 },
                },
                '0.-3.3': {
                  id: '0.-3.3',
                  coordinates: { q: 0, r: -3, s: 3 },
                },
                '-1.-2.3': {
                  id: '-1.-2.3',
                  coordinates: { q: -1, r: -2, s: 3 },
                },
                '-2.-1.3': {
                  id: '-2.-1.3',
                  coordinates: { q: -2, r: -1, s: 3 },
                },
                '-3.0.3': {
                  id: '-3.0.3',
                  coordinates: { q: -3, r: 0, s: 3 },
                },
                '-3.1.2': {
                  id: '-3.1.2',
                  coordinates: { q: -3, r: 1, s: 2 },
                },
                '-3.2.1': {
                  id: '-3.2.1',
                  coordinates: { q: -3, r: 2, s: 1 },
                },
                '-3.3.0': {
                  id: '-3.3.0',
                  coordinates: { q: -3, r: 3, s: 0 },
                },
                '-2.3.-1': {
                  id: '-2.3.-1',
                  coordinates: { q: -2, r: 3, s: -1 },
                },
                '-1.3.-2': {
                  id: '-1.3.-2',
                  coordinates: { q: -1, r: 3, s: -2 },
                },

                // Ring 4
                '0.4.-4': {
                  id: '0.4.-4',
                  coordinates: { q: 0, r: 4, s: -4 },
                },
                '1.3.-4': {
                  id: '1.3.-4',
                  coordinates: { q: 1, r: 3, s: -4 },
                },
                '2.2.-4': {
                  id: '2.2.-4',
                  coordinates: { q: 2, r: 2, s: -4 },
                },
                '3.1.-4': {
                  id: '3.1.-4',
                  coordinates: { q: 3, r: 1, s: -4 },
                },
                '4.0.-4': {
                  id: '4.0.-4',
                  coordinates: { q: 4, r: 0, s: -4 },
                },
                '4.-1.-3': {
                  id: '4.-1.-3',
                  coordinates: { q: 4, r: -1, s: -3 },
                },
                '4.-2.-2': {
                  id: '4.-2.-2',
                  coordinates: { q: 4, r: -2, s: -2 },
                },
                '4.-3.-1': {
                  id: '4.-3.-1',
                  coordinates: { q: 4, r: -3, s: -1 },
                },
                '4.-4.0': {
                  id: '4.-4.0',
                  coordinates: { q: 4, r: -4, s: 0 },
                },
                '3.-4.1': {
                  id: '3.-4.1',
                  coordinates: { q: 3, r: -4, s: 1 },
                },
                '2.-4.2': {
                  id: '2.-4.2',
                  coordinates: { q: 2, r: -4, s: 2 },
                },
                '1.-4.3': {
                  id: '1.-4.3',
                  coordinates: { q: 1, r: -4, s: 3 },
                },
                '0.-4.4': {
                  id: '0.-4.4',
                  coordinates: { q: 0, r: -4, s: 4 },
                },
                '-1.-3.4': {
                  id: '-1.-3.4',
                  coordinates: { q: -1, r: -3, s: 4 },
                },
                '-2.-2.4': {
                  id: '-2.-2.4',
                  coordinates: { q: -2, r: -2, s: 4 },
                },
                '-3.-1.4': {
                  id: '-3.-1.4',
                  coordinates: { q: -3, r: -1, s: 4 },
                },
                '-4.0.4': {
                  id: '-4.0.4',
                  coordinates: { q: -4, r: 0, s: 4 },
                },
                '-4.1.3': {
                  id: '-4.1.3',
                  coordinates: { q: -4, r: 1, s: 3 },
                },
                '-4.2.2': {
                  id: '-4.2.2',
                  coordinates: { q: -4, r: 2, s: 2 },
                },
                '-4.3.1': {
                  id: '-4.3.1',
                  coordinates: { q: -4, r: 3, s: 1 },
                },
                '-4.4.0': {
                  id: '-4.4.0',
                  coordinates: { q: -4, r: 4, s: 0 },
                },
                '-3.4.-1': {
                  id: '-3.4.-1',
                  coordinates: { q: -3, r: 4, s: -1 },
                },
                '-2.4.-2': {
                  id: '-2.4.-2',
                  coordinates: { q: -2, r: 4, s: -2 },
                },
                '-1.4.-3': {
                  id: '-1.4.-3',
                  coordinates: { q: -1, r: 4, s: -3 },
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
        children: [
          {
            zone: {
              id: 'playerBoard',
              styles: {
                position: 'absolute',
                left: 0,
                top: 0,
                backgroundImage: `url(${BlinkBlade})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: 600,
                height: 400,
                boxShadow: '0 6px 8px rgba(0, 0, 0, 1), 0 2px 4px rgba(0, 0, 0, 1)',
              },
              children: [
                {
                  text: {
                    id: 'playerName',
                    styles: {
                      position: 'absolute',
                      left: 0,
                      top: -30,
                    },
                    content: {
                      player: {
                        name: '$String',
                      },
                    },
                  },
                },
                {
                  cardStack: {
                    id: 'playerModifiers',
                    styles: {
                      position: 'absolute',
                      left: 0,
                      top: 0,
                    },
                    content: {
                      player: {
                        modifiers: '$Array',
                      },
                    },
                  },
                },
                {
                  cardStack: {
                    id: 'playerModifierDiscard',
                    styles: {
                      position: 'absolute',
                      left: 0,
                      top: 0,
                    },
                    content: {
                      player: {
                        modifierDiscard: '$Array',
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
  },
};
