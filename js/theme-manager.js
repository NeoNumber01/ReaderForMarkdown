/**
 * Theme Manager - 主题切换管理器
 * 处理亮色/暗色主题切换和本地存储
 */

const ThemeManager = {
    THEME_KEY: 'markdown-reader-theme',

    /**
     * 初始化主题
     */
    init() {
        const savedTheme = localStorage.getItem(this.THEME_KEY);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme || (prefersDark ? 'dark' : 'light');

        this.setTheme(theme);
        this.bindEvents();

        // 监听系统主题变化
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(this.THEME_KEY)) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    },

    /**
     * 设置主题
     * @param {string} theme - 'light' 或 'dark'
     */
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);

        // 切换 Highlight.js 主题
        const lightTheme = document.getElementById('hljs-light');
        const darkTheme = document.getElementById('hljs-dark');

        if (lightTheme && darkTheme) {
            if (theme === 'dark') {
                lightTheme.disabled = true;
                darkTheme.disabled = false;
            } else {
                lightTheme.disabled = false;
                darkTheme.disabled = true;
            }
        }
    },

    /**
     * 切换主题
     */
    toggle() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        this.setTheme(newTheme);
        localStorage.setItem(this.THEME_KEY, newTheme);
    },

    /**
     * 绑定事件
     */
    bindEvents() {
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }
    },

    /**
     * 获取当前主题
     * @returns {string} 当前主题
     */
    getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') || 'light';
    }
};

// 立即初始化主题以避免闪烁
(function () {
    const savedTheme = localStorage.getItem('markdown-reader-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
})();
