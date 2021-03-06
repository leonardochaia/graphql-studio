import {
  QueryEditor,
  QueryResultPreview,
  VariablesEditor,
} from '@graphql-studio/editor-ui';
import { useFetcher, useSchema } from '@graphql-studio/graphql-utils';
import { editor, KeyCode, KeyMod, Uri } from 'monaco-editor';
import { useEffect, useState } from 'react';

const url = 'https://api.spacex.land/graphql/';

export default function App() {
  const [schema, loadingSchema] = useSchema(url);

  const [currentQuery, setCurrentQuery] = useState<string>();
  const [currentVariables, setCurrentVariables] = useState<string>();

  const [resultOutput, loadingResult, resultError] = useFetcher(
    url,
    currentQuery,
    '',
    currentVariables
  );

  // When the current result changes, update the results editor
  useEffect(() => {
    if (!resultOutput) return;

    const resultsModel = editor.getModel(Uri.file('results.json'));
    resultsModel?.setValue(JSON.stringify(resultOutput, null, 2));
  }, [resultOutput]);

  // When Run Operation is triggered
  // update state with current editor values
  const execOperation = () => {
    const operations = editor
      .getModel(Uri.file('operation.graphql'))
      ?.getValue();
    const variables = editor.getModel(Uri.file('variables.json'))?.getValue();

    setCurrentQuery(operations);
    setCurrentVariables(variables);
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

  return loadingSchema ? (
    <div className="loading-wrapper">
      <div className="loading-schema">Loading Schema</div>
    </div>
  ) : (
    <div className="wrapper">
      <div style={{ background: '#2aa9c0' }}>
        <div>SpaceX</div>
      </div>
      <div className="pane left-pane">
        <QueryEditor action={queryAction}></QueryEditor>
        <VariablesEditor action={queryAction}></VariablesEditor>
      </div>
      <div className="pane right-pane">
        <QueryResultPreview></QueryResultPreview>
      </div>
    </div>
  );
}
