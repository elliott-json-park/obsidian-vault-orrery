/*
 * A request to star the repository, shown to people who updated the plugin
 * (never to a fresh install), the first time they open the plugin's own view
 * after the update. Each round of the request is shown at most once; a person
 * who pressed the star button is never asked again. It is disclosed in the
 * README, opens the repository only when its button is pressed, and nothing in
 * the plugin depends on it.
 *
 * The state and timing match the other plugins' star.ts; only the window is
 * Vault Orrery's own (an "orbit log" in the view's HUD style).
 */
import { App, Modal, Plugin, WorkspaceLeaf } from 'obsidian';

/** What the plugin keeps in its data about the request. */
export interface StarState {
  /** The version that last ran, so an update can be told apart from a fresh install. */
  seen?: string;
  /** Armed by an update; cleared once the request has been shown. */
  pending?: boolean;
  /** Shown at least once (kept for data written before `round`). */
  asked?: boolean;
  /** The last round of the request that was shown. */
  round?: number;
  /** The star button was pressed: never ask again. */
  starred?: boolean;
  /** The version updated from, shown in the window's header. */
  from?: string;
}

/**
 * The current round. The first design (round 1) was a plain window that most
 * people closed; round 2 shows the redesigned window once more to everyone who
 * has not pressed the star button. Raise it only with a new design.
 */
export const STAR_ROUND = 2;

type Lang = 'en' | 'ko' | 'zh' | 'ja';

const TEXT: Record<Lang, { title: string; body: string; star: string; later: string }> = {
  en: {
    title: 'Enjoying {name}?',
    body: 'A star on GitHub means a lot to a solo developer. This won\'t show again.',
    star: 'Star on GitHub',
    later: 'Maybe later',
  },
  ko: {
    title: '{name}, 잘 쓰고 계신가요?',
    body: 'GitHub에서 별(Star)을 눌러 주시면 혼자 만드는 개발자에게 큰 힘이 돼요. 이 안내는 다시 뜨지 않아요.',
    star: '별 누르러 가기',
    later: '다음에요',
  },
  zh: {
    title: '喜欢 {name} 吗？',
    body: '在 GitHub 上点个星标（Star），对独立开发者是很大的鼓励。这条提示不会再出现。',
    star: '去点星标',
    later: '下次再说',
  },
  ja: {
    title: '{name} を使っていただけていますか？',
    body: 'GitHub でスター（Star）を押していただけると、一人で作っている開発者の大きな励みになります。この案内はもう表示されません。',
    star: 'スターを押しに行く',
    later: 'また今度',
  },
};

/** Whether a click or key press just happened (the browser's transient user activation). */
function byPerson(): boolean {
  const ua = (navigator as Navigator & { userActivation?: { isActive: boolean } }).userActivation;
  return ua ? ua.isActive : true;
}

function langOf(code: string): Lang {
  const c = (code || '').toLowerCase();
  return c.startsWith('ko') ? 'ko' : c.startsWith('zh') ? 'zh' : c.startsWith('ja') ? 'ja' : 'en';
}

/** The last round shown, reading data written before `round` existed. */
function shownRound(s: StarState): number {
  return s.round ?? (s.asked ? 1 : 0);
}

/**
 * Work out the state to keep after loading. `hadData` is whether the plugin
 * found saved data on disk: without it this is a fresh install, which is never asked.
 */
export function starOnLoad(prev: StarState | undefined, hadData: boolean, version: string): StarState {
  const s: StarState = { ...(prev || {}) };
  if (hadData && s.seen !== version && !s.starred && shownRound(s) < STAR_ROUND) {
    s.pending = true;
    if (s.seen) s.from = s.seen;
  }
  s.seen = version;
  return s;
}

/** Whether `starOnLoad` changed anything that needs saving. */
export function starChanged(a: StarState | undefined, b: StarState): boolean {
  return !a || a.seen !== b.seen || !!a.pending !== !!b.pending || !!a.asked !== !!b.asked
    || a.round !== b.round || !!a.starred !== !!b.starred;
}

/** The orbit log's readout rows. HUD labels stay in English, as in the view's own panels. */
const LOG: { k: string; v: string; cls?: string }[] = [
  { k: 'ORBIT', v: 'STABLE' },
  { k: 'BUILT BY', v: '1 HUMAN' },
  { k: 'YOUR STAR', v: 'PENDING', cls: 'is-pending' },
];

class StarModal extends Modal {
  constructor(app: App, private name: string, private url: string, private lang: Lang,
    private from: string | undefined, private to: string | undefined, private onStar: () => void) {
    super(app);
  }

  onOpen(): void {
    const tx = TEXT[this.lang];
    this.modalEl.addClass('vo-star-modal');
    const box = this.contentEl.createDiv({ cls: 'vo-star' });

    // A small system: the sun, two dashed orbits and two planets going round.
    const vis = box.createDiv({ cls: 'vo-star-vis' });
    const svg = vis.createSvg('svg', { attr: { viewBox: '0 0 120 120', width: '120', height: '120' } });
    svg.createSvg('circle', { attr: { cx: '60', cy: '60', r: '18', class: 'vo-star-halo' } });
    svg.createSvg('circle', { attr: { cx: '60', cy: '60', r: '10', class: 'vo-star-sun' } });
    svg.createSvg('circle', { attr: { cx: '60', cy: '60', r: '32', class: 'vo-star-ring is-dashed' } });
    svg.createSvg('circle', { attr: { cx: '60', cy: '60', r: '50', class: 'vo-star-ring' } });
    svg.createSvg('g', { cls: 'vo-star-orbit' }).createSvg('circle', { attr: { cx: '92', cy: '60', r: '4', class: 'vo-star-planet' } });
    // An SVG element takes its classes one by one (a space in one name throws).
    svg.createSvg('g', { cls: ['vo-star-orbit', 'is-slow'] }).createSvg('circle', { attr: { cx: '10', cy: '60', r: '3', class: 'vo-star-moon' } });

    const main = box.createDiv({ cls: 'vo-star-main' });
    const versions = this.from && this.to ? `${this.from} → ${this.to}` : (this.to ?? '');
    main.createDiv({ cls: 'vo-star-hd', text: versions ? `ORBIT LOG · ${versions}` : 'ORBIT LOG' });
    main.createDiv({ cls: 'vo-star-title', text: tx.title.replace('{name}', this.name) });
    const dl = main.createEl('dl', { cls: 'vo-star-log' });
    for (const row of LOG) {
      const line = dl.createDiv();
      line.createEl('dt', { text: row.k });
      line.createEl('dd', { text: row.v, cls: row.cls });
    }
    main.createEl('p', { cls: 'vo-star-body', text: tx.body });
    const buttons = main.createDiv({ cls: 'vo-star-row' });
    const later = buttons.createEl('button', { cls: 'vo-star-btn', text: tx.later });
    later.addEventListener('click', () => this.close());
    const star = buttons.createEl('button', { cls: 'vo-star-btn is-cta', text: `★ ${tx.star}` });
    star.addEventListener('click', () => {
      this.onStar();
      window.open(this.url);
      this.close();
    });
    star.focus();
  }

  onClose(): void {
    this.contentEl.empty();
  }
}

/**
 * Show the request if an update armed it. Call it when the plugin's own view
 * opens. `save` stores the new state; the request is marked shown before it opens.
 */
export function maybeAskForStar(app: App, opts: {
  state: StarState | undefined;
  save: (next: StarState) => void | Promise<void>;
  name: string;
  url: string;
  language: string;
}): void {
  const s = opts.state;
  if (!s || !s.pending || s.starred || shownRound(s) >= STAR_ROUND) return;
  // Views restored with the workspace (or loaded late in a sidebar) open without
  // anyone asking for them: that would make this a start-up pop-up. Only a view
  // the person just opened or picked, with a click or a key, gets the request.
  if (!app.workspace.layoutReady || !byPerson()) return;
  const shown: StarState = { ...s, pending: false, asked: true, round: STAR_ROUND };
  void opts.save(shown);
  const onStar = () => { void opts.save({ ...shown, starred: true }); };
  // Let the view draw first, so the request does not cover an empty pane.
  window.setTimeout(() => new StarModal(app, opts.name, opts.url, langOf(opts.language), s.from, s.seen, onStar).open(), 900);
}

/**
 * Also ask when the person switches to one of the plugin's views that was
 * already open (restored at start-up, or sitting in a sidebar).
 */
export function askWhenPicked(plugin: Plugin, isOurs: (leaf: WorkspaceLeaf) => boolean, ask: () => void): void {
  plugin.registerEvent(plugin.app.workspace.on('active-leaf-change', leaf => {
    if (leaf && plugin.app.workspace.layoutReady && isOurs(leaf)) ask();
  }));
}
