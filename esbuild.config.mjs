import esbuild from 'esbuild';
import process from 'node:process';
import builtins from 'builtin-modules';

const banner =
`/*
 * Vault Orrery — bundled by esbuild. Do not edit main.js directly.
 * Engine source: vault-orrery-v2.html  ->  scripts/build-engine.mjs
 */
`;

const prod = process.argv[2] === 'production';

const ctx = await esbuild.context({
  banner: { js: banner },
  entryPoints: ['src/main.ts'],
  bundle: true,
  /* Everything Obsidian provides at runtime, plus node builtins Electron has.
     three is deliberately NOT here: it is bundled in, because the plugin may
     not fetch code at runtime and a peer copy is not guaranteed to exist. */
  external: [
    'obsidian', 'electron',
    '@codemirror/autocomplete', '@codemirror/collab', '@codemirror/commands',
    '@codemirror/language', '@codemirror/lint', '@codemirror/search',
    '@codemirror/state', '@codemirror/view',
    '@lezer/common', '@lezer/highlight', '@lezer/lr',
    ...builtins,
  ],
  format: 'cjs',
  target: 'es2018',
  logLevel: 'info',
  sourcemap: prod ? false : 'inline',
  treeShaking: true,
  outfile: 'main.js',
  minify: prod,
});

if (prod) { await ctx.rebuild(); await ctx.dispose(); }
else { await ctx.watch(); }
