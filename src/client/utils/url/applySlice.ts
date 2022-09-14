const isValuable = <V>(v: V): v is Exclude<V, null | undefined | ''> => !!v || v !== 0 || v !== false;

export type SearchParamsInputValue = string | number | boolean | null | undefined;

const applySlice = (source: URLSearchParams, slice: Partial<Record<string, SearchParamsInputValue>>): URLSearchParams =>
  Object.keys(slice).reduce((acc, k) => {
    const v = slice[k];
    if (isValuable(v)) acc.set(k, v.toString());
    else acc.delete(k);
    return acc;
  }, new URLSearchParams(source));

export default applySlice;
