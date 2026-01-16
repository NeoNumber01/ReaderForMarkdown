/**
 * Content Script - Bootstrap Web App
 * 在 Markdown 文件页面注入完整 Web 应用
 * 
 * 策略：创建 iframe 加载主应用，通过 postMessage 传递 Markdown 内容
 */

(function () {
    'use strict';

    // 检查是否是 Markdown 文件
    const isMarkdownFile = () => {
        const url = window.location.href;
        return url.endsWith('.md') || url.endsWith('.markdown');
    };

    // 检查是否是纯文本（浏览器默认显示）
    const isPlainText = () => {
        const body = document.body;
        if (!body) return false;
        const children = body.children;
        return children.length === 1 && children[0].tagName === 'PRE';
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
    const bootstrapWebApp = () => {
        if (!isMarkdownFile() || !isPlainText()) return;

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
