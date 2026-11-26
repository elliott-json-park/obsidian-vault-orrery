import { TFile, debounce, setIcon } from 'obsidian';
import type { OrreryApi } from './engine.generated.js';
import { mountEngine, orreryFiles } from './host';
import type VaultOrreryPlugin from './main';

/* ---- the floating orrery ---------------------------------------------------
   The cosmos with its background taken away, hung over the workspace: a
   model that turns, not a view that is used. It answers no clicks — every
   click goes through it to whatever is underneath — and the only thing that
   can be done to it is move it and size it.

   That is the whole design problem, because the two pull against each other.
   Something that ignores the pointer cannot be dragged, and something that
   takes the pointer covers a square of the note. So the box ignores the
   pointer always, and watches it from the window instead: when the pointer
   comes inside the box, a faint frame, a grip, a close button and a resize
   corner come up, and those few pixels are the only part of the whole thing
   that takes a click. The pointer leaves and it is a picture again.

   Above the workspace and the status bar, below popovers, menus and modals,
   so a page preview or a context menu is never under it.

   Main window only. A popout window is a separate document with its own
   body, and a model on each of them is a second renderer for a picture the
   reader can already see. */

/** How close the camera sits, as a share of the fitted vault (smaller is
    closer). Named for what is in the frame rather than for a number. */
export type FloatFrame = 'close' | 'medium' | 'whole';
export const FLOAT_FIT: Record<FloatFrame, number> = { close: 0.3, medium: 0.6, whole: 1.0 };

export interface FloatRect { x: number; y: number; w: number; h: number; }

const MIN = 140;
/* how much of the box has to stay on screen when the window shrinks or the
   box is dragged off an edge, so there is always something to grab */
const KEEP = 48;
/* the pointer counts as inside a little before it reaches the edge, so the
   grip is already there when it gets to it */
const REACH = 10;
const SYNC_DELAY = 2500;

/* ---- the right-click panel ----
   The knobs the float can hold apart from the full view's deck. Kept short on
   purpose: these are the ones that change how it sits over a note. Orbit and
   link shape beyond gap and shell stay with the deck, so the float and the
   full view are recognisably the same sky. */
const TUNE_KEYS = ['spd', 'bri', 'lnk', 'lwd', 'glare', 'gap', 'sph'] as const;
type TuneKey = typeof TUNE_KEYS[number];

/* The zoom slider runs over the fit itself, on a log scale, further away to
   the left. */
const FIT_FAR = 1.6, FIT_NEAR = 0.15;
const fitToSlider = (fit: number) => 100 * Math.log(FIT_FAR / fit) / Math.log(FIT_FAR / FIT_NEAR);
const sliderToFit = (v: number) => FIT_FAR * Math.pow(FIT_NEAR / FIT_FAR, v / 100);

type Words = Record<string, string>;
const WORDS: Record<'ko' | 'en', Words> = {
  ko: {
    title: '플로팅 오러리', view: '보기', zoom: '줌',
    close: '가까이', medium: '중간', whole: '전체',
    motion: '움직임', spd: '공전 속도', pause: '일시정지',
    light: '빛', bri: '노드 밝기', lnk: '링크 밝기', lwd: '링크 두께', glare: '태양 후광',
    move: '끌어서 옮기기',
    orbits: '궤도', gap: '궤도 간격', sph: '궤도 껍질',
    show: '표시', links: '링크 보이기', opacity: '투명도',
    lock: '위치 잠금', follow: '전체 뷰 설정 따르기',
    reset: '전체 뷰 값으로 되돌리기',
  },
  en: {
    title: 'Floating orrery', view: 'View', zoom: 'Zoom',
    close: 'Close', medium: 'Medium', whole: 'Whole',
    motion: 'Motion', spd: 'Orbit speed', pause: 'Pause',
    light: 'Light', bri: 'Node glow', lnk: 'Link glow', lwd: 'Link width', glare: 'Sun halo',
    move: 'Drag to move',
    orbits: 'Orbits', gap: 'Orbit gap', sph: 'Orbit shell',
    show: 'Show', links: 'Links', opacity: 'Opacity',
    lock: 'Lock position', follow: 'Follow the full view',
    reset: 'Back to the full view value',
  },
};

export class FloatingOrrery {
  private el: HTMLElement;
  private root: HTMLElement;
  private api: OrreryApi | null = null;
  private ro: ResizeObserver | null = null;
  private off: Array<() => void> = [];
  private rect: FloatRect;
  private hover = false;
  private busy = false;            // a drag or a resize is in progress
  private syncPending = false;
  private visible = false;
  private panel: HTMLElement | null = null;
  private panelOff: Array<() => void> = [];
  private panelPos: { x: number; y: number } | null = null;

  constructor(private plugin: VaultOrreryPlugin) {
    this.rect = this.fitRect(plugin.settings.floatRect ?? this.defaultRect());

    this.el = document.body.createDiv({ cls: 'vo-float' });
    this.root = this.el.createDiv({ cls: 'vo-root' });
    const frame = this.el.createDiv({ cls: 'vo-float-frame' });
    const grip = frame.createDiv({ cls: 'vo-float-grip', attr: { 'aria-label': 'Move' } });
    setIcon(grip, 'grip-horizontal');
    const close = frame.createDiv({ cls: 'vo-float-close', attr: { 'aria-label': 'Hide the floating orrery' } });
    setIcon(close, 'x');
    const size = frame.createDiv({ cls: 'vo-float-size', attr: { 'aria-label': 'Resize' } });
    this.place();

    close.addEventListener('click', () => { void plugin.setFloat(false); });
    this.el.toggleClass('is-locked', plugin.settings.floatLocked);
    this.root.setCssStyles({ opacity: String(plugin.settings.floatOpacity) });
    this.dragWith(grip, (r, dx, dy) => ({ ...r, x: r.x + dx, y: r.y + dy }));
    this.dragWith(size, (r, dx, dy) => ({ ...r, w: r.w + dx, h: r.h + dy }));

    /* the pointer, watched from the window: see the note at the top */
    this.listen(window, 'pointermove', (e: PointerEvent) => {
      if (this.busy) return;
      const r = this.rect;
      const inside = e.clientX >= r.x - REACH && e.clientX <= r.x + r.w + REACH &&
                     e.clientY >= r.y - REACH && e.clientY <= r.y + r.h + REACH;
      if (inside !== this.hover) {
        this.hover = inside;
        this.el.toggleClass('is-hover', inside);
      }
    });
    /* leaving the window entirely sends no pointermove from outside it */
    this.listen(document, 'pointerleave', () => {
      if (this.busy || !this.hover) return;
      this.hover = false;
      this.el.removeClass('is-hover');
    });
    this.listen(window, 'resize', () => { this.rect = this.fitRect(this.rect); this.place(); });
    /* Right-click inside the box opens the float's own settings. Taken in the
       capture phase, before the note underneath builds its menu, and only
       inside the box itself: a right-click anywhere else is the note's. A
       modal or a menu that happens to sit over the box keeps its own. */
    this.listen(window, 'contextmenu', (e: MouseEvent) => {
      const r = this.rect;
      if (e.clientX < r.x || e.clientX > r.x + r.w || e.clientY < r.y || e.clientY > r.y + r.h) return;
      const t = e.target instanceof Element ? e.target : null;
      if (t?.closest('.modal-container, .menu, .popover, .vo-float-panel, .prompt')) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      this.openPanel(e.clientX, e.clientY);
    }, true);

    this.mount();
  }

  /* ---- the engine -------------------------------------------------------- */

  private mount() {
    try {
      this.api = mountEngine(this.root, this.plugin.engineStoreReadOnly(), {
        mini: true, float: true, fit: this.fit(),
      });
    } catch (e) {
      console.error('Vault Orrery: the floating orrery failed to start', e);
      this.el.addClass('is-failed');
      return;
    }
    this.plugin.applySettingsTo(this.api);
    this.applyLook();

    /* The box is always on screen while it exists, so visibility is only the
       question of whether it has been laid out — the same zero-box trap the
       leaf view documents. */
    this.ro = new ResizeObserver(() => {
      this.api?.resize();
      this.visible = this.root.offsetWidth > 0 && this.root.offsetHeight > 0;
      this.runGate(true);
    });
    this.ro.observe(this.root);

    const app = this.plugin.app;
    const bump = () => this.scheduleSync();
    const v = app.vault, mc = app.metadataCache;
    [v.on('create', bump), v.on('delete', bump), v.on('rename', bump), v.on('modify', bump)]
      .forEach(r => this.off.push(() => v.offref(r)));
    const res = mc.on('resolved', bump);
    this.off.push(() => mc.offref(res));
    void this.loadVault();
  }

  private scheduleSync = debounce(() => { void this.syncVault(); }, SYNC_DELAY, false);

  private async syncVault() {
    if (!this.api || !this.plugin.settings.liveSync) return;
    if (this.api.busy()) {
      if (this.syncPending) return;
      this.syncPending = true;
      window.setTimeout(() => { this.syncPending = false; void this.syncVault(); }, SYNC_DELAY);
      return;
    }
    await this.loadVault(true);
  }

  private async loadVault(quiet = false) {
    if (!this.api) return;
    const app = this.plugin.app;
    const files: TFile[] = app.vault.getMarkdownFiles();
    if (!files.length) return;
    this.plugin.pruneTexts(files);
    await this.api.load(orreryFiles(this.plugin, files), app.vault.getName(), { quiet });
  }

  /** The full view's knobs moved: follow them. Debounced, because a slider
      being dragged writes on every step and each apply runs every knob's
      hook. */
  settingsChanged = debounce(() => { this.applyLook(); }, 400, false);

  /** The deck's knobs with the float's own on top. A knob the panel has
      handed back to the deck takes the deck's value, or the knob's default
      where the deck has never saved one, so nothing the panel set lingers. */
  private applyLook() {
    const api = this.api;
    if (!api) return;
    const s = this.plugin.settings;
    let deck: Record<string, unknown> = {};
    try { deck = JSON.parse(s.engineStore['orrery2.set'] || '{}') as Record<string, unknown>; }
    catch { deck = {}; }
    const merged: Record<string, unknown> = { ...deck };
    for (const kn of api.knobs([...TUNE_KEYS])) {
      const own = s.floatTune[kn.k];
      merged[kn.k] = typeof own === 'number' ? own
                   : typeof deck[kn.k] === 'number' ? deck[kn.k] : kn.def;
    }
    api.applySettings(JSON.stringify(merged));
    api.setLinks(s.floatLinks);
  }
  private applySoon = debounce(() => { this.applyLook(); }, 60, false);
  private saveSoon = debounce(() => { void this.plugin.saveSettings(); }, 500, false);

  private fit(): number {
    const s = this.plugin.settings;
    return (FLOAT_FIT[s.floatFrame] ?? FLOAT_FIT.medium) * s.floatZoom;
  }
  /** The frame or the zoom changed. */
  reframe() {
    this.api?.setFrame(this.fit());
    this.syncPanel();
  }

  /** Drawing on or off: on screen and not paused. A paused float that is
      resized has its canvas cleared by the resize, so it draws a couple of
      frames and stops again rather than going blank. */
  private runGate(redraw = false) {
    const api = this.api;
    if (!api) return;
    if (!this.plugin.settings.floatPaused) { api.setVisible(this.visible); return; }
    if (redraw && this.visible) {
      api.setVisible(true);
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
        if (this.plugin.settings.floatPaused) this.api?.setVisible(false);
      }));
    } else api.setVisible(false);
  }

  getApi(): OrreryApi | null { return this.api; }

  /* ---- the box ----------------------------------------------------------- */

  private defaultRect(): FloatRect {
    const w = 300, h = 300;
    return { x: window.innerWidth - w - 60, y: window.innerHeight - h - 80, w, h };
  }

  /** Clamped to the window: at least MIN across, no larger than the window,
      and never so far off an edge that there is nothing left to grab. */
  private fitRect(r: FloatRect): FloatRect {
    const W = window.innerWidth, H = window.innerHeight;
    const w = Math.round(Math.min(Math.max(r.w, MIN), Math.max(MIN, W - 16)));
    const h = Math.round(Math.min(Math.max(r.h, MIN), Math.max(MIN, H - 16)));
    const x = Math.round(Math.min(Math.max(r.x, KEEP - w), W - KEEP));
    const y = Math.round(Math.min(Math.max(r.y, 0), H - KEEP));
    return { x, y, w, h };
  }

  private place() {
    const r = this.rect;
    this.el.setCssStyles({ left: r.x + 'px', top: r.y + 'px', width: r.w + 'px', height: r.h + 'px' });
  }

  /** A handle that changes the rect as it is dragged, and saves it on
      release. Pointer capture keeps the drag going when the pointer outruns
      the handle, which at any real speed it does. */
  private dragWith(handle: HTMLElement, next: (r: FloatRect, dx: number, dy: number) => FloatRect) {
    handle.addEventListener('pointerdown', (e: PointerEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      const start = { ...this.rect };
      const sx = e.clientX, sy = e.clientY;
      this.busy = true;
      this.el.addClass('is-moving');
      handle.setPointerCapture(e.pointerId);
      const move = (ev: PointerEvent) => {
        this.rect = this.fitRect(next(start, ev.clientX - sx, ev.clientY - sy));
        this.place();
      };
      const up = (ev: PointerEvent) => {
        handle.removeEventListener('pointermove', move);
        handle.removeEventListener('pointerup', up);
        handle.removeEventListener('pointercancel', up);
        try { handle.releasePointerCapture(ev.pointerId); } catch { /* already released */ }
        this.busy = false;
        this.el.removeClass('is-moving');
        this.plugin.settings.floatRect = { ...this.rect };
        void this.plugin.saveSettings();
      };
      handle.addEventListener('pointermove', move);
      handle.addEventListener('pointerup', up);
      handle.addEventListener('pointercancel', up);
    });
  }

  private listen<K extends keyof WindowEventMap>(t: Window, type: K, f: (e: WindowEventMap[K]) => void, capture?: boolean): void;
  private listen<K extends keyof DocumentEventMap>(t: Document, type: K, f: (e: DocumentEventMap[K]) => void, capture?: boolean): void;
  private listen(t: Window | Document, type: string, f: (e: Event) => void, capture = false) {
    t.addEventListener(type, f, capture);
    this.off.push(() => t.removeEventListener(type, f, capture));
  }

  /* ---- the right-click panel --------------------------------------------- */

  private words(): Words {
    return this.plugin.resolveLang() === 'ko' ? WORDS.ko : WORDS.en;
  }

  private openPanel(x: number, y: number) {
    this.closePanel();
    const p = document.body.createDiv({ cls: 'vo-float-panel' });
    this.panel = p;
    this.renderPanel();
    /* Where it was dragged to last, if it has been; otherwise beside the
       pointer. Kept inside the window either way. */
    const W = window.innerWidth, pw = p.offsetWidth;
    const at = this.panelPos ?? {
      x: x + 8 + pw > W - 8 ? Math.max(8, x - 8 - pw) : x + 8,
      y,
    };
    this.placePanel(at.x, at.y);

    const away = (e: PointerEvent) => {
      if (e.target instanceof Node && p.contains(e.target)) return;
      this.closePanel();
    };
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.preventDefault(); this.closePanel(); } };
    const blur = () => this.closePanel();
    document.addEventListener('pointerdown', away, true);
    document.addEventListener('keydown', key, true);
    window.addEventListener('blur', blur);
    this.panelOff.push(
      () => document.removeEventListener('pointerdown', away, true),
      () => document.removeEventListener('keydown', key, true),
      () => window.removeEventListener('blur', blur));
  }

  /** Put the panel at x, y, kept wholly inside the window. */
  private placePanel(x: number, y: number) {
    const p = this.panel;
    if (!p) return;
    const W = window.innerWidth, H = window.innerHeight;
    const left = Math.round(Math.max(8, Math.min(x, W - 8 - p.offsetWidth)));
    const top = Math.round(Math.max(8, Math.min(y, H - 8 - p.offsetHeight)));
    p.setCssStyles({ left: left + 'px', top: top + 'px' });
  }

  /** The panel's title bar moves it. Where it is let go is where it opens
      next time, until Obsidian restarts. */
  private dragPanel(bar: HTMLElement) {
    bar.addEventListener('pointerdown', (e: PointerEvent) => {
      const p = this.panel;
      if (!p || e.button !== 0) return;
      e.preventDefault();
      const r = p.getBoundingClientRect();
      const ox = e.clientX - r.left, oy = e.clientY - r.top;
      bar.setPointerCapture(e.pointerId);
      p.addClass('is-moving');
      const move = (ev: PointerEvent) => { this.placePanel(ev.clientX - ox, ev.clientY - oy); };
      const up = (ev: PointerEvent) => {
        bar.removeEventListener('pointermove', move);
        bar.removeEventListener('pointerup', up);
        bar.removeEventListener('pointercancel', up);
        try { bar.releasePointerCapture(ev.pointerId); } catch { /* already released */ }
        p.removeClass('is-moving');
        const now = p.getBoundingClientRect();
        this.panelPos = { x: now.left, y: now.top };
      };
      bar.addEventListener('pointermove', move);
      bar.addEventListener('pointerup', up);
      bar.addEventListener('pointercancel', up);
    });
  }

  private closePanel() {
    this.panelOff.splice(0).forEach(f => f());
    this.panel?.remove();
    this.panel = null;
  }

  /** Redraw the open panel, if there is one: a frame chosen from the deck or
      the settings tab shows here too. */
  syncPanel() { if (this.panel) this.renderPanel(); }

  private renderPanel() {
    const p = this.panel, api = this.api;
    if (!p) return;
    const w = this.words();
    const s = this.plugin.settings;
    p.empty();
    const bar = p.createDiv({ cls: 'vo-fp-title', attr: { 'aria-label': w.move } });
    bar.createSpan({ text: w.title });
    setIcon(bar.createSpan({ cls: 'vo-fp-grip' }), 'grip-horizontal');
    this.dragPanel(bar);

    const section = (name: string) => p.createDiv({ cls: 'vo-fp-head', text: name });
    const row = (label: string) => {
      const r = p.createDiv({ cls: 'vo-fp-row' });
      const lab = r.createDiv({ cls: 'vo-fp-label', text: label });
      return { r, lab };
    };
    const toggle = (label: string, on: boolean, flip: (v: boolean) => void) => {
      const { r } = row(label);
      r.addClass('is-toggle');
      const t = r.createDiv({ cls: 'checkbox-container' + (on ? ' is-enabled' : '') });
      t.createEl('input', { type: 'checkbox', attr: { tabindex: '-1' } });
      r.addEventListener('click', (e) => {
        e.preventDefault();
        const v = !t.hasClass('is-enabled');
        t.toggleClass('is-enabled', v);
        flip(v);
      });
    };
    const slider = (label: string, min: number, max: number, step: number, value: number,
                    text: (v: number) => string, input: (v: number) => void,
                    own?: { on: boolean; reset: () => void }) => {
      const { r, lab } = row(label);
      r.addClass('is-slider');
      if (own?.on) {
        lab.addClass('is-own');
        const back = lab.createSpan({ cls: 'vo-fp-reset', attr: { 'aria-label': w.reset } });
        setIcon(back, 'rotate-ccw');
        back.addEventListener('click', e => { e.stopPropagation(); own.reset(); });
      }
      const val = r.createDiv({ cls: 'vo-fp-val', text: text(value) });
      const inp = r.createEl('input', { cls: 'slider', type: 'range' });
      inp.min = String(min); inp.max = String(max); inp.step = String(step); inp.value = String(value);
      inp.addEventListener('input', () => { const v = Number(inp.value); val.setText(text(v)); input(v); });
      /* the reset mark appears once a knob has been moved, not on every step */
      inp.addEventListener('change', () => { if (own && !own.on) this.renderPanel(); });
    };

    /* view */
    section(w.view);
    const seg = p.createDiv({ cls: 'vo-fp-seg' });
    (['close', 'medium', 'whole'] as FloatFrame[]).forEach(f => {
      const b = seg.createEl('button', { text: w[f] });
      if (s.floatFrame === f && Math.abs(s.floatZoom - 1) < 0.005) b.addClass('is-on');
      b.addEventListener('click', () => {
        s.floatFrame = f; s.floatZoom = 1;
        this.saveSoon();
        this.reframe();
        this.plugin.syncWidgets();
      });
    });
    slider(w.zoom, 0, 100, 1, fitToSlider(this.fit()),
      v => (FLOAT_FIT.medium / sliderToFit(v)).toFixed(2) + 'x',
      v => {
        s.floatZoom = sliderToFit(v) / (FLOAT_FIT[s.floatFrame] ?? FLOAT_FIT.medium);
        this.api?.setFrame(this.fit());
        seg.querySelectorAll('button').forEach(b => b.removeClass('is-on'));
        this.saveSoon();
      });

    const knobs = new Map(api ? api.knobs([...TUNE_KEYS]).map(k => [k.k, k] as const) : []);
    const knob = (k: TuneKey) => {
      const kn = knobs.get(k);
      if (!kn || !api) return;
      const own = typeof s.floatTune[k] === 'number';
      slider(w[k], kn.min, kn.max, kn.step, kn.value, v => api.knobText(k, v),
        v => { s.floatTune[k] = v; this.applySoon(); this.saveSoon(); },
        { on: own, reset: () => {
          delete s.floatTune[k];
          this.applyLook(); this.saveSoon(); this.renderPanel();
        } });
    };

    section(w.motion);
    knob('spd');
    toggle(w.pause, s.floatPaused, v => { s.floatPaused = v; this.saveSoon(); this.runGate(); });

    section(w.light);
    knob('bri'); knob('lnk'); knob('lwd'); knob('glare');

    section(w.orbits);
    knob('gap'); knob('sph');

    section(w.show);
    toggle(w.links, s.floatLinks, v => { s.floatLinks = v; this.api?.setLinks(v); this.saveSoon(); });
    slider(w.opacity, 20, 100, 1, Math.round(s.floatOpacity * 100), v => v + '%', v => {
      s.floatOpacity = v / 100;
      this.root.setCssStyles({ opacity: String(s.floatOpacity) });
      this.saveSoon();
    });

    p.createDiv({ cls: 'vo-fp-sep' });
    toggle(w.lock, s.floatLocked, v => {
      s.floatLocked = v;
      this.el.toggleClass('is-locked', v);
      this.saveSoon();
    });

    const foot = p.createDiv({ cls: 'vo-fp-foot' });
    const follow = foot.createEl('button', { text: w.follow });
    if (!Object.keys(s.floatTune).length) follow.disabled = true;
    follow.addEventListener('click', () => {
      s.floatTune = {};
      this.applyLook(); this.saveSoon(); this.renderPanel();
    });
  }

  destroy() {
    this.closePanel();
    this.scheduleSync.cancel();
    this.settingsChanged.cancel();
    this.applySoon.cancel();
    this.saveSoon.run();
    this.off.splice(0).forEach(f => f());
    this.ro?.disconnect(); this.ro = null;
    this.api?.destroy(); this.api = null;
    this.el.remove();
  }
}
