import headerSectionHtml from './headersection.html';
import mainSectionHtml from './mainsection.html';
import footerSectionHtml from './footersection.html';
import homeTabHtml from './hometab.html';
import menuTabHtml from './menutab.html';
import aboutTabHtml from './abouttab.html';
import './styles.css';

// 

const TabContainerElement = (() => {
    function parseHtml(html) {
        const container = document.createElement('div');
        container.innerHTML = html;
        return container.children;
    }

    function showTab(tab, show = true) {
        for (const child of tab.children)
            child.style.display = show? 'block' : 'none';
    }

    function onTabLinkClick(e) {

    }

    const prototype = {
        showTabByIndex(index) {
            showTab(this.currentTab, false);
            showTab(this.tabs[index], true);
            this.currentTab = false;
        }
    };

    return (html) => {
        const container = parseHtml(html)[0];
        const links = container.getElementsByClassName('tab-links')[0];
        const contents = container.getElementsByClassName('tab-contents')[0];
        const linkItems = container.getElementsByClassName('tab-link');
        const contentItems = container.getElementsByClassName('tab-content');
        const tabs = [];

        const defaultLink = container.getElementsByClassName('default-tab')[0];
        let currentLink = defaultLink;

        for (let i = 0; i < linkItems.length; ++i) {
            tabs.push({link: linkItems[i], content: contentItems[i]});
            linkItems[i].addEventListener('click', (e) => {
                for (const child of contentItems[i]) {
                    showTab(currentLink, false);
                    showTab(contentItems[i], true);

                    currentLink = this;
                }
            });
        }

        return Object.assign(Object.create(prototype), {
            html,
            container,
            links,
            contents,
            linkItems,
            contentItems,
            currentLink
        });
    };
})();

const contentContainer = document.getElementById('content');

const headerSection = createElementsFromHtml(headerSectionHtml)[0];
const mainSection = createElementsFromHtml(mainSectionHtml)[0];
const footerSection = createElementsFromHtml(footerSectionHtml)[0];

const tabs = {
    home: createElementsFromHtml(homeTabHtml)[0],
    menu: createElementsFromHtml(menuTabHtml)[0],
    about: createElementsFromHtml(aboutTabHtml)[0]
};

contentContainer.appendChild(headerSection);
contentContainer.appendChild(mainSection);
contentContainer.appendChild(footerSection);

// 

const tabContainer = document.getElementsByClassName('tab-container')[0];

for (const key in tabs) {
    tabs[key].addEventListener('click', onTabClick);
    tabContainer.appendChild(tabs[key]);
    showTab(tabs[key], false);
}

const initiallyShownTab = document.getElementsByClassName('initially-shown')[0];
let currentTab = initiallyShownTab;

showTab(initiallyShownTab, true);

// 

function showTab(tab, flag = true) {
    for (const child of tab.children)
        child.style.display = flag? 'block' : 'none';
}

function createElementsFromHtml(html) {
    const container = document.createElement('div');
    container.innerHTML = html;
    return container.children;
}

function onTabClick(e) {
    showTab(currentTab, false);
    showTab(this, true);

    currentTab = this;
}