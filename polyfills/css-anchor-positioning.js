var Aa = Object.defineProperty, Ta = Object.defineProperties;
var Oa = Object.getOwnPropertyDescriptors;
var yr = Object.getOwnPropertySymbols;
var La = Object.prototype.hasOwnProperty, $a = Object.prototype.propertyIsEnumerable;
var kr = (e, t, n) => t in e ? Aa(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, $ = (e, t) => {
  for (var n in t || (t = {}))
    La.call(t, n) && kr(e, n, t[n]);
  if (yr)
    for (var n of yr(t))
      $a.call(t, n) && kr(e, n, t[n]);
  return e;
}, ne = (e, t) => Ta(e, Oa(t));
var Ea = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports);
var W = (e, t, n) => new Promise((r, i) => {
  var o = (l) => {
    try {
      c(n.next(l));
    } catch (a) {
      i(a);
    }
  }, s = (l) => {
    try {
      c(n.throw(l));
    } catch (a) {
      i(a);
    }
  }, c = (l) => l.done ? r(l.value) : Promise.resolve(l.value).then(o, s);
  c((n = n.apply(e, t)).next());
});
var vd = Ea((gr) => {
  function _a(e) {
    return typeof e != "number" ? function(t) {
      return $({ top: 0, right: 0, bottom: 0, left: 0 }, t);
    }(e) : { top: e, right: e, bottom: e, left: e };
  }
  function Bt(e) {
    return ne($({}, e), { top: e.y, left: e.x, right: e.x + e.width, bottom: e.y + e.height });
  }
  function Pa(e, t) {
    return W(this, null, function* () {
      var n;
      t === void 0 && (t = {});
      const { x: r, y: i, platform: o, rects: s, elements: c, strategy: l } = e, { boundary: a = "clippingAncestors", rootBoundary: u = "viewport", elementContext: h = "floating", altBoundary: d = !1, padding: m = 0 } = t, w = _a(m), k = c[d ? h === "floating" ? "reference" : "floating" : h], C = Bt(yield o.getClippingRect({ element: (n = yield o.isElement == null ? void 0 : o.isElement(k)) == null || n ? k : k.contextElement || (yield o.getDocumentElement == null ? void 0 : o.getDocumentElement(c.floating)), boundary: a, rootBoundary: u, strategy: l })), b = h === "floating" ? ne($({}, s.floating), { x: r, y: i }) : s.reference, S = yield o.getOffsetParent == null ? void 0 : o.getOffsetParent(c.floating), A = (yield o.isElement == null ? void 0 : o.isElement(S)) && (yield o.getScale == null ? void 0 : o.getScale(S)) || { x: 1, y: 1 }, y = Bt(o.convertOffsetParentRelativeRectToViewportRelativeRect ? yield o.convertOffsetParentRelativeRectToViewportRelativeRect({ rect: b, offsetParent: S, strategy: l }) : b);
      return { top: (C.top - y.top + w.top) / A.y, bottom: (y.bottom - C.bottom + w.bottom) / A.y, left: (C.left - y.left + w.left) / A.x, right: (y.right - C.right + w.right) / A.x };
    });
  }
  const za = ["top", "right", "bottom", "left"];
  za.reduce((e, t) => e.concat(t, t + "-start", t + "-end"), []);
  function le(e) {
    var t;
    return ((t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
  }
  function Ae(e) {
    return le(e).getComputedStyle(e);
  }
  function Ei(e) {
    return e instanceof le(e).Node;
  }
  function Ie(e) {
    return Ei(e) ? (e.nodeName || "").toLowerCase() : "";
  }
  let Tt;
  function _i() {
    if (Tt)
      return Tt;
    const e = navigator.userAgentData;
    return e && Array.isArray(e.brands) ? (Tt = e.brands.map((t) => t.brand + "/" + t.version).join(" "), Tt) : navigator.userAgent;
  }
  function ke(e) {
    return e instanceof le(e).HTMLElement;
  }
  function be(e) {
    return e instanceof le(e).Element;
  }
  function xr(e) {
    return typeof ShadowRoot == "undefined" ? !1 : e instanceof le(e).ShadowRoot || e instanceof ShadowRoot;
  }
  function Zt(e) {
    const { overflow: t, overflowX: n, overflowY: r, display: i } = Ae(e);
    return /auto|scroll|overlay|hidden|clip/.test(t + r + n) && !["inline", "contents"].includes(i);
  }
  function Ma(e) {
    return ["table", "td", "th"].includes(Ie(e));
  }
  function Pn(e) {
    const t = /firefox/i.test(_i()), n = Ae(e), r = n.backdropFilter || n.WebkitBackdropFilter;
    return n.transform !== "none" || n.perspective !== "none" || !!r && r !== "none" || t && n.willChange === "filter" || t && !!n.filter && n.filter !== "none" || ["transform", "perspective"].some((i) => n.willChange.includes(i)) || ["paint", "layout", "strict", "content"].some((i) => {
      const o = n.contain;
      return o != null && o.includes(i);
    });
  }
  function zn() {
    return /^((?!chrome|android).)*safari/i.test(_i());
  }
  function Qn(e) {
    return ["html", "body", "#document"].includes(Ie(e));
  }
  const vr = Math.min, dt = Math.max, Ut = Math.round;
  function Pi(e) {
    const t = Ae(e);
    let n = parseFloat(t.width), r = parseFloat(t.height);
    const i = ke(e), o = i ? e.offsetWidth : n, s = i ? e.offsetHeight : r, c = Ut(n) !== o || Ut(r) !== s;
    return c && (n = o, r = s), { width: n, height: r, fallback: c };
  }
  function zi(e) {
    return be(e) ? e : e.contextElement;
  }
  const Mi = { x: 1, y: 1 };
  function et(e) {
    const t = zi(e);
    if (!ke(t))
      return Mi;
    const n = t.getBoundingClientRect(), { width: r, height: i, fallback: o } = Pi(t);
    let s = (o ? Ut(n.width) : n.width) / r, c = (o ? Ut(n.height) : n.height) / i;
    return s && Number.isFinite(s) || (s = 1), c && Number.isFinite(c) || (c = 1), { x: s, y: c };
  }
  function qe(e, t, n, r) {
    var i, o;
    t === void 0 && (t = !1), n === void 0 && (n = !1);
    const s = e.getBoundingClientRect(), c = zi(e);
    let l = Mi;
    t && (r ? be(r) && (l = et(r)) : l = et(e));
    const a = c ? le(c) : window, u = zn() && n;
    let h = (s.left + (u && ((i = a.visualViewport) == null ? void 0 : i.offsetLeft) || 0)) / l.x, d = (s.top + (u && ((o = a.visualViewport) == null ? void 0 : o.offsetTop) || 0)) / l.y, m = s.width / l.x, w = s.height / l.y;
    if (c) {
      const k = le(c), C = r && be(r) ? le(r) : r;
      let b = k.frameElement;
      for (; b && r && C !== k; ) {
        const S = et(b), A = b.getBoundingClientRect(), y = getComputedStyle(b);
        A.x += (b.clientLeft + parseFloat(y.paddingLeft)) * S.x, A.y += (b.clientTop + parseFloat(y.paddingTop)) * S.y, h *= S.x, d *= S.y, m *= S.x, w *= S.y, h += A.x, d += A.y, b = le(b).frameElement;
      }
    }
    return Bt({ width: m, height: w, x: h, y: d });
  }
  function Me(e) {
    return ((Ei(e) ? e.ownerDocument : e.document) || window.document).documentElement;
  }
  function Jt(e) {
    return be(e) ? { scrollLeft: e.scrollLeft, scrollTop: e.scrollTop } : { scrollLeft: e.pageXOffset, scrollTop: e.pageYOffset };
  }
  function Ii(e) {
    return qe(Me(e)).left + Jt(e).scrollLeft;
  }
  function xt(e) {
    if (Ie(e) === "html")
      return e;
    const t = e.assignedSlot || e.parentNode || xr(e) && e.host || Me(e);
    return xr(t) ? t.host : t;
  }
  function ji(e) {
    const t = xt(e);
    return Qn(t) ? t.ownerDocument.body : ke(t) && Zt(t) ? t : ji(t);
  }
  function mt(e, t) {
    var n;
    t === void 0 && (t = []);
    const r = ji(e), i = r === ((n = e.ownerDocument) == null ? void 0 : n.body), o = le(r);
    return i ? t.concat(o, o.visualViewport || [], Zt(r) ? r : []) : t.concat(r, mt(r));
  }
  function wr(e, t, n) {
    let r;
    if (t === "viewport")
      r = function(s, c) {
        const l = le(s), a = Me(s), u = l.visualViewport;
        let h = a.clientWidth, d = a.clientHeight, m = 0, w = 0;
        if (u) {
          h = u.width, d = u.height;
          const k = zn();
          (!k || k && c === "fixed") && (m = u.offsetLeft, w = u.offsetTop);
        }
        return { width: h, height: d, x: m, y: w };
      }(e, n);
    else if (t === "document")
      r = function(s) {
        const c = Me(s), l = Jt(s), a = s.ownerDocument.body, u = dt(c.scrollWidth, c.clientWidth, a.scrollWidth, a.clientWidth), h = dt(c.scrollHeight, c.clientHeight, a.scrollHeight, a.clientHeight);
        let d = -l.scrollLeft + Ii(s);
        const m = -l.scrollTop;
        return Ae(a).direction === "rtl" && (d += dt(c.clientWidth, a.clientWidth) - u), { width: u, height: h, x: d, y: m };
      }(Me(e));
    else if (be(t))
      r = function(s, c) {
        const l = qe(s, !0, c === "fixed"), a = l.top + s.clientTop, u = l.left + s.clientLeft, h = ke(s) ? et(s) : { x: 1, y: 1 };
        return { width: s.clientWidth * h.x, height: s.clientHeight * h.y, x: u * h.x, y: a * h.y };
      }(t, n);
    else {
      const s = $({}, t);
      if (zn()) {
        var i, o;
        const c = le(e);
        s.x -= ((i = c.visualViewport) == null ? void 0 : i.offsetLeft) || 0, s.y -= ((o = c.visualViewport) == null ? void 0 : o.offsetTop) || 0;
      }
      r = s;
    }
    return Bt(r);
  }
  function Sr(e, t) {
    return ke(e) && Ae(e).position !== "fixed" ? t ? t(e) : e.offsetParent : null;
  }
  function Cr(e, t) {
    const n = le(e);
    if (!ke(e))
      return n;
    let r = Sr(e, t);
    for (; r && Ma(r) && Ae(r).position === "static"; )
      r = Sr(r, t);
    return r && (Ie(r) === "html" || Ie(r) === "body" && Ae(r).position === "static" && !Pn(r)) ? n : r || function(i) {
      let o = xt(i);
      for (; ke(o) && !Qn(o); ) {
        if (Pn(o))
          return o;
        o = xt(o);
      }
      return null;
    }(e) || n;
  }
  function Ia(e, t, n) {
    const r = ke(t), i = Me(t), o = qe(e, !0, n === "fixed", t);
    let s = { scrollLeft: 0, scrollTop: 0 };
    const c = { x: 0, y: 0 };
    if (r || !r && n !== "fixed")
      if ((Ie(t) !== "body" || Zt(i)) && (s = Jt(t)), ke(t)) {
        const l = qe(t, !0);
        c.x = l.x + t.clientLeft, c.y = l.y + t.clientTop;
      } else
        i && (c.x = Ii(i));
    return { x: o.left + s.scrollLeft - c.x, y: o.top + s.scrollTop - c.y, width: o.width, height: o.height };
  }
  const D = { getClippingRect: function(e) {
    let { element: t, boundary: n, rootBoundary: r, strategy: i } = e;
    const o = n === "clippingAncestors" ? function(a, u) {
      const h = u.get(a);
      if (h)
        return h;
      let d = mt(a).filter((C) => be(C) && Ie(C) !== "body"), m = null;
      const w = Ae(a).position === "fixed";
      let k = w ? xt(a) : a;
      for (; be(k) && !Qn(k); ) {
        const C = Ae(k), b = Pn(k);
        C.position === "fixed" ? m = null : (w ? b || m : b || C.position !== "static" || !m || !["absolute", "fixed"].includes(m.position)) ? m = C : d = d.filter((S) => S !== k), k = xt(k);
      }
      return u.set(a, d), d;
    }(t, this._c) : [].concat(n), s = [...o, r], c = s[0], l = s.reduce((a, u) => {
      const h = wr(t, u, i);
      return a.top = dt(h.top, a.top), a.right = vr(h.right, a.right), a.bottom = vr(h.bottom, a.bottom), a.left = dt(h.left, a.left), a;
    }, wr(t, c, i));
    return { width: l.right - l.left, height: l.bottom - l.top, x: l.left, y: l.top };
  }, convertOffsetParentRelativeRectToViewportRelativeRect: function(e) {
    let { rect: t, offsetParent: n, strategy: r } = e;
    const i = ke(n), o = Me(n);
    if (n === o)
      return t;
    let s = { scrollLeft: 0, scrollTop: 0 }, c = { x: 1, y: 1 };
    const l = { x: 0, y: 0 };
    if ((i || !i && r !== "fixed") && ((Ie(n) !== "body" || Zt(o)) && (s = Jt(n)), ke(n))) {
      const a = qe(n);
      c = et(n), l.x = a.x + n.clientLeft, l.y = a.y + n.clientTop;
    }
    return { width: t.width * c.x, height: t.height * c.y, x: t.x * c.x - s.scrollLeft * c.x + l.x, y: t.y * c.y - s.scrollTop * c.y + l.y };
  }, isElement: be, getDimensions: function(e) {
    return Pi(e);
  }, getOffsetParent: Cr, getDocumentElement: Me, getScale: et, getElementRects(e) {
    return W(this, null, function* () {
      let { reference: t, floating: n, strategy: r } = e;
      const i = this.getOffsetParent || Cr, o = this.getDimensions;
      return { reference: Ia(t, yield i(n), r), floating: $({ x: 0, y: 0 }, yield o(n)) };
    });
  }, getClientRects: (e) => Array.from(e.getClientRects()), isRTL: (e) => Ae(e).direction === "rtl" };
  function Ni(e, t, n, r) {
    r === void 0 && (r = {});
    const { ancestorScroll: i = !0, ancestorResize: o = !0, elementResize: s = !0, animationFrame: c = !1 } = r, l = i && !c, a = l || o ? [...be(e) ? mt(e) : e.contextElement ? mt(e.contextElement) : [], ...mt(t)] : [];
    a.forEach((m) => {
      l && m.addEventListener("scroll", n, { passive: !0 }), o && m.addEventListener("resize", n);
    });
    let u, h = null;
    s && (h = new ResizeObserver(() => {
      n();
    }), be(e) && !c && h.observe(e), be(e) || !e.contextElement || c || h.observe(e.contextElement), h.observe(t));
    let d = c ? qe(e) : null;
    return c && function m() {
      const w = qe(e);
      !d || w.x === d.x && w.y === d.y && w.width === d.width && w.height === d.height || n(), d = w, u = requestAnimationFrame(m);
    }(), n(), () => {
      var m;
      a.forEach((w) => {
        l && w.removeEventListener("scroll", n), o && w.removeEventListener("resize", n);
      }), (m = h) == null || m.disconnect(), h = null, c && cancelAnimationFrame(u);
    };
  }
  let ja = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict", Fe = (e = 21) => {
    let t = "", n = e;
    for (; n--; )
      t += ja[Math.random() * 64 | 0];
    return t;
  };
  function Na(e) {
    return !!((e.type === "text/css" || e.rel === "stylesheet") && e.href);
  }
  function Ra(e) {
    const t = new URL(e.href, document.baseURI);
    if (Na(e) && t.origin === location.origin)
      return t;
  }
  function Da(e) {
    return W(this, null, function* () {
      return Promise.all(
        e.map((t) => W(this, null, function* () {
          if (!t.url)
            return t;
          const r = yield (yield fetch(t.url.toString())).text();
          return ne($({}, t), { css: r });
        }))
      );
    });
  }
  function Fa() {
    const e = document.querySelectorAll('[style*="anchor"]'), t = [];
    return e.forEach((n) => {
      const r = Fe(12), i = "data-has-inline-styles";
      n.setAttribute(i, r);
      const o = n.getAttribute("style"), s = `[${i}="${r}"] { ${o} }`;
      t.push({ el: n, css: s });
    }), t;
  }
  function Ba() {
    return W(this, null, function* () {
      const e = document.querySelectorAll("link, style"), t = [];
      e.forEach((r) => {
        if (r.tagName.toLowerCase() === "link") {
          const i = Ra(r);
          i && t.push({ el: r, url: i });
        }
        r.tagName.toLowerCase() === "style" && t.push({ el: r, css: r.innerHTML });
      });
      const n = Fa();
      return yield Da([...t, ...n]);
    });
  }
  const un = 0, v = 1, z = 2, U = 3, R = 4, Te = 5, en = 6, Z = 7, ie = 8, P = 9, O = 10, F = 11, _ = 12, B = 13, At = 14, oe = 15, J = 16, ae = 17, Oe = 18, ce = 19, xe = 20, G = 21, j = 22, ee = 23, fe = 24, re = 25, Ua = 0;
  function Q(e) {
    return e >= 48 && e <= 57;
  }
  function je(e) {
    return Q(e) || // 0 .. 9
    e >= 65 && e <= 70 || // A .. F
    e >= 97 && e <= 102;
  }
  function Yn(e) {
    return e >= 65 && e <= 90;
  }
  function qa(e) {
    return e >= 97 && e <= 122;
  }
  function Ha(e) {
    return Yn(e) || qa(e);
  }
  function Wa(e) {
    return e >= 128;
  }
  function qt(e) {
    return Ha(e) || Wa(e) || e === 95;
  }
  function Ri(e) {
    return qt(e) || Q(e) || e === 45;
  }
  function Va(e) {
    return e >= 0 && e <= 8 || e === 11 || e >= 14 && e <= 31 || e === 127;
  }
  function Ht(e) {
    return e === 10 || e === 13 || e === 12;
  }
  function He(e) {
    return Ht(e) || e === 32 || e === 9;
  }
  function Ce(e, t) {
    return !(e !== 92 || Ht(t) || t === Ua);
  }
  function It(e, t, n) {
    return e === 45 ? qt(t) || t === 45 || Ce(t, n) : qt(e) ? !0 : e === 92 ? Ce(e, t) : !1;
  }
  function hn(e, t, n) {
    return e === 43 || e === 45 ? Q(t) ? 2 : t === 46 && Q(n) ? 3 : 0 : e === 46 ? Q(t) ? 2 : 0 : Q(e) ? 1 : 0;
  }
  function Di(e) {
    return e === 65279 || e === 65534 ? 1 : 0;
  }
  const Mn = new Array(128), Ga = 128, jt = 130, Fi = 131, Xn = 132, Bi = 133;
  for (let e = 0; e < Mn.length; e++)
    Mn[e] = He(e) && jt || Q(e) && Fi || qt(e) && Xn || Va(e) && Bi || e || Ga;
  function pn(e) {
    return e < 128 ? Mn[e] : Xn;
  }
  function tt(e, t) {
    return t < e.length ? e.charCodeAt(t) : 0;
  }
  function In(e, t, n) {
    return n === 13 && tt(e, t + 1) === 10 ? 2 : 1;
  }
  function nt(e, t, n) {
    let r = e.charCodeAt(t);
    return Yn(r) && (r = r | 32), r === n;
  }
  function vt(e, t, n, r) {
    if (n - t !== r.length || t < 0 || n > e.length)
      return !1;
    for (let i = t; i < n; i++) {
      const o = r.charCodeAt(i - t);
      let s = e.charCodeAt(i);
      if (Yn(s) && (s = s | 32), s !== o)
        return !1;
    }
    return !0;
  }
  function Ka(e, t) {
    for (; t >= 0 && He(e.charCodeAt(t)); t--)
      ;
    return t + 1;
  }
  function Ot(e, t) {
    for (; t < e.length && He(e.charCodeAt(t)); t++)
      ;
    return t;
  }
  function fn(e, t) {
    for (; t < e.length && Q(e.charCodeAt(t)); t++)
      ;
    return t;
  }
  function rt(e, t) {
    if (t += 2, je(tt(e, t - 1))) {
      for (const r = Math.min(e.length, t + 5); t < r && je(tt(e, t)); t++)
        ;
      const n = tt(e, t);
      He(n) && (t += In(e, t, n));
    }
    return t;
  }
  function Lt(e, t) {
    for (; t < e.length; t++) {
      const n = e.charCodeAt(t);
      if (!Ri(n)) {
        if (Ce(n, tt(e, t + 1))) {
          t = rt(e, t) - 1;
          continue;
        }
        break;
      }
    }
    return t;
  }
  function tn(e, t) {
    let n = e.charCodeAt(t);
    if ((n === 43 || n === 45) && (n = e.charCodeAt(t += 1)), Q(n) && (t = fn(e, t + 1), n = e.charCodeAt(t)), n === 46 && Q(e.charCodeAt(t + 1)) && (t += 2, t = fn(e, t)), nt(
      e,
      t,
      101
      /* e */
    )) {
      let r = 0;
      n = e.charCodeAt(t + 1), (n === 45 || n === 43) && (r = 1, n = e.charCodeAt(t + 2)), Q(n) && (t = fn(e, t + 1 + r + 1));
    }
    return t;
  }
  function dn(e, t) {
    for (; t < e.length; t++) {
      const n = e.charCodeAt(t);
      if (n === 41) {
        t++;
        break;
      }
      Ce(n, tt(e, t + 1)) && (t = rt(e, t));
    }
    return t;
  }
  function Ui(e) {
    if (e.length === 1 && !je(e.charCodeAt(0)))
      return e[0];
    let t = parseInt(e, 16);
    return (t === 0 || // If this number is zero,
    t >= 55296 && t <= 57343 || // or is for a surrogate,
    t > 1114111) && (t = 65533), String.fromCodePoint(t);
  }
  const qi = [
    "EOF-token",
    "ident-token",
    "function-token",
    "at-keyword-token",
    "hash-token",
    "string-token",
    "bad-string-token",
    "url-token",
    "bad-url-token",
    "delim-token",
    "number-token",
    "percentage-token",
    "dimension-token",
    "whitespace-token",
    "CDO-token",
    "CDC-token",
    "colon-token",
    "semicolon-token",
    "comma-token",
    "[-token",
    "]-token",
    "(-token",
    ")-token",
    "{-token",
    "}-token"
  ], Qa = 16 * 1024;
  function Wt(e = null, t) {
    return e === null || e.length < t ? new Uint32Array(Math.max(t + 1024, Qa)) : e;
  }
  const Ar = 10, Ya = 12, Tr = 13;
  function Or(e) {
    const t = e.source, n = t.length, r = t.length > 0 ? Di(t.charCodeAt(0)) : 0, i = Wt(e.lines, n), o = Wt(e.columns, n);
    let s = e.startLine, c = e.startColumn;
    for (let l = r; l < n; l++) {
      const a = t.charCodeAt(l);
      i[l] = s, o[l] = c++, (a === Ar || a === Tr || a === Ya) && (a === Tr && l + 1 < n && t.charCodeAt(l + 1) === Ar && (l++, i[l] = s, o[l] = c), s++, c = 1);
    }
    i[n] = s, o[n] = c, e.lines = i, e.columns = o, e.computed = !0;
  }
  class Xa {
    constructor() {
      this.lines = null, this.columns = null, this.computed = !1;
    }
    setSource(t, n = 0, r = 1, i = 1) {
      this.source = t, this.startOffset = n, this.startLine = r, this.startColumn = i, this.computed = !1;
    }
    getLocation(t, n) {
      return this.computed || Or(this), {
        source: n,
        offset: this.startOffset + t,
        line: this.lines[t],
        column: this.columns[t]
      };
    }
    getLocationRange(t, n, r) {
      return this.computed || Or(this), {
        source: r,
        start: {
          offset: this.startOffset + t,
          line: this.lines[t],
          column: this.columns[t]
        },
        end: {
          offset: this.startOffset + n,
          line: this.lines[n],
          column: this.columns[n]
        }
      };
    }
  }
  const he = 16777215, _e = 24, Za = /* @__PURE__ */ new Map([
    [z, j],
    [G, j],
    [ce, xe],
    [ee, fe]
  ]);
  class Ja {
    constructor(t, n) {
      this.setSource(t, n);
    }
    reset() {
      this.eof = !1, this.tokenIndex = -1, this.tokenType = 0, this.tokenStart = this.firstCharOffset, this.tokenEnd = this.firstCharOffset;
    }
    setSource(t = "", n = () => {
    }) {
      t = String(t || "");
      const r = t.length, i = Wt(this.offsetAndType, t.length + 1), o = Wt(this.balance, t.length + 1);
      let s = 0, c = 0, l = 0, a = -1;
      for (this.offsetAndType = null, this.balance = null, n(t, (u, h, d) => {
        switch (u) {
          default:
            o[s] = r;
            break;
          case c: {
            let m = l & he;
            for (l = o[m], c = l >> _e, o[s] = m, o[m++] = s; m < s; m++)
              o[m] === r && (o[m] = s);
            break;
          }
          case G:
          case z:
          case ce:
          case ee:
            o[s] = l, c = Za.get(u), l = c << _e | s;
            break;
        }
        i[s++] = u << _e | d, a === -1 && (a = h);
      }), i[s] = un << _e | r, o[s] = r, o[r] = r; l !== 0; ) {
        const u = l & he;
        l = o[u], o[u] = r;
      }
      this.source = t, this.firstCharOffset = a === -1 ? 0 : a, this.tokenCount = s, this.offsetAndType = i, this.balance = o, this.reset(), this.next();
    }
    lookupType(t) {
      return t += this.tokenIndex, t < this.tokenCount ? this.offsetAndType[t] >> _e : un;
    }
    lookupOffset(t) {
      return t += this.tokenIndex, t < this.tokenCount ? this.offsetAndType[t - 1] & he : this.source.length;
    }
    lookupValue(t, n) {
      return t += this.tokenIndex, t < this.tokenCount ? vt(
        this.source,
        this.offsetAndType[t - 1] & he,
        this.offsetAndType[t] & he,
        n
      ) : !1;
    }
    getTokenStart(t) {
      return t === this.tokenIndex ? this.tokenStart : t > 0 ? t < this.tokenCount ? this.offsetAndType[t - 1] & he : this.offsetAndType[this.tokenCount] & he : this.firstCharOffset;
    }
    substrToCursor(t) {
      return this.source.substring(t, this.tokenStart);
    }
    isBalanceEdge(t) {
      return this.balance[this.tokenIndex] < t;
    }
    isDelim(t, n) {
      return n ? this.lookupType(n) === P && this.source.charCodeAt(this.lookupOffset(n)) === t : this.tokenType === P && this.source.charCodeAt(this.tokenStart) === t;
    }
    skip(t) {
      let n = this.tokenIndex + t;
      n < this.tokenCount ? (this.tokenIndex = n, this.tokenStart = this.offsetAndType[n - 1] & he, n = this.offsetAndType[n], this.tokenType = n >> _e, this.tokenEnd = n & he) : (this.tokenIndex = this.tokenCount, this.next());
    }
    next() {
      let t = this.tokenIndex + 1;
      t < this.tokenCount ? (this.tokenIndex = t, this.tokenStart = this.tokenEnd, t = this.offsetAndType[t], this.tokenType = t >> _e, this.tokenEnd = t & he) : (this.eof = !0, this.tokenIndex = this.tokenCount, this.tokenType = un, this.tokenStart = this.tokenEnd = this.source.length);
    }
    skipSC() {
      for (; this.tokenType === B || this.tokenType === re; )
        this.next();
    }
    skipUntilBalanced(t, n) {
      let r = t, i, o;
      e:
        for (; r < this.tokenCount; r++) {
          if (i = this.balance[r], i < t)
            break e;
          switch (o = r > 0 ? this.offsetAndType[r - 1] & he : this.firstCharOffset, n(this.source.charCodeAt(o))) {
            case 1:
              break e;
            case 2:
              r++;
              break e;
            default:
              this.balance[i] === r && (r = i);
          }
        }
      this.skip(r - this.tokenIndex);
    }
    forEachToken(t) {
      for (let n = 0, r = this.firstCharOffset; n < this.tokenCount; n++) {
        const i = r, o = this.offsetAndType[n], s = o & he, c = o >> _e;
        r = s, t(c, i, s, n);
      }
    }
    dump() {
      const t = new Array(this.tokenCount);
      return this.forEachToken((n, r, i, o) => {
        t[o] = {
          idx: o,
          type: qi[n],
          chunk: this.source.substring(r, i),
          balance: this.balance[o]
        };
      }), t;
    }
  }
  function nn(e, t) {
    function n(h) {
      return h < c ? e.charCodeAt(h) : 0;
    }
    function r() {
      if (a = tn(e, a), It(n(a), n(a + 1), n(a + 2))) {
        u = _, a = Lt(e, a);
        return;
      }
      if (n(a) === 37) {
        u = F, a++;
        return;
      }
      u = O;
    }
    function i() {
      const h = a;
      if (a = Lt(e, a), vt(e, h, a, "url") && n(a) === 40) {
        if (a = Ot(e, a + 1), n(a) === 34 || n(a) === 39) {
          u = z, a = h + 4;
          return;
        }
        s();
        return;
      }
      if (n(a) === 40) {
        u = z, a++;
        return;
      }
      u = v;
    }
    function o(h) {
      for (h || (h = n(a++)), u = Te; a < e.length; a++) {
        const d = e.charCodeAt(a);
        switch (pn(d)) {
          case h:
            a++;
            return;
          case jt:
            if (Ht(d)) {
              a += In(e, a, d), u = en;
              return;
            }
            break;
          case 92:
            if (a === e.length - 1)
              break;
            const m = n(a + 1);
            Ht(m) ? a += In(e, a + 1, m) : Ce(d, m) && (a = rt(e, a) - 1);
            break;
        }
      }
    }
    function s() {
      for (u = Z, a = Ot(e, a); a < e.length; a++) {
        const h = e.charCodeAt(a);
        switch (pn(h)) {
          case 41:
            a++;
            return;
          case jt:
            if (a = Ot(e, a), n(a) === 41 || a >= e.length) {
              a < e.length && a++;
              return;
            }
            a = dn(e, a), u = ie;
            return;
          case 34:
          case 39:
          case 40:
          case Bi:
            a = dn(e, a), u = ie;
            return;
          case 92:
            if (Ce(h, n(a + 1))) {
              a = rt(e, a) - 1;
              break;
            }
            a = dn(e, a), u = ie;
            return;
        }
      }
    }
    e = String(e || "");
    const c = e.length;
    let l = Di(n(0)), a = l, u;
    for (; a < c; ) {
      const h = e.charCodeAt(a);
      switch (pn(h)) {
        case jt:
          u = B, a = Ot(e, a + 1);
          break;
        case 34:
          o();
          break;
        case 35:
          Ri(n(a + 1)) || Ce(n(a + 1), n(a + 2)) ? (u = R, a = Lt(e, a + 1)) : (u = P, a++);
          break;
        case 39:
          o();
          break;
        case 40:
          u = G, a++;
          break;
        case 41:
          u = j, a++;
          break;
        case 43:
          hn(h, n(a + 1), n(a + 2)) ? r() : (u = P, a++);
          break;
        case 44:
          u = Oe, a++;
          break;
        case 45:
          hn(h, n(a + 1), n(a + 2)) ? r() : n(a + 1) === 45 && n(a + 2) === 62 ? (u = oe, a = a + 3) : It(h, n(a + 1), n(a + 2)) ? i() : (u = P, a++);
          break;
        case 46:
          hn(h, n(a + 1), n(a + 2)) ? r() : (u = P, a++);
          break;
        case 47:
          n(a + 1) === 42 ? (u = re, a = e.indexOf("*/", a + 2), a = a === -1 ? e.length : a + 2) : (u = P, a++);
          break;
        case 58:
          u = J, a++;
          break;
        case 59:
          u = ae, a++;
          break;
        case 60:
          n(a + 1) === 33 && n(a + 2) === 45 && n(a + 3) === 45 ? (u = At, a = a + 4) : (u = P, a++);
          break;
        case 64:
          It(n(a + 1), n(a + 2), n(a + 3)) ? (u = U, a = Lt(e, a + 1)) : (u = P, a++);
          break;
        case 91:
          u = ce, a++;
          break;
        case 92:
          Ce(h, n(a + 1)) ? i() : (u = P, a++);
          break;
        case 93:
          u = xe, a++;
          break;
        case 123:
          u = ee, a++;
          break;
        case 125:
          u = fe, a++;
          break;
        case Fi:
          r();
          break;
        case Xn:
          i();
          break;
        default:
          u = P, a++;
      }
      t(u, l, l = a);
    }
  }
  let Ge = null;
  class V {
    static createItem(t) {
      return {
        prev: null,
        next: null,
        data: t
      };
    }
    constructor() {
      this.head = null, this.tail = null, this.cursor = null;
    }
    createItem(t) {
      return V.createItem(t);
    }
    // cursor helpers
    allocateCursor(t, n) {
      let r;
      return Ge !== null ? (r = Ge, Ge = Ge.cursor, r.prev = t, r.next = n, r.cursor = this.cursor) : r = {
        prev: t,
        next: n,
        cursor: this.cursor
      }, this.cursor = r, r;
    }
    releaseCursor() {
      const { cursor: t } = this;
      this.cursor = t.cursor, t.prev = null, t.next = null, t.cursor = Ge, Ge = t;
    }
    updateCursors(t, n, r, i) {
      let { cursor: o } = this;
      for (; o !== null; )
        o.prev === t && (o.prev = n), o.next === r && (o.next = i), o = o.cursor;
    }
    *[Symbol.iterator]() {
      for (let t = this.head; t !== null; t = t.next)
        yield t.data;
    }
    // getters
    get size() {
      let t = 0;
      for (let n = this.head; n !== null; n = n.next)
        t++;
      return t;
    }
    get isEmpty() {
      return this.head === null;
    }
    get first() {
      return this.head && this.head.data;
    }
    get last() {
      return this.tail && this.tail.data;
    }
    // convertors
    fromArray(t) {
      let n = null;
      this.head = null;
      for (let r of t) {
        const i = V.createItem(r);
        n !== null ? n.next = i : this.head = i, i.prev = n, n = i;
      }
      return this.tail = n, this;
    }
    toArray() {
      return [...this];
    }
    toJSON() {
      return [...this];
    }
    // array-like methods
    forEach(t, n = this) {
      const r = this.allocateCursor(null, this.head);
      for (; r.next !== null; ) {
        const i = r.next;
        r.next = i.next, t.call(n, i.data, i, this);
      }
      this.releaseCursor();
    }
    forEachRight(t, n = this) {
      const r = this.allocateCursor(this.tail, null);
      for (; r.prev !== null; ) {
        const i = r.prev;
        r.prev = i.prev, t.call(n, i.data, i, this);
      }
      this.releaseCursor();
    }
    reduce(t, n, r = this) {
      let i = this.allocateCursor(null, this.head), o = n, s;
      for (; i.next !== null; )
        s = i.next, i.next = s.next, o = t.call(r, o, s.data, s, this);
      return this.releaseCursor(), o;
    }
    reduceRight(t, n, r = this) {
      let i = this.allocateCursor(this.tail, null), o = n, s;
      for (; i.prev !== null; )
        s = i.prev, i.prev = s.prev, o = t.call(r, o, s.data, s, this);
      return this.releaseCursor(), o;
    }
    some(t, n = this) {
      for (let r = this.head; r !== null; r = r.next)
        if (t.call(n, r.data, r, this))
          return !0;
      return !1;
    }
    map(t, n = this) {
      const r = new V();
      for (let i = this.head; i !== null; i = i.next)
        r.appendData(t.call(n, i.data, i, this));
      return r;
    }
    filter(t, n = this) {
      const r = new V();
      for (let i = this.head; i !== null; i = i.next)
        t.call(n, i.data, i, this) && r.appendData(i.data);
      return r;
    }
    nextUntil(t, n, r = this) {
      if (t === null)
        return;
      const i = this.allocateCursor(null, t);
      for (; i.next !== null; ) {
        const o = i.next;
        if (i.next = o.next, n.call(r, o.data, o, this))
          break;
      }
      this.releaseCursor();
    }
    prevUntil(t, n, r = this) {
      if (t === null)
        return;
      const i = this.allocateCursor(t, null);
      for (; i.prev !== null; ) {
        const o = i.prev;
        if (i.prev = o.prev, n.call(r, o.data, o, this))
          break;
      }
      this.releaseCursor();
    }
    // mutation
    clear() {
      this.head = null, this.tail = null;
    }
    copy() {
      const t = new V();
      for (let n of this)
        t.appendData(n);
      return t;
    }
    prepend(t) {
      return this.updateCursors(null, t, this.head, t), this.head !== null ? (this.head.prev = t, t.next = this.head) : this.tail = t, this.head = t, this;
    }
    prependData(t) {
      return this.prepend(V.createItem(t));
    }
    append(t) {
      return this.insert(t);
    }
    appendData(t) {
      return this.insert(V.createItem(t));
    }
    insert(t, n = null) {
      if (n !== null)
        if (this.updateCursors(n.prev, t, n, t), n.prev === null) {
          if (this.head !== n)
            throw new Error("before doesn't belong to list");
          this.head = t, n.prev = t, t.next = n, this.updateCursors(null, t);
        } else
          n.prev.next = t, t.prev = n.prev, n.prev = t, t.next = n;
      else
        this.updateCursors(this.tail, t, null, t), this.tail !== null ? (this.tail.next = t, t.prev = this.tail) : this.head = t, this.tail = t;
      return this;
    }
    insertData(t, n) {
      return this.insert(V.createItem(t), n);
    }
    remove(t) {
      if (this.updateCursors(t, t.prev, t, t.next), t.prev !== null)
        t.prev.next = t.next;
      else {
        if (this.head !== t)
          throw new Error("item doesn't belong to list");
        this.head = t.next;
      }
      if (t.next !== null)
        t.next.prev = t.prev;
      else {
        if (this.tail !== t)
          throw new Error("item doesn't belong to list");
        this.tail = t.prev;
      }
      return t.prev = null, t.next = null, t;
    }
    push(t) {
      this.insert(V.createItem(t));
    }
    pop() {
      return this.tail !== null ? this.remove(this.tail) : null;
    }
    unshift(t) {
      this.prepend(V.createItem(t));
    }
    shift() {
      return this.head !== null ? this.remove(this.head) : null;
    }
    prependList(t) {
      return this.insertList(t, this.head);
    }
    appendList(t) {
      return this.insertList(t);
    }
    insertList(t, n) {
      return t.head === null ? this : (n != null ? (this.updateCursors(n.prev, t.tail, n, t.head), n.prev !== null ? (n.prev.next = t.head, t.head.prev = n.prev) : this.head = t.head, n.prev = t.tail, t.tail.next = n) : (this.updateCursors(this.tail, t.tail, null, t.head), this.tail !== null ? (this.tail.next = t.head, t.head.prev = this.tail) : this.head = t.head, this.tail = t.tail), t.head = null, t.tail = null, this);
    }
    replace(t, n) {
      "head" in n ? this.insertList(n, t) : this.insert(n, t), this.remove(t);
    }
  }
  function rn(e, t) {
    const n = Object.create(SyntaxError.prototype), r = new Error();
    return Object.assign(n, {
      name: e,
      message: t,
      get stack() {
        return (r.stack || "").replace(/^(.+\n){1,3}/, `${e}: ${t}
`);
      }
    });
  }
  const mn = 100, Lr = 60, $r = "    ";
  function Er({ source: e, line: t, column: n }, r) {
    function i(u, h) {
      return o.slice(u, h).map(
        (d, m) => String(u + m + 1).padStart(l) + " |" + d
      ).join(`
`);
    }
    const o = e.split(/\r\n?|\n|\f/), s = Math.max(1, t - r) - 1, c = Math.min(t + r, o.length + 1), l = Math.max(4, String(c).length) + 1;
    let a = 0;
    n += ($r.length - 1) * (o[t - 1].substr(0, n - 1).match(/\t/g) || []).length, n > mn && (a = n - Lr + 3, n = Lr - 2);
    for (let u = s; u <= c; u++)
      u >= 0 && u < o.length && (o[u] = o[u].replace(/\t/g, $r), o[u] = (a > 0 && o[u].length > a ? "…" : "") + o[u].substr(a, mn - 2) + (o[u].length > a + mn - 1 ? "…" : ""));
    return [
      i(s, t),
      new Array(n + l + 2).join("-") + "^",
      i(t, c)
    ].filter(Boolean).join(`
`);
  }
  function _r(e, t, n, r, i) {
    return Object.assign(rn("SyntaxError", e), {
      source: t,
      offset: n,
      line: r,
      column: i,
      sourceFragment(s) {
        return Er({ source: t, line: r, column: i }, isNaN(s) ? 0 : s);
      },
      get formattedMessage() {
        return `Parse error: ${e}
` + Er({ source: t, line: r, column: i }, 2);
      }
    });
  }
  function es(e) {
    const t = this.createList();
    let n = !1;
    const r = {
      recognizer: e
    };
    for (; !this.eof; ) {
      switch (this.tokenType) {
        case re:
          this.next();
          continue;
        case B:
          n = !0, this.next();
          continue;
      }
      let i = e.getNode.call(this, r);
      if (i === void 0)
        break;
      n && (e.onWhiteSpace && e.onWhiteSpace.call(this, i, t, r), n = !1), t.push(i);
    }
    return n && e.onWhiteSpace && e.onWhiteSpace.call(this, null, t, r), t;
  }
  const Pr = () => {
  }, ts = 33, ns = 35, gn = 59, zr = 123, Mr = 0;
  function rs(e) {
    return function() {
      return this[e]();
    };
  }
  function bn(e) {
    const t = /* @__PURE__ */ Object.create(null);
    for (const n in e) {
      const r = e[n], i = r.parse || r;
      i && (t[n] = i);
    }
    return t;
  }
  function is(e) {
    const t = {
      context: /* @__PURE__ */ Object.create(null),
      scope: Object.assign(/* @__PURE__ */ Object.create(null), e.scope),
      atrule: bn(e.atrule),
      pseudo: bn(e.pseudo),
      node: bn(e.node)
    };
    for (const n in e.parseContext)
      switch (typeof e.parseContext[n]) {
        case "function":
          t.context[n] = e.parseContext[n];
          break;
        case "string":
          t.context[n] = rs(e.parseContext[n]);
          break;
      }
    return $($({
      config: t
    }, t), t.node);
  }
  function os(e) {
    let t = "", n = "<unknown>", r = !1, i = Pr, o = !1;
    const s = new Xa(), c = Object.assign(new Ja(), is(e || {}), {
      parseAtrulePrelude: !0,
      parseRulePrelude: !0,
      parseValue: !0,
      parseCustomProperty: !1,
      readSequence: es,
      consumeUntilBalanceEnd: () => 0,
      consumeUntilLeftCurlyBracket(a) {
        return a === zr ? 1 : 0;
      },
      consumeUntilLeftCurlyBracketOrSemicolon(a) {
        return a === zr || a === gn ? 1 : 0;
      },
      consumeUntilExclamationMarkOrSemicolon(a) {
        return a === ts || a === gn ? 1 : 0;
      },
      consumeUntilSemicolonIncluded(a) {
        return a === gn ? 2 : 0;
      },
      createList() {
        return new V();
      },
      createSingleNodeList(a) {
        return new V().appendData(a);
      },
      getFirstListNode(a) {
        return a && a.first;
      },
      getLastListNode(a) {
        return a && a.last;
      },
      parseWithFallback(a, u) {
        const h = this.tokenIndex;
        try {
          return a.call(this);
        } catch (d) {
          if (o)
            throw d;
          const m = u.call(this, h);
          return o = !0, i(d, m), o = !1, m;
        }
      },
      lookupNonWSType(a) {
        let u;
        do
          if (u = this.lookupType(a++), u !== B)
            return u;
        while (u !== Mr);
        return Mr;
      },
      charCodeAt(a) {
        return a >= 0 && a < t.length ? t.charCodeAt(a) : 0;
      },
      substring(a, u) {
        return t.substring(a, u);
      },
      substrToCursor(a) {
        return this.source.substring(a, this.tokenStart);
      },
      cmpChar(a, u) {
        return nt(t, a, u);
      },
      cmpStr(a, u, h) {
        return vt(t, a, u, h);
      },
      consume(a) {
        const u = this.tokenStart;
        return this.eat(a), this.substrToCursor(u);
      },
      consumeFunctionName() {
        const a = t.substring(this.tokenStart, this.tokenEnd - 1);
        return this.eat(z), a;
      },
      consumeNumber(a) {
        const u = t.substring(this.tokenStart, tn(t, this.tokenStart));
        return this.eat(a), u;
      },
      eat(a) {
        if (this.tokenType !== a) {
          const u = qi[a].slice(0, -6).replace(/-/g, " ").replace(/^./, (m) => m.toUpperCase());
          let h = `${/[[\](){}]/.test(u) ? `"${u}"` : u} is expected`, d = this.tokenStart;
          switch (a) {
            case v:
              this.tokenType === z || this.tokenType === Z ? (d = this.tokenEnd - 1, h = "Identifier is expected but function found") : h = "Identifier is expected";
              break;
            case R:
              this.isDelim(ns) && (this.next(), d++, h = "Name is expected");
              break;
            case F:
              this.tokenType === O && (d = this.tokenEnd, h = "Percent sign is expected");
              break;
          }
          this.error(h, d);
        }
        this.next();
      },
      eatIdent(a) {
        (this.tokenType !== v || this.lookupValue(0, a) === !1) && this.error(`Identifier "${a}" is expected`), this.next();
      },
      eatDelim(a) {
        this.isDelim(a) || this.error(`Delim "${String.fromCharCode(a)}" is expected`), this.next();
      },
      getLocation(a, u) {
        return r ? s.getLocationRange(
          a,
          u,
          n
        ) : null;
      },
      getLocationFromList(a) {
        if (r) {
          const u = this.getFirstListNode(a), h = this.getLastListNode(a);
          return s.getLocationRange(
            u !== null ? u.loc.start.offset - s.startOffset : this.tokenStart,
            h !== null ? h.loc.end.offset - s.startOffset : this.tokenStart,
            n
          );
        }
        return null;
      },
      error(a, u) {
        const h = typeof u != "undefined" && u < t.length ? s.getLocation(u) : this.eof ? s.getLocation(Ka(t, t.length - 1)) : s.getLocation(this.tokenStart);
        throw new _r(
          a || "Unexpected input",
          t,
          h.offset,
          h.line,
          h.column
        );
      }
    });
    return Object.assign(function(a, u) {
      t = a, u = u || {}, c.setSource(t, nn), s.setSource(
        t,
        u.offset,
        u.line,
        u.column
      ), n = u.filename || "<unknown>", r = !!u.positions, i = typeof u.onParseError == "function" ? u.onParseError : Pr, o = !1, c.parseAtrulePrelude = "parseAtrulePrelude" in u ? !!u.parseAtrulePrelude : !0, c.parseRulePrelude = "parseRulePrelude" in u ? !!u.parseRulePrelude : !0, c.parseValue = "parseValue" in u ? !!u.parseValue : !0, c.parseCustomProperty = "parseCustomProperty" in u ? !!u.parseCustomProperty : !1;
      const { context: h = "default", onComment: d } = u;
      if (!(h in c.context))
        throw new Error("Unknown context `" + h + "`");
      typeof d == "function" && c.forEachToken((w, k, C) => {
        if (w === re) {
          const b = c.getLocation(k, C), S = vt(t, C - 2, C, "*/") ? t.slice(k + 2, C - 2) : t.slice(k + 2, C);
          d(S, b);
        }
      });
      const m = c.context[h].call(c, u);
      return c.eof || c.error(), m;
    }, {
      SyntaxError: _r,
      config: c.config
    });
  }
  var Zn = {}, Jn = {}, Ir = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
  Jn.encode = function(e) {
    if (0 <= e && e < Ir.length)
      return Ir[e];
    throw new TypeError("Must be between 0 and 63: " + e);
  };
  Jn.decode = function(e) {
    var t = 65, n = 90, r = 97, i = 122, o = 48, s = 57, c = 43, l = 47, a = 26, u = 52;
    return t <= e && e <= n ? e - t : r <= e && e <= i ? e - r + a : o <= e && e <= s ? e - o + u : e == c ? 62 : e == l ? 63 : -1;
  };
  var Hi = Jn, er = 5, Wi = 1 << er, Vi = Wi - 1, Gi = Wi;
  function as(e) {
    return e < 0 ? (-e << 1) + 1 : (e << 1) + 0;
  }
  function ss(e) {
    var t = (e & 1) === 1, n = e >> 1;
    return t ? -n : n;
  }
  Zn.encode = function(t) {
    var n = "", r, i = as(t);
    do
      r = i & Vi, i >>>= er, i > 0 && (r |= Gi), n += Hi.encode(r);
    while (i > 0);
    return n;
  };
  Zn.decode = function(t, n, r) {
    var i = t.length, o = 0, s = 0, c, l;
    do {
      if (n >= i)
        throw new Error("Expected more digits in base 64 VLQ value.");
      if (l = Hi.decode(t.charCodeAt(n++)), l === -1)
        throw new Error("Invalid base64 digit: " + t.charAt(n - 1));
      c = !!(l & Gi), l &= Vi, o = o + (l << s), s += er;
    } while (c);
    r.value = ss(o), r.rest = n;
  };
  var on = {};
  (function(e) {
    function t(p, f, x) {
      if (f in p)
        return p[f];
      if (arguments.length === 3)
        return x;
      throw new Error('"' + f + '" is a required argument.');
    }
    e.getArg = t;
    var n = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/, r = /^data:.+\,.+$/;
    function i(p) {
      var f = p.match(n);
      return f ? {
        scheme: f[1],
        auth: f[2],
        host: f[3],
        port: f[4],
        path: f[5]
      } : null;
    }
    e.urlParse = i;
    function o(p) {
      var f = "";
      return p.scheme && (f += p.scheme + ":"), f += "//", p.auth && (f += p.auth + "@"), p.host && (f += p.host), p.port && (f += ":" + p.port), p.path && (f += p.path), f;
    }
    e.urlGenerate = o;
    var s = 32;
    function c(p) {
      var f = [];
      return function(x) {
        for (var g = 0; g < f.length; g++)
          if (f[g].input === x) {
            var Y = f[0];
            return f[0] = f[g], f[g] = Y, f[0].result;
          }
        var H = p(x);
        return f.unshift({
          input: x,
          result: H
        }), f.length > s && f.pop(), H;
      };
    }
    var l = c(function(f) {
      var x = f, g = i(f);
      if (g) {
        if (!g.path)
          return f;
        x = g.path;
      }
      for (var Y = e.isAbsolute(x), H = [], me = 0, K = 0; ; )
        if (me = K, K = x.indexOf("/", me), K === -1) {
          H.push(x.slice(me));
          break;
        } else
          for (H.push(x.slice(me, K)); K < x.length && x[K] === "/"; )
            K++;
      for (var Le, ue = 0, K = H.length - 1; K >= 0; K--)
        Le = H[K], Le === "." ? H.splice(K, 1) : Le === ".." ? ue++ : ue > 0 && (Le === "" ? (H.splice(K + 1, ue), ue = 0) : (H.splice(K, 2), ue--));
      return x = H.join("/"), x === "" && (x = Y ? "/" : "."), g ? (g.path = x, o(g)) : x;
    });
    e.normalize = l;
    function a(p, f) {
      p === "" && (p = "."), f === "" && (f = ".");
      var x = i(f), g = i(p);
      if (g && (p = g.path || "/"), x && !x.scheme)
        return g && (x.scheme = g.scheme), o(x);
      if (x || f.match(r))
        return f;
      if (g && !g.host && !g.path)
        return g.host = f, o(g);
      var Y = f.charAt(0) === "/" ? f : l(p.replace(/\/+$/, "") + "/" + f);
      return g ? (g.path = Y, o(g)) : Y;
    }
    e.join = a, e.isAbsolute = function(p) {
      return p.charAt(0) === "/" || n.test(p);
    };
    function u(p, f) {
      p === "" && (p = "."), p = p.replace(/\/$/, "");
      for (var x = 0; f.indexOf(p + "/") !== 0; ) {
        var g = p.lastIndexOf("/");
        if (g < 0 || (p = p.slice(0, g), p.match(/^([^\/]+:\/)?\/*$/)))
          return f;
        ++x;
      }
      return Array(x + 1).join("../") + f.substr(p.length + 1);
    }
    e.relative = u;
    var h = function() {
      var p = /* @__PURE__ */ Object.create(null);
      return !("__proto__" in p);
    }();
    function d(p) {
      return p;
    }
    function m(p) {
      return k(p) ? "$" + p : p;
    }
    e.toSetString = h ? d : m;
    function w(p) {
      return k(p) ? p.slice(1) : p;
    }
    e.fromSetString = h ? d : w;
    function k(p) {
      if (!p)
        return !1;
      var f = p.length;
      if (f < 9 || p.charCodeAt(f - 1) !== 95 || p.charCodeAt(f - 2) !== 95 || p.charCodeAt(f - 3) !== 111 || p.charCodeAt(f - 4) !== 116 || p.charCodeAt(f - 5) !== 111 || p.charCodeAt(f - 6) !== 114 || p.charCodeAt(f - 7) !== 112 || p.charCodeAt(f - 8) !== 95 || p.charCodeAt(f - 9) !== 95)
        return !1;
      for (var x = f - 10; x >= 0; x--)
        if (p.charCodeAt(x) !== 36)
          return !1;
      return !0;
    }
    function C(p, f, x) {
      var g = y(p.source, f.source);
      return g !== 0 || (g = p.originalLine - f.originalLine, g !== 0) || (g = p.originalColumn - f.originalColumn, g !== 0 || x) || (g = p.generatedColumn - f.generatedColumn, g !== 0) || (g = p.generatedLine - f.generatedLine, g !== 0) ? g : y(p.name, f.name);
    }
    e.compareByOriginalPositions = C;
    function b(p, f, x) {
      var g;
      return g = p.originalLine - f.originalLine, g !== 0 || (g = p.originalColumn - f.originalColumn, g !== 0 || x) || (g = p.generatedColumn - f.generatedColumn, g !== 0) || (g = p.generatedLine - f.generatedLine, g !== 0) ? g : y(p.name, f.name);
    }
    e.compareByOriginalPositionsNoSource = b;
    function S(p, f, x) {
      var g = p.generatedLine - f.generatedLine;
      return g !== 0 || (g = p.generatedColumn - f.generatedColumn, g !== 0 || x) || (g = y(p.source, f.source), g !== 0) || (g = p.originalLine - f.originalLine, g !== 0) || (g = p.originalColumn - f.originalColumn, g !== 0) ? g : y(p.name, f.name);
    }
    e.compareByGeneratedPositionsDeflated = S;
    function A(p, f, x) {
      var g = p.generatedColumn - f.generatedColumn;
      return g !== 0 || x || (g = y(p.source, f.source), g !== 0) || (g = p.originalLine - f.originalLine, g !== 0) || (g = p.originalColumn - f.originalColumn, g !== 0) ? g : y(p.name, f.name);
    }
    e.compareByGeneratedPositionsDeflatedNoLine = A;
    function y(p, f) {
      return p === f ? 0 : p === null ? 1 : f === null ? -1 : p > f ? 1 : -1;
    }
    function T(p, f) {
      var x = p.generatedLine - f.generatedLine;
      return x !== 0 || (x = p.generatedColumn - f.generatedColumn, x !== 0) || (x = y(p.source, f.source), x !== 0) || (x = p.originalLine - f.originalLine, x !== 0) || (x = p.originalColumn - f.originalColumn, x !== 0) ? x : y(p.name, f.name);
    }
    e.compareByGeneratedPositionsInflated = T;
    function E(p) {
      return JSON.parse(p.replace(/^\)]}'[^\n]*\n/, ""));
    }
    e.parseSourceMapInput = E;
    function L(p, f, x) {
      if (f = f || "", p && (p[p.length - 1] !== "/" && f[0] !== "/" && (p += "/"), f = p + f), x) {
        var g = i(x);
        if (!g)
          throw new Error("sourceMapURL could not be parsed");
        if (g.path) {
          var Y = g.path.lastIndexOf("/");
          Y >= 0 && (g.path = g.path.substring(0, Y + 1));
        }
        f = a(o(g), f);
      }
      return l(f);
    }
    e.computeSourceURL = L;
  })(on);
  var Ki = {}, tr = on, nr = Object.prototype.hasOwnProperty, Ue = typeof Map != "undefined";
  function Ee() {
    this._array = [], this._set = Ue ? /* @__PURE__ */ new Map() : /* @__PURE__ */ Object.create(null);
  }
  Ee.fromArray = function(t, n) {
    for (var r = new Ee(), i = 0, o = t.length; i < o; i++)
      r.add(t[i], n);
    return r;
  };
  Ee.prototype.size = function() {
    return Ue ? this._set.size : Object.getOwnPropertyNames(this._set).length;
  };
  Ee.prototype.add = function(t, n) {
    var r = Ue ? t : tr.toSetString(t), i = Ue ? this.has(t) : nr.call(this._set, r), o = this._array.length;
    (!i || n) && this._array.push(t), i || (Ue ? this._set.set(t, o) : this._set[r] = o);
  };
  Ee.prototype.has = function(t) {
    if (Ue)
      return this._set.has(t);
    var n = tr.toSetString(t);
    return nr.call(this._set, n);
  };
  Ee.prototype.indexOf = function(t) {
    if (Ue) {
      var n = this._set.get(t);
      if (n >= 0)
        return n;
    } else {
      var r = tr.toSetString(t);
      if (nr.call(this._set, r))
        return this._set[r];
    }
    throw new Error('"' + t + '" is not in the set.');
  };
  Ee.prototype.at = function(t) {
    if (t >= 0 && t < this._array.length)
      return this._array[t];
    throw new Error("No element indexed by " + t);
  };
  Ee.prototype.toArray = function() {
    return this._array.slice();
  };
  Ki.ArraySet = Ee;
  var Qi = {}, Yi = on;
  function ls(e, t) {
    var n = e.generatedLine, r = t.generatedLine, i = e.generatedColumn, o = t.generatedColumn;
    return r > n || r == n && o >= i || Yi.compareByGeneratedPositionsInflated(e, t) <= 0;
  }
  function an() {
    this._array = [], this._sorted = !0, this._last = { generatedLine: -1, generatedColumn: 0 };
  }
  an.prototype.unsortedForEach = function(t, n) {
    this._array.forEach(t, n);
  };
  an.prototype.add = function(t) {
    ls(this._last, t) ? (this._last = t, this._array.push(t)) : (this._sorted = !1, this._array.push(t));
  };
  an.prototype.toArray = function() {
    return this._sorted || (this._array.sort(Yi.compareByGeneratedPositionsInflated), this._sorted = !0), this._array;
  };
  Qi.MappingList = an;
  var st = Zn, q = on, Vt = Ki.ArraySet, cs = Qi.MappingList;
  function de(e) {
    e || (e = {}), this._file = q.getArg(e, "file", null), this._sourceRoot = q.getArg(e, "sourceRoot", null), this._skipValidation = q.getArg(e, "skipValidation", !1), this._sources = new Vt(), this._names = new Vt(), this._mappings = new cs(), this._sourcesContents = null;
  }
  de.prototype._version = 3;
  de.fromSourceMap = function(t) {
    var n = t.sourceRoot, r = new de({
      file: t.file,
      sourceRoot: n
    });
    return t.eachMapping(function(i) {
      var o = {
        generated: {
          line: i.generatedLine,
          column: i.generatedColumn
        }
      };
      i.source != null && (o.source = i.source, n != null && (o.source = q.relative(n, o.source)), o.original = {
        line: i.originalLine,
        column: i.originalColumn
      }, i.name != null && (o.name = i.name)), r.addMapping(o);
    }), t.sources.forEach(function(i) {
      var o = i;
      n !== null && (o = q.relative(n, i)), r._sources.has(o) || r._sources.add(o);
      var s = t.sourceContentFor(i);
      s != null && r.setSourceContent(i, s);
    }), r;
  };
  de.prototype.addMapping = function(t) {
    var n = q.getArg(t, "generated"), r = q.getArg(t, "original", null), i = q.getArg(t, "source", null), o = q.getArg(t, "name", null);
    this._skipValidation || this._validateMapping(n, r, i, o), i != null && (i = String(i), this._sources.has(i) || this._sources.add(i)), o != null && (o = String(o), this._names.has(o) || this._names.add(o)), this._mappings.add({
      generatedLine: n.line,
      generatedColumn: n.column,
      originalLine: r != null && r.line,
      originalColumn: r != null && r.column,
      source: i,
      name: o
    });
  };
  de.prototype.setSourceContent = function(t, n) {
    var r = t;
    this._sourceRoot != null && (r = q.relative(this._sourceRoot, r)), n != null ? (this._sourcesContents || (this._sourcesContents = /* @__PURE__ */ Object.create(null)), this._sourcesContents[q.toSetString(r)] = n) : this._sourcesContents && (delete this._sourcesContents[q.toSetString(r)], Object.keys(this._sourcesContents).length === 0 && (this._sourcesContents = null));
  };
  de.prototype.applySourceMap = function(t, n, r) {
    var i = n;
    if (n == null) {
      if (t.file == null)
        throw new Error(
          `SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map's "file" property. Both were omitted.`
        );
      i = t.file;
    }
    var o = this._sourceRoot;
    o != null && (i = q.relative(o, i));
    var s = new Vt(), c = new Vt();
    this._mappings.unsortedForEach(function(l) {
      if (l.source === i && l.originalLine != null) {
        var a = t.originalPositionFor({
          line: l.originalLine,
          column: l.originalColumn
        });
        a.source != null && (l.source = a.source, r != null && (l.source = q.join(r, l.source)), o != null && (l.source = q.relative(o, l.source)), l.originalLine = a.line, l.originalColumn = a.column, a.name != null && (l.name = a.name));
      }
      var u = l.source;
      u != null && !s.has(u) && s.add(u);
      var h = l.name;
      h != null && !c.has(h) && c.add(h);
    }, this), this._sources = s, this._names = c, t.sources.forEach(function(l) {
      var a = t.sourceContentFor(l);
      a != null && (r != null && (l = q.join(r, l)), o != null && (l = q.relative(o, l)), this.setSourceContent(l, a));
    }, this);
  };
  de.prototype._validateMapping = function(t, n, r, i) {
    if (n && typeof n.line != "number" && typeof n.column != "number")
      throw new Error(
        "original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values."
      );
    if (!(t && "line" in t && "column" in t && t.line > 0 && t.column >= 0 && !n && !r && !i)) {
      if (t && "line" in t && "column" in t && n && "line" in n && "column" in n && t.line > 0 && t.column >= 0 && n.line > 0 && n.column >= 0 && r)
        return;
      throw new Error("Invalid mapping: " + JSON.stringify({
        generated: t,
        source: r,
        original: n,
        name: i
      }));
    }
  };
  de.prototype._serializeMappings = function() {
    for (var t = 0, n = 1, r = 0, i = 0, o = 0, s = 0, c = "", l, a, u, h, d = this._mappings.toArray(), m = 0, w = d.length; m < w; m++) {
      if (a = d[m], l = "", a.generatedLine !== n)
        for (t = 0; a.generatedLine !== n; )
          l += ";", n++;
      else if (m > 0) {
        if (!q.compareByGeneratedPositionsInflated(a, d[m - 1]))
          continue;
        l += ",";
      }
      l += st.encode(a.generatedColumn - t), t = a.generatedColumn, a.source != null && (h = this._sources.indexOf(a.source), l += st.encode(h - s), s = h, l += st.encode(a.originalLine - 1 - i), i = a.originalLine - 1, l += st.encode(a.originalColumn - r), r = a.originalColumn, a.name != null && (u = this._names.indexOf(a.name), l += st.encode(u - o), o = u)), c += l;
    }
    return c;
  };
  de.prototype._generateSourcesContent = function(t, n) {
    return t.map(function(r) {
      if (!this._sourcesContents)
        return null;
      n != null && (r = q.relative(n, r));
      var i = q.toSetString(r);
      return Object.prototype.hasOwnProperty.call(this._sourcesContents, i) ? this._sourcesContents[i] : null;
    }, this);
  };
  de.prototype.toJSON = function() {
    var t = {
      version: this._version,
      sources: this._sources.toArray(),
      names: this._names.toArray(),
      mappings: this._serializeMappings()
    };
    return this._file != null && (t.file = this._file), this._sourceRoot != null && (t.sourceRoot = this._sourceRoot), this._sourcesContents && (t.sourcesContent = this._generateSourcesContent(t.sources, t.sourceRoot)), t;
  };
  de.prototype.toString = function() {
    return JSON.stringify(this.toJSON());
  };
  var us = de;
  const jr = /* @__PURE__ */ new Set(["Atrule", "Selector", "Declaration"]);
  function hs(e) {
    const t = new us(), n = {
      line: 1,
      column: 0
    }, r = {
      line: 0,
      // should be zero to add first mapping
      column: 0
    }, i = {
      line: 1,
      column: 0
    }, o = {
      generated: i
    };
    let s = 1, c = 0, l = !1;
    const a = e.node;
    e.node = function(d) {
      if (d.loc && d.loc.start && jr.has(d.type)) {
        const m = d.loc.start.line, w = d.loc.start.column - 1;
        (r.line !== m || r.column !== w) && (r.line = m, r.column = w, n.line = s, n.column = c, l && (l = !1, (n.line !== i.line || n.column !== i.column) && t.addMapping(o)), l = !0, t.addMapping({
          source: d.loc.source,
          original: r,
          generated: n
        }));
      }
      a.call(this, d), l && jr.has(d.type) && (i.line = s, i.column = c);
    };
    const u = e.emit;
    e.emit = function(d, m, w) {
      for (let k = 0; k < d.length; k++)
        d.charCodeAt(k) === 10 ? (s++, c = 0) : c++;
      u(d, m, w);
    };
    const h = e.result;
    return e.result = function() {
      return l && t.addMapping(o), {
        css: h(),
        map: t
      };
    }, e;
  }
  const ps = 43, fs = 45, yn = (e, t) => {
    if (e === P && (e = t), typeof e == "string") {
      const n = e.charCodeAt(0);
      return n > 127 ? 32768 : n << 8;
    }
    return e;
  }, Xi = [
    [v, v],
    [v, z],
    [v, Z],
    [v, ie],
    [v, "-"],
    [v, O],
    [v, F],
    [v, _],
    [v, oe],
    [v, G],
    [U, v],
    [U, z],
    [U, Z],
    [U, ie],
    [U, "-"],
    [U, O],
    [U, F],
    [U, _],
    [U, oe],
    [R, v],
    [R, z],
    [R, Z],
    [R, ie],
    [R, "-"],
    [R, O],
    [R, F],
    [R, _],
    [R, oe],
    [_, v],
    [_, z],
    [_, Z],
    [_, ie],
    [_, "-"],
    [_, O],
    [_, F],
    [_, _],
    [_, oe],
    ["#", v],
    ["#", z],
    ["#", Z],
    ["#", ie],
    ["#", "-"],
    ["#", O],
    ["#", F],
    ["#", _],
    ["#", oe],
    // https://github.com/w3c/csswg-drafts/pull/6874
    ["-", v],
    ["-", z],
    ["-", Z],
    ["-", ie],
    ["-", "-"],
    ["-", O],
    ["-", F],
    ["-", _],
    ["-", oe],
    // https://github.com/w3c/csswg-drafts/pull/6874
    [O, v],
    [O, z],
    [O, Z],
    [O, ie],
    [O, O],
    [O, F],
    [O, _],
    [O, "%"],
    [O, oe],
    // https://github.com/w3c/csswg-drafts/pull/6874
    ["@", v],
    ["@", z],
    ["@", Z],
    ["@", ie],
    ["@", "-"],
    ["@", oe],
    // https://github.com/w3c/csswg-drafts/pull/6874
    [".", O],
    [".", F],
    [".", _],
    ["+", O],
    ["+", F],
    ["+", _],
    ["/", "*"]
  ], ds = Xi.concat([
    [v, R],
    [_, R],
    [R, R],
    [U, G],
    [U, Te],
    [U, J],
    [F, F],
    [F, _],
    [F, z],
    [F, "-"],
    [j, v],
    [j, z],
    [j, F],
    [j, _],
    [j, R],
    [j, "-"]
  ]);
  function Zi(e) {
    const t = new Set(
      e.map(([n, r]) => yn(n) << 16 | yn(r))
    );
    return function(n, r, i) {
      const o = yn(r, i), s = i.charCodeAt(0);
      return (s === fs && r !== v && r !== z && r !== oe || s === ps ? t.has(n << 16 | s << 8) : t.has(n << 16 | o)) && this.emit(" ", B, !0), o;
    };
  }
  const ms = Zi(Xi), Ji = Zi(ds), Nr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    safe: Ji,
    spec: ms
  }, Symbol.toStringTag, { value: "Module" })), gs = 92;
  function bs(e, t) {
    if (typeof t == "function") {
      let n = null;
      e.children.forEach((r) => {
        n !== null && t.call(this, n), this.node(r), n = r;
      });
      return;
    }
    e.children.forEach(this.node, this);
  }
  function ys(e) {
    nn(e, (t, n, r) => {
      this.token(t, e.slice(n, r));
    });
  }
  function ks(e) {
    const t = /* @__PURE__ */ new Map();
    for (let n in e.node) {
      const r = e.node[n];
      typeof (r.generate || r) == "function" && t.set(n, r.generate || r);
    }
    return function(n, r) {
      let i = "", o = 0, s = {
        node(l) {
          if (t.has(l.type))
            t.get(l.type).call(c, l);
          else
            throw new Error("Unknown node type: " + l.type);
        },
        tokenBefore: Ji,
        token(l, a) {
          o = this.tokenBefore(o, l, a), this.emit(a, l, !1), l === P && a.charCodeAt(0) === gs && this.emit(`
`, B, !0);
        },
        emit(l) {
          i += l;
        },
        result() {
          return i;
        }
      };
      r && (typeof r.decorator == "function" && (s = r.decorator(s)), r.sourceMap && (s = hs(s)), r.mode in Nr && (s.tokenBefore = Nr[r.mode]));
      const c = {
        node: (l) => s.node(l),
        children: bs,
        token: (l, a) => s.token(l, a),
        tokenize: ys
      };
      return s.node(n), s.result();
    };
  }
  function xs(e) {
    return {
      fromPlainObject(t) {
        return e(t, {
          enter(n) {
            n.children && !(n.children instanceof V) && (n.children = new V().fromArray(n.children));
          }
        }), t;
      },
      toPlainObject(t) {
        return e(t, {
          leave(n) {
            n.children && n.children instanceof V && (n.children = n.children.toArray());
          }
        }), t;
      }
    };
  }
  const { hasOwnProperty: rr } = Object.prototype, ct = function() {
  };
  function Rr(e) {
    return typeof e == "function" ? e : ct;
  }
  function Dr(e, t) {
    return function(n, r, i) {
      n.type === t && e.call(this, n, r, i);
    };
  }
  function vs(e, t) {
    const n = t.structure, r = [];
    for (const i in n) {
      if (rr.call(n, i) === !1)
        continue;
      let o = n[i];
      const s = {
        name: i,
        type: !1,
        nullable: !1
      };
      Array.isArray(o) || (o = [o]);
      for (const c of o)
        c === null ? s.nullable = !0 : typeof c == "string" ? s.type = "node" : Array.isArray(c) && (s.type = "list");
      s.type && r.push(s);
    }
    return r.length ? {
      context: t.walkContext,
      fields: r
    } : null;
  }
  function ws(e) {
    const t = {};
    for (const n in e.node)
      if (rr.call(e.node, n)) {
        const r = e.node[n];
        if (!r.structure)
          throw new Error("Missed `structure` field in `" + n + "` node type definition");
        t[n] = vs(n, r);
      }
    return t;
  }
  function Fr(e, t) {
    const n = e.fields.slice(), r = e.context, i = typeof r == "string";
    return t && n.reverse(), function(o, s, c, l) {
      let a;
      i && (a = s[r], s[r] = o);
      for (const u of n) {
        const h = o[u.name];
        if (!u.nullable || h) {
          if (u.type === "list") {
            if (t ? h.reduceRight(l, !1) : h.reduce(l, !1))
              return !0;
          } else if (c(h))
            return !0;
        }
      }
      i && (s[r] = a);
    };
  }
  function Br({
    StyleSheet: e,
    Atrule: t,
    Rule: n,
    Block: r,
    DeclarationList: i
  }) {
    return {
      Atrule: {
        StyleSheet: e,
        Atrule: t,
        Rule: n,
        Block: r
      },
      Rule: {
        StyleSheet: e,
        Atrule: t,
        Rule: n,
        Block: r
      },
      Declaration: {
        StyleSheet: e,
        Atrule: t,
        Rule: n,
        Block: r,
        DeclarationList: i
      }
    };
  }
  function Ss(e) {
    const t = ws(e), n = {}, r = {}, i = Symbol("break-walk"), o = Symbol("skip-node");
    for (const a in t)
      rr.call(t, a) && t[a] !== null && (n[a] = Fr(t[a], !1), r[a] = Fr(t[a], !0));
    const s = Br(n), c = Br(r), l = function(a, u) {
      function h(b, S, A) {
        const y = d.call(C, b, S, A);
        return y === i ? !0 : y === o ? !1 : !!(w.hasOwnProperty(b.type) && w[b.type](b, C, h, k) || m.call(C, b, S, A) === i);
      }
      let d = ct, m = ct, w = n, k = (b, S, A, y) => b || h(S, A, y);
      const C = {
        break: i,
        skip: o,
        root: a,
        stylesheet: null,
        atrule: null,
        atrulePrelude: null,
        rule: null,
        selector: null,
        block: null,
        declaration: null,
        function: null
      };
      if (typeof u == "function")
        d = u;
      else if (u && (d = Rr(u.enter), m = Rr(u.leave), u.reverse && (w = r), u.visit)) {
        if (s.hasOwnProperty(u.visit))
          w = u.reverse ? c[u.visit] : s[u.visit];
        else if (!t.hasOwnProperty(u.visit))
          throw new Error("Bad value `" + u.visit + "` for `visit` option (should be: " + Object.keys(t).sort().join(", ") + ")");
        d = Dr(d, u.visit), m = Dr(m, u.visit);
      }
      if (d === ct && m === ct)
        throw new Error("Neither `enter` nor `leave` walker handler is set or both aren't a function");
      h(a);
    };
    return l.break = i, l.skip = o, l.find = function(a, u) {
      let h = null;
      return l(a, function(d, m, w) {
        if (u.call(this, d, m, w))
          return h = d, i;
      }), h;
    }, l.findLast = function(a, u) {
      let h = null;
      return l(a, {
        reverse: !0,
        enter(d, m, w) {
          if (u.call(this, d, m, w))
            return h = d, i;
        }
      }), h;
    }, l.findAll = function(a, u) {
      const h = [];
      return l(a, function(d, m, w) {
        u.call(this, d, m, w) && h.push(d);
      }), h;
    }, l;
  }
  function Cs(e) {
    return e;
  }
  function As(e) {
    const { min: t, max: n, comma: r } = e;
    return t === 0 && n === 0 ? r ? "#?" : "*" : t === 0 && n === 1 ? "?" : t === 1 && n === 0 ? r ? "#" : "+" : t === 1 && n === 1 ? "" : (r ? "#" : "") + (t === n ? "{" + t + "}" : "{" + t + "," + (n !== 0 ? n : "") + "}");
  }
  function Ts(e) {
    switch (e.type) {
      case "Range":
        return " [" + (e.min === null ? "-∞" : e.min) + "," + (e.max === null ? "∞" : e.max) + "]";
      default:
        throw new Error("Unknown node type `" + e.type + "`");
    }
  }
  function Os(e, t, n, r) {
    const i = e.combinator === " " || r ? e.combinator : " " + e.combinator + " ", o = e.terms.map((s) => ir(s, t, n, r)).join(i);
    return e.explicit || n ? (r || o[0] === "," ? "[" : "[ ") + o + (r ? "]" : " ]") : o;
  }
  function ir(e, t, n, r) {
    let i;
    switch (e.type) {
      case "Group":
        i = Os(e, t, n, r) + (e.disallowEmpty ? "!" : "");
        break;
      case "Multiplier":
        return ir(e.term, t, n, r) + t(As(e), e);
      case "Type":
        i = "<" + e.name + (e.opts ? t(Ts(e.opts), e.opts) : "") + ">";
        break;
      case "Property":
        i = "<'" + e.name + "'>";
        break;
      case "Keyword":
        i = e.name;
        break;
      case "AtKeyword":
        i = "@" + e.name;
        break;
      case "Function":
        i = e.name + "(";
        break;
      case "String":
      case "Token":
        i = e.value;
        break;
      case "Comma":
        i = ",";
        break;
      default:
        throw new Error("Unknown node type `" + e.type + "`");
    }
    return t(i, e);
  }
  function or(e, t) {
    let n = Cs, r = !1, i = !1;
    return typeof t == "function" ? n = t : t && (r = !!t.forceBraces, i = !!t.compact, typeof t.decorate == "function" && (n = t.decorate)), ir(e, n, r, i);
  }
  const Ur = { offset: 0, line: 1, column: 1 };
  function Ls(e, t) {
    const n = e.tokens, r = e.longestMatch, i = r < n.length && n[r].node || null, o = i !== t ? i : null;
    let s = 0, c = 0, l = 0, a = "", u, h;
    for (let d = 0; d < n.length; d++) {
      const m = n[d].value;
      d === r && (c = m.length, s = a.length), o !== null && n[d].node === o && (d <= r ? l++ : l = 0), a += m;
    }
    return r === n.length || l > 1 ? (u = $t(o || t, "end") || ut(Ur, a), h = ut(u)) : (u = $t(o, "start") || ut($t(t, "start") || Ur, a.slice(0, s)), h = $t(o, "end") || ut(u, a.substr(s, c))), {
      css: a,
      mismatchOffset: s,
      mismatchLength: c,
      start: u,
      end: h
    };
  }
  function $t(e, t) {
    const n = e && e.loc && e.loc[t];
    return n ? "line" in n ? ut(n) : n : null;
  }
  function ut({ offset: e, line: t, column: n }, r) {
    const i = {
      offset: e,
      line: t,
      column: n
    };
    if (r) {
      const o = r.split(/\n|\r\n?|\f/);
      i.offset += r.length, i.line += o.length - 1, i.column = o.length === 1 ? i.column + r.length : o.pop().length + 1;
    }
    return i;
  }
  const lt = function(e, t) {
    const n = rn(
      "SyntaxReferenceError",
      e + (t ? " `" + t + "`" : "")
    );
    return n.reference = t, n;
  }, $s = function(e, t, n, r) {
    const i = rn("SyntaxMatchError", e), {
      css: o,
      mismatchOffset: s,
      mismatchLength: c,
      start: l,
      end: a
    } = Ls(r, n);
    return i.rawMessage = e, i.syntax = t ? or(t) : "<generic>", i.css = o, i.mismatchOffset = s, i.mismatchLength = c, i.message = e + `
  syntax: ` + i.syntax + `
   value: ` + (o || "<empty string>") + `
  --------` + new Array(i.mismatchOffset + 1).join("-") + "^", Object.assign(i, l), i.loc = {
      source: n && n.loc && n.loc.source || "<unknown>",
      start: l,
      end: a
    }, i;
  }, Et = /* @__PURE__ */ new Map(), Ke = /* @__PURE__ */ new Map(), Gt = 45, kn = Es, qr = _s;
  function ar(e, t) {
    return t = t || 0, e.length - t >= 2 && e.charCodeAt(t) === Gt && e.charCodeAt(t + 1) === Gt;
  }
  function eo(e, t) {
    if (t = t || 0, e.length - t >= 3 && e.charCodeAt(t) === Gt && e.charCodeAt(t + 1) !== Gt) {
      const n = e.indexOf("-", t + 2);
      if (n !== -1)
        return e.substring(t, n + 1);
    }
    return "";
  }
  function Es(e) {
    if (Et.has(e))
      return Et.get(e);
    const t = e.toLowerCase();
    let n = Et.get(t);
    if (n === void 0) {
      const r = ar(t, 0), i = r ? "" : eo(t, 0);
      n = Object.freeze({
        basename: t.substr(i.length),
        name: t,
        prefix: i,
        vendor: i,
        custom: r
      });
    }
    return Et.set(e, n), n;
  }
  function _s(e) {
    if (Ke.has(e))
      return Ke.get(e);
    let t = e, n = e[0];
    n === "/" ? n = e[1] === "/" ? "//" : "/" : n !== "_" && n !== "*" && n !== "$" && n !== "#" && n !== "+" && n !== "&" && (n = "");
    const r = ar(t, n.length);
    if (!r && (t = t.toLowerCase(), Ke.has(t))) {
      const c = Ke.get(t);
      return Ke.set(e, c), c;
    }
    const i = r ? "" : eo(t, n.length), o = t.substr(0, n.length + i.length), s = Object.freeze({
      basename: t.substr(o.length),
      name: t.substr(n.length),
      hack: n,
      vendor: i,
      prefix: o,
      custom: r
    });
    return Ke.set(e, s), s;
  }
  const to = [
    "initial",
    "inherit",
    "unset",
    "revert",
    "revert-layer"
  ], wt = 43, ve = 45, xn = 110, Qe = !0, Ps = !1;
  function jn(e, t) {
    return e !== null && e.type === P && e.value.charCodeAt(0) === t;
  }
  function gt(e, t, n) {
    for (; e !== null && (e.type === B || e.type === re); )
      e = n(++t);
    return t;
  }
  function ze(e, t, n, r) {
    if (!e)
      return 0;
    const i = e.value.charCodeAt(t);
    if (i === wt || i === ve) {
      if (n)
        return 0;
      t++;
    }
    for (; t < e.value.length; t++)
      if (!Q(e.value.charCodeAt(t)))
        return 0;
    return r + 1;
  }
  function vn(e, t, n) {
    let r = !1, i = gt(e, t, n);
    if (e = n(i), e === null)
      return t;
    if (e.type !== O)
      if (jn(e, wt) || jn(e, ve)) {
        if (r = !0, i = gt(n(++i), i, n), e = n(i), e === null || e.type !== O)
          return 0;
      } else
        return t;
    if (!r) {
      const o = e.value.charCodeAt(0);
      if (o !== wt && o !== ve)
        return 0;
    }
    return ze(e, r ? 0 : 1, r, i);
  }
  function zs(e, t) {
    let n = 0;
    if (!e)
      return 0;
    if (e.type === O)
      return ze(e, 0, Ps, n);
    if (e.type === v && e.value.charCodeAt(0) === ve) {
      if (!nt(e.value, 1, xn))
        return 0;
      switch (e.value.length) {
        case 2:
          return vn(t(++n), n, t);
        case 3:
          return e.value.charCodeAt(2) !== ve ? 0 : (n = gt(t(++n), n, t), e = t(n), ze(e, 0, Qe, n));
        default:
          return e.value.charCodeAt(2) !== ve ? 0 : ze(e, 3, Qe, n);
      }
    } else if (e.type === v || jn(e, wt) && t(n + 1).type === v) {
      if (e.type !== v && (e = t(++n)), e === null || !nt(e.value, 0, xn))
        return 0;
      switch (e.value.length) {
        case 1:
          return vn(t(++n), n, t);
        case 2:
          return e.value.charCodeAt(1) !== ve ? 0 : (n = gt(t(++n), n, t), e = t(n), ze(e, 0, Qe, n));
        default:
          return e.value.charCodeAt(1) !== ve ? 0 : ze(e, 2, Qe, n);
      }
    } else if (e.type === _) {
      let r = e.value.charCodeAt(0), i = r === wt || r === ve ? 1 : 0, o = i;
      for (; o < e.value.length && Q(e.value.charCodeAt(o)); o++)
        ;
      return o === i || !nt(e.value, o, xn) ? 0 : o + 1 === e.value.length ? vn(t(++n), n, t) : e.value.charCodeAt(o + 1) !== ve ? 0 : o + 2 === e.value.length ? (n = gt(t(++n), n, t), e = t(n), ze(e, 0, Qe, n)) : ze(e, o + 2, Qe, n);
    }
    return 0;
  }
  const Ms = 43, no = 45, ro = 63, Is = 117;
  function Nn(e, t) {
    return e !== null && e.type === P && e.value.charCodeAt(0) === t;
  }
  function js(e, t) {
    return e.value.charCodeAt(0) === t;
  }
  function ht(e, t, n) {
    let r = 0;
    for (let i = t; i < e.value.length; i++) {
      const o = e.value.charCodeAt(i);
      if (o === no && n && r !== 0)
        return ht(e, t + r + 1, !1), 6;
      if (!je(o) || ++r > 6)
        return 0;
    }
    return r;
  }
  function _t(e, t, n) {
    if (!e)
      return 0;
    for (; Nn(n(t), ro); ) {
      if (++e > 6)
        return 0;
      t++;
    }
    return t;
  }
  function Ns(e, t) {
    let n = 0;
    if (e === null || e.type !== v || !nt(e.value, 0, Is) || (e = t(++n), e === null))
      return 0;
    if (Nn(e, Ms))
      return e = t(++n), e === null ? 0 : e.type === v ? _t(ht(e, 0, !0), ++n, t) : Nn(e, ro) ? _t(1, ++n, t) : 0;
    if (e.type === O) {
      const r = ht(e, 1, !0);
      return r === 0 ? 0 : (e = t(++n), e === null ? n : e.type === _ || e.type === O ? !js(e, no) || !ht(e, 1, !1) ? 0 : n + 1 : _t(r, n, t));
    }
    return e.type === _ ? _t(ht(e, 1, !0), ++n, t) : 0;
  }
  const Rs = ["calc(", "-moz-calc(", "-webkit-calc("], sr = /* @__PURE__ */ new Map([
    [z, j],
    [G, j],
    [ce, xe],
    [ee, fe]
  ]);
  function ye(e, t) {
    return t < e.length ? e.charCodeAt(t) : 0;
  }
  function io(e, t) {
    return vt(e, 0, e.length, t);
  }
  function oo(e, t) {
    for (let n = 0; n < t.length; n++)
      if (io(e, t[n]))
        return !0;
    return !1;
  }
  function ao(e, t) {
    return t !== e.length - 2 ? !1 : ye(e, t) === 92 && // U+005C REVERSE SOLIDUS (\)
    Q(ye(e, t + 1));
  }
  function sn(e, t, n) {
    if (e && e.type === "Range") {
      const r = Number(
        n !== void 0 && n !== t.length ? t.substr(0, n) : t
      );
      if (isNaN(r) || e.min !== null && r < e.min && typeof e.min != "string" || e.max !== null && r > e.max && typeof e.max != "string")
        return !0;
    }
    return !1;
  }
  function Ds(e, t) {
    let n = 0, r = [], i = 0;
    e:
      do {
        switch (e.type) {
          case fe:
          case j:
          case xe:
            if (e.type !== n)
              break e;
            if (n = r.pop(), r.length === 0) {
              i++;
              break e;
            }
            break;
          case z:
          case G:
          case ce:
          case ee:
            r.push(n), n = sr.get(e.type);
            break;
        }
        i++;
      } while (e = t(i));
    return i;
  }
  function pe(e) {
    return function(t, n, r) {
      return t === null ? 0 : t.type === z && oo(t.value, Rs) ? Ds(t, n) : e(t, n, r);
    };
  }
  function N(e) {
    return function(t) {
      return t === null || t.type !== e ? 0 : 1;
    };
  }
  function Fs(e) {
    if (e === null || e.type !== v)
      return 0;
    const t = e.value.toLowerCase();
    return oo(t, to) || io(t, "default") ? 0 : 1;
  }
  function Bs(e) {
    return e === null || e.type !== v || ye(e.value, 0) !== 45 || ye(e.value, 1) !== 45 ? 0 : 1;
  }
  function Us(e) {
    if (e === null || e.type !== R)
      return 0;
    const t = e.value.length;
    if (t !== 4 && t !== 5 && t !== 7 && t !== 9)
      return 0;
    for (let n = 1; n < t; n++)
      if (!je(ye(e.value, n)))
        return 0;
    return 1;
  }
  function qs(e) {
    return e === null || e.type !== R || !It(ye(e.value, 1), ye(e.value, 2), ye(e.value, 3)) ? 0 : 1;
  }
  function Hs(e, t) {
    if (!e)
      return 0;
    let n = 0, r = [], i = 0;
    e:
      do {
        switch (e.type) {
          case en:
          case ie:
            break e;
          case fe:
          case j:
          case xe:
            if (e.type !== n)
              break e;
            n = r.pop();
            break;
          case ae:
            if (n === 0)
              break e;
            break;
          case P:
            if (n === 0 && e.value === "!")
              break e;
            break;
          case z:
          case G:
          case ce:
          case ee:
            r.push(n), n = sr.get(e.type);
            break;
        }
        i++;
      } while (e = t(i));
    return i;
  }
  function Ws(e, t) {
    if (!e)
      return 0;
    let n = 0, r = [], i = 0;
    e:
      do {
        switch (e.type) {
          case en:
          case ie:
            break e;
          case fe:
          case j:
          case xe:
            if (e.type !== n)
              break e;
            n = r.pop();
            break;
          case z:
          case G:
          case ce:
          case ee:
            r.push(n), n = sr.get(e.type);
            break;
        }
        i++;
      } while (e = t(i));
    return i;
  }
  function $e(e) {
    return e && (e = new Set(e)), function(t, n, r) {
      if (t === null || t.type !== _)
        return 0;
      const i = tn(t.value, 0);
      if (e !== null) {
        const o = t.value.indexOf("\\", i), s = o === -1 || !ao(t.value, o) ? t.value.substr(i) : t.value.substring(i, o);
        if (e.has(s.toLowerCase()) === !1)
          return 0;
      }
      return sn(r, t.value, i) ? 0 : 1;
    };
  }
  function Vs(e, t, n) {
    return e === null || e.type !== F || sn(n, e.value, e.value.length - 1) ? 0 : 1;
  }
  function so(e) {
    return typeof e != "function" && (e = function() {
      return 0;
    }), function(t, n, r) {
      return t !== null && t.type === O && Number(t.value) === 0 ? 1 : e(t, n, r);
    };
  }
  function Gs(e, t, n) {
    if (e === null)
      return 0;
    const r = tn(e.value, 0);
    return !(r === e.value.length) && !ao(e.value, r) || sn(n, e.value, r) ? 0 : 1;
  }
  function Ks(e, t, n) {
    if (e === null || e.type !== O)
      return 0;
    let r = ye(e.value, 0) === 43 || // U+002B PLUS SIGN (+)
    ye(e.value, 0) === 45 ? 1 : 0;
    for (; r < e.value.length; r++)
      if (!Q(ye(e.value, r)))
        return 0;
    return sn(n, e.value, r) ? 0 : 1;
  }
  const Qs = {
    "ident-token": N(v),
    "function-token": N(z),
    "at-keyword-token": N(U),
    "hash-token": N(R),
    "string-token": N(Te),
    "bad-string-token": N(en),
    "url-token": N(Z),
    "bad-url-token": N(ie),
    "delim-token": N(P),
    "number-token": N(O),
    "percentage-token": N(F),
    "dimension-token": N(_),
    "whitespace-token": N(B),
    "CDO-token": N(At),
    "CDC-token": N(oe),
    "colon-token": N(J),
    "semicolon-token": N(ae),
    "comma-token": N(Oe),
    "[-token": N(ce),
    "]-token": N(xe),
    "(-token": N(G),
    ")-token": N(j),
    "{-token": N(ee),
    "}-token": N(fe)
  }, Ys = {
    // token type aliases
    string: N(Te),
    ident: N(v),
    // percentage
    percentage: pe(Vs),
    // numeric
    zero: so(),
    number: pe(Gs),
    integer: pe(Ks),
    // complex types
    "custom-ident": Fs,
    "custom-property-name": Bs,
    "hex-color": Us,
    "id-selector": qs,
    // element( <id-selector> )
    "an-plus-b": zs,
    urange: Ns,
    "declaration-value": Hs,
    "any-value": Ws
  };
  function Xs(e) {
    const {
      angle: t,
      decibel: n,
      frequency: r,
      flex: i,
      length: o,
      resolution: s,
      semitones: c,
      time: l
    } = e || {};
    return {
      dimension: pe($e(null)),
      angle: pe($e(t)),
      decibel: pe($e(n)),
      frequency: pe($e(r)),
      flex: pe($e(i)),
      length: pe(so($e(o))),
      resolution: pe($e(s)),
      semitones: pe($e(c)),
      time: pe($e(l))
    };
  }
  function Zs(e) {
    return $($($({}, Qs), Ys), Xs(e));
  }
  const Js = [
    // absolute length units https://www.w3.org/TR/css-values-3/#lengths
    "cm",
    "mm",
    "q",
    "in",
    "pt",
    "pc",
    "px",
    // font-relative length units https://drafts.csswg.org/css-values-4/#font-relative-lengths
    "em",
    "rem",
    "ex",
    "rex",
    "cap",
    "rcap",
    "ch",
    "rch",
    "ic",
    "ric",
    "lh",
    "rlh",
    // viewport-percentage lengths https://drafts.csswg.org/css-values-4/#viewport-relative-lengths
    "vw",
    "svw",
    "lvw",
    "dvw",
    "vh",
    "svh",
    "lvh",
    "dvh",
    "vi",
    "svi",
    "lvi",
    "dvi",
    "vb",
    "svb",
    "lvb",
    "dvb",
    "vmin",
    "svmin",
    "lvmin",
    "dvmin",
    "vmax",
    "svmax",
    "lvmax",
    "dvmax",
    // container relative lengths https://drafts.csswg.org/css-contain-3/#container-lengths
    "cqw",
    "cqh",
    "cqi",
    "cqb",
    "cqmin",
    "cqmax"
  ], el = ["deg", "grad", "rad", "turn"], tl = ["s", "ms"], nl = ["hz", "khz"], rl = ["dpi", "dpcm", "dppx", "x"], il = ["fr"], ol = ["db"], al = ["st"], Hr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    angle: el,
    decibel: ol,
    flex: il,
    frequency: nl,
    length: Js,
    resolution: rl,
    semitones: al,
    time: tl
  }, Symbol.toStringTag, { value: "Module" }));
  function sl(e, t, n) {
    return Object.assign(rn("SyntaxError", e), {
      input: t,
      offset: n,
      rawMessage: e,
      message: e + `
  ` + t + `
--` + new Array((n || t.length) + 1).join("-") + "^"
    });
  }
  const ll = 9, cl = 10, ul = 12, hl = 13, pl = 32;
  class fl {
    constructor(t) {
      this.str = t, this.pos = 0;
    }
    charCodeAt(t) {
      return t < this.str.length ? this.str.charCodeAt(t) : 0;
    }
    charCode() {
      return this.charCodeAt(this.pos);
    }
    nextCharCode() {
      return this.charCodeAt(this.pos + 1);
    }
    nextNonWsCode(t) {
      return this.charCodeAt(this.findWsEnd(t));
    }
    findWsEnd(t) {
      for (; t < this.str.length; t++) {
        const n = this.str.charCodeAt(t);
        if (n !== hl && n !== cl && n !== ul && n !== pl && n !== ll)
          break;
      }
      return t;
    }
    substringToPos(t) {
      return this.str.substring(this.pos, this.pos = t);
    }
    eat(t) {
      this.charCode() !== t && this.error("Expect `" + String.fromCharCode(t) + "`"), this.pos++;
    }
    peek() {
      return this.pos < this.str.length ? this.str.charAt(this.pos++) : "";
    }
    error(t) {
      throw new sl(t, this.str, this.pos);
    }
  }
  const dl = 9, ml = 10, gl = 12, bl = 13, yl = 32, lo = 33, lr = 35, Wr = 38, Kt = 39, co = 40, kl = 41, uo = 42, cr = 43, ur = 44, Vr = 45, hr = 60, ho = 62, Rn = 63, xl = 64, ln = 91, pr = 93, Qt = 123, Gr = 124, Kr = 125, Qr = 8734, St = new Uint8Array(128).map(
    (e, t) => /[a-zA-Z0-9\-]/.test(String.fromCharCode(t)) ? 1 : 0
  ), Yr = {
    " ": 1,
    "&&": 2,
    "||": 3,
    "|": 4
  };
  function Yt(e) {
    return e.substringToPos(
      e.findWsEnd(e.pos)
    );
  }
  function it(e) {
    let t = e.pos;
    for (; t < e.str.length; t++) {
      const n = e.str.charCodeAt(t);
      if (n >= 128 || St[n] === 0)
        break;
    }
    return e.pos === t && e.error("Expect a keyword"), e.substringToPos(t);
  }
  function Xt(e) {
    let t = e.pos;
    for (; t < e.str.length; t++) {
      const n = e.str.charCodeAt(t);
      if (n < 48 || n > 57)
        break;
    }
    return e.pos === t && e.error("Expect a number"), e.substringToPos(t);
  }
  function vl(e) {
    const t = e.str.indexOf("'", e.pos + 1);
    return t === -1 && (e.pos = e.str.length, e.error("Expect an apostrophe")), e.substringToPos(t + 1);
  }
  function Xr(e) {
    let t = null, n = null;
    return e.eat(Qt), t = Xt(e), e.charCode() === ur ? (e.pos++, e.charCode() !== Kr && (n = Xt(e))) : n = t, e.eat(Kr), {
      min: Number(t),
      max: n ? Number(n) : 0
    };
  }
  function wl(e) {
    let t = null, n = !1;
    switch (e.charCode()) {
      case uo:
        e.pos++, t = {
          min: 0,
          max: 0
        };
        break;
      case cr:
        e.pos++, t = {
          min: 1,
          max: 0
        };
        break;
      case Rn:
        e.pos++, t = {
          min: 0,
          max: 1
        };
        break;
      case lr:
        e.pos++, n = !0, e.charCode() === Qt ? t = Xr(e) : e.charCode() === Rn ? (e.pos++, t = {
          min: 0,
          max: 0
        }) : t = {
          min: 1,
          max: 0
        };
        break;
      case Qt:
        t = Xr(e);
        break;
      default:
        return null;
    }
    return {
      type: "Multiplier",
      comma: n,
      min: t.min,
      max: t.max,
      term: null
    };
  }
  function ot(e, t) {
    const n = wl(e);
    return n !== null ? (n.term = t, e.charCode() === lr && e.charCodeAt(e.pos - 1) === cr ? ot(e, n) : n) : t;
  }
  function wn(e) {
    const t = e.peek();
    return t === "" ? null : {
      type: "Token",
      value: t
    };
  }
  function Sl(e) {
    let t;
    return e.eat(hr), e.eat(Kt), t = it(e), e.eat(Kt), e.eat(ho), ot(e, {
      type: "Property",
      name: t
    });
  }
  function Cl(e) {
    let t = null, n = null, r = 1;
    return e.eat(ln), e.charCode() === Vr && (e.peek(), r = -1), r == -1 && e.charCode() === Qr ? e.peek() : (t = r * Number(Xt(e)), St[e.charCode()] !== 0 && (t += it(e))), Yt(e), e.eat(ur), Yt(e), e.charCode() === Qr ? e.peek() : (r = 1, e.charCode() === Vr && (e.peek(), r = -1), n = r * Number(Xt(e)), St[e.charCode()] !== 0 && (n += it(e))), e.eat(pr), {
      type: "Range",
      min: t,
      max: n
    };
  }
  function Al(e) {
    let t, n = null;
    return e.eat(hr), t = it(e), e.charCode() === co && e.nextCharCode() === kl && (e.pos += 2, t += "()"), e.charCodeAt(e.findWsEnd(e.pos)) === ln && (Yt(e), n = Cl(e)), e.eat(ho), ot(e, {
      type: "Type",
      name: t,
      opts: n
    });
  }
  function Tl(e) {
    const t = it(e);
    return e.charCode() === co ? (e.pos++, {
      type: "Function",
      name: t
    }) : ot(e, {
      type: "Keyword",
      name: t
    });
  }
  function Ol(e, t) {
    function n(i, o) {
      return {
        type: "Group",
        terms: i,
        combinator: o,
        disallowEmpty: !1,
        explicit: !1
      };
    }
    let r;
    for (t = Object.keys(t).sort((i, o) => Yr[i] - Yr[o]); t.length > 0; ) {
      r = t.shift();
      let i = 0, o = 0;
      for (; i < e.length; i++) {
        const s = e[i];
        s.type === "Combinator" && (s.value === r ? (o === -1 && (o = i - 1), e.splice(i, 1), i--) : (o !== -1 && i - o > 1 && (e.splice(
          o,
          i - o,
          n(e.slice(o, i), r)
        ), i = o + 1), o = -1));
      }
      o !== -1 && t.length && e.splice(
        o,
        i - o,
        n(e.slice(o, i), r)
      );
    }
    return r;
  }
  function po(e) {
    const t = [], n = {};
    let r, i = null, o = e.pos;
    for (; r = $l(e); )
      r.type !== "Spaces" && (r.type === "Combinator" ? ((i === null || i.type === "Combinator") && (e.pos = o, e.error("Unexpected combinator")), n[r.value] = !0) : i !== null && i.type !== "Combinator" && (n[" "] = !0, t.push({
        type: "Combinator",
        value: " "
      })), t.push(r), i = r, o = e.pos);
    return i !== null && i.type === "Combinator" && (e.pos -= o, e.error("Unexpected combinator")), {
      type: "Group",
      terms: t,
      combinator: Ol(t, n) || " ",
      disallowEmpty: !1,
      explicit: !1
    };
  }
  function Ll(e) {
    let t;
    return e.eat(ln), t = po(e), e.eat(pr), t.explicit = !0, e.charCode() === lo && (e.pos++, t.disallowEmpty = !0), t;
  }
  function $l(e) {
    let t = e.charCode();
    if (t < 128 && St[t] === 1)
      return Tl(e);
    switch (t) {
      case pr:
        break;
      case ln:
        return ot(e, Ll(e));
      case hr:
        return e.nextCharCode() === Kt ? Sl(e) : Al(e);
      case Gr:
        return {
          type: "Combinator",
          value: e.substringToPos(
            e.pos + (e.nextCharCode() === Gr ? 2 : 1)
          )
        };
      case Wr:
        return e.pos++, e.eat(Wr), {
          type: "Combinator",
          value: "&&"
        };
      case ur:
        return e.pos++, {
          type: "Comma"
        };
      case Kt:
        return ot(e, {
          type: "String",
          value: vl(e)
        });
      case yl:
      case dl:
      case ml:
      case bl:
      case gl:
        return {
          type: "Spaces",
          value: Yt(e)
        };
      case xl:
        return t = e.nextCharCode(), t < 128 && St[t] === 1 ? (e.pos++, {
          type: "AtKeyword",
          name: it(e)
        }) : wn(e);
      case uo:
      case cr:
      case Rn:
      case lr:
      case lo:
        break;
      case Qt:
        if (t = e.nextCharCode(), t < 48 || t > 57)
          return wn(e);
        break;
      default:
        return wn(e);
    }
  }
  function fo(e) {
    const t = new fl(e), n = po(t);
    return t.pos !== e.length && t.error("Unexpected input"), n.terms.length === 1 && n.terms[0].type === "Group" ? n.terms[0] : n;
  }
  const pt = function() {
  };
  function Zr(e) {
    return typeof e == "function" ? e : pt;
  }
  function El(e, t, n) {
    function r(s) {
      switch (i.call(n, s), s.type) {
        case "Group":
          s.terms.forEach(r);
          break;
        case "Multiplier":
          r(s.term);
          break;
        case "Type":
        case "Property":
        case "Keyword":
        case "AtKeyword":
        case "Function":
        case "String":
        case "Token":
        case "Comma":
          break;
        default:
          throw new Error("Unknown type: " + s.type);
      }
      o.call(n, s);
    }
    let i = pt, o = pt;
    if (typeof t == "function" ? i = t : t && (i = Zr(t.enter), o = Zr(t.leave)), i === pt && o === pt)
      throw new Error("Neither `enter` nor `leave` walker handler is set or both aren't a function");
    r(e);
  }
  const _l = {
    decorator(e) {
      const t = [];
      let n = null;
      return ne($({}, e), {
        node(r) {
          const i = n;
          n = r, e.node.call(this, r), n = i;
        },
        emit(r, i, o) {
          t.push({
            type: i,
            value: r,
            node: o ? null : n
          });
        },
        result() {
          return t;
        }
      });
    }
  };
  function Pl(e) {
    const t = [];
    return nn(
      e,
      (n, r, i) => t.push({
        type: n,
        value: e.slice(r, i),
        node: null
      })
    ), t;
  }
  function zl(e, t) {
    return typeof e == "string" ? Pl(e) : t.generate(e, _l);
  }
  const M = { type: "Match" }, I = { type: "Mismatch" }, fr = { type: "DisallowEmpty" }, Ml = 40, Il = 41;
  function X(e, t, n) {
    return t === M && n === I || e === M && t === M && n === M ? e : (e.type === "If" && e.else === I && t === M && (t = e.then, e = e.match), {
      type: "If",
      match: e,
      then: t,
      else: n
    });
  }
  function mo(e) {
    return e.length > 2 && e.charCodeAt(e.length - 2) === Ml && e.charCodeAt(e.length - 1) === Il;
  }
  function Jr(e) {
    return e.type === "Keyword" || e.type === "AtKeyword" || e.type === "Function" || e.type === "Type" && mo(e.name);
  }
  function Dn(e, t, n) {
    switch (e) {
      case " ": {
        let r = M;
        for (let i = t.length - 1; i >= 0; i--) {
          const o = t[i];
          r = X(
            o,
            r,
            I
          );
        }
        return r;
      }
      case "|": {
        let r = I, i = null;
        for (let o = t.length - 1; o >= 0; o--) {
          let s = t[o];
          if (Jr(s) && (i === null && o > 0 && Jr(t[o - 1]) && (i = /* @__PURE__ */ Object.create(null), r = X(
            {
              type: "Enum",
              map: i
            },
            M,
            r
          )), i !== null)) {
            const c = (mo(s.name) ? s.name.slice(0, -1) : s.name).toLowerCase();
            if (!(c in i)) {
              i[c] = s;
              continue;
            }
          }
          i = null, r = X(
            s,
            M,
            r
          );
        }
        return r;
      }
      case "&&": {
        if (t.length > 5)
          return {
            type: "MatchOnce",
            terms: t,
            all: !0
          };
        let r = I;
        for (let i = t.length - 1; i >= 0; i--) {
          const o = t[i];
          let s;
          t.length > 1 ? s = Dn(
            e,
            t.filter(function(c) {
              return c !== o;
            }),
            !1
          ) : s = M, r = X(
            o,
            s,
            r
          );
        }
        return r;
      }
      case "||": {
        if (t.length > 5)
          return {
            type: "MatchOnce",
            terms: t,
            all: !1
          };
        let r = n ? M : I;
        for (let i = t.length - 1; i >= 0; i--) {
          const o = t[i];
          let s;
          t.length > 1 ? s = Dn(
            e,
            t.filter(function(c) {
              return c !== o;
            }),
            !0
          ) : s = M, r = X(
            o,
            s,
            r
          );
        }
        return r;
      }
    }
  }
  function jl(e) {
    let t = M, n = dr(e.term);
    if (e.max === 0)
      n = X(
        n,
        fr,
        I
      ), t = X(
        n,
        null,
        // will be a loop
        I
      ), t.then = X(
        M,
        M,
        t
        // make a loop
      ), e.comma && (t.then.else = X(
        { type: "Comma", syntax: e },
        t,
        I
      ));
    else
      for (let r = e.min || 1; r <= e.max; r++)
        e.comma && t !== M && (t = X(
          { type: "Comma", syntax: e },
          t,
          I
        )), t = X(
          n,
          X(
            M,
            M,
            t
          ),
          I
        );
    if (e.min === 0)
      t = X(
        M,
        M,
        t
      );
    else
      for (let r = 0; r < e.min - 1; r++)
        e.comma && t !== M && (t = X(
          { type: "Comma", syntax: e },
          t,
          I
        )), t = X(
          n,
          t,
          I
        );
    return t;
  }
  function dr(e) {
    if (typeof e == "function")
      return {
        type: "Generic",
        fn: e
      };
    switch (e.type) {
      case "Group": {
        let t = Dn(
          e.combinator,
          e.terms.map(dr),
          !1
        );
        return e.disallowEmpty && (t = X(
          t,
          fr,
          I
        )), t;
      }
      case "Multiplier":
        return jl(e);
      case "Type":
      case "Property":
        return {
          type: e.type,
          name: e.name,
          syntax: e
        };
      case "Keyword":
        return {
          type: e.type,
          name: e.name.toLowerCase(),
          syntax: e
        };
      case "AtKeyword":
        return {
          type: e.type,
          name: "@" + e.name.toLowerCase(),
          syntax: e
        };
      case "Function":
        return {
          type: e.type,
          name: e.name.toLowerCase() + "(",
          syntax: e
        };
      case "String":
        return e.value.length === 3 ? {
          type: "Token",
          value: e.value.charAt(1),
          syntax: e
        } : {
          type: e.type,
          value: e.value.substr(1, e.value.length - 2).replace(/\\'/g, "'"),
          syntax: e
        };
      case "Token":
        return {
          type: e.type,
          value: e.value,
          syntax: e
        };
      case "Comma":
        return {
          type: e.type,
          syntax: e
        };
      default:
        throw new Error("Unknown node type:", e.type);
    }
  }
  function Fn(e, t) {
    return typeof e == "string" && (e = fo(e)), {
      type: "MatchGraph",
      match: dr(e),
      syntax: t || null,
      source: e
    };
  }
  const { hasOwnProperty: ei } = Object.prototype, Nl = 0, Rl = 1, Bn = 2, go = 3, ti = "Match", Dl = "Mismatch", Fl = "Maximum iteration number exceeded (please fill an issue on https://github.com/csstree/csstree/issues)", ni = 15e3;
  function Bl(e) {
    let t = null, n = null, r = e;
    for (; r !== null; )
      n = r.prev, r.prev = t, t = r, r = n;
    return t;
  }
  function Sn(e, t) {
    if (e.length !== t.length)
      return !1;
    for (let n = 0; n < e.length; n++) {
      const r = t.charCodeAt(n);
      let i = e.charCodeAt(n);
      if (i >= 65 && i <= 90 && (i = i | 32), i !== r)
        return !1;
    }
    return !0;
  }
  function Ul(e) {
    return e.type !== P ? !1 : e.value !== "?";
  }
  function ri(e) {
    return e === null ? !0 : e.type === Oe || e.type === z || e.type === G || e.type === ce || e.type === ee || Ul(e);
  }
  function ii(e) {
    return e === null ? !0 : e.type === j || e.type === xe || e.type === fe || e.type === P && e.value === "/";
  }
  function ql(e, t, n) {
    function r() {
      do
        S++, b = S < e.length ? e[S] : null;
      while (b !== null && (b.type === B || b.type === re));
    }
    function i(T) {
      const E = S + T;
      return E < e.length ? e[E] : null;
    }
    function o(T, E) {
      return {
        nextState: T,
        matchStack: y,
        syntaxStack: h,
        thenStack: d,
        tokenIndex: S,
        prev: E
      };
    }
    function s(T) {
      d = {
        nextState: T,
        matchStack: y,
        syntaxStack: h,
        prev: d
      };
    }
    function c(T) {
      m = o(T, m);
    }
    function l() {
      y = {
        type: Rl,
        syntax: t.syntax,
        token: b,
        prev: y
      }, r(), w = null, S > A && (A = S);
    }
    function a() {
      h = {
        syntax: t.syntax,
        opts: t.syntax.opts || h !== null && h.opts || null,
        prev: h
      }, y = {
        type: Bn,
        syntax: t.syntax,
        token: y.token,
        prev: y
      };
    }
    function u() {
      y.type === Bn ? y = y.prev : y = {
        type: go,
        syntax: h.syntax,
        token: y.token,
        prev: y
      }, h = h.prev;
    }
    let h = null, d = null, m = null, w = null, k = 0, C = null, b = null, S = -1, A = 0, y = {
      type: Nl,
      syntax: null,
      token: null,
      prev: null
    };
    for (r(); C === null && ++k < ni; )
      switch (t.type) {
        case "Match":
          if (d === null) {
            if (b !== null && (S !== e.length - 1 || b.value !== "\\0" && b.value !== "\\9")) {
              t = I;
              break;
            }
            C = ti;
            break;
          }
          if (t = d.nextState, t === fr)
            if (d.matchStack === y) {
              t = I;
              break;
            } else
              t = M;
          for (; d.syntaxStack !== h; )
            u();
          d = d.prev;
          break;
        case "Mismatch":
          if (w !== null && w !== !1)
            (m === null || S > m.tokenIndex) && (m = w, w = !1);
          else if (m === null) {
            C = Dl;
            break;
          }
          t = m.nextState, d = m.thenStack, h = m.syntaxStack, y = m.matchStack, S = m.tokenIndex, b = S < e.length ? e[S] : null, m = m.prev;
          break;
        case "MatchGraph":
          t = t.match;
          break;
        case "If":
          t.else !== I && c(t.else), t.then !== M && s(t.then), t = t.match;
          break;
        case "MatchOnce":
          t = {
            type: "MatchOnceBuffer",
            syntax: t,
            index: 0,
            mask: 0
          };
          break;
        case "MatchOnceBuffer": {
          const L = t.syntax.terms;
          if (t.index === L.length) {
            if (t.mask === 0 || t.syntax.all) {
              t = I;
              break;
            }
            t = M;
            break;
          }
          if (t.mask === (1 << L.length) - 1) {
            t = M;
            break;
          }
          for (; t.index < L.length; t.index++) {
            const p = 1 << t.index;
            if (!(t.mask & p)) {
              c(t), s({
                type: "AddMatchOnce",
                syntax: t.syntax,
                mask: t.mask | p
              }), t = L[t.index++];
              break;
            }
          }
          break;
        }
        case "AddMatchOnce":
          t = {
            type: "MatchOnceBuffer",
            syntax: t.syntax,
            index: 0,
            mask: t.mask
          };
          break;
        case "Enum":
          if (b !== null) {
            let L = b.value.toLowerCase();
            if (L.indexOf("\\") !== -1 && (L = L.replace(/\\[09].*$/, "")), ei.call(t.map, L)) {
              t = t.map[L];
              break;
            }
          }
          t = I;
          break;
        case "Generic": {
          const L = h !== null ? h.opts : null, p = S + Math.floor(t.fn(b, i, L));
          if (!isNaN(p) && p > S) {
            for (; S < p; )
              l();
            t = M;
          } else
            t = I;
          break;
        }
        case "Type":
        case "Property": {
          const L = t.type === "Type" ? "types" : "properties", p = ei.call(n, L) ? n[L][t.name] : null;
          if (!p || !p.match)
            throw new Error(
              "Bad syntax reference: " + (t.type === "Type" ? "<" + t.name + ">" : "<'" + t.name + "'>")
            );
          if (w !== !1 && b !== null && t.type === "Type" && // https://drafts.csswg.org/css-values-4/#custom-idents
          // When parsing positionally-ambiguous keywords in a property value, a <custom-ident> production
          // can only claim the keyword if no other unfulfilled production can claim it.
          (t.name === "custom-ident" && b.type === v || // https://drafts.csswg.org/css-values-4/#lengths
          // ... if a `0` could be parsed as either a <number> or a <length> in a property (such as line-height),
          // it must parse as a <number>
          t.name === "length" && b.value === "0")) {
            w === null && (w = o(t, m)), t = I;
            break;
          }
          a(), t = p.match;
          break;
        }
        case "Keyword": {
          const L = t.name;
          if (b !== null) {
            let p = b.value;
            if (p.indexOf("\\") !== -1 && (p = p.replace(/\\[09].*$/, "")), Sn(p, L)) {
              l(), t = M;
              break;
            }
          }
          t = I;
          break;
        }
        case "AtKeyword":
        case "Function":
          if (b !== null && Sn(b.value, t.name)) {
            l(), t = M;
            break;
          }
          t = I;
          break;
        case "Token":
          if (b !== null && b.value === t.value) {
            l(), t = M;
            break;
          }
          t = I;
          break;
        case "Comma":
          b !== null && b.type === Oe ? ri(y.token) ? t = I : (l(), t = ii(b) ? I : M) : t = ri(y.token) || ii(b) ? M : I;
          break;
        case "String":
          let T = "", E = S;
          for (; E < e.length && T.length < t.value.length; E++)
            T += e[E].value;
          if (Sn(T, t.value)) {
            for (; S < E; )
              l();
            t = M;
          } else
            t = I;
          break;
        default:
          throw new Error("Unknown node type: " + t.type);
      }
    switch (C) {
      case null:
        console.warn("[csstree-match] BREAK after " + ni + " iterations"), C = Fl, y = null;
        break;
      case ti:
        for (; h !== null; )
          u();
        break;
      default:
        y = null;
    }
    return {
      tokens: e,
      reason: C,
      iterations: k,
      match: y,
      longestMatch: A
    };
  }
  function oi(e, t, n) {
    const r = ql(e, t, n || {});
    if (r.match === null)
      return r;
    let i = r.match, o = r.match = {
      syntax: t.syntax || null,
      match: []
    };
    const s = [o];
    for (i = Bl(i).prev; i !== null; ) {
      switch (i.type) {
        case Bn:
          o.match.push(o = {
            syntax: i.syntax,
            match: []
          }), s.push(o);
          break;
        case go:
          s.pop(), o = s[s.length - 1];
          break;
        default:
          o.match.push({
            syntax: i.syntax || null,
            token: i.token.value,
            node: i.token.node
          });
      }
      i = i.prev;
    }
    return r;
  }
  function bo(e) {
    function t(i) {
      return i === null ? !1 : i.type === "Type" || i.type === "Property" || i.type === "Keyword";
    }
    function n(i) {
      if (Array.isArray(i.match)) {
        for (let o = 0; o < i.match.length; o++)
          if (n(i.match[o]))
            return t(i.syntax) && r.unshift(i.syntax), !0;
      } else if (i.node === e)
        return r = t(i.syntax) ? [i.syntax] : [], !0;
      return !1;
    }
    let r = null;
    return this.matched !== null && n(this.matched), r;
  }
  function Hl(e, t) {
    return mr(this, e, (n) => n.type === "Type" && n.name === t);
  }
  function Wl(e, t) {
    return mr(this, e, (n) => n.type === "Property" && n.name === t);
  }
  function Vl(e) {
    return mr(this, e, (t) => t.type === "Keyword");
  }
  function mr(e, t, n) {
    const r = bo.call(e, t);
    return r === null ? !1 : r.some(n);
  }
  const Gl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    getTrace: bo,
    isKeyword: Vl,
    isProperty: Wl,
    isType: Hl
  }, Symbol.toStringTag, { value: "Module" }));
  function yo(e) {
    return "node" in e ? e.node : yo(e.match[0]);
  }
  function ko(e) {
    return "node" in e ? e.node : ko(e.match[e.match.length - 1]);
  }
  function ai(e, t, n, r, i) {
    function o(c) {
      if (c.syntax !== null && c.syntax.type === r && c.syntax.name === i) {
        const l = yo(c), a = ko(c);
        e.syntax.walk(t, function(u, h, d) {
          if (u === l) {
            const m = new V();
            do {
              if (m.appendData(h.data), h.data === a)
                break;
              h = h.next;
            } while (h !== null);
            s.push({
              parent: d,
              nodes: m
            });
          }
        });
      }
      Array.isArray(c.match) && c.match.forEach(o);
    }
    const s = [];
    return n.matched !== null && o(n.matched), s;
  }
  const { hasOwnProperty: bt } = Object.prototype;
  function Cn(e) {
    return typeof e == "number" && isFinite(e) && Math.floor(e) === e && e >= 0;
  }
  function si(e) {
    return !!e && Cn(e.offset) && Cn(e.line) && Cn(e.column);
  }
  function Kl(e, t) {
    return function(r, i) {
      if (!r || r.constructor !== Object)
        return i(r, "Type of node should be an Object");
      for (let o in r) {
        let s = !0;
        if (bt.call(r, o) !== !1) {
          if (o === "type")
            r.type !== e && i(r, "Wrong node type `" + r.type + "`, expected `" + e + "`");
          else if (o === "loc") {
            if (r.loc === null)
              continue;
            if (r.loc && r.loc.constructor === Object)
              if (typeof r.loc.source != "string")
                o += ".source";
              else if (!si(r.loc.start))
                o += ".start";
              else if (!si(r.loc.end))
                o += ".end";
              else
                continue;
            s = !1;
          } else if (t.hasOwnProperty(o)) {
            s = !1;
            for (let c = 0; !s && c < t[o].length; c++) {
              const l = t[o][c];
              switch (l) {
                case String:
                  s = typeof r[o] == "string";
                  break;
                case Boolean:
                  s = typeof r[o] == "boolean";
                  break;
                case null:
                  s = r[o] === null;
                  break;
                default:
                  typeof l == "string" ? s = r[o] && r[o].type === l : Array.isArray(l) && (s = r[o] instanceof V);
              }
            }
          } else
            i(r, "Unknown field `" + o + "` for " + e + " node type");
          s || i(r, "Bad value for `" + e + "." + o + "`");
        }
      }
      for (const o in t)
        bt.call(t, o) && bt.call(r, o) === !1 && i(r, "Field `" + e + "." + o + "` is missed");
    };
  }
  function Ql(e, t) {
    const n = t.structure, r = {
      type: String,
      loc: !0
    }, i = {
      type: '"' + e + '"'
    };
    for (const o in n) {
      if (bt.call(n, o) === !1)
        continue;
      const s = [], c = r[o] = Array.isArray(n[o]) ? n[o].slice() : [n[o]];
      for (let l = 0; l < c.length; l++) {
        const a = c[l];
        if (a === String || a === Boolean)
          s.push(a.name);
        else if (a === null)
          s.push("null");
        else if (typeof a == "string")
          s.push("<" + a + ">");
        else if (Array.isArray(a))
          s.push("List");
        else
          throw new Error("Wrong value `" + a + "` in `" + e + "." + o + "` structure definition");
      }
      i[o] = s.join(" | ");
    }
    return {
      docs: i,
      check: Kl(e, r)
    };
  }
  function Yl(e) {
    const t = {};
    if (e.node) {
      for (const n in e.node)
        if (bt.call(e.node, n)) {
          const r = e.node[n];
          if (r.structure)
            t[n] = Ql(n, r);
          else
            throw new Error("Missed `structure` field in `" + n + "` node type definition");
        }
    }
    return t;
  }
  const Xl = Fn(to.join(" | "));
  function Un(e, t, n) {
    const r = {};
    for (const i in e)
      e[i].syntax && (r[i] = n ? e[i].syntax : or(e[i].syntax, { compact: t }));
    return r;
  }
  function Zl(e, t, n) {
    const r = {};
    for (const [i, o] of Object.entries(e))
      r[i] = {
        prelude: o.prelude && (n ? o.prelude.syntax : or(o.prelude.syntax, { compact: t })),
        descriptors: o.descriptors && Un(o.descriptors, t, n)
      };
    return r;
  }
  function Jl(e) {
    for (let t = 0; t < e.length; t++)
      if (e[t].value.toLowerCase() === "var(")
        return !0;
    return !1;
  }
  function ge(e, t, n) {
    return $({
      matched: e,
      iterations: n,
      error: t
    }, Gl);
  }
  function Ye(e, t, n, r) {
    const i = zl(n, e.syntax);
    let o;
    return Jl(i) ? ge(null, new Error("Matching for a tree with var() is not supported")) : (r && (o = oi(i, e.cssWideKeywordsSyntax, e)), (!r || !o.match) && (o = oi(i, t.match, e), !o.match) ? ge(
      null,
      new $s(o.reason, t.syntax, n, o),
      o.iterations
    ) : ge(o.match, null, o.iterations));
  }
  class li {
    constructor(t, n, r) {
      if (this.cssWideKeywordsSyntax = Xl, this.syntax = n, this.generic = !1, this.units = $({}, Hr), this.atrules = /* @__PURE__ */ Object.create(null), this.properties = /* @__PURE__ */ Object.create(null), this.types = /* @__PURE__ */ Object.create(null), this.structure = r || Yl(t), t) {
        if (t.units)
          for (const i of Object.keys(Hr))
            Array.isArray(t.units[i]) && (this.units[i] = t.units[i]);
        if (t.types)
          for (const i in t.types)
            this.addType_(i, t.types[i]);
        if (t.generic) {
          this.generic = !0;
          for (const [i, o] of Object.entries(Zs(this.units)))
            this.addType_(i, o);
        }
        if (t.atrules)
          for (const i in t.atrules)
            this.addAtrule_(i, t.atrules[i]);
        if (t.properties)
          for (const i in t.properties)
            this.addProperty_(i, t.properties[i]);
      }
    }
    checkStructure(t) {
      function n(o, s) {
        i.push({ node: o, message: s });
      }
      const r = this.structure, i = [];
      return this.syntax.walk(t, function(o) {
        r.hasOwnProperty(o.type) ? r[o.type].check(o, n) : n(o, "Unknown node type `" + o.type + "`");
      }), i.length ? i : !1;
    }
    createDescriptor(t, n, r, i = null) {
      const o = {
        type: n,
        name: r
      }, s = {
        type: n,
        name: r,
        parent: i,
        serializable: typeof t == "string" || t && typeof t.type == "string",
        syntax: null,
        match: null
      };
      return typeof t == "function" ? s.match = Fn(t, o) : (typeof t == "string" ? Object.defineProperty(s, "syntax", {
        get() {
          return Object.defineProperty(s, "syntax", {
            value: fo(t)
          }), s.syntax;
        }
      }) : s.syntax = t, Object.defineProperty(s, "match", {
        get() {
          return Object.defineProperty(s, "match", {
            value: Fn(s.syntax, o)
          }), s.match;
        }
      })), s;
    }
    addAtrule_(t, n) {
      n && (this.atrules[t] = {
        type: "Atrule",
        name: t,
        prelude: n.prelude ? this.createDescriptor(n.prelude, "AtrulePrelude", t) : null,
        descriptors: n.descriptors ? Object.keys(n.descriptors).reduce(
          (r, i) => (r[i] = this.createDescriptor(n.descriptors[i], "AtruleDescriptor", i, t), r),
          /* @__PURE__ */ Object.create(null)
        ) : null
      });
    }
    addProperty_(t, n) {
      n && (this.properties[t] = this.createDescriptor(n, "Property", t));
    }
    addType_(t, n) {
      n && (this.types[t] = this.createDescriptor(n, "Type", t));
    }
    checkAtruleName(t) {
      if (!this.getAtrule(t))
        return new lt("Unknown at-rule", "@" + t);
    }
    checkAtrulePrelude(t, n) {
      const r = this.checkAtruleName(t);
      if (r)
        return r;
      const i = this.getAtrule(t);
      if (!i.prelude && n)
        return new SyntaxError("At-rule `@" + t + "` should not contain a prelude");
      if (i.prelude && !n && !Ye(this, i.prelude, "", !1).matched)
        return new SyntaxError("At-rule `@" + t + "` should contain a prelude");
    }
    checkAtruleDescriptorName(t, n) {
      const r = this.checkAtruleName(t);
      if (r)
        return r;
      const i = this.getAtrule(t), o = kn(n);
      if (!i.descriptors)
        return new SyntaxError("At-rule `@" + t + "` has no known descriptors");
      if (!i.descriptors[o.name] && !i.descriptors[o.basename])
        return new lt("Unknown at-rule descriptor", n);
    }
    checkPropertyName(t) {
      if (!this.getProperty(t))
        return new lt("Unknown property", t);
    }
    matchAtrulePrelude(t, n) {
      const r = this.checkAtrulePrelude(t, n);
      if (r)
        return ge(null, r);
      const i = this.getAtrule(t);
      return i.prelude ? Ye(this, i.prelude, n || "", !1) : ge(null, null);
    }
    matchAtruleDescriptor(t, n, r) {
      const i = this.checkAtruleDescriptorName(t, n);
      if (i)
        return ge(null, i);
      const o = this.getAtrule(t), s = kn(n);
      return Ye(this, o.descriptors[s.name] || o.descriptors[s.basename], r, !1);
    }
    matchDeclaration(t) {
      return t.type !== "Declaration" ? ge(null, new Error("Not a Declaration node")) : this.matchProperty(t.property, t.value);
    }
    matchProperty(t, n) {
      if (qr(t).custom)
        return ge(null, new Error("Lexer matching doesn't applicable for custom properties"));
      const r = this.checkPropertyName(t);
      return r ? ge(null, r) : Ye(this, this.getProperty(t), n, !0);
    }
    matchType(t, n) {
      const r = this.getType(t);
      return r ? Ye(this, r, n, !1) : ge(null, new lt("Unknown type", t));
    }
    match(t, n) {
      return typeof t != "string" && (!t || !t.type) ? ge(null, new lt("Bad syntax")) : ((typeof t == "string" || !t.match) && (t = this.createDescriptor(t, "Type", "anonymous")), Ye(this, t, n, !1));
    }
    findValueFragments(t, n, r, i) {
      return ai(this, n, this.matchProperty(t, n), r, i);
    }
    findDeclarationValueFragments(t, n, r) {
      return ai(this, t.value, this.matchDeclaration(t), n, r);
    }
    findAllFragments(t, n, r) {
      const i = [];
      return this.syntax.walk(t, {
        visit: "Declaration",
        enter: (o) => {
          i.push.apply(i, this.findDeclarationValueFragments(o, n, r));
        }
      }), i;
    }
    getAtrule(t, n = !0) {
      const r = kn(t);
      return (r.vendor && n ? this.atrules[r.name] || this.atrules[r.basename] : this.atrules[r.name]) || null;
    }
    getAtrulePrelude(t, n = !0) {
      const r = this.getAtrule(t, n);
      return r && r.prelude || null;
    }
    getAtruleDescriptor(t, n) {
      return this.atrules.hasOwnProperty(t) && this.atrules.declarators && this.atrules[t].declarators[n] || null;
    }
    getProperty(t, n = !0) {
      const r = qr(t);
      return (r.vendor && n ? this.properties[r.name] || this.properties[r.basename] : this.properties[r.name]) || null;
    }
    getType(t) {
      return hasOwnProperty.call(this.types, t) ? this.types[t] : null;
    }
    validate() {
      function t(i, o, s, c) {
        if (s.has(o))
          return s.get(o);
        s.set(o, !1), c.syntax !== null && El(c.syntax, function(l) {
          if (l.type !== "Type" && l.type !== "Property")
            return;
          const a = l.type === "Type" ? i.types : i.properties, u = l.type === "Type" ? n : r;
          (!hasOwnProperty.call(a, l.name) || t(i, l.name, u, a[l.name])) && s.set(o, !0);
        }, this);
      }
      let n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
      for (const i in this.types)
        t(this, i, n, this.types[i]);
      for (const i in this.properties)
        t(this, i, r, this.properties[i]);
      return n = [...n.keys()].filter((i) => n.get(i)), r = [...r.keys()].filter((i) => r.get(i)), n.length || r.length ? {
        types: n,
        properties: r
      } : null;
    }
    dump(t, n) {
      return {
        generic: this.generic,
        units: this.units,
        types: Un(this.types, !n, t),
        properties: Un(this.properties, !n, t),
        atrules: Zl(this.atrules, !n, t)
      };
    }
    toString() {
      return JSON.stringify(this.dump());
    }
  }
  function An(e, t) {
    return typeof t == "string" && /^\s*\|/.test(t) ? typeof e == "string" ? e + t : t.replace(/^\s*\|\s*/, "") : t || null;
  }
  function ci(e, t) {
    const n = /* @__PURE__ */ Object.create(null);
    for (const [r, i] of Object.entries(e))
      if (i) {
        n[r] = {};
        for (const o of Object.keys(i))
          t.includes(o) && (n[r][o] = i[o]);
      }
    return n;
  }
  function qn(e, t) {
    const n = $({}, e);
    for (const [r, i] of Object.entries(t))
      switch (r) {
        case "generic":
          n[r] = !!i;
          break;
        case "units":
          n[r] = $({}, e[r]);
          for (const [o, s] of Object.entries(i))
            n[r][o] = Array.isArray(s) ? s : [];
          break;
        case "atrules":
          n[r] = $({}, e[r]);
          for (const [o, s] of Object.entries(i)) {
            const c = n[r][o] || {}, l = n[r][o] = {
              prelude: c.prelude || null,
              descriptors: $({}, c.descriptors)
            };
            if (s) {
              l.prelude = s.prelude ? An(l.prelude, s.prelude) : l.prelude || null;
              for (const [a, u] of Object.entries(s.descriptors || {}))
                l.descriptors[a] = u ? An(l.descriptors[a], u) : null;
              Object.keys(l.descriptors).length || (l.descriptors = null);
            }
          }
          break;
        case "types":
        case "properties":
          n[r] = $({}, e[r]);
          for (const [o, s] of Object.entries(i))
            n[r][o] = An(n[r][o], s);
          break;
        case "scope":
          n[r] = $({}, e[r]);
          for (const [o, s] of Object.entries(i))
            n[r][o] = $($({}, n[r][o]), s);
          break;
        case "parseContext":
          n[r] = $($({}, e[r]), i);
          break;
        case "atrule":
        case "pseudo":
          n[r] = $($({}, e[r]), ci(i, ["parse"]));
          break;
        case "node":
          n[r] = $($({}, e[r]), ci(i, ["name", "structure", "parse", "generate", "walkContext"]));
          break;
      }
    return n;
  }
  function xo(e) {
    const t = os(e), n = Ss(e), r = ks(e), { fromPlainObject: i, toPlainObject: o } = xs(n), s = {
      lexer: null,
      createLexer: (c) => new li(c, s, s.lexer.structure),
      tokenize: nn,
      parse: t,
      generate: r,
      walk: n,
      find: n.find,
      findLast: n.findLast,
      findAll: n.findAll,
      fromPlainObject: i,
      toPlainObject: o,
      fork(c) {
        const l = qn({}, e);
        return xo(
          typeof c == "function" ? c(l, Object.assign) : qn(l, c)
        );
      }
    };
    return s.lexer = new li({
      generic: !0,
      units: e.units,
      types: e.types,
      atrules: e.atrules,
      properties: e.properties,
      node: e.node
    }, s), s;
  }
  const ec = (e) => xo(qn({}, e)), tc = {
    generic: !0,
    units: {
      angle: [
        "deg",
        "grad",
        "rad",
        "turn"
      ],
      decibel: [
        "db"
      ],
      flex: [
        "fr"
      ],
      frequency: [
        "hz",
        "khz"
      ],
      length: [
        "cm",
        "mm",
        "q",
        "in",
        "pt",
        "pc",
        "px",
        "em",
        "rem",
        "ex",
        "rex",
        "cap",
        "rcap",
        "ch",
        "rch",
        "ic",
        "ric",
        "lh",
        "rlh",
        "vw",
        "svw",
        "lvw",
        "dvw",
        "vh",
        "svh",
        "lvh",
        "dvh",
        "vi",
        "svi",
        "lvi",
        "dvi",
        "vb",
        "svb",
        "lvb",
        "dvb",
        "vmin",
        "svmin",
        "lvmin",
        "dvmin",
        "vmax",
        "svmax",
        "lvmax",
        "dvmax",
        "cqw",
        "cqh",
        "cqi",
        "cqb",
        "cqmin",
        "cqmax"
      ],
      resolution: [
        "dpi",
        "dpcm",
        "dppx",
        "x"
      ],
      semitones: [
        "st"
      ],
      time: [
        "s",
        "ms"
      ]
    },
    types: {
      "abs()": "abs( <calc-sum> )",
      "absolute-size": "xx-small|x-small|small|medium|large|x-large|xx-large|xxx-large",
      "acos()": "acos( <calc-sum> )",
      "alpha-value": "<number>|<percentage>",
      "angle-percentage": "<angle>|<percentage>",
      "angular-color-hint": "<angle-percentage>",
      "angular-color-stop": "<color>&&<color-stop-angle>?",
      "angular-color-stop-list": "[<angular-color-stop> [, <angular-color-hint>]?]# , <angular-color-stop>",
      "animateable-feature": "scroll-position|contents|<custom-ident>",
      "asin()": "asin( <calc-sum> )",
      "atan()": "atan( <calc-sum> )",
      "atan2()": "atan2( <calc-sum> , <calc-sum> )",
      attachment: "scroll|fixed|local",
      "attr()": "attr( <attr-name> <type-or-unit>? [, <attr-fallback>]? )",
      "attr-matcher": "['~'|'|'|'^'|'$'|'*']? '='",
      "attr-modifier": "i|s",
      "attribute-selector": "'[' <wq-name> ']'|'[' <wq-name> <attr-matcher> [<string-token>|<ident-token>] <attr-modifier>? ']'",
      "auto-repeat": "repeat( [auto-fill|auto-fit] , [<line-names>? <fixed-size>]+ <line-names>? )",
      "auto-track-list": "[<line-names>? [<fixed-size>|<fixed-repeat>]]* <line-names>? <auto-repeat> [<line-names>? [<fixed-size>|<fixed-repeat>]]* <line-names>?",
      axis: "block|inline|vertical|horizontal",
      "baseline-position": "[first|last]? baseline",
      "basic-shape": "<inset()>|<circle()>|<ellipse()>|<polygon()>|<path()>",
      "bg-image": "none|<image>",
      "bg-layer": "<bg-image>||<bg-position> [/ <bg-size>]?||<repeat-style>||<attachment>||<box>||<box>",
      "bg-position": "[[left|center|right|top|bottom|<length-percentage>]|[left|center|right|<length-percentage>] [top|center|bottom|<length-percentage>]|[center|[left|right] <length-percentage>?]&&[center|[top|bottom] <length-percentage>?]]",
      "bg-size": "[<length-percentage>|auto]{1,2}|cover|contain",
      "blur()": "blur( <length> )",
      "blend-mode": "normal|multiply|screen|overlay|darken|lighten|color-dodge|color-burn|hard-light|soft-light|difference|exclusion|hue|saturation|color|luminosity",
      box: "border-box|padding-box|content-box",
      "brightness()": "brightness( <number-percentage> )",
      "calc()": "calc( <calc-sum> )",
      "calc-sum": "<calc-product> [['+'|'-'] <calc-product>]*",
      "calc-product": "<calc-value> ['*' <calc-value>|'/' <number>]*",
      "calc-value": "<number>|<dimension>|<percentage>|<calc-constant>|( <calc-sum> )",
      "calc-constant": "e|pi|infinity|-infinity|NaN",
      "cf-final-image": "<image>|<color>",
      "cf-mixing-image": "<percentage>?&&<image>",
      "circle()": "circle( [<shape-radius>]? [at <position>]? )",
      "clamp()": "clamp( <calc-sum>#{3} )",
      "class-selector": "'.' <ident-token>",
      "clip-source": "<url>",
      color: "<rgb()>|<rgba()>|<hsl()>|<hsla()>|<hwb()>|<lab()>|<lch()>|<hex-color>|<named-color>|currentcolor|<deprecated-system-color>",
      "color-stop": "<color-stop-length>|<color-stop-angle>",
      "color-stop-angle": "<angle-percentage>{1,2}",
      "color-stop-length": "<length-percentage>{1,2}",
      "color-stop-list": "[<linear-color-stop> [, <linear-color-hint>]?]# , <linear-color-stop>",
      combinator: "'>'|'+'|'~'|['||']",
      "common-lig-values": "[common-ligatures|no-common-ligatures]",
      "compat-auto": "searchfield|textarea|push-button|slider-horizontal|checkbox|radio|square-button|menulist|listbox|meter|progress-bar|button",
      "composite-style": "clear|copy|source-over|source-in|source-out|source-atop|destination-over|destination-in|destination-out|destination-atop|xor",
      "compositing-operator": "add|subtract|intersect|exclude",
      "compound-selector": "[<type-selector>? <subclass-selector>* [<pseudo-element-selector> <pseudo-class-selector>*]*]!",
      "compound-selector-list": "<compound-selector>#",
      "complex-selector": "<compound-selector> [<combinator>? <compound-selector>]*",
      "complex-selector-list": "<complex-selector>#",
      "conic-gradient()": "conic-gradient( [from <angle>]? [at <position>]? , <angular-color-stop-list> )",
      "contextual-alt-values": "[contextual|no-contextual]",
      "content-distribution": "space-between|space-around|space-evenly|stretch",
      "content-list": "[<string>|contents|<image>|<counter>|<quote>|<target>|<leader()>|<attr()>]+",
      "content-position": "center|start|end|flex-start|flex-end",
      "content-replacement": "<image>",
      "contrast()": "contrast( [<number-percentage>] )",
      "cos()": "cos( <calc-sum> )",
      counter: "<counter()>|<counters()>",
      "counter()": "counter( <counter-name> , <counter-style>? )",
      "counter-name": "<custom-ident>",
      "counter-style": "<counter-style-name>|symbols( )",
      "counter-style-name": "<custom-ident>",
      "counters()": "counters( <counter-name> , <string> , <counter-style>? )",
      "cross-fade()": "cross-fade( <cf-mixing-image> , <cf-final-image>? )",
      "cubic-bezier-timing-function": "ease|ease-in|ease-out|ease-in-out|cubic-bezier( <number [0,1]> , <number> , <number [0,1]> , <number> )",
      "deprecated-system-color": "ActiveBorder|ActiveCaption|AppWorkspace|Background|ButtonFace|ButtonHighlight|ButtonShadow|ButtonText|CaptionText|GrayText|Highlight|HighlightText|InactiveBorder|InactiveCaption|InactiveCaptionText|InfoBackground|InfoText|Menu|MenuText|Scrollbar|ThreeDDarkShadow|ThreeDFace|ThreeDHighlight|ThreeDLightShadow|ThreeDShadow|Window|WindowFrame|WindowText",
      "discretionary-lig-values": "[discretionary-ligatures|no-discretionary-ligatures]",
      "display-box": "contents|none",
      "display-inside": "flow|flow-root|table|flex|grid|ruby",
      "display-internal": "table-row-group|table-header-group|table-footer-group|table-row|table-cell|table-column-group|table-column|table-caption|ruby-base|ruby-text|ruby-base-container|ruby-text-container",
      "display-legacy": "inline-block|inline-list-item|inline-table|inline-flex|inline-grid",
      "display-listitem": "<display-outside>?&&[flow|flow-root]?&&list-item",
      "display-outside": "block|inline|run-in",
      "drop-shadow()": "drop-shadow( <length>{2,3} <color>? )",
      "east-asian-variant-values": "[jis78|jis83|jis90|jis04|simplified|traditional]",
      "east-asian-width-values": "[full-width|proportional-width]",
      "element()": "element( <custom-ident> , [first|start|last|first-except]? )|element( <id-selector> )",
      "ellipse()": "ellipse( [<shape-radius>{2}]? [at <position>]? )",
      "ending-shape": "circle|ellipse",
      "env()": "env( <custom-ident> , <declaration-value>? )",
      "exp()": "exp( <calc-sum> )",
      "explicit-track-list": "[<line-names>? <track-size>]+ <line-names>?",
      "family-name": "<string>|<custom-ident>+",
      "feature-tag-value": "<string> [<integer>|on|off]?",
      "feature-type": "@stylistic|@historical-forms|@styleset|@character-variant|@swash|@ornaments|@annotation",
      "feature-value-block": "<feature-type> '{' <feature-value-declaration-list> '}'",
      "feature-value-block-list": "<feature-value-block>+",
      "feature-value-declaration": "<custom-ident> : <integer>+ ;",
      "feature-value-declaration-list": "<feature-value-declaration>",
      "feature-value-name": "<custom-ident>",
      "fill-rule": "nonzero|evenodd",
      "filter-function": "<blur()>|<brightness()>|<contrast()>|<drop-shadow()>|<grayscale()>|<hue-rotate()>|<invert()>|<opacity()>|<saturate()>|<sepia()>",
      "filter-function-list": "[<filter-function>|<url>]+",
      "final-bg-layer": "<'background-color'>||<bg-image>||<bg-position> [/ <bg-size>]?||<repeat-style>||<attachment>||<box>||<box>",
      "fixed-breadth": "<length-percentage>",
      "fixed-repeat": "repeat( [<integer [1,∞]>] , [<line-names>? <fixed-size>]+ <line-names>? )",
      "fixed-size": "<fixed-breadth>|minmax( <fixed-breadth> , <track-breadth> )|minmax( <inflexible-breadth> , <fixed-breadth> )",
      "font-stretch-absolute": "normal|ultra-condensed|extra-condensed|condensed|semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded|<percentage>",
      "font-variant-css21": "[normal|small-caps]",
      "font-weight-absolute": "normal|bold|<number [1,1000]>",
      "frequency-percentage": "<frequency>|<percentage>",
      "general-enclosed": "[<function-token> <any-value> )]|( <ident> <any-value> )",
      "generic-family": "serif|sans-serif|cursive|fantasy|monospace|-apple-system",
      "generic-name": "serif|sans-serif|cursive|fantasy|monospace",
      "geometry-box": "<shape-box>|fill-box|stroke-box|view-box",
      gradient: "<linear-gradient()>|<repeating-linear-gradient()>|<radial-gradient()>|<repeating-radial-gradient()>|<conic-gradient()>|<repeating-conic-gradient()>|<-legacy-gradient>",
      "grayscale()": "grayscale( <number-percentage> )",
      "grid-line": "auto|<custom-ident>|[<integer>&&<custom-ident>?]|[span&&[<integer>||<custom-ident>]]",
      "historical-lig-values": "[historical-ligatures|no-historical-ligatures]",
      "hsl()": "hsl( <hue> <percentage> <percentage> [/ <alpha-value>]? )|hsl( <hue> , <percentage> , <percentage> , <alpha-value>? )",
      "hsla()": "hsla( <hue> <percentage> <percentage> [/ <alpha-value>]? )|hsla( <hue> , <percentage> , <percentage> , <alpha-value>? )",
      hue: "<number>|<angle>",
      "hue-rotate()": "hue-rotate( <angle> )",
      "hwb()": "hwb( [<hue>|none] [<percentage>|none] [<percentage>|none] [/ [<alpha-value>|none]]? )",
      "hypot()": "hypot( <calc-sum># )",
      image: "<url>|<image()>|<image-set()>|<element()>|<paint()>|<cross-fade()>|<gradient>",
      "image()": "image( <image-tags>? [<image-src>? , <color>?]! )",
      "image-set()": "image-set( <image-set-option># )",
      "image-set-option": "[<image>|<string>] [<resolution>||type( <string> )]",
      "image-src": "<url>|<string>",
      "image-tags": "ltr|rtl",
      "inflexible-breadth": "<length-percentage>|min-content|max-content|auto",
      "inset()": "inset( <length-percentage>{1,4} [round <'border-radius'>]? )",
      "invert()": "invert( <number-percentage> )",
      "keyframes-name": "<custom-ident>|<string>",
      "keyframe-block": "<keyframe-selector># { <declaration-list> }",
      "keyframe-block-list": "<keyframe-block>+",
      "keyframe-selector": "from|to|<percentage>",
      "lab()": "lab( [<percentage>|<number>|none] [<percentage>|<number>|none] [<percentage>|<number>|none] [/ [<alpha-value>|none]]? )",
      "layer()": "layer( <layer-name> )",
      "layer-name": "<ident> ['.' <ident>]*",
      "lch()": "lch( [<percentage>|<number>|none] [<percentage>|<number>|none] [<hue>|none] [/ [<alpha-value>|none]]? )",
      "leader()": "leader( <leader-type> )",
      "leader-type": "dotted|solid|space|<string>",
      "length-percentage": "<length>|<percentage>",
      "line-names": "'[' <custom-ident>* ']'",
      "line-name-list": "[<line-names>|<name-repeat>]+",
      "line-style": "none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset",
      "line-width": "<length>|thin|medium|thick",
      "linear-color-hint": "<length-percentage>",
      "linear-color-stop": "<color> <color-stop-length>?",
      "linear-gradient()": "linear-gradient( [<angle>|to <side-or-corner>]? , <color-stop-list> )",
      "log()": "log( <calc-sum> , <calc-sum>? )",
      "mask-layer": "<mask-reference>||<position> [/ <bg-size>]?||<repeat-style>||<geometry-box>||[<geometry-box>|no-clip]||<compositing-operator>||<masking-mode>",
      "mask-position": "[<length-percentage>|left|center|right] [<length-percentage>|top|center|bottom]?",
      "mask-reference": "none|<image>|<mask-source>",
      "mask-source": "<url>",
      "masking-mode": "alpha|luminance|match-source",
      "matrix()": "matrix( <number>#{6} )",
      "matrix3d()": "matrix3d( <number>#{16} )",
      "max()": "max( <calc-sum># )",
      "media-and": "<media-in-parens> [and <media-in-parens>]+",
      "media-condition": "<media-not>|<media-and>|<media-or>|<media-in-parens>",
      "media-condition-without-or": "<media-not>|<media-and>|<media-in-parens>",
      "media-feature": "( [<mf-plain>|<mf-boolean>|<mf-range>] )",
      "media-in-parens": "( <media-condition> )|<media-feature>|<general-enclosed>",
      "media-not": "not <media-in-parens>",
      "media-or": "<media-in-parens> [or <media-in-parens>]+",
      "media-query": "<media-condition>|[not|only]? <media-type> [and <media-condition-without-or>]?",
      "media-query-list": "<media-query>#",
      "media-type": "<ident>",
      "mf-boolean": "<mf-name>",
      "mf-name": "<ident>",
      "mf-plain": "<mf-name> : <mf-value>",
      "mf-range": "<mf-name> ['<'|'>']? '='? <mf-value>|<mf-value> ['<'|'>']? '='? <mf-name>|<mf-value> '<' '='? <mf-name> '<' '='? <mf-value>|<mf-value> '>' '='? <mf-name> '>' '='? <mf-value>",
      "mf-value": "<number>|<dimension>|<ident>|<ratio>",
      "min()": "min( <calc-sum># )",
      "minmax()": "minmax( [<length-percentage>|min-content|max-content|auto] , [<length-percentage>|<flex>|min-content|max-content|auto] )",
      "mod()": "mod( <calc-sum> , <calc-sum> )",
      "name-repeat": "repeat( [<integer [1,∞]>|auto-fill] , <line-names>+ )",
      "named-color": "transparent|aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen|<-non-standard-color>",
      "namespace-prefix": "<ident>",
      "ns-prefix": "[<ident-token>|'*']? '|'",
      "number-percentage": "<number>|<percentage>",
      "numeric-figure-values": "[lining-nums|oldstyle-nums]",
      "numeric-fraction-values": "[diagonal-fractions|stacked-fractions]",
      "numeric-spacing-values": "[proportional-nums|tabular-nums]",
      nth: "<an-plus-b>|even|odd",
      "opacity()": "opacity( [<number-percentage>] )",
      "overflow-position": "unsafe|safe",
      "outline-radius": "<length>|<percentage>",
      "page-body": "<declaration>? [; <page-body>]?|<page-margin-box> <page-body>",
      "page-margin-box": "<page-margin-box-type> '{' <declaration-list> '}'",
      "page-margin-box-type": "@top-left-corner|@top-left|@top-center|@top-right|@top-right-corner|@bottom-left-corner|@bottom-left|@bottom-center|@bottom-right|@bottom-right-corner|@left-top|@left-middle|@left-bottom|@right-top|@right-middle|@right-bottom",
      "page-selector-list": "[<page-selector>#]?",
      "page-selector": "<pseudo-page>+|<ident> <pseudo-page>*",
      "page-size": "A5|A4|A3|B5|B4|JIS-B5|JIS-B4|letter|legal|ledger",
      "path()": "path( [<fill-rule> ,]? <string> )",
      "paint()": "paint( <ident> , <declaration-value>? )",
      "perspective()": "perspective( [<length [0,∞]>|none] )",
      "polygon()": "polygon( <fill-rule>? , [<length-percentage> <length-percentage>]# )",
      position: "[[left|center|right]||[top|center|bottom]|[left|center|right|<length-percentage>] [top|center|bottom|<length-percentage>]?|[[left|right] <length-percentage>]&&[[top|bottom] <length-percentage>]]",
      "pow()": "pow( <calc-sum> , <calc-sum> )",
      "pseudo-class-selector": "':' <ident-token>|':' <function-token> <any-value> ')'",
      "pseudo-element-selector": "':' <pseudo-class-selector>",
      "pseudo-page": ": [left|right|first|blank]",
      quote: "open-quote|close-quote|no-open-quote|no-close-quote",
      "radial-gradient()": "radial-gradient( [<ending-shape>||<size>]? [at <position>]? , <color-stop-list> )",
      ratio: "<number [0,∞]> [/ <number [0,∞]>]?",
      "relative-selector": "<combinator>? <complex-selector>",
      "relative-selector-list": "<relative-selector>#",
      "relative-size": "larger|smaller",
      "rem()": "rem( <calc-sum> , <calc-sum> )",
      "repeat-style": "repeat-x|repeat-y|[repeat|space|round|no-repeat]{1,2}",
      "repeating-conic-gradient()": "repeating-conic-gradient( [from <angle>]? [at <position>]? , <angular-color-stop-list> )",
      "repeating-linear-gradient()": "repeating-linear-gradient( [<angle>|to <side-or-corner>]? , <color-stop-list> )",
      "repeating-radial-gradient()": "repeating-radial-gradient( [<ending-shape>||<size>]? [at <position>]? , <color-stop-list> )",
      "reversed-counter-name": "reversed( <counter-name> )",
      "rgb()": "rgb( <percentage>{3} [/ <alpha-value>]? )|rgb( <number>{3} [/ <alpha-value>]? )|rgb( <percentage>#{3} , <alpha-value>? )|rgb( <number>#{3} , <alpha-value>? )",
      "rgba()": "rgba( <percentage>{3} [/ <alpha-value>]? )|rgba( <number>{3} [/ <alpha-value>]? )|rgba( <percentage>#{3} , <alpha-value>? )|rgba( <number>#{3} , <alpha-value>? )",
      "rotate()": "rotate( [<angle>|<zero>] )",
      "rotate3d()": "rotate3d( <number> , <number> , <number> , [<angle>|<zero>] )",
      "rotateX()": "rotateX( [<angle>|<zero>] )",
      "rotateY()": "rotateY( [<angle>|<zero>] )",
      "rotateZ()": "rotateZ( [<angle>|<zero>] )",
      "round()": "round( <rounding-strategy>? , <calc-sum> , <calc-sum> )",
      "rounding-strategy": "nearest|up|down|to-zero",
      "saturate()": "saturate( <number-percentage> )",
      "scale()": "scale( [<number>|<percentage>]#{1,2} )",
      "scale3d()": "scale3d( [<number>|<percentage>]#{3} )",
      "scaleX()": "scaleX( [<number>|<percentage>] )",
      "scaleY()": "scaleY( [<number>|<percentage>] )",
      "scaleZ()": "scaleZ( [<number>|<percentage>] )",
      scroller: "root|nearest",
      "self-position": "center|start|end|self-start|self-end|flex-start|flex-end",
      "shape-radius": "<length-percentage>|closest-side|farthest-side",
      "sign()": "sign( <calc-sum> )",
      "skew()": "skew( [<angle>|<zero>] , [<angle>|<zero>]? )",
      "skewX()": "skewX( [<angle>|<zero>] )",
      "skewY()": "skewY( [<angle>|<zero>] )",
      "sepia()": "sepia( <number-percentage> )",
      shadow: "inset?&&<length>{2,4}&&<color>?",
      "shadow-t": "[<length>{2,3}&&<color>?]",
      shape: "rect( <top> , <right> , <bottom> , <left> )|rect( <top> <right> <bottom> <left> )",
      "shape-box": "<box>|margin-box",
      "side-or-corner": "[left|right]||[top|bottom]",
      "sin()": "sin( <calc-sum> )",
      "single-animation": "<time>||<easing-function>||<time>||<single-animation-iteration-count>||<single-animation-direction>||<single-animation-fill-mode>||<single-animation-play-state>||[none|<keyframes-name>]",
      "single-animation-direction": "normal|reverse|alternate|alternate-reverse",
      "single-animation-fill-mode": "none|forwards|backwards|both",
      "single-animation-iteration-count": "infinite|<number>",
      "single-animation-play-state": "running|paused",
      "single-animation-timeline": "auto|none|<timeline-name>|scroll( <axis>? <scroller>? )",
      "single-transition": "[none|<single-transition-property>]||<time>||<easing-function>||<time>",
      "single-transition-property": "all|<custom-ident>",
      size: "closest-side|farthest-side|closest-corner|farthest-corner|<length>|<length-percentage>{2}",
      "sqrt()": "sqrt( <calc-sum> )",
      "step-position": "jump-start|jump-end|jump-none|jump-both|start|end",
      "step-timing-function": "step-start|step-end|steps( <integer> [, <step-position>]? )",
      "subclass-selector": "<id-selector>|<class-selector>|<attribute-selector>|<pseudo-class-selector>",
      "supports-condition": "not <supports-in-parens>|<supports-in-parens> [and <supports-in-parens>]*|<supports-in-parens> [or <supports-in-parens>]*",
      "supports-in-parens": "( <supports-condition> )|<supports-feature>|<general-enclosed>",
      "supports-feature": "<supports-decl>|<supports-selector-fn>",
      "supports-decl": "( <declaration> )",
      "supports-selector-fn": "selector( <complex-selector> )",
      symbol: "<string>|<image>|<custom-ident>",
      "tan()": "tan( <calc-sum> )",
      target: "<target-counter()>|<target-counters()>|<target-text()>",
      "target-counter()": "target-counter( [<string>|<url>] , <custom-ident> , <counter-style>? )",
      "target-counters()": "target-counters( [<string>|<url>] , <custom-ident> , <string> , <counter-style>? )",
      "target-text()": "target-text( [<string>|<url>] , [content|before|after|first-letter]? )",
      "time-percentage": "<time>|<percentage>",
      "timeline-name": "<custom-ident>|<string>",
      "easing-function": "linear|<cubic-bezier-timing-function>|<step-timing-function>",
      "track-breadth": "<length-percentage>|<flex>|min-content|max-content|auto",
      "track-list": "[<line-names>? [<track-size>|<track-repeat>]]+ <line-names>?",
      "track-repeat": "repeat( [<integer [1,∞]>] , [<line-names>? <track-size>]+ <line-names>? )",
      "track-size": "<track-breadth>|minmax( <inflexible-breadth> , <track-breadth> )|fit-content( <length-percentage> )",
      "transform-function": "<matrix()>|<translate()>|<translateX()>|<translateY()>|<scale()>|<scaleX()>|<scaleY()>|<rotate()>|<skew()>|<skewX()>|<skewY()>|<matrix3d()>|<translate3d()>|<translateZ()>|<scale3d()>|<scaleZ()>|<rotate3d()>|<rotateX()>|<rotateY()>|<rotateZ()>|<perspective()>",
      "transform-list": "<transform-function>+",
      "translate()": "translate( <length-percentage> , <length-percentage>? )",
      "translate3d()": "translate3d( <length-percentage> , <length-percentage> , <length> )",
      "translateX()": "translateX( <length-percentage> )",
      "translateY()": "translateY( <length-percentage> )",
      "translateZ()": "translateZ( <length> )",
      "type-or-unit": "string|color|url|integer|number|length|angle|time|frequency|cap|ch|em|ex|ic|lh|rlh|rem|vb|vi|vw|vh|vmin|vmax|mm|Q|cm|in|pt|pc|px|deg|grad|rad|turn|ms|s|Hz|kHz|%",
      "type-selector": "<wq-name>|<ns-prefix>? '*'",
      "var()": "var( <custom-property-name> , <declaration-value>? )",
      "viewport-length": "auto|<length-percentage>",
      "visual-box": "content-box|padding-box|border-box",
      "wq-name": "<ns-prefix>? <ident-token>",
      "-legacy-gradient": "<-webkit-gradient()>|<-legacy-linear-gradient>|<-legacy-repeating-linear-gradient>|<-legacy-radial-gradient>|<-legacy-repeating-radial-gradient>",
      "-legacy-linear-gradient": "-moz-linear-gradient( <-legacy-linear-gradient-arguments> )|-webkit-linear-gradient( <-legacy-linear-gradient-arguments> )|-o-linear-gradient( <-legacy-linear-gradient-arguments> )",
      "-legacy-repeating-linear-gradient": "-moz-repeating-linear-gradient( <-legacy-linear-gradient-arguments> )|-webkit-repeating-linear-gradient( <-legacy-linear-gradient-arguments> )|-o-repeating-linear-gradient( <-legacy-linear-gradient-arguments> )",
      "-legacy-linear-gradient-arguments": "[<angle>|<side-or-corner>]? , <color-stop-list>",
      "-legacy-radial-gradient": "-moz-radial-gradient( <-legacy-radial-gradient-arguments> )|-webkit-radial-gradient( <-legacy-radial-gradient-arguments> )|-o-radial-gradient( <-legacy-radial-gradient-arguments> )",
      "-legacy-repeating-radial-gradient": "-moz-repeating-radial-gradient( <-legacy-radial-gradient-arguments> )|-webkit-repeating-radial-gradient( <-legacy-radial-gradient-arguments> )|-o-repeating-radial-gradient( <-legacy-radial-gradient-arguments> )",
      "-legacy-radial-gradient-arguments": "[<position> ,]? [[[<-legacy-radial-gradient-shape>||<-legacy-radial-gradient-size>]|[<length>|<percentage>]{2}] ,]? <color-stop-list>",
      "-legacy-radial-gradient-size": "closest-side|closest-corner|farthest-side|farthest-corner|contain|cover",
      "-legacy-radial-gradient-shape": "circle|ellipse",
      "-non-standard-font": "-apple-system-body|-apple-system-headline|-apple-system-subheadline|-apple-system-caption1|-apple-system-caption2|-apple-system-footnote|-apple-system-short-body|-apple-system-short-headline|-apple-system-short-subheadline|-apple-system-short-caption1|-apple-system-short-footnote|-apple-system-tall-body",
      "-non-standard-color": "-moz-ButtonDefault|-moz-ButtonHoverFace|-moz-ButtonHoverText|-moz-CellHighlight|-moz-CellHighlightText|-moz-Combobox|-moz-ComboboxText|-moz-Dialog|-moz-DialogText|-moz-dragtargetzone|-moz-EvenTreeRow|-moz-Field|-moz-FieldText|-moz-html-CellHighlight|-moz-html-CellHighlightText|-moz-mac-accentdarkestshadow|-moz-mac-accentdarkshadow|-moz-mac-accentface|-moz-mac-accentlightesthighlight|-moz-mac-accentlightshadow|-moz-mac-accentregularhighlight|-moz-mac-accentregularshadow|-moz-mac-chrome-active|-moz-mac-chrome-inactive|-moz-mac-focusring|-moz-mac-menuselect|-moz-mac-menushadow|-moz-mac-menutextselect|-moz-MenuHover|-moz-MenuHoverText|-moz-MenuBarText|-moz-MenuBarHoverText|-moz-nativehyperlinktext|-moz-OddTreeRow|-moz-win-communicationstext|-moz-win-mediatext|-moz-activehyperlinktext|-moz-default-background-color|-moz-default-color|-moz-hyperlinktext|-moz-visitedhyperlinktext|-webkit-activelink|-webkit-focus-ring-color|-webkit-link|-webkit-text",
      "-non-standard-image-rendering": "optimize-contrast|-moz-crisp-edges|-o-crisp-edges|-webkit-optimize-contrast",
      "-non-standard-overflow": "-moz-scrollbars-none|-moz-scrollbars-horizontal|-moz-scrollbars-vertical|-moz-hidden-unscrollable",
      "-non-standard-width": "fill-available|min-intrinsic|intrinsic|-moz-available|-moz-fit-content|-moz-min-content|-moz-max-content|-webkit-min-content|-webkit-max-content",
      "-webkit-gradient()": "-webkit-gradient( <-webkit-gradient-type> , <-webkit-gradient-point> [, <-webkit-gradient-point>|, <-webkit-gradient-radius> , <-webkit-gradient-point>] [, <-webkit-gradient-radius>]? [, <-webkit-gradient-color-stop>]* )",
      "-webkit-gradient-color-stop": "from( <color> )|color-stop( [<number-zero-one>|<percentage>] , <color> )|to( <color> )",
      "-webkit-gradient-point": "[left|center|right|<length-percentage>] [top|center|bottom|<length-percentage>]",
      "-webkit-gradient-radius": "<length>|<percentage>",
      "-webkit-gradient-type": "linear|radial",
      "-webkit-mask-box-repeat": "repeat|stretch|round",
      "-webkit-mask-clip-style": "border|border-box|padding|padding-box|content|content-box|text",
      "-ms-filter-function-list": "<-ms-filter-function>+",
      "-ms-filter-function": "<-ms-filter-function-progid>|<-ms-filter-function-legacy>",
      "-ms-filter-function-progid": "'progid:' [<ident-token> '.']* [<ident-token>|<function-token> <any-value>? )]",
      "-ms-filter-function-legacy": "<ident-token>|<function-token> <any-value>? )",
      "-ms-filter": "<string>",
      age: "child|young|old",
      "attr-name": "<wq-name>",
      "attr-fallback": "<any-value>",
      "bg-clip": "<box>|border|text",
      bottom: "<length>|auto",
      "generic-voice": "[<age>? <gender> <integer>?]",
      gender: "male|female|neutral",
      left: "<length>|auto",
      "mask-image": "<mask-reference>#",
      paint: "none|<color>|<url> [none|<color>]?|context-fill|context-stroke",
      right: "<length>|auto",
      "scroll-timeline-axis": "block|inline|vertical|horizontal",
      "scroll-timeline-name": "none|<custom-ident>",
      "single-animation-composition": "replace|add|accumulate",
      "svg-length": "<percentage>|<length>|<number>",
      "svg-writing-mode": "lr-tb|rl-tb|tb-rl|lr|rl|tb",
      top: "<length>|auto",
      x: "<number>",
      y: "<number>",
      declaration: "<ident-token> : <declaration-value>? ['!' important]?",
      "declaration-list": "[<declaration>? ';']* <declaration>?",
      url: "url( <string> <url-modifier>* )|<url-token>",
      "url-modifier": "<ident>|<function-token> <any-value> )",
      "number-zero-one": "<number [0,1]>",
      "number-one-or-greater": "<number [1,∞]>",
      "-non-standard-display": "-ms-inline-flexbox|-ms-grid|-ms-inline-grid|-webkit-flex|-webkit-inline-flex|-webkit-box|-webkit-inline-box|-moz-inline-stack|-moz-box|-moz-inline-box"
    },
    properties: {
      "--*": "<declaration-value>",
      "-ms-accelerator": "false|true",
      "-ms-block-progression": "tb|rl|bt|lr",
      "-ms-content-zoom-chaining": "none|chained",
      "-ms-content-zooming": "none|zoom",
      "-ms-content-zoom-limit": "<'-ms-content-zoom-limit-min'> <'-ms-content-zoom-limit-max'>",
      "-ms-content-zoom-limit-max": "<percentage>",
      "-ms-content-zoom-limit-min": "<percentage>",
      "-ms-content-zoom-snap": "<'-ms-content-zoom-snap-type'>||<'-ms-content-zoom-snap-points'>",
      "-ms-content-zoom-snap-points": "snapInterval( <percentage> , <percentage> )|snapList( <percentage># )",
      "-ms-content-zoom-snap-type": "none|proximity|mandatory",
      "-ms-filter": "<string>",
      "-ms-flow-from": "[none|<custom-ident>]#",
      "-ms-flow-into": "[none|<custom-ident>]#",
      "-ms-grid-columns": "none|<track-list>|<auto-track-list>",
      "-ms-grid-rows": "none|<track-list>|<auto-track-list>",
      "-ms-high-contrast-adjust": "auto|none",
      "-ms-hyphenate-limit-chars": "auto|<integer>{1,3}",
      "-ms-hyphenate-limit-lines": "no-limit|<integer>",
      "-ms-hyphenate-limit-zone": "<percentage>|<length>",
      "-ms-ime-align": "auto|after",
      "-ms-overflow-style": "auto|none|scrollbar|-ms-autohiding-scrollbar",
      "-ms-scrollbar-3dlight-color": "<color>",
      "-ms-scrollbar-arrow-color": "<color>",
      "-ms-scrollbar-base-color": "<color>",
      "-ms-scrollbar-darkshadow-color": "<color>",
      "-ms-scrollbar-face-color": "<color>",
      "-ms-scrollbar-highlight-color": "<color>",
      "-ms-scrollbar-shadow-color": "<color>",
      "-ms-scrollbar-track-color": "<color>",
      "-ms-scroll-chaining": "chained|none",
      "-ms-scroll-limit": "<'-ms-scroll-limit-x-min'> <'-ms-scroll-limit-y-min'> <'-ms-scroll-limit-x-max'> <'-ms-scroll-limit-y-max'>",
      "-ms-scroll-limit-x-max": "auto|<length>",
      "-ms-scroll-limit-x-min": "<length>",
      "-ms-scroll-limit-y-max": "auto|<length>",
      "-ms-scroll-limit-y-min": "<length>",
      "-ms-scroll-rails": "none|railed",
      "-ms-scroll-snap-points-x": "snapInterval( <length-percentage> , <length-percentage> )|snapList( <length-percentage># )",
      "-ms-scroll-snap-points-y": "snapInterval( <length-percentage> , <length-percentage> )|snapList( <length-percentage># )",
      "-ms-scroll-snap-type": "none|proximity|mandatory",
      "-ms-scroll-snap-x": "<'-ms-scroll-snap-type'> <'-ms-scroll-snap-points-x'>",
      "-ms-scroll-snap-y": "<'-ms-scroll-snap-type'> <'-ms-scroll-snap-points-y'>",
      "-ms-scroll-translation": "none|vertical-to-horizontal",
      "-ms-text-autospace": "none|ideograph-alpha|ideograph-numeric|ideograph-parenthesis|ideograph-space",
      "-ms-touch-select": "grippers|none",
      "-ms-user-select": "none|element|text",
      "-ms-wrap-flow": "auto|both|start|end|maximum|clear",
      "-ms-wrap-margin": "<length>",
      "-ms-wrap-through": "wrap|none",
      "-moz-appearance": "none|button|button-arrow-down|button-arrow-next|button-arrow-previous|button-arrow-up|button-bevel|button-focus|caret|checkbox|checkbox-container|checkbox-label|checkmenuitem|dualbutton|groupbox|listbox|listitem|menuarrow|menubar|menucheckbox|menuimage|menuitem|menuitemtext|menulist|menulist-button|menulist-text|menulist-textfield|menupopup|menuradio|menuseparator|meterbar|meterchunk|progressbar|progressbar-vertical|progresschunk|progresschunk-vertical|radio|radio-container|radio-label|radiomenuitem|range|range-thumb|resizer|resizerpanel|scale-horizontal|scalethumbend|scalethumb-horizontal|scalethumbstart|scalethumbtick|scalethumb-vertical|scale-vertical|scrollbarbutton-down|scrollbarbutton-left|scrollbarbutton-right|scrollbarbutton-up|scrollbarthumb-horizontal|scrollbarthumb-vertical|scrollbartrack-horizontal|scrollbartrack-vertical|searchfield|separator|sheet|spinner|spinner-downbutton|spinner-textfield|spinner-upbutton|splitter|statusbar|statusbarpanel|tab|tabpanel|tabpanels|tab-scroll-arrow-back|tab-scroll-arrow-forward|textfield|textfield-multiline|toolbar|toolbarbutton|toolbarbutton-dropdown|toolbargripper|toolbox|tooltip|treeheader|treeheadercell|treeheadersortarrow|treeitem|treeline|treetwisty|treetwistyopen|treeview|-moz-mac-unified-toolbar|-moz-win-borderless-glass|-moz-win-browsertabbar-toolbox|-moz-win-communicationstext|-moz-win-communications-toolbox|-moz-win-exclude-glass|-moz-win-glass|-moz-win-mediatext|-moz-win-media-toolbox|-moz-window-button-box|-moz-window-button-box-maximized|-moz-window-button-close|-moz-window-button-maximize|-moz-window-button-minimize|-moz-window-button-restore|-moz-window-frame-bottom|-moz-window-frame-left|-moz-window-frame-right|-moz-window-titlebar|-moz-window-titlebar-maximized",
      "-moz-binding": "<url>|none",
      "-moz-border-bottom-colors": "<color>+|none",
      "-moz-border-left-colors": "<color>+|none",
      "-moz-border-right-colors": "<color>+|none",
      "-moz-border-top-colors": "<color>+|none",
      "-moz-context-properties": "none|[fill|fill-opacity|stroke|stroke-opacity]#",
      "-moz-float-edge": "border-box|content-box|margin-box|padding-box",
      "-moz-force-broken-image-icon": "0|1",
      "-moz-image-region": "<shape>|auto",
      "-moz-orient": "inline|block|horizontal|vertical",
      "-moz-outline-radius": "<outline-radius>{1,4} [/ <outline-radius>{1,4}]?",
      "-moz-outline-radius-bottomleft": "<outline-radius>",
      "-moz-outline-radius-bottomright": "<outline-radius>",
      "-moz-outline-radius-topleft": "<outline-radius>",
      "-moz-outline-radius-topright": "<outline-radius>",
      "-moz-stack-sizing": "ignore|stretch-to-fit",
      "-moz-text-blink": "none|blink",
      "-moz-user-focus": "ignore|normal|select-after|select-before|select-menu|select-same|select-all|none",
      "-moz-user-input": "auto|none|enabled|disabled",
      "-moz-user-modify": "read-only|read-write|write-only",
      "-moz-window-dragging": "drag|no-drag",
      "-moz-window-shadow": "default|menu|tooltip|sheet|none",
      "-webkit-appearance": "none|button|button-bevel|caps-lock-indicator|caret|checkbox|default-button|inner-spin-button|listbox|listitem|media-controls-background|media-controls-fullscreen-background|media-current-time-display|media-enter-fullscreen-button|media-exit-fullscreen-button|media-fullscreen-button|media-mute-button|media-overlay-play-button|media-play-button|media-seek-back-button|media-seek-forward-button|media-slider|media-sliderthumb|media-time-remaining-display|media-toggle-closed-captions-button|media-volume-slider|media-volume-slider-container|media-volume-sliderthumb|menulist|menulist-button|menulist-text|menulist-textfield|meter|progress-bar|progress-bar-value|push-button|radio|scrollbarbutton-down|scrollbarbutton-left|scrollbarbutton-right|scrollbarbutton-up|scrollbargripper-horizontal|scrollbargripper-vertical|scrollbarthumb-horizontal|scrollbarthumb-vertical|scrollbartrack-horizontal|scrollbartrack-vertical|searchfield|searchfield-cancel-button|searchfield-decoration|searchfield-results-button|searchfield-results-decoration|slider-horizontal|slider-vertical|sliderthumb-horizontal|sliderthumb-vertical|square-button|textarea|textfield|-apple-pay-button",
      "-webkit-border-before": "<'border-width'>||<'border-style'>||<color>",
      "-webkit-border-before-color": "<color>",
      "-webkit-border-before-style": "<'border-style'>",
      "-webkit-border-before-width": "<'border-width'>",
      "-webkit-box-reflect": "[above|below|right|left]? <length>? <image>?",
      "-webkit-line-clamp": "none|<integer>",
      "-webkit-mask": "[<mask-reference>||<position> [/ <bg-size>]?||<repeat-style>||[<box>|border|padding|content|text]||[<box>|border|padding|content]]#",
      "-webkit-mask-attachment": "<attachment>#",
      "-webkit-mask-clip": "[<box>|border|padding|content|text]#",
      "-webkit-mask-composite": "<composite-style>#",
      "-webkit-mask-image": "<mask-reference>#",
      "-webkit-mask-origin": "[<box>|border|padding|content]#",
      "-webkit-mask-position": "<position>#",
      "-webkit-mask-position-x": "[<length-percentage>|left|center|right]#",
      "-webkit-mask-position-y": "[<length-percentage>|top|center|bottom]#",
      "-webkit-mask-repeat": "<repeat-style>#",
      "-webkit-mask-repeat-x": "repeat|no-repeat|space|round",
      "-webkit-mask-repeat-y": "repeat|no-repeat|space|round",
      "-webkit-mask-size": "<bg-size>#",
      "-webkit-overflow-scrolling": "auto|touch",
      "-webkit-tap-highlight-color": "<color>",
      "-webkit-text-fill-color": "<color>",
      "-webkit-text-stroke": "<length>||<color>",
      "-webkit-text-stroke-color": "<color>",
      "-webkit-text-stroke-width": "<length>",
      "-webkit-touch-callout": "default|none",
      "-webkit-user-modify": "read-only|read-write|read-write-plaintext-only",
      "accent-color": "auto|<color>",
      "align-content": "normal|<baseline-position>|<content-distribution>|<overflow-position>? <content-position>",
      "align-items": "normal|stretch|<baseline-position>|[<overflow-position>? <self-position>]",
      "align-self": "auto|normal|stretch|<baseline-position>|<overflow-position>? <self-position>",
      "align-tracks": "[normal|<baseline-position>|<content-distribution>|<overflow-position>? <content-position>]#",
      all: "initial|inherit|unset|revert|revert-layer",
      animation: "<single-animation>#",
      "animation-composition": "<single-animation-composition>#",
      "animation-delay": "<time>#",
      "animation-direction": "<single-animation-direction>#",
      "animation-duration": "<time>#",
      "animation-fill-mode": "<single-animation-fill-mode>#",
      "animation-iteration-count": "<single-animation-iteration-count>#",
      "animation-name": "[none|<keyframes-name>]#",
      "animation-play-state": "<single-animation-play-state>#",
      "animation-timing-function": "<easing-function>#",
      "animation-timeline": "<single-animation-timeline>#",
      appearance: "none|auto|textfield|menulist-button|<compat-auto>",
      "aspect-ratio": "auto|<ratio>",
      azimuth: "<angle>|[[left-side|far-left|left|center-left|center|center-right|right|far-right|right-side]||behind]|leftwards|rightwards",
      "backdrop-filter": "none|<filter-function-list>",
      "backface-visibility": "visible|hidden",
      background: "[<bg-layer> ,]* <final-bg-layer>",
      "background-attachment": "<attachment>#",
      "background-blend-mode": "<blend-mode>#",
      "background-clip": "<bg-clip>#",
      "background-color": "<color>",
      "background-image": "<bg-image>#",
      "background-origin": "<box>#",
      "background-position": "<bg-position>#",
      "background-position-x": "[center|[[left|right|x-start|x-end]? <length-percentage>?]!]#",
      "background-position-y": "[center|[[top|bottom|y-start|y-end]? <length-percentage>?]!]#",
      "background-repeat": "<repeat-style>#",
      "background-size": "<bg-size>#",
      "block-overflow": "clip|ellipsis|<string>",
      "block-size": "<'width'>",
      border: "<line-width>||<line-style>||<color>",
      "border-block": "<'border-top-width'>||<'border-top-style'>||<color>",
      "border-block-color": "<'border-top-color'>{1,2}",
      "border-block-style": "<'border-top-style'>",
      "border-block-width": "<'border-top-width'>",
      "border-block-end": "<'border-top-width'>||<'border-top-style'>||<color>",
      "border-block-end-color": "<'border-top-color'>",
      "border-block-end-style": "<'border-top-style'>",
      "border-block-end-width": "<'border-top-width'>",
      "border-block-start": "<'border-top-width'>||<'border-top-style'>||<color>",
      "border-block-start-color": "<'border-top-color'>",
      "border-block-start-style": "<'border-top-style'>",
      "border-block-start-width": "<'border-top-width'>",
      "border-bottom": "<line-width>||<line-style>||<color>",
      "border-bottom-color": "<'border-top-color'>",
      "border-bottom-left-radius": "<length-percentage>{1,2}",
      "border-bottom-right-radius": "<length-percentage>{1,2}",
      "border-bottom-style": "<line-style>",
      "border-bottom-width": "<line-width>",
      "border-collapse": "collapse|separate",
      "border-color": "<color>{1,4}",
      "border-end-end-radius": "<length-percentage>{1,2}",
      "border-end-start-radius": "<length-percentage>{1,2}",
      "border-image": "<'border-image-source'>||<'border-image-slice'> [/ <'border-image-width'>|/ <'border-image-width'>? / <'border-image-outset'>]?||<'border-image-repeat'>",
      "border-image-outset": "[<length>|<number>]{1,4}",
      "border-image-repeat": "[stretch|repeat|round|space]{1,2}",
      "border-image-slice": "<number-percentage>{1,4}&&fill?",
      "border-image-source": "none|<image>",
      "border-image-width": "[<length-percentage>|<number>|auto]{1,4}",
      "border-inline": "<'border-top-width'>||<'border-top-style'>||<color>",
      "border-inline-end": "<'border-top-width'>||<'border-top-style'>||<color>",
      "border-inline-color": "<'border-top-color'>{1,2}",
      "border-inline-style": "<'border-top-style'>",
      "border-inline-width": "<'border-top-width'>",
      "border-inline-end-color": "<'border-top-color'>",
      "border-inline-end-style": "<'border-top-style'>",
      "border-inline-end-width": "<'border-top-width'>",
      "border-inline-start": "<'border-top-width'>||<'border-top-style'>||<color>",
      "border-inline-start-color": "<'border-top-color'>",
      "border-inline-start-style": "<'border-top-style'>",
      "border-inline-start-width": "<'border-top-width'>",
      "border-left": "<line-width>||<line-style>||<color>",
      "border-left-color": "<color>",
      "border-left-style": "<line-style>",
      "border-left-width": "<line-width>",
      "border-radius": "<length-percentage>{1,4} [/ <length-percentage>{1,4}]?",
      "border-right": "<line-width>||<line-style>||<color>",
      "border-right-color": "<color>",
      "border-right-style": "<line-style>",
      "border-right-width": "<line-width>",
      "border-spacing": "<length> <length>?",
      "border-start-end-radius": "<length-percentage>{1,2}",
      "border-start-start-radius": "<length-percentage>{1,2}",
      "border-style": "<line-style>{1,4}",
      "border-top": "<line-width>||<line-style>||<color>",
      "border-top-color": "<color>",
      "border-top-left-radius": "<length-percentage>{1,2}",
      "border-top-right-radius": "<length-percentage>{1,2}",
      "border-top-style": "<line-style>",
      "border-top-width": "<line-width>",
      "border-width": "<line-width>{1,4}",
      bottom: "<length>|<percentage>|auto",
      "box-align": "start|center|end|baseline|stretch",
      "box-decoration-break": "slice|clone",
      "box-direction": "normal|reverse|inherit",
      "box-flex": "<number>",
      "box-flex-group": "<integer>",
      "box-lines": "single|multiple",
      "box-ordinal-group": "<integer>",
      "box-orient": "horizontal|vertical|inline-axis|block-axis|inherit",
      "box-pack": "start|center|end|justify",
      "box-shadow": "none|<shadow>#",
      "box-sizing": "content-box|border-box",
      "break-after": "auto|avoid|always|all|avoid-page|page|left|right|recto|verso|avoid-column|column|avoid-region|region",
      "break-before": "auto|avoid|always|all|avoid-page|page|left|right|recto|verso|avoid-column|column|avoid-region|region",
      "break-inside": "auto|avoid|avoid-page|avoid-column|avoid-region",
      "caption-side": "top|bottom|block-start|block-end|inline-start|inline-end",
      caret: "<'caret-color'>||<'caret-shape'>",
      "caret-color": "auto|<color>",
      "caret-shape": "auto|bar|block|underscore",
      clear: "none|left|right|both|inline-start|inline-end",
      clip: "<shape>|auto",
      "clip-path": "<clip-source>|[<basic-shape>||<geometry-box>]|none",
      color: "<color>",
      "print-color-adjust": "economy|exact",
      "color-scheme": "normal|[light|dark|<custom-ident>]+&&only?",
      "column-count": "<integer>|auto",
      "column-fill": "auto|balance|balance-all",
      "column-gap": "normal|<length-percentage>",
      "column-rule": "<'column-rule-width'>||<'column-rule-style'>||<'column-rule-color'>",
      "column-rule-color": "<color>",
      "column-rule-style": "<'border-style'>",
      "column-rule-width": "<'border-width'>",
      "column-span": "none|all",
      "column-width": "<length>|auto",
      columns: "<'column-width'>||<'column-count'>",
      contain: "none|strict|content|[[size||inline-size]||layout||style||paint]",
      "contain-intrinsic-size": "[none|<length>|auto <length>]{1,2}",
      "contain-intrinsic-block-size": "none|<length>|auto <length>",
      "contain-intrinsic-height": "none|<length>|auto <length>",
      "contain-intrinsic-inline-size": "none|<length>|auto <length>",
      "contain-intrinsic-width": "none|<length>|auto <length>",
      content: "normal|none|[<content-replacement>|<content-list>] [/ [<string>|<counter>]+]?",
      "content-visibility": "visible|auto|hidden",
      "counter-increment": "[<counter-name> <integer>?]+|none",
      "counter-reset": "[<counter-name> <integer>?|<reversed-counter-name> <integer>?]+|none",
      "counter-set": "[<counter-name> <integer>?]+|none",
      cursor: "[[<url> [<x> <y>]? ,]* [auto|default|none|context-menu|help|pointer|progress|wait|cell|crosshair|text|vertical-text|alias|copy|move|no-drop|not-allowed|e-resize|n-resize|ne-resize|nw-resize|s-resize|se-resize|sw-resize|w-resize|ew-resize|ns-resize|nesw-resize|nwse-resize|col-resize|row-resize|all-scroll|zoom-in|zoom-out|grab|grabbing|hand|-webkit-grab|-webkit-grabbing|-webkit-zoom-in|-webkit-zoom-out|-moz-grab|-moz-grabbing|-moz-zoom-in|-moz-zoom-out]]",
      direction: "ltr|rtl",
      display: "[<display-outside>||<display-inside>]|<display-listitem>|<display-internal>|<display-box>|<display-legacy>|<-non-standard-display>",
      "empty-cells": "show|hide",
      filter: "none|<filter-function-list>|<-ms-filter-function-list>",
      flex: "none|[<'flex-grow'> <'flex-shrink'>?||<'flex-basis'>]",
      "flex-basis": "content|<'width'>",
      "flex-direction": "row|row-reverse|column|column-reverse",
      "flex-flow": "<'flex-direction'>||<'flex-wrap'>",
      "flex-grow": "<number>",
      "flex-shrink": "<number>",
      "flex-wrap": "nowrap|wrap|wrap-reverse",
      float: "left|right|none|inline-start|inline-end",
      font: "[[<'font-style'>||<font-variant-css21>||<'font-weight'>||<'font-stretch'>]? <'font-size'> [/ <'line-height'>]? <'font-family'>]|caption|icon|menu|message-box|small-caption|status-bar",
      "font-family": "[<family-name>|<generic-family>]#",
      "font-feature-settings": "normal|<feature-tag-value>#",
      "font-kerning": "auto|normal|none",
      "font-language-override": "normal|<string>",
      "font-optical-sizing": "auto|none",
      "font-variation-settings": "normal|[<string> <number>]#",
      "font-size": "<absolute-size>|<relative-size>|<length-percentage>",
      "font-size-adjust": "none|[ex-height|cap-height|ch-width|ic-width|ic-height]? [from-font|<number>]",
      "font-smooth": "auto|never|always|<absolute-size>|<length>",
      "font-stretch": "<font-stretch-absolute>",
      "font-style": "normal|italic|oblique <angle>?",
      "font-synthesis": "none|[weight||style||small-caps]",
      "font-variant": "normal|none|[<common-lig-values>||<discretionary-lig-values>||<historical-lig-values>||<contextual-alt-values>||stylistic( <feature-value-name> )||historical-forms||styleset( <feature-value-name># )||character-variant( <feature-value-name># )||swash( <feature-value-name> )||ornaments( <feature-value-name> )||annotation( <feature-value-name> )||[small-caps|all-small-caps|petite-caps|all-petite-caps|unicase|titling-caps]||<numeric-figure-values>||<numeric-spacing-values>||<numeric-fraction-values>||ordinal||slashed-zero||<east-asian-variant-values>||<east-asian-width-values>||ruby]",
      "font-variant-alternates": "normal|[stylistic( <feature-value-name> )||historical-forms||styleset( <feature-value-name># )||character-variant( <feature-value-name># )||swash( <feature-value-name> )||ornaments( <feature-value-name> )||annotation( <feature-value-name> )]",
      "font-variant-caps": "normal|small-caps|all-small-caps|petite-caps|all-petite-caps|unicase|titling-caps",
      "font-variant-east-asian": "normal|[<east-asian-variant-values>||<east-asian-width-values>||ruby]",
      "font-variant-ligatures": "normal|none|[<common-lig-values>||<discretionary-lig-values>||<historical-lig-values>||<contextual-alt-values>]",
      "font-variant-numeric": "normal|[<numeric-figure-values>||<numeric-spacing-values>||<numeric-fraction-values>||ordinal||slashed-zero]",
      "font-variant-position": "normal|sub|super",
      "font-weight": "<font-weight-absolute>|bolder|lighter",
      "forced-color-adjust": "auto|none",
      gap: "<'row-gap'> <'column-gap'>?",
      grid: "<'grid-template'>|<'grid-template-rows'> / [auto-flow&&dense?] <'grid-auto-columns'>?|[auto-flow&&dense?] <'grid-auto-rows'>? / <'grid-template-columns'>",
      "grid-area": "<grid-line> [/ <grid-line>]{0,3}",
      "grid-auto-columns": "<track-size>+",
      "grid-auto-flow": "[row|column]||dense",
      "grid-auto-rows": "<track-size>+",
      "grid-column": "<grid-line> [/ <grid-line>]?",
      "grid-column-end": "<grid-line>",
      "grid-column-gap": "<length-percentage>",
      "grid-column-start": "<grid-line>",
      "grid-gap": "<'grid-row-gap'> <'grid-column-gap'>?",
      "grid-row": "<grid-line> [/ <grid-line>]?",
      "grid-row-end": "<grid-line>",
      "grid-row-gap": "<length-percentage>",
      "grid-row-start": "<grid-line>",
      "grid-template": "none|[<'grid-template-rows'> / <'grid-template-columns'>]|[<line-names>? <string> <track-size>? <line-names>?]+ [/ <explicit-track-list>]?",
      "grid-template-areas": "none|<string>+",
      "grid-template-columns": "none|<track-list>|<auto-track-list>|subgrid <line-name-list>?",
      "grid-template-rows": "none|<track-list>|<auto-track-list>|subgrid <line-name-list>?",
      "hanging-punctuation": "none|[first||[force-end|allow-end]||last]",
      height: "auto|<length>|<percentage>|min-content|max-content|fit-content|fit-content( <length-percentage> )",
      "hyphenate-character": "auto|<string>",
      hyphens: "none|manual|auto",
      "image-orientation": "from-image|<angle>|[<angle>? flip]",
      "image-rendering": "auto|crisp-edges|pixelated|optimizeSpeed|optimizeQuality|<-non-standard-image-rendering>",
      "image-resolution": "[from-image||<resolution>]&&snap?",
      "ime-mode": "auto|normal|active|inactive|disabled",
      "initial-letter": "normal|[<number> <integer>?]",
      "initial-letter-align": "[auto|alphabetic|hanging|ideographic]",
      "inline-size": "<'width'>",
      "input-security": "auto|none",
      inset: "<'top'>{1,4}",
      "inset-block": "<'top'>{1,2}",
      "inset-block-end": "<'top'>",
      "inset-block-start": "<'top'>",
      "inset-inline": "<'top'>{1,2}",
      "inset-inline-end": "<'top'>",
      "inset-inline-start": "<'top'>",
      isolation: "auto|isolate",
      "justify-content": "normal|<content-distribution>|<overflow-position>? [<content-position>|left|right]",
      "justify-items": "normal|stretch|<baseline-position>|<overflow-position>? [<self-position>|left|right]|legacy|legacy&&[left|right|center]",
      "justify-self": "auto|normal|stretch|<baseline-position>|<overflow-position>? [<self-position>|left|right]",
      "justify-tracks": "[normal|<content-distribution>|<overflow-position>? [<content-position>|left|right]]#",
      left: "<length>|<percentage>|auto",
      "letter-spacing": "normal|<length-percentage>",
      "line-break": "auto|loose|normal|strict|anywhere",
      "line-clamp": "none|<integer>",
      "line-height": "normal|<number>|<length>|<percentage>",
      "line-height-step": "<length>",
      "list-style": "<'list-style-type'>||<'list-style-position'>||<'list-style-image'>",
      "list-style-image": "<image>|none",
      "list-style-position": "inside|outside",
      "list-style-type": "<counter-style>|<string>|none",
      margin: "[<length>|<percentage>|auto]{1,4}",
      "margin-block": "<'margin-left'>{1,2}",
      "margin-block-end": "<'margin-left'>",
      "margin-block-start": "<'margin-left'>",
      "margin-bottom": "<length>|<percentage>|auto",
      "margin-inline": "<'margin-left'>{1,2}",
      "margin-inline-end": "<'margin-left'>",
      "margin-inline-start": "<'margin-left'>",
      "margin-left": "<length>|<percentage>|auto",
      "margin-right": "<length>|<percentage>|auto",
      "margin-top": "<length>|<percentage>|auto",
      "margin-trim": "none|in-flow|all",
      mask: "<mask-layer>#",
      "mask-border": "<'mask-border-source'>||<'mask-border-slice'> [/ <'mask-border-width'>? [/ <'mask-border-outset'>]?]?||<'mask-border-repeat'>||<'mask-border-mode'>",
      "mask-border-mode": "luminance|alpha",
      "mask-border-outset": "[<length>|<number>]{1,4}",
      "mask-border-repeat": "[stretch|repeat|round|space]{1,2}",
      "mask-border-slice": "<number-percentage>{1,4} fill?",
      "mask-border-source": "none|<image>",
      "mask-border-width": "[<length-percentage>|<number>|auto]{1,4}",
      "mask-clip": "[<geometry-box>|no-clip]#",
      "mask-composite": "<compositing-operator>#",
      "mask-image": "<mask-reference>#",
      "mask-mode": "<masking-mode>#",
      "mask-origin": "<geometry-box>#",
      "mask-position": "<position>#",
      "mask-repeat": "<repeat-style>#",
      "mask-size": "<bg-size>#",
      "mask-type": "luminance|alpha",
      "masonry-auto-flow": "[pack|next]||[definite-first|ordered]",
      "math-depth": "auto-add|add( <integer> )|<integer>",
      "math-shift": "normal|compact",
      "math-style": "normal|compact",
      "max-block-size": "<'max-width'>",
      "max-height": "none|<length-percentage>|min-content|max-content|fit-content|fit-content( <length-percentage> )",
      "max-inline-size": "<'max-width'>",
      "max-lines": "none|<integer>",
      "max-width": "none|<length-percentage>|min-content|max-content|fit-content|fit-content( <length-percentage> )|<-non-standard-width>",
      "min-block-size": "<'min-width'>",
      "min-height": "auto|<length>|<percentage>|min-content|max-content|fit-content|fit-content( <length-percentage> )",
      "min-inline-size": "<'min-width'>",
      "min-width": "auto|<length>|<percentage>|min-content|max-content|fit-content|fit-content( <length-percentage> )|<-non-standard-width>",
      "mix-blend-mode": "<blend-mode>|plus-lighter",
      "object-fit": "fill|contain|cover|none|scale-down",
      "object-position": "<position>",
      offset: "[<'offset-position'>? [<'offset-path'> [<'offset-distance'>||<'offset-rotate'>]?]?]! [/ <'offset-anchor'>]?",
      "offset-anchor": "auto|<position>",
      "offset-distance": "<length-percentage>",
      "offset-path": "none|ray( [<angle>&&<size>&&contain?] )|<path()>|<url>|[<basic-shape>||<geometry-box>]",
      "offset-position": "auto|<position>",
      "offset-rotate": "[auto|reverse]||<angle>",
      opacity: "<alpha-value>",
      order: "<integer>",
      orphans: "<integer>",
      outline: "[<'outline-color'>||<'outline-style'>||<'outline-width'>]",
      "outline-color": "<color>|invert",
      "outline-offset": "<length>",
      "outline-style": "auto|<'border-style'>",
      "outline-width": "<line-width>",
      overflow: "[visible|hidden|clip|scroll|auto]{1,2}|<-non-standard-overflow>",
      "overflow-anchor": "auto|none",
      "overflow-block": "visible|hidden|clip|scroll|auto",
      "overflow-clip-box": "padding-box|content-box",
      "overflow-clip-margin": "<visual-box>||<length [0,∞]>",
      "overflow-inline": "visible|hidden|clip|scroll|auto",
      "overflow-wrap": "normal|break-word|anywhere",
      "overflow-x": "visible|hidden|clip|scroll|auto",
      "overflow-y": "visible|hidden|clip|scroll|auto",
      "overscroll-behavior": "[contain|none|auto]{1,2}",
      "overscroll-behavior-block": "contain|none|auto",
      "overscroll-behavior-inline": "contain|none|auto",
      "overscroll-behavior-x": "contain|none|auto",
      "overscroll-behavior-y": "contain|none|auto",
      padding: "[<length>|<percentage>]{1,4}",
      "padding-block": "<'padding-left'>{1,2}",
      "padding-block-end": "<'padding-left'>",
      "padding-block-start": "<'padding-left'>",
      "padding-bottom": "<length>|<percentage>",
      "padding-inline": "<'padding-left'>{1,2}",
      "padding-inline-end": "<'padding-left'>",
      "padding-inline-start": "<'padding-left'>",
      "padding-left": "<length>|<percentage>",
      "padding-right": "<length>|<percentage>",
      "padding-top": "<length>|<percentage>",
      "page-break-after": "auto|always|avoid|left|right|recto|verso",
      "page-break-before": "auto|always|avoid|left|right|recto|verso",
      "page-break-inside": "auto|avoid",
      "paint-order": "normal|[fill||stroke||markers]",
      perspective: "none|<length>",
      "perspective-origin": "<position>",
      "place-content": "<'align-content'> <'justify-content'>?",
      "place-items": "<'align-items'> <'justify-items'>?",
      "place-self": "<'align-self'> <'justify-self'>?",
      "pointer-events": "auto|none|visiblePainted|visibleFill|visibleStroke|visible|painted|fill|stroke|all|inherit",
      position: "static|relative|absolute|sticky|fixed|-webkit-sticky",
      quotes: "none|auto|[<string> <string>]+",
      resize: "none|both|horizontal|vertical|block|inline",
      right: "<length>|<percentage>|auto",
      rotate: "none|<angle>|[x|y|z|<number>{3}]&&<angle>",
      "row-gap": "normal|<length-percentage>",
      "ruby-align": "start|center|space-between|space-around",
      "ruby-merge": "separate|collapse|auto",
      "ruby-position": "[alternate||[over|under]]|inter-character",
      scale: "none|<number>{1,3}",
      "scrollbar-color": "auto|<color>{2}",
      "scrollbar-gutter": "auto|stable&&both-edges?",
      "scrollbar-width": "auto|thin|none",
      "scroll-behavior": "auto|smooth",
      "scroll-margin": "<length>{1,4}",
      "scroll-margin-block": "<length>{1,2}",
      "scroll-margin-block-start": "<length>",
      "scroll-margin-block-end": "<length>",
      "scroll-margin-bottom": "<length>",
      "scroll-margin-inline": "<length>{1,2}",
      "scroll-margin-inline-start": "<length>",
      "scroll-margin-inline-end": "<length>",
      "scroll-margin-left": "<length>",
      "scroll-margin-right": "<length>",
      "scroll-margin-top": "<length>",
      "scroll-padding": "[auto|<length-percentage>]{1,4}",
      "scroll-padding-block": "[auto|<length-percentage>]{1,2}",
      "scroll-padding-block-start": "auto|<length-percentage>",
      "scroll-padding-block-end": "auto|<length-percentage>",
      "scroll-padding-bottom": "auto|<length-percentage>",
      "scroll-padding-inline": "[auto|<length-percentage>]{1,2}",
      "scroll-padding-inline-start": "auto|<length-percentage>",
      "scroll-padding-inline-end": "auto|<length-percentage>",
      "scroll-padding-left": "auto|<length-percentage>",
      "scroll-padding-right": "auto|<length-percentage>",
      "scroll-padding-top": "auto|<length-percentage>",
      "scroll-snap-align": "[none|start|end|center]{1,2}",
      "scroll-snap-coordinate": "none|<position>#",
      "scroll-snap-destination": "<position>",
      "scroll-snap-points-x": "none|repeat( <length-percentage> )",
      "scroll-snap-points-y": "none|repeat( <length-percentage> )",
      "scroll-snap-stop": "normal|always",
      "scroll-snap-type": "none|[x|y|block|inline|both] [mandatory|proximity]?",
      "scroll-snap-type-x": "none|mandatory|proximity",
      "scroll-snap-type-y": "none|mandatory|proximity",
      "scroll-timeline": "<scroll-timeline-name>||<scroll-timeline-axis>",
      "scroll-timeline-axis": "block|inline|vertical|horizontal",
      "scroll-timeline-name": "none|<custom-ident>",
      "shape-image-threshold": "<alpha-value>",
      "shape-margin": "<length-percentage>",
      "shape-outside": "none|[<shape-box>||<basic-shape>]|<image>",
      "tab-size": "<integer>|<length>",
      "table-layout": "auto|fixed",
      "text-align": "start|end|left|right|center|justify|match-parent",
      "text-align-last": "auto|start|end|left|right|center|justify",
      "text-combine-upright": "none|all|[digits <integer>?]",
      "text-decoration": "<'text-decoration-line'>||<'text-decoration-style'>||<'text-decoration-color'>||<'text-decoration-thickness'>",
      "text-decoration-color": "<color>",
      "text-decoration-line": "none|[underline||overline||line-through||blink]|spelling-error|grammar-error",
      "text-decoration-skip": "none|[objects||[spaces|[leading-spaces||trailing-spaces]]||edges||box-decoration]",
      "text-decoration-skip-ink": "auto|all|none",
      "text-decoration-style": "solid|double|dotted|dashed|wavy",
      "text-decoration-thickness": "auto|from-font|<length>|<percentage>",
      "text-emphasis": "<'text-emphasis-style'>||<'text-emphasis-color'>",
      "text-emphasis-color": "<color>",
      "text-emphasis-position": "[over|under]&&[right|left]",
      "text-emphasis-style": "none|[[filled|open]||[dot|circle|double-circle|triangle|sesame]]|<string>",
      "text-indent": "<length-percentage>&&hanging?&&each-line?",
      "text-justify": "auto|inter-character|inter-word|none",
      "text-orientation": "mixed|upright|sideways",
      "text-overflow": "[clip|ellipsis|<string>]{1,2}",
      "text-rendering": "auto|optimizeSpeed|optimizeLegibility|geometricPrecision",
      "text-shadow": "none|<shadow-t>#",
      "text-size-adjust": "none|auto|<percentage>",
      "text-transform": "none|capitalize|uppercase|lowercase|full-width|full-size-kana",
      "text-underline-offset": "auto|<length>|<percentage>",
      "text-underline-position": "auto|from-font|[under||[left|right]]",
      top: "<length>|<percentage>|auto",
      "touch-action": "auto|none|[[pan-x|pan-left|pan-right]||[pan-y|pan-up|pan-down]||pinch-zoom]|manipulation",
      transform: "none|<transform-list>",
      "transform-box": "content-box|border-box|fill-box|stroke-box|view-box",
      "transform-origin": "[<length-percentage>|left|center|right|top|bottom]|[[<length-percentage>|left|center|right]&&[<length-percentage>|top|center|bottom]] <length>?",
      "transform-style": "flat|preserve-3d",
      transition: "<single-transition>#",
      "transition-delay": "<time>#",
      "transition-duration": "<time>#",
      "transition-property": "none|<single-transition-property>#",
      "transition-timing-function": "<easing-function>#",
      translate: "none|<length-percentage> [<length-percentage> <length>?]?",
      "unicode-bidi": "normal|embed|isolate|bidi-override|isolate-override|plaintext|-moz-isolate|-moz-isolate-override|-moz-plaintext|-webkit-isolate|-webkit-isolate-override|-webkit-plaintext",
      "user-select": "auto|text|none|contain|all",
      "vertical-align": "baseline|sub|super|text-top|text-bottom|middle|top|bottom|<percentage>|<length>",
      visibility: "visible|hidden|collapse",
      "white-space": "normal|pre|nowrap|pre-wrap|pre-line|break-spaces",
      widows: "<integer>",
      width: "auto|<length>|<percentage>|min-content|max-content|fit-content|fit-content( <length-percentage> )|fill|stretch|intrinsic|-moz-max-content|-webkit-max-content|-moz-fit-content|-webkit-fit-content",
      "will-change": "auto|<animateable-feature>#",
      "word-break": "normal|break-all|keep-all|break-word",
      "word-spacing": "normal|<length>",
      "word-wrap": "normal|break-word",
      "writing-mode": "horizontal-tb|vertical-rl|vertical-lr|sideways-rl|sideways-lr|<svg-writing-mode>",
      "z-index": "auto|<integer>",
      zoom: "normal|reset|<number>|<percentage>",
      "-moz-background-clip": "padding|border",
      "-moz-border-radius-bottomleft": "<'border-bottom-left-radius'>",
      "-moz-border-radius-bottomright": "<'border-bottom-right-radius'>",
      "-moz-border-radius-topleft": "<'border-top-left-radius'>",
      "-moz-border-radius-topright": "<'border-bottom-right-radius'>",
      "-moz-control-character-visibility": "visible|hidden",
      "-moz-osx-font-smoothing": "auto|grayscale",
      "-moz-user-select": "none|text|all|-moz-none",
      "-ms-flex-align": "start|end|center|baseline|stretch",
      "-ms-flex-item-align": "auto|start|end|center|baseline|stretch",
      "-ms-flex-line-pack": "start|end|center|justify|distribute|stretch",
      "-ms-flex-negative": "<'flex-shrink'>",
      "-ms-flex-pack": "start|end|center|justify|distribute",
      "-ms-flex-order": "<integer>",
      "-ms-flex-positive": "<'flex-grow'>",
      "-ms-flex-preferred-size": "<'flex-basis'>",
      "-ms-interpolation-mode": "nearest-neighbor|bicubic",
      "-ms-grid-column-align": "start|end|center|stretch",
      "-ms-grid-row-align": "start|end|center|stretch",
      "-ms-hyphenate-limit-last": "none|always|column|page|spread",
      "-webkit-background-clip": "[<box>|border|padding|content|text]#",
      "-webkit-column-break-after": "always|auto|avoid",
      "-webkit-column-break-before": "always|auto|avoid",
      "-webkit-column-break-inside": "always|auto|avoid",
      "-webkit-font-smoothing": "auto|none|antialiased|subpixel-antialiased",
      "-webkit-mask-box-image": "[<url>|<gradient>|none] [<length-percentage>{4} <-webkit-mask-box-repeat>{2}]?",
      "-webkit-print-color-adjust": "economy|exact",
      "-webkit-text-security": "none|circle|disc|square",
      "-webkit-user-drag": "none|element|auto",
      "-webkit-user-select": "auto|none|text|all",
      "alignment-baseline": "auto|baseline|before-edge|text-before-edge|middle|central|after-edge|text-after-edge|ideographic|alphabetic|hanging|mathematical",
      "baseline-shift": "baseline|sub|super|<svg-length>",
      behavior: "<url>+",
      "clip-rule": "nonzero|evenodd",
      cue: "<'cue-before'> <'cue-after'>?",
      "cue-after": "<url> <decibel>?|none",
      "cue-before": "<url> <decibel>?|none",
      "dominant-baseline": "auto|use-script|no-change|reset-size|ideographic|alphabetic|hanging|mathematical|central|middle|text-after-edge|text-before-edge",
      fill: "<paint>",
      "fill-opacity": "<number-zero-one>",
      "fill-rule": "nonzero|evenodd",
      "glyph-orientation-horizontal": "<angle>",
      "glyph-orientation-vertical": "<angle>",
      kerning: "auto|<svg-length>",
      marker: "none|<url>",
      "marker-end": "none|<url>",
      "marker-mid": "none|<url>",
      "marker-start": "none|<url>",
      pause: "<'pause-before'> <'pause-after'>?",
      "pause-after": "<time>|none|x-weak|weak|medium|strong|x-strong",
      "pause-before": "<time>|none|x-weak|weak|medium|strong|x-strong",
      rest: "<'rest-before'> <'rest-after'>?",
      "rest-after": "<time>|none|x-weak|weak|medium|strong|x-strong",
      "rest-before": "<time>|none|x-weak|weak|medium|strong|x-strong",
      "shape-rendering": "auto|optimizeSpeed|crispEdges|geometricPrecision",
      src: "[<url> [format( <string># )]?|local( <family-name> )]#",
      speak: "auto|none|normal",
      "speak-as": "normal|spell-out||digits||[literal-punctuation|no-punctuation]",
      stroke: "<paint>",
      "stroke-dasharray": "none|[<svg-length>+]#",
      "stroke-dashoffset": "<svg-length>",
      "stroke-linecap": "butt|round|square",
      "stroke-linejoin": "miter|round|bevel",
      "stroke-miterlimit": "<number-one-or-greater>",
      "stroke-opacity": "<number-zero-one>",
      "stroke-width": "<svg-length>",
      "text-anchor": "start|middle|end",
      "unicode-range": "<urange>#",
      "voice-balance": "<number>|left|center|right|leftwards|rightwards",
      "voice-duration": "auto|<time>",
      "voice-family": "[[<family-name>|<generic-voice>] ,]* [<family-name>|<generic-voice>]|preserve",
      "voice-pitch": "<frequency>&&absolute|[[x-low|low|medium|high|x-high]||[<frequency>|<semitones>|<percentage>]]",
      "voice-range": "<frequency>&&absolute|[[x-low|low|medium|high|x-high]||[<frequency>|<semitones>|<percentage>]]",
      "voice-rate": "[normal|x-slow|slow|medium|fast|x-fast]||<percentage>",
      "voice-stress": "normal|strong|moderate|none|reduced",
      "voice-volume": "silent|[[x-soft|soft|medium|loud|x-loud]||<decibel>]"
    },
    atrules: {
      charset: {
        prelude: "<string>",
        descriptors: null
      },
      "counter-style": {
        prelude: "<counter-style-name>",
        descriptors: {
          "additive-symbols": "[<integer>&&<symbol>]#",
          fallback: "<counter-style-name>",
          negative: "<symbol> <symbol>?",
          pad: "<integer>&&<symbol>",
          prefix: "<symbol>",
          range: "[[<integer>|infinite]{2}]#|auto",
          "speak-as": "auto|bullets|numbers|words|spell-out|<counter-style-name>",
          suffix: "<symbol>",
          symbols: "<symbol>+",
          system: "cyclic|numeric|alphabetic|symbolic|additive|[fixed <integer>?]|[extends <counter-style-name>]"
        }
      },
      document: {
        prelude: "[<url>|url-prefix( <string> )|domain( <string> )|media-document( <string> )|regexp( <string> )]#",
        descriptors: null
      },
      "font-face": {
        prelude: null,
        descriptors: {
          "ascent-override": "normal|<percentage>",
          "descent-override": "normal|<percentage>",
          "font-display": "[auto|block|swap|fallback|optional]",
          "font-family": "<family-name>",
          "font-feature-settings": "normal|<feature-tag-value>#",
          "font-variation-settings": "normal|[<string> <number>]#",
          "font-stretch": "<font-stretch-absolute>{1,2}",
          "font-style": "normal|italic|oblique <angle>{0,2}",
          "font-weight": "<font-weight-absolute>{1,2}",
          "font-variant": "normal|none|[<common-lig-values>||<discretionary-lig-values>||<historical-lig-values>||<contextual-alt-values>||stylistic( <feature-value-name> )||historical-forms||styleset( <feature-value-name># )||character-variant( <feature-value-name># )||swash( <feature-value-name> )||ornaments( <feature-value-name> )||annotation( <feature-value-name> )||[small-caps|all-small-caps|petite-caps|all-petite-caps|unicase|titling-caps]||<numeric-figure-values>||<numeric-spacing-values>||<numeric-fraction-values>||ordinal||slashed-zero||<east-asian-variant-values>||<east-asian-width-values>||ruby]",
          "line-gap-override": "normal|<percentage>",
          "size-adjust": "<percentage>",
          src: "[<url> [format( <string># )]?|local( <family-name> )]#",
          "unicode-range": "<urange>#"
        }
      },
      "font-feature-values": {
        prelude: "<family-name>#",
        descriptors: null
      },
      import: {
        prelude: "[<string>|<url>] [layer|layer( <layer-name> )]? [supports( [<supports-condition>|<declaration>] )]? <media-query-list>?",
        descriptors: null
      },
      keyframes: {
        prelude: "<keyframes-name>",
        descriptors: null
      },
      layer: {
        prelude: "[<layer-name>#|<layer-name>?]",
        descriptors: null
      },
      media: {
        prelude: "<media-query-list>",
        descriptors: null
      },
      namespace: {
        prelude: "<namespace-prefix>? [<string>|<url>]",
        descriptors: null
      },
      page: {
        prelude: "<page-selector-list>",
        descriptors: {
          bleed: "auto|<length>",
          marks: "none|[crop||cross]",
          size: "<length>{1,2}|auto|[<page-size>||[portrait|landscape]]"
        }
      },
      property: {
        prelude: "<custom-property-name>",
        descriptors: {
          syntax: "<string>",
          inherits: "true|false",
          "initial-value": "<string>"
        }
      },
      "scroll-timeline": {
        prelude: "<timeline-name>",
        descriptors: null
      },
      supports: {
        prelude: "<supports-condition>",
        descriptors: null
      },
      viewport: {
        prelude: null,
        descriptors: {
          height: "<viewport-length>{1,2}",
          "max-height": "<viewport-length>",
          "max-width": "<viewport-length>",
          "max-zoom": "auto|<number>|<percentage>",
          "min-height": "<viewport-length>",
          "min-width": "<viewport-length>",
          "min-zoom": "auto|<number>|<percentage>",
          orientation: "auto|portrait|landscape",
          "user-zoom": "zoom|fixed",
          "viewport-fit": "auto|contain|cover",
          width: "<viewport-length>{1,2}",
          zoom: "auto|<number>|<percentage>"
        }
      },
      nest: {
        prelude: "<complex-selector-list>",
        descriptors: null
      }
    }
  }, Se = 43, se = 45, Nt = 110, Re = !0, nc = !1;
  function Rt(e, t) {
    let n = this.tokenStart + e;
    const r = this.charCodeAt(n);
    for ((r === Se || r === se) && (t && this.error("Number sign is not allowed"), n++); n < this.tokenEnd; n++)
      Q(this.charCodeAt(n)) || this.error("Integer is expected", n);
  }
  function Je(e) {
    return Rt.call(this, 0, e);
  }
  function Pe(e, t) {
    if (!this.cmpChar(this.tokenStart + e, t)) {
      let n = "";
      switch (t) {
        case Nt:
          n = "N is expected";
          break;
        case se:
          n = "HyphenMinus is expected";
          break;
      }
      this.error(n, this.tokenStart + e);
    }
  }
  function Tn() {
    let e = 0, t = 0, n = this.tokenType;
    for (; n === B || n === re; )
      n = this.lookupType(++e);
    if (n !== O)
      if (this.isDelim(Se, e) || this.isDelim(se, e)) {
        t = this.isDelim(Se, e) ? Se : se;
        do
          n = this.lookupType(++e);
        while (n === B || n === re);
        n !== O && (this.skip(e), Je.call(this, Re));
      } else
        return null;
    return e > 0 && this.skip(e), t === 0 && (n = this.charCodeAt(this.tokenStart), n !== Se && n !== se && this.error("Number sign is expected")), Je.call(this, t !== 0), t === se ? "-" + this.consume(O) : this.consume(O);
  }
  const rc = "AnPlusB", ic = {
    a: [String, null],
    b: [String, null]
  };
  function vo() {
    const e = this.tokenStart;
    let t = null, n = null;
    if (this.tokenType === O)
      Je.call(this, nc), n = this.consume(O);
    else if (this.tokenType === v && this.cmpChar(this.tokenStart, se))
      switch (t = "-1", Pe.call(this, 1, Nt), this.tokenEnd - this.tokenStart) {
        case 2:
          this.next(), n = Tn.call(this);
          break;
        case 3:
          Pe.call(this, 2, se), this.next(), this.skipSC(), Je.call(this, Re), n = "-" + this.consume(O);
          break;
        default:
          Pe.call(this, 2, se), Rt.call(this, 3, Re), this.next(), n = this.substrToCursor(e + 2);
      }
    else if (this.tokenType === v || this.isDelim(Se) && this.lookupType(1) === v) {
      let r = 0;
      switch (t = "1", this.isDelim(Se) && (r = 1, this.next()), Pe.call(this, 0, Nt), this.tokenEnd - this.tokenStart) {
        case 1:
          this.next(), n = Tn.call(this);
          break;
        case 2:
          Pe.call(this, 1, se), this.next(), this.skipSC(), Je.call(this, Re), n = "-" + this.consume(O);
          break;
        default:
          Pe.call(this, 1, se), Rt.call(this, 2, Re), this.next(), n = this.substrToCursor(e + r + 1);
      }
    } else if (this.tokenType === _) {
      const r = this.charCodeAt(this.tokenStart), i = r === Se || r === se;
      let o = this.tokenStart + i;
      for (; o < this.tokenEnd && Q(this.charCodeAt(o)); o++)
        ;
      o === this.tokenStart + i && this.error("Integer is expected", this.tokenStart + i), Pe.call(this, o - this.tokenStart, Nt), t = this.substring(e, o), o + 1 === this.tokenEnd ? (this.next(), n = Tn.call(this)) : (Pe.call(this, o - this.tokenStart + 1, se), o + 2 === this.tokenEnd ? (this.next(), this.skipSC(), Je.call(this, Re), n = "-" + this.consume(O)) : (Rt.call(this, o - this.tokenStart + 2, Re), this.next(), n = this.substrToCursor(o + 1)));
    } else
      this.error();
    return t !== null && t.charCodeAt(0) === Se && (t = t.substr(1)), n !== null && n.charCodeAt(0) === Se && (n = n.substr(1)), {
      type: "AnPlusB",
      loc: this.getLocation(e, this.tokenStart),
      a: t,
      b: n
    };
  }
  function oc(e) {
    if (e.a) {
      const t = e.a === "+1" && "n" || e.a === "1" && "n" || e.a === "-1" && "-n" || e.a + "n";
      if (e.b) {
        const n = e.b[0] === "-" || e.b[0] === "+" ? e.b : "+" + e.b;
        this.tokenize(t + n);
      } else
        this.tokenize(t);
    } else
      this.tokenize(e.b);
  }
  const ac = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: oc,
    name: rc,
    parse: vo,
    structure: ic
  }, Symbol.toStringTag, { value: "Module" }));
  function ui(e) {
    return this.Raw(e, this.consumeUntilLeftCurlyBracketOrSemicolon, !0);
  }
  function sc() {
    for (let e = 1, t; t = this.lookupType(e); e++) {
      if (t === fe)
        return !0;
      if (t === ee || t === U)
        return !1;
    }
    return !1;
  }
  const lc = "Atrule", cc = "atrule", uc = {
    name: String,
    prelude: ["AtrulePrelude", "Raw", null],
    block: ["Block", null]
  };
  function wo(e = !1) {
    const t = this.tokenStart;
    let n, r, i = null, o = null;
    switch (this.eat(U), n = this.substrToCursor(t + 1), r = n.toLowerCase(), this.skipSC(), this.eof === !1 && this.tokenType !== ee && this.tokenType !== ae && (this.parseAtrulePrelude ? i = this.parseWithFallback(this.AtrulePrelude.bind(this, n, e), ui) : i = ui.call(this, this.tokenIndex), this.skipSC()), this.tokenType) {
      case ae:
        this.next();
        break;
      case ee:
        hasOwnProperty.call(this.atrule, r) && typeof this.atrule[r].block == "function" ? o = this.atrule[r].block.call(this, e) : o = this.Block(sc.call(this));
        break;
    }
    return {
      type: "Atrule",
      loc: this.getLocation(t, this.tokenStart),
      name: n,
      prelude: i,
      block: o
    };
  }
  function hc(e) {
    this.token(U, "@" + e.name), e.prelude !== null && this.node(e.prelude), e.block ? this.node(e.block) : this.token(ae, ";");
  }
  const pc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: hc,
    name: lc,
    parse: wo,
    structure: uc,
    walkContext: cc
  }, Symbol.toStringTag, { value: "Module" })), fc = "AtrulePrelude", dc = "atrulePrelude", mc = {
    children: [[]]
  };
  function So(e) {
    let t = null;
    return e !== null && (e = e.toLowerCase()), this.skipSC(), hasOwnProperty.call(this.atrule, e) && typeof this.atrule[e].prelude == "function" ? t = this.atrule[e].prelude.call(this) : t = this.readSequence(this.scope.AtrulePrelude), this.skipSC(), this.eof !== !0 && this.tokenType !== ee && this.tokenType !== ae && this.error("Semicolon or block is expected"), {
      type: "AtrulePrelude",
      loc: this.getLocationFromList(t),
      children: t
    };
  }
  function gc(e) {
    this.children(e);
  }
  const bc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: gc,
    name: fc,
    parse: So,
    structure: mc,
    walkContext: dc
  }, Symbol.toStringTag, { value: "Module" })), yc = 36, Co = 42, Dt = 61, kc = 94, Hn = 124, xc = 126;
  function vc() {
    this.eof && this.error("Unexpected end of input");
    const e = this.tokenStart;
    let t = !1;
    return this.isDelim(Co) ? (t = !0, this.next()) : this.isDelim(Hn) || this.eat(v), this.isDelim(Hn) ? this.charCodeAt(this.tokenStart + 1) !== Dt ? (this.next(), this.eat(v)) : t && this.error("Identifier is expected", this.tokenEnd) : t && this.error("Vertical line is expected"), {
      type: "Identifier",
      loc: this.getLocation(e, this.tokenStart),
      name: this.substrToCursor(e)
    };
  }
  function wc() {
    const e = this.tokenStart, t = this.charCodeAt(e);
    return t !== Dt && // =
    t !== xc && // ~=
    t !== kc && // ^=
    t !== yc && // $=
    t !== Co && // *=
    t !== Hn && this.error("Attribute selector (=, ~=, ^=, $=, *=, |=) is expected"), this.next(), t !== Dt && (this.isDelim(Dt) || this.error("Equal sign is expected"), this.next()), this.substrToCursor(e);
  }
  const Sc = "AttributeSelector", Cc = {
    name: "Identifier",
    matcher: [String, null],
    value: ["String", "Identifier", null],
    flags: [String, null]
  };
  function Ao() {
    const e = this.tokenStart;
    let t, n = null, r = null, i = null;
    return this.eat(ce), this.skipSC(), t = vc.call(this), this.skipSC(), this.tokenType !== xe && (this.tokenType !== v && (n = wc.call(this), this.skipSC(), r = this.tokenType === Te ? this.String() : this.Identifier(), this.skipSC()), this.tokenType === v && (i = this.consume(v), this.skipSC())), this.eat(xe), {
      type: "AttributeSelector",
      loc: this.getLocation(e, this.tokenStart),
      name: t,
      matcher: n,
      value: r,
      flags: i
    };
  }
  function Ac(e) {
    this.token(P, "["), this.node(e.name), e.matcher !== null && (this.tokenize(e.matcher), this.node(e.value)), e.flags !== null && this.token(v, e.flags), this.token(P, "]");
  }
  const Tc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: Ac,
    name: Sc,
    parse: Ao,
    structure: Cc
  }, Symbol.toStringTag, { value: "Module" })), Oc = 38;
  function To(e) {
    return this.Raw(e, null, !0);
  }
  function hi() {
    return this.parseWithFallback(this.Rule, To);
  }
  function pi(e) {
    return this.Raw(e, this.consumeUntilSemicolonIncluded, !0);
  }
  function Lc() {
    if (this.tokenType === ae)
      return pi.call(this, this.tokenIndex);
    const e = this.parseWithFallback(this.Declaration, pi);
    return this.tokenType === ae && this.next(), e;
  }
  const $c = "Block", Ec = "block", _c = {
    children: [[
      "Atrule",
      "Rule",
      "Declaration"
    ]]
  };
  function Oo(e) {
    const t = e ? Lc : hi, n = this.tokenStart;
    let r = this.createList();
    this.eat(ee);
    e:
      for (; !this.eof; )
        switch (this.tokenType) {
          case fe:
            break e;
          case B:
          case re:
            this.next();
            break;
          case U:
            r.push(this.parseWithFallback(this.Atrule.bind(this, e), To));
            break;
          default:
            e && this.isDelim(Oc) ? r.push(hi.call(this)) : r.push(t.call(this));
        }
    return this.eof || this.eat(fe), {
      type: "Block",
      loc: this.getLocation(n, this.tokenStart),
      children: r
    };
  }
  function Pc(e) {
    this.token(ee, "{"), this.children(e, (t) => {
      t.type === "Declaration" && this.token(ae, ";");
    }), this.token(fe, "}");
  }
  const zc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: Pc,
    name: $c,
    parse: Oo,
    structure: _c,
    walkContext: Ec
  }, Symbol.toStringTag, { value: "Module" })), Mc = "Brackets", Ic = {
    children: [[]]
  };
  function Lo(e, t) {
    const n = this.tokenStart;
    let r = null;
    return this.eat(ce), r = e.call(this, t), this.eof || this.eat(xe), {
      type: "Brackets",
      loc: this.getLocation(n, this.tokenStart),
      children: r
    };
  }
  function jc(e) {
    this.token(P, "["), this.children(e), this.token(P, "]");
  }
  const Nc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: jc,
    name: Mc,
    parse: Lo,
    structure: Ic
  }, Symbol.toStringTag, { value: "Module" })), Rc = "CDC", Dc = [];
  function $o() {
    const e = this.tokenStart;
    return this.eat(oe), {
      type: "CDC",
      loc: this.getLocation(e, this.tokenStart)
    };
  }
  function Fc() {
    this.token(oe, "-->");
  }
  const Bc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: Fc,
    name: Rc,
    parse: $o,
    structure: Dc
  }, Symbol.toStringTag, { value: "Module" })), Uc = "CDO", qc = [];
  function Eo() {
    const e = this.tokenStart;
    return this.eat(At), {
      type: "CDO",
      loc: this.getLocation(e, this.tokenStart)
    };
  }
  function Hc() {
    this.token(At, "<!--");
  }
  const Wc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: Hc,
    name: Uc,
    parse: Eo,
    structure: qc
  }, Symbol.toStringTag, { value: "Module" })), Vc = 46, Gc = "ClassSelector", Kc = {
    name: String
  };
  function _o() {
    return this.eatDelim(Vc), {
      type: "ClassSelector",
      loc: this.getLocation(this.tokenStart - 1, this.tokenEnd),
      name: this.consume(v)
    };
  }
  function Qc(e) {
    this.token(P, "."), this.token(v, e.name);
  }
  const Yc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: Qc,
    name: Gc,
    parse: _o,
    structure: Kc
  }, Symbol.toStringTag, { value: "Module" })), Xc = 43, fi = 47, Zc = 62, Jc = 126, eu = "Combinator", tu = {
    name: String
  };
  function Po() {
    const e = this.tokenStart;
    let t;
    switch (this.tokenType) {
      case B:
        t = " ";
        break;
      case P:
        switch (this.charCodeAt(this.tokenStart)) {
          case Zc:
          case Xc:
          case Jc:
            this.next();
            break;
          case fi:
            this.next(), this.eatIdent("deep"), this.eatDelim(fi);
            break;
          default:
            this.error("Combinator is expected");
        }
        t = this.substrToCursor(e);
        break;
    }
    return {
      type: "Combinator",
      loc: this.getLocation(e, this.tokenStart),
      name: t
    };
  }
  function nu(e) {
    this.tokenize(e.name);
  }
  const ru = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: nu,
    name: eu,
    parse: Po,
    structure: tu
  }, Symbol.toStringTag, { value: "Module" })), iu = 42, ou = 47, au = "Comment", su = {
    value: String
  };
  function zo() {
    const e = this.tokenStart;
    let t = this.tokenEnd;
    return this.eat(re), t - e + 2 >= 2 && this.charCodeAt(t - 2) === iu && this.charCodeAt(t - 1) === ou && (t -= 2), {
      type: "Comment",
      loc: this.getLocation(e, this.tokenStart),
      value: this.substring(e + 2, t)
    };
  }
  function lu(e) {
    this.token(re, "/*" + e.value + "*/");
  }
  const cu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: lu,
    name: au,
    parse: zo,
    structure: su
  }, Symbol.toStringTag, { value: "Module" })), Mo = 33, uu = 35, hu = 36, pu = 38, fu = 42, du = 43, di = 47;
  function mu(e) {
    return this.Raw(e, this.consumeUntilExclamationMarkOrSemicolon, !0);
  }
  function gu(e) {
    return this.Raw(e, this.consumeUntilExclamationMarkOrSemicolon, !1);
  }
  function bu() {
    const e = this.tokenIndex, t = this.Value();
    return t.type !== "Raw" && this.eof === !1 && this.tokenType !== ae && this.isDelim(Mo) === !1 && this.isBalanceEdge(e) === !1 && this.error(), t;
  }
  const yu = "Declaration", ku = "declaration", xu = {
    important: [Boolean, String],
    property: String,
    value: ["Value", "Raw"]
  };
  function Io() {
    const e = this.tokenStart, t = this.tokenIndex, n = wu.call(this), r = ar(n), i = r ? this.parseCustomProperty : this.parseValue, o = r ? gu : mu;
    let s = !1, c;
    this.skipSC(), this.eat(J);
    const l = this.tokenIndex;
    if (r || this.skipSC(), i ? c = this.parseWithFallback(bu, o) : c = o.call(this, this.tokenIndex), r && c.type === "Value" && c.children.isEmpty) {
      for (let a = l - this.tokenIndex; a <= 0; a++)
        if (this.lookupType(a) === B) {
          c.children.appendData({
            type: "WhiteSpace",
            loc: null,
            value: " "
          });
          break;
        }
    }
    return this.isDelim(Mo) && (s = Su.call(this), this.skipSC()), this.eof === !1 && this.tokenType !== ae && this.isBalanceEdge(t) === !1 && this.error(), {
      type: "Declaration",
      loc: this.getLocation(e, this.tokenStart),
      important: s,
      property: n,
      value: c
    };
  }
  function vu(e) {
    this.token(v, e.property), this.token(J, ":"), this.node(e.value), e.important && (this.token(P, "!"), this.token(v, e.important === !0 ? "important" : e.important));
  }
  function wu() {
    const e = this.tokenStart;
    if (this.tokenType === P)
      switch (this.charCodeAt(this.tokenStart)) {
        case fu:
        case hu:
        case du:
        case uu:
        case pu:
          this.next();
          break;
        case di:
          this.next(), this.isDelim(di) && this.next();
          break;
      }
    return this.tokenType === R ? this.eat(R) : this.eat(v), this.substrToCursor(e);
  }
  function Su() {
    this.eat(P), this.skipSC();
    const e = this.consume(v);
    return e === "important" ? !0 : e;
  }
  const Cu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: vu,
    name: yu,
    parse: Io,
    structure: xu,
    walkContext: ku
  }, Symbol.toStringTag, { value: "Module" })), Au = 38;
  function On(e) {
    return this.Raw(e, this.consumeUntilSemicolonIncluded, !0);
  }
  const Tu = "DeclarationList", Ou = {
    children: [[
      "Declaration",
      "Atrule",
      "Rule"
    ]]
  };
  function jo() {
    const e = this.createList();
    for (; !this.eof; )
      switch (this.tokenType) {
        case B:
        case re:
        case ae:
          this.next();
          break;
        case U:
          e.push(this.parseWithFallback(this.Atrule.bind(this, !0), On));
          break;
        default:
          this.isDelim(Au) ? e.push(this.parseWithFallback(this.Rule, On)) : e.push(this.parseWithFallback(this.Declaration, On));
      }
    return {
      type: "DeclarationList",
      loc: this.getLocationFromList(e),
      children: e
    };
  }
  function Lu(e) {
    this.children(e, (t) => {
      t.type === "Declaration" && this.token(ae, ";");
    });
  }
  const $u = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: Lu,
    name: Tu,
    parse: jo,
    structure: Ou
  }, Symbol.toStringTag, { value: "Module" })), Eu = "Dimension", _u = {
    value: String,
    unit: String
  };
  function No() {
    const e = this.tokenStart, t = this.consumeNumber(_);
    return {
      type: "Dimension",
      loc: this.getLocation(e, this.tokenStart),
      value: t,
      unit: this.substring(e + t.length, this.tokenStart)
    };
  }
  function Pu(e) {
    this.token(_, e.value + e.unit);
  }
  const zu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: Pu,
    name: Eu,
    parse: No,
    structure: _u
  }, Symbol.toStringTag, { value: "Module" })), Mu = "Function", Iu = "function", ju = {
    name: String,
    children: [[]]
  };
  function Ro(e, t) {
    const n = this.tokenStart, r = this.consumeFunctionName(), i = r.toLowerCase();
    let o;
    return o = t.hasOwnProperty(i) ? t[i].call(this, t) : e.call(this, t), this.eof || this.eat(j), {
      type: "Function",
      loc: this.getLocation(n, this.tokenStart),
      name: r,
      children: o
    };
  }
  function Nu(e) {
    this.token(z, e.name + "("), this.children(e), this.token(j, ")");
  }
  const Ru = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: Nu,
    name: Mu,
    parse: Ro,
    structure: ju,
    walkContext: Iu
  }, Symbol.toStringTag, { value: "Module" })), Du = "XXX", Fu = "Hash", Bu = {
    value: String
  };
  function Do() {
    const e = this.tokenStart;
    return this.eat(R), {
      type: "Hash",
      loc: this.getLocation(e, this.tokenStart),
      value: this.substrToCursor(e + 1)
    };
  }
  function Uu(e) {
    this.token(R, "#" + e.value);
  }
  const qu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: Uu,
    name: Fu,
    parse: Do,
    structure: Bu,
    xxx: Du
  }, Symbol.toStringTag, { value: "Module" })), Hu = "Identifier", Wu = {
    name: String
  };
  function Fo() {
    return {
      type: "Identifier",
      loc: this.getLocation(this.tokenStart, this.tokenEnd),
      name: this.consume(v)
    };
  }
  function Vu(e) {
    this.token(v, e.name);
  }
  const Gu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: Vu,
    name: Hu,
    parse: Fo,
    structure: Wu
  }, Symbol.toStringTag, { value: "Module" })), Ku = "IdSelector", Qu = {
    name: String
  };
  function Bo() {
    const e = this.tokenStart;
    return this.eat(R), {
      type: "IdSelector",
      loc: this.getLocation(e, this.tokenStart),
      name: this.substrToCursor(e + 1)
    };
  }
  function Yu(e) {
    this.token(P, "#" + e.name);
  }
  const Xu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: Yu,
    name: Ku,
    parse: Bo,
    structure: Qu
  }, Symbol.toStringTag, { value: "Module" })), Zu = "MediaFeature", Ju = {
    name: String,
    value: ["Identifier", "Number", "Dimension", "Ratio", null]
  };
  function Uo() {
    const e = this.tokenStart;
    let t, n = null;
    if (this.eat(G), this.skipSC(), t = this.consume(v), this.skipSC(), this.tokenType !== j) {
      switch (this.eat(J), this.skipSC(), this.tokenType) {
        case O:
          this.lookupNonWSType(1) === P ? n = this.Ratio() : n = this.Number();
          break;
        case _:
          n = this.Dimension();
          break;
        case v:
          n = this.Identifier();
          break;
        default:
          this.error("Number, dimension, ratio or identifier is expected");
      }
      this.skipSC();
    }
    return this.eat(j), {
      type: "MediaFeature",
      loc: this.getLocation(e, this.tokenStart),
      name: t,
      value: n
    };
  }
  function eh(e) {
    this.token(G, "("), this.token(v, e.name), e.value !== null && (this.token(J, ":"), this.node(e.value)), this.token(j, ")");
  }
  const th = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: eh,
    name: Zu,
    parse: Uo,
    structure: Ju
  }, Symbol.toStringTag, { value: "Module" })), nh = "MediaQuery", rh = {
    children: [[
      "Identifier",
      "MediaFeature",
      "WhiteSpace"
    ]]
  };
  function qo() {
    const e = this.createList();
    let t = null;
    this.skipSC();
    e:
      for (; !this.eof; ) {
        switch (this.tokenType) {
          case re:
          case B:
            this.next();
            continue;
          case v:
            t = this.Identifier();
            break;
          case G:
            t = this.MediaFeature();
            break;
          default:
            break e;
        }
        e.push(t);
      }
    return t === null && this.error("Identifier or parenthesis is expected"), {
      type: "MediaQuery",
      loc: this.getLocationFromList(e),
      children: e
    };
  }
  function ih(e) {
    this.children(e);
  }
  const oh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: ih,
    name: nh,
    parse: qo,
    structure: rh
  }, Symbol.toStringTag, { value: "Module" })), ah = "MediaQueryList", sh = {
    children: [[
      "MediaQuery"
    ]]
  };
  function Ho() {
    const e = this.createList();
    for (this.skipSC(); !this.eof && (e.push(this.MediaQuery()), this.tokenType === Oe); )
      this.next();
    return {
      type: "MediaQueryList",
      loc: this.getLocationFromList(e),
      children: e
    };
  }
  function lh(e) {
    this.children(e, () => this.token(Oe, ","));
  }
  const ch = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: lh,
    name: ah,
    parse: Ho,
    structure: sh
  }, Symbol.toStringTag, { value: "Module" })), uh = 38, hh = "NestingSelector", ph = {};
  function Wo() {
    const e = this.tokenStart;
    return this.eatDelim(uh), {
      type: "NestingSelector",
      loc: this.getLocation(e, this.tokenStart)
    };
  }
  function fh() {
    this.token(P, "&");
  }
  const dh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: fh,
    name: hh,
    parse: Wo,
    structure: ph
  }, Symbol.toStringTag, { value: "Module" })), mh = "Nth", gh = {
    nth: ["AnPlusB", "Identifier"],
    selector: ["SelectorList", null]
  };
  function Vo() {
    this.skipSC();
    const e = this.tokenStart;
    let t = e, n = null, r;
    return this.lookupValue(0, "odd") || this.lookupValue(0, "even") ? r = this.Identifier() : r = this.AnPlusB(), t = this.tokenStart, this.skipSC(), this.lookupValue(0, "of") && (this.next(), n = this.SelectorList(), t = this.tokenStart), {
      type: "Nth",
      loc: this.getLocation(e, t),
      nth: r,
      selector: n
    };
  }
  function bh(e) {
    this.node(e.nth), e.selector !== null && (this.token(v, "of"), this.node(e.selector));
  }
  const yh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: bh,
    name: mh,
    parse: Vo,
    structure: gh
  }, Symbol.toStringTag, { value: "Module" })), kh = "Number", xh = {
    value: String
  };
  function Go() {
    return {
      type: "Number",
      loc: this.getLocation(this.tokenStart, this.tokenEnd),
      value: this.consume(O)
    };
  }
  function vh(e) {
    this.token(O, e.value);
  }
  const wh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: vh,
    name: kh,
    parse: Go,
    structure: xh
  }, Symbol.toStringTag, { value: "Module" })), Sh = "Operator", Ch = {
    value: String
  };
  function Ko() {
    const e = this.tokenStart;
    return this.next(), {
      type: "Operator",
      loc: this.getLocation(e, this.tokenStart),
      value: this.substrToCursor(e)
    };
  }
  function Ah(e) {
    this.tokenize(e.value);
  }
  const Th = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: Ah,
    name: Sh,
    parse: Ko,
    structure: Ch
  }, Symbol.toStringTag, { value: "Module" })), Oh = "Parentheses", Lh = {
    children: [[]]
  };
  function Qo(e, t) {
    const n = this.tokenStart;
    let r = null;
    return this.eat(G), r = e.call(this, t), this.eof || this.eat(j), {
      type: "Parentheses",
      loc: this.getLocation(n, this.tokenStart),
      children: r
    };
  }
  function $h(e) {
    this.token(G, "("), this.children(e), this.token(j, ")");
  }
  const Eh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: $h,
    name: Oh,
    parse: Qo,
    structure: Lh
  }, Symbol.toStringTag, { value: "Module" })), _h = "Percentage", Ph = {
    value: String
  };
  function Yo() {
    return {
      type: "Percentage",
      loc: this.getLocation(this.tokenStart, this.tokenEnd),
      value: this.consumeNumber(F)
    };
  }
  function zh(e) {
    this.token(F, e.value + "%");
  }
  const Mh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: zh,
    name: _h,
    parse: Yo,
    structure: Ph
  }, Symbol.toStringTag, { value: "Module" })), Ih = "PseudoClassSelector", jh = "function", Nh = {
    name: String,
    children: [["Raw"], null]
  };
  function Xo() {
    const e = this.tokenStart;
    let t = null, n, r;
    return this.eat(J), this.tokenType === z ? (n = this.consumeFunctionName(), r = n.toLowerCase(), hasOwnProperty.call(this.pseudo, r) ? (this.skipSC(), t = this.pseudo[r].call(this), this.skipSC()) : (t = this.createList(), t.push(
      this.Raw(this.tokenIndex, null, !1)
    )), this.eat(j)) : n = this.consume(v), {
      type: "PseudoClassSelector",
      loc: this.getLocation(e, this.tokenStart),
      name: n,
      children: t
    };
  }
  function Rh(e) {
    this.token(J, ":"), e.children === null ? this.token(v, e.name) : (this.token(z, e.name + "("), this.children(e), this.token(j, ")"));
  }
  const Dh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: Rh,
    name: Ih,
    parse: Xo,
    structure: Nh,
    walkContext: jh
  }, Symbol.toStringTag, { value: "Module" })), Fh = "PseudoElementSelector", Bh = "function", Uh = {
    name: String,
    children: [["Raw"], null]
  };
  function Zo() {
    const e = this.tokenStart;
    let t = null, n, r;
    return this.eat(J), this.eat(J), this.tokenType === z ? (n = this.consumeFunctionName(), r = n.toLowerCase(), hasOwnProperty.call(this.pseudo, r) ? (this.skipSC(), t = this.pseudo[r].call(this), this.skipSC()) : (t = this.createList(), t.push(
      this.Raw(this.tokenIndex, null, !1)
    )), this.eat(j)) : n = this.consume(v), {
      type: "PseudoElementSelector",
      loc: this.getLocation(e, this.tokenStart),
      name: n,
      children: t
    };
  }
  function qh(e) {
    this.token(J, ":"), this.token(J, ":"), e.children === null ? this.token(v, e.name) : (this.token(z, e.name + "("), this.children(e), this.token(j, ")"));
  }
  const Hh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: qh,
    name: Fh,
    parse: Zo,
    structure: Uh,
    walkContext: Bh
  }, Symbol.toStringTag, { value: "Module" })), Wh = 47, Vh = 46;
  function mi() {
    this.skipSC();
    const e = this.consume(O);
    for (let t = 0; t < e.length; t++) {
      const n = e.charCodeAt(t);
      !Q(n) && n !== Vh && this.error("Unsigned number is expected", this.tokenStart - e.length + t);
    }
    return Number(e) === 0 && this.error("Zero number is not allowed", this.tokenStart - e.length), e;
  }
  const Gh = "Ratio", Kh = {
    left: String,
    right: String
  };
  function Jo() {
    const e = this.tokenStart, t = mi.call(this);
    let n;
    return this.skipSC(), this.eatDelim(Wh), n = mi.call(this), {
      type: "Ratio",
      loc: this.getLocation(e, this.tokenStart),
      left: t,
      right: n
    };
  }
  function Qh(e) {
    this.token(O, e.left), this.token(P, "/"), this.token(O, e.right);
  }
  const Yh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: Qh,
    name: Gh,
    parse: Jo,
    structure: Kh
  }, Symbol.toStringTag, { value: "Module" }));
  function Xh() {
    return this.tokenIndex > 0 && this.lookupType(-1) === B ? this.tokenIndex > 1 ? this.getTokenStart(this.tokenIndex - 1) : this.firstCharOffset : this.tokenStart;
  }
  const Zh = "Raw", Jh = {
    value: String
  };
  function ea(e, t, n) {
    const r = this.getTokenStart(e);
    let i;
    return this.skipUntilBalanced(e, t || this.consumeUntilBalanceEnd), n && this.tokenStart > r ? i = Xh.call(this) : i = this.tokenStart, {
      type: "Raw",
      loc: this.getLocation(r, i),
      value: this.substring(r, i)
    };
  }
  function ep(e) {
    this.tokenize(e.value);
  }
  const tp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: ep,
    name: Zh,
    parse: ea,
    structure: Jh
  }, Symbol.toStringTag, { value: "Module" }));
  function gi(e) {
    return this.Raw(e, this.consumeUntilLeftCurlyBracket, !0);
  }
  function np() {
    const e = this.SelectorList();
    return e.type !== "Raw" && this.eof === !1 && this.tokenType !== ee && this.error(), e;
  }
  const rp = "Rule", ip = "rule", op = {
    prelude: ["SelectorList", "Raw"],
    block: ["Block"]
  };
  function ta() {
    const e = this.tokenIndex, t = this.tokenStart;
    let n, r;
    return this.parseRulePrelude ? n = this.parseWithFallback(np, gi) : n = gi.call(this, e), r = this.Block(!0), {
      type: "Rule",
      loc: this.getLocation(t, this.tokenStart),
      prelude: n,
      block: r
    };
  }
  function ap(e) {
    this.node(e.prelude), this.node(e.block);
  }
  const sp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: ap,
    name: rp,
    parse: ta,
    structure: op,
    walkContext: ip
  }, Symbol.toStringTag, { value: "Module" })), lp = "Selector", cp = {
    children: [[
      "TypeSelector",
      "IdSelector",
      "ClassSelector",
      "AttributeSelector",
      "PseudoClassSelector",
      "PseudoElementSelector",
      "Combinator",
      "WhiteSpace"
    ]]
  };
  function na() {
    const e = this.readSequence(this.scope.Selector);
    return this.getFirstListNode(e) === null && this.error("Selector is expected"), {
      type: "Selector",
      loc: this.getLocationFromList(e),
      children: e
    };
  }
  function up(e) {
    this.children(e);
  }
  const hp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: up,
    name: lp,
    parse: na,
    structure: cp
  }, Symbol.toStringTag, { value: "Module" })), pp = "SelectorList", fp = "selector", dp = {
    children: [[
      "Selector",
      "Raw"
    ]]
  };
  function ra() {
    const e = this.createList();
    for (; !this.eof; ) {
      if (e.push(this.Selector()), this.tokenType === Oe) {
        this.next();
        continue;
      }
      break;
    }
    return {
      type: "SelectorList",
      loc: this.getLocationFromList(e),
      children: e
    };
  }
  function mp(e) {
    this.children(e, () => this.token(Oe, ","));
  }
  const gp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: mp,
    name: pp,
    parse: ra,
    structure: dp,
    walkContext: fp
  }, Symbol.toStringTag, { value: "Module" })), Wn = 92, ia = 34, oa = 39;
  function aa(e) {
    const t = e.length, n = e.charCodeAt(0), r = n === ia || n === oa ? 1 : 0, i = r === 1 && t > 1 && e.charCodeAt(t - 1) === n ? t - 2 : t - 1;
    let o = "";
    for (let s = r; s <= i; s++) {
      let c = e.charCodeAt(s);
      if (c === Wn) {
        if (s === i) {
          s !== t - 1 && (o = e.substr(s + 1));
          break;
        }
        if (c = e.charCodeAt(++s), Ce(Wn, c)) {
          const l = s - 1, a = rt(e, l);
          s = a - 1, o += Ui(e.substring(l + 1, a));
        } else
          c === 13 && e.charCodeAt(s + 1) === 10 && s++;
      } else
        o += e[s];
    }
    return o;
  }
  function bp(e, t) {
    const n = t ? "'" : '"', r = t ? oa : ia;
    let i = "", o = !1;
    for (let s = 0; s < e.length; s++) {
      const c = e.charCodeAt(s);
      if (c === 0) {
        i += "�";
        continue;
      }
      if (c <= 31 || c === 127) {
        i += "\\" + c.toString(16), o = !0;
        continue;
      }
      c === r || c === Wn ? (i += "\\" + e.charAt(s), o = !1) : (o && (je(c) || He(c)) && (i += " "), i += e.charAt(s), o = !1);
    }
    return n + i + n;
  }
  const yp = "String", kp = {
    value: String
  };
  function sa() {
    return {
      type: "String",
      loc: this.getLocation(this.tokenStart, this.tokenEnd),
      value: aa(this.consume(Te))
    };
  }
  function xp(e) {
    this.token(Te, bp(e.value));
  }
  const vp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: xp,
    name: yp,
    parse: sa,
    structure: kp
  }, Symbol.toStringTag, { value: "Module" })), wp = 33;
  function bi(e) {
    return this.Raw(e, null, !1);
  }
  const Sp = "StyleSheet", Cp = "stylesheet", Ap = {
    children: [[
      "Comment",
      "CDO",
      "CDC",
      "Atrule",
      "Rule",
      "Raw"
    ]]
  };
  function la() {
    const e = this.tokenStart, t = this.createList();
    let n;
    for (; !this.eof; ) {
      switch (this.tokenType) {
        case B:
          this.next();
          continue;
        case re:
          if (this.charCodeAt(this.tokenStart + 2) !== wp) {
            this.next();
            continue;
          }
          n = this.Comment();
          break;
        case At:
          n = this.CDO();
          break;
        case oe:
          n = this.CDC();
          break;
        case U:
          n = this.parseWithFallback(this.Atrule, bi);
          break;
        default:
          n = this.parseWithFallback(this.Rule, bi);
      }
      t.push(n);
    }
    return {
      type: "StyleSheet",
      loc: this.getLocation(e, this.tokenStart),
      children: t
    };
  }
  function Tp(e) {
    this.children(e);
  }
  const Op = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: Tp,
    name: Sp,
    parse: la,
    structure: Ap,
    walkContext: Cp
  }, Symbol.toStringTag, { value: "Module" })), Lp = 42, yi = 124;
  function Ln() {
    this.tokenType !== v && this.isDelim(Lp) === !1 && this.error("Identifier or asterisk is expected"), this.next();
  }
  const $p = "TypeSelector", Ep = {
    name: String
  };
  function ca() {
    const e = this.tokenStart;
    return this.isDelim(yi) ? (this.next(), Ln.call(this)) : (Ln.call(this), this.isDelim(yi) && (this.next(), Ln.call(this))), {
      type: "TypeSelector",
      loc: this.getLocation(e, this.tokenStart),
      name: this.substrToCursor(e)
    };
  }
  function _p(e) {
    this.tokenize(e.name);
  }
  const Pp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: _p,
    name: $p,
    parse: ca,
    structure: Ep
  }, Symbol.toStringTag, { value: "Module" })), ua = 43, ha = 45, Vn = 63;
  function ft(e, t) {
    let n = 0;
    for (let r = this.tokenStart + e; r < this.tokenEnd; r++) {
      const i = this.charCodeAt(r);
      if (i === ha && t && n !== 0)
        return ft.call(this, e + n + 1, !1), -1;
      je(i) || this.error(
        t && n !== 0 ? "Hyphen minus" + (n < 6 ? " or hex digit" : "") + " is expected" : n < 6 ? "Hex digit is expected" : "Unexpected input",
        r
      ), ++n > 6 && this.error("Too many hex digits", r);
    }
    return this.next(), n;
  }
  function Pt(e) {
    let t = 0;
    for (; this.isDelim(Vn); )
      ++t > e && this.error("Too many question marks"), this.next();
  }
  function zp(e) {
    this.charCodeAt(this.tokenStart) !== e && this.error((e === ua ? "Plus sign" : "Hyphen minus") + " is expected");
  }
  function Mp() {
    let e = 0;
    switch (this.tokenType) {
      case O:
        if (e = ft.call(this, 1, !0), this.isDelim(Vn)) {
          Pt.call(this, 6 - e);
          break;
        }
        if (this.tokenType === _ || this.tokenType === O) {
          zp.call(this, ha), ft.call(this, 1, !1);
          break;
        }
        break;
      case _:
        e = ft.call(this, 1, !0), e > 0 && Pt.call(this, 6 - e);
        break;
      default:
        if (this.eatDelim(ua), this.tokenType === v) {
          e = ft.call(this, 0, !0), e > 0 && Pt.call(this, 6 - e);
          break;
        }
        if (this.isDelim(Vn)) {
          this.next(), Pt.call(this, 5);
          break;
        }
        this.error("Hex digit or question mark is expected");
    }
  }
  const Ip = "UnicodeRange", jp = {
    value: String
  };
  function pa() {
    const e = this.tokenStart;
    return this.eatIdent("u"), Mp.call(this), {
      type: "UnicodeRange",
      loc: this.getLocation(e, this.tokenStart),
      value: this.substrToCursor(e)
    };
  }
  function Np(e) {
    this.tokenize(e.value);
  }
  const Rp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: Np,
    name: Ip,
    parse: pa,
    structure: jp
  }, Symbol.toStringTag, { value: "Module" })), Dp = 32, Gn = 92, Fp = 34, Bp = 39, Up = 40, fa = 41;
  function qp(e) {
    const t = e.length;
    let n = 4, r = e.charCodeAt(t - 1) === fa ? t - 2 : t - 1, i = "";
    for (; n < r && He(e.charCodeAt(n)); )
      n++;
    for (; n < r && He(e.charCodeAt(r)); )
      r--;
    for (let o = n; o <= r; o++) {
      let s = e.charCodeAt(o);
      if (s === Gn) {
        if (o === r) {
          o !== t - 1 && (i = e.substr(o + 1));
          break;
        }
        if (s = e.charCodeAt(++o), Ce(Gn, s)) {
          const c = o - 1, l = rt(e, c);
          o = l - 1, i += Ui(e.substring(c + 1, l));
        } else
          s === 13 && e.charCodeAt(o + 1) === 10 && o++;
      } else
        i += e[o];
    }
    return i;
  }
  function Hp(e) {
    let t = "", n = !1;
    for (let r = 0; r < e.length; r++) {
      const i = e.charCodeAt(r);
      if (i === 0) {
        t += "�";
        continue;
      }
      if (i <= 31 || i === 127) {
        t += "\\" + i.toString(16), n = !0;
        continue;
      }
      i === Dp || i === Gn || i === Fp || i === Bp || i === Up || i === fa ? (t += "\\" + e.charAt(r), n = !1) : (n && je(i) && (t += " "), t += e.charAt(r), n = !1);
    }
    return "url(" + t + ")";
  }
  const Wp = "Url", Vp = {
    value: String
  };
  function da() {
    const e = this.tokenStart;
    let t;
    switch (this.tokenType) {
      case Z:
        t = qp(this.consume(Z));
        break;
      case z:
        this.cmpStr(this.tokenStart, this.tokenEnd, "url(") || this.error("Function name must be `url`"), this.eat(z), this.skipSC(), t = aa(this.consume(Te)), this.skipSC(), this.eof || this.eat(j);
        break;
      default:
        this.error("Url or Function is expected");
    }
    return {
      type: "Url",
      loc: this.getLocation(e, this.tokenStart),
      value: t
    };
  }
  function Gp(e) {
    this.token(Z, Hp(e.value));
  }
  const Kp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: Gp,
    name: Wp,
    parse: da,
    structure: Vp
  }, Symbol.toStringTag, { value: "Module" })), Qp = "Value", Yp = {
    children: [[]]
  };
  function ma() {
    const e = this.tokenStart, t = this.readSequence(this.scope.Value);
    return {
      type: "Value",
      loc: this.getLocation(e, this.tokenStart),
      children: t
    };
  }
  function Xp(e) {
    this.children(e);
  }
  const Zp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: Xp,
    name: Qp,
    parse: ma,
    structure: Yp
  }, Symbol.toStringTag, { value: "Module" })), Jp = Object.freeze({
    type: "WhiteSpace",
    loc: null,
    value: " "
  }), ef = "WhiteSpace", tf = {
    value: String
  };
  function ga() {
    return this.eat(B), Jp;
  }
  function nf(e) {
    this.token(B, e.value);
  }
  const rf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    generate: nf,
    name: ef,
    parse: ga,
    structure: tf
  }, Symbol.toStringTag, { value: "Module" })), ba = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    AnPlusB: ac,
    Atrule: pc,
    AtrulePrelude: bc,
    AttributeSelector: Tc,
    Block: zc,
    Brackets: Nc,
    CDC: Bc,
    CDO: Wc,
    ClassSelector: Yc,
    Combinator: ru,
    Comment: cu,
    Declaration: Cu,
    DeclarationList: $u,
    Dimension: zu,
    Function: Ru,
    Hash: qu,
    IdSelector: Xu,
    Identifier: Gu,
    MediaFeature: th,
    MediaQuery: oh,
    MediaQueryList: ch,
    NestingSelector: dh,
    Nth: yh,
    Number: wh,
    Operator: Th,
    Parentheses: Eh,
    Percentage: Mh,
    PseudoClassSelector: Dh,
    PseudoElementSelector: Hh,
    Ratio: Yh,
    Raw: tp,
    Rule: sp,
    Selector: hp,
    SelectorList: gp,
    String: vp,
    StyleSheet: Op,
    TypeSelector: Pp,
    UnicodeRange: Rp,
    Url: Kp,
    Value: Zp,
    WhiteSpace: rf
  }, Symbol.toStringTag, { value: "Module" })), of = ne($({
    generic: !0
  }, tc), {
    node: ba
  }), af = 35, sf = 42, ki = 43, lf = 45, cf = 47, uf = 117;
  function ya(e) {
    switch (this.tokenType) {
      case R:
        return this.Hash();
      case Oe:
        return this.Operator();
      case G:
        return this.Parentheses(this.readSequence, e.recognizer);
      case ce:
        return this.Brackets(this.readSequence, e.recognizer);
      case Te:
        return this.String();
      case _:
        return this.Dimension();
      case F:
        return this.Percentage();
      case O:
        return this.Number();
      case z:
        return this.cmpStr(this.tokenStart, this.tokenEnd, "url(") ? this.Url() : this.Function(this.readSequence, e.recognizer);
      case Z:
        return this.Url();
      case v:
        return this.cmpChar(this.tokenStart, uf) && this.cmpChar(this.tokenStart + 1, ki) ? this.UnicodeRange() : this.Identifier();
      case P: {
        const t = this.charCodeAt(this.tokenStart);
        if (t === cf || t === sf || t === ki || t === lf)
          return this.Operator();
        t === af && this.error("Hex or identifier is expected", this.tokenStart + 1);
        break;
      }
    }
  }
  const hf = {
    getNode: ya
  }, pf = 35, ff = 38, df = 42, mf = 43, gf = 47, xi = 46, bf = 62, yf = 124, kf = 126;
  function xf(e, t) {
    t.last !== null && t.last.type !== "Combinator" && e !== null && e.type !== "Combinator" && t.push({
      // FIXME: this.Combinator() should be used instead
      type: "Combinator",
      loc: null,
      name: " "
    });
  }
  function vf() {
    switch (this.tokenType) {
      case ce:
        return this.AttributeSelector();
      case R:
        return this.IdSelector();
      case J:
        return this.lookupType(1) === J ? this.PseudoElementSelector() : this.PseudoClassSelector();
      case v:
        return this.TypeSelector();
      case O:
      case F:
        return this.Percentage();
      case _:
        this.charCodeAt(this.tokenStart) === xi && this.error("Identifier is expected", this.tokenStart + 1);
        break;
      case P: {
        switch (this.charCodeAt(this.tokenStart)) {
          case mf:
          case bf:
          case kf:
          case gf:
            return this.Combinator();
          case xi:
            return this.ClassSelector();
          case df:
          case yf:
            return this.TypeSelector();
          case pf:
            return this.IdSelector();
          case ff:
            return this.NestingSelector();
        }
        break;
      }
    }
  }
  const wf = {
    onWhiteSpace: xf,
    getNode: vf
  };
  function Sf() {
    return this.createSingleNodeList(
      this.Raw(this.tokenIndex, null, !1)
    );
  }
  function Cf() {
    const e = this.createList();
    if (this.skipSC(), e.push(this.Identifier()), this.skipSC(), this.tokenType === Oe) {
      e.push(this.Operator());
      const t = this.tokenIndex, n = this.parseCustomProperty ? this.Value(null) : this.Raw(this.tokenIndex, this.consumeUntilExclamationMarkOrSemicolon, !1);
      if (n.type === "Value" && n.children.isEmpty) {
        for (let r = t - this.tokenIndex; r <= 0; r++)
          if (this.lookupType(r) === B) {
            n.children.appendData({
              type: "WhiteSpace",
              loc: null,
              value: " "
            });
            break;
          }
      }
      e.push(n);
    }
    return e;
  }
  function vi(e) {
    return e !== null && e.type === "Operator" && (e.value[e.value.length - 1] === "-" || e.value[e.value.length - 1] === "+");
  }
  const Af = {
    getNode: ya,
    onWhiteSpace(e, t) {
      vi(e) && (e.value = " " + e.value), vi(t.last) && (t.last.value += " ");
    },
    expression: Sf,
    var: Cf
  }, Tf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    AtrulePrelude: hf,
    Selector: wf,
    Value: Af
  }, Symbol.toStringTag, { value: "Module" })), Of = {
    parse: {
      prelude: null,
      block() {
        return this.Block(!0);
      }
    }
  }, Lf = {
    parse: {
      prelude() {
        const e = this.createList();
        switch (this.skipSC(), this.tokenType) {
          case Te:
            e.push(this.String());
            break;
          case Z:
          case z:
            e.push(this.Url());
            break;
          default:
            this.error("String or url() is expected");
        }
        return (this.lookupNonWSType(0) === v || this.lookupNonWSType(0) === G) && e.push(this.MediaQueryList()), e;
      },
      block: null
    }
  }, $f = {
    parse: {
      prelude() {
        return this.createSingleNodeList(
          this.MediaQueryList()
        );
      },
      block(e = !1) {
        return this.Block(e);
      }
    }
  }, Ef = {
    parse: {
      prelude() {
        return this.createSingleNodeList(
          this.SelectorList()
        );
      },
      block() {
        return this.Block(!0);
      }
    }
  }, _f = {
    parse: {
      prelude() {
        return this.createSingleNodeList(
          this.SelectorList()
        );
      },
      block() {
        return this.Block(!0);
      }
    }
  };
  function Pf() {
    return this.createSingleNodeList(
      this.Raw(this.tokenIndex, null, !1)
    );
  }
  function zf() {
    return this.skipSC(), this.tokenType === v && this.lookupNonWSType(1) === J ? this.createSingleNodeList(
      this.Declaration()
    ) : ka.call(this);
  }
  function ka() {
    const e = this.createList();
    let t;
    this.skipSC();
    e:
      for (; !this.eof; ) {
        switch (this.tokenType) {
          case re:
          case B:
            this.next();
            continue;
          case z:
            t = this.Function(Pf, this.scope.AtrulePrelude);
            break;
          case v:
            t = this.Identifier();
            break;
          case G:
            t = this.Parentheses(zf, this.scope.AtrulePrelude);
            break;
          default:
            break e;
        }
        e.push(t);
      }
    return e;
  }
  const Mf = {
    parse: {
      prelude() {
        const e = ka.call(this);
        return this.getFirstListNode(e) === null && this.error("Condition is expected"), e;
      },
      block(e = !1) {
        return this.Block(e);
      }
    }
  }, If = {
    "font-face": Of,
    import: Lf,
    media: $f,
    nest: Ef,
    page: _f,
    supports: Mf
  }, Ne = {
    parse() {
      return this.createSingleNodeList(
        this.SelectorList()
      );
    }
  }, $n = {
    parse() {
      return this.createSingleNodeList(
        this.Selector()
      );
    }
  }, wi = {
    parse() {
      return this.createSingleNodeList(
        this.Identifier()
      );
    }
  }, zt = {
    parse() {
      return this.createSingleNodeList(
        this.Nth()
      );
    }
  }, jf = {
    dir: wi,
    has: Ne,
    lang: wi,
    matches: Ne,
    is: Ne,
    "-moz-any": Ne,
    "-webkit-any": Ne,
    where: Ne,
    not: Ne,
    "nth-child": zt,
    "nth-last-child": zt,
    "nth-last-of-type": zt,
    "nth-of-type": zt,
    slotted: $n,
    host: $n,
    "host-context": $n
  }, Nf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    AnPlusB: vo,
    Atrule: wo,
    AtrulePrelude: So,
    AttributeSelector: Ao,
    Block: Oo,
    Brackets: Lo,
    CDC: $o,
    CDO: Eo,
    ClassSelector: _o,
    Combinator: Po,
    Comment: zo,
    Declaration: Io,
    DeclarationList: jo,
    Dimension: No,
    Function: Ro,
    Hash: Do,
    IdSelector: Bo,
    Identifier: Fo,
    MediaFeature: Uo,
    MediaQuery: qo,
    MediaQueryList: Ho,
    NestingSelector: Wo,
    Nth: Vo,
    Number: Go,
    Operator: Ko,
    Parentheses: Qo,
    Percentage: Yo,
    PseudoClassSelector: Xo,
    PseudoElementSelector: Zo,
    Ratio: Jo,
    Raw: ea,
    Rule: ta,
    Selector: na,
    SelectorList: ra,
    String: sa,
    StyleSheet: la,
    TypeSelector: ca,
    UnicodeRange: pa,
    Url: da,
    Value: ma,
    WhiteSpace: ga
  }, Symbol.toStringTag, { value: "Module" })), Rf = {
    parseContext: {
      default: "StyleSheet",
      stylesheet: "StyleSheet",
      atrule: "Atrule",
      atrulePrelude(e) {
        return this.AtrulePrelude(e.atrule ? String(e.atrule) : null);
      },
      mediaQueryList: "MediaQueryList",
      mediaQuery: "MediaQuery",
      rule: "Rule",
      selectorList: "SelectorList",
      selector: "Selector",
      block() {
        return this.Block(!0);
      },
      declarationList: "DeclarationList",
      declaration: "Declaration",
      value: "Value"
    },
    scope: Tf,
    atrule: If,
    pseudo: jf,
    node: Nf
  }, Df = {
    node: ba
  }, Ff = ec($($($({}, of), Rf), Df)), {
    tokenize: Sd,
    parse: Bf,
    generate: we,
    lexer: Cd,
    createLexer: Ad,
    walk: Xe,
    find: Td,
    findLast: Od,
    findAll: Ld,
    toPlainObject: $d,
    fromPlainObject: Ed,
    fork: _d
  } = Ff;
  function xa(e, t, n) {
    return at(e, t) === n;
  }
  function Uf(e, t) {
    return !e || e === t ? !1 : va(e) ? e.document.contains(t) : e.contains(t);
  }
  function va(e) {
    return !!(e && e === e.window);
  }
  function qf(e) {
    return xa(e, "position", "fixed");
  }
  function Kn(e) {
    return !!(e && (qf(e) || xa(e, "position", "absolute")));
  }
  function En(e) {
    const t = document.querySelectorAll("dialog, [popover]");
    return !!Array.from(t).includes(e);
  }
  function Hf(e, t) {
    return W(this, null, function* () {
      var i, o, s;
      if (En(e) && En(t))
        return !0;
      const n = yield (i = D.getOffsetParent) == null ? void 0 : i.call(D, e), r = yield (o = D.getOffsetParent) == null ? void 0 : o.call(D, t);
      if (Kn(e)) {
        if (En(t))
          return !0;
        if (n === r)
          return !1;
      }
      if (n !== r) {
        let c;
        const l = [];
        for (c = n; c && c !== r && c !== window; )
          l.push(c), c = yield (s = D.getOffsetParent) == null ? void 0 : s.call(D, c);
        const a = l[l.length - 1];
        if (a && a instanceof HTMLElement && Kn(a))
          return !1;
      }
      return !!(Uf(r, e) || va(r));
    });
  }
  function Si(e, t) {
    return W(this, null, function* () {
      if (!(e instanceof HTMLElement && t.length && Kn(e)))
        return null;
      const n = document.querySelectorAll(
        t.join(", ")
      );
      for (const r of n)
        if (yield Hf(r, e))
          return r;
      return null;
    });
  }
  const Wf = [
    "left",
    "right",
    "top",
    "bottom",
    "inset-block-start",
    "inset-block-end",
    "inset-inline-start",
    "inset-inline-end",
    "inset-block",
    "inset-inline",
    "inset"
  ], Vf = [
    "width",
    "height",
    "min-width",
    "min-height",
    "max-width",
    "max-height"
  ], Gf = [
    "justify-content",
    "align-content",
    "justify-self",
    "align-self",
    "justify-items",
    "align-items"
  ], Kf = [
    "top",
    "left",
    "right",
    "bottom",
    "start",
    "end",
    "self-start",
    "self-end",
    "center"
  ], Qf = [
    "width",
    "height",
    "block",
    "inline",
    "self-block",
    "self-inline"
  ];
  function Yf(e) {
    return e.type === "Declaration";
  }
  function Xf(e) {
    return e.type === "Declaration" && e.property === "anchor-name";
  }
  function wa(e) {
    return !!(e && e.type === "Function" && e.name === "anchor");
  }
  function Sa(e) {
    return !!(e && e.type === "Function" && e.name === "anchor-size");
  }
  function Ft(e) {
    return !!(e && e.type === "Function" && e.name === "var");
  }
  function Zf(e) {
    return e.type === "Declaration" && e.property === "position-fallback";
  }
  function Jf(e) {
    return e.type === "Atrule" && e.name === "position-fallback";
  }
  function ed(e) {
    return e.type === "Atrule" && e.name === "try";
  }
  function _n(e) {
    return !!(e.type === "Identifier" && e.name);
  }
  function td(e) {
    return !!(e.type === "Percentage" && e.value);
  }
  function Ct(e) {
    return Wf.includes(e);
  }
  function nd(e) {
    return Kf.includes(e);
  }
  function cn(e) {
    return Vf.includes(e);
  }
  function rd(e) {
    return Qf.includes(e);
  }
  function id(e) {
    return Gf.includes(e);
  }
  function Ci(e, t) {
    let n, r, i, o = "", s = !1, c;
    const l = [];
    e.children.toArray().forEach((d) => {
      if (s) {
        o = `${o}${we(d)}`;
        return;
      }
      if (d.type === "Operator" && d.value === ",") {
        s = !0;
        return;
      }
      l.push(d);
    });
    let [a, u] = l;
    if (u || (u = a, a = void 0), a && (_n(a) ? a.name === "implicit" ? a = void 0 : a.name.startsWith("--") && (n = a.name) : Ft(a) && a.children.first && (c = a.children.first.name)), u)
      if (wa(e)) {
        if (_n(u) && nd(u.name))
          r = u.name;
        else if (td(u)) {
          const d = Number(u.value);
          r = Number.isNaN(d) ? void 0 : d;
        }
      } else
        Sa(e) && _n(u) && rd(u.name) && (i = u.name);
    const h = `--anchor-${Fe(12)}`;
    return t && (Object.assign(e, {
      type: "Raw",
      value: `var(${h})`,
      children: null
    }), Reflect.deleteProperty(e, "name")), {
      anchorName: n,
      anchorSide: r,
      anchorSize: i,
      fallbackValue: o || "0px",
      customPropName: c,
      uuid: h
    };
  }
  function od(e, t) {
    return Xf(e) && e.value.children.first && (t != null && t.value) ? { name: e.value.children.first.name, selector: t.value } : {};
  }
  let yt = {}, Be = {}, kt = {}, De = {};
  function ad() {
    yt = {}, Be = {}, kt = {}, De = {};
  }
  function sd(e, t) {
    var n;
    if ((wa(e) || Sa(e)) && t) {
      if (t.property.startsWith("--")) {
        const r = we(t.value), i = Ci(e, !0);
        return kt[i.uuid] = r, Be[t.property] = [
          ...(n = Be[t.property]) != null ? n : [],
          i
        ], { changed: !0 };
      }
      if (Ct(t.property) || cn(t.property)) {
        const r = Ci(e, !0);
        return { prop: t.property, data: r, changed: !0 };
      }
    }
    return {};
  }
  function ld(e, t) {
    return Zf(e) && e.value.children.first && (t != null && t.value) ? { name: e.value.children.first.name, selector: t.value } : {};
  }
  function cd(e) {
    var t, n;
    if (Jf(e) && ((t = e.prelude) != null && t.value) && ((n = e.block) != null && n.children)) {
      const r = e.prelude.value, i = [];
      return e.block.children.filter(ed).forEach((s) => {
        var c;
        if ((c = s.block) != null && c.children) {
          const l = s.block.children.filter(
            (u) => Yf(u) && (Ct(u.property) || cn(u.property) || id(u.property))
          ), a = {
            uuid: `${r}-try-${Fe(12)}`,
            declarations: Object.fromEntries(
              l.map((u) => [u.property, we(u.value)])
            )
          };
          i.push(a);
        }
      }), { name: r, blocks: i };
    }
    return {};
  }
  function at(e, t) {
    return getComputedStyle(e).getPropertyValue(t).trim();
  }
  function ud(e, t) {
    return W(this, null, function* () {
      var o;
      let n = t.anchorName;
      const r = t.customPropName;
      if (e && !n) {
        const s = e.getAttribute("anchor");
        if (r)
          n = at(e, r);
        else if (s)
          return yield Si(e, [`#${s}`]);
      }
      const i = n ? (o = yt[n]) != null ? o : [] : [];
      return yield Si(e, i);
    });
  }
  function Ze(e) {
    return Bf(e, {
      parseAtrulePrelude: !1,
      parseRulePrelude: !1,
      parseCustomProperty: !0
    });
  }
  function hd(e) {
    return W(this, null, function* () {
      var a, u, h, d, m, w;
      const t = {}, n = {}, r = {}, i = {};
      ad();
      for (const k of e) {
        const C = Ze(k.css);
        Xe(C, {
          visit: "Atrule",
          enter(b) {
            const { name: S, blocks: A } = cd(b);
            S && (A != null && A.length) && (r[S] = {
              targets: [],
              blocks: A
            });
          }
        });
      }
      for (const k of e) {
        let C = !1;
        const b = Ze(k.css);
        Xe(b, {
          visit: "Declaration",
          enter(S) {
            var E, L;
            const A = (E = this.rule) == null ? void 0 : E.prelude, { name: y, selector: T } = ld(S, A);
            if (y && T && r[y]) {
              i[T] = { fallbacks: r[y].blocks }, r[y].targets.includes(T) || r[y].targets.push(T);
              for (const p of r[y].blocks) {
                const f = `[data-anchor-polyfill="${p.uuid}"]`;
                (L = this.stylesheet) == null || L.children.prependData({
                  type: "Rule",
                  prelude: {
                    type: "Raw",
                    value: f
                  },
                  block: {
                    type: "Block",
                    children: new V().fromArray(
                      Object.entries(p.declarations).map(([x, g]) => ({
                        type: "Declaration",
                        important: !0,
                        property: x,
                        value: {
                          type: "Raw",
                          value: g
                        }
                      }))
                    )
                  }
                }), n[f] = T;
              }
              C = !0;
            }
          }
        }), C && (k.css = we(b), k.changed = !0);
      }
      for (const k of e) {
        let C = !1;
        const b = Ze(k.css);
        Xe(b, function(S) {
          var f, x, g;
          const A = (f = this.rule) == null ? void 0 : f.prelude, { name: y, selector: T } = od(
            S,
            A
          );
          y && T && (yt[y] ? yt[y].push(T) : yt[y] = [T]);
          const {
            prop: E,
            data: L,
            changed: p
          } = sd(S, this.declaration);
          E && L && (A != null && A.value) && (t[A.value] = ne($({}, t[A.value]), {
            [E]: [...(g = (x = t[A.value]) == null ? void 0 : x[E]) != null ? g : [], L]
          })), p && (C = !0);
        }), C && (k.css = we(b), k.changed = !0);
      }
      const o = new Set(Object.keys(Be)), s = {}, c = (k) => {
        var S, A, y, T, E;
        const C = [], b = new Set((A = (S = s[k]) == null ? void 0 : S.names) != null ? A : []);
        for (; b.size > 0; )
          for (const L of b)
            C.push(...(y = Be[L]) != null ? y : []), b.delete(L), (E = (T = s[L]) == null ? void 0 : T.names) != null && E.length && s[L].names.forEach((p) => b.add(p));
        return C;
      };
      for (; o.size > 0; ) {
        const k = [];
        for (const C of e) {
          let b = !1;
          const S = Ze(C.css);
          Xe(S, {
            visit: "Function",
            enter(A) {
              var L, p;
              const y = (L = this.rule) == null ? void 0 : L.prelude, T = this.declaration, E = T == null ? void 0 : T.property;
              if (y != null && y.value && Ft(A) && T && E && A.children.first && o.has(
                A.children.first.name
              ) && // For now, we only want assignments to other CSS custom properties
              E.startsWith("--")) {
                const f = A.children.first, x = (p = Be[f.name]) != null ? p : [], g = c(f.name);
                if (!(x.length || g.length))
                  return;
                const Y = `${f.name}-anchor-${Fe(12)}`, H = we(T.value);
                kt[Y] = H, s[E] || (s[E] = { names: [], uuids: [] });
                const me = s[E];
                me.names.includes(f.name) || me.names.push(f.name), me.uuids.push(Y), k.push(E), f.name = Y, b = !0;
              }
            }
          }), b && (C.css = we(S), C.changed = !0);
        }
        o.clear(), k.forEach((C) => o.add(C));
      }
      for (const k of e) {
        let C = !1;
        const b = Ze(k.css);
        Xe(b, {
          visit: "Function",
          enter(S) {
            var E, L, p, f, x, g, Y;
            const A = (E = this.rule) == null ? void 0 : E.prelude, y = this.declaration, T = y == null ? void 0 : y.property;
            if (A != null && A.value && Ft(S) && y && T && S.children.first && // Now we only want assignments to inset/sizing properties
            (Ct(T) || cn(T))) {
              const H = S.children.first, me = (L = Be[H.name]) != null ? L : [], K = c(H.name);
              if (!(me.length || K.length))
                return;
              const Le = `${T}-${Fe(12)}`;
              if (K.length) {
                const ue = /* @__PURE__ */ new Set([H.name]);
                for (; ue.size > 0; )
                  for (const We of ue) {
                    const te = s[We];
                    if ((p = te == null ? void 0 : te.names) != null && p.length && ((f = te == null ? void 0 : te.uuids) != null && f.length))
                      for (const Ve of te.names)
                        for (const br of te.uuids)
                          De[br] = ne($({}, De[br]), {
                            // - `key` (`propUuid`) is the property-specific
                            //   uuid to append to the new custom property name
                            // - `value` is the new property-specific custom
                            //   property value to use
                            [Le]: `${Ve}-${Le}`
                          });
                    ue.delete(We), (x = te == null ? void 0 : te.names) != null && x.length && te.names.forEach((Ve) => ue.add(Ve));
                  }
              }
              for (const ue of [...me, ...K]) {
                const We = $({}, ue), te = `--anchor-${Fe(12)}-${T}`, Ve = We.uuid;
                We.uuid = te, t[A.value] = ne($({}, t[A.value]), {
                  [T]: [...(Y = (g = t[A.value]) == null ? void 0 : g[T]) != null ? Y : [], We]
                }), De[Ve] = ne($({}, De[Ve]), {
                  // - `key` (`propUuid`) is the property-specific
                  //   uuid to append to the new custom property name
                  // - `value` is the new property-specific custom
                  //   property value to use
                  [Le]: te
                });
              }
              H.name = `${H.name}-${Le}`, C = !0;
            }
          }
        }), C && (k.css = we(b), k.changed = !0);
      }
      if (Object.keys(De).length > 0)
        for (const k of e) {
          let C = !1;
          const b = Ze(k.css);
          Xe(b, {
            visit: "Function",
            enter(S) {
              var A, y, T, E;
              if (Ft(S) && ((y = (A = S.children.first) == null ? void 0 : A.name) != null && y.startsWith(
                "--"
              )) && ((E = (T = this.declaration) == null ? void 0 : T.property) != null && E.startsWith("--")) && this.block) {
                const L = S.children.first, p = De[L.name];
                if (p)
                  for (const [f, x] of Object.entries(p))
                    this.block.children.appendData({
                      type: "Declaration",
                      important: !1,
                      property: `${this.declaration.property}-${f}`,
                      value: {
                        type: "Raw",
                        value: we(this.declaration.value).replace(`var(${L.name})`, `var(${x})`)
                      }
                    }), C = !0;
                kt[L.name] && (this.declaration.value = {
                  type: "Raw",
                  value: kt[L.name]
                }, C = !0);
              }
            }
          }), C && (k.css = we(b), k.changed = !0);
        }
      const l = /* @__PURE__ */ new Map();
      for (const [k, C] of Object.entries(t)) {
        let b;
        k.startsWith("[data-anchor-polyfill=") && n[k] ? b = document.querySelectorAll(n[k]) : b = document.querySelectorAll(k);
        for (const [S, A] of Object.entries(C))
          for (const y of A)
            for (const T of b) {
              const E = yield ud(T, y), L = `--anchor-${Fe(12)}`;
              l.set(T, ne($({}, (a = l.get(T)) != null ? a : {}), {
                [y.uuid]: L
              })), T.setAttribute(
                "style",
                `${y.uuid}: var(${L}); ${(u = T.getAttribute("style")) != null ? u : ""}`
              ), i[k] = ne($({}, i[k]), {
                declarations: ne($({}, (h = i[k]) == null ? void 0 : h.declarations), {
                  [S]: [
                    ...(w = (m = (d = i[k]) == null ? void 0 : d.declarations) == null ? void 0 : m[S]) != null ? w : [],
                    ne($({}, y), { anchorEl: E, targetEl: T, uuid: L })
                  ]
                })
              });
            }
      }
      return { rules: i, inlineStyles: l };
    });
  }
  function pd(e, t) {
    return W(this, null, function* () {
      for (const { el: n, css: r, changed: i } of e) {
        if (i) {
          if (n.tagName.toLowerCase() === "style")
            n.innerHTML = r;
          else if (n.tagName.toLowerCase() === "link") {
            const o = new Blob([r], { type: "text/css" }), s = URL.createObjectURL(o), c = document.createElement("link");
            c.rel = "stylesheet", c.href = s;
            const l = new Promise((a) => {
              c.onload = a;
            });
            n.replaceWith(c), yield l, URL.revokeObjectURL(s);
          } else if (n.hasAttribute("data-has-inline-styles")) {
            const o = n.getAttribute("data-has-inline-styles");
            if (o) {
              const s = `[data-has-inline-styles="${o}"]{`, c = "}";
              let l = r.slice(s.length, 0 - c.length);
              const a = t == null ? void 0 : t.get(n);
              if (a)
                for (const [u, h] of Object.entries(a))
                  l = `${u}: var(${h}); ${l}`;
              n.setAttribute("style", l);
            }
          }
        }
        n.hasAttribute("data-has-inline-styles") && n.removeAttribute("data-has-inline-styles");
      }
    });
  }
  const fd = ne($({}, D), { _c: /* @__PURE__ */ new Map() }), Ca = (e) => W(gr, null, function* () {
    var n, r, i;
    let t = yield (n = D.getOffsetParent) == null ? void 0 : n.call(D, e);
    return (yield (r = D.isElement) == null ? void 0 : r.call(D, t)) || (t = (yield (i = D.getDocumentElement) == null ? void 0 : i.call(D, e)) || window.document.documentElement), t;
  }), dd = (e, t) => {
    let n;
    switch (e) {
      case "start":
      case "self-start":
        n = 0;
        break;
      case "end":
      case "self-end":
        n = 100;
        break;
      default:
        typeof e == "number" && !Number.isNaN(e) && (n = e);
    }
    if (n !== void 0)
      return t ? 100 - n : n;
  }, md = (e, t) => {
    let n;
    switch (e) {
      case "block":
      case "self-block":
        n = t ? "width" : "height";
        break;
      case "inline":
      case "self-inline":
        n = t ? "height" : "width";
        break;
    }
    return n;
  }, Ai = (e) => {
    switch (e) {
      case "top":
      case "bottom":
        return "y";
      case "left":
      case "right":
        return "x";
    }
    return null;
  }, gd = (e) => {
    switch (e) {
      case "x":
        return "width";
      case "y":
        return "height";
    }
    return null;
  }, Ti = (e) => at(e, "display") === "inline", Oi = (e, t) => (t === "x" ? ["border-left-width", "border-right-width"] : ["border-top-width", "border-bottom-width"]).reduce(
    (r, i) => r + parseInt(at(e, i), 10),
    0
  ) || 0, Mt = (e, t) => parseInt(at(e, `margin-${t}`), 10) || 0, bd = (e) => ({
    top: Mt(e, "top"),
    right: Mt(e, "right"),
    bottom: Mt(e, "bottom"),
    left: Mt(e, "left")
  }), Li = (s) => W(gr, [s], function* ({
    targetEl: e,
    targetProperty: t,
    anchorRect: n,
    anchorSide: r,
    anchorSize: i,
    fallback: o
  }) {
    var c;
    if (!((i || r !== void 0) && e && n))
      return o;
    if (i) {
      if (!cn(t))
        return o;
      let l;
      switch (i) {
        case "width":
        case "height":
          l = i;
          break;
        default: {
          let a = !1;
          const u = at(e, "writing-mode");
          a = u.startsWith("vertical-") || u.startsWith("sideways-"), l = md(i, a);
        }
      }
      return l ? `${n[l]}px` : o;
    }
    if (r !== void 0) {
      let l, a;
      const u = Ai(t);
      if (!(Ct(t) && u && (!Ct(r) || u === Ai(r))))
        return o;
      switch (r) {
        case "left":
          l = 0;
          break;
        case "right":
          l = 100;
          break;
        case "top":
          l = 0;
          break;
        case "bottom":
          l = 100;
          break;
        case "center":
          l = 50;
          break;
        default:
          if (e) {
            const m = (yield (c = D.isRTL) == null ? void 0 : c.call(D, e)) || !1;
            l = dd(r, m);
          }
      }
      const h = typeof l == "number" && !Number.isNaN(l), d = gd(u);
      if (h && d) {
        (t === "bottom" || t === "right") && (a = yield Ca(e));
        let m = n[u] + n[d] * (l / 100);
        switch (t) {
          case "bottom": {
            if (!a)
              break;
            let w = a.clientHeight;
            if (w === 0 && Ti(a)) {
              const k = Oi(a, u);
              w = a.offsetHeight - k;
            }
            m = w - m;
            break;
          }
          case "right": {
            if (!a)
              break;
            let w = a.clientWidth;
            if (w === 0 && Ti(a)) {
              const k = Oi(a, u);
              w = a.offsetWidth - k;
            }
            m = w - m;
            break;
          }
        }
        return `${m}px`;
      }
    }
    return o;
  });
  function yd(e, t = !1) {
    return W(this, null, function* () {
      const n = document.documentElement;
      for (const [r, i] of Object.entries(e))
        for (const o of i) {
          const s = o.anchorEl, c = o.targetEl;
          if (s && c)
            Ni(
              s,
              c,
              () => W(this, null, function* () {
                const l = yield D.getElementRects({
                  reference: s,
                  floating: c,
                  strategy: "absolute"
                }), a = yield Li({
                  targetEl: c,
                  targetProperty: r,
                  anchorRect: l.reference,
                  anchorSide: o.anchorSide,
                  anchorSize: o.anchorSize,
                  fallback: o.fallbackValue
                });
                n.style.setProperty(o.uuid, a);
              }),
              { animationFrame: t }
            );
          else {
            const l = yield Li({
              targetProperty: r,
              anchorSide: o.anchorSide,
              anchorSize: o.anchorSize,
              fallback: o.fallbackValue
            });
            n.style.setProperty(o.uuid, l);
          }
        }
    });
  }
  function kd(e, t, n = !1) {
    return W(this, null, function* () {
      if (!t.length)
        return;
      const r = document.querySelectorAll(e);
      for (const i of r) {
        let o = !1;
        const s = yield Ca(i);
        Ni(
          i,
          i,
          () => W(this, null, function* () {
            if (!o) {
              o = !0;
              for (const [c, { uuid: l }] of t.entries()) {
                if (i.setAttribute("data-anchor-polyfill", l), c === t.length - 1) {
                  o = !1;
                  break;
                }
                const a = yield D.getElementRects({
                  reference: i,
                  floating: i,
                  strategy: "absolute"
                }), u = yield Pa(
                  {
                    x: i.offsetLeft,
                    y: i.offsetTop,
                    platform: fd,
                    rects: a,
                    elements: { floating: i },
                    strategy: "absolute"
                  },
                  {
                    boundary: s,
                    rootBoundary: "document",
                    padding: bd(i)
                  }
                );
                if (Object.values(u).every((h) => h <= 0)) {
                  o = !1;
                  break;
                }
              }
            }
          }),
          { animationFrame: n }
        );
      }
    });
  }
  function xd(e, t = !1) {
    return W(this, null, function* () {
      var n, r;
      for (const i of Object.values(e))
        yield yd((n = i.declarations) != null ? n : {}, t);
      for (const [i, o] of Object.entries(e))
        yield kd(
          i,
          (r = o.fallbacks) != null ? r : [],
          t
        );
    });
  }
  function $i(e) {
    return W(this, null, function* () {
      const t = e === void 0 ? !!window.UPDATE_ANCHOR_ON_ANIMATION_FRAME : e, n = yield Ba(), { rules: r, inlineStyles: i } = yield hd(n);
      return Object.values(r).length && (yield pd(n, i), yield xd(r, t)), r;
    });
  }
  document.readyState !== "complete" ? window.addEventListener("load", () => {
    $i();
  }) : $i();
});
export default vd();
//# sourceMappingURL=css-anchor-positioning.js.map
