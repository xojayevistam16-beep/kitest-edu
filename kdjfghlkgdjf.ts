/**
 * antiInspect.ts
 * "Inspect qiganda kodlar ko'rinmasin" himoya tizimi
 * Disables contextmenu, developer shortcut keys, and clears console.
 */

export function setupAntiInspectShield() {
  if (typeof window === 'undefined') return;

  // 1. Right Click / Context Menu cheklovi
  window.addEventListener(
    'contextmenu',
    (e) => {
      e.preventDefault();
      return false;
    },
    { capture: true }
  );

  // 2. DevTools klaviatura kombinatsiyalari (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U, Ctrl+S)
  window.addEventListener(
    'keydown',
    (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl + Shift + I/J/C or Cmd + Option + I/J/C
      if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
        const k = e.key.toLowerCase();
        if (k === 'i' || k === 'j' || k === 'c' || e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }

      // Ctrl + U or Cmd + U (View Source)
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'u' || e.keyCode === 85)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl + S (Save Page)
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 's' || e.keyCode === 83)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    },
    { capture: true }
  );

  // 3. Console output tozalash va yashirish
  try {
    const noop = () => {};
    // Keep warn & error minimal or silenced
    console.log = noop;
    console.info = noop;
    console.debug = noop;
  } catch {
    // ignore
  }
}
