# LaTeX Editor

一个现代化的基于 Web 的 LaTeX 编辑器，类似于 Overleaf。使用 Next.js 15、shadcn/ui、Monaco Editor 和 KaTeX 构建。

## 功能特性

- ✨ **实时预览** - 在输入时即时查看 LaTeX 渲染结果
- 📝 **语法高亮** - 完整的 LaTeX 语法高亮支持
- 📁 **文件管理** - 创建、删除、重命名和上传 LaTeX 文件
- 🎨 **现代 UI** - 基于 shadcn/ui 的美观界面
- 📱 **响应式设计** - 在所有设备上都能完美工作
- 🔧 **模块化架构** - 遵循 SOLID 原则的组件设计

## 快速开始

### 环境要求

- Node.js 18.0.0 或更高版本
- npm 或 yarn

### 安装

```bash
# 克隆项目
git clone <repository-url>
cd latex-editor

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 技术栈

- **前端框架**: Next.js 15 (App Router)
- **UI 组件**: shadcn/ui
- **样式**: Tailwind CSS
- **代码编辑器**: Monaco Editor
- **LaTeX 渲染**: KaTeX
- **图标**: Lucide React
- **TypeScript**: 完整的类型支持

## 项目结构

```
latex-editor/
├── app/                    # Next.js 应用程序路由
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页面
├── components/            # React 组件
│   ├── ui/               # shadcn/ui 组件
│   ├── file-manager.tsx  # 文件管理器
│   ├── latex-editor.tsx  # LaTeX编辑器
│   └── latex-preview.tsx # 预览组件
├── hooks/                # 自定义Hook
│   └── use-file-manager.ts
├── lib/                  # 工具函数
│   └── utils.ts
└── public/               # 静态资源
```

## 使用方法

### 创建新文件

1. 在侧边栏点击"新建"按钮
2. 输入文件名（会自动添加.tex 扩展名）
3. 开始编写 LaTeX 代码

### 文件管理

- **选择文件**: 点击侧边栏中的文件名
- **重命名**: 点击文件旁边的菜单按钮选择"重命名"
- **删除**: 点击文件旁边的菜单按钮选择"删除"
- **上传**: 点击侧边栏中的"上传"按钮选择.tex 文件

### 支持的 LaTeX 功能

- 文档结构（section、subsection 等）
- 数学公式（行内和块级）
- 文本格式（粗体、斜体、下划线）
- 列表（有序和无序）
- 基本的 LaTeX 命令

## 开发

### 添加新组件

所有组件都遵循 SOLID 原则：

```typescript
// 示例组件结构
interface ComponentProps {
  // 单一职责 - 明确的接口
  data: DataType;
  onAction: (param: ParamType) => void;
}

export function Component({ data, onAction }: ComponentProps) {
  // 组件实现
}
```

### 样式定制

在 `app/globals.css` 中修改全局样式，或在各组件中使用 Tailwind 类名。

### 添加新的 LaTeX 功能

在 `components/latex-preview.tsx` 的 `processLaTeXContent` 函数中添加新的 LaTeX 命令解析。

## 部署

### Vercel 部署

```bash
# 构建项目
npm run build

# 部署到Vercel
npx vercel --prod
```

### 其他平台

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 贡献

欢迎贡献！请确保：

1. 遵循现有的代码风格
2. 添加适当的 TypeScript 类型
3. 遵循 SOLID 原则
4. 添加必要的测试

## 许可证

MIT License

## 支持

如果您遇到问题或有建议，请创建一个 issue。
