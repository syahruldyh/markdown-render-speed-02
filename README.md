# markdown-render-speed-02

A faster drop-in for marked 18.1.3 (GFM on, defaults). `parse.js` exports
`parse(markdown)`, which returns byte-identical HTML to `marked.parse` with
marked's default options, and `main.ts` is the harness driver: it reads
`/input/cases.json`, renders each case alone with `parse()`, and writes
`/output/html.json`.

## What it is

`parse.js` is a fork of marked 18.1.3 (`vendor/marked/marked.esm.js` in the
competition kit, MIT — see `LICENSE` and `NOTICE`). It is not marked
unchanged: the hot paths were reworked for speed while preserving marked's
exact output, code unit for code unit:

- Inline rules dispatch on the current character instead of trying every
  rule in order, and ordinary text is consumed in runs by a hand-written
  scanner that reproduces the GFM text rule's stop positions (special
  characters, `www.` / protocol / `mailto:` / `xmpp:` starts, email starts,
  and hard line breaks) exactly.
- The list tokenizer and the block tokenizer dispatch on the first
  non-space character and skip regexes and per-line tests that cannot match.
- The masking step that hides code spans, links and HTML from the
  emphasis/delimiter search is gated on the characters that can matter.
- Hot helpers avoid throwaway objects and repeated scans (indent checks,
  blank-line tests, code-point length).

No lookup table of any case's output, no caching across `parse()` calls, no
network, no file or clock reads. `parse.js` is dependency-free and runs on
Node 22.

## Verification (practice set, 720 cases)

- 720/720 cases byte-identical to marked 18.1.3, deterministic across runs.
- Fuzzed against marked on 32,000+ random documents (token soup and
  structured docs: headings, lists, blockquotes, fences, tables, links,
  emails, URLs, emphasis, entities, unicode) with 0 differences.
- Local CPU time for the 720 practice cases: ~0.64 s vs ~0.83 s for marked
  itself (~1.3x faster). The sandbox leaderboard's paid line is 2.43 s
  against marked at ~2.84 s, so this entry is expected to clear it, with
  less margin than the 1.5x target.

## Files

- `parse.js` — the parser (dependency-free ES module).
- `main.ts` — the driver.
- `LICENSE`, `NOTICE` — marked's MIT license and notice (the fork keeps
  them, as the competition rules require).

License: MIT (see LICENSE).
