"use client";

import { useState, useCallback } from "react";

export interface FileItem {
  id: string;
  name: string;
  content: string;
  type: "tex" | "pdf";
  createdAt: Date;
  updatedAt: Date;
}

export function useFileManager() {
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: "1",
      name: "example.tex",
      content: `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{amsfonts}
\\usepackage{amssymb}

\\title{Example Document}
\\author{LaTeX Editor}
\\date{\\today}

\\begin{document}

\\maketitle

\\section{Introduction}
This is an example document created using the LaTeX editor. You can write your content here.

\\subsection{Mathematical Formulas}
Here are some examples of mathematical formulas:

Inline formula: $E = mc^2$

Block formula:
$$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$

\\subsection{Text Formatting}
\\textbf{Bold text}

\\textit{Italic text}

\\underline{Underlined text}

\\section{Lists}
\\subsection{Unordered List}
\\begin{itemize}
\\item First item
\\item Second item
\\item Third item
\\end{itemize}

\\subsection{Ordered List}
\\begin{enumerate}
\\item First item
\\item Second item
\\item Third item
\\end{enumerate}

\\section{Conclusion}
This is a simple LaTeX document example. You can modify this content to create your own document. 

\\end{document}`,
      type: "tex",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const [currentFileId, setCurrentFileId] = useState<string>("1");
  const [currentContent, setCurrentContent] = useState<string>(
    files[0]?.content || ""
  );

  // 调试信息
  console.log("File Manager - files:", files.length);
  console.log("File Manager - currentContent length:", currentContent.length);

  const currentFile = files.find((f) => f.id === currentFileId);

  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const createFile = useCallback((name: string, content: string) => {
    const newFile: FileItem = {
      id: generateId(),
      name,
      content,
      type: "tex",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setFiles((prev) => [...prev, newFile]);
    setCurrentFileId(newFile.id);
    setCurrentContent(content);
  }, []);

  const deleteFile = useCallback(
    (id: string) => {
      setFiles((prev) => {
        const filtered = prev.filter((f) => f.id !== id);

        // 如果删除的是当前文件，切换到第一个文件
        if (id === currentFileId) {
          const firstFile = filtered[0];
          if (firstFile) {
            setCurrentFileId(firstFile.id);
            setCurrentContent(firstFile.content);
          } else {
            setCurrentFileId("");
            setCurrentContent("");
          }
        }

        return filtered;
      });
    },
    [currentFileId]
  );

  const renameFile = useCallback((id: string, newName: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, name: newName, updatedAt: new Date() } : f
      )
    );
  }, []);

  const selectFile = useCallback(
    (file: FileItem) => {
      // 保存当前文件的内容
      if (currentFileId && currentFileId !== file.id) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === currentFileId
              ? { ...f, content: currentContent, updatedAt: new Date() }
              : f
          )
        );
      }

      setCurrentFileId(file.id);
      setCurrentContent(file.content);
    },
    [currentFileId, currentContent]
  );

  const updateCurrentContent = useCallback(
    (content: string) => {
      setCurrentContent(content);

      // 实时更新文件内容（去抖动效果在组件层面处理）
      if (currentFileId) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === currentFileId
              ? { ...f, content, updatedAt: new Date() }
              : f
          )
        );
      }
    },
    [currentFileId]
  );

  const uploadFile = useCallback(
    (file: File) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target?.result as string;
        const fileName = file.name;

        createFile(fileName, content);
      };

      reader.readAsText(file);
    },
    [createFile]
  );

  return {
    files,
    currentFile,
    currentFileId,
    currentContent,
    createFile,
    deleteFile,
    renameFile,
    selectFile,
    updateCurrentContent,
    uploadFile,
  };
}
