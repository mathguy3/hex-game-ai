import { procedures } from './procedures';
import { basic } from './cards';
import BlinkBlade from '../../../images/backgrounds/blinkblade-board.png';
import { attackCard } from './cards/attack/attackCard';
import blinkblade from '../../../images/tokens/blinkblade.png';
import enemy from '../../../images/tokens/enemy.png';
import { board } from './board';
import { enemyBasic } from './cards/enemy/enemyBasic';

const makeBasicModifiers = (prefix?: string) => [
  { id: `${prefix}MinusTwo`, ...attackCard('minusTwo', -2) },
  { id: `${prefix}MinusOne1`, ...attackCard('minusOne', -1) },
  { id: `${prefix}MinusOne2`, ...attackCard('minusOne', -1) },
  { id: `${prefix}MinusOne3`, ...attackCard('minusOne', -1) },
  { id: `${prefix}MinusOne4`, ...attackCard('minusOne', -1) },
  { id: `${prefix}MinusOne5`, ...attackCard('minusOne', -1) },
  { id: `${prefix}PlusOne1`, ...attackCard('plusOne', 1) },
  { id: `${prefix}PlusOne2`, ...attackCard('plusOne', 1) },
  { id: `${prefix}PlusOne3`, ...attackCard('plusOne', 1) },
  { id: `${prefix}PlusOne4`, ...attackCard('plusOne', 1) },
  { id: `${prefix}PlusOne5`, ...attackCard('plusOne', 1) },
  { id: `${prefix}PlusTwo`, ...attackCard('plusTwo', 2) },
  { id: `${prefix}Zero1`, ...attackCard('zero', 0) },
  { id: `${prefix}Zero2`, ...attackCard('zero', 0) },
  { id: `${prefix}Zero3`, ...attackCard('zero', 0) },
  { id: `${prefix}Zero4`, ...attackCard('zero', 0) },
  { id: `${prefix}Zero5`, ...attackCard('zero', 0) },
  { id: `${prefix}Zero6`, ...attackCard('zero', 0) },
  { id: `${prefix}TimesTwo`, ...attackCard('timesTwo', 0, 2) },
  { id: `${prefix}Miss`, ...attackCard('miss', 0, 0) },
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
    cards: {
      basic,
      minusTwo: attackCard('minusTwo', -2),
      minusOne: attackCard('minusOne', -1),
      plusOne: attackCard('plusOne', 1),
      plusTwo: attackCard('plusTwo', 2),
      zero: attackCard('zero', 0),
      timesTwo: attackCard('timesTwo', 0, 2),
      miss: attackCard('miss', 0, 0),
    },
    sequence: {
      round: {
        repeat: true,
        /*breakIf: {
          spaces: {
            filter: {
              character: {
                properties: {
                  isEnemy: {
                    equals: true,
                  },
                },
              },
            },
            then: {
              length: {
                equals: 0,
              },
            },
          },
        },*/
        phases: [
          /*'%shuffleModifiers',
          {
            announce: {
              to: 'all',
              message: 'Round Start',
              if: 'isPlayerAction',
            },
          },*/
          '%playerSelectCards',
          '%playerTurn',
        ],
      },
    },
    winCondition: {
      spaces: {
        filter: {
          character: {
            properties: {
              isEnemy: {
                equals: true,
              },
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
    references: procedures,
    functions: {},
  },
  data: {
    board,
    player1: {
      name: 'Blinkblade1',
      isPlayer: true,
      hand: [
        { id: 'first', ...basic, properties: { initiative: 1 } },
        { id: 'second', ...basic, properties: { initiative: 2 } },
        { id: 'third', ...basic, properties: { initiative: 3 } },
        { id: 'fourth', ...basic, properties: { initiative: 4 } },
        { id: 'fifth', ...basic, properties: { initiative: 5 } },
        { id: 'sixth', ...basic, properties: { initiative: 6 } },
      ],
      modifierDiscard: [],
      modifiers: [...makeBasicModifiers('player1')],
      selectedCards: [],
      properties: {
        initiative: -1,
      },
    },
    player2: {
      name: 'Blinkblade2',
      isPlayer: true,
      hand: [
        { id: 'first', ...basic, properties: { initiative: 1 } },
        { id: 'second', ...basic, properties: { initiative: 2 } },
        { id: 'third', ...basic, properties: { initiative: 3 } },
        { id: 'fourth', ...basic, properties: { initiative: 4 } },
        { id: 'fifth', ...basic, properties: { initiative: 5 } },
        { id: 'sixth', ...basic, properties: { initiative: 6 } },
      ],
      modifierDiscard: [],
      modifiers: [...makeBasicModifiers('player2')],
      properties: {
        initiative: 0,
      },
    },
    player3: {
      name: 'Blinkblade3',
      isPlayer: true,
      hand: [
        { id: 'first', ...basic, properties: { initiative: 1 } },
        { id: 'second', ...basic, properties: { initiative: 2 } },
        { id: 'third', ...basic, properties: { initiative: 3 } },
        { id: 'fourth', ...basic, properties: { initiative: 4 } },
        { id: 'fifth', ...basic, properties: { initiative: 5 } },
        { id: 'sixth', ...basic, properties: { initiative: 6 } },
      ],
      modifierDiscard: [],
      modifiers: [...makeBasicModifiers('player3')],
      properties: {
        initiative: 0,
      },
    },
    enemy1: {
      kind: 'flameDemon',
      isEnemy: true,
      hand: [{ id: 'first', ...enemyBasic }],
      discard: [],
      selectedCards: [],
      properties: {
        initiative: 0,
      },
    },
    enemy2: {
      kind: 'iceDemon',
      isEnemy: true,
      deck: [],
      discard: [],
      properties: {
        initiative: 0,
      },
    },
    properties: {
      enemyModifiers: [],
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
                  character: {
                    token: {
                      image: {
                        if: {
                          token: {
                            properties: {
                              isEnemy: {
                                equals: true,
                              },
                            },
                          },
                        },
                        then: enemy,
                        else: blinkblade,
                      },
                      styles: {
                        width: 60,
                        height: 75,
                      },
                    },
                  },
                  coin: {
                    token: {
                      image: blinkblade,
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
                      left: 600,
                      top: 0,
                      width: 100,
                      height: 75,
                    },
                    cardStyles: {
                      width: 100,
                      height: 75,
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
                      left: 600,
                      top: 300,
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
