import { doEval } from '../../doEval';
import { doIf } from '../../doIf';
import { doSet } from '../../doSet';

describe('doIf', () => {
  it('should shuffle the array and save the result', () => {
    const array = [1, 2, 3, 4, 5];
    const arrayCopy = [...array];
    const model = {
      subject: array,
    };
    const result = doSet({
      ifItem: {
        subject: {
          shuffle: '$Array',
        },
      },
      model,
    });
    const allMatch = arrayCopy.every((item, index) => {
      const resultItem = model.subject[index];
      return resultItem === item;
    });
    expect(allMatch).toBe(false);
  });
  it('should shuffle the array and not modify the original array', () => {
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
    const allMatch = arrayCopy.every((item, index) => {
      const resultItem = model.subject[index];
      return resultItem === item;
    });
    const allMatch2 = arrayCopy.every((item, index) => {
      const resultItem = result[index];
      return resultItem === item;
    });
    expect(allMatch).toBe(true);
    expect(allMatch2).toBe(false);
  });
});
