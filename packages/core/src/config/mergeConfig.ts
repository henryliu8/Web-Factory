export type ConfigValue = Record<string, unknown> | unknown[] | unknown;

/** Deep-merge objects while replacing arrays from the later layer. */
export function mergeConfig<T extends Record<string, unknown> = Record<string, unknown>>(...configs: readonly Record<string, unknown>[]): T {
  const result: Record<string, unknown> = {};

  for (const config of configs) {
    mergeInto(result, config);
  }

  return result as T;
}

function mergeInto(target: Record<string, unknown>, source: Record<string, unknown>): void {
  for (const [key, value] of Object.entries(source)) {
    if (isPlainObject(value) && isPlainObject(target[key])) {
      mergeInto(target[key] as Record<string, unknown>, value);
    } else {
      target[key] = cloneValue(value);
    }
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function cloneValue<T>(value: T): T {
  return isPlainObject(value) ? ({ ...value } as T) : Array.isArray(value) ? ([...value] as T) : value;
}
