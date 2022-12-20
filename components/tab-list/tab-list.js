/**************************************
***** EXAMPLE OF USE ******************
***************************************

<div is="tab-list">
  <button role="tab" aria-controls="controlled-element-1-id">Tab 1 name</button>
  <button role="tab" aria-controls="controlled-element-2-id">Tab 2 name</button>
  <button role="tab" aria-controls="controlled-element-3-id">Tab 3 name</button>
</div>

<div id="controlled-element-1-id" hidden></div>
<div id="controlled-element-2-id" hidden></div>
<div id="controlled-element-3-id" hidden></div>

***

Add the aria-selected="true" attribute on a button to make it selected by default.

**************************************/



import 'custom-elements-polyfill'; // to support the "is" HTML attribute



const sheet = new CSSStyleSheet();
sheet.replaceSync(/*css*/`
  @layer tab-list {

    [role="tablist"] {
      display: flex;
      margin: 0;
      border: none;
      gap: 10px;
      margin: 0 0 10px 0;
      padding: 0 10px;
      box-shadow: inset 0 -1px 0 var(--on-bg-color);

      --on-bg-color: #0075FF;
      --hover-bg-color: #0075FF33;
      --active-bg-color: #0075FF1a;
      --off-text-color: black;
      --on-text-color: white;
    }

    [role="tablist"][aria-orientation="vertical"] {
      flex-direction: column;
      width: fit-content;
      margin: 0 10px 0 0;
      padding: 10px 0;
      box-shadow: inset -1px 0 0 var(--on-bg-color);
      float: left;
    }

    @media (prefers-color-scheme: dark) {
      [role="tablist"] {
        --on-bg-color: #99C8FF;
        --hover-bg-color: #99C8FF4d;
        --active-bg-color: #99C8FF33;
        --off-text-color: white;
        --on-text-color: rgb(48, 48, 48);
      }
    }

    [role="tab"] {
      -webkit-appearance: none;
      appearance: none;
      background: none;
      border: none;
      font: inherit;
      margin: 0;

      padding: 5px 10px;
      border: 1px solid var(--on-bg-color);
      color: var(--off-text-color);
      border-radius: 5px 5px 0 0;
      outline-offset: 3px;
    }

    [role="tablist"][aria-orientation="vertical"] > [role="tab"] {
      border-radius: 5px 0 0 5px;
    }

    [role="tab"]:hover {
      background: var(--hover-bg-color)
    }

    [role="tab"]:active {
      background: var(--active-bg-color)
    }

    [role="tab"][aria-selected="true"] {
      background: var(--on-bg-color);
      color: var(--on-text-color);
      font-weight: 600;
    }

    [hidden] {
      display: none !important;
    }

  }
`);



let tablistsNumber = 0;



class TabList extends HTMLDivElement {
  constructor() {
    super();
    this.ready = false;
    this.initialized = false;
    this.selectedTab = null;
    this.tablistIndex = tablistsNumber;
    tablistsNumber++;

    // Handles clicks on tab buttons
    this.clickHandler = clickEvent => {
      const clickedTab = clickEvent.currentTarget;
      this.selectTab(clickedTab);
    };

    // Handles focus on tab buttons
    this.focusHandler = focusEvent => {
      const tabs = this.allTabs;
      const selectedTab = focusEvent.currentTarget;
      const selectedIndex = tabs.findIndex(t => t === selectedTab);
      const maxIndex = tabs.length;

      const orientation = this.getAttribute('aria-orientation') === 'vertical' ? 'vertical' : 'horizontal';

      // Handles keyboard events while a tab button is focused
      const keydownHandler = keydownEvent => {
        let supportedKey = true;
        let requestedIndex = null;

        switch (keydownEvent.code) {
          case 'ArrowLeft': {
            // Ignore horizontal arrows when the tab list is vertically oriented
            if (orientation === 'vertical') supportedKey = false;
            else {
              requestedIndex = selectedIndex - 1; // select previous tab
            }
          } break;

          case 'ArrowRight': {
            // Ignore horizontal arrows when the tab list is vertically oriented
            if (orientation === 'vertical') supportedKey = false;
            else {
              requestedIndex = selectedIndex + 1; // select next tab
            }
          } break;

          case 'ArrowUp': {
            // Ignore vertical arrows when the tab list is horizontally oriented
            if (orientation === 'horizontal') supportedKey = false;
            else {
              requestedIndex = selectedIndex - 1; // select previous tab
            }
          } break;

          case 'ArrowDown': {
            // Ignore vertical arrows when the tab list is horizontally oriented
            if (orientation === 'horizontal') supportedKey = false;
            else {
              requestedIndex = selectedIndex + 1; // select next tab
            }
          } break;

          case 'Home': {
            requestedIndex = 0; // select first tab
          } break;

          case 'End': {
            requestedIndex = -1; // select last tab
          } break;

          default: {
            // Ignore other key presses
            supportedKey = false;
          }
        }

        if (supportedKey) {
          const requestedTab = tabs?.at(requestedIndex % maxIndex);
          this.selectTab(requestedTab);

          keydownEvent.preventDefault();
          keydownEvent.stopPropagation();
        }
      };

      const blurHandler = blurEvent => {
        selectedTab.removeEventListener('keydown', keydownHandler);
        selectedTab.removeEventListener('blur', blurHandler);
      };

      selectedTab.addEventListener('keydown', keydownHandler);
      selectedTab.addEventListener('blur', blurHandler);
    };
  }


  /**
   * Selects a tab.
   * @param {HTMLElement} requestedTab - The requested tab.
   * @param {boolean} focus - Whether to move focus to the requested tab after selecting it.
   */
  selectTab(requestedTab = this.querySelector('[role="tab"][aria-selected="true"]') ?? this.allTabs[0], focus = true) {
    if (this.selectedTab === requestedTab) return;

    const tabs = this.allTabs;
    for (const tab of tabs) {
      const controlledElement = this.getControlledElement(tab);
      if (requestedTab === tab) {
        controlledElement.removeAttribute('hidden');
        controlledElement.setAttribute('tabindex', '0');
        tab.setAttribute('aria-selected', 'true');
        tab.setAttribute('tabindex', '0');
        if (focus) tab.focus();
        this.selectedTab = tab;
        window.dispatchEvent(new CustomEvent('tabchange', { detail: { tablist: this, selected: tab } }));
      } else {
        controlledElement.setAttribute('hidden', 'hidden');
        controlledElement.setAttribute('tabindex', '-1');
        tab.setAttribute('aria-selected', 'false');
        tab.setAttribute('tabindex', '-1');
      }
    }
  }


  /** Returns all tabs in the tab list. */
  get allTabs() {
    return [...this.querySelectorAll(`[role="tab"]`)];
  }


  /**
   * Returns the element controlled by a tab.
   * @param {HTMLElement} tab - The tab controlling the element.
   * @returns {HTMLElement}
   */
  getControlledElement(tab) {
    return document.getElementById(tab.getAttribute('aria-controls'));
  }


  /** Prepares the tab list and its tabs by placing the proper attributes on them. */
  initializeTabs() {
    if (this.initialized) return;

    const tabs = this.allTabs;
    const orientation = this.getAttribute('aria-orientation') === 'vertical' ? 'vertical' : 'horizontal';

    this.setAttribute('role', 'tablist');
    this.setAttribute('aria-orientation', orientation);

    tabs.forEach((tab, k) => {
      const controlledElement = this.getControlledElement(tab);
      const id = tab.getAttribute('id') ?? `tablist-${this.tablistIndex}-tab-${k}`;
      const selected = tab.getAttribute('aria-selected') === 'true';

      // Pass the correct attributes to the tab button
      tab.setAttribute('type', 'button');
      tab.setAttribute('id', id);
      tab.setAttribute('aria-selected', selected ? 'true' : 'false');
      tab.setAttribute('tabindex', '-1');

      // Pass the correct attributes to the controlled element
      controlledElement.setAttribute('role', 'tabpanel');
      controlledElement.setAttribute('aria-labelledby', id);
      controlledElement.setAttribute('tabindex', '-1');
      controlledElement.setAttribute('hidden', '');
    });

    this.initialized = true;
  }


  connectedCallback() {
    // Add HTML and CSS to the element
    if (!document.adoptedStyleSheets.includes(sheet))
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];

    this.initializeTabs();

    const tabs = this.allTabs;
    tabs.forEach(tab => {
      tab.addEventListener('click', this.clickHandler);
      tab.addEventListener('focus', this.focusHandler);
    });

    this.selectTab(undefined, false);
  }


  disconnectedCallback() {
    const tabs = this.allTabs;
    tabs.forEach(tab => {
      tab.removeEventListener('click', this.clickHandler);
      tab.removeEventListener('focus', this.focusHandler);
    });
  }
}

if (!customElements.get('tab-list')) customElements.define('tab-list', TabList, { extends: 'div' });