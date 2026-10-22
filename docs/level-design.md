# Level design guide: one game, every place

How to turn any real place (a cafe, a dive shop, a hostel, a ferry, a whole trip) into a **level of the same game Josie's
Cafe already is**. Owned by the planning chat. The drawing rules live in `art/README.md`; this file is the game design on top
of them: what a level is, how it plays, what it records, and what it is never allowed to cost the people in it.
The visual version of these rules is `art/levels.html` (open it next to this file). Dive shops have their own handbook built on this one: `docs/dive-shop-handbook.md`.

> **Reality, gamified.** The game is the real day. The screen is a map of it that makes the day lighter, never a second job.

---

## 0. The three laws (break one and the level does not ship)

1. **The 2-for-1 step rule.** A step added in the OS must remove at least **two** real-life steps. If it can't, it is not added.
   This is our internal rule; every spec carries a step ledger (section 1) to prove it.
2. **Done is a state of the world, not a button.** Things finish when the real thing happens (the stick comes back, the bag is
   handed over, the boat leaves). Nobody taps "Ready", "Seen", "Done" or "Submit" to tell the system what it could see for itself.
   (Josie's: *there is no Ready, anywhere.*)
3. **The game scores the place, never the person.** Waits, stock, busy times and flow are measured per station and per day.
   No per-person ranking, timer, leaderboard or streak, ever. (Josie's: station averages only, Josie only, never per person.)

---

## 1. The step ledger (the 2-for-1 rule, made checkable)

Every spec (see `COLLABORATION.md` section 6) adds a ledger. Count real steps as a person would describe their day: walk somewhere,
say something, write something, check something, wait for someone.

```
STEP LEDGER: <feature>
Today, in real life:          <numbered list of what people actually do now>
With it, in the OS:           <numbered list of taps added>
Removed in real life:         <which numbered steps disappear>
Score:                        +<OS steps>  -<IRL steps removed>   (passes when removed >= 2 x added)
Who pays the added steps:     <role>   Who gets the removed ones: <role>
```

Rules for counting:
- A tap that only **reads** (looking at the map) is free. A tap that **writes** costs one step.
- A step moved from one person to another is not removed; it still counts against the person who now does it.
- The person paying the added step should be the person who gets something back in the same moment
  (the barista taps "Low" on the beans and never has to find Josie to tell her).
- If a feature adds a step for a guest, it must remove two for that same guest. Staff savings do not pay for guest effort.

Worked examples (both already true at Josie's):

| Feature | IRL before | OS added | IRL removed | Score |
|---|---|---|---|---|
| Stock check (beans) | 1 notice low, 2 find Josie, 3 tell her, 4 she checks, 5 she writes it down | 1 tap "Low" on the grinder bubble | 2, 3, 4, 5 | +1 -4 |
| No Ready | 1 cook plates, 2 cook calls out, 3 server hears, 4 server walks over, 5 marks it | none (stick back at the register closes it) | 2, 5 | +0 -2 |

A step that fails the ledger can still be kept as **optional** only if skipping it costs nothing (the "Not now" on stock check).

---

## 2. What a level is

Everything nests the same way, so a person who learned one level already knows the next.

| Layer | What it is | Example | What you do there |
|---|---|---|---|
| World | the globe | Tripwrights globe by the fire | pick a region |
| Region | a vessel and its islands | the Caribbean catamaran | pick what you want to do |
| Island | the island map | Utila bay | pick a place |
| **Level** | **one real place, drawn from above** | Josie's, Paradise | live your part of its day |
| Room | a station inside the level | bar, kitchen, tank room, dock | the objects you tend |
| Object | one thing with a state | a table pot, a tank, a bed, the boat | look, tap once |
| Moment | the one tap that changes it | "Stick back", "Low", "I'm on it" | the whole interaction |

**A level is a real place.** Its map is traced from the real layout (satellite view plus the owner's sketch). Nothing on it is
invented; a stand-in is labeled as one until the owner confirms it.

**Every level has the same four screens**, so nobody relearns:

| Screen | Who | Shape (Josie's reference) |
|---|---|---|
| **Counter** (POS) | whoever takes the order or booking | category rail left, big tiles center, the ticket right with one big pill to finish |
| **Overview** | whoever runs the floor | the map left (or top on a phone), a short list of "do this next" right |
| **Station phone** | cooks, fillers, housekeeping | one ticket per screen, scroll only, read-only, nothing to mark |
| **Day** | the owner | the same map with counts on it, four numbers, "Replay the day", "Ran low today" |

A guest's view is a fifth, the **companion**: your day as a short feed (your room, your boat, your lunch), never a dashboard.

---

## 3. The core loop: look, tap once, the world changes

Every level plays the same three beats:

1. **Look.** The map already shows what matters for your role. If you have to search, the level is wrong.
2. **Tap once.** On the object, or on the big pill next to it. One tap, one meaning. Never a form.
3. **The world changes.** The object's drawing changes (the pot sprouts, the tank fills, the bed is made). That is the confirmation.
   No toast that says "Saved". (Stock check's "Done. Josie can see it on the map." is the most a confirmation ever says.)

**Verbs per role: three at most.** If a role needs a fourth, two of them are the same verb or one belongs to another role.

| Role at Paradise | Its three verbs |
|---|---|
| Tank filler | I'm on it, Done (fills), Low (gas/fuel) |
| Divemaster | Ask for tanks, Fuel (Full/Low/ASAP), Boat out |
| Housekeeping | Clean (one tap per bed) |
| Front desk | Check in, Check out, Out of order |

---

## 4. Objects grow: the state ladder

Josie's tables are the model. A table is a pot, and the pot **grows** with the order:

> empty pot (free) → sprout (ordered) → flower (food out) → wilting sprout in a rose ring (waiting 15+ min)

Nobody reads a word to know the table's state, and the bad state is still gentle. Every object in every level gets a ladder like
this. Rules:

- **Four rungs at most.** Usually: idle, in use, done, needs a person.
- **The drawing changes, not a label.** The level of liquid, the number of tanks, the sheet on the bed, the needle on the gauge.
- **The last rung is the only loud one,** and it is loud only when it is time-bound (rose ring + pulse). Not time-bound is amber, still.
- **Always an icon or a word too** (never color alone): the shared vocabulary `ok` ✓, `low` !, `alert` !!, `busy` …
- **Counts are shown only when the count is the job** (tanks, stock left, a stick's number). Otherwise groups of three at most.

Ladders already decided or proposed (drawn in `art/levels.html`):

| Object | Rung 1 | Rung 2 | Rung 3 | Rung 4 (needs a person) | Status |
|---|---|---|---|---|---|
| Table (Josie's) | empty pot | sprout | flower | wilting, rose ring | live |
| Stock jar (Josie's) | full | half | low (amber) | out (rose) | live |
| Tank rack (Paradise) | full | filling | empties | "15 by 1:30" rose, pulsing | prototype |
| Boat fuel (Paradise) | full | low | | refill ASAP, pulsing | prototype |
| Bed (Paradise hostel) | made, free | occupied | | needs cleaning | proposed |
| Dive slot (Paradise) | open seats | filling | full | | proposed |
| Plan block (Tripwrights) | empty block | planned | booked by the place | clash (closed then) | proposed |

---

## 5. Bubbles: information appears where the thing is, when someone can act

All words on a map live in **bubbles**: a white circle on a ledge holding the object, with a small pill under it ("low", "6 full",
"Bar · 4 min"). Rules:

- **Anchored.** A bubble sits on its object. Never free-floating text on the map, never outlined or stroked text.
- **Two words and a number, at most.** The rest is one tap away in a sheet.
- **Only for the role that can act.** The guest never sees the tank count; the filler never sees the bill.
- **Timed to the quiet moment.** A question bubble appears when the person is free to answer it
  (Josie's stock bubble appears on the grinder *when the bar is quiet*). A level never interrupts a rush to ask something.
- **It leaves by itself** when the world changes, with an Undo for a short window (Josie's: 10 minutes) instead of a confirm dialog.

---

## 6. Wellbeing, for everyone in the level

The data we get back is for making the day lighter, not for watching people.

| Who | What the level gives them | What it must never do |
|---|---|---|
| Guest | knows what is happening without asking ("Making it", "Picked up", "Boat at 1:30") | show prep times, promise a time it can't keep, make them sign up to look |
| Staff | fewer walks, fewer shouts, fewer questions asked twice; the map answers "what's next?" | time them, rank them, notify them about things they can't act on, add a step to their rush |
| Owner | the day as a picture: busiest 15 min, waits, what ran low and when, a replay | per-person numbers, anything that turns the map into surveillance |
| The island | each shop's card makes the planner right for free | share a shop's data beyond its public card |

**Rewards are the world getting nicer**, shared by everyone in the level, never earned by one person:
the pots flower, the crabs come out when the floor is calm, string lights come on at closing, the day's replay ends on the sunset.
**Punishments do not exist.** The worst a level ever does is a wilting sprout in a rose ring.

**Loudness budget:** one loud thing on a screen at a time. Pulse only for a deadline. Sound off by default.
Everything still works with `prefers-reduced-motion`.

---

## 7. Data back: every tap is a fact the place owns

Because done is a state of the world (law 2), the level records real events without anyone filling anything in:

| Real moment | Recorded as | Becomes |
|---|---|---|
| order sent / stick back or picked up | wait (Josie's definition) | average wait per station per day, busiest 15 min |
| "Low" / "Out" on a stock bubble | time it ran low | "Ran low today", what to order more of |
| "Ask for tanks" / "Done" | request to fill time | when fills pinch, whether the compressor keeps up |
| bed cleaned / checked in | turnaround | rooms ready by check-in time |
| plan block added / place accepts it | intent → booking | what travellers want before they arrive |

The shop's database is the shop's. The hub sees only the public place card. A metric that needs per-person data is not built.

---

## 8. Look and feel: what "the same game" means on screen

From Josie's boards (`josiescafe/design/boards/`), and binding for every level and for Tripwrights:

- **Type:** Baloo 2 for headings and numbers, Nunito for text, the place's own handwriting font only for its name. No system fonts.
- **Header:** the place's name in its color (left), a pill segmented control for the screens (center), EN/ES pill, time, a round avatar.
- **Cards:** white, generous radius, a soft colored ring or a darker ledge under the bottom edge. No borders, no drop shadows that look like web UI.
- **Buttons:** big pills with a ledge. Tonal answers: green Plenty, amber Low, rose Out, each with a dot icon and a word.
- **Map frame:** the map sits in a big rounded card; never full-bleed under the UI chrome.
- **Place color only on the place's things** (Josie's pink, Paradise's blue-and-white wood, Tripwrights' sea blue with brass).
- **Ground, water and plants are the same everywhere**, so moving from level to level feels like walking down the beach.

---

## 9. Where the current levels drift (fix list for the code session, after art is ready)

Seen in today's build (screenshots taken 2026-10-22):

| Where | Drift | Fix |
|---|---|---|
| Tripwrights region and home | free-floating outlined text on the map ("Utila", "Roatán", "Cover", "The globe", "Getting here") | art ready: `UJ.maps.*` draws names in pills (spec `docs/specs/world-redraw.md`) |
| Tripwrights region | "soon" tags are red text on white | art ready: faded pill "· soon" in `UJ.maps.*` |
| Tripwrights header | cooler blue chrome, no ledge pills | Josie's header pattern in Tripwrights' sea blue |
| Paradise crew page | system font, generic blue buttons, map full-width with no list | Baloo/Nunito, ledge pills, Overview layout (map + "do this next" list); art ready: `UJ.level.paradise()` |
| Paradise crew page | seven role buttons in the header | role is who you are, not a tab: pick once on sign-in; the demo keeps a small "View as" pill |
| Paradise boat fuel | bubble with a gauge and the words "Fuel low" | keep the gauge, pill says "low" with ! |

---

## 10. Making a level: photos, then blocks, then the art pass

A level is not drawn from scratch. It is **assembled from preset blocks** that take the shape of the real place from the owner's
photos, then **reshaped by a local designer** with prompts, inside the rules below. This is steps 1 to 3 of the pipeline in `VISION.md`.

```
 A  CAPTURE    owner      photos or one slow walk-through video, plus the satellite view. No drawing, no measuring.
 B  BLOCK OUT  AI         preset blocks snap to what the photos show: footprint, which side the water or street is, stations, seats.
 C  ART PASS   designer   prompts that cut, keep, move and exaggerate, within the reshape rules. Logs a reshape note.
 D  SIGN OFF   owner+crew "Does it feel like my place?" (owner)  "Can I find my station?" (each role). Then it ships.
```

### A. Capture (the owner's whole job, under 15 minutes)

The 2-for-1 rule applies to the owner too: capturing must take less than explaining the place to a stranger once.

- One shot from the entrance, one from each station (counter, kitchen, dock, rooms), one from the water or street side looking back.
- A slow walk-through video can replace all of them.
- The satellite view is pulled for them; they only confirm the pin.
- Optional: a phone-camera photo of a hand sketch (Paradise was drawn from two).

### B. The preset blocks

Each block is a kit piece **with its game already inside**: placing a block places its objects and their state ladders, so a level
works the moment it is blocked out. Blocks come in families:

| Family | Blocks | Brings with it |
|---|---|---|
| Ground | sand, deck, plank pier, street, sea, reef, rocks | nothing to tend (shared world colors) |
| Shell | room with back wall, open-front room, palapa, container, two-story wing | walls, windows, the place's top band color |
| Station | counter + register, bar, kitchen line, fridge wall, tank room, rinse, retail wall, dock + mooring, front desk | the station's screen and its objects |
| Seat | table, round table, umbrella table, stool row, lounger, bunk, bed, suite | the pot or bed ladder |
| Stock | shelf of jars, tank rack, fuel tank | the stock or tank ladder |
| Life | potted plant, tree, palm, rocks, critter, lights | the world rewards (bloom, crabs, lights) |
| Signature | one per place: Josie's sign and iguana, Paradise's black gear wall | the place's joke |

The AI's block-out reads the photos for: footprint and orientation, which stations exist and where, roughly how many seats
(clamped to three), and the place's colors (sampled, then snapped to the nearest palette in `palettes.json`).

### C. The art pass: reshape rules

The designer reshapes the block-out to **how the place feels**, not how it measures. Josie's is the precedent: the other business on
the same lot and the bathrooms were cut, and the tree and the beach got the room.

1. **Cut what nobody in the game tends.** Bathrooms, storage, parking, utilities, a neighbor's business on the lot.
   Exception: keep it if a role's job is there (Paradise's tank room stays; a hostel's bathrooms stay if housekeeping cleans them).
2. **Keep what you'd point at.** The counter, the sign, the big tree, the dock, the view. If the owner would show it to a friend, it stays.
3. **Compress distance, keep order.** Walls can move and rooms can shrink; adjacency and direction cannot. The sea stays on its side,
   what is left of the counter stays left, the path a guest walks stays in the same order.
4. **Enlarge the soul, shrink the generic.** The place's signature can be up to about 1.5 times true size; generic furniture gets smaller.
5. **Three of anything**, except where the count is the job (tanks, stock).
6. **Color only the place's things.** The rest is world color.
7. **Never add what isn't there.** Reality rule. A missing piece is a labeled stand-in, not an invention.

Designers prompt in a small vocabulary, one change per line, so changes are reviewable and repeatable:

| Verb | Example prompt |
|---|---|
| cut | `cut the bathrooms and the hardware store on the east side of the lot` |
| keep | `keep the big tree even though it blocks the path in the photos` |
| move | `move the register to face the door; keep it left of the bar` |
| merge | `merge the two side patios into one deck` |
| enlarge | `enlarge the iguana's rock 1.3x` |
| simplify | `simplify the shelves to three jars` |
| recolor | `recolor the awning to the place accent` |
| add life | `add life: a crab by the rocks, a pot by the door` |

Every art pass ends with a **reshape note** the owner signs off, so nothing about the real place is lost by accident:

```
RESHAPE NOTE: <place>
Cut:       <what, and why nobody tends it>
Kept:      <the things you'd point at>
Moved:     <what moved; order and direction checked>
Enlarged:  <the signature>
Stand-ins: <anything not confirmed yet>
```

Josie's, written after the fact: *Cut: the neighboring business on the lot, the bathrooms. Kept: the sign, the counter, the tree,
the beach and rocks, the deck. Enlarged: the tree, the iguana.* (Owner to confirm or correct.)

---

## 11. The world layer: regions and islands

Josie's has two references, and every map uses one of them:

| Scale | Reference | Used for | Kit |
|---|---|---|---|
| Inside a place | her cafe board (`josiescafe/design/boards/Josies.html`, `img/world/map.png`) | levels: Josie's, Paradise, the next shop | `josie.js`, `world.js`, `level-*.js` |
| An island or a region | her bay map (`josiescafe/art/bay.js`) | Tripwrights' region strips and island screens | `island.js`, `maps.js` |

Rules for the world layer:
- **Real shape, honest density.** Outlines are rough traces of the real coast; towns sit on the real shore. How busy an island looks
  (houses, roads, boats) comes from its density, so Utila reads as a town on a bay and Koh Samui as a ring road lined with houses.
  Small islands may be enlarged next to big ones so they can be tapped; the ratio stays in code.
- **Five spots at most per island**, like the map in a farming game. More than five: the first five by priority are drawn and the
  island sheet lists the rest.
- **Places that have joined are drawn as themselves** in their own colors (`J.mini.*`), with a pill. Every other spot is a real
  area or activity, drawn as a small landmark on a sand clearing, faded and marked soon. Nothing invents a business.
- **Names live in pills**, sized for phone width (the art is drawn 1000 wide and shown at about 40%, so words are drawn about 2x).
- **Long islands focus on their busy end** and let the rest run off the edge (Roatán's island screen shows the west end).
- **Routes are real**: ferry and boat routes are soft dashed white paths with a dot at each end.

---

## 12. Level checklist (run before a level is shown to anyone)

- [ ] Built from preset blocks; the reshape note is signed off by the owner.
- [ ] Map traced from the real place; stand-ins labeled.
- [ ] Every object a person tends has a state ladder of four rungs or fewer, drawn, not labeled.
- [ ] Every role has three verbs or fewer, each one tap.
- [ ] Every added step has a ledger that passes 2-for-1.
- [ ] No Ready / Done / Submit buttons where the real world already shows it.
- [ ] No free text on the map; bubbles anchored, two words and a number.
- [ ] One loud thing at a time; pulse only for deadlines; reduced-motion works.
- [ ] No per-person metric anywhere, including the owner's day.
- [ ] Header, cards, pills and fonts match Josie's.
- [ ] The level's own small joke or animal exists (Josie's iguana; Paradise's still to pick).

---

## Open (owner's call)

- Paradise's animal or joke (a sea turtle on the dock? a grouper under the boat?).
- Is a Tripwrights plan block "booked" only when the place accepts it, or can some places auto-accept?
- Do guests ever see a light version of the world rewards (the lights coming on at closing on their phone)?
