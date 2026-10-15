# Vision — Utilitarian as a toolkit that grows itself, island by island

(Replaces an earlier draft that misread this as local hiring and training inside shops. It isn't.)

Utilitarian is a **repeatable way to put every place on an island on a simple, free POS and onto one shared
map**, produced by a small number of people with AI help, anywhere in the world.

> One person who knows the island — say a guy in Koh Tao sketching places and knowing the lay of the land
> far better than we do — gets the toolkit and turns out about five POS systems a week, for a year, and an
> island fills in.

Tripwrights is an easy trip planner built on top of what that produces. It is a view, not the product.

## The pipeline (what the toolkit has to make easy)

```
 1  SKETCH       Island partner walks the island: places, who runs them, hours, menu boards, languages,
                 map spot. A phone, a notebook, photos of boards. No tech skill needed.
 2  CAPTURE      AI turns the sketch into data: menu from a photo of a board (Josie's did this by hand with
                 005_real_menu.sql + make_seed.py), hours, translations, a palette for the place.
 3  GENERATE     A new shop's POS from the Josie's template: its own Supabase project, its own site,
                 its own menu, hours and palette. Config, not custom code.
 4  CHECK        A short checklist and automated checks (prices, hours, an order end-to-end, offline).
 5  HAND OVER    On-site: set up the tablet, train the staff, one laminated page. The owner owns the data.
 6  PUBLISH      The shop's public place card registers in the island hub; the place now appears,
                 oversized and in its own colors, on the map.
 7  GROW         Next shop. The island map fills in; Tripwrights gets better for free.
```

The bottleneck is a person's day, not engineering. The toolkit's job is to cut steps 2–6 from days to hours.

## What we need to build (in order of leverage)
1. **A template POS**, extracted from Josie's: everything shop-specific (name, languages, categories,
   hours, palette, station layout) is config. Josie's keeps running unchanged.
2. **Provisioning script**: new Supabase project + schema migrations + seed + site, from one config file.
   (Josie's already has 21 numbered migrations; that order is the recipe.)
3. **AI capture kit**: prompts and scripts that turn photos/notes into the config file and a seed, with a
   human review step. This is where AI saves the most time.
4. **The island hub**: registry + place cards (already designed in README.md). A new island is one hub
   config plus a partner.
5. **Partner playbook**: how to sketch an island, what to ask a shop, how to run an install day,
   a first-week support checklist. Short enough to read in an evening.
6. **Quality gate**: nothing goes on the public map until the checklist passes.

## Roles
- **Utilitarian lead (you):** the toolkit, the hub, the standards, and the people.
- **Island partner:** knows the land, sketches, installs, supports their island. Needs no developer skills.
- **AI:** drafts configs, translations, seeds, checks, docs and the planner; a human approves what ships.
- **Shops:** run their place on a free POS they own.

## Expansion
Utila (Josie's first, then more) → Roatán and Guanaja → Koh Tao (partner already in mind) → wherever a
good partner appears. An island is added when a partner exists, not before.

## One ecosystem, one person's whole arc

The same app grows with you. Nobody switches apps; their role on the island changes.

1. **Planning a week (traveller).** On Tripwrights: flights into San Pedro Sula, the bus to La Ceiba, the ferry to Utila,
   Josie's ready when the ferry gets in, then the week in blocks: Josie's breakfasts, dives at Paradise, lunch, a hike.
   As much or as little as you like: one ferry reminder, or every meal.
2. **On the island (guest).** The plan becomes "what's on": the same map shows what is open now, menus, ordering ahead
   at Josie's, your dive times, your tab.
3. **Staying a month (local).** You stay on as a divemaster trainee. Same app, same account: your regular order, your
   training schedule, the island's goings-on.
4. **Working here (crew).** You become a divemaster. The dive shop's crew app (Paradise's ops view: boats, tanks, rooms,
   who is diving with whom) is the same ecosystem you planned your first week in.

What this asks of the build:
- **One identity across roles** (WhatsApp login later): traveller, guest, local, crew are roles on one person, granted by
  places (a shop adds you to its crew), never separate accounts.
- **One map, one set of place cards**: the traveller's map, the guest's "open now" and the crew's ops view are the same
  drawings with different layers (see `docs/ops-model.md`).
- **Plans are plain data** (place, day, block), so a plan item can become an order at Josie's or a booking on a dive boat
  when the shop accepts it.
- **Getting there links out**: flights, buses and ferries link to whoever sells them (Utila Dream Ferry, the bus lines,
  airlines); a partner can be integrated later without changing the plan.

## Principles
- **Free for the shop, honest for everyone.** If money is ever involved, it's declared where it's earned.
- **Real over digital.** Nothing made up; digital only makes the real thing easier.
- **Local knowledge is the scarce resource.** The toolkit's job is to put it to work, not replace it.
- **Small, portable, offline-tolerant.** Old tablets, bad networks, local languages.
- **Calm.** Diner-dash / Animal Crossing in feel, on the POS and in the planner.

## Open questions (need your call)
1. **How is a partner paid?** (a fee per POS, a share of something, a salary from you?) This decides how
   far "five a week for a year" can scale.
2. **Hosting and cost:** one Supabase project per shop is simple and private, but costs add up across
   hundreds of shops. Free tier limits, pausing, or a pooled option for tiny shops?
3. **Support after install:** who answers when a tablet breaks on a Tuesday?
4. **Countries differ:** currencies, receipts and tax rules, languages. Where does the template stop being
   one template?
5. **Ownership:** shop owns data and can leave with it. Confirm this is the rule.

## What would prove it works
- A new island partner goes from zero to five live shops in a week, using only the toolkit and the playbook.
- A shop's POS is live in an afternoon and still running a year later.
- A traveler's plan on a new island is correct the day its first shops go live.
