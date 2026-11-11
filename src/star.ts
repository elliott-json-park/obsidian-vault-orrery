/*
 * A one-time request to star the repository, shown to people who updated the
 * plugin (never to a fresh install), the first time they open the plugin's own
 * view after the update. It is disclosed in the README, opens the repository
 * only when its button is pressed, and nothing in the plugin depends on it.
 */
import { App, Modal, Plugin, Setting, WorkspaceLeaf } from 'obsidian';

/** What the plugin keeps in its data about the request. */
export interface StarState {
  /** The version that last ran, so an update can be told apart from a fresh install. */
  seen?: string;
  /** Armed by an update; cleared once the request has been shown. */
  pending?: boolean;
  /** Shown once: never again. */
  asked?: boolean;
}

type Lang = 'en' | 'ko' | 'zh' | 'ja';

const TEXT: Record<Lang, { title: string; body: string; star: string; later: string }> = {
  en: {
    title: 'Enjoying {name}?',
    body: 'A star on GitHub means a lot to a solo developer. You will only see this once.',
    star: 'Star on GitHub',
    later: 'Maybe later',
  },
  ko: {
    title: '{name}, 잘 쓰고 계신가요?',
    body: 'GitHub에서 별(Star)을 눌러 주시면 혼자 만드는 개발자에게 큰 힘이 돼요. 이 안내는 한 번만 보여요.',
    star: '별 누르러 가기',
    later: '다음에요',
  },
  zh: {
    title: '喜欢 {name} 吗？',
    body: '在 GitHub 上点个星标（Star），对独立开发者是很大的鼓励。这条提示只会出现一次。',
    star: '去点星标',
    later: '下次再说',
  },
  ja: {
    title: '{name} を使っていただけていますか？',
    body: 'GitHub でスター（Star）を押していただけると、一人で作っている開発者の大きな励みになります。この案内は一度だけ表示されます。',
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

/**
 * Work out the state to keep after loading. `hadData` is whether the plugin
 * found saved data on disk: without it this is a fresh install, which is never asked.
 */
export function starOnLoad(prev: StarState | undefined, hadData: boolean, version: string): StarState {
  const s: StarState = { ...(prev || {}) };
  if (!s.asked && hadData && s.seen !== version) s.pending = true;
  s.seen = version;
  return s;
}

/** Whether `starOnLoad` changed anything that needs saving. */
export function starChanged(a: StarState | undefined, b: StarState): boolean {
  return !a || a.seen !== b.seen || !!a.pending !== !!b.pending || !!a.asked !== !!b.asked;
}

class StarModal extends Modal {
  constructor(app: App, private name: string, private url: string, private lang: Lang) {
    super(app);
  }

  onOpen(): void {
    const tx = TEXT[this.lang];
    this.modalEl.addClass('star-ask-modal');
    this.titleEl.setText(tx.title.replace('{name}', this.name));
    this.contentEl.createEl('p', { text: tx.body });
    new Setting(this.contentEl)
      .addButton(b => b.setButtonText(tx.later).onClick(() => this.close()))
      .addButton(b => b.setButtonText(tx.star).setCta().onClick(() => {
        window.open(this.url);
        this.close();
      }));
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
  if (!s || !s.pending || s.asked) return;
  // Views restored with the workspace (or loaded late in a sidebar) open without
  // anyone asking for them: that would make this a start-up pop-up. Only a view
  // the person just opened or picked, with a click or a key, gets the request.
  if (!app.workspace.layoutReady || !byPerson()) return;
  void opts.save({ ...s, pending: false, asked: true });
  // Let the view draw first, so the request does not cover an empty pane.
  window.setTimeout(() => new StarModal(app, opts.name, opts.url, langOf(opts.language)).open(), 900);
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
