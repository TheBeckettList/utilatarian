# Collaboration and handover

How the **planning chat** (a Claude project: ideas, design, decisions, art) and the **code session** (Claude Code: building, testing, shipping) work together without stepping on each other. Paste this whole file into the planning project's knowledge.

---

## 1. The ecosystem in one paragraph

**Utilitarian** builds a free POS for each participating place on an island. **Josie's Cafe** (Utila, Honduras) is the finished, live reference and the "fractal base" of the design: its live data and UI are what the rest of the ecosystem pulls from and adjusts to. **Tripwrights** is a game-like trip planner on top of it: spin a globe, board a region's vessel, pick what to do, put it in Morning / Afternoon / Evening, step inside a real place's own app. The same app follows a person's whole arc: traveller, guest, local, crew (plan a week, stay a month as a divemaster trainee, become a divemaster and use the dive shop's crew app). The long-term growth model is a toolkit that a local partner on any island uses, with AI help, to put shops on the system. Vibe: Diner Dash / Animal Crossing. Plan a vacation as easily as you play a game; run a shop as easily as you play Diner Dash. Reality, gamified; nothing made up.

## 2. Who does what

| | Planning chat (project) | Code session (Claude Code) |
|---|---|---|
| Owns | vision, flows, copy, naming, priorities, **art direction and art** | implementation, tests, deploys, data wiring, keeping the demo working |
| Produces | decisions, specs (section 6), art files in `utilatarian/art/` | commits, a working demo, a short report per piece of work |
| Never does | edit app code in `Tripwrights/` or shop pages | decide product direction or redraw art without being asked |
| Both | **never touch `josiescafe`** (live, working; changes are the owner's call) | |

The owner (the dev and idea person) makes the final call and shares the demo with Tripwrights' owner (a friend who runs the travel company).

Since 2026-10-23 the planning chat is the **Studio** chat: the one chat in the "Utilitarian P/OS" Claude project connected to the
repos. It also draws for other worlds in the same house style (a pizza business themed around cars, Foundaition), each planned in
its own "World" chat in that project. The chat map is `STUDIO.md` in the project's knowledge; the shared look is `docs/house-style.md`.

## 3. Repos, branches, links

| Repo | Role | Branch to use |
|---|---|---|
| `TheBeckettList/Tripwrights` | the planner demo (static site, no build) | code session works on `claude/sleepy-goldberg-btb9eo` and mirrors to **`main`**; GitHub Pages serves `main` |
| `TheBeckettList/utilatarian` | art kit, shop pages, vision, ops docs | `claude/sleepy-goldberg-btb9eo` (the other branch, `claude/eloquent-archimedes-1w3cpo`, is an older line that this one contains) |
| `TheBeckettList/josiescafe` | **Josie's live site and POS** | hands off |

- Demo (after the owner turns on Pages for `Tripwrights`, branch `main`, root): https://thebeckettlist.github.io/Tripwrights/
- Josie's live site: https://josiescafe.com (Tripwrights opens it inside a frame; nothing is copied).
- Both chats share one filesystem. Planning/art writes to `utilatarian/art/` and `utilatarian/docs/`; code writes everywhere else.

## 4. Where things are

```
utilatarian/
  VISION.md              the long vision and the "one ecosystem, one person's arc"
  art/                   THE art kit, master copy
    josie.js             Josie's drawing idioms (rooms, furniture, gear). Needs nothing.
    world.js             everything outside a building: sea, shores, piers, boats, vessels, aircraft, the globe, props, simplified place drawings (J.mini.*)
    palettes.json        the one source of truth for colors (run tools/build-art.mjs to regenerate tokens.css / palettes.js)
    README.md            drawing rules and "the shared grammar" (READ THIS before drawing)
  places/paradise/       the stand-in dive shop's own pages (map, ops/crew view, place card)
  docs/ops-model.md      one map for staff and guests, roles, notifications
  docs/COLLABORATION.md  this file
Tripwrights/
  index.html             page, HUD, sheets, Josie's/Paradise full-screen frame
  data.js                regions, islands, places, hours, getting-there legs (plain data)
  globe.js               the full-screen globe (Natural Earth coastlines in art/land.js)
  scenes.js              home port, region (vessel + islands), island map drawings
  app.js                 routing (#, #globe, #r/<region>, #i/<island>, #p/<place>), plan, sheets
  art/                   COPY of utilatarian/art (never edited by hand)
  places/paradise/       copy of the stand-in shop page, with planning pins
  docs/                  vision-world, ui-flow, brand, diver-flow
```

## 5. What exists now (status)

**Works and demoable**
- **Home port:** a lodge on a bluff with the globe by the fire, a medevac helicopter ("Cover", insurance later, not sold), a seaplane ("Getting there"), one vessel per region at the pier.
- **Globe:** full screen, simplified real Earth, regions glow; spin, tap a region, it turns to face you.
- **Region:** islands across the top, the region's vessel drawn huge, every deck station an activity (Rest, Stay, Eat, Dive, Sail, Fish, Snorkel & paddle) that lists the places offering it.
  - Caribbean (live): an orange-and-white passenger catamaran after the Utila ferry. Utila (live), Roatan, Guanaja (coming).
  - Southeast Asia (coming): a yacht-support ship with a crane, tenders and a small sub. Koh Tao, Koh Phangan, Koh Samui (coming).
- **Getting there** (Caribbean): fly into San Pedro Sula, bus to La Ceiba, ferry to Utila (or small plane), "land to Josie's". Each leg links out and can go in the plan with its real blocks. Times are approximate; links are searches until we have the operators' URLs.
- **Island (Utila):** Josie's Cafe and a stand-in dive shop drawn as their simplified selves on a bay.
- **Step inside:** tap Josie's, the real live site opens full screen (her map, scenes, menu board, ordering), with a back pill, **+ Plan** and a plan count. Tap the dive shop: its map opens with **planning pins** at the dive board (courses matched to your card) and the front desk (book a room, extend nights; nights go into the plan as Evening blocks).
- **Plan:** place + day + block, saved on the device, no login.

**Stand-ins and gaps (say so in demos)**
- Only Josie's is a real place with real hours. The dive shop is a **stand-in** (named Paradise in data) that the owner will refine and later gift to the real Paradise.
- Other islands, Southeast Asia routes, hours: sample or coming.
- Not built: accounts (WhatsApp Business login planned), real bookings/orders from plan items, Cover/insurance, payments, live hub place cards (data is embedded in `data.js`), the partner toolkit (parked until a few Utila shops and Tripwrights are running).

## 6. How planning hands work to code

Planning produces a **spec** in the form below (a message pasted to the code session, or a file in `utilatarian/docs/specs/`). Small and concrete beats big and vague.

```
SPEC: <short name>
Why: one sentence (who it helps, what moment in the trip/shop day)
Behavior: what the user sees and taps, in order (3-8 steps)
Data: what it reads/writes (place, day, block, hours, offers...) and where it comes from
Art needed: which pieces, from the kit vs new (art chat delivers into utilatarian/art/)
Not now: what is deliberately out of scope
Done when: how we both know it works (a click-through the code session can run)
Open: questions only the owner can answer
```

**Code reports back** with: what changed, what was tested and how, what still uses stand-in data, anything it could not verify from its sandbox (for example, it cannot reach josiescafe.com or Josie's database), and the demo link status.

## 7. Art workflow (planning chat's part)

1. Read `utilatarian/art/README.md` ("The shared grammar"). Draw from above, flat soft shapes, no outlines, no gradients, one plum shadow down-right, every object a top over a darker front face, every light a warm bulb with a soft halo, a place's color only on what is that place.
2. Add or edit in `utilatarian/art/` only (`world.js` for outdoors, `josie.js` for interiors, `palettes.json` for colors). Plain ES5, no build.
3. **Keep the contract the app depends on.** The vessel (`J.yacht(p, colors, kind)`) returns `{ base, parts }` with parts named `rest, stay, eat, dive, sail, fish, water`, each `{ m, box: [x,y,w,h], tag: [x,y] }`. Boxes/tags must sit on the matching spot of the deck (they are the tap targets and labels). Keep tags uncluttered. Pieces keep their names; add new ones freely.
4. Tell the code session "art ready: <what>". The code session copies `art/` into `Tripwrights/art/`, runs the click-through, fixes any layout fallout, commits, and pushes. Never hand-edit the copies.
5. Do not draw logos or text into art; labels are added by the app.

## 8. Decisions already made (do not re-litigate without the owner)

- Josie's is untouched; her live site and data are the base the ecosystem adapts to.
- The hub is a registry of public place cards; each place is its own database. Planner reads cards, nothing else crosses.
- Real map eventually; for now illustrated islands and a real-coastline globe. Only participating places are drawn big in their own colors.
- Each region gets its own custom vessel; the seaplane is "getting there"; the helicopter is Cover (insurance, health, dive cover) later.
- No login for testing; WhatsApp Business accounts later; one identity, roles granted by places.
- Josie-style visual language everywhere (Baloo 2 + Nunito, ringed cards, pill buttons with a ledge). Tripwrights' own color is sea blue; each place wears its own.
- Diving is first-class: a diver's card (agency + level) gates courses and dives; planner flags and never promises.
- Partner/toolkit detail is parked until a few Utila shops and Tripwrights are running.

## 9. Open questions for the owner

- Real operator links: Utila Dream Ferry, the bus line, an airline partner (replace search links).
- What does Tripwrights' owner most need to see in the first demo?
- What does a plan item become at a real shop (an order? a booking request?) and who confirms it?
- When to give the stand-in dive shop to the real Paradise, and what of its pins/stay flow stays Tripwrights-only.
- Coordinates and drawings for Roatan, Guanaja, Koh Tao as shops there are added.

## 10. House rules for both chats

- Be plain and short. Say what is real and what is a stand-in.
- Never fake data presented as real; label samples.
- Do not invent facts about places, certifications or schedules; say "approximate, check with them".
- If something cannot be verified from where you are, say so instead of assuming.
