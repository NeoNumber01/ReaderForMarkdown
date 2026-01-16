/**
 * Electron Main Process
 * 桌面应用主进程
 */

const { app, BrowserWindow, Menu, dialog, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let currentFilePath = null;

/**
 * 创建主窗口
 */
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 600,
        minHeight: 400,
        title: 'Markdown Reader',
        icon: path.join(__dirname, 'icons', 'icon.png'),
        autoHideMenuBar: true, // 隐藏菜单栏，按 Alt 键可临时显示
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        show: false, // 等待加载完成后显示
        backgroundColor: '#F8FAFC'
    });

    // 加载主页面
    mainWindow.loadFile('index.html');

    // 窗口准备好后显示
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // 创建菜单
    createMenu();

    // 开发模式打开开发者工具
    if (process.argv.includes('--dev')) {
        mainWindow.webContents.openDevTools();
    }
}

/**
 * 创建应用菜单
 */
function createMenu() {
    const template = [
        {
            label: '文件',
            submenu: [
                {
                    label: '新建',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => mainWindow.webContents.send('menu-new')
                },
                {
                    label: '打开...',
                    accelerator: 'CmdOrCtrl+O',
                    click: () => openFile()
                },
                { type: 'separator' },
                {
                    label: '保存',
                    accelerator: 'CmdOrCtrl+S',
                    click: () => saveFile()
                },
                {
                    label: '另存为...',
                    accelerator: 'CmdOrCtrl+Shift+S',
                    click: () => saveFileAs()
                },
                { type: 'separator' },
                {
                    label: '导出为 HTML',
                    click: () => mainWindow.webContents.send('menu-export', 'html')
                },
                {
                    label: '导出为 PDF',
                    click: () => mainWindow.webContents.send('menu-export', 'pdf')
                },
                {
                    label: '导出为 Word',
                    click: () => mainWindow.webContents.send('menu-export', 'docx')
                },
                { type: 'separator' },
                {
                    label: '退出',
                    accelerator: 'CmdOrCtrl+Q',
                    click: () => app.quit()
                }
            ]
        },
        {
            label: '编辑',
            submenu: [
                { label: '撤销', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
                { label: '重做', accelerator: 'CmdOrCtrl+Shift+Z', role: 'redo' },
                { type: 'separator' },
                { label: '剪切', accelerator: 'CmdOrCtrl+X', role: 'cut' },
                { label: '复制', accelerator: 'CmdOrCtrl+C', role: 'copy' },
                { label: '粘贴', accelerator: 'CmdOrCtrl+V', role: 'paste' },
                { type: 'separator' },
                { label: '全选', accelerator: 'CmdOrCtrl+A', role: 'selectAll' }
            ]
        },
        {
            label: '视图',
            submenu: [
                {
                    label: '切换编辑模式',
                    accelerator: 'CmdOrCtrl+E',
                    click: () => mainWindow.webContents.send('menu-toggle-edit')
                },
                { type: 'separator' },
                {
                    label: '切换主题',
                    accelerator: 'CmdOrCtrl+D',
                    click: () => mainWindow.webContents.send('menu-toggle-theme')
                },
                { type: 'separator' },
                { label: '放大', accelerator: 'CmdOrCtrl+Plus', role: 'zoomIn' },
                { label: '缩小', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' },
                { label: '重置缩放', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
                { type: 'separator' },
                { label: '全屏', accelerator: 'F11', role: 'togglefullscreen' }
            ]
        },
        {
            label: '帮助',
            submenu: [
                {
                    label: '关于 Markdown Reader',
                    click: () => showAbout()
                },
                { type: 'separator' },
                {
                    label: '开发者工具',
                    accelerator: 'F12',
                    click: () => mainWindow.webContents.toggleDevTools()
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

/**
 * 打开文件
 */
async function openFile() {
    const result = await dialog.showOpenDialog(mainWindow, {
        title: '打开 Markdown 文件',
        filters: [
            { name: 'Markdown', extensions: ['md', 'markdown'] },
            { name: '文本文件', extensions: ['txt'] },
            { name: '所有文件', extensions: ['*'] }
        ],
        properties: ['openFile']
    });

    if (!result.canceled && result.filePaths.length > 0) {
        const filePath = result.filePaths[0];
        loadFile(filePath);
    }
}

/**
 * 加载文件
 * @param {string} filePath 
 */
function loadFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const fileName = path.basename(filePath);
        const fileDir = path.dirname(filePath);

        currentFilePath = filePath;
        mainWindow.setTitle(`${fileName} - Markdown Reader`);
        mainWindow.webContents.send('file-opened', { fileName, content, filePath, fileDir });
    } catch (error) {
        dialog.showErrorBox('错误', `无法打开文件: ${error.message}`);
    }
}

/**
 * 保存文件
 */
async function saveFile() {
    if (currentFilePath) {
        mainWindow.webContents.send('request-content');
    } else {
        saveFileAs();
    }
}

/**
 * 另存为
 */
async function saveFileAs() {
    const result = await dialog.showSaveDialog(mainWindow, {
        title: '保存 Markdown 文件',
        defaultPath: currentFilePath || '未命名.md',
        filters: [
            { name: 'Markdown', extensions: ['md'] },
            { name: '所有文件', extensions: ['*'] }
        ]
    });

    if (!result.canceled && result.filePath) {
        currentFilePath = result.filePath;
        mainWindow.webContents.send('request-content-save-as', result.filePath);
    }
}

/**
 * 显示关于对话框
 */
function showAbout() {
    dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: '关于 Markdown Reader',
        message: 'Markdown Reader',
        detail: '版本 1.0.0\n\n精致优雅的 Markdown 阅读器和编辑器\n\n支持完整 Markdown 语法、代码高亮、数学公式等功能。'
    });
}

// IPC 通信
ipcMain.on('save-content', (event, { content, filePath }) => {
    try {
        const savePath = filePath || currentFilePath;
        if (savePath) {
            fs.writeFileSync(savePath, content, 'utf-8');
            mainWindow.setTitle(`${path.basename(savePath)} - Markdown Reader`);
        }
    } catch (error) {
        dialog.showErrorBox('错误', `保存失败: ${error.message}`);
    }
});

ipcMain.on('open-external', (event, url) => {
    shell.openExternal(url);
});

// 读取本地图片并返回 Base64 数据
ipcMain.handle('read-local-image', async (event, { imagePath, baseDir }) => {
    try {
        let fullPath = imagePath;

        // 如果是相对路径，则基于 baseDir 解析
        if (!path.isAbsolute(imagePath)) {
            fullPath = path.resolve(baseDir, imagePath);
        }

        // 检查文件是否存在
        if (!fs.existsSync(fullPath)) {
            return { success: false, error: 'File not found' };
        }

        // 读取文件
        const data = fs.readFileSync(fullPath);
        const base64 = data.toString('base64');

        // 根据扩展名确定 MIME 类型
        const ext = path.extname(fullPath).toLowerCase();
        const mimeTypes = {
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml',
            '.bmp': 'image/bmp',
            '.ico': 'image/x-icon'
        };
        const mimeType = mimeTypes[ext] || 'image/png';

        return {
            success: true,
            data: `data:${mimeType};base64,${base64}`
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// 应用事件
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// 处理文件拖放或命令行打开
app.on('open-file', (event, filePath) => {
    event.preventDefault();
    if (mainWindow) {
        loadFile(filePath);
    }
});

// 处理命令行参数
if (process.argv.length > 1) {
    const filePath = process.argv[process.argv.length - 1];
    // 确保路径存在且是文件（不是目录）
    if (filePath && !filePath.startsWith('-') && fs.existsSync(filePath)) {
        try {
            const stat = fs.statSync(filePath);
            if (stat.isFile()) {
                app.whenReady().then(() => {
                    setTimeout(() => loadFile(filePath), 500);
                });
            }
        } catch (error) {
            // 忽略无法获取文件状态的错误
        }
    }
}
