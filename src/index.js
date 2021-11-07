import headerSectionHtml from './headersection.html';
import mainSectionHtml from './mainsection.html';
import footerSectionHtml from './footersection.html';
import homeTabHtml from './hometab.html';
import menuTabHtml from './menutab.html';
import aboutTabHtml from './abouttab.html';
import {TabbedWindowElement} from './components/tabbed_window/tabbed_window.js';
import './styles.css';

// 

const contentContainer = document.getElementById('content');

const headerSection = parseHtml(headerSectionHtml)[0];
const mainSection = parseHtml(mainSectionHtml)[0];
const footerSection = parseHtml(footerSectionHtml)[0];

const tabbedWindow = TabbedWindowElement();

const homeTab = tabbedWindow.addNewTab(null, 'Home');
const menuTab = tabbedWindow.addNewTab(null, 'Menus');
const aboutTab = tabbedWindow.addNewTab(null, 'Openings');

homeTab.content.appendChild(parseHtml(homeTabHtml)[0]);
menuTab.content.appendChild(parseHtml(menuTabHtml)[0]);
aboutTab.content.appendChild(parseHtml(aboutTabHtml)[0]);

tabbedWindow.showTabByIndex(0);

mainSection.appendChild(tabbedWindow.element);

contentContainer.appendChild(headerSection);
contentContainer.appendChild(mainSection);
contentContainer.appendChild(footerSection);

// 

function parseHtml(html) {
    const container = document.createElement('div');
    container.innerHTML = html;
    return container.children;
}