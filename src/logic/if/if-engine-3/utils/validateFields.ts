import { Context } from '../operations/types';

export const validateFields = (
  context: Context,
  handler: { requiredFields: string[]; alternateFields: string[]; optionalFields: string[] }
) => {
  const { requiredFields, alternateFields } = handler;
  const missingFields = requiredFields.filter((field) => context.next.ifItem[field] === undefined);
  const foundAlternateFields = alternateFields.filter((field) => context.next.ifItem[field]);

  if (missingFields.length > 0 && foundAlternateFields.length === 0) {
    const keys = Object.keys(context.next.ifItem);
    throw new Error(
      `Keys '${keys.join(', ')}' do not match required fields: '${requiredFields.join(
        ', '
      )}' and alternate fields: ${alternateFields.join(', ')}`
    );
  }
};
