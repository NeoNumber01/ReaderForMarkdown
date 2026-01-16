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

        // 导出选项点击
        document.querySelectorAll('.export-option').forEach(option => {
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
        if (exportMenu) {
            exportMenu.classList.add('active');
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
        const fileName = this.getCurrentFileName();

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
        const html = MarkdownRenderer.render(content);
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
        h1 { font-size: 2.25rem; border-bottom: 2px solid #E2E8F0; padding-bottom: 0.5rem; }
        h2 { font-size: 1.75rem; border-bottom: 1px solid #E2E8F0; padding-bottom: 0.375rem; }
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
        const html = MarkdownRenderer.render(content);

        // 创建临时容器
        const container = document.createElement('div');
        container.innerHTML = `
            <div class="pdf-export-container">
                <style>
                    .pdf-export-container {
                        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        font-size: 11pt;
                        line-height: 1.8;
                        color: #1E293B;
                        padding: 0;
                        max-width: 100%;
                    }
                    .pdf-export-container h1 {
                        font-size: 22pt;
                        font-weight: 700;
                        color: #0F172A;
                        margin: 0 0 16pt 0;
                        padding-bottom: 10pt;
                        border-bottom: 2pt solid #3B82F6;
                    }
                    .pdf-export-container h2 {
                        font-size: 16pt;
                        font-weight: 600;
                        color: #1E293B;
                        margin: 20pt 0 12pt 0;
                        padding-bottom: 6pt;
                        border-bottom: 1pt solid #E2E8F0;
                    }
                    .pdf-export-container h3 {
                        font-size: 13pt;
                        font-weight: 600;
                        color: #334155;
                        margin: 16pt 0 8pt 0;
                    }
                    .pdf-export-container h4, .pdf-export-container h5, .pdf-export-container h6 {
                        font-size: 11pt;
                        font-weight: 600;
                        color: #475569;
                        margin: 12pt 0 6pt 0;
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
                        font-size: 9pt;
                        background: #F1F5F9;
                        color: #0F172A;
                        padding: 2pt 5pt;
                        border-radius: 3pt;
                        border: 0.5pt solid #E2E8F0;
                    }
                    .pdf-export-container pre {
                        background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
                        border: 1pt solid #E2E8F0;
                        border-radius: 6pt;
                        padding: 12pt;
                        margin: 10pt 0;
                        overflow: hidden;
                        page-break-inside: avoid;
                    }
                    .pdf-export-container pre code {
                        background: transparent;
                        border: none;
                        padding: 0;
                        font-size: 9pt;
                        line-height: 1.5;
                    }
                    .pdf-export-container blockquote {
                        margin: 10pt 0;
                        padding: 10pt 14pt;
                        background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
                        border-left: 4pt solid #3B82F6;
                        border-radius: 0 6pt 6pt 0;
                        font-style: italic;
                        color: #1E40AF;
                    }
                    .pdf-export-container blockquote p {
                        margin: 0;
                    }
                    .pdf-export-container ul, .pdf-export-container ol {
                        margin: 0 0 10pt 0;
                        padding-left: 20pt;
                    }
                    .pdf-export-container li {
                        margin-bottom: 4pt;
                    }
                    .pdf-export-container table {
                        width: 100%;
                        margin: 10pt 0;
                        border-collapse: collapse;
                        page-break-inside: avoid;
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
                    }
                    .pdf-export-container figcaption {
                        font-size: 9pt;
                        color: #64748B;
                        margin-top: 6pt;
                    }
                    .katex-display {
                        margin: 10pt 0;
                        overflow-x: auto;
                    }
                </style>
                ${html}
            </div>
        `;

        document.body.appendChild(container);

        // 使用 html2pdf 生成 PDF
        const opt = {
            margin: [15, 15, 15, 15],
            filename: `${fileName}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                letterRendering: true,
                logging: false
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait'
            },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
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
     * PDF 导出回退方案（使用打印）
     * @param {string} content 
     * @param {string} fileName 
     */
    exportAsPDFFallback(content, fileName) {
        const html = MarkdownRenderer.render(content);
        const printWindow = window.open('', '_blank');

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>${fileName}</title>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
                <style>
                    @page { margin: 2cm; }
                    body { font-family: 'Inter', sans-serif; line-height: 1.75; color: #1E293B; font-size: 12pt; }
                    h1 { font-size: 22pt; border-bottom: 2pt solid #3B82F6; padding-bottom: 6pt; }
                    h2 { font-size: 16pt; margin-top: 18pt; border-bottom: 1pt solid #E2E8F0; }
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
     * 导出为 Word (使用 HTML 格式，Word 可以打开)
     * @param {string} content 
     * @param {string} fileName 
     */
    exportAsWord(content, fileName) {
        const html = MarkdownRenderer.render(content);

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
                    body { font-family: 'Calibri', sans-serif; font-size: 11pt; line-height: 1.6; color: #333; }
                    h1 { font-size: 20pt; color: #1a1a1a; border-bottom: 1pt solid #ccc; padding-bottom: 6pt; }
                    h2 { font-size: 16pt; color: #1a1a1a; border-bottom: 0.5pt solid #ddd; padding-bottom: 4pt; }
                    h3 { font-size: 13pt; color: #333; }
                    p { margin-bottom: 10pt; }
                    code { font-family: 'Consolas', monospace; font-size: 10pt; background-color: #f5f5f5; padding: 2pt 4pt; }
                    pre { font-family: 'Consolas', monospace; font-size: 10pt; background-color: #f5f5f5; padding: 10pt; margin: 10pt 0; white-space: pre-wrap; }
                    blockquote { margin: 10pt 0; padding: 10pt; border-left: 3pt solid #0066cc; background-color: #f0f7ff; }
                    table { border-collapse: collapse; width: 100%; margin: 10pt 0; }
                    th, td { border: 1pt solid #ccc; padding: 6pt 10pt; text-align: left; }
                    th { background-color: #f5f5f5; font-weight: bold; }
                    ul, ol { padding-left: 20pt; }
                    a { color: #0066cc; }
                </style>
            </head>
            <body>
                ${html}
            </body>
            </html>
        `;

        const blob = new Blob([wordHTML], { type: 'application/msword' });
        this.downloadBlob(blob, `${fileName}.doc`);
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
