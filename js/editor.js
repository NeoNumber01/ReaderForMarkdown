/**
 * Editor Module - Markdown 编辑器
 * 支持创建、编辑和实时预览 Markdown
 */

const Editor = {
    isEditorMode: false,
    originalContent: '',

    // 历史记录系统 - 支持多步撤销/重做
    history: [],           // 历史记录栈
    historyIndex: -1,      // 当前历史位置
    maxHistory: 100,       // 最大历史记录数
    isUndoRedo: false,     // 标记是否正在执行撤销/重做

    // 图片存储系统 - 在编辑器中用短标记替代 Base64
    imageStore: {},        // 存储 Base64 图片数据 {id: base64Data}
    imageCounter: 0,       // 图片计数器

    // 同步滚动控制
    syncScrollEnabled: true, // 是否启用同步滚动

    /**
     * 检查键盘事件是否匹配快捷键配置
     * @param {KeyboardEvent} e - 键盘事件
     * @param {Object} shortcut - 快捷键配置 {key, ctrl, shift, alt}
     * @returns {boolean} 是否匹配
     */
    matchShortcut(e, shortcut) {
        if (!shortcut) return false;
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = (e.ctrlKey || e.metaKey) === shortcut.ctrl;
        const shiftMatch = e.shiftKey === shortcut.shift;
        const altMatch = e.altKey === shortcut.alt;
        return keyMatch && ctrlMatch && shiftMatch && altMatch;
    },

    /**
     * 初始化编辑器
     */
    init() {
        this.createEditorUI();
        this.bindEvents();
        this.initHistory();

        // 监听语言变化事件，重新初始化需要更新的 UI
        window.addEventListener('languageChanged', () => {
            // 更新同步滚动按钮的 title
            const syncBtn = document.getElementById('toggle-sync-scroll');
            if (syncBtn) {
                if (this.syncScrollEnabled) {
                    syncBtn.title = I18nManager.t('editor.sync_on');
                } else {
                    syncBtn.title = I18nManager.t('editor.sync_off');
                }
            }
        });
    },

    /**
     * 创建编辑器 UI
     */
    createEditorUI() {
        // 创建编辑器容器
        const editorContainer = document.createElement('div');
        editorContainer.id = 'editor-container';
        editorContainer.className = 'editor-container';
        editorContainer.innerHTML = `
            <div class="editor-toolbar">
                <div class="editor-toolbar-left">
                    <button type="button" class="btn btn-icon editor-btn" data-action="bold" title="${I18nManager.t('editor.bold')}" data-i18n-title="editor.bold">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                            <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                        </svg>
                    </button>
                    <button type="button" class="btn btn-icon editor-btn" data-action="italic" title="${I18nManager.t('editor.italic')}" data-i18n-title="editor.italic">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="19" y1="4" x2="10" y2="4"></line>
                            <line x1="14" y1="20" x2="5" y2="20"></line>
                            <line x1="15" y1="4" x2="9" y2="20"></line>
                        </svg>
                    </button>
                    <button type="button" class="btn btn-icon editor-btn" data-action="h1" title="${I18nManager.t('editor.h1')}" data-i18n-title="editor.h1">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 12h8"></path>
                            <path d="M4 18V6"></path>
                            <path d="M12 18V6"></path>
                            <text x="16" y="18" font-size="10" fill="currentColor" stroke="none" font-weight="bold">1</text>
                        </svg>
                    </button>
                    <button type="button" class="btn btn-icon editor-btn" data-action="h2" title="${I18nManager.t('editor.h2')}" data-i18n-title="editor.h2">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 12h8"></path>
                            <path d="M4 18V6"></path>
                            <path d="M12 18V6"></path>
                            <text x="16" y="18" font-size="10" fill="currentColor" stroke="none" font-weight="bold">2</text>
                        </svg>
                    </button>
                    <button type="button" class="btn btn-icon editor-btn" data-action="h3" title="${I18nManager.t('editor.h3')}" data-i18n-title="editor.h3">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 12h8"></path>
                            <path d="M4 18V6"></path>
                            <path d="M12 18V6"></path>
                            <text x="16" y="18" font-size="10" fill="currentColor" stroke="none" font-weight="bold">3</text>
                        </svg>
                    </button>
                    <button type="button" class="btn btn-icon editor-btn" data-action="h4" title="${I18nManager.t('editor.h4')}" data-i18n-title="editor.h4">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 12h8"></path>
                            <path d="M4 18V6"></path>
                            <path d="M12 18V6"></path>
                            <text x="16" y="18" font-size="10" fill="currentColor" stroke="none" font-weight="bold">4</text>
                        </svg>
                    </button>
                    <button type="button" class="btn btn-icon editor-btn" data-action="h5" title="${I18nManager.t('editor.h5')}" data-i18n-title="editor.h5">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 12h8"></path>
                            <path d="M4 18V6"></path>
                            <path d="M12 18V6"></path>
                            <text x="16" y="18" font-size="10" fill="currentColor" stroke="none" font-weight="bold">5</text>
                        </svg>
                    </button>
                    <button type="button" class="btn btn-icon editor-btn" data-action="h6" title="${I18nManager.t('editor.h6')}" data-i18n-title="editor.h6">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 12h8"></path>
                            <path d="M4 18V6"></path>
                            <path d="M12 18V6"></path>
                            <text x="16" y="18" font-size="10" fill="currentColor" stroke="none" font-weight="bold">6</text>
                        </svg>
                    </button>
                    <span class="editor-separator"></span>
                    <button type="button" class="btn btn-icon editor-btn" data-action="link" title="${I18nManager.t('editor.link')}" data-i18n-title="editor.link">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                    </button>
                    <button type="button" class="btn btn-icon editor-btn" data-action="image" title="${I18nManager.t('editor.image')}" data-i18n-title="editor.image">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                    </button>
                    <button type="button" class="btn btn-icon editor-btn" data-action="code" title="${I18nManager.t('editor.code')}" data-i18n-title="editor.code">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="16 18 22 12 16 6"></polyline>
                            <polyline points="8 6 2 12 8 18"></polyline>
                        </svg>
                    </button>
                    <button type="button" class="btn btn-icon editor-btn" data-action="formula" title="${I18nManager.t('editor.formula')}" data-i18n-title="editor.formula">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <text x="3" y="17" font-size="14" font-style="italic" fill="currentColor" stroke="none">∑</text>
                            <text x="14" y="17" font-size="10" font-style="italic" fill="currentColor" stroke="none">x²</text>
                        </svg>
                    </button>
                    <button type="button" class="btn btn-icon editor-btn" data-action="quote" title="${I18nManager.t('editor.quote')}" data-i18n-title="editor.quote">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"></path>
                            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                        </svg>
                    </button>
                    <span class="editor-separator"></span>
                    <button type="button" class="btn btn-icon editor-btn" data-action="ul" title="${I18nManager.t('editor.ul')}" data-i18n-title="editor.ul">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="8" y1="6" x2="21" y2="6"></line>
                            <line x1="8" y1="12" x2="21" y2="12"></line>
                            <line x1="8" y1="18" x2="21" y2="18"></line>
                            <circle cx="4" cy="6" r="1" fill="currentColor"></circle>
                            <circle cx="4" cy="12" r="1" fill="currentColor"></circle>
                            <circle cx="4" cy="18" r="1" fill="currentColor"></circle>
                        </svg>
                    </button>
                    <button type="button" class="btn btn-icon editor-btn" data-action="ol" title="${I18nManager.t('editor.ol')}" data-i18n-title="editor.ol">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="10" y1="6" x2="21" y2="6"></line>
                            <line x1="10" y1="12" x2="21" y2="12"></line>
                            <line x1="10" y1="18" x2="21" y2="18"></line>
                            <text x="2" y="8" font-size="6" fill="currentColor" stroke="none">1</text>
                            <text x="2" y="14" font-size="6" fill="currentColor" stroke="none">2</text>
                            <text x="2" y="20" font-size="6" fill="currentColor" stroke="none">3</text>
                        </svg>
                    </button>
                    <button type="button" class="btn btn-icon editor-btn" data-action="table" title="${I18nManager.t('editor.table')}" data-i18n-title="editor.table">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="3" y1="9" x2="21" y2="9"></line>
                            <line x1="3" y1="15" x2="21" y2="15"></line>
                            <line x1="9" y1="3" x2="9" y2="21"></line>
                            <line x1="15" y1="3" x2="15" y2="21"></line>
                        </svg>
                    </button>
                    <span class="editor-separator"></span>
                    <button type="button" class="btn btn-icon editor-btn" data-action="clear" title="${I18nManager.t('editor.clear')}" data-i18n-title="editor.clear">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 20H7L3 16l9-13 8 8-5 9z"></path>
                            <path d="M6.5 13.5l5 5"></path>
                            <path d="M4 20h16"></path>
                        </svg>
                    </button>
                    <button type="button" class="btn btn-icon editor-btn" data-action="undo" title="${I18nManager.t('editor.undo')}" data-i18n-title="editor.undo">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="1 4 1 10 7 10"></polyline>
                            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                        </svg>
                    </button>
                    <button type="button" class="btn btn-icon editor-btn" data-action="redo" title="${I18nManager.t('editor.redo')}" data-i18n-title="editor.redo">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="23 4 23 10 17 10"></polyline>
                            <path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10"></path>
                        </svg>
                    </button>
                </div>
                <div class="editor-toolbar-right">
                    <button type="button" class="btn btn-icon active" id="toggle-sync-scroll" title="${I18nManager.t('editor.sync_scroll')}" data-i18n-title="editor.sync_scroll">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 1l4 4-4 4"></path>
                            <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                            <path d="M7 23l-4-4 4-4"></path>
                            <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                        </svg>
                    </button>
                    <button type="button" class="btn btn-icon" id="toggle-preview" title="${I18nManager.t('editor.preview')}" data-i18n-title="editor.preview">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </button>
                    <button type="button" class="btn btn-icon" id="editor-export-btn" title="${I18nManager.t('editor.export')}" data-i18n-title="editor.export">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                    </button>
                    <button type="button" class="btn btn-icon" id="editor-settings-btn" title="${I18nManager.t('editor.settings')}" data-i18n-title="editor.settings">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                        </svg>
                    </button>
                    <button type="button" class="btn btn-secondary" id="exit-editor-btn" title="${I18nManager.t('editor.back_tooltip')}" data-i18n-title="editor.back_tooltip">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9 10 4 15 9 20"></polyline>
                            <path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
                        </svg>
                        <span data-i18n="editor.back">${I18nManager.t('editor.back')}</span>
                    </button>
                </div>
            </div>
            <div class="editor-main">
                <div class="editor-pane">
                    <textarea id="editor-textarea" class="editor-textarea" placeholder="${I18nManager.t('editor.placeholder')}" data-i18n="editor.placeholder" data-i18n-target="placeholder"></textarea>
                </div>

                <div class="preview-pane" id="preview-pane">
                    <div class="markdown-body" id="preview-content"></div>
                </div>
            </div>
        `;

        // 插入到主内容区域之后
        const mainContent = document.querySelector('.main-content');
        mainContent.appendChild(editorContainer);
    },

    /**
     * 绑定事件
     */
    bindEvents() {
        // 编辑器工具栏按钮 - 使用事件委托
        const toolbar = document.querySelector('.editor-toolbar-left');
        if (toolbar) {
            toolbar.addEventListener('click', (e) => {
                // 阻止默认行为和冒泡
                e.preventDefault();
                e.stopPropagation();

                const btn = e.target.closest('.editor-btn');
                if (btn) {
                    const action = btn.dataset.action;
                    if (action) {
                        this.handleToolbarAction(action);
                    }
                }
            });
        }

        // 切换预览
        const togglePreview = document.getElementById('toggle-preview');
        if (togglePreview) {
            togglePreview.addEventListener('click', (e) => {
                e.preventDefault();
                this.togglePreviewPane();
            });
        }

        // 退出编辑模式按钮
        const exitEditorBtn = document.getElementById('exit-editor-btn');
        if (exitEditorBtn) {
            exitEditorBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (typeof App !== 'undefined') {
                    App.exitEditMode();
                } else {
                    this.exitEditMode();
                }
            });
        }

        // 同步滚动切换按钮
        const toggleSyncScroll = document.getElementById('toggle-sync-scroll');
        if (toggleSyncScroll) {
            toggleSyncScroll.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleSyncScroll();
            });
        }

        // 导出按钮
        const exportBtn = document.getElementById('editor-export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (typeof ExportManager !== 'undefined') {
                    ExportManager.showExportMenu();
                }
            });
        }

        // 编辑器设置按钮
        const editorSettingsBtn = document.getElementById('editor-settings-btn');
        if (editorSettingsBtn) {
            editorSettingsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (typeof SettingsManager !== 'undefined') {
                    SettingsManager.showSettingsDialog();
                }
            });
        }

        // 编辑器输入事件 - 实时预览和历史记录
        const textarea = document.getElementById('editor-textarea');
        if (textarea) {
            let debounceTimer;
            let historyTimer;

            textarea.addEventListener('input', () => {
                // 实时预览防抖
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    this.updatePreview();
                }, 150);

                // 历史记录防抖（500ms 内的连续输入合并为一条记录）
                clearTimeout(historyTimer);
                historyTimer = setTimeout(() => {
                    this.saveToHistory();
                }, 500);
            });

            // 同步滚动 - 编辑区滚动时预览区同步滚动
            textarea.addEventListener('scroll', () => {
                // 检查是否启用同步滚动，撤销/重做时不触发
                if (this.syncScrollEnabled && !this.isUndoRedo) {
                    this.syncScroll();
                }
            });

            // 键盘快捷键
            textarea.addEventListener('keydown', (e) => {
                // Tab 键插入空格
                if (e.key === 'Tab') {
                    e.preventDefault();
                    const tabSize = (typeof SettingsManager !== 'undefined' && SettingsManager.settings)
                        ? SettingsManager.settings.editor.tabSize
                        : 4;
                    this.insertAtCursor(' '.repeat(tabSize));
                    return;
                }

                // Ctrl/Cmd 快捷键
                if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) {
                    // 检查是否匹配自定义快捷键
                    if (typeof SettingsManager !== 'undefined' && SettingsManager.settings) {
                        const shortcuts = SettingsManager.settings.shortcuts;

                        // 撤销
                        if (this.matchShortcut(e, shortcuts.undo)) {
                            e.preventDefault();
                            this.undo();
                            return;
                        }

                        // 重做
                        if (this.matchShortcut(e, shortcuts.redo)) {
                            e.preventDefault();
                            this.redo();
                            return;
                        }

                        // 粗体
                        if (this.matchShortcut(e, shortcuts.bold)) {
                            e.preventDefault();
                            this.handleToolbarAction('bold');
                            return;
                        }

                        // 斜体
                        if (this.matchShortcut(e, shortcuts.italic)) {
                            e.preventDefault();
                            this.handleToolbarAction('italic');
                            return;
                        }

                        // 链接
                        if (this.matchShortcut(e, shortcuts.link)) {
                            e.preventDefault();
                            this.handleToolbarAction('link');
                            return;
                        }
                    } else {
                        // 降级到默认快捷键
                        if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
                            switch (e.key.toLowerCase()) {
                                case 'z':
                                    e.preventDefault();
                                    this.undo();
                                    return;
                                case 'y':
                                    e.preventDefault();
                                    this.redo();
                                    return;
                                case 'b':
                                    e.preventDefault();
                                    this.handleToolbarAction('bold');
                                    return;
                                case 'i':
                                    e.preventDefault();
                                    this.handleToolbarAction('italic');
                                    return;
                                case 'k':
                                    e.preventDefault();
                                    this.handleToolbarAction('link');
                                    return;
                            }
                        }
                        // Ctrl+Shift+Z 重做
                        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z') {
                            e.preventDefault();
                            this.redo();
                            return;
                        }
                    }
                }
            });
        }
    },

    /**
     * 在光标处插入文本
     * @param {string} text - 要插入的文本
     */
    insertAtCursor(text) {
        const textarea = document.getElementById('editor-textarea');
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const scrollTop = textarea.scrollTop;

        textarea.value = textarea.value.substring(0, start) + text + textarea.value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + text.length;
        textarea.scrollTop = scrollTop;
        textarea.focus();

        this.updatePreview();
    },

    /**
     * 处理工具栏操作
     * @param {string} action - 操作类型
     */
    handleToolbarAction(action) {
        const textarea = document.getElementById('editor-textarea');
        if (!textarea) return;

        // 保存滚动位置
        const scrollTop = textarea.scrollTop;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        const beforeText = textarea.value.substring(0, start);
        const afterText = textarea.value.substring(end);

        let insertText = '';
        let newSelectionStart = start;
        let newSelectionEnd = start;

        switch (action) {
            case 'bold':
                if (selectedText) {
                    insertText = `**${selectedText}**`;
                    newSelectionStart = start;
                    newSelectionEnd = start + insertText.length;
                } else {
                    insertText = I18nManager.t('editor.bold_placeholder');
                    newSelectionStart = start + 2;
                    newSelectionEnd = start + 2 + I18nManager.t('editor.bold_placeholder').length - 4; // select inner text
                }
                break;

            case 'italic':
                if (selectedText) {
                    insertText = `*${selectedText}*`;
                    newSelectionStart = start;
                    newSelectionEnd = start + insertText.length;
                } else {
                    insertText = I18nManager.t('editor.italic_placeholder');
                    newSelectionStart = start + 1;
                    newSelectionEnd = start + 1 + I18nManager.t('editor.italic_placeholder').length - 2;
                }
                break;

            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'h5':
            case 'h6':
                const headingLevel = parseInt(action.charAt(1));
                const headingPrefix = '#'.repeat(headingLevel) + ' ';
                const defaultHeading = I18nManager.t('editor.heading_placeholder') + ' ' + headingLevel;

                // 移除选中文本中已有的标题标记
                let cleanText = selectedText || defaultHeading;
                cleanText = cleanText.replace(/^#{1,6}\s*/, '');

                // 检查是否在行首
                const lineStart = beforeText.lastIndexOf('\n') + 1;
                const currentLine = beforeText.substring(lineStart);

                if (currentLine.trim() === '') {
                    insertText = headingPrefix + cleanText;
                } else {
                    insertText = '\n' + headingPrefix + cleanText;
                }
                newSelectionStart = start;
                newSelectionEnd = start + insertText.length;
                break;

            case 'link':
                if (selectedText) {
                    insertText = `[${selectedText}](url)`;
                    // 选中 url 部分方便直接输入
                    newSelectionStart = start + selectedText.length + 3;
                    newSelectionEnd = start + selectedText.length + 6;
                } else {
                    insertText = I18nManager.t('editor.link_placeholder');
                    newSelectionStart = start + 1;
                    newSelectionEnd = start + I18nManager.t('editor.link_placeholder').indexOf('](');
                }
                break;

            case 'image':
                this.showImageDialog();
                return; // 提前返回

            case 'code':
                if (selectedText && selectedText.includes('\n')) {
                    insertText = '\n```\n' + selectedText + '\n```\n';
                    newSelectionStart = start;
                    newSelectionEnd = start + insertText.length;
                } else if (selectedText) {
                    insertText = '`' + selectedText + '`';
                    newSelectionStart = start;
                    newSelectionEnd = start + insertText.length;
                } else {
                    insertText = I18nManager.t('editor.code_placeholder');
                    newSelectionStart = start + 1;
                    newSelectionEnd = start + I18nManager.t('editor.code_placeholder').length - 1;
                }
                break;

            case 'quote':
                if (selectedText) {
                    // 给每行添加引用前缀
                    const lines = selectedText.split('\n');
                    insertText = lines.map(line => '> ' + line).join('\n');
                    newSelectionStart = start;
                    newSelectionEnd = start + insertText.length;
                } else {
                    insertText = I18nManager.t('editor.quote_placeholder');
                    newSelectionStart = start + 3;
                    newSelectionEnd = start + insertText.length;
                }
                break;

            case 'ul':
                if (selectedText) {
                    const lines = selectedText.split('\n');
                    insertText = lines.map(line => '- ' + line).join('\n');
                    newSelectionStart = start;
                    newSelectionEnd = start + insertText.length;
                } else {
                    insertText = I18nManager.t('editor.ul_placeholder');
                    newSelectionStart = start + 3;
                    newSelectionEnd = start + insertText.length;
                }
                break;

            case 'ol':
                if (selectedText) {
                    const lines = selectedText.split('\n');
                    insertText = lines.map((line, i) => `${i + 1}. ${line}`).join('\n');
                    newSelectionStart = start;
                    newSelectionEnd = start + insertText.length;
                } else {
                    insertText = I18nManager.t('editor.ol_placeholder');
                    newSelectionStart = start + 4;
                    newSelectionEnd = start + insertText.length;
                }
                break;

            case 'table':
                this.showTableDialog();
                return; // 提前返回

            case 'formula':
                // 公式插入/升级逻辑：
                // 1. 未包裹 → 添加 $ 或 $$
                // 2. $...$ → 升级为 $$...$$
                // 3. $$...$$ → 保持不变
                if (selectedText) {
                    // 检查是否已被 $$ 包裹（块级公式）
                    const blockMatch = selectedText.match(/^\$\$([\s\S]*)\$\$$/);
                    if (blockMatch) {
                        // 已是块级公式，保持不变
                        insertText = selectedText;
                        newSelectionStart = start;
                        newSelectionEnd = start + insertText.length;
                        break;
                    }

                    // 检查是否已被单个 $ 包裹（行内公式）
                    const inlineMatch = selectedText.match(/^\$([^$]+)\$$/);
                    if (inlineMatch) {
                        // 升级为块级公式 $$...$$
                        const content = inlineMatch[1];
                        insertText = '$$' + content + '$$';
                        newSelectionStart = start;
                        newSelectionEnd = start + insertText.length;
                        break;
                    }

                    // 未被包裹，添加公式标记
                    // 检查是否包含换行符，如果包含则使用块级公式
                    if (selectedText.includes('\n')) {
                        insertText = '\n$$\n' + selectedText + '\n$$\n';
                    } else {
                        insertText = '$' + selectedText + '$';
                    }
                    newSelectionStart = start;
                    newSelectionEnd = start + insertText.length;
                } else {
                    // 默认插入空白块级公式模板
                    insertText = '\n$$\n\n$$\n';
                    newSelectionStart = start + 4;
                    newSelectionEnd = start + 4; // 光标定位到公式内容开始位置
                }
                break;

            case 'clear':
                // 清除格式：移除所有 Markdown 标记，还原为纯文本
                if (selectedText) {
                    insertText = selectedText
                        // 移除代码块（多行）
                        .replace(/```[\s\S]*?```/g, (match) => {
                            // 提取代码块内容（去掉首行语言标识和末尾的```）
                            const lines = match.split('\n');
                            if (lines.length > 2) {
                                return lines.slice(1, -1).join('\n');
                            }
                            return match.replace(/```/g, '');
                        })
                        // 移除块级数学公式 $$...$$
                        .replace(/\$\$[\s\S]*?\$\$/g, (match) => {
                            return match.replace(/^\$\$\s*/, '').replace(/\s*\$\$$/, '');
                        })
                        // 移除行内数学公式 $...$
                        .replace(/\$([^$\n]+?)\$/g, '$1')
                        // 移除粗体+斜体组合
                        .replace(/\*\*\*(.+?)\*\*\*/g, '$1')
                        .replace(/___(.+?)___/g, '$1')
                        // 移除粗体
                        .replace(/\*\*(.+?)\*\*/g, '$1')
                        .replace(/__(.+?)__/g, '$1')
                        // 移除斜体
                        .replace(/\*(.+?)\*/g, '$1')
                        .replace(/_(.+?)_/g, '$1')
                        // 移除删除线
                        .replace(/~~(.+?)~~/g, '$1')
                        // 移除高亮文本
                        .replace(/==(.+?)==/g, '$1')
                        // 移除行内代码
                        .replace(/`(.+?)`/g, '$1')
                        // 移除链接，保留文本
                        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
                        // 移除图片，保留 alt 文本
                        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
                        // 移除脚注引用
                        .replace(/\[\^[^\]]+\]/g, '')
                        // 移除标题标记
                        .replace(/^#{1,6}\s*/gm, '')
                        // 移除无序列表标记
                        .replace(/^[\s]*[-*+]\s+/gm, '')
                        // 移除有序列表标记
                        .replace(/^[\s]*\d+\.\s+/gm, '')
                        // 移除任务列表标记
                        .replace(/^[\s]*[-*+]\s+\[[ xX]\]\s*/gm, '')
                        // 移除引用标记（多层）
                        .replace(/^(>\s*)+/gm, '')
                        // 移除水平线
                        .replace(/^[-*_]{3,}$/gm, '')
                        // 移除上标
                        .replace(/\^(.+?)\^/g, '$1')
                        // 移除下标
                        .replace(/~(.+?)~/g, '$1')
                        // 清理多余空行
                        .replace(/\n{3,}/g, '\n\n')
                        .trim();
                    newSelectionStart = start;
                    newSelectionEnd = start + insertText.length;
                } else {
                    return; // 没有选中文本则不操作
                }
                break;

            case 'undo':
                this.undo();
                return; // 提前返回

            case 'redo':
                this.redo();
                return; // 提前返回

            default:
                return;
        }

        // 更新文本
        textarea.value = beforeText + insertText + afterText;

        // 设置选中范围（保持文本选中状态）
        textarea.selectionStart = newSelectionStart;
        textarea.selectionEnd = newSelectionEnd;

        // 恢复滚动位置
        textarea.scrollTop = scrollTop;

        // 保持焦点
        textarea.focus();

        // 更新预览
        this.updatePreview();

        // 保存到历史记录
        this.saveToHistory();
    },

    /**
     * 显示图片插入对话框
     */
    showImageDialog() {
        // 移除已存在的对话框
        const existing = document.querySelector('.image-dialog-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.className = 'image-dialog-overlay';
        overlay.innerHTML = `
            <div class="image-dialog">
                <div class="image-dialog-header">
                    <h3>${I18nManager.t('image.title')}</h3>
                    <button type="button" class="image-dialog-close">&times;</button>
                </div>
                <div class="image-dialog-tabs">
                    <button type="button" class="image-tab-btn active" data-tab="upload">${I18nManager.t('image.tab.local')}</button>
                    <button type="button" class="image-tab-btn" data-tab="url">${I18nManager.t('image.tab.url')}</button>
                </div>
                <div class="image-dialog-body">
                    <div class="image-tab-panel active" id="panel-upload">
                        <div class="image-drop-area" id="image-drop-area">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <path d="M21 15l-5-5L5 21"></path>
                            </svg>
                            <p>${I18nManager.t('image.drop_hint')}</p>
                            <span>${I18nManager.t('image.formats')}</span>
                        </div>
                        <input type="file" id="image-file-input" accept="image/*" hidden>
                    </div>
                    <div class="image-tab-panel" id="panel-url">
                        <input type="text" id="image-url-input" class="image-text-input" placeholder="${I18nManager.t('editor.image_url_hint')}">
                    </div>
                    <div class="image-preview-area" id="image-preview-area" style="display:none;">
                        <img id="image-preview-img" src="" alt="${I18nManager.t('image.preview_alt')}">
                    </div>
                    <div class="image-alt-input-wrapper">
                        <label>${I18nManager.t('image.alt_label')}</label>
                        <input type="text" id="image-alt-input" class="image-text-input" placeholder="${I18nManager.t('editor.image_alt_hint')}">
                    </div>
                </div>
                <div class="image-dialog-footer">
                    <button type="button" class="btn btn-secondary" id="image-cancel-btn">${I18nManager.t('image.cancel')}</button>
                    <button type="button" class="btn btn-primary" id="image-insert-btn" disabled>${I18nManager.t('image.insert')}</button>
                </div>
            </div>
        `;

        // 添加样式
        if (!document.getElementById('image-dialog-styles')) {
            const style = document.createElement('style');
            style.id = 'image-dialog-styles';
            style.textContent = `
                .image-dialog-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 9999; animation: fadeIn 0.2s; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .image-dialog { background: var(--color-bg-secondary, #fff); border-radius: 12px; width: 90%; max-width: 460px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); overflow: hidden; }
                .image-dialog-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid var(--color-border, #e2e8f0); }
                .image-dialog-header h3 { margin: 0; font-size: 16px; font-weight: 600; }
                .image-dialog-close { background: none; border: none; font-size: 24px; cursor: pointer; color: var(--color-text-secondary, #64748b); line-height: 1; padding: 0; }
                .image-dialog-tabs { display: flex; border-bottom: 1px solid var(--color-border, #e2e8f0); }
                .image-tab-btn { flex: 1; padding: 12px; background: none; border: none; border-bottom: 2px solid transparent; cursor: pointer; font-size: 14px; color: var(--color-text-secondary, #64748b); transition: all 0.2s; }
                .image-tab-btn.active { color: var(--color-accent, #3b82f6); border-bottom-color: var(--color-accent, #3b82f6); }
                .image-dialog-body { padding: 20px; }
                .image-tab-panel { display: none; }
                .image-tab-panel.active { display: block; }
                .image-drop-area { border: 2px dashed var(--color-border, #e2e8f0); border-radius: 8px; padding: 32px 20px; text-align: center; cursor: pointer; transition: all 0.2s; }
                .image-drop-area:hover, .image-drop-area.dragover { border-color: var(--color-accent, #3b82f6); background: rgba(59,130,246,0.05); }
                .image-drop-area svg { width: 48px; height: 48px; color: var(--color-text-tertiary, #94a3b8); margin-bottom: 12px; }
                .image-drop-area p { margin: 0 0 4px; font-weight: 500; color: var(--color-text-primary, #1e293b); }
                .image-drop-area span { font-size: 12px; color: var(--color-text-tertiary, #94a3b8); }
                .image-text-input { width: 100%; padding: 10px 12px; border: 1px solid var(--color-border, #e2e8f0); border-radius: 6px; font-size: 14px; background: var(--color-bg-primary, #fff); color: var(--color-text-primary, #1e293b); }
                .image-text-input:focus { outline: none; border-color: var(--color-accent, #3b82f6); box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
                .image-preview-area { margin-top: 16px; padding: 12px; background: var(--color-bg-tertiary, #f8fafc); border-radius: 8px; text-align: center; }
                .image-preview-area img { max-width: 100%; max-height: 150px; border-radius: 4px; }
                .image-alt-input-wrapper { margin-top: 16px; }
                .image-alt-input-wrapper label { display: block; margin-bottom: 6px; font-size: 13px; color: var(--color-text-secondary, #64748b); }
                .image-dialog-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 20px; border-top: 1px solid var(--color-border, #e2e8f0); }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(overlay);

        let imageData = null;

        // Tab 切换
        overlay.querySelectorAll('.image-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                overlay.querySelectorAll('.image-tab-btn').forEach(b => b.classList.remove('active'));
                overlay.querySelectorAll('.image-tab-panel').forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
            });
        });

        // 拖放区域
        const dropArea = document.getElementById('image-drop-area');
        const fileInput = document.getElementById('image-file-input');

        dropArea.addEventListener('click', (e) => {
            e.preventDefault();
            fileInput.click();
        });

        dropArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropArea.classList.add('dragover');
        });

        dropArea.addEventListener('dragleave', () => {
            dropArea.classList.remove('dragover');
        });

        dropArea.addEventListener('drop', (e) => {
            e.preventDefault();
            dropArea.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                handleFile(file);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files[0]) {
                handleFile(e.target.files[0]);
            }
        });

        // 处理文件
        const handleFile = (file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                imageData = e.target.result;
                showPreview(imageData);
                document.getElementById('image-insert-btn').disabled = false;
            };
            reader.readAsDataURL(file);
        };

        // URL 输入
        const urlInput = document.getElementById('image-url-input');
        urlInput.addEventListener('input', () => {
            const url = urlInput.value.trim();
            if (url) {
                imageData = url;
                showPreview(url);
                document.getElementById('image-insert-btn').disabled = false;
            } else {
                document.getElementById('image-preview-area').style.display = 'none';
                document.getElementById('image-insert-btn').disabled = true;
            }
        });

        // 显示预览
        const showPreview = (src) => {
            const previewArea = document.getElementById('image-preview-area');
            const previewImg = document.getElementById('image-preview-img');
            previewImg.src = src;
            previewArea.style.display = '';
        };

        // 关闭
        const closeDialog = () => {
            overlay.remove();
        };

        overlay.querySelector('.image-dialog-close').addEventListener('click', closeDialog);
        document.getElementById('image-cancel-btn').addEventListener('click', closeDialog);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeDialog();
        });

        // 插入
        document.getElementById('image-insert-btn').addEventListener('click', () => {
            if (!imageData) return;

            const alt = document.getElementById('image-alt-input').value || I18nManager.t('editor.image_default_alt');
            let markdown;

            // 如果是 Base64 图片，使用短标记存储
            if (imageData.startsWith('data:image/')) {
                const imgId = `img_${Date.now()}_${this.imageCounter++}`;
                this.imageStore[imgId] = imageData;
                markdown = `![${alt}](local:${imgId})`;
            } else {
                // 普通 URL 图片直接使用
                markdown = `![${alt}](${imageData})`;
            }

            this.insertAtCursor(markdown);
            closeDialog();
        });
    },

    /**
     * 显示表格插入对话框
     */
    showTableDialog() {
        // 移除已存在的对话框
        const existing = document.querySelector('.table-dialog-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.className = 'table-dialog-overlay';
        overlay.innerHTML = `
            <div class="table-dialog">
                <div class="table-dialog-header">
                    <h3>${I18nManager.t('table.title')}</h3>
                    <button type="button" class="table-dialog-close">&times;</button>
                </div>
                <div class="table-dialog-body">
                    <div class="table-size-inputs">
                        <div class="table-input-group">
                            <label for="table-rows">${I18nManager.t('table.rows')}</label>
                            <input type="number" id="table-rows" min="1" max="20" value="3">
                        </div>
                        <div class="table-input-group">
                            <label for="table-cols">${I18nManager.t('table.columns')}</label>
                            <input type="number" id="table-cols" min="1" max="20" value="3">
                        </div>
                    </div>
                    <div class="table-preview-section">
                        <label>${I18nManager.t('table.preview')}</label>
                        <div class="table-preview-container" id="table-preview-container"></div>
                    </div>
                </div>
                <div class="table-dialog-footer">
                    <button type="button" class="btn btn-secondary" id="table-cancel-btn">${I18nManager.t('table.cancel')}</button>
                    <button type="button" class="btn btn-primary" id="table-insert-btn">${I18nManager.t('table.insert')}</button>
                </div>
            </div>
        `;

        // 添加样式
        if (!document.getElementById('table-dialog-styles')) {
            const style = document.createElement('style');
            style.id = 'table-dialog-styles';
            style.textContent = `
                .table-dialog-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 9999; animation: fadeIn 0.2s; }
                .table-dialog { background: var(--color-bg-secondary, #fff); border-radius: 12px; width: 90%; max-width: 480px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); overflow: hidden; }
                .table-dialog-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid var(--color-border, #e2e8f0); }
                .table-dialog-header h3 { margin: 0; font-size: 16px; font-weight: 600; }
                .table-dialog-close { background: none; border: none; font-size: 24px; cursor: pointer; color: var(--color-text-secondary, #64748b); line-height: 1; padding: 0; }
                .table-dialog-body { padding: 20px; }
                .table-size-inputs { display: flex; gap: 16px; margin-bottom: 20px; }
                .table-input-group { flex: 1; }
                .table-input-group label { display: block; margin-bottom: 6px; font-size: 13px; color: var(--color-text-secondary, #64748b); font-weight: 500; }
                .table-input-group input { width: 100%; padding: 10px 12px; border: 1px solid var(--color-border, #e2e8f0); border-radius: 6px; font-size: 14px; background: var(--color-bg-primary, #fff); color: var(--color-text-primary, #1e293b); }
                .table-input-group input:focus { outline: none; border-color: var(--color-accent, #3b82f6); box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
                .table-preview-section label { display: block; margin-bottom: 8px; font-size: 13px; color: var(--color-text-secondary, #64748b); font-weight: 500; }
                .table-preview-container { background: var(--color-bg-tertiary, #f8fafc); border-radius: 8px; padding: 12px; overflow-x: auto; max-height: 200px; overflow-y: auto; }
                .table-preview-container table { border-collapse: collapse; width: 100%; font-size: 12px; }
                .table-preview-container th, .table-preview-container td { border: 1px solid var(--color-border, #e2e8f0); padding: 6px 10px; text-align: left; }
                .table-preview-container th { background: var(--color-bg-secondary, #f1f5f9); font-weight: 600; color: var(--color-text-primary, #1e293b); }
                .table-preview-container td { color: var(--color-text-secondary, #64748b); }
                .table-dialog-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 20px; border-top: 1px solid var(--color-border, #e2e8f0); }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(overlay);

        const rowsInput = document.getElementById('table-rows');
        const colsInput = document.getElementById('table-cols');
        const previewContainer = document.getElementById('table-preview-container');

        // 生成表格预览
        const updatePreview = () => {
            const rows = Math.max(1, Math.min(20, parseInt(rowsInput.value) || 3));
            const cols = Math.max(1, Math.min(20, parseInt(colsInput.value) || 3));

            let html = '<table><thead><tr>';
            for (let c = 0; c < cols; c++) {
                html += `<th>${I18nManager.t('table.header')} ${c + 1}</th>`;
            }
            html += '</tr></thead><tbody>';

            for (let r = 0; r < rows; r++) {
                html += '<tr>';
                for (let c = 0; c < cols; c++) {
                    html += `<td>${I18nManager.t('table.cell')} ${r + 1}-${c + 1}</td>`;
                }
                html += '</tr>';
            }
            html += '</tbody></table>';
            previewContainer.innerHTML = html;
        };

        // 初始化预览
        updatePreview();

        // 监听输入变化
        rowsInput.addEventListener('input', updatePreview);
        colsInput.addEventListener('input', updatePreview);

        // 生成 Markdown 表格
        const generateMarkdown = () => {
            const rows = Math.max(1, Math.min(20, parseInt(rowsInput.value) || 3));
            const cols = Math.max(1, Math.min(20, parseInt(colsInput.value) || 3));

            let md = '\n';

            // 表头
            md += '|';
            for (let c = 0; c < cols; c++) {
                md += ` ${I18nManager.t('table.header')} ${c + 1} |`;
            }
            md += '\n';

            // 分隔符
            md += '|';
            for (let c = 0; c < cols; c++) {
                md += '------|';
            }
            md += '\n';

            // 数据行
            for (let r = 0; r < rows; r++) {
                md += '|';
                for (let c = 0; c < cols; c++) {
                    md += ` ${I18nManager.t('table.cell')} ${r + 1}-${c + 1} |`;
                }
                md += '\n';
            }

            return md;
        };

        // 关闭对话框
        const closeDialog = () => {
            overlay.remove();
        };

        overlay.querySelector('.table-dialog-close').addEventListener('click', closeDialog);
        document.getElementById('table-cancel-btn').addEventListener('click', closeDialog);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeDialog();
        });

        // 插入表格
        document.getElementById('table-insert-btn').addEventListener('click', () => {
            const markdown = generateMarkdown();
            this.insertAtCursor(markdown);
            closeDialog();
            // 保存到历史记录
            this.saveToHistory();
        });
    },

    /**
     * 更新预览
     */
    updatePreview() {
        const textarea = document.getElementById('editor-textarea');
        const previewContent = document.getElementById('preview-content');
        const previewPane = document.querySelector('.preview-pane');

        if (textarea && previewContent && typeof MarkdownRenderer !== 'undefined') {
            // 保存预览面板的滚动位置
            const scrollTop = previewPane ? previewPane.scrollTop : 0;

            const html = MarkdownRenderer.render(textarea.value);
            previewContent.innerHTML = html;

            // 恢复滚动位置
            if (previewPane) {
                previewPane.scrollTop = scrollTop;
            }
        }
    },

    /**
     * 同步滚动 - 编辑区滚动时预览区跟随
     */
    syncScroll() {
        const textarea = document.getElementById('editor-textarea');
        const previewPane = document.querySelector('.preview-pane');

        if (!textarea || !previewPane) return;

        // 计算编辑器滚动百分比
        const textareaScrollHeight = textarea.scrollHeight - textarea.clientHeight;
        const scrollPercentage = textareaScrollHeight > 0
            ? textarea.scrollTop / textareaScrollHeight
            : 0;

        // 应用到预览面板
        const previewScrollHeight = previewPane.scrollHeight - previewPane.clientHeight;
        previewPane.scrollTop = scrollPercentage * previewScrollHeight;
    },

    /**
     * 切换同步滚动状态
     */
    toggleSyncScroll() {
        this.syncScrollEnabled = !this.syncScrollEnabled;

        // 更新按钮状态
        const btn = document.getElementById('toggle-sync-scroll');
        if (btn) {
            if (this.syncScrollEnabled) {
                btn.classList.add('active');
                btn.title = I18nManager.t('editor.sync_on');
            } else {
                btn.classList.remove('active');
                btn.title = I18nManager.t('editor.sync_off');
            }
        }

        // 同步到设置
        if (typeof SettingsManager !== 'undefined') {
            SettingsManager.setSetting('editor.syncScroll', this.syncScrollEnabled);
        }
    },

    /**
     * 更新同步滚动按钮可见性（双栏模式下显示）
     */
    updateSyncScrollButtonVisibility() {
        const btn = document.getElementById('toggle-sync-scroll');
        const editorPane = document.querySelector('.editor-pane');
        const previewPane = document.querySelector('.preview-pane');

        if (btn && editorPane && previewPane) {
            const editorHidden = editorPane.style.display === 'none';
            const previewHidden = previewPane.style.display === 'none';

            // 只有双栏模式下才显示同步滚动按钮
            if (!editorHidden && !previewHidden) {
                btn.style.display = '';
            } else {
                btn.style.display = 'none';
            }
        }
    },

    /**
     * 切换预览面板
     */
    togglePreviewPane() {
        const editorPane = document.querySelector('.editor-pane');
        const previewPane = document.querySelector('.preview-pane');

        if (!editorPane || !previewPane) return;

        const editorHidden = editorPane.style.display === 'none';
        const previewHidden = previewPane.style.display === 'none';

        if (!editorHidden && !previewHidden) {
            // 双栏 -> 仅预览
            editorPane.style.display = 'none';
            previewPane.style.display = '';
        } else if (editorHidden) {
            // 仅预览 -> 仅编辑
            editorPane.style.display = '';
            previewPane.style.display = 'none';
        } else {
            // 仅编辑 -> 双栏
            editorPane.style.display = '';
            previewPane.style.display = '';
        }

        // 更新同步滚动按钮可见性
        this.updateSyncScrollButtonVisibility();
    },

    /**
     * 进入编辑模式
     */
    enterEditMode(content = '', fileName = I18nManager.t('app.untitled')) {
        this.isEditorMode = true;
        this.originalContent = content;

        const editorContainer = document.getElementById('editor-container');
        const contentWrapper = document.querySelector('.content-wrapper');
        const welcomeScreen = document.getElementById('welcome-screen');
        const fileNameEl = document.getElementById('file-name');

        if (editorContainer) editorContainer.classList.add('active');
        if (contentWrapper) contentWrapper.style.display = 'none';
        if (welcomeScreen) welcomeScreen.style.display = 'none';
        if (fileNameEl) fileNameEl.textContent = `${I18nManager.t('editor.editing_prefix')}${fileName}`;

        // 重置预览模式
        const editorPane = document.querySelector('.editor-pane');
        const previewPane = document.querySelector('.preview-pane');
        if (editorPane) editorPane.style.display = '';
        if (previewPane) previewPane.style.display = '';

        const textarea = document.getElementById('editor-textarea');
        if (textarea) {
            textarea.value = content;
            textarea.focus();
            this.updatePreview();

            // 重置历史记录并保存初始状态
            this.initHistory();
            this.saveToHistory();
        }

        // 更新同步滚动按钮可见性
        this.updateSyncScrollButtonVisibility();

        document.title = `${I18nManager.t('editor.editing_prefix')}${fileName} - Markdown Reader`;
    },

    /**
     * 退出编辑模式
     */
    exitEditMode() {
        this.isEditorMode = false;

        const editorContainer = document.getElementById('editor-container');
        const contentWrapper = document.querySelector('.content-wrapper');

        if (editorContainer) editorContainer.classList.remove('active');
        if (contentWrapper) contentWrapper.style.display = '';
    },

    /**
     * 获取当前编辑内容（导出用，会将本地图片标记替换为 Base64）
     * @param {boolean} resolveLocalImages - 是否解析本地图片标记为 Base64
     */
    getContent(resolveLocalImages = true) {
        const textarea = document.getElementById('editor-textarea');
        if (!textarea) return '';

        let content = textarea.value;

        // 如果需要解析本地图片标记，替换为 Base64 数据
        if (resolveLocalImages && Object.keys(this.imageStore).length > 0) {
            content = content.replace(/!\[([^\]]*)\]\(local:([^)]+)\)/g, (match, alt, imgId) => {
                const base64Data = this.imageStore[imgId];
                if (base64Data) {
                    return `![${alt}](${base64Data})`;
                }
                return match;
            });
        }

        return content;
    },

    /**
     * 获取原始编辑内容（不解析本地图片标记）
     */
    getRawContent() {
        const textarea = document.getElementById('editor-textarea');
        return textarea ? textarea.value : '';
    },

    /**
     * 设置编辑内容
     */
    setContent(content) {
        const textarea = document.getElementById('editor-textarea');
        if (textarea) {
            textarea.value = content;
            this.updatePreview();
        }
    },

    /**
     * 检查是否有未保存的更改
     */
    hasUnsavedChanges() {
        return this.getContent() !== this.originalContent;
    },

    /**
     * 初始化历史记录系统
     */
    initHistory() {
        this.history = [];
        this.historyIndex = -1;
    },

    /**
     * 保存当前状态到历史记录
     */
    saveToHistory() {
        if (this.isUndoRedo) return; // 撤销/重做操作不记录

        const textarea = document.getElementById('editor-textarea');
        if (!textarea) return;

        const content = textarea.value;
        const cursorPos = textarea.selectionStart;

        // 如果当前不在历史末尾，删除后面的记录
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }

        // 避免重复记录相同内容
        if (this.history.length > 0 && this.history[this.history.length - 1].content === content) {
            return;
        }

        // 添加新记录
        this.history.push({ content, cursorPos });

        // 限制历史记录数量
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }

        this.historyIndex = this.history.length - 1;
    },

    /**
     * 撤销操作
     */
    undo() {
        if (this.historyIndex <= 0) return;

        this.isUndoRedo = true;
        this.historyIndex--;

        const state = this.history[this.historyIndex];
        const textarea = document.getElementById('editor-textarea');
        const previewPane = document.querySelector('.preview-pane');

        if (textarea && state) {
            const textareaScrollTop = textarea.scrollTop;
            const previewScrollTop = previewPane ? previewPane.scrollTop : 0;

            textarea.value = state.content;
            textarea.setSelectionRange(state.cursorPos, state.cursorPos);
            textarea.focus({ preventScroll: true });

            // 使用 requestAnimationFrame 确保滚动位置在 DOM 更新后恢复
            requestAnimationFrame(() => {
                textarea.scrollTop = textareaScrollTop;
                if (previewPane) previewPane.scrollTop = previewScrollTop;
                this.updatePreview();
                requestAnimationFrame(() => {
                    textarea.scrollTop = textareaScrollTop;
                    if (previewPane) previewPane.scrollTop = previewScrollTop;
                    this.isUndoRedo = false;
                });
            });
        } else {
            this.isUndoRedo = false;
        }
    },

    /**
     * 重做操作
     */
    redo() {
        if (this.historyIndex >= this.history.length - 1) return;

        this.isUndoRedo = true;
        this.historyIndex++;

        const state = this.history[this.historyIndex];
        const textarea = document.getElementById('editor-textarea');
        const previewPane = document.querySelector('.preview-pane');

        if (textarea && state) {
            const textareaScrollTop = textarea.scrollTop;
            const previewScrollTop = previewPane ? previewPane.scrollTop : 0;

            textarea.value = state.content;
            textarea.setSelectionRange(state.cursorPos, state.cursorPos);
            textarea.focus({ preventScroll: true });

            requestAnimationFrame(() => {
                textarea.scrollTop = textareaScrollTop;
                if (previewPane) previewPane.scrollTop = previewScrollTop;
                this.updatePreview();
                requestAnimationFrame(() => {
                    textarea.scrollTop = textareaScrollTop;
                    if (previewPane) previewPane.scrollTop = previewScrollTop;
                    this.isUndoRedo = false;
                });
            });
        } else {
            this.isUndoRedo = false;
        }
    }
};
