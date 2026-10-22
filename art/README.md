# Island art kit

One hand for every place on the map. **Josie's Cafe is the finished reference**; Tripwrights and every shop after it are drawn to sit next to it.
The look in one line: *a calm, sunny, top-down toy island: flat soft shapes, no outlines, warm sand underfoot, each place in its own color.*

## What is shared and what is the place's

| Shared by every place (the island) | The place's own |
|---|---|
| Sand, deck wood, sea, reef, leaves, pots, rocks, shadows (`world` tokens) | Its palette: `ink`, `paper`, `accent`, `accent-ink`, `soft`, `wash`, `pop` (+ dark) |
| Type: **Baloo 2** (headings, numbers), **Nunito** (text), **DynaPuff** only for the place's own handwriting | The things that *are* the place: counter band, awning, boat stripe, sign, its gear |
| Shapes: cards with a soft ring, pill buttons with a ledge, tonal chips, round badges | Its animals and little jokes (Josie's iguana, Paradise's black dive gear) |
| Open/closed pills (green / rose, always icon + word) | Its voice in copy |

Rule of thumb: **if it is the ground, the water, a plant or a rock, it is shared; if you would point at it and say "that's *their* thing", it wears the place's color.**

## Drawing rules (from Josie's)

1. **From above.** Plan view, cut away so you see inside; front edges and furniture get a little height with a soft ground shadow, never perspective.
2. **Flat fills, no outlines, no gradients.** An edge is a slightly darker shape *under* the main one (a sand-dk slab under a white wall; an accent hull under a white deck). Strokes only for things that are lines: ropes, hoses, foam dashes, a needle.
3. **Soft shadows.** One ellipse, `world.shadow`, offset down-right. Same direction everywhere.
4. **Round everything.** Corner radius is generous (chairs 9, counters 12, cards 34). Nothing sharp except flags and fins.
5. **Few tones.** Two or three per object: a base, a lighter highlight shape, one accent. White is a color (counters, walls, foam).
6. **Fill the corners with life**, lightly: a pot with a plant, a rock, a crab. Leave breathing room around the thing the visitor should tap.
7. **The place's color only on what is the place.** Everything else is world color. That is what lets Josie's pink, Tripwrights' blue and Paradise's blue-and-white wood share one island without clashing.
8. **Real shape under the art.** Maps keep real coordinates and coastlines (Josie's bay is traced from the satellite view); only participating places are drawn big and in their own colors.
9. **Quiet motion.** Taps do a small cute thing (a crab scuttles, a tree rustles) and stop. Everything respects `prefers-reduced-motion`.
10. **Never color alone.** Open/closed, low stock and alerts always carry an icon or a word.

## The shared grammar (draw new things out of these, so they match without trying)

| Every... | is drawn as | kit |
|---|---|---|
| object | a TOP shape over its darker FRONT face, one plum shadow down-right | `J.block`, `J.shadow` |
| room | floor pattern inside white wall slabs; the back wall as an elevation (color band, cream wall, wainscot, sill, windows) | `J.room`, `J.backWall` |
| deck or pier | white wood (or plank) with wood posts down the sides | `J.pier`, `J.defs` patterns |
| vessel | white rim, the owner's accent stripe, a wood deck; engines and gear in near-black `gear` | `J.hull`, `J.boat` |
| light | a warm bulb with a soft halo (lamps, string lights, the helipad ring, the lighthouse, lanterns) | `J.bulb` |
| water | `water` with `deep` bands and cream foam dashes; shores are foam, wet sand, sand | `J.sea`, `J.land`, `J.dash` |
| small thing (plants, gear, machines, the globe) | front-on, standing on its shadow | `J.plant`, `J.tank`, `J.globe` |
| place on an overview | its own map's landmarks, a tenth of the detail, its own colors | `J.mini.*` |

A place passes its colors to all of it in one object (`accent, deep, soft, pale, tank, tank2, wallTop, shutter, wainscot, ...`);
see `PC` in `places/paradise/map.js` and `TC` in `Tripwrights/rig.js`. `kit.js` and `places.js` are the earlier, flatter style:
`icons.js` still uses them; new drawing uses `josie.js` + `world.js` only.

## Pieces

- `island.js`: **the island kit**, Josie's bay-map hand (`josiescafe/art/bay.js`) at island scale: rough real coastlines for every island we sail to, density (0 quiet .. 3 dense) that decides houses, roads and boats, reefs, cays, stilt houses, ferries, longtails, critters, and activity spots capped at five per island.
- `maps.js`: Tripwrights' region strips (`UJ.maps.caribbean`, `UJ.maps.seasia`) and island screens (`UJ.maps.island(id)`), with tap targets in the vessel's contract.
- `level-paradise.js`: Paradise drawn from the owner's photos as a dive-shop level, ground and upstairs (`UJ.level.paradise({ floor })`), with its reshape note.
- `dive-board.html`: **the dive-shop board**, every screen a dive shop needs in the dive-shop palette (the dive-shop equivalent of Josie's design boards). Rules: `docs/dive-shop-handbook.md`.
- `world.html`: **the world board**, all of the above in one page (`?targets` outlines the tap areas).
- `levels.html`: **the level board**, the game design drawn: build a level (photos, blocks, art pass), state ladders, bubbles, the 2-for-1 step ledger. Rules in `docs/level-design.md`.
- `palettes.json`: **the one source of truth** for every color. Edit here.
- `tools/build-art.mjs` (repo root): `node tools/build-art.mjs` writes `tokens.css` and `palettes.js` from it.
- `tokens.css`: world tokens, a `[data-place="…"]` block per place (light + dark), then `components.css` (cards, buttons, pills, chips, sign, sheet). Put `data-place="paradise"` on `<html>` or any container.
- `kit.js`: ES5 SVG props: `UART.props.pot / palm / umbrella / table / counter / rock / reef / crab / turtle / boat / dock / buoy / tankRack / wetsuit / fins / mask / compressor / rinse / board / sea …`, placed with `UART.at(x, y, rot, scale, markup)`. Ported from Josie's: blob, reef, palm, crab.
- `world.js`: **everything outside a building, in the same hand** (needs `josie.js`): sea, shore bands, cliffs, reefs, piers, life rings,
  the dive flag, pennants and empty plots, **one hull for every boat** (`J.boat(p, 'dive' | 'catamaran' | 'panga' | 'longtail', c)`),
  the bubble helicopter, float plane, helipad, the globe on its stand, container cabins, crates, lanterns, string lights, lighthouse,
  island houses, **the 100 m expedition vessels** (`J.yacht(p, c, 'cat' | 'shadow')`: an orange-and-white passenger catamaran after the Utila ferry, a yacht-support ship with a crane and a sub; every deck station a
  tappable activity), the medevac helicopter and pad (`J.medic`, `J.medpad`), home comforts (rug, armchair, bookshelf, hearth, surfboard, telescope, a sleeping cat), beach life (crab,
  turtle, pelican, windsock, kayaks, loungers), place pins, and `J.mini.<place>`: each real place's simplified self for island overviews (`josies`, `paradise`).
  Paradise's map and Tripwrights' rig and island maps are both drawn from it, so a boat, a pier or a tank looks the same everywhere.
- `josie.js`: **the universe kit.** Josie's drawing idioms lifted from her design board (oblique room view: tops plus front faces, wainscoted back walls, plank and brick floors, plum shadows, front-on plants, chairs, lamps, gear). Everything new is drawn with it so Josie's, Paradise and Tripwrights are one game.
- `icons.js` + `icons.html`: icon tiles in Josie's manner (dive gear, tanks, boat fuel gauge, beds, keys, bell, ...), with status badges (`ok` check, `low` !, `alert` !!, `busy` ...). `UART.icon('tankFull', { p: palette, status: 'ok' })`.
- `places.js`: *simplified* drawings of real places for island overviews (`placeJosies`, `placeDives`): same layout and landmarks as the place's own map, fewer small things; plus Tripwrights' fantasy props (`dome`, `lantern`, `jelly`, `whaleShadow`, `bridge`, `lights`).
- Operating model (one map for staff and guests, roles, notifications): `docs/ops-model.md`.
- Examples to copy: `places/paradise/` (a whole shop and hostel, drawn from the owner's sketches with `art/josie.js`), Tripwrights' ship (`Tripwrights/index.html`), Josie's cafe map (`josiescafe/art/`).

## Using it from another repo

Each place or app is its own repo and ships static files, so **copy `tokens.css`, `palettes.js` and (if you draw) `kit.js` into your `art/` folder** and keep the header line so it can be re-synced. Do not hand-edit the copies. Josie's shipped CSS uses literal hex values (for iOS 9 support, no CSS variables); its values are recorded in `palettes.json` under `josies-cafe` and do not need to change.

## Adding a place

1. Sketch its palette: pick one **accent** that is not already on the island (Josie pink, Tripwrights blue, Paradise blue-white), with an `accent-ink` that reads on it (white on deep colors, dark ink on light ones) and an `accent-deep` for text/thin lines on paper. Add it to `palettes.json`, run the build.
2. Draw the place's footprint from above with the kit; add one or two props to `kit.js` only if the place needs something new (and say who might reuse it).
3. Give it a small animal or joke of its own.
4. Put the same palette in the place card (`palette`), so Tripwrights tints its pin and sheet in the place's colors.
