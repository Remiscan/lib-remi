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

**************************************/



import 'custom-elements-polyfill';



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

      --on-bg-color: hsl(231, 40%, 50%);
      --hover-bg-color: hsl(231, 40%, 50%, .3);
      --active-bg-color: hsl(231, 40%, 50%, .4);
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
        --on-bg-color: hsl(217, 89%, 75%);
        --hover-bg-color: hsl(217, 89%, 75%, .3);
        --active-bg-color: hsl(217, 89%, 75%, .4);
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

    this.clickHandler = clickEvent => {
      const clickedTab = clickEvent.currentTarget;
      this.selectTab(clickedTab);
    };

    // Handles focus events
    this.focusHandler = focusEvent => {
      const tabs = this.allTabs;
      const selectedTab = focusEvent.currentTarget;
      const selectedIndex = tabs.findIndex(t => t === selectedTab);
      const maxIndex = tabs.length;

      const orientation = this.getAttribute('aria-orientation') === 'vertical' ? 'vertical' : 'horizontal';

      const keydownHandler = keydownEvent => {
        let supportedKey = true;
        let requestedIndex = null;

        switch (keydownEvent.code) {
          case 'ArrowLeft': {
            if (orientation === 'vertical') supportedKey = false;
            else {
              requestedIndex = selectedIndex - 1;
            }
          } break;

          case 'ArrowRight': {
            if (orientation === 'vertical') supportedKey = false;
            else {
              requestedIndex = selectedIndex + 1;
            }
          } break;

          case 'ArrowUp': {
            if (orientation === 'horizontal') supportedKey = false;
            else {
              requestedIndex = selectedIndex - 1;
            }
          } break;

          case 'ArrowDown': {
            if (orientation === 'horizontal') supportedKey = false;
            else {
              requestedIndex = selectedIndex + 1;
            }
          } break;

          case 'Home': {
            requestedIndex = 0;
          } break;

          case 'End': {
            requestedIndex = -1;
          } break;

          default: {
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


  get allTabs() {
    return [...this.querySelectorAll(`[role="tab"]`)];
  }


  getControlledElement(tab) {
    return document.getElementById(tab.getAttribute('aria-controls'));
  }


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


  attributeChangedCallback(attr, oldValue, newValue) {
    if (oldValue == newValue) return;
  }


  static get observedAttributes() {
    return [];
  }
}

if (!customElements.get('tab-list')) customElements.define('tab-list', TabList, { extends: 'div' });