/* Island art kit: the little SVG props every place is drawn from, in one hand.
   Rules (see art/README.md): seen from above, flat fills, NO outlines (an edge is a slightly darker shape underneath), soft
   elliptical ground shadows, rounded corners, a pot with a plant wherever there is a free corner, a place's own color only on the
   things that are the place (counter, awning, boat stripe, sign). Everything else uses the shared world colors, so every
   place sits on the same island.

   Each prop returns SVG markup drawn around (0,0) at 1:1 "map units" (a person is ~40 wide, a table ~110). Place it with
   UART.at(x, y, rotateDeg, scale, markup). Needs art/palettes.js first. Plain ES5.
   Ported from Josie's (art/bay.js, art/critters.js): blob, reef, palm, crab. New: everything dive-and-boat. */
(function (w) {
  'use strict';
  var U = w.UART = w.UART || {};
  var W = U.palettes.world;
  var DEFAULT = U.palettes.places['utila-dives'].light;
  function pal(p) { return p || DEFAULT; }
  function f(n) { return (+n).toFixed(1); }

  /* place markup at x,y, rotated, scaled */
  U.at = function (x, y, rot, sc, inner) {
    return '<g transform="translate(' + f(x) + ',' + f(y) + ')' + (rot ? ' rotate(' + rot + ')' : '') + (sc && sc !== 1 ? ' scale(' + sc + ')' : '') + '">' + inner + '</g>';
  };
  /* deterministic pseudo-random (so a scene draws the same every time) */
  function rnd(seed) { var k = seed * 9301 + 49297; return function () { k = (k * 9301 + 49297) % 233280; return k / 233280; }; }

  var P = U.props = {};

  P.shadow = function (rx, ry, dx, dy) { return '<ellipse cx="' + (dx || 0) + '" cy="' + (dy || 0) + '" rx="' + rx + '" ry="' + ry + '" fill="' + W.shadow + '"/>'; };

  /* soft organic blob path (ported from Josie's bay map) */
  P.blobPath = function (cx, cy, rx, ry, seed, irr) {
    var n = 11, pts = [], i, a, r, q, c, R = rnd(seed), ir = irr || .22, d;
    for (i = 0; i < n; i++) { r = 1 - ir + R() * ir * 2; a = i / n * Math.PI * 2; pts.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]); }
    d = 'M' + f((pts[0][0] + pts[n - 1][0]) / 2) + ',' + f((pts[0][1] + pts[n - 1][1]) / 2);
    for (i = 0; i < n; i++) { q = pts[(i + 1) % n]; c = pts[i]; d += ' Q' + f(c[0]) + ',' + f(c[1]) + ' ' + f((c[0] + q[0]) / 2) + ',' + f((c[1] + q[1]) / 2); }
    return d + ' Z';
  };
  /* a reef patch: pale shallows, turquoise ring, sandy heart, coral specks (ported) */
  P.reef = function (rx, ry, seed) {
    var h = '<path d="' + P.blobPath(0, 0, rx * 1.18, ry * 1.18, seed, .2) + '" fill="' + W['reef-pale'] + '" opacity=".7"/>' +
      '<path d="' + P.blobPath(0, 0, rx, ry, seed + 1, .26) + '" fill="' + W.reef + '" opacity=".85"/>' +
      '<path d="' + P.blobPath(0, 0, rx * .62, ry * .6, seed + 2, .3) + '" fill="#C9EEDF" opacity=".9"/>', i, R = rnd(seed * 7), ang, rad;
    for (i = 0; i < 7; i++) { ang = R() * 6.283; rad = R() * .8; h += '<circle cx="' + f(Math.cos(ang) * rx * rad) + '" cy="' + f(Math.sin(ang) * ry * rad) + '" r="' + f(6 + R() * 8) + '" fill="' + W['reef-dot'] + '" opacity=".45"/>'; }
    return h;
  };
  /* a rock: two soft tones, no outline */
  P.rock = function (r, seed) {
    return P.shadow(r * 1.1, r * .45, 3, r * .55) + '<path d="' + P.blobPath(0, 0, r, r * .8, seed, .18) + '" fill="' + W.rock + '"/><path d="' + P.blobPath(-r * .15, -r * .2, r * .6, r * .45, seed + 3, .2) + '" fill="' + W['rock-lt'] + '"/>';
  };
  /* palm seen from above: a crown of fronds */
  P.palm = function (r) {
    var h, i, ang;
    r = r || 46;
    h = P.shadow(r * .9, r * .5, 8, r * .65);
    for (i = 0; i < 9; i++) {
      ang = i * 40 + (i % 2) * 8;
      h += '<g transform="rotate(' + ang + ')"><path d="M0,0 Q' + f(r * .45) + ',' + f(-r * .34) + ' ' + f(r) + ',' + f(-r * .08) + ' Q' + f(r * .5) + ',' + f(r * .12) + ' 0,0Z" fill="' + (i % 2 ? W['leaf-lt'] : W.leaf) + '"/></g>';
    }
    return h + '<circle r="' + f(r * .12) + '" fill="' + W['wood-dk'] + '"/>';
  };
  /* potted plant: terracotta pot with a small fan of leaves (the "free corner" filler) */
  P.pot = function (r) {
    r = r || 16;
    var h = P.shadow(r * 1.05, r * .5, 2, r * .7) + '<circle r="' + r + '" fill="' + W['pot-lt'] + '"/><circle r="' + f(r * .78) + '" fill="' + W.pot + '"/>', i;
    for (i = 0; i < 5; i++) { h += '<g transform="rotate(' + (i * 72 + 20) + ')"><path d="M0,0 Q' + f(r * .5) + ',' + f(-r * .25) + ' ' + f(r * 1.05) + ',0 Q' + f(r * .5) + ',' + f(r * .25) + ' 0,0Z" fill="' + (i % 2 ? W['leaf-pale'] : W['leaf-lt']) + '"/></g>'; }
    return h;
  };
  /* beach umbrella from above: 8 wedges in the place's soft and white, a cap in its accent */
  P.umbrella = function (r, p) {
    p = pal(p); r = r || 60;
    var h = P.shadow(r, r * .55, 10, r * .9), i, a0, a1;
    for (i = 0; i < 8; i++) {
      a0 = i * Math.PI / 4; a1 = (i + 1) * Math.PI / 4;
      h += '<path d="M0,0 L' + f(Math.cos(a0) * r) + ',' + f(Math.sin(a0) * r) + ' A' + r + ',' + r + ' 0 0 1 ' + f(Math.cos(a1) * r) + ',' + f(Math.sin(a1) * r) + 'Z" fill="' + (i % 2 ? '#FFFFFF' : p.soft) + '"/>';
    }
    return h + '<circle r="' + f(r * .12) + '" fill="' + p.accent + '"/>';
  };
  /* a table: warm wood, round or square, with room for a pot */
  P.table = function (wd, ht, round) {
    var s = round ? '<circle r="' + f(wd / 2) + '" fill="' + W.wood + '"/><circle r="' + f(wd / 2 - 7) + '" fill="' + W.deck + '"/>'
      : '<rect x="' + f(-wd / 2) + '" y="' + f(-ht / 2) + '" width="' + wd + '" height="' + ht + '" rx="14" fill="' + W.wood + '"/><rect x="' + f(-wd / 2 + 6) + '" y="' + f(-ht / 2 + 6) + '" width="' + (wd - 12) + '" height="' + (ht - 12) + '" rx="10" fill="' + W.deck + '"/>';
    return P.shadow(wd / 2 + 4, (round ? wd : ht) / 2 * .5, 4, (round ? wd : ht) / 2 * .8) + s;
  };
  P.chair = function (p, rot) { p = pal(p); return '<g transform="rotate(' + (rot || 0) + ')"><rect x="-13" y="-13" width="26" height="26" rx="9" fill="' + p.soft + '"/><rect x="-13" y="-15" width="26" height="9" rx="4" fill="' + p.accent + '"/></g>'; };
  /* counter: white top, the place's color as the front band (Josie's pink counter, in any place's hand) */
  P.counter = function (wd, ht, p) {
    p = pal(p);
    return P.shadow(wd / 2, ht / 2 * .5, 0, ht / 2 + 4) + '<rect x="' + f(-wd / 2) + '" y="' + f(-ht / 2) + '" width="' + wd + '" height="' + ht + '" rx="12" fill="' + p.accent + '"/><rect x="' + f(-wd / 2) + '" y="' + f(-ht / 2) + '" width="' + wd + '" height="' + f(ht * .62) + '" rx="12" fill="#FFFFFF"/>';
  };
  P.register = function () { return '<rect x="-22" y="-14" width="44" height="30" rx="6" fill="#4A3A42"/><rect x="-17" y="-10" width="34" height="17" rx="3" fill="#E7F4F1"/><rect x="-10" y="9" width="20" height="5" rx="2" fill="#7A6872"/>'; };
  /* pendant lamp: a warm glow, seen from above */
  P.pendant = function (r) { r = r || 18; return '<circle r="' + f(r * 1.7) + '" fill="#FFE9A8" opacity=".35"/><circle r="' + r + '" fill="#8C6A3E"/><circle r="' + f(r * .6) + '" fill="#FFE29A"/>'; };

  /* ---- dive gear ---- */
  /* tank standing in a rack, from above: a round shoulder with the valve */
  P.tankTop = function (r, color) {
    r = r || 17;
    return '<circle r="' + r + '" fill="' + color + '"/><circle cx="' + f(-r * .25) + '" cy="' + f(-r * .25) + '" r="' + f(r * .55) + '" fill="#FFFFFF" opacity=".28"/><rect x="' + f(-r * .22) + '" y="' + f(-r * .22) + '" width="' + f(r * .44) + '" height="' + f(r * .44) + '" rx="3" fill="#7C8A92"/><circle r="' + f(r * .12) + '" fill="#4A5A63"/>';
  };
  /* a wooden crate/rack of tanks: colors is an array, one tank each */
  P.tankRack = function (colors) {
    var n = colors.length, wd = n * 40 + 16, i, h = P.shadow(wd / 2, 14, 0, 30) + '<rect x="' + f(-wd / 2) + '" y="-26" width="' + wd + '" height="52" rx="12" fill="' + W['wood-dk'] + '"/><rect x="' + f(-wd / 2 + 5) + '" y="-21" width="' + (wd - 10) + '" height="42" rx="9" fill="' + W.wood + '"/>';
    for (i = 0; i < n; i++) { h += U.at(-wd / 2 + 28 + i * 40, 0, 0, 1, P.tankTop(17, colors[i])); }
    return h;
  };
  /* a tank lying down (on a boat or a bench): pill with a valve end */
  P.tankSide = function (len, color) {
    len = len || 80;
    return '<rect x="' + f(-len / 2) + '" y="-13" width="' + len + '" height="26" rx="13" fill="' + color + '"/><rect x="' + f(-len / 2 + 8) + '" y="-9" width="' + f(len - 30) + '" height="6" rx="3" fill="#FFFFFF" opacity=".3"/><rect x="' + f(len / 2 - 4) + '" y="-6" width="14" height="12" rx="4" fill="#7C8A92"/><circle cx="' + f(len / 2 + 6) + '" cy="0" r="3.5" fill="#4A5A63"/>';
  };
  /* a wetsuit laid out flat (hangs on the wall rail): 68 x 80 */
  P.wetsuit = function (color, stripe) {
    return '<path d="M-13,-34 L-5,-38 H5 L13,-34 L36,-8 L27,3 L14,-8 V12 L19,44 H4 L0,14 L-4,44 H-19 L-14,12 V-8 L-27,3 L-36,-8Z" fill="' + color + '"/>' +
      '<path d="M-7,-36 H7 L10,-26 L0,-20 L-10,-26Z" fill="' + stripe + '"/><rect x="-3" y="-20" width="6" height="30" rx="3" fill="' + stripe + '" opacity=".85"/>';
  };
  P.fins = function (color, trim) {
    function fin(x) { return '<g transform="translate(' + x + ',0)"><path d="M-9,-30 H9 L16,24 Q0,34 -16,24Z" fill="' + color + '"/><path d="M-6,-30 H6 L7,-6 H-7Z" fill="' + trim + '"/></g>'; }
    return P.shadow(30, 10, 2, 32) + fin(-19) + fin(19);
  };
  P.mask = function (strap, lens) { return '<rect x="-30" y="-4" width="60" height="8" rx="4" fill="' + strap + '"/><rect x="-20" y="-14" width="40" height="28" rx="12" fill="' + strap + '"/><rect x="-15" y="-9" width="30" height="18" rx="8" fill="' + lens + '"/><path d="M-9,-5 Q-4,-7 0,-5" stroke="#FFFFFF" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/>'; };
  /* a dive-flag: red, white diagonal (the "diver down" flag, drawn from above as a small pennant) */
  P.diveFlag = function (wd, ht) { wd = wd || 44; ht = ht || 32; return '<rect width="' + wd + '" height="' + ht + '" rx="3" fill="#D9483B"/><path d="M0,0 L' + wd + ',' + ht + ' L' + wd + ',' + f(ht * .6) + ' L' + f(wd * .42) + ',0Z" fill="#FFFFFF"/>'; };
  /* rinse tank: a square pool where gear soaks */
  P.rinse = function (wd, ht, p) {
    p = pal(p);
    return P.shadow(wd / 2, ht / 4, 4, ht / 2 + 4) + '<rect x="' + f(-wd / 2) + '" y="' + f(-ht / 2) + '" width="' + wd + '" height="' + ht + '" rx="16" fill="#FFFFFF"/><rect x="' + f(-wd / 2 + 8) + '" y="' + f(-ht / 2 + 8) + '" width="' + (wd - 16) + '" height="' + (ht - 16) + '" rx="10" fill="' + W.sea + '"/>' +
      '<path d="M' + f(-wd / 2 + 24) + ',' + f(-ht / 4) + ' q16,-10 32,0 t32,0" stroke="#FFFFFF" stroke-width="3.4" fill="none" stroke-linecap="round" opacity=".7"/>' +
      U.at(-wd / 6, ht / 8, -20, .55, P.fins(p.accent, '#FFFFFF')) + U.at(wd / 6, -ht / 10, 35, .5, P.mask('#3E4A52', '#BFE9F0'));
  };
  /* compressor: grey box, a gauge, a tank charging */
  P.compressor = function (p) {
    p = pal(p);
    return P.shadow(54, 20, 4, 48) + '<rect x="-52" y="-40" width="104" height="80" rx="14" fill="#B7C0C6"/><rect x="-46" y="-34" width="92" height="68" rx="10" fill="#D6DDE1"/>' +
      '<circle cx="-22" cy="-6" r="17" fill="#FFFFFF"/><path d="M-22,-6 L-12,-14" stroke="#D9483B" stroke-width="3" stroke-linecap="round"/><circle cx="-22" cy="-6" r="3" fill="#4A5A63"/>' +
      '<rect x="6" y="-24" width="34" height="14" rx="5" fill="' + p.accent + '"/><circle cx="26" cy="14" r="9" fill="#8896A0"/>' +
      '<path d="M40,14 q22,-4 26,22" stroke="#4A5A63" stroke-width="5" fill="none" stroke-linecap="round"/>';
  };
  /* a dock: planks and posts, running down the page (rotate to run the other way) */
  P.dock = function (wd, len) {
    var h = P.shadow(wd / 2 + 6, len / 2, 8, 8) + '<rect x="' + f(-wd / 2) + '" y="' + f(-len / 2) + '" width="' + wd + '" height="' + len + '" rx="6" fill="' + W.deck + '"/>', y;
    for (y = -len / 2 + 22; y < len / 2; y += 22) { h += '<rect x="' + f(-wd / 2) + '" y="' + f(y) + '" width="' + wd + '" height="3" fill="' + W['deck-line'] + '"/>'; }
    for (y = -len / 2 + 14; y < len / 2; y += 90) { h += '<circle cx="' + f(-wd / 2 + 6) + '" cy="' + f(y) + '" r="7" fill="' + W['wood-dk'] + '"/><circle cx="' + f(wd / 2 - 6) + '" cy="' + f(y) + '" r="7" fill="' + W['wood-dk'] + '"/>'; }
    return h;
  };
  /* the dive boat, from above, bow up: white hull, a stripe in the place's color, tank racks and a console */
  P.boat = function (p, len) {
    p = pal(p); len = len || 300;
    var k = len / 300, hull = 'M0,-150 C46,-112 58,-40 58,56 L58,128 Q58,150 36,150 H-36 Q-58,150 -58,128 L-58,56 C-58,-40 -46,-112 0,-150Z', i, h;
    h = '<g transform="scale(' + k + ')">' + P.shadow(70, 150, 12, 10) +
      '<path d="' + hull + '" fill="#FFFFFF"/><path d="' + hull + '" fill="' + p.accent + '" transform="scale(.93,.95)"/><path d="' + hull + '" fill="' + W.deck + '" transform="scale(.84,.9)"/>';
    for (i = -90; i < 120; i += 22) { h += '<rect x="-46" y="' + i + '" width="92" height="2.5" fill="' + W['deck-line'] + '" opacity=".8"/>'; }
    /* bench rows with a tank each side, console forward, engine at the stern */
    h += '<rect x="-38" y="-30" width="76" height="22" rx="8" fill="' + p.soft + '"/>' + U.at(-24, -19, 0, .7, P.tankTop(17, p.accent)) + U.at(0, -19, 0, .7, P.tankTop(17, p.pop)) + U.at(24, -19, 0, .7, P.tankTop(17, p.accent)) +
      '<rect x="-38" y="12" width="76" height="22" rx="8" fill="' + p.soft + '"/>' + U.at(-24, 23, 0, .7, P.tankTop(17, p.pop)) + U.at(0, 23, 0, .7, P.tankTop(17, p.accent)) + U.at(24, 23, 0, .7, P.tankTop(17, p.pop)) +
      '<rect x="-24" y="-96" width="48" height="40" rx="12" fill="#FFFFFF"/><rect x="-18" y="-90" width="36" height="22" rx="8" fill="' + W.sea + '"/><circle cx="0" cy="-60" r="6" fill="' + W['wood-dk'] + '"/>' +
      '<rect x="-30" y="132" width="22" height="24" rx="6" fill="#4A5A63"/><rect x="8" y="132" width="22" height="24" rx="6" fill="#4A5A63"/>' +
      U.at(0, 70, -8, 1, P.diveFlag(40, 28)) + '</g>';
    return h;
  };
  /* sea turtle swimming away from you, flat colors */
  P.turtle = function () {
    var h = '<ellipse cx="6" cy="10" rx="34" ry="26" fill="rgba(20,70,90,.18)"/>', i;
    h += '<g fill="#A9B96E"><ellipse cx="-30" cy="-12" rx="22" ry="9" transform="rotate(-28 -30 -12)"/><ellipse cx="30" cy="-12" rx="22" ry="9" transform="rotate(28 30 -12)"/><ellipse cx="-20" cy="26" rx="12" ry="6" transform="rotate(30 -20 26)"/><ellipse cx="20" cy="26" rx="12" ry="6" transform="rotate(-30 20 26)"/><circle cx="0" cy="-34" r="11"/><path d="M-5,34 L0,48 L5,34Z"/></g>' +
      '<ellipse cx="0" cy="0" rx="30" ry="34" fill="#6E9A5B"/><ellipse cx="0" cy="0" rx="22" ry="26" fill="#86B06D"/>';
    for (i = 0; i < 3; i++) { h += '<path d="M' + (-9 + i * 9) + ',-14 L' + (-4 + i * 9) + ',-2 L' + (-14 + i * 9) + ',-2Z" fill="#A5C98A"/>'; }
    h += '<path d="M-14,10 H14 L9,22 H-9Z" fill="#A5C98A"/><circle cx="-4" cy="-37" r="1.8" fill="#27303A"/><circle cx="4" cy="-37" r="1.8" fill="#27303A"/>';
    return h;
  };
  /* a crab (ported from Josie's critters) */
  P.crab = function () {
    return '<g transform="translate(-30,-25)"><path d="M17 26 L9 18 M43 26 L50 17" stroke="#E9735C" stroke-width="3.4" stroke-linecap="round"/><circle cx="8" cy="15" r="5.6" fill="#EE8068"/><circle cx="51" cy="13" r="5.6" fill="#EE8068"/><ellipse cx="30" cy="31" rx="16" ry="11" fill="#EE8068"/><ellipse cx="27" cy="27.5" rx="8.5" ry="4.6" fill="#F5A38D"/><circle cx="23" cy="12" r="3.8" fill="#FFFFFF"/><circle cx="36" cy="11" r="3.8" fill="#FFFFFF"/><circle cx="23.5" cy="12.5" r="1.7" fill="#3A2A2A"/><circle cx="36.5" cy="11.5" r="1.7" fill="#3A2A2A"/></g>';
  };
  /* a buoy and its ripples */
  P.buoy = function (r) { r = r || 16; return '<circle r="' + f(r * 2.3) + '" fill="#FFFFFF" opacity=".28"/><circle r="' + f(r * 1.6) + '" fill="#FFFFFF" opacity=".35"/><circle r="' + r + '" fill="#D9483B"/><path d="M' + f(-r) + ',0 H' + r + '" stroke="#FFFFFF" stroke-width="' + f(r * .42) + '"/><circle r="' + f(r * .3) + '" fill="#FFFFFF"/>'; };
  /* foam dashes: a wavelet */
  P.wave = function (len) { len = len || 80; return '<path d="M0,0 q' + len / 4 + ',-8 ' + len / 2 + ',0 t' + len / 2 + ',0" stroke="#FFFFFF" stroke-width="3.6" fill="none" stroke-linecap="round" opacity=".7"/>'; };
  /* a chalkboard / sign face for a shop: rounded, deep ink, a few lines in the place's tones */
  P.board = function (wd, ht, p, lines) {
    p = pal(p); var i, h = P.shadow(wd / 2, ht / 4, 3, ht / 2 + 3) + '<rect x="' + f(-wd / 2) + '" y="' + f(-ht / 2) + '" width="' + wd + '" height="' + ht + '" rx="12" fill="' + W['wood-dk'] + '"/><rect x="' + f(-wd / 2 + 6) + '" y="' + f(-ht / 2 + 6) + '" width="' + (wd - 12) + '" height="' + (ht - 12) + '" rx="8" fill="' + p.ink + '"/>';
    for (i = 0; i < (lines || 3); i++) { h += '<rect x="' + f(-wd / 2 + 18) + '" y="' + f(-ht / 2 + 18 + i * 14) + '" width="' + f((wd - 36) * (1 - (i % 3) * .22)) + '" height="5" rx="2.5" fill="' + (i % 2 ? p.soft : p.accent) + '"/>'; }
    return h;
  };

  /* ---- Tripwrights fleet: one adventure boat per area, each carrying that area's gear. p = the area's light palette. Bow up, ~116 x 300. ---- */
  var HULL = 'M0,-150 C46,-112 58,-40 58,56 L58,128 Q58,150 36,150 H-36 Q-58,150 -58,128 L-58,56 C-58,-40 -46,-112 0,-150Z';
  function layers(p, sx, deckSx) {
    return '<path d="' + HULL + '" fill="#FFFFFF" transform="scale(' + sx + ',1)"/><path d="' + HULL + '" fill="' + p.accent + '" transform="scale(' + (sx * .93).toFixed(2) + ',.95)"/><path d="' + HULL + '" fill="' + W.deck + '" transform="scale(' + (sx * .84).toFixed(2) + ',.9)"/>';
  }
  P.boatKind = function (kind, p) {
    p = pal(p);
    var h = '', i;
    if (kind === 'dive') { return P.boat(p, 300); }
    if (kind === 'catamaran') {
      var hull = 'M0,-150 C14,-120 17,-60 17,40 L17,140 Q17,152 6,152 H-6 Q-17,152 -17,140 L-17,40 C-17,-60 -14,-120 0,-150Z';
      h = P.shadow(70, 150, 12, 10);
      for (i = -1; i <= 1; i += 2) { h += '<g transform="translate(' + (i * 40) + ',0)"><path d="' + hull + '" fill="#FFFFFF"/><path d="' + hull + '" fill="' + p.accent + '" transform="scale(.6,.94)"/></g>'; }
      h += '<rect x="-40" y="-70" width="80" height="170" rx="10" fill="' + p.soft + '"/>';
      for (i = -60; i < 100; i += 22) { h += '<rect x="-40" y="' + i + '" width="80" height="2.5" fill="#FFFFFF" opacity=".7"/>'; }
      h += '<rect x="-3" y="-150" width="6" height="90" fill="' + W['wood-dk'] + '"/>' + '<path d="M-5,-40 L7,-40 L22,118 L-6,126Z" fill="#FFFFFF"/><path d="M-5,-40 L2,-40 L2,122 L-6,126Z" fill="' + p.soft + '" opacity=".7"/><circle cx="1" cy="-40" r="7" fill="' + W['wood-dk'] + '"/>';
      return h + U.at(-22, 30, -18, .55, P.fins(p.pop, '#FFFFFF')) + U.at(24, 56, 14, .55, P.fins(p.accent, '#FFFFFF')) + U.at(-18, 84, 0, .6, P.mask('#3E4A52', '#BFE9F0')) + U.at(0, -96, 0, 1, '<rect x="-14" y="-12" width="28" height="24" rx="8" fill="#FFFFFF"/><rect x="-9" y="-7" width="18" height="12" rx="5" fill="' + W.sea + '"/>');
    }
    if (kind === 'panga') {
      h = P.shadow(52, 150, 10, 10) + layers(p, .74);
      h += '<rect x="-34" y="-30" width="68" height="64" rx="14" fill="' + p.accent + '"/><rect x="-28" y="-24" width="56" height="52" rx="10" fill="' + p.soft + '"/>';
      h += '<rect x="-24" y="62" width="48" height="30" rx="8" fill="#FFFFFF"/><rect x="-24" y="62" width="48" height="12" rx="8" fill="' + p.pop + '"/>';
      h += '<path d="M-22,-60 L-70,-150 M0,-70 L0,-170 M22,-60 L70,-150" stroke="' + W['wood-dk'] + '" stroke-width="3.5" stroke-linecap="round"/>';
      h += '<circle cx="0" cy="-86" r="16" fill="' + p.pop + '"/><circle cx="0" cy="-86" r="9" fill="#FFFFFF" opacity=".5"/>';
      return h + '<rect x="-14" y="128" width="28" height="30" rx="7" fill="#4A5A63"/>' + U.at(0, 8, 0, 1, P.crab()).replace(/<g transform="translate\(-30,-25\)">.*$/, '');
    }
    if (kind === 'longtail') {
      h = P.shadow(40, 150, 10, 10) + layers(p, .62);
      h += '<rect x="-30" y="-36" width="60" height="110" rx="14" fill="' + p.pop + '"/>';
      for (i = 0; i < 4; i++) { h += '<rect x="' + (-30 + i * 15) + '" y="-36" width="7.5" height="110" fill="#FFFFFF" opacity=".28"/>'; }
      h += '<g transform="translate(0,-160)">';
      var rib = [p.accent, '#FFFFFF', p.pop, p.soft, '#E9735C'];
      for (i = 0; i < 5; i++) { h += '<rect x="' + (-24 + i * 10) + '" y="' + (i % 2 ? 8 : 0) + '" width="6" height="26" rx="3" fill="' + rib[i] + '"/>'; }
      h += '</g>';
      h += '<path d="M0,140 L0,236" stroke="' + W['wood-dk'] + '" stroke-width="7" stroke-linecap="round"/><circle cx="0" cy="240" r="9" fill="#4A5A63"/><rect x="-12" y="118" width="24" height="26" rx="7" fill="#4A5A63"/>';
      return h + U.at(0, -92, 0, 1, '<rect x="-20" y="-14" width="40" height="30" rx="10" fill="' + p.accent + '"/><rect x="-14" y="-8" width="28" height="12" rx="5" fill="#FFFFFF" opacity=".35"/>') + U.at(0, 100, 0, 1, '<circle r="20" fill="#FFFFFF"/><path d="M0,0 L20,0 A20,20 0 0 0 14,-14Z" fill="' + p.accent + '"/><circle r="3" fill="' + W['wood-dk'] + '"/>');
    }
    return P.boat(p, 300);
  };
  /* a float plane from above, nose up: two pontoons, a wide wing, a prop that spins if the page defines .spin */
  P.floatplane = function (p) {
    p = pal(p);
    return P.shadow(100, 90, 14, 16) +
      '<rect x="-48" y="-30" width="20" height="150" rx="10" fill="#FFFFFF"/><rect x="28" y="-30" width="20" height="150" rx="10" fill="#FFFFFF"/><rect x="-44" y="-26" width="12" height="140" rx="6" fill="' + p.soft + '"/><rect x="32" y="-26" width="12" height="140" rx="6" fill="' + p.soft + '"/>' +
      '<rect x="-12" y="40" width="24" height="96" rx="12" fill="#FFFFFF"/><rect x="-46" y="112" width="92" height="16" rx="8" fill="#FFFFFF"/><rect x="-46" y="112" width="92" height="7" rx="4" fill="' + p.accent + '"/>' +
      '<rect x="-112" y="-40" width="224" height="52" rx="16" fill="#FFFFFF"/><rect x="-112" y="-40" width="224" height="20" rx="10" fill="' + p.accent + '"/><rect x="-100" y="-4" width="200" height="6" rx="3" fill="' + p.soft + '"/>' +
      '<ellipse cx="0" cy="-8" rx="24" ry="68" fill="#FFFFFF"/><ellipse cx="0" cy="-30" rx="16" ry="22" fill="' + W.sea + '"/><ellipse cx="-5" cy="-37" rx="4" ry="8" fill="#FFFFFF" opacity=".55"/>' +
      '<g class="spin"><rect x="-4" y="-122" width="8" height="92" rx="4" fill="' + p.ink + '" opacity=".4"/></g><circle cy="-76" r="8" fill="' + p.pop + '"/>';
  };
  /* a small top-down helicopter (a bubble, rotor spinning if the page defines .spin) */
  P.heli = function (p) {
    p = pal(p);
    return P.shadow(40, 56, 16, 18) + '<rect x="-5" y="20" width="10" height="82" rx="5" fill="#FFFFFF"/><rect x="-18" y="96" width="36" height="8" rx="4" fill="' + p.accent + '"/>' +
      '<ellipse cx="0" cy="-2" rx="30" ry="42" fill="#FFFFFF"/><ellipse cx="0" cy="-14" rx="21" ry="26" fill="' + W.sea + '"/><ellipse cx="-7" cy="-22" rx="6" ry="10" fill="#FFFFFF" opacity=".55"/>' +
      '<rect x="-30" y="26" width="60" height="7" rx="3" fill="' + p.accent + '"/>' +
      '<g class="spin"><rect x="-84" y="-5" width="168" height="10" rx="5" fill="' + p.ink + '" opacity=".4"/><rect x="-5" y="-84" width="10" height="168" rx="5" fill="' + p.ink + '" opacity=".4"/></g><circle r="8" fill="' + p.pop + '"/>';
  };
  P.container = function (wd, ht, color) {
    var h = P.shadow(wd / 2, ht / 4, 6, ht / 2 + 4) + '<rect x="' + f(-wd / 2) + '" y="' + f(-ht / 2) + '" width="' + wd + '" height="' + ht + '" rx="8" fill="' + color + '"/>', x;
    for (x = -wd / 2 + 12; x < wd / 2 - 6; x += 12) { h += '<rect x="' + f(x) + '" y="' + f(-ht / 2 + 4) + '" width="4" height="' + (ht - 8) + '" rx="2" fill="#FFFFFF" opacity=".22"/>'; }
    return h;
  };
  /* the globe on its stand */
  P.globe = function (r, p) {
    p = pal(p); r = r || 70;
    return P.shadow(r * 1.05, r * .5, 10, r * .85) + '<circle r="' + f(r * 1.12) + '" fill="' + p.pop + '"/><circle r="' + r + '" fill="#2F7FAE"/><circle r="' + f(r * .94) + '" fill="#4A9CC8"/>' +
      '<path d="' + P.blobPath(-r * .3, -r * .25, r * .34, r * .26, 4, .3) + '" fill="' + W['leaf-pale'] + '"/><path d="' + P.blobPath(r * .3, r * .22, r * .3, r * .38, 8, .3) + '" fill="' + W['leaf-lt'] + '"/><path d="' + P.blobPath(r * .12, -r * .55, r * .18, r * .1, 2, .3) + '" fill="#FFFFFF" opacity=".85"/>' +
      '<ellipse cx="' + f(-r * .35) + '" cy="' + f(-r * .4) + '" rx="' + f(r * .25) + '" ry="' + f(r * .14) + '" fill="#FFFFFF" opacity=".25" transform="rotate(-30 ' + f(-r * .35) + ' ' + f(-r * .4) + ')"/>';
  };
  /* a small shop building, roof off, in its own palette (for area maps): wd x ht */
  P.building = function (p, wd, ht) {
    p = pal(p);
    return P.shadow(wd / 2, ht / 4, 8, ht / 2 + 4) + '<rect x="' + f(-wd / 2 - 7) + '" y="' + f(-ht / 2 - 7) + '" width="' + (wd + 14) + '" height="' + (ht + 14) + '" rx="16" fill="' + W['sand-dk'] + '"/><rect x="' + f(-wd / 2) + '" y="' + f(-ht / 2) + '" width="' + wd + '" height="' + ht + '" rx="12" fill="' + (p.wash || '#FFF') + '"/>' +
      '<rect x="' + f(-wd / 2) + '" y="' + f(-ht / 2) + '" width="' + wd + '" height="' + f(ht * .26) + '" rx="12" fill="' + p.soft + '"/>' +
      '<rect x="' + f(-wd * .36) + '" y="' + f(-ht * .06) + '" width="' + f(wd * .72) + '" height="' + f(ht * .2) + '" rx="8" fill="' + p.accent + '"/><rect x="' + f(-wd * .36) + '" y="' + f(-ht * .06) + '" width="' + f(wd * .72) + '" height="' + f(ht * .12) + '" rx="8" fill="#FFFFFF"/>' +
      '<rect x="' + f(-14) + '" y="' + f(ht / 2 - 8) + '" width="28" height="12" rx="5" fill="' + p.accent + '"/>';
  };

  /* sea: flat bands + foam lines, to fill a rect (the same water everywhere) */
  P.sea = function (x, y, wd, ht) {
    var h = '<rect x="' + x + '" y="' + y + '" width="' + wd + '" height="' + ht + '" fill="' + W.sea + '"/><rect x="' + x + '" y="' + f(y + ht * .5) + '" width="' + wd + '" height="' + f(ht * .5) + '" fill="' + W['sea-2'] + '"/><rect x="' + x + '" y="' + f(y + ht * .8) + '" width="' + wd + '" height="' + f(ht * .2) + '" fill="' + W['sea-deep'] + '"/>', i;
    for (i = 0; i < Math.floor(wd / 220); i++) { h += U.at(x + 40 + i * 220 + (i % 2) * 40, y + ht * (.2 + (i % 3) * .22), 0, 1, P.wave(90)); }
    return h;
  };
})(window);
