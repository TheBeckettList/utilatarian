/* Utila Dives ops: the SAME map for everyone, with statuses; what you can see and do depends on your assignment level.
   Each person also has a companion applet that gets notifications. Prototype: state lives in this browser (shared across tabs).
   Plain ES5. */
(function () {
  'use strict';
  var U = UART, $ = function (id) { return document.getElementById(id); }, KEY = 'ud-ops-v1';
  var ROLES = [
    { id: 'guest', name: 'Guest', who: 'Alex (guest)', rank: 0 },
    { id: 'filler', name: 'Tank filler', who: 'Beto (tank filler)', rank: 1 },
    { id: 'dm', name: 'Divemaster', who: 'Dani (DM)', rank: 2 },
    { id: 'instructor', name: 'Instructor', who: 'Rey (instructor)', rank: 3 },
    { id: 'owner', name: 'Owner', who: 'Owner', rank: 4 }
  ];
  var role = 'dm';
  try { role = localStorage.getItem('ud-role') || 'dm'; } catch (e) { }
  function R() { return ROLES.filter(function (r) { return r.id === role; })[0]; }
  var canFlag = function () { return R().rank >= 2; };          /* DM or above: flag fuel, ask for tanks */
  var seesOps = function () { return R().rank >= 1; };          /* everyone but guests sees tanks and fuel */

  function fresh() {
    return { fuel: 'low', tanks: { full: 6, filling: 0, empty: 18 }, reqs: [], notes: [], seq: 1,
      notes0: 0 };
  }
  var S; function load() { try { S = JSON.parse(localStorage.getItem(KEY)) || fresh(); } catch (e) { S = fresh(); } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }
  function now() { return new Date(); }
  function hm(d) { var h = d.getHours(), m = d.getMinutes(); return (h % 12 || 12) + ':' + (m < 10 ? '0' : '') + m + (h >= 12 ? 'pm' : 'am'); }
  function inTwoHours() { var d = new Date(Date.now() + 2 * 3600 * 1000); return (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes(); }
  function clockText(v) { var a = v.split(':'), h = +a[0]; return (h % 12 || 12) + ':' + a[1] + (h >= 12 ? 'pm' : 'am'); }
  function notify(to, title, body, level, icon, status) { S.notes.unshift({ id: S.seq++, to: to, title: title, body: body, level: level, icon: icon, status: status, t: hm(now()) }); S.notes = S.notes.slice(0, 40); }

  /* ---- actions ---- */
  function setFuel(f) {
    if (!canFlag() || S.fuel === f) { return; }
    S.fuel = f;
    var m = { full: ['Boat fuel: full', 'Topped up. Good to go.', 'info', 'fuelFull', 'ok'], low: ['Boat fuel: low', 'Enough for today, plan a refill.', 'low', 'fuelLow', 'low'], refill: ['Boat fuel: refill ASAP', 'Do not leave the dock on this tank.', 'urgent', 'fuelRefill', 'alert'] }[f];
    notify(['dm', 'instructor', 'owner'], m[0], m[1] + ' (flagged by ' + R().who + ')', m[2], m[3], m[4]); save(); render();
  }
  function request(kind, n, needBy, why) {
    if (!canFlag()) { return; }
    var q = { id: S.seq++, kind: kind, n: n, needBy: needBy, why: why, by: R().who, byRole: role, status: 'open', t: hm(now()) };
    S.reqs.unshift(q);
    if (kind === 'urgent') { notify(['filler', 'owner'], 'Tanks needed fast', n + ' tanks by ' + clockText(needBy) + (why ? ' · ' + why : '') + ' · from ' + R().who, 'urgent', 'tankEmpty', 'alert'); }
    else { notify(['filler'], 'Empties ready to fill', (n ? n + ' empties' : 'Empties') + ' whenever you have a moment. No rush. From ' + R().who, 'routine', 'tankEmpty', 'low'); }
    save(); render();
  }
  function reqById(id) { return S.reqs.filter(function (q) { return q.id === id; })[0]; }
  function startFill(id) {
    var q = reqById(id), n; if (!q || q.status !== 'open') { return; }
    n = Math.min(q.n || S.tanks.empty, S.tanks.empty); S.tanks.empty -= n; S.tanks.filling += n; q.status = 'filling'; q.moved = n; q.filler = R().who;
    notify([q.byRole, 'owner'], 'Filling has started', R().who + ' is on ' + n + ' tanks.', 'info', 'tankFilling', 'busy'); save(); render();
  }
  function doneFill(id) {
    var q = reqById(id), n; if (!q || q.status !== 'filling') { return; }
    n = q.moved || 0; S.tanks.filling = Math.max(0, S.tanks.filling - n); S.tanks.full += n; q.status = 'done';
    notify([q.byRole, 'dm', 'instructor', 'owner'], n + ' tanks filled', 'Ready on the rack. Filled by ' + R().who + '.', 'info', 'tankFull', 'ok'); save(); render();
  }

  /* ---- map ---- */
  function pin(name, icon, status, x, y, label, alert) {
    var svg = U.icon(icon, { status: status }).replace('<svg ', '<svg x="-36" y="-36" width="72" height="72" ');
    return '<g class="pin' + (alert ? ' alert' : '') + '" data-pin="' + name + '" tabindex="0" role="button" aria-label="' + label + '" transform="translate(' + x + ',' + y + ')"><circle class="halo" r="46"/>' + svg +
      '<text y="62" text-anchor="middle">' + label + '</text></g>';
  }
  function map() {
    var T = S.tanks, P = U.scene.pins, h = U.scene.build({ tanks: T }), openReq = S.reqs.filter(function (q) { return q.status !== 'done'; }), urgent = openReq.some(function (q) { return q.kind === 'urgent'; });
    if (seesOps()) {
      h += pin('boat', S.fuel === 'full' ? 'fuelFull' : S.fuel === 'low' ? 'fuelLow' : 'fuelRefill', S.fuel === 'full' ? 'ok' : S.fuel === 'low' ? 'low' : 'alert', P.boat[0] - 78, P.boat[1], S.fuel === 'full' ? 'Fuel full' : S.fuel === 'low' ? 'Fuel low' : 'Refill ASAP', S.fuel === 'refill');
      h += pin('tanks', T.empty > T.full ? 'tankEmpty' : 'tankFull', T.empty > T.full ? 'low' : 'ok', P.rack[0], P.rack[1] - 30, T.full + ' full · ' + T.empty + ' empty' + (T.filling ? ' · ' + T.filling + ' filling' : ''), false);
      h += pin('fill', 'compressor', openReq.length ? (urgent ? 'alert' : 'low') : (T.filling ? 'busy' : 'ok'), P.fill[0] + 30, P.fill[1] + 12, openReq.length ? openReq.length + ' to fill' : 'Fill station', urgent);
    }
    $('scene').innerHTML = h;
  }

  /* ---- panel (what you can do, by level) ---- */
  var form = { mode: 'urgent', n: 15, by: '', why: 'PM dive' }, focus = 'tanks';
  function panel() {
    var r = R(), h = '', openReq = S.reqs.filter(function (q) { return q.status !== 'done'; });
    if (r.rank === 0) {
      h = '<h3>Your boat</h3><p>Leaves at <b>1:30pm</b> from the dock, on time. Bring a towel and your logbook.</p><p class="note">Guests see their own plan and the boat, not the shop’s tanks or fuel. Ask at the counter if you need anything.</p>';
    } else {
      h += '<h3>' + (r.id === 'filler' ? 'Tank room' : 'Boat and tanks') + '</h3>';
      if (canFlag()) {
        h += '<label>Boat fuel (tap to flag)</label><div class="seg">' + [['full', 'Full', 'fuelFull', 'ok'], ['low', 'Low', 'fuelLow', 'low'], ['refill', 'Refill ASAP', 'fuelRefill', 'alert']].map(function (f) { return '<button data-fuel="' + f[0] + '" class="' + (S.fuel === f[0] ? 'on' : '') + '">' + U.icon(f[2], { status: f[3] }) + f[1] + '</button>'; }).join('') + '</div>';
        h += '<label>Tanks need filling</label><div class="seg"><button data-mode="urgent" class="' + (form.mode === 'urgent' ? 'on' : '') + '">Needed by a time</button><button data-mode="routine" class="' + (form.mode === 'routine' ? 'on' : '') + '">Whenever, no rush</button></div>';
        h += '<div style="display:flex;flex-wrap:wrap"><div style="margin-right:14px"><label>How many</label><input type="number" id="fn" min="1" max="60" value="' + form.n + '"></div>' +
          (form.mode === 'urgent' ? '<div style="margin-right:14px"><label>Needed by</label><input type="time" id="fb" value="' + (form.by || inTwoHours()) + '"></div>' : '') + '</div>' +
          '<label>Why (optional)</label><input type="text" id="fw" value="' + form.why + '" placeholder="PM dive, we leave in two hours">' +
          '<button class="u-btn sm" id="send">' + (form.mode === 'urgent' ? 'Notify tank fillers now' : 'Leave for the fillers') + '</button>';
      } else {
        h += '<p class="note">Fuel: <b>' + ({ full: 'Full', low: 'Low', refill: 'Refill ASAP' }[S.fuel]) + '</b>. Only a divemaster or above flags fuel and asks for tanks.</p>';
      }
      h += '<label>Requests</label>' + (openReq.length ? openReq.map(function (q) {
        var act = '';
        if (r.id === 'filler' || r.rank >= 3) { act = q.status === 'open' ? '<button class="u-btn sm" data-start="' + q.id + '">I’m on it</button>' : '<button class="u-btn sm" data-done="' + q.id + '">Done · ' + q.moved + ' filled</button>'; }
        return '<div class="req ' + q.kind + '"><b>' + (q.kind === 'urgent' ? 'Urgent · ' + q.n + ' tanks by ' + clockText(q.needBy) : 'Routine · ' + (q.n ? q.n + ' empties' : 'empties')) + '</b><br>' + (q.why ? q.why + ' · ' : '') + 'from ' + q.by + ' at ' + q.t + (q.status === 'filling' ? ' · <b>filling (' + q.filler + ')</b>' : '') + '<br>' + act + '</div>';
      }).join('') : '<p class="note">Nothing waiting.</p>');
      if (r.rank === 4) { h += '<p class="note">Owner sees everything above, plus the hostel rooms and boat bookings once the shop is sketched in.</p>'; }
    }
    $('panel').innerHTML = h;
  }

  /* ---- applet ---- */
  function applet() {
    var r = R(), list = S.notes.filter(function (n) { return n.to.indexOf(role) > -1; }), h = '';
    $('who').textContent = r.who; $('count').textContent = list.length;
    if (r.rank === 0) {
      h += '<div class="day"><div class="u-kicker">Your day</div>' +
        '<div class="row">' + U.icon('key', { tone: 'wash' }) + '<div><b>Room 3 · bunkhouse</b><br><span class="u-muted">Check-out 11am</span></div></div>' +
        '<div class="row">' + U.icon('boat', { tone: 'wash' }) + '<div><b>PM fun dive</b><br><span class="u-muted">Boat leaves 1:30pm · on time</span></div></div>' +
        '<div class="row">' + U.icon('cafe', { tone: 'wash' }) + '<div><b>Josie’s · lunch</b><br><span class="u-muted">Open till 2:30pm</span></div></div></div>';
    }
    h += '<div class="nlist">' + (list.length ? list.map(function (n) {
      return '<div class="n ' + n.level + '">' + U.icon(n.icon, { status: n.status }) + '<div><b>' + n.title + '</b><span>' + n.body + '</span><time>' + n.t + '</time></div></div>';
    }).join('') : '<p class="note" style="text-align:center;margin:30px 10px">' + (r.rank === 0 ? 'Nothing new.' : 'No notifications yet. Switch to a divemaster and ask for tanks.') + '</p>') + '</div>';
    $('applet').innerHTML = h;
  }

  function roles() {
    $('roles').innerHTML = ROLES.map(function (r) { return '<button data-role="' + r.id + '" class="' + (r.id === role ? 'on' : '') + '">' + r.name + '</button>'; }).join('');
  }
  function render() { map(); panel(); applet(); roles(); }

  document.addEventListener('click', function (e) {
    var t = e.target, el = t.closest ? t.closest('[data-role],[data-fuel],[data-mode],[data-start],[data-done],#send,#reset,.pin') : null;
    if (!el) { return; }
    if (el.hasAttribute('data-role')) { role = el.getAttribute('data-role'); try { localStorage.setItem('ud-role', role); } catch (x) { } render(); }
    else if (el.hasAttribute('data-fuel')) { setFuel(el.getAttribute('data-fuel')); }
    else if (el.hasAttribute('data-mode')) { form.n = +($('fn') && $('fn').value) || form.n; form.mode = el.getAttribute('data-mode'); panel(); }
    else if (el.hasAttribute('data-start')) { startFill(+el.getAttribute('data-start')); }
    else if (el.hasAttribute('data-done')) { doneFill(+el.getAttribute('data-done')); }
    else if (el.id === 'send') { form.n = Math.max(1, +$('fn').value || 1); form.why = $('fw').value; if (form.mode === 'urgent') { form.by = $('fb').value || inTwoHours(); } request(form.mode, form.n, form.by || inTwoHours(), form.why); }
    else if (el.id === 'reset') { S = fresh(); save(); render(); }
    else if (el.classList && el.classList.contains('pin')) { var p = $('panel'); p.scrollIntoView && p.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
  });
  document.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('pin')) { e.preventDefault(); $('panel').scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } });
  window.addEventListener('storage', function (e) { if (e.key === KEY) { load(); render(); } });
  load(); render();
})();
