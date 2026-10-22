/* Tripwrights' maps, composed from the island kit (island.js) in Josie's bay hand: the two region archipelagos and an island
   close-up for any island. Needs josie.js, world.js, island.js. Plain ES5.

   Every function returns { svg, W, H, targets } where targets is a list of { id, box: [x, y, w, h], tag: [x, y] }: the tap areas
   the app wraps in buttons (same contract as the vessel's parts). The app adds no text to the art; names are already in pills.

   Sizes: the region map is a 1000 x 640 strip (the top of the region screen, above the vessel); an island close-up is 1000 x 1100
   (the island screen). Both scale freely.

   What is real here: island outlines (rough traces), which shore each town is on, the ferry routes that exist (La Ceiba to Utila and
   to Roatán; Donsak to Samui; Samui, Phangan and Tao linked by boat; Chumphon to Tao). Spot positions are approximate. Spots that are
   not a participating place are drawn as "soon" until a place there joins; places that have joined are drawn as themselves. */
(function (w) {
  'use strict';
  var J = w.UJ, I = J.isle, K = I.K, M = J.maps = {};
  /* pill and spot sizes: the art is drawn at 1000 wide and shown at phone width (~40%), so words are drawn about twice size */
  var RS = 1.8, PS = 2, SS = 1.5;
  var PINK = '#B55573', PARADISE = { accent: '#3E86B8', deep: '#2E6E9E', soft: '#BFE0F2', pale: '#E6F2FA', tank: '#3E86B8', tank2: '#F2F2EE', wallTop: '#9CCBE6', shutter: '#4F8FC0', wainscot: '#DDEBF5', wainscotLine: '#C9DCEB' };

  /* a mainland coast, drawn with the same layers as an island (the outline runs off the edge of the map) */
  function coast(pts, o, extra) {
    var sh = { pts: pts, density: o.density || 1, minW: 400, town: o.town || [], road: o.road || null, hills: o.hills || [], lagoons: [], reefs: o.reefs || [], cays: [] };
    return I.draw(sh, { x: 0, y: 0, s: 1, detail: 'region', seed: o.seed || 3, houseScale: 1.1 });
  }
  function target(id, box, tag) { return { id: id, box: box.map(Math.round), tag: tag.map(Math.round) }; }
  function under(d, pad) { return [d.box[0] + d.box[2] / 2, d.box[1] + d.box[3] + (pad || 26)]; }

  /* ---------------- the Caribbean: the Bay Islands off La Ceiba ---------------- */
  M.caribbean = function (W, H) {
    W = W || 1000; H = H || 640;
    var h = I.seaFill('carSea', W, H), t = [];
    /* Honduras: the coast at La Ceiba along the bottom, the mountains behind it */
    var main = coast([[-60, 566], [80, 552], [200, 566], [330, 554], [420, 560], [520, 548], [660, 558], [800, 546], [940, 556], [1080, 548], [1080, 760], [-60, 760]],
      { density: 2, town: [[2, 4, 2]], road: [0, 9], hills: [[260, 640, 200, 40], [620, 640, 240, 36]], reefs: [], seed: 5 });
    /* routes first, under the boats */
    var ut = I.draw('utila', { x: 200, y: 372, s: 2.0, rot: 0, detail: 'region', seed: 11 });
    var ro = I.draw('roatan', { x: 590, y: 232, s: .88, rot: -12, detail: 'region', seed: 4 });
    var gu = I.draw('guanaja', { x: 918, y: 78, s: 1.05, rot: 18, detail: 'region', seed: 9 });
    var ceiba = [372, 556], utDock = ut.at([33, 22]), roDock = ro.at([-170, 30]);
    h += I.waves([[60, 120], [300, 90], [520, 340], [760, 420], [120, 500], [880, 300], [430, 470]], .8);
    h += main.svg + I.pier(ceiba[0], ceiba[1] - 2, 46, 16, 180, '#FFFFFF');
    h += I.route([[ceiba[0], ceiba[1] - 46], [330, 480], utDock]) + I.route([[ceiba[0] + 8, ceiba[1] - 46], [470, 420], roDock]);
    h += ut.svg + ro.svg + gu.svg;
    /* life: the ferry on its way, a whale shark off Utila's north shore, a sailboat, a ray */
    h += I.ferry(318, 470, .34, '#3E86B8', -60) + I.whaleShark(150, 248, .42, 12) + I.sail(470, 120, .3, '#F2A66B') + I.ray(760, 360, .4, -20) + I.diveBoat(300, 452, .26, '#F2B632', -10);
    /* names, in anchored pills (no free text) */
    h += I.pill(under(ut, 40)[0] - 20, under(ut, 40)[1], 'Utila', { s: RS }) + I.pill(ro.at([60, 10])[0] + 40, ro.at([60, 10])[1] + 50, 'Roatán · soon', { soon: true, s: RS }) +
      I.pill(under(gu, 34)[0] - 40, under(gu, 34)[1], 'Guanaja · soon', { soon: true, s: RS }) + I.pill(ceiba[0] + 6, ceiba[1] + 38, 'La Ceiba', { s: RS * .85 });
    t.push(target('isle:utila', [ut.box[0] - 16, ut.box[1] - 16, ut.box[2] + 32, ut.box[3] + 60], under(ut, 30)));
    t.push(target('isle:roatan', [ro.box[0], ro.box[1] - 10, ro.box[2], ro.box[3] + 70], [ro.at([60, 10])[0] + 40, ro.at([60, 10])[1] + 50]));
    t.push(target('isle:guanaja', [gu.box[0] - 10, gu.box[1] - 10, gu.box[2] + 20, gu.box[3] + 50], under(gu, 22)));
    t.push(target('getting-there', [ceiba[0] - 90, ceiba[1] - 60, 180, 100], [ceiba[0] + 6, ceiba[1] + 38]));
    return { svg: h, W: W, H: H, targets: t };
  };

  /* ---------------- Southeast Asia: the Gulf of Thailand islands ---------------- */
  M.seasia = function (W, H) {
    W = W || 1000; H = H || 640;
    var h = I.seaFill('saSea', W, H), t = [];
    var main = coast([[150, -60], [138, 60], [156, 160], [130, 260], [150, 360], [122, 460], [148, 560], [130, 700], [-80, 700], [-80, -60]],
      { density: 2, town: [[1, 2, 1], [5, 6, 1]], road: [0, 7], hills: [[40, 200, 60, 140], [30, 520, 50, 120]], seed: 8 });
    var tao = I.draw('kohtao', { x: 560, y: 106, s: 2.0, rot: 0, detail: 'region', seed: 3 });
    var pha = I.draw('kohphangan', { x: 650, y: 318, s: .92, rot: 0, detail: 'region', seed: 7 });
    var sam = I.draw('kohsamui', { x: 600, y: 520, s: .82, rot: 0, detail: 'region', seed: 2 });
    var donsak = [140, 560], chumphon = [150, 80];
    h += I.waves([[300, 120], [800, 90], [880, 420], [360, 360], [260, 600], [860, 600]], .8);
    h += main.svg;
    /* Ang Thong: a scatter of small islands west of Samui */
    [[330, 470, 16, 10], [300, 500, 10, 7], [356, 506, 12, 8], [320, 530, 8, 6], [380, 470, 7, 5]].forEach(function (c, n) {
      h += '<path d="' + I.blob(c[0], c[1], c[2] * 1.8, c[3] * 1.8, 90 + n, .14) + '" fill="' + K.shelf + '"/><path d="' + I.blob(c[0], c[1], c[2], c[3], 95 + n, .16) + '" fill="' + K.green2 + '"/><path d="' + I.blob(c[0] - 2, c[1] - 2, c[2] * .55, c[3] * .5, 99 + n, .2) + '" fill="' + K.hill + '"/>';
    });
    h += I.route([[donsak[0] + 30, donsak[1]], [330, 580], sam.at([-104, 10])]) + I.route([sam.at([0, -96]), [640, 418], pha.at([-30, 56])]) + I.route([pha.at([-62, -10]), [560, 230], tao.at([-14, 8])]) + I.route([[chumphon[0] + 30, chumphon[1]], [360, 100], tao.at([-16, -8])]);
    h += tao.svg + pha.svg + sam.svg;
    h += I.longtail(470, 60, .3, '#9B6BD6', 20) + I.longtail(760, 470, .28, '#F2A66B', -30) + I.sail(860, 220, .28, '#7FC6D6') + I.diveBoat(640, 150, .24, '#9B6BD6', 10) + I.school(470, 300, 6, 18, .8);
    h += I.pill(under(tao, 40)[0], under(tao, 40)[1], 'Koh Tao · soon', { soon: true, s: RS }) + I.pill(pha.box[0] + pha.box[2] + 60, pha.box[1] + pha.box[3] / 2, 'Koh Phangan · soon', { soon: true, s: RS }) +
      I.pill(sam.box[0] + sam.box[2] + 50, sam.box[1] + sam.box[3] * .7, 'Koh Samui · soon', { soon: true, s: RS }) + I.pill(donsak[0] + 10, donsak[1] + 40, 'Donsak', { s: RS * .85 }) + I.pill(chumphon[0] + 20, chumphon[1] + 40, 'Chumphon', { s: RS * .85 });
    t.push(target('isle:kohtao', [tao.box[0] - 30, tao.box[1] - 20, tao.box[2] + 60, tao.box[3] + 70], under(tao, 30)));
    t.push(target('isle:kohphangan', pha.box, [pha.box[0] + pha.box[2] + 20, pha.box[1] + pha.box[3] / 2]));
    t.push(target('isle:kohsamui', sam.box, [sam.box[0] + sam.box[2] + 30, sam.box[1] + sam.box[3] * .7]));
    t.push(target('getting-there', [donsak[0] - 100, donsak[1] - 60, 200, 110], [donsak[0] - 20, donsak[1] + 40]));
    return { svg: h, W: W, H: H, targets: t };
  };

  /* ---------------- an island close-up ----------------
     Spots in island units (100 m), at most five shown. A spot with `place` is a participating place and is drawn as itself
     (its J.mini drawing) with its pill; the others are activity landmarks, drawn "soon" until a place there joins.
     SAMPLE data: positions are approximate; the app will take places from the hub's place cards. */
  var SPOTS = M.SPOTS = {
    utila: [
      { id: 'place:josies-cafe', kind: 'eat', at: [21, 22], name: 'Josie’s Cafe', place: 'josies', col: PINK },
      { id: 'place:paradise', kind: 'dive', at: [39, 15], name: 'Paradise', place: 'paradise', col: '#3E86B8' },
      { id: 'act:hike', kind: 'hike', at: [52, -10], name: 'Pumpkin Hill', soon: true, pillAbove: true },
      { id: 'act:snorkel', kind: 'snorkel', at: [-46, 31], name: 'The Cays', soon: true },
      { id: 'act:sail', kind: 'sail', at: [18, -40], name: 'Whale sharks', soon: true }
    ],
    roatan: [
      { id: 'act:beach', kind: 'beach', at: [-266, 22], name: 'West Bay', soon: true },
      { id: 'act:dive', kind: 'dive', at: [-246, -12], name: 'West End', soon: true, pillAbove: true },
      { id: 'act:arrive', kind: 'arrive', at: [-170, 30], name: 'Coxen Hole', soon: true },
      { id: 'act:eat', kind: 'eat', at: [-100, 26], name: 'French Harbour', soon: true }
    ],
    guanaja: [
      { id: 'act:stay', kind: 'stay', at: [30, 44], name: 'Bonacca', soon: true },
      { id: 'act:hike', kind: 'hike', at: [-10, -6], name: 'The hills', soon: true },
      { id: 'act:snorkel', kind: 'snorkel', at: [-30, 46], name: 'South reef', soon: true }
    ],
    kohtao: [
      { id: 'act:beach', kind: 'beach', at: [-18, -14], name: 'Sairee Beach', soon: true },
      { id: 'act:dive', kind: 'dive', at: [-20, 2], name: 'Mae Haad', soon: true },
      { id: 'act:snorkel', kind: 'snorkel', at: [-26, -44], name: 'Nang Yuan', soon: true },
      { id: 'act:stay', kind: 'stay', at: [-4, 30], name: 'Chalok', soon: true },
      { id: 'act:hike', kind: 'hike', at: [4, -18], name: 'Viewpoints', soon: true }
    ],
    kohphangan: [
      { id: 'act:arrive', kind: 'arrive', at: [-36, 52], name: 'Thong Sala', soon: true },
      { id: 'act:beach', kind: 'beach', at: [40, 52], name: 'Haad Rin', soon: true },
      { id: 'act:hike', kind: 'hike', at: [0, -10], name: 'The hills', soon: true }
    ],
    kohsamui: [
      { id: 'act:beach', kind: 'beach', at: [106, 10], name: 'Chaweng', soon: true },
      { id: 'act:arrive', kind: 'arrive', at: [-108, 0], name: 'Nathon', soon: true },
      { id: 'act:hike', kind: 'hike', at: [0, 0], name: 'The mountain', soon: true },
      { id: 'act:sail', kind: 'sail', at: [-150, 40], name: 'Ang Thong', soon: true }
    ]
  };
  /* a long island's screen focuses on its busy end and lets the rest run off the edge (units, west..east) */
  var FOCUS = M.FOCUS = { roatan: [-290, -40] };
  var BOATS = { utila: '#F2B632', roatan: '#F28B6B', guanaja: '#3FAE8F', kohtao: '#9B6BD6', kohphangan: '#9B6BD6', kohsamui: '#9B6BD6' };

  M.island = function (id, W, H, opts) {
    W = W || 1000; H = H || 1100; opts = opts || {};
    var sh = I.SHAPES[id], xs = [], ys = [], i, focus = opts.focus || FOCUS[id];
    sh.pts.concat((sh.cays || []).map(function (c) { return [c[0], c[1]]; })).forEach(function (p) { if (!focus || (p[0] >= focus[0] && p[0] <= focus[1])) { xs.push(p[0]); ys.push(p[1]); } });
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
    /* fit with room for the shallows; a long island is drawn across, a tall one fills the height */
    var s = Math.min((W - 140) / (x1 - x0), (H - 260) / (y1 - y0), opts.maxS || 12), cx = W / 2 - s * (x0 + x1) / 2, cy = (opts.cy || H * .38) - s * (y0 + y1) / 2;
    var o = { x: cx, y: cy, s: s, rot: 0, detail: 'island', seed: opts.seed || 5, houseScale: opts.houseScale || 1 };
    var at = function (u) { return [cx + u[0] * s, cy + u[1] * s]; }, list = (opts.spots || SPOTS[id] || []).slice(0, I.MAX_SPOTS);
    /* keep houses clear of participating places */
    o.reserve = list.filter(function (sp) { return sp.place; }).map(function (sp) { var p = at(sp.at); return [p[0], p[1] - 10, 96]; });
    var d = I.draw(id, o), h = I.seaFill('isSea' + id, W, H), t = [];
    h += I.waves([[90, 120], [820, 160], [140, 820], [760, 900], [420, 1010], [880, 700], [260, 680], [600, 760]], 1);
    h += d.svg;
    /* life in the water, picked per island (only what really lives there) */
    var bc = BOATS[id] || '#F2B632';
    h += I.diveBoat(W * .22, H * .76, .5, bc, -6) + I.diveBoat(W * .74, H * .8, .46, bc, 8) + I.sail(W * .86, H * .66, .42, '#F2A66B') + I.school(W * .5, H * .86, 9, 26, 1) + I.ray(W * .3, H * .9, .6, -18);
    if (id === 'utila') { h += I.whaleShark(W * .64, H * .94, .8, 6); }
    if (id.indexOf('koh') === 0) { h += I.longtail(W * .14, H * .3, .55, bc, 30) + I.longtail(W * .82, H * .36, .5, '#F2A66B', -40); }
    /* spots: participating places as themselves, then activity landmarks */
    var defs = J.defs('isP', {});
    list.forEach(function (sp) {
      var p = at(sp.at), tag;
      if (sp.place === 'josies') { h += J.at(p[0], p[1] - 34, 0, .42, J.mini.josies('isP')); tag = [p[0] - 40, p[1] + 64]; h += I.pill(tag[0], tag[1], sp.name, { col: sp.col, s: PS }); t.push(target(sp.id, [p[0] - 70, p[1] - 100, 140, 180], tag)); }
      else if (sp.place === 'paradise') { h += J.at(p[0], p[1] - 40, 0, .4, J.mini.paradise('isP', PARADISE)); tag = sp.pillAbove ? [p[0], p[1] - 150] : [p[0] + 30, p[1] + 150]; h += I.pill(tag[0], tag[1], sp.name, { col: sp.col, s: PS }); t.push(target(sp.id, [p[0] - 64, p[1] - 120, 128, 250], tag)); }
      else { h += I.spot(sp.kind, p[0], p[1], { name: sp.name, col: sp.col, soon: sp.soon, s: SS, ps: PS * .9, pillAbove: sp.pillAbove, pillDx: sp.pillDx }); t.push(target(sp.id, [p[0] - 72, p[1] - 70, 144, 160], [p[0], sp.pillAbove ? p[1] - 70 : p[1] + 70])); }
    });
    var hidden = (opts.spots || SPOTS[id] || []).length - list.length;
    return { svg: defs + h, W: W, H: H, targets: t, hidden: hidden, scale: s };
  };
})(window);
