import { applyRecord } from './applyRecord';

export const mapToRecord = <T, V, K extends Record<string, V>>(
  items: T[],
  mapper: (item: T) => K
): K => {
  return items
    .map(mapper)
    .reduce((all, value) => applyRecord(all, value) as K, {} as K);
};
