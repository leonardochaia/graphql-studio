import { createGraphiQLFetcher } from '@graphiql/toolkit';
import * as JSONC from 'jsonc-parser';
import { useEffect, useState } from 'react';
import { fetcherReturnToPromise } from '../fetcher.utils';

/**
 * Executes a GQL query when query or variables changes.
 * If no query is provided, undefined is returned
 * @param url The GQL endpoint to use when fetching
 * @param query The GQL query to execute
 * @param operationName Optional operation name
 * @param variables Optional variables
 * @returns The output of executing the query or undefined if no query is provided
 */
export function useFetcher<TResult>(
  url: string,
  query?: string,
  operationName: string = '',
  variables?: string
): [TResult | undefined, boolean, unknown] {
  const fetcher = createGraphiQLFetcher({
    url,
  });

  const [response, setResponse] = useState<TResult>();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    if (!query) {
      setResponse(undefined);
      setIsLoading(false);
      return;
    }

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
  }, [query, variables]);

  return [response, isLoading, error];
}

export default useFetcher;
