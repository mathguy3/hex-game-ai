import { IF, IFFloatValue } from '../../../../../../types/actions/if';
import { evalIf } from '../../eval-if';
import { IFContext } from '../../types';

const hasMoreHealth: IF = {
  target: {
    hex: {
      contains: {
        unit: {
          aspects: {
            health: {
              equal: {
                subject: {
                  hex: {
                    contains: {
                      unit: {
                        aspects: {
                          health: IFFloatValue,
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
};

const unitModel: Partial<IFContext> = {
  model: {
    subject: {
      contains: {
        unit: {
          aspects: {
            team: 'team1',
            health: 20,
          },
        },
      },
    },
    target: {
      contains: {
        unit: {
          aspects: {
            team: 'team2',
            health: 20,
          },
        },
      },
    },
  },
};
describe('Compare module', () => {
  test('can if compare', () => {
    const result = evalIf(hasMoreHealth, unitModel);

    expect(result).toBe(true);
  });
});
