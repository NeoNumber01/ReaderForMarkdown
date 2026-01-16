/**
 * Popup Script
 * 处理扩展弹出窗口的交互
 */

document.addEventListener('DOMContentLoaded', () => {
    const openAppBtn = document.getElementById('open-app');

    if (openAppBtn) {
        openAppBtn.addEventListener('click', () => {
            // 打开完整应用页面
            chrome.tabs.create({
                url: chrome.runtime.getURL('../index.html')
            });
        });
    }
});
