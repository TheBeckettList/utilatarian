/* Paradise (Utila), drawn as a level of Josie's game: the same oblique "room from above", warm floors, back walls with wainscot and
   shutters, life in the corners, status bubbles where the work is. Needs josie.js, world.js, island.js. Plain ES5.

   STAND-IN: Paradise in Tripwrights is a stand-in dive shop until the real Paradise confirms it. The layout follows the owner's two
   sketches and the satellite view (docs: HANDOVER), reshaped by the level-design rules:

   RESHAPE NOTE (owner to confirm)
     Cut:       nothing; the hostel rooms (R1, R2, dorm, full/single, level 2, suites A-D) move to their own level, "Rooms",
                reached by the stairs (housekeeping and front desk work there; guests see their own room)
     Kept:      the L dock and the Confined house, the dive boat alongside, the second mooring, the beach (kit-up, rinse bins,
                shower, palapa, grill), the two buildings and the alley, the office and dive board facing the beach, the tank room
     Merged:    drinks prep + kitchen (one room); regulator rinse + retail (one room); classroom + gear repair (side by side)
     Moved:     nothing; sea at the top, office left, tank room at the inland end of the right building, Josie's to the west
     Enlarged:  the dive boat and the dock (the place's signature)
     Life:      crabs, a turtle, an eagle ray, reef fish, a pelican on the dock (stand-in joke until the owner picks one)

   J.level.paradise() returns { svg, W, H, targets, note }. Targets are the tap areas (same contract as the vessel's parts). */
(function (w) {
  'use strict';
  var J = w.UJ, C = J.C, I = J.isle, r = J.r, e = J.e;
  J.level = J.level || {};
  var P = 'pd';
  var PC = J.level.PARADISE = {
    accent: '#3E86B8', deep: '#2E6E9E', soft: '#BFE0F2', pale: '#E6F2FA', pop: '#F2B632',
    wallTop: '#8EC3E3', shutter: '#4F8FC0', shutterLine: '#FFFFFF', wainscot: '#DDEBF5', wainscotLine: '#C9DCEB', wallCream: '#FFF8EF', wallBase: '#EAD9C5',
    whiteWood: '#FBFAF7', whiteLine: '#E3E7EA', tile: '#EEF1F3', tile2: '#E4E9ED', wall: '#FFFFFF', wallEdge: '#E3E7EA',
    brickBase: '#E3D7CC', brick: '#EFE6DC', tank: '#3E86B8', tank2: '#F2F2EE'
  };
  var W = 1440, H = 1300;

  /* a room seen from above: floor, white wall slabs with a ledge, the back wall (top) drawn as an elevation with an optional door */
  function room(x, y, wd, ht, floor, o) {
    o = o || {}; var t = 12, h = r(x, y, wd, ht, floor), d;
    function slab(a, b, ww, hh) { return r(a, b + 5, ww, hh, PC.wallEdge, 3) + r(a, b, ww, hh, '#FFFFFF', 3); }
    h += J.backWall(P, x, y, wd, PC, o.wins || []);
    if (o.door) { d = o.door; h += r(x + d[0], y, d[1], 96, '#F6DCC0') + r(x + d[0] - 6, y, 6, 96, C.woodFront, 2) + r(x + d[0] + d[1], y, 6, 96, C.woodFront, 2) + r(x + d[0] - 6, y - 4, d[1] + 12, 10, C.woodFront, 3); }
    h += slab(x - t, y - t, t, ht + 2 * t) + slab(x + wd, y - t, t, ht + 2 * t) + slab(x - t, y - t, wd + 2 * t, t);
    if (o.bottom) { h += slab(x - t, y + ht, o.bottom[0] - x + t, t) + slab(o.bottom[1], y + ht, x + wd + t - o.bottom[1], t); } else { h += slab(x - t, y + ht, wd + 2 * t, t); }
    return h;
  }
  function bubble(cx, cy, rad, inner, ring, pulse) {
    return '<circle cx="' + cx + '" cy="' + (cy + 5) + '" r="' + rad + '" fill="#D9E2E8"/><circle cx="' + cx + '" cy="' + cy + '" r="' + rad + '" fill="#FFFFFF"/>' +
      (ring ? '<circle cx="' + cx + '" cy="' + cy + '" r="' + (rad - 3) + '" fill="none" stroke="' + ring + '" stroke-width="6"' + (pulse ? ' class="pulse"' : '') + '/>' : '') + inner;
  }
  function statusPill(cx, cy, word, kind) {
    var bg = { ok: '#D9F0E8', low: '#FBEBC5', alert: '#F9D6D6', busy: '#EEE7EA' }[kind], ink = { ok: '#2F6B58', low: '#8A5C00', alert: '#8E2F3F', busy: '#6E5560' }[kind], mk = { ok: '✓', low: '!', alert: '!!', busy: '…' }[kind];
    var s = 1.5, label = mk + ' ' + word, wd = (label.length * 7.6 + 20) * s, hh = 26 * s;
    return r(cx - wd / 2, cy - hh / 2 + 4, wd, hh, '#E2D7CC', hh / 2) + r(cx - wd / 2, cy - hh / 2, wd, hh, bg, hh / 2) +
      '<text x="' + cx + '" y="' + (cy + 8) + '" font-family="Baloo 2, Nunito, sans-serif" font-weight="800" font-size="22" fill="' + ink + '" text-anchor="middle">' + label + '</text>';
  }
  function gauge(cx, cy, frac, s) {
    var R = 40, seg = [['#7CC9A2', 0, .45], ['#F2B632', .45, .75], ['#D9617E', .75, 1]], h = '', i;
    function pt(t) { var a = Math.PI + t * Math.PI; return [cx + Math.cos(a) * R, cy + Math.sin(a) * R]; }
    for (i = 0; i < 3; i++) { var a0 = pt(seg[i][1]), a1 = pt(seg[i][2]); h += '<path d="M' + a0[0].toFixed(1) + ',' + a0[1].toFixed(1) + ' A40,40 0 0 1 ' + a1[0].toFixed(1) + ',' + a1[1].toFixed(1) + '" stroke="' + seg[i][0] + '" stroke-width="12" fill="none"/>'; }
    var n = pt(1 - frac);
    return '<g transform="translate(' + cx + ',' + cy + ') scale(' + s + ') translate(' + (-cx) + ',' + (-cy) + ')">' + h + '<path d="M' + cx + ',' + cy + ' L' + n[0].toFixed(1) + ',' + n[1].toFixed(1) + '" stroke="#5B3843" stroke-width="5" stroke-linecap="round"/><circle cx="' + cx + '" cy="' + cy + '" r="7" fill="#5B3843"/></g>';
  }
  function wetsuitRail(x, y, n) { var h = r(x - 10, y - 14, n * 46 + 20, 6, C.woodDark, 3), i; for (i = 0; i < n; i++) { h += J.wetsuit(x + 22 + i * 46, y - 6, i === 1 ? '#3B4249' : C.gear, i === 1 ? PC.accent : PC.soft); } return h; }

  J.level.paradise = function () {
    var h = J.defs(P, PC), t = [];
    /* ---- the sea, with Josie's two bands and foam ---- */
    h += r(0, 0, W, 330, C.water) + '<path d="M0,0 H1440 V120 C1200,140 900,104 600,128 C380,146 160,118 0,134Z" fill="' + C.deep + '"/>';
    h += I.reef(250, 200, 120, 40, 4) + I.reef(1160, 180, 110, 46, 7) + I.reef(980, 70, 70, 26, 9);
    h += I.school(1180, 190, 9, 30, 1.1) + I.ray(300, 70, .7, 12) + J.turtle(1320, 90, .9, 30);
    h += J.wave(120, 270, 70) + J.wave(380, 60, 60) + J.wave(1220, 270, 70) + J.wave(1040, 40, 50);
    /* shore: foam, wet sand, sand */
    h += '<path d="M0,316 C240,296 420,330 700,312 C960,296 1180,326 1440,306 V1240 H0Z" fill="#FFF1E2"/><path d="M0,330 C240,310 420,344 700,326 C960,310 1180,340 1440,320 V1240 H0Z" fill="#F2D2B4"/><path d="M0,348 C240,330 420,360 700,344 C960,330 1180,358 1440,340 V1240 H0Z" fill="#F6DCC0"/>';
    /* ---- the L dock, the Confined house, the boats ---- */
    h += J.pier(P, 680, 70, 64, 290, true) + J.pier(P, 420, 70, 270, 60, false);
    /* Confined: a white deck house at the end of the L, with the confined-water pen beside it */
    h += J.shadow(370, 210, 120, 14) + J.block(260, 40, 170, 150, '#FFFFFF', '#D9E2E8', 16, 14) + r(276, 56, 138, 118, C.water, 10) + r(286, 70, 60, 6, '#FFFFFF', 3, ' opacity=".7"') + r(392, 60, 14, 66, C.steel, 4) +
      r(398, 72, 4, 4, '#FFFFFF') + r(398, 90, 4, 4, '#FFFFFF') + r(398, 108, 4, 4, '#FFFFFF') + J.lifeRing(244, 110, .9);
    /* the dive boat alongside the dock (the signature, enlarged), the second boat on its mooring */
    h += J.at(838, 214, 0, .9, J.boat(P, 'dive', PC, { rows: 5 })) + '<path d="M760,150 Q790,160 806,150" stroke="' + C.plum + '" stroke-width="2.4" fill="none" stroke-dasharray="4 3"/>';
    h += J.at(560, 228, -6, .56, J.boat(P, 'dive', { accent: '#7FB5D8', soft: '#E6F2FA', tank: '#9CCBE6', tank2: '#F2F2EE' }, { rows: 3 })) + '<circle cx="520" cy="300" r="9" fill="#F2B632"/><circle cx="520" cy="298" r="9" fill="#FFD166"/><path d="M528,296 Q546,286 556,276" stroke="' + C.plum + '" stroke-width="2" fill="none" stroke-dasharray="3 3"/>';
    /* the pelican on a dock post (stand-in joke) */
    h += J.at(756, 330, 0, .9, J.pelican(0, 0));
    /* ---- neighbors at the edges: Josie's to the west, the restaurant building to the east ---- */
    h += r(0, 360, 66, 940, 'url(#' + P + '-plankV)') + J.umbrella(30, 470, 46, '#F5B5C8', '#FFFFFF') + J.chair(40, 600, '#F5B5C8', '#F8CAD7');
    h += r(1380, 380, 60, 920, '#FFFFFF') + r(1380, 380, 60, 14, '#E8C3A0') + r(1376, 380, 6, 920, '#EADFD5');
    /* ---- the beach ---- */
    /* kit-up: a long wood bench, three rigs ready (BCD on a tank), rinse bins */
    h += J.shadow(260, 470, 170, 10) + J.block(100, 430, 330, 22, C.wood, C.woodFront, 12, 6);
    h += J.tank(130, 432, PC.tank) + J.bcd(141, 380, C.gear) + J.tank(230, 432, PC.tank) + J.bcd(241, 380, C.gear) + J.tank(330, 432, PC.tank) + J.bcd(341, 380, '#3B4249');
    h += J.rinseBin(120, 492, 80, 46, PC.accent) + J.rinseBin(220, 492, 80, 46, PC.accent) + J.rinseBin(320, 492, 80, 46, PC.soft);
    h += J.outdoorShower(480, 520) + J.fins(560, 500, C.gear, PC.accent) + J.mask(600, 520, C.gear, C.gear);
    /* the palapa with its stools, the grill, the big tree, rocks */
    h += J.palapa(P, 1000, 450, 78) + J.stool(900, 488, PC.soft) + J.stool(1074, 494, '#F2B632') + J.stool(1000, 524, '#9FD6C2');
    h += J.grill(1150, 470) + J.lounger(840, 380, PC.soft);
    h += J.at(1270, 440, 0, .62, J.tree(0, 0, 1)) + J.rock(80, 336, .55, 1) + J.rock(1330, 330, .7, 3) + J.rock(1250, 336, .4, 5) + J.crab(470, 360) + J.crab(1110, 352);
    /* ---- the buildings ---- */
    var L = 100, LR = 640, R0 = 800, RR = 1340, top = 580;
    /* office + dive board, facing the beach (door in the beach wall) */
    h += room(L, top, LR - L, 260, 'url(#' + P + '-plank)', { wins: [L + 30, L + 400], door: [180, 80] });
    h += J.board(L + 300, top + 8, 120, 80, PC) + J.counter(L + 40, top + 150, 250, 50, '#FFFFFF', PC.soft) + J.screen(L + 200, top + 156, PC) + J.lamp(L + 150, top, 22) + J.lamp(L + 400, top, 22);
    h += J.stool(L + 90, top + 214, PC.accent) + J.stool(L + 150, top + 214, '#F2B632') + J.stool(L + 210, top + 214, '#9FD6C2') + J.plant(L + 480, top + 250, .7) + J.plant(L + 330, top + 250, .5);
    /* classroom and gear repair, side by side */
    h += room(L, top + 290, 260, 230, 'url(#' + P + '-tile)', { wins: [L + 110] }) + room(L + 280, top + 290, LR - L - 280, 230, 'url(#' + P + '-plank)', { wins: [] });
    h += J.table(L + 40, top + 410, 180, 54) + J.chair(L + 70, top + 476, PC.accent, PC.soft) + J.chair(L + 130, top + 476, '#9FD6C2', '#C6EBDD') + J.chair(L + 190, top + 476, '#F2B632', '#F8D67E');
    h += J.block(L + 300, top + 400, 220, 40, C.wood, C.woodFront, 14, 8) + J.reg(L + 340, top + 414) + J.mask(L + 420, top + 418, C.gear, C.gear) + J.lamp(L + 410, top + 290, 22) + J.plant(L + 520, top + 512, .55);
    /* the stairs to the Rooms level */
    h += room(L, top + 550, LR - L, 150, 'url(#' + P + '-plank)', { wins: [L + 60] });
    /* wood steps climbing to the right, each a little lighter: the way up to the Rooms level */
    var sx = L + 330, i, steps = ['#B98F68', '#C49A72', '#CFA67D', '#D9B48A', '#E2C29C', '#EACFAE'];
    for (i = 0; i < 6; i++) { h += J.block(sx + i * 32, top + 610 - i * 6, 32, 60 + i * 6, steps[i], C.woodFront, 8, 3); }
    h += J.plant(L + 40, top + 690, .55);
    /* the alley: bikes and a scooter (future rentals) */
    h += r(LR + 10, top - 10, R0 - LR - 20, H - top + 10, '#EBCDB0') + J.bike(LR + 60, top + 120, PC.accent, 0) + J.bike(LR + 100, top + 150, '#F2B632', 8) + J.scooter(LR + 82, top + 330, PC.accent, -4) + J.plant(LR + 50, top + 520, .55) + J.plant(LR + 120, top + 600, .5);
    /* drinks prep + kitchen, facing the beach */
    h += room(R0, top, RR - R0, 210, 'url(#' + P + '-tile)', { wins: [R0 + 300], door: [60, 80] });
    h += J.counter(R0 + 170, top + 120, 330, 46, '#FFFFFF', PC.accent) + J.block(R0 + 30, top + 100, 110, 70, C.glass, C.glassDk, 14, 8) + r(R0 + 40, top + 108, 26, 50, '#FFFFFF', 4, ' opacity=".7"') + J.lamp(R0 + 260, top, 20) + J.lamp(R0 + 420, top, 20) + J.plant(R0 + 500, top + 200, .6);
    h += '<circle cx="' + (R0 + 220) + '" cy="' + (top + 126) + '" r="12" fill="#F2B632"/><circle cx="' + (R0 + 250) + '" cy="' + (top + 128) + '" r="10" fill="#9FD6C2"/>' + r(R0 + 290, top + 104, 22, 30, '#E8895C', 6) + r(R0 + 380, top + 110, 40, 22, C.steel, 6);
    /* retail + regulator rinse */
    h += room(R0, top + 240, RR - R0, 220, 'url(#' + P + '-plank)', { wins: [R0 + 380] });
    h += wetsuitRail(R0 + 40, top + 360, 3) + J.fins(R0 + 230, top + 440, C.gear, PC.accent) + J.fins(R0 + 280, top + 440, '#3B4249', PC.soft);
    h += J.shelf(R0 + 330, top + 340, 160) + J.mask(R0 + 360, top + 334, C.gear) + J.mask(R0 + 430, top + 334, PC.accent) + J.rinseBin(R0 + 360, top + 380, 140, 60, PC.accent) + J.reg(R0 + 400, top + 404) + J.reg(R0 + 450, top + 410);
    /* the tank room at the inland end: racks and the compressor */
    h += room(R0, top + 490, RR - R0, 210, 'url(#' + P + '-tile)', {});
    h += J.tankRack(R0 + 30, top + 680, [PC.tank, PC.tank, PC.tank, 'empty', 'empty']) + J.tankRack(R0 + 210, top + 680, ['empty', 'empty', 'empty', 'empty', 'empty']) + J.compressor(R0 + 380, top + 680, PC.accent);
    /* ---- status bubbles (sample states) ---- */
    /* the boat's fuel: low (amber) */
    h += bubble(930, 110, 50, gauge(930, 128, .36, .7), '#F2B632') + statusPill(930, 184, 'low', 'low');
    /* a tank request with a deadline: loud, pulsing (the one loud thing on screen) */
    h += bubble(R0 + 200, top + 556, 56, J.at(R0 + 200, top + 556, 0, .56, J.tankRack(-56, 40, ['empty', 'empty', 'empty'])), '#D9617E', true) + statusPill(R0 + 200, top + 634, '12 by 1:30', 'alert');
    /* rooms to clean, at the stairs (housekeeping) */
    h += bubble(L + 230, top + 620, 46, J.at(L + 230, top + 628, 0, .55, J.bed(-46, -40, 92, 60, PC.soft)), null) + statusPill(L + 230, top + 684, '3 to clean', 'busy');
    /* ---- targets ---- */
    t.push({ id: 'boat', box: [770, 40, 140, 360], tag: [930, 184] });
    t.push({ id: 'fill-station', box: [R0, top + 490, RR - R0, 210], tag: [R0 + 200, top + 634] });
    t.push({ id: 'rooms', box: [L, top + 550, LR - L, 150], tag: [L + 230, top + 684] });
    t.push({ id: 'front-desk', box: [L + 40, top + 140, 260, 90], tag: [L + 165, top + 250] });
    t.push({ id: 'dive-board', box: [L + 290, top, 140, 100], tag: [L + 360, top + 110] });
    t.push({ id: 'kit-up', box: [100, 370, 330, 170], tag: [265, 560] });
    t.push({ id: 'confined', box: [244, 30, 190, 180], tag: [345, 214] });
    return { svg: h, W: W, H: H, targets: t, note: 'Stand-in: Paradise is a stand-in shop until the real Paradise confirms it. The hostel rooms are their own level, reached by the stairs. Bubbles show sample states: fuel low, a tank request due 1:30 (the one loud thing), rooms to clean.' };
  };
})(window);
