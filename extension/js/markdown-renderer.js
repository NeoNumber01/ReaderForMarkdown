/**
 * Markdown Renderer - Markdown 渲染引擎
 * 集成 Marked.js + Highlight.js + KaTeX
 */

const MarkdownRenderer = {
    /**
     * 初始化渲染器
     */
    init() {
        this.configureMarked();
    },

    /**
     * 配置 Marked.js
     */
    configureMarked() {
        // 创建自定义渲染器，使用扩展方式
        const customRenderer = {
            // 自定义代码块渲染
            code({ text, lang }) {
                const language = (lang || '').split(' ')[0];
                let highlighted;

                try {
                    if (language && hljs.getLanguage(language)) {
                        highlighted = hljs.highlight(text, { language }).value;
                    } else {
                        highlighted = hljs.highlightAuto(text).value;
                    }
                } catch (e) {
                    highlighted = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                }

                // 转义代码内容用于 data 属性
                const escapedCode = text
                    .replace(/&/g, '&amp;')
                    .replace(/"/g, '&quot;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');

                // GitHub 风格的复制按钮
                const copyButton = `<button class="code-copy-btn" title="${I18nManager.t('copy') || 'Copy'}" data-code="${escapedCode}">
                    <svg class="copy-icon" viewBox="0 0 16 16" width="16" height="16">
                        <path fill="currentColor" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path>
                        <path fill="currentColor" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
                    </svg>
                    <svg class="check-icon" viewBox="0 0 16 16" width="16" height="16" style="display:none;">
                        <path fill="currentColor" d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
                    </svg>
                </button>`;

                return `<div class="code-block-wrapper"><pre data-lang="${language || 'text'}">${copyButton}<code class="hljs language-${language}">${highlighted}</code></pre></div>`;
            },

            // 自定义标题渲染
            heading({ tokens, depth }) {
                const text = this.parser.parseInline(tokens);
                const id = MarkdownRenderer.generateHeadingId(text);
                return `<h${depth} id="${id}">${text}</h${depth}>\n`;
            },

            // 自定义链接渲染
            link({ href, title, tokens }) {
                const text = this.parser.parseInline(tokens);
                const isExternal = href && (href.startsWith('http://') || href.startsWith('https://'));
                const titleAttr = title ? ` title="${title}"` : '';
                const targetAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
                return `<a href="${href}"${titleAttr}${targetAttr}>${text}</a>`;
            },

            // 自定义图片渲染
            image({ href, title, text }) {
                const titleAttr = title ? ` title="${title}"` : '';
                const altAttr = text ? ` alt="${text}"` : '';
                return `<figure><img src="${href}"${altAttr}${titleAttr} loading="lazy">${text ? `<figcaption>${text}</figcaption>` : ''}</figure>`;
            }
        };

        // 使用自定义渲染器
        marked.use({ renderer: customRenderer });
    },

    /**
     * 生成标题 ID
     * @param {string} text - 标题文本
     * @returns {string} 生成的 ID
     */
    generateHeadingId(text) {
        if (!text || typeof text !== 'string') {
            return 'heading';
        }
        return text
            .toLowerCase()
            .replace(/<[^>]+>/g, '')  // 移除 HTML 标签
            .replace(/[^\w\u4e00-\u9fa5]+/g, '-')  // 非字母数字和中文替换为连字符
            .replace(/^-+|-+$/g, '')  // 移除首尾连字符
            || 'heading';
    },

    /**
     * 渲染 Markdown 内容
     * @param {string} markdown - Markdown 源码
     * @returns {string} 渲染后的 HTML
     */
    render(markdown) {
        if (!markdown) return '';

        try {
            // 预处理：替换本地图片标记为实际的 Base64 数据
            let preprocessed = markdown;
            if (typeof Editor !== 'undefined' && Editor.imageStore) {
                preprocessed = preprocessed.replace(/!\[([^\]]*)\]\(local:([^)]+)\)/g, (match, alt, imgId) => {
                    const base64Data = Editor.imageStore[imgId];
                    if (base64Data) {
                        return `![${alt}](${base64Data})`;
                    }
                    return match; // 如果找不到数据，保持原样
                });
            }

            // 预处理：保护 Base64 图片（使用函数式处理避免正则问题）
            const base64Images = [];
            preprocessed = this.protectBase64Images(preprocessed, base64Images);

            // 预处理：处理数学公式
            preprocessed = this.preprocessMath(preprocessed);

            // 渲染 Markdown
            let html = marked.parse(preprocessed);

            // 后处理：恢复 Base64 图片
            base64Images.forEach((img, index) => {
                const placeholder = `%%BASE64IMG${index}%%`;
                const escapedAlt = (img.alt || '').replace(/"/g, '&quot;');
                const imgHtml = `<figure><img src="${img.src}" alt="${escapedAlt}" loading="lazy" style="max-width:100%;height:auto;">${img.alt ? `<figcaption>${img.alt}</figcaption>` : ''}</figure>`;

                // 替换被 p 标签包裹的占位符
                html = html.split(`<p>${placeholder}</p>`).join(imgHtml);
                // 替换未被包裹的占位符
                html = html.split(placeholder).join(imgHtml);
            });

            // 后处理：渲染数学公式
            html = this.postprocessMath(html);

            // 处理 GitHub 风格的告警
            html = this.processAlerts(html);

            return html;
        } catch (e) {
            console.error('Markdown render error:', e);
            // 返回基本格式化的内容
            return `<pre>${markdown.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`;
        }
    },

    /**
     * 保护 Base64 图片不被 Markdown 解析器破坏
     * @param {string} markdown - Markdown 源码
     * @param {Array} storage - 存储提取的图片数据
     * @returns {string} 处理后的 Markdown
     */
    protectBase64Images(markdown, storage) {
        let result = '';
        let i = 0;

        while (i < markdown.length) {
            // 查找图片语法开始 ![
            if (markdown[i] === '!' && markdown[i + 1] === '[') {
                // 查找 alt 文本结束 ]
                let altEnd = markdown.indexOf('](', i + 2);
                if (altEnd !== -1) {
                    const alt = markdown.substring(i + 2, altEnd);
                    // 检查是否是 data:image 开头
                    const srcStart = altEnd + 2;
                    if (markdown.substring(srcStart, srcStart + 11) === 'data:image/') {
                        // 找到匹配的结束括号（考虑 Base64 中可能有括号）
                        let parenCount = 1;
                        let srcEnd = srcStart;
                        while (srcEnd < markdown.length && parenCount > 0) {
                            srcEnd++;
                            if (markdown[srcEnd] === '(') parenCount++;
                            else if (markdown[srcEnd] === ')') parenCount--;
                        }

                        if (parenCount === 0) {
                            const src = markdown.substring(srcStart, srcEnd);
                            const index = storage.length;
                            storage.push({ alt, src });
                            result += `%%BASE64IMG${index}%%`;
                            i = srcEnd + 1;
                            continue;
                        }
                    }
                }
            }
            result += markdown[i];
            i++;
        }

        return result;
    },

    /**
     * 预处理数学公式
     * @param {string} markdown - Markdown 源码
     * @returns {string} 处理后的 Markdown
     */
    preprocessMath(markdown) {
        // 保护数学公式不被 Markdown 解析器处理
        const mathBlocks = [];

        // 块级公式 $$...$$ (先处理块级，避免被行内匹配)
        markdown = markdown.replace(/\$\$([^$]+?)\$\$/gs, (match, formula) => {
            const index = mathBlocks.length;
            mathBlocks.push({ type: 'block', formula });
            return `%%MATH_BLOCK_${index}%%`;
        });

        // 行内公式 $...$
        markdown = markdown.replace(/\$([^\$\n]+?)\$/g, (match, formula) => {
            const index = mathBlocks.length;
            mathBlocks.push({ type: 'inline', formula });
            return `%%MATH_INLINE_${index}%%`;
        });

        // 存储公式供后处理使用
        this._mathBlocks = mathBlocks;

        return markdown;
    },

    /**
     * 后处理数学公式
     * @param {string} html - 渲染后的 HTML
     * @returns {string} 处理后的 HTML
     */
    postprocessMath(html) {
        if (!this._mathBlocks || !window.katex) return html;

        this._mathBlocks.forEach((item, index) => {
            try {
                const rendered = katex.renderToString(item.formula, {
                    displayMode: item.type === 'block',
                    throwOnError: false,
                    trust: true
                });

                const placeholder = item.type === 'inline'
                    ? `%%MATH_INLINE_${index}%%`
                    : `%%MATH_BLOCK_${index}%%`;

                const wrapper = item.type === 'block'
                    ? `<div class="katex-display">${rendered}</div>`
                    : rendered;

                html = html.replace(placeholder, wrapper);
            } catch (e) {
                console.warn('KaTeX error:', e);
            }
        });

        return html;
    },

    /**
     * 处理 GitHub 风格的告警
     * @param {string} html - HTML 内容
     * @returns {string} 处理后的 HTML
     */
    processAlerts(html) {
        const alertTypes = {
            'NOTE': { class: 'alert-note', icon: 'ℹ️', labelKey: 'alert.note' },
            'TIP': { class: 'alert-tip', icon: '💡', labelKey: 'alert.tip' },
            'IMPORTANT': { class: 'alert-important', icon: '❗', labelKey: 'alert.important' },
            'WARNING': { class: 'alert-warning', icon: '⚠️', labelKey: 'alert.warning' },
            'CAUTION': { class: 'alert-caution', icon: '🚨', labelKey: 'alert.caution' }
        };

        // 匹配 > [!TYPE] 格式
        Object.keys(alertTypes).forEach(type => {
            const regex = new RegExp(
                `<blockquote>\\s*<p>\\[!${type}\\]([\\s\\S]*?)</blockquote>`,
                'gi'
            );

            html = html.replace(regex, (match, content) => {
                const alert = alertTypes[type];
                const label = I18nManager.t(alert.labelKey);
                return `<div class="alert ${alert.class}">
                    <div class="alert-title">${alert.icon} ${label}</div>
                    <div class="alert-content">${content.replace(/^<\/p>/, '').trim()}</div>
                </div>`;
            });
        });

        return html;
    }
};
