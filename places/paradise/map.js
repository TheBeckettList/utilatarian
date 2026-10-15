/* Paradise Divers (SSI + PADI dive shop and hostel, Utila), drawn from the owner's sketches and the satellite view, in Josie's universe
   (art/josie.js + art/world.js). Sea at the top, like the sketch: an L-shaped dock runs out from the beach to the Confined house at its end, the dive
   boat tied alongside. Below the water, a beachy sand area (the lower level, between the office and the sea), then the two parallel
   two-story buildings running inland with the alley between them. Josie's to the west, the restaurant building to the east.
   Blue, white wood, black dive gear. No text on the map: statuses are bubbles the page adds.
   UART.paradise.ground(o) -> markup for viewBox 0 0 1440 2480; .upstairs(o) -> same box (viewUp crops to the buildings).
   o.tanks {full, filling, empty}; o.rooms {id: 'free'|'occupied'|'clean'}. Plain ES5. */
(function (w) {
  'use strict';
  var J = w.UJ, C = J.C, r = J.r, e = J.e;
  var PC = {
    accent: '#3E86B8', deep: '#2E6E9E', soft: '#BFE0F2', pale: '#E6F2FA',
    wallTop: '#9CCBE6', shutter: '#4F8FC0', wainscot: '#DDEBF5', wainscotLine: '#C9DCEB', wallCream: '#FFFFFF', wallBase: '#E3EAF0',
    whiteWood: '#FBFAF7', whiteLine: '#E3E7EA', tile: '#F2F5F7', tile2: '#E8EEF2', wall: '#FFFFFF', wallEdge: '#D9E2E8',
    brickBase: '#E3D7CC', brick: '#EFE6DC', tank: '#3E86B8', tank2: '#F2F2EE', roof: '#DCE3E8', roofLine: '#C9D2D9'
  };
  /* the footprint, shared by both floors */
  var L = { x: 230, w: 410 }, R = { x: 770, w: 400 }, TOP = 1340, BOT = 2440, ALLEY = { x: 650, w: 110 };

  function strip(x, y, wd) { return r(x, y, wd, 26, '#FFFFFF') + r(x, y, wd, 7, PC.wallTop) + r(x, y + 12, wd, 12, PC.wainscot) + r(x, y + 10, wd, 3, '#FFFFFF'); }
  var dash = J.dash, pier = J.pier;
  /* the dive boat from above (the shared J.boat 'dive' in Paradise's colors): white hull, blue stripe, white-wood deck, tank rows */
  function boat(p, cx, cy, s, rows) { return J.at(cx, cy, 0, s, J.boat(p, 'dive', PC, { rows: rows })); }
  function sea(p) {
    var h = r(0, 0, 1440, 1060, C.water) + r(0, 0, 1440, 560, C.deep, 0, ' opacity=".55"') + r(0, 560, 1440, 220, C.deep, 0, ' opacity=".25"');
    h += dash(120, 120, 90) + dash(980, 90, 110) + dash(1220, 380, 80) + dash(80, 520, 100) + dash(1100, 760, 90) + dash(300, 860, 70);
    return h;
  }
  /* the shore: wet sand, foam, then the beach (the lower level in front of the office) */
  function shore() {
    return '<path d="M0,1010 C240,990 420,1030 700,1000 C960,972 1180,1010 1440,990 L1440,2480 L0,2480Z" fill="' + C.foam + '"/>' +
      '<path d="M0,1030 C240,1010 420,1050 700,1020 C960,992 1180,1030 1440,1010 L1440,2480 L0,2480Z" fill="#F1D2B2"/>' +
      '<path d="M0,1060 C240,1040 420,1080 700,1050 C960,1022 1180,1060 1440,1040 L1440,2480 L0,2480Z" fill="' + C.sand + '"/>';
  }
  function building(p, b, floorFill) { return r(b.x - 14, TOP - 10, b.w + 28, BOT - TOP + 24, PC.wallEdge, 8) + r(b.x - 14, TOP - 14, b.w + 28, BOT - TOP + 24, '#FFFFFF', 8) + r(b.x, TOP, b.w, BOT - TOP, floorFill || 'url(#' + p + '-white)'); }
  function divider(x, y, wd, gap) { return gap ? r(x, y, gap[0] - x, 10, PC.wallEdge, 2) + r(x, y - 4, gap[0] - x, 10, '#FFFFFF', 2) + r(gap[1], y, x + wd - gap[1], 10, PC.wallEdge, 2) + r(gap[1], y - 4, x + wd - gap[1], 10, '#FFFFFF', 2) : r(x, y, wd, 10, PC.wallEdge, 2) + r(x, y - 4, wd, 10, '#FFFFFF', 2); }
  function vdivider(x, y, ht) { return r(x, y, 10, ht, PC.wallEdge, 2) + r(x - 2, y, 10, ht - 4, '#FFFFFF', 2); }

  function ground(o) {
    o = o || {}; var p = 'pg', T = o.tanks || { full: 6, empty: 18, filling: 0 }, h = '', i, x, y;
    var tot = Math.max(1, T.full + T.empty + (T.filling || 0));
    h += J.defs(p, PC) + sea(p) + shore();

    /* the L dock: out from the beach to the Confined house, a short leg off the end */
    h += pier(p, 590, 300, 74, 760, true) + pier(p, 330, 220, 190, 64, false);
    h += r(470, 150, 240, 170, PC.wallEdge, 12) + r(470, 144, 240, 170, '#FFFFFF', 12) + r(484, 158, 212, 142, 'url(#' + p + '-white)', 6) + r(500, 176, 120, 100, C.water, 8) + r(508, 184, 104, 84, '#9AD8E8', 6) + dash(520, 220, 60) + r(630, 176, 50, 100, PC.soft, 6) + J.tank(636, 268, PC.tank) + J.tank(656, 268, PC.tank2);
    h += r(470, 144, 240, 16, PC.wallTop, 8);
    /* the dive boat alongside the pier (bow to sea), a second mooring on the other side */
    h += boat(p, 790, 600, 1.25) + boat(p, 470, 660, .9, 3);
    h += '<path d="M664,520 Q700,500 724,470 M590,620 Q560,600 528,590" stroke="#FFFFFF" stroke-width="3" fill="none" opacity=".8"/>';
    /* steps down from the beach to the pier */
    h += r(586, 990, 82, 70, '#C9CFD4', 6); for (i = 0; i < 5; i++) { h += r(586, 990 + i * 14, 82, 11, i % 2 ? '#F4F5F6' : '#FFFFFF', 3); }

    /* Josie's next door, west: the edge of her pink-and-white terrace and her sign */
    h += r(0, 1100, 150, 480, '#FFFFFF') + r(0, 1100, 150, 8, '#F2E7E0') + J.umbrella(70, 1200, 52, '#F5B5C8', '#FFFFFF') + J.umbrella(76, 1420, 48, '#F5B5C8', '#FFFFFF') + r(150, 1090, 10, 500, '#FFFFFF') + r(150, 1590, 10, 4, C.postEdge);
    h += r(176, 1130, 8, 70, '#FFFFFF') + '<path d="M160,1110 H230 L246,1128 L230,1146 H160Z" fill="#F5B5C8"/>' + r(170, 1122, 46, 6, '#FFFFFF', 3);
    /* the restaurant building, east */
    h += r(1220, 1180, 240, 1300, PC.roof) + r(1220, 1180, 240, 1300, 'url(#' + p + '-brick)', 0, ' opacity=".9"') + r(1206, 1170, 14, 1310, '#FFFFFF') + J.roundTable(1330, 1300, 46) + J.roundTable(1330, 1480, 46) + J.roundTable(1330, 1660, 46) + J.chair(1272, 1330, PC.soft, '#FFFFFF') + J.chair(1392, 1510, PC.accent, PC.soft, true) + J.lamp(1330, 1180, 30);

    /* the beach (lower level): the action area where everyone kits up, the palapa umbrella share, the drinks, rinse bins, shower, grill */
    h += J.block(250, 1110, 300, 22, '#FFFFFF', PC.soft, 12, 8);
    for (i = 0; i < 6; i++) { h += J.tank(262 + i * 46, 1124, PC.tank) + (i > 2 ? '' : J.bcd(273 + i * 46, 1072, C.gear).replace(/<path d="M[^"]*q8,12 2,26"[^>]*\/>/, '')); }
    h += J.fins(330, 1212, C.gear, PC.accent) + J.mask(430, 1204);
    h += J.palapa(p, 900, 1130, 92) + J.table(830, 1236, 150, 46) + J.chair(808, 1250, PC.soft, '#FFFFFF') + J.chair(1004, 1250, PC.accent, PC.soft, true) + J.counter(1050, 1090, 120, 52, '#FFFFFF', PC.accent) + J.stool(1070, 1160, PC.soft) + J.stool(1120, 1160, PC.soft);
    h += J.grill(250, 1250) + J.outdoorShower(410, 1320);
    for (i = 0; i < 3; i++) { h += J.rinseBin(462 + i * 60, 1262, 52, 40, PC.accent); }

    /* the left building: office and dive board facing the beach, classroom, gear repair, R1, R2, dorm, full/single, steps */
    h += building(p, L) + strip(L.x, TOP, L.w);
    h += J.board(L.x + 30, TOP + 34, 180, 62, PC) + J.counter(L.x + 40, TOP + 120, 220, 54, '#FFFFFF', PC.accent) + J.screen(L.x + 60, TOP + 140, PC) + J.plant(L.x + 370, TOP + 196, .8) + J.lamp(L.x + 330, TOP, 22);
    h += r(L.x + 160, TOP - 14, 90, 16, PC.accent, 4);   /* the office door, onto the beach */
    y = TOP + 220; h += divider(L.x, y, L.w, [L.x + 300, L.x + 380]) + strip(L.x, y + 6, L.w);
    h += J.board(L.x + 30, y + 14, 180, 40, PC) + J.table(L.x + 40, y + 90, 230, 60, { noPot: true }) + J.chair(L.x + 80, y + 166, PC.accent, PC.soft) + J.chair(L.x + 150, y + 166, PC.accent, PC.soft) + J.chair(L.x + 220, y + 166, PC.accent, PC.soft);
    y = TOP + 440; h += divider(L.x, y, L.w, [L.x + 300, L.x + 380]) + vdivider(L.x + 190, y, 210) + strip(L.x, y + 6, L.w);
    h += J.block(L.x + 16, y + 74, 160, 26, C.wood, C.woodFront, 12, 6) + J.reg(L.x + 40, y + 58) + J.mask(L.x + 120, y + 82) + J.ac(L.x + 210, y + 36) + J.bed(L.x + 236, y + 76, 120, 100, PC.accent);
    y = TOP + 650; h += divider(L.x, y, L.w, [L.x + 300, L.x + 380]) + vdivider(L.x + 190, y, 230) + strip(L.x, y + 6, L.w);
    h += J.bed(L.x + 20, y + 60, 90, 100, PC.soft) + J.toilet(L.x + 140, y + 50) + J.bunk(L.x + 214, y + 64, 60, 76, PC.accent, PC.soft) + J.bunk(L.x + 300, y + 64, 60, 76, PC.soft, PC.accent);
    y = TOP + 880; h += divider(L.x, y, L.w, [L.x + 300, L.x + 380]) + strip(L.x, y + 6, L.w);
    h += J.bed(L.x + 24, y + 60, 110, 110, PC.accent) + J.bed(L.x + 160, y + 60, 76, 100, PC.soft);
    h += r(L.x + 280, BOT - 110, 120, 100, '#C9CFD4', 6); for (i = 0; i < 7; i++) { h += r(L.x + 280, BOT - 110 + i * 14, 120, 11, i % 2 ? '#F4F5F6' : '#FFFFFF', 3); }

    /* the alley between the buildings: planters on the short fence at the beach end, bicycles and Honda Navis */
    h += r(ALLEY.x, TOP, ALLEY.w, BOT - TOP, '#EFD2B3');
    h += J.block(ALLEY.x + 4, TOP - 30, ALLEY.w - 8, 18, '#FFFFFF', PC.wallEdge, 10, 6) + J.plant(ALLEY.x + 30, TOP - 14, .6) + J.plant(ALLEY.x + 80, TOP - 14, .6);
    h += J.bike(ALLEY.x + 55, TOP + 160, PC.accent, 0) + J.scooter(ALLEY.x + 55, TOP + 480, PC.accent, 0) + J.scooter(ALLEY.x + 55, TOP + 800, C.gear, 0);

    /* the right building: drinks and food prep at the beach end, kitchen, the regulator rinse, retail, the tank room inland */
    h += building(p, R) + strip(R.x, TOP, R.w);
    h += J.counter(R.x + 20, TOP + 50, 200, 54, '#FFFFFF', PC.accent) + J.sink(R.x + 40, TOP + 56) + r(R.x + 240, TOP + 40, 140, 160, 'url(#' + p + '-plank)', 6) + J.block(R.x + 256, TOP + 60, 70, 46, C.steelLt, C.steel, 14, 6) + '<circle cx="' + (R.x + 276) + '" cy="' + (TOP + 76) + '" r="8" fill="' + C.plum + '"/><circle cx="' + (R.x + 306) + '" cy="' + (TOP + 76) + '" r="8" fill="' + C.plum + '"/>';
    h += J.rinseBin(R.x + 30, TOP + 140, 110, 60, PC.accent) + J.reg(R.x + 80, TOP + 140);
    y = TOP + 250; h += divider(R.x, y, R.w, [R.x + 20, R.x + 100]) + J.backWall(p, R.x, y + 6, R.w, PC, []);
    h += J.shelf(R.x + 30, y + 62, 300) + J.mask(R.x + 80, y + 52) + J.reg(R.x + 170, y + 32) + J.fins(R.x + 270, y + 60, C.gear, PC.accent);
    h += r(R.x + 370, y + 130, 6, 200, C.woodDark, 2) + J.bcd(R.x + 344, y + 140, C.gear) + J.bcd(R.x + 344, y + 230, PC.deep);
    h += J.table(R.x + 60, y + 150, 220, 50, { noPot: true, top: '#FFFFFF', front: PC.soft });
    h += r(R.x + 20, y + 300, 300, 6, C.woodDark, 3); for (i = 0; i < 3; i++) { h += J.wetsuit(R.x + 70 + i * 80, y + 306, i === 1 ? PC.deep : C.gear, i === 1 ? PC.soft : PC.accent); }
    h += J.lamp(R.x + 200, y + 6, 14);
    y = TOP + 700; h += divider(R.x, y, R.w, [R.x + 20, R.x + 100]) + strip(R.x, y + 6, R.w);
    var cols = []; for (i = 0; i < 24; i++) { cols.push(i / 24 < T.full / tot ? PC.tank : (i / 24 < (T.full + (T.filling || 0)) / tot ? PC.deep : 'empty')); }
    h += J.tankRack(R.x + 14, y + 140, cols.slice(0, 8)) + J.tankRack(R.x + 14, y + 260, cols.slice(8, 16)) + J.tankRack(R.x + 14, y + 380, cols.slice(16, 24));
    h += J.compressor(R.x + 250, y + 200, PC.accent) + J.tank(R.x + 300, y + 380, PC.deep);

    /* softening: a tree by the steps, rocks at the water's edge */
    h += J.tree(1310, 2380, .6) + J.rock(140, 1030, .7, 1);
    return h;
  }

  /* level 2: the upper floors of the same two buildings, the walkway along the alley, stairs at the inland end */
  var ROOMS = [
    { id: 'r11', n: '11', t: 'Dorm, 2 bunks', x: L.x, y: TOP + 20, w: 250, h: 190, beds: 'bunks' },
    { id: 'r10', n: '10', t: 'Single', x: L.x + 260, y: TOP + 20, w: 150, h: 190, beds: 'single' },
    { id: 'r9', n: '9', t: 'Dorm, 2 bunks', x: L.x, y: TOP + 220, w: L.w, h: 190, beds: 'bunks' },
    { id: 'r8', n: '8', t: 'Dorm, 2 bunks', x: L.x, y: TOP + 500, w: L.w, h: 190, beds: 'bunks' },
    { id: 'r7', n: '7', t: 'Two fulls', x: L.x, y: TOP + 700, w: L.w, h: 190, beds: 'fulls' },
    { id: 'r6', n: '6', t: 'Like R4', x: L.x, y: TOP + 900, w: L.w, h: 190, beds: 'fulls' },
    { id: 's1', n: 'A', t: 'Suite, 2 queens', x: R.x, y: TOP + 20, w: R.w, h: 230, beds: 'queens' },
    { id: 's2', n: 'B', t: 'Suite, 2 queens', x: R.x, y: TOP + 260, w: R.w, h: 230, beds: 'queens' },
    { id: 's3', n: 'C', t: 'Suite, 2 queens', x: R.x, y: TOP + 500, w: R.w, h: 230, beds: 'queens' },
    { id: 's4', n: 'D', t: 'Suite, 2 queens', x: R.x, y: TOP + 740, w: R.w, h: 230, beds: 'queens' }
  ];
  function upstairs(o) {
    o = o || {}; var p = 'pu', st = o.rooms || {}, h = '', i, rm, s;
    h += J.defs(p, PC) + sea(p) + shore() + pier(p, 590, 300, 74, 760, true) + boat(p, 790, 600, 1.25);
    /* the beach-side roofs of the lower level (no terrace up here) */
    h += r(200, 1080, 1000, 230, PC.roof, 14) ; for (i = 1100; i < 1300; i += 22) { h += r(200, i, 1000, 3, PC.roofLine); }
    h += building(p, L, 'url(#' + p + '-white)') + building(p, R, 'url(#' + p + '-white)');
    /* walkway: a white-wood balcony along the alley */
    h += r(ALLEY.x, TOP, ALLEY.w, BOT - TOP, '#EFD2B3', 0, ' opacity=".5"') + r(ALLEY.x + 6, TOP, 80, BOT - TOP, '#C9CFD4', 4) + r(ALLEY.x, TOP, 80, BOT - TOP - 6, 'url(#' + p + '-whiteV)', 4) + J.railV(ALLEY.x + 82, TOP, BOT - TOP - 6);
    for (i = 0; i < ROOMS.length; i++) {
      rm = ROOMS[i]; s = st[rm.id] || 'free';
      h += r(rm.x, rm.y, rm.w, rm.h, s === 'clean' ? '#FBEED9' : 'url(#' + p + '-white)') + strip(rm.x, rm.y, rm.w) + divider(rm.x, rm.y + rm.h, rm.w) + (rm.x === L.x + 260 ? vdivider(rm.x - 8, rm.y, rm.h) : '');
      if (rm.beds === 'bunks') { h += J.bunk(rm.x + 30, rm.y + 60, 64, 76, PC.accent, PC.soft) + J.bunk(rm.x + 136, rm.y + 60, 64, 76, PC.soft, PC.accent) + (rm.w > 300 ? J.plant(rm.x + rm.w - 40, rm.y + rm.h - 14, .7) : ''); }
      if (rm.beds === 'single') { h += J.bed(rm.x + 30, rm.y + 60, 80, 100, PC.accent) + J.plant(rm.x + 130, rm.y + 170, .6); }
      if (rm.beds === 'fulls') { h += J.bed(rm.x + 30, rm.y + 56, 110, 106, PC.accent) + J.bed(rm.x + 170, rm.y + 56, 110, 106, PC.soft) + J.ac(rm.x + rm.w - 74, rm.y + 30); }
      if (rm.beds === 'queens') { h += J.bed(rm.x + 18, rm.y + 60, 116, 120, PC.accent) + J.bed(rm.x + 148, rm.y + 60, 116, 120, PC.soft) + r(rm.x + 282, rm.y + 40, 108, 176, C.glass, 6) + J.toilet(rm.x + 296, rm.y + 52) + J.shower(rm.x + 334, rm.y + 130, 48, 76) + J.ac(rm.x + 20, rm.y + 30); }
    }
    h += r(L.x, TOP + 420, L.w, 70, 'url(#' + p + '-tile)') + J.toilet(L.x + 20, TOP + 424) + J.sink(L.x + 90, TOP + 436) + J.sink(L.x + 150, TOP + 436) + J.shower(L.x + 300, TOP + 426, 90, 56);
    h += r(R.x + 160, BOT - 140, 230, 120, '#C9CFD4', 8); for (i = 0; i < 8; i++) { h += r(R.x + 160, BOT - 140 + i * 15, 230, 12, i % 2 ? '#F4F5F6' : '#FFFFFF', 3); }
    return h;
  }

  var pins = { ground: { boat: [790, 440], tanks: [R.x + 130, TOP + 790], fill: [R.x + 310, TOP + 840], confined: [590, 200] }, up: {} };
  ROOMS.forEach(function (rm) { pins.up[rm.id] = [rm.x + rm.w - 46, rm.y + 56]; });

  w.UART = w.UART || {};
  w.UART.paradise = { ground: ground, upstairs: upstairs, rooms: ROOMS, pins: pins, colors: PC, viewGround: '0 0 1440 2480', viewUp: '0 1040 1440 1440' };
})(window);
