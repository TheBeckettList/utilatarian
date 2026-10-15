/* The world kit: everything OUTSIDE a building, in Josie's universe (needs art/josie.js first).
   Sea, shore, cliffs, reefs, piers, boats, aircraft, the globe, cabins, lights, flags, and the small "simplified selves" of real
   places for island overviews. One grammar for all of it, so a new place or app only adds what is truly its own:

     every object  = a TOP shape over its FRONT face (J.block), one plum shadow down-right (J.shadow);
     every vessel  = J.hull: white rim, the owner's accent stripe, a white-wood or plank deck; engines and dark gear in C.gear;
     every light   = J.bulb: a warm bulb with a soft halo (lamps, string lights, helipad, lighthouse, lanterns);
     every water   = C.water with C.deep bands and cream foam dashes; shores are foam, wet sand, sand.

   Colors: shared ones come from J.C. A place passes its own in `c`:
     { accent, deep, soft, pale, tank, tank2, wallTop, shutter, wainscot, ... } (the same object Paradise and Tripwrights use).
   Patterns (url(#p-white) etc.) come from J.defs(p, c), which the scene must include once.
   Vehicles and props are drawn around (0,0); place them with J.at(x, y, rot, scale, markup). Plain ES5. */
(function (w) {
  'use strict';
  var J = w.UJ, C = J.C, r = J.r, e = J.e;
  C.flag = '#D9614A'; C.wetSand = '#F1D2B2'; C.chalk = '#FBF6EE'; C.chalkFront = '#E6DDD0'; C.grass = '#9CC48A'; C.grassDk = '#7FAF6E';
  C.reef = '#8FD9CF'; C.reefPale = '#B9E7E3'; C.reefDot = '#5FBFB3';

  function f(n) { return (+n).toFixed(1); }
  function rnd(seed) { var k = seed * 9301 + 49297; return function () { k = (k * 9301 + 49297) % 233280; return k / 233280; }; }

  J.at = function (x, y, rot, s, m) { return '<g transform="translate(' + f(x) + ',' + f(y) + ')' + (rot ? ' rotate(' + rot + ')' : '') + (s && s !== 1 ? ' scale(' + s + ')' : '') + '">' + m + '</g>'; };
  /* a soft organic outline (islands, reefs, bays), the same every time for a seed */
  J.blob = function (cx, cy, rx, ry, seed, irr) {
    var n = 11, pts = [], i, a, k, q, c, R = rnd(seed), ir = irr || .22, d;
    for (i = 0; i < n; i++) { k = 1 - ir + R() * ir * 2; a = i / n * Math.PI * 2; pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); }
    d = 'M' + f((pts[0][0] + pts[n - 1][0]) / 2) + ',' + f((pts[0][1] + pts[n - 1][1]) / 2);
    for (i = 0; i < n; i++) { q = pts[(i + 1) % n]; c = pts[i]; d += ' Q' + f(c[0]) + ',' + f(c[1]) + ' ' + f((c[0] + q[0]) / 2) + ',' + f((c[1] + q[1]) / 2); }
    return d + ' Z';
  };

  /* ---- light ---- */
  J.bulb = function (cx, cy, rad, col) { rad = rad || 7; return '<circle cx="' + f(cx) + '" cy="' + f(cy) + '" r="' + f(rad * 1.9) + '" fill="' + (col || C.bulb) + '" opacity=".33"/><circle cx="' + f(cx) + '" cy="' + f(cy) + '" r="' + f(rad) + '" fill="' + (col || C.bulb) + '"/>'; };
  /* string lights: a plum cord sagging between two points, bulbs along it */
  J.lights = function (x1, y1, x2, y2, n, sag) {
    var mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + (sag || 18), h = '<path d="M' + x1 + ',' + y1 + ' Q' + mx + ',' + (my + (sag || 18)) + ' ' + x2 + ',' + y2 + '" stroke="' + C.plum + '" stroke-width="2.4" fill="none" opacity=".7"/>', i, t, x, y;
    for (i = 1; i < n; i++) { t = i / n; x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2; y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * (my + (sag || 18)) + t * t * y2; h += J.bulb(x, y + 5, 4.5); }
    return h;
  };
  /* lantern, front-on: plum cap and base, warm glass */
  J.lantern = function (cx, by, s) { s = s || 1; return J.shadow(cx + 3, by + 3, 14 * s, 3 * s) + J.bulb(cx, by - 20 * s, 9 * s) + r(cx - 11 * s, by - 6 * s, 22 * s, 6 * s, C.plum, 2) + r(cx - 9 * s, by - 32 * s, 18 * s, 26 * s, C.bulb, 5, ' opacity=".9"') + r(cx - 11 * s, by - 38 * s, 22 * s, 7 * s, C.plum, 3) + r(cx - 4 * s, by - 46 * s, 8 * s, 8 * s, C.plum, 4); };

  /* ---- water and land ---- */
  J.dash = function (x, y, len) { return r(x, y, len, 5, '#FFF1C9', 2.5, ' opacity=".7"'); };
  /* sea: water, a deeper band (or two), foam dashes; deterministic */
  J.sea = function (x, y, wd, ht, seed) {
    var h = r(x, y, wd, ht, C.water) + r(x, y, wd, ht * .38, C.deep, 0, ' opacity=".5"') + r(x, y + ht * .38, wd, ht * .16, C.deep, 0, ' opacity=".22"'), R = rnd(seed || 3), i;
    for (i = 0; i < Math.round(wd * ht / 90000); i++) { h += J.dash(x + R() * (wd - 100), y + R() * (ht - 10), 50 + R() * 60); }
    return h;
  };
  /* an island or shore from an outline path: foam, wet sand, dry sand (Josie's three bands) */
  J.land = function (cx, cy, rx, ry, seed, irr) {
    return '<path d="' + J.blob(cx, cy, rx + 22, ry + 20, seed, irr) + '" fill="' + C.foam + '"/><path d="' + J.blob(cx, cy, rx + 10, ry + 9, seed, irr) + '" fill="' + C.wetSand + '"/><path d="' + J.blob(cx, cy, rx, ry, seed, irr) + '" fill="' + C.sand + '"/>';
  };
  /* a reef patch: pale shallows, turquoise ring, coral specks */
  J.reef = function (cx, cy, rx, ry, seed) {
    var h = '<path d="' + J.blob(cx, cy, rx * 1.18, ry * 1.18, seed, .2) + '" fill="' + C.reefPale + '" opacity=".7"/><path d="' + J.blob(cx, cy, rx, ry, seed + 1, .26) + '" fill="' + C.reef + '" opacity=".85"/><path d="' + J.blob(cx, cy, rx * .6, ry * .6, seed + 2, .3) + '" fill="#C9EEDF" opacity=".9"/>', R = rnd(seed * 7), i, a, d;
    for (i = 0; i < 7; i++) { a = R() * 6.283; d = R() * .8; h += '<circle cx="' + f(cx + Math.cos(a) * rx * d) + '" cy="' + f(cy + Math.sin(a) * ry * d) + '" r="' + f(6 + R() * 8) + '" fill="' + C.reefDot + '" opacity=".45"/>'; }
    return h;
  };
  /* a cliff from above: grass top over a chalk front face (the Josie ledge, big) */
  J.cliff = function (d, frontH) { return '<path d="' + d + '" fill="' + C.chalkFront + '" transform="translate(0,' + (frontH || 34) + ')"/><path d="' + d + '" fill="' + C.chalk + '" transform="translate(0,' + ((frontH || 34) * .45) + ')"/><path d="' + d + '" fill="' + C.grass + '"/>'; };
  /* under the water: a whale's shadow and a jellyfish (Tripwrights' little wonders; quiet, low contrast) */
  J.whale = function (s) { s = s || 1; return '<g opacity=".28" fill="' + C.deep + '"><ellipse rx="' + 120 * s + '" ry="' + 38 * s + '"/><path d="M' + 110 * s + ',0 L' + 170 * s + ',-' + 30 * s + ' Q' + 160 * s + ',0 ' + 170 * s + ',' + 30 * s + 'Z"/><ellipse cx="' + -20 * s + '" cy="' + 40 * s + '" rx="' + 40 * s + '" ry="' + 10 * s + '" transform="rotate(20)"/></g>'; };
  J.jelly = function (s, col) { s = s || 1; col = col || '#F5B5C8'; return '<g opacity=".75"><path d="M' + -14 * s + ',0 Q' + -14 * s + ',' + -16 * s + ' 0,' + -16 * s + ' Q' + 14 * s + ',' + -16 * s + ' ' + 14 * s + ',0Z" fill="' + col + '"/>' + r(-14 * s, -2 * s, 28 * s, 4 * s, '#FFFFFF', 2, ' opacity=".5"') + '<path d="M' + -8 * s + ',2 q-3,8 0,16 M0,2 q3,9 0,18 M' + 8 * s + ',2 q3,8 0,16" stroke="' + col + '" stroke-width="2" fill="none" stroke-linecap="round"/></g>'; };

  /* ---- piers and moorings ---- */
  /* white-wood pier with wood posts down both sides (Paradise's dock; any pier on the island) */
  J.pier = function (p, x, y, wd, ht, vertical) {
    var h = vertical ? r(x + 6, y, wd, ht, '#9FB4C2', 6) + r(x, y, wd, ht, 'url(#' + p + '-whiteV)', 6) : r(x, y + 6, wd, ht, '#9FB4C2', 6) + r(x, y, wd, ht, 'url(#' + p + '-white)', 6), i;
    if (vertical) { for (i = y + 30; i < y + ht - 10; i += 120) { h += J.woodPost(x - 2, i) + J.woodPost(x + wd + 2, i); } }
    else { for (i = x + 30; i < x + wd - 10; i += 120) { h += J.woodPost(i, y - 2) + J.woodPost(i, y + ht + 2); } }
    return h;
  };
  J.lifeRing = function (cx, cy, s) { s = s || 1; var h = '<circle cx="' + cx + '" cy="' + (cy + 3) + '" r="' + 13 * s + '" fill="' + C.postEdge + '"/><circle cx="' + cx + '" cy="' + cy + '" r="' + 13 * s + '" fill="#FFFFFF"/>', i; for (i = 0; i < 4; i++) { h += '<path d="M' + cx + ',' + cy + ' m0,-' + 13 * s + ' a' + 13 * s + ',' + 13 * s + ' 0 0 1 ' + 9.2 * s + ',' + 3.8 * s + ' L' + cx + ',' + cy + 'Z" fill="' + C.flag + '" transform="rotate(' + (i * 90) + ' ' + cx + ' ' + cy + ')"/>'; } return h + '<circle cx="' + cx + '" cy="' + cy + '" r="' + 7 * s + '" fill="' + C.water + '"/>'; };
  /* the dive flag (red with the white diagonal) */
  J.diveFlag = function (x, y, rot) { return '<g transform="translate(' + x + ',' + y + ') rotate(' + (rot || 0) + ')">' + r(0, 0, 34, 24, C.flag, 3) + '<path d="M0,0 L34,24 L34,14 L14,0Z" fill="#FFFFFF"/></g>'; };
  /* a pennant on a pole, front-on (open plots, area markers) */
  J.pennant = function (cx, by, col) { return J.shadow(cx + 4, by + 2, 14, 3) + r(cx - 2, by - 56, 4, 56, C.woodDark, 2) + '<path d="M' + (cx + 2) + ',' + (by - 56) + ' h34 l-9,11 9,11 h-34z" fill="' + col + '"/>'; };
  /* an empty plot waiting for the next shop: a ring of bulbs and a pennant */
  J.plot = function (cx, cy, col) { var h = '', i, a; for (i = 0; i < 12; i++) { a = i / 12 * 6.283; h += '<circle cx="' + f(cx + Math.cos(a) * 46) + '" cy="' + f(cy + Math.sin(a) * 34) + '" r="4" fill="' + col + '" opacity=".75"/>'; } return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="46" ry="34" fill="#FFFFFF" opacity=".35"/>' + h + J.pennant(cx, cy + 6, col); };

  /* ---- vessels: one hull, many boats ---- */
  function hullPath(wd, ln) { return 'M0,' + -ln + ' C' + f(wd * .79) + ',' + f(-ln * .75) + ' ' + wd + ',' + f(-ln * .27) + ' ' + wd + ',' + f(ln * .37) + ' L' + wd + ',' + f(ln * .85) + ' Q' + wd + ',' + ln + ' ' + f(wd * .62) + ',' + ln + ' H' + f(-wd * .62) + ' Q' + -wd + ',' + ln + ' ' + -wd + ',' + f(ln * .85) + ' L' + -wd + ',' + f(ln * .37) + ' C' + -wd + ',' + f(-ln * .27) + ' ' + f(-wd * .79) + ',' + f(-ln * .75) + ' 0,' + -ln + 'Z'; }
  /* white rim, the owner's stripe, the deck; a soft shadow under it all */
  J.hull = function (p, wd, ln, c, deck) {
    var d = hullPath(wd, ln);
    return J.shadow(10, 14, wd * 1.24, ln, .16) + '<path d="' + d + '" fill="#FFFFFF"/><path d="' + d + '" fill="' + c.accent + '" transform="scale(.93,.96)"/><path d="' + d + '" fill="' + (deck || 'url(#' + p + '-white)') + '" transform="scale(.84,.9)"/>';
  };
  function engines(y, n, wd) { var h = '', xs = n === 1 ? [0] : [-wd / 4, wd / 4]; xs.forEach(function (x) { h += r(x - 11, y, 22, 24, C.gear, 6) + r(x - 7, y + 4, 14, 6, C.gearHi, 3); }); return h; }
  function cabin(y, wd, ht) { return r(-wd / 2, y + 6, wd, ht, C.postEdge, 10) + r(-wd / 2, y, wd, ht, '#FFFFFF', 10) + r(-wd / 2 + 6, y + 6, wd - 12, ht * .55, C.glassDk, 6) + '<path d="M' + (-wd / 2 + 12) + ',' + (y + ht * .5) + ' l10,-10" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>'; }
  /* boats, bow up, around (0,0), ~300 long. kind: 'dive' | 'catamaran' | 'panga' | 'longtail'. o.rows: tank rows (dive) */
  J.boat = function (p, kind, c, o) {
    o = o || {}; var h = '', i, rows;
    if (kind === 'catamaran') {
      h += J.shadow(12, 16, 112, 150, .16);
      [-62, 62].forEach(function (x) { var d = hullPath(26, 150); h += '<g transform="translate(' + x + ',0)"><path d="' + d + '" fill="#FFFFFF"/><path d="' + d + '" fill="' + c.accent + '" transform="scale(.82,.95)"/><path d="' + d + '" fill="url(#' + p + '-whiteV)" transform="scale(.6,.88)"/></g>'; });
      h += r(-50, -100, 100, 110, c.soft, 6, ' opacity=".8"'); for (i = -90; i < 10; i += 16) { h += r(-50, i, 100, 2, '#FFFFFF', 0, ' opacity=".8"'); } for (i = -40; i < 50; i += 16) { h += r(i, -100, 2, 110, '#FFFFFF', 0, ' opacity=".8"'); }
      h += r(-60, 10, 120, 100, 'url(#' + p + '-white)', 10) + cabin(26, 90, 50) + r(-4, -116, 8, 230, C.woodDark, 3) + r(-14, -36, 28, 150, '#FFFFFF', 12) + r(-12, -30, 24, 6, c.accent, 3) + '<circle cx="0" cy="-36" r="9" fill="' + C.gear + '"/>' + engines(124, 2, 120);
      return h;
    }
    if (kind === 'panga') {
      h += J.hull(p, 40, 160, c, 'url(#' + p + '-plankV)');
      for (i = 0; i < 3; i++) { h += J.block(-30, -70 + i * 60, 60, 12, C.wood, C.woodFront, 6, 3); }
      h += J.block(-26, 100, 52, 24, '#FFFFFF', c.soft, 10, 6) + r(-26, 100, 52, 8, c.accent, 4) + '<path d="M-20,-100 L-32,-150 M20,-100 L32,-150" stroke="' + C.gear + '" stroke-width="2.4" stroke-linecap="round"/>' + r(-14, 150, 28, 30, C.gear, 7) + r(-4, 176, 8, 14, C.gearLt, 3);
      return h;
    }
    if (kind === 'longtail') {
      var d = hullPath(36, 170);
      h += J.shadow(10, 14, 46, 170, .16) + '<path d="' + d + '" fill="' + C.woodDark + '"/><path d="' + d + '" fill="' + c.accent + '" transform="scale(.9,.97)"/><path d="' + d + '" fill="url(#' + p + '-plankV)" transform="scale(.8,.92)"/>';
      [c.accent, c.pop || C.flag, c.soft, '#FFFFFF'].forEach(function (col, k) { h += '<path d="M0,-160 q' + (8 + k * 5) + ',30 ' + (-6 + k * 6) + ',62" stroke="' + col + '" stroke-width="5" fill="none" stroke-linecap="round"/>'; });
      h += J.umbrella(0, 10, 44, c.accent, '#FFFFFF') + J.block(-22, -80, 44, 16, C.wood, C.woodFront, 6, 4) + J.block(-22, 80, 44, 16, C.wood, C.woodFront, 6, 4) + r(-12, 150, 24, 28, C.gear, 7) + r(-3, 176, 6, 64, C.gearLt, 3) + e(0, 246, 10, 4, C.gearHi);
      return h;
    }
    /* dive boat (Paradise's): tank rows down both sides, fuel at the bow, wheelhouse, twin engines, dive flag */
    rows = o.rows === undefined ? 6 : o.rows;
    h += J.hull(p, 58, 150, c);
    for (i = 0; i < rows; i++) { h += '<circle cx="-34" cy="' + (-46 + i * 26) + '" r="10" fill="' + (i % 2 ? c.tank2 : c.tank) + '"/><circle cx="-34" cy="' + (-46 + i * 26) + '" r="3.5" fill="' + C.gear + '"/><circle cx="34" cy="' + (-46 + i * 26) + '" r="10" fill="' + (i % 2 ? c.tank : c.tank2) + '"/><circle cx="34" cy="' + (-46 + i * 26) + '" r="3.5" fill="' + C.gear + '"/>'; }
    h += r(-14, -40, 28, 150, c.soft, 8) + r(-24, -100, 48, 34, '#FFFFFF', 10) + r(-18, -94, 36, 18, C.glassDk, 6) + r(-14, -128, 28, 20, C.flag, 5) + r(-10, -124, 20, 5, '#FFFFFF', 2, ' opacity=".6"') +
      r(-30, 132, 22, 24, C.gear, 6) + r(8, 132, 22, 24, C.gear, 6) + J.diveFlag(16, 96, -6);
    return h;
  };

  /* ---- aircraft (from above) ---- */
  /* bubble helicopter: glass bubble nose, the owner's body color, skids, a tail boom, two-blade rotor (class "spin" on the rotor) */
  J.heli = function (c) {
    return J.shadow(14, 20, 70, 60, .16) + r(-46, -40, 8, 96, C.gear, 4) + r(38, -40, 8, 96, C.gear, 4) + r(-50, -30, 100, 6, C.gearLt, 3) + r(-50, 30, 100, 6, C.gearLt, 3) +
      r(-7, 20, 14, 120, c.accent, 6) + r(-24, 128, 48, 10, c.deep || c.accent, 5) + r(14, 116, 6, 34, C.gear, 3) +
      e(0, 8, 40, 46, c.accent) + e(0, 2, 34, 38, c.soft) + e(0, -12, 34, 32, C.glassDk) + e(-10, -22, 9, 14, '#FFFFFF', ' opacity=".7"') + e(0, 18, 18, 10, '#FFFFFF', ' opacity=".5"') +
      '<g class="spin">' + r(-130, -5, 260, 10, C.gear, 5, ' opacity=".7"') + r(-5, -130, 10, 260, C.gear, 5, ' opacity=".7"') + '</g><circle r="10" fill="' + C.gearLt + '"/><circle r="4" fill="' + C.steelLt + '"/>';
  };
  /* float plane: white wings with the owner's tips, slim body, two floats with their front faces, a propeller */
  J.floatplane = function (c) {
    var h = J.shadow(14, 22, 150, 50, .14);
    h += J.block(-58, -40, 20, 150, '#FFFFFF', c.soft, 8, 10) + J.block(38, -40, 20, 150, '#FFFFFF', c.soft, 8, 10);
    h += r(-12, -100, 24, 210, '#FFFFFF', 12) + r(-8, -92, 16, 30, C.glassDk, 6) + r(-170, -50, 340, 34, '#FFFFFF', 12) + r(-170, -50, 34, 34, c.accent, 12) + r(136, -50, 34, 34, c.accent, 12) + r(-170, -40, 340, 6, c.soft, 3);
    h += r(-56, 92, 112, 18, '#FFFFFF', 8) + r(-56, 92, 20, 18, c.accent, 8) + r(36, 92, 20, 18, c.accent, 8) + r(-4, 80, 8, 30, c.accent, 4);
    return h + '<g class="spin">' + r(-40, -112, 80, 7, C.gear, 3.5) + '</g><circle cy="-108" r="7" fill="' + C.gearLt + '"/>';
  };
  /* helipad: a soft disc, a ring of bulbs, the H drawn as three bars (no text in the art) */
  J.helipad = function (cx, cy, rad, c) {
    var h = '<circle cx="' + cx + '" cy="' + (cy + 8) + '" r="' + rad + '" fill="' + C.steel + '"/><circle cx="' + cx + '" cy="' + cy + '" r="' + rad + '" fill="' + c.soft + '"/><circle cx="' + cx + '" cy="' + cy + '" r="' + (rad - 16) + '" fill="#FFFFFF" opacity=".6"/>', i, a;
    h += r(cx - 34, cy - 44, 16, 88, c.accent, 5, ' opacity=".3"') + r(cx + 18, cy - 44, 16, 88, c.accent, 5, ' opacity=".3"') + r(cx - 18, cy - 8, 36, 16, c.accent, 5, ' opacity=".3"');
    for (i = 0; i < 16; i++) { a = i / 16 * 6.283; h += J.bulb(cx + Math.cos(a) * (rad - 8), cy + Math.sin(a) * (rad - 8), 3.5); }
    return h;
  };


  /* ---- home comforts (front-on, like Josie's small things) ---- */
  /* a round rug from above: the owner's color, a brass dashed border */
  J.rug = function (cx, cy, rx, ry, c) { return e(cx, cy + 5, rx, ry, c.deep || c.accent) + e(cx, cy, rx, ry, c.accent) + e(cx, cy, rx - 12, ry - 10, c.soft, ' opacity=".35"') + '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + (rx - 20) + '" ry="' + (ry - 16) + '" fill="none" stroke="' + (c.pop || '#C9953F') + '" stroke-width="4" stroke-dasharray="2 10" stroke-linecap="round"/>'; };
  /* armchair, front-on: back, two arms, a cushion, wood feet */
  J.armchair = function (cx, by, col, colLt) { return J.shadow(cx + 4, by + 2, 44, 6) + r(cx - 36, by - 12, 6, 12, C.woodDark, 2) + r(cx + 30, by - 12, 6, 12, C.woodDark, 2) + r(cx - 34, by - 78, 68, 60, col, 18) + r(cx - 44, by - 50, 20, 42, col, 9) + r(cx + 24, by - 50, 20, 42, col, 9) + r(cx - 44, by - 52, 20, 8, colLt, 4, ' opacity=".6"') + r(cx + 24, by - 52, 20, 8, colLt, 4, ' opacity=".6"') + r(cx - 26, by - 38, 52, 20, colLt, 8) + r(cx - 22, by - 70, 44, 22, colLt, 9, ' opacity=".5"'); };
  /* bookshelf, front-on: wood frame, three shelves of books in island colors, a plant on top */
  J.bookshelf = function (x, by, wd, ht) {
    var h = J.shadow(x + wd / 2, by + 3, wd * .5, 6) + r(x, by - ht, wd, ht, C.woodFront, 6) + r(x + 6, by - ht + 6, wd - 12, ht - 12, C.woodDarker, 3), i, j, bx, cols = [C.flag, C.water, C.leafLt, C.bulb, '#F5B5C8', C.deep, C.plum, '#FFFFFF'], k = 0, sh = (ht - 12) / 3;
    for (i = 0; i < 3; i++) { bx = x + 10; for (j = 0; bx < x + wd - 18; j++) { var bw = 8 + (k * 7) % 9, bh = sh - 10 - (k * 5) % 9; h += r(bx, by - ht + 6 + sh * (i + 1) - bh - 4, bw, bh, cols[k % cols.length], 2); bx += bw + 2; k++; } h += r(x + 6, by - ht + 6 + sh * (i + 1) - 4, wd - 12, 5, C.wood); }
    return h + J.plant(x + wd - 22, by - ht + 2, .45);
  };
  /* hearth, front-on: a round stone arch, logs, a fire that glows */
  J.hearth = function (cx, by) { return J.shadow(cx, by + 3, 70, 7) + r(cx - 66, by - 110, 132, 110, C.rockLt, 26) + r(cx - 74, by - 118, 148, 16, C.rock, 8) + r(cx - 42, by - 76, 84, 76, C.plum, 40) + '<circle cx="' + cx + '" cy="' + (by - 26) + '" r="44" fill="' + C.bulb + '" opacity=".22"/>' + '<path d="M' + (cx - 22) + ',' + (by - 12) + ' Q' + (cx - 26) + ',' + (by - 44) + ' ' + (cx - 6) + ',' + (by - 62) + ' Q' + (cx - 4) + ',' + (by - 40) + ' ' + (cx + 6) + ',' + (by - 48) + ' Q' + (cx + 28) + ',' + (by - 34) + ' ' + (cx + 20) + ',' + (by - 12) + 'Z" fill="' + C.flag + '"/><path d="M' + (cx - 10) + ',' + (by - 12) + ' Q' + (cx - 10) + ',' + (by - 32) + ' ' + cx + ',' + (by - 40) + ' Q' + (cx + 14) + ',' + (by - 26) + ' ' + (cx + 10) + ',' + (by - 12) + 'Z" fill="' + C.bulb + '"/>' + r(cx - 34, by - 14, 68, 10, C.woodDark, 5) + r(cx - 28, by - 8, 56, 8, C.woodFront, 4); };
  /* surfboard leaning on a wall, front-on */
  J.surfboard = function (cx, by, col, rot) { return J.shadow(cx + 6, by + 2, 20, 4) + '<g transform="rotate(' + (rot || 8) + ' ' + cx + ' ' + by + ')"><ellipse cx="' + cx + '" cy="' + (by - 80) + '" rx="18" ry="80" fill="' + col + '"/><rect x="' + (cx - 2) + '" y="' + (by - 154) + '" width="4" height="148" rx="2" fill="#FFFFFF" opacity=".8"/></g>'; };
  /* brass telescope on a tripod, front-on, looking out to sea */
  J.telescope = function (cx, by, brass) { return J.shadow(cx, by + 2, 26, 4) + '<path d="M' + cx + ',' + (by - 44) + ' L' + (cx - 22) + ',' + by + ' M' + cx + ',' + (by - 44) + ' L' + (cx + 22) + ',' + by + ' M' + cx + ',' + (by - 44) + ' L' + cx + ',' + by + '" stroke="' + C.woodDark + '" stroke-width="5" stroke-linecap="round"/><g transform="rotate(-24 ' + cx + ' ' + (by - 50) + ')">' + r(cx - 36, by - 60, 72, 18, brass || '#C9953F', 9) + r(cx + 28, by - 63, 14, 24, brass || '#C9953F', 5) + r(cx + 36, by - 59, 6, 16, C.glassDk, 3) + r(cx - 30, by - 56, 40, 4, '#FFFFFF', 2, ' opacity=".4"') + '</g>'; };
  /* a ginger cat asleep on the rug, from above */
  J.cat = function (cx, cy, col) { col = col || '#E8A35A'; return J.shadow(cx + 4, cy + 10, 30, 8, .12) + e(cx, cy, 30, 20, col) + '<path d="M' + (cx + 24) + ',' + (cy + 6) + ' Q' + (cx + 34) + ',' + (cy + 26) + ' ' + (cx + 4) + ',' + (cy + 22) + '" stroke="' + col + '" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="' + (cx - 24) + '" cy="' + (cy - 6) + '" r="14" fill="' + col + '"/><path d="M' + (cx - 34) + ',' + (cy - 14) + ' l-2,-12 l10,6z M' + (cx - 20) + ',' + (cy - 18) + ' l4,-12 l6,10z" fill="' + col + '"/>' + r(cx - 10, cy - 12, 20, 4, '#FFFFFF', 2, ' opacity=".35"') + '<path d="M' + (cx - 30) + ',' + (cy - 6) + ' q3,2 6,0 M' + (cx - 22) + ',' + (cy - 6) + ' q3,2 6,0" stroke="' + C.plum + '" stroke-width="1.8" fill="none" stroke-linecap="round"/>'; };
  /* beach life */
  J.crab = function (cx, cy) { return J.shadow(cx + 2, cy + 8, 14, 4, .12) + '<path d="M' + (cx - 12) + ',' + cy + ' l-10,6 M' + (cx - 12) + ',' + (cy + 4) + ' l-8,9 M' + (cx + 12) + ',' + cy + ' l10,6 M' + (cx + 12) + ',' + (cy + 4) + ' l8,9" stroke="' + C.flag + '" stroke-width="3" stroke-linecap="round"/>' + e(cx, cy, 14, 10, C.flag) + '<circle cx="' + (cx - 16) + '" cy="' + (cy - 8) + '" r="5" fill="' + C.flag + '"/><circle cx="' + (cx + 16) + '" cy="' + (cy - 8) + '" r="5" fill="' + C.flag + '"/><circle cx="' + (cx - 5) + '" cy="' + (cy - 9) + '" r="3" fill="#FFFFFF"/><circle cx="' + (cx + 5) + '" cy="' + (cy - 9) + '" r="3" fill="#FFFFFF"/><circle cx="' + (cx - 5) + '" cy="' + (cy - 9) + '" r="1.4" fill="' + C.plum + '"/><circle cx="' + (cx + 5) + '" cy="' + (cy - 9) + '" r="1.4" fill="' + C.plum + '"/>'; };
  J.turtle = function (cx, cy, s, rot) { s = s || 1; return '<g transform="translate(' + cx + ',' + cy + ') rotate(' + (rot || 0) + ') scale(' + s + ')" opacity=".85"><ellipse cx="-22" cy="-14" rx="12" ry="6" fill="' + C.leafLt + '" transform="rotate(-30 -22 -14)"/><ellipse cx="22" cy="-14" rx="12" ry="6" fill="' + C.leafLt + '" transform="rotate(30 22 -14)"/><ellipse cx="-16" cy="18" rx="8" ry="5" fill="' + C.leafLt + '"/><ellipse cx="16" cy="18" rx="8" ry="5" fill="' + C.leafLt + '"/><circle cy="-30" r="9" fill="' + C.leafLt + '"/><ellipse rx="22" ry="27" fill="' + C.leafDk + '"/><ellipse rx="15" ry="19" fill="' + C.leafMid + '"/><circle r="5" fill="' + C.leaf + '"/></g>'; };
  J.pelican = function (cx, by) { return J.shadow(cx + 2, by + 2, 16, 3) + '<path d="M' + (cx - 4) + ',' + (by - 2) + ' v-12 M' + (cx + 4) + ',' + (by - 2) + ' v-12" stroke="#E8A35A" stroke-width="3" stroke-linecap="round"/>' + e(cx, by - 30, 15, 20, '#FFFFFF') + e(cx + 6, by - 28, 9, 15, '#C9CFD4') + r(cx - 4, by - 66, 8, 22, '#FFFFFF', 4) + '<circle cx="' + cx + '" cy="' + (by - 66) + '" r="9" fill="#FFFFFF"/><path d="M' + (cx - 6) + ',' + (by - 66) + ' L' + (cx - 34) + ',' + (by - 60) + ' Q' + (cx - 20) + ',' + (by - 52) + ' ' + (cx - 6) + ',' + (by - 60) + 'Z" fill="#F2A641"/><circle cx="' + (cx + 2) + '" cy="' + (by - 68) + '" r="2" fill="' + C.plum + '"/>'; };
  J.windsock = function (cx, by) { return J.shadow(cx + 4, by + 2, 12, 3) + r(cx - 2, by - 90, 4, 90, C.steel, 2) + '<path d="M' + (cx + 2) + ',' + (by - 88) + ' L' + (cx + 50) + ',' + (by - 80) + ' L' + (cx + 50) + ',' + (by - 68) + ' L' + (cx + 2) + ',' + (by - 64) + 'Z" fill="' + C.flag + '"/><path d="M' + (cx + 18) + ',' + (by - 85) + ' L' + (cx + 34) + ',' + (by - 82) + ' L' + (cx + 34) + ',' + (by - 67) + ' L' + (cx + 18) + ',' + (by - 66) + 'Z" fill="#FFFFFF"/>'; };
  /* water toys and loungers, from above */
  J.kayak = function (cx, cy, len, col, rot) { return '<g transform="translate(' + cx + ',' + cy + ') rotate(' + (rot || 0) + ')">' + J.shadow(4, 6, 16, len / 2, .14) + '<ellipse rx="15" ry="' + (len / 2) + '" fill="' + col + '"/><ellipse rx="9" ry="' + (len / 2 - 8) + '" fill="#FFFFFF" opacity=".25"/><ellipse cy="4" rx="9" ry="16" fill="' + C.gear + '"/><rect x="-36" y="-2" width="72" height="4" rx="2" fill="' + C.woodDark + '"/><ellipse cx="-36" rx="5" ry="9" fill="' + C.woodDark + '"/><ellipse cx="36" rx="5" ry="9" fill="' + C.woodDark + '"/></g>'; };
  J.lounger = function (x, y, col) { return J.shadow(x + 26, y + 84, 30, 6) + J.block(x, y, 52, 80, '#FFFFFF', C.postEdge, 6, 8) + r(x + 5, y + 18, 42, 58, col, 6) + r(x + 8, y + 5, 36, 14, '#FFFFFF', 5) + r(x + 8, y + 5, 36, 4, col, 2, ' opacity=".3"'); };
  /* a place pin for overview maps: white ring, the place's color, a dot */
  J.pin = function (cx, cy, col) { return J.shadow(cx + 3, cy + 18, 14, 4) + '<path d="M' + cx + ',' + (cy + 18) + ' L' + (cx - 9) + ',' + (cy + 4) + ' L' + (cx + 9) + ',' + (cy + 4) + 'Z" fill="#FFFFFF"/><circle cx="' + cx + '" cy="' + cy + '" r="16" fill="#FFFFFF"/><circle cx="' + cx + '" cy="' + cy + '" r="11" fill="' + col + '"/><circle cx="' + cx + '" cy="' + cy + '" r="4" fill="#FFFFFF"/>'; };

  /* ---- the adventure yacht: one per region, big enough to walk around ----
     Bow up, around (0,0), ~420 wide and ~1060 long including the swim platform. c = the region's colors; kind 'caribbean' | 'seasia'
     changes the rig (a tall white mainsail, or a junk sail with battens and lanterns). Returns { base, parts }: parts are the
     stations a guest can tap (rest, sail, dive, eat, stay, water, fish), each { m: markup, box: [x, y, w, h], tag: [x, y] }. */
  J.yacht = function (p, c, kind) {
    var L = 500, W = 210, d = hullPath(W, L), base = '', P = {}, i, h;
    base += J.shadow(26, 30, W * 1.18, L * 1.02, .18);
    base += r(-150, L - 30, 300, 92, C.woodFront, 16) + r(-150, L - 36, 300, 86, 'url(#' + p + '-plank)', 16);   /* swim platform */
    base += '<path d="' + d + '" fill="#FFFFFF"/><path d="' + d + '" fill="' + c.accent + '" transform="scale(.95,.975)"/><path d="' + d + '" fill="#FFFFFF" transform="scale(.91,.95)"/><path d="' + d + '" fill="url(#' + p + '-plankV)" transform="scale(.87,.93)"/>';
    for (i = -380; i < 470; i += 90) { base += J.woodPost(i < -200 ? (i + 380) * .55 + 50 : 172, i) + J.woodPost(i < -200 ? -(i + 380) * .55 - 50 : -172, i); }
    /* wheelhouse: white top over its front face, a band of glass */
    base += J.block(-120, -150, 240, 90, '#FFFFFF', C.postEdge, 26, 18) + r(-104, -134, 208, 30, C.glassDk, 10) + '<path d="M-90,-110 l14,-18 M-40,-110 l14,-18" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>' + r(-120, -150, 240, 10, c.accent, 6) + J.bulb(-96, -70, 4) + J.bulb(96, -70, 4);
    /* bow: the net and the loungers */
    h = r(-80, -430, 160, 130, c.soft, 14, ' opacity=".85"'); for (i = -414; i < -300; i += 18) { h += r(-80, i, 160, 2, '#FFFFFF', 0, ' opacity=".8"'); } for (i = -64; i < 80; i += 18) { h += r(i, -430, 2, 130, '#FFFFFF', 0, ' opacity=".8"'); }
    h += J.lounger(-130, -300, c.accent) + J.lounger(78, -300, c.soft) + J.plant(0, -296, .5);
    P.rest = { m: h, box: [-170, -450, 340, 190], tag: [0, -246] };
    /* mast and sail */
    if (kind === 'seasia') {
      h = '<path d="M0,-226 L120,-250 L140,-150 L0,-176Z" fill="' + c.accent + '"/>'; for (i = 0; i < 4; i++) { h += '<path d="M0,' + (-220 + i * 13) + ' L' + (124 + i * 4) + ',' + (-238 + i * 22) + '" stroke="' + (c.deep || C.woodDark) + '" stroke-width="3"/>'; }
      h += '<circle cy="-200" r="14" fill="' + C.woodDark + '"/>' + J.lantern(-60, -184, .7) + J.lantern(-110, -196, .6);
    } else {
      h = '<path d="M0,-210 Q60,-120 26,-20 Q10,-110 0,-210Z" fill="#FFFFFF"/><path d="M0,-210 Q60,-120 26,-20" stroke="' + c.accent + '" stroke-width="4" fill="none"/>' + r(-4, -210, 8, 190, C.woodDark, 4) + '<circle cy="-212" r="14" fill="' + C.gear + '"/>' + '<path d="M-14,-224 L-60,-380 M14,-224 L60,-380" stroke="' + C.steel + '" stroke-width="2.4"/>';
    }
    P.sail = { m: h, box: [-150, -270, 300, 130], tag: [kind === 'seasia' ? 90 : -90, -168] };
    /* dive deck: tanks down both rails, the bench, BCDs, the flag */
    h = J.block(-26, -30, 52, 190, C.wood, C.woodFront, 10, 8);
    for (i = 0; i < 6; i++) { [-150, -116, 116, 150].forEach(function (x, k) { h += '<circle cx="' + x + '" cy="' + (-20 + i * 32) + '" r="13" fill="' + ((i + k) % 3 ? (c.tank || c.accent) : (c.tank2 || '#F2F2EE')) + '"/><circle cx="' + x + '" cy="' + (-20 + i * 32) + '" r="4.5" fill="' + C.gear + '"/>'; }); }
    h += J.bcd(-62, 0, C.gear) + J.bcd(62, 60, C.gear) + J.fins(-62, 150, C.gear, c.accent) + J.mask(62, 140) + r(-6, -60, 4, 40, C.steel, 2) + J.diveFlag(-2, -60, 0);
    P.dive = { m: h, box: [-175, -50, 350, 225], tag: [0, 170] };
    /* galley table under an umbrella */
    h = J.table(-150, 200, 190, 56, { noPot: true }) + J.chair(-130, 280, c.soft, '#FFFFFF') + J.chair(-60, 280, c.accent, c.soft) + J.chair(4, 280, c.soft, '#FFFFFF') + J.pot(-55, 222) + J.umbrella(110, 236, 52, c.accent, '#FFFFFF');
    P.eat = { m: h, box: [-175, 190, 350, 130], tag: [-40, 196] };
    /* cabins, cut away: two berths and a porthole */
    h = r(-176, 334, 352, 104, 'url(#' + p + '-white)', 10) + r(-176, 334, 352, 8, c.accent, 4) + J.bed(-160, 352, 110, 64, c.accent) + J.bed(-34, 352, 110, 64, c.soft) + '<circle cx="128" cy="384" r="20" fill="' + C.glassDk + '"/><circle cx="128" cy="384" r="20" fill="none" stroke="' + C.steel + '" stroke-width="5"/>';
    P.stay = { m: h, box: [-180, 326, 360, 120], tag: [0, 440] };
    /* swim platform: kayaks, a paddleboard, snorkel masks */
    h = J.kayak(-60, 520, 150, c.accent, 90) + J.kayak(60, 548, 130, c.pop || C.bulb, 90) + J.mask(110, 506, C.gear) + J.mask(-128, 540, c.accent);
    P.water = { m: h, box: [-150, 470, 300, 110], tag: [0, 612] };
    /* fishing: rods in the holders at the stern corners, a cooler */
    h = '<path d="M-150,456 L-230,330 M-136,462 L-200,320" stroke="' + C.gear + '" stroke-width="3.5" stroke-linecap="round"/><path d="M-230,330 q-30,60 -4,120 M-200,320 q-24,70 -2,130" stroke="#FFFFFF" stroke-width="1.6" fill="none" opacity=".8"/>' + J.block(-150, 444, 56, 26, '#FFFFFF', c.soft, 12, 6) + r(-150, 444, 56, 9, c.accent, 4);
    P.fish = { m: h, box: [-250, 300, 120, 190], tag: [-210, 300] };
    return { base: base, parts: P };
  };
  J.hullPath = hullPath;

  /* ---- landmarks and props (front-on, like Josie's small things) ---- */
  /* the globe on a wood stand: sea, two leaf continents, a brass meridian, a white glint */
  J.globe = function (cx, by, rad, c) {
    var cy = by - rad - 30;
    return J.shadow(cx + 6, by + 4, rad * .8, 9) + J.block(cx - rad * .55, by - 26, rad * 1.1, 14, C.wood, C.woodFront, 12, 6) + r(cx - 5, cy + rad - 6, 10, 26, C.woodDark, 3) +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + rad + '" fill="' + C.water + '"/><path d="M' + (cx - rad) + ',' + cy + ' A' + rad + ',' + rad + ' 0 0 0 ' + (cx + rad) + ',' + cy + 'Z" fill="' + C.deep + '" opacity=".35"/>' +
      '<path d="' + J.blob(cx - rad * .3, cy - rad * .25, rad * .32, rad * .26, 4, .3) + '" fill="' + C.leafLt + '"/><path d="' + J.blob(cx + rad * .32, cy + rad * .22, rad * .26, rad * .34, 8, .3) + '" fill="' + C.leaf + '"/><path d="' + J.blob(cx + rad * .1, cy - rad * .6, rad * .18, rad * .09, 2, .3) + '" fill="#FFFFFF" opacity=".85"/>' +
      e(cx - rad * .45, cy - rad * .45, rad * .16, rad * .1, '#FFFFFF', ' opacity=".55" transform="rotate(-35 ' + f(cx - rad * .45) + ' ' + f(cy - rad * .45) + ')"') +
      '<path d="M' + f(cx - rad - 12) + ',' + f(cy + 14) + ' A' + (rad + 12) + ',' + (rad + 12) + ' 0 1 1 ' + f(cx + rad + 12) + ',' + f(cy + 14) + '" stroke="' + (c.pop || '#C9953F') + '" stroke-width="9" fill="none" stroke-linecap="round"/>' + '<circle cx="' + cx + '" cy="' + f(cy - rad - 12) + '" r="7" fill="' + (c.pop || '#C9953F') + '"/>';
  };
  /* a container cabin: ribbed top, front face with a door and a window, a lamp over the door */
  J.container = function (x, y, wd, ht, col, colDk) {
    var h = J.shadow(x + wd / 2 + 6, y + ht + 30, wd * .5, 7) + J.block(x, y, wd, ht, col, colDk, 30, 6), i;
    for (i = x + 10; i < x + wd - 6; i += 12) { h += r(i, y + 4, 3, ht - 8, '#FFFFFF', 1, ' opacity=".22"'); }
    return h + r(x + 12, y + ht + 4, 22, 26, '#FFFFFF', 3, ' opacity=".9"') + r(x + 44, y + ht + 7, 30, 14, C.glassDk, 3) + J.bulb(x + 23, y + ht + 2, 3.5);
  };
  J.crate = function (x, y, s) { s = s || 1; return J.block(x, y, 34 * s, 24 * s, C.wood, C.woodFront, 12 * s, 4) + r(x + 4 * s, y + 10 * s, 26 * s, 3 * s, C.woodFront, 1); };
  /* lighthouse, front-on: white tower with red bands, a lit lantern room */
  J.lighthouse = function (cx, by, s) {
    s = s || 1;
    return J.shadow(cx + 8, by + 4, 34 * s, 7 * s) + '<path d="M' + (cx - 24 * s) + ',' + by + ' L' + (cx - 15 * s) + ',' + (by - 120 * s) + ' H' + (cx + 15 * s) + ' L' + (cx + 24 * s) + ',' + by + 'Z" fill="#FFFFFF"/>' +
      '<path d="M' + (cx - 21 * s) + ',' + (by - 30 * s) + ' L' + (cx - 19 * s) + ',' + (by - 52 * s) + ' H' + (cx + 19 * s) + ' L' + (cx + 21 * s) + ',' + (by - 30 * s) + 'Z" fill="' + C.flag + '"/><path d="M' + (cx - 18 * s) + ',' + (by - 76 * s) + ' L' + (cx - 16 * s) + ',' + (by - 98 * s) + ' H' + (cx + 16 * s) + ' L' + (cx + 18 * s) + ',' + (by - 76 * s) + 'Z" fill="' + C.flag + '"/>' +
      r(cx - 8 * s, by - 20 * s, 16 * s, 20 * s, C.plum, 6) + r(cx - 22 * s, by - 126 * s, 44 * s, 8 * s, C.plum, 3) + J.bulb(cx, by - 140 * s, 9 * s) + r(cx - 12 * s, by - 152 * s, 24 * s, 24 * s, C.bulb, 5, ' opacity=".6"') + '<path d="M' + (cx - 16 * s) + ',' + (by - 152 * s) + ' L' + cx + ',' + (by - 168 * s) + ' L' + (cx + 16 * s) + ',' + (by - 152 * s) + 'Z" fill="' + C.plum + '"/>';
  };
  /* a small island house from above-front: colored roof over a white front with a door */
  J.house = function (x, y, wd, roof, roofDk) { return J.shadow(x + wd / 2 + 6, y + 50, wd * .55, 6) + J.block(x, y + 18, wd, 14, '#FFFFFF', C.postEdge, 16, 4) + J.block(x - 4, y, wd + 8, 22, roof, roofDk, 8, 6) + r(x + wd / 2 - 6, y + 34, 12, 14, C.woodFront, 3); };

  /* ---- simplified selves of real places, for island overviews (~320 x 260, around 0,0) ----
     Same landmarks, colors and layout as the place's own map, far fewer small things. Each place adds one here when it joins. */
  J.mini = {};
  /* Josie's Cafe: pink-brick room with the white-over-pink counter and round tables, white terrace with pink umbrellas, her pier and sign */
  J.mini.josies = function (p) {
    var pink = '#F5B5C8', deep = '#E98AA5', JC = { wallTop: pink, shutter: '#4FA9A4', wainscot: '#FBE3EA', wainscotLine: '#F3CCD8', brickBase: '#EAD3C4', brick: '#F1E0D4' }, h = '';
    h += J.pier(p, -170, -110, 44, 230, true) + r(-170, -136, 44, 30, '#FFFFFF', 6) + '<path d="M-150,-130 h40 l10,10 -10,10 h-40z" fill="' + pink + '"/>';
    h += J.shadow(14, 70, 150, 16) + r(-120, -110, 240, 150, 'url(#' + p + '-brick)') + r(-120, -110, 240, 18, pink) + r(-120, -92, 240, 22, JC.wainscot) + r(-120, -94, 240, 4, '#FFFFFF');
    h += J.counter(-80, -62, 130, 40, '#FFFFFF', pink) + r(-60, -76, 30, 16, deep, 4) + J.roundTable(-60, 4, 22) + J.roundTable(10, 4, 22) + J.roundTable(80, -40, 20) + J.lamp(-20, -110, 14) + J.lamp(60, -110, 14);
    h += r(-130, -118, 10, 166, '#FFFFFF', 3) + r(120, -118, 10, 166, '#FFFFFF', 3) + r(-130, -118, 260, 10, '#FFFFFF', 3);
    h += r(-120, 48, 240, 78, '#FFFFFF', 8) + r(-120, 48, 240, 8, '#F2E7E0') + J.umbrella(-60, 88, 32, pink, '#FFFFFF') + J.umbrella(40, 88, 32, pink, '#FFFFFF') + J.plant(108, 120, .5);
    return h;
  };
  /* Paradise: two parallel white buildings with the blue strip and the alley between, the beach with the palapa and a tank rack,
     the white pier out to the dive boat */
  J.mini.paradise = function (p, c) {
    var h = '';
    /* the white pier runs south from the beach into the bay, the dive boat alongside */
    h += J.pier(p, -18, 40, 36, 200, true) + J.at(62, 170, 0, .42, J.boat(p, 'dive', c, { rows: 4 }));
    h += r(-150, -14, 300, 60, C.sand) + J.palapa(p, 80, 10, 30) + J.tankRack(-128, 34, [c.tank, c.tank, c.tank2, c.tank]) + J.umbrella(-34, 10, 22, c.soft, '#FFFFFF');
    h += J.shadow(10, -6, 150, 12);
    [[-140, 116], [14, 116]].forEach(function (b) { h += r(b[0] - 6, -156, b[1] + 12, 150, '#D9E2E8', 6) + r(b[0] - 6, -160, b[1] + 12, 150, '#FFFFFF', 6) + r(b[0], -154, b[1], 138, 'url(#' + p + '-white)') + r(b[0], -154, b[1], 8, c.wallTop || c.soft) + r(b[0], -108, b[1], 4, c.soft) + r(b[0], -62, b[1], 4, c.soft); });
    h += r(-18, -154, 26, 138, '#EFD2B3') + J.bed(-126, -96, 36, 24, c.accent) + J.bed(-78, -96, 36, 24, c.soft) + J.counter(26, -142, 64, 24, '#FFFFFF', c.accent) + J.tank(96, -60, c.tank) + J.tank(72, -60, c.tank2) + J.tank(48, -60, c.tank);
    return h;
  };
})(window);
