1. Importer le composant theme-selector dans le script :
```javascript
import '/_common/components/theme-selector/theme-selector.js.php';
```

2. Placer le composant dans le HTML :
```html
<theme-selector position="top/bottom/left/right" icon="reverse?" default="dark?"></theme-selector>
```

3. Créer un cookie pour se souvenir du thème choisi en réponse à l'event `themechange`, et placer ce cookie en argument de `<html>` :
```html
<html data-theme="<?=$_COOKIE['theme']?>">
```

4. Préparer le CSS comme ceci :
```css
/*<?php ob_start();?>*/
:root[data-theme="light"] selecteur? {
  color-scheme: light;
  /* CSS du thème clair */
}

:root[data-theme="dark"] selecteur? {
  color-scheme: dark;
  /* CSS du thème sombre */
}
/*<?php $body = ob_get_clean();
require_once $_SERVER['DOCUMENT_ROOT'] . '/_common/components/theme-selector/build-css.php';
echo buildThemesStylesheet($body); ?>*/
```

5. Personnaliser l'apparence du sélecteur dans le CSS de la page.