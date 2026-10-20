/*!
 * Login_v2 - Colorlib. No jQuery, no framework.
 * Behaviours: floating-labels, validate-form, show-password
 */
(function () {
  'use strict';

  /* Floating labels: the stylesheet lifts the label off a filled field. */
  document.querySelectorAll('.input100').forEach(function (input) {
    var sync = function () { input.classList.toggle('has-val', input.value.trim() !== ''); };
    input.addEventListener('blur', sync);
    sync();
  });

  /* Required-field and email checks, shown as the design's own bubbles. */
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function fieldOk(input) {
    var v = input.value.trim();
    if (input.type === 'email' || input.name === 'email') return EMAIL.test(v);
    return v !== '';
  }
  document.querySelectorAll('.validate-form').forEach(function (form) {
    var fields = form.querySelectorAll('.validate-input .input100, .validate-input input, .validate-input textarea');
    form.addEventListener('submit', function (event) {
      var ok = true;
      fields.forEach(function (f) {
        if (fieldOk(f)) return;
        (f.closest('.validate-input') || f.parentElement).classList.add('alert-validate');
        ok = false;
      });
      if (!ok) event.preventDefault();
    });
    fields.forEach(function (f) {
      f.addEventListener('focus', function () {
        (f.closest('.validate-input') || f.parentElement).classList.remove('alert-validate');
      });
    });
  });

  /* Reveal / hide the password, swapping the eye icon with it. */
  document.querySelectorAll('.btn-show-pass').forEach(function (button) {
    var input = button.parentElement && button.parentElement.querySelector('input');
    if (!input) return;
    button.setAttribute('role', 'button');
    button.setAttribute('tabindex', '0');
    button.setAttribute('aria-label', 'Show password');
    button.setAttribute('aria-pressed', 'false');
    function toggle() {
      var shown = input.type === 'text';
      input.type = shown ? 'password' : 'text';
      button.classList.toggle('cl-active', !shown);
      button.setAttribute('aria-pressed', String(!shown));
      button.querySelectorAll('svg, i').forEach(function (icon) {
        icon.classList.toggle('zmdi-eye', shown); icon.classList.toggle('zmdi-eye-off', !shown);
        icon.classList.toggle('fa-eye', shown);   icon.classList.toggle('fa-eye-slash', !shown);
      });
    }
    button.addEventListener('click', toggle);
    button.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });
})();
