"use client";

import { useRef } from "react";
import { Editor } from "@monaco-editor/react";

interface LaTeXEditorProps {
  value: string;
  onChange: (value: string) => void;
  fileName?: string;
  readOnly?: boolean;
  className?: string;
}

export function LaTeXEditor({
  value,
  onChange,
  readOnly = false,
  className = "",
}: LaTeXEditorProps) {
  const editorRef = useRef<unknown>(null);

  const handleEditorDidMount = (editor: unknown, monaco: unknown) => {
    editorRef.current = editor;

    // Configure LaTeX language support
    const monacoInstance = monaco as typeof import("monaco-editor");
    monacoInstance.languages.register({ id: "latex" });

    // Define LaTeX syntax highlighting
    monacoInstance.languages.setMonarchTokensProvider("latex", {
      tokenizer: {
        root: [
          // Comments
          [/%.*$/, "comment"],

          // Commands
          [/\\[a-zA-Z]+\*?/, "keyword"],

          // Environments
          [/\\begin\{[^}]+\}/, "tag"],
          [/\\end\{[^}]+\}/, "tag"],

          // Math delimiters
          [/\$\$/, "string.escape"],
          [/\$/, "string.escape"],
          [/\\\[/, "string.escape"],
          [/\\\]/, "string.escape"],
          [/\\\(/, "string.escape"],
          [/\\\)/, "string.escape"],

          // Braces
          [/\{/, "delimiter.curly"],
          [/\}/, "delimiter.curly"],
          [/\[/, "delimiter.square"],
          [/\]/, "delimiter.square"],

          // Special characters
          [/[&%#]/, "string"],

          // Numbers
          [/\d+/, "number"],

          // Strings
          [/"([^"\\]|\\.)*$/, "string.invalid"],
          [/"/, "string", "@string"],
        ],

        string: [
          [/[^\\"]+/, "string"],
          [/\\./, "string.escape"],
          [/"/, "string", "@pop"],
        ],
      },
    });

    // Set theme for LaTeX
    monacoInstance.editor.defineTheme("latex-theme", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6A9955" },
        { token: "keyword", foreground: "569CD6" },
        { token: "tag", foreground: "4EC9B0" },
        { token: "string", foreground: "CE9178" },
        { token: "string.escape", foreground: "D7BA7D" },
        { token: "number", foreground: "B5CEA8" },
        { token: "delimiter.curly", foreground: "FFD700" },
        { token: "delimiter.square", foreground: "DA70D6" },
      ],
      colors: {
        "editor.background": "#1e1e1e",
        "editor.foreground": "#d4d4d4",
        "editor.lineHighlightBackground": "#2d2d2d",
        "editor.selectionBackground": "#264F78",
        "editor.inactiveSelectionBackground": "#3A3D41",
      },
    });

    // Configure editor options
    const editorInstance =
      editor as import("monaco-editor").editor.IStandaloneCodeEditor;
    editorInstance.updateOptions({
      fontSize: 14,
      lineHeight: 1.5,
      wordWrap: "on",
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      folding: true,
      lineNumbers: "on",
      rulers: [80],
      renderWhitespace: "selection",
      bracketPairColorization: { enabled: true },
    });

    // Set initial theme
    monacoInstance.editor.setTheme("latex-theme");
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  return (
    <div className={`h-full border rounded-lg overflow-hidden ${className}`}>
      <Editor
        height="100%"
        language="latex"
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          theme: "latex-theme",
          fontSize: 14,
          lineHeight: 1.5,
          wordWrap: "on",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          folding: true,
          lineNumbers: "on",
          rulers: [80],
          renderWhitespace: "selection",
          bracketPairColorization: { enabled: true },
          padding: { top: 8, bottom: 8 },
          suggest: {
            showKeywords: true,
            showSnippets: true,
            showFunctions: true,
          },
        }}
      />
    </div>
  );
}
