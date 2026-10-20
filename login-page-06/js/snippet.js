/*!
 * login-page-06 - Colorlib. No jQuery, no framework.
 * Behaviours: own-script
 */
/* The page's own script, unchanged: it never needed jQuery. */
(() => {
  'use strict';

  const root = document.querySelector('.cl-login06');
  if (!root) return;
  const view = root.querySelector('[data-view]');
  const form = root.querySelector('[data-form]');
  const boxes = Array.from(root.querySelectorAll('[data-digit]'));
  const error = root.querySelector('[data-error]');
  const submit = root.querySelector('[data-submit]');
  const resend = root.querySelector('[data-resend]');
  const count = root.querySelector('[data-count]');
  const live = root.querySelector('[data-live]');
  const done = root.querySelector('[data-success]');
  if (!form || boxes.length !== 6 || !done) return;
  const WAIT = 30;
  let tick = 0;
  let busy = false;

  const code = () => boxes.map((b) => b.value).join('');
  const paint = () => boxes.forEach((b) => b.classList.toggle('is-filled', b.value !== ''));
  const setError = (msg) => {
    error.textContent = msg;
    form.classList.toggle('is-error', !!msg);
    boxes.forEach((b) => (msg ? b.setAttribute('aria-invalid', 'true') : b.removeAttribute('aria-invalid')));
    if (msg) {
      form.classList.remove('is-shake');
      void form.offsetWidth; 
      form.classList.add('is-shake');
    }
  };

  
  const fill = (digits, i) => {
    digits.split('').slice(0, 6 - i).forEach((d, k) => { boxes[i + k].value = d; });
    paint();
    const next = boxes.findIndex((b) => b.value === '');
    (next === -1 ? boxes[5] : boxes[next]).focus();
    if (error.textContent) setError('');
    if (code().length === 6) form.requestSubmit();
  };

  boxes.forEach((box, i) => {
    box.addEventListener('keydown', (e) => {
      if (/^[0-9]$/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        box.value = e.key;
        paint();
        if (error.textContent) setError('');
        if (i < 5) boxes[i + 1].focus();
        else if (code().length === 6) form.requestSubmit();
        return;
      }
      if (e.key === 'Backspace') {
        e.preventDefault();
        if (box.value) box.value = '';
        else if (i > 0) { boxes[i - 1].value = ''; boxes[i - 1].focus(); }
        paint();
      } else if (e.key === 'Delete') {
        e.preventDefault();
        box.value = '';
        paint();
      } else if (e.key === 'ArrowLeft' && i > 0) {
        e.preventDefault(); boxes[i - 1].focus();
      } else if (e.key === 'ArrowRight' && i < 5) {
        e.preventDefault(); boxes[i + 1].focus();
      } else if (e.key === 'Home') {
        e.preventDefault(); boxes[0].focus();
      } else if (e.key === 'End') {
        e.preventDefault(); boxes[5].focus();
      }
    });
    
    box.addEventListener('input', () => {
      const digits = box.value.replace(/\D/g, '');
      box.value = '';
      if (digits) fill(digits, i); else paint();
    });
    box.addEventListener('paste', (e) => {
      e.preventDefault();
      const digits = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
      if (digits) fill(digits, digits.length >= 6 ? 0 : i);
    });
    box.addEventListener('focus', () => box.select());
  });

  
  const startTimer = () => {
    let left = WAIT;
    resend.disabled = true;
    count.hidden = false;
    const render = () => { count.textContent = `in 0:${String(left).padStart(2, '0')}`; };
    render();
    clearInterval(tick);
    tick = setInterval(() => {
      left -= 1;
      if (left <= 0) {
        clearInterval(tick);
        resend.disabled = false;
        count.hidden = true;
        return;
      }
      render();
    }, 1000);
  };
  resend.addEventListener('click', () => {
    boxes.forEach((b) => { b.value = ''; });
    paint();
    setError('');
    startTimer();
    live.textContent = 'A new code is on its way to your phone ending 482.';
    boxes[0].focus();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (busy) return;
    const value = code();
    if (value.length < 6) {
      const msg = `Enter all 6 digits. ${6 - value.length} to go.`;
      setError(msg);
      live.textContent = msg;
      const empty = boxes.find((b) => b.value === '');
      if (empty) empty.focus();
      return;
    }
    busy = true;
    submit.setAttribute('aria-disabled', 'true');
    submit.textContent = 'Checking…';
    setTimeout(() => {
      busy = false;
      submit.removeAttribute('aria-disabled');
      submit.textContent = 'Verify and sign in';
      if (value === '000000') {
        const msg = 'That code didn’t work. Check the latest text and try again.';
        setError(msg);
        live.textContent = msg;
        boxes[0].focus();
        return;
      }
      clearInterval(tick);
      live.textContent = '';
      view.hidden = true;
      done.hidden = false;
      done.focus();
    }, 500);
  });

  root.querySelector('[data-reset]').addEventListener('click', () => {
    boxes.forEach((b) => { b.value = ''; });
    paint();
    setError('');
    done.hidden = true;
    view.hidden = false;
    startTimer();
    boxes[0].focus();
  });

  startTimer();
})();

