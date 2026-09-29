/* ============================================================================
   demo-sample.js — the vault the demo opens with.

   Served only by the demo (scripts/build-demo.mjs injects it); the plugin
   never loads it, and neither does the page when it is opened from disk.

   Why it exists: the page is a vault viewer with no vault, so a visitor who
   does not immediately drag a folder onto it is looking at an empty starfield
   — which is a picture of nothing, and the one thing the demo exists to avoid.
   About two hundred and fifty notes across fourteen folders arrive before the
   boot screen is dismissed, so the first thing anyone sees is the thing being
   demonstrated. Dropping a real folder replaces it, which is the whole point
   of being here.

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
     of a real subject, and the notes cite each other the way notes do.

     The size is the size of a vault in daily use. Sixty-six notes read as a
     toy, and a vault several times this size is a picture of noise; around
     two hundred and fifty is where the systems have shape and the links
     between them still read as traffic rather than fog.

     Each folder carries the stretch of the three years in which it was
     mostly written, so Genesis replays a hobby growing — notation and the
     sky first, the workbench once there was a telescope to build, the camera
     last — instead of every folder filling at the same even rate. */
  var FOLDERS = [
    ['Astronomy', 0.00, 0.60, ['Orbital elements', 'Kepler problem', "Kepler's laws", 'Roche limit',
      'Tidal locking', 'Precession', 'Sidereal day', 'Solar day', 'Apsis', 'Inclination', 'Ephemeris',
      'Occultation', 'Libration', 'Synodic period', 'Sidereal period', 'Ecliptic', 'Celestial sphere',
      'Equinox', 'Solstice', 'Parallax', 'Aberration of light', 'Proper motion', 'Transit',
      'Conjunction', 'Opposition', 'Retrograde motion']],
    ['Notation', 0.00, 0.30, ['Julian date', 'Right ascension', 'Declination', 'Hour angle', 'Azimuth',
      'Altitude', 'Magnitude scale', 'Absolute magnitude', 'Epoch J2000', 'Bayer designation',
      'Flamsteed number', 'Messier catalogue', 'NGC catalogue', 'Sidereal time']],
    ['Solar System', 0.05, 0.70, ['Sun', 'Mercury', 'Venus', 'Earth', 'Moon', 'Mars', 'Phobos', 'Deimos',
      'Jupiter', 'Io', 'Europa', 'Ganymede', 'Callisto', 'Great Red Spot', 'Saturn', 'Titan',
      "Saturn's rings", 'Uranus', 'Neptune', 'Triton', 'Pluto', 'Asteroid belt', 'Kuiper belt', 'Comets']],
    ['Instruments', 0.10, 0.60, ['Orrery', 'Armillary sphere', 'Astrolabe', 'Sextant', 'Meridian circle',
      'Equatorial mount', 'Alt-azimuth mount', 'Dobsonian', 'Clock drive', 'Filar micrometer',
      'Spectroscope', 'Photometer', 'Refractor', 'Newtonian reflector', 'Cassegrain', 'Schmidt camera',
      'Finder scope', 'Barlow lens']],
    ['Optics', 0.15, 0.70, ['Diffraction', 'Airy disc', 'Point spread function', 'Seeing',
      'Chromatic aberration', 'Spherical aberration', 'Coma', 'Astigmatism', 'Focal ratio', 'Coatings',
      'Collimation', 'Vignetting', 'Resolving power', 'Dawes limit', 'Eyepiece design', 'Exit pupil',
      'Magnification', 'Field of view']],
    ['Reading', 0.00, 1.00, ['Sidereus Nuncius', 'Principia', 'Almagest', 'De revolutionibus',
      'Astronomia nova', 'Harmonices Mundi', 'Dialogue Concerning the Two Chief World Systems',
      "Burnham's Celestial Handbook", 'Turn Left at Orion', "The Backyard Astronomer's Guide",
      'Amateur Telescope Making', "Norton's Star Atlas", 'Cosmos', 'Pale Blue Dot']],
    ['History', 0.20, 0.80, ['Ptolemy', 'Copernicus', 'Tycho Brahe', 'Johannes Kepler', 'Galileo Galilei',
      'Isaac Newton', 'Christiaan Huygens', 'Giovanni Cassini', 'Charles Messier', 'William Herschel',
      'Caroline Herschel', 'Edmond Halley', 'Henrietta Leavitt', 'Edwin Hubble', 'Clyde Tombaugh',
      'Great Debate 1920']],
    ['Mechanics', 0.25, 0.75, ['Two-body problem', 'Three-body problem', 'Lagrange points',
      'Angular momentum', 'Escape velocity', 'Orbital velocity', 'Perturbation', 'Hill sphere',
      'Restricted problem', 'Vis-viva equation', 'Hohmann transfer', 'Gravity assist',
      'Orbital resonance', 'Tidal force', 'Barycentre', 'Centre of mass']],
    ['Deep Sky', 0.30, 0.90, ['M1 Crab Nebula', 'M13 Hercules Cluster', 'M31 Andromeda', 'M42 Orion Nebula',
      'M45 Pleiades', 'M51 Whirlpool', 'M57 Ring Nebula', "M81 Bode's Galaxy", 'M82 Cigar Galaxy',
      'M101 Pinwheel', 'M104 Sombrero', 'Double Cluster', 'Albireo', 'Mizar and Alcor', 'Epsilon Lyrae',
      'Veil Nebula', 'North America Nebula', 'Omega Centauri', 'Globular clusters', 'Open clusters',
      'Planetary nebulae', 'Emission nebulae', 'Galaxy types', 'Double stars']],
    ['Field Notes', 0.00, 1.00, ['Perseids 1996', 'Leonids 2001', 'Venus transit 2004', 'Venus transit 2012',
      'Mercury transit 2016', 'Eclipse 2017', 'Great conjunction 2020', 'Comet NEOWISE 2020',
      'Lunar eclipse 2022', 'First light', 'Messier marathon 2023', 'Star party 2023',
      'Jupiter opposition 2023', 'Geminids 2023', 'Double star night', 'Occultation of Aldebaran',
      'Eclipse 2024', 'Aurora May 2024', 'Galaxy season 2024', 'Saturn opposition 2024',
      'Comet Tsuchinshan-ATLAS', 'Globular night', 'Planetary nebula night', 'Moon mosaic',
      'Dark site — Big Pines', 'Dark site — Anza-Borrego', 'Messier marathon 2025', 'Star party 2025',
      'Mars opposition 2025', 'Sunspot log']],
    ['Workbench', 0.40, 0.80, ['Grinding a mirror', 'Foucault test', 'Ronchi test', 'Pitch lap', 'Polishing',
      'Figuring', 'Aluminising', 'Tube assembly', 'Baffles', 'Spider vanes', 'Secondary mirror', 'Focuser',
      'Mirror cell', 'Dew heater', 'Flocking', 'Star test', 'Rocker box', 'Teflon bearings']],
    ['Projects', 0.35, 0.95, ['Build a 10-inch Dobsonian', 'Messier list', 'Herschel 400',
      'Backyard observatory', 'Moon atlas', 'Double star log', 'Variable star estimates',
      'Club outreach talk']],
    ['Astrophotography', 0.60, 1.00, ['Stacking', 'Darks and flats', 'Guiding', 'Polar alignment',
      'Periodic error', 'Plate solving', 'Stretching', 'Narrowband filters', 'Light pollution filters',
      'Lucky imaging', 'Drizzle', 'Signal-to-noise', 'Sensor cooling', 'Gain and offset', 'Bortle scale',
      'Planetary imaging', 'Mosaic', 'Processing workflow']],
    ['Inbox', 0.85, 1.00, ['Buy an eyepiece case', 'Check the dew forecast', 'Idea — sundial on the fence',
      'Loaner scope list', 'Barlow maths', 'Untitled 3', 'Red flashlight', 'Star party packing list',
      'Clipping — first JWST images', 'Idea — spectroscope from a DVD']]
  ];

  /* ---- the links written on purpose ------------------------------------
     A real vault's link counts are nothing like even. A few notes are where
     everything goes through — the home note, a project that lists what it
     needs, a planet with moons — most say one or two things, and a few say
     nothing yet. These are the notes that were written as lists; everything
     else gets a small, uneven share below. */
  var HAND = {
    'Home': ["Kepler's laws", 'Celestial sphere', 'Right ascension', 'Sun', 'Moon', 'Jupiter',
      'Newtonian reflector', 'Seeing', 'Galileo Galilei', 'Messier list', 'Build a 10-inch Dobsonian',
      'Backyard observatory', 'Processing workflow', 'First light', 'Turn Left at Orion'],
    'Messier list': ['Messier catalogue', 'Charles Messier', 'M1 Crab Nebula', 'M13 Hercules Cluster',
      'M31 Andromeda', 'M42 Orion Nebula', 'M45 Pleiades', 'M51 Whirlpool', 'M57 Ring Nebula',
      "M81 Bode's Galaxy", 'M82 Cigar Galaxy', 'M101 Pinwheel', 'M104 Sombrero',
      'Messier marathon 2023', 'Messier marathon 2025'],
    'Build a 10-inch Dobsonian': ['Dobsonian', 'Newtonian reflector', 'Focal ratio', 'Grinding a mirror',
      'Foucault test', 'Ronchi test', 'Pitch lap', 'Polishing', 'Figuring', 'Aluminising', 'Tube assembly',
      'Baffles', 'Spider vanes', 'Secondary mirror', 'Focuser', 'Mirror cell', 'Flocking', 'Rocker box',
      'Teflon bearings', 'Star test', 'Amateur Telescope Making'],
    'Processing workflow': ['Stacking', 'Darks and flats', 'Stretching', 'Drizzle', 'Signal-to-noise',
      'Plate solving', 'Gain and offset', 'Mosaic', 'Narrowband filters'],
    'Herschel 400': ['William Herschel', 'Caroline Herschel', 'NGC catalogue', 'Globular clusters',
      'Open clusters', 'Planetary nebulae', 'Galaxy types', 'Messier list'],
    'Moon atlas': ['Moon', 'Libration', 'Moon mosaic', 'Lunar eclipse 2022', 'Occultation', 'Mosaic'],
    'Double star log': ['Double stars', 'Albireo', 'Mizar and Alcor', 'Epsilon Lyrae', 'Dawes limit',
      'Resolving power', 'Double star night', 'Filar micrometer'],
    'Backyard observatory': ['Equatorial mount', 'Polar alignment', 'Bortle scale', 'Dew heater', 'Pier'],
    'Jupiter': ['Io', 'Europa', 'Ganymede', 'Callisto', 'Great Red Spot', 'Jupiter opposition 2023',
      'Galileo Galilei', 'Orbital resonance'],
    'Saturn': ['Titan', "Saturn's rings", 'Christiaan Huygens', 'Giovanni Cassini', 'Roche limit',
      'Saturn opposition 2024'],
    'Mars': ['Phobos', 'Deimos', 'Opposition', 'Retrograde motion', 'Mars opposition 2025'],
    'Galileo Galilei': ['Sidereus Nuncius', 'Dialogue Concerning the Two Chief World Systems', 'Refractor',
      'Venus', 'Moon'],
    'Johannes Kepler': ["Kepler's laws", 'Astronomia nova', 'Harmonices Mundi', 'Tycho Brahe'],
    'Isaac Newton': ['Principia', 'Newtonian reflector', 'Two-body problem'],
    'Charles Messier': ['Messier catalogue', 'Comets'],
    'William Herschel': ['Uranus', 'Caroline Herschel', 'Herschel 400'],
    'Edmond Halley': ['Comets', 'Venus transit 2004'],
    'Edwin Hubble': ['M31 Andromeda', 'Great Debate 1920', 'Galaxy types', 'Henrietta Leavitt'],
    'Clyde Tombaugh': ['Pluto', 'Kuiper belt'],
    'Eclipse 2017': ['Sun', 'Moon', 'Eclipse 2024', 'Solar filter'],
    'Eclipse 2024': ['Eclipse 2017', 'Sun', 'Planetary imaging'],
    'Venus transit 2004': ['Venus', 'Transit', 'Parallax'],
    'Venus transit 2012': ['Venus transit 2004', 'Transit', 'Edmond Halley'],
    'Mercury transit 2016': ['Mercury', 'Transit'],
    'Great conjunction 2020': ['Jupiter', 'Saturn', 'Conjunction'],
    'Comet NEOWISE 2020': ['Comets', 'Stacking'],
    'Occultation of Aldebaran': ['Occultation', 'Moon'],
    'First light': ['Build a 10-inch Dobsonian', 'Star test', 'M42 Orion Nebula', 'Collimation'],
    'Messier marathon 2023': ['Messier list', 'Dark site — Anza-Borrego'],
    'Messier marathon 2025': ['Messier marathon 2023', 'Messier list', 'Dark site — Anza-Borrego'],
    'Star party 2023': ['Dark site — Big Pines', 'Dobsonian'],
    'Star party 2025': ['Star party 2023', 'Club outreach talk', 'Dark site — Big Pines'],
    'Galaxy season 2024': ['M51 Whirlpool', "M81 Bode's Galaxy", 'M82 Cigar Galaxy', 'M101 Pinwheel',
      'Galaxy types'],
    'Globular night': ['M13 Hercules Cluster', 'Omega Centauri', 'Globular clusters'],
    'Planetary nebula night': ['M57 Ring Nebula', 'Planetary nebulae', 'Narrowband filters'],
    'Double star night': ['Double star log', 'Albireo', 'Epsilon Lyrae'],
    'Moon mosaic': ['Moon', 'Mosaic', 'Lucky imaging'],
    'Sunspot log': ['Sun', 'Solar filter'],
    'Newtonian reflector': ['Coma', 'Collimation', 'Secondary mirror', 'Coma corrector'],
    'Perseids 1996': ['Comets', 'Leonids 2001'],
    'Variable star estimates': ['Magnitude scale', 'Photometer'],
    'Loaner scope list': ['Dobsonian'],
    'Barlow maths': ['Barlow lens', 'Magnification'],
    'Clipping — first JWST images': ['Cassegrain'],
    'Check the dew forecast': ['Dew heater'],
    'Star party packing list': ['Dew heater', 'Red flashlight'],
    /* notes that were never written, because a notebook has those, and
       because they are what the black holes are made of */
    'Precession': ['Nutation'],
    'Apsis': ['Titius-Bode law'],
    'Airy disc': ['Rayleigh criterion']
  };

  /* ---- where a note's other links tend to go -----------------------------
     Most links stay in their own folder. The ones that leave go where the
     subject does: a night out is about an object and the telescope it was
     seen through, a person about their books. These are what the BRIDGE
     layer draws. */
  var LEAN = {
    'Astronomy': ['Mechanics', 'Notation', 'Solar System'],
    'Notation': ['Astronomy'],
    'Solar System': ['Astronomy', 'Mechanics', 'Field Notes'],
    'Instruments': ['Optics', 'History'],
    'Optics': ['Instruments', 'Workbench'],
    'Reading': ['History', 'Astronomy'],
    'History': ['Reading', 'Instruments', 'Astronomy'],
    'Mechanics': ['Astronomy', 'Solar System'],
    'Deep Sky': ['Notation', 'Field Notes'],
    'Field Notes': ['Deep Sky', 'Solar System', 'Instruments', 'Optics'],
    'Workbench': ['Optics', 'Instruments'],
    'Projects': ['Deep Sky', 'Workbench'],
    'Astrophotography': ['Deep Sky', 'Optics', 'Instruments'],
    'Inbox': []
  };

  /* a line or two of prose, so the excerpt and the mind map's reading rail
     have something to show that is not the note's own title */
  var LINES = {
    'Field Notes': ['Logged at the eyepiece, tidied up the next morning.',
      'Seeing steadied after midnight; transparency was poorer than forecast.',
      'Dew on the secondary by one in the morning.',
      'Worth going back with a darker sky and a lower power.'],
    'Reading': ['Notes taken chapter by chapter.', 'Read slowly, with the atlas open beside it.',
      'The diagrams are the part worth coming back to.'],
    'Workbench': ['Measured twice; the log is below.', 'What went wrong the first time, and the fix.',
      'Photos of the setup are in the build folder.'],
    'Inbox': ['To sort out later.', 'Quick capture.'],
    '*': ['Written up while working through it rather than afterwards.',
      'Short version first, the derivation underneath once I trust it.',
      'Came back to this after an evening outside; the picture in my head was wrong.',
      'Still unsure about one step, flagged for the next session.',
      'The clearest explanation I found is in the reading notes.']
  };

  var DSO = {
    'M1 Crab Nebula': 'Taurus', 'M13 Hercules Cluster': 'Hercules', 'M31 Andromeda': 'Andromeda',
    'M42 Orion Nebula': 'Orion', 'M45 Pleiades': 'Taurus', 'M51 Whirlpool': 'Canes Venatici',
    'M57 Ring Nebula': 'Lyra', "M81 Bode's Galaxy": 'Ursa Major', 'M82 Cigar Galaxy': 'Ursa Major',
    'M101 Pinwheel': 'Ursa Major', 'M104 Sombrero': 'Virgo', 'Double Cluster': 'Perseus',
    'Albireo': 'Cygnus', 'Mizar and Alcor': 'Ursa Major', 'Epsilon Lyrae': 'Lyra',
    'Veil Nebula': 'Cygnus', 'North America Nebula': 'Cygnus', 'Omega Centauri': 'Centaurus'
  };
  var AUTHOR = {
    'Sidereus Nuncius': 'Galileo Galilei', 'Principia': 'Isaac Newton', 'Almagest': 'Ptolemy',
    'De revolutionibus': 'Copernicus', 'Astronomia nova': 'Johannes Kepler',
    'Harmonices Mundi': 'Johannes Kepler',
    'Dialogue Concerning the Two Chief World Systems': 'Galileo Galilei',
    "Burnham's Celestial Handbook": 'Robert Burnham Jr.', 'Turn Left at Orion': 'Consolmagno & Davis',
    "The Backyard Astronomer's Guide": 'Dickinson & Dyer', 'Amateur Telescope Making': 'Albert Ingalls (ed.)',
    "Norton's Star Atlas": 'Arthur Norton', 'Cosmos': 'Carl Sagan', 'Pale Blue Dot': 'Carl Sagan'
  };
  /* which books a folder's notes were read out of */
  var SHELF = {
    'Astronomy': ['Almagest', 'De revolutionibus', 'Astronomia nova', 'Principia', "Norton's Star Atlas"],
    'Mechanics': ['Principia', 'Astronomia nova', 'Harmonices Mundi'],
    'History': ['Sidereus Nuncius', 'Almagest', 'De revolutionibus', 'Astronomia nova',
      'Dialogue Concerning the Two Chief World Systems', 'Cosmos'],
    'Deep Sky': ["Burnham's Celestial Handbook", 'Turn Left at Orion'],
    'Optics': ["The Backyard Astronomer's Guide", 'Amateur Telescope Making']
  };
  /* the notes the last few days were spent on, so RECENT WORK has something
     to light and the opening comet has somewhere to land */
  var RECENT = ['Mars opposition 2025', 'Processing workflow', 'Backyard observatory'];

  /* Deterministic, so the demo is the same cosmos for everyone who opens it
     and a screenshot keeps matching. */
  function build() {
    var seed = 20260929;
    function rnd() { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; }
    function pick(a) { return a[(rnd() * a.length) | 0]; }

    var start = Date.UTC(2023, 0, 10), end = Date.UTC(2026, 8, 1);
    var all = [{ folder: '', title: 'Home', at: 0 }];
    FOLDERS.forEach(function (f) {
      f[3].forEach(function (title, i) {
        /* in order within the folder's stretch, with some play, so a folder
           is written roughly top to bottom rather than all at once */
        var u = f[1] + (f[2] - f[1]) * Math.min(1, (i + rnd() * 1.6) / f[3].length);
        all.push({ folder: f[0], title: title, at: u });
      });
    });
    var byTitle = {};
    all.forEach(function (n) { n.out = []; n.src = []; n.inb = 0; byTitle[n.title] = n; });
    function link(a, t) {
      if (a.title === t || a.out.indexOf(t) >= 0) return;
      a.out.push(t);
      if (byTitle[t]) byTitle[t].inb++;
    }
    Object.keys(HAND).forEach(function (k) { HAND[k].forEach(function (t) { link(byTitle[k], t); }); });

    /* Everything else, in the order it was written, and uneven on purpose:
       most notes say one or two things, a few say several, and a note that
       is already cited a lot is likelier to be cited again — which is how a
       handful of ideas end up at the middle of any vault. Notes written as
       lists above keep what they have. */
    var order = all.slice().sort(function (a, b) { return a.at - b.at; });
    order.forEach(function (n) {
      if (!n.folder || n.folder === 'Inbox' || n.folder === 'Projects') return;
      var hand = HAND[n.title] ? HAND[n.title].length : 0;
      var r = rnd();
      var k = r < 0.42 ? 1 : r < 0.72 ? 2 : r < 0.88 ? 3 : r < 0.96 ? 5 : 7;
      k = Math.max(0, k - hand);
      for (var j = 0; j < k; j++) {
        var lean = LEAN[n.folder];
        var folder = rnd() < 0.68 || !lean.length ? n.folder : pick(lean);
        var pool = all.filter(function (o) { return o.folder === folder && o !== n; });
        var tot = 0;
        pool.forEach(function (o) { tot += 1 + o.inb * 0.5; });
        var x = rnd() * tot;
        for (var q = 0; q < pool.length; q++) {
          x -= 1 + pool[q].inb * 0.5;
          if (x <= 0) { link(n, pool[q].title); break; }
        }
      }
      /* The front-matter `sources:` of the notes that were read out of a
         book, which the SOURCE layer draws dashed — a second kind of link,
         the way a real vault has more than one. */
      var books = SHELF[n.folder];
      if (books && rnd() < 0.45) {
        n.src.push(pick(books));
        if (rnd() < 0.3) { var b2 = pick(books); if (n.src.indexOf(b2) < 0) n.src.push(b2); }
      }
    });

    return all.map(function (n) {
      var when = new Date(start + (end - start) * n.at);
      var date = when.toISOString().slice(0, 10);
      var tag = n.folder ? n.folder.toLowerCase().replace(/ /g, '-') : 'home';

      var fm = ['date: ' + date, 'tags: [' + tag + (rnd() < 0.08 ? ', to-review' : '') + ']'];
      if (DSO[n.title]) fm.push('constellation: ' + DSO[n.title]);
      if (AUTHOR[n.title]) fm.push('author: ' + AUTHOR[n.title], 'status: ' + pick(['read', 'read', 'reading']));
      if (n.folder === 'Projects') fm.push('status: ' + pick(['active', 'active', 'paused', 'done']));
      if (n.folder === 'Field Notes' && !/^Dark site/.test(n.title))
        fm.push('seeing: ' + (2 + ((rnd() * 4) | 0)) + '/5');
      if (n.src.length) fm.push('sources:', n.src.map(function (s) { return '  - "[[' + s + ']]"'; }).join('\n'));

      var lines = LINES[n.folder] || LINES['*'];
      var prose = [pick(lines)];
      if (rnd() < 0.5) prose.push(pick(LINES['*']));

      /* half the notes list their links, half write them into a sentence —
         the parser has to read both, and a vault has both */
      var links = '';
      if (n.out.length > 3 || (n.out.length && rnd() < 0.5)) {
        links = '\n\n## Related\n\n' + n.out.map(function (t) { return '- [[' + t + ']]'; }).join('\n');
      } else if (n.out.length) {
        var w = n.out.map(function (t) { return '[[' + t + ']]'; });
        links = ' See ' + (w.length > 1 ? w.slice(0, -1).join(', ') + ' and ' + w[w.length - 1] : w[0]) + '.';
      }
      var body = '---\n' + fm.join('\n') + '\n---\n\n# ' + n.title + '\n\n' + prose.join(' ') + links + '\n';

      /* File times, which a dropped folder has and generated text does not:
         created on the note's own date and touched some weeks after. */
      var ct = when.getTime();
      var mt = RECENT.indexOf(n.title) >= 0 ? Date.now() - rnd() * 4 * 86400000
                                            : Math.min(end, ct + rnd() * 30 * 86400000);
      return {
        path: (n.folder ? n.folder + '/' : '') + n.title + '.md',
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
