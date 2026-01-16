# Markdown Reader

<p align="center">
  <img src="MD.ico" alt="Markdown Reader Icon" width="100">
</p>

<p align="center">
  <strong>🇨🇳 <a href="#中文说明">中文</a> | 🇺🇸 <a href="#english">English</a></strong>
</p>

---

# English

A beautiful and elegant Markdown reader and editor, available as a web app, browser extension, and desktop application.

## ✨ Features

- 📖 **Perfect Rendering** - Full GFM Markdown syntax support
- 🎨 **Code Highlighting** - 100+ programming languages syntax highlighting
- 📐 **Math Formulas** - LaTeX math rendering (KaTeX)
- ✏️ **Live Editing** - Split-pane editing with real-time preview
- 📑 **TOC Navigation** - Auto-generated clickable table of contents
- 🌓 **Theme Switching** - Light/Dark themes
- 📤 **Multi-format Export** - MD/HTML/PDF/Word export
- 🌐 **Bilingual UI** - English and Chinese interface
- 🔌 **Auto-detect** - Automatically render `.md` files on the web

## 🚀 Installation & Usage

### Option 1: Web Application

Simply open `index.html` in your browser - no installation required!

```bash
# Or start a local server
npx serve .
```

### Option 2: Browser Extension (Chrome/Edge)

1. Download or clone this repository
2. Open Chrome/Edge and go to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **Load unpacked**
5. Select the `extension` folder
6. Done! The extension icon will appear in your toolbar

**Usage:**
- **Auto-detect**: Opens any `.md` file URL and it renders automatically
- **Open App**: Click the extension icon → "Open Full App"
- **Settings**: Toggle auto-detect on/off, switch language

### Option 3: Desktop Application (Download)

**Recommended for most users:**

1. Go to [**Releases**](../../releases) page
2. Download the installer for your platform:
   - Windows: `Markdown-Reader-Setup-x.x.x.exe`
   - macOS: `Markdown-Reader-x.x.x.dmg`
   - Linux: `Markdown-Reader-x.x.x.AppImage`
3. Run the installer and follow the prompts
4. Done! Launch Markdown Reader from your applications

### Option 4: Build from Source (Electron)

```bash
# Install dependencies
npm install

# Run in development mode
npm start

# Build for production
npm run build:win    # Windows (.exe)
npm run build:mac    # macOS (.dmg)
npm run build:linux  # Linux (.AppImage)
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+N` | New document |
| `Ctrl+O` | Open file |
| `Ctrl+S` | Save file |
| `Ctrl+E` | Toggle edit mode |
| `Ctrl+D` | Toggle theme |
| `Ctrl+B` | Bold |
| `Ctrl+I` | Italic |
| `Ctrl+K` | Insert link |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Esc` | Exit edit mode |

## 📁 Project Structure

```
ReaderForMarkdown/
├── index.html          # Main web app
├── package.json        # Node.js/Electron config
├── styles/             # Stylesheets
│   ├── themes.css      # Theme variables
│   ├── main.css        # Main styles
│   ├── markdown.css    # Markdown rendering styles
│   └── editor.css      # Editor styles
├── js/                 # JavaScript modules
│   ├── app.js          # App entry point
│   ├── editor.js       # Editor functionality
│   ├── markdown-renderer.js
│   ├── i18n-manager.js # Internationalization
│   └── ...
├── extension/          # Chrome Extension
│   ├── manifest.json   # Extension manifest (v3)
│   ├── popup.html/js   # Extension popup
│   ├── content.js      # Content script for auto-detect
│   ├── index.html      # Full app (embedded)
│   └── lib/            # Local dependencies
└── electron/           # Desktop app
    ├── main.js         # Electron main process
    └── preload.js      # Preload script
```

---

# 中文说明

精致优雅的 Markdown 阅读器和编辑器，支持网页应用、浏览器插件和桌面应用三种使用方式。

## ✨ 功能特性

- 📖 **完美渲染** - 支持完整 GFM Markdown 语法
- 🎨 **代码高亮** - 100+ 种编程语言语法高亮
- 📐 **数学公式** - LaTeX 数学公式渲染 (KaTeX)
- ✏️ **实时编辑** - 分屏编辑与实时预览
- 📑 **目录导航** - 自动生成可点击目录
- 🌓 **主题切换** - 亮色/暗色主题
- 📤 **多格式导出** - 支持 MD/HTML/PDF/Word
- 🌐 **中英双语** - 支持中英文界面切换
- 🔌 **自动检测** - 自动渲染网页上的 `.md` 文件

## 🚀 安装与使用

### 方式一：网页应用

直接在浏览器中打开 `index.html` 即可使用，无需安装！

```bash
# 或者启动本地服务器
npx serve .
```

### 方式二：浏览器插件 (Chrome/Edge)

1. 下载或克隆本仓库
2. 打开 Chrome/Edge 浏览器，访问 `chrome://extensions/`
3. 开启右上角的 **开发者模式**
4. 点击 **加载已解压的扩展程序**
5. 选择 `extension` 文件夹
6. 完成！工具栏会出现扩展图标

**使用方法：**
- **自动检测**：访问任意 `.md` 文件链接，自动渲染
- **打开应用**：点击扩展图标 → "打开完整应用"
- **设置**：可开关自动检测、切换语言

### 方式三：桌面应用（下载安装）

**推荐普通用户使用：**

1. 前往 [**Releases**](../../releases) 页面
2. 下载对应系统的安装包：
   - Windows: `Markdown-Reader-Setup-x.x.x.exe`
   - macOS: `Markdown-Reader-x.x.x.dmg`
   - Linux: `Markdown-Reader-x.x.x.AppImage`
3. 运行安装程序，按提示完成安装
4. 完成！从应用列表启动 Markdown Reader

### 方式四：从源码构建 (Electron)

```bash
# 安装依赖
npm install

# 开发运行
npm start

# 打包应用
npm run build:win    # Windows (.exe)
npm run build:mac    # macOS (.dmg)
npm run build:linux  # Linux (.AppImage)
```

## ⌨️ 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+N` | 新建文档 |
| `Ctrl+O` | 打开文件 |
| `Ctrl+S` | 保存文件 |
| `Ctrl+E` | 切换编辑模式 |
| `Ctrl+D` | 切换主题 |
| `Ctrl+B` | 粗体 |
| `Ctrl+I` | 斜体 |
| `Ctrl+K` | 插入链接 |
| `Ctrl+Z` | 撤销 |
| `Ctrl+Y` | 重做 |
| `Esc` | 退出编辑模式 |

## 📁 项目结构

```
ReaderForMarkdown/
├── index.html          # 主应用页面
├── package.json        # Node.js/Electron 配置
├── styles/             # 样式文件
│   ├── themes.css      # 主题变量
│   ├── main.css        # 主样式
│   ├── markdown.css    # Markdown 渲染样式
│   └── editor.css      # 编辑器样式
├── js/                 # JavaScript 模块
│   ├── app.js          # 应用入口
│   ├── editor.js       # 编辑器功能
│   ├── markdown-renderer.js
│   ├── i18n-manager.js # 国际化
│   └── ...
├── extension/          # 浏览器插件
│   ├── manifest.json   # 扩展配置 (v3)
│   ├── popup.html/js   # 扩展弹窗
│   ├── content.js      # 自动检测脚本
│   ├── index.html      # 完整应用（内嵌）
│   └── lib/            # 本地依赖
└── electron/           # 桌面应用
    ├── main.js         # Electron 主进程
    └── preload.js      # 预加载脚本
```

---

## 📝 License

MIT License - feel free to use in your own projects!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
