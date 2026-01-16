/**
 * Popup Script
 * 处理扩展弹出窗口的交互和国际化
 */

// 国际化文本
const i18n = {
    zh: {
        subtitle: '精致优雅的阅读体验',
        open_app: '打开完整应用',
        features_title: '功能特性',
        feature_layout: '完美排版',
        feature_code: '代码高亮',
        feature_math: '数学公式',
        feature_theme: '主题切换',
        settings_title: '设置',
        auto_detect: '自动检测网页 Markdown',
        footer: '打开 .md 文件将自动渲染',
        lang_btn: 'EN'
    },
    en: {
        subtitle: 'Elegant Markdown Reading',
        open_app: 'Open Full App',
        features_title: 'Features',
        feature_layout: 'Perfect Layout',
        feature_code: 'Code Highlight',
        feature_math: 'Math Formula',
        feature_theme: 'Theme Switch',
        settings_title: 'Settings',
        auto_detect: 'Auto-detect Web Markdown',
        footer: '.md files will be auto-rendered',
        lang_btn: '中文'
    }
};

// 当前语言
let currentLang = 'zh';

// 应用语言
function applyLanguage(lang) {
    currentLang = lang;
    const texts = i18n[lang];

    // 更新所有带 data-i18n 属性的元素
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (texts[key]) {
            el.textContent = texts[key];
        }
    });

    // 更新语言按钮文本
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
        langBtn.textContent = texts.lang_btn;
    }

    // 更新 html lang 属性
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
}

// 切换语言
function toggleLanguage() {
    const newLang = currentLang === 'zh' ? 'en' : 'zh';
    applyLanguage(newLang);

    // 保存语言设置
    chrome.storage.local.set({ popupLanguage: newLang });
}

document.addEventListener('DOMContentLoaded', () => {
    const openAppBtn = document.getElementById('open-app');
    const autoDetectToggle = document.getElementById('auto-detect-toggle');
    const langToggle = document.getElementById('lang-toggle');

    // 加载保存的语言设置
    chrome.storage.local.get(['popupLanguage'], (result) => {
        const savedLang = result.popupLanguage || 'zh';
        applyLanguage(savedLang);
    });

    // 语言切换按钮
    if (langToggle) {
        langToggle.addEventListener('click', toggleLanguage);
    }

    // 打开完整应用按钮
    if (openAppBtn) {
        openAppBtn.addEventListener('click', () => {
            // 打开完整应用页面
            chrome.tabs.create({
                url: chrome.runtime.getURL('index.html')
            });
        });
    }

    // 自动检测开关
    if (autoDetectToggle) {
        // 读取保存的状态
        chrome.storage.local.get(['autoDetectEnabled'], (result) => {
            // 默认开启
            autoDetectToggle.checked = result.autoDetectEnabled !== false;
        });

        // 监听开关变化
        autoDetectToggle.addEventListener('change', () => {
            const enabled = autoDetectToggle.checked;
            chrome.storage.local.set({ autoDetectEnabled: enabled });

            // 如果开关打开，刷新当前标签页以应用检测
            if (enabled) {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (tabs[0]) {
                        const url = tabs[0].url || '';
                        // 只刷新 .md/.markdown 文件或已知的 raw 站点
                        if (url.match(/\.(md|markdown)(\?|$)/i) ||
                            url.includes('raw.githubusercontent.com') ||
                            url.includes('gist.githubusercontent.com')) {
                            chrome.tabs.reload(tabs[0].id);
                        }
                    }
                });
            }
        });
    }
});
