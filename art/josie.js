/* The universe kit: Josie's drawing idioms, lifted from her design board (josiescafe/design/boards/Josies.html), as reusable pieces.
   Everything we draw (Josie's, Paradise, Tripwrights, the next shop) uses these, so it is all one game.

   The view is Josie's oblique "room from above": floors and the tops of things seen from above, every object also shows its FRONT
   face (a darker band underneath), back walls are drawn as elevations (cream band, colored top, tiled wainscot, white sill, windows
   with shutters), small things (plants, chairs, machines, gear) are drawn front-on. Vehicles, umbrellas and trees stay top-down.
   Shadows are plum (#5B3843) at ~15%. Dark details are plum or near-black, never pure black. No outlines, no gradients, no text.

   All coordinates are absolute (x, y = top-left), like the positioned pieces on Josie's board. Each place passes its own
   colors in `c` (see PLACE below); the shared world colors are in J.C. Plain ES5. */
(function (w) {
  'use strict';
  var J = w.UJ = {};
  var C = J.C = {
    plum: '#5B3843', sand: '#F6DCC0', foam: '#FFF1E2', water: '#7FCBE0', deep: '#3AA3C4',
    post: '#FFFFFF', postEdge: '#E6DED3', postAlt: '#EFE9E3',
    wood: '#D9B48A', woodFront: '#B98F68', woodDark: '#9C6F48', woodDarker: '#7A5534', plank: '#E8CDA8', plankLine: '#CFAE86',
    leaf: '#6F9A6B', leafLt: '#8FB98B', leafDk: '#3F6B3C', leafMid: '#5E8E5A', trunk: '#9C7A52',
    pot: '#E8895C', potRim: '#F2A477', soil: '#6B4130',
    rock: '#6B6269', rockLt: '#80767E', rockDk: '#4A4348',
    steel: '#B9C0C7', steelLt: '#D7DDE2', steelPale: '#E9EEF1', glass: '#E4F3F7', glassDk: '#BFE2EC', bulb: '#FFE08A',
    gear: '#2E3238', gearLt: '#454B53', gearHi: '#5E6670'
  };
  function f(n) { return (+n).toFixed(1); }
  function r(x, y, wd, ht, fill, rx, extra) { return '<rect x="' + f(x) + '" y="' + f(y) + '" width="' + f(wd) + '" height="' + f(ht) + '" rx="' + (rx || 0) + '" fill="' + fill + '"' + (extra || '') + '/>'; }
  function e(cx, cy, rx, ry, fill, extra) { return '<ellipse cx="' + f(cx) + '" cy="' + f(cy) + '" rx="' + f(rx) + '" ry="' + f(ry) + '" fill="' + fill + '"' + (extra || '') + '/>'; }
  J.r = r; J.e = e;

  J.shadow = function (cx, cy, rx, ry, op) { return e(cx, cy, rx, ry, C.plum, ' opacity="' + (op || .15) + '"'); };
  /* a block: top surface plus its front face (the Josie "ledge") */
  J.block = function (x, y, wd, ht, top, front, frontH, rx) { return r(x, y, wd, ht + frontH, front, rx) + r(x, y, wd, ht, top, rx); };

  /* SVG patterns. Call once per svg with a prefix, then fill="url(#<prefix>-plank)" etc. */
  J.defs = function (p, c) {
    c = c || {};
    return '<defs>' +
      '<pattern id="' + p + '-plank" width="400" height="29" patternUnits="userSpaceOnUse">' + r(0, 0, 400, 29, C.plank) + r(0, 26, 400, 3, C.plankLine) + '</pattern>' +
      '<pattern id="' + p + '-plankV" width="29" height="400" patternUnits="userSpaceOnUse">' + r(0, 0, 29, 400, C.plank) + r(26, 0, 3, 400, C.plankLine) + '</pattern>' +
      '<pattern id="' + p + '-white" width="400" height="26" patternUnits="userSpaceOnUse">' + r(0, 0, 400, 26, c.whiteWood || '#FBFAF7') + r(0, 23, 400, 3, c.whiteLine || '#E3E7EA') + '</pattern>' +
      '<pattern id="' + p + '-whiteV" width="26" height="400" patternUnits="userSpaceOnUse">' + r(0, 0, 26, 400, c.whiteWood || '#FBFAF7') + r(23, 0, 3, 400, c.whiteLine || '#E3E7EA') + '</pattern>' +
      '<pattern id="' + p + '-tile" width="48" height="48" patternUnits="userSpaceOnUse">' + r(0, 0, 48, 48, c.tile || '#F4F1EA') + r(3, 3, 42, 42, c.tile2 || '#EFEAE1', 6) + '</pattern>' +
      '<pattern id="' + p + '-brick" width="72" height="36" patternUnits="userSpaceOnUse">' + r(0, 0, 72, 36, c.brickBase || '#EAD3C4') + r(3, 3, 30, 12, c.brick || '#F1E0D4', 4) + r(39, 3, 30, 12, c.brick || '#F1E0D4', 4) + r(3, 21, 12, 12, c.brick || '#F1E0D4', 4) + r(21, 21, 30, 12, c.brick || '#F1E0D4', 4) + r(57, 21, 12, 12, c.brick || '#F1E0D4', 4) + '</pattern>' +
      '<pattern id="' + p + '-wall" width="24" height="40" patternUnits="userSpaceOnUse">' + r(0, 0, 24, 40, c.wainscot || '#DDEBF5') + r(22, 0, 2, 40, c.wainscotLine || '#C9DCEB') + '</pattern>' +
      '<pattern id="' + p + '-thatch" width="14" height="14" patternUnits="userSpaceOnUse">' + r(0, 0, 14, 14, '#D8B47E') + '<path d="M0,10 L14,4" stroke="#C49A60" stroke-width="2"/></pattern>' +
      '</defs>';
  };

  /* back wall elevation: colored top band, cream wall, tiled wainscot with a white sill, a floor-colored base */
  J.backWall = function (p, x, y, wd, c, wins) {
    var h = r(x, y, wd, 96, c.wallCream || C.foam) + r(x, y, wd, 12, c.wallTop) + r(x, y + 56, wd, 28, 'url(#' + p + '-wall)') + r(x, y + 52, wd, 5, '#FFFFFF') + r(x, y + 84, wd, 12, c.wallBase || '#EFD9C4'), i;
    (wins || []).forEach(function (wx) { h += J.window(wx, y + 12, c); });
    return h;
  };
  J.window = function (x, y, c) { return r(x, y, 26, 40, c.shutter, 3) + r(x + 4, y + 6, 18, 6, c.shutterLine || '#FFFFFF', 1, ' opacity=".35"') + r(x + 4, y + 18, 18, 6, c.shutterLine || '#FFFFFF', 1, ' opacity=".35"') + r(x + 30, y + 2, 76, 36, '#FFFFFF', 4) + r(x + 36, y + 6, 30, 28, C.glassDk) + r(x + 70, y + 6, 30, 28, C.glassDk) + '<path d="M' + (x + 42) + ',' + (y + 28) + ' l12,-16 M' + (x + 76) + ',' + (y + 28) + ' l12,-16" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>' + r(x + 110, y, 26, 40, c.shutter, 3); };
  /* hanging lamp: plum cord, plum shade, warm bulb with a halo */
  J.lamp = function (cx, y, len) { len = len || 26; return r(cx - 1.5, y, 3, len, C.plum) + '<path d="M' + (cx - 10) + ',' + (y + len + 10) + ' Q' + (cx - 10) + ',' + (y + len - 2) + ' ' + cx + ',' + (y + len - 2) + ' Q' + (cx + 10) + ',' + (y + len - 2) + ' ' + (cx + 10) + ',' + (y + len + 10) + 'Z" fill="' + C.plum + '"/>' + '<circle cx="' + cx + '" cy="' + (y + len + 14) + '" r="13" fill="' + C.bulb + '" opacity=".35"/><circle cx="' + cx + '" cy="' + (y + len + 14) + '" r="7" fill="' + C.bulb + '"/>'; };
  /* potted plant, front-on */
  J.plant = function (cx, by, s) {
    s = s || 1; var h = J.shadow(cx, by + 2, 26 * s, 5 * s), i, a, L = [[-34, 30, C.leaf], [-12, 40, C.leafLt], [8, 42, C.leaf], [28, 32, C.leafLt], [0, 26, C.leafMid]];
    for (i = 0; i < L.length; i++) { a = L[i]; h += '<path d="M' + cx + ',' + f(by - 24 * s) + ' Q' + f(cx + a[0] * s * .4 - 8 * s) + ',' + f(by - 24 * s - a[1] * s * .7) + ' ' + f(cx + a[0] * s) + ',' + f(by - 24 * s - a[1] * s) + ' Q' + f(cx + a[0] * s * .4 + 8 * s) + ',' + f(by - 24 * s - a[1] * s * .5) + ' ' + cx + ',' + f(by - 24 * s) + 'Z" fill="' + a[2] + '"/>'; }
    return h + '<path d="M' + f(cx - 16 * s) + ',' + f(by - 24 * s) + ' H' + f(cx + 16 * s) + ' L' + f(cx + 12 * s) + ',' + by + ' H' + f(cx - 12 * s) + 'Z" fill="' + C.pot + '"/>' + r(cx - 18 * s, by - 28 * s, 36 * s, 7 * s, C.potRim, 3);
  };
  /* small tabletop pot (Josie's tables each carry one) */
  J.pot = function (cx, cy) { return e(cx, cy + 10, 12, 3, C.plum, ' opacity=".14"') + '<path d="M' + (cx - 14) + ',' + (cy - 6) + ' H' + (cx + 14) + ' L' + (cx + 10) + ',' + (cy + 10) + ' H' + (cx - 10) + 'Z" fill="' + C.potRim + '"/>' + e(cx, cy - 6, 14, 3.5, C.soil); };
  /* wood table with a front face and its pot */
  J.table = function (x, y, wd, ht, c) { c = c || {}; return J.shadow(x + wd / 2, y + ht + 22, wd * .48, 8) + J.block(x, y, wd, ht, c.top || C.wood, c.front || C.woodFront, Math.max(10, ht * .2), 10) + r(x + wd * .33, y + 4, 2, ht - 8, '#FFFFFF', 0, ' opacity=".18"') + r(x + wd * .66, y + 4, 2, ht - 8, '#FFFFFF', 0, ' opacity=".18"') + (c.noPot ? '' : J.pot(x + wd / 2, y + ht * .45)); };
  J.roundTable = function (cx, cy, rad, c) { c = c || {}; return J.shadow(cx, cy + rad + 12, rad * .9, 7) + e(cx, cy + 8, rad, rad * .9, c.front || C.woodFront) + e(cx, cy, rad, rad * .9, c.top || C.wood) + (c.noPot ? '' : J.pot(cx, cy - 2)); };
  /* chair, side-on, in a color */
  J.chair = function (x, y, col, colLt, flip) {
    var g = '<g transform="translate(' + x + ',' + y + ')' + (flip ? ' scale(-1,1)' : '') + '">' + e(0, 34, 18, 4, C.plum, ' opacity=".14"') + '<path d="M-14,4 Q-14,-14 0,-14 Q14,-14 14,4Z" fill="' + col + '"/>' + r(-16, 4, 32, 10, colLt || col, 4) + '<path d="M-12,14 L-13,32 M12,14 L13,32 M-4,14 L-4,28 M4,14 L4,28" stroke="' + C.woodDark + '" stroke-width="2.6" stroke-linecap="round"/></g>';
    return g;
  };
  J.stool = function (cx, y, col) { return e(cx, y + 30, 14, 3, C.plum, ' opacity=".14"') + r(cx - 13, y, 26, 9, col, 4) + '<path d="M' + (cx - 9) + ',' + (y + 9) + ' l-2,20 M' + (cx + 9) + ',' + (y + 9) + ' l2,20" stroke="' + C.woodDark + '" stroke-width="2.6" stroke-linecap="round"/>'; };
  /* counter: top color over a front color (Josie: white over pink) */
  J.counter = function (x, y, wd, ht, top, front) { return J.shadow(x + wd / 2, y + ht + 12, wd * .5, 8) + J.block(x, y, wd, ht * .58, top, front, ht * .42, 12); };
  /* white post with its ledge, and a fence rail between posts */
  J.post = function (x, y) { return r(x, y + 4, 22, 22, C.postEdge, 6) + r(x, y, 22, 22, C.post, 6); };
  J.woodPost = function (cx, cy) { return '<circle cx="' + cx + '" cy="' + (cy + 3) + '" r="8" fill="' + C.woodDarker + '"/><circle cx="' + cx + '" cy="' + cy + '" r="8" fill="' + C.woodDark + '"/>'; };
  J.railV = function (x, y, len) { var h = r(x, y, 12, len, '#FFFFFF', 4), i; for (i = 10; i < len; i += 12) { h += r(x, y + i, 12, 2, C.postAlt); } return h; };
  J.railH = function (x, y, len) { var h = r(x, y + 4, len, 12, C.postEdge, 4) + r(x, y, len, 12, '#FFFFFF', 4), i; for (i = 10; i < len; i += 12) { h += r(x + i, y, 2, 12, C.postAlt); } return h; };
  /* a room's walls seen from above: a thin wall slab with a ledge, around a floor */
  J.room = function (x, y, wd, ht, floorFill, c, open) {
    var t = 10, wall = c.wall || '#FFFFFF', edge = c.wallEdge || C.postEdge, h = r(x, y, wd, ht, floorFill);
    function slab(a, b, ww, hh) { return r(a, b + 4, ww, hh, edge, 3) + r(a, b, ww, hh, wall, 3); }
    open = open || {};
    h += slab(x - t, y - t, wd + 2 * t, t) + slab(x - t, y - t, t, ht + 2 * t) + slab(x + wd, y - t, t, ht + 2 * t);
    if (open.bottom) { h += slab(x - t, y + ht, open.bottom[0] - x + t, t) + slab(open.bottom[1], y + ht, x + wd + t - open.bottom[1], t); } else { h += slab(x - t, y + ht, wd + 2 * t, t); }
    return h;
  };

  /* ---- outdoors ---- */
  J.rock = function (cx, cy, s, seed) {
    s = s || 1; var k = seed || 1;
    return J.shadow(cx + 4, cy + 18 * s, 44 * s, 9 * s, .14) + '<path d="M' + f(cx - 44 * s) + ',' + f(cy + 10 * s) + ' C' + f(cx - 46 * s) + ',' + f(cy - 14 * s) + ' ' + f(cx - 14 * s) + ',' + f(cy - 26 * s) + ' ' + f(cx + 8 * s) + ',' + f(cy - 22 * s) + ' C' + f(cx + 34 * s) + ',' + f(cy - 20 * s) + ' ' + f(cx + 48 * s) + ',' + f(cy - 2 * s) + ' ' + f(cx + 42 * s) + ',' + f(cy + 14 * s) + ' C' + f(cx + 20 * s) + ',' + f(cy + 22 * s) + ' ' + f(cx - 24 * s) + ',' + f(cy + 22 * s) + ' ' + f(cx - 44 * s) + ',' + f(cy + 10 * s) + 'Z" fill="' + C.rock + '"/>' +
      e(cx - 8 * s, cy - 8 * s, 26 * s, 11 * s, C.rockLt, ' opacity=".8"') + '<circle cx="' + f(cx + 14 * s) + '" cy="' + f(cy + 6 * s) + '" r="' + f(2 * s) + '" fill="' + C.rockDk + '"/><circle cx="' + f(cx - 20 * s) + '" cy="' + f(cy + 8 * s) + '" r="' + f(1.6 * s) + '" fill="' + C.rockDk + '"/>';
  };
  /* a tree canopy from above, Josie's way: dark clusters, mid clusters, light leaf scallops */
  J.tree = function (cx, cy, s) {
    s = s || 1; var h = J.shadow(cx + 10 * s, cy + 40 * s, 120 * s, 26 * s, .13), i, L = [[-70, 6, 50], [-24, -18, 62], [36, -10, 58], [80, 12, 44], [10, 26, 54], [-40, 32, 44]];
    for (i = 0; i < L.length; i++) { h += '<circle cx="' + f(cx + L[i][0] * s) + '" cy="' + f(cy + L[i][1] * s + 6) + '" r="' + f(L[i][2] * s) + '" fill="' + C.leafDk + '"/>'; }
    for (i = 0; i < L.length; i++) { h += '<circle cx="' + f(cx + L[i][0] * s - 4) + '" cy="' + f(cy + L[i][1] * s - 2) + '" r="' + f(L[i][2] * s * .86) + '" fill="' + C.leafMid + '"/>'; }
    for (i = 0; i < L.length; i++) { h += '<ellipse cx="' + f(cx + L[i][0] * s - 14 * s) + '" cy="' + f(cy + L[i][1] * s - 16 * s) + '" rx="' + f(L[i][2] * s * .34) + '" ry="' + f(L[i][2] * s * .2) + '" fill="' + C.leafLt + '" transform="rotate(-24 ' + f(cx + L[i][0] * s) + ' ' + f(cy + L[i][1] * s) + ')"/>'; }
    return h;
  };
  /* palm from above, in Josie's greens */
  J.palm = function (cx, cy, s) {
    s = s || 1; var h = J.shadow(cx + 14 * s, cy + 34 * s, 70 * s, 16 * s, .13), i, a;
    for (i = 0; i < 8; i++) { a = i * 45 + 10; h += '<g transform="translate(' + cx + ',' + cy + ') rotate(' + a + ')"><path d="M0,0 Q' + f(30 * s) + ',' + f(-22 * s) + ' ' + f(76 * s) + ',' + f(-4 * s) + ' Q' + f(36 * s) + ',' + f(10 * s) + ' 0,0Z" fill="' + (i % 2 ? C.leaf : C.leafMid) + '"/><path d="M6,-2 Q' + f(34 * s) + ',' + f(-12 * s) + ' ' + f(66 * s) + ',' + f(-4 * s) + '" stroke="' + C.leafLt + '" stroke-width="2" fill="none"/></g>'; }
    return h + '<circle cx="' + cx + '" cy="' + cy + '" r="' + f(9 * s) + '" fill="' + C.trunk + '"/>';
  };
  /* beach umbrella from above: 8 wedges, two colors (Josie: pink and white) */
  J.umbrella = function (cx, cy, rad, c1, c2) {
    var h = J.shadow(cx + 8, cy + rad * .9, rad, rad * .3, .12), i, a0, a1;
    for (i = 0; i < 8; i++) { a0 = i * Math.PI / 4 - Math.PI / 8; a1 = a0 + Math.PI / 4; h += '<path d="M' + cx + ',' + cy + ' L' + f(cx + Math.cos(a0) * rad) + ',' + f(cy + Math.sin(a0) * rad) + ' Q' + f(cx + Math.cos((a0 + a1) / 2) * rad * .9) + ',' + f(cy + Math.sin((a0 + a1) / 2) * rad * .9) + ' ' + f(cx + Math.cos(a1) * rad) + ',' + f(cy + Math.sin(a1) * rad) + 'Z" fill="' + (i % 2 ? c2 : c1) + '"/>'; }
    return h + '<circle cx="' + cx + '" cy="' + cy + '" r="6" fill="' + c1 + '"/>';
  };
  /* thatched palapa roof from above */
  J.palapa = function (p, cx, cy, rad) {
    var h = J.shadow(cx + 10, cy + rad * .95, rad * 1.02, rad * .3, .14) + '<circle cx="' + cx + '" cy="' + cy + '" r="' + rad + '" fill="#C49A60"/><circle cx="' + cx + '" cy="' + (cy - 4) + '" r="' + (rad - 4) + '" fill="url(#' + p + '-thatch)"/>', i, a;
    for (i = 0; i < 16; i++) { a = i * Math.PI / 8; h += '<path d="M' + cx + ',' + (cy - 4) + ' L' + f(cx + Math.cos(a) * (rad - 6)) + ',' + f(cy - 4 + Math.sin(a) * (rad - 6)) + '" stroke="#B8894F" stroke-width="2.4" opacity=".7"/>'; }
    return h + '<circle cx="' + cx + '" cy="' + (cy - 4) + '" r="' + (rad * .18) + '" fill="#E3C38E"/><circle cx="' + cx + '" cy="' + (cy - 4) + '" r="5" fill="#9C6F48"/>';
  };
  /* water with Josie's foam line and two bands */
  J.wave = function (x, y, len) { return r(x, y, len, 4, C.bulb, 2, ' opacity=".55"').replace(C.bulb, '#FFF1C9'); };

  /* ---- dive gear (front-on, black like real gear) ---- */
  J.tank = function (x, by, col, empty) {
    var body = empty ? '#C9CED3' : col;
    return e(x + 11, by + 2, 13, 3, C.plum, ' opacity=".16"') + r(x, by - 54, 22, 54, body, 10) + r(x + 4, by - 48, 5, 40, '#FFFFFF', 2, ' opacity=".35"') + r(x, by - 30, 22, 7, empty ? '#E4E8EB' : '#FFFFFF', 0, ' opacity=".85"') +
      r(x + 7, by - 62, 8, 10, C.gearHi, 2) + r(x + 3, by - 66, 16, 5, C.gear, 2) + r(x + 15, by - 60, 7, 4, C.gearHi, 2);
  };
  J.tankRack = function (x, by, colors) {
    var n = colors.length, wd = n * 28 + 14, h = J.shadow(x + wd / 2, by + 8, wd * .52, 6) + r(x, by - 46, wd, 8, C.woodDark, 3), i;
    for (i = 0; i < n; i++) { h += J.tank(x + 8 + i * 28, by - 2, colors[i] === 'empty' ? null : colors[i], colors[i] === 'empty'); }
    return h + J.block(x, by - 6, wd, 6, C.wood, C.woodFront, 6, 3);
  };
  J.wetsuit = function (cx, y, col, trim) {
    return r(cx - 2, y - 10, 4, 10, C.plum) + '<path d="M' + (cx - 10) + ',' + y + ' Q' + cx + ',' + (y - 6) + ' ' + (cx + 10) + ',' + y + '" stroke="' + C.plum + '" stroke-width="2.4" fill="none"/>' +
      '<path d="M' + (cx - 12) + ',' + y + ' L' + (cx - 24) + ',' + (y + 30) + ' L' + (cx - 18) + ',' + (y + 34) + ' L' + (cx - 11) + ',' + (y + 20) + ' L' + (cx - 11) + ',' + (y + 46) + ' L' + (cx - 14) + ',' + (y + 82) + ' H' + (cx - 3) + ' L' + cx + ',' + (y + 50) + ' L' + (cx + 3) + ',' + (y + 82) + ' H' + (cx + 14) + ' L' + (cx + 11) + ',' + (y + 46) + ' L' + (cx + 11) + ',' + (y + 20) + ' L' + (cx + 18) + ',' + (y + 34) + ' L' + (cx + 24) + ',' + (y + 30) + ' L' + (cx + 12) + ',' + y + 'Z" fill="' + col + '"/>' +
      r(cx - 2, y + 2, 4, 40, trim, 2) + r(cx - 11, y + 22, 22, 4, trim, 2, ' opacity=".7"');
  };
  J.fins = function (cx, by, col, trim) { function one(x) { return '<path d="M' + (x - 7) + ',' + (by - 52) + ' H' + (x + 7) + ' L' + (x + 13) + ',' + (by - 4) + ' Q' + x + ',' + (by + 4) + ' ' + (x - 13) + ',' + (by - 4) + 'Z" fill="' + col + '"/>' + r(x - 6, by - 52, 12, 16, trim, 4); } return J.shadow(cx, by + 2, 26, 4) + one(cx - 14) + one(cx + 14); };
  J.mask = function (cx, cy, frame, strap) { return r(cx - 24, cy - 2, 48, 5, strap || C.gear, 2) + r(cx - 17, cy - 11, 34, 22, frame || C.gear, 9) + r(cx - 13, cy - 7, 12, 14, C.glassDk, 5) + r(cx + 1, cy - 7, 12, 14, C.glassDk, 5) + '<path d="M' + (cx - 10) + ',' + (cy - 3) + ' l4,-2" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>'; };
  J.reg = function (cx, cy) { return '<circle cx="' + cx + '" cy="' + cy + '" r="10" fill="' + C.steel + '"/><circle cx="' + cx + '" cy="' + cy + '" r="5" fill="' + C.steelLt + '"/><path d="M' + (cx + 8) + ',' + (cy + 4) + ' C' + (cx + 26) + ',' + (cy + 10) + ' ' + (cx + 22) + ',' + (cy + 30) + ' ' + (cx + 8) + ',' + (cy + 30) + '" stroke="' + C.gear + '" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="' + (cx + 6) + '" cy="' + (cy + 30) + '" r="7" fill="' + C.gearLt + '"/><circle cx="' + (cx - 10) + '" cy="' + (cy + 24) + '" r="7" fill="#FFFFFF"/><path d="M' + (cx - 10) + ',' + (cy + 24) + ' l3,-4" stroke="#D9614A" stroke-width="2" stroke-linecap="round"/>'; };
  J.bcd = function (cx, y, col) { return '<path d="M' + (cx - 20) + ',' + y + ' Q' + (cx - 12) + ',' + (y - 6) + ' ' + (cx - 6) + ',' + y + ' L' + (cx - 6) + ',' + (y + 8) + ' Q' + cx + ',' + (y + 14) + ' ' + (cx + 6) + ',' + (y + 8) + ' L' + (cx + 6) + ',' + y + ' Q' + (cx + 12) + ',' + (y - 6) + ' ' + (cx + 20) + ',' + y + ' L' + (cx + 26) + ',' + (y + 22) + ' Q' + (cx + 20) + ',' + (y + 36) + ' ' + (cx + 20) + ',' + (y + 54) + ' H' + (cx - 20) + ' Q' + (cx - 20) + ',' + (y + 36) + ' ' + (cx - 26) + ',' + (y + 22) + 'Z" fill="' + (col || C.gear) + '"/>' + r(cx - 14, y + 28, 28, 6, C.gearHi, 3) + '<path d="M' + (cx + 16) + ',' + (y + 6) + ' q8,12 2,26" stroke="' + C.gearHi + '" stroke-width="3" fill="none"/>'; };
  /* compressor, front-on: cabinet, gauges, a charging whip */
  J.compressor = function (x, by, accent) {
    return J.shadow(x + 60, by + 4, 64, 8) + J.block(x, by - 92, 120, 70, C.steelLt, C.steel, 22, 10) + '<circle cx="' + (x + 30) + '" cy="' + (by - 64) + '" r="15" fill="#FFFFFF"/><path d="M' + (x + 30) + ',' + (by - 64) + ' l9,-7" stroke="#D9614A" stroke-width="3" stroke-linecap="round"/><circle cx="' + (x + 66) + '" cy="' + (by - 64) + '" r="11" fill="#FFFFFF"/><path d="M' + (x + 66) + ',' + (by - 64) + ' l-6,-6" stroke="' + C.plum + '" stroke-width="2.6" stroke-linecap="round"/>' +
      r(x + 88, by - 80, 22, 34, accent, 4) + r(x + 14, by - 40, 92, 8, C.steel, 3) + '<path d="M' + (x + 120) + ',' + (by - 50) + ' C' + (x + 150) + ',' + (by - 50) + ' ' + (x + 150) + ',' + (by - 16) + ' ' + (x + 168) + ',' + (by - 16) + '" stroke="' + C.gear + '" stroke-width="4" fill="none" stroke-linecap="round"/>';
  };
  /* rinse bin: a tub seen from above-front, water inside, gear soaking */
  J.rinseBin = function (x, y, wd, ht, front) {
    return J.shadow(x + wd / 2, y + ht + 16, wd * .5, 6) + J.block(x, y, wd, ht, '#FFFFFF', front, 14, 8) + r(x + 5, y + 5, wd - 10, ht - 10, C.water, 5) + r(x + 10, y + ht * .4, wd * .4, 3, '#FFFFFF', 2, ' opacity=".7"');
  };
  J.shelf = function (x, y, wd) { return J.block(x, y, wd, 8, '#FFFFFF', C.postEdge, 5, 3); };
  /* dive board / whiteboard on a wall, front-on */
  J.board = function (x, y, wd, ht, c) {
    var h = J.shadow(x + wd / 2, y + ht + 8, wd * .45, 5) + r(x, y, wd, ht, C.woodDark, 6) + r(x + 5, y + 5, wd - 10, ht - 10, '#FFFFFF', 4), i;
    for (i = 0; i < 3; i++) { h += r(x + 14, y + 14 + i * 12, (wd - 28) * (.9 - i * .2), 4, i === 1 ? c.accent : c.soft, 2); }
    return h + '<circle cx="' + (x + wd - 22) + '" cy="' + (y + ht - 20) + '" r="10" fill="' + C.water + '"/><circle cx="' + (x + wd - 24) + '" cy="' + (y + ht - 22) + '" r="4" fill="' + C.leafLt + '"/>';
  };
  /* POS screen on a stand, Josie's: plum frame, tiles in the place's colors */
  J.screen = function (x, by, c) { return r(x, by - 60, 66, 46, C.plum, 8) + r(x + 6, by - 54, 54, 34, '#FFF7F9', 4) + r(x + 10, by - 50, 13, 10, c.soft, 2) + r(x + 26, by - 50, 13, 10, '#FFFFFF', 2) + r(x + 42, by - 50, 13, 10, c.soft, 2) + r(x + 10, by - 36, 13, 10, '#FFFFFF', 2) + r(x + 26, by - 36, 13, 10, c.soft, 2) + r(x + 42, by - 36, 13, 10, c.accent, 2) + r(x + 30, by - 14, 6, 8, C.plum) + r(x + 20, by - 7, 26, 6, C.plum, 3); };
  /* beds, from above-front */
  J.bed = function (x, y, wd, ht, cover, pillow) { return J.shadow(x + wd / 2, y + ht + 12, wd * .5, 6) + J.block(x, y, wd, ht, '#FFFFFF', C.woodFront, 12, 8) + r(x, y + ht * .42, wd, ht * .58, cover, 8) + r(x, y + ht * .42, wd, 7, '#FFFFFF', 3, ' opacity=".45"') + r(x + 6, y + 6, wd - 12, ht * .22, pillow || '#EEF4F8', 6); };
  J.bunk = function (x, y, wd, ht, c1, c2) { return J.bed(x, y + 22, wd, ht, c1) + r(x - 4, y - 6, 6, ht + 46, C.woodDark, 2) + r(x + wd - 2, y - 6, 6, ht + 46, C.woodDark, 2) + J.block(x, y - 4, wd, ht * .5, '#FFFFFF', C.woodFront, 8, 6) + r(x, y + ht * .12, wd, ht * .38 - 4, c2, 6) + r(x + wd + 4, y + 10, 10, 3, C.woodDark) + r(x + wd + 4, y + 26, 10, 3, C.woodDark) + r(x + wd + 4, y + 42, 10, 3, C.woodDark) + r(x + wd + 12, y + 4, 3, 50, C.woodDark); };
  J.toilet = function (x, y) { return e(x + 12, y + 30, 13, 15, '#FFFFFF') + e(x + 12, y + 30, 8, 10, C.glass) + r(x, y, 24, 14, '#FFFFFF', 4); };
  J.sink = function (x, y) { return J.block(x, y, 40, 22, '#FFFFFF', C.postEdge, 8, 6) + e(x + 20, y + 11, 13, 7, C.glassDk) + r(x + 18, y - 6, 4, 10, C.steel, 2); };
  J.shower = function (x, y, wd, ht) { var h = r(x, y, wd, ht, C.glass, 6), i; for (i = 8; i < wd; i += 10) { h += r(x + i, y + 4, 2, ht - 8, '#FFFFFF', 1, ' opacity=".8"'); } return h + '<circle cx="' + (x + wd / 2) + '" cy="' + (y + ht / 2) + '" r="4" fill="' + C.steel + '"/>'; };
  J.ac = function (x, y) { return J.block(x, y, 58, 18, '#FFFFFF', C.postEdge, 6, 6) + r(x + 6, y + 10, 46, 2, C.steel) + r(x + 6, y + 14, 46, 2, C.steel) + '<circle cx="' + (x + 50) + '" cy="' + (y + 5) + '" r="2" fill="#7CC9A2"/>'; };
  /* bicycle and scooter, from above */
  J.bike = function (cx, cy, col, rot) { return '<g transform="translate(' + cx + ',' + cy + ') rotate(' + (rot || 0) + ')">' + J.shadow(4, 4, 18, 46, .12) + '<rect x="-4" y="-56" width="8" height="30" rx="4" fill="' + C.gear + '"/><rect x="-4" y="26" width="8" height="30" rx="4" fill="' + C.gear + '"/><rect x="-3" y="-30" width="6" height="58" rx="3" fill="' + col + '"/><rect x="-18" y="-34" width="36" height="5" rx="2.5" fill="' + C.gearLt + '"/><rect x="-6" y="8" width="12" height="16" rx="5" fill="' + C.plum + '"/></g>'; };
  J.scooter = function (cx, cy, col, rot) { return '<g transform="translate(' + cx + ',' + cy + ') rotate(' + (rot || 0) + ')">' + J.shadow(4, 6, 24, 56, .12) + '<rect x="-15" y="-58" width="30" height="116" rx="15" fill="' + col + '"/><rect x="-11" y="-6" width="22" height="42" rx="10" fill="' + C.gear + '"/><rect x="-26" y="-46" width="52" height="7" rx="3.5" fill="' + C.gearLt + '"/><circle cx="0" cy="-52" r="5" fill="' + C.bulb + '"/><rect x="-5" y="46" width="10" height="16" rx="4" fill="' + C.gear + '"/></g>'; };
  J.grill = function (x, y) { return J.shadow(x + 40, y + 52, 42, 6) + J.block(x, y, 80, 30, C.gearLt, C.gear, 16, 8) + r(x + 6, y + 6, 68, 18, C.gear, 4) + '<path d="M' + (x + 14) + ',' + (y + 8) + ' v14 M' + (x + 28) + ',' + (y + 8) + ' v14 M' + (x + 42) + ',' + (y + 8) + ' v14 M' + (x + 56) + ',' + (y + 8) + ' v14 M' + (x + 68) + ',' + (y + 8) + ' v14" stroke="' + C.gearHi + '" stroke-width="2.4"/>'; };
  J.outdoorShower = function (cx, by) { return J.shadow(cx, by + 4, 30, 6) + r(cx - 30, by - 30, 60, 30, C.steelPale, 6) + r(cx - 3, by - 96, 6, 70, C.steel, 2) + r(cx - 3, by - 98, 24, 6, C.steel, 3) + '<circle cx="' + (cx + 20) + '" cy="' + (by - 90) + '" r="7" fill="' + C.steelLt + '"/>'; };
})(window);
