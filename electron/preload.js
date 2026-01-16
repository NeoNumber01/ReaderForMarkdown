/**
 * Electron Preload Script
 * 安全地暴露 API 给渲染进程
 */

const { contextBridge, ipcRenderer } = require('electron');

// 暴露安全的 API
contextBridge.exposeInMainWorld('electronAPI', {
    // 发送消息
    saveContent: (content, filePath) => ipcRenderer.send('save-content', { content, filePath }),
    openExternal: (url) => ipcRenderer.send('open-external', url),

    // 读取本地图片
    readLocalImage: (imagePath, baseDir) => ipcRenderer.invoke('read-local-image', { imagePath, baseDir }),

    // 接收消息
    onFileOpened: (callback) => ipcRenderer.on('file-opened', (event, data) => callback(data)),
    onMenuNew: (callback) => ipcRenderer.on('menu-new', () => callback()),
    onMenuToggleEdit: (callback) => ipcRenderer.on('menu-toggle-edit', () => callback()),
    onMenuToggleTheme: (callback) => ipcRenderer.on('menu-toggle-theme', () => callback()),
    onMenuExport: (callback) => ipcRenderer.on('menu-export', (event, format) => callback(format)),
    onRequestContent: (callback) => ipcRenderer.on('request-content', () => callback()),
    onRequestContentSaveAs: (callback) => ipcRenderer.on('request-content-save-as', (event, filePath) => callback(filePath)),

    // 检测是否在 Electron 环境
    isElectron: true
});
