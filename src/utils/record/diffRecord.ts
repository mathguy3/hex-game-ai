export const diffRecord = <T>(
  mapA: Record<string, T>,
  mapB: Record<string, T>,
  where?: (value: T) => boolean
) => {
  const bEntries = Object.entries(mapB);
  for (const [key, value] of bEntries) {
    if (where && !where(value)) {
      continue;
    }
    delete mapA[key];
  }
  return mapA;
};
