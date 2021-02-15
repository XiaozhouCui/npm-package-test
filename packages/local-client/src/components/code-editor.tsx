import { useRef } from "react";
import MonacoEditor, { EditorDidMount } from "@monaco-editor/react";
import prettier from "prettier";
import parser from "prettier/parser-babel";
import "./code-editor.css";

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onChange, initialValue }) => {
  // useRef can be used to store monacoEditor object
  const editorRef = useRef<any>();

  // dynamically update the parent state with code editor input
  const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
    // reference the monacoEditor instance to be used OUTSIDE this function
    editorRef.current = monacoEditor;
    // get the input value on every key press
    monacoEditor.onDidChangeModelContent(() => {
      // bind to setInput from parent component
      onChange(getValue());
    });

    // change tab size: 2
    monacoEditor.getModel()?.updateOptions({ tabSize: 2 });
  };

  // click button to use prettier to format the user input
  const onFormatClick = () => {
    // get monaco editor object from useRef()
    // then get current value from monaco editor using its methods
    const unformatted = editorRef.current.getModel().getValue();

    // format that value
    const formatted = prettier
      .format(unformatted, {
        parser: "babel",
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true,
      })
      .replace(/\n$/, ""); // remove the new line at the end of code

    // set the formatted value back in the editor
    editorRef.current.setValue(formatted);
  };

  return (
    <div className="editor-wrapper">
      <button
        className="button button-format is-primary is-small"
        onClick={onFormatClick}
      >
        Format
      </button>
      <MonacoEditor
        editorDidMount={onEditorDidMount}
        value={initialValue}
        theme="dark"
        language="javascript"
        height="100%"
        options={{
          wordWrap: "on",
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
