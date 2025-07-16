"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface LaTeXPreviewProps {
  content: string;
  className?: string;
}

export function LaTeXPreview({ content, className = "" }: LaTeXPreviewProps) {
  const [renderedContent, setRenderedContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const processLaTeXContent = useCallback((latex: string): string => {
    try {
      // Extract document content
      const documentMatch = latex.match(
        /\\begin\{document\}([\s\S]*?)\\end\{document\}/
      );
      if (!documentMatch) {
        return "<p>Please add content between \\begin{document} and \\end{document}</p>";
      }

      let content = documentMatch[1].trim();

      // Extract title, author, date from the full latex content
      const titleMatch = latex.match(/\\title\{([^}]+)\}/);
      const authorMatch = latex.match(/\\author\{([^}]+)\}/);
      const dateMatch = latex.match(/\\date\{([^}]+)\}/);

      // Handle maketitle
      if (content.includes("\\maketitle")) {
        let titleSection = "";
        if (titleMatch) {
          titleSection += `<h1 class="title">${titleMatch[1]}</h1>`;
        }
        if (authorMatch) {
          titleSection += `<p class="author">${authorMatch[1]}</p>`;
        }
        if (dateMatch) {
          let dateText = dateMatch[1];
          if (dateText === "\\today") {
            dateText = new Date().toLocaleDateString("zh-CN");
          }
          titleSection += `<p class="date">${dateText}</p>`;
        }
        content = content.replace(/\\maketitle/g, titleSection);
      }

      // Handle sections
      content = content.replace(/\\section\{([^}]+)\}/g, "<h2>$1</h2>");
      content = content.replace(/\\subsection\{([^}]+)\}/g, "<h3>$1</h3>");
      content = content.replace(/\\subsubsection\{([^}]+)\}/g, "<h4>$1</h4>");

      // Handle text formatting
      content = content.replace(/\\textbf\{([^}]+)\}/g, "<strong>$1</strong>");
      content = content.replace(/\\textit\{([^}]+)\}/g, "<em>$1</em>");
      content = content.replace(/\\underline\{([^}]+)\}/g, "<u>$1</u>");

      // Handle lists
      content = content.replace(
        /\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g,
        (match, items) => {
          const processedItems = items
            .replace(/\\item\s/g, "<li>")
            .replace(/\n\s*(?=<li>)/g, "</li>\n");
          return `<ul>${processedItems}</li></ul>`;
        }
      );

      content = content.replace(
        /\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g,
        (match, items) => {
          const processedItems = items
            .replace(/\\item\s/g, "<li>")
            .replace(/\n\s*(?=<li>)/g, "</li>\n");
          return `<ol>${processedItems}</li></ol>`;
        }
      );

      // Handle math environments
      content = content.replace(/\$\$([^$]+)\$\$/g, (match, math) => {
        try {
          return katex.renderToString(math, {
            displayMode: true,
            throwOnError: false,
          });
        } catch {
          return `<span class="math-error">[Math Error: ${math}]</span>`;
        }
      });

      content = content.replace(/\$([^$]+)\$/g, (match, math) => {
        try {
          return katex.renderToString(math, {
            displayMode: false,
            throwOnError: false,
          });
        } catch {
          return `<span class="math-error">[Math Error: ${math}]</span>`;
        }
      });

      // Handle line breaks
      content = content.replace(/\\\\/g, "<br>");

      // Split content into paragraphs and process them
      const paragraphs = content.split(/\n\s*\n/).filter((p) => p.trim());

      content = paragraphs
        .map((paragraph) => {
          const trimmed = paragraph.trim();
          if (
            trimmed.startsWith("<h") ||
            trimmed.startsWith("<ul") ||
            trimmed.startsWith("<ol") ||
            trimmed.startsWith("<div")
          ) {
            return trimmed;
          }
          return `<p>${trimmed}</p>`;
        })
        .join("\n");

      return content;
    } catch (e) {
      return `<p class="error">Preview rendering error: ${
        e instanceof Error ? e.message : "Unknown error"
      }</p>`;
    }
  }, []);

  const updatePreview = useCallback(() => {
    setError(null);

    try {
      const processed = processLaTeXContent(content);
      setRenderedContent(processed);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Rendering error");
    }
  }, [content, processLaTeXContent]);

  useEffect(() => {
    const timer = setTimeout(() => {
      updatePreview();
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [updatePreview]);

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex-1 overflow-hidden">
        {error ? (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        ) : (
          <div
            className="latex-preview h-full overflow-y-auto"
            dangerouslySetInnerHTML={{ __html: renderedContent }}
          />
        )}
      </div>
    </div>
  );
}
