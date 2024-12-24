import { IF, IFIntValue } from '../../../../../types/actions/if';
import { evalIf } from '../../eval-if';
import { evalSet } from '../../eval-set';
import { evalValue } from '../../eval-value';
import { GameModel } from '../../types';

const attackMock: IF = {
  target: {
    contains: {
      unit: {
        aspects: {
          health: {
            subtract: {
              subject: {
                contains: {
                  unit: {
                    aspects: {
                      attack: {
                        multiply: {
                          subject: {
                            contains: {
                              unit: { aspects: { magic: IFIntValue } },
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
  },
};

const willAttackMock: IF = {
  target: {
    contains: {
      unit: {
        aspects: {
          health: {
            subject: {
              contains: {
                unit: {
                  aspects: {
                    attack: {
                      multiply: {
                        subject: {
                          contains: {
                            unit: { aspects: { magic: IFIntValue } },
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
};

const unitModel: Partial<GameModel> = {
  subject: {
    contains: {
      unit: {
        aspects: {
          team: 'team1',
          attack: 10,
          magic: 2,
        },
      },
    },
  },
  target: {
    contains: {
      unit: {
        aspects: {
          team: 'team1',
          health: 20,
        },
      },
    },
  },
};
describe('Math module', () => {
  test('can if math', () => {
    const result = evalIf(willAttackMock, unitModel);

    expect(result).toBe(true);
  });
  test('can eval math', () => {
    const result = evalValue(attackMock, unitModel);

    expect(result).toBe(0);
  });
  test('can set math', () => {
    const resultModel = evalSet(attackMock, unitModel);

    console.dir(resultModel, { depth: null });
    expect(resultModel.target.contains.unit.aspects.health).toBe(0);
  });
});
