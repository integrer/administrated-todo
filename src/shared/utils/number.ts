export const isNaN = (val: unknown) => val !== val;

export const parseNumber = (input: unknown, defaultVal: number, minVal?: number): number => {
  if (input == null) return defaultVal;
  if (typeof input == 'number') {
    if (isNaN(input)) return defaultVal;
    return minVal != null && !isNaN(minVal) ? Math.max(input, minVal) : input;
  }
  return parseNumber(+input, defaultVal, minVal);
};
