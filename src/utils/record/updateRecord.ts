export function updateRecord<T, K extends string = string>(
  state: Record<K, T>,
  keys: K[],
  action: (hex: T | undefined, key: K) => T
) {
  for (const key of keys) {
    const updatedItem = action(state[key], key);
    if (updatedItem) {
      state[key] = updatedItem;
    } else {
      delete state[key];
    }
  }
  return state;
}

export function updateRecord2<T, K>(
  state: Record<string, T>,
  items: K[],
  getKey: (item: K) => string,
  action: (hex: T | undefined, item: K, key: string) => T
) {
  for (const item of items) {
    const key = getKey(item);
    const updatedItem = action(state[key], item, key);
    if (updatedItem) {
      state[key] = updatedItem;
    } else {
      delete state[key];
    }
  }
  return state;
}
