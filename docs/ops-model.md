# One map, many people: the operating model (Josie's pattern, for any shop)

The same idea as Josie's: **the people who run the place and the people who visit it look at the same drawn map**, with statuses on it.
What each person can see and do depends on their **assignment level**, and every person has a **companion applet** (a phone-sized
feed) that tells them what matters to *them*.

## Pieces
- **Map overview:** the place from above (see `art/README.md`), with status pins (an icon tile + a badge with a mark, never color alone).
- **Assignment level:** `guest` < `tank filler` (a side track) < `divemaster` < `instructor` < `owner`. Levels gate *what pins show* and *what can be flagged*.
- **Companion applet:** notifications for your role, plus "your day" for guests. Urgent ones are loud (rose ring, `!!`), routine ones are quiet.
- **Statuses:** a small fixed vocabulary, same on every shop: `ok` (check), `low` (!), `alert` (!!), `busy` (...).

## Paradise (`places/paradise/ops.html`, a working prototype)
| | guest | tank filler | DM | instructor | owner |
|---|---|---|---|---|---|
| sees boat departure | yes | yes | yes | yes | yes |
| sees tank counts, fill station, boat fuel | no | yes | yes | yes | yes |
| flags **boat fuel**: Full / Low / **Refill ASAP** | no | no | yes | yes | yes |
| asks for tanks | no | no | yes | yes | yes |
| takes a fill request ("I'm on it" / "Done") | no | yes | | yes | |
| hostel rooms, bookings | own only | no | tbd | tbd | all (once sketched) |

**Tank requests come in two kinds**, because the two situations are really different:
- **Needed by a time (urgent):** "15 tanks for the PM dive, we got back at 11:30, boat leaves in two hours." Notifies tank fillers (and the
  owner) immediately, rose ring, pulsing pin on the fill station.
- **Whenever, no rush:** "We did a night dive, the AM dive won't need any, but there are empties to fill when you can." Quiet note to the fillers,
  amber pin, no pulse.

Flow: DM asks → fillers get it → a filler taps **I'm on it** (counts move empty → filling, the requester is told) → **Done** (filling → full,
requester, DMs, instructors and owner are told). **Boat fuel** is a three-state flag; `Refill ASAP` notifies DMs, instructors and owner and
pulses on the boat.

The prototype keeps state in the browser (shared across tabs, so two roles can talk). The real thing would sit on the shop's own database
the way Josie's POS does, with the same rule: the shop owns its data.

## One game for guests
A guest staying in the hostel, diving, and eating at Josie's should feel one place, not three apps: the same drawn style, the same icon
tiles (`art/icons.js` tints per place), one "your day" feed (room, boat, lunch). Tripwrights is where a guest plans it; each shop is where they
live it. They are **linked later**; for now they share art, status vocabulary and the applet pattern so nothing needs re-learning.

## Waiting on you
- **Your sketch of the shop and the hostel rooms.** The current Paradise layout is a placeholder. Icons for beds, bunks, keys and room
  status (free / occupied / needs cleaning) are ready in the kit.
- Who gets which level, and whether a guest can see their own room key status.
