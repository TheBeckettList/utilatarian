/* Utila Dives: the shop and its dock, drawn from above with the island art kit (art/kit.js).
   A SAMPLE place made to grow the shared style, not a real business. Josie's cafe map is the model:
   a cutaway shop on sand, a yard with umbrellas and pots, the water, a dock, and a few small animals.
   Map box is 1200 x 1000. Plain ES5. */
(function (w) {
  'use strict';
  var U = w.UART, P = U.props, W = U.palettes.world, PAL = U.palettes.places['utila-dives'].light, at = U.at;
  var COAST = 'M1200,330 C1120,340 1030,400 985,490 C950,565 880,640 760,672 C610,708 420,690 250,712 C140,725 60,722 0,740';

  function shopFloor(x, y, wd, ht, tint) {
    var h = '<rect x="' + x + '" y="' + y + '" width="' + wd + '" height="' + ht + '" fill="' + tint + '"/>', i;
    for (i = 40; i < wd; i += 40) { h += '<rect x="' + (x + i) + '" y="' + y + '" width="2.5" height="' + ht + '" fill="' + PAL.line + '"/>'; }
    for (i = 40; i < ht; i += 40) { h += '<rect x="' + x + '" y="' + (y + i) + '" width="' + wd + '" height="2.5" fill="' + PAL.line + '"/>'; }
    return h;
  }
  /* a wall run: a white slab with a soft shade edge underneath (no outline) */
  function wall(x, y, wd, ht) { return '<rect x="' + x + '" y="' + (y + 4) + '" width="' + wd + '" height="' + ht + '" rx="3" fill="' + W['sand-dk'] + '"/><rect x="' + x + '" y="' + y + '" width="' + wd + '" height="' + ht + '" rx="3" fill="#FFFFFF"/>'; }
  function window_(x, y, wd) { return '<rect x="' + x + '" y="' + y + '" width="' + wd + '" height="22" rx="5" fill="' + PAL.pop + '"/><rect x="' + (x + 4) + '" y="' + (y + 4) + '" width="' + (wd - 8) + '" height="14" rx="3" fill="#CFEFF2"/><path d="M' + (x + wd * .35) + ',' + (y + 16) + ' l14,-12" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity=".8"/>'; }

  function build() {
    var h = '', i;
    /* water and land */
    h += P.sea(0, 0, 1200, 1000);
    h += '<path d="' + COAST + ' L0,0 L1200,0 Z" fill="none"/>';
    h += '<path d="' + COAST + ' L0,1000 L1200,1000Z" fill="' + W.sea + '"/>';
    h += '<path d="' + COAST + '" stroke="#FFFFFF" stroke-width="34" fill="none" opacity=".4" stroke-linecap="round"/><path d="' + COAST + '" stroke="' + W['sand-dk'] + '" stroke-width="12" fill="none" opacity=".9" stroke-linecap="round"/>';
    h += '<path d="' + COAST + ' L0,0 L1200,0 Z" fill="' + W.sand + '"/>';
    /* the deep bands again below the foam so the sea keeps its colour */
    h += '<rect x="0" y="880" width="1200" height="120" fill="' + W['sea-deep'] + '" opacity=".9"/><rect x="0" y="760" width="1200" height="130" fill="' + W['sea-2'] + '" opacity=".35"/>';
    h += '<path d="' + COAST + '" stroke="#FFFFFF" stroke-width="3.6" fill="none" opacity=".7" transform="translate(0,22)" stroke-linecap="round" stroke-dasharray="70 40"/>';

    /* reefs and sea life */
    h += at(250, 850, 0, 1, P.reef(150, 70, 3)) + at(1010, 770, 0, 1, P.reef(130, 80, 9)) + at(1060, 940, 0, 1, P.reef(120, 50, 5));
    h += at(340, 830, -18, .9, P.turtle());
    h += at(560, 900, 0, 1, P.buoy(15)) + at(572, 880, 0, 1, '<rect x="-2" y="-34" width="4" height="34" fill="' + W['wood-dk'] + '"/>' + at(2, -32, 0, 1, P.diveFlag(34, 24)));

    /* the shop, roof off: floor, walls, rooms */
    h += '<rect x="46" y="46" width="600" height="440" rx="18" fill="' + W['sand-dk'] + '"/>';
    h += shopFloor(60, 60, 380, 410, PAL.wash) + shopFloor(448, 60, 184, 170, '#E7F1F1') + shopFloor(448, 250, 184, 220, PAL.wash);
    h += wall(56, 52, 584, 36) + wall(56, 52, 12, 424) + wall(628, 52, 12, 424) + wall(56, 468, 140, 12) + wall(256, 468, 384, 12) + wall(434, 52, 12, 424) + wall(440, 236, 190, 12);
    h += '<rect x="68" y="56" width="560" height="26" rx="4" fill="' + PAL.soft + '"/>';
    h += window_(110, 60, 96) + window_(250, 60, 96) + window_(490, 60, 96);
    /* door: a teal frame with a yellow mat, left open at x 196-256 */
    h += '<rect x="196" y="462" width="60" height="22" rx="6" fill="' + PAL.accent + '"/><rect x="200" y="470" width="52" height="8" rx="4" fill="' + PAL.edge + '"/>';

    /* lamps */
    h += at(230, 200, 0, 1, P.pendant(14)) + at(400, 200, 0, 1, P.pendant(14)) + at(540, 140, 0, 1, P.pendant(14));
    /* main room: wetsuit rail on the back wall, fins and masks, tanks, the counter */
    h += '<rect x="96" y="104" width="316" height="10" rx="5" fill="' + W['wood-dk'] + '"/>';
    var suits = [PAL.pop, PAL.accent, '#E9735C', '#2C6F78', '#F5B5C8'];
    for (i = 0; i < 5; i++) { h += at(120 + i * 66, 148, 0, .78, P.wetsuit(suits[i], i % 2 ? '#FFFFFF' : PAL.accent)); }
    h += at(120, 262, 0, 1, P.table(96, 96, true)) + at(104, 254, -14, .62, P.mask('#3E4A52', '#BFE9F0')) + at(138, 276, 12, .62, P.mask(PAL.accent, '#BFE9F0')) + at(120, 236, 0, 1, P.pot(13));
    h += at(104, 372, 0, 1, P.fins(PAL.accent, '#FFFFFF')) + at(168, 372, 0, 1, P.fins(PAL.pop, '#FFFFFF'));
    h += at(350, 238, 0, 1, P.tankRack([PAL.accent, PAL.pop, PAL.accent, '#E9735C']));
    h += at(300, 336, 0, 1, P.counter(240, 58, PAL)) + at(250, 330, 0, 1, P.register());
    h += at(360, 332, 0, 1, '<rect x="-22" y="-12" width="44" height="26" rx="6" fill="#FFFFFF"/><rect x="-16" y="-6" width="14" height="14" rx="3" fill="' + PAL.accent + '"/><rect x="2" y="-6" width="14" height="14" rx="3" fill="' + PAL.pop + '"/>') + at(408, 304, 0, 1, P.pot(15));
    h += at(262, 418, 0, 1, '<rect x="-30" y="-14" width="60" height="28" rx="12" fill="' + PAL.soft + '"/>') + at(400, 430, 0, 1, P.pot(16));
    /* fill room */
    h += at(532, 150, 0, 1, P.compressor(PAL)) + at(560, 206, 0, 1, '<rect x="-60" y="-6" width="120" height="8" rx="4" fill="' + W['wood-dk'] + '"/>') + at(486, 214, 0, .6, P.tankTop(17, PAL.accent)) + at(520, 214, 0, .6, P.tankTop(17, PAL.pop));
    /* classroom */
    h += at(540, 262, 0, 1, P.board(120, 40, PAL, 3));
    h += at(520, 350, 0, 1, P.table(110, 60, false)) + at(490, 394, 0, 1, P.chair(PAL, 0)) + at(550, 394, 0, 1, P.chair(PAL, 8)) + at(520, 308, 0, 1, P.chair(PAL, 180));
    h += at(600, 440, 0, 1, P.pot(15));

    /* yard: boardwalk to the dock, rinse tanks, umbrella and a palm */
    h += '<rect x="196" y="480" width="60" height="120" fill="' + W.deck + '"/><rect x="196" y="480" width="60" height="120" fill="none"/>';
    for (i = 500; i < 600; i += 20) { h += '<rect x="196" y="' + i + '" width="60" height="3" fill="' + W['deck-line'] + '"/>'; }
    h += at(530, 648, 90, 1, P.dock(46, 560));
    h += at(110, 600, 0, 1, P.umbrella(62, PAL)) + at(110, 600, 0, 1, '<circle r="3" fill="' + PAL.accent + '"/>');
    h += at(340, 540, 0, 1, P.rinse(150, 76, PAL)) + at(540, 545, 0, 1, P.rinse(120, 66, PAL));
    h += at(60, 520, 0, 1, P.pot(14)) + at(290, 622, 0, 1, P.pot(13));
    h += at(980, 190, 0, 1, P.palm(70)) + at(1110, 130, 0, 1, P.palm(56)) + at(880, 330, 0, 1, P.palm(48));
    h += at(1050, 300, 0, 1, P.umbrella(54, PAL));
    h += at(940, 540, 0, 1, P.rock(34, 4)) + at(1000, 470, 0, 1, P.rock(24, 7)) + at(905, 580, 0, 1, P.rock(18, 2));
    h += at(740, 640, 18, .8, P.crab());

    /* the dock runs out to sea, the boat tied alongside */
    h += at(800, 820, 0, 1, P.dock(70, 380));
    h += at(715, 820, 0, 1, P.boat(PAL, 300));
    h += at(836, 640, 0, 1, P.pot(14));
    return h;
  }

  U.scene = { build: build, viewBox: '0 0 1200 1000' };
})(window);
