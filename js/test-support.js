// Test functions

var TestSupport = {};

TestSupport.supportsCSS = function() {
  return 'CSS' in window;
}

TestSupport.clipPath = function() {
  return (TestSupport.supportsCSS() && CSS.supports('clip-path', 'circle(50% at 0 0)'));
}

TestSupport.customProperties = function() {
  return (TestSupport.supportsCSS() && CSS.supports('--test', '0'));
}

TestSupport.localStorage = function() {
  var test = 'test';
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch(e) {
    return false;
  }
}

TestSupport.serviceWorker = function() {
  return (typeof navigator.serviceWorker !== 'undefined');
}

TestSupport.webAnimations = function() {
  return 'animate' in document.body;
}

TestSupport.const = function() {
  try {
    const test = 'test';
    let test2 = 'test';
    return true;
  } catch(e) {
    return false;
  }
}

TestSupport.class = function() {
  try {
    eval('"use strict"; class Test {}');
    return true;
  } catch (e) {
    return false;
  }
}

TestSupport.templateLiterals = function() {
  try {
    eval('`foo`');
    return true;
  } catch(e) {
    return false;
  }
}

TestSupport.module = function() {
  var script = document.createElement('script');
  return 'noModule' in script;
}

TestSupport.template = function() {
  return 'content' in document.createElement('template');
}

TestSupport.shadowDom = function() {
  return Boolean(document.body.createShadowRoot || document.body.attachShadow);
}

TestSupport.autonomousCustomElement = function() {
  return 'customElements' in window;
}

TestSupport.preload = function() {
  let support;
  try {
    support = document.createElement('link').relList.supports('preload');
  } catch(e) {
    support = false;
  }
  return support;
}

TestSupport.fail = function() {
  return false;
}



// Test object prototype

function Test(name, test, polyfill) {
  this.name = name;
  this.test = test();
  this.polyfill = polyfill;
}



// Tests list

TestSupport.tests = [
  new Test('CSS clip-path', TestSupport.clipPath, 0),
  new Test('CSS custom properties', TestSupport.customProperties, 0),
  new Test('localStorage', TestSupport.localStorage, 0),
  new Test('service workers', TestSupport.serviceWorker, 0),
  new Test('web animations', TestSupport.webAnimations, '/_common/polyfills/web-animations.min.js'),
  new Test('ES const & let', TestSupport.const, 0),
  new Test('ES class', TestSupport.class, 0),
  new Test('ES template literals', TestSupport.templateLiterals, 0),
  new Test('ES modules', TestSupport.module, 0),
  new Test('HTML template', TestSupport.template, 0),
  new Test('shadow DOM', TestSupport.shadowDom, 0),
  new Test('autonomous custom elements', TestSupport.autonomousCustomElement, 0),
  new Test('link preload', TestSupport.preload, 0),
  new Test('fail', TestSupport.fail, 0)
];



// For a given list of tests, return the results

TestSupport.getSupportResults = function(testsToPerform) {
  var results = '';
  var otherResults = '';
  var failedTests = 0;
  var scriptBefore = document.getElementById('test-support-script-exe');

  testsToPerform.forEach(function(unTest) {
    var testName = unTest.name;
    var priority = unTest.priority;
    var findTest = TestSupport.tests.filter(function(el) { return el.name == testName; });
    if (findTest.length < 1) return;
    var test = findTest[0];
    if (!test.test && priority && !test.polyfill)
    {
      results += '<li>' + (test.test ? '✅' : (priority ? '❌' : '⚠')) + ' ' + test.name + '</li>';
      failedTests++;
    }
    else
    {
      otherResults += '<li>' + (test.test ? '✅' : (priority ? '❌' : '⚠')) + ' ' + test.name + '</li>';
    }

    if (!test.test && test.polyfill) {
      var script = document.createElement('script');
      script.src = test.polyfill;
      document.body.insertBefore(script, scriptBefore.nextSibling);
    }
  });

  if (failedTests) {
    try {
      document.getElementById('test-support-warning-style').remove();
      document.getElementById('test-support-warning').remove();
    } catch(e) {}

    var warning = document.createElement('div');
    warning.id = 'test-support-warning';

    warning.innerHTML += '<p>Certaines technologies indispensables au fonctionnement de cette page sont indisponibles dans votre navigateur web. Je m\'excuse pour ce désagrément. Voici la liste des technologies en question :</p>';
    warning.innerHTML += '<ul style="list-style-type: none;">' + results + '</ul>';
    warning.innerHTML += '<hr>';
    warning.innerHTML += '<p>Some technologies required to display this page are unavailable in your web browser. I am sorry for this inconvenience. Here is the list of said technologies:</p>';
    warning.innerHTML += '<ul style="list-style-type: none;">' + results + '</ul>';
    
    var style = document.createElement('style');
    style.id = 'test-support-warning-style';
    style.innerHTML = '#test-support-warning { display: block; position: absolute; z-index: 9999; width: 100%; height: 100%; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #DCDCDC; color: #121212; padding: 20px; box-sizing: border-box; } @media (prefers-color-scheme: dark) { #test-support-warning { background: #121212; color: #DCDCDC; }} p,ul { max-width: 700px; }';

    document.getElementsByTagName("head")[0].appendChild(style);
    document.body.appendChild(warning);
  } else {
    try {
      document.getElementById('test-support-script').remove();
      document.getElementById('test-support-script-exe').remove();
    } catch(e) {}
  }
}