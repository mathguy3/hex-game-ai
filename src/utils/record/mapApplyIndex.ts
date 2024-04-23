export const mapApplyIndex = <T, K>(
  mapA: Record<string, K>,
  mapB: Record<string, T>,
  map: (prevValue: K, value: T) => K
) => {
  const bEntries = Object.entries(mapB);
  for (const [key, value] of bEntries) {
    mapA[key] = map(mapA[key], value);
  }
  return mapA;
};
