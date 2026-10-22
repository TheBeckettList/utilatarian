# Utilitarian: handover for the art and planning project

This file is the brief for a separate chat or project that owns **art direction and planning**. The coding session (Claude Code,
working in the three repos) owns **code only**. Paste or upload this file into the art/planning project as its starting context.
Last updated: 2026-10-22.

---

## 1. Who does what

| Art and planning project (you + that chat) | Coding session (Claude Code) |
|---|---|
| Vision, priorities, what to build next | Turns approved specs into working pages and data |
| Sketches, layouts, what goes where on a map | Draws them with the shared kit (`art/josie.js`), at the agreed detail |
| Palettes, mood, which icons exist and what they mean | Keeps `art/palettes.json` and the icon set in sync, generates tokens |
| Roles, permissions, statuses, notification rules | Implements them, tests them, reports what works |
| Business questions (pricing, partners, hosting, accounting, Utilatab) | Does not decide these; keeps data shapes friendly to them |

**Rule:** the coding session does not invent art direction, layouts, business rules or copy. If a spec is missing something, it
asks, or uses the smallest placeholder and says so.

---

## 2. The vision (one paragraph)

One ecosystem that feels like **one game**, from a traveler planning a trip to a shop owner's books: **Tripwrights** (the
traveler's planner) → each place's **POS and ops** (Josie's Cafe is the finished model; Paradise Divers is the second) →
later **Utilatab** (whole-trip app: accounting, payments, a crypto/FX tab). Same drawn map style everywhere, same status
vocabulary, same "companion applet" with notifications. What you see and can do depends on your role. Ease of use is the
goal: a guest, a diver, a cook and an owner should never have to learn a new interface. Utilatab, payments and FX are
**planned but not designed**; nothing built so far assumes them.

---

## 3. Repos and live pieces

All three repos are on GitHub under `TheBeckettList`. Work happens on branch `claude/eloquent-archimedes-1w3cpo` (no PRs opened yet).

| Repo | What it is | Status |
|---|---|---|
| `josiescafe` | Josie's Cafe: website, menu, ordering, POS, kitchen phones, Josie's World map. **The finished reference.** | Live. Not changed by this work. |
| `utilatarian` | The hub: shared art kit, palettes, place cards, Paradise Divers | Prototype |
| `Tripwrights` | The traveler's planner: the rig, the globe, area boats, island map, plan | Prototype |

Key files (paths are inside `utilatarian` unless noted):

- `art/josie.js`: **the universe kit**, Josie's drawing idioms lifted from her design board. Everything new is drawn with it.
- `art/palettes.json`: the one source of every color (places and Tripwrights areas). `node tools/build-art.mjs` generates `tokens.css` and `palettes.js`.
- `art/icons.js` + `art/icons.html`: icon tiles with status badges (open `icons.html` to see the set).
- `art/places.js`: simplified "island overview" drawings of places (Josie's, Paradise) and Tripwrights' fantasy props.
- `art/kit.js`, `art/components.css`: older prop kit and UI components (cards, pills, buttons, chips, sheet).
- `places/paradise/map.js`: Paradise ground floor and level 2. `preview.html` shows both floors.
- `places/paradise/ops.html`: the crew page (roles, statuses, applet). `index.html`: the public page. `place_card.json`: the public card.
- `docs/ops-model.md`: roles, statuses and notification rules as built.
- `Tripwrights/index.html`, `rig.js`, `app.js`: rig home, area map, place sheets, plan. `Tripwrights/docs/vision-rig.md`: the world model.
- Josie's design boards: `josiescafe/design/boards/*.html` (source drawings), `josiescafe/docs/design-decisions.md`.

To view locally: serve a repo root (`python3 -m http.server`) and open the page.

---

## 4. Art direction: the rules (what the art project owns and can change)

**Reference:** Josie's Cafe map (`josiescafe/img/world/map.png`, `design/boards/Josies.html`). Everything must look like it
belongs in that same world.

The view and drawing rules, as built in `art/josie.js`:

1. **Oblique "room from above"** (like an Animal Crossing room): floors and tops seen from above; every object also shows its
   **front face** as a darker band underneath; back walls drawn as **elevations** (colored top band, cream wall, tiled
   wainscot, white sill, windows with shutters).
2. **Front-on small things:** plants in pots, chairs, lamps, machines, dive gear.
3. **Top-down exceptions:** vehicles, boats, umbrellas, palapas, trees, palms.
4. **Flat fills, no outlines, no gradients.** Shadows are plum `#5B3843` at about 15%. Dark details are plum or near-black, never pure black.
5. **No text on the map.** Information lives in **status bubbles**: a white circle on a ledge with the object inside, plus a small pill
   underneath ("low", "6 full", "9 clean me"), with a one-line tooltip.
6. **Groups of three at most** for anything except tanks. Simplify quantity, emphasize quality and the statuses people need for
   their daily job. Not busy art.
7. **Tanks are the exception** because their count *is* the status: full tanks where they are expected (boat, action area),
   empties in the tank room.
8. **Each place has its own palette on the things that are the place**; shared world colors (sand, sea, wood, plants, rocks) are the same everywhere.

Current palettes:

| Place | Look |
|---|---|
| Josie's Cafe | pink and cream (fixed, it is live) |
| Paradise Divers | blue, white wood, black dive gear |
| Tripwrights | sea blue with brass accents; the rig is a believable "Atlantis-style" sea habitat off England, allowed to be more fantastical because it is digital-only |
| Tripwrights areas (boats) | Utila yellow dive boat, Roatán coral catamaran, Guanaja jade panga, Koh Tao violet longtail |

---

## 5. What exists today

### Paradise Divers (Utila): SSI and PADI dive shop + hostel
Drawn from the owner's two sketches and the satellite view. **Sea at the top.**
- **L dock** from the beach out to the **Confined** house at its end; dive boat tied alongside; a second mooring on the other side.
- **Beach (lower level)** between the office and the sea: action area (kit-up), palapa umbrella share, drinks, rinse bins, shower, grill.
- **Two parallel 2-story buildings** running inland, alley between them (bicycles and Honda Navis, future rentals).
  - Left: office + dive board (facing the beach), classroom, gear repair, R1, R2, dorm, full/single, steps.
  - Right: drinks/food prep, kitchen, regulator rinse, retail (masks, regs, fins, BCDs, wetsuits, fitting table), tank room (racks, compressor).
- **Level 2:** left wing rooms 11 (dorm), 10 (single), 9 (dorm), bathroom, 8 (dorm), 7 (two fulls), 6 ("like R4"); right wing suites A–D (2 queens, bathroom, A/C); walkway along the alley; stairs at the inland end.
- Neighbors: **Josie's to the west**, the **restaurant building to the east**.

**Crew page (ops):** same map for everyone; what shows depends on role.

| | guest | tank filler | front desk | housekeeping | DM | instructor | owner |
|---|---|---|---|---|---|---|---|
| Boat departure, own day | yes | yes | yes | yes | yes | yes | yes |
| Tanks, fuel, fill station | | yes | | | yes | yes | yes |
| Flag boat fuel (Full / Low / Refill ASAP) | | | | | yes | yes | yes |
| Ask for tank fills | | | | | yes | yes | yes |
| Take fills (I'm on it / Done) | | yes | | | | yes | |
| Rooms: check in / check out | | | yes | | | | yes |
| Rooms: mark clean | | | | yes | | | yes |

- **Tank requests come in two kinds:** *needed by a time* (urgent: "15 tanks for the PM dive, we leave in 2 hours"; loud,
  notifies fillers and owner, pulsing bubble) and *whenever, no rush* (quiet note to fillers).
- **Companion applet:** each role's notifications; guests see "your day" (room, boat, Josie's lunch).
- **Status vocabulary (shared everywhere):** `ok` (check), `low` (!), `alert` (!!), `busy` (...). Always icon + word, never color alone.
- **Prototype limits:** state is in the browser (shared across tabs). The real thing needs the shop's own database (like Josie's POS). The shop owns its data.

**Place card** (`place_card.json`): hours (placeholders), agencies `SSI` and `PADI`, courses with the card each needs (Try scuba,
Open Water, Advanced, Rescue, fun dives, night dive), cert ladder `none < ow < aow < rescue < pro`. No prices (removed until the shop gives them).

### Tripwrights
- **Home: the rig.** Sea habitat off England with a helipad and helicopter, a float plane at its jetty, a globe hall (glass dome), and a pier with one adventure boat per area.
- **Globe** → choose an area. **Boat** → the area's island map. **Tap a place** → your boat pulls up, the place's sheet opens in its own colors.
- **Utila** is the only live area: Josie's and Paradise on a bay. Place sheet: pick a day, add Morning / Afternoon / Evening (only blocks the place is open).
- **Diver's card:** level + agency (SSI, PADI, other); Paradise's courses show *ready*, *have it* or *needs X*.
- Plan is saved on the device. No login yet (later: WhatsApp-number accounts).

### Josie's Cafe
Finished and live; it is the model for everything. Its rules live in `josiescafe/docs/design-decisions.md`.

---

## 6. Open decisions for the art and planning project

Please answer these there; the coding session will build to the answers.

1. **Paradise satellite marks:** is the red oval left of the pier a second boat mooring, and the small mark off the end of the dock the L leg? Is "Confined" an enclosed confined-water pen at the dock end?
2. **Paradise level 2:** room 6 is labeled "like R4". What is R4? Exact room count and beds per room?
3. **Paradise roles:** should instructors take fill requests, or only tank fillers? Who sets boat fuel? Does a guest see their own room's status?
4. **Hostel statuses:** free / occupied / needs cleaning enough? Add "out of order", "late checkout"?
5. **Hours and courses:** the real hours, course list and days per course (currently placeholders).
6. **Tripwrights art:** should the rig, globe hall and island maps be redrawn with `art/josie.js` now (same universe as Paradise), or after the next shop?
7. **Which area or shop next?** (Roatán, Guanaja, Koh Tao, or another Utila place.)
8. **The ecosystem contracts:** approve the shared data shapes before more apps are built: guest + cert, place card, booking, status, role/level, ledger event (for accounting and Utilatab later).
9. **Utilatab:** when should its first data shapes (ledger events) be designed?

---

## 7. How to hand work back to the coding session

Send one request per message, in this shape. Attach sketches or screenshots as images.

```
WHAT:     <one line: build / change / fix>
WHERE:    <repo and page, e.g. utilatarian places/paradise/ops.html>
SPEC:     <what it should look like and do; list items, positions, colors if they matter>
RULES:    <roles, statuses, notifications, limits>
DONE WHEN:<how you will judge it, e.g. "a DM can flag low fuel and the owner gets a notification">
NOT NOW:  <anything to leave out>
```

Good examples:
- "WHAT: add 'out of order' room status. WHERE: Paradise crew page. RULES: front desk and owner can set it; housekeeping sees it; guests never. DONE WHEN: a room can be set out of order and shows a bubble with '!!'."
- "WHAT: redraw Tripwrights' Utila map with josie.js. SPEC: attached sketch; Josie's west, Paradise east, bay between; boat arrives through the channel. NOT NOW: other areas."

The coding session will build it, test it in a browser, commit and push to the branch, and report what works, what was assumed and what is blocked.
