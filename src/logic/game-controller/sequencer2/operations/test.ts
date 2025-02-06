const card = {
  actions: {
    top: {
      options: [
        {
          token: {
            tiles: {
              add: ['board'],
              filter: ['player'],
            },
            option: {
              space: {
                tiles: {
                  add: ['adjacent'],
                  filter: ['enemy'],
                },
                actions: [{ basicAttack: { attack: 2 } }],
              },
            },
          },
        },
      ],
    },
    bottom: {
      option: [
        {
          token: {
            tiles: {
              add: ['board'],
              filter: ['player'],
            },
            option: {
              space: {
                tiles: {
                  add: [
                    {
                      space: {
                        range: 2,
                      },
                    },
                  ],
                  filter: ['enemy'],
                },
                actions: ['moveToTarget'],
              },
            },
          },
        },
      ],
    },
  },
};

const procedures = {
  basicAttack: {
    target: {
      properties: {
        health: {
          subtract: '%attack',
        },
      },
    },
  },
  board: {
    subject: {
      board: 'board',
    },
  },
  player: {
    subject: {
      properties: {
        playerId: {
          equals: {
            context: {
              activePlayer: {
                playerId: '$String',
              },
            },
          },
        },
      },
    },
  },
  adjacent: {
    range: 1,
  },
  enemy: {
    subject: {
      properties: {
        isEnemy: { equals: true },
      },
    },
  },
  moveToTarget: {
    and: [
      {
        target: {
          slots: {
            unit: {
              equals: {
                subject: {
                  target: {
                    slots: {
                      unit: '$Object',
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        subject: {
          slots: {
            unit: {
              equals: null,
            },
          },
        },
      },
    ],
  },
};

export const gloomhaven = {
  config: {
    name: 'Gloomhaven',
    description: 'A strategic board game',
  },
  definitions: {
    players: {
      player1: {},
      player2: {},
      enemy1: {},
      enemy2: {},
    },
    procedures,
    cards: {
      basic: card,
    },
    sequence: {
      round: {
        repeat: true,
        phases: [
          {
            turn: {
              async: true,
              actions: [
                {
                  option: [
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
                {
                  player: {
                    initiative: {
                      equals: {
                        selected: {
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
              ],
            },
          },
          {
            turn: {
              rotate: true,
              order: {
                properties: {
                  initiative: '$Number',
                },
              },
              actions: [
                {
                  options: [
                    {
                      card: {
                        play: {
                          from: 'selected',
                          remove: true,
                        },
                      },
                    },
                  ],
                },
                {
                  options: [
                    {
                      card: {
                        play: {
                          from: 'selected',
                          remove: true,
                        },
                      },
                    },
                  ],
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
      '0.0.0': {
        slots: { unit: { properties: { playerId: 'player1' } } },
      },
    },
    player1: {
      hand: [card],
    },
    player2: {},
    enemy1: {},
    enemy2: {},
  },
  ui: {
    zone: {
      children: [
        {
          board: {
            id: 'board',
            spacePosition: 'hexMap',
            spaces: {
              // Center
              '0.0.0': {
                coordinates: { q: 0, r: 0, s: 0 },
              },

              // Ring 1
              '0.1.-1': { coordinates: { q: 0, r: 1, s: -1 } },
              '1.0.-1': { coordinates: { q: 1, r: 0, s: -1 } },
              '1.-1.0': { coordinates: { q: 1, r: -1, s: 0 } },
              '0.-1.1': { coordinates: { q: 0, r: -1, s: 1 } },
              '-1.0.1': { coordinates: { q: -1, r: 0, s: 1 } },
              '-1.1.0': { coordinates: { q: -1, r: 1, s: 0 } },

              // Ring 2
              '0.2.-2': { coordinates: { q: 0, r: 2, s: -2 } },
              '1.1.-2': { coordinates: { q: 1, r: 1, s: -2 } },
              '2.0.-2': { coordinates: { q: 2, r: 0, s: -2 } },
              '2.-1.-1': { coordinates: { q: 2, r: -1, s: -1 } },
              '2.-2.0': { coordinates: { q: 2, r: -2, s: 0 } },
              '1.-2.1': { coordinates: { q: 1, r: -2, s: 1 } },
              '0.-2.2': { coordinates: { q: 0, r: -2, s: 2 } },
              '-1.-1.2': { coordinates: { q: -1, r: -1, s: 2 } },
              '-2.0.2': { coordinates: { q: -2, r: 0, s: 2 } },
              '-2.1.1': { coordinates: { q: -2, r: 1, s: 1 } },
              '-2.2.0': { coordinates: { q: -2, r: 2, s: 0 } },
              '-1.2.-1': { coordinates: { q: -1, r: 2, s: -1 } },

              // Ring 3
              '0.3.-3': { coordinates: { q: 0, r: 3, s: -3 } },
              '1.2.-3': { coordinates: { q: 1, r: 2, s: -3 } },
              '2.1.-3': { coordinates: { q: 2, r: 1, s: -3 } },
              '3.0.-3': { coordinates: { q: 3, r: 0, s: -3 } },
              '3.-1.-2': { coordinates: { q: 3, r: -1, s: -2 } },
              '3.-2.-1': { coordinates: { q: 3, r: -2, s: -1 } },
              '3.-3.0': { coordinates: { q: 3, r: -3, s: 0 } },
              '2.-3.1': { coordinates: { q: 2, r: -3, s: 1 } },
              '1.-3.2': { coordinates: { q: 1, r: -3, s: 2 } },
              '0.-3.3': { coordinates: { q: 0, r: -3, s: 3 } },
              '-1.-2.3': { coordinates: { q: -1, r: -2, s: 3 } },
              '-2.-1.3': { coordinates: { q: -2, r: -1, s: 3 } },
              '-3.0.3': { coordinates: { q: -3, r: 0, s: 3 } },
              '-3.1.2': { coordinates: { q: -3, r: 1, s: 2 } },
              '-3.2.1': { coordinates: { q: -3, r: 2, s: 1 } },
              '-3.3.0': { coordinates: { q: -3, r: 3, s: 0 } },
              '-2.3.-1': { coordinates: { q: -2, r: 3, s: -1 } },
              '-1.3.-2': { coordinates: { q: -1, r: 3, s: -2 } },
            },
          },
        },
      ],
    },
  },
};
