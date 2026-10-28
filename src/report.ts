import type { App, TFile } from 'obsidian';

/* The sky report: the vault's numbers for the month, as a block of markdown.

   The orrery is a picture, and a picture is something you go and look at.
   This is the part of it that comes to you: one command puts the month's
   numbers — how many planets, how many arrived, which system grew, what is
   adrift — into the note you are writing, in the orrery's own words. It
   reads nothing but Obsidian's index, so it costs what a search does and
   draws nothing, and a daily or monthly note that carries it is a vault
   whose history is written down in the vault. */

export type ReportLang = 'ko' | 'en' | 'ja' | 'zh';

export interface SkyReport {
  /** The calendar month reported, as the first day's date. */
  month: Date;
  notes: number;
  /** Notes whose file was born this month. */
  born: number;
  /** Notes whose file was written this month. */
  touched: number;
  links: number;
  systems: number;
  biggest: { name: string; n: number } | null;
  grew: { name: string; n: number } | null;
  cited: { name: string; path: string; n: number } | null;
  rogue: number;
  broken: number;
}

/** The same patterns Obsidian's own excluded-files setting takes: a path
    prefix, or /regex/. */
export function excluded(path: string, filters: string[]): boolean {
  for (const f of filters) {
    if (!f) continue;
    if (f.length > 2 && f.startsWith('/') && f.endsWith('/')) {
      try { if (new RegExp(f.slice(1, -1)).test(path)) return true; } catch { /* not a pattern */ }
    } else if (path.startsWith(f)) return true;
  }
  return false;
}

/** Everything the report says, from the index alone. `now` is a parameter so
    the same vault reports the same month in a test. */
export function skyReport(app: App, filters: string[], now = new Date()): SkyReport {
  const month = new Date(now.getFullYear(), now.getMonth(), 1);
  const t0 = month.getTime();
  const all: TFile[] = app.vault.getMarkdownFiles().filter(f => !excluded(f.path, filters));
  const paths = new Set(all.map(f => f.path));
  const cache = app.metadataCache;
  /* a note's system is its top folder; the root is a system of its own,
     named for the vault, which is how the engine names it too */
  const system = (f: TFile) => { const i = f.path.indexOf('/'); return i < 0 ? app.vault.getName() : f.path.slice(0, i); };

  let born = 0, touched = 0, links = 0, broken = 0;
  const sysN = new Map<string, number>(), sysBorn = new Map<string, number>();
  const inb = new Map<string, number>(), outb = new Map<string, number>();
  for (const f of all) {
    if (f.stat.ctime >= t0) { born++; sysBorn.set(system(f), (sysBorn.get(system(f)) || 0) + 1); }
    if (f.stat.mtime >= t0) touched++;
    sysN.set(system(f), (sysN.get(system(f)) || 0) + 1);
    const res = cache.resolvedLinks[f.path];
    if (res) for (const to in res) {
      if (!paths.has(to)) continue;        // attachments, and notes excluded above
      const n = res[to];
      links += n;
      outb.set(f.path, (outb.get(f.path) || 0) + n);
      inb.set(to, (inb.get(to) || 0) + n);
    }
    const un = cache.unresolvedLinks[f.path];
    if (un) for (const k in un) broken += un[k];
  }
  const top = (m: Map<string, number>) => {
    let name = '', n = 0;
    m.forEach((v, k) => { if (v > n) { n = v; name = k; } });
    return n ? { name, n } : null;
  };
  const biggest = top(sysN);
  const grew = top(sysBorn);
  const c = top(inb);
  let cited: SkyReport['cited'] = null;
  if (c) {
    const f = all.find(x => x.path === c.name);
    cited = { name: f ? f.basename : c.name, path: c.name, n: c.n };
  }
  let rogue = 0;
  for (const f of all) if (!inb.get(f.path) && !outb.get(f.path)) rogue++;
  return { month, notes: all.length, born, touched, links, systems: sysN.size, biggest, grew, cited, rogue, broken };
}

/* ---- the words --------------------------------------------------------- */

const L: Record<string, [string, string, string, string]> = {
  title:   ['하늘 보고서 · {m}', 'SKY REPORT · {m}', '星空レポート · {m}', '星空报告 · {m}'],
  notes:   ['행성 · 노트 **{n}**', 'planets · notes **{n}**', '惑星 · ノート **{n}**', '行星 · 笔记 **{n}**'],
  born:    ['이번 달 새로 **+{n}**', 'new this month **+{n}**', '今月の新規 **+{n}**', '本月新增 **+{n}**'],
  touched: ['손댄 노트 **{n}**', 'touched **{n}**', '手を入れたノート **{n}**', '改动过的 **{n}**'],
  links:   ['링크 **{n}**', 'links **{n}**', 'リンク **{n}**', '链接 **{n}**'],
  systems: ['항성계 · 폴더 **{n}**', 'star systems · folders **{n}**', '恒星系 · フォルダ **{n}**', '星系 · 文件夹 **{n}**'],
  biggest: ['가장 큰 항성계 **{s}** (노트 {n})', 'biggest system **{s}** ({n} notes)',
            '最大の恒星系 **{s}** ({n} ノート)', '最大的星系 **{s}**（{n} 篇）'],
  grew:    ['이번 달 가장 자란 항성계 **{s}** (+{n})', 'fastest-growing system **{s}** (+{n})',
            '今月最も育った恒星系 **{s}** (+{n})', '本月增长最快的星系 **{s}**（+{n}）'],
  cited:   ['가장 많이 인용된 노트 [[{p}|{s}]] (인용 {n})', 'most cited note [[{p}|{s}]] (cited {n})',
            '最も引用されたノート [[{p}|{s}]] (引用 {n})', '被引用最多的笔记 [[{p}|{s}]]（被引 {n}）'],
  rogue:   ['떠돌이 행성 · 링크 없음 **{n}**', 'rogue planets · no links **{n}**',
            'はぐれ惑星 · リンクなし **{n}**', '流浪行星 · 无链接 **{n}**'],
  broken:  ['깨진 링크 **{n}**', 'broken links **{n}**', '切れたリンク **{n}**', '断开的链接 **{n}**'],
  quiet:   ['이번 달엔 새 행성이 없습니다', 'no new planets this month',
            '今月は新しい惑星がありません', '本月没有新行星'],
  made:    ['Vault Orrery · {d}', 'Vault Orrery · {d}', 'Vault Orrery · {d}', 'Vault Orrery · {d}'],
};
const LANGS: ReportLang[] = ['ko', 'en', 'ja', 'zh'];

function t(lang: ReportLang, key: string, vars: Record<string, string | number> = {}) {
  const row = L[key];
  let s = row[LANGS.indexOf(lang)] || row[1];
  for (const k in vars) s = s.split('{' + k + '}').join(String(vars[k]));
  return s;
}
const num = (n: number) => n.toLocaleString('en-US');
function monthName(lang: ReportLang, d: Date) {
  const y = d.getFullYear(), m = d.getMonth() + 1;
  if (lang === 'ko') return `${y}년 ${m}월`;
  if (lang === 'ja' || lang === 'zh') return `${y}年${m}月`;
  return d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
}
function today(d: Date) {
  const z = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${z(d.getMonth() + 1)}.${z(d.getDate())}`;
}

/** The report as a callout, in the orrery's words. One line per fact, so a
    reader can delete the ones they do not want. */
export function renderReport(r: SkyReport, lang: ReportLang, now = new Date()): string {
  const line = (parts: string[]) => '> ' + parts.join(' · ');
  const out = [`> [!orrery] ${t(lang, 'title', { m: monthName(lang, r.month) })}`];
  out.push(line([t(lang, 'notes', { n: num(r.notes) }),
                 r.born ? t(lang, 'born', { n: num(r.born) }) : t(lang, 'quiet'),
                 t(lang, 'touched', { n: num(r.touched) })]));
  const sys = [t(lang, 'links', { n: num(r.links) }), t(lang, 'systems', { n: num(r.systems) })];
  if (r.biggest) sys.push(t(lang, 'biggest', { s: r.biggest.name, n: num(r.biggest.n) }));
  out.push(line(sys));
  const more: string[] = [];
  if (r.grew) more.push(t(lang, 'grew', { s: r.grew.name, n: num(r.grew.n) }));
  if (r.cited) more.push(t(lang, 'cited', { p: r.cited.path.replace(/\.md$/, ''), s: r.cited.name, n: num(r.cited.n) }));
  if (more.length) out.push(line(more));
  out.push(line([t(lang, 'rogue', { n: num(r.rogue) }), t(lang, 'broken', { n: num(r.broken) })]));
  out.push('> <small>' + t(lang, 'made', { d: today(now) }) + '</small>');
  return out.join('\n') + '\n';
}
