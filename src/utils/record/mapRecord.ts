export const mapRecord = <T, K>(
  record: Record<string, T>,
  mapper: (item: T) => K
): Record<string, K> => {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [key, mapper(value)])
  );
};
