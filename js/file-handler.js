/**
 * File Handler - 文件处理器
 * 处理文件拖放和选择
 */

const FileHandler = {
    /**
     * 初始化文件处理器
     */
    init() {
        this.fileInput = document.getElementById('file-input');
        this.dropOverlay = document.getElementById('drop-overlay');
        this.bindEvents();
    },

    /**
     * 绑定事件
     */
    bindEvents() {
        // 文件选择按钮
        const openBtn = document.getElementById('open-file-btn');
        const welcomeOpenBtn = document.getElementById('welcome-open-btn');

        if (openBtn) {
            openBtn.addEventListener('click', () => this.openFileDialog());
        }
        if (welcomeOpenBtn) {
            welcomeOpenBtn.addEventListener('click', () => this.openFileDialog());
        }

        // 文件输入变化
        if (this.fileInput) {
            this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        }

        // 拖放事件
        this.setupDragAndDrop();
    },

    /**
     * 设置拖放功能
     */
    setupDragAndDrop() {
        const body = document.body;
        let dragCounter = 0;

        // 阻止默认拖放行为
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            body.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        // 拖入
        body.addEventListener('dragenter', (e) => {
            dragCounter++;
            if (this.isValidDrag(e)) {
                this.showDropOverlay();
            }
        });

        // 拖出
        body.addEventListener('dragleave', (e) => {
            dragCounter--;
            if (dragCounter === 0) {
                this.hideDropOverlay();
            }
        });

        // 拖放释放
        body.addEventListener('drop', (e) => {
            dragCounter = 0;
            this.hideDropOverlay();

            // 检查是否在图片对话框内拖放，如果是则忽略（让图片对话框自己处理）
            const imageDialog = document.querySelector('.image-dialog-overlay');
            if (imageDialog && imageDialog.contains(e.target)) {
                return;
            }

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFile(files[0]);
            }
        });
    },

    /**
     * 检查是否是有效的拖放
     * @param {DragEvent} e - 拖放事件
     * @returns {boolean}
     */
    isValidDrag(e) {
        if (e.dataTransfer.items) {
            for (let item of e.dataTransfer.items) {
                if (item.kind === 'file') {
                    return true;
                }
            }
        }
        return e.dataTransfer.files.length > 0;
    },

    /**
     * 显示拖放遮罩
     */
    showDropOverlay() {
        if (this.dropOverlay) {
            this.dropOverlay.classList.add('active');
        }
    },

    /**
     * 隐藏拖放遮罩
     */
    hideDropOverlay() {
        if (this.dropOverlay) {
            this.dropOverlay.classList.remove('active');
        }
    },

    /**
     * 打开文件选择对话框
     */
    openFileDialog() {
        if (this.fileInput) {
            this.fileInput.click();
        }
    },

    /**
     * 处理文件选择事件
     * @param {Event} e - 事件对象
     */
    handleFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            this.handleFile(files[0]);
        }
        // 清除 input 值，允许重新选择同一文件
        e.target.value = '';
    },

    /**
     * 处理文件
     * @param {File} file - 文件对象
     */
    handleFile(file) {
        // 检查是否是目录（目录的 type 为空且通常 size 为 0，但文件名没有扩展名）
        // 在某些浏览器中，拖放目录时 file.type 为空，且读取会失败
        if (file.type === '' && file.size === 0) {
            this.showError(I18nManager.t('file.is_directory') || '无法打开文件夹，请选择一个 Markdown 文件');
            return;
        }

        // 验证文件类型
        const validExtensions = ['.md', '.markdown', '.txt'];
        const fileName = file.name.toLowerCase();
        const isValid = validExtensions.some(ext => fileName.endsWith(ext));

        if (!isValid) {
            this.showError(I18nManager.t('file.invalid_type'));
            return;
        }

        // 读取文件
        const reader = new FileReader();

        reader.onload = (e) => {
            const content = e.target.result;
            this.onFileLoaded(file.name, content);
        };

        reader.onerror = () => {
            this.showError(I18nManager.t('file.read_error'));
        };

        reader.readAsText(file, 'UTF-8');
    },

    /**
     * 文件加载完成回调
     * @param {string} fileName - 文件名
     * @param {string} content - 文件内容
     */
    onFileLoaded(fileName, content) {
        // 触发自定义事件
        const event = new CustomEvent('markdownLoaded', {
            detail: { fileName, content }
        });
        document.dispatchEvent(event);
    },

    /**
     * 显示错误提示
     * @param {string} message - 错误信息
     */
    showError(message) {
        // 简单的错误提示，可以替换为更精美的通知组件
        alert(message);
    }
};
