import { editor } from 'monaco-editor';
import { MonacoEditor } from '../..';
import { debounce } from '../debounce';
import './query-editor.module.scss';

export interface QueryEditorProps {
  action: editor.IActionDescriptor;
}

export function QueryEditor(props: QueryEditorProps) {
  function editorLoaded(e: editor.IStandaloneCodeEditor) {
    e.addAction(props.action);
    const model = e.getModel()!;
    model.onDidChangeContent(
      debounce(300, () => {
        localStorage.setItem('operations', model.getValue());
      })
    );
  }

  const defaultVariables =
    localStorage.getItem('operations') ??
    `
    # cmd/ctrl + return/enter will execute the op,
    # same in variables editor below
    # also available via context menu & f1 command palette
    query($limit: Int!) {
        payloads(limit: $limit) {
            customer
        }
    }`;

  return (
    <MonacoEditor
      filePath="operation.graphql"
      defaultValue={defaultVariables}
      editorLoaded={editorLoaded}
    ></MonacoEditor>
  );
}

export default QueryEditor;
