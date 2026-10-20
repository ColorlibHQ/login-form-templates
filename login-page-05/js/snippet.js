/*!
 * login-page-05 - Colorlib. No jQuery, no framework.
 * Behaviours: own-script
 */
/* The page's own script, unchanged: it never needed jQuery. */
(() => {
  'use strict';

  const root = document.querySelector('.cl-login05');
  if (!root) return;
  const stepEmail = root.querySelector('[data-step="email"]');
  const stepPw = root.querySelector('[data-step="password"]');
  const done = root.querySelector('[data-success]');
  const live = root.querySelector('[data-live]');
  const bar = root.querySelector('[data-bar]');
  const heading = root.querySelector('[data-heading]');
  const lead = root.querySelector('[data-lead]');
  const who = root.querySelector('[data-who]');
  if (!stepEmail || !stepPw || !done) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const LEAD = lead.textContent;

  const messageFor = (el) => {
    const val = el.value.trim();
    if (el.required && !val) return el.dataset.msg || 'This field is required.';
    if (el.validity.typeMismatch) return 'Enter a valid email, like name@example.com.';
    if (el.minLength > 0 && el.value.length < el.minLength) return 'Wrong password. Try again or click Forgot password to reset it.';
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
  const clear = (field) => {
    field.classList.remove('is-error');
    field.querySelector('[data-error]').textContent = '';
    field.querySelector('input').removeAttribute('aria-invalid');
  };
  root.querySelectorAll('[data-field]').forEach((field) => {
    field.addEventListener('input', () => { if (field.classList.contains('is-error')) check(field); });
  });

  root.querySelectorAll('[data-pw-toggle]').forEach((btn) => {
    const input = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', () => {
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.setAttribute('aria-pressed', String(show));
    });
  });

  
  const busy = (fn) => {
    bar.classList.add('is-loading');
    setTimeout(() => { bar.classList.remove('is-loading'); fn(); }, reduced ? 0 : 450);
  };

  const show = (el) => {
    [stepEmail, stepPw, done].forEach((s) => { s.hidden = s !== el; });
  };

  stepEmail.addEventListener('submit', (e) => {
    e.preventDefault();
    const field = stepEmail.querySelector('[data-field]');
    if (!check(field)) { live.textContent = field.querySelector('[data-error]').textContent; field.querySelector('input').focus(); return; }
    const email = stepEmail.elements.email.value.trim();
    busy(() => {
      heading.textContent = 'Welcome';
      lead.hidden = true;
      who.hidden = false;
      root.querySelector('[data-who-email]').textContent = email;
      root.querySelector('[data-avatar]').textContent = email.charAt(0).toUpperCase();
      show(stepPw);
      live.textContent = `Enter the password for ${email}.`;
      stepPw.elements.password.focus();
    });
  });

  stepPw.addEventListener('submit', (e) => {
    e.preventDefault();
    const field = stepPw.querySelector('[data-field]');
    if (!check(field)) { live.textContent = field.querySelector('[data-error]').textContent; field.querySelector('input').focus(); return; }
    busy(() => {
      root.querySelector('[data-done-text]').textContent = `Signed in as ${stepEmail.elements.email.value.trim()}. Taking you to your inbox…`;
      live.textContent = '';
      show(done);
      done.focus();
    });
  });

  const backToEmail = () => {
    heading.textContent = 'Sign in';
    lead.textContent = LEAD;
    lead.hidden = false;
    who.hidden = true;
    stepPw.reset();
    clear(stepPw.querySelector('[data-field]'));
    const toggle = stepPw.querySelector('[data-pw-toggle]');
    toggle.setAttribute('aria-pressed', 'false');
    stepPw.elements.password.type = 'password';
    show(stepEmail);
    live.textContent = 'Back to email. Enter a different account.';
    const input = stepEmail.elements.email;
    input.focus();
    input.select();
  };
  root.querySelector('[data-back]').addEventListener('click', backToEmail);
  root.querySelector('[data-reset]').addEventListener('click', () => {
    stepEmail.reset();
    backToEmail();
  });
})();

