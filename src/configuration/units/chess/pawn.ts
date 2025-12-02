import { HexInteraction } from '../../../types/actions/interactions';
import { moveToHex } from './helpers/moveToHex';
import { targetIsEnemyUnit } from './helpers/targetIsEnemyUnit';
import { targetIsNotUnit } from './helpers/targetIsNotUnit';
import { targetIsUnit } from './helpers/targetIsUnit';
import SoldierSvg from '../../../components/Soldier/Soldier.svg';
import { getHexDirection } from '../../../logic/game-controller/context/query/utils/getHexDirection';

const getMoveTwice = (direction: number): HexInteraction => ({
  type: 'hex',
  kind: 'movement',
  targeting: {
    userSelect: true,
    tiles: {
      add: [
        {
          type: 'direction' as const,
          direction,
          range: 2,
          tileIf: targetIsNotUnit,
          isBlocking: targetIsUnit,
        },
        {
          type: 'direction' as const,
          direction,
          range: 1,
          tileIf: targetIsNotUnit,
          isBlocking: targetIsUnit,
        },
      ],
    },
  },
  actions: [
    {
      type: 'action' as const,
      name: 'moveToHex',
      description:
        'Moves subject unit to target hex, clears subject hex, and sets newly moved target unit aspect hasMoved: true',
      set: moveToHex,
    },
  ],
});

const getAttackUp = (direction: number): HexInteraction => ({
  type: 'hex' as const,
  kind: 'attack',
  targeting: {
    userSelect: true,
    tiles: {
      add: [
        {
          type: 'offset' as const,
          offset: { q: -1, r: 0, s: 1 },
          tileIf: targetIsEnemyUnit,
        },
        {
          type: 'offset' as const,
          offset: { q: 1, r: -1, s: 0 },
          tileIf: targetIsEnemyUnit,
        },
      ],
    },
  },
  actions: [
    {
      type: 'action' as const,
      name: 'attack',
      description: 'Attacks target unit, setting target unit aspect hasMoved: true',
      set: moveToHex,
    },
  ],
});

export const pawnWhite: any = {
  type: 'unit',
  kind: 'pawnWhite',
  properties: {},
  image: SoldierSvg,
  action: {
    target: {
      move: {
        space: {
          query: {
            type: 'space',
            from: [{ direction: { direction: 'up', distance: 2 } }],
            filter: [
              {
                space: {
                  unit: {
                    equals: '$undefined',
                  },
                },
              },
            ],
          },
        },
      },
      attack: {
        space: {
          query: {
            type: 'space',
            from: [{ offset: { direction: 'upLeft', distance: 1 } }, { offset: { direction: 'upRight', distance: 1 } }],
            filter: [
              {
                and: [
                  {
                    space: {
                      unit: {
                        notEquals: '$undefined',
                      },
                    },
                  },
                  {
                    space: {
                      unit: {
                        properties: {
                          team: {
                            value: {
                              notEquals: 'team1',
                            },
                          },
                        },
                      },
                    },
                  },
                ],
              },
            ],
          },
        },
      },
    },
    actions: [
      {
        action: {
          move: {
            token: {
              from: {
                source: 'board',
                id: {
                  subjectSpace: {
                    id: '$String',
                  },
                },
                slot: 'unit',
              },
              to: {
                source: 'board',
                id: {
                  targetSpace: {
                    id: '$String',
                  },
                },
                slot: 'unit',
              },
            },
          },
        },
      },
    ],
  },
};

export const pawnBlack: any = {
  type: 'unit',
  kind: 'pawnBlack',
  properties: {},
  interactions: [getMoveTwice(5), getAttackUp(5)],
  image: SoldierSvg,
  action: {
    target: {
      move: {
        space: {
          query: {
            type: 'space',
            from: [
              {
                direction: {
                  direction: 'down',
                  distance: 2,
                  blocking: {
                    space: {
                      unit: {
                        notEquals: '$undefined',
                      },
                    },
                  },
                },
              },
            ],
            filter: [
              {
                space: {
                  unit: {
                    equals: '$undefined',
                  },
                },
              },
            ],
          },
        },
      },
      attack: {
        space: {
          query: {
            type: 'space',
            from: [
              { offset: { direction: 'downLeft', distance: 1 } },
              { offset: { direction: 'downRight', distance: 1 } },
            ],
            filter: [
              {
                and: [
                  {
                    space: {
                      unit: {
                        notEquals: '$undefined',
                      },
                    },
                  },
                  {
                    space: {
                      unit: {
                        properties: {
                          team: {
                            value: {
                              notEquals: 'team2',
                            },
                          },
                        },
                      },
                    },
                  },
                ],
              },
            ],
          },
        },
      },
    },
    actions: [
      {
        action: {
          move: {
            token: {
              from: {
                source: 'board',
                id: {
                  subjectSpace: {
                    id: '$String',
                  },
                },
                slot: 'unit',
              },
              to: {
                source: 'board',
                id: {
                  targetSpace: {
                    id: '$String',
                  },
                },
                slot: 'unit',
              },
            },
          },
        },
      },
    ],
  },
};
