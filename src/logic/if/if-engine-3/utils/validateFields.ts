import { Context } from '../operations/types';

export const validateFields = (
  context: Context,
  handler: { requiredFields: string[]; alternateFields: string[]; optionalFields: string[] }
) => {
  const { requiredFields, alternateFields } = handler;
  const missingFields = requiredFields.filter((field) => !context.next.ifItem[field]);
  const foundAlternateFields = alternateFields.filter((field) => context.next.ifItem[field]);

  if (missingFields.length > 0 && foundAlternateFields.length === 0) {
    throw new Error(
      `Missing required fields: ${missingFields.join(', ')} and no alternate fields: ${foundAlternateFields.join(', ')}`
    );
  }
};
