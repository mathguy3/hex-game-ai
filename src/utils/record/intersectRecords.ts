export const intersectRecords = <T>(
  mapA: Record<string, T>,
  mapB: Record<string, T>,
  where?: (value: T) => boolean
) => {
  const bEntries = Object.entries(mapB);
  for (const [key, value] of bEntries) {
    if (!mapA[key] || (where && !where(value))) {
      continue;
    }
    mapA[key] = { ...mapA[key], ...value };
  }
  return mapA;
};
