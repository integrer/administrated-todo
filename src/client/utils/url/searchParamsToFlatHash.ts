const searchParamsToFlatHash = (searchParams: URLSearchParams): Record<string, string> =>
  Array.from(searchParams).reduce((acc: Record<string, string>, [k, v]) => {
    if (!acc[k]) acc[k] = v;
    return acc;
  }, {});

export default searchParamsToFlatHash;
