const focusableQuery = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex], [contenteditable]'; // focusable right now
const potentiallyFocusableQuery = 'a[href], area[href], input, select, textarea, button, iframe, object, embed, [tabindex], [contenteditable]'; // focusable (may be disabled)


/** Applies a callback to every node in rootElement matching a selector. Can deep search through shadow DOMs. */
function loopThroughAllNodes(selector, callback = node => {}, rootElement = document.documentElement, { deep = true } = {}) {
  let currentNode;
  const ni = document.createNodeIterator(rootElement, NodeFilter.SHOW_ELEMENT);

  while(currentNode = ni.nextNode()) {
    if (currentNode.matches(selector))  callback(currentNode);
    if (deep && currentNode.shadowRoot) loopThroughAllNodes(selector, callback, currentNode.shadowRoot, { deep });
  }
}

/** Re-enables a node to be focused. */
const releaseNode = node => {
  node.removeAttribute('data-trapped');
  node.tabIndex = node.dataset.previousTabindex;
  node.removeAttribute('data-previous-tabindex');
};

/** Prevents a node from being focused. */
const trapNode = node => {
  node.dataset.trapped = 'true';
  node.dataset.previousTabindex = node.tabIndex;
  node.tabIndex = -1;
};


/** Disables focus for all nodes outside of a container. */
export function disableFocusOutside(container, { exceptions = [] } = {}) {
  const disableFocusabilityOutside = node => {
    if (exceptions.includes(node)) return;

    let element = node;
    while (element.getRootNode() !== document) element = element.getRootNode().host;

    if (!container.contains(element)) trapNode(node);
  };

  loopThroughAllNodes(potentiallyFocusableQuery, disableFocusabilityOutside);
}


/** Disables focus for all nodes inside a container. */
export function disableFocusInside(container, { exceptions = [] } = {}) {
  const disableFocusabilityInside = node => {
    if (exceptions.includes(node)) return;

    let element = node;
    while (element.getRootNode() !== document) element = element.getRootNode().host;
    
    if (container.contains(element)) trapNode(node);
  };

  loopThroughAllNodes(potentiallyFocusableQuery, disableFocusabilityInside);
}


/** Re-enables focus for all nodes outside of a container. */
export function enableFocusOutside(container, { exceptions = [] } = {}) {
  const enableFocusabilityOutside = node => {
    if (exceptions.includes(node)) return;

    let element = node;
    while (element.getRootNode() !== document) element = element.getRootNode().host;

    if (!container.contains(element)) releaseNode(node);
  };

  loopThroughAllNodes(potentiallyFocusableQuery, enableFocusabilityOutside);
}


/** Re-enables focus for all nodes inside a container. */
export function enableFocusInside(container, { exceptions = [] } = {}) {
  const enableFocusabilityInside = node => {
    if (exceptions.includes(node)) return;

    let element = node;
    while (element.getRootNode() !== document) element = element.getRootNode().host;

    if (container.contains(element)) releaseNode(node);
  };

  loopThroughAllNodes(potentiallyFocusableQuery, enableFocusabilityInside);
}


/** Traps focus inside a container: disables it outside, enables it inside. */
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


/** Re-enables focus outside of a container, disables it inside. */
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