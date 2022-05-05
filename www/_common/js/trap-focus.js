const focusableQuery = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex], [contenteditable]';
const potentiallyFocusableQuery = 'a[href], area[href], input, select, textarea, button, iframe, object, embed, [tabindex], [contenteditable]';


function loopThroughAllNodes(selector, callback = node => {}, rootElement = document.documentElement, { deep = true } = {}) {
  let currentNode;
  const ni = document.createNodeIterator(rootElement, NodeFilter.SHOW_ELEMENT);

  while(currentNode = ni.nextNode()) {
    if (currentNode.matches(selector))  callback(currentNode);
    if (deep && currentNode.shadowRoot) loopThroughAllNodes(selector, callback, currentNode.shadowRoot, { deep });
  }
}

const releaseNode = node => {
  node.removeAttribute('data-trapped');
  node.tabIndex = node.dataset.previousTabindex;
  node.removeAttribute('data-previous-tabindex');
};

const trapNode = node => {
  node.dataset.trapped = 'true';
  node.dataset.previousTabindex = node.tabIndex;
  node.tabIndex = -1;
};


export function disableFocusOutside(container, { exceptions = [] } = {}) {
  const disableFocusabilityOutside = node => {
    if (exceptions.includes(node)) return;

    let element = node;
    while (element.getRootNode() !== document) element = element.getRootNode().host;

    if (!container.contains(element)) trapNode(node);
  };

  loopThroughAllNodes(potentiallyFocusableQuery, disableFocusabilityOutside);
}


export function disableFocusInside(container, { exceptions = [] } = {}) {
  const disableFocusabilityInside = node => {
    if (exceptions.includes(node)) return;

    let element = node;
    while (element.getRootNode() !== document) element = element.getRootNode().host;
    
    if (container.contains(element)) trapNode(node);
  };

  loopThroughAllNodes(potentiallyFocusableQuery, disableFocusabilityInside);
}


export function enableFocusOutside(container, { exceptions = [] } = {}) {
  const enableFocusabilityOutside = node => {
    if (exceptions.includes(node)) return;

    let element = node;
    while (element.getRootNode() !== document) element = element.getRootNode().host;

    if (!container.contains(element)) releaseNode(node);
  };

  loopThroughAllNodes(potentiallyFocusableQuery, enableFocusabilityOutside);
}


export function enableFocusInside(container, { exceptions = [] } = {}) {
  const enableFocusabilityInside = node => {
    if (exceptions.includes(node)) return;

    let element = node;
    while (element.getRootNode() !== document) element = element.getRootNode().host;

    if (container.contains(element)) releaseNode(node);
  };

  loopThroughAllNodes(potentiallyFocusableQuery, enableFocusabilityInside);
}


export function trapFocusIn(container, { exceptions = [] } = {}) {
  const trapFocusability = node => {
    if (exceptions.includes(node)) return;

    let element = node;
    while (element.getRootNode() !== document) element = element.getRootNode().host;
    
    if (container.contains(element)) {
      if (node.matches('[data-trapped]')) releaseNode(node);
    } else {
      trapNode(node);
    }
  };

  loopThroughAllNodes(potentiallyFocusableQuery, trapFocusability);
}


export function releaseFocusFrom(container, { exceptions = [] } = {}) {
  const releaseFocusability = node => {
    if (exceptions.includes(node)) return;
    
    let element = node;
    while (element.getRootNode() !== document) element = element.getRootNode().host;
    
    if (container.contains(element)) {
      trapNode(node);
    } else {
      if (node.matches('[data-trapped]')) releaseNode(node);
    }
  };

  loopThroughAllNodes(potentiallyFocusableQuery, releaseFocusability);
}