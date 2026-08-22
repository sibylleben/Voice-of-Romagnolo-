var galleryImages = [];
var galleryIndex  = 0;

// Runs once the page has loaded
document.addEventListener('DOMContentLoaded', function () {
  renderOverview();
  renderProverbs();
  renderDialect();
  renderImages();
  renderPopularCulture();
  renderAbout();
  setupTabs();
  setupLightbox();
});

// -- About ----------------------------------------------------------
function renderAbout() {
  var panel = document.getElementById('about');
  var d = SITE_DATA.about;

  var photoHtml = d.photo
    ? '<div class="about-photo">' +
        '<img src="' + d.photo + '" alt="' + d.name + '" class="img-zoomable" data-caption="' + d.name + '">' +
      '</div>'
    : '';

  var linksHtml = '';
  if (d.links && d.links.length) {
    linksHtml = '<div class="about-links">';
    d.links.forEach(function (link) {
      linksHtml += '<a class="about-link" href="' + link.url + '" target="_blank" rel="noopener">' + link.label + '</a>';
    });
    linksHtml += '</div>';
  }

  var bioHtml = d.bio.map(function (para) {
    return '<p class="about-para">' + para + '</p>';
  }).join('');

  var aboutPhotosHtml = '';
  if (d.photos && d.photos.length) {
    aboutPhotosHtml = '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0.5rem;margin-top:1.5rem;padding-top:1.25rem;border-top:1px solid #e0cfc0;">';
    d.photos.forEach(function (p) {
      aboutPhotosHtml +=
        '<div style="aspect-ratio:1;overflow:hidden;border-radius:5px;">' +
          '<img src="' + p.url + '" alt="' + p.caption + '" class="img-zoomable" data-caption="' + p.caption + '" style="width:100%;height:100%;object-fit:cover;">' +
        '</div>';
    });
    aboutPhotosHtml += '</div>';
  }

  panel.innerHTML =
    '<div class="section-header">' +
      '<h2>About</h2>' +
    '</div>' +
    '<div class="card about-card">' +
      '<div class="about-layout' + (d.photo ? '' : ' about-layout--solo') + '">' +
        photoHtml +
        '<div class="about-body">' +
          '<div class="about-name">' + d.name + '</div>' +
          (d.role ? '<div class="about-role">' + d.role + '</div>' : '') +
          '<div class="about-bio">' + bioHtml + '</div>' +
          linksHtml +
        '</div>' +
      '</div>' +
      aboutPhotosHtml +
    '</div>';
}

// -- Tab switching --------------------------------------------------
function setupTabs() {
  var buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      buttons.forEach(function (b) { b.classList.remove('active'); });
      document.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.remove('active'); });
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });
}

// -- Proverbs -------------------------------------------------------
function renderProverbs() {
  var panel = document.getElementById('proverbs');
  var data = SITE_DATA.proverbs;
  var items = data.items;

  panel.innerHTML =
    '<div class="section-header">' +
      '<h2>Proverbs</h2>' +
      '<p>Sayings, proverbs, and just common phrases</p>' +
    '</div>';

  if (!items || items.length === 0) {
    panel.innerHTML += '<div class="empty-state"><p>No proverbs added yet.</p></div>';
    return;
  }

  items.forEach(function (item) {
    panel.innerHTML +=
      '<div style="margin-bottom:2.5rem;padding-bottom:2rem;border-bottom:1px solid #e0cfc0;">' +
        '<h3 style="font-family:Comfortaa,cursive;font-size:1.15rem;font-weight:normal;color:#5c1800;margin-bottom:0.6rem;">' + item.text + '</h3>' +
        (item.italian ? '<p style="font-size:0.97rem;line-height:1.75;color:#2c1810;margin-bottom:0.4rem;"><em>Italian:</em> ' + item.italian + '</p>' : '') +
        (item.english ? '<p style="font-size:0.97rem;line-height:1.75;color:#2c1810;">' + item.english + '</p>' : '') +
      '</div>';
  });

  if (data.sectionNote) {
    panel.innerHTML +=
      '<div class="proverb-section-note">' + data.sectionNote + '</div>';
  }
}

// -- Dialect --------------------------------------------------------
function renderDialect() {
  var panel = document.getElementById('dialect');
  var d = SITE_DATA.dialect;

  panel.innerHTML =
    '<div class="section-header">' +
      '<h2>Dialect</h2>' +
      '<p>Language, dialect, and the place of Romagnolo</p>' +
    '</div>';

  if (d.mapImage) {
    panel.innerHTML +=
      '<div class="overview-map dialect-map">' +
        '<img src="' + d.mapImage.url + '" alt="' + d.mapImage.alt + '" class="img-zoomable" data-caption="' + d.mapImage.alt + '">' +
        '<div class="overview-map-credit">' + d.mapImage.credit + '</div>' +
      '</div>';
  }

  d.sections.forEach(function (section) {
    var parasHtml = section.paragraphs.map(function (p) {
      return '<p>' + p + '</p>';
    }).join('');

    var content = parasHtml;
    if (section.image) {
      content =
        '<div class="dialect-img-layout">' +
          '<div>' + parasHtml + '</div>' +
          '<div class="dialect-aside-img">' +
            '<img src="' + section.image.url + '" alt="' + section.image.caption + '" class="img-zoomable" data-caption="' + section.image.caption + '">' +
            '<div class="dialect-img-caption">' +
              section.image.caption +
              (section.image.credit ? ' - <span class="dialect-img-credit">' + section.image.credit + '</span>' : '') +
            '</div>' +
          '</div>' +
        '</div>';
    }

    panel.innerHTML +=
      '<div class="overview-section">' +
        '<h3>' + section.heading + '</h3>' +
        content +
      '</div>';
  });

  if (typeof ROMAGNOLO_TABLES !== 'undefined' && ROMAGNOLO_TABLES.length) {
    panel.innerHTML +=
      '<div class="proverb-section-note" style="margin-bottom:1.75rem;">' +
        'The Romagnolo below is based off of the Instituto Friedrich Schurr APS\'s transcription of Romagnolo. This is also just starter vocabulary and simple pieces of the dialect, and what I have been working with.' +
      '</div>';

    ROMAGNOLO_TABLES.forEach(function (table) {
      var headerCells = table.headers.map(function (h) {
        return '<th>' + h + '</th>';
      }).join('');

      var bodyRows = table.rows.map(function (row) {
        var cells = row.map(function (cell) {
          return '<td>' + cell + '</td>';
        }).join('');
        return '<tr>' + cells + '</tr>';
      }).join('');

      panel.innerHTML +=
        '<div class="overview-section">' +
          '<h3>' + table.title + '</h3>' +
          '<table class="ref-table">' +
            '<thead><tr>' + headerCells + '</tr></thead>' +
            '<tbody>' + bodyRows + '</tbody>' +
          '</table>' +
        '</div>';
    });
  }

  if (d.books && d.books.length) {
    var booksHtml =
      '<div class="overview-section"><h3>Recommended Reading</h3>' +
      '<p class="dialect-books-intro">These books were essential to my learning and excellent (they also go way beyond the scope of my comprehension in both Italian and definitely Romagnolo):</p>';
    d.books.forEach(function (book) {
      booksHtml +=
        '<div class="card dialect-book">' +
          '<div class="dialect-book-title">' + book.title + '</div>' +
          '<div class="dialect-book-author">- ' + book.author + '</div>' +
        '</div>';
    });
    booksHtml += '</div>';
    panel.innerHTML += booksHtml;
  }
}

// -- Images ---------------------------------------------------------
function renderImages() {
  var panel = document.getElementById('images');
  var items = SITE_DATA.images;

  panel.innerHTML =
    '<div class="section-header">' +
      '<h2>Images</h2>' +
      '<p>Click any photo to enlarge and read about it</p>' +
    '</div>';

  var filled = items ? items.filter(function (it) { return it.url; }) : [];

  if (!filled.length) {
    panel.innerHTML += '<div class="empty-state"><p>No images added yet.</p></div>';
    return;
  }

  galleryImages = filled;

  var grid = document.createElement('div');
  grid.className = 'images-grid';

  filled.forEach(function (item, i) {
    var card = document.createElement('div');
    card.className = 'image-card';
    card.setAttribute('data-gallery-index', i);
    card.innerHTML = '<img src="' + item.url + '" alt="' + (item.caption || '') + '">';
    grid.appendChild(card);
  });

  grid.addEventListener('click', function (e) {
    var card = e.target.closest('.image-card');
    if (card) {
      galleryImages = filled;
      openGalleryLightbox(parseInt(card.dataset.galleryIndex, 10));
    }
  });

  panel.appendChild(grid);
}

// -- Recordings -----------------------------------------------------
function renderRecordings() {
  var panel = document.getElementById('recordings');
  var items = SITE_DATA.recordings;

  panel.innerHTML =
    '<div class="section-header">' +
      '<h2>Recordings</h2>' +
      '<p>Audio recordings in Romagnolo</p>' +
    '</div>';

  if (!items || items.length === 0) {
    panel.innerHTML += '<div class="empty-state"><p>No recordings added yet.</p></div>';
    return;
  }

  items.forEach(function (item) {
    var card = document.createElement('div');
    card.className = 'recording-card';

    var speakerHtml = item.speaker
      ? '<div class="recording-speaker">Speaker: ' + item.speaker + '</div>'
      : '';

    var descHtml = item.description
      ? '<div class="recording-desc">' + item.description + '</div>'
      : '';

    var audioHtml = item.url
      ? '<audio controls src="' + item.url + '"></audio>'
      : '<div class="audio-pending">Audio file not yet added.</div>';

    card.innerHTML =
      '<div class="recording-title">' + item.title + '</div>' +
      speakerHtml +
      descHtml +
      audioHtml;

    panel.appendChild(card);
  });
}

// -- Overview -------------------------------------------------------
function renderOverview() {
  var panel = document.getElementById('overview');
  var d = SITE_DATA.overview;

  var linksHtml = '';
  if (d.furtherReading && d.furtherReading.length) {
    linksHtml = '<div class="overview-section"><h3>Further Reading</h3><ul class="overview-links">';
    d.furtherReading.forEach(function (link) {
      linksHtml += '<li><a href="' + link.url + '" target="_blank" rel="noopener">' + link.label + '</a></li>';
    });
    linksHtml += '</ul></div>';
  }

  var mapHtml = d.mapImage
    ? '<div class="overview-map">' +
        '<img src="' + d.mapImage.url + '" alt="' + d.mapImage.alt + '" class="img-zoomable" data-caption="' + d.mapImage.alt + '">' +
        '<div class="overview-map-credit">' + d.mapImage.credit + '</div>' +
      '</div>'
    : '';

  panel.innerHTML =
    '<div class="section-header">' +
      '<h2>Overview</h2>' +
      '<p>Background and history of Romagnolo</p>' +
    '</div>' +
    mapHtml +
    d.sections.map(function (s) {
      return '<div class="overview-section"><h3>' + s.heading + '</h3><p>' + s.body + '</p></div>';
    }).join('') +
    linksHtml;
}

// -- Popular Culture ------------------------------------------------
function renderPopularCulture() {
  var panel = document.getElementById('popular-culture');
  var items = SITE_DATA.popularCulture;

  panel.innerHTML =
    '<div class="section-header">' +
      '<h2>Popular Culture</h2>' +
      '<p>Romagnolo in music, film, food, and everyday life</p>' +
    '</div>';

  if (!items || items.length === 0) {
    panel.innerHTML += '<div class="empty-state"><p>No entries added yet.</p></div>';
    return;
  }

  var carousel = document.createElement('div');
  carousel.className = 'pop-carousel';

  var slideEls = [];
  items.forEach(function (item, i) {
    var slide = document.createElement('div');
    slide.className = 'pop-slide' + (i === 0 ? ' active' : '');
    if (item.richContent) {
      slide.appendChild(renderRichPopItem(item));
    } else {
      var meta = item.category ? '<span class="pop-category">' + item.category + '</span>' : '';
      var detail = item.detail ? '<div class="value">' + item.detail + '</div>' : '';
      var link = item.url
        ? '<a class="pop-readmore" href="' + item.url + '" target="_blank" rel="noopener">Learn more &rarr;</a>'
        : '';
      slide.innerHTML =
        '<div class="card">' +
          '<div style="display:flex;align-items:baseline;gap:0.75rem;margin-bottom:0.4rem">' +
            '<div style="font-size:1.1rem">' + item.title + '</div>' + meta +
          '</div>' +
          detail + link +
        '</div>';
    }
    slideEls.push(slide);
    carousel.appendChild(slide);
  });

  if (items.length > 1) {
    var current = 0;
    var dotButtons = [];

    var prevBtn = document.createElement('button');
    prevBtn.className = 'pop-nav-btn pop-nav-prev';
    prevBtn.setAttribute('aria-label', 'Previous');
    prevBtn.innerHTML = '&#8592;';

    var dotsEl = document.createElement('div');
    dotsEl.className = 'pop-dots';
    items.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'pop-dot' + (i === 0 ? ' active' : '');
      dotsEl.appendChild(dot);
      dotButtons.push(dot);
    });

    var nextBtn = document.createElement('button');
    nextBtn.className = 'pop-nav-btn pop-nav-next';
    nextBtn.setAttribute('aria-label', 'Next');
    nextBtn.innerHTML = '&#8594;';

    function goTo(index) {
      slideEls[current].classList.remove('active');
      dotButtons[current].classList.remove('active');
      current = (index + items.length) % items.length;
      slideEls[current].classList.add('active');
      dotButtons[current].classList.add('active');
    }

    prevBtn.addEventListener('click', function () { goTo(current - 1); });
    nextBtn.addEventListener('click', function () { goTo(current + 1); });
    dotButtons.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); });
    });

    var wrapper = document.createElement('div');
    wrapper.className = 'pop-carousel-wrapper';
    wrapper.appendChild(prevBtn);
    wrapper.appendChild(carousel);
    wrapper.appendChild(nextBtn);
    panel.appendChild(wrapper);
    panel.appendChild(dotsEl);
  } else {
    panel.appendChild(carousel);
  }
}

function renderRichPopItem(item) {
  var rc = item.richContent;
  var card = document.createElement('div');
  card.className = 'card pop-rich-card';
  var fnKey = item.title.replace(/\s/g, '-');

  var heroHtml = rc.behindScenes
    ? '<div class="pop-hero">' +
        '<img src="' + rc.behindScenes.url + '" alt="' + rc.behindScenes.caption + '">' +
        '<div class="pop-hero-overlay">' +
          '<div class="pop-hero-top">' +
            (item.category ? '<span class="pop-category">' + item.category + '</span>' : '') +
          '</div>' +
          '<div class="pop-hero-title">' + item.title + '</div>' +
        '</div>' +
      '</div>'
    : '<div class="pop-title-bar">' +
        (item.category ? '<span class="pop-category">' + item.category + '</span>' : '') +
        '<div class="pop-hero-title" style="color:#2c1810;margin-top:0.4rem">' + item.title + '</div>' +
      '</div>';

  var bodyHtml = '';
  if (rc.sections) {
    rc.sections.forEach(function (section) {
      if (section.heading) {
        bodyHtml += '<div class="pop-section-heading">' + section.heading + '</div>';
      }
      section.paragraphs.forEach(function (p) {
        var cite = p.cite
          ? ' <sup><a class="cite-ref" href="#fn-' + fnKey + '-' + p.cite + '">[' + p.cite + ']</a></sup>'
          : '';
        bodyHtml += '<p class="pop-para">' + p.text + cite + '</p>';
      });
    });
  } else if (rc.paragraphs) {
    rc.paragraphs.forEach(function (p) {
      var cite = p.cite
        ? ' <sup><a class="cite-ref" href="#fn-' + fnKey + '-' + p.cite + '">[' + p.cite + ']</a></sup>'
        : '';
      bodyHtml += '<p class="pop-para">' + p.text + cite + '</p>';
    });
  }

  var readMoreHtml = item.url
    ? '<a class="pop-readmore" href="' + item.url + '" target="_blank" rel="noopener">Read more &rarr;</a>'
    : '';
  var trailerHtml = rc.trailer
    ? '<a class="pop-readmore" href="' + rc.trailer.watchUrl + '" target="_blank" rel="noopener">' + rc.trailer.label + ' &rarr;</a>'
    : '';

  var lyricsHtml = '';
  if (rc.lyrics) {
    lyricsHtml = '<div class="pop-lyrics"><div class="pop-lyrics-title">' + rc.lyrics.title + '</div>';
    rc.lyrics.verses.forEach(function (verse) {
      lyricsHtml +=
        '<div class="pop-lyrics-verse">' +
          '<div class="pop-lyrics-col pop-lyrics-original">' + verse.original.replace(/\n/g, '<br>') + '</div>' +
          '<div class="pop-lyrics-col pop-lyrics-translation">' + verse.translation.replace(/\n/g, '<br>') + '</div>' +
        '</div>';
    });
    lyricsHtml += '</div>';
  }

  var posterHtml = '';
  if (rc.poster || rc.posterSecondary) {
    posterHtml = '<div class="pop-poster">';
    if (rc.poster) {
      posterHtml +=
        '<img src="' + rc.poster.url + '" alt="' + rc.poster.caption + '" class="img-zoomable" data-caption="' + rc.poster.caption + '">' +
        '<div class="pop-img-caption">' + rc.poster.caption + '</div>';
    }
    if (rc.posterSecondary) {
      posterHtml +=
        '<img src="' + rc.posterSecondary.url + '" alt="' + rc.posterSecondary.caption + '" class="pop-poster-secondary img-zoomable" data-caption="' + rc.posterSecondary.caption + '">' +
        '<div class="pop-img-caption">' + rc.posterSecondary.caption + '</div>';
    }
    posterHtml += '</div>';
  }

  var galleryHtml = '';
  if (rc.gallery && rc.gallery.length) {
    galleryHtml = '<div class="pop-gallery">';
    rc.gallery.forEach(function (img) {
      galleryHtml +=
        '<div class="pop-gallery-item">' +
          '<img src="' + img.url + '" alt="' + img.caption + '" class="img-zoomable" data-caption="' + img.caption + '">' +
          '<div class="pop-img-caption">' + img.caption + '</div>' +
        '</div>';
    });
    galleryHtml += '</div>';
  }

  var footnotesHtml = '';
  if (rc.footnotes && rc.footnotes.length) {
    footnotesHtml = '<div class="pop-footnotes">';
    rc.footnotes.forEach(function (fn) {
      footnotesHtml +=
        '<div id="fn-' + fnKey + '-' + fn.id + '" class="pop-footnote">' +
          '[' + fn.id + '] <a href="' + fn.url + '" target="_blank" rel="noopener">' + fn.source + '</a>' +
        '</div>';
    });
    footnotesHtml += '</div>';
  }

  var textCol = '<div class="pop-rich-text">' + bodyHtml + readMoreHtml + trailerHtml + lyricsHtml + '</div>';
  var bodyContent = posterHtml
    ? '<div class="pop-rich-layout">' + textCol + posterHtml + '</div>'
    : textCol;

  card.innerHTML =
    heroHtml +
    '<div class="pop-rich-body">' + bodyContent + galleryHtml + footnotesHtml + '</div>';

  return card;
}

// -- Lightbox -------------------------------------------------------
function openLightbox(url, caption) {
  galleryImages = [];
  document.getElementById('lightbox-img').src = url;
  document.getElementById('lightbox-caption').textContent = caption;
  document.getElementById('lightbox-description').textContent = '';
  document.getElementById('lightbox-counter').textContent = '';
  var lb = document.getElementById('lightbox');
  lb.classList.remove('hidden', 'lightbox--gallery');
}

function openGalleryLightbox(index) {
  galleryIndex = index;
  var item = galleryImages[index];
  document.getElementById('lightbox-img').src = item.url;
  document.getElementById('lightbox-caption').textContent = item.caption || '';
  document.getElementById('lightbox-description').textContent = item.description || '';
  document.getElementById('lightbox-counter').textContent =
    galleryImages.length > 1 ? (index + 1) + ' / ' + galleryImages.length : '';
  var lb = document.getElementById('lightbox');
  lb.classList.remove('hidden');
  lb.classList.add('lightbox--gallery');
}

function setupLightbox() {
  var lb = document.getElementById('lightbox');

  function closeLightbox() {
    lb.classList.add('hidden');
    lb.classList.remove('lightbox--gallery');
  }

  document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });

  document.querySelector('.lightbox-prev').addEventListener('click', function (e) {
    e.stopPropagation();
    if (galleryImages.length) openGalleryLightbox((galleryIndex - 1 + galleryImages.length) % galleryImages.length);
  });
  document.querySelector('.lightbox-next').addEventListener('click', function (e) {
    e.stopPropagation();
    if (galleryImages.length) openGalleryLightbox((galleryIndex + 1) % galleryImages.length);
  });

  document.addEventListener('keydown', function (e) {
    if (lb.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft'  && galleryImages.length) openGalleryLightbox((galleryIndex - 1 + galleryImages.length) % galleryImages.length);
    if (e.key === 'ArrowRight' && galleryImages.length) openGalleryLightbox((galleryIndex + 1) % galleryImages.length);
  });

  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('img-zoomable')) {
      openLightbox(e.target.src, e.target.dataset.caption || e.target.alt);
    }
  });
}
