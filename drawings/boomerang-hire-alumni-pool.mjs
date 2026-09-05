/**
 * The person who left and came back. The card is the record they left behind;
 * the line goes out of it, travels, and returns to the same card — the argument
 * of the post is that the leaving was never the end of the relationship.
 */
import {page, path, line, ink} from '../kit.mjs'

export default {
  ground: 'brass',
  seed: 61,

  draw(s) {
    const head = (x, y, a) =>
      line(x, y, x - 20 * Math.cos(a - 0.42), y - 20 * Math.sin(a - 0.42), ink(s + 8, 3.2)) +
      line(x, y, x - 20 * Math.cos(a + 0.42), y - 20 * Math.sin(a + 0.42), ink(s + 9, 3.2))

    return [
      page(235, 265, 250, 225, s, {lines: 3, head: true}),
      path('M 495 330 C 585 300, 580 175, 460 168 C 380 163, 300 178, 258 215', ink(s + 4)),
      head(258, 215, Math.atan2(215 - 178, 258 - 300)),
    ].join('')
  },
}
