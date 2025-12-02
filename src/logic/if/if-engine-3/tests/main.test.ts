import { doEval } from '../doEval';
import { doSet } from '../doSet';
import { multiply } from '../operations';

const jestConsole = console;

beforeEach(() => {
  global.console = require('console');
});

afterEach(() => {
  global.console = jestConsole;
});

const getModel = () => {
  return {
    context: {
      data: {
        board: {
          '0.0.0': { id: '0.0.0', type: 'space' },
        },
      },
      basicList: [2, 1, 3],
      basicValue: 'test',
      basicNumber: 1,
      sideA: 3,
      sideB: 4,
    },
  };
};

describe('main', () => {
  it('should return a basic value', () => {
    const result = doEval({
      ifItem: {
        context: {
          basicValue: '$String',
        },
      },
      model: getModel(),
    });
    expect(result).toEqual('test');
  });

  it('should add a basic value', () => {
    const result = doEval({
      ifItem: {
        context: {
          basicNumber: {
            add: 2,
          },
        },
      },
      model: getModel(),
    });
    expect(result).toEqual(3);
  });
  it('should set a basic value', () => {
    const result = doSet({
      ifItem: {
        context: {
          basicNumber: {
            equals: {
              add: 2,
            },
          },
        },
      },
      model: getModel(),
    });
    expect(result.context.basicNumber).toEqual(3);
  });

  it('should calculate an equation', () => {
    const result = doEval({
      ifItem: {
        context: {
          basicNumber: {
            equation: [{ add: 2 }, { subtract: 1 }],
          },
        },
      },
      model: getModel(),
    });
    expect(result).toEqual(2);
  });

  it('should calculate the pythagorean theorem', () => {
    const result = doSet({
      ifItem: {
        context: {
          sideC: {
            equals: {
              context: {
                sideA: {
                  equation: [
                    {
                      multiply: { context: { sideA: '$Number' } },
                    },
                    {
                      add: {
                        context: {
                          sideB: {
                            multiply: { context: { sideB: '$Number' } },
                          },
                        },
                      },
                    },
                    { sqrt: '$Number' },
                  ],
                },
              },
            },
          },
        },
      },
      model: getModel(),
    });
    expect(result.context.sideC).toEqual(5);
  });

  it('should use function', () => {
    const result = doSet({
      ifItem: {
        context: {
          sideC: {
            equals: {
              pythagorean: {
                sideA: 3,
                sideB: 4,
              },
            },
          },
        },
      },
      model: getModel(),
      functions: {
        pythagorean: {
          sideA: {
            equation: [
              { multiply: { sideA: '$Number' } },
              { add: { sideB: { multiply: { sideB: '$Number' } } } },
              { sqrt: '$Number' },
            ],
          },
        },
      },
    });
    expect(result.context.sideC).toEqual(5);
  });

  it.only('should calculate the min of an array', () => {
    const result = doEval({
      ifItem: {
        context: {
          basicList: {
            min: '$Number',
          },
        },
      },
      model: getModel(),
    });
    expect(result).toEqual(1);
  });
});
