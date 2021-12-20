import { editor, Uri } from 'monaco-editor';
import { MutableRefObject } from 'react';

export function getOrCreateEditorModel(uri: string, value: string) {
  return (
    editor.getModel(Uri.file(uri)) ??
    editor.createModel(value, uri.split('.').pop(), Uri.file(uri))
  );
}

export function createEditor(
  ref: MutableRefObject<null>,
  options: editor.IStandaloneEditorConstructionOptions
) {
  return editor.create(ref.current as unknown as HTMLElement, {
    theme: 'vs-dark',
    ...options,
  });
}
