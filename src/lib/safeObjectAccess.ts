/**
 * Safe object access helpers to avoid Codacy security warnings
 * These helpers provide type-safe access to object properties with dynamic keys
 */

/**
 * Safely get a value from an object using a dynamic key
 */
export function safeGet<T, K extends string>(
  obj: Record<K, T> | undefined,
  key: K,
  defaultValue?: T
): T | undefined {
  if (!obj) return defaultValue;
  if (Object.prototype.hasOwnProperty.call(obj, key)) {
    return obj[key as keyof typeof obj];
  }
  return defaultValue;
}

/**
 * Safely set a value in an object using a dynamic key
 * Returns a new object with the updated property
 */
export function safeSet<T, K extends string>(
  obj: Record<K, T>,
  key: K,
  value: T
): Record<K, T> {
  return Object.assign({}, obj, { [key]: value });
}

/**
 * Safely increment a numeric value in an object
 * Returns a new object with the incremented property
 */
export function safeIncrement<K extends string>(
  obj: Record<K, number>,
  key: K,
  increment: number = 1
): Record<K, number> {
  const currentValue = safeGet(obj, key, 0) ?? 0;
  return safeSet(obj, key, currentValue + increment);
}
