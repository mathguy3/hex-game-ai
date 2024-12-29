import { doIf } from '../../doIf';

describe('doIf', () => {
  it('doIf should return true if the value subtracted is equal', () => {
    const ifItem = {
      target: {
        health: {
          equals: {
            target: {
              attack: {
                subtract: 10,
              },
            },
          },
        },
      },
    };
    const model = {
      target: {
        health: 10,
        attack: 20,
      },
    };
    const result = doIf({ ifItem, model });
    expect(result).toBe(true);
  });
  it('doIf should return false if the value subtracted is not equal', () => {
    const ifItem = {
      target: {
        health: {
          equals: {
            target: {
              attack: {
                subtract: 11,
              },
            },
          },
        },
      },
    };
    const model = {
      target: {
        health: 10,
        attack: 20,
      },
    };
    const result = doIf({ ifItem, model });
    expect(result).toBe(false);
  });
  it('doIf should return false if the value subtracted is not equal', () => {
    const ifItem = {
      target: {
        health: {
          '=': {
            target: {
              attack: {
                subtract: 11,
              },
            },
          },
        },
      },
    };
    const model = {
      target: {
        health: 10,
        attack: 20,
      },
    };
    const result = doIf({ ifItem, model });
    expect(result).toBe(false);
  });
});
