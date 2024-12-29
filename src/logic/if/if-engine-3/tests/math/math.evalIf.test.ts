import { doEval } from '../../doEval';

describe('evalIf', () => {
  it('evalIf should return subtracted value', () => {
    const ifItem = {
      target: {
        health: {
          '-': {
            target: {
              attack: '$Number',
            },
          },
        },
      },
    };
    const model = {
      target: {
        health: 10,
        attack: 5,
      },
    };
    const result = doEval({ ifItem, model });
    expect(result).toBe(5);
  });
});
