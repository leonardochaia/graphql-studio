import { editor, languages } from 'monaco-editor';
import { MonacoEditor } from '../..';
import { debounce } from '../debounce';
import './variables-editor.module.scss';

// set these early on so that initial variables with comments don't flash an error
languages.json.jsonDefaults.setDiagnosticsOptions({
  allowComments: true,
  trailingCommas: 'ignore',
});

export interface VariablesEditorProps {
  action: editor.IActionDescriptor;
}

export function VariablesEditor(props: VariablesEditorProps) {
  function editorLoaded(e: editor.IStandaloneCodeEditor) {
    e.addAction(props.action);
    const model = e.getModel()!;
    model.onDidChangeContent(
      debounce(300, () => {
        localStorage.setItem('variables', model.getValue());
      })
    );
  }

  const defaultVariables =
    localStorage.getItem('variables') ??
    `{
  // Define queries with values to use variables
}`;

  return (
    <MonacoEditor
      filePath="variables.json"
      defaultValue={defaultVariables}
      editorLoaded={editorLoaded}
    ></MonacoEditor>
  );
}

export default VariablesEditor;
