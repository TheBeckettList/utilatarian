/* The island kit: islands, archipelagos and their activity spots, drawn in the hand of Josie's bay map (josiescafe/art/bay.js),
   the island-scale twin of her cafe board. Needs josie.js (and world.js for a few props). Plain ES5, no build.

   The look, lifted from bay.js:
     sea        a soft diagonal gradient (#93D1E2 -> #6DB5D0) with short white wave ticks
     shallows   two wide pale strokes round every coast (#C6E9F0, then #DDF3F7), reef patches inside them
     land       peach sand (#F7DCC4), a lighter beach band just inside the coast (#FBEFE4), a white dotted waterline
     green      layered blobs (#A9D6B5, #9BCDAB, #86C09B hills), lagoons (#BEE5EA / #A5D8E2), bushes (#7DBE9C / #97D0B1)
     towns      blob houses with pastel roofs (pink, apricot, sand, sea, clay) along a white road; palms on the beach
     life       sailboats, a dive boat on its buoy, an eagle ray, a school of reef fish; nothing that isn't really there

   Real shape under the art: each outline below is a rough trace of the real coastline (approximate, north up, 1 unit = 100 m),
   so islands keep their true proportions and their towns sit on the right shore. Small islands may be drawn enlarged on a
   region map (the art-pass "enlarge" rule); the ratio is passed in and stays visible in code.

   Density is part of the art: how many houses, roads and boats an island gets comes from its density (0 quiet .. 3 dense),
   so Utila reads as a small town on a bay and Koh Samui as a ring road lined with houses, at any zoom.

   Activity spots: an island map shows at most UJ.isle.MAX_SPOTS (5) spots, like the map in a farming game. Each is a little
   landmark on a sand clearing with a name pill. More than five: the first five by priority are drawn; the rest live in the sheet. */
(function (w) {
  'use strict';
  var J = w.UJ, I = J.isle = {};
  I.MAX_SPOTS = 5;

  var K = I.K = {
    sea1: '#93D1E2', sea2: '#85C8DC', sea3: '#6DB5D0', shelf: '#C6E9F0', shelf2: '#DDF3F7',
    sand: '#F7DCC4', beach: '#FBEFE4', beach2: '#FFF6EA', green1: '#A9D6B5', green2: '#9BCDAB', hill: '#86C09B', hill2: '#76B48D',
    lagoon: '#BEE5EA', lagoon2: '#A5D8E2', bush: '#7DBE9C', bushLt: '#97D0B1', leaf: '#6DB28F', trunk: '#B98C66',
    road: '#FFFFFF', roadEdge: '#E9E1D8', roadDash: '#EAD3BC', wall: '#FFF8F0', wallEdge: '#E2D7CC', door: '#C9A98F', ink: '#7A625B', shade: '#3B2925',
    roofs: ['#F5B5C8', '#F2A66B', '#EAD9C5', '#7FC6D6', '#C9A98F']
  };

  /* ---------- geometry ---------- */
  function rng(seed) { var k = (seed * 9301 + 49297) % 233280; return function () { k = (k * 9301 + 49297) % 233280; return k / 233280; }; }
  function n1(v) { return (+v).toFixed(1); }
  function smooth(p) {
    var n = p.length, d = 'M' + n1((p[0][0] + p[n - 1][0]) / 2) + ',' + n1((p[0][1] + p[n - 1][1]) / 2), i, c, q;
    for (i = 0; i < n; i++) { c = p[i]; q = p[(i + 1) % n]; d += ' Q' + n1(c[0]) + ',' + n1(c[1]) + ' ' + n1((c[0] + q[0]) / 2) + ',' + n1((c[1] + q[1]) / 2); }
    return d + 'Z';
  }
  function smoothOpen(p) {
    var d = 'M' + n1(p[0][0]) + ',' + n1(p[0][1]), i, mx, my;
    for (i = 1; i < p.length - 1; i++) { mx = (p[i][0] + p[i + 1][0]) / 2; my = (p[i][1] + p[i + 1][1]) / 2; d += ' Q' + n1(p[i][0]) + ',' + n1(p[i][1]) + ' ' + n1(mx) + ',' + n1(my); }
    return d + ' L' + n1(p[p.length - 1][0]) + ',' + n1(p[p.length - 1][1]);
  }
  function centroid(p) { var x = 0, y = 0, i; for (i = 0; i < p.length; i++) { x += p[i][0]; y += p[i][1]; } return [x / p.length, y / p.length]; }
  /* inward unit normals of a closed outline (works for any winding) */
  function normals(p) {
    var n = p.length, out = [], i, a, b, tx, ty, l, area = 0;
    for (i = 0; i < n; i++) { a = p[i]; b = p[(i + 1) % n]; area += a[0] * b[1] - b[0] * a[1]; }
    var sg = area > 0 ? 1 : -1;
    for (i = 0; i < n; i++) { a = p[(i - 1 + n) % n]; b = p[(i + 1) % n]; tx = b[0] - a[0]; ty = b[1] - a[1]; l = Math.sqrt(tx * tx + ty * ty) || 1; out.push([-ty / l * sg, tx / l * sg]); }
    return out;
  }
  /* move every point inward by d (negative d moves outward) */
  function inset(p, d) { var N = normals(p), out = [], i; for (i = 0; i < p.length; i++) { out.push([p[i][0] + N[i][0] * d, p[i][1] + N[i][1] * d]); } return out; }
  function place(pts, o) {
    var a = (o.rot || 0) * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a), out = [], i, x, y;
    for (i = 0; i < pts.length; i++) { x = pts[i][0] * o.s; y = pts[i][1] * o.s; out.push([o.x + x * ca - y * sa, o.y + x * sa + y * ca]); }
    return out;
  }
  function pt(u, o) { return place([u], o)[0]; }
  I.geo = { smooth: smooth, smoothOpen: smoothOpen, inset: inset, place: place, centroid: centroid, rng: rng };

  /* ---------- pieces (bay.js, kept in Josie's exact hand) ---------- */
  function blob(cx, cy, rx, ry, seed, irr) {
    var n = 11, pts = [], i, a, r, k = seed * 9301 + 49297;
    for (i = 0; i < n; i++) { k = (k * 9301 + 49297) % 233280; r = 1 - (irr || .22) + (k / 233280) * (irr || .22) * 2; a = i / n * Math.PI * 2; pts.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r]); }
    return smooth(pts);
  }
  I.blob = blob;
  I.reef = function (cx, cy, rx, ry, seed) {
    var h = '<path d="' + blob(cx, cy, rx * 1.18, ry * 1.18, seed, .2) + '" fill="#B9E7E3" opacity=".7"/><path d="' + blob(cx, cy, rx, ry, seed + 1, .26) + '" fill="#8FD9CF" opacity=".85"/>' +
      '<path d="' + blob(cx, cy, rx * .62, ry * .6, seed + 2, .3) + '" fill="#C9EEDF" opacity=".9"/>', i, k = seed * 7, ang, rad, dr = Math.max(2.5, Math.min(rx, ry) * .12);
    for (i = 0; i < 7; i++) { k = (k * 9301 + 49297) % 233280; ang = k / 233280 * 6.283; rad = ((k * 7) % 100) / 100 * .8; h += '<circle cx="' + n1(cx + Math.cos(ang) * rx * rad) + '" cy="' + n1(cy + Math.sin(ang) * ry * rad) + '" r="' + n1(dr + (k % 9) * dr / 8) + '" fill="#5FBFB3" opacity=".45"/>'; }
    return h;
  };
  I.palm = function (x, y, sc) {
    var h = '<g transform="translate(' + n1(x) + ',' + n1(y) + ') scale(' + sc + ')"><ellipse cx="4" cy="6" rx="22" ry="7" fill="' + K.shade + '" opacity=".12"/><path d="M0,0 Q6,-30 2,-56" stroke="' + K.trunk + '" stroke-width="6" fill="none" stroke-linecap="round"/>', i;
    for (i = 0; i < 6; i++) { h += '<path d="M2,-56 Q' + n1(30 * Math.cos(i * 1.05 - .5)) + ',' + n1(-56 + 22 * Math.sin(i * 1.05 - .5) - 18) + ' ' + n1(46 * Math.cos(i * 1.05 - .5)) + ',' + n1(-56 + 30 * Math.sin(i * 1.05 - .5)) + '" stroke="' + K.leaf + '" stroke-width="9" fill="none" stroke-linecap="round"/>'; }
    return h + '</g>';
  };
  I.bush = function (x, y, r) { return '<circle cx="' + n1(x) + '" cy="' + n1(y) + '" r="' + n1(r) + '" fill="' + K.bush + '"/><circle cx="' + n1(x - r * .35) + '" cy="' + n1(y - r * .3) + '" r="' + n1(r * .55) + '" fill="' + K.bushLt + '"/>'; };
  /* a house from above: white walls, a soft pastel roof, a ridge highlight, a door step (bay.js bldg) */
  I.bldg = function (x, y, wd, ht, roof, rot, seed) {
    seed = seed || (Math.round(x * 3 + y * 7) % 90) + 3;
    return '<g transform="translate(' + n1(x) + ',' + n1(y) + ') rotate(' + n1(rot || 0) + ')"><ellipse cx="2" cy="' + n1(ht * .52) + '" rx="' + n1(wd * .56) + '" ry="' + n1(ht * .22) + '" fill="' + K.shade + '" opacity=".13"/>' +
      '<path d="' + blob(0, 3, wd * .5, ht * .46, seed + 1, .1) + '" fill="' + K.wall + '" stroke="' + K.wallEdge + '" stroke-width="1.4"/>' +
      '<path d="' + blob(0, -1, wd * .52, ht * .44, seed, .13) + '" fill="' + roof + '" stroke="#FFFFFF" stroke-opacity=".6" stroke-width="1.2"/>' +
      '<path d="M' + n1(-wd * .34) + ',-1 Q0,' + n1(-ht * .1) + ' ' + n1(wd * .34) + ',-1" stroke="#FFFFFF" stroke-opacity=".55" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
      '<path d="' + blob(wd * .12, ht * .46, wd * .14, ht * .1, seed + 2, .2) + '" fill="' + K.door + '"/></g>';
  };
  /* a house on stilts over the water (Guanaja's Bonacca, Utila's cays) */
  I.stilt = function (x, y, wd, roof, seed) {
    var h = '<g transform="translate(' + n1(x) + ',' + n1(y) + ')"><ellipse cx="3" cy="' + n1(wd * .55) + '" rx="' + n1(wd * .6) + '" ry="' + n1(wd * .14) + '" fill="#4A8FA8" opacity=".25"/>';
    h += '<g fill="' + K.trunk + '"><rect x="' + n1(-wd * .38) + '" y="0" width="3" height="' + n1(wd * .5) + '" rx="1.5"/><rect x="' + n1(wd * .32) + '" y="0" width="3" height="' + n1(wd * .5) + '" rx="1.5"/></g>';
    return h + I.bldg(0, 0, wd, wd * .74, roof, 0, seed) + '</g>';
  };
  I.sail = function (x, y, s, col) {
    return '<g transform="translate(' + n1(x) + ',' + n1(y) + ') scale(' + s + ')">' +
      '<ellipse cx="0" cy="24" rx="46" ry="8" fill="#FFFFFF" opacity=".35"/>' +
      '<path d="M-36,12 Q0,36 36,12 L30,0 H-30 Z" fill="#FFFFFF" stroke="' + K.wallEdge + '" stroke-width="3" stroke-linejoin="round"/><path d="M-32,8 H32" stroke="' + col + '" stroke-width="4"/>' +
      '<rect x="-1.6" y="-88" width="3.2" height="92" rx="1.6" fill="' + K.ink + '"/>' +
      '<path d="M5,-84 L5,-5 L42,-5 Z" fill="#FFFFFF" stroke="' + K.wallEdge + '" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<path d="M-5,-74 L-5,-5 L-30,-5 Z" fill="' + col + '" stroke="#FFFFFF" stroke-width="2" stroke-linejoin="round"/><path d="M0,-88 l16,5 l-16,5 z" fill="' + col + '"/></g>';
  };
  /* a small open dive boat from above, its stripe in the shop's color, the dive flag flying */
  I.diveBoat = function (x, y, sc, col, rot) {
    col = col || '#EC5C97';
    return '<g transform="translate(' + n1(x) + ',' + n1(y) + ') rotate(' + (rot || 0) + ') scale(' + sc + ')"><ellipse cx="0" cy="24" rx="70" ry="11" fill="#FFFFFF" opacity=".4"/>' +
      '<path d="M-58,4 L52,4 Q66,4 72,-8 L72,12 Q60,26 40,26 L-44,26 Q-58,26 -58,12 Z" fill="#FFFFFF" stroke="' + K.wallEdge + '" stroke-width="3" stroke-linejoin="round"/><path d="M-56,14 H68" stroke="' + col + '" stroke-width="5"/>' +
      '<rect x="-36" y="-14" width="46" height="18" rx="5" fill="#B9E2EA" stroke="#FFFFFF" stroke-width="3"/>' +
      '<path d="M38,4 V-30" stroke="' + K.ink + '" stroke-width="2.4"/><path d="M38,-30 h22 v14 h-22 z" fill="#E24D5C"/><path d="M38,-30 L60,-16" stroke="#FFFFFF" stroke-width="3.4"/>' +
      '<circle cx="-70" cy="30" r="3" fill="#FFFFFF" opacity=".8"/><circle cx="-78" cy="38" r="2.2" fill="#FFFFFF" opacity=".7"/></g>';
  };
  /* the ferry: a long white boat with a colored band (Utila Dream's is drawn generic: white with a sea-blue band) */
  I.ferry = function (x, y, sc, col, rot) {
    col = col || '#3E86B8';
    return '<g transform="translate(' + n1(x) + ',' + n1(y) + ') rotate(' + (rot || 0) + ') scale(' + sc + ')"><ellipse cx="-10" cy="22" rx="96" ry="12" fill="#FFFFFF" opacity=".4"/>' +
      '<path d="M-88,0 L66,0 Q92,0 100,14 Q92,28 66,28 L-88,28 Q-96,28 -96,14 Q-96,0 -88,0Z" fill="#FFFFFF" stroke="' + K.wallEdge + '" stroke-width="3"/>' +
      '<rect x="-70" y="6" width="120" height="16" rx="7" fill="#B9E2EA"/><path d="M-92,22 H92" stroke="' + col + '" stroke-width="5"/>' +
      '<g fill="#FFFFFF" opacity=".75"><circle cx="-104" cy="10" r="3"/><circle cx="-112" cy="18" r="2.4"/><circle cx="-106" cy="24" r="2"/></g></g>';
  };
  /* a Thai longtail boat: a slim wooden hull, a colored garland at the bow, the long propeller shaft */
  I.longtail = function (x, y, sc, col, rot) {
    col = col || '#9B6BD6';
    return '<g transform="translate(' + n1(x) + ',' + n1(y) + ') rotate(' + (rot || 0) + ') scale(' + sc + ')"><ellipse cx="-6" cy="12" rx="70" ry="8" fill="#FFFFFF" opacity=".35"/>' +
      '<path d="M-60,0 Q0,-12 64,-14 Q56,0 64,14 Q0,12 -60,0Z" fill="#B98C66"/><path d="M-50,0 Q0,-6 54,-8 Q50,0 54,8 Q0,6 -50,0Z" fill="#D9B48A"/>' +
      '<path d="M58,-12 l10,-8 M58,12 l10,8" stroke="' + col + '" stroke-width="4" stroke-linecap="round"/><circle cx="66" cy="0" r="5" fill="' + col + '"/>' +
      '<rect x="-30" y="-9" width="34" height="18" rx="4" fill="' + col + '" opacity=".75"/><path d="M-60,0 L-96,0" stroke="' + K.ink + '" stroke-width="2.6" stroke-linecap="round"/><circle cx="-98" cy="0" r="3" fill="' + K.ink + '"/></g>';
  };
  I.ray = function (x, y, sc, rot) {
    return '<g transform="translate(' + n1(x) + ',' + n1(y) + ') rotate(' + rot + ') scale(' + sc + ')"><ellipse cx="0" cy="12" rx="36" ry="8" fill="' + K.shade + '" opacity=".1"/>' +
      '<path d="M-26,0 Q-62,-3 -92,3" stroke="#4A6579" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
      '<path d="M28,0 Q12,-10 -2,-38 Q-9,-20 -24,-7 L-32,0 L-24,7 Q-9,20 -2,38 Q12,10 28,0 Z" fill="#5F7F95"/><path d="M26,0 Q10,-6 -2,-26 Q-8,-12 -20,-4" fill="none" stroke="#8FB0C4" stroke-width="2" stroke-linecap="round" opacity=".7"/>' +
      '<ellipse cx="24" cy="0" rx="10" ry="7.5" fill="#6E91A8"/><circle cx="27" cy="-4" r="1.7" fill="#1B2B36"/><circle cx="27" cy="4" r="1.7" fill="#1B2B36"/>' +
      '<g fill="#FFFFFF" opacity=".9"><circle cx="6" cy="-12" r="2.3"/><circle cx="-6" cy="-21" r="1.9"/><circle cx="8" cy="11" r="2.1"/><circle cx="-8" cy="18" r="1.9"/><circle cx="-1" cy="0" r="2.5"/><circle cx="-14" cy="-6" r="1.7"/><circle cx="-14" cy="8" r="1.7"/><circle cx="14" cy="-2" r="1.6"/></g></g>';
  };
  /* a whale shark, seen from above: Utila's famous visitor, spotted, slow (drawn only where they really pass) */
  I.whaleShark = function (x, y, sc, rot) {
    var h = '<g transform="translate(' + n1(x) + ',' + n1(y) + ') rotate(' + rot + ') scale(' + sc + ')" opacity=".8"><path d="M70,0 Q60,-20 20,-22 Q-40,-20 -80,-6 L-120,-26 L-108,0 L-120,26 L-80,6 Q-40,20 20,22 Q60,20 70,0Z" fill="#4E6B80"/>' +
      '<path d="M-10,-20 L-30,-48 L-20,-18Z M-10,20 L-30,48 L-20,18Z" fill="#4E6B80"/><path d="M66,-4 Q72,0 66,4" stroke="#2F4555" stroke-width="3" fill="none"/>', i, k = 7;
    for (i = 0; i < 22; i++) { k = (k * 9301 + 49297) % 233280; h += '<circle cx="' + n1(-70 + (k % 130)) + '" cy="' + n1(-14 + ((k >> 4) % 28)) + '" r="2.2" fill="#E9F4F8" opacity=".85"/>'; }
    return h + '</g>';
  };
  function fish(x, y, sc, rot, col) { return '<g transform="translate(' + n1(x) + ',' + n1(y) + ') rotate(' + n1(rot) + ') scale(' + n1(sc) + ')"><path d="M-9,0 L-18,-7 L-18,7 Z" fill="' + col + '"/><ellipse cx="0" cy="0" rx="11" ry="6.5" fill="' + col + '"/><path d="M-2,-6 Q3,-2 -2,6" stroke="#FFFFFF" stroke-width="1.6" fill="none" opacity=".7"/><circle cx="6" cy="-1.5" r="1.5" fill="' + K.shade + '"/></g>'; }
  I.school = function (cx, cy, n, spread, sc) {
    var out = '', i, R = rng(Math.round(cx * 3 + cy)), cols = ['#F5B5C8', '#F2A66B', '#7FC6D6', '#F7D365', '#EC5C97'];
    for (i = 0; i < n; i++) { out += fish(cx + (R() - .5) * spread * 2, cy + (R() - .5) * spread, (sc || 1) * (.55 + R() * .3), (i % 2 ? 170 : -8) + R() * 20, cols[i % cols.length]); }
    return out;
  };
  I.waves = function (list, s) { var d = '', i, q = 22 * (s || 1); for (i = 0; i < list.length; i++) { d += 'M' + n1(list[i][0]) + ',' + n1(list[i][1]) + ' q' + n1(q) + ',' + n1(-q * .45) + ' ' + n1(q * 2) + ',0 '; } return '<path d="' + d + '" stroke="#FFFFFF" stroke-width="' + n1(7 * (s || 1)) + '" fill="none" stroke-linecap="round" opacity=".8"/>'; };
  I.seaFill = function (id, W, H) { return '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + K.sea1 + '"/><stop offset=".55" stop-color="' + K.sea2 + '"/><stop offset="1" stop-color="' + K.sea3 + '"/></linearGradient></defs><rect width="' + W + '" height="' + H + '" fill="url(#' + id + ')"/>'; };
  /* a sea route (ferry, boat trip): a soft dashed white line with a little dot at each end, like a path on a game map */
  I.route = function (pts, s) {
    s = s || 1;
    return '<path d="' + smoothOpen(pts) + '" stroke="#FFFFFF" stroke-width="' + n1(5 * s) + '" fill="none" stroke-dasharray="' + n1(2 * s) + ' ' + n1(16 * s) + '" stroke-linecap="round" opacity=".9"/>' +
      '<circle cx="' + n1(pts[0][0]) + '" cy="' + n1(pts[0][1]) + '" r="' + n1(6 * s) + '" fill="#FFFFFF"/><circle cx="' + n1(pts[pts.length - 1][0]) + '" cy="' + n1(pts[pts.length - 1][1]) + '" r="' + n1(6 * s) + '" fill="#FFFFFF"/>';
  };
  /* a pier from above (bay.js ferry pier, generic): planks, posts, a colored land end */
  I.pier = function (x, y, len, wd, rot, col) {
    var h = '<g transform="translate(' + n1(x) + ',' + n1(y) + ') rotate(' + rot + ')"><rect x="' + n1(-wd / 2 + 6) + '" y="6" width="' + wd + '" height="' + len + '" rx="' + n1(wd * .22) + '" fill="' + K.shade + '" opacity=".09"/>' +
      '<rect x="' + n1(-wd / 2) + '" y="0" width="' + wd + '" height="' + len + '" rx="' + n1(wd * .22) + '" fill="#F6F1EA" stroke="#D9CEC2" stroke-width="' + n1(wd * .04) + '"/>', i;
    for (i = wd * .6; i < len - 6; i += wd * .46) { h += '<path d="M' + n1(-wd * .4) + ',' + n1(i) + ' h' + n1(wd * .8) + '" stroke="#E2D8CC" stroke-width="' + n1(wd * .03) + '" stroke-linecap="round"/>'; }
    return h + (col ? '<rect x="' + n1(-wd / 2) + '" y="0" width="' + wd + '" height="' + n1(wd * .36) + '" rx="' + n1(wd * .18) + '" fill="' + col + '"/>' : '') + '</g>';
  };

  /* ---------- the islands (rough traces of the real coastlines, 1 unit = 100 m, north up; approximate) ---------- */
  var S = I.SHAPES = {
    /* Utila: ~13 km E-W, narrow west, wide east with Pumpkin Hill; the town and ferry dock on East Harbour, the bay on the south-east shore */
    utila: {
      pts: [[-65, 6], [-58, 1], [-45, -3], [-30, -6], [-15, -10], [0, -14], [15, -18], [30, -22], [45, -25], [56, -23], [64, -15], [67, -3], [63, 9], [55, 17], [47, 19], [41, 15], [35, 18], [29, 23], [21, 22], [13, 18], [0, 16], [-15, 14], [-30, 13], [-45, 12], [-58, 11], [-64, 9]],
      density: 1, minW: 22,
      town: [[13, 19, 2]],                       /* East Harbour: points 13..19, two rows of houses */
      road: [12, 20],
      hills: [[50, -10, 11, 8, 'Pumpkin Hill']], lagoons: [[-22, 1, 14, 5]],
      reefs: [[-20, 24, 26, 6], [20, 31, 30, 6], [62, 22, 12, 8], [-50, -10, 16, 5], [30, -32, 26, 6]],
      cays: [[-52, 25, 3.2, 2.2, 1], [-45, 29, 2.6, 1.8, 1], [-38, 26, 2.2, 1.6, 0]]
    },
    /* Roatán: long and thin (~60 km), tilted WSW-ENE; West End and West Bay on the west tip, Coxen Hole and French Harbour on the south */
    roatan: {
      pts: [[-280, 14], [-270, 4], [-250, -2], [-210, -8], [-160, -14], [-100, -20], [-40, -26], [20, -30], [80, -34], [140, -36], [200, -36], [250, -34], [280, -28], [286, -20], [270, -14], [230, -10], [180, -6], [120, -2], [60, 4], [0, 10], [-60, 16], [-120, 22], [-180, 26], [-230, 28], [-262, 24]],
      density: 2, minW: 20,
      town: [[23, 24, 1], [0, 2, 1], [20, 22, 1], [17, 19, 1]],
      road: [1, 20],
      hills: [[-60, -2, 70, 7], [90, -16, 80, 7]], lagoons: [],
      reefs: [[-200, 38, 70, 6], [-40, 26, 90, 6], [120, 12, 80, 6], [-150, -26, 70, 6], [60, -46, 90, 6]],
      cays: [[312, -34, 14, 6, 0], [338, -36, 6, 3, 0]]
    },
    /* Guanaja: compact and steep, almost no roads; most people live on Bonacca, a cay of stilt houses off the south-east coast */
    guanaja: {
      pts: [[-75, 10], [-62, -10], [-38, -22], [-8, -30], [24, -28], [52, -18], [70, -2], [62, 14], [40, 22], [12, 26], [-18, 22], [-48, 22], [-68, 20]],
      density: 0, minW: 40,
      town: [[9, 10, 1]],
      road: null,
      hills: [[-10, -4, 40, 14], [30, -6, 20, 10]], lagoons: [],
      reefs: [[-20, 44, 60, 8], [60, 34, 26, 8], [-60, -30, 30, 6]],
      cays: [[30, 40, 10, 6, 2, 'stilt']]
    },
    /* Koh Tao: ~7 km N-S; Sairee Beach and Mae Haad on the west coast, Chalok on the south; Koh Nang Yuan off the north-west tip */
    kohtao: {
      pts: [[-6, -38], [6, -37], [14, -30], [18, -20], [12, -12], [18, -4], [20, 6], [14, 14], [18, 22], [12, 32], [2, 38], [-8, 36], [-12, 28], [-16, 18], [-14, 6], [-18, -6], [-16, -18], [-14, -30]],
      density: 2, minW: 22,
      town: [[15, 17, 1], [12, 14, 1], [10, 11, 1]],
      road: [10, 17],
      hills: [[2, -8, 10, 12], [0, 22, 8, 8]], lagoons: [],
      reefs: [[-28, -42, 8, 5], [24, -10, 6, 10], [-24, 10, 5, 12]],
      cays: [[-26, -42, 3.4, 2.4, 0], [-22, -46, 2.6, 2, 0]]
    },
    /* Koh Phangan: ~15 x 12 km, hilly and green; Thong Sala on the south-west, Haad Rin on the south-east tip */
    kohphangan: {
      pts: [[-60, -30], [-40, -52], [-10, -60], [25, -58], [55, -42], [70, -15], [66, 20], [50, 48], [20, 60], [-15, 58], [-45, 44], [-66, 16], [-70, -10]],
      density: 2, minW: 100,
      town: [[9, 11, 2], [7, 8, 1], [0, 1, 1]],
      road: [8, 12],
      hills: [[0, -10, 40, 30], [10, 20, 26, 16]], lagoons: [],
      reefs: [[-70, -40, 16, 8], [76, 40, 12, 10]],
      cays: []
    },
    /* Koh Samui: ~25 x 21 km, a mountain in the middle and a ring road round the coast; Chaweng on the east, Nathon on the west */
    kohsamui: {
      pts: [[-80, -60], [-45, -90], [0, -96], [50, -88], [90, -62], [110, -20], [105, 30], [80, 72], [40, 95], [-10, 100], [-60, 85], [-95, 50], [-110, 0], [-104, -36]],
      density: 3, minW: 180,
      town: [[4, 7, 2], [11, 13, 1], [1, 3, 1], [7, 9, 1]],
      road: 'ring',
      hills: [[-4, 0, 54, 46], [10, -10, 30, 24]], lagoons: [],
      reefs: [[120, 50, 14, 20], [-120, 60, 14, 10]],
      cays: [[-150, 40, 8, 5, 0], [-162, 62, 6, 4, 0], [-140, 70, 5, 3, 0]]
    }
  };

  /* ---------- an island, drawn ----------
     o = { x, y: where its 0,0 goes (px); s: px per unit; rot: degrees; detail: 'region' | 'island'; seed; houseScale }
     returns { svg, pts (screen outline), box: [x, y, w, h], at(u): unit -> screen } */
  I.draw = function (id, o) {
    var sh = typeof id === 'string' ? S[id] : id, isl = o.detail === 'island', P = place(sh.pts, o), R = rng(o.seed || 7), h = '', i, j, k, b;
    var px = function (v) { return v * (isl ? 1 : .42); };          /* stroke and prop sizes per zoom */
    var minPx = sh.minW * o.s;
    /* shallows and reefs */
    h += '<path d="' + smooth(P) + '" stroke="' + K.shelf + '" stroke-width="' + n1(px(isl ? 150 : 60)) + '" fill="none" stroke-linejoin="round"/><path d="' + smooth(P) + '" stroke="' + K.shelf2 + '" stroke-width="' + n1(px(isl ? 34 : 16)) + '" fill="none" stroke-linejoin="round"/>';
    (sh.reefs || []).forEach(function (rf, n) { var c = pt([rf[0], rf[1]], o); h += I.reef(c[0], c[1], rf[2] * o.s, rf[3] * o.s, 11 + n * 10); });
    /* cays */
    (sh.cays || []).forEach(function (c, n) {
      var cp = pt([c[0], c[1]], o), rx = c[2] * o.s, ry = c[3] * o.s;
      h += '<path d="' + blob(cp[0], cp[1], rx * 1.9, ry * 1.9, 31 + n, .14) + '" fill="' + K.shelf + '"/><path d="' + blob(cp[0], cp[1], rx, ry, 41 + n, .12) + '" fill="' + K.sand + '"/>' +
        '<path d="' + blob(cp[0], cp[1] - ry * .1, rx * .6, ry * .5, 51 + n, .16) + '" fill="' + K.green1 + '"/>';
      if (c[5] === 'stilt') { for (k = 0; k < (isl ? 9 : 5); k++) { h += I.stilt(cp[0] - rx * .8 + (k % 5) * rx * .4, cp[1] - ry * .5 + Math.floor(k / 5) * ry * .9, px(isl ? 26 : 30), K.roofs[k % 5], 70 + k); } }
      else if (c[4] && isl) { h += I.palm(cp[0], cp[1] + ry * .2, .3); }
    });
    /* land, beach band, waterline */
    h += '<path d="' + smooth(P) + '" fill="' + K.sand + '"/>';
    var g1 = Math.min(px(isl ? 62 : 22), minPx * .36), g2 = Math.min(px(isl ? 120 : 36), minPx * .46);
    h += '<path d="' + smooth(inset(P, g1)) + '" fill="' + K.green1 + '"/>';
    if (g2 > g1 + 2) { h += '<path d="' + smooth(inset(P, g2)) + '" fill="' + K.green2 + '"/>'; }
    (sh.hills || []).forEach(function (hl, n) { var c = pt([hl[0], hl[1]], o); h += '<path d="' + blob(c[0], c[1], hl[2] * o.s, hl[3] * o.s, 61 + n, .16) + '" fill="' + K.hill + '"/><path d="' + blob(c[0] - hl[2] * o.s * .15, c[1] - hl[3] * o.s * .2, hl[2] * o.s * .55, hl[3] * o.s * .5, 71 + n, .2) + '" fill="' + K.hill2 + '" opacity=".55"/>'; });
    (sh.lagoons || []).forEach(function (lg, n) { var c = pt([lg[0], lg[1]], o); h += '<path d="' + blob(c[0], c[1], lg[2] * o.s, lg[3] * o.s, 81 + n, .2) + '" fill="' + K.lagoon + '"/><path d="' + blob(c[0], c[1], lg[2] * o.s * .74, lg[3] * o.s * .7, 82 + n, .2) + '" fill="' + K.lagoon2 + '"/>'; });
    h += '<path d="' + smooth(inset(P, px(isl ? 9 : 4))) + '" stroke="' + K.beach + '" stroke-width="' + n1(px(isl ? 16 : 8)) + '" fill="none" opacity=".85"/>';
    h += '<path d="' + smooth(P) + '" stroke="#FFFFFF" stroke-width="' + n1(px(isl ? 8 : 6)) + '" fill="none" stroke-dasharray="' + n1(px(3)) + ' ' + n1(px(isl ? 22 : 30)) + '" stroke-linecap="round" opacity=".9"/>';
    /* bushes scattered in the green, more where it is wild (density low) */
    var nb = Math.round(P.length * (isl ? 1.6 : .7) * (sh.density >= 3 ? .6 : 1)), Pg = inset(P, g1 + px(isl ? 18 : 8));
    for (i = 0; i < nb; i++) { b = Pg[Math.floor(R() * Pg.length)]; h += I.bush(b[0] + (R() - .5) * px(30), b[1] + (R() - .5) * px(30), px(isl ? 9 + R() * 6 : 9)); }
    /* the road: along the town shore, or a ring road on a dense island */
    var roadPts = null;
    if (sh.road === 'ring') { roadPts = inset(P, px(isl ? 46 : 22)); h += roadPath(smooth(roadPts), isl); }
    else if (sh.road) { roadPts = inset(P, px(isl ? 46 : 22)).slice(sh.road[0], sh.road[1] + 1); h += roadPath(smoothOpen(roadPts), isl); }
    /* towns: houses in rows inland from the shore, along the given stretch of coast */
    /* o.reserve: [[x, y, r], ...] screen circles kept free of houses (where a participating place is drawn as itself) */
    function clear(x, y) { var rs = o.reserve || [], q; for (q = 0; q < rs.length; q++) { if ((x - rs[q][0]) * (x - rs[q][0]) + (y - rs[q][1]) * (y - rs[q][1]) < rs[q][2] * rs[q][2]) { return true; } } return false; }
    var hs = (o.houseScale || 1) * (isl ? 1 : .5), spacing = (isl ? 44 : 22) * (sh.density >= 2 ? .85 : 1.1);
    (sh.town || []).forEach(function (tw, ti) {
      var N = normals(P), a, c, tx, ty, l, n, t, row, q, ang;
      for (i = tw[0]; i < tw[1]; i++) {
        a = P[i]; c = P[(i + 1) % P.length]; tx = c[0] - a[0]; ty = c[1] - a[1]; l = Math.sqrt(tx * tx + ty * ty) || 1; n = Math.max(1, Math.floor(l / spacing));
        ang = Math.atan2(ty, tx) * 57.3; ang = ((ang + 90) % 180) - 90; ang = ang * .25;
        for (j = 0; j < n; j++) {
          q = (i * 31 + j * 17 + ti * 7) % 7; if (q === 0 || (sh.density < 1 && q === 3)) { continue; }
          for (row = 0; row < tw[2]; row++) {
            if (row === 1 && q % 2 && sh.density < 3) { continue; }
            t = (j + .5) / n; var nx = (N[i][0] + N[(i + 1) % P.length][0]) / 2, ny = (N[i][1] + N[(i + 1) % P.length][1]) / 2, dd = px(isl ? 72 : 32) + row * px(isl ? 48 : 22);
            if (clear(a[0] + tx * t + nx * dd, a[1] + ty * t + ny * dd)) { continue; }
            h += I.bldg(a[0] + tx * t + nx * dd, a[1] + ty * t + ny * dd, 30 * hs, 23 * hs, K.roofs[(i + j + row + ti) % 5], ang + (q - 3) * 2, 11 + i * 7 + j);
          }
        }
      }
    });
    /* a dense island also has houses scattered inland */
    if (sh.density >= 3) { var Pin = inset(P, px(isl ? 90 : 40)); for (i = 0; i < Pin.length * 2; i++) { b = Pin[Math.floor(R() * Pin.length)]; if (R() < .55 && !clear(b[0], b[1])) { h += I.bldg(b[0] + (R() - .5) * px(40), b[1] + (R() - .5) * px(40), 26 * hs, 20 * hs, K.roofs[i % 5], R() * 20 - 10, 300 + i); } } }
    /* palms on the beach band */
    var Pb = inset(P, px(isl ? 14 : 6)), np = Math.round(P.length * (isl ? .9 : .35));
    for (i = 0; i < np; i++) { b = Pb[Math.floor(R() * Pb.length)]; h += I.palm(b[0], b[1], isl ? .42 + R() * .14 : .2); }
    var xs = P.map(function (p) { return p[0]; }), ys = P.map(function (p) { return p[1]; });
    var bx = Math.min.apply(null, xs), by = Math.min.apply(null, ys);
    return { svg: h, pts: P, road: roadPts, box: [bx, by, Math.max.apply(null, xs) - bx, Math.max.apply(null, ys) - by], at: function (u) { return pt(u, o); } };
  };
  function roadPath(d, isl) {
    var wd = isl ? 26 : 9;
    return '<path d="' + d + '" stroke="' + K.roadEdge + '" stroke-width="' + (wd + (isl ? 8 : 3)) + '" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="' + d + '" stroke="' + K.road + '" stroke-width="' + wd + '" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
      (isl ? '<path d="' + d + '" stroke="' + K.roadDash + '" stroke-width="4" fill="none" stroke-dasharray="22 20"/>' : '');
  }

  /* ---------- activity spots ----------
     A spot is a little landmark on a sand clearing with a name pill: the island-map equivalent of a level door in a farming game.
     kind: eat | dive | stay | snorkel | sail | beach | hike | fish | rest | arrive
     o: { name, col (the offering place's color, if a participating place), soon (true: drawn faded, pill says soon), s (scale) } */
  function lm(kind, col) {
    switch (kind) {
      case 'eat': return J.umbrella(0, -16, 18, col || '#F5B5C8', '#FFFFFF') + J.roundTable(18, 4, 9, { noPot: true });
      case 'dive': return I.reef(0, -8, 24, 12, 3) + J.diveFlag(-12, -30, 0) + '<circle cx="6" cy="-4" r="6" fill="#FFFFFF"/><circle cx="6" cy="-4" r="3" fill="' + (col || '#3E86B8') + '"/>';
      case 'stay': return I.bldg(-10, -10, 32, 24, col || '#F2A66B', -4, 5) + I.bldg(16, 0, 24, 18, '#EAD9C5', 6, 9);
      case 'snorkel': return I.reef(0, -6, 26, 13, 7) + J.mask(0, -10, col || '#7FC6D6', '#2E3238');
      case 'sail': return '<ellipse cx="0" cy="0" rx="30" ry="10" fill="' + K.shelf + '"/>' + I.sail(0, -2, .32, col || '#7FC6D6');
      case 'beach': return J.umbrella(-12, -12, 16, col || '#F2A66B', '#FFFFFF') + J.umbrella(14, -6, 14, '#7FC6D6', '#FFFFFF');
      case 'hike': return '<path d="' + blob(-6, -6, 26, 16, 2, .12) + '" fill="' + K.hill + '"/><path d="' + blob(-10, -12, 14, 9, 4, .14) + '" fill="' + K.hill2 + '"/>' + J.pennant(-4, -14, col || '#F2B632');
      case 'fish': return '<ellipse cx="0" cy="0" rx="28" ry="9" fill="' + K.shelf + '"/>' + '<g transform="translate(0,4) scale(.6)">' + J.pelican(0, 0) + '</g>';
      case 'rest': return I.palm(-20, 2, .34) + I.palm(20, 2, .34) + J.hammock(-18, -12, 18, -12, col || '#F5B5C8');
      case 'arrive': return I.pier(0, -26, 36, 14, 0, col || '#FFFFFF');
      default: return '';
    }
  }
  I.pill = function (cx, cy, word, o) {
    o = o || {}; var s = o.s || 1, fs = 15 * s, wd = (word.length * 7.6 + (o.col ? 26 : 18)) * s, hh = 26 * s, x = cx - wd / 2;
    return '<g' + (o.soon ? ' opacity=".9"' : '') + '>' + '<rect x="' + n1(x) + '" y="' + n1(cy - hh / 2 + 3 * s) + '" width="' + n1(wd) + '" height="' + n1(hh) + '" rx="' + n1(hh / 2) + '" fill="#E2D7CC"/>' +
      '<rect x="' + n1(x) + '" y="' + n1(cy - hh / 2) + '" width="' + n1(wd) + '" height="' + n1(hh) + '" rx="' + n1(hh / 2) + '" fill="' + (o.soon ? '#EEE7EA' : '#FFFFFF') + '"/>' +
      (o.col ? '<circle cx="' + n1(x + 13 * s) + '" cy="' + n1(cy) + '" r="' + n1(6 * s) + '" fill="' + o.col + '"/>' : '') +
      '<text x="' + n1(cx + (o.col ? 5 * s : 0)) + '" y="' + n1(cy + fs * .34) + '" font-family="Baloo 2, Nunito, sans-serif" font-weight="800" font-size="' + n1(fs) + '" fill="' + (o.soon ? '#6E5560' : '#5B3843') + '" text-anchor="middle">' + word + '</text></g>';
  };
  I.spot = function (kind, x, y, o) {
    o = o || {}; var s = o.s || 1;
    var h = '<g transform="translate(' + n1(x) + ',' + n1(y) + ') scale(' + s + ')"' + (o.soon ? ' opacity=".6"' : '') + '>' +
      '<ellipse cx="2" cy="14" rx="40" ry="13" fill="#E9D3BD"/><ellipse cx="0" cy="10" rx="40" ry="13" fill="' + K.beach + '"/>' + lm(kind, o.col) + '</g>';
    /* the name pill sits under the landmark, or above it when the space below is taken (o.pillAbove) */
    if (o.name) { var q = (o.ps || s * .95) * (o.soon ? .85 : 1), py = o.pillAbove ? y - 30 * s - 14 * q : y + 30 * s + 14 * q; h += I.pill(x + (o.pillDx || 0), py, o.soon ? o.name + ' · soon' : o.name, { col: o.col, soon: o.soon, s: q }); }
    return h;
  };
  /* draw a list of spots, at most MAX_SPOTS; returns { svg, shown, hidden, boxes } (boxes are tap targets [x, y, w, h]) */
  I.spots = function (list, s, ps) {
    var out = '', boxes = [], i, sp, n = Math.min(list.length, I.MAX_SPOTS);
    for (i = 0; i < n; i++) { sp = list[i]; out += I.spot(sp.kind, sp.x, sp.y, { name: sp.name, col: sp.col, soon: sp.soon, s: s }); boxes.push({ id: sp.id || sp.kind, box: [sp.x - 48 * s, sp.y - 46 * s, 96 * s, 104 * s] }); }
    return { svg: out, shown: n, hidden: list.length - n, boxes: boxes };
  };
})(window);
