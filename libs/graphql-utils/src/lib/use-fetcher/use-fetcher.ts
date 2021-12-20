import { createGraphiQLFetcher, Fetcher } from '@graphiql/toolkit';
import * as JSONC from 'jsonc-parser';
import { useEffect, useState } from 'react';
import { fetcherReturnToPromise } from '../fetcher.utils';

export function useFetcher<TResult>(
  url: string,
  query: string,
  operationName: string = '',
  variables?: string
): [TResult | undefined, boolean, unknown] {
  const createFetcher = () =>
    createGraphiQLFetcher({
      url,
    });

  const [fetcher, setFetcher] = useState<Fetcher>(createFetcher);
  const [response, setResponse] = useState<TResult>();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    fetcherReturnToPromise(
      fetcher({
        query,
        variables: variables
          ? JSON.stringify(JSONC.parse(variables))
          : undefined,
        operationName,
      })
    )
      .then((result) => {
        setResponse(result.data as TResult);
        setIsLoading(false);
      })
      .catch((e) => {
        setError(e);
        setIsLoading(false);
      });
  }, [fetcher]);

  return [response, isLoading, error];
}

export default useFetcher;
