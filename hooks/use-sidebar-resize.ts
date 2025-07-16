import { useState, useEffect, useCallback } from "react";

interface UseSidebarResizeOptions {
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  cookieKey?: string;
}

export function useSidebarResize({
  defaultWidth = 256,
  minWidth = 200,
  maxWidth = 400,
  cookieKey = "sidebar-width",
}: UseSidebarResizeOptions = {}) {
  const [width, setWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);

  // 从 cookie 恢复宽度
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(cookieKey);
      if (saved) {
        const savedWidth = parseInt(saved);
        if (savedWidth >= minWidth && savedWidth <= maxWidth) {
          setWidth(savedWidth);
        }
      }
    }
  }, [cookieKey, minWidth, maxWidth]);

  // 保存宽度到 cookie
  const saveWidth = useCallback(
    (newWidth: number) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(cookieKey, newWidth.toString());
      }
    },
    [cookieKey]
  );

  // 处理鼠标拖拽
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsResizing(true);

      const startX = e.clientX;
      const startWidth = width;

      const handleMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - startX;
        const newWidth = Math.max(
          minWidth,
          Math.min(maxWidth, startWidth + deltaX)
        );
        setWidth(newWidth);
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        saveWidth(width);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [width, minWidth, maxWidth, saveWidth]
  );

  // 重置为默认宽度
  const resetWidth = useCallback(() => {
    setWidth(defaultWidth);
    saveWidth(defaultWidth);
  }, [defaultWidth, saveWidth]);

  return {
    width,
    isResizing,
    handleMouseDown,
    resetWidth,
  };
}
