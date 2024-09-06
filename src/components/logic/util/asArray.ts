export const asArray = <T>(items: T | T[]): T[] => (Array.isArray(items) ? items : [items]);
