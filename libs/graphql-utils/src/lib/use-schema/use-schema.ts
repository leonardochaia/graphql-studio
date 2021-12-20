import { getIntrospectionQuery, IntrospectionQuery } from 'graphql';
import { Uri } from 'monaco-editor';
import { initializeMode } from 'monaco-graphql/esm/initializeMode';
import { useEffect } from 'react';
import useFetcher from '../use-fetcher/use-fetcher';

export function useSchema(
  url: string
): [IntrospectionQuery | undefined, boolean] {
  const [schema, loading] = useFetcher<IntrospectionQuery>(
    url,
    getIntrospectionQuery(),
    'IntrospectionQuery'
  );

  useEffect(() => {
    if (!loading && schema) {
      initializeMode({
        diagnosticSettings: {
          validateVariablesJSON: {
            [Uri.file('operation.graphql').toString()]: [
              Uri.file('variables.json').toString(),
            ],
          },
          jsonDiagnosticSettings: {
            validate: true,
            schemaValidation: 'error',
            // set these again, because we are entirely re-setting them here
            allowComments: true,
            trailingCommas: 'ignore',
          },
        },
        schemas: [
          {
            introspectionJSON: schema,
            uri: url,
          },
        ],
      });

      return;
    }
  }, [schema, loading]);

  return [schema, loading];
}

export default useSchema;
