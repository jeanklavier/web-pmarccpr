/* ============ Light/dark theme switch ============ */
/* Same pattern used across JCTech sites: data-theme attribute on <html>,
   persisted in localStorage, respects prefers-color-scheme on first visit. */
(function () {
  const STORAGE_KEY = 'pmarcc-theme';
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  const sunIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
  const moonIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
  const thumb = btn.querySelector('.tt-thumb');

  function paint(theme) {
    const isDark = theme === 'dark';
    thumb.innerHTML = isDark ? moonIcon : sunIcon;
    btn.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    btn.setAttribute('aria-pressed', String(isDark));
  }

  paint(root.getAttribute('data-theme') || 'light');

  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
    paint(next);
    // Deja que las gráficas de Chart.js (script.js / energia.js) se recoloreen.
    window.dispatchEvent(new CustomEvent('pmarcc-theme-change', { detail: { theme: next } }));
  });
})();
