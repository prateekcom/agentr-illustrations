# Drawing an illustration for an AgentR blog post

Every post gets **its own drawing**, made for that post's idea. This folder is
how you make one. It is standalone: nothing here needs the website repo, and
nothing you do here can break the live site.

`reference/library.mjs` holds 33 drawings made earlier. They are **worked
examples to learn the hand from — not a menu to pick from.** Read them to see
how an idea becomes an object. Then draw the post's own.

---

## The workflow

```bash
npm install                  # once
npm run draw <post-slug>     # drawings/<slug>.mjs  ->  out/
npm run check                # must pass before you upload
```

`npm run check` exits non-zero if the drawing has drifted out of the theme. It
is not a gate anyone else runs and it cannot stop a post being published — it is
here so drift shows up now, while you are still the person who can fix it. **Do
not upload a drawing that has not passed it.**

Then upload the two files in `out/` to Sanity, on the post:

| File | Sanity field |
|---|---|
| `<slug>.svg` | **Banner image** — the listing and the post page |
| `<slug>-social.jpg` | **Search engine overrides → Social share image** |

Both are needed. The SVG is what readers see; Facebook, LinkedIn and X will not
render an SVG, which is what the JPG is for. Write alt text on the banner
describing the drawing, not the post.

---

## The look, in one paragraph

A single object from the hiring world, drawn in sketchy ink on a flat
brand-tinted square, filled paper white. **Nothing else** — no shading, no
second colour, no gradients. It should look like something a thoughtful person
drew in a notebook while explaining an idea: not an icon, not a diagram, not a
scene. The calm is the point. These sit beside a headline and must never compete
with it.

## The abstraction is the job

A post about candidates gaming interviews is not a drawing of a candidate. It is
a drawing of the thing the post is *about* — a second script beside the video
call, a duplicate profile with an empty photo, a funnel with a hole in it. Find
the object that carries the argument, and draw that one object.

If you cannot find one object, the idea is still too big. Narrow it until you
can. A drawing that needs a caption has failed.

---

## Fixed constraints — never vary these

| | Value |
|---|---|
| Canvas | 720 x 720, square — `scene()` sets it, never write your own `<svg>` |
| Roughness / bowing | `1.3` / `1.1`, set in `kit.mjs`. Do not override |
| Stroke | ink `#171425`. Everything is drawn in ink |
| Object fill | paper `#F5F2EC` |
| Shading | none. There is deliberately no shading helper |
| Second colour | none |
| Grounds | the four in `GROUNDS`, all normalised to one lightness |

An earlier pass added hatched shading and brass annotations to "add detail". It
made the set busy and it fought the text. **Restraint is the house style: if a
drawing feels thin, simplify the idea rather than decorating it.**

Do not edit `kit.mjs`. Its stroke weights, roughness and palette are the only
reason a drawing made a year from now lands in the same hand as the first one.
`npm run check` will tell you if the grounds have been tampered with.

---

## Composition rules

1. **One subject.** If you need two objects, one is clearly primary.
2. **Fill the middle, leave the edges.** Keep the drawing roughly inside
   `x, y ∈ [130, 590]`. The blog listing crops it to a card and slices the
   sides off. `check` fails you if you stray.
3. **Paper fill, ink outline.** `solid()` for objects, `ink()` / `hair()` for
   lines.
4. **Ruled lines stand in for text.** Never draw letterforms. No real text ever
   appears in an illustration — the headline is already beside it on the page.
5. **Two depths only**: ground, object. A `tick()`, `cross()` or `arrow()` is
   allowed when it carries meaning, never as decoration.
6. **Give every shape its own seed** — `s`, `s + 1`, `s + 20`. Two shapes
   sharing a seed wobble identically, which reads as copy-paste rather than as
   a drawing.

### Avoid

Gradients, shadows, opacity tricks, any second fill colour, shading of any kind,
perspective or 3D, faces or figures, and anything that needs a caption.

---

## The kit

```js
import {
  PALETTE, GROUNDS, scene,                   // palette + canvas
  ink, hair, solid,                          // pens
  rect, line, circle, ellipse, poly, path,   // shapes
  page, tick, cross, arrow, crowd,           // compounds
} from '../kit.mjs'
```

Pens take a seed and return options you pass to a shape:

| Pen | Use |
|---|---|
| `ink(seed, w = 3.2)` | Outlines, structure |
| `hair(seed, w = 2.4)` | Ruled lines, grid rules |
| `solid(seed, fill = paper)` | A thing: outlined and filled |

Compounds are shortcuts for things drawn often:

| Helper | Draws |
|---|---|
| `page(x, y, w, h, seed, {lines, head})` | A sheet with ruled text; `head: true` adds a heading block |
| `tick(x, y, size, seed)` | A two-stroke tick |
| `cross(x, y, size, seed)` | A cross |
| `arrow(x1, y1, x2, y2, seed)` | A drawn arrow with a head |
| `crowd(points, seed, d)` | A scatter of small circles — applicants, claims |

## Grounds

`violet`, `brass`, `deep`, `lilac`. They are the brand inks mixed toward paper
until they share one lightness (~172), because these sit side by side in the
listing and an un-normalised ground looks heavier or more bleached than its
neighbours.

**Rotate the ground** so a new post differs from the ones published either side
of it. Check the recent posts on the blog before choosing.

---

## Writing the drawing

Copy `drawings/_template.mjs` to `drawings/<post-slug>.mjs`. Use the post's real
slug — it is what the output files are named after, and it keeps the drawing
traceable to its post.

```js
import {page, rect, arrow, solid} from '../kit.mjs'

export default {
  ground: 'lilac',
  seed: 42,
  draw(s) {
    return [
      page(190, 170, 240, 310, s, {lines: 4, head: true}),
      rect(392, 250, 196, 180, solid(s + 20)),
      arrow(400, 520, 470, 448, s + 30),
    ].join('')
  },
}
```

The seed can be any integer. Every wobble derives from it, so the same seed
always redraws exactly the same picture; change it to reshuffle the hand if the
composition is right but the strokes fall badly.

## Before you upload

Look at the drawing three ways:

- **Beside the others** in `reference/library.mjs` output — does it belong to
  the same family?
- **At card size**, about 300px — is it still legible, or does the detail mush?
- **As the social JPG**, which is the square centred on a wider ground — does
  the subject still hold when it is small and surrounded by space?

If it fails the first, the problem is usually decoration. Take something out.
