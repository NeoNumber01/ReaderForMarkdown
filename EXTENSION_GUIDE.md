# Markdown Reader - Browser Extension Guide

<p align="center">
  <img src="MD.ico" alt="Markdown Reader Icon" width="100">
</p>

<p align="center">
  <strong>🇨🇳 <a href="#中文使用说明">中文</a> | 🇺🇸 <a href="#english-guide">English</a></strong>
</p>

---

# English Guide

## 📋 Overview

**Markdown Reader** is a powerful browser extension that transforms raw Markdown files into beautifully rendered documents. It works seamlessly with Chrome, Edge, and other Chromium-based browsers.

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 📖 **Perfect Rendering** | Full GFM (GitHub Flavored Markdown) syntax support |
| 🎨 **Syntax Highlighting** | 100+ programming languages with beautiful code blocks |
| 📐 **Math Formulas** | LaTeX math rendering powered by KaTeX |
| ✏️ **Live Editing** | Split-pane editor with real-time preview |
| 📑 **TOC Navigation** | Auto-generated clickable table of contents |
| 🌓 **Theme Switching** | Light and Dark themes |
| 📤 **Multi-format Export** | Export to MD, HTML, PDF, or Word (.docx) |
| 🌐 **Bilingual UI** | English and Chinese interface |
| 🔌 **Auto-detect** | Automatically renders `.md` files on the web |

---

## 🚀 Installation

### Step 1: Download the Extension

**Option A: Download from GitHub**
1. Go to the [Releases](../../releases) page
2. Download `extension.zip`
3. Extract the ZIP file to a folder

**Option B: Clone the Repository**
```bash
git clone https://github.com/NeoNumber01/ReaderForMarkdown.git
```

### Step 2: Install in Browser

#### For Chrome:

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select the `extension` folder from the downloaded files
5. Done! The extension icon will appear in your toolbar

#### For Microsoft Edge:

1. Open Edge and navigate to `edge://extensions/`
2. Enable **Developer mode** (toggle in the left sidebar)
3. Click **Load unpacked**
4. Select the `extension` folder
5. The extension is now installed!

#### For Brave/Vivaldi/Opera:

The process is similar - navigate to your browser's extension management page and load the `extension` folder as an unpacked extension.

---

## 📖 How to Use

### 🔹 Auto-Detect Mode (Default)

The extension automatically detects and renders Markdown files when you:

- Open a local `.md` file (e.g., `file:///C:/docs/readme.md`)
- Visit any URL ending with `.md` or `.markdown`
- Access raw files on GitHub (`raw.githubusercontent.com`)
- View GitHub Gists (`gist.githubusercontent.com`)

> **Tip**: Just drag and drop a `.md` file into your browser - it will be rendered automatically!

### 🔹 Using the Popup Menu

Click the extension icon in your toolbar to access:

1. **Open Full App** - Opens the complete Markdown Reader application in a new tab
2. **Auto-detect Toggle** - Enable/disable automatic Markdown detection
3. **Language Switch** - Toggle between English and Chinese interface

### 🔹 Using the Full Application

Click "Open Full App" from the popup to access all features:

#### Creating & Opening Files

- **Drag & Drop**: Drag any `.md` file directly into the window
- **Open File**: Click the folder icon or use `Ctrl+O`
- **New File**: Click the new document icon or use `Ctrl+N`

#### Editing Mode

- Click the **Edit** button or press `Ctrl+E` to enter edit mode
- The screen splits into editor (left) and preview (right)
- Changes are reflected in real-time in the preview pane

#### Toolbar Functions (in Edit Mode)

| Button | Function | Shortcut |
|--------|----------|----------|
| **B** | Bold | `Ctrl+B` |
| **I** | Italic | `Ctrl+I` |
| **S** | Strikethrough | - |
| **H1-H6** | Headers | - |
| **" "** | Quote | - |
| **📋** | Code block | - |
| **🔗** | Insert link | `Ctrl+K` |
| **🖼** | Insert image | - |
| **📊** | Insert table | - |
| **➖** | Horizontal rule | - |
| **∑** | Math formula | - |

#### Exporting Documents

Click the export icon to save your document as:
- **Markdown (.md)** - Raw Markdown source
- **HTML (.html)** - Rendered HTML page
- **PDF (.pdf)** - Print-ready PDF document
- **Word (.docx)** - Microsoft Word document

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+N` | New document |
| `Ctrl+O` | Open file |
| `Ctrl+S` | Save file |
| `Ctrl+E` | Toggle edit mode |
| `Ctrl+D` | Toggle theme (Light/Dark) |
| `Ctrl+B` | Bold text |
| `Ctrl+I` | Italic text |
| `Ctrl+K` | Insert link |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Esc` | Exit edit mode |

---

## ❓ FAQ

**Q: The extension doesn't render my local `.md` files**  
A: Chrome restricts extensions from accessing local files by default. Go to `chrome://extensions/`, find Markdown Reader, click "Details", and enable **"Allow access to file URLs"**.

**Q: Math formulas don't display correctly**  
A: Make sure you're using correct LaTeX syntax:
- Inline math: `$E = mc^2$`
- Block math: `$$\int_a^b f(x)dx$$`

**Q: How do I disable auto-detection?**  
A: Click the extension icon and toggle off "Auto-detect Web Markdown".

**Q: Can I use this offline?**  
A: Yes! Once installed, the extension works completely offline.

---

# 中文使用说明

## 📋 概述

**Markdown Reader** 是一款强大的浏览器扩展程序，可以将原始 Markdown 文件转换为精美的渲染文档。它可以在 Chrome、Edge 及其他基于 Chromium 的浏览器上无缝运行。

## ✨ 核心功能

| 功能 | 说明 |
|------|------|
| 📖 **完美渲染** | 完整支持 GFM（GitHub 风格 Markdown）语法 |
| 🎨 **语法高亮** | 支持 100+ 种编程语言的代码高亮显示 |
| 📐 **数学公式** | 基于 KaTeX 的 LaTeX 数学公式渲染 |
| ✏️ **实时编辑** | 分屏编辑器，实时预览效果 |
| 📑 **目录导航** | 自动生成可点击的文章目录 |
| 🌓 **主题切换** | 支持亮色和暗色主题 |
| 📤 **多格式导出** | 导出为 MD、HTML、PDF 或 Word (.docx) |
| 🌐 **中英双语** | 支持中文和英文界面 |
| 🔌 **自动检测** | 自动渲染网页上的 `.md` 文件 |

---

## 🚀 安装指南

### 第一步：下载扩展

**方式 A：从 GitHub 下载**
1. 访问 [Releases](../../releases) 页面
2. 下载 `extension.zip`
3. 将 ZIP 文件解压到一个文件夹

**方式 B：克隆仓库**
```bash
git clone https://github.com/NeoNumber01/ReaderForMarkdown.git
```

### 第二步：在浏览器中安装

#### Chrome 浏览器：

1. 打开 Chrome，访问 `chrome://extensions/`
2. 开启右上角的 **开发者模式**
3. 点击 **加载已解压的扩展程序**
4. 选择下载文件中的 `extension` 文件夹
5. 完成！扩展图标将出现在工具栏中

#### Microsoft Edge 浏览器：

1. 打开 Edge，访问 `edge://extensions/`
2. 开启左侧边栏的 **开发人员模式**
3. 点击 **加载解压缩的扩展**
4. 选择 `extension` 文件夹
5. 扩展安装完成！

#### Brave/Vivaldi/Opera 等浏览器：

流程类似 - 进入浏览器的扩展管理页面，加载 `extension` 文件夹即可。

---

## 📖 使用方法

### 🔹 自动检测模式（默认开启）

扩展会自动检测并渲染 Markdown 文件，当您：

- 打开本地 `.md` 文件（如 `file:///C:/文档/readme.md`）
- 访问任何以 `.md` 或 `.markdown` 结尾的网址
- 访问 GitHub 的 raw 文件（`raw.githubusercontent.com`）
- 查看 GitHub Gist（`gist.githubusercontent.com`）

> **小技巧**：直接将 `.md` 文件拖放到浏览器中即可自动渲染！

### 🔹 使用弹出菜单

点击工具栏中的扩展图标可访问：

1. **打开完整应用** - 在新标签页中打开完整的 Markdown Reader 应用
2. **自动检测开关** - 启用/禁用自动 Markdown 检测
3. **语言切换** - 在中文和英文界面之间切换

### 🔹 使用完整应用

点击弹出菜单中的"打开完整应用"可使用所有功能：

#### 创建和打开文件

- **拖放**：将任意 `.md` 文件直接拖入窗口
- **打开文件**：点击文件夹图标或使用 `Ctrl+O`
- **新建文件**：点击新建文档图标或使用 `Ctrl+N`

#### 编辑模式

- 点击 **编辑** 按钮或按 `Ctrl+E` 进入编辑模式
- 屏幕分为编辑器（左侧）和预览区（右侧）
- 编辑内容会实时在预览区显示

#### 工具栏功能（编辑模式下）

| 按钮 | 功能 | 快捷键 |
|------|------|--------|
| **B** | 粗体 | `Ctrl+B` |
| **I** | 斜体 | `Ctrl+I` |
| **S** | 删除线 | - |
| **H1-H6** | 标题 | - |
| **" "** | 引用 | - |
| **📋** | 代码块 | - |
| **🔗** | 插入链接 | `Ctrl+K` |
| **🖼** | 插入图片 | - |
| **📊** | 插入表格 | - |
| **➖** | 水平分割线 | - |
| **∑** | 数学公式 | - |

#### 导出文档

点击导出图标可将文档保存为：
- **Markdown (.md)** - 原始 Markdown 源文件
- **HTML (.html)** - 渲染后的 HTML 页面
- **PDF (.pdf)** - 可打印的 PDF 文档
- **Word (.docx)** - Microsoft Word 文档

---

## ⌨️ 快捷键列表

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+N` | 新建文档 |
| `Ctrl+O` | 打开文件 |
| `Ctrl+S` | 保存文件 |
| `Ctrl+E` | 切换编辑模式 |
| `Ctrl+D` | 切换主题（亮色/暗色） |
| `Ctrl+B` | 粗体文本 |
| `Ctrl+I` | 斜体文本 |
| `Ctrl+K` | 插入链接 |
| `Ctrl+Z` | 撤销 |
| `Ctrl+Y` | 重做 |
| `Esc` | 退出编辑模式 |

---

## ❓ 常见问题

**问：扩展无法渲染本地 `.md` 文件**  
答：Chrome 默认限制扩展访问本地文件。请前往 `chrome://extensions/`，找到 Markdown Reader，点击"详情"，然后启用 **"允许访问文件网址"**。

**问：数学公式显示不正确**  
答：请确保使用正确的 LaTeX 语法：
- 行内公式：`$E = mc^2$`
- 块级公式：`$$\int_a^b f(x)dx$$`

**问：如何禁用自动检测？**  
答：点击扩展图标，关闭"自动检测网页 Markdown"开关。

**问：可以离线使用吗？**  
答：可以！安装后，扩展完全支持离线使用。

---

## 📝 License

MIT License - 欢迎在您的项目中使用！

## 🤝 Contributing

欢迎贡献代码！请随时提交 Pull Request。
