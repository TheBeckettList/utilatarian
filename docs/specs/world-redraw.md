SPEC: World redraw (Tripwrights regions and islands, Paradise level) in Josie's hand

Why: Tripwrights and Paradise did not look like the same game as Josie's. Josie's board (cafe) and her bay map (island scale) are
now the reference for everything; the new pieces are drawn in her hand so a traveller, a guest and a crew member feel one world.

Art ready (utilatarian/art/, plain ES5, no build; open art/world.html to see all of it, add ?targets to outline tap areas):
- island.js   the island kit: rough real coastlines for Utila, Roatán, Guanaja, Koh Tao, Koh Phangan, Koh Samui; density 0..3
              decides houses, roads and boats; reefs, cays, stilt houses, ferries, longtails, whale shark, rays, fish; activity
              spots (UJ.isle.spot, UJ.isle.spots) capped at UJ.isle.MAX_SPOTS = 5; name pills (UJ.isle.pill).
- maps.js     UJ.maps.caribbean(W, H), UJ.maps.seasia(W, H): region strips (default 1000 x 640) with mainland and real ferry routes.
              UJ.maps.island(id, W, H, opts): island screen (default 1000 x 1100), spots in island units, long islands focused
              on their busy end (Roatán). All return { svg, W, H, targets: [{ id, box, tag }] }.
- level-paradise.js   UJ.level.paradise({ floor: 'ground' | 'upstairs' }): Paradise redrawn from the owner's photos (1440 x 1430,
              sea at the bottom), returns { svg, W, H, targets, note, floor }.
- dive-board.html     the dive-shop board (every dive-shop screen, dive-shop palette); rules in docs/dive-shop-handbook.md.
- world.js    J.mini.paradise restyled to match the level (same name and signature).
- world.html  the board.

Behavior:
1. Region screen: replace the islands drawn in scenes.js region() with UJ.maps.caribbean() / UJ.maps.seasia() as the strip above
   the vessel. Wrap each target in the existing obj() button (ids: isle:<id>, getting-there). Remove the outlined free-text labels
   and the red "soon" tags: names are already in pills inside the art.
2. Island screen: replace scenes.js island() with UJ.maps.island(id). Targets: place:<id> opens the place (as today), act:<kind>
   opens the activity sheet. Your boat still pulls up in the open water below the island.
3. If an island has more than 5 spots, maps.island draws the first 5 (priority order) and returns `hidden`; the island sheet lists
   the rest ("+N more on Utila").
4. Paradise: use UJ.level.paradise({ floor }) for both floors on the Paradise crew page (places/paradise/ops.html) and on its
   Tripwrights planning view, with a Ground / Upstairs switch. Pin ids, ground: boat, fill-station, front-desk, classroom,
   sitting-area, stairs, dock-end, sand. Upstairs: dorm-back, dorm-front, room-front, walkway, private-rooms. The old ids
   (rooms, dive-board, kit-up, confined) are gone: the real shop has no L dock or Confined house.
4b. Theme the Paradise pages with the dive-shop palette for chrome (data-place="dive-shop" from tokens.css) and Paradise's accent on
   its own things; follow docs/dive-shop-handbook.md and the screens in art/dive-board.html.
5. Pulse: the page needs `.pulse` CSS with a prefers-reduced-motion off switch (see art/world.html).
6. Copy art/ into Tripwrights/art/ as usual; island.js, maps.js and level-paradise.js load after josie.js and world.js.

Data: spot positions live in maps.js (UJ.maps.SPOTS) as SAMPLE data in island units (1 unit = 100 m). Later they should come from
hub place cards (a place card's map spot) plus a small per-island list of activity spots. Nothing in the art invents a business:
only Josie's and Paradise are drawn as places; every other spot is a real area or activity, faded and marked soon.

Not now: the Rooms level drawing; animating critters (bay.js does it on Josie's site; same CSS approach later); real-time states in
Paradise's bubbles (they show sample states); redrawing the home lodge and the vessels (they already use the kit; review after this).

Done when:
- Tripwrights #r/caribbean and #r/seasia show the new region strips; tapping Utila opens #i/utila; Roatán, Guanaja and the SE Asia
  islands show as soon.
- #i/utila shows Josie's and Paradise as themselves with pills, three faded soon spots, no free text; tapping Josie's opens her site.
- Paradise's crew page map is the new level; the boat, fill station and rooms bubbles sit on their objects; one thing pulses at most.
- Everything readable at phone width (the art is drawn for a 1000-wide canvas shown at about 40%).

Open (owner):
- Paradise's animal or joke (the pelican on the dock is a stand-in).
- Paradise reshape note (in level-paradise.js): OK to move the hostel rooms to their own level and merge kitchen + drinks,
  retail + reg rinse?
- Josie's reshape note: confirm the cut business on the lot and the bathrooms; was the tree enlarged?
- Utila spots: is "Whale sharks" right as a boat-trip spot, and do you want Bando Beach instead of one of the five?
