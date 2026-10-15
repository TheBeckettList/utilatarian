/* Utila Dives, drawn from the owner's sketches (ground floor and level 2). SSI + PADI dive school, hostel rooms, a restaurant next door,
   Josie's on the west side. Everything here is a SAMPLE named place, but the layout is the real shape of a real shop.
   UART.layout.ground(opts) -> markup, 1000 x 1720.   UART.layout.upstairs(opts) -> markup, 1000 x 1150.
   opts: tanks {full, filling, empty}, rooms {id: 'free'|'occupied'|'clean'}.   Plain ES5. */
(function (w) {
  'use strict';
  var U = w.UART, P = U.props, W = U.palettes.world, PAL = U.palettes.places['utila-dives'].light, at = U.at;
  var SLAB = W['sand-dk'];

  function slab(x, y, wd, ht, floor, r) {
    r = r || 12;
    return '<rect x="' + (x - 6) + '" y="' + (y - 2) + '" width="' + (wd + 12) + '" height="' + (ht + 12) + '" rx="' + (r + 4) + '" fill="' + SLAB + '"/><rect x="' + (x - 6) + '" y="' + (y - 8) + '" width="' + (wd + 12) + '" height="' + (ht + 12) + '" rx="' + (r + 4) + '" fill="#FFFFFF"/><rect x="' + x + '" y="' + (y - 2) + '" width="' + wd + '" height="' + ht + '" rx="' + r + '" fill="' + floor + '"/>';
  }
  function tiles(x, y, wd, ht, step, c) {
    var h = '', i; for (i = step; i < wd; i += step) { h += '<rect x="' + (x + i) + '" y="' + y + '" width="2" height="' + ht + '" fill="' + c + '"/>'; }
    for (i = step; i < ht; i += step) { h += '<rect x="' + x + '" y="' + (y + i) + '" width="' + wd + '" height="2" fill="' + c + '"/>'; }
    return h;
  }
  function label(x, y, text, size) { return '<text x="' + x + '" y="' + y + '" text-anchor="middle" class="rl" style="font-size:' + (size || 20) + 'px">' + text + '</text>'; }
  function bed(x, y, wd, ht, cover, rot) {
    return '<g transform="translate(' + x + ',' + y + ')' + (rot ? ' rotate(' + rot + ')' : '') + '">' + P.shadow(wd / 2, ht / 4, 3, ht / 2 + 2) + '<rect x="' + (-wd / 2) + '" y="' + (-ht / 2) + '" width="' + wd + '" height="' + ht + '" rx="9" fill="' + W['wood-dk'] + '"/><rect x="' + (-wd / 2 + 3) + '" y="' + (-ht / 2 + 3) + '" width="' + (wd - 6) + '" height="' + (ht - 6) + '" rx="7" fill="#FFFFFF"/><rect x="' + (-wd / 2 + 3) + '" y="' + (-ht * .02) + '" width="' + (wd - 6) + '" height="' + (ht * .52 - 3) + '" rx="7" fill="' + cover + '"/><rect x="' + (-wd / 2 + 6) + '" y="' + (-ht / 2 + 6) + '" width="' + (wd - 12) + '" height="' + (ht * .2) + '" rx="6" fill="' + PAL.wash + '"/></g>';
  }
  function bunk(x, y, c1, c2, rot) { return bed(x, y, 44, 84, c1, rot) + '<g transform="translate(' + x + ',' + y + ')' + (rot ? ' rotate(' + rot + ')' : '') + '"><rect x="26" y="-30" width="5" height="60" rx="2" fill="' + W['wood-dk'] + '"/><rect x="26" y="-22" width="12" height="3" fill="' + W['wood-dk'] + '"/><rect x="26" y="-8" width="12" height="3" fill="' + W['wood-dk'] + '"/><rect x="26" y="6" width="12" height="3" fill="' + W['wood-dk'] + '"/><circle cx="0" cy="40" r="0" fill="' + c2 + '"/></g>'; }
  function bath(x, y, wd, ht) {
    return '<rect x="' + x + '" y="' + y + '" width="' + wd + '" height="' + ht + '" rx="6" fill="#E7F1F1"/><ellipse cx="' + (x + wd * .28) + '" cy="' + (y + ht * .3) + '" rx="7" ry="9" fill="#FFFFFF"/><rect x="' + (x + wd * .2) + '" y="' + (y + 3) + '" width="16" height="6" rx="3" fill="#FFFFFF"/><circle cx="' + (x + wd * .72) + '" cy="' + (y + ht * .28) + '" r="6" fill="#FFFFFF"/><rect x="' + (x + wd * .5) + '" y="' + (y + ht * .55) + '" width="' + (wd * .42) + '" height="' + (ht * .38) + '" rx="3" fill="' + W.sea + '" opacity=".6"/>';
  }
  function ac(x, y) { return '<rect x="' + x + '" y="' + y + '" width="30" height="12" rx="4" fill="#DDE5EA"/><path d="M' + (x + 5) + ',' + (y + 6) + ' h20" stroke="#9AA6AD" stroke-width="2.4" stroke-linecap="round"/>'; }
  function bike(x, y, rot) {
    return at(x, y, rot, 1, P.shadow(34, 8, 2, 26) + '<circle cx="0" cy="-32" r="17" fill="none" stroke="#3E4A52" stroke-width="5"/><circle cx="0" cy="32" r="17" fill="none" stroke="#3E4A52" stroke-width="5"/><path d="M0,-32 L0,32" stroke="' + PAL.pop + '" stroke-width="5" stroke-linecap="round"/><path d="M-13,-24 H13" stroke="#3E4A52" stroke-width="5" stroke-linecap="round"/><rect x="-6" y="14" width="12" height="9" rx="4" fill="' + PAL.accent + '"/>');
  }
  function scooter(x, y, rot, c) { return at(x, y, rot, 1, P.shadow(20, 9, 2, 36) + '<rect x="-14" y="-52" width="28" height="104" rx="14" fill="' + c + '"/><rect x="-24" y="-40" width="48" height="8" rx="4" fill="#3E4A52"/><rect x="-10" y="-6" width="20" height="34" rx="9" fill="#FFFFFF" opacity=".85"/><circle cx="0" cy="-26" r="5" fill="#FFFFFF" opacity=".7"/>'); }
  function planter(x, y, wd) { var h = '<rect x="' + x + '" y="' + y + '" width="' + wd + '" height="22" rx="8" fill="' + W['wood-dk'] + '"/><rect x="' + (x + 4) + '" y="' + (y + 4) + '" width="' + (wd - 8) + '" height="14" rx="6" fill="' + W.pot + '"/>', i; for (i = 14; i < wd - 8; i += 24) { h += at(x + i, y + 8, i * 7, .8, P.pot(11).replace(/<ellipse[^>]*\/>/, '')); } return h; }
  function racks(x, y, cols, rows, colors) { var h = '', i, j; for (j = 0; j < rows; j++) { for (i = 0; i < cols; i++) { h += at(x + i * 36, y + j * 36, 0, .9, P.tankTop(15, colors(j * cols + i))); } } return h; }

  function ground(o) {
    o = o || {}; var T = o.tanks || { full: 6, empty: 18, filling: 0 }, tot = T.full + T.empty + (T.filling || 0) || 1, h = '', i;
    var tcol = function (n) { var f = n / 36; return f < T.full / tot ? PAL.accent : (f < (T.full + (T.filling || 0)) / tot ? PAL.pop : '#C7CED2'); };
    /* water, the ferry dock down the west edge, the quay and the inlet where the dive boat berths */
    h += '<rect width="1000" height="1720" fill="' + W.sand + '"/>';
    h += P.sea(0, 0, 64, 800) + '<rect x="30" y="110" width="36" height="650" fill="' + W.deck + '"/>';
    for (i = 126; i < 750; i += 22) { h += '<rect x="30" y="' + i + '" width="36" height="3" fill="' + W['deck-line'] + '"/>'; }
    h += '<path d="M64,0 H1000 V540 H64Z" fill="' + W.sand + '"/>';
    h += '<rect x="520" y="0" width="480" height="520" fill="' + W.sea + '"/><rect x="520" y="260" width="480" height="260" fill="' + W['sea-2'] + '"/>' + at(640, 90, 0, 1, P.wave(120)) + at(870, 330, 0, 1, P.wave(100)) + at(880, 60, 0, 1, P.wave(90));
    h += '<path d="M520,520 H1000" stroke="#FFFFFF" stroke-width="22" opacity=".45"/>';
    h += '<rect x="500" y="520" width="500" height="74" fill="' + W.deck + '"/>'; for (i = 516; i < 1000; i += 24) { h += '<rect x="' + i + '" y="520" width="3" height="74" fill="' + W['deck-line'] + '"/>'; }
    h += label(750, 576, 'Big dive dock', 17);
    h += at(690, 340, 0, 1, P.boat(PAL, 300)) + at(690, 504, 0, 1, '<rect x="-3" y="-30" width="6" height="34" fill="' + W['wood-dk'] + '"/>');
    /* confined water: a small pool with steps */
    h += slab(150, 110, 330, 220, '#E1F3F6', 20) + '<rect x="176" y="136" width="278" height="168" rx="22" fill="' + W.sea + '"/><rect x="186" y="146" width="258" height="148" rx="16" fill="#8FD9E0"/>' + at(240, 214, 0, 1, P.wave(90)) + at(340, 250, 0, 1, P.wave(80)) + at(190, 160, 0, 1, '<rect width="38" height="22" rx="6" fill="#FFFFFF"/><rect x="3" y="3" width="32" height="16" rx="4" fill="#E1F3F6"/>') + label(315, 348, 'Confined water', 18);
    /* action area: the briefing and kit-up deck */
    h += '<rect x="150" y="410" width="260" height="220" rx="18" fill="' + W['deck'] + '" opacity=".55"/><rect x="150" y="410" width="260" height="220" rx="18" fill="none" stroke="' + PAL.accent + '" stroke-width="5" stroke-dasharray="14 12" stroke-linecap="round"/>' + label(280, 650, 'Action area', 18);
    h += at(210, 470, 0, 1, P.fins(PAL.accent, '#FFFFFF')) + at(350, 470, 0, 1, P.tankSide(70, PAL.accent)) + at(300, 560, 0, 1, P.tankSide(70, PAL.pop)) + at(220, 560, 0, 1, P.mask('#3E4A52', '#BFE9F0'));
    /* stairs down to the dock */
    h += '<rect x="440" y="404" width="84" height="150" rx="8" fill="' + W['deck-line'] + '"/>'; for (i = 410; i < 552; i += 14) { h += '<rect x="440" y="' + i + '" width="84" height="10" rx="3" fill="' + W.deck + '"/>'; }
    /* Josie's, next door on the west: a pointer, a rinse and shower line, the grill */
    h += at(120, 706, 0, 1, '<path d="M-40,0 H30 M-12,-14 L-40,0 L-12,14" stroke="' + PAL.ink + '" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>') + U.icon('cafe', { p: U.palettes.places['josies-cafe'].light, tone: 'wash' }).replace('<svg ', '<svg x="140" y="672" width="68" height="68" ') + label(220, 744, 'Josie’s, for people', 17);
    h += at(310, 800, 0, 1, '<rect x="-34" y="-18" width="68" height="36" rx="8" fill="#3E4A52"/><rect x="-28" y="-12" width="56" height="24" rx="5" fill="#8896A0"/><path d="M-22,-8 v16 M-8,-8 v16 M6,-8 v16 M20,-8 v16" stroke="#3E4A52" stroke-width="3"/>') + label(310, 836, 'Grill', 16);
    for (i = 0; i < 3; i++) { h += at(380 + i * 54, 880, 0, 1, P.rinse(46, 40, PAL)); } h += label(430, 930, 'Rinse bins', 16);
    h += at(170, 880, 0, 1, '<rect x="-24" y="-30" width="48" height="60" rx="8" fill="#FFFFFF"/><rect x="-18" y="-24" width="36" height="48" rx="6" fill="' + W.sea + '" opacity=".6"/><circle r="5" fill="#9AA6AD"/>') + label(170, 930, 'Shower', 16);
    /* the west building: the school (desk, dive board, classroom, fix-gear room) and the rooms */
    h += slab(80, 960, 230, 150, PAL.wash) + tiles(80, 958, 230, 150, 38, PAL.line) + '<rect x="80" y="958" width="230" height="22" rx="8" fill="' + PAL.soft + '"/>';
    h += at(130, 1030, 0, 1, P.counter(110, 34, PAL)) + at(100, 1030, 0, .7, P.register()) + at(250, 1020, 0, 1, P.board(100, 56, PAL, 3)) + label(195, 1100, 'Desk and dive board', 15);
    h += slab(80, 1130, 230, 150, '#E7F1F1') + tiles(80, 1128, 230, 150, 38, PAL.line) + at(160, 1210, 0, 1, P.table(100, 50, false)) + at(160, 1250, 0, .8, P.chair(PAL, 0)) + at(230, 1200, 0, .8, P.chair(PAL, 90)) + at(270, 1150, 0, 1, P.board(70, 30, PAL, 2)) + label(195, 1268, 'Classroom', 16);
    h += slab(80, 1300, 110, 110, '#F3EFE6') + tiles(80, 1298, 110, 110, 38, PAL.line) + at(135, 1356, 0, 1, '<rect x="-38" y="-26" width="76" height="12" rx="5" fill="' + W['wood-dk'] + '"/><rect x="-30" y="0" width="60" height="22" rx="6" fill="' + PAL.soft + '"/>') + label(135, 1424, 'Gear repair', 14);
    h += slab(200, 1300, 110, 110, PAL.wash) + tiles(200, 1298, 110, 110, 38, PAL.line) + bed(255, 1352, 62, 78, PAL.pop, 0) + ac(222, 1306) + label(255, 1424, 'R1', 15);
    h += slab(80, 1440, 110, 120, PAL.wash) + tiles(80, 1438, 110, 120, 38, PAL.line) + bed(135, 1498, 62, 80, PAL.accent, 0) + bath(88, 1446, 38, 36) + label(135, 1574, 'R2', 15);
    h += slab(200, 1440, 110, 120, PAL.wash) + tiles(200, 1438, 110, 120, 38, PAL.line) + bunk(232, 1498, PAL.pop, PAL.accent, 0) + bunk(282, 1498, PAL.accent, PAL.pop, 0) + label(255, 1574, 'Dorm · 2 bunks', 14);
    /* the courtyard: planters on the short fence, bikes and Honda Navis for rent later */
    h += '<rect x="360" y="960" width="300" height="560" rx="10" fill="' + W['sand-dk'] + '" opacity=".35"/>' + planter(380, 976, 260) + planter(380, 1500, 260);
    h += bike(440, 1100, 12) + bike(500, 1120, -8) + scooter(580, 1180, 4, PAL.accent) + scooter(520, 1300, -6, PAL.pop) + scooter(430, 1330, 8, '#E9735C') + label(500, 1480, 'In theme: bicycles and Honda Navis', 16) + label(500, 1500, '(rentals, later)', 14);
    /* the palapa, bar and restaurant */
    h += at(690, 690, 0, 1, P.umbrella(64, PAL)) + at(690, 690, 0, 1, '<circle r="6" fill="' + W['wood-dk'] + '"/>') + label(690, 784, 'Palapa, umbrella share', 15);
    h += at(720, 880, 0, 1, P.table(120, 56, false)) + at(720, 960, 0, 1, P.table(120, 56, false)) + at(646, 880, 0, .8, P.chair(PAL, 90)) + at(794, 880, 0, .8, P.chair(PAL, -90)) + at(646, 960, 0, .8, P.chair(PAL, 90)) + at(794, 960, 0, .8, P.chair(PAL, -90));
    h += slab(840, 640, 130, 440, '#FBEFE4') + at(905, 720, 0, 1, P.table(70, 70, true)) + at(905, 830, 0, 1, P.table(70, 70, true)) + at(905, 940, 0, 1, P.table(70, 70, true)) + at(880, 1050, 0, 1, P.pot(12)) + label(905, 1094, 'Restaurant', 16);
    h += at(790, 740, 0, 1, '<rect x="-14" y="-60" width="28" height="120" rx="10" fill="' + PAL.accent + '"/><rect x="-14" y="-60" width="28" height="70" rx="10" fill="#FFFFFF"/>') + label(790, 822, 'Drinks', 14);
    h += slab(850, 1120, 130, 140, '#F3EFE6') + at(890, 1160, 0, 1, '<rect x="-32" y="-16" width="64" height="26" rx="6" fill="#D7DFE3"/><circle cx="-14" cy="-3" r="7" fill="#4A3A42"/><circle cx="14" cy="-3" r="7" fill="#4A3A42"/>') + at(940, 1210, 0, 1, '<rect x="-14" y="-30" width="28" height="60" rx="8" fill="#E1F3F6"/>') + label(915, 1276, 'Kitchen', 15);
    /* the regulator rinse bin and the retail room */
    h += at(790, 1190, 0, 1, P.rinse(70, 64, PAL)) + label(790, 1250, 'Regulators', 14);
    h += slab(690, 1290, 290, 190, PAL.wash) + tiles(690, 1288, 290, 190, 38, PAL.line) + '<rect x="690" y="1288" width="290" height="26" rx="8" fill="' + PAL.soft + '"/>';
    h += at(740, 1332, 0, .55, P.mask('#3E4A52', '#BFE9F0')) + at(830, 1332, 0, .55, P.regulatorRow ? '' : '<circle r="12" fill="#9AA6AD"/><circle r="6" fill="#C7CED2"/>') + at(930, 1332, 0, .5, P.fins(PAL.accent, '#FFFFFF'));
    h += label(740, 1362, 'Masks', 13) + label(830, 1362, 'Regs', 13) + label(930, 1362, 'Fins', 13);
    for (i = 0; i < 4; i++) { h += at(716 + i * 36, 1424, 0, .7, P.wetsuit([PAL.pop, PAL.accent, '#E9735C', '#2C6F78'][i], '#FFFFFF')); }
    h += label(790, 1470, 'Wetsuits', 13) + '<rect x="700" y="1372" width="140" height="26" rx="8" fill="' + W['wood-dk'] + '"/><rect x="704" y="1376" width="132" height="18" rx="6" fill="' + W.deck + '"/>' + label(890, 1420, 'BCDs', 13);
    for (i = 0; i < 3; i++) { h += at(880 + i * 30, 1390 + (i % 2) * 22, 0, .4, '<path d="M-20,-30 Q-10,-40 0,-30 L12,-30 Q22,-40 30,-30 L38,-6 Q30,14 30,40 H-20 Q-20,14 -28,-6Z" fill="' + PAL.pop + '"/>'); }
    h += at(780, 1288, 0, 1, '<rect x="-40" y="-2" width="80" height="4" fill="none"/>');
    /* the tank room: empties on the racks (colored by what they are), the fill station */
    h += slab(690, 1520, 290, 180, '#EEF1F2') + tiles(690, 1518, 290, 180, 38, '#D9DEE1') + racks(718, 1566, 4, 4, tcol) + at(904, 1620, 0, .8, P.compressor(PAL)) + label(790, 1712, 'Tank room', 17);
    return h;
  }

  /* level 2: the rooms. Left wing off the walkway, the suites in the right wing, stairs at the south end. Statuses per room. */
  var ROOMS = [
    { id: 'r11', n: '11', t: 'Dorm · 2 bunks', x: 110, y: 260, w: 220, h: 100, beds: 'bunks' },
    { id: 'r10', n: '10', t: 'Single', x: 360, y: 260, w: 150, h: 120, beds: 'single' },
    { id: 'r9', n: '9', t: 'Dorm · 2 bunks', x: 110, y: 380, w: 220, h: 100, beds: 'bunks' },
    { id: 'r8', n: '8', t: 'Dorm · 2 bunks', x: 110, y: 560, w: 220, h: 130, beds: 'bunks' },
    { id: 'r7', n: '7', t: 'Two fulls', x: 110, y: 700, w: 220, h: 140, beds: 'fulls' },
    { id: 'r6', n: '6', t: 'Like R4', x: 110, y: 850, w: 220, h: 140, beds: 'fulls' },
    { id: 's1', n: 'A', t: 'Suite · 2 queens', x: 620, y: 300, w: 270, h: 140, beds: 'queens' },
    { id: 's2', n: 'B', t: 'Suite · 2 queens', x: 620, y: 460, w: 270, h: 140, beds: 'queens' },
    { id: 's3', n: 'C', t: 'Suite · 2 queens', x: 620, y: 620, w: 270, h: 140, beds: 'queens' },
    { id: 's4', n: 'D', t: 'Suite · 2 queens', x: 620, y: 780, w: 270, h: 140, beds: 'queens' }
  ];
  var TINT = { free: 0, occupied: 1, clean: 2 };
  function upstairs(o) {
    o = o || {}; var st = o.rooms || {}, h = '', i, r, s;
    h += '<rect width="1000" height="1150" fill="' + W.sand + '"/><rect x="50" y="40" width="470" height="170" rx="22" fill="#DCE8EA"/><rect x="60" y="50" width="450" height="150" rx="16" fill="#EEF4F5"/>' + label(285, 126, 'Roof terrace', 22) + at(150, 100, 0, 1, P.umbrella(36, PAL)) + at(420, 100, 0, 1, P.pot(14));
    h += '<rect x="700" y="30" width="200" height="230" rx="100" fill="' + W['sea-2'] + '"/>' + at(800, 150, 0, .72, P.boat(PAL, 300));
    h += '<rect x="352" y="240" width="40" height="760" rx="6" fill="' + W.deck + '"/>'; for (i = 250; i < 990; i += 22) { h += '<rect x="352" y="' + i + '" width="40" height="3" fill="' + W['deck-line'] + '"/>'; } h += '<text transform="translate(380,640) rotate(-90)" text-anchor="middle" class="rl" style="font-size:16px">Walkway</text>';
    h += '<rect x="520" y="250" width="40" height="740" rx="6" fill="' + W.deck + '" opacity=".0"/>';
    for (i = 0; i < ROOMS.length; i++) {
      r = ROOMS[i]; s = st[r.id] || 'free';
      h += slab(r.x, r.y, r.w, r.h, s === 'clean' ? '#FBEBD3' : (s === 'occupied' ? '#E8F4F2' : PAL.wash), 12) + tiles(r.x, r.y - 2, r.w, r.h, 40, PAL.line);
      if (r.beds === 'bunks') { h += bunk(r.x + 40, r.y + r.h / 2, PAL.pop, PAL.accent, 90) + bunk(r.x + 110, r.y + r.h / 2, PAL.accent, PAL.pop, 90); }
      if (r.beds === 'single') { h += bed(r.x + 50, r.y + r.h / 2 + 4, 48, 84, PAL.pop, 0); }
      if (r.beds === 'fulls') { h += bed(r.x + 50, r.y + r.h / 2 + 4, 60, 86, PAL.accent, 0) + bed(r.x + 130, r.y + r.h / 2 + 4, 60, 86, PAL.pop, 0); }
      if (r.beds === 'queens') { h += bed(r.x + 70, r.y + r.h / 2, 80, 96, PAL.accent, 0) + bed(r.x + 165, r.y + r.h / 2, 80, 96, PAL.pop, 0) + bath(r.x + r.w - 52, r.y + 8, 44, 40) + ac(r.x + 8, r.y + r.h - 18); }
      h += label(r.x + 18, r.y + 22, r.n, 20) + '<text x="' + (r.x + r.w - 10) + '" y="' + (r.y + r.h - 8) + '" text-anchor="end" class="rl" style="font-size:12px">' + r.t + '</text>';
    }
    h += '<rect x="110" y="500" width="220" height="40" rx="8" fill="#E7F1F1"/>' + bath(116, 504, 70, 32) + label(260, 526, 'Bathroom', 14);
    h += '<rect x="620" y="960" width="130" height="70" rx="8" fill="' + W['deck-line'] + '"/>'; for (i = 966; i < 1026; i += 12) { h += '<rect x="620" y="' + i + '" width="130" height="8" rx="3" fill="' + W.deck + '"/>'; } h += label(685, 1060, 'Stairs', 16);
    return h;
  }

  /* pins: where a status badge sits on each view */
  var pins = { ground: { boat: [700, 250], tanks: [780, 1540], fill: [904, 1580], rooms: {} }, up: {} };
  ROOMS.forEach(function (r) { pins.up[r.id] = [r.x + r.w - 30, r.y + 30]; });

  U.layout = { ground: ground, upstairs: upstairs, rooms: ROOMS, pins: pins, viewGround: '0 0 1000 1760', viewUp: '0 0 1000 1100' };
})(window);
