// Driver for the markdown-render-speed-02 entry.
// Reads every case from cases.json, renders each one alone with parse()
// from parse.js, and writes the HTML strings (in the cases' order) to
// html.json. Input dir: $MAKEFUN_INPUT_DIR or /input. Output dir:
// $MAKEFUN_OUTPUT_DIR or /output.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from './parse.js';

const inputDir = process.env.MAKEFUN_INPUT_DIR ?? '/input';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

type Case = { id: string; markdown: string };

const cases: Case[] = JSON.parse(readFileSync(join(inputDir, 'cases.json'), 'utf8'));
const html = new Array<string>(cases.length);
for (let i = 0; i < cases.length; i++) html[i] = parse(cases[i].markdown);
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, 'html.json'), JSON.stringify(html));
