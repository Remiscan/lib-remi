const supportedThemes = ['light', 'dark']; // 'auto' is supported and resolves to one of these
let defaultTheme = 'light'; // if 'auto' doesn't resolve to anything, this will be used instead
let currentTheme = 'auto';



const Theme = {
  ////////////////////////////
  // Updates the default theme
  setDefault: (requestedTheme) => {
    if (supportedThemes.includes(requestedTheme)) defaultTheme = requestedTheme;
    else throw `'${requestedTheme}' is not a supported theme and can't be set as default`;
  },


  /////////////////////////////////////////////////
  // Sends an event to the page to change the theme
  set: (requestedTheme = 'auto') => {
    if (!['auto', ...supportedThemes].includes(requestedTheme))
      throw `'${requestedTheme}' is not a supported theme and can't be applied`;

    currentTheme = requestedTheme;
    window.dispatchEvent(
      new CustomEvent('themechange', {
        detail: { 
          theme: requestedTheme,
          resolvedTheme: Theme.resolve(requestedTheme)
        }
      })
    );
  },


  ////////////////////////////
  // Returns the current theme
  get: () => currentTheme,


  ////////////////////////////////////////////////////////////////////////////////////
  // Determines which theme will be applied, by translating 'auto' to its actual value
  resolve: (theme) => {
    return (theme == 'auto') ? Theme.osTheme() : (supportedThemes.includes(theme)) ? theme : defaultTheme;
  },


  /////////////////////////////////////////////////////////////////////////////////
  // Determines if the applied theme corresponds to the OS theme or if it's another
  unresolve: (theme) => {
    return (theme == Theme.osTheme()) ? 'auto' : (supportedThemes.includes(theme)) ? theme : 'auto';
  },


  /////////////////////////////////////////////////////
  // Determines the preferred theme according to the OS
  osTheme: () => {
    let osTheme;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches)        osTheme = 'dark';
    else if (window.matchMedia('(prefers-color-scheme: light)').matches)  osTheme = 'light';
    return osTheme;
  }
}

export default Theme;