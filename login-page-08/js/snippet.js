/*!
 * login-page-08 - Colorlib. No jQuery, no framework.
 * Behaviours: own-script
 */
/* The page's own script, unchanged: it never needed jQuery. */
(() => {
  'use strict';

  const root = document.querySelector('.cl-login08');
  if (!root) return;
  const view = root.querySelector('[data-view]');
  const form = root.querySelector('[data-form]');
  const live = root.querySelector('[data-live]');
  const done = root.querySelector('[data-success]');
  const caps = root.querySelector('[data-caps]');
  const pw = form && form.elements.password;
  const toggle = root.querySelector('[data-pw-toggle]');
  if (!form || !done || !pw) return;

  const messageFor = (el) => {
    const val = el.value.trim();
    if (el.required && !val) return el.dataset.msg || 'This one is required.';
    if (el.minLength > 0 && el.value.length < el.minLength) {
      return el.type === 'text' && el.name === 'user' ? `Usernames have at least ${el.minLength} characters.` : `Passwords have at least ${el.minLength} characters.`;
    }
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

  
  const shy = () => root.classList.toggle('is-shy', document.activeElement === pw && pw.type === 'password');
  pw.addEventListener('focus', shy);
  pw.addEventListener('blur', () => { root.classList.remove('is-shy'); caps.hidden = true; });

  toggle.addEventListener('click', () => {
    const show = pw.type === 'password';
    pw.type = show ? 'text' : 'password';
    toggle.setAttribute('aria-pressed', String(show));
    shy();
  });

  
  let capsOn = false;
  const capsCheck = (e) => {
    if (typeof e.getModifierState !== 'function') return;
    const on = e.getModifierState('CapsLock');
    caps.hidden = !on;
    if (on !== capsOn) {
      capsOn = on;
      live.textContent = on ? 'Caps Lock is on.' : '';
    }
  };
  pw.addEventListener('keydown', capsCheck);
  pw.addEventListener('keyup', capsCheck);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    fields.forEach((f) => { f.dataset.touched = '1'; });
    const bad = fields.filter((f) => !check(f));
    if (bad.length) {
      live.textContent = `Almost there: ${bad.map((f) => f.querySelector('[data-error]').textContent).join(' ')}`;
      bad[0].querySelector('input').focus();
      return;
    }
    const user = form.elements.user.value.trim().split('@')[0];
    root.querySelector('[data-done-text]').textContent = `Welcome back, ${user}. Three plants are thirsty today: the monstera, the calathea and Gerald the cactus.`;
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
    done.hidden = true;
    view.hidden = false;
    form.elements.user.focus();
  });
})();

