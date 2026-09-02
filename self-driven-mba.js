/*
  Click-to-enlarge for the still images on this page (the 2024 artifacts and
  the entry photographs). Video embeds are left alone — they have their own
  player controls. No dependencies.
*/
(function () {
  var selector = '.mba-mat img, .mba-entry-media .photo';
  var images = Array.prototype.slice.call(document.querySelectorAll(selector));
  if (!images.length) return;

  var overlay, overlayImg, overlayCaption, closeBtn, lastFocused;

  function build() {
    overlay = document.createElement('div');
    overlay.className = 'mba-lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.hidden = true;

    closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'mba-lightbox-close';
    closeBtn.setAttribute('aria-label', 'Close image');
    closeBtn.innerHTML = '&times;';

    var figure = document.createElement('figure');
    figure.className = 'mba-lightbox-figure';

    overlayImg = document.createElement('img');
    overlayImg.alt = '';

    overlayCaption = document.createElement('figcaption');

    figure.appendChild(overlayImg);
    figure.appendChild(overlayCaption);
    overlay.appendChild(closeBtn);
    overlay.appendChild(figure);
    // mount inside .mba: the --mba-* palette tokens are scoped to that element,
    // so an overlay on <body> would render dark-on-dark
    (document.querySelector('.mba') || document.body).appendChild(overlay);

    // backdrop click closes; clicks on the image itself do not
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target === figure) close();
    });
    closeBtn.addEventListener('click', close);
  }

  function captionFor(img) {
    var fig = img.closest('figure');
    var cap = fig && fig.querySelector('figcaption');
    return cap ? cap.textContent.trim() : (img.alt || '');
  }

  function open(img) {
    if (!overlay) build();
    lastFocused = img;
    overlayImg.src = img.currentSrc || img.src;
    overlayImg.alt = img.alt || '';
    overlayCaption.textContent = captionFor(img);
    overlay.hidden = false;
    document.body.classList.add('mba-lightbox-open');
    closeBtn.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function close() {
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    document.body.classList.remove('mba-lightbox-open');
    document.removeEventListener('keydown', onKeydown);
    if (lastFocused) lastFocused.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      close();
    } else if (e.key === 'Tab') {
      // only the close button is reachable while the dialog is open
      e.preventDefault();
      closeBtn.focus();
    }
  }

  images.forEach(function (img) {
    img.classList.add('mba-zoomable');
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', 'Enlarge image: ' + (img.alt || 'image'));
    img.addEventListener('click', function () { open(img); });
    img.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        open(img);
      }
    });
  });
})();
