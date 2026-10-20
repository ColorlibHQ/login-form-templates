/*!
 * login-page-03 - Colorlib. No jQuery, no framework.
 * Behaviours: own-script
 */
/* The page's own script, unchanged: it never needed jQuery. */
(() => {
  'use strict';

  const root = document.querySelector('.cl-login03');
  if (!root) return;
  const view = root.querySelector('[data-view]');
  const form = root.querySelector('[data-form]');
  const saml = root.querySelector('[data-saml]');
  const samlToggle = root.querySelector('[data-saml-toggle]');
  const live = root.querySelector('[data-live]');
  const done = root.querySelector('[data-success]');
  if (!form || !saml || !done) return;

  const messageFor = (el) => {
    const val = el.value.trim();
    if (el.required && !val) return el.dataset.msg || 'This field is required.';
    if (el.validity.typeMismatch) return 'Enter a work email like alex@company.com.';
    if (el.validity.patternMismatch) return el.dataset.pattern || 'Check the format.';
    if (el.minLength > 0 && el.value.length < el.minLength) return `Beacon passwords are at least ${el.minLength} characters.`;
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
  const wire = (scope) => {
    const fields = Array.from(scope.querySelectorAll('[data-field]'));
    fields.forEach((field) => {
      field.addEventListener('focusout', (e) => {
        if (field.contains(e.relatedTarget) || (e.relatedTarget && e.relatedTarget.matches('button')) || !field.querySelector('input').value) return;
        field.dataset.touched = '1';
        check(field);
      });
      field.addEventListener('input', () => { if (field.dataset.touched) check(field); });
    });
    return () => {
      fields.forEach((f) => { f.dataset.touched = '1'; });
      const bad = fields.filter((f) => !check(f));
      if (bad.length) bad[0].querySelector('input').focus();
      return bad.length;
    };
  };
  const validateMain = wire(form);
  const validateSaml = wire(saml);

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
    live.textContent = '';
    view.hidden = true;
    done.hidden = false;
    done.focus();
  };

  root.querySelectorAll('[data-provider]').forEach((btn) => {
    btn.addEventListener('click', () => finish(`Continuing with ${btn.dataset.provider}`, `In a real app you would now approve Beacon in a ${btn.dataset.provider} window. Demo — nothing is sent.`));
  });

  
  samlToggle.addEventListener('click', () => {
    const open = samlToggle.getAttribute('aria-expanded') !== 'true';
    samlToggle.setAttribute('aria-expanded', String(open));
    saml.hidden = !open;
    if (open) saml.querySelector('input').focus();
  });

  saml.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateSaml()) { live.textContent = 'Check your company domain.'; return; }
    const domain = saml.elements.domain.value.trim().toLowerCase();
    finish('Redirecting to your identity provider', `Beacon found single sign-on for ${domain}. You would now sign in with your company account. Demo — nothing is sent.`);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const bad = validateMain();
    if (bad) { live.textContent = bad === 1 ? 'One field needs attention.' : `${bad} fields need attention.`; return; }
    finish('Welcome back', `Signed in as ${form.elements.email.value.trim()}. Two incidents are open on your rota.`);
  });

  root.querySelector('[data-reset]').addEventListener('click', () => {
    [form, saml].forEach((f) => f.reset());
    root.querySelectorAll('[data-field]').forEach((f) => {
      delete f.dataset.touched;
      f.classList.remove('is-error');
      f.querySelector('[data-error]').textContent = '';
      f.querySelector('input').removeAttribute('aria-invalid');
    });
    done.hidden = true;
    view.hidden = false;
    form.elements.email.focus();
  });
})();

