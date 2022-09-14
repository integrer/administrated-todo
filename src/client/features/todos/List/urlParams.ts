import { compose } from 'ramda';
import { useEffect, useMemo } from 'react';
import { useEventCallback } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useShallowStableValue } from '@app/client/utils';
import { applySlice, searchParamsToFlatHash } from '@app/client/utils/url';
import { ITodoListParams, parseTodoListParams } from '@app/shared/features/todos';

const defaultValues = parseTodoListParams({});

const parseParams = compose(parseTodoListParams, searchParamsToFlatHash);

const omitDefaults = (params: URLSearchParams) => {
  const parsedParams = parseParams(params);
  return (Object.keys(defaultValues) as (keyof typeof defaultValues)[]).reduce((acc, k) => {
    if (parsedParams[k] === defaultValues[k]) acc.delete(k);
    return acc;
  }, new URLSearchParams(params));
};

type InputParams = Partial<ITodoListParams>;
type NavigateOptions = Parameters<ReturnType<typeof useSearchParams>[1]>[1];

export const useTodoListUrlParams = () => {
  const [searchParamsRaw, setSearchParamsRaw] = useSearchParams();
  const searchParams = useShallowStableValue(useMemo(() => parseParams(searchParamsRaw), [searchParamsRaw]));

  useEffect(() => {
    const newParams = omitDefaults(searchParamsRaw);
    newParams.sort();
    if ('' + newParams !== '' + searchParamsRaw) setSearchParamsRaw(newParams, { replace: true });
  }, [searchParamsRaw, setSearchParamsRaw]);

  function setSearchParams(params: InputParams, navigateOptions?: NavigateOptions) {
    const newParams = omitDefaults(applySlice(searchParamsRaw, params));
    newParams.sort();
    if ('' + newParams !== '' + searchParamsRaw) setSearchParamsRaw(newParams, navigateOptions);
  }

  return [searchParams, useEventCallback(setSearchParams)] as const;
};
