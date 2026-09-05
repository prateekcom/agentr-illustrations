# AgentR blog illustrations

Draws the illustration for a blog post, in the house style, as two files ready
to upload to Sanity.

Standalone by design — it does not need the website repo, and nothing done here
can break the live site.

```bash
npm install                  # once
npm run draw my-post-slug    # drawings/my-post-slug.mjs  ->  out/
npm run check                # must pass before uploading
```

Then attach the two files in `out/` to the post in Sanity:
`<slug>.svg` as the **Banner image**, `<slug>-social.jpg` under **Search engine
overrides → Social share image**.

**[CLAUDE.md](CLAUDE.md) is the real documentation** — the house style, the
rules, the kit, and how to turn a post's idea into a drawing. Read it before
drawing anything.

## What is here

| | |
|---|---|
| `CLAUDE.md` | The design instruction. The important file |
| `drawings/` | One file per post. Copy `_template.mjs` to start |
| `out/` | Generated. What you upload |
| `kit.mjs` | The drawing primitives. Do not edit |
| `reference/library.mjs` | 33 earlier drawings — worked examples, not a menu |
| `draw.mjs`, `check.mjs` | The two commands |

Every post gets its own drawing. The library is there to learn the hand from.
