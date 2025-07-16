"use client";

import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import katex from "katex";

interface PDFDownloadProps {
  content: string;
  fileName?: string;
  className?: string;
}

export function PDFDownload({
  content,
  fileName = "document",
  className = "",
}: PDFDownloadProps) {
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleDownload = useCallback(() => {
    if (!content.trim()) {
      alert("No content to download");
      return;
    }

    if (isGenerating) {
      return; // 防止重复点击
    }

    setIsGenerating(true);

    // 处理LaTeX内容
    const processedContent = processLaTeXContent(content);

    // 创建一个临时的HTML元素，使用更好的隐藏方式避免页面抖动
    const tempElement = document.createElement("div");

    // 设置样式，完全避免影响页面布局
    tempElement.style.cssText = `
      position: fixed !important;
      top: -10000px !important;
      left: -10000px !important;
      width: 210mm !important;
      min-height: 297mm !important;
      visibility: hidden !important;
      pointer-events: none !important;
      z-index: -1 !important;
      overflow: hidden !important;
    `;

    tempElement.innerHTML = `
      <style>
        body {
          font-family: "Computer Modern", "Times New Roman", serif;
          line-height: 1.6;
          color: #333;
          background: white;
          margin: 0;
          padding: 2rem;
        }
        
        .latex-preview {
          font-family: "Computer Modern", "Times New Roman", serif;
          line-height: 1.6;
          color: #333;
          background: white;
          padding: 0;
        }
        
        .latex-preview h1,
        .latex-preview h2,
        .latex-preview h3,
        .latex-preview h4,
        .latex-preview h5,
        .latex-preview h6 {
          color: #1f2937;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
        }
        
        .latex-preview h1 {
          font-size: 2rem;
          text-align: center;
          margin-bottom: 1.5rem;
        }
        
        .latex-preview h2 {
          font-size: 1.5rem;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 0.5rem;
        }
        
        .latex-preview h3 {
          font-size: 1.25rem;
        }
        
        .latex-preview p {
          margin-bottom: 1rem;
          text-align: justify;
        }
        
        .latex-preview .title {
          font-size: 2.5rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 1rem;
          color: #1f2937;
        }
        
        .latex-preview .author {
          font-size: 1.25rem;
          text-align: center;
          margin-bottom: 0.5rem;
          color: #4b5563;
        }
        
        .latex-preview .date {
          font-size: 1rem;
          text-align: center;
          margin-bottom: 2rem;
          color: #6b7280;
        }
        
        .latex-preview ul,
        .latex-preview ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }
        
        .latex-preview li {
          margin-bottom: 0.5rem;
        }
        
        .latex-preview .katex {
          font-size: 1.1em;
        }
        
        .latex-preview .katex-display {
          margin: 1rem 0;
          text-align: center;
        }
        
        .latex-preview strong {
          font-weight: 700;
        }
        
        .latex-preview em {
          font-style: italic;
        }
        
        .latex-preview code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-family: "Monaco", "Menlo", monospace;
        }
        
        .math-error {
          color: #dc2626;
          background-color: #fee2e2;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
        }
        
        .error {
          color: #dc2626;
          background-color: #fee2e2;
          padding: 1rem;
          border-radius: 0.5rem;
          border: 1px solid #fecaca;
        }
      </style>
      <div class="latex-preview">
        ${processedContent}
      </div>
    `;

    // 使用 requestAnimationFrame 确保DOM操作不会阻塞页面渲染
    requestAnimationFrame(() => {
      // 将临时元素添加到document中（完全隐藏，不影响布局）
      document.body.appendChild(tempElement);

      // 配置html2pdf选项
      const opt = {
        margin: 1,
        filename: `${fileName}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
        },
        jsPDF: {
          unit: "in",
          format: "a4",
          orientation: "portrait",
        },
      };

      // 动态导入html2pdf.js以避免服务器端渲染错误
      // @ts-expect-error - html2pdf.js doesn't have TypeScript definitions
      import("html2pdf.js")
        .then((html2pdf) => {
          // 生成并下载PDF
          return html2pdf.default().set(opt).from(tempElement).save();
        })
        .then(() => {
          // 清理临时元素
          if (document.body.contains(tempElement)) {
            document.body.removeChild(tempElement);
          }
          setIsGenerating(false);
        })
        .catch((error: unknown) => {
          console.error("PDF生成失败:", error);
          alert("PDF生成失败，请重试");
          // 清理临时元素
          if (document.body.contains(tempElement)) {
            document.body.removeChild(tempElement);
          }
          setIsGenerating(false);
        });
    });
  }, [content, fileName, processLaTeXContent, isGenerating]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDownload}
      disabled={isGenerating}
      className={`h-7 w-7 p-0 ${className}`}
      title={isGenerating ? "Generating PDF..." : "Download PDF"}
    >
      {isGenerating ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Download className="h-3 w-3" />
      )}
    </Button>
  );
}
