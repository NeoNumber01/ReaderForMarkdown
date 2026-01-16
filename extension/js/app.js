/**
 * App - 应用入口
 * 初始化所有模块并协调它们的工作
 */

const App = {
    currentFileName: 'Untitled.md',
    currentContent: '',

    /**
     * 初始化应用
     */
    init() {
        // 初始化各模块
        ThemeManager.init();
        MarkdownRenderer.init();
        FileHandler.init();
        Editor.init();
        ExportManager.init();
        I18nManager.init();
        SettingsManager.init();

        // 绑定事件
        this.bindEvents();

        // 设置侧边栏
        this.setupSidebar();

        // 更新按钮状态
        this.updateButtonStates();

        // 监听来自 Extension iframe 的消息
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'MARKDOWN_READER_LOAD') {
                const { fileName, content } = event.data;
                this.renderMarkdown(fileName, content);
                console.log('Markdown Reader: Content loaded from Extension');
            }
        });

        console.log('Markdown Reader initialized');
    },

    /**
     * 绑定事件
     */
    bindEvents() {
        // 监听 Markdown 加载事件
        document.addEventListener('markdownLoaded', (e) => {
            this.renderMarkdown(e.detail.fileName, e.detail.content);
        });

        // 新建文件按钮
        const newBtn = document.getElementById('new-file-btn');
        if (newBtn) {
            newBtn.addEventListener('click', () => this.createNewFile());
        }

        // 编辑按钮
        const editBtn = document.getElementById('edit-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => this.enterEditMode());
        }

        // 导出按钮
        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => ExportManager.showExportMenu());
        }

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            // 在编辑模式下，编辑器处理自己的快捷键
            if (Editor.isEditorMode) {
                // 仅处理全局快捷键（保存、切换编辑模式、切换主题）
            }

            // 使用自定义快捷键（如果 SettingsManager 已加载）
            if (typeof SettingsManager !== 'undefined' && SettingsManager.settings) {
                const shortcuts = SettingsManager.settings.shortcuts;

                // 打开文件
                if (Editor.matchShortcut(e, shortcuts.openFile)) {
                    e.preventDefault();
                    FileHandler.openFileDialog();
                    return;
                }

                // 新建文件
                if (Editor.matchShortcut(e, shortcuts.newFile)) {
                    e.preventDefault();
                    this.createNewFile();
                    return;
                }

                // 切换编辑模式
                if (Editor.matchShortcut(e, shortcuts.toggleEdit)) {
                    e.preventDefault();
                    if (Editor.isEditorMode) {
                        this.exitEditMode();
                    } else {
                        this.enterEditMode();
                    }
                    return;
                }

                // 保存
                if (Editor.matchShortcut(e, shortcuts.save)) {
                    e.preventDefault();
                    this.saveFile();
                    return;
                }

                // 切换主题
                if (Editor.matchShortcut(e, shortcuts.toggleTheme)) {
                    e.preventDefault();
                    ThemeManager.toggle();
                    return;
                }
            } else {
                // 降级到默认快捷键
                if (e.ctrlKey || e.metaKey) {
                    switch (e.key.toLowerCase()) {
                        case 'o':
                            e.preventDefault();
                            FileHandler.openFileDialog();
                            return;
                        case 'n':
                            e.preventDefault();
                            this.createNewFile();
                            return;
                        case 'e':
                            e.preventDefault();
                            if (Editor.isEditorMode) {
                                this.exitEditMode();
                            } else {
                                this.enterEditMode();
                            }
                            return;
                        case 's':
                            e.preventDefault();
                            this.saveFile();
                            return;
                        case 'd':
                            e.preventDefault();
                            ThemeManager.toggle();
                            return;
                    }
                }
            }

            // Esc: 关闭移动端侧边栏或退出编辑模式
            if (e.key === 'Escape') {
                if (Editor.isEditorMode) {
                    this.exitEditMode();
                } else {
                    this.closeMobileSidebar();
                    ExportManager.hideExportMenu();
                }
            }
        });
    },

    /**
     * 更新按钮状态
     */
    updateButtonStates() {
        const editBtn = document.getElementById('edit-btn');
        const exportBtn = document.getElementById('export-btn');
        const hasContent = this.currentContent.trim().length > 0;

        // 始终显示编辑按钮（可以新建）
        if (editBtn) {
            editBtn.style.display = '';
            editBtn.title = hasContent ? I18nManager.t('app.edit_doc') : I18nManager.t('app.create_doc');
        }

        // 只有有内容时才显示导出按钮
        if (exportBtn) {
            exportBtn.style.display = hasContent ? '' : 'none';
        }
    },

    /**
     * 设置侧边栏
     */
    setupSidebar() {
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const mobileToggle = document.getElementById('sidebar-mobile-toggle');

        // 创建移动端遮罩
        const overlay = document.createElement('div');
        overlay.className = 'mobile-overlay';
        document.body.appendChild(overlay);

        // 桌面端侧边栏切换
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
            });
        }

        // 移动端侧边栏切换 / 桌面端收起后展开
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                // 桌面端：如果侧边栏是收起状态，则展开
                if (sidebar.classList.contains('collapsed')) {
                    sidebar.classList.remove('collapsed');
                } else {
                    // 移动端：打开侧边栏
                    sidebar.classList.add('mobile-open');
                    overlay.classList.add('active');
                }
            });
        }

        // 点击遮罩关闭侧边栏
        overlay.addEventListener('click', () => {
            this.closeMobileSidebar();
        });
    },

    /**
     * 关闭移动端侧边栏
     */
    closeMobileSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.querySelector('.mobile-overlay');

        if (sidebar) sidebar.classList.remove('mobile-open');
        if (overlay) overlay.classList.remove('active');
    },

    /**
     * 渲染 Markdown 内容
     * @param {string} fileName - 文件名
     * @param {string} content - Markdown 内容
     */
    renderMarkdown(fileName, content) {
        const contentEl = document.getElementById('markdown-content');
        const fileNameEl = document.getElementById('file-name');
        const welcomeScreen = document.getElementById('welcome-screen');

        // 保存当前内容
        this.currentFileName = fileName;
        this.currentContent = content;
        ExportManager.setMarkdownContent(content);

        // 隐藏欢迎屏幕
        if (welcomeScreen) {
            welcomeScreen.style.display = 'none';
        }

        // 更新按钮状态
        this.updateButtonStates();

        // 更新文件名
        if (fileNameEl) {
            fileNameEl.textContent = fileName;
        }

        // 更新页面标题
        document.title = `${fileName} - Markdown Reader`;

        // 渲染 Markdown
        const html = MarkdownRenderer.render(content);
        contentEl.innerHTML = html;

        // 生成目录
        TocGenerator.generate(contentEl);

        // 滚动到顶部
        const contentWrapper = document.querySelector('.content-wrapper');
        if (contentWrapper) {
            contentWrapper.scrollTop = 0;
        }
    },

    /**
     * 创建新文件
     */
    createNewFile() {
        // 检查是否有未保存的更改
        if (Editor.isEditorMode && Editor.hasUnsavedChanges()) {
            if (!confirm(I18nManager.t('app.unsaved_confirm'))) {
                return;
            }
        }

        this.currentFileName = I18nManager.t('app.untitled');
        this.currentContent = '';

        // 清空阅读视图
        const contentEl = document.getElementById('markdown-content');
        const welcomeScreen = document.getElementById('welcome-screen');
        if (contentEl) contentEl.innerHTML = '';
        if (welcomeScreen) welcomeScreen.style.display = 'none';

        // 进入编辑模式
        this.enterEditMode();

        // 更新按钮状态
        this.updateButtonStates();
    },

    /**
     * 进入编辑模式
     */
    enterEditMode() {
        Editor.enterEditMode(this.currentContent, this.currentFileName);

        // 更新主工具栏编辑按钮状态
        const editBtn = document.getElementById('edit-btn');
        if (editBtn) {
            editBtn.classList.add('active');
        }
    },

    /**
     * 退出编辑模式
     */
    exitEditMode() {
        // 获取编辑器内容
        const content = Editor.getContent();

        // 更新内容
        if (content !== this.currentContent) {
            this.currentContent = content;
            ExportManager.setMarkdownContent(content);
        }

        // 重新渲染预览
        const contentEl = document.getElementById('markdown-content');
        if (content.trim()) {
            const html = MarkdownRenderer.render(content);
            contentEl.innerHTML = html;
            TocGenerator.generate(contentEl);

            // 隐藏欢迎屏幕
            const welcomeScreen = document.getElementById('welcome-screen');
            if (welcomeScreen) welcomeScreen.style.display = 'none';
        } else {
            // 如果没有内容，显示欢迎屏幕
            let welcomeScreen = document.getElementById('welcome-screen');

            // 如果欢迎屏幕不存在（被 innerHTML = '' 删除了），重新创建
            if (!welcomeScreen) {
                welcomeScreen = document.createElement('div');
                welcomeScreen.className = 'welcome-screen';
                welcomeScreen.id = 'welcome-screen';
                welcomeScreen.innerHTML = `
                    <div class="welcome-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <path d="M12 18v-6"></path>
                            <path d="M9 15l3-3 3 3"></path>
                        </svg>
                    </div>
                    <h1 class="welcome-title">Markdown Reader</h1>
                    <p class="welcome-subtitle">精致优雅的 Markdown 阅读体验</p>
                    <div class="welcome-actions">
                        <button class="btn btn-primary btn-lg" id="welcome-open-btn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                            </svg>
                            选择文件
                        </button>
                        <p class="welcome-hint">或将 .md 文件拖放到此处</p>
                    </div>
                    <div class="welcome-features">
                        <div class="feature">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="4 7 4 4 20 4 20 7"></polyline>
                                <line x1="9" y1="20" x2="15" y2="20"></line>
                                <line x1="12" y1="4" x2="12" y2="20"></line>
                            </svg>
                            <span>完美排版</span>
                        </div>
                        <div class="feature">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="16 18 22 12 16 6"></polyline>
                                <polyline points="8 6 2 12 8 18"></polyline>
                            </svg>
                            <span>代码高亮</span>
                        </div>
                        <div class="feature">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 6v6l4 2"></path>
                            </svg>
                            <span>数学公式</span>
                        </div>
                    </div>
                `;
            }

            welcomeScreen.style.display = '';
            contentEl.innerHTML = '';
            contentEl.appendChild(welcomeScreen);

            // 重新绑定欢迎页面的打开按钮事件
            const welcomeOpenBtn = document.getElementById('welcome-open-btn');
            if (welcomeOpenBtn) {
                welcomeOpenBtn.addEventListener('click', () => FileHandler.openFileDialog());
            }

            // 如果是空的新文件，也重置文件名为默认提示
            this.currentFileName = I18nManager.t('app.untitled');
        }

        // 显示内容区域
        const contentWrapper = document.querySelector('.content-wrapper');
        if (contentWrapper) contentWrapper.style.display = '';

        // 退出编辑器
        Editor.exitEditMode();

        // 更新主工具栏编辑按钮状态
        const editBtn = document.getElementById('edit-btn');
        if (editBtn) {
            editBtn.classList.remove('active');
        }

        // 更新文件名显示
        const fileNameEl = document.getElementById('file-name');
        if (fileNameEl) {
            // 如果没有内容，显示默认提示
            if (!content.trim()) {
                fileNameEl.textContent = I18nManager.t('toolbar.file_placeholder');
            } else {
                fileNameEl.textContent = this.currentFileName;
            }
        }

        // 更新页面标题
        if (!content.trim()) {
            document.title = 'Markdown Reader';
        } else {
            document.title = `${this.currentFileName} - Markdown Reader`;
        }

        // 更新按钮状态
        this.updateButtonStates();
    },

    /**
     * 保存文件
     */
    saveFile() {
        // 如果在编辑模式，先获取最新内容
        if (Editor.isEditorMode) {
            this.currentContent = Editor.getContent();
            ExportManager.setMarkdownContent(this.currentContent);
        }

        // 直接导出为 Markdown
        if (this.currentContent.trim()) {
            ExportManager.exportAs('md');
        } else {
            alert(I18nManager.t('app.no_content'));
        }
    }
};

// DOM 加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// 支持 Electron 环境
if (typeof window !== 'undefined' && window.electronAPI) {
    window.electronAPI.onFileOpened((data) => {
        App.renderMarkdown(data.fileName, data.content);
    });

    window.electronAPI.onMenuNew(() => {
        App.createNewFile();
    });

    window.electronAPI.onMenuToggleEdit(() => {
        if (Editor.isEditorMode) {
            App.exitEditMode();
        } else {
            App.enterEditMode();
        }
    });

    window.electronAPI.onMenuToggleTheme(() => {
        ThemeManager.toggle();
    });

    window.electronAPI.onMenuExport((format) => {
        ExportManager.exportAs(format);
    });

    window.electronAPI.onRequestContent(() => {
        const content = Editor.isEditorMode ? Editor.getContent() : App.currentContent;
        window.electronAPI.saveContent(content);
    });

    window.electronAPI.onRequestContentSaveAs((filePath) => {
        const content = Editor.isEditorMode ? Editor.getContent() : App.currentContent;
        window.electronAPI.saveContent(content, filePath);
    });
}
