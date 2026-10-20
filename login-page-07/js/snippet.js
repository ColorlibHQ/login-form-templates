/*!
 * login-page-07 - Colorlib. No jQuery, no framework.
 * Behaviours: own-script
 */
/* The page's own script, unchanged: it never needed jQuery. */
(() => {
  'use strict';

  const root = document.querySelector('.cl-login07');
  if (!root) return;
  const view = root.querySelector('[data-view]');
  const form = root.querySelector('[data-form]');
  const live = root.querySelector('[data-live]');
  const done = root.querySelector('[data-success]');
  const scan = root.querySelector('[data-scan]');
  const faceid = root.querySelector('[data-faceid]');
  if (!form || !done || !scan) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const messageFor = (el) => {
    const val = el.value.trim();
    if (el.required && !val) return el.dataset.msg || 'This field is required.';
    if (el.validity.typeMismatch) return 'Check your email — it looks incomplete.';
    if (el.minLength > 0 && el.value.length < el.minLength) return `Passwords have at least ${el.minLength} characters.`;
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

  root.querySelectorAll('[data-pw-toggle]').forEach((btn) => {
    const input = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', () => {
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.setAttribute('aria-pressed', String(show));
    });
  });

  const finish = (title, text) => {
    root.querySelector('[data-done-title]').textContent = title;
    root.querySelector('[data-done-text]').textContent = text;
    scan.hidden = true;
    view.hidden = true;
    done.hidden = false;
    done.focus();
  };

  
  faceid.addEventListener('click', () => {
    scan.hidden = false;
    live.textContent = 'Simulated Face ID. No camera is used in this demo.';
    setTimeout(() => {
      finish('Welcome back, Sam', 'Demo only — no camera was used. Your run from this morning is syncing.');
      live.textContent = 'Signed in with simulated Face ID.';
    }, reduced ? 300 : 1300);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    fields.forEach((f) => { f.dataset.touched = '1'; });
    const bad = fields.filter((f) => !check(f));
    if (bad.length) {
      live.textContent = bad.map((f) => f.querySelector('[data-error]').textContent).join(' ');
      bad[0].querySelector('input').focus();
      return;
    }
    live.textContent = '';
    finish('You’re in', `Logged in as ${form.elements.email.value.trim()}. Your run from this morning is syncing.`);
  });

  root.querySelector('[data-reset]').addEventListener('click', () => {
    form.reset();
    fields.forEach((f) => {
      delete f.dataset.touched;
      f.classList.remove('is-error');
      f.querySelector('[data-error]').textContent = '';
      f.querySelector('input').removeAttribute('aria-invalid');
    });
    live.textContent = '';
    done.hidden = true;
    view.hidden = false;
    form.elements.email.focus();
  });
})();

