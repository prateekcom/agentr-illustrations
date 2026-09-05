#!/usr/bin/env node
/**
 * Renders one drawing into the two files a post needs.
 *
 *   npm run draw <slug>        drawings/<slug>.mjs  ->  out/<slug>.svg
 *                                                        out/<slug>-social.jpg
 *   npm run draw               every drawing in drawings/
 *
 * The square SVG is what the blog listing and the post page show. The social
 * JPG exists because Facebook, LinkedIn and X will not render an SVG — it is
 * the same drawing centred on a wider ground, not a crop, so nothing is lost.
 */
import {readdirSync, writeFileSync, mkdirSync, existsSync} from 'node:fs'
import {pathToFileURL} from 'node:url'
import {resolve} from 'node:path'
import {Resvg} from '@resvg/resvg-js'
import sharp from 'sharp'
import {GROUNDS, S, scene} from './kit.mjs'

const OUT = 'out'
const SOCIAL = {w: 1200, h: 630}

/** The square drawing, centred on a wider ground. Letterboxed, never cropped. */
function social(ground, body) {
  const scale = SOCIAL.h / S
  const dx = (SOCIAL.w - S * scale) / 2
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SOCIAL.w}" height="${SOCIAL.h}" viewBox="0 0 ${SOCIAL.w} ${SOCIAL.h}">
  <rect width="${SOCIAL.w}" height="${SOCIAL.h}" fill="${ground}"/>
  <g transform="translate(${dx},0) scale(${scale})">${body}</g>
</svg>`
}

const wanted = process.argv[2]
if (!existsSync('drawings')) {
  console.error('No drawings/ folder. See CLAUDE.md.')
  process.exit(1)
}

const files = readdirSync('drawings')
  .filter((f) => f.endsWith('.mjs') && !f.startsWith('_'))
  .filter((f) => !wanted || f === `${wanted}.mjs`)

if (!files.length) {
  console.error(
    wanted
      ? `drawings/${wanted}.mjs not found. Copy drawings/_template.mjs to start it.`
      : 'No drawings yet. Copy drawings/_template.mjs to drawings/<slug>.mjs.',
  )
  process.exit(1)
}

mkdirSync(OUT, {recursive: true})

for (const file of files) {
  const slug = file.replace(/\.mjs$/, '')
  const mod = await import(pathToFileURL(resolve('drawings', file)).href)

  const {ground, draw, seed = 42} = mod.default || mod
  if (!draw) {
    console.error(`${file}: no \`draw\` exported. See drawings/_template.mjs.`)
    process.exit(1)
  }
  if (!GROUNDS[ground]) {
    console.error(
      `${file}: ground "${ground}" is not one of ${Object.keys(GROUNDS).join(', ')}.`,
    )
    process.exit(1)
  }

  const hex = GROUNDS[ground]
  const body = draw(seed)

  const svg = scene(hex, body)
  writeFileSync(`${OUT}/${slug}.svg`, svg)

  const socialSvg = social(hex, body)
  const png = new Resvg(socialSvg, {fitTo: {mode: 'width', value: SOCIAL.w}}).render().asPng()
  const jpg = await sharp(png).jpeg({quality: 84, mozjpeg: true}).toBuffer()
  writeFileSync(`${OUT}/${slug}-social.jpg`, jpg)

  console.log(
    `${slug.padEnd(34)} ${ground.padEnd(7)} ` +
      `${(Buffer.byteLength(svg) / 1024).toFixed(1)}KB svg / ${(jpg.length / 1024).toFixed(0)}KB social`,
  )
}

console.log(`\n${files.length} drawing(s) in ${OUT}/. Run \`npm run check\` before uploading.`)
