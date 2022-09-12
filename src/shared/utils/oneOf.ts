import { Scalar } from './types';

export const oneOf = <T extends Scalar>(...variants: readonly T[]): ((value: unknown) => value is T) => {
  const set = new Set(variants);
  return (v): v is T => set.has(v as never);
};

export const oneOfOr = <T extends Scalar>(...variants: readonly T[]): ((value: unknown, defaultValue: T) => T) => {
  const matches = oneOf(...variants);
  return (v, defV): T => (matches(v) ? v : defV);
};

export const oneOfOrNull = <T extends Exclude<Scalar, null>>(
  ...variants: readonly T[]
): ((value: unknown) => T | null) => {
  const inner = oneOfOr<T | null>(...variants);
  return (v): T | null => inner(v, null);
};
