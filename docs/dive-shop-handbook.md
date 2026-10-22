# The dive-shop game: design handbook

Josie's Cafe is the template for every cafe. This handbook is the template for every **dive shop**: how a dive shop becomes a
level of the same game, what it looks like, how each person plays their part of the day, and what it must never cost them.
Paradise Divers (Utila) is the first shop built from it.

Read with: `docs/level-design.md` (the laws and the level pipeline for any place) · `art/dive-board.html` (every screen,
drawn) · `art/level-paradise.js` (the first dive level) · `art/README.md` (drawing rules).

> **Plan a dive trip as easily as you play a game; run a dive shop as easily as you play Diner Dash.**
> The game is the real day on the water. The screen only makes it lighter.

---

## 0. The four laws

The three laws of every level, read for a dive shop, plus one that only a dive shop needs:

1. **2-for-1.** A step added in the OS must remove at least two in real life. Dive shops run on clipboards, radios, whiteboards and
   shouting across the sand; each of those is a step the game can remove.
2. **Done is a state of the world.** The boat leaving closes its manifest. The filler's Done fills the rack. A made bed is made.
   Nobody taps "Ready" to tell the system what it could see.
3. **Score the shop, never the person.** Fills, boats, waits, sizes that ran out: per shop, per day. No per-person counts, no
   leaderboards, no "fills by filler", no instructor ratings.
4. **Safety is never a game.** Nothing that keeps a diver alive is turned into points, streaks, colors-for-fun or rewards. Dive
   planning, gas, depth, buddy checks, the weather call and certification stay with the people trained for them. The game shows
   their decisions plainly and never pushes against them (section 8).

---

## 1. The palette

Josie's pink belongs to Josie. Every dive shop runs on the **dive-shop palette** (`art/palettes.json` → `dive-shop`), and each
shop then wears its own accent on its own things.

| Token | Value | Used for |
|---|---|---|
| accent (lagoon) | `#0F7C82` | buttons, rings, tabs, the game's chrome |
| accent-deep | `#0B6268` | the ledge under accent buttons, thin lines on paper |
| soft (shallows) | `#A7DCD8` | soft rings, empty seats, chips |
| wash | `#DFF1EF` | icon tiles, segmented controls |
| pop (dive flag) | `#E0473F` | **the one loud thing only** (a fill deadline, refill ASAP, no boats) |
| ink | `#12313F` | text, gauge needles |
| paper | `#F1F7F6` | screen background |
| white sand (map) | `#F7EDE0` | sand platforms and beaches |
| black gear (map) | `#2E3238` | BCDs, fins, masks, wetsuits, engines |

Dark mode values are in `palettes.json`. The shop's own color goes on what is the shop: its name, its boat stripe, its trim and
railings, its pin on the island map. Paradise: teal-blue trim `#2479A8`, white clapboard, grey tin roofs.

Shared with every level (Josie's, Tripwrights): Baloo 2 for headings and numbers, Nunito for text, cards with a soft ring or a
ledge, pill buttons with a ledge, the status words `ok` ✓, `low` !, `alert` !!, `busy` …, always an icon or a word, never color alone.

---

## 2. The shop is a level

A dive shop is drawn from above like Josie's cafe: tops of things plus their front faces, back walls as elevations, warm floors,
plum shadows, life in the corners. **The sea is at the bottom** (the visitor looks from the water toward the shop, so the back walls
are inland), unless the real shop faces another way on the island map.

### The zones every dive shop has

| Zone | What lives there | Who works it |
|---|---|---|
| The water | dock, moorings, the boats, the dock end, reef patches and critters | captain, DMs |
| The edge | kit-up bench, rinse bins, the sand, showers, the palapa | everyone |
| The desk | front desk, the dive board (today's sites), retail | front desk, owner |
| The classroom | table, board, the pool or confined area if there is one | instructors |
| The fill station | tank racks, compressor, fill whips, the O2 kit | tank fillers |
| The rooms | dorms, private rooms, walkways, stairs (often upstairs: its own floor view) | housekeeping, front desk |

A shop with two floors gets **two views of the same map** (ground and upstairs). The upstairs view lays the upper rooms over a
faded ground floor so people keep their bearings.

### The signature

Every dive shop's signature is **its dock and its boat**: drawn a little larger than true, in the shop's colors. Then one small joke
of its own (Josie's has the iguana; Paradise's is still open, the pelican on the dock is a stand-in).

---

## 3. The day is the clock

A cafe's day is orders; a dive shop's day is **boats**. The map wakes up around each departure, and each phase lights up only
what matters then.

| Phase | What happens in real life | What the map shows |
|---|---|---|
| Before the boat | sign-ins, gear by size, tanks loaded, manifest, fuel check | seats filling on the boat, the tank count, the fuel gauge, gear chips per diver |
| Lines off | the boat leaves | the manifest closes by itself; the desk's list moves the boat to "out" |
| Out | the shop is quiet | the quiet moment: stock and room questions appear now, never in the rush |
| Back | rinse, empties to the fill station, logbooks | empties on the rack, rinse bins busy, "Boat back" in Just done (with Undo) |
| Evening | classroom, night dive, rooms | classroom lit, beds to clean, tomorrow's boats opening |

**Lamps come on at sunset** on the map; the dock lights up for a night dive. Quiet motion only, and everything respects
`prefers-reduced-motion`.

---

## 4. Roles and their verbs (three at most, one tap each)

| Role | Sees | Their verbs |
|---|---|---|
| Guest / fun diver | their day: boats, room, gear, their plan | none needed (optional: "Running late") |
| Student | their day + their course (the reef) | none needed |
| Front desk | the desk, rooms, boats, tabs | Book (a tile), Check in, Check out |
| Tank filler | tanks, fill requests, the compressor | I'm on it, Done, Low (gas or a part) |
| Divemaster (and DMT) | their boat, its manifest and gear, tanks, fuel | Ask for tanks, Fuel (Full / Low / Refill ASAP), Lines off |
| Captain | the boat, fuel, the water | Lines off, Fuel, Today's water |
| Instructor | their students, the classroom, their boat | Sign a step, Ask for tanks, Lines off |
| Housekeeping | the rooms only | Clean (one tap per bed) |
| Owner | everything, the day | anything above; the Day view |

Roles are given by the shop, on one identity: the same person can be a guest in March, a DMT in April and a DM in June without
a new account (`VISION.md`, one person's arc).

---

## 5. Objects grow

Every object someone tends has a **state ladder** of four rungs or fewer, drawn in `art/dive-board.html#ladders`.
The drawing changes, not a label.

| Object | 1 | 2 | 3 | 4 (needs a person) | Who sees it |
|---|---|---|---|---|---|
| Tank rack | full | filling | empties | **12 by 1:30** (rose, pulsing) | filler, DM, instructor, owner |
| Boat seats | open | filling | full | lines off (the boat leaves the dock) | desk, DM, guest (own seat) |
| Boat fuel | full | low | | **refill ASAP** (rose, pulsing) | DM, captain, owner |
| Rental gear, by size | on the rack | out on a diver | soaking | size out (amber) | desk, DM |
| Bed | made, free | occupied | | to clean | desk, housekeeping, the guest in it |
| A course ("your reef") | signed up | theory and pool | ocean dives | certified | the diver, their instructor |
| Today's water | boats go | sheltered side only | | no boats | everyone (shown, never scored) |

Tanks are the one object drawn in true counts, because the count is the job. Everything else is three at most.

**The course reef.** Josie's tables grow from a pot to a flower; a dive course grows a reef. One coral branch per real step,
added when the instructor signs it (which they already do in the logbook). It is the diver's own record, never compared with anyone.

---

## 6. Bubbles and loudness

- **Anchored:** a bubble sits on its object (the boat, the rack, the bed), never floats.
- **Two words and a number:** "12 by 1:30", "low", "2 to clean", "PM boat 8/12".
- **Only for the role that can act:** a guest never sees tank counts or fuel; housekeeping never sees the till.
- **One loud thing on screen.** Rose and pulsing only for a real deadline: a fill needed by a departure, refill ASAP, no boats.
  Everything else is calm or amber.
- **Timed to the quiet moment:** questions (stock, sizes running low) appear after the boat leaves, never during sign-in.
- **They leave by themselves** when the world changes, with Undo for a short window instead of a confirm dialog.

---

## 7. The screens (all in `art/dive-board.html`)

| Screen | Who | Shape |
|---|---|---|
| **Front desk** (POS) | desk, owner | categories left (Fun dives, Courses, Rentals, Rooms, Shop); big tiles; the ticket right with the diver's card and sizes; one big pill to pay or add to tab |
| **Overview** | whoever runs the floor | the map left; "do this next" right: next boat, tanks, boat and rooms, just done |
| **Crew phone** | filler, DM, housekeeping | one card per screen, big pills for wet hands, scroll only for more |
| **Your day** | guest, student | a short feed of what is theirs; the course reef |
| **Day** | owner | four numbers, the map with counts, replay the day, what ran low |

**The diver's card works like Josie's diet toggles.** It greys out what the diver can't book yet and says why ("needs Advanced",
"not on his card"), with "have it" and "ready" chips on what fits. It never hides anything and never promises: the desk checks the
real card at arrival. **Sizes travel with the diver** (BCD, wetsuit, fins), so nobody asks twice and the boat's gear list builds itself.

---

## 8. Safety is never a game (law 4, in detail)

- **No points, streaks or rewards** for number of dives, depth, bottom time, air left or speed. Ever.
- **The weather call is the captain's.** "Today's water" shows their decision; it is never a meter, never scored, never overridden.
- **Certification gates are honest.** The planner and the desk flag what a card allows; neither promises a dive. The shop checks
  the real card, and its instructors decide.
- **Dive planning, gas checks and buddy checks stay in the real world** with the people trained for them. The game does not add
  a checklist screen that could become a tap-through.
- **The O2 kit and first aid are always on the map**, for every crew role, never behind a role switch or a bubble.
- **Medical forms and waivers** are filled by the diver themselves (in Tripwrights before arrival, or on paper at the desk); the
  game only shows "waiver ✓". It never stores medical answers in the hub.
- When in doubt, the game gets out of the way.

---

## 9. Step ledgers (2-for-1, dive-shop edition)

Counted the way people describe their day. A read is free; a tap that writes costs one.

| Feature | Real life before | OS added | Removed | Score |
|---|---|---|---|---|
| Tank request | DM walks to the fill station, finds the filler, says how many and when, filler writes it on the board, DM comes back to check | DM: 1 tap (count + boat) | walk, find, say, write, check back | +1 −5 |
| "I'm on it" / Done | filler shouts across the sand or nobody knows; DM checks the rack | filler: 2 taps | shout, check, the DM's second walk | +2 −4 |
| Lines off | captain radios the desk, desk writes the time, manifest goes in a drawer | captain: 1 tap | radio, write, file | +1 −3 |
| Sizes travel with the diver | desk asks sizes, writes them, DM asks again on the dock, wrong fins swapped | desk: 0 (from last time or the plan) | ask, write, ask again, swap | +0 −4 |
| Waiver in Tripwrights | clipboard, pen, desk checks, files the paper | diver: done on their phone before arrival (pays with the 2+ steps it saves them at the desk queue) | clipboard, check, file | +1 −3 |
| Bed made | housekeeping tells the desk, desk updates the board, guest asks if the room is ready | housekeeping: 1 tap per bed | tell, update, the guest's question | +1 −3 |
| Fuel flag | DM tells the captain or owner later, maybe | DM: 1 tap | find, tell, the forgotten refill | +1 −2 |

Guest steps are only paid by guest savings (the waiver).

---

## 10. Data back (the shop owns it)

| Real moment | Recorded as | Becomes |
|---|---|---|
| Ask for tanks / Done | request → filled time | average fill wait, busiest 15 min at the fill station, whether the compressor keeps up |
| Seats booked / lines off | seats per trip | which trips fill, which sites people ask for |
| Gear handed out by size | size out times | which sizes to buy more of |
| Bed made / checked in | turnaround | rooms ready by check-in |
| Fuel flagged | low times | refuel before it's a problem |
| Course steps signed | the diver's own record | their logbook; the shop sees courses in progress, never a ranking |

No metric that needs a person's name is built. The shop's database is the shop's; the hub sees only its public place card.

---

## 11. Voice and words

Plain, short, bilingual (EN / ES at least; Italian and French where the crew speaks them). The same words in every dive shop:

| Say | Never |
|---|---|
| I'm on it · Done · Low · Refill ASAP · Lines off · Boat back · 12 by 1:30 · to clean · soon | Ready · Submit · Confirm · Are you sure? · Great job! · You're #1 |
| needs Advanced · have it · ready | not allowed · locked · denied |
| boats go · sheltered side only · no boats | perfect conditions · epic · guaranteed |

Times are real times ("by 1:30"), never countdown pressure on a guest.

---

## 12. Building a dive-shop level (photos, blocks, art pass)

The pipeline is in `level-design.md` section 10. For a dive shop:

**Capture (owner, under 15 minutes):** the aerial or satellite view; one photo from the dock end looking at the shop; one from the
shop looking at the dock; the sand or beach; the fill station; the desk; each room or a slow walk-through video upstairs; and a
sentence for anything a photo can't show ("above the office is a dorm"). Paradise was drawn from exactly this.

**Dive blocks** (each brings its game):

| Block | Brings |
|---|---|
| Dock + dock end (with shade, benches, hammock) | moorings, the boat's place |
| Dive boat (shop colors) | seats ladder, fuel ladder, gear list |
| Kit-up bench, rinse bins | rental gear ladder |
| Fill station: racks + compressor + O2 kit | tank ladder, fill requests |
| Front desk + dive board | the POS, today's sites |
| Classroom (+ pool or confined area) | course reef, students |
| Retail wall | sizes, stock |
| Dorm, private room, walkway, stairs | bed ladder, a second floor view |
| Sand platform + seawall, palapa, picnic tables, grill, kayaks | life, the evening |

**Reshape rules, dive-specific:** keep the compressor, the O2 kit and the dock (someone always works there); the boat and dock may
be enlarged; rooms upstairs get their own floor view instead of being squeezed; what you can't see in the photos is drawn as a
labeled stand-in, never invented.

---

## 13. Paradise, the worked example

| | Status |
|---|---|
| Sea at the bottom, dock to the shaded end platform, boat alongside, sand platform behind a seawall of white pipe piles, palapa on the rocks, covered stilt deck to the west, the neighbour's stilt restaurant to the east | from the owner's photos |
| Grey-roof building: sitting area (porch) at the front, the office, the classroom; upstairs: the walkway on the inside third under the roof peak, a room over the sitting area, a dorm over the office, a dorm over the classroom | from the owner |
| White gable building interiors (kitchen and lounge below, two private en-suite rooms above), the gear room and compressor in its front shed room, the stilt deck as the hammock deck, the shared bathrooms | **stand-ins, owner to confirm** |
| Facts from Paradise's own site | PADI courses (Open Water to Divemaster), fun dives, freediving; shared bunk rooms and private doubles/twins, some en-suite with two doubles; full kitchen; hammocks; kayaks and snorkel gear; the new dock with a hammock; 50 m left of the Main Pier |

The board shows Paradise with **sample** names, counts and prices; none of it is Paradise's real data.

---

## 14. Dive-level checklist

- [ ] Drawn from the shop's own photos; stand-ins labeled; reshape note signed by the owner.
- [ ] Dock and boat in the shop's colors; the O2 kit visible to all crew.
- [ ] Every tended object has a ladder of four rungs or fewer, drawn, not labeled.
- [ ] Every role has three verbs or fewer, one tap each; crew phones work with wet hands.
- [ ] Every added step has a passing ledger; guest steps paid by guest savings.
- [ ] Lines off, Done and a made bed close things; no Ready buttons.
- [ ] One loud thing at a time; dive-flag red only for it; reduced motion works.
- [ ] Nothing safety-related is scored, streaked or rewarded; the weather call is shown, not computed.
- [ ] No per-person metric anywhere.
- [ ] Dive-shop palette for the chrome, the shop's accent only on its things; Baloo 2 + Nunito; EN/ES.

---

## Open (owner's call)

- Paradise: confirm the white building's interiors, where the tanks are filled, the stilt deck's use, the shared bathrooms.
- Paradise's animal or joke.
- Does Paradise also teach SSI (the old handover said so; its site lists PADI)?
- Should a guest see "Today's water" before booking, or only on the day?
