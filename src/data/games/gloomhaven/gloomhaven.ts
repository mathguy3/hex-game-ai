import { procedures } from './procedures';

const basicCard = {
  kind: 'basic',
  name: 'Basic',
  image: 'basic.png',
  actions: {
    top: {
      option: {
        options: [
          {
            space: {
              query: {
                type: 'space',
                from: ['board'],
                filter: ['%spaceSlotCurrentPlayer'],
              },
              target: {
                attack: {
                  space: {
                    query: {
                      type: 'space',
                      from: ['board'],
                      filter: [{ adjacent: {} }, '%isEnemyTargetSpace'],
                    },
                  },
                },
              },
            },
            actions: [
              {
                action: {
                  actions: [
                    {
                      targetSpace: {
                        slot: {
                          properties: {
                            health: {
                              equals: {
                                targetSpace: {
                                  slot: {
                                    properties: { health: { minus: 2 } },
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
        ],
      },
    },
    bottom: {
      option: {
        options: [
          {
            space: {
              query: {
                type: 'space',
                from: ['board'],
                filter: ['%spaceSlotCurrentPlayer'],
              },
              target: {
                move: {
                  space: {
                    query: {
                      type: 'space',
                      from: [
                        {
                          range: 2,
                        },
                      ],
                    },
                  },
                },
              },
            },
            actions: [
              {
                action: {
                  actions: [
                    '%moveSlotToTarget',
                    {
                      subjectSpace: {
                        slot: {
                          equals: null,
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
    },
  },
};

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
      player3: { isOpen: false, isAi: false },
      player4: { isOpen: false, isAi: false },
      enemy1: { isConfigurable: false, isOpen: false, isAi: true },
    },
    procedures,
    cards: {
      basic: basicCard,
    },
    sequence: {
      round: {
        repeat: true,
        phases: [
          {
            announce: {
              to: 'all',
              message: 'Round Start',
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
  },
  data: {
    board: {
      // Center
      '0.0.0': {
        id: '0.0.0',
        coordinates: { q: 0, r: 0, s: 0 },
        slot: { type: 'token', kind: 'enemy', properties: { isEnemy: true, health: 10 } },
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
    },
    player1: {
      hand: [
        { id: 'first', ...basicCard, properties: { initiative: 1 } },
        { id: 'second', ...basicCard, properties: { initiative: 2 } },
        { id: 'third', ...basicCard, properties: { initiative: 3 } },
      ],
      properties: {
        initiative: 0,
      },
    },
    player2: {
      hand: [
        { id: 'first', ...basicCard, properties: { initiative: 1 } },
        { id: 'second', ...basicCard, properties: { initiative: 2 } },
        { id: 'third', ...basicCard, properties: { initiative: 3 } },
      ],
      properties: {
        initiative: 0,
      },
    },
    enemy1: {},
    enemy2: {},
  },
  ui: {
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
            },
          },
        },
      ],
    },
  },
};
