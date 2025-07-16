"use client";

import { useState } from "react";
import { FileManager } from "@/components/file-manager";
import { LaTeXEditor } from "@/components/latex-editor";
import { LaTeXPreview } from "@/components/latex-preview";
import { useFileManager } from "@/hooks/use-file-manager";
import { PDFDownload } from "@/components/pdf-download";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Eye,
  Code,
  Settings,
  Monitor,
  Github,
  RefreshCw,
} from "lucide-react";

export default function Home() {
  const fileManager = useFileManager();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshPreview = () => {
    setIsRefreshing(true);
    // 模拟刷新延迟
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* 侧边栏 */}
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-2 py-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">LaTeX Editor</span>
                  <span className="text-xs text-muted-foreground">
                    Professional Web Editor
                  </span>
                </div>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <FileManager
              files={fileManager.files}
              currentFileId={fileManager.currentFileId}
              onFileSelect={fileManager.selectFile}
              onFileCreate={fileManager.createFile}
              onFileDelete={fileManager.deleteFile}
              onFileRename={fileManager.renameFile}
              onFileUpload={fileManager.uploadFile}
            />
          </SidebarContent>

          <SidebarFooter>
            <div className="flex items-center justify-between px-2 py-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Monitor className="h-3 w-3" />
                <span>v1.0.0</span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <Github className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* 主内容区域 */}
        <SidebarInset>
          <header className="flex h-14 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-6" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Project</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {fileManager.currentFile?.name || "No File"}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex items-center gap-2">
              <Badge variant="secondary" className="hidden sm:flex">
                {fileManager.files.length} Files
              </Badge>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </header>

          <div className="flex flex-1 overflow-hidden">
            {fileManager.currentFile ? (
              <>
                {/* 编辑器区域 */}
                <div className="flex-1 flex flex-col border-r">
                  <div className="flex items-center gap-2 px-4 py-2 border-b bg-muted/40 h-12">
                    <Code className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Editor</span>
                  </div>
                  <div className="flex-1 p-2">
                    <LaTeXEditor
                      value={fileManager.currentContent}
                      onChange={fileManager.updateCurrentContent}
                      fileName={fileManager.currentFile.name}
                      className="h-full"
                    />
                  </div>
                </div>

                {/* 预览区域 */}
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-2 px-4 py-2 border-b bg-muted/40 h-12">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Preview</span>
                    <Badge variant="secondary" className="ml-auto">
                      PDF
                    </Badge>
                    <PDFDownload
                      content={fileManager.currentContent}
                      fileName={
                        fileManager.currentFile?.name?.replace(".tex", "") ||
                        "document"
                      }
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRefreshPreview}
                      disabled={isRefreshing}
                      className="h-7 w-7 p-0"
                    >
                      <RefreshCw
                        className={`h-3 w-3 ${
                          isRefreshing ? "animate-spin" : ""
                        }`}
                      />
                    </Button>
                  </div>
                  <div className="flex-1 p-2 overflow-hidden">
                    <LaTeXPreview
                      content={fileManager.currentContent}
                      className="h-full"
                    />
                  </div>
                </div>
              </>
            ) : (
              // 空状态
              <div className="flex-1 flex items-center justify-center p-8">
                <Card className="w-full max-w-md">
                  <CardHeader className="text-center pb-6">
                    <div className="flex justify-center mb-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <FileText className="h-8 w-8" />
                      </div>
                    </div>
                    <CardTitle className="text-xl">
                      Welcome to LaTeX Editor
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                      Start creating your first LaTeX document
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      onClick={() =>
                        fileManager.createFile(
                          "New Document.tex",
                          "\\documentclass{article}\n\\usepackage[utf8]{inputenc}\n\\title{My Document}\n\\author{Author}\n\\date{\\today}\n\n\\begin{document}\n\\maketitle\n\n\\section{Introduction}\nThis is a new LaTeX document.\n\n\\end{document}"
                        )
                      }
                      className="w-full"
                    >
                      <Code className="h-4 w-4 mr-2" />
                      New Document
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = ".tex";
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement)
                            .files?.[0];
                          if (file) {
                            fileManager.uploadFile(file);
                          }
                        };
                        input.click();
                      }}
                      className="w-full"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
