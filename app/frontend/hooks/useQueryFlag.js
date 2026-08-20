import { useEffect, useState } from "react";

// Reactive reader for boolean query string flags (?dev=true, ?present=true).
//
// `history.pushState` / `history.replaceState` don't emit any event, so we patch
// them once (module level, never restored) and fan out to every subscriber. This
// keeps components in sync when another component rewrites the URL — e.g.
// PresentationMode toggling `?present=true` while Navigation is mounted.

const listeners = new Set();
let patched = false;

const notify = () => listeners.forEach((listener) => listener());

const patchHistory = () => {
  if (patched) return;
  patched = true;

  const { pushState, replaceState } = history;

  history.pushState = function (...args) {
    pushState.apply(this, args);
    notify();
  };

  history.replaceState = function (...args) {
    replaceState.apply(this, args);
    notify();
  };

  window.addEventListener("popstate", notify);
};

const readFlag = (name) =>
  new URLSearchParams(window.location.search).get(name) === "true";

export default function useQueryFlag(name) {
  const [value, setValue] = useState(() => readFlag(name));

  useEffect(() => {
    patchHistory();

    const listener = () => setValue(readFlag(name));
    listeners.add(listener);
    listener();

    return () => listeners.delete(listener);
  }, [name]);

  return value;
}

export { readFlag };
