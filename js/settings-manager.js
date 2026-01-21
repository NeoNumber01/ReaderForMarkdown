/**
 * Settings Manager - 设置管理器
 * 管理应用设置、快捷键配置和设置面板
 */

const SettingsManager = {
    SETTINGS_KEY: 'markdown-reader-settings',

    // 默认设置
    defaultSettings: {
        shortcuts: {
            undo: { key: 'z', ctrl: true, shift: false, alt: false },
            redo: { key: 'y', ctrl: true, shift: false, alt: false },
            bold: { key: 'b', ctrl: true, shift: false, alt: false },
            italic: { key: 'i', ctrl: true, shift: false, alt: false },
            link: { key: 'k', ctrl: true, shift: false, alt: false },
            save: { key: 's', ctrl: true, shift: false, alt: false },
            newFile: { key: 'n', ctrl: true, shift: false, alt: false },
            openFile: { key: 'o', ctrl: true, shift: false, alt: false },
            toggleEdit: { key: 'e', ctrl: true, shift: false, alt: false },
            toggleTheme: { key: 'd', ctrl: true, shift: false, alt: false }
        },
        editor: {
            fontSize: 14,
            tabSize: 4,
            syncScroll: true,
            fontFamily: 'monospace'  // 编辑器字体
        },
        appearance: {
            theme: 'system',  // 'light', 'dark', 'system'
            previewFontSize: 16,  // 预览区字号
            previewFontFamily: 'system',  // 预览区字体
            accentColor: '#3B82F6',  // 主题强调色
            exportFontSize: 11  // 导出字体大小 (pt)
        }
    },

    // 当前设置
    settings: null,

    /**
     * 初始化设置管理器
     */
    init() {
        this.loadSettings();
        this.bindEvents();
        this.applySettings();
    },

    /**
     * 加载设置
     */
    loadSettings() {
        try {
            const saved = localStorage.getItem(this.SETTINGS_KEY);
            if (saved) {
                this.settings = this.mergeSettings(this.defaultSettings, JSON.parse(saved));
            } else {
                this.settings = JSON.parse(JSON.stringify(this.defaultSettings));
            }
        } catch (e) {
            console.error('Failed to load settings:', e);
            this.settings = JSON.parse(JSON.stringify(this.defaultSettings));
        }
    },

    /**
     * 合并设置（保留默认值中新增的项）
     */
    mergeSettings(defaults, saved) {
        const result = JSON.parse(JSON.stringify(defaults));
        for (const key in saved) {
            if (key in result) {
                if (typeof saved[key] === 'object' && !Array.isArray(saved[key])) {
                    result[key] = this.mergeSettings(result[key], saved[key]);
                } else {
                    result[key] = saved[key];
                }
            }
        }
        return result;
    },

    /**
     * 保存设置
     */
    saveSettings() {
        try {
            localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(this.settings));
        } catch (e) {
            console.error('Failed to save settings:', e);
        }
    },

    /**
     * 应用设置
     */
    applySettings() {
        // 应用主题设置
        if (this.settings.appearance.theme !== 'system') {
            ThemeManager.setTheme(this.settings.appearance.theme);
        }

        // 应用编辑器字体大小和字体
        const textarea = document.getElementById('editor-textarea');
        if (textarea) {
            textarea.style.fontSize = this.settings.editor.fontSize + 'px';
            textarea.style.fontFamily = this.getFontStack(this.settings.editor.fontFamily, 'editor');
        }

        // 应用预览区设置
        const previewBodies = document.querySelectorAll('.markdown-body');
        previewBodies.forEach(body => {
            body.style.fontSize = this.settings.appearance.previewFontSize + 'px';
            body.style.fontFamily = this.getFontStack(this.settings.appearance.previewFontFamily, 'preview');
        });

        // 应用主题强调色
        document.documentElement.style.setProperty('--color-accent', this.settings.appearance.accentColor);
        // 计算 hover 色（稍亮）
        const hoverColor = this.adjustColorBrightness(this.settings.appearance.accentColor, 20);
        document.documentElement.style.setProperty('--color-accent-hover', hoverColor);
        // 计算浅色背景
        const lightColor = this.hexToRgba(this.settings.appearance.accentColor, 0.1);
        document.documentElement.style.setProperty('--color-accent-light', lightColor);

        // 应用同步滚动设置
        if (typeof Editor !== 'undefined') {
            Editor.syncScrollEnabled = this.settings.editor.syncScroll;
            // 更新按钮状态
            const syncBtn = document.getElementById('toggle-sync-scroll');
            if (syncBtn) {
                if (Editor.syncScrollEnabled) {
                    syncBtn.classList.add('active');
                    syncBtn.title = I18nManager.t('editor.sync_on');
                } else {
                    syncBtn.classList.remove('active');
                    syncBtn.title = I18nManager.t('editor.sync_off');
                }
            }
        }
    },

    /**
     * 获取字体栈
     */
    getFontStack(fontKey, type) {
        const editorFonts = {
            'monospace': 'monospace',
            'jetbrains': "'JetBrains Mono', Consolas, monospace",
            'firacode': "'Fira Code', Consolas, monospace",
            'consolas': "Consolas, 'Courier New', monospace",
            'sourcecodepro': "'Source Code Pro', monospace"
        };
        const previewFonts = {
            'system': "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
            'inter': "'Inter', sans-serif",
            'notosans': "'Noto Sans SC', 'Microsoft YaHei', sans-serif",
            'georgia': "Georgia, 'Times New Roman', serif",
            'merriweather': "'Merriweather', Georgia, serif"
        };
        if (type === 'editor') {
            return editorFonts[fontKey] || editorFonts['monospace'];
        }
        return previewFonts[fontKey] || previewFonts['system'];
    },

    /**
     * 调整颜色亮度
     */
    adjustColorBrightness(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, Math.max(0, (num >> 16) + amt));
        const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amt));
        const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
        return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    },

    /**
     * Hex 转 RGBA
     */
    hexToRgba(hex, alpha) {
        const num = parseInt(hex.replace('#', ''), 16);
        const R = (num >> 16) & 0xFF;
        const G = (num >> 8) & 0xFF;
        const B = num & 0xFF;
        return `rgba(${R}, ${G}, ${B}, ${alpha})`;
    },

    /**
     * 获取设置值
     */
    getSetting(path) {
        const keys = path.split('.');
        let value = this.settings;
        for (const key of keys) {
            if (value && key in value) {
                value = value[key];
            } else {
                return undefined;
            }
        }
        return value;
    },

    /**
     * 设置值
     */
    setSetting(path, value) {
        const keys = path.split('.');
        let obj = this.settings;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!(keys[i] in obj)) {
                obj[keys[i]] = {};
            }
            obj = obj[keys[i]];
        }
        obj[keys[keys.length - 1]] = value;
        this.saveSettings();
        this.applySettings();
    },

    /**
     * 格式化快捷键显示
     */
    formatShortcut(shortcut) {
        if (!shortcut) return '';
        const parts = [];
        if (shortcut.ctrl) parts.push('Ctrl');
        if (shortcut.alt) parts.push('Alt');
        if (shortcut.shift) parts.push('Shift');
        parts.push(shortcut.key.toUpperCase());
        return parts.join('+');
    },

    /**
     * 绑定事件
     */
    bindEvents() {
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.showSettingsDialog());
        }
    },

    /**
     * 显示设置对话框
     */
    showSettingsDialog() {
        // 移除已存在的对话框
        const existing = document.querySelector('.settings-dialog-overlay');
        if (existing) existing.remove();

        // 创建对话框
        const overlay = document.createElement('div');
        overlay.className = 'settings-dialog-overlay';
        overlay.innerHTML = `
            <div class="settings-dialog">
                <div class="settings-dialog-header">
                    <h3 data-i18n="settings.title">${I18nManager.t('settings.title')}</h3>
                    <button type="button" class="settings-dialog-close">&times;</button>
                </div>
                <div class="settings-dialog-body">
                    <div class="settings-tabs">
                        <button type="button" class="settings-tab-btn active" data-tab="general" data-i18n="settings.tab.general">${I18nManager.t('settings.tab.general')}</button>
                        <button type="button" class="settings-tab-btn" data-tab="shortcuts" data-i18n="settings.tab.shortcuts">${I18nManager.t('settings.tab.shortcuts')}</button>
                        <button type="button" class="settings-tab-btn" data-tab="editor" data-i18n="settings.tab.editor">${I18nManager.t('settings.tab.editor')}</button>
                        <button type="button" class="settings-tab-btn" data-tab="appearance" data-i18n="settings.tab.appearance">${I18nManager.t('settings.tab.appearance')}</button>
                    </div>
                    
                    <div class="settings-tab-panel active" id="settings-panel-general">
                        <div class="settings-section">
                            <h4 data-i18n="settings.tab.general">${I18nManager.t('settings.tab.general')}</h4>
                            <div class="settings-row">
                                <label data-i18n="settings.general.language">${I18nManager.t('settings.general.language')}</label>
                                <div class="settings-control">
                                    <select id="settings-language">
                                        <option value="en" ${I18nManager.currentLang === 'en' ? 'selected' : ''} data-i18n="settings.general.language.en">${I18nManager.t('settings.general.language.en')}</option>
                                        <option value="zh-CN" ${I18nManager.currentLang === 'zh-CN' ? 'selected' : ''} data-i18n="settings.general.language.zh">${I18nManager.t('settings.general.language.zh')}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="settings-tab-panel" id="settings-panel-shortcuts">
                        <div class="settings-section">
                            <h4 data-i18n="settings.shortcuts.title">${I18nManager.t('settings.shortcuts.title')}</h4>
                            <p class="settings-hint" data-i18n="settings.shortcuts.hint">${I18nManager.t('settings.shortcuts.hint')}</p>
                            <div class="shortcuts-list">
                                ${this.renderShortcutsList()}
                            </div>
                        </div>
                    </div>
                    
                    <div class="settings-tab-panel" id="settings-panel-editor">
                        <div class="settings-section">
                            <h4 data-i18n="settings.editor.title">${I18nManager.t('settings.editor.title')}</h4>
                            <div class="settings-row">
                                <label data-i18n="settings.editor.fontSize">${I18nManager.t('settings.editor.fontSize')}</label>
                                <div class="settings-control">
                                    <input type="range" id="settings-font-size" min="12" max="24" value="${this.settings.editor.fontSize}">
                                    <span id="settings-font-size-value">${this.settings.editor.fontSize}px</span>
                                </div>
                            </div>
                            <div class="settings-row">
                                <label data-i18n="settings.editor.fontFamily">${I18nManager.t('settings.editor.fontFamily')}</label>
                                <div class="settings-control">
                                    <select id="settings-editor-font">
                                        <option value="monospace" ${this.settings.editor.fontFamily === 'monospace' ? 'selected' : ''} data-i18n="settings.editor.font.monospace">${I18nManager.t('settings.editor.font.monospace')}</option>
                                        <option value="jetbrains" ${this.settings.editor.fontFamily === 'jetbrains' ? 'selected' : ''}>JetBrains Mono</option>
                                        <option value="firacode" ${this.settings.editor.fontFamily === 'firacode' ? 'selected' : ''}>Fira Code</option>
                                        <option value="consolas" ${this.settings.editor.fontFamily === 'consolas' ? 'selected' : ''}>Consolas</option>
                                        <option value="sourcecodepro" ${this.settings.editor.fontFamily === 'sourcecodepro' ? 'selected' : ''}>Source Code Pro</option>
                                    </select>
                                </div>
                            </div>
                            <div class="settings-row">
                                <label data-i18n="settings.editor.tabSize">${I18nManager.t('settings.editor.tabSize')}</label>
                                <div class="settings-control">
                                    <select id="settings-tab-size">
                                        <option value="2" ${this.settings.editor.tabSize === 2 ? 'selected' : ''} data-i18n="settings.editor.tabSize.2">${I18nManager.t('settings.editor.tabSize.2')}</option>
                                        <option value="4" ${this.settings.editor.tabSize === 4 ? 'selected' : ''} data-i18n="settings.editor.tabSize.4">${I18nManager.t('settings.editor.tabSize.4')}</option>
                                        <option value="8" ${this.settings.editor.tabSize === 8 ? 'selected' : ''} data-i18n="settings.editor.tabSize.8">${I18nManager.t('settings.editor.tabSize.8')}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="settings-row">
                                <label data-i18n="settings.editor.syncScroll">${I18nManager.t('settings.editor.syncScroll')}</label>
                                <div class="settings-control">
                                    <label class="switch">
                                        <input type="checkbox" id="settings-sync-scroll" ${this.settings.editor.syncScroll ? 'checked' : ''}>
                                        <span class="slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="settings-tab-panel" id="settings-panel-appearance">
                        <div class="settings-section">
                            <h4 data-i18n="settings.appearance.title">${I18nManager.t('settings.appearance.title')}</h4>
                            <div class="settings-row">
                                <label data-i18n="settings.appearance.theme">${I18nManager.t('settings.appearance.theme')}</label>
                                <div class="settings-control">
                                    <select id="settings-theme">
                                        <option value="system" ${this.settings.appearance.theme === 'system' ? 'selected' : ''} data-i18n="settings.appearance.theme.system">${I18nManager.t('settings.appearance.theme.system')}</option>
                                        <option value="light" ${this.settings.appearance.theme === 'light' ? 'selected' : ''} data-i18n="settings.appearance.theme.light">${I18nManager.t('settings.appearance.theme.light')}</option>
                                        <option value="dark" ${this.settings.appearance.theme === 'dark' ? 'selected' : ''} data-i18n="settings.appearance.theme.dark">${I18nManager.t('settings.appearance.theme.dark')}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="settings-row">
                                <label data-i18n="settings.appearance.previewFontSize">${I18nManager.t('settings.appearance.previewFontSize')}</label>
                                <div class="settings-control">
                                    <input type="range" id="settings-preview-font-size" min="12" max="24" value="${this.settings.appearance.previewFontSize}">
                                    <span id="settings-preview-font-size-value">${this.settings.appearance.previewFontSize}px</span>
                                </div>
                            </div>
                            <div class="settings-row">
                                <label data-i18n="settings.appearance.previewFontFamily">${I18nManager.t('settings.appearance.previewFontFamily')}</label>
                                <div class="settings-control">
                                    <select id="settings-preview-font">
                                        <option value="system" ${this.settings.appearance.previewFontFamily === 'system' ? 'selected' : ''} data-i18n="settings.appearance.font.system">${I18nManager.t('settings.appearance.font.system')}</option>
                                        <option value="inter" ${this.settings.appearance.previewFontFamily === 'inter' ? 'selected' : ''} data-i18n="settings.appearance.font.inter">${I18nManager.t('settings.appearance.font.inter')}</option>
                                        <option value="notosans" ${this.settings.appearance.previewFontFamily === 'notosans' ? 'selected' : ''} data-i18n="settings.appearance.font.notosans">${I18nManager.t('settings.appearance.font.notosans')}</option>
                                        <option value="georgia" ${this.settings.appearance.previewFontFamily === 'georgia' ? 'selected' : ''} data-i18n="settings.appearance.font.georgia">${I18nManager.t('settings.appearance.font.georgia')}</option>
                                        <option value="merriweather" ${this.settings.appearance.previewFontFamily === 'merriweather' ? 'selected' : ''} data-i18n="settings.appearance.font.merriweather">${I18nManager.t('settings.appearance.font.merriweather')}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="settings-row">
                                <label data-i18n="settings.appearance.accentColor">${I18nManager.t('settings.appearance.accentColor')}</label>
                                <div class="settings-control">
                                    <div class="color-presets" id="color-presets">
                                        <button type="button" class="color-preset ${this.settings.appearance.accentColor === '#3B82F6' ? 'active' : ''}" data-color="#3B82F6" style="background:#3B82F6" title="${I18nManager.t('settings.appearance.color.blue')}" data-i18n-title="settings.appearance.color.blue"></button>
                                        <button type="button" class="color-preset ${this.settings.appearance.accentColor === '#10B981' ? 'active' : ''}" data-color="#10B981" style="background:#10B981" title="${I18nManager.t('settings.appearance.color.green')}" data-i18n-title="settings.appearance.color.green"></button>
                                        <button type="button" class="color-preset ${this.settings.appearance.accentColor === '#8B5CF6' ? 'active' : ''}" data-color="#8B5CF6" style="background:#8B5CF6" title="${I18nManager.t('settings.appearance.color.purple')}" data-i18n-title="settings.appearance.color.purple"></button>
                                        <button type="button" class="color-preset ${this.settings.appearance.accentColor === '#F59E0B' ? 'active' : ''}" data-color="#F59E0B" style="background:#F59E0B" title="${I18nManager.t('settings.appearance.color.orange')}" data-i18n-title="settings.appearance.color.orange"></button>
                                        <button type="button" class="color-preset ${this.settings.appearance.accentColor === '#EF4444' ? 'active' : ''}" data-color="#EF4444" style="background:#EF4444" title="${I18nManager.t('settings.appearance.color.red')}" data-i18n-title="settings.appearance.color.red"></button>
                                        <button type="button" class="color-preset ${this.settings.appearance.accentColor === '#EC4899' ? 'active' : ''}" data-color="#EC4899" style="background:#EC4899" title="${I18nManager.t('settings.appearance.color.pink')}" data-i18n-title="settings.appearance.color.pink"></button>
                                    </div>
                                    <input type="color" id="settings-accent-color" value="${this.settings.appearance.accentColor}" title="Custom Color">
                                </div>
                            </div>
                            <div class="settings-row">
                                <label data-i18n="settings.appearance.exportFontSize">${I18nManager.t('settings.appearance.exportFontSize')}</label>
                                <div class="settings-control">
                                    <input type="range" id="settings-export-font-size" min="8" max="16" value="${this.settings.appearance.exportFontSize}">
                                    <span id="settings-export-font-size-value">${this.settings.appearance.exportFontSize}pt</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="settings-dialog-footer">
                    <button type="button" class="btn btn-secondary" id="settings-reset-btn" data-i18n="settings.reset">${I18nManager.t('settings.reset')}</button>
                    <button type="button" class="btn btn-primary" id="settings-close-btn" data-i18n="settings.done">${I18nManager.t('settings.done')}</button>
                </div>
            </div>

        `;

        // 添加样式
        this.addStyles();

        document.body.appendChild(overlay);

        // 绑定事件
        this.bindDialogEvents(overlay);
    },

    /**
     * 渲染快捷键列表
     */
    renderShortcutsList() {
        let html = '';
        const actions = [
            'undo', 'redo', 'bold', 'italic', 'link',
            'save', 'newFile', 'openFile', 'toggleEdit', 'toggleTheme'
        ];

        for (const action of actions) {
            const labelKey = `settings.shortcut.${action}`;
            const label = I18nManager.t(labelKey);
            const shortcut = this.settings.shortcuts[action];
            html += `
                <div class="shortcut-item" data-action="${action}">
                    <span class="shortcut-label" data-i18n="${labelKey}">${label}</span>
                    <button type="button" class="shortcut-key" data-action="${action}">
                        ${this.formatShortcut(shortcut)}
                    </button>
                </div>
            `;
        }
        return html;
    },

    /**
     * 绑定对话框事件
     */
    bindDialogEvents(overlay) {
        const closeDialog = () => overlay.remove();

        // 关闭按钮
        overlay.querySelector('.settings-dialog-close').addEventListener('click', closeDialog);
        overlay.querySelector('#settings-close-btn').addEventListener('click', closeDialog);

        // 点击遮罩关闭
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeDialog();
        });

        // Tab 切换
        overlay.querySelectorAll('.settings-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                overlay.querySelectorAll('.settings-tab-btn').forEach(b => b.classList.remove('active'));
                overlay.querySelectorAll('.settings-tab-panel').forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById('settings-panel-' + btn.dataset.tab).classList.add('active');
            });
        });

        // 快捷键编辑
        overlay.querySelectorAll('.shortcut-key').forEach(btn => {
            btn.addEventListener('click', () => {
                this.startShortcutCapture(btn);
            });
        });

        // 字体大小
        const fontSizeInput = overlay.querySelector('#settings-font-size');
        const fontSizeValue = overlay.querySelector('#settings-font-size-value');
        fontSizeInput.addEventListener('input', () => {
            const size = parseInt(fontSizeInput.value);
            fontSizeValue.textContent = size + 'px';
            this.setSetting('editor.fontSize', size);
        });

        // Tab 缩进
        overlay.querySelector('#settings-tab-size').addEventListener('change', (e) => {
            this.setSetting('editor.tabSize', parseInt(e.target.value));
        });

        // 同步滚动
        overlay.querySelector('#settings-sync-scroll').addEventListener('change', (e) => {
            this.setSetting('editor.syncScroll', e.target.checked);
            // 同步到 Editor
            if (typeof Editor !== 'undefined') {
                Editor.syncScrollEnabled = e.target.checked;
                // 更新按钮状态
                const syncBtn = document.getElementById('toggle-sync-scroll');
                if (syncBtn) {
                    if (e.target.checked) {
                        syncBtn.classList.add('active');
                        syncBtn.title = I18nManager.t('editor.sync_on');
                    } else {
                        syncBtn.classList.remove('active');
                        syncBtn.title = I18nManager.t('editor.sync_off');
                    }
                }
            }
        });

        // Theme
        overlay.querySelector('#settings-theme').addEventListener('change', (e) => {
            const theme = e.target.value;
            this.setSetting('appearance.theme', theme);
            if (theme === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                ThemeManager.setTheme(prefersDark ? 'dark' : 'light');
            } else {
                ThemeManager.setTheme(theme);
            }
        });

        // Language
        overlay.querySelector('#settings-language').addEventListener('change', (e) => {
            const lang = e.target.value;
            I18nManager.setLanguage(lang);
            // Re-render shortcuts list to update labels
            const shortcutsList = overlay.querySelector('.shortcuts-list');
            if (shortcutsList) {
                shortcutsList.innerHTML = this.renderShortcutsList();
                // Re-bind click events for new elements
                shortcutsList.querySelectorAll('.shortcut-key').forEach(btn => {
                    btn.addEventListener('click', () => {
                        this.startShortcutCapture(btn);
                    });
                });
            }
        });

        // 编辑器字体
        overlay.querySelector('#settings-editor-font').addEventListener('change', (e) => {
            this.setSetting('editor.fontFamily', e.target.value);
        });

        // 预览区字号
        const previewFontSizeInput = overlay.querySelector('#settings-preview-font-size');
        const previewFontSizeValue = overlay.querySelector('#settings-preview-font-size-value');
        previewFontSizeInput.addEventListener('input', () => {
            const size = parseInt(previewFontSizeInput.value);
            previewFontSizeValue.textContent = size + 'px';
            this.setSetting('appearance.previewFontSize', size);
        });

        // 预览区字体
        overlay.querySelector('#settings-preview-font').addEventListener('change', (e) => {
            this.setSetting('appearance.previewFontFamily', e.target.value);
        });

        // 颜色预设
        overlay.querySelectorAll('.color-preset').forEach(btn => {
            btn.addEventListener('click', () => {
                const color = btn.dataset.color;
                overlay.querySelectorAll('.color-preset').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                overlay.querySelector('#settings-accent-color').value = color;
                this.setSetting('appearance.accentColor', color);
            });
        });

        // 自定义颜色
        overlay.querySelector('#settings-accent-color').addEventListener('input', (e) => {
            const color = e.target.value;
            overlay.querySelectorAll('.color-preset').forEach(b => b.classList.remove('active'));
            this.setSetting('appearance.accentColor', color);
        });

        // 导出字体大小
        const exportFontSizeInput = overlay.querySelector('#settings-export-font-size');
        const exportFontSizeValue = overlay.querySelector('#settings-export-font-size-value');
        if (exportFontSizeInput && exportFontSizeValue) {
            exportFontSizeInput.addEventListener('input', () => {
                const size = parseInt(exportFontSizeInput.value);
                exportFontSizeValue.textContent = size + 'pt';
                this.setSetting('appearance.exportFontSize', size);
            });
        }

        // 重置
        overlay.querySelector('#settings-reset-btn').addEventListener('click', () => {
            if (confirm(I18nManager.t('msg.reset_confirm'))) {
                this.settings = JSON.parse(JSON.stringify(this.defaultSettings));
                this.saveSettings();
                this.applySettings();
                closeDialog();
                this.showSettingsDialog(); // 重新打开
            }
        });
    },

    /**
     * 开始捕获快捷键
     */
    startShortcutCapture(btn) {
        const action = btn.dataset.action;
        btn.textContent = I18nManager.t('msg.press_shortcut');
        btn.classList.add('capturing');

        const handler = (e) => {
            e.preventDefault();
            e.stopPropagation();

            // 忽略单独的修饰键
            if (['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) {
                return;
            }

            const shortcut = {
                key: e.key.toLowerCase(),
                ctrl: e.ctrlKey || e.metaKey,
                shift: e.shiftKey,
                alt: e.altKey
            };

            // 至少需要一个修饰键
            if (!shortcut.ctrl && !shortcut.alt && !shortcut.shift) {
                btn.textContent = this.formatShortcut(this.settings.shortcuts[action]);
                btn.classList.remove('capturing');
                document.removeEventListener('keydown', handler, true);
                return;
            }

            this.setSetting('shortcuts.' + action, shortcut);
            btn.textContent = this.formatShortcut(shortcut);
            btn.classList.remove('capturing');
            document.removeEventListener('keydown', handler, true);
        };

        document.addEventListener('keydown', handler, true);

        // 点击其他地方取消
        const cancelHandler = (e) => {
            if (!btn.contains(e.target)) {
                btn.textContent = this.formatShortcut(this.settings.shortcuts[action]);
                btn.classList.remove('capturing');
                document.removeEventListener('keydown', handler, true);
                document.removeEventListener('click', cancelHandler, true);
            }
        };

        setTimeout(() => {
            document.addEventListener('click', cancelHandler, true);
        }, 100);
    },

    /**
     * 添加样式
     */
    addStyles() {
        if (document.getElementById('settings-dialog-styles')) return;

        const style = document.createElement('style');
        style.id = 'settings-dialog-styles';
        style.textContent = `
            .settings-dialog-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.6);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                animation: fadeIn 0.2s;
            }
            
            .settings-dialog {
                background: var(--color-bg-secondary, #fff);
                border-radius: 12px;
                width: 90%;
                max-width: 520px;
                max-height: 80vh;
                display: flex;
                flex-direction: column;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                overflow: hidden;
            }
            
            .settings-dialog-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 20px;
                border-bottom: 1px solid var(--color-border, #e2e8f0);
            }
            
            .settings-dialog-header h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
            }
            
            .settings-dialog-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: var(--color-text-secondary, #64748b);
                line-height: 1;
                padding: 0;
            }
            
            .settings-dialog-body {
                flex: 1;
                overflow-y: auto;
                padding: 0;
            }
            
            .settings-tabs {
                display: flex;
                border-bottom: 1px solid var(--color-border, #e2e8f0);
                background: var(--color-bg-tertiary, #f8fafc);
            }
            
            .settings-tab-btn {
                flex: 1;
                padding: 12px 16px;
                background: none;
                border: none;
                border-bottom: 2px solid transparent;
                cursor: pointer;
                font-size: 14px;
                color: var(--color-text-secondary, #64748b);
                transition: all 0.2s;
            }
            
            .settings-tab-btn:hover {
                color: var(--color-text-primary, #1e293b);
            }
            
            .settings-tab-btn.active {
                color: var(--color-accent, #3b82f6);
                border-bottom-color: var(--color-accent, #3b82f6);
                background: var(--color-bg-secondary, #fff);
            }
            
            .settings-tab-panel {
                display: none;
                padding: 20px;
            }
            
            .settings-tab-panel.active {
                display: block;
            }
            
            .settings-section h4 {
                margin: 0 0 8px;
                font-size: 14px;
                font-weight: 600;
                color: var(--color-text-primary, #1e293b);
            }
            
            .settings-hint {
                font-size: 12px;
                color: var(--color-text-tertiary, #94a3b8);
                margin: 0 0 16px;
            }
            
            .settings-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 0;
                border-bottom: 1px solid var(--color-border, #e2e8f0);
            }
            
            .settings-row:last-child {
                border-bottom: none;
            }
            
            .settings-row label {
                font-size: 14px;
                color: var(--color-text-primary, #1e293b);
            }
            
            .settings-control {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .settings-control input[type="range"] {
                width: 120px;
            }
            
            .settings-control select {
                padding: 6px 10px;
                border: 1px solid var(--color-border, #e2e8f0);
                border-radius: 6px;
                background: var(--color-bg-primary, #fff);
                color: var(--color-text-primary, #1e293b);
                font-size: 14px;
            }
            
            .shortcuts-list {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            
            .shortcut-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid var(--color-border, #e2e8f0);
            }
            
            .shortcut-item:last-child {
                border-bottom: none;
            }
            
            .shortcut-label {
                font-size: 14px;
                color: var(--color-text-primary, #1e293b);
            }
            
            .shortcut-key {
                padding: 4px 12px;
                background: var(--color-bg-tertiary, #f1f5f9);
                border: 1px solid var(--color-border, #e2e8f0);
                border-radius: 4px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 12px;
                color: var(--color-text-secondary, #64748b);
                cursor: pointer;
                min-width: 80px;
                text-align: center;
                transition: all 0.2s;
            }
            
            .shortcut-key:hover {
                background: var(--color-bg-primary, #fff);
                border-color: var(--color-accent, #3b82f6);
            }
            
            .shortcut-key.capturing {
                background: var(--color-accent, #3b82f6);
                color: white;
                border-color: var(--color-accent, #3b82f6);
            }
            
            /* Toggle Switch */
            .switch {
                position: relative;
                display: inline-block;
                width: 44px;
                height: 24px;
            }
            
            .switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            
            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: var(--color-border, #cbd5e1);
                transition: 0.3s;
                border-radius: 24px;
            }
            
            .slider:before {
                position: absolute;
                content: "";
                height: 18px;
                width: 18px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: 0.3s;
                border-radius: 50%;
            }
            
            .switch input:checked + .slider {
                background-color: var(--color-accent, #3b82f6);
            }
            
            .switch input:checked + .slider:before {
                transform: translateX(20px);
            }
            
            /* Color Presets */
            .color-presets {
                display: flex;
                gap: 6px;
            }
            
            .color-preset {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                border: 2px solid transparent;
                cursor: pointer;
                transition: all 0.2s;
                padding: 0;
            }
            
            .color-preset:hover {
                transform: scale(1.1);
            }
            
            .color-preset.active {
                border-color: var(--color-text-primary, #1e293b);
                box-shadow: 0 0 0 2px var(--color-bg-secondary, #fff);
            }
            
            input[type="color"] {
                width: 32px;
                height: 24px;
                padding: 0;
                border: 1px solid var(--color-border, #e2e8f0);
                border-radius: 4px;
                cursor: pointer;
                background: transparent;
            }
            
            input[type="color"]::-webkit-color-swatch-wrapper {
                padding: 2px;
            }
            
            input[type="color"]::-webkit-color-swatch {
                border-radius: 2px;
                border: none;
            }
            
            .settings-dialog-footer {
                display: flex;
                justify-content: space-between;
                padding: 16px 20px;
                border-top: 1px solid var(--color-border, #e2e8f0);
            }
        `;
        document.head.appendChild(style);
    }
};
