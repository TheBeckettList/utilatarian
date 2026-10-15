# Utilitarian — the island hub

Utilitarian builds a free POS for each participating place on the island (Josie's Cafe is the first).
This repo is the **hub**: the one place where every shop's public face (hours, closures, where it is on the
island) is gathered, so other apps — starting with **Tripwrights** — can read the island in one call.

Principle: nothing made up, nothing only-digital. Digital just makes the real thing easier.

## Shape

```
 Josie's POS ─┐                         ┌─ Tripwrights  (trip planner, travelers)
 Shop B POS ──┼─ place cards ─► HUB ────┼─ The Bay      (owner overview, Utilitarian lead)
 Shop C POS ──┘   (public)    registry  └─ a place's own map overview (e.g. Josie's World)
```

- **Each place is its own Supabase project.** Its data never leaves it. The hub only ever reads the
  place's *public card*.
- **The hub is a registry plus a cache**, not a second source of truth. If a shop's card can't be reached,
  the hub shows the last good copy marked "as of <time>".
- **Apps are views on the hub.** Tripwrights is the planner view for visitors; The Bay is the island-wide
  view for the Utilitarian lead; each shop keeps its own map overview of itself.

## Place card (v0)

Each POS exposes one anonymous-readable function (Josie's already has most of this as `site_catalog`):
`place_card()` → JSON

| key | meaning |
|---|---|
| `card_version` | integer, starts at 0 |
| `id` | stable slug, e.g. `josies-cafe` |
| `name` | display name |
| `kind` | `cafe` \| `food` \| `stay` \| `activity` \| `shop` \| `service` (extend as needed) |
| `blurb` | one plain sentence, in the place's own words |
| `hours` | `{mon..sun: "7:00-15:00" \| "closed" \| ["7:00-11:00","17:00-22:00"]}` |
| `closed_until`, `closed_note` | temporary closure, shown to the planner |
| `open_now` | boolean, computed at the place (island time) |
| `palette` | the place's colors, see below |
| `links` | `[{label, url, type}]`, type: `site` \| `whatsapp` \| `map` \| `creator` \| `social` |
| `languages` | languages the place speaks |

Time is always **island local time**; the hub stores the island's timezone once.

## Registry (hub, v0)

One table `places`: `id`, `name`, `kind`, `card_url`, `lat`, `lng` (real coordinates),
`palette`, `last_card` (jsonb), `last_seen`. Adding a shop to the island = adding one row.
A scheduled job refreshes `last_card` from each `card_url`.

## Blocks

The hub answers one question for planners: *is this place open during this block?*

Default blocks (island local): **Morning 06:00–12:00 · Afternoon 12:00–17:00 · Evening 17:00–23:00**.
A place counts as available in a block if it is open for any part of it (and the planner shows the
actual hours). Blocks are config, so a later power-user mode can use custom time ranges without a data change.

## Look and feel

Calm, map-first, diner-dash / animal-crossing-ish. No photo walls.

**Real map, selectively stylised.** The base is a real map (real coordinates, so directions and distances
are true) with a quiet, muted skin. Only **participating places** are stylised: drawn oversized in their own
palette so they are the first thing you see. Where nobody participates, the map stays sparse — few labels,
no clutter, no stock pins. The more places join, the more of the island comes alive. Stylising is driven by
the registry (a place appears styled only if it has a row), so adding a shop needs no map editing. Creator and social links are *links*,
not embedded media. **Every place gets its own palette** — Josie's keeps hers, Tripwrights gets its own
(not pink), The Bay gets its own. A palette is a small set of tokens:
`ink`, `paper`, `accent`, `accent-ink`, `soft` (+ a dark variant), so any app can tint a place's card in
the place's colors while the surrounding app stays in its own.

**The shared art kit lives in [`art/`](art/README.md)**: one palette file, generated tokens and components, and
an ES5 SVG prop library, all derived from Josie's (the finished reference). Tripwrights and Paradise (a real SSI and PADI shop, drawn from the owner's sketches)
[`places/paradise/`](places/paradise/) are drawn with it. Regenerate with `node tools/build-art.mjs`.

## Accounts

- **Now (testing): no login.** A trip is saved in the device and shareable as a link.
- **Later:** accounts through WhatsApp Business (phone-number identity). Not designed yet; the no-login
  trip format should keep a stable trip id so trips can be claimed by an account later.

## Open questions

- Map library and tile source for the muted real-map base (needs to work offline-ish and on old phones,
  like the POS). Each participating place needs a small hand-drawn marker/building illustration.
- Exact scope of The Bay (owner overview): which numbers, if any, ever cross from a POS to the hub —
  default is none beyond the public card.
- Palette for Tripwrights and The Bay.

## Roadmap

1. Freeze place card v0; add `place_card()` to Josie's Supabase (additive migration, same style as 020).
2. Hub registry table + refresh job; one real row (Josie's).
3. Tripwrights prototype: island map, tap a place, drop it in a day's Morning/Afternoon/Evening block,
   shareable link, no login.
4. Second and third shops, so the model is tested on more than one.
5. WhatsApp accounts.
