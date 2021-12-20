import { editor } from 'monaco-editor';
import React, { useEffect } from 'react';
import { createEditor, getOrCreateEditorModel } from '../editor.utils';
import './monaco-editor.module.scss';

export interface MonacoEditorProps {
  filePath: string;
  defaultValue?: string;
  extraOptions?: editor.IStandaloneEditorConstructionOptions;

  editorLoaded?: (editor: editor.IStandaloneCodeEditor) => void;
}

export function MonacoEditor(props: MonacoEditorProps) {
  const elementRef = React.useRef(null);
  const [currentEditor, setCurrentEditor] =
    React.useState<editor.IStandaloneCodeEditor | null>(null);

  const resultsModel = getOrCreateEditorModel(
    props.filePath,
    props.defaultValue ?? ''
  );

  useEffect(() => {
    currentEditor ??
      setCurrentEditor(
        createEditor(elementRef, {
          model: resultsModel,
          ...props.extraOptions,
        })
      );
  }, []);

  useEffect(() => {
    currentEditor && props.editorLoaded && props.editorLoaded(currentEditor!);
  }, [currentEditor]);

  return <div ref={elementRef} className="editor" />;
}

export default MonacoEditor;
