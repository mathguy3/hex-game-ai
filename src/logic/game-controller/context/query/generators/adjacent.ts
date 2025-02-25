import { range } from './range';

export const adjacent = (model: any, query: any) => {
  const { subjectSpace } = model;
  if (!subjectSpace) {
    throw new Error('subjectSpace is required for adjacent query');
  }
  return range(model, 1);
};
