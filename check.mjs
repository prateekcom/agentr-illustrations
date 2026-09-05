#!/usr/bin/env node
/**
 * Checks the drawings in out/ against the house theme, and says how to fix
 * whatever is off.
 *
 *   npm run check
 *
 * This is a mirror you hold up to your own work, not a gate anyone else runs.
 * Nothing here can stop a post being published — it exists so the drift that
 * would otherwise show up fifty posts later shows up now, while you are still
 * the person who can fix it.
 *
 * It checks that: the canvas is the right size, every colour is one of the
 * palette's (nothing invented), the ground is one of the four normalised ones,
 * there is no text in the drawing, and the subject stays inside the area a card
 * crop leaves behind.
 */
import {readFileSync, readdirSync, existsSync} from 'node:fs'
import {GROUNDS, PALETTE, S} from './kit.mjs'

const DIR = 'out'
const SOCIAL = {w: 1200, h: 630}
const SAFE = {min: 130, max: 590} // a 3:2 card crop of a square eats the sides
const SLACK = 25

const allowed = new Set(
  [...Object.values(PALETTE), ...Object.values(GROUNDS), 'none', 'transparent'].map((c) =>
    c.toLowerCase(),
  ),
)

const luma = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

let failures = 0
const fail = (msg, fix) => {
  console.log(`FAIL ${msg}`)
  if (fix) console.log(`     -> ${fix}`)
  failures++
}
const ok = (msg) => console.log(`ok   ${msg}`)

if (!existsSync(DIR)) {
  console.log(`FAIL nothing in ${DIR}/ — run \`npm run draw <slug>\` first`)
  process.exit(1)
}

/* -------------------------------------------------------------- the kit ---- */
const groundL = Object.entries(GROUNDS).map(([name, hex]) => ({name, hex, L: luma(hex)}))
const spread = Math.max(...groundL.map((g) => g.L)) - Math.min(...groundL.map((g) => g.L))
if (spread > 8) {
  fail(
    `the four grounds vary by ${spread.toFixed(1)} in lightness`,
    'kit.mjs has been edited. Grounds must share one lightness (~172) or drawings ' +
      'look heavier or more bleached than their neighbours. Read CLAUDE.md.',
  )
} else {
  ok(`grounds share one lightness band (spread ${spread.toFixed(1)})`)
}

/* ----------------------------------------------------------- the drawings -- */
const onDisk = readdirSync(DIR)
const slugs = [...new Set(onDisk.filter((f) => f.endsWith('.svg')).map((f) => f.slice(0, -4)))]

if (!slugs.length) {
  console.log(`FAIL no svg files in ${DIR}/ — run \`npm run draw <slug>\``)
  process.exit(1)
}

for (const slug of slugs) {
  if (!onDisk.includes(`${slug}-social.jpg`)) {
    fail(`${slug}: no social image`, `run \`npm run draw ${slug}\` again — it writes both files`)
  }

  const svg = readFileSync(`${DIR}/${slug}.svg`, 'utf8')

  const dims = svg.match(/width="(\d+)" height="(\d+)"/)
  if (!dims || +dims[1] !== S || +dims[2] !== S) {
    fail(
      `${slug}: canvas is ${dims ? dims[1] + 'x' + dims[2] : 'unreadable'}, expected ${S}x${S}`,
      'let scene() set the canvas; do not write your own <svg> tag',
    )
  }

  const colours = new Set(
    [...svg.matchAll(/(?:fill|stroke)="([^"]+)"/g)].map((m) => m[1].toLowerCase()),
  )
  for (const c of colours) {
    if (!allowed.has(c)) {
      fail(
        `${slug}: colour ${c} is not in the palette`,
        'draw with ink(), hair() and solid() only. There is no second colour and ' +
          'no shading — a drawing that needs one needs a simpler idea instead.',
      )
    }
  }

  const ground = svg.match(/<rect width="\d+" height="\d+" fill="([^"]+)"/)
  if (!ground || !Object.values(GROUNDS).includes(ground[1].toLowerCase())) {
    fail(
      `${slug}: ground ${ground ? ground[1] : 'missing'} is not one of the four`,
      `use ground: '${Object.keys(GROUNDS).join("' | '")}'`,
    )
  }

  if (/<text|<tspan|font-family/i.test(svg)) {
    fail(
      `${slug}: contains text`,
      'illustrations never carry words — the headline is already next to it on ' +
        'the page. Use ruled lines (hair()) to stand in for text.',
    )
  }

  // Safe area, square only: the social variant letterboxes rather than cropping.
  const xs = []
  for (const m of svg.matchAll(/[ML]\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/g)) {
    xs.push(parseFloat(m[1]))
  }
  if (xs.length) {
    const lo = Math.min(...xs)
    const hi = Math.max(...xs)
    if (lo < SAFE.min - SLACK || hi > SAFE.max + SLACK) {
      fail(
        `${slug}: drawing spans x ${lo.toFixed(0)}-${hi.toFixed(0)}, outside the safe area ${SAFE.min}-${SAFE.max}`,
        'the listing crops this to a card and slices the sides off. Move the ' +
          'subject toward the middle.',
      )
    }
  }
}

if (!failures) {
  ok(`${slugs.length} drawing(s): canvas, palette, ground, no text, safe area`)
  console.log('\non theme — ready to upload to Sanity')
} else {
  console.log(`\n${failures} to fix. Nothing is blocked; the drawing just will not`)
  console.log('look like the rest of the set until these are sorted.')
}
process.exit(failures ? 1 : 0)
