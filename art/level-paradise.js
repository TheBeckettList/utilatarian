/* Paradise Divers (Utila), drawn as a level of the dive-shop game: Josie's oblique "room from above", in Paradise's own colors
   (white clapboard, teal-blue trim and railings, grey tin roofs, a thatched palapa, a raised white-sand platform behind a seawall).
   Needs josie.js, world.js, island.js. Plain ES5.

   Drawn from the owner's photos (2026-10-22: the aerial, the view from the dock, the sand platform, the dock end) and the owner's
   notes. Sea at the bottom, as in the aerial and on Utila's map (the shop faces south over the harbour, 50 m left of the Main Pier).

   West to east along the water:  covered stilt deck  |  rock shore + palapa  |  the dock, out to the shaded end platform
                                  |  the raised sand platform (seawall of white pipe piles)  |  the neighbour's stilt restaurant
   Inland:  the white gable building (2 floors, a grey shed-roof room at its front)  |  the breezeway with the stairs  |
            the grey-roof building (2 floors): ground = sitting area (porch) at the front, the office, the classroom;
            upstairs = the walkway on the inside third, rooms on the outer two thirds: a room over the sitting area, a dorm over the
            office, a dorm over the classroom.

   RESHAPE NOTE (owner to confirm)
     Confirmed by the owner:  the grey-roof building's ground and upstairs layout, the walkway (inside 1/3 under the roof peak).
     From the photos:         dock and end platform (shade sail, benches, picnic table, hammock), dive boat alongside, sand platform
                              with picnic tables, grill, kayaks and the pink tub, palapa on the rocks, stilt deck, blue dive-flag wall.
     STAND-INS (not seen yet): inside the white gable building (kitchen and lounge below, two private en-suite rooms above), the gear
                              room and compressor in its front shed room, the use of the stilt deck (drawn as the hammock deck),
                              where the shared bathrooms are.
     Cut:      the street side and the neighbours (only edges shown).   Enlarged: the dock and the boat (the signature).
     Life:     crabs, a turtle, an eagle ray, reef fish, a pelican on a dock post (stand-in joke until the owner picks one).

   J.level.paradise({ floor: 'ground' | 'upstairs' }) returns { svg, W, H, targets, note }. */
(function (w) {
  'use strict';
  var J = w.UJ, C = J.C, I = J.isle, r = J.r, e = J.e;
  J.level = J.level || {};
  var P = 'pd';
  var PC = J.level.PARADISE = {
    accent: '#2479A8', deep: '#1B5E86', soft: '#BFE3EE', pale: '#E6F3F8', pop: '#F2C230', trim: '#2479A8', rail: '#2C6FA3',
    wallTop: '#9AA7B0', shutter: '#2479A8', shutterLine: '#FFFFFF', wainscot: '#E7EEF2', wainscotLine: '#D3DEE5', wallCream: '#FBFBF8', wallBase: '#E2E6E8',
    whiteWood: '#FBFAF7', whiteLine: '#E3E7EA', tile: '#EEF1F3', tile2: '#E4E9ED', wall: '#FFFFFF', wallEdge: '#DCE3E8',
    brickBase: '#E3D7CC', brick: '#EFE6DC', tank: '#2479A8', tank2: '#F2F2EE', roof: '#A9B4BC', roofLine: '#96A2AB'
  };
  var W = 1440, H = 1430;
  var SAND2 = '#F7EDE0';                 /* the white sand of the raised platform */

  /* a room from above: floor, wall slabs with a ledge, the back (inland) wall as an elevation.
     o: { wins, door: [x, w] in the back wall, open: true (no front wall), front: [x0, x1] doorway in the front wall,
          left: [y0, y1] / right: [y0, y1] doorways in the side walls, back: a color object for the back wall } */
  function room(x, y, wd, ht, floor, o) {
    o = o || {}; var t = 12, h = r(x, y, wd, ht, floor), d, c = o.back || PC;
    function slab(a, b, ww, hh) { return ww > 0 && hh > 0 ? r(a, b + 5, ww, hh, PC.wallEdge, 3) + r(a, b, ww, hh, '#FFFFFF', 3) : ''; }
    function side(a, gap) { return gap ? slab(a, y - t, t, gap[0] - y + t) + slab(a, gap[1], t, y + ht + t - gap[1]) : slab(a, y - t, t, ht + 2 * t); }
    if (o.backWall !== false) { h += J.backWall(P, x, y, wd, c, o.wins || []); }
    if (o.door) { d = o.door; h += r(x + d[0], y, d[1], 96, o.doorFill || '#F1E3D2') + r(x + d[0] - 6, y, 6, 96, PC.trim, 2) + r(x + d[0] + d[1], y, 6, 96, PC.trim, 2) + r(x + d[0] - 6, y - 4, d[1] + 12, 10, PC.trim, 3); }
    h += side(x - t, o.left) + side(x + wd, o.right) + slab(x - t, y - t, wd + 2 * t, t);
    if (!o.open) { if (o.front) { h += slab(x - t, y + ht, o.front[0] - x + t, t) + slab(o.front[1], y + ht, x + wd + t - o.front[1], t); } else { h += slab(x - t, y + ht, wd + 2 * t, t); } }
    return h;
  }
  function post(cx, cy, col) { return J.shadow(cx + 3, cy + 10, 10, 4) + '<rect x="' + (cx - 8) + '" y="' + (cy - 8) + '" width="16" height="22" rx="4" fill="' + (col || PC.trim) + '"/><rect x="' + (cx - 8) + '" y="' + (cy - 8) + '" width="16" height="10" rx="4" fill="#FFFFFF" opacity=".25"/>'; }
  function railH(x, y, len, col) { var h = r(x, y + 4, len, 8, PC.deep, 3) + r(x, y, len, 8, col || PC.rail, 3), i; for (i = x + 18; i < x + len - 6; i += 22) { h += r(i, y + 8, 3, 14, col || PC.rail, 1); } return h; }
  function railV(x, y, len, col) { return r(x + 3, y, 8, len, PC.deep, 3) + r(x, y, 8, len, col || PC.rail, 3); }
  /* a picnic table from above: a wood top between two benches */
  function picnic(cx, cy, rot) {
    return '<g transform="translate(' + cx + ',' + cy + ') rotate(' + (rot || 0) + ')">' + J.shadow(4, 40, 70, 10) +
      J.block(-70, -40, 140, 14, C.wood, C.woodFront, 7, 4) + J.block(-76, -14, 152, 34, C.wood, C.woodFront, 10, 5) + r(-70, -10, 140, 2, C.woodFront, 0, ' opacity=".5"') + r(-70, 0, 140, 2, C.woodFront, 0, ' opacity=".5"') +
      J.block(-70, 30, 140, 14, C.wood, C.woodFront, 7, 4) + '</g>';
  }
  /* the seawall: a row of white pipe piles, seen from above-front */
  function pilesH(x, y, len) { var h = r(x, y - 6, len, 12, '#E6E1DA', 3), i; for (i = x; i < x + len - 10; i += 24) { h += r(i, y, 20, 34, '#D6D9DC', 9) + r(i, y - 2, 20, 30, '#FFFFFF', 9) + r(i + 4, y + 4, 4, 20, '#EEF1F3', 2); } return h; }
  function pilesV(x, y, len) { var h = r(x - 6, y, 12, len, '#E6E1DA', 3), i; for (i = y; i < y + len - 10; i += 24) { h += r(x, i, 26, 20, '#D6D9DC', 9) + r(x - 2, i, 26, 18, '#FFFFFF', 9); } return h; }
  function shadeSail(x, y, wd, ht) { return '<path d="M' + x + ',' + (y + 10) + ' L' + (x + wd) + ',' + y + ' L' + (x + wd - 20) + ',' + (y + ht) + ' L' + (x + 30) + ',' + (y + ht - 16) + 'Z" fill="#E9D7A8" opacity=".78"/><path d="M' + x + ',' + (y + 10) + ' L' + (x + wd - 20) + ',' + (y + ht) + '" stroke="#D8C38E" stroke-width="3" opacity=".7"/>'; }
  function pinkTub(cx, cy) { return J.shadow(cx + 4, cy + 30, 66, 10) + r(cx - 62, cy - 30, 124, 64, '#E79AAE', 26) + r(cx - 50, cy - 20, 100, 44, '#BFE6EE', 18) + r(cx - 44, cy - 14, 40, 5, '#FFFFFF', 3, ' opacity=".7"'); }
  function dinghy(cx, cy, rot) { return '<g transform="translate(' + cx + ',' + cy + ') rotate(' + rot + ')">' + J.shadow(4, 8, 30, 60, .14) + r(-28, -56, 56, 112, '#EEF1F3', 26) + r(-28, -56, 56, 112, '#FFFFFF', 26, ' opacity=".7"') + r(-18, -40, 36, 84, '#2E3238', 16) + r(-20, -8, 40, 10, '#D9DEE2', 4) + r(-6, 52, 12, 14, C.gear, 3) + '</g>'; }
  function bubble(cx, cy, rad, inner, ring, pulse) {
    return '<circle cx="' + cx + '" cy="' + (cy + 5) + '" r="' + rad + '" fill="#D9E2E8"/><circle cx="' + cx + '" cy="' + cy + '" r="' + rad + '" fill="#FFFFFF"/>' +
      (ring ? '<circle cx="' + cx + '" cy="' + cy + '" r="' + (rad - 3) + '" fill="none" stroke="' + ring + '" stroke-width="6"' + (pulse ? ' class="pulse"' : '') + '/>' : '') + inner;
  }
  function statusPill(cx, cy, word, kind) {
    var bg = { ok: '#D9F0E8', low: '#FBEBC5', alert: '#F9D6D6', busy: '#EEE7EA' }[kind], ink = { ok: '#2F6B58', low: '#8A5C00', alert: '#8E2F3F', busy: '#6E5560' }[kind], mk = { ok: '✓', low: '!', alert: '!!', busy: '…' }[kind];
    var label = mk + ' ' + word, wd = (label.length * 7.6 + 20) * 1.5, hh = 39;
    return r(cx - wd / 2, cy - hh / 2 + 4, wd, hh, '#D3DADF', hh / 2) + r(cx - wd / 2, cy - hh / 2, wd, hh, bg, hh / 2) +
      '<text x="' + cx + '" y="' + (cy + 8) + '" font-family="Baloo 2, Nunito, sans-serif" font-weight="800" font-size="22" fill="' + ink + '" text-anchor="middle">' + label + '</text>';
  }
  function gauge(cx, cy, frac, s) {
    var R = 40, seg = [['#7CC9A2', 0, .45], ['#F2B632', .45, .75], ['#D9617E', .75, 1]], h = '', i;
    function pt(t) { var a = Math.PI + t * Math.PI; return [cx + Math.cos(a) * R, cy + Math.sin(a) * R]; }
    for (i = 0; i < 3; i++) { var a0 = pt(seg[i][1]), a1 = pt(seg[i][2]); h += '<path d="M' + a0[0].toFixed(1) + ',' + a0[1].toFixed(1) + ' A40,40 0 0 1 ' + a1[0].toFixed(1) + ',' + a1[1].toFixed(1) + '" stroke="' + seg[i][0] + '" stroke-width="12" fill="none"/>'; }
    var n = pt(1 - frac);
    return '<g transform="translate(' + cx + ',' + cy + ') scale(' + s + ') translate(' + (-cx) + ',' + (-cy) + ')">' + h + '<path d="M' + cx + ',' + cy + ' L' + n[0].toFixed(1) + ',' + n[1].toFixed(1) + '" stroke="#5B3843" stroke-width="5" stroke-linecap="round"/><circle cx="' + cx + '" cy="' + cy + '" r="7" fill="#5B3843"/></g>';
  }
  function roofTin(x, y, wd, ht, vertical) { var h = r(x + 6, y + 8, wd, ht, '#3B4249', 6, ' opacity=".12"') + r(x, y, wd, ht, PC.roof, 6), i; if (vertical) { for (i = x + 12; i < x + wd; i += 16) { h += r(i, y, 3, ht, PC.roofLine, 1); } } else { for (i = y + 12; i < y + ht; i += 16) { h += r(x, i, wd, 3, PC.roofLine, 1); } } return h; }

  /* ---------------- the outdoors, shared by both floors ---------------- */
  var L0 = 320, L1 = 600, B0 = 612, B1 = 678, R0 = 690, R1 = 1050, TOP = 120;
  function outdoors() {
    var h = '';
    /* the street side and the trees behind */
    h += r(0, 0, W, H, '#F6DCC0') + r(0, 0, W, 70, '#EAD7C3') + r(0, 70, W, 6, '#E0CBB4') + J.at(150, 260, 0, .5, J.tree(0, 0, 1)) + J.at(1250, 170, 0, .4, J.tree(0, 0, 1)) + J.plant(1120, 140, .7) + J.plant(250, 120, .6);
    /* the water: in front of the stilt deck, the rock shore, under the dock, round the sand platform's seawall */
    h += '<path d="M0,640 L300,640 C330,690 380,740 460,770 C520,792 560,800 652,800 L652,930 L1122,930 L1122,620 L1440,620 L1440,1430 L0,1430Z" fill="' + C.water + '"/>' +
      '<path d="M0,1250 C300,1230 520,1270 800,1246 C1080,1222 1260,1260 1440,1240 V1430 H0Z" fill="' + C.deep + '"/>' +
      '<path d="M300,640 C330,690 380,740 460,770 C520,792 560,800 652,800" stroke="#FFF1E2" stroke-width="10" fill="none" stroke-linecap="round"/>';
    h += I.reef(200, 1100, 110, 40, 4) + I.reef(1230, 1060, 120, 50, 7) + I.reef(1000, 1340, 90, 30, 9) + I.school(1200, 1080, 9, 30, 1.1) + I.ray(230, 1330, .7, 12) + J.turtle(1010, 1130, .9, -150) + J.wave(380, 1010, 60) + J.wave(1300, 840, 60) + J.wave(900, 1290, 50);
    /* the neighbour's stilt restaurant to the east (edge only) */
    h += r(1150, 300, 290, 420, 'url(#' + P + '-plank)') + r(1150, 300, 290, 14, '#FFFFFF') + r(1146, 300, 8, 420, '#FFFFFF') + J.chair(1220, 430, '#5FB9B0', '#9FD6CF') + J.chair(1300, 440, '#5FB9B0', '#9FD6CF') + J.roundTable(1262, 470, 24, { noPot: true }) + J.chair(1240, 590, '#5FB9B0', '#9FD6CF') + J.roundTable(1300, 610, 24, { noPot: true });
    for (var k = 0; k < 4; k++) { h += J.woodPost(1160 + k * 90, 730); }
    /* the covered stilt deck to the west (the hammock deck: stand-in use) */
    h += r(40, 520, 260, 330, 'url(#' + P + '-plankV)', 8) + r(40, 520, 260, 10, '#FFFFFF') + J.woodPost(44, 850) + J.woodPost(170, 856) + J.woodPost(296, 850) + J.woodPost(40, 700);
    h += J.hammock(70, 600, 200, 640, '#F2A66B') + J.hammock(70, 720, 200, 760, PC.soft) + J.block(240, 560, 40, 250, C.wood, C.woodFront, 8, 6);
    /* the rock shore (coral rubble) and the palapa on it */
    h += J.rock(340, 730, .5, 2) + J.rock(560, 790, .45, 6) + J.rock(610, 800, .32, 8) + J.rock(320, 690, .4, 9);
    h += J.stool(390, 718, PC.pop) + J.stool(520, 724, PC.soft) + J.palapa(P, 456, 742, 62) + J.rock(440, 800, .5, 4);
    /* the raised sand platform behind its seawall, in front of the grey-roof building */
    h += r(B1, 680, 1122 - B1, 250, SAND2) + pilesH(652, 924, 470) + pilesV(1110, 640, 290);
    h += J.block(B1 + 6, 700, 26, 200, C.wood, C.woodFront, 8, 6);                                  /* the long bench along the dock side */
    h += picnic(800, 760, -6) + picnic(960, 780, 4) + J.grill(990, 860) + pinkTub(820, 870) + J.kayak(1072, 790, 110, '#E8604C', 0) + J.crab(900, 712) + J.crab(1060, 890);
    /* the dock out to the shaded end platform; the boat alongside, bow to sea */
    h += J.pier(P, 568, 790, 72, 470, true);
    h += r(456, 1240, 300, 170, 'url(#' + P + '-plank)', 8) + J.woodPost(458, 1240) + J.woodPost(754, 1240) + J.woodPost(458, 1410) + J.woodPost(754, 1410);
    h += J.block(470, 1252, 270, 16, C.wood, C.woodFront, 8, 4) + J.block(470, 1252, 16, 130, C.wood, C.woodFront, 8, 4) + picnic(610, 1330, 0) + J.hammock(700, 1270, 740, 1380, '#E8604C') + shadeSail(470, 1240, 300, 150);
    h += J.at(720, 1080, 180, .82, J.boat(P, 'dive', PC, { rows: 5 })) + '<path d="M650,990 Q668,980 684,990" stroke="' + C.plum + '" stroke-width="2.4" fill="none" stroke-dasharray="4 3"/>';
    h += J.at(642, 980, 0, .8, J.pelican(0, 0)) + dinghy(400, 1280, 20);
    return h;
  }

  /* ---------------- ground floor ---------------- */
  function ground() {
    var h = '', t = [];
    /* the white gable building: kitchen at the back, the lounge in front (STAND-INS), and the open shed-roof gear room at its front */
    h += room(L0, TOP, L1 - L0, 200, 'url(#' + P + '-tile)', { wins: [L0 + 40], right: [TOP + 120, TOP + 190] });
    h += J.counter(L0 + 30, TOP + 112, 160, 44, '#FFFFFF', PC.soft) + J.block(L0 + 200, TOP + 100, 60, 60, C.steelLt, C.steel, 14, 8) + e(L0 + 214, TOP + 116, 8, 6, C.gear) + e(L0 + 244, TOP + 116, 8, 6, C.gear) + J.lamp(L0 + 110, TOP, 20);
    h += room(L0, TOP + 220, L1 - L0, 200, 'url(#' + P + '-plank)', { wins: [L0 + 60, L0 + 170], right: [TOP + 330, TOP + 400] });
    h += J.armchair(L0 + 70, TOP + 400, PC.accent, PC.soft) + J.rug(L0 + 150, TOP + 360, 70, 30, { accent: PC.soft, soft: '#FFFFFF' }) + J.armchair(L0 + 220, TOP + 400, '#F2A66B', '#F6C49B') + J.plant(L0 + 260, TOP + 410, .55);
    /* the gear room: open to the shore under its shed roof; tanks, the compressor, wetsuits, rinse bins */
    h += room(L0, TOP + 440, 250, 130, '#E9E2D9', { open: true, backWall: false });
    h += J.tankRack(L0 + 10, TOP + 520, [PC.tank, PC.tank, PC.tank, 'empty']) + J.compressor(L0 + 130, TOP + 536, PC.accent) + post(L0, TOP + 570, '#FFFFFF') + post(L0 + 246, TOP + 570, '#FFFFFF');
    /* the breezeway between the buildings, the stairs up at its inland end, the yellow post at its mouth */
    h += r(B0, TOP - 10, B1 - B0, 590, '#EFE3D4') + J.plant(B0 + 30, TOP + 520, .55);
    var steps = ['#B98F68', '#C49A72', '#CFA67D', '#D9B48A', '#E2C29C', '#EACFAE'], i;
    for (i = 0; i < 6; i++) { h += J.block(B0 + 6, TOP + 200 - i * 28, B1 - B0 - 12, 26, steps[i], C.woodFront, 6, 3); }
    h += post(B0 + 10, TOP + 560, PC.pop);
    /* the grey-roof building: classroom at the back, the office, the sitting area (porch) at the front */
    h += room(R0, TOP, R1 - R0, 240, 'url(#' + P + '-tile)', { wins: [R0 + 60, R0 + 230], left: [TOP + 150, TOP + 220] });
    h += J.board(R0 + 140, TOP + 8, 110, 76, PC) + J.table(R0 + 70, TOP + 140, 220, 54) + J.chair(R0 + 110, TOP + 206, PC.accent, PC.soft) + J.chair(R0 + 180, TOP + 206, '#F2C230', '#F8DE7E') + J.chair(R0 + 250, TOP + 206, '#5FB9B0', '#9FD6CF') + J.lamp(R0 + 180, TOP, 20);
    h += room(R0, TOP + 260, R1 - R0, 170, 'url(#' + P + '-plank)', { wins: [R0 + 250], left: [TOP + 330, TOP + 400], front: [R0 + 140, R0 + 220] });
    h += J.board(R0 + 30, TOP + 268, 100, 70, PC) + J.counter(R0 + 40, TOP + 360, 180, 44, '#FFFFFF', PC.accent) + J.screen(R0 + 150, TOP + 364, PC) + J.mask(R0 + 290, TOP + 380, C.gear, C.gear) + J.mask(R0 + 318, TOP + 404, PC.accent) + J.plant(R0 + 330, TOP + 420, .5) + J.lamp(R0 + 120, TOP + 260, 20);
    /* the porch: its back wall is the office's front, painted blue with the dive flag */
    var blue = { wallTop: PC.roof, wallCream: '#2C6FA3', wainscot: '#2C6FA3', wainscotLine: '#255F8C', wallBase: '#E2E6E8', shutter: '#FFFFFF', shutterLine: PC.accent };
    h += room(R0, TOP + 450, R1 - R0, 130, 'url(#' + P + '-plankV)', { open: true, back: blue });
    h += J.diveFlag(R0 + 236, TOP + 470, 0).replace('<g transform="translate(' + (R0 + 236) + ',' + (TOP + 470) + ') rotate(0)">', '<g transform="translate(' + (R0 + 236) + ',' + (TOP + 470) + ') scale(2.2)">') +
      r(R0 + 30, TOP + 462, 130, 6, '#FFFFFF', 3, ' opacity=".5"') + r(R0 + 30, TOP + 476, 90, 6, '#FFFFFF', 3, ' opacity=".35"');
    h += J.block(R0 + 30, TOP + 560, 200, 18, C.wood, C.woodFront, 8, 5) + railH(R0, TOP + 580, 130) + railH(R0 + 230, TOP + 580, R1 - R0 - 230) + post(R0, TOP + 584) + post(R0 + 130, TOP + 584) + post(R0 + 230, TOP + 584) + post(R1, TOP + 584);
    /* ---- status bubbles (sample states) ---- */
    h += bubble(L0 - 30, TOP + 470, 50, J.at(L0 - 30, TOP + 474, 0, .5, J.tankRack(-56, 40, ['empty', 'empty', 'empty'])), '#D9617E', true) + statusPill(L0 - 30, TOP + 540, '12 by 1:30', 'alert');
    h += bubble(850, 1100, 50, gauge(850, 1118, .36, .7), '#F2B632') + statusPill(850, 1170, 'low', 'low');
    h += bubble(R0 + 300, TOP + 300, 44, J.at(R0 + 300, TOP + 306, 0, .55, J.boat(P, 'dive', PC, { rows: 2 })).replace('scale(0.55)', 'scale(.26)'), null) + statusPill(R0 + 300, TOP + 362, 'PM boat 8/12', 'busy');
    t.push({ id: 'boat', box: [650, 940, 150, 300], tag: [850, 1170] });
    t.push({ id: 'fill-station', box: [L0, TOP + 440, 250, 140], tag: [L0 - 30, TOP + 540] });
    t.push({ id: 'front-desk', box: [R0, TOP + 260, R1 - R0, 170], tag: [R0 + 300, TOP + 360] });
    t.push({ id: 'classroom', box: [R0, TOP, R1 - R0, 240], tag: [R0 + 180, TOP + 250] });
    t.push({ id: 'sitting-area', box: [R0, TOP + 450, R1 - R0, 140], tag: [R0 + 180, TOP + 600] });
    t.push({ id: 'stairs', box: [B0, TOP, B1 - B0, 220], tag: [B0 + 33, TOP + 230] });
    t.push({ id: 'dock-end', box: [456, 1240, 300, 170], tag: [606, 1230] });
    t.push({ id: 'sand', box: [B1, 680, 1122 - B1, 250], tag: [900, 700] });
    return { svg: h, targets: t };
  }

  /* ---------------- upstairs ---------------- */
  function upstairs() {
    var h = '<rect width="' + W + '" height="' + H + '" fill="#FFFFFF" opacity=".42"/>', t = [], i;
    /* the white gable building upstairs: two private rooms, two doubles each, en-suite (STAND-INS until the owner confirms) */
    [[TOP, 'url(#' + P + '-plank)'], [TOP + 230, 'url(#' + P + '-plank)']].forEach(function (rm, k) {
      var y = rm[0];
      h += room(L0, y, L1 - L0, 210, rm[1], { wins: [L0 + 40], right: [y + 140, y + 200] });
      h += J.bed(L0 + 20, y + 110, 90, 70, k ? PC.soft : '#F2C9A5') + J.bed(L0 + 126, y + 110, 90, 70, PC.soft) + r(L1 - 64, y + 104, 56, 96, '#EEF4F8', 6) + J.toilet(L1 - 48, y + 116) + J.ac(L0 + 150, y + 6);
    });
    h += roofTin(L0, TOP + 450, 250, 130, true);                                                     /* the gear room's shed roof */
    /* the stair landing in the breezeway */
    h += r(B0, TOP - 10, B1 - B0, 260, '#EACFAE') + r(B0, TOP - 10, B1 - B0, 260, 'url(#' + P + '-plankV)');
    /* the grey-roof building upstairs: the walkway on the inside third, the rooms on the outer two thirds */
    var WK = R0 + Math.round((R1 - R0) / 3);
    h += r(R0, TOP - 10, WK - R0, 600, 'url(#' + P + '-plankV)') + railV(R0 - 4, TOP + 250, 330) + railH(R0, TOP + 584, WK - R0);
    h += J.plant(R0 + 30, TOP + 560, .5);
    h += room(WK, TOP, R1 - WK, 240, 'url(#' + P + '-plank)', { wins: [WK + 90], left: [TOP + 160, TOP + 220] });                 /* dorm over the classroom */
    h += J.bunk(WK + 30, TOP + 110, 70, 50, PC.accent, PC.soft) + J.bunk(WK + 130, TOP + 110, 70, 50, PC.soft, PC.accent) + J.plant(R1 - 40, TOP + 230, .45);
    h += room(WK, TOP + 260, R1 - WK, 170, 'url(#' + P + '-plank)', { wins: [WK + 90], left: [TOP + 360, TOP + 420] });          /* dorm over the office */
    h += J.bunk(WK + 30, TOP + 360, 70, 44, PC.accent, PC.soft) + J.bunk(WK + 130, TOP + 360, 70, 44, PC.soft, PC.accent);
    h += room(WK, TOP + 450, R1 - WK, 140, 'url(#' + P + '-plank)', { wins: [WK + 90], left: [TOP + 520, TOP + 580] });          /* the room over the sitting area */
    h += J.bed(WK + 40, TOP + 540, 110, 34, '#F2C9A5') + J.plant(R1 - 36, TOP + 580, .45);
    for (i = 0; i < 3; i++) { h += post(R0 + 4, TOP + 30 + i * 200, PC.trim); }
    /* bubbles: housekeeping and the front desk upstairs */
    h += bubble(WK + 120, TOP + 300, 44, J.at(WK + 120, TOP + 306, 0, .5, J.bed(-46, -40, 92, 60, PC.soft)), null) + statusPill(WK + 120, TOP + 360, '2 to clean', 'busy');
    h += bubble(WK + 170, TOP + 70, 40, J.at(WK + 170, TOP + 76, 0, .44, J.bed(-46, -40, 92, 60, PC.accent)), null) + statusPill(WK + 170, TOP + 124, '6 / 8 beds', 'ok');
    t.push({ id: 'dorm-back', box: [WK, TOP, R1 - WK, 240], tag: [WK + 170, TOP + 124] });
    t.push({ id: 'dorm-front', box: [WK, TOP + 260, R1 - WK, 170], tag: [WK + 120, TOP + 360] });
    t.push({ id: 'room-front', box: [WK, TOP + 450, R1 - WK, 140], tag: [WK + 120, TOP + 600] });
    t.push({ id: 'walkway', box: [R0, TOP, WK - R0, 590], tag: [R0 + 60, TOP + 600] });
    t.push({ id: 'private-rooms', box: [L0, TOP, L1 - L0, 440], tag: [L0 + 140, TOP + 450] });
    return { svg: h, targets: t };
  }

  J.level.paradise = function (o) {
    o = o || {};
    var up = o.floor === 'upstairs', body = up ? upstairs() : ground();
    return {
      svg: J.defs(P, PC) + outdoors() + body.svg, W: W, H: H, targets: body.targets, floor: up ? 'upstairs' : 'ground',
      note: up ? 'Upstairs. Grey-roof building: the walkway on the inside third, a dorm over the classroom, a dorm over the office, a room over the sitting area (owner). White building: two private en-suite rooms (stand-ins until seen).'
        : 'Ground floor, sea at the bottom as in the aerial. Grey-roof building: sitting area, office, classroom (owner). White building interiors, the gear room and the hammock deck use are stand-ins. Bubbles show sample states.'
    };
  };
})(window);
