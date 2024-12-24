export function assert<T>(value: T, message: string): asserts value is NonNullable<T> {
  if (typeof value === 'undefined') throw new Error(message);
}
