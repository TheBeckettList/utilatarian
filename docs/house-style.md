# House style: the game look, for any world

The look and the game rules shared by every project drawn in this style: Utilitarian (Josie's Cafe, dive shops, Tripwrights),
and each new world after it (a pizza business themed around cars, Foundaition for owner-builders, ...). Brand-neutral on purpose:
a world brings its own colors, signature and words; this file is what never changes.

Owned by the Studio chat (the one connected to the repos). Master copy: `utilatarian/docs/house-style.md`; a mirror lives in the
Claude project's knowledge as `HOUSE-STYLE.md`. Detail and worked examples: `docs/level-design.md` (any place),
`docs/dive-shop-handbook.md` (a whole world, done), `art/README.md` (drawing rules), `art/levels.html`, `art/dive-board.html`.

> **Reality, gamified.** A calm, sunny, top-down toy world: Stardew Valley's warmth without the pixels. The game is the real day;
> the screen only makes it lighter.

---

## 1. The two references

| Scale | Reference | Use it for |
|---|---|---|
| Inside a place | Josie's cafe board (`josiescafe/img/world/map.png`, `design/boards/Josies.html`) | any level: a shop, a kitchen, a garage, a house under construction |
| A town, island or region | Josie's bay map (`josiescafe/art/bay.js`) | maps between places: islands, a delivery area, a neighbourhood of job sites |

## 2. Drawing grammar (every world)

1. **From above, cut away.** Floors and the tops of things from above; every object also shows its **front face** as a darker band
   under it; back walls drawn as elevations (top band, wall, wainscot, sill, windows). Never real perspective.
2. **Small things front-on** (plants, chairs, machines, gear, tools). **Vehicles, umbrellas, trees and roofs top-down.**
3. **Flat fills, no outlines, no gradients.** An edge is a darker shape under the main one. Strokes only for things that are lines
   (ropes, hoses, wires, a needle).
4. **One soft shadow, down-right, plum `#5B3843` at about 15%.** Dark details are plum or near-black, never pure black.
5. **Round everything.** Generous corners; sharp only for flags and fins.
6. **Two or three tones per object.** White is a color.
7. **Life in the corners, lightly** (a plant, a rock, a critter); room to breathe around what people tap.
8. **The world's color only on what is the world's.** Ground, water, plants, wood and rocks are shared; the brand's color goes on
   the things you'd point at and say "that's theirs".
9. **Real shape underneath.** Maps keep real layouts and coastlines; levels are drawn from the owner's photos. Nothing invented;
   anything not yet seen is a labeled stand-in.
10. **No text in the art.** Words live in pills and bubbles added on top. No logos drawn by hand: a brand mark is a supplied asset.
11. **Quiet motion**, small and finished; everything respects `prefers-reduced-motion`.
12. **Never color alone.** Status always carries an icon or a word: `ok` ✓, `low` !, `alert` !!, `busy` …

## 3. Screen grammar (every world)

- **Type:** Baloo 2 for headings and numbers, Nunito for text, unless a world's brand guide names its own (recorded in the world bible).
- **Cards** white with a soft ring or a darker ledge under the bottom edge; **pill buttons with a ledge**; tonal chips; round badges.
- **Header:** the place's name in its color, a pill segmented control for the screens, language pill, time, a round avatar.
- **The map sits in a big rounded card**, with "do this next" beside it, never full-bleed under the chrome.
- **One loud thing on screen**, in the world's `pop` color, pulsing only for a real deadline.

## 4. The game (every world)

**The laws.** Break one and nothing ships.
1. **2-for-1.** A step added in the app must remove at least two in real life. Every spec carries a step ledger.
2. **Done is a state of the world.** Things finish when the real thing happens; no Ready / Done / Submit buttons for what the
   system can see.
3. **Score the place, never the person.** Per place, per day; no per-person timers, ranks, streaks or leaderboards.
4. **The world's "never a game".** Each world names what must never be gamified (dive safety; food safety; building code,
   inspections and structural decisions; ...). Shown plainly, never scored, never pushed against.

**Structure.** World → region → level (one real place) → room/station → object → the moment (one tap).
Every level has the same screens: the counter (POS or intake), the overview (map + do this next), the crew phone (one card per
screen), the person's own day, and the owner's day.

**Objects grow.** Every tended object has a state ladder of four rungs or fewer, drawn, not labeled. Josie's tables grow from a pot
to a flower; a dive course grows a reef. Only the last rung is loud.

**Bubbles.** Words on the map live in bubbles anchored to their object: two words and a number, only for the role that can act,
timed to the quiet moment, gone by themselves when the world changes, with Undo instead of a confirm.

**Verbs.** Three per role at most, one tap each.

**Rewards** are the world getting nicer for everyone in it (flowers, lights at closing, critters on a calm day). There are no
punishments; the worst state is a wilting sprout in a rose ring.

## 5. Making a world from a brand

A world is the house style plus five things. The world's chat writes them in a **world bible**; the Studio draws them.

| The world defines | From | Example (dive shops) |
|---|---|---|
| Palette tokens: `ink, ink2, paper, card, accent, accent-ink, accent-deep, edge, soft, wash, pop, line` + dark mode | the brand guide, mapped to the roles below | lagoon teal accent, dive-flag red pop |
| Signature and its joke | the real places | the dock and the boat; a pelican |
| Blocks (the preset pieces a level is built from) | what every place in the world has | dock, fill station, kit-up bench, dorm |
| Ladders, verbs, words | the real day of the people in it | tanks: full, filling, empties, 12 by 1:30 |
| Its "never a game" | the domain's risks | safety: the weather call is the captain's |

**Mapping a brand guide to tokens:** the brand's main color becomes `accent` (with `accent-deep` for its ledge and thin lines); its
light tint becomes `soft` and `wash`; its loudest color becomes `pop` and is used for the one loud thing only; text goes to `ink`.
Shared world colors (sand, water, wood, plants, rocks, the plum shadow) do not change. Where the brand and the house style disagree
(fonts, a color that fights the ground), the world bible records it and the owner decides.

## 6. Making a level

Owner's photos (under 15 minutes) → preset blocks snap to them → a designer's art pass in one-line prompts (cut, keep, move, merge,
enlarge, simplify, recolor, add life) → a reshape note the owner signs. Cut what nobody tends; keep what you'd point at; compress
distance but keep order; enlarge the signature; three of anything unless the count is the job; never add what isn't there.
(Full method: `docs/level-design.md` section 10.)

## 7. Checklist for any world

- [ ] World bible approved: palette, signature, blocks, ladders, verbs, words, its "never a game".
- [ ] Palette in `art/palettes.json`, tokens rebuilt; brand marks supplied as assets, not drawn.
- [ ] A board for the world (like `art/dive-board.html`) showing every screen with sample data, labeled as sample.
- [ ] The first level drawn from real photos, reshape note signed.
- [ ] Step ledgers pass 2-for-1; no per-person metric; one loud thing at a time; reduced motion works.
