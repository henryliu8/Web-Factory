export type ConfigObject = Record<string, unknown>;

/**
 * Merge configuration from lowest to highest precedence.
 * Plain objects are merged recursively; arrays and all other values are replaced.
 * Inputs are never mutated and the result does not share nested arrays or objects.
 */
export function mergeConfig<T extends ConfigObject = ConfigObject>(
  ...configs: readonly ConfigObject[]
): T {
  const result: ConfigObject = {};

  for (const config of configs) {
    mergeInto(result, config);
  }

  return result as T;
}

function mergeInto(target: ConfigObject, source: ConfigObject): void {
  for (const [key, sourceValue] of Object.entries(source)) {
    const targetValue = target[key];
    if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
      mergeInto(targetValue, sourceValue);
      continue;

    }

    target[key] = cloneValue(sourceValue);
  }
}

function cloneValue<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => cloneValue(item)) as T;
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, cloneValue(item)]),
    ) as T;
  }

  return value;
}

function isPlainObject(value: unknown): value is ConfigObject {
  if (value === null || typeof value !== 'object') return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
