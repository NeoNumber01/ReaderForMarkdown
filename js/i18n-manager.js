/**
 * I18n Manager - 国际化管理器
 * 管理应用语言状态和文本翻译
 */

const I18nManager = {
    // 语言配置
    currentLang: 'en', // 默认语言
    LANG_KEY: 'markdown-reader-lang',

    // 翻译字典
    translations: {
        'en': {
            // App General
            'app.title': 'Markdown Reader',
            'app.description': 'Exquisite & Elegant Markdown Reader',
            'sidebar.title': 'Contents',
            'sidebar.toggle': 'Collapse Sidebar',
            'sidebar.empty': 'Table of Contents will be displayed here',

            // Main Toolbar
            'toolbar.sidebar_toggle': 'Toggle Sidebar',
            'toolbar.file_placeholder': 'Drag & drop or select Markdown file',
            'toolbar.new': 'New',
            'toolbar.new_tooltip': 'New File (Ctrl+N)',
            'toolbar.open': 'Open',
            'toolbar.open_tooltip': 'Open File (Ctrl+O)',
            'toolbar.edit': 'Edit Mode (Ctrl+E)',
            'toolbar.export': 'Export',
            'toolbar.settings': 'Settings',
            'toolbar.theme_toggle': 'Toggle Theme',

            // Welcome Screen
            'welcome.title': 'Markdown Reader',
            'welcome.subtitle': 'Exquisite & Elegant Markdown Reading Experience',
            'welcome.select_file': 'Select File',
            'welcome.drag_hint': 'Or drag & drop .md file here',
            'welcome.feature.layout': 'Perfect Layout',
            'welcome.feature.code': 'Code Highlighting',
            'welcome.feature.math': 'Math Formula',

            // Drop Overlay
            'drop.hint': 'Drop file to open',

            // Editor Toolbar Tooltips
            'editor.bold': 'Bold (Ctrl+B)',
            'editor.italic': 'Italic (Ctrl+I)',
            'editor.h1': 'Heading 1',
            'editor.h2': 'Heading 2',
            'editor.h3': 'Heading 3',
            'editor.h4': 'Heading 4',
            'editor.h5': 'Heading 5',
            'editor.h6': 'Heading 6',
            'editor.link': 'Link (Ctrl+K)',
            'editor.image': 'Image',
            'editor.code': 'Code Block',
            'editor.formula': 'Formula (LaTeX)',
            'editor.quote': 'Quote',
            'editor.ul': 'Bulleted List',
            'editor.ol': 'Numbered List',
            'editor.table': 'Table',
            'editor.clear': 'Clear Formatting',
            'editor.undo': 'Undo (Ctrl+Z)',
            'editor.redo': 'Redo (Ctrl+Y)',
            'editor.sync_scroll': 'Sync Scroll',
            'editor.preview': 'Toggle Preview',
            'editor.export': 'Export Document',
            'editor.settings': 'Settings',
            'editor.back': 'Back',
            'editor.back_tooltip': 'Exit Edit Mode (Esc)',
            'editor.placeholder': 'Start typing Markdown content...',

            // Settings Dialog
            'settings.title': 'Settings',
            'settings.close': 'Close',
            'settings.reset': 'Reset to Default',
            'settings.done': 'Done',

            // Settings Tabs
            'settings.tab.general': 'General',
            'settings.tab.shortcuts': 'Shortcuts',
            'settings.tab.editor': 'Editor',
            'settings.tab.appearance': 'Appearance',

            // Settings - General
            'settings.general.language': 'Language',
            'settings.general.language.en': 'English',
            'settings.general.language.zh': 'Chinese (简体中文)',

            // Settings - Shortcuts
            'settings.shortcuts.title': 'Keyboard Shortcuts',
            'settings.shortcuts.hint': 'Click a shortcut key and press a new combination to modify',
            'settings.shortcut.undo': 'Undo',
            'settings.shortcut.redo': 'Redo',
            'settings.shortcut.bold': 'Bold',
            'settings.shortcut.italic': 'Italic',
            'settings.shortcut.link': 'Insert Link',
            'settings.shortcut.save': 'Save',
            'settings.shortcut.newFile': 'New File',
            'settings.shortcut.openFile': 'Open File',
            'settings.shortcut.toggleEdit': 'Toggle Edit Mode',
            'settings.shortcut.toggleTheme': 'Toggle Theme',

            // Settings - Editor
            'settings.editor.title': 'Editor Settings',
            'settings.editor.fontSize': 'Font Size',
            'settings.editor.fontFamily': 'Editor Font',
            'settings.editor.font.monospace': 'System Monospace',
            'settings.editor.tabSize': 'Tab Size',
            'settings.editor.tabSize.2': '2 Spaces',
            'settings.editor.tabSize.4': '4 Spaces',
            'settings.editor.tabSize.8': '8 Spaces',
            'settings.editor.syncScroll': 'Sync Scroll',

            // Settings - Appearance
            'settings.appearance.title': 'Appearance Settings',
            'settings.appearance.theme': 'Theme',
            'settings.appearance.theme.system': 'System',
            'settings.appearance.theme.light': 'Light',
            'settings.appearance.theme.dark': 'Dark',
            'settings.appearance.previewFontSize': 'Preview Font Size',
            'settings.appearance.previewFontFamily': 'Preview Font',
            'settings.appearance.font.system': 'System Default',
            'settings.appearance.font.inter': 'Inter',
            'settings.appearance.font.notosans': 'Noto Sans SC',
            'settings.appearance.font.georgia': 'Georgia (Serif)',
            'settings.appearance.font.merriweather': 'Merriweather (Serif)',
            'settings.appearance.accentColor': 'Accent Color',
            'settings.appearance.exportFontSize': 'Export Font Size',
            'settings.appearance.color.blue': 'Blue',
            'settings.appearance.color.green': 'Green',
            'settings.appearance.color.purple': 'Purple',
            'settings.appearance.color.orange': 'Orange',
            'settings.appearance.color.red': 'Red',
            'settings.appearance.color.pink': 'Pink',

            // Export Menu
            'export.title': 'Export Document',
            'export.md': 'Markdown',
            'export.md.desc': 'Export as .md file',
            'export.html': 'HTML',
            'export.html.desc': 'Export as web page',
            'export.pdf': 'PDF',
            'export.pdf.desc': 'Export as PDF document',
            'export.docx': 'Word',
            'export.docx.desc': 'Export as .docx document',
            'export.filename': 'Filename',
            'export.filename_placeholder': 'Enter filename',

            // Messages
            'msg.select_text': 'Please select text first',
            'msg.export_error': 'Export failed',
            'msg.reset_confirm': 'Are you sure you want to reset all settings to default?',
            'msg.press_shortcut': 'Press shortcut key...',

            // TOC
            'toc.empty': 'This document has no headings',
            'toc.placeholder': 'Table of Contents will appear after opening a file',

            // Alerts (GitHub-style)
            'alert.note': 'Note',
            'alert.tip': 'Tip',
            'alert.important': 'Important',
            'alert.warning': 'Warning',
            'alert.caution': 'Caution',

            // App messages
            'app.untitled': 'Untitled.md',
            'app.edit_doc': 'Edit Document (Ctrl+E)',
            'app.create_doc': 'Create Document (Ctrl+E)',
            'app.unsaved_confirm': 'You have unsaved changes. Are you sure you want to create a new document?',
            'app.no_content': 'No content to save',

            // File handler
            'file.invalid_type': 'Please select a Markdown file (.md, .markdown, .txt)',
            'file.read_error': 'Failed to read file',

            // Export
            'export.untitled': 'Untitled',
            'export.prefix': 'Edit: ',

            // Editor placeholders
            'editor.bold_placeholder': '**bold text**',
            'editor.italic_placeholder': '*italic text*',
            'editor.heading_placeholder': 'Heading',
            'editor.link_placeholder': '[link text](url)',
            'editor.code_placeholder': '`code`',
            'editor.quote_placeholder': '\n> Quote content',
            'editor.ul_placeholder': '\n- List item',
            'editor.ol_placeholder': '\n1. List item',
            'editor.table_placeholder': '\n| Col1 | Col2 | Col3 |\n|------|------|------|\n| Content | Content | Content |\n',
            'editor.image_url_hint': 'Enter image URL...',
            'editor.image_alt_hint': 'Describe this image...',
            'editor.image_default_alt': 'Image',
            'editor.sync_on': 'Sync Scroll (On)',
            'editor.sync_off': 'Sync Scroll (Off)',
            'editor.editing_prefix': 'Edit: ',

            // Image dialog
            'image.title': 'Insert Image',
            'image.tab.local': 'Local Upload',
            'image.tab.url': 'Image URL',
            'image.drop_hint': 'Click to select or drop image here',
            'image.formats': 'Supports JPG, PNG, GIF, WebP',
            'image.alt_label': 'Image description (Alt)',
            'image.cancel': 'Cancel',
            'image.insert': 'Insert Image',
            'image.preview_alt': 'Preview',
            'image.size_section': 'Image Size',
            'image.width': 'Width',
            'image.height': 'Height',
            'image.keep_ratio': 'Keep aspect ratio',
            'image.preset.small': 'S',
            'image.preset.medium': 'M',
            'image.preset.large': 'L',
            'image.preset.original': 'Original',
            'image.unit.px': 'px',
            'image.unit.percent': '%',

            // Table dialog
            'table.title': 'Insert Table',
            'table.rows': 'Rows',
            'table.columns': 'Columns',
            'table.preview': 'Preview',
            'table.cancel': 'Cancel',
            'table.insert': 'Insert Table',
            'table.header': 'Header',
            'table.cell': 'Cell',

            // Code copy
            'copy': 'Copy',
            'copied': 'Copied!'
        },
        'zh-CN': {
            // App General
            'app.title': 'Markdown Reader',
            'app.description': '精致优雅的 Markdown 阅读器',
            'sidebar.title': '目录',
            'sidebar.toggle': '收起侧边栏',
            'sidebar.empty': '打开 Markdown 文件后将显示目录',

            // Main Toolbar
            'toolbar.sidebar_toggle': '显示/隐藏目录',
            'toolbar.file_placeholder': '拖放或选择 Markdown 文件',
            'toolbar.new': '新建',
            'toolbar.new_tooltip': '新建文档 (Ctrl+N)',
            'toolbar.open': '打开',
            'toolbar.open_tooltip': '打开文件 (Ctrl+O)',
            'toolbar.edit': '编辑模式 (Ctrl+E)',
            'toolbar.export': '导出',
            'toolbar.settings': '设置',
            'toolbar.theme_toggle': '切换主题',

            // Welcome Screen
            'welcome.title': 'Markdown Reader',
            'welcome.subtitle': '精致优雅的 Markdown 阅读体验',
            'welcome.select_file': '选择文件',
            'welcome.drag_hint': '或将 .md 文件拖放到此处',
            'welcome.feature.layout': '完美排版',
            'welcome.feature.code': '代码高亮',
            'welcome.feature.math': '数学公式',

            // Drop Overlay
            'drop.hint': '释放文件以打开',

            // Editor Toolbar Tooltips
            'editor.bold': '粗体 (Ctrl+B)',
            'editor.italic': '斜体 (Ctrl+I)',
            'editor.h1': '一级标题 (H1)',
            'editor.h2': '二级标题 (H2)',
            'editor.h3': '三级标题 (H3)',
            'editor.h4': '四级标题 (H4)',
            'editor.h5': '五级标题 (H5)',
            'editor.h6': '六级标题 (H6)',
            'editor.link': '链接 (Ctrl+K)',
            'editor.image': '图片',
            'editor.code': '代码',
            'editor.formula': '公式 (LaTeX)',
            'editor.quote': '引用',
            'editor.ul': '无序列表',
            'editor.ol': '有序列表',
            'editor.table': '表格',
            'editor.clear': '清除格式',
            'editor.undo': '撤销 (Ctrl+Z)',
            'editor.redo': '重做 (Ctrl+Y)',
            'editor.sync_scroll': '同步滚动',
            'editor.preview': '切换预览模式',
            'editor.export': '导出文档',
            'editor.settings': '设置',
            'editor.back': '返回',
            'editor.back_tooltip': '退出编辑模式 (Esc)',
            'editor.placeholder': '开始输入 Markdown 内容...',

            // Settings Dialog
            'settings.title': '设置',
            'settings.close': '关闭',
            'settings.reset': '重置为默认',
            'settings.done': '完成',

            // Settings Tabs
            'settings.tab.general': '通用',
            'settings.tab.shortcuts': '快捷键',
            'settings.tab.editor': '编辑器',
            'settings.tab.appearance': '外观',

            // Settings - General
            'settings.general.language': '语言 / Language',
            'settings.general.language.en': 'English',
            'settings.general.language.zh': 'Chinese (简体中文)',

            // Settings - Shortcuts
            'settings.shortcuts.title': '键盘快捷键',
            'settings.shortcuts.hint': '点击快捷键后按下新的组合键来修改',
            'settings.shortcut.undo': '撤销',
            'settings.shortcut.redo': '重做',
            'settings.shortcut.bold': '粗体',
            'settings.shortcut.italic': '斜体',
            'settings.shortcut.link': '插入链接',
            'settings.shortcut.save': '保存',
            'settings.shortcut.newFile': '新建文件',
            'settings.shortcut.openFile': '打开文件',
            'settings.shortcut.toggleEdit': '切换编辑模式',
            'settings.shortcut.toggleTheme': '切换主题',

            // Settings - Editor
            'settings.editor.title': '编辑器设置',
            'settings.editor.fontSize': '字体大小',
            'settings.editor.fontFamily': '编辑器字体',
            'settings.editor.font.monospace': '系统等宽字体',
            'settings.editor.tabSize': 'Tab 缩进',
            'settings.editor.tabSize.2': '2 空格',
            'settings.editor.tabSize.4': '4 空格',
            'settings.editor.tabSize.8': '8 空格',
            'settings.editor.syncScroll': '同步滚动',

            // Settings - Appearance
            'settings.appearance.title': '外观设置',
            'settings.appearance.theme': '主题',
            'settings.appearance.theme.system': '跟随系统',
            'settings.appearance.theme.light': '浅色',
            'settings.appearance.theme.dark': '深色',
            'settings.appearance.previewFontSize': '预览区字号',
            'settings.appearance.previewFontFamily': '预览区字体',
            'settings.appearance.font.system': '系统默认',
            'settings.appearance.font.inter': 'Inter',
            'settings.appearance.font.notosans': 'Noto Sans SC',
            'settings.appearance.font.georgia': 'Georgia (衬线)',
            'settings.appearance.font.merriweather': 'Merriweather (衬线)',
            'settings.appearance.accentColor': '主题强调色',
            'settings.appearance.exportFontSize': '导出字体大小',
            'settings.appearance.color.blue': '蓝色',
            'settings.appearance.color.green': '绿色',
            'settings.appearance.color.purple': '紫色',
            'settings.appearance.color.orange': '橙色',
            'settings.appearance.color.red': '红色',
            'settings.appearance.color.pink': '粉色',

            // Export Menu
            'export.title': '导出文档',
            'export.md': 'Markdown',
            'export.md.desc': '导出为 .md 文件',
            'export.html': 'HTML',
            'export.html.desc': '导出为网页文件',
            'export.pdf': 'PDF',
            'export.pdf.desc': '导出为 PDF 文档',
            'export.docx': 'Word',
            'export.docx.desc': '导出为 .docx 文档',
            'export.filename': '文件名',
            'export.filename_placeholder': '输入文件名',

            // Messages
            'msg.select_text': '请先选中要设置样式的文字',
            'msg.export_error': '导出失败',
            'msg.reset_confirm': '确定要重置所有设置为默认值吗？',
            'msg.press_shortcut': '按下快捷键...',

            // TOC
            'toc.empty': '此文档没有标题',
            'toc.placeholder': '打开 Markdown 文件后将显示目录',

            // Alerts (GitHub-style)
            'alert.note': '注意',
            'alert.tip': '提示',
            'alert.important': '重要',
            'alert.warning': '警告',
            'alert.caution': '危险',

            // App messages
            'app.untitled': '未命名.md',
            'app.edit_doc': '编辑文档 (Ctrl+E)',
            'app.create_doc': '创建文档 (Ctrl+E)',
            'app.unsaved_confirm': '当前文档有未保存的更改，确定要创建新文档吗？',
            'app.no_content': '没有内容可保存',

            // File handler
            'file.invalid_type': '请选择 Markdown 文件 (.md, .markdown, .txt)',
            'file.read_error': '读取文件失败',

            // Export
            'export.untitled': '未命名',
            'export.prefix': '编辑: ',

            // Editor placeholders
            'editor.bold_placeholder': '**粗体文本**',
            'editor.italic_placeholder': '*斜体文本*',
            'editor.heading_placeholder': '标题',
            'editor.link_placeholder': '[链接文本](url)',
            'editor.code_placeholder': '`代码`',
            'editor.quote_placeholder': '\n> 引用内容',
            'editor.ul_placeholder': '\n- 列表项',
            'editor.ol_placeholder': '\n1. 列表项',
            'editor.table_placeholder': '\n| 列1 | 列2 | 列3 |\n|------|------|------|\n| 内容 | 内容 | 内容 |\n',
            'editor.image_url_hint': '输入图片 URL...',
            'editor.image_alt_hint': '描述这张图片...',
            'editor.image_default_alt': '图片',
            'editor.sync_on': '同步滚动 (已开启)',
            'editor.sync_off': '同步滚动 (已关闭)',
            'editor.editing_prefix': '编辑: ',

            // Image dialog
            'image.title': '插入图片',
            'image.tab.local': '本地上传',
            'image.tab.url': '图片链接',
            'image.drop_hint': '点击选择或拖放图片',
            'image.formats': '支持 JPG, PNG, GIF, WebP',
            'image.alt_label': '图片描述 (Alt)',
            'image.cancel': '取消',
            'image.insert': '插入图片',
            'image.preview_alt': '预览',
            'image.size_section': '图片尺寸',
            'image.width': '宽度',
            'image.height': '高度',
            'image.keep_ratio': '保持宽高比',
            'image.preset.small': '小',
            'image.preset.medium': '中',
            'image.preset.large': '大',
            'image.preset.original': '原始',
            'image.unit.px': 'px',
            'image.unit.percent': '%',

            // Table dialog
            'table.title': '插入表格',
            'table.rows': '行数',
            'table.columns': '列数',
            'table.preview': '预览',
            'table.cancel': '取消',
            'table.insert': '插入表格',
            'table.header': '表头',
            'table.cell': '单元格',

            // Code copy
            'copy': '复制',
            'copied': '已复制！'
        }
    },

    /**
     * 初始化
     */
    init() {
        this.loadLanguage();
        this.updateUI();
    },

    /**
     * 加载保存的语言设置
     */
    loadLanguage() {
        const saved = localStorage.getItem(this.LANG_KEY);
        // 默认使用英语，不再跟随系统，以满足用户需求"打开以后默认是英文显示"
        this.currentLang = saved || 'en';
    },

    /**
     * 切换语言
     * @param {string} lang - 'en' 或 'zh-CN'
     */
    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem(this.LANG_KEY, lang);
            this.updateUI();

            // 触发自定义事件，以便其他组件可以响应语言变化
            window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
        }
    },

    /**
     * 获取翻译
     * @param {string} key 
     * @returns {string} translation
     */
    t(key) {
        const dict = this.translations[this.currentLang] || this.translations['en'];
        return dict[key] || key;
    },

    /**
     * 更新页面 UI
     */
    updateUI() {
        // 更新所有带有 data-i18n 属性的元素
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            const translation = this.t(key);

            // 检查是否有 data-i18n-target 属性，指定要更新的属性名（如 title, placeholder）
            const target = el.dataset.i18nTarget;

            if (target) {
                // 如果指定了目标属性，如 "title" 或 "placeholder"
                el.setAttribute(target, translation);
            } else {
                // 默认更新文本内容，保留图标等子元素（如果有的话需要小心）
                const span = el.querySelector('span');
                if (span && !el.dataset.i18nNoSpan) {
                    span.textContent = translation;
                } else if (!el.children.length || el.dataset.i18nContent) {
                    el.textContent = translation;
                } else {
                    // 对于混合内容，查找文本节点并替换
                    for (const node of el.childNodes) {
                        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                            node.textContent = translation;
                            break;
                        }
                    }
                }
            }

            // 处理同时需要更新 title 的情况 (data-i18n-title="key")
            if (el.dataset.i18nTitle) {
                el.setAttribute('title', this.t(el.dataset.i18nTitle));
            }
        });

        // 单独处理只有 data-i18n-title 属性的元素（没有 data-i18n）
        document.querySelectorAll('[data-i18n-title]:not([data-i18n])').forEach(el => {
            el.setAttribute('title', this.t(el.dataset.i18nTitle));
        });

        // 更新编辑器 textarea 的 placeholder
        const editorTextarea = document.getElementById('editor-textarea');
        if (editorTextarea) {
            editorTextarea.placeholder = this.t('editor.placeholder');
        }

        // 更新 HTML lang 属性
        document.documentElement.lang = this.currentLang;

        // 更新其他动态组件（如果需要）
        if (typeof SettingsManager !== 'undefined' && document.querySelector('.settings-dialog')) {
            // 如果设置对话框打开，刷新它
            SettingsManager.showSettingsDialog();
        }

        // 更新目录空状态提示
        const tocNav = document.getElementById('toc-nav');
        if (tocNav) {
            const tocEmpty = tocNav.querySelector('.toc-empty');
            if (tocEmpty) {
                // 检查当前是显示 placeholder 还是 empty
                const hasContent = document.getElementById('markdown-content')?.innerHTML.trim();
                if (hasContent) {
                    tocEmpty.textContent = this.t('toc.empty');
                } else {
                    tocEmpty.textContent = this.t('toc.placeholder');
                }
            }
        }
    }
};
