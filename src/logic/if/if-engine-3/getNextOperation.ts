import * as operations from './operations';
import { Context } from './operations/types';

const operationsArray = Object.entries(operations);
export const getNextOperation = (context: Context) => {
  return getOperation(context.next.ifItem, context.references, context.functions);
};

export const getOperation = (
  ifItem: Context['next']['ifItem'],
  references: Context['references'],
  functions: Context['functions']
) => {
  const simpleType = isSimpleType(ifItem);
  const fields = simpleType ? [] : Object.keys(ifItem);
  const refs = Object.entries(references);
  const funcs = Object.entries(functions);

  const operationType = simpleType
    ? 'simple'
    : operationsArray.find(([opKey, op]) => {
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
      })?.[0] ??
      (refs.find(([refKey, ref]) => {
        return fields.includes(refKey);
      })
        ? 'referenceOp'
        : funcs.find(([funcKey, func]) => {
            return fields.includes(funcKey);
          })
        ? 'functionOp'
        : 'field');
  return { operationType, fields };
};

const isSimpleType = (type: Context['next']['ifItem']) => {
  return ['string', 'number', 'boolean'].includes(typeof type) || type === null || type === undefined;
};
