import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 为Tailwind CSS v4添加颜色工具函数
export function hsl(variable: string) {
  return `hsl(var(--${variable}))`;
}

// 颜色变量映射
export const colors = {
  background: hsl("background"),
  foreground: hsl("foreground"),
  card: hsl("card"),
  "card-foreground": hsl("card-foreground"),
  popover: hsl("popover"),
  "popover-foreground": hsl("popover-foreground"),
  primary: hsl("primary"),
  "primary-foreground": hsl("primary-foreground"),
  secondary: hsl("secondary"),
  "secondary-foreground": hsl("secondary-foreground"),
  muted: hsl("muted"),
  "muted-foreground": hsl("muted-foreground"),
  accent: hsl("accent"),
  "accent-foreground": hsl("accent-foreground"),
  destructive: hsl("destructive"),
  "destructive-foreground": hsl("destructive-foreground"),
  border: hsl("border"),
  input: hsl("input"),
  ring: hsl("ring"),
  "sidebar-background": hsl("sidebar-background"),
  "sidebar-foreground": hsl("sidebar-foreground"),
  "sidebar-primary": hsl("sidebar-primary"),
  "sidebar-primary-foreground": hsl("sidebar-primary-foreground"),
  "sidebar-accent": hsl("sidebar-accent"),
  "sidebar-accent-foreground": hsl("sidebar-accent-foreground"),
  "sidebar-border": hsl("sidebar-border"),
  "sidebar-ring": hsl("sidebar-ring"),
};
