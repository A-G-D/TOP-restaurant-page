import html from './tabbed_window.html';
import './tabbed_window.css';

export const TabbedWindowElement = (() => {
    const elementTemplate = parseHtml(html)[0];
    const tabLinkTemplate = elementTemplate.getElementsByClassName('tab-link-template')[0];
    const tabContentTemplate = elementTemplate.getElementsByClassName('tab-content-template')[0];

    function parseHtml(htmlString) {
        const container = document.createElement('div');
        container.innerHTML = htmlString;
        return container.children;
    }

    function showTab(tab, show = true) {
        if (tab != null) {
            if (show) {
                tab.link.classList.add('active');
                tab.content.classList.add('active');
            } else {
                tab.link.classList.remove('active');
                tab.content.classList.remove('active');
            }
        }
    }

    const tabPrototype = {
        get name() {
            const linkContent = this.link.getElementsByClassName('tab-link-content')[0];
            return linkContent? linkContent.textContent : '';
        },
        set name(nameString) {
            const linkContent = this.link.getElementsByClassName('tab-link-content')[0];
            if (linkContent)
                linkContent.textContent = nameString;
        }
    }

    function createTab() {
        const link = tabLinkTemplate.cloneNode(true);
        const content = tabContentTemplate.cloneNode(true);
        const closeButton = link.getElementsByClassName('close-tab-button')[0];
        const tab = Object.create(tabPrototype);
        return Object.assign(tab, {link, content, closeButton});
    }

    const prototype = {
        showTabByIndex(index) {
            const tab = this.tabs[index];
            showTab(this.currentTab, false);
            showTab(tab, true);
            this.currentTab = tab;
        },

        removeTabByIndex(index) {
            if (index < this.tabs.length) {
                const currentIndex = this.tabs.indexOf(this.currentTab);
                const tab = this.tabs[index];
                this.tabs.splice(index, 1);
                this.links.removeChild(tab.link);
                this.contents.removeChild(tab.content);

                if (tab === this.currentTab) {
                    this.currentTab = null;
                    const i = Math.min(Math.max(currentIndex, 0), this.tabs.length - 1);
                    this.showTabByIndex(i);
                }
            }
        },

        addNewTab(index, name) {
            index = index ?? this.tabs.length;
            if (index > this.tabs.length)
                throw Error("Index out of bounds!");

            if (index < 0)
                index = this.tabs.length - index;

            const tab = createTab();
            tab.name = name;

            tab.link.addEventListener('click', (e) => {
                this.showTabByIndex(this.tabs.indexOf(tab));
            });
            if (tab.closeButton) {
                tab.closeButton.addEventListener('click', (e) => {
                    this.removeTabByIndex(this.tabs.indexOf(tab));
                    e.stopPropagation();
                });
            }

            if (index === this.tabs.length) {
                this.tabs.push(tab);
                if (this.newTabButton)
                    this.links.insertBefore(tab.link, this.links.lastElementChild);
                else
                    this.links.appendChild(tab.link);
                this.contents.appendChild(tab.content);

            } else {
                this.tabs.splice(tab, 0);
                const nextTab = this.tabs[index + 1];
                this.links.insertBefore(tab.link, nextTab.link);
                this.contents.insertBefore(tab.content, nextTab.content);
            }

            this.showTabByIndex(index);

            return tab;
        },

        clearTabs() {
            this.tabs.forEach((tab, index) => this.removeTabByIndex(index));
        }
    };

    {
        const templateLinks = elementTemplate.getElementsByClassName('tab-links')[0];
        const templateContents = elementTemplate.getElementsByClassName('tab-contents')[0];
        templateLinks.removeChild(tabLinkTemplate);
        templateContents.removeChild(tabContentTemplate);
    }

    return () => {
        const object = Object.create(prototype);
        const element = elementTemplate.cloneNode(true);
        const links = element.getElementsByClassName('tab-links')[0];
        const contents = element.getElementsByClassName('tab-contents')[0];
        const newTabButton = element.getElementsByClassName('new-tab-button')[0];
        const tabs = [];

        if (newTabButton)
            newTabButton.addEventListener('click', () => object.addNewTab());

        return Object.assign(object, {html, element, links, contents, tabs, newTabButton});
    };
})();