# The Studio: how the chats in this project work

This Claude project ("Utilitarian P/OS") is the home of **one art style used across several projects**. One chat, the **Studio**,
is connected to the repos and draws everything. Each project that adopts the style gets its own **World** chat here, which turns
that project into a world of the game and sends the Studio briefs. Every chat in this project reads this file first.

Master copy: `utilatarian/docs/STUDIO.md` (mirrored in the project knowledge). The look itself: `HOUSE-STYLE.md`.

---

## 1. The chats

| Chat | Owns | Repos | Produces |
|---|---|---|---|
| **Studio** (the first chat in this project) | the house style; every drawing for every world; the Utilitarian world (Josie's Cafe, dive shops, Tripwrights) and its planning | push: `utilatarian` (`art/`, `docs/`). Read: `Tripwrights`, `josiescafe`, `Foundaition` | kit pieces, boards, levels, world handbooks, specs for code sessions, updates to the knowledge files |
| **World: Pizza x Cars** | turning the pizza business and its brand guide into a world of the game | none (asks the Studio) | the world bible, art briefs, step ledgers, flows |
| **World: Foundaition** | the same for Foundaition (owner-builder project management, growing into each home's living record) | none (asks the Studio) | the world bible, art briefs, step ledgers, flows |
| **World: (next)** | one new chat per project that adopts the style | none | same |

Outside this project:

| Where | Owns | Gets from here |
|---|---|---|
| Each project's own Claude project (the pizza project, the Foundaition project) | the business or product itself: plans, money, product decisions | the **world pack** (section 4) as knowledge |
| Code sessions (Claude Code): Tripwrights' session, Foundaition's sessions (`Foundaition/docs/SESSIONS.md`) | building and shipping | specs, and art copied from `utilatarian/art/` (never hand-edited) |

**Rules.** Only the Studio commits art. World chats brief; they don't draw final art. Nobody touches `josiescafe` (live).
A World chat never changes the house style; it asks the Studio, which changes it for every world or not at all.

## 2. What lives where

| Thing | Lives in | Note |
|---|---|---|
| `STUDIO.md`, `HOUSE-STYLE.md` | project knowledge, mirrored from the repo | every chat reads them |
| `LEVEL-DESIGN.md`, `DIVE-SHOP-HANDBOOK.md` | project knowledge, mirrored from the repo | the method in full, and one finished world to copy the shape of |
| `WORLD-<name>.md` (one per world, once approved) | project knowledge | the world bible, filed by the Studio |
| Art, boards, handbooks, palettes | `utilatarian/art/`, `utilatarian/docs/` | **public repo**: art and style docs only |
| Business plans, brand guides, financials | the project's own Claude project | not committed to a public repo unless the owner says so |

## 3. Opening a new World chat

1. Start a new chat in this project; name it **"World: <name>"**.
2. Paste the kickoff below and attach: the brand guide, the business or product doc, and photos or sketches of the real places
   (a shop, a site, a house). Video walk-throughs are fine.
3. The World chat writes **World Bible v0** (format in section 5) and asks the owner the open questions.
4. Owner approves; the Studio files it as `WORLD-<name>.md` in the knowledge and adds the palette to `art/palettes.json`.
5. The World chat sends its first **art briefs**: the palette swatches, a board, the first level.
6. The Studio draws, checks and commits, then replies **ART READY**.
7. The Studio assembles the **world pack** for the project's own Claude project.

**Kickoff (paste into the new chat):**

```
This is the World chat for <project>. Read STUDIO.md and HOUSE-STYLE.md in this project's knowledge first.
Your job: turn <project> into a world of the house style. Attached: <brand guide>, <business/product doc>, <photos>.
Start with World Bible v0 (STUDIO.md section 5). Ask me what you can't tell from the docs. Don't draw final art:
send art briefs for the Studio chat (format in section 5). Keep business plans and financials out of anything public.
```

## 4. The world pack (what goes back to the project's own Claude project)

1. `WORLD-<name>.md`: the approved world bible.
2. The world's handbook (like `docs/dive-shop-handbook.md`): laws, palette, screens, ladders, ledgers, voice.
3. Links to the board and levels (`art/<world>-board.html`, `art/level-<place>.js`) and their screenshots.
4. `HOUSE-STYLE.md`.

## 5. Formats

**World bible**
```
WORLD: <name>                       version / date
In one line: <the business, and the game it becomes>
The real day: who does what, hour by hour (3-8 lines)
Places (levels): <each real place, with photos or "to capture">
Maps between places: <town, delivery area, job sites...> (or none)
Palette: brand color -> tokens (accent, accent-deep, soft, wash, pop, ink, paper) + dark mode; conflicts with the house style
Signature + its joke: <the thing you'd point at; a small critter or gag>
Blocks: <the preset pieces every place in this world has, each with the ladder it brings>
Roles and verbs: <role: three verbs max>
Ladders: <object: rung1 / rung2 / rung3 / rung4 (needs a person)>
Never a game: <what must never be scored in this world>
Words: <say / never say>
Open: <questions only the owner can answer>
```

**Art brief** (World chat -> Studio)
```
ART BRIEF: <world> / <piece>
What it is in real life: <with photos>
Where it's used: <screen, size, phone or tablet>
States: <its ladder, if it has one>
Tap targets and ids: <...>
Not now: <...>
Done when: <how the World chat will judge it>
```

**Art ready** (Studio -> World chat / code session)
```
ART READY: <world> / <piece>
Files: <paths>, functions and what they return
Contract: <ids, sizes, what the app must not change>
Preview: <board link or screenshot>
Stand-ins: <anything not confirmed>
```

**Spec** (any chat -> a code session): the format in `utilatarian/docs/COLLABORATION.md` section 6, with a step ledger.

## 6. The worlds today

| World | State | Next |
|---|---|---|
| **Utilitarian** (Josie's Cafe, dive shops, Tripwrights) | live in the Studio: level design guide, dive-shop handbook and board, Paradise from photos, islands and regions | code session wires the redraw (`docs/specs/world-redraw.md`); owner answers Paradise's open questions |
| **Pizza x Cars** | waiting on the business doc and the current brand guide | open its World chat; World Bible v0 |
| **Foundaition** | repo at spec stage (`building-model.md`, `responsibility-agreements.md`; next code session is "Session 0, repo foundation"); no UI yet | open its World chat; World Bible v0 before any UI is built, so Session 0 starts from the style |

Starting hypotheses for the World chats to test against the real docs (not decisions):
- **Pizza x Cars:** the shop is a level drawn like Josie's; cars could be the world's signature (the brand guide decides how);
  the pizza line and the oven are the stations; deliveries could use a bay-map-style neighbourhood map. "Never a game": food
  safety and driving (no speed scores for delivery, ever).
- **Foundaition:** the house is the level, drawn from above and cut away like Josie's room; every part of the house is an object
  whose ladder runs through the build (planned, underway, inspected, done) and later through its life (new, aging, service due,
  replace), which is the living record the product grows into. Job sites can share a neighbourhood map. "Never a game": code,
  inspections, permits and structural decisions; who is responsible for what (the responsibility agreements) shown plainly.

## 7. Open (owner)

- **Where the shared kit lives once a second world ships code:** stay in `utilatarian/art/` with a folder per world, or move the
  core kit (`josie.js`, `world.js`, `island.js`, the style docs) to its own repo that each product copies from. Until then it stays
  in `utilatarian`.
- Are any brand guides confidential? All three active repos are public.
