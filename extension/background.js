/**
 * Background Service Worker
 * 处理扩展的后台逻辑
 */

// 安装事件
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('Markdown Reader 扩展已安装');
    } else if (details.reason === 'update') {
        console.log('Markdown Reader 扩展已更新');
    }
});

// 监听来自 content script 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getTheme') {
        chrome.storage.local.get(['theme'], (result) => {
            sendResponse({ theme: result.theme || 'light' });
        });
        return true; // 异步响应
    }

    if (request.action === 'setTheme') {
        chrome.storage.local.set({ theme: request.theme }, () => {
            sendResponse({ success: true });
        });
        return true;
    }
});

// 点击扩展图标时的行为
chrome.action.onClicked.addListener((tab) => {
    // 如果当前是 .md 文件，触发渲染
    if (tab.url && (tab.url.endsWith('.md') || tab.url.endsWith('.markdown'))) {
        chrome.tabs.sendMessage(tab.id, { action: 'render' });
    }
});
