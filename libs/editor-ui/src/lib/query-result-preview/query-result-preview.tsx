import { editor } from 'monaco-editor';
import MonacoEditor from '../monaco-editor/monaco-editor';
import './query-result-preview.module.scss';

export function QueryResultPreview() {
  const extraOptions: editor.IStandaloneEditorConstructionOptions = {
    readOnly: true,
    wordWrap: 'on',
    showFoldingControls: 'always',
  };

  return (
    <MonacoEditor
      filePath="results.json"
      defaultValue="// CTRL + Enter to submit"
      extraOptions={extraOptions}
    ></MonacoEditor>
  );
}
