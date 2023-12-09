
/** Calculates which theme 'auto' corresponds to. */
export function getOsTheme() {
  let osTheme;
  if (window.matchMedia('(prefers-color-scheme: dark)').matches)        osTheme = 'dark';
  else if (window.matchMedia('(prefers-color-scheme: light)').matches)  osTheme = 'light';
  return osTheme;
}