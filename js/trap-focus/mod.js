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
  if (node.dataset.trapped === 'true') {
    node.removeAttribute('data-trapped');
    node.tabIndex = node.dataset.previousTabindex;
    node.removeAttribute('data-previous-tabindex');
  }
};

/** Prevents a node from being focused. */
const trapNode = node => {
  if (node.dataset.trapped !== 'true') {
    node.dataset.trapped = 'true';
    node.dataset.previousTabindex = node.tabIndex;
    node.tabIndex = -1;
  }
};


/** General function used by other focus-affecting functions. */
function changeFocusability(container, callbackInside = () => {}, callbackOutside = () => {}, { exceptions = [] }) {
  const callbackOnAllNodes = node => {
    if (exceptions.includes(node)) return;

    let element = node;
    while (element.getRootNode() !== document) element = element.getRootNode().host;

    if (container.contains(element)) callbackInside(node);
    else                             callbackOutside(node);
  };

  loopThroughAllNodes(potentiallyFocusableQuery, callbackOnAllNodes);
}


/** Disables focus for all nodes outside of a container. */
export function disableFocusOutside(container, options = {}) {
  return changeFocusability(container, undefined, trapNode, options);
}


/** Disables focus for all nodes inside a container. */
export function disableFocusInside(container, options = {}) {
  return changeFocusability(container, trapNode, undefined, options);
}


/** Re-enables focus for all nodes outside of a container. */
export function enableFocusOutside(container, options = {}) {
  return changeFocusability(container, undefined, releaseNode, options);
}


/** Re-enables focus for all nodes inside a container. */
export function enableFocusInside(container, options = {}) {
  return changeFocusability(container, releaseNode, undefined, options);
}


/** Traps focus inside a container: disables it outside, enables it inside. */
export function trapFocusIn(container, options = {}) {
  return changeFocusability(container, releaseNode, trapNode, options);
}


/** Re-enables focus outside of a container, disables it inside. */
export function releaseFocusFrom(container, options = {}) {
  return changeFocusability(container, trapNode, releaseNode, options);
}