import { IF, IFIntValue } from '../../../../../../types/actions/if';
import { evalIf } from '../../eval-if';
import { evalSet } from '../../eval-set';
import { evalValue } from '../../evalValue';
import { IFContext } from '../../types';

const attackMock: IF = {
  target: {
    hex: {
      contains: {
        unit: {
          aspects: {
            health: {
              subtract: {
                subject: {
                  hex: {
                    contains: {
                      unit: {
                        aspects: {
                          attack: {
                            multiply: {
                              subject: {
                                hex: {
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
      },
    },
  },
};

const willAttackMock: IF = {
  target: {
    hex: {
      contains: {
        unit: {
          aspects: {
            health: {
              subject: {
                hex: {
                  contains: {
                    unit: {
                      aspects: {
                        attack: {
                          multiply: {
                            subject: {
                              hex: {
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
    },
  },
};

const unitModel: Partial<IFContext> = {
  model: {
    subject: {
      hex: {
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
    },
    target: {
      hex: {
        contains: {
          unit: {
            aspects: {
              team: 'team1',
              health: 20,
            },
          },
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
    expect(resultModel.target.hex.contains.unit.aspects.health).toBe(0);
  });
});
