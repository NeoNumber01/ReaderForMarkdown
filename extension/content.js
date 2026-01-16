/**
 * Content Script - Bootstrap Web App
 * 在 Markdown 文件页面注入完整 Web 应用
 * 
 * 策略：创建 iframe 加载主应用，通过 postMessage 传递 Markdown 内容
 */

(function () {
    'use strict';

    // 检查自动检测开关状态
    const checkAutoDetectEnabled = () => {
        return new Promise((resolve) => {
            chrome.storage.local.get(['autoDetectEnabled'], (result) => {
                // 默认开启
                resolve(result.autoDetectEnabled !== false);
            });
        });
    };

    // 检查是否是 Markdown 文件（基于 URL）
    const isMarkdownFile = () => {
        const url = window.location.href.toLowerCase();
        // 移除查询参数后检查
        const urlWithoutQuery = url.split('?')[0];
        return urlWithoutQuery.endsWith('.md') || urlWithoutQuery.endsWith('.markdown');
    };

    // 检查是否是已知的 Markdown 原始内容站点
    const isRawMarkdownSite = () => {
        const host = window.location.hostname;
        return host === 'raw.githubusercontent.com' ||
            host === 'gist.githubusercontent.com';
    };

    // 检查是否是纯文本（浏览器默认显示）
    const isPlainText = () => {
        const body = document.body;
        if (!body) return false;
        const children = body.children;
        // 纯文本通常只有一个 <pre> 标签
        return children.length === 1 && children[0].tagName === 'PRE';
    };

    // 检测内容是否像 Markdown（基于语法特征）
    const looksLikeMarkdown = (text) => {
        if (!text || text.length < 10) return false;

        const patterns = [
            /^#{1,6}\s+.+/m,              // 标题 # ## ### 等
            /^```[\s\S]*?```/m,           // 代码块
            /\*\*[^*]+\*\*/,              // 粗体
            /\[.+\]\(.+\)/,               // 链接 [text](url)
            /^[-*+]\s+.+/m,               // 无序列表
            /^\d+\.\s+.+/m,               // 有序列表
            /^>\s+.+/m,                   // 引用
            /!\[.*\]\(.+\)/,              // 图片
            /^---\s*$/m,                  // 分隔线
            /`[^`]+`/                     // 行内代码
        ];

        let matches = 0;
        for (const p of patterns) {
            if (p.test(text)) matches++;
        }

        // 至少匹配2个特征才认为是 Markdown
        return matches >= 2;
    };

    // 获取原始 Markdown 内容
    const getMarkdownContent = () => {
        const pre = document.querySelector('pre');
        return pre ? pre.textContent : document.body.innerText;
    };

    // 获取文件名
    const getFileName = () => {
        const path = window.location.pathname;
        return decodeURIComponent(path.split('/').pop() || 'Untitled.md');
    };

    // 主函数：引导加载 Web 应用
    const bootstrapWebApp = async () => {
        // 检查开关状态
        const enabled = await checkAutoDetectEnabled();
        if (!enabled) {
            console.log('Markdown Reader: 自动检测已禁用');
            return;
        }

        // 判断是否应该渲染
        const shouldRender = () => {
            // 必须是 Markdown 文件或已知的 raw 站点
            if (!isMarkdownFile() && !isRawMarkdownSite()) return false;

            // 必须是纯文本展示
            if (!isPlainText()) return false;

            // 对于非本地文件，额外检查内容特征
            if (!window.location.protocol.startsWith('file')) {
                const content = getMarkdownContent();
                if (!looksLikeMarkdown(content)) return false;
            }

            return true;
        };

        if (!shouldRender()) return;

        console.log('Markdown Reader: 检测到 Markdown 内容，开始渲染');

        // 1. 保存原始 Markdown 内容
        const markdownContent = getMarkdownContent();
        const fileName = getFileName();

        // 2. 清空页面并准备容器
        document.documentElement.innerHTML = '';

        // 3. 重建 HTML 结构
        const html = document.createElement('html');
        html.lang = 'zh-CN';

        const head = document.createElement('head');
        head.innerHTML = `
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${fileName} - Markdown Reader</title>
            <style>
                html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }
                #app-frame { width: 100%; height: 100%; border: none; }
            </style>
        `;

        const body = document.createElement('body');

        // 4. 创建 iframe 加载主应用
        const iframe = document.createElement('iframe');
        iframe.id = 'app-frame';
        iframe.src = chrome.runtime.getURL('index.html');

        body.appendChild(iframe);
        html.appendChild(head);
        html.appendChild(body);

        // 替换整个文档
        document.replaceChild(html, document.documentElement);

        // 5. 等待 iframe 加载完成后传递内容
        iframe.addEventListener('load', () => {
            // 通过 postMessage 发送内容到 iframe
            iframe.contentWindow.postMessage({
                type: 'MARKDOWN_READER_LOAD',
                fileName: fileName,
                content: markdownContent
            }, '*');
        });
    };

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrapWebApp);
    } else {
        bootstrapWebApp();
    }
})();
