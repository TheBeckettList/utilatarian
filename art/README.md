# Island art kit

One hand for every place on the map. **Josie's Cafe is the finished reference**; Tripwrights and every shop after it are drawn to sit next to it.
The look in one line: *a calm, sunny, top-down toy island: flat soft shapes, no outlines, warm sand underfoot, each place in its own color.*

## What is shared and what is the place's

| Shared by every place (the island) | The place's own |
|---|---|
| Sand, deck wood, sea, reef, leaves, pots, rocks, shadows (`world` tokens) | Its palette: `ink`, `paper`, `accent`, `accent-ink`, `soft`, `wash`, `pop` (+ dark) |
| Type: **Baloo 2** (headings, numbers), **Nunito** (text), **DynaPuff** only for the place's own handwriting | The things that *are* the place: counter band, awning, boat stripe, sign, its gear |
| Shapes: cards with a soft ring, pill buttons with a ledge, tonal chips, round badges | Its animals and little jokes (Josie's iguana, Utila Dives' turtle) |
| Open/closed pills (green / rose, always icon + word) | Its voice in copy |

Rule of thumb: **if it is the ground, the water, a plant or a rock, it is shared; if you would point at it and say "that's *their* thing", it wears the place's color.**

## Drawing rules (from Josie's)

1. **From above.** Plan view, cut away so you see inside; front edges and furniture get a little height with a soft ground shadow, never perspective.
2. **Flat fills, no outlines, no gradients.** An edge is a slightly darker shape *under* the main one (a sand-dk slab under a white wall; an accent hull under a white deck). Strokes only for things that are lines: ropes, hoses, foam dashes, a needle.
3. **Soft shadows.** One ellipse, `world.shadow`, offset down-right. Same direction everywhere.
4. **Round everything.** Corner radius is generous (chairs 9, counters 12, cards 34). Nothing sharp except flags and fins.
5. **Few tones.** Two or three per object: a base, a lighter highlight shape, one accent. White is a color (counters, walls, foam).
6. **Fill the corners with life**, lightly: a pot with a plant, a rock, a crab. Leave breathing room around the thing the visitor should tap.
7. **The place's color only on what is the place.** Everything else is world color. That is what lets Josie's pink, Tripwrights' blue and Utila Dives' tank-yellow share one island without clashing.
8. **Real shape under the art.** Maps keep real coordinates and coastlines (Josie's bay is traced from the satellite view); only participating places are drawn big and in their own colors.
9. **Quiet motion.** Taps do a small cute thing (a crab scuttles, a tree rustles) and stop. Everything respects `prefers-reduced-motion`.
10. **Never color alone.** Open/closed, low stock and alerts always carry an icon or a word.

## Pieces

- `palettes.json`: **the one source of truth** for every color. Edit here.
- `tools/build-art.mjs` (repo root): `node tools/build-art.mjs` writes `tokens.css` and `palettes.js` from it.
- `tokens.css`: world tokens, a `[data-place="…"]` block per place (light + dark), then `components.css` (cards, buttons, pills, chips, sign, sheet). Put `data-place="utila-dives"` on `<html>` or any container.
- `kit.js`: ES5 SVG props: `UART.props.pot / palm / umbrella / table / counter / rock / reef / crab / turtle / boat / dock / buoy / tankRack / wetsuit / fins / mask / compressor / rinse / board / sea …`, placed with `UART.at(x, y, rot, scale, markup)`. Ported from Josie's: blob, reef, palm, crab.
- `icons.js` + `icons.html`: icon tiles in Josie's manner (dive gear, tanks, boat fuel gauge, beds, keys, bell, ...), with status badges (`ok` check, `low` !, `alert` !!, `busy` ...). `UART.icon('tankFull', { p: palette, status: 'ok' })`.
- `places.js`: *simplified* drawings of real places for island overviews (`placeJosies`, `placeDives`): same layout and landmarks as the place's own map, fewer small things; plus Tripwrights' fantasy props (`dome`, `lantern`, `jelly`, `whaleShadow`, `bridge`, `lights`).
- Operating model (one map for staff and guests, roles, notifications): `docs/ops-model.md`.
- Examples to copy: `places/utila-dives/` (a whole shop), Tripwrights' ship (`Tripwrights/index.html`), Josie's cafe map (`josiescafe/art/`).

## Using it from another repo

Each place or app is its own repo and ships static files, so **copy `tokens.css`, `palettes.js` and (if you draw) `kit.js` into your `art/` folder** and keep the header line so it can be re-synced. Do not hand-edit the copies. Josie's shipped CSS uses literal hex values (for iOS 9 support, no CSS variables); its values are recorded in `palettes.json` under `josies-cafe` and do not need to change.

## Adding a place

1. Sketch its palette: pick one **accent** that is not already on the island (Josie pink, Tripwrights blue, Utila Dives yellow), with an `accent-ink` that reads on it (white on deep colors, dark ink on light ones) and an `accent-deep` for text/thin lines on paper. Add it to `palettes.json`, run the build.
2. Draw the place's footprint from above with the kit; add one or two props to `kit.js` only if the place needs something new (and say who might reuse it).
3. Give it a small animal or joke of its own.
4. Put the same palette in the place card (`palette`), so Tripwrights tints its pin and sheet in the place's colors.
