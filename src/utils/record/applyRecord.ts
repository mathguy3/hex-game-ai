export const applyRecord = <T>(
  mapA: Record<string, T>,
  mapB: Record<string, T>,
  where?: (value: T) => boolean
) => {
  const bEntries = Object.entries(mapB);
  for (const [key, value] of bEntries) {
    if (where && !where(value)) {
      continue;
    }
    mapA[key] = value;
  }
  return mapA;
};
