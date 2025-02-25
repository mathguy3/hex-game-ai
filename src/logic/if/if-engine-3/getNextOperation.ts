import * as operations from './operations';
import { Context } from './operations/types';

const operationsArray = Object.entries(operations);
export const getNextOperation = (context: Context) => {
  return getOperation(context.ifItem);
};

export const getOperation = (ifItem: Context['ifItem']) => {
  const fields = ifItem === null ? [] : Object.keys(ifItem);
  const simpleType = isSimpleType(ifItem);

  const operationType = simpleType
    ? 'simple'
    : operationsArray.find((operation) => {
        const op = operation[1];
        const useAlt = op.requiredFields.length == 1;
        const hasRequiredOrAlternate =
          op.requiredFields.length > 0 &&
          (useAlt
            ? fields.includes(op.requiredFields[0]) ||
              op.alternateFields.some((field) => {
                return fields.includes(field);
              })
            : op.requiredFields.every((field) => {
                return fields.includes(field);
              }));
        return hasRequiredOrAlternate;
      })?.[0] ?? 'field';
  return { operationType, fields };
};

const isSimpleType = (type: Context['ifItem']) => {
  return ['string', 'number', 'boolean'].includes(typeof type) || type === null;
};
