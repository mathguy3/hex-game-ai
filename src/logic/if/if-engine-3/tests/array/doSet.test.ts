import { doEval } from '../../doEval';

describe('doEval array operations', () => {
  it.skip('should return an array of spaces', () => {
    const model = {
      context: {
        data: {
          board: {
            '0.0.0': {
              id: '0.0.0',
              type: 'space',
            },
            '0.0.1': {
              id: '0.0.1',
              type: 'space',
            },
          },
        },
      },
    };
    const result = doEval({
      ifItem: {
        spaces: '$Array',
      },
      model,
    });
    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual([model.context.data.board['0.0.0'], model.context.data.board['0.0.1']]);
  });
  it('should filter an array of spaces', () => {
    const model = {
      context: {
        data: {
          board: {
            '0.0.0': {
              id: '0.0.0',
              type: 'space',
            },
            '0.0.1': {
              id: '0.0.1',
              type: 'space',
            },
          },
        },
      },
    };
    const result = doEval({
      ifItem: {
        spaces: {
          filter: {
            id: {
              equals: '0.0.0',
            },
          },
          then: '$Array',
        },
      },
      model,
    });
    //expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual([model.context.data.board['0.0.0']]);
  });

  it('should sort an array of spaces', () => {
    const model = {
      context: {
        data: {
          board: {
            '0.0.0': {
              id: '0.0.0',
              val: 3,
              type: 'space',
            },
            '0.0.1': {
              id: '0.0.1',
              val: 2,
              type: 'space',
            },
            '0.0.2': {
              id: '0.0.2',
              val: 4,
              type: 'space',
            },
            '0.0.3': {
              id: '0.0.3',
              val: 1,
              type: 'space',
            },
          },
        },
      },
    };
    const result = doEval({
      ifItem: {
        spaces: {
          sort: {
            val: '$Number',
          },
          then: '$Array',
        },
      },
      model,
    });
    expect(result).toEqual([
      model.context.data.board['0.0.3'],
      model.context.data.board['0.0.1'],
      model.context.data.board['0.0.0'],
      model.context.data.board['0.0.2'],
    ]);
  });

  it.skip('should shuffle an array without modifying the original', () => {
    const array = [1, 2, 3, 4, 5];
    const arrayCopy = [...array];
    const model = {
      subject: array,
    };
    const result = doEval({
      ifItem: {
        subject: {
          shuffle: '$Array',
        },
      },
      model,
    });

    // Check original array is unchanged
    expect(model.subject).toEqual(arrayCopy);

    // Check result is shuffled (different order)
    expect(result).not.toEqual(arrayCopy);

    // Check result contains all the same elements
    expect(result.sort()).toEqual(arrayCopy.sort());
  });
});
