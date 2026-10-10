/**
 * NOW TV UK - Master Interactive JavaScript
 * Comprehensive interactive engine for channels, sports fixtures,
 * in-browser player simulator, setup wizard, modals & WhatsApp checkout.
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdownTimer();
  initHeaderScroll();
  initMobileNav();
  initChannelChecker();
  initSportsFixtures();
  initCinemaShowcase();
  initPlayerSimulator();
  initDeviceTabs();
  initSetupWizard();
  initFaqAccordion();
  initModals();
  initCodeCopyButtons();
});

/* ==========================================================================
   1. Announcement Matchday Countdown Timer
   ========================================================================== */
function initCountdownTimer() {
  const timerEl = document.getElementById('matchday-timer');
  if (!timerEl) return;

  // 5 hours 42 mins 19 seconds target countdown
  let totalSeconds = 5 * 3600 + 42 * 60 + 19;

  setInterval(() => {
    if (totalSeconds > 0) totalSeconds--;
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const s = String(totalSeconds % 60).padStart(2, '0');
    timerEl.textContent = `${h}:${m}:${s}`;
  }, 1000);
}

/* ==========================================================================
   2. Sticky Header Scroll Effect
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   3. Mobile Drawer Navigation
   ========================================================================== */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger-btn');
  const drawer = document.getElementById('mobile-drawer');
  if (!hamburger || !drawer) return;

  hamburger.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      drawer.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    } else {
      drawer.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
    }
  });

  // Close when clicking any link inside drawer
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   4. Interactive Channel Search & Checker Engine
   ========================================================================== */
const CHANNELS_DATA = [
  { name: 'Sky Sports Premier League', cat: 'sports', res: '4K UHD', icon: '⚽', desc: 'Direct Stadium Feed 60FPS' },
  { name: 'Sky Sports Main Event', cat: 'sports', res: '4K UHD', icon: '🏆', desc: 'Live Derby & F1 Stadium Audio' },
  { name: 'Sky Sports F1 4K', cat: 'sports', res: '4K UHD', icon: '🏎️', desc: 'On-Board & Pitlane Audio Feeds' },
  { name: 'TNT Sports 1 Ultra HD', cat: 'sports', res: '4K UHD', icon: '⚽', desc: 'UEFA Champions League Live' },
  { name: 'TNT Sports 2 HD', cat: 'sports', res: 'FHD', icon: '🏉', desc: 'Premiership Rugby & Serie A' },
  { name: 'TNT Sports Box Office', cat: 'sports', res: '4K UHD', icon: '🥊', desc: 'PPV Fight Nights & Title Bouts' },
  { name: 'DAZN 1 HD UK', cat: 'sports', res: 'FHD', icon: '🥊', desc: 'Championship Boxing & Matchroom' },
  { name: 'BBC One London HD', cat: 'uk', res: 'FHD', icon: '🇬🇧', desc: 'Regional News & Prime Entertainment' },
  { name: 'BBC Two HD', cat: 'uk', res: 'FHD', icon: '🇬🇧', desc: 'Documentaries & British Dramas' },
  { name: 'ITV 1 HD', cat: 'uk', res: 'FHD', icon: '🇬🇧', desc: 'Live Shows & Saturday Night TV' },
  { name: 'Channel 4 HD', cat: 'uk', res: 'FHD', icon: '🇬🇧', desc: 'Original Series, Comedy & Films' },
  { name: 'Sky Showcase HD', cat: 'uk', res: 'FHD', icon: '📺', desc: 'Flagship Sky Entertainment' },
  { name: 'Sky Atlantic HD', cat: 'cinema', res: '4K UHD', icon: '🎬', desc: 'HBO Dramas & Succession' },
  { name: 'Sky Cinema Premiere 4K', cat: 'cinema', res: '4K UHD', icon: '🍿', desc: 'New Theatrical Releases Weekly' },
  { name: 'Sky Cinema Action HD', cat: 'cinema', res: 'FHD', icon: '💥', desc: 'High-Octane Blockbusters' },
  { name: 'HBO Max Direct', cat: 'cinema', res: '4K UHD', icon: '🎥', desc: 'Warner Bros & Original Hits' },
  { name: 'Discovery Channel HD', cat: 'uk', res: 'FHD', icon: '🧭', desc: 'Science, Exploration & Nature' },
  { name: 'National Geographic Wild', cat: 'uk', res: 'FHD', icon: '🦁', desc: 'Wildlife in Crystal High Def' },
  { name: 'ESPN HD USA', cat: 'us', res: 'FHD', icon: '🏈', desc: 'NFL, NBA & College GameDay' },
  { name: 'CBS Sports Network', cat: 'us', res: 'FHD', icon: '🏀', desc: 'NCAA March Madness & US Sports' },
  { name: 'Fox Sports 1 (FS1)', cat: 'us', res: 'FHD', icon: '⚾', desc: 'MLB, NASCAR & US Soccer' },
  { name: 'Cartoon Network UK', cat: 'kids', res: 'FHD', icon: '👶', desc: 'Adventure Time & Classic Cartoons' },
  { name: 'Disney Junior HD', cat: 'kids', res: 'FHD', icon: '✨', desc: 'Safe Fun Family Content 24/7' },
  { name: 'Nickelodeon HD', cat: 'kids', res: 'FHD', icon: '🎈', desc: 'Kids Favorites & Nick Boxsets' },
  { name: 'Canal+ Sport France', cat: 'intl', res: '4K UHD', icon: '🌍', desc: 'Ligue 1 & European Champions' },
  { name: 'Sky Sport Bundesliga 4K', cat: 'intl', res: '4K UHD', icon: '🇩🇪', desc: 'German Football & DFB Pokal' },
  { name: 'Movistar LaLiga 4K', cat: 'intl', res: '4K UHD', icon: '🇪🇸', desc: 'Real Madrid & Barcelona Live' }
];

function initChannelChecker() {
  const searchInput = document.getElementById('channel-search-input');
  const tabs = document.querySelectorAll('.channel-tab-btn');
  const grid = document.getElementById('channels-grid');
  const counterEl = document.getElementById('channels-match-count');

  if (!grid) return;

  let currentCategory = 'all';
  let currentQuery = '';

  function renderChannels() {
    grid.innerHTML = '';
    const filtered = CHANNELS_DATA.filter(ch => {
      const matchesCat = currentCategory === 'all' || ch.cat === currentCategory;
      const matchesQuery = ch.name.toLowerCase().includes(currentQuery.toLowerCase()) ||
                           ch.desc.toLowerCase().includes(currentQuery.toLowerCase());
      return matchesCat && matchesQuery;
    });

    if (counterEl) {
      counterEl.textContent = `${filtered.length} channels available`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; color: var(--now-text-muted);">
          <div style="font-size: 2.2rem; margin-bottom: 10px;">🔍</div>
          <h4 style="color:#fff; margin-bottom: 6px;">Channel Not Found in Quick Preview?</h4>
          <p style="font-size:0.9rem; max-width:480px; margin:0 auto 16px;">We carry over 45,000+ live channels globally. Message us on WhatsApp and we will confirm your exact regional feed instantly!</p>
          <a href="https://wa.me/447988031110?text=Hello%20NOW%20TV!%20Do%20you%20have%20the%20channel%20named%20${encodeURIComponent(currentQuery)}%3F" target="_blank" class="btn btn-primary btn-sm">Ask on WhatsApp →</a>
        </div>
      `;
      return;
    }

    filtered.forEach(ch => {
      const card = document.createElement('div');
      card.className = 'channel-card';
      const is4K = ch.res.includes('4K');
      card.innerHTML = `
        <div class="channel-info">
          <div class="channel-icon-pill">${ch.icon}</div>
          <div class="channel-details">
            <h4>${ch.name}</h4>
            <div class="channel-genre">${ch.desc}</div>
          </div>
        </div>
        <span class="channel-res-badge ${is4K ? 'uhd-4k' : ''}">${ch.res}</span>
      `;
      grid.appendChild(card);
    });
  }

  // Search input event
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentQuery = e.target.value.trim();
      renderChannels();
    });
  }

  // Category buttons
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-cat') || 'all';
      renderChannels();
    });
  });

  renderChannels();
}

/* ==========================================================================
   5. Live Match Center & Sports Fixtures Switcher
   ========================================================================== */
const SPORTS_FIXTURES = {
  pl: [
    { comp: 'Premier League', home: 'Arsenal', away: 'Leeds United', homeCrest: 'https://crests.football-data.org/57.png', awayCrest: 'https://crests.football-data.org/341.png', score: '2 - 1', time: '67\' LIVE', live: true, channel: 'Sky Sports Premier League 4K' },
    { comp: 'Premier League', home: 'Chelsea', away: 'Bournemouth', homeCrest: 'https://crests.football-data.org/61.png', awayCrest: 'https://crests.football-data.org/1044.png', score: 'vs', time: 'Sat 15:00 (No Blackout)', live: false, channel: 'Sky Sports Main Event 4K' },
    { comp: 'Premier League', home: 'Liverpool', away: 'Man City', homeCrest: 'https://crests.football-data.org/64.png', awayCrest: 'https://crests.football-data.org/65.png', score: 'vs', time: 'Sun 16:30', live: false, channel: 'Sky Sports Premier League 4K' }
  ],
  ucl: [
    { comp: 'UEFA Champions League', home: 'Real Madrid', away: 'Bayern Munich', homeCrest: 'https://crests.football-data.org/86.png', awayCrest: 'https://crests.football-data.org/5.png', score: 'vs', time: 'Wed 20:00', live: false, channel: 'TNT Sports Ultimate 4K' },
    { comp: 'UEFA Champions League', home: 'Barcelona', away: 'Paris Saint-Germain', homeCrest: 'https://crests.football-data.org/81.png', awayCrest: 'https://crests.football-data.org/524.png', score: 'vs', time: 'Tue 20:00', live: false, channel: 'TNT Sports 1 Ultra HD' }
  ],
  f1: [
    { comp: 'Formula 1 Grand Prix', home: 'Silverstone GP', away: 'Pole: Verstappen', homeCrest: '', awayCrest: '', score: '4K HDR', time: 'Sun 15:00', live: false, channel: 'Sky Sports F1 4K UHD' }
  ],
  ufc: [
    { comp: 'UFC 315 World Championship', home: 'Aspinall', away: 'Gane', homeCrest: '', awayCrest: '', score: 'MAIN EVENT', time: 'Sat 03:00 GMT', live: false, channel: 'TNT Sports Box Office PPV' }
  ]
};

function initSportsFixtures() {
  const tabs = document.querySelectorAll('.sport-tab-btn');
  const grid = document.getElementById('fixtures-grid');
  if (!grid) return;

  function renderFixtures(cat) {
    const list = SPORTS_FIXTURES[cat] || SPORTS_FIXTURES.pl;
    grid.innerHTML = '';

    list.forEach(item => {
      const card = document.createElement('div');
      card.className = `fixture-card ${item.live ? 'is-live' : ''}`;
      card.innerHTML = `
        <div class="fixture-top">
          <span class="fixture-competition">${item.comp}</span>
          <div class="fixture-badge-status ${item.live ? 'live' : ''}">
            ${item.live ? '<span class="pulse-dot"></span> LIVE' : 'UPCOMING'}
          </div>
        </div>
        <div class="fixture-matchup">
          <div class="fixture-team">
            ${item.homeCrest ? `<img src="${item.homeCrest}" alt="${item.home}" class="fixture-team-logo">` : '<div style="font-size:2rem">🏎️</div>'}
            <div class="fixture-team-name">${item.home}</div>
          </div>
          <div class="fixture-vs">
            <div class="fixture-live-score">${item.score}</div>
            <div style="font-size:0.75rem; color:${item.live ? 'var(--now-red)' : 'var(--now-text-muted)'}; margin-top:4px;">${item.time}</div>
          </div>
          <div class="fixture-team">
            ${item.awayCrest ? `<img src="${item.awayCrest}" alt="${item.away}" class="fixture-team-logo">` : '<div style="font-size:2rem">🏁</div>'}
            <div class="fixture-team-name">${item.away}</div>
          </div>
        </div>
        <div class="fixture-bottom">
          <div class="fixture-broadcast-channel">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21 3H3C1.9 3 1 3.9 1 5V17C1 18.1 1.9 19 3 19H8V21H16V19H21C22.1 19 23 18.1 23 17V5C23 3.9 22.1 3 21 3ZM21 17H3V5H21V17Z"/></svg>
            ${item.channel}
          </div>
          <button class="btn btn-outline btn-sm open-trial-modal-btn">Watch in 4K →</button>
        </div>
      `;
      grid.appendChild(card);
    });

    // Reattach trial modal clicks
    grid.querySelectorAll('.open-trial-modal-btn').forEach(b => {
      b.addEventListener('click', () => openModal('trial-modal'));
    });
  }

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      renderFixtures(btn.getAttribute('data-sport'));
    });
  });

  renderFixtures('pl');
}

/* ==========================================================================
   6. Cinema & Boxsets Showcase + Preview Modal
   ========================================================================== */
const MOVIES_DATA = [
  { id: 1, title: 'Spider-Man: Brand New Day', year: 2026, type: 'Film', rating: '8.2', poster: 'https://image.tmdb.org/t/p/w342/bjiS5ipwxb9JFy3XRRN4OAilSeX.jpg', cat: 'movies', synopsis: 'Peter Parker navigates a fractured timeline while confronting dangerous new adversaries threatening the streets of Manhattan.' },
  { id: 2, title: 'Insidious: Out of the Further', year: 2026, type: 'Film', rating: '7.4', poster: 'https://image.tmdb.org/t/p/w342/4tTrW9dXCByS5wt2pXVWb58zNjz.jpg', cat: 'movies', synopsis: 'The Lambert family delves once more into the deepest shadows of the spirit world to rescue a trapped soul.' },
  { id: 3, title: 'Digger', year: 2026, type: 'Film', rating: '7.5', poster: 'https://image.tmdb.org/t/p/w342/1ATXKrIPJyKNwnJ6lcG088Sa6zi.jpg', cat: 'movies', synopsis: 'The most powerful leader embarks on a high-stakes mission across subterranean territories before catastrophic fallout unfolds.' },
  { id: 4, title: 'Fall 2: Deadpoint', year: 2026, type: 'Film', rating: '6.9', poster: 'https://image.tmdb.org/t/p/w342/fgSm5ylwiXbIHn8UbUXDjk9RRu4.jpg', cat: 'movies', synopsis: 'Extreme climbers get marooned at the apex of an offshore antenna array with zero communication and impending storms.' },
  { id: 5, title: 'Lanterns', year: 2026, type: 'Series', rating: '8.3', poster: 'https://image.tmdb.org/t/p/w342/gpC7h43xPMEV3goYMQShfJbTtLq.jpg', cat: 'series', synopsis: 'Two intergalactic lawmen investigate an ancient mystery unfolding in the American heartland.' },
  { id: 6, title: 'East of Eden', year: 2026, type: 'Series', rating: '7.9', poster: 'https://image.tmdb.org/t/p/w342/axdUor6gLMTrrB1UF4Qfy0TTSyX.jpg', cat: 'series', synopsis: 'A generational conflict between two brothers spirals when an alluring stranger arrives in the Salinas Valley.' },
  { id: 7, title: 'Ted Lasso', year: 2020, type: 'Series', rating: '8.4', poster: 'https://image.tmdb.org/t/p/w342/eXjk4W4robXs7l1YXwaXMv4f2qb.jpg', cat: 'series', synopsis: 'An American college football coach takes charge of an English Premier League team with relentless optimism.' },
  { id: 8, title: 'Slow Horses', year: 2022, type: 'Series', rating: '8.0', poster: 'https://image.tmdb.org/t/p/w342/uRHsiw1wLxPHFXkkv4Ix1s0O6f4.jpg', cat: 'series', synopsis: 'A dysfunctional team of MI5 rejects led by Jackson Lamb blunder their way into uncovering UK security conspiracies.' }
];

function initCinemaShowcase() {
  const grid = document.getElementById('movies-grid');
  const tabs = document.querySelectorAll('.media-tab-btn');
  if (!grid) return;

  function render(filter) {
    grid.innerHTML = '';
    const filtered = MOVIES_DATA.filter(item => {
      if (filter === 'all') return true;
      if (filter === 'movies') return item.type === 'Film';
      if (filter === 'series') return item.type === 'Series';
      return true;
    });

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'movie-card';
      card.innerHTML = `
        <div class="movie-poster-wrap">
          <img src="${item.poster}" alt="${item.title}" class="movie-poster" loading="lazy">
          <span class="movie-badge-4k">4K UHD</span>
          <span class="movie-rating">★ ${item.rating}</span>
          <div class="movie-play-overlay">
            <div class="movie-play-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5V19L19 12L8 5Z"/></svg>
            </div>
          </div>
        </div>
        <div class="movie-info">
          <div class="movie-title">${item.title}</div>
          <div class="movie-meta">
            <span>${item.year}</span>
            <span>${item.type}</span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        openMoviePreview(item);
      });

      grid.appendChild(card);
    });
  }

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      render(btn.getAttribute('data-filter'));
    });
  });

  render('all');
}

function openMoviePreview(movie) {
  const modal = document.getElementById('movie-preview-modal');
  if (!modal) return;

  document.getElementById('movie-preview-title').textContent = movie.title;
  document.getElementById('movie-preview-year').textContent = movie.year;
  document.getElementById('movie-preview-type').textContent = movie.type;
  document.getElementById('movie-preview-rating').textContent = `★ ${movie.rating} / 10 (TMDB)`;
  document.getElementById('movie-preview-desc').textContent = movie.synopsis;
  document.getElementById('movie-preview-poster').src = movie.poster;

  openModal('movie-preview-modal');
}

/* ==========================================================================
   7. In-Browser Live TV Player Simulator
   ========================================================================== */
function initPlayerSimulator() {
  const channels = document.querySelectorAll('.player-channel-item');
  const canvas = document.getElementById('player-canvas');
  const currentTitle = document.getElementById('player-current-channel');
  const playBtn = document.getElementById('player-play-btn');
  const bitrates = document.querySelectorAll('.player-bitrate-opt');

  if (!canvas) return;

  const streamBackdrops = {
    'sky-sports': 'https://guardiantv.net/wp-content/themes/guardiantv/assets/img/hero-players.jpg',
    'bbc-one': 'https://image.tmdb.org/t/p/w1280/b7t3r39Oll5qPxBKzLZ8eHMBD7l.jpg',
    'tnt-sports': 'https://guardiantv.net/wp-content/themes/guardiantv/assets/img/live-sports-header.webp',
    'sky-cinema': 'https://image.tmdb.org/t/p/w1280/70RZX7kNjA0Qjn6HigB1oMvFJ8R.jpg',
    'hbo-max': 'https://guardiantv.net/wp-content/themes/guardiantv/assets/img/poster-wall.webp'
  };

  channels.forEach(btn => {
    btn.addEventListener('click', () => {
      channels.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const channelKey = btn.getAttribute('data-channel');
      const name = btn.querySelector('.p-name').textContent;

      if (currentTitle) currentTitle.textContent = name;
      if (streamBackdrops[channelKey]) {
        canvas.style.backgroundImage = `url('${streamBackdrops[channelKey]}')`;
      }
      showToast(`Switched to: ${name} (4K 60FPS)`);
    });
  });

  if (playBtn) {
    let isPlaying = true;
    playBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      playBtn.innerHTML = isPlaying
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19H10V5H6V19ZM14 5V19H18V5H14Z"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5V19L19 12L8 5Z"/></svg>';
      showToast(isPlaying ? 'Stream Resumed (Live Stadium Feed)' : 'Stream Paused');
    });
  }
}

/* ==========================================================================
   8. Device Setup Tabs
   ========================================================================== */
function initDeviceTabs() {
  const tabs = document.querySelectorAll('.device-tab-btn');
  const panels = document.querySelectorAll('.device-guide-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-device');
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const panel = document.getElementById(`guide-${target}`);
      if (panel) panel.classList.add('active');
    });
  });
}

/* ==========================================================================
   9. Interactive Setup Wizard ("Start Your Setup")
   ========================================================================== */
function initSetupWizard() {
  const wizard = document.getElementById('setup-wizard');
  if (!wizard) return;

  let currentStep = 1;
  const selections = {
    device: 'Amazon Firestick',
    app: 'TiviMate Premium',
    pass: '12 Months (£69.99)'
  };

  const steps = wizard.querySelectorAll('.wizard-step-content');
  const nodes = wizard.querySelectorAll('.wizard-step-node');
  const nextBtns = wizard.querySelectorAll('.wizard-next-btn');
  const prevBtns = wizard.querySelectorAll('.wizard-prev-btn');

  function updateWizardUI() {
    steps.forEach((s, idx) => {
      s.classList.toggle('active', idx + 1 === currentStep);
    });

    nodes.forEach((n, idx) => {
      n.classList.remove('active', 'completed');
      if (idx + 1 === currentStep) n.classList.add('active');
      else if (idx + 1 < currentStep) n.classList.add('completed');
    });
  }

  // Handle clickable options
  wizard.querySelectorAll('.wizard-option-card').forEach(card => {
    card.addEventListener('click', () => {
      const parent = card.closest('.wizard-options-grid');
      parent.querySelectorAll('.wizard-option-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      const cat = card.getAttribute('data-wizard-cat');
      const val = card.getAttribute('data-wizard-val');
      if (cat) selections[cat] = val;
    });
  });

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep < 4) {
        currentStep++;
        if (currentStep === 4) {
          // Render summary
          document.getElementById('summary-device').textContent = selections.device;
          document.getElementById('summary-app').textContent = selections.app;
          document.getElementById('summary-pass').textContent = selections.pass;
        }
        updateWizardUI();
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateWizardUI();
      }
    });
  });

  // Finish wizard WhatsApp trigger
  const finishBtn = document.getElementById('wizard-finish-whatsapp-btn');
  if (finishBtn) {
    finishBtn.addEventListener('click', () => {
      const text = `Hello NOW TV! I completed my setup configuration: Device: ${selections.device}, App: ${selections.app}, Pass: ${selections.pass}. Please send my login details now!`;
      window.open(`https://wa.me/447988031110?text=${encodeURIComponent(text)}`, '_blank');
    });
  }
}

/* ==========================================================================
   10. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(i => i.classList.remove('open'));
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}

/* ==========================================================================
   11. 1-Click Code Copy
   ========================================================================== */
function initCodeCopyButtons() {
  document.querySelectorAll('.copy-code-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.getAttribute('data-code') || '289018';
      navigator.clipboard.writeText(code).then(() => {
        showToast(`Downloader Code ${code} copied to clipboard!`);
      }).catch(() => {
        showToast(`Downloader Code: ${code}`);
      });
    });
  });
}

/* ==========================================================================
   12. Modals (Trial & Order & Movie)
   ========================================================================== */
function initModals() {
  // Open trial modal
  document.querySelectorAll('.open-trial-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('trial-modal');
    });
  });

  // Open order modal from pricing
  document.querySelectorAll('.open-order-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const plan = btn.getAttribute('data-plan') || '12 Months Pass (£69.99)';
      const select = document.getElementById('order-modal-plan-select');
      if (select) select.value = plan;
      openModal('order-modal');
    });
  });

  // Close modals
  document.querySelectorAll('.modal-close-btn, .modal-overlay').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === el) {
        closeAllModals();
      }
    });
  });

  // Handle Trial Form Submit
  const trialForm = document.getElementById('trial-form');
  if (trialForm) {
    trialForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('trial-name').value;
      const device = document.getElementById('trial-device').value;
      const text = `Hello NOW TV! My name is ${name}. I would like to activate my 24-Hour Free Trial for device: ${device}. Please send credentials.`;
      window.open(`https://wa.me/447988031110?text=${encodeURIComponent(text)}`, '_blank');
      closeAllModals();
      showToast('Free Trial request created! Redirecting to WhatsApp...');
    });
  }

  // Handle Order Form Submit
  const orderForm = document.getElementById('order-form');
  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('order-name').value;
      const plan = document.getElementById('order-modal-plan-select').value;
      const device = document.getElementById('order-device').value;
      const text = `Hello NOW TV! My name is ${name}. I want to order the ${plan} for my ${device}. Please send activation invoice and login!`;
      window.open(`https://wa.me/447988031110?text=${encodeURIComponent(text)}`, '_blank');
      closeAllModals();
      showToast('Order received! Connecting you to 24/7 activation specialist...');
    });
  }
}

function openModal(id) {
  closeAllModals();
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
  document.body.style.overflow = '';
}

/* ==========================================================================
   13. Toast Notification Engine
   ========================================================================== */
function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--now-primary)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
