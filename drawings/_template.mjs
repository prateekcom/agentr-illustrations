/**
 * Copy this to drawings/<post-slug>.mjs and draw the post's idea.
 *
 * One subject, drawn in ink on a coloured ground, filled paper white. Think of
 * something a thoughtful person sketched in a notebook while explaining the
 * idea — not an icon, not a diagram, not a scene.
 *
 * The abstraction is the job. A post about candidates gaming interviews is not
 * a drawing of a candidate; it is a drawing of the thing the post is *about* —
 * a second script beside the call, a duplicate profile, a funnel with a hole.
 * Find the object that carries the argument.
 */
import {
  PALETTE,
  ink, hair, solid,
  rect, line, circle, ellipse, poly, path,
  page, tick, cross, arrow, crowd,
} from '../kit.mjs'

export default {
  // One of: violet, brass, deep, lilac. Rotate it so neighbouring posts differ.
  ground: 'violet',

  // Any integer. Every wobble in the drawing derives from it, so the same seed
  // always redraws exactly the same picture. Change it to reshuffle the hand.
  seed: 42,

  /**
   * Return SVG as a string. Keep the subject inside x, y roughly 130-590: the
   * blog listing crops this to a card and slices the sides off.
   *
   * Give each shape its own seed (s + 1, s + 20, ...). Two shapes sharing a
   * seed wobble identically, which reads as copy-paste rather than a drawing.
   */
  draw(s) {
    return [
      page(200, 170, 250, 320, s, {lines: 4, head: true}),
      rect(400, 260, 190, 175, solid(s + 20)),
      arrow(410, 520, 480, 450, s + 30),
    ].join('')
  },
}
