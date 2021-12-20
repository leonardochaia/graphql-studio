import {
  QueryEditor,
  QueryResultPreview,
  VariablesEditor,
} from '@gql-web-editor/editor-ui';
import {
  fetcherReturnToPromise,
  useSchema,
} from '@gql-web-editor/graphql-utils';
import { createGraphiQLFetcher } from '@graphiql/toolkit';
import * as JSONC from 'jsonc-parser';
import { editor, KeyCode, KeyMod, Uri } from 'monaco-editor';

const url = 'https://api.spacex.land/graphql/';

const fetcher = createGraphiQLFetcher({
  url,
});

const execOperation = async function () {
  const variables = editor.getModel(Uri.file('variables.json'))!.getValue();
  const operations = editor.getModel(Uri.file('operation.graphql'))!.getValue();
  const resultsModel = editor.getModel(Uri.file('results.json'));

  const result = await fetcherReturnToPromise(
    fetcher({
      query: operations,
      variables: JSON.stringify(JSONC.parse(variables)),
      operationName: '',
    })
  );

  resultsModel?.setValue(JSON.stringify(result.data, null, 2));
};

const queryAction = {
  id: 'graphql-run',
  label: 'Run Operation',
  contextMenuOrder: 0,
  contextMenuGroupId: 'graphql',
  keybindings: [
    // eslint-disable-next-line no-bitwise
    KeyMod.CtrlCmd | KeyCode.Enter,
  ],
  run: execOperation,
};

export default function App() {
  const [schema, loading] = useSchema(url);

  return (
    <div id="wrapper">
      <div id="left-pane" className="pane">
        <QueryEditor action={queryAction}></QueryEditor>
        <VariablesEditor action={queryAction}></VariablesEditor>
      </div>
      <div id="right-pane" className="pane">
        <QueryResultPreview></QueryResultPreview>
      </div>
    </div>
  );
}
