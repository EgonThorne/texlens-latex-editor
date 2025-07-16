"use client";

import { useState } from "react";
import {
  FileText,
  Plus,
  Upload,
  MoreHorizontal,
  Trash2,
  Edit,
  FolderOpen,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

interface FileItem {
  id: string;
  name: string;
  content: string;
  type: "tex" | "pdf";
  createdAt: Date;
  updatedAt: Date;
}

interface FileManagerProps {
  files: FileItem[];
  currentFileId?: string;
  onFileSelect: (file: FileItem) => void;
  onFileCreate: (name: string, content: string) => void;
  onFileDelete: (id: string) => void;
  onFileRename: (id: string, newName: string) => void;
  onFileUpload: (file: File) => void;
}

export function FileManager({
  files,
  currentFileId,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename,
  onFileUpload,
}: FileManagerProps) {
  const [newFileName, setNewFileName] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [renameFileId, setRenameFileId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      const fileName = newFileName.endsWith(".tex")
        ? newFileName
        : `${newFileName}.tex`;
      onFileCreate(
        fileName,
        "\\documentclass{article}\n\\usepackage[utf8]{inputenc}\n\\title{My Document}\n\\author{Author}\n\\date{\\today}\n\n\\begin{document}\n\\maketitle\n\n\\section{Introduction}\nThis is a new LaTeX document.\n\n\\end{document}"
      );
      setNewFileName("");
      setIsCreateDialogOpen(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleRename = () => {
    if (renameFileId && renameValue.trim()) {
      const fileName = renameValue.endsWith(".tex")
        ? renameValue
        : `${renameValue}.tex`;
      onFileRename(renameFileId, fileName);
      setRenameFileId(null);
      setRenameValue("");
      setIsRenameDialogOpen(false);
    }
  };

  const startRename = (file: FileItem) => {
    setRenameFileId(file.id);
    setRenameValue(file.name.replace(".tex", ""));
    setIsRenameDialogOpen(true);
  };

  return (
    <div className="space-y-3">
      {/* 文件操作区域 */}
      <SidebarGroup>
        <SidebarGroupLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
          <FolderOpen className="h-4 w-4" />
          File Manager
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <div className="space-y-3 p-2">
            {/* 搜索栏 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-8"
              />
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-2">
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button size="sm" className="flex-1 h-8" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    New
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      New File
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="filename"
                        className="text-right font-medium"
                      >
                        File Name
                      </Label>
                      <Input
                        id="filename"
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)}
                        placeholder="document.tex"
                        className="col-span-3"
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleCreateFile()
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreateFile}>Create</Button>
                  </div>
                </DialogContent>
              </Dialog>

              <div className="relative flex-1">
                <input
                  type="file"
                  accept=".tex"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button size="sm" variant="outline" className="w-full h-8">
                  <Upload className="h-4 w-4 mr-1" />
                  Upload
                </Button>
              </div>
            </div>
          </div>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* 文件列表 */}
      <SidebarGroup>
        <SidebarGroupLabel className="text-sm font-semibold text-foreground flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            File List
          </div>
          {filteredFiles.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {filteredFiles.length}
            </Badge>
          )}
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu className="space-y-1">
            {filteredFiles.length === 0 ? (
              <div className="px-2 py-6 text-center text-muted-foreground">
                <FileText className="h-6 w-6 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  {searchQuery ? "No matching files found" : "No files"}
                </p>
              </div>
            ) : (
              filteredFiles.map((file) => (
                <SidebarMenuItem key={file.id}>
                  <div className="group relative flex items-center w-full hover:bg-muted/50 rounded-md transition-colors duration-200">
                    <SidebarMenuButton
                      isActive={currentFileId === file.id}
                      onClick={() => onFileSelect(file)}
                      className="flex-1 h-9 px-3 py-2 hover:bg-transparent"
                    >
                      <div className="flex items-center gap-2 w-full">
                        <div className="flex items-center justify-center h-4 w-4 text-muted-foreground">
                          <FileText className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-sm truncate text-foreground flex-1">
                          {file.name}
                        </span>
                      </div>
                    </SidebarMenuButton>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex items-center justify-center h-6 w-6 rounded-md hover:bg-accent transition-colors duration-200 absolute right-2">
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => startRename(file)}
                          className="cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onFileDelete(file.id)}
                          className="text-red-600 cursor-pointer"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </SidebarMenuItem>
              ))
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* 重命名对话框 */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Rename File
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rename" className="text-right font-medium">
                New Name
              </Label>
              <Input
                id="rename"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                placeholder="document"
                className="col-span-3"
                onKeyDown={(e) => e.key === "Enter" && handleRename()}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsRenameDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleRename}>Confirm</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
