let langage;
const Textes = {};
let _projet;

//////////////////////////////////////////////////////////////////////
// Peuple l'objet Textes pour pouvoir appeler getString quand on veut,
// et place le texte français ou anglais aux bons endroits :
// - en innerHTML des éléments ayant data-string="id" 
// - en aria-label des éléments ayant data-label="id"
function traduire(projet)
{
  _projet = projet;

  const localLang = localStorage.getItem(`${projet}/langage`);
  const httpLang = document.documentElement.dataset.httpLang;
  const navLang = navigator.language;
  let start = 0;
  if (localLang != null)
    langage = (localLang == 'fr') ? 'fr' : 'en';
  else if (httpLang)
    langage = (httpLang == 'fr') ? 'fr' : 'en';
  else if (navLang != null)
    langage = navLang.includes('fr') ? 'fr' : 'en';
  else
    langage = 'fr';

  document.documentElement.lang = langage;

  Array.from(document.querySelectorAll('[data-lang]')).forEach(bouton => {
    if (bouton.dataset.lang == langage)
    {
      bouton.disabled = true;
      bouton.tabIndex = -1;
    }
    else
    {
      bouton.disabled = false;
      bouton.tabIndex = 0;
    }
  });

  const version = document.querySelector('link#strings').dataset.version || document.documentElement.dataset.version;

  return new Promise((resolve, reject) => {
    if (Object.keys(Textes).length === 0 && Textes.constructor === Object)
    {
      start = 1;

      fetch(`/${projet}/strings--${version}.json`)
      .then(response => {
        if (response.status == 200)
          return response;
        else
          throw '[:(] Erreur ' + response.status + ' lors de la requête';
      })
      .then(response => response.json())
      .then(response => {
        Textes.fr = response.fr;
        Textes.en = response.en;
        Object.freeze(Textes);
        Object.freeze(Textes.fr);
        Object.freeze(Textes.en);
        return resolve();
      })
      .catch(error => reject(error));
    }
    else resolve();
  })
  .then(() => {
    if (start && langage == httpLang) return;
    
    Array.from(document.querySelectorAll('[data-string]')).forEach(e => {
      e.innerHTML = getString(e.dataset.string);
    });

    Array.from(document.querySelectorAll('[data-label]')).forEach(e => {
      e.setAttribute('aria-label', getString(e.dataset.label));
    });

    return;
  })
  .catch(error => console.error(error));
}


///////////////////////////////////////////////////////////////////////////
// Récupère un string dans la langue choisie, et en français si non-traduit
function getString(id, lang = langage)
{
  return Textes[lang][id] || Textes['fr'][id] || 'undefined string';
}


//////////////////////////////////
// Change la langue entre FR et EN
function switchLangage(lang = false)
{
  if (!lang)
    langage = (langage == 'fr') ? 'en' : 'fr';
  else if (['fr', 'en'].includes(lang))
    langage = lang;
  localStorage.setItem(`${_projet}/langage`, langage);
  return Promise.resolve();
}


/////////////////////////////
// Récupère le langage actuel
function getLangage()
{
  return langage;
}

export { traduire, getString, switchLangage, getLangage };