/* Moharram Closure Popup — Kanchwala Jewellers */
(function () {
  var STORAGE_KEY = 'moharram_popup_dismissed_2026';
  var SHOW_FROM = new Date('2026-06-10T00:00:00');
  var SHOW_UNTIL = new Date('2026-06-25T00:00:00');

  function shouldShow() {
    var now = new Date();
    if (now < SHOW_FROM || now > SHOW_UNTIL) return false;
    return !localStorage.getItem(STORAGE_KEY);
  }

  function openPopup() {
    var el = document.getElementById('moharramOverlay');
    if (!el) return;
    el.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closePopup() {
    var el = document.getElementById('moharramOverlay');
    if (!el) return;
    el.classList.remove('active');
    document.body.style.overflow = '';
    localStorage.setItem(STORAGE_KEY, '1');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var overlay = document.getElementById('moharramOverlay');
    if (!overlay) return;

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closePopup();
    });

    var closeBtn = overlay.querySelector('.moharram-close');
    if (closeBtn) closeBtn.addEventListener('click', closePopup);

    var gotItBtn = overlay.querySelector('.moharram-btn');
    if (gotItBtn) gotItBtn.addEventListener('click', closePopup);

    if (shouldShow()) {
      setTimeout(openPopup, 1000);
    }
  });

  window.moharramPopupOpen = openPopup;
  window.moharramPopupClose = closePopup;
})();
