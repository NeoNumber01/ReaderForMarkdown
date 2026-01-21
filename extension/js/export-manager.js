/**
 * Export Manager - 导出管理器
 * 支持导出为 Markdown、PDF、Word 文档
 */

const ExportManager = {
    /**
     * 初始化导出管理器
     */
    init() {
        this.createExportUI();
        this.bindEvents();
    },

    /**
     * 创建导出 UI
     */
    createExportUI() {
        // 创建导出菜单
        const exportMenu = document.createElement('div');
        exportMenu.id = 'export-menu';
        exportMenu.className = 'export-menu';
        exportMenu.innerHTML = `
            <div class="export-menu-content">
                <div class="export-menu-header">
                    <h3 data-i18n="export.title">${I18nManager.t('export.title')}</h3>
                    <button class="btn btn-icon export-close" id="export-close">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="export-filename-section">
                    <label for="export-filename" data-i18n="export.filename">${I18nManager.t('export.filename')}</label>
                    <div class="export-filename-input-wrapper">
                        <input type="text" id="export-filename" class="export-filename-input" placeholder="${I18nManager.t('export.filename_placeholder')}" />
                        <span class="export-filename-ext" id="export-filename-ext">.md</span>
                    </div>
                </div>
                <div class="export-options">
                    <button class="export-option" data-format="md">
                        <div class="export-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                            </svg>
                        </div>
                        <div class="export-info">
                            <div class="export-title" data-i18n="export.md">${I18nManager.t('export.md')}</div>
                            <div class="export-desc" data-i18n="export.md.desc">${I18nManager.t('export.md.desc')}</div>
                        </div>
                    </button>
                    <button class="export-option" data-format="html">
                        <div class="export-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="16 18 22 12 16 6"></polyline>
                                <polyline points="8 6 2 12 8 18"></polyline>
                            </svg>
                        </div>
                        <div class="export-info">
                            <div class="export-title" data-i18n="export.html">${I18nManager.t('export.html')}</div>
                            <div class="export-desc" data-i18n="export.html.desc">${I18nManager.t('export.html.desc')}</div>
                        </div>
                    </button>
                    <button class="export-option" data-format="pdf">
                        <div class="export-icon pdf-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                            </svg>
                        </div>
                        <div class="export-info">
                            <div class="export-title" data-i18n="export.pdf">${I18nManager.t('export.pdf')}</div>
                            <div class="export-desc" data-i18n="export.pdf.desc">${I18nManager.t('export.pdf.desc')}</div>
                        </div>
                    </button>
                    <button class="export-option" data-format="docx">
                        <div class="export-icon word-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <path d="M8 13h2l1 3 1-3h2"></path>
                            </svg>
                        </div>
                        <div class="export-info">
                            <div class="export-title" data-i18n="export.docx">${I18nManager.t('export.docx')}</div>
                            <div class="export-desc" data-i18n="export.docx.desc">${I18nManager.t('export.docx.desc')}</div>
                        </div>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(exportMenu);
    },

    /**
     * 绑定事件
     */
    bindEvents() {
        // 关闭导出菜单
        const closeBtn = document.getElementById('export-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideExportMenu());
        }

        // 导出选项点击和悬停
        const extFormats = { md: '.md', html: '.html', pdf: '.pdf', docx: '.docx' };

        document.querySelectorAll('.export-option').forEach(option => {
            // 悬停时更新扩展名
            option.addEventListener('mouseenter', () => {
                const format = option.dataset.format;
                const extSpan = document.getElementById('export-filename-ext');
                if (extSpan && extFormats[format]) {
                    extSpan.textContent = extFormats[format];
                }
            });

            // 点击导出
            option.addEventListener('click', () => {
                const format = option.dataset.format;
                this.exportAs(format);
            });
        });

        // 点击外部关闭
        const exportMenu = document.getElementById('export-menu');
        if (exportMenu) {
            exportMenu.addEventListener('click', (e) => {
                if (e.target === exportMenu) {
                    this.hideExportMenu();
                }
            });
        }
    },

    /**
     * 显示导出菜单
     */
    showExportMenu() {
        const exportMenu = document.getElementById('export-menu');
        const filenameInput = document.getElementById('export-filename');

        if (exportMenu) {
            exportMenu.classList.add('active');

            // 设置当前文件名到输入框
            if (filenameInput) {
                const currentFileName = this.getCurrentFileName();
                filenameInput.value = currentFileName;
            }
        }
    },

    /**
     * 隐藏导出菜单
     */
    hideExportMenu() {
        const exportMenu = document.getElementById('export-menu');
        if (exportMenu) {
            exportMenu.classList.remove('active');
        }
    },

    /**
     * 导出文件
     * @param {string} format - 导出格式
     */
    exportAs(format) {
        const content = this.getCurrentContent();
        // 优先使用导出输入框中的文件名
        const filenameInput = document.getElementById('export-filename');
        let fileName = filenameInput && filenameInput.value.trim()
            ? filenameInput.value.trim()
            : this.getCurrentFileName();

        switch (format) {
            case 'md':
                this.exportAsMarkdown(content, fileName);
                break;
            case 'html':
                this.exportAsHTML(content, fileName);
                break;
            case 'pdf':
                this.exportAsPDF(content, fileName);
                break;
            case 'docx':
                this.exportAsWord(content, fileName);
                break;
        }

        this.hideExportMenu();
    },

    /**
     * 获取当前内容
     * @returns {string}
     */
    getCurrentContent() {
        // 优先从编辑器获取
        if (typeof Editor !== 'undefined' && Editor.isEditorMode) {
            return Editor.getContent();
        }
        // 否则从当前显示的内容获取
        return this._lastMarkdownContent || '';
    },

    /**
     * 存储 Markdown 内容
     * @param {string} content 
     */
    setMarkdownContent(content) {
        this._lastMarkdownContent = content;
    },

    /**
     * 获取当前文件名
     * @returns {string}
     */
    getCurrentFileName() {
        const fileNameEl = document.getElementById('file-name');
        let fileName = fileNameEl ? fileNameEl.textContent : I18nManager.t('export.untitled');
        fileName = fileName.replace(I18nManager.t('editor.editing_prefix'), '').replace(/\.[^/.]+$/, '');
        return fileName || I18nManager.t('export.untitled');
    },

    /**
     * 获取导出字体大小设置
     * @returns {number} 字体大小 (pt)
     */
    getExportFontSize() {
        if (typeof SettingsManager !== 'undefined' && SettingsManager.settings) {
            return SettingsManager.settings.appearance.exportFontSize || 11;
        }
        return 11; // 默认值
    },

    /**
     * 导出为 Markdown
     * @param {string} content 
     * @param {string} fileName 
     */
    exportAsMarkdown(content, fileName) {
        this.downloadFile(content, `${fileName}.md`, 'text/markdown');
    },

    /**
     * 导出为 HTML
     * @param {string} content 
     * @param {string} fileName 
     */
    exportAsHTML(content, fileName) {
        let html = MarkdownRenderer.render(content);
        // 移除复制按钮等交互元素
        html = this.cleanupForExport(html);
        const fullHTML = this.generateFullHTML(html, fileName);
        this.downloadFile(fullHTML, `${fileName}.html`, 'text/html');
    },

    /**
     * 生成完整 HTML 文档
     * @param {string} bodyContent 
     * @param {string} title 
     * @returns {string}
     */
    generateFullHTML(bodyContent, title) {
        // 获取导出字体大小设置 (pt 转 px 约 1pt = 1.333px)
        const baseFontPt = this.getExportFontSize();
        const baseFontPx = Math.round(baseFontPt * 1.333);
        const h1FontPx = Math.round(baseFontPx * 2);
        const h2FontPx = Math.round(baseFontPx * 1.5);

        return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: ${baseFontPx}px;
            line-height: 1.75;
            color: #1E293B;
            background: #F8FAFC;
            padding: 2rem;
        }
        .content {
            max-width: 800px;
            margin: 0 auto;
            background: #FFFFFF;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        h1, h2, h3, h4, h5, h6 { font-weight: 600; margin-top: 1.5em; margin-bottom: 0.75em; }
        h1 { font-size: ${h1FontPx}px; border-bottom: 2px solid #E2E8F0; padding-bottom: 0.5rem; }
        h2 { font-size: ${h2FontPx}px; border-bottom: 1px solid #E2E8F0; padding-bottom: 0.375rem; }
        p { margin-bottom: 1em; }
        a { color: #3B82F6; text-decoration: none; }
        a:hover { text-decoration: underline; }
        code { font-family: 'JetBrains Mono', monospace; font-size: 0.875em; padding: 0.2em 0.4em; background: #F1F5F9; border-radius: 4px; }
        pre { margin: 1em 0; padding: 1rem; background: #F8FAFC; border-radius: 8px; overflow-x: auto; }
        pre code { padding: 0; background: transparent; }
        blockquote { margin: 1em 0; padding: 0.75em 1em; border-left: 4px solid #3B82F6; background: rgba(59,130,246,0.1); border-radius: 0 8px 8px 0; }
        table { width: 100%; margin: 1em 0; border-collapse: collapse; }
        th, td { padding: 0.75rem 1rem; border: 1px solid #E2E8F0; text-align: left; }
        th { background: #F8FAFC; font-weight: 600; }
        img { max-width: 100%; height: auto; border-radius: 8px; }
        ul, ol { padding-left: 1.5em; margin-bottom: 1em; }
        /* 隐藏代码复制按钮（导出时不需要） */
        .code-copy-btn { display: none !important; }
        .code-block-wrapper { position: relative; }
    </style>
</head>
<body>
    <div class="content">
        ${bodyContent}
    </div>
</body>
</html>`;
    },

    /**
     * 导出为 PDF
     * @param {string} content 
     * @param {string} fileName 
     */
    exportAsPDF(content, fileName) {
        // 渲染 Markdown
        let html = MarkdownRenderer.render(content);

        // 移除复制按钮（导出时不需要）
        html = this.cleanupForExport(html);

        // 获取导出字体大小设置
        const baseFontSize = this.getExportFontSize();
        const h1Size = Math.round(baseFontSize * 2);      // H1: 2x
        const h2Size = Math.round(baseFontSize * 1.45);   // H2: 1.45x
        const h3Size = Math.round(baseFontSize * 1.18);   // H3: 1.18x
        const codeSize = Math.round(baseFontSize * 0.82); // Code: 0.82x

        // 创建临时容器
        const container = document.createElement('div');
        container.innerHTML = `
            <div class="pdf-export-container">
                <style>
                    .pdf-export-container {
                        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        font-size: ${baseFontSize}pt;
                        line-height: 1.8;
                        color: #1E293B;
                        padding: 0;
                        max-width: 100%;
                    }
                    .pdf-export-container h1 {
                        font-size: ${h1Size}pt;
                        font-weight: 700;
                        color: #0F172A;
                        margin: 0 0 16pt 0;
                        padding-bottom: 10pt;
                        border-bottom: 2pt solid #3B82F6;
                        page-break-after: avoid !important;
                        break-after: avoid !important;
                    }
                    .pdf-export-container h2 {
                        font-size: ${h2Size}pt;
                        font-weight: 600;
                        color: #1E293B;
                        margin: 20pt 0 12pt 0;
                        padding-bottom: 6pt;
                        border-bottom: 1pt solid #E2E8F0;
                        page-break-after: avoid !important;
                        break-after: avoid !important;
                    }
                    .pdf-export-container h3 {
                        font-size: ${h3Size}pt;
                        font-weight: 600;
                        color: #334155;
                        margin: 16pt 0 8pt 0;
                        page-break-after: avoid !important;
                        break-after: avoid !important;
                    }
                    .pdf-export-container h4, .pdf-export-container h5, .pdf-export-container h6 {
                        font-size: ${baseFontSize}pt;
                        font-weight: 600;
                        color: #475569;
                        margin: 12pt 0 6pt 0;
                        page-break-after: avoid !important;
                        break-after: avoid !important;
                    }
                    .pdf-export-container p {
                        margin: 0 0 10pt 0;
                        text-align: justify;
                    }
                    .pdf-export-container a {
                        color: #3B82F6;
                        text-decoration: none;
                    }
                    .pdf-export-container strong {
                        font-weight: 600;
                        color: #0F172A;
                    }
                    .pdf-export-container em {
                        font-style: italic;
                    }
                    .pdf-export-container code {
                        font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
                        font-size: ${codeSize}pt;
                        background: #F1F5F9;
                        color: #0F172A;
                        padding: 2pt 5pt;
                        border-radius: 3pt;
                        border: 0.5pt solid #E2E8F0;
                    }
                    .pdf-export-container .code-block-wrapper {
                        margin: 10pt 0;
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                    }
                    .pdf-export-container pre {
                        background: #F8FAFC;
                        border: 1pt solid #E2E8F0;
                        border-radius: 6pt;
                        padding: 12pt;
                        margin: 10pt 0;
                        overflow-x: auto !important;
                        max-width: 100%;
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                    }
                    .pdf-export-container pre code {
                        background: transparent !important;
                        border: none !important;
                        padding: 0 !important;
                        font-family: 'Consolas', 'Courier New', monospace !important;
                        font-size: 8pt !important;
                        line-height: 1.4 !important;
                        white-space: pre !important;
                        word-wrap: normal !important;
                        overflow-wrap: normal !important;
                        display: block !important;
                        color: #1E293B !important;
                    }
                    /* 移除代码块语言标签，避免定位问题 */
                    .pdf-export-container pre[data-lang]::before {
                        display: none !important;
                    }
                    .pdf-export-container blockquote {
                        margin: 10pt 0;
                        padding: 10pt 14pt;
                        background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
                        border-left: 4pt solid #3B82F6;
                        border-radius: 0 6pt 6pt 0;
                        font-style: italic;
                        color: #1E40AF;
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                    }
                    .pdf-export-container blockquote p {
                        margin: 0;
                    }
                    .pdf-export-container ul, .pdf-export-container ol {
                        margin: 0 0 10pt 0;
                        padding-left: 20pt;
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                    }
                    .pdf-export-container li {
                        margin-bottom: 4pt;
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                    }
                    .pdf-export-container table {
                        width: 100%;
                        margin: 10pt 0;
                        border-collapse: collapse;
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                        font-size: 10pt;
                    }
                    .pdf-export-container th {
                        background: linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%);
                        font-weight: 600;
                        color: #0F172A;
                        padding: 8pt 10pt;
                        border: 1pt solid #CBD5E1;
                        text-align: left;
                    }
                    .pdf-export-container td {
                        padding: 6pt 10pt;
                        border: 1pt solid #E2E8F0;
                    }
                    .pdf-export-container tr:nth-child(even) td {
                        background: #F8FAFC;
                    }
                    .pdf-export-container img {
                        max-width: 100%;
                        height: auto;
                        border-radius: 6pt;
                        margin: 8pt 0;
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                    }
                    .pdf-export-container hr {
                        border: none;
                        height: 2pt;
                        background: linear-gradient(90deg, #E2E8F0 0%, #3B82F6 50%, #E2E8F0 100%);
                        margin: 16pt 0;
                        border-radius: 1pt;
                    }
                    .pdf-export-container figure {
                        margin: 10pt 0;
                        text-align: center;
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                    }
                    .pdf-export-container figcaption {
                        font-size: ${codeSize}pt;
                        color: #64748B;
                        margin-top: 6pt;
                    }
                    .katex-display {
                        margin: 10pt 0;
                        overflow-x: auto;
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                    }
                    /* 隐藏复制按钮 */
                    .pdf-export-container .code-copy-btn {
                        display: none !important;
                    }
                    /* 告警块样式与分页控制 */
                    .pdf-export-container .alert {
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                    }
                </style>
                ${html}
            </div>
        `;

        document.body.appendChild(container);

        // 使用 html2pdf 生成 PDF
        const opt = {
            margin: [12, 12, 12, 12],
            filename: `${fileName}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 3,
                useCORS: true,
                letterRendering: true,
                logging: false,
                scrollX: 0,
                scrollY: 0
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait'
            },
            pagebreak: {
                mode: ['css', 'legacy'],
                before: '.page-break-before',
                after: '.page-break-after',
                avoid: ['pre', 'figure', 'table', 'blockquote', 'img', 'ul', 'ol', 'li', '.code-block-wrapper', '.alert']
            }
        };

        html2pdf().set(opt).from(container).save().then(() => {
            document.body.removeChild(container);
        }).catch(err => {
            console.error('PDF export error:', err);
            document.body.removeChild(container);
            // 回退到打印方式
            this.exportAsPDFFallback(content, fileName);
        });
    },

    /**
     * 清理 HTML 以供导出（移除复制按钮等交互元素）
     * @param {string} html - 原始 HTML
     * @returns {string} 清理后的 HTML
     */
    cleanupForExport(html) {
        // 1. 移除复制按钮（多种匹配方式确保完全移除）
        html = html.replace(/<button[^>]*class="code-copy-btn"[^>]*>[\s\S]*?<\/button>/gi, '');
        html = html.replace(/<button[^>]*code-copy-btn[^>]*>[\s\S]*?<\/button>/gi, '');

        // 2. 移除 SVG 图标残留
        html = html.replace(/<svg[^>]*class="copy-icon"[^>]*>[\s\S]*?<\/svg>/gi, '');
        html = html.replace(/<svg[^>]*class="check-icon"[^>]*>[\s\S]*?<\/svg>/gi, '');

        // 3. 移除 code-block-wrapper div 但保留内容
        html = html.replace(/<div[^>]*class="code-block-wrapper"[^>]*>/gi, '');
        // 移除对应的闭合 div（在 pre 之前的）
        html = html.replace(/<\/div>(\s*<pre)/gi, '$1');
        // 移除 pre 结束后的多余闭合 div
        html = html.replace(/(<\/pre>)\s*<\/div>/gi, '$1');

        // 4. 使用 DOM 解析来移除 hljs span 标签（更可靠）
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // 移除所有 hljs 相关的 span，保留其文本内容
        const hljsSpans = tempDiv.querySelectorAll('span[class*="hljs"]');
        hljsSpans.forEach(span => {
            const parent = span.parentNode;
            while (span.firstChild) {
                parent.insertBefore(span.firstChild, span);
            }
            parent.removeChild(span);
        });

        // 移除复制按钮元素
        const copyBtns = tempDiv.querySelectorAll('.code-copy-btn');
        copyBtns.forEach(btn => btn.remove());

        html = tempDiv.innerHTML;

        // 5. 移除 data-code 属性（包含转义的代码内容）
        html = html.replace(/ data-code="[^"]*"/gi, '');

        return html;
    },

    /**
     * PDF 导出回退方案（使用打印）
     * @param {string} content 
     * @param {string} fileName 
     */
    exportAsPDFFallback(content, fileName) {
        const html = MarkdownRenderer.render(content);
        const printWindow = window.open('', '_blank');

        // 使用导出字体大小设置
        const baseFontSize = this.getExportFontSize();
        const h1Size = Math.round(baseFontSize * 2);
        const h2Size = Math.round(baseFontSize * 1.45);

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>${fileName}</title>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
                <style>
                    @page { margin: 2cm; }
                    body { font-family: 'Inter', sans-serif; line-height: 1.75; color: #1E293B; font-size: ${baseFontSize}pt; }
                    h1 { font-size: ${h1Size}pt; border-bottom: 2pt solid #3B82F6; padding-bottom: 6pt; }
                    h2 { font-size: ${h2Size}pt; margin-top: 18pt; border-bottom: 1pt solid #E2E8F0; }
                    pre, blockquote, table { page-break-inside: avoid; }
                </style>
            </head>
            <body>${html}</body>
            </html>
        `);

        printWindow.document.close();
        setTimeout(() => { printWindow.print(); }, 500);
    },

    /**
     * 导出为 Word (.docx 格式)
     * @param {string} content - Markdown 内容
     * @param {string} fileName - 文件名
     */
    async exportAsWord(content, fileName) {
        // 检查 docx 库是否可用
        if (typeof docx === 'undefined') {
            console.warn('docx library not loaded, falling back to HTML format');
            this.exportAsWordFallback(content, fileName);
            return;
        }

        try {
            const { Document, Paragraph, TextRun, HeadingLevel, Packer,
                Table, TableRow, TableCell, WidthType, BorderStyle,
                AlignmentType } = docx;

            // 解析 Markdown 为结构化数据
            const elements = this.parseMarkdownToElements(content);

            // 创建文档
            const doc = new Document({
                sections: [{
                    properties: {},
                    children: elements.map(el => this.createDocxElement(el, docx))
                }]
            });

            // 生成 Blob
            const blob = await Packer.toBlob(doc);
            this.downloadBlob(blob, `${fileName}.docx`);

        } catch (error) {
            console.error('DOCX export error:', error);
            // 回退到 HTML 格式
            this.exportAsWordFallback(content, fileName);
        }
    },

    /**
     * 解析 Markdown 为结构化元素
     * @param {string} content - Markdown 内容
     * @returns {Array} 元素数组
     */
    parseMarkdownToElements(content) {
        const elements = [];
        const lines = content.split('\n');
        let inCodeBlock = false;
        let codeBlockContent = [];
        let codeBlockLang = '';

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // 代码块处理
            if (line.startsWith('```')) {
                if (!inCodeBlock) {
                    inCodeBlock = true;
                    codeBlockLang = line.slice(3).trim();
                    codeBlockContent = [];
                } else {
                    elements.push({
                        type: 'codeblock',
                        content: codeBlockContent.join('\n'),
                        lang: codeBlockLang
                    });
                    inCodeBlock = false;
                    codeBlockLang = '';
                }
                continue;
            }

            if (inCodeBlock) {
                codeBlockContent.push(line);
                continue;
            }

            // 标题
            const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
            if (headingMatch) {
                elements.push({
                    type: 'heading',
                    level: headingMatch[1].length,
                    content: headingMatch[2]
                });
                continue;
            }

            // 空行
            if (line.trim() === '') {
                continue;
            }

            // 列表项
            const ulMatch = line.match(/^[\s]*[-*+]\s+(.+)$/);
            if (ulMatch) {
                elements.push({
                    type: 'listitem',
                    content: ulMatch[1],
                    ordered: false
                });
                continue;
            }

            const olMatch = line.match(/^[\s]*\d+\.\s+(.+)$/);
            if (olMatch) {
                elements.push({
                    type: 'listitem',
                    content: olMatch[1],
                    ordered: true
                });
                continue;
            }

            // 引用
            if (line.startsWith('>')) {
                elements.push({
                    type: 'quote',
                    content: line.replace(/^>\s*/, '')
                });
                continue;
            }

            // 普通段落
            elements.push({
                type: 'paragraph',
                content: line
            });
        }

        return elements;
    },

    /**
     * 创建 docx 元素
     * @param {Object} el - 元素对象
     * @param {Object} docxLib - docx 库
     * @returns {Object} docx 元素
     */
    createDocxElement(el, docxLib) {
        const { Paragraph, TextRun, HeadingLevel } = docxLib;

        // 获取导出字体大小设置 (pt 转换为 half-points，docx 使用 half-points)
        const baseFontSize = this.getExportFontSize();
        const baseSizeHp = baseFontSize * 2;  // half-points
        const codeSizeHp = Math.round(baseFontSize * 0.82) * 2;

        switch (el.type) {
            case 'heading':
                const headingLevels = {
                    1: HeadingLevel.HEADING_1,
                    2: HeadingLevel.HEADING_2,
                    3: HeadingLevel.HEADING_3,
                    4: HeadingLevel.HEADING_4,
                    5: HeadingLevel.HEADING_5,
                    6: HeadingLevel.HEADING_6
                };
                return new Paragraph({
                    heading: headingLevels[el.level] || HeadingLevel.HEADING_1,
                    children: this.parseInlineText(el.content, docxLib, baseSizeHp)
                });

            case 'codeblock':
                return new Paragraph({
                    children: [
                        new TextRun({
                            text: el.content,
                            font: 'Consolas',
                            size: codeSizeHp,
                            break: el.content.includes('\n') ? undefined : undefined
                        })
                    ],
                    shading: { fill: 'F5F5F5' },
                    spacing: { before: 200, after: 200 }
                });

            case 'listitem':
                return new Paragraph({
                    bullet: el.ordered ? undefined : { level: 0 },
                    numbering: el.ordered ? { reference: 'default-numbering', level: 0 } : undefined,
                    children: this.parseInlineText(el.content, docxLib, baseSizeHp)
                });

            case 'quote':
                return new Paragraph({
                    children: this.parseInlineText(el.content, docxLib, baseSizeHp),
                    indent: { left: 720 },
                    border: {
                        left: { style: 'single', size: 24, color: '3B82F6' }
                    }
                });

            case 'paragraph':
            default:
                return new Paragraph({
                    children: this.parseInlineText(el.content, docxLib, baseSizeHp),
                    spacing: { after: 200 }
                });
        }
    },

    /**
     * 解析行内文本格式
     * @param {string} text - 文本内容
     * @param {Object} docxLib - docx 库
     * @returns {Array} TextRun 数组
     */
    parseInlineText(text, docxLib, sizeHp) {
        const { TextRun } = docxLib;
        const runs = [];

        // 简化处理：移除 Markdown 格式标记，返回纯文本
        // 移除粗体、斜体、代码等标记
        let cleanText = text
            .replace(/\*\*([^*]+)\*\*/g, '$1')  // 粗体
            .replace(/\*([^*]+)\*/g, '$1')      // 斜体
            .replace(/`([^`]+)`/g, '$1')        // 行内代码
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // 链接

        runs.push(new TextRun({ text: cleanText, size: sizeHp }));

        return runs;
    },

    /**
     * Word 导出回退方案（使用 HTML 格式）
     * @param {string} content 
     * @param {string} fileName 
     */
    exportAsWordFallback(content, fileName) {
        let html = MarkdownRenderer.render(content);

        // 清理 HTML（移除复制按钮等）
        html = this.cleanupForExport(html);

        // 移除 hljs 类相关的 span 标签，只保留文本
        html = html.replace(/<span class="hljs-[^"]*">([^<]*)<\/span>/gi, '$1');

        // 使用导出字体大小设置
        const baseFontSize = this.getExportFontSize();
        const h1Size = Math.round(baseFontSize * 2);
        const h2Size = Math.round(baseFontSize * 1.45);
        const h3Size = Math.round(baseFontSize * 1.18);
        const codeSize = Math.round(baseFontSize * 0.82);

        // Word 兼容的 HTML 格式
        const wordHTML = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head>
                <meta charset="UTF-8">
                <title>${fileName}</title>
                <!--[if gte mso 9]>
                <xml>
                    <w:WordDocument>
                        <w:View>Print</w:View>
                        <w:Zoom>100</w:Zoom>
                    </w:WordDocument>
                </xml>
                <![endif]-->
                <style>
                    :root {
                        --base-font-size: ${baseFontSize}pt;
                        --h1-font-size: ${h1Size}pt;
                        --h2-font-size: ${h2Size}pt;
                        --h3-font-size: ${h3Size}pt;
                        --code-font-size: ${codeSize}pt;
                    }
                    body { font-family: 'Calibri', sans-serif; font-size: var(--base-font-size); line-height: 1.6; color: #333; }
                    h1 { font-size: var(--h1-font-size); color: #1a1a1a; border-bottom: 1pt solid #ccc; padding-bottom: 6pt; margin-top: 12pt; margin-bottom: 12pt; }
                    h2 { font-size: var(--h2-font-size); color: #1a1a1a; border-bottom: 0.5pt solid #ddd; padding-bottom: 4pt; margin-top: 12pt; margin-bottom: 8pt; }
                    h3 { font-size: var(--h3-font-size); color: #333; margin-top: 10pt; margin-bottom: 6pt; }
                    h4, h5, h6 { font-size: var(--base-font-size); color: #333; margin-top: 8pt; margin-bottom: 4pt; }
                    p { margin-bottom: 10pt; margin-top: 0; }
                    code { font-family: 'Consolas', 'Courier New', monospace; font-size: var(--code-font-size); background-color: #f5f5f5; padding: 1pt 3pt; border: 0.5pt solid #ddd; }
                    pre { 
                        font-family: 'Consolas', 'Courier New', monospace; 
                        font-size: var(--code-font-size); 
                        background-color: #f8f8f8; 
                        padding: 10pt; 
                        margin: 10pt 0; 
                        white-space: pre-wrap;
                        word-wrap: break-word;
                        border: 1pt solid #e0e0e0;
                        line-height: 1.4;
                    }
                    pre code {
                        font-family: 'Consolas', 'Courier New', monospace;
                        font-size: var(--code-font-size);
                        background-color: transparent;
                        padding: 0;
                        border: none;
                        white-space: pre-wrap;
                        word-wrap: break-word;
                    }
                    blockquote { margin: 10pt 0; padding: 10pt; border-left: 3pt solid #0066cc; background-color: #f0f7ff; }
                    blockquote p { margin: 0; }
                    table { border-collapse: collapse; width: 100%; margin: 10pt 0; }
                    th, td { border: 1pt solid #ccc; padding: 6pt 10pt; text-align: left; }
                    th { background-color: #f5f5f5; font-weight: bold; }
                    ul, ol { padding-left: 20pt; margin: 0 0 10pt 0; }
                    li { margin-bottom: 4pt; }
                    a { color: #0066cc; text-decoration: none; }
                    img { max-width: 100%; height: auto; }
                    figure { margin: 10pt 0; text-align: center; }
                    figcaption { font-size: ${codeSize}pt; color: #666; margin-top: 4pt; }
                </style>
            </head>
            <body>
                ${html}
            </body>
            </html>
        `;

        const blob = new Blob([wordHTML], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        this.downloadBlob(blob, `${fileName}.docx`);
    },

    /**
     * 下载文件
     * @param {string} content 
     * @param {string} fileName 
     * @param {string} mimeType 
     */
    downloadFile(content, fileName, mimeType) {
        const blob = new Blob([content], { type: mimeType + ';charset=utf-8' });
        this.downloadBlob(blob, fileName);
    },

    /**
     * 下载 Blob
     * @param {Blob} blob 
     * @param {string} fileName 
     */
    downloadBlob(blob, fileName) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
};
