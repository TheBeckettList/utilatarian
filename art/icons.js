/* Island icon tiles, in the manner of Josie's "Menu icons / On the map" board: a soft rounded tile, one object, two or three tones,
   a status shown by shape AND color (a badge with a mark), never color alone.
   UART.icon(name, opts) -> <svg viewBox="0 0 96 96"> markup.  opts: p = palette (default paradise), tone = 'white'|'wash'|'soft'|'none', status = 'ok'|'low'|'alert'|'busy'.
   UART.icons.names lists everything. Needs kit.js. Plain ES5. */
(function (w) {
  'use strict';
  var U = w.UART, P = U.props, W = U.palettes.world, DEF = U.palettes.places.paradise.light, at = U.at;
  var G = {}, GREY = '#C7CED2', GREYD = '#9AA6AD';

  function badge(status) {
    var m = { ok: ['#2F8F6A', '<path d="M-6,0 L-2,5 L6,-5" stroke="#FFFFFF" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'],
      low: ['#E9A13A', '<rect x="-1.8" y="-6" width="3.6" height="8" rx="1.8" fill="#FFFFFF"/><circle cy="5.4" r="2" fill="#FFFFFF"/>'],
      alert: ['#D9483B', '<rect x="-4.6" y="-6" width="3.4" height="8" rx="1.7" fill="#FFFFFF"/><rect x="1.2" y="-6" width="3.4" height="8" rx="1.7" fill="#FFFFFF"/><circle cx="-2.9" cy="5.4" r="1.9" fill="#FFFFFF"/><circle cx="2.9" cy="5.4" r="1.9" fill="#FFFFFF"/>'],
      busy: ['#3E9DB8', '<circle cx="-5" cy="0" r="2.2" fill="#FFFFFF"/><circle cx="0" cy="0" r="2.2" fill="#FFFFFF"/><circle cx="5" cy="0" r="2.2" fill="#FFFFFF"/>'] }[status];
    return m ? '<g transform="translate(76,20)"><circle r="13" fill="#FFFFFF"/><circle r="10.5" fill="' + m[0] + '"/>' + m[1] + '</g>' : '';
  }

  /* gauge: 0 (empty) .. 1 (full): a segmented arc with a needle */
  function gauge(level, p) {
    var segs = [['#D9483B', 0], ['#E9A13A', .34], ['#2F8F6A', .62]], h = '', i, a0, a1, ang;
    for (i = 0; i < 3; i++) {
      a0 = Math.PI * (1 + segs[i][1]); a1 = Math.PI * (1 + (i < 2 ? segs[i + 1][1] : 1));
      h += '<path d="M' + (Math.cos(a0) * 28).toFixed(1) + ',' + (Math.sin(a0) * 28).toFixed(1) + ' A28,28 0 0 1 ' + (Math.cos(a1) * 28).toFixed(1) + ',' + (Math.sin(a1) * 28).toFixed(1) + '" stroke="' + segs[i][0] + '" stroke-width="9" fill="none"/>';
    }
    ang = Math.PI * (1 + level);
    return '<g transform="translate(48,58)">' + h + '<path d="M0,0 L' + (Math.cos(ang) * 22).toFixed(1) + ',' + (Math.sin(ang) * 22).toFixed(1) + '" stroke="' + p.ink + '" stroke-width="4" stroke-linecap="round"/><circle r="6" fill="' + p.ink + '"/></g>';
  }
  function tank(color, p, bandColor) {
    return '<rect x="33" y="30" width="30" height="52" rx="14" fill="' + color + '"/><rect x="37" y="36" width="7" height="40" rx="3.5" fill="#FFFFFF" opacity=".3"/><rect x="33" y="52" width="30" height="9" fill="' + (bandColor || '#FFFFFF') + '" opacity=".9"/>' +
      '<rect x="42" y="18" width="12" height="14" rx="4" fill="' + GREYD + '"/><rect x="38" y="16" width="20" height="6" rx="3" fill="' + p.ink + '"/><rect x="54" y="22" width="9" height="5" rx="2.5" fill="' + GREYD + '"/>';
  }

  G.tank = function (p) { return tank(p.accent, p); };
  G.tankFull = G.tank;
  G.tankEmpty = function (p) { return tank(GREY, p, '#F1F4F5'); };
  G.tankFilling = function (p) { return tank(p.accent, p) + '<circle cx="24" cy="44" r="4" fill="' + W.sea + '"/><circle cx="19" cy="56" r="3" fill="' + W.sea + '"/><circle cx="26" cy="68" r="5" fill="' + W.sea + '"/><circle cx="72" cy="50" r="3.4" fill="' + W.sea + '"/><circle cx="70" cy="66" r="4.4" fill="' + W.sea + '"/>'; };
  G.fuelFull = function (p) { return gauge(.95, p); };
  G.fuelLow = function (p) { return gauge(.45, p); };
  G.fuelRefill = function (p) { return gauge(.06, p); };
  G.boat = function (p) { return at(48, 48, 0, .27, P.boat(p, 300)); };
  G.fins = function (p) { return at(48, 40, 0, 1, P.fins(p.accent, '#FFFFFF')); };
  G.mask = function (p) { return at(48, 48, 0, 1.15, P.mask('#3E4A52', '#BFE9F0')); };
  G.wetsuit = function (p) { return at(48, 50, 0, .9, P.wetsuit(p.pop, p.accent)); };
  G.compressor = function (p) { return at(44, 46, 0, .58, P.compressor(p)); };
  G.bcd = function (p) {
    return '<path d="M30,26 Q38,20 44,26 L44,34 Q48,40 52,34 L52,26 Q58,20 66,26 L72,44 Q66,58 66,76 Q66,82 58,82 H38 Q30,82 30,76 Q30,58 24,44Z" fill="' + p.pop + '"/><path d="M34,34 Q40,60 36,78" stroke="#FFFFFF" stroke-width="3" fill="none" opacity=".35" stroke-linecap="round"/><rect x="38" y="52" width="20" height="8" rx="4" fill="' + p.accent + '"/><path d="M62,34 q10,12 4,30" stroke="' + p.ink + '" stroke-width="3.4" fill="none" stroke-linecap="round"/><circle cx="66" cy="66" r="4" fill="' + p.ink + '"/>';
  };
  G.regulator = function (p) {
    return '<circle cx="34" cy="38" r="13" fill="' + GREYD + '"/><circle cx="34" cy="38" r="7" fill="' + GREY + '"/><path d="M44,32 C66,18 78,40 66,56 C58,66 44,60 50,50" stroke="' + p.pop + '" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="64" cy="64" r="11" fill="' + p.accent + '"/><circle cx="64" cy="64" r="5" fill="' + p.ink + '"/><path d="M34,52 C32,66 40,72 46,72" stroke="' + p.pop + '" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="28" cy="70" r="9" fill="#FFFFFF"/><path d="M28,70 L33,65" stroke="#D9483B" stroke-width="2.6" stroke-linecap="round"/>';
  };
  G.logbook = function (p) {
    return '<rect x="26" y="22" width="44" height="56" rx="7" fill="' + p.pop + '"/><rect x="26" y="22" width="9" height="56" rx="4" fill="' + p.ink + '" opacity=".35"/><rect x="40" y="32" width="24" height="20" rx="5" fill="#FFFFFF"/><path d="M45,40 q4,-5 8,0 t8,0" stroke="' + p.pop + '" stroke-width="2.6" fill="none" stroke-linecap="round"/><rect x="40" y="58" width="22" height="4" rx="2" fill="#FFFFFF" opacity=".6"/><rect x="58" y="22" width="8" height="30" rx="2" fill="' + p.accent + '"/>';
  };
  G.bed = function (p) {
    return '<rect x="22" y="22" width="52" height="58" rx="12" fill="' + W['wood-dk'] + '"/><rect x="26" y="26" width="44" height="50" rx="9" fill="#FFFFFF"/><rect x="31" y="30" width="34" height="14" rx="7" fill="' + p.wash + '"/><rect x="26" y="48" width="44" height="28" rx="9" fill="' + p.accent + '"/><rect x="26" y="48" width="44" height="9" rx="5" fill="#FFFFFF" opacity=".55"/>';
  };
  G.bunk = function (p) {
    return '<rect x="16" y="30" width="40" height="48" rx="10" fill="' + W['wood-dk'] + '"/><rect x="19" y="33" width="34" height="42" rx="8" fill="' + p.accent + '"/><rect x="22" y="36" width="28" height="10" rx="5" fill="#FFFFFF"/><rect x="38" y="20" width="40" height="48" rx="10" fill="' + W.wood + '"/><rect x="41" y="23" width="34" height="42" rx="8" fill="' + p.pop + '"/><rect x="44" y="26" width="28" height="10" rx="5" fill="#FFFFFF"/><rect x="56" y="64" width="3" height="14" fill="' + W['wood-dk'] + '"/><rect x="66" y="64" width="3" height="14" fill="' + W['wood-dk'] + '"/>';
  };
  G.key = function (p) {
    return '<circle cx="36" cy="40" r="15" fill="' + p.accent + '"/><circle cx="36" cy="40" r="7" fill="' + p.wash + '"/><rect x="48" y="36" width="30" height="8" rx="4" fill="' + p.accent + '"/><rect x="66" y="42" width="6" height="12" rx="2" fill="' + p.accent + '"/><rect x="58" y="42" width="5" height="9" rx="2" fill="' + p.accent + '"/><rect x="24" y="58" width="34" height="18" rx="7" fill="#FFFFFF"/><rect x="29" y="64" width="20" height="4" rx="2" fill="' + p.soft + '"/>';
  };
  G.bell = function (p) {
    return '<path d="M48,22 C36,22 32,32 32,44 C32,56 26,60 24,66 H72 C70,60 64,56 64,44 C64,32 60,22 48,22Z" fill="' + p.accent + '"/><path d="M38,32 C34,38 34,46 35,52" stroke="#FFFFFF" stroke-width="3" fill="none" opacity=".4" stroke-linecap="round"/><circle cx="48" cy="72" r="7" fill="' + p.edge + '"/><rect x="45" y="14" width="6" height="9" rx="3" fill="' + p.edge + '"/>';
  };
  G.flag = function () { return at(40, 50, 0, 1.2, P.diveFlag(40, 28)) + '<rect x="36" y="20" width="4" height="58" rx="2" fill="' + W['wood-dk'] + '"/>'; };
  G.cafe = function () {
    return '<ellipse cx="46" cy="70" rx="26" ry="5" fill="' + W.shadow + '"/><path d="M26,40 H66 V56 Q66,70 46,70 Q26,70 26,56Z" fill="#F5B5C8"/><ellipse cx="46" cy="40" rx="20" ry="5.5" fill="#6B4130"/><path d="M66,44 q12,0 12,9 t-12,9" stroke="#F5B5C8" stroke-width="5" fill="none"/><path d="M40,32 q-5,-6 0,-12 M52,32 q-5,-6 0,-12" stroke="#B9A59C" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/><rect x="26" y="48" width="40" height="7" fill="#FFFFFF" opacity=".7"/>';
  };
  G.globe = function (p) { return at(48, 50, 0, .62, P.globe(46, p)); };
  G.heli = function (p) { return at(48, 50, 0, .36, P.heli(p).replace('class="spin"', '')); };
  G.plane = function (p) { return at(48, 52, 0, .27, P.floatplane(p).replace('class="spin"', '')); };

  U.icon = function (name, o) {
    o = o || {}; var p = o.p || DEF, g = G[name], bg = { white: '#FFFFFF', wash: p.wash, soft: p.soft, none: null }[o.tone || 'white'];
    if (!g) { return ''; }
    return '<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">' + (bg ? '<rect x="4" y="4" width="88" height="88" rx="26" fill="' + bg + '"/>' : '') + g(p) + badge(o.status) + '</svg>';
  };
  U.icons = { names: Object.keys(G) };
})(window);
