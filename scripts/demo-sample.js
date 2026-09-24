/* ============================================================================
   demo-sample.js — the vault the demo opens with.

   Served only by the demo (scripts/build-demo.mjs injects it); the plugin
   never loads it, and neither does the page when it is opened from disk.

   Why it exists: the page is a vault viewer with no vault, so a visitor who
   does not immediately drag a folder onto it is looking at an empty starfield
   — which is a picture of nothing, and the one thing the demo exists to avoid.
   Sixty-six notes across eight folders arrive before the boot screen is
   dismissed, so the first thing anyone sees is the thing being demonstrated.
   Dropping a real folder replaces it, which is the whole point of being here.

   It goes through the same public entry a host uses — vaultOrrery.load() —
   rather than reaching inside the engine, so it cannot drift from what the
   plugin does with a real vault: same parser, same graph, same gates.

   Nothing here touches the network. The notes are written out below.
   ========================================================================= */
(function () {
  'use strict';

  /* ---- the notes -------------------------------------------------------
     An amateur astronomer's notebook, because the vault should look like one
     someone kept rather than like generated filler: the folders are the parts
     of a real subject, and notes cite each other the way notes do — mostly
     within a folder, occasionally across, which is what gives the link web
     something to draw. */
  var FOLDERS = {
    'Astronomy': ['Orbital elements', 'Kepler problem', 'Roche limit', 'Tidal locking',
                  'Precession', 'Sidereal day', 'Apsis', 'Inclination', 'Ephemeris',
                  'Occultation', 'Libration', 'Synodic period'],
    'Optics': ['Diffraction', 'Airy disc', 'Point spread function', 'Seeing',
               'Chromatic aberration', 'Coma', 'Focal ratio', 'Coatings',
               'Collimation', 'Vignetting'],
    'Instruments': ['Orrery', 'Armillary sphere', 'Sextant', 'Meridian circle',
                    'Equatorial mount', 'Clock drive', 'Filar micrometer',
                    'Spectroscope', 'Photometer'],
    'Mechanics': ['Two-body problem', 'Three-body problem', 'Lagrange points',
                  'Angular momentum', 'Escape velocity', 'Perturbation',
                  'Hill sphere', 'Restricted problem'],
    'Notation': ['Julian date', 'Right ascension', 'Declination', 'Magnitude scale',
                 'Epoch J2000', 'Bayer designation', 'Messier catalogue'],
    'Field Notes': ['First light', 'Perseids 1996', 'Leonids 2001', 'Venus transit 2004',
                    'Venus transit 2012', 'Eclipse 2017', 'Eclipse 2024'],
    'Reading': ['Sidereus Nuncius', 'Principia', 'Almagest', 'De revolutionibus',
                'Astronomia nova', 'Harmonices Mundi'],
    'Workbench': ['Grinding a mirror', 'Foucault test', 'Pitch lap', 'Figuring',
                  'Aluminising', 'Tube assembly', 'Baffles']
  };

  /* Dates spread over three years, so Genesis has a formation to replay rather
     than sixty-six notes arriving at once. Deterministic, so the demo is the
     same cosmos for everyone who opens it and a screenshot keeps matching. */
  function build() {
    var all = [];
    Object.keys(FOLDERS).forEach(function (folder) {
      FOLDERS[folder].forEach(function (title) { all.push({ folder: folder, title: title }); });
    });

    var seed = 20260916;
    function rnd() { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; }

    var start = Date.UTC(2023, 0, 10), end = Date.UTC(2026, 8, 1);

    return all.map(function (n, i) {
      var when = new Date(start + (end - start) * ((i / all.length) * 0.75 + rnd() * 0.25));
      var date = when.toISOString().slice(0, 10);

      var same = all.filter(function (o) { return o.folder === n.folder && o.title !== n.title; });
      var other = all.filter(function (o) { return o.folder !== n.folder; });
      var picks = [];
      function take(pool, k) {
        for (var j = 0; j < k && pool.length; j++) {
          var c = pool[(rnd() * pool.length) | 0];
          if (c && picks.indexOf(c.title) < 0) picks.push(c.title);
        }
      }
      take(same, 1 + ((rnd() * 3) | 0));
      take(other, rnd() < 0.55 ? 1 : 0);
      /* Three links to notes that were never written, because a notebook
         has those, and because they are what the black holes are made of. */
      if (n.title === 'Precession') picks.push('Nutation');
      if (n.title === 'Apsis') picks.push('Titius-Bode law');
      if (n.title === 'Airy disc') picks.push('Rayleigh criterion');

      var body = '---\ndate: ' + date + '\ntags: [' +
        n.folder.toLowerCase().replace(/ /g, '-') + ']\n---\n\n' +
        '# ' + n.title + '\n\n' +
        n.title + ', written up while working through it rather than afterwards.\n\n' +
        picks.map(function (p) { return '- [[' + p + ']]'; }).join('\n') + '\n';

      /* File times, which a dropped folder has and generated text does not:
         created on the note's own date, touched some weeks after, and the
         last three touched in the past few days — so RECENT WORK has
         something to light and the opening comet has somewhere to land. */
      var ct = when.getTime();
      var mt = i >= all.length - 3 ? Date.now() - rnd() * 4 * 86400000
                                   : ct + rnd() * 30 * 86400000;
      return {
        path: n.folder + '/' + n.title + '.md',
        file: { text: function () { return Promise.resolve(body); } },
        meta: { mtime: mt, ctime: ct }
      };
    });
  }

  /* ---- say that it is a sample ----------------------------------------
     A demo that quietly shows made-up notes as though they were yours is a
     demo nobody can trust twice. The line goes on the boot screen, above the
     two buttons, where the choice is actually being made. */
  var NOTE = {
    en: 'Showing a sample vault. Drop your own folder to see yours instead — it is read in this browser and goes nowhere.',
    ko: '샘플 볼트를 보고 있습니다. 직접 만든 폴더를 끌어다 놓으면 당신의 볼트가 그려집니다 — 브라우저 안에서만 읽고 어디로도 보내지 않습니다.',
    ja: 'サンプルのボルトを表示しています。フォルダをドロップすればご自身のものが描かれます — このブラウザ内で読むだけで、どこにも送信しません。',
    zh: '正在显示示例仓库。拖入你自己的文件夹即可查看你的仓库 — 仅在此浏览器中读取，不会发送到任何地方。'
  };

  function lang() {
    var chip = document.querySelector('#blangsel u.on');
    if (chip && chip.dataset && chip.dataset.l && NOTE[chip.dataset.l]) return chip.dataset.l;
    var l = (navigator.language || 'en').toLowerCase();
    if (l.indexOf('ko') === 0) return 'ko';
    if (l.indexOf('ja') === 0) return 'ja';
    if (l.indexOf('zh') === 0) return 'zh';
    return 'en';
  }

  function notice() {
    var pick = document.getElementById('bpick');
    if (!pick || document.getElementById('demo-note')) return;
    var el = document.createElement('div');
    el.id = 'demo-note';
    el.style.cssText = 'margin:10px auto 0;max-width:46em;line-height:1.5;opacity:.72;' +
                       'font-size:13px;color:#9fd8ee;font-family:var(--kr);letter-spacing:.01em;' +
                       'text-transform:none;text-align:center';
    el.textContent = NOTE[lang()];
    pick.parentNode.insertBefore(el, pick.nextSibling);

    /* With a sample behind the boot screen, START is not "begin in empty
       space" any more — it is the fastest way to see the thing working, so it
       becomes the lit button and says what it does. Opening your own folder
       stays one click away as the second choice. */
    var go = document.getElementById('b-go'), folder = document.getElementById('b-folder');
    var GO = { en: '▶ EXPLORE THE SAMPLE', ko: '▶ 샘플 둘러보기', ja: '▶ サンプルを見る', zh: '▶ 浏览示例' };
    function relabel() { if (go) go.textContent = GO[lang()]; }
    /* The engine's own footnote is about starting in empty space, which this
       page no longer does; the sample line above already says the privacy
       half of it. */
    var bnote = document.getElementById('bnote');
    if (bnote) bnote.style.display = 'none';
    if (go && folder) {
      go.classList.remove('alt'); folder.classList.add('alt');
      go.parentNode.insertBefore(go, folder);
      relabel();
    }

    /* The language chips retranslate the page; this line is not part of that
       sweep, so it follows them itself. */
    var sel = document.getElementById('blangsel');
    if (sel) sel.addEventListener('click', function () {
      setTimeout(function () { el.textContent = NOTE[lang()]; relabel(); }, 0);
    });
  }

  /* ---- load it, once the engine is there ------------------------------- */
  var tries = 0;
  (function go() {
    var api = window.vaultOrrery;
    if (!api || typeof api.load !== 'function') {
      if (tries++ < 200) { setTimeout(go, 50); }
      return;
    }
    notice();
    /* Quiet: no loading curtain and no summary toast over the boot screen —
       this vault is scenery, not something the visitor asked for. */
    api.load(build(), 'SAMPLE VAULT', { quiet: true });
  })();
})();
