/*!
 * Login_v1 - Colorlib. No jQuery, no framework.
 * Behaviours: validate-form, tilt
 */
(function () {
  'use strict';

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

  /* Pointer tilt, as tilt.js did. Off for anyone who prefers reduced motion. */
  if (!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    document.querySelectorAll('.js-tilt').forEach(function (el) {
      var MAX = 20, SCALE = 1.1;
      el.style.transition = 'transform .3s cubic-bezier(.03,.98,.52,.99)';
      el.style.willChange = 'transform';
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.transform = 'perspective(1000px) rotateX(' + (MAX / 2 - py * MAX).toFixed(2) + 'deg) rotateY('
          + (px * MAX - MAX / 2).toFixed(2) + 'deg) scale3d(' + SCALE + ',' + SCALE + ',' + SCALE + ')';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }
})();
