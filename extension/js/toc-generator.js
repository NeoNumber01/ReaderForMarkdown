/**
 * TOC Generator - 目录生成器
 * 从渲染后的内容中提取标题生成目录
 */

const TocGenerator = {
    activeId: null,

    /**
     * 生成目录
     * @param {HTMLElement} contentElement - 内容容器元素
     * @returns {HTMLElement} 目录列表元素
     */
    generate(contentElement) {
        const headings = contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const tocNav = document.getElementById('toc-nav');

        if (headings.length === 0) {
            tocNav.innerHTML = `<p class="toc-empty">${I18nManager.t('toc.empty')}</p>`;
            return;
        }

        const tocList = document.createElement('ul');
        tocList.className = 'toc-list';

        headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName.charAt(1));
            const text = heading.textContent;
            const id = heading.id || `heading-${index}`;

            // 确保标题有 ID
            if (!heading.id) {
                heading.id = id;
            }

            const item = document.createElement('li');
            item.className = 'toc-item';

            const link = document.createElement('a');
            link.className = 'toc-link';
            link.href = `#${id}`;
            link.textContent = text;
            link.setAttribute('data-level', level);

            // 点击事件 - 平滑滚动
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToHeading(heading);
                this.setActive(link);

                // 移动端关闭侧边栏
                if (window.innerWidth <= 768) {
                    document.getElementById('sidebar').classList.remove('mobile-open');
                    document.querySelector('.mobile-overlay')?.classList.remove('active');
                }
            });

            item.appendChild(link);
            tocList.appendChild(item);
        });

        tocNav.innerHTML = '';
        tocNav.appendChild(tocList);

        // 设置滚动监听
        this.setupScrollSpy(contentElement, headings);
    },

    /**
     * 滚动到指定标题
     * @param {HTMLElement} heading - 标题元素
     */
    scrollToHeading(heading) {
        const toolbar = document.querySelector('.toolbar');
        const toolbarHeight = toolbar ? toolbar.offsetHeight : 0;
        const targetPosition = heading.getBoundingClientRect().top + window.pageYOffset - toolbarHeight - 20;

        const contentWrapper = document.querySelector('.content-wrapper');
        if (contentWrapper) {
            const currentScroll = contentWrapper.scrollTop;
            const headingTop = heading.offsetTop - toolbarHeight - 20;

            contentWrapper.scrollTo({
                top: headingTop,
                behavior: 'smooth'
            });
        }
    },

    /**
     * 设置活动链接
     * @param {HTMLElement} activeLink - 活动的链接元素
     */
    setActive(activeLink) {
        document.querySelectorAll('.toc-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    },

    /**
     * 设置滚动监听
     * @param {HTMLElement} contentElement - 内容容器
     * @param {NodeList} headings - 标题元素列表
     */
    setupScrollSpy(contentElement, headings) {
        const contentWrapper = document.querySelector('.content-wrapper');
        if (!contentWrapper) return;

        let ticking = false;

        const updateActiveHeading = () => {
            const scrollTop = contentWrapper.scrollTop;
            const offset = 100;

            let currentHeading = null;

            headings.forEach(heading => {
                if (heading.offsetTop <= scrollTop + offset) {
                    currentHeading = heading;
                }
            });

            if (currentHeading && currentHeading.id !== this.activeId) {
                this.activeId = currentHeading.id;
                const activeLink = document.querySelector(`.toc-link[href="#${currentHeading.id}"]`);
                if (activeLink) {
                    this.setActive(activeLink);
                }
            }
        };

        contentWrapper.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateActiveHeading();
                    ticking = false;
                });
                ticking = true;
            }
        });
    },

    /**
     * 清空目录
     */
    clear() {
        const tocNav = document.getElementById('toc-nav');
        tocNav.innerHTML = `<p class="toc-empty">${I18nManager.t('toc.placeholder')}</p>`;
        this.activeId = null;
    }
};
