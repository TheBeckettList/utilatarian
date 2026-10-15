/* Place illustrations for island overviews: each is the real place, SIMPLIFIED, in the same relationship as Josie's POS map is to her
   cafe overview: same layout, same colors, same landmarks (the pink counter, the umbrellas, the pier and its sign), fewer small things.
   Drawn around (0,0). Needs kit.js. Plain ES5.
   Also: a few "digital-only" fantasy props for Tripwrights (glass dome, lanterns, jellyfish, a whale shadow). */
(function (w) {
  'use strict';
  var U = w.UART, P = U.props, W = U.palettes.world, at = U.at;
  var JP = U.palettes.places['josies-cafe'].light;

  function wall(x, y, wd, ht) { return '<rect x="' + x + '" y="' + (y + 4) + '" width="' + wd + '" height="' + ht + '" rx="3" fill="' + W['sand-dk'] + '"/><rect x="' + x + '" y="' + y + '" width="' + wd + '" height="' + ht + '" rx="3" fill="#FFFFFF"/>'; }
  function win(x, y, wd, c) { return '<rect x="' + x + '" y="' + y + '" width="' + wd + '" height="14" rx="4" fill="' + c + '"/><rect x="' + (x + 3) + '" y="' + (y + 3) + '" width="' + (wd - 6) + '" height="8" rx="2.5" fill="#E1F3F6"/>'; }

  /* Josie's Cafe from above: pier and hanging sign on the left, the pink-brick room with its pink counter and round tables, the kitchen,
     the white terrace with pink umbrellas, the pink tuk-tuk. ~330 x 250. */
  P.placeJosies = function () {
    var h = '', i;
    h += '<rect x="-170" y="-96" width="52" height="210" rx="6" fill="' + W['deck'] + '"/>';
    for (i = -86; i < 110; i += 18) { h += '<rect x="-170" y="' + i + '" width="52" height="2.5" fill="' + W['deck-line'] + '"/>'; }
    h += at(-146, -70, 0, 1, '<rect x="0" y="-8" width="40" height="5" rx="2.5" fill="#FFFFFF"/><rect x="6" y="-3" width="26" height="22" rx="8" fill="#FFFFFF"/><rect x="11" y="3" width="16" height="4" rx="2" fill="' + JP.accent + '"/><rect x="11" y="10" width="11" height="3" rx="1.5" fill="' + JP.soft + '"/>');
    h += P.shadow(130, 22, 6, 130);
    h += '<rect x="-112" y="-102" width="244" height="176" rx="16" fill="' + W['sand-dk'] + '"/><rect x="-104" y="-94" width="228" height="160" rx="10" fill="' + W.floor + '"/>';
    for (i = -66; i < 66; i += 22) { h += '<rect x="-104" y="' + i + '" width="228" height="2" fill="' + JP.line + '"/>'; }
    h += '<rect x="-104" y="-94" width="228" height="22" rx="8" fill="' + JP.soft + '"/>' + win(-84, -90, 44, '#4FA9A4') + win(-18, -90, 44, '#4FA9A4') + win(50, -90, 44, '#4FA9A4');
    h += '<rect x="72" y="-94" width="6" height="160" fill="' + W['wood-dk'] + '"/>';
    /* the pink counter with espresso machine, the fridge wall, the till */
    h += at(-30, -42, 0, 1, '<rect x="-74" y="-16" width="148" height="30" rx="10" fill="' + JP.accent + '"/><rect x="-74" y="-16" width="148" height="19" rx="10" fill="#F5B5C8"/><rect x="-46" y="-26" width="42" height="18" rx="6" fill="#F5B5C8"/><circle cx="-38" cy="-17" r="3" fill="#FFFFFF"/><circle cx="-26" cy="-17" r="3" fill="#FFFFFF"/><circle cx="-14" cy="-17" r="3" fill="#FFFFFF"/><rect x="26" y="-24" width="20" height="14" rx="4" fill="#4A3A42"/><rect x="50" y="-22" width="14" height="12" rx="5" fill="#FFFFFF"/>');
    h += at(54, -52, 0, 1, '<rect x="-14" y="-18" width="28" height="36" rx="6" fill="#E1F3F6"/><rect x="-10" y="-14" width="20" height="28" rx="4" fill="#FFFFFF"/>');
    /* round tables with their pots */
    h += at(-62, 6, 0, 1, P.table(50, 50, true)) + at(-62, 6, 0, 1, P.pot(8)) + at(-4, 6, 0, 1, P.table(50, 50, true)) + at(-4, 6, 0, 1, P.pot(8)) + at(46, 4, 0, 1, P.table(40, 54, false)) + at(-30, 44, 0, 1, P.pot(9));
    h += at(-82, 30, 0, .8, P.chair(JP, 0)) + at(20, 28, 0, .8, P.chair({ soft: '#BEE3D5', accent: '#4FA9A4' }, 8));
    h += at(-20, -52, 0, 1, P.pendant(8)) + at(30, -52, 0, 1, P.pendant(8));
    /* the kitchen room */
    h += '<rect x="82" y="-84" width="38" height="140" rx="6" fill="#FBEFE4"/><rect x="88" y="-76" width="26" height="22" rx="5" fill="#FFFFFF"/><circle cx="101" cy="-65" r="6" fill="#6B4130"/><rect x="88" y="-46" width="26" height="30" rx="6" fill="#E1F3F6"/><rect x="88" y="-8" width="26" height="46" rx="6" fill="#D7DFE3"/><circle cx="95" cy="4" r="5" fill="#4A3A42"/><circle cx="107" cy="4" r="5" fill="#4A3A42"/>';
    h += wall(-108, -98, 244, 7) + wall(-108, -98, 7, 170) + wall(128, -98, 7, 170) + wall(-108, 66, 66, 7) + wall(-14, 66, 142, 7);
    h += '<rect x="-42" y="62" width="28" height="14" rx="5" fill="#4FA9A4"/>';
    /* terrace: white deck, pink umbrellas */
    h += '<rect x="-96" y="80" width="214" height="62" rx="10" fill="#FFFFFF"/><rect x="-96" y="80" width="214" height="7" fill="#F2E7E0"/>' + at(-40, 114, 0, 1, P.umbrella(26, JP)) + at(50, 114, 0, 1, P.umbrella(26, JP)) + at(-40, 114, 0, 1, '<rect x="-10" y="26" width="20" height="9" rx="4" fill="' + JP.accent + '" opacity="0"/>') + at(98, 96, 0, 1, P.pot(9));
    /* the pink tuk-tuk */
    h += at(168, 62, 0, 1, P.shadow(26, 12, 4, 38) + '<rect x="-20" y="-40" width="40" height="86" rx="18" fill="#F5B5C8"/><rect x="-14" y="-30" width="28" height="30" rx="10" fill="#CFEAF6"/><rect x="-16" y="2" width="32" height="38" rx="12" fill="#F5B5C8"/><rect x="-14" y="6" width="28" height="30" rx="9" fill="#FFFFFF" opacity=".6"/><rect x="-30" y="-24" width="9" height="18" rx="4" fill="#3B2925"/><rect x="21" y="-24" width="9" height="18" rx="4" fill="#3B2925"/><rect x="-30" y="18" width="9" height="18" rx="4" fill="#3B2925"/><rect x="21" y="18" width="9" height="18" rx="4" fill="#3B2925"/>');
    return h;
  };

  /* Utila Dives from above, simplified: the yellow-counter shop with wetsuit rail, tank rack, the yard with the rinse tank, its dock out to the right. ~330 x 240. */
  P.placeDives = function (p) {
    p = p || U.palettes.places['utila-dives'].light;
    var h = '', i, suits = [p.pop, p.accent, '#E9735C'];
    h += '<rect x="30" y="52" width="150" height="52" rx="6" fill="' + W.deck + '"/>';
    for (i = 44; i < 176; i += 18) { h += '<rect x="' + i + '" y="52" width="2.5" height="52" fill="' + W['deck-line'] + '"/>'; }
    h += P.shadow(110, 20, 4, 118);
    h += '<rect x="-120" y="-96" width="228" height="176" rx="16" fill="' + W['sand-dk'] + '"/><rect x="-112" y="-88" width="212" height="160" rx="10" fill="' + p.wash + '"/>';
    for (i = -66; i < 66; i += 22) { h += '<rect x="-112" y="' + i + '" width="212" height="2" fill="' + p.line + '"/>'; }
    h += '<rect x="-112" y="-88" width="212" height="22" rx="8" fill="' + p.soft + '"/>' + win(-90, -84, 44, p.pop) + win(-20, -84, 44, p.pop) + win(50, -84, 40, p.pop);
    h += '<rect x="-92" y="-58" width="136" height="6" rx="3" fill="' + W['wood-dk'] + '"/>';
    for (i = 0; i < 3; i++) { h += at(-70 + i * 46, -34, 0, .52, P.wetsuit(suits[i], i % 2 ? p.accent : '#FFFFFF')); }
    h += at(66, -34, 0, .75, P.tankRack([p.accent, p.pop, p.accent])) + at(-40, 22, 0, 1, P.counter(130, 36, p)) + at(-70, 18, 0, .7, P.register()) + at(54, 26, 0, 1, P.pot(10)) + at(-86, 46, 0, 1, P.pot(9));
    h += wall(-116, -92, 220, 7) + wall(-116, -92, 7, 170) + wall(98, -92, 7, 170) + wall(-116, 72, 70, 7) + wall(-18, 72, 124, 7);
    h += '<rect x="-46" y="68" width="28" height="14" rx="5" fill="' + p.accent + '"/>';
    h += at(-60, 122, 0, 1, P.rinse(96, 48, p)) + at(52, 118, 0, 1, P.umbrella(30, p)) + at(122, 98, 0, 1, P.pot(10));
    h += at(252, 78, 90, 1, P.dock(40, 160));
    return h;
  };

  /* ---- Tripwrights: digital-only fantasy ---- */
  P.lantern = function (r, color) { r = r || 10; color = color || '#FFE29A'; return '<circle r="' + r * 2.6 + '" fill="' + color + '" opacity=".18"/><circle r="' + r * 1.7 + '" fill="' + color + '" opacity=".32"/><circle r="' + r + '" fill="' + color + '"/><circle r="' + r * .45 + '" fill="#FFFFFF" opacity=".8"/>'; };
  P.jelly = function (r, color) { color = color || '#BFA9F0'; r = r || 18; return '<circle r="' + r * 1.9 + '" fill="' + color + '" opacity=".18"/><path d="M' + -r + ',0 A' + r + ',' + r + ' 0 0 1 ' + r + ',0 Q0,' + r * .3 + ' ' + -r + ',0Z" fill="' + color + '" opacity=".85"/><path d="M' + -r * .6 + ',2 q-4,' + r * .8 + ' 0,' + r * 1.4 + ' M0,3 q4,' + r * .8 + ' 0,' + r * 1.6 + ' M' + r * .6 + ',2 q-4,' + r * .8 + ' 0,' + r * 1.4 + '" stroke="' + color + '" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/>'; };
  P.whaleShadow = function (sc) { sc = sc || 1; return '<g transform="scale(' + sc + ')" opacity=".16"><path d="M-170,0 C-120,-46 40,-52 110,-20 C140,-8 170,-30 200,-58 C196,-24 190,-6 200,14 C170,-8 140,12 110,22 C40,52 -120,46 -170,0Z" fill="#0F2A43"/><path d="M-20,34 q10,40 40,56 q-4,-30 -10,-50Z" fill="#0F2A43"/></g>'; };
  /* a glass dome over something: a translucent circle with a rim and two reflections */
  P.dome = function (rx, ry) { return '<ellipse rx="' + rx + '" ry="' + ry + '" fill="#E1F5FA" opacity=".42"/><ellipse rx="' + rx + '" ry="' + ry + '" fill="none" stroke="#FFFFFF" stroke-width="6" opacity=".8"/><path d="M' + -rx * .62 + ',' + -ry * .3 + ' Q' + -rx * .5 + ',' + -ry * .62 + ' ' + -rx * .12 + ',' + -ry * .78 + '" stroke="#FFFFFF" stroke-width="7" fill="none" stroke-linecap="round" opacity=".7"/><path d="M' + rx * .5 + ',' + ry * .5 + ' q' + rx * .1 + ',' + ry * .12 + ' ' + rx * .2 + ',' + ry * .05 + '" stroke="#FFFFFF" stroke-width="5" fill="none" stroke-linecap="round" opacity=".6"/>'; };
  /* a rope bridge between two points (flat planks with two rails) */
  P.bridge = function (len) { var h = '<rect x="0" y="-9" width="' + len + '" height="18" rx="4" fill="' + W.deck + '"/>', x; for (x = 8; x < len; x += 12) { h += '<rect x="' + x + '" y="-9" width="2.5" height="18" fill="' + W['deck-line'] + '"/>'; } return h + '<path d="M0,-9 H' + len + 'M0,9 H' + len + '" stroke="#FFFFFF" stroke-width="2.6" opacity=".9"/>'; };
  /* string of lights between points: dots with halos */
  P.lights = function (x1, y1, x2, y2, n, sag) {
    var h = '', i, t, x, y; for (i = 0; i <= n; i++) { t = i / n; x = x1 + (x2 - x1) * t; y = y1 + (y2 - y1) * t + Math.sin(t * Math.PI) * (sag || 14); h += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="9" fill="#FFE29A" opacity=".28"/><circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="3.6" fill="' + (i % 2 ? '#FFE29A' : '#FFFFFF') + '"/>'; }
    return h;
  };
})(window);
