// Lightweight, dependency-free internationalization helper.
//
// The locale is resolved once from the browser's language preferences:
// French browsers get French, everyone else falls back to English. All
// user-facing strings in the React frontend go through `t()`.

import { en } from "~/i18n/locales/en";
import { fr } from "~/i18n/locales/fr";

const translations = { en, fr };
const DEFAULT_LOCALE = "en";

function detectLocale() {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE;

  // Allow forcing a locale via ?lang=fr / ?lang=en for testing & kiosks.
  try {
    const forced = new URLSearchParams(window.location.search).get("lang");
    if (forced && translations[forced.toLowerCase().slice(0, 2)]) {
      return forced.toLowerCase().slice(0, 2);
    }
  } catch {
    // window may be unavailable; ignore and fall back to navigator.
  }

  const preferred =
    navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || navigator.userLanguage || DEFAULT_LOCALE];

  for (const lang of preferred) {
    const code = String(lang).toLowerCase().slice(0, 2);
    if (translations[code]) return code;
  }

  return DEFAULT_LOCALE;
}

export const locale = detectLocale();

if (typeof document !== "undefined") {
  document.documentElement.lang = locale;
}

// Resolve a dotted key (e.g. "video.delete") against the active locale,
// falling back to English, then to the raw key if nothing is found.
function resolve(dict, key) {
  return key.split(".").reduce((acc, part) => {
    if (acc && typeof acc === "object" && part in acc) return acc[part];
    return undefined;
  }, dict);
}

export function t(key, vars) {
  const active = translations[locale] || translations[DEFAULT_LOCALE];
  let value = resolve(active, key);
  if (value === undefined) value = resolve(translations[DEFAULT_LOCALE], key);
  if (value === undefined) return key;

  if (vars) {
    return Object.entries(vars).reduce(
      (str, [name, replacement]) =>
        str.replaceAll(`{${name}}`, String(replacement)),
      value
    );
  }

  return value;
}
