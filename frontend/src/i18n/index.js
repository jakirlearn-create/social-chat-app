import MESSAGES from './messages';
import safeLocalStorage from '../utils/safeStorage';

const LANG_KEY = 'appLang';

export function getLanguage() {
  return safeLocalStorage.getItem(LANG_KEY) || 'en';
}

export function setLanguage(lang) {
  safeLocalStorage.setItem(LANG_KEY, lang);
}

export function t(key) {
  const lang = getLanguage();
  return (MESSAGES[lang] && MESSAGES[lang][key]) || (MESSAGES['en'] && MESSAGES['en'][key]) || key;
}

const i18n = { getLanguage, setLanguage, t }; export default i18n;;

