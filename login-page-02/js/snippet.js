/*!
 * login-page-02 - Colorlib. No jQuery, no framework.
 * Behaviours: own-script
 */
/* The page's own script, unchanged: it never needed jQuery. */
(() => {
  'use strict';

  const root = document.querySelector('.cl-login02');
  if (!root) return;
  const view = root.querySelector('[data-view="form"]');
  const form = root.querySelector('[data-form]');
  const live = root.querySelector('[data-live]');
  const done = root.querySelector('[data-success]');
  const pwField = root.querySelector('[data-pw-field]');
  const pwInput = pwField.querySelector('input');
  const modeBtn = root.querySelector('[data-mode]');
  const modeLabel = root.querySelector('[data-mode-label]');
  const submit = root.querySelector('[data-submit]');
  const hint = root.querySelector('[data-link-hint]');
  const passkey = root.querySelector('[data-passkey]');
  const resend = root.querySelector('[data-resend]');
  let linkMode = false;
  let timer = 0;

  const ICONS = {
    ok: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    mail: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6 8.5 7 8.5-7"/></svg>'
  };

  const messageFor = (el) => {
    const val = el.value.trim();
    if (el.required && !val) return el.dataset.msg || 'This field is required.';
    if (el.validity.typeMismatch) return 'That doesn’t look like an email address.';
    if (el.minLength > 0 && el.value.length < el.minLength) return `Passwords are at least ${el.minLength} characters.`;
    return '';
  };
  const check = (field) => {
    const el = field.querySelector('input');
    const msg = el.disabled ? '' : messageFor(el);
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

  
  const setMode = (link) => {
    linkMode = link;
    pwField.hidden = link;
    pwInput.disabled = link;
    hint.hidden = !link;
    if (link) check(pwField); 
    else delete pwField.dataset.touched;
    submit.textContent = link ? 'Email me a sign-in link' : 'Continue';
    modeLabel.textContent = link ? 'Use my password instead' : 'Email me a sign-in link instead';
    live.textContent = link ? 'Link mode: enter your email and we will send a sign-in link.' : 'Password mode.';
  };
  modeBtn.addEventListener('click', () => {
    setMode(!linkMode);
    form.elements.email.focus();
  });

  const finish = ({ icon, title, text, link }) => {
    root.querySelector('[data-done-icon]').innerHTML = icon;
    root.querySelector('[data-done-title]').textContent = title;
    root.querySelector('[data-done-text]').textContent = text;
    resend.hidden = !link;
    live.textContent = '';
    view.hidden = true;
    done.hidden = false;
    done.focus();
  };

  passkey.addEventListener('click', () => {
    if (passkey.classList.contains('is-busy')) return;
    passkey.classList.add('is-busy');
    passkey.setAttribute('aria-disabled', 'true');
    root.querySelector('[data-passkey-label]').textContent = 'Waiting for your device…';
    live.textContent = 'Waiting for your device. This passkey prompt is simulated.';
    timer = setTimeout(() => {
      passkey.classList.remove('is-busy');
      passkey.removeAttribute('aria-disabled');
      root.querySelector('[data-passkey-label]').textContent = 'Sign in with a passkey';
      finish({ icon: ICONS.ok, title: 'Signed in with a passkey', text: 'No password needed. Your workspace is loading…', link: false });
    }, 1200);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    fields.forEach((f) => { f.dataset.touched = '1'; });
    const bad = fields.filter((f) => !check(f));
    if (bad.length) {
      live.textContent = bad.length === 1 ? 'One field needs attention.' : `${bad.length} fields need attention.`;
      bad[0].querySelector('input').focus();
      return;
    }
    const email = form.elements.email.value.trim();
    if (linkMode) finish({ icon: ICONS.mail, title: 'Check your inbox', text: `We sent a sign-in link to ${email}. It works once, for 15 minutes.`, link: true });
    else finish({ icon: ICONS.ok, title: 'You’re in', text: `Signed in as ${email}. Your workspace is loading…`, link: false });
  });

  resend.addEventListener('click', () => { live.textContent = `A new link is on its way to ${form.elements.email.value.trim()}.`; });

  root.querySelector('[data-reset]').addEventListener('click', () => {
    clearTimeout(timer);
    form.reset();
    fields.forEach((f) => {
      delete f.dataset.touched;
      f.classList.remove('is-error');
      f.querySelector('[data-error]').textContent = '';
      f.querySelector('input').removeAttribute('aria-invalid');
    });
    done.hidden = true;
    view.hidden = false;
    live.textContent = '';
    form.elements.email.focus();
  });
})();

