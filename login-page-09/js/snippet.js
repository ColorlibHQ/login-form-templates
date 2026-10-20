/*!
 * login-page-09 - Colorlib. No jQuery, no framework.
 * Behaviours: select-font-settle, own-script
 */
/* The page's own script, unchanged: it never needed jQuery. */
(() => {
  'use strict';

  const root = document.querySelector('.cl-login09');
  if (!root) return;
  const view = root.querySelector('[data-view]');
  const form = root.querySelector('[data-form]');
  const live = root.querySelector('[data-live]');
  const done = root.querySelector('[data-success]');
  const ws = form && form.elements.workspace;
  const wsHint = root.querySelector('[data-ws-hint]');
  if (!form || !done || !ws) return;
  const HINT = wsHint.textContent;

  const messageFor = (el) => {
    const val = el.value.trim();
    if (el.required && !val) return el.dataset.msg || 'This field is required.';
    if (el.validity.typeMismatch) return 'Enter a valid work email address.';
    if (el.validity.patternMismatch) return el.dataset.pattern || 'Check the format.';
    if (el.minLength > 0 && el.value.length < el.minLength) return `Console passwords are at least ${el.minLength} characters.`;
    return '';
  };
  const check = (field) => {
    const el = field.querySelector('input');
    const msg = messageFor(el);
    field.querySelector('[data-error]').textContent = msg;
    field.classList.toggle('is-error', !!msg);
    if (msg) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
    return !msg;
  };
  const fields = Array.from(form.querySelectorAll('[data-field]'));
  fields.forEach((field) => {
    field.addEventListener('focusout', (e) => {
      if (field.contains(e.relatedTarget) || (e.relatedTarget && e.relatedTarget.matches('button')) || !field.querySelector('input').value) return;
      field.dataset.touched = '1';
      check(field);
    });
    field.addEventListener('input', () => { if (field.dataset.touched) check(field); });
  });

  
  const title = (slug) => slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const lookup = () => {
    const field = ws.closest('[data-field]');
    const ok = ws.value && check(field);
    wsHint.classList.toggle('is-found', !!ok);
    wsHint.textContent = ok ? `Workspace found: ${title(ws.value)} (${ws.value}.corely.io)` : HINT;
  };
  ws.addEventListener('input', () => {
    const clean = ws.value.toLowerCase().replace(/^https?:\/\//, '').replace(/\.corely\.io.*$/, '').replace(/\s+/g, '-');
    if (clean !== ws.value) ws.value = clean;
    if (wsHint.classList.contains('is-found')) { wsHint.classList.remove('is-found'); wsHint.textContent = HINT; }
  });
  ws.addEventListener('blur', lookup);

  root.querySelectorAll('[data-pw-toggle]').forEach((btn) => {
    const input = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', () => {
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.setAttribute('aria-pressed', String(show));
    });
  });

  root.querySelector('[data-sso]').addEventListener('click', () => {
    const field = ws.closest('[data-field]');
    field.dataset.touched = '1';
    if (!check(field)) {
      live.classList.remove('is-info');
      live.textContent = 'Enter your workspace URL first, so we know which identity provider to use.';
      ws.focus();
      return;
    }
    live.classList.add('is-info');
    live.textContent = `Demo — ${ws.value}.corely.io would now redirect to your company identity provider.`;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    fields.forEach((f) => { f.dataset.touched = '1'; });
    const bad = fields.filter((f) => !check(f));
    live.classList.remove('is-info');
    if (bad.length) {
      live.textContent = `Sign-in blocked: ${bad.length} field${bad.length === 1 ? ' needs' : 's need'} attention.`;
      bad[0].querySelector('input').focus();
      return;
    }
    const set = (k, v) => { root.querySelector(`[data-s-${k}]`).textContent = v; };
    set('ws', `${ws.value}.corely.io`);
    set('email', form.elements.email.value.trim());
    set('region', form.elements.region.value);
    set('session', form.elements.remember.checked ? '30 days' : '12 hours, or until the browser closes');
    live.textContent = '';
    view.hidden = true;
    done.hidden = false;
    done.focus();
  });

  root.querySelector('[data-reset]').addEventListener('click', () => {
    form.reset();
    fields.forEach((f) => {
      delete f.dataset.touched;
      f.classList.remove('is-error');
      f.querySelector('[data-error]').textContent = '';
      f.querySelector('input').removeAttribute('aria-invalid');
    });
    wsHint.classList.remove('is-found');
    wsHint.textContent = HINT;
    done.hidden = true;
    view.hidden = false;
    ws.focus();
  });
})();

(function () {
  'use strict';

  /* Re-measure selects once web fonts are in (Chrome sizes them on the fallback). */
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () {
    document.querySelectorAll('select').forEach(function (s) {
      var d = s.style.display;
      s.style.display = 'none';
      s.offsetHeight;
      s.style.display = d;
    });
  });
})();
