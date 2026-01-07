var ql = Object.defineProperty;
var Jl = (e, t, n) => t in e ? ql(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var ke = (e, t, n) => Jl(e, typeof t != "symbol" ? t + "" : t, n);
/**
* @vue/shared v3.5.25
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
// @__NO_SIDE_EFFECTS__
function Qs(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const ge = {}, Qt = [], pt = () => {
}, yi = () => !1, us = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), eo = (e) => e.startsWith("onUpdate:"), Ee = Object.assign, to = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, Yl = Object.prototype.hasOwnProperty, fe = (e, t) => Yl.call(e, t), J = Array.isArray, en = (e) => ds(e) === "[object Map]", _i = (e) => ds(e) === "[object Set]", Q = (e) => typeof e == "function", be = (e) => typeof e == "string", kt = (e) => typeof e == "symbol", ye = (e) => e !== null && typeof e == "object", bi = (e) => (ye(e) || Q(e)) && Q(e.then) && Q(e.catch), Ci = Object.prototype.toString, ds = (e) => Ci.call(e), Zl = (e) => ds(e).slice(8, -1), Si = (e) => ds(e) === "[object Object]", no = (e) => be(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Cn = /* @__PURE__ */ Qs(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), fs = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return ((n) => t[n] || (t[n] = e(n)));
}, Xl = /-\w/g, Pt = fs(
  (e) => e.replace(Xl, (t) => t.slice(1).toUpperCase())
), Ql = /\B([A-Z])/g, qt = fs(
  (e) => e.replace(Ql, "-$1").toLowerCase()
), xi = fs((e) => e.charAt(0).toUpperCase() + e.slice(1)), xs = fs(
  (e) => e ? `on${xi(e)}` : ""
), Nt = (e, t) => !Object.is(e, t), qn = (e, ...t) => {
  for (let n = 0; n < e.length; n++)
    e[n](...t);
}, Ti = (e, t, n, s = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: s,
    value: n
  });
}, so = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
}, er = (e) => {
  const t = be(e) ? Number(e) : NaN;
  return isNaN(t) ? e : t;
};
let To;
const ps = () => To || (To = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function tt(e) {
  if (J(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const s = e[n], o = be(s) ? or(s) : tt(s);
      if (o)
        for (const i in o)
          t[i] = o[i];
    }
    return t;
  } else if (be(e) || ye(e))
    return e;
}
const tr = /;(?![^(]*\))/g, nr = /:([^]+)/, sr = /\/\*[^]*?\*\//g;
function or(e) {
  const t = {};
  return e.replace(sr, "").split(tr).forEach((n) => {
    if (n) {
      const s = n.split(nr);
      s.length > 1 && (t[s[0].trim()] = s[1].trim());
    }
  }), t;
}
function he(e) {
  let t = "";
  if (be(e))
    t = e;
  else if (J(e))
    for (let n = 0; n < e.length; n++) {
      const s = he(e[n]);
      s && (t += s + " ");
    }
  else if (ye(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
const ir = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", lr = /* @__PURE__ */ Qs(ir);
function ki(e) {
  return !!e || e === "";
}
const $i = (e) => !!(e && e.__v_isRef === !0), oe = (e) => be(e) ? e : e == null ? "" : J(e) || ye(e) && (e.toString === Ci || !Q(e.toString)) ? $i(e) ? oe(e.value) : JSON.stringify(e, Ei, 2) : String(e), Ei = (e, t) => $i(t) ? Ei(e, t.value) : en(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (n, [s, o], i) => (n[Ts(s, i) + " =>"] = o, n),
    {}
  )
} : _i(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((n) => Ts(n))
} : kt(t) ? Ts(t) : ye(t) && !J(t) && !Si(t) ? String(t) : t, Ts = (e, t = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    kt(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e
  );
};
/**
* @vue/reactivity v3.5.25
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let Ve;
class rr {
  constructor(t = !1) {
    this.detached = t, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this.parent = Ve, !t && Ve && (this.index = (Ve.scopes || (Ve.scopes = [])).push(
      this
    ) - 1);
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = !0;
      let t, n;
      if (this.scopes)
        for (t = 0, n = this.scopes.length; t < n; t++)
          this.scopes[t].pause();
      for (t = 0, n = this.effects.length; t < n; t++)
        this.effects[t].pause();
    }
  }
  /**
   * Resumes the effect scope, including all child scopes and effects.
   */
  resume() {
    if (this._active && this._isPaused) {
      this._isPaused = !1;
      let t, n;
      if (this.scopes)
        for (t = 0, n = this.scopes.length; t < n; t++)
          this.scopes[t].resume();
      for (t = 0, n = this.effects.length; t < n; t++)
        this.effects[t].resume();
    }
  }
  run(t) {
    if (this._active) {
      const n = Ve;
      try {
        return Ve = this, t();
      } finally {
        Ve = n;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = Ve, Ve = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    this._on > 0 && --this._on === 0 && (Ve = this.prevScope, this.prevScope = void 0);
  }
  stop(t) {
    if (this._active) {
      this._active = !1;
      let n, s;
      for (n = 0, s = this.effects.length; n < s; n++)
        this.effects[n].stop();
      for (this.effects.length = 0, n = 0, s = this.cleanups.length; n < s; n++)
        this.cleanups[n]();
      if (this.cleanups.length = 0, this.scopes) {
        for (n = 0, s = this.scopes.length; n < s; n++)
          this.scopes[n].stop(!0);
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !t) {
        const o = this.parent.scopes.pop();
        o && o !== this && (this.parent.scopes[this.index] = o, o.index = this.index);
      }
      this.parent = void 0;
    }
  }
}
function ar() {
  return Ve;
}
let ve;
const ks = /* @__PURE__ */ new WeakSet();
class Ai {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Ve && Ve.active && Ve.effects.push(this);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, ks.has(this) && (ks.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Ii(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, ko(this), Li(this);
    const t = ve, n = et;
    ve = this, et = !0;
    try {
      return this.fn();
    } finally {
      Ni(this), ve = t, et = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        lo(t);
      this.deps = this.depsTail = void 0, ko(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? ks.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    Ds(this) && this.run();
  }
  get dirty() {
    return Ds(this);
  }
}
let Mi = 0, Sn, xn;
function Ii(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = xn, xn = e;
    return;
  }
  e.next = Sn, Sn = e;
}
function oo() {
  Mi++;
}
function io() {
  if (--Mi > 0)
    return;
  if (xn) {
    let t = xn;
    for (xn = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; Sn; ) {
    let t = Sn;
    for (Sn = void 0; t; ) {
      const n = t.next;
      if (t.next = void 0, t.flags &= -9, t.flags & 1)
        try {
          t.trigger();
        } catch (s) {
          e || (e = s);
        }
      t = n;
    }
  }
  if (e) throw e;
}
function Li(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Ni(e) {
  let t, n = e.depsTail, s = n;
  for (; s; ) {
    const o = s.prevDep;
    s.version === -1 ? (s === n && (n = o), lo(s), cr(s)) : t = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = o;
  }
  e.deps = t, e.depsTail = n;
}
function Ds(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (Pi(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function Pi(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === In) || (e.globalVersion = In, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Ds(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = ve, s = et;
  ve = e, et = !0;
  try {
    Li(e);
    const o = e.fn(e._value);
    (t.version === 0 || Nt(o, e._value)) && (e.flags |= 128, e._value = o, t.version++);
  } catch (o) {
    throw t.version++, o;
  } finally {
    ve = n, et = s, Ni(e), e.flags &= -3;
  }
}
function lo(e, t = !1) {
  const { dep: n, prevSub: s, nextSub: o } = e;
  if (s && (s.nextSub = o, e.prevSub = void 0), o && (o.prevSub = s, e.nextSub = void 0), n.subs === e && (n.subs = s, !s && n.computed)) {
    n.computed.flags &= -5;
    for (let i = n.computed.deps; i; i = i.nextDep)
      lo(i, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function cr(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
let et = !0;
const Oi = [];
function St() {
  Oi.push(et), et = !1;
}
function xt() {
  const e = Oi.pop();
  et = e === void 0 ? !0 : e;
}
function ko(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = ve;
    ve = void 0;
    try {
      t();
    } finally {
      ve = n;
    }
  }
}
let In = 0;
class ur {
  constructor(t, n) {
    this.sub = t, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class ro {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
  }
  track(t) {
    if (!ve || !et || ve === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== ve)
      n = this.activeLink = new ur(ve, this), ve.deps ? (n.prevDep = ve.depsTail, ve.depsTail.nextDep = n, ve.depsTail = n) : ve.deps = ve.depsTail = n, wi(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const s = n.nextDep;
      s.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = s), n.prevDep = ve.depsTail, n.nextDep = void 0, ve.depsTail.nextDep = n, ve.depsTail = n, ve.deps === n && (ve.deps = s);
    }
    return n;
  }
  trigger(t) {
    this.version++, In++, this.notify(t);
  }
  notify(t) {
    oo();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      io();
    }
  }
}
function wi(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let s = t.deps; s; s = s.nextDep)
        wi(s);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
  }
}
const js = /* @__PURE__ */ new WeakMap(), zt = Symbol(
  ""
), Hs = Symbol(
  ""
), Ln = Symbol(
  ""
);
function Me(e, t, n) {
  if (et && ve) {
    let s = js.get(e);
    s || js.set(e, s = /* @__PURE__ */ new Map());
    let o = s.get(n);
    o || (s.set(n, o = new ro()), o.map = s, o.key = n), o.track();
  }
}
function bt(e, t, n, s, o, i) {
  const l = js.get(e);
  if (!l) {
    In++;
    return;
  }
  const r = (a) => {
    a && a.trigger();
  };
  if (oo(), t === "clear")
    l.forEach(r);
  else {
    const a = J(e), f = a && no(n);
    if (a && n === "length") {
      const c = Number(s);
      l.forEach((d, m) => {
        (m === "length" || m === Ln || !kt(m) && m >= c) && r(d);
      });
    } else
      switch ((n !== void 0 || l.has(void 0)) && r(l.get(n)), f && r(l.get(Ln)), t) {
        case "add":
          a ? f && r(l.get("length")) : (r(l.get(zt)), en(e) && r(l.get(Hs)));
          break;
        case "delete":
          a || (r(l.get(zt)), en(e) && r(l.get(Hs)));
          break;
        case "set":
          en(e) && r(l.get(zt));
          break;
      }
  }
  io();
}
function Jt(e) {
  const t = de(e);
  return t === e ? t : (Me(t, "iterate", Ln), Ze(e) ? t : t.map(nt));
}
function hs(e) {
  return Me(e = de(e), "iterate", Ln), e;
}
function Mt(e, t) {
  return Tt(e) ? Wt(e) ? dn(nt(t)) : dn(t) : nt(t);
}
const dr = {
  __proto__: null,
  [Symbol.iterator]() {
    return $s(this, Symbol.iterator, (e) => Mt(this, e));
  },
  concat(...e) {
    return Jt(this).concat(
      ...e.map((t) => J(t) ? Jt(t) : t)
    );
  },
  entries() {
    return $s(this, "entries", (e) => (e[1] = Mt(this, e[1]), e));
  },
  every(e, t) {
    return mt(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return mt(
      this,
      "filter",
      e,
      t,
      (n) => n.map((s) => Mt(this, s)),
      arguments
    );
  },
  find(e, t) {
    return mt(
      this,
      "find",
      e,
      t,
      (n) => Mt(this, n),
      arguments
    );
  },
  findIndex(e, t) {
    return mt(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return mt(
      this,
      "findLast",
      e,
      t,
      (n) => Mt(this, n),
      arguments
    );
  },
  findLastIndex(e, t) {
    return mt(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return mt(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return Es(this, "includes", e);
  },
  indexOf(...e) {
    return Es(this, "indexOf", e);
  },
  join(e) {
    return Jt(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return Es(this, "lastIndexOf", e);
  },
  map(e, t) {
    return mt(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return gn(this, "pop");
  },
  push(...e) {
    return gn(this, "push", e);
  },
  reduce(e, ...t) {
    return $o(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return $o(this, "reduceRight", e, t);
  },
  shift() {
    return gn(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return mt(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return gn(this, "splice", e);
  },
  toReversed() {
    return Jt(this).toReversed();
  },
  toSorted(e) {
    return Jt(this).toSorted(e);
  },
  toSpliced(...e) {
    return Jt(this).toSpliced(...e);
  },
  unshift(...e) {
    return gn(this, "unshift", e);
  },
  values() {
    return $s(this, "values", (e) => Mt(this, e));
  }
};
function $s(e, t, n) {
  const s = hs(e), o = s[t]();
  return s !== e && !Ze(e) && (o._next = o.next, o.next = () => {
    const i = o._next();
    return i.done || (i.value = n(i.value)), i;
  }), o;
}
const fr = Array.prototype;
function mt(e, t, n, s, o, i) {
  const l = hs(e), r = l !== e && !Ze(e), a = l[t];
  if (a !== fr[t]) {
    const d = a.apply(e, i);
    return r ? nt(d) : d;
  }
  let f = n;
  l !== e && (r ? f = function(d, m) {
    return n.call(this, Mt(e, d), m, e);
  } : n.length > 2 && (f = function(d, m) {
    return n.call(this, d, m, e);
  }));
  const c = a.call(l, f, s);
  return r && o ? o(c) : c;
}
function $o(e, t, n, s) {
  const o = hs(e);
  let i = n;
  return o !== e && (Ze(e) ? n.length > 3 && (i = function(l, r, a) {
    return n.call(this, l, r, a, e);
  }) : i = function(l, r, a) {
    return n.call(this, l, Mt(e, r), a, e);
  }), o[t](i, ...s);
}
function Es(e, t, n) {
  const s = de(e);
  Me(s, "iterate", Ln);
  const o = s[t](...n);
  return (o === -1 || o === !1) && uo(n[0]) ? (n[0] = de(n[0]), s[t](...n)) : o;
}
function gn(e, t, n = []) {
  St(), oo();
  const s = de(e)[t].apply(e, n);
  return io(), xt(), s;
}
const pr = /* @__PURE__ */ Qs("__proto__,__v_isRef,__isVue"), Fi = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(kt)
);
function hr(e) {
  kt(e) || (e = String(e));
  const t = de(this);
  return Me(t, "has", e), t.hasOwnProperty(e);
}
class Ri {
  constructor(t = !1, n = !1) {
    this._isReadonly = t, this._isShallow = n;
  }
  get(t, n, s) {
    if (n === "__v_skip") return t.__v_skip;
    const o = this._isReadonly, i = this._isShallow;
    if (n === "__v_isReactive")
      return !o;
    if (n === "__v_isReadonly")
      return o;
    if (n === "__v_isShallow")
      return i;
    if (n === "__v_raw")
      return s === (o ? i ? Tr : Vi : i ? Hi : ji).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(s) ? t : void 0;
    const l = J(t);
    if (!o) {
      let a;
      if (l && (a = dr[n]))
        return a;
      if (n === "hasOwnProperty")
        return hr;
    }
    const r = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      Ne(t) ? t : s
    );
    if ((kt(n) ? Fi.has(n) : pr(n)) || (o || Me(t, "get", n), i))
      return r;
    if (Ne(r)) {
      const a = l && no(n) ? r : r.value;
      return o && ye(a) ? Qn(a) : a;
    }
    return ye(r) ? o ? Qn(r) : Ce(r) : r;
  }
}
class Di extends Ri {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, s, o) {
    let i = t[n];
    const l = J(t) && no(n);
    if (!this._isShallow) {
      const f = Tt(i);
      if (!Ze(s) && !Tt(s) && (i = de(i), s = de(s)), !l && Ne(i) && !Ne(s))
        return f || (i.value = s), !0;
    }
    const r = l ? Number(n) < t.length : fe(t, n), a = Reflect.set(
      t,
      n,
      s,
      Ne(t) ? t : o
    );
    return t === de(o) && (r ? Nt(s, i) && bt(t, "set", n, s) : bt(t, "add", n, s)), a;
  }
  deleteProperty(t, n) {
    const s = fe(t, n);
    t[n];
    const o = Reflect.deleteProperty(t, n);
    return o && s && bt(t, "delete", n, void 0), o;
  }
  has(t, n) {
    const s = Reflect.has(t, n);
    return (!kt(n) || !Fi.has(n)) && Me(t, "has", n), s;
  }
  ownKeys(t) {
    return Me(
      t,
      "iterate",
      J(t) ? "length" : zt
    ), Reflect.ownKeys(t);
  }
}
class gr extends Ri {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, n) {
    return !0;
  }
  deleteProperty(t, n) {
    return !0;
  }
}
const mr = /* @__PURE__ */ new Di(), vr = /* @__PURE__ */ new gr(), yr = /* @__PURE__ */ new Di(!0);
const Vs = (e) => e, Bn = (e) => Reflect.getPrototypeOf(e);
function _r(e, t, n) {
  return function(...s) {
    const o = this.__v_raw, i = de(o), l = en(i), r = e === "entries" || e === Symbol.iterator && l, a = e === "keys" && l, f = o[e](...s), c = n ? Vs : t ? dn : nt;
    return !t && Me(
      i,
      "iterate",
      a ? Hs : zt
    ), {
      // iterator protocol
      next() {
        const { value: d, done: m } = f.next();
        return m ? { value: d, done: m } : {
          value: r ? [c(d[0]), c(d[1])] : c(d),
          done: m
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function zn(e) {
  return function(...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function br(e, t) {
  const n = {
    get(o) {
      const i = this.__v_raw, l = de(i), r = de(o);
      e || (Nt(o, r) && Me(l, "get", o), Me(l, "get", r));
      const { has: a } = Bn(l), f = t ? Vs : e ? dn : nt;
      if (a.call(l, o))
        return f(i.get(o));
      if (a.call(l, r))
        return f(i.get(r));
      i !== l && i.get(o);
    },
    get size() {
      const o = this.__v_raw;
      return !e && Me(de(o), "iterate", zt), o.size;
    },
    has(o) {
      const i = this.__v_raw, l = de(i), r = de(o);
      return e || (Nt(o, r) && Me(l, "has", o), Me(l, "has", r)), o === r ? i.has(o) : i.has(o) || i.has(r);
    },
    forEach(o, i) {
      const l = this, r = l.__v_raw, a = de(r), f = t ? Vs : e ? dn : nt;
      return !e && Me(a, "iterate", zt), r.forEach((c, d) => o.call(i, f(c), f(d), l));
    }
  };
  return Ee(
    n,
    e ? {
      add: zn("add"),
      set: zn("set"),
      delete: zn("delete"),
      clear: zn("clear")
    } : {
      add(o) {
        !t && !Ze(o) && !Tt(o) && (o = de(o));
        const i = de(this);
        return Bn(i).has.call(i, o) || (i.add(o), bt(i, "add", o, o)), this;
      },
      set(o, i) {
        !t && !Ze(i) && !Tt(i) && (i = de(i));
        const l = de(this), { has: r, get: a } = Bn(l);
        let f = r.call(l, o);
        f || (o = de(o), f = r.call(l, o));
        const c = a.call(l, o);
        return l.set(o, i), f ? Nt(i, c) && bt(l, "set", o, i) : bt(l, "add", o, i), this;
      },
      delete(o) {
        const i = de(this), { has: l, get: r } = Bn(i);
        let a = l.call(i, o);
        a || (o = de(o), a = l.call(i, o)), r && r.call(i, o);
        const f = i.delete(o);
        return a && bt(i, "delete", o, void 0), f;
      },
      clear() {
        const o = de(this), i = o.size !== 0, l = o.clear();
        return i && bt(
          o,
          "clear",
          void 0,
          void 0
        ), l;
      }
    }
  ), [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ].forEach((o) => {
    n[o] = _r(o, e, t);
  }), n;
}
function ao(e, t) {
  const n = br(e, t);
  return (s, o, i) => o === "__v_isReactive" ? !e : o === "__v_isReadonly" ? e : o === "__v_raw" ? s : Reflect.get(
    fe(n, o) && o in s ? n : s,
    o,
    i
  );
}
const Cr = {
  get: /* @__PURE__ */ ao(!1, !1)
}, Sr = {
  get: /* @__PURE__ */ ao(!1, !0)
}, xr = {
  get: /* @__PURE__ */ ao(!0, !1)
};
const ji = /* @__PURE__ */ new WeakMap(), Hi = /* @__PURE__ */ new WeakMap(), Vi = /* @__PURE__ */ new WeakMap(), Tr = /* @__PURE__ */ new WeakMap();
function kr(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function $r(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : kr(Zl(e));
}
function Ce(e) {
  return Tt(e) ? e : co(
    e,
    !1,
    mr,
    Cr,
    ji
  );
}
function Er(e) {
  return co(
    e,
    !1,
    yr,
    Sr,
    Hi
  );
}
function Qn(e) {
  return co(
    e,
    !0,
    vr,
    xr,
    Vi
  );
}
function co(e, t, n, s, o) {
  if (!ye(e) || e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const i = $r(e);
  if (i === 0)
    return e;
  const l = o.get(e);
  if (l)
    return l;
  const r = new Proxy(
    e,
    i === 2 ? s : n
  );
  return o.set(e, r), r;
}
function Wt(e) {
  return Tt(e) ? Wt(e.__v_raw) : !!(e && e.__v_isReactive);
}
function Tt(e) {
  return !!(e && e.__v_isReadonly);
}
function Ze(e) {
  return !!(e && e.__v_isShallow);
}
function uo(e) {
  return e ? !!e.__v_raw : !1;
}
function de(e) {
  const t = e && e.__v_raw;
  return t ? de(t) : e;
}
function Ar(e) {
  return !fe(e, "__v_skip") && Object.isExtensible(e) && Ti(e, "__v_skip", !0), e;
}
const nt = (e) => ye(e) ? Ce(e) : e, dn = (e) => ye(e) ? Qn(e) : e;
function Ne(e) {
  return e ? e.__v_isRef === !0 : !1;
}
function B(e) {
  return Mr(e, !1);
}
function Mr(e, t) {
  return Ne(e) ? e : new Ir(e, t);
}
class Ir {
  constructor(t, n) {
    this.dep = new ro(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? t : de(t), this._value = n ? t : nt(t), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(t) {
    const n = this._rawValue, s = this.__v_isShallow || Ze(t) || Tt(t);
    t = s ? t : de(t), Nt(t, n) && (this._rawValue = t, this._value = s ? t : nt(t), this.dep.trigger());
  }
}
function Qe(e) {
  return Ne(e) ? e.value : e;
}
const Lr = {
  get: (e, t, n) => t === "__v_raw" ? e : Qe(Reflect.get(e, t, n)),
  set: (e, t, n, s) => {
    const o = e[t];
    return Ne(o) && !Ne(n) ? (o.value = n, !0) : Reflect.set(e, t, n, s);
  }
};
function Bi(e) {
  return Wt(e) ? e : new Proxy(e, Lr);
}
class Nr {
  constructor(t, n, s) {
    this.fn = t, this.setter = n, this._value = void 0, this.dep = new ro(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = In - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = s;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    ve !== this)
      return Ii(this, !0), !0;
  }
  get value() {
    const t = this.dep.track();
    return Pi(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
function Pr(e, t, n = !1) {
  let s, o;
  return Q(e) ? s = e : (s = e.get, o = e.set), new Nr(s, o, n);
}
const Wn = {}, es = /* @__PURE__ */ new WeakMap();
let Ht;
function Or(e, t = !1, n = Ht) {
  if (n) {
    let s = es.get(n);
    s || es.set(n, s = []), s.push(e);
  }
}
function wr(e, t, n = ge) {
  const { immediate: s, deep: o, once: i, scheduler: l, augmentJob: r, call: a } = n, f = (b) => o ? b : Ze(b) || o === !1 || o === 0 ? Ct(b, 1) : Ct(b);
  let c, d, m, v, E = !1, S = !1;
  if (Ne(e) ? (d = () => e.value, E = Ze(e)) : Wt(e) ? (d = () => f(e), E = !0) : J(e) ? (S = !0, E = e.some((b) => Wt(b) || Ze(b)), d = () => e.map((b) => {
    if (Ne(b))
      return b.value;
    if (Wt(b))
      return f(b);
    if (Q(b))
      return a ? a(b, 2) : b();
  })) : Q(e) ? t ? d = a ? () => a(e, 2) : e : d = () => {
    if (m) {
      St();
      try {
        m();
      } finally {
        xt();
      }
    }
    const b = Ht;
    Ht = c;
    try {
      return a ? a(e, 3, [v]) : e(v);
    } finally {
      Ht = b;
    }
  } : d = pt, t && o) {
    const b = d, V = o === !0 ? 1 / 0 : o;
    d = () => Ct(b(), V);
  }
  const I = ar(), _ = () => {
    c.stop(), I && I.active && to(I.effects, c);
  };
  if (i && t) {
    const b = t;
    t = (...V) => {
      b(...V), _();
    };
  }
  let g = S ? new Array(e.length).fill(Wn) : Wn;
  const C = (b) => {
    if (!(!(c.flags & 1) || !c.dirty && !b))
      if (t) {
        const V = c.run();
        if (o || E || (S ? V.some((q, se) => Nt(q, g[se])) : Nt(V, g))) {
          m && m();
          const q = Ht;
          Ht = c;
          try {
            const se = [
              V,
              // pass undefined as the old value when it's changed for the first time
              g === Wn ? void 0 : S && g[0] === Wn ? [] : g,
              v
            ];
            g = V, a ? a(t, 3, se) : (
              // @ts-expect-error
              t(...se)
            );
          } finally {
            Ht = q;
          }
        }
      } else
        c.run();
  };
  return r && r(C), c = new Ai(d), c.scheduler = l ? () => l(C, !1) : C, v = (b) => Or(b, !1, c), m = c.onStop = () => {
    const b = es.get(c);
    if (b) {
      if (a)
        a(b, 4);
      else
        for (const V of b) V();
      es.delete(c);
    }
  }, t ? s ? C(!0) : g = c.run() : l ? l(C.bind(null, !0), !0) : c.run(), _.pause = c.pause.bind(c), _.resume = c.resume.bind(c), _.stop = _, _;
}
function Ct(e, t = 1 / 0, n) {
  if (t <= 0 || !ye(e) || e.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t))
    return e;
  if (n.set(e, t), t--, Ne(e))
    Ct(e.value, t, n);
  else if (J(e))
    for (let s = 0; s < e.length; s++)
      Ct(e[s], t, n);
  else if (_i(e) || en(e))
    e.forEach((s) => {
      Ct(s, t, n);
    });
  else if (Si(e)) {
    for (const s in e)
      Ct(e[s], t, n);
    for (const s of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, s) && Ct(e[s], t, n);
  }
  return e;
}
/**
* @vue/runtime-core v3.5.25
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function jn(e, t, n, s) {
  try {
    return s ? e(...s) : e();
  } catch (o) {
    gs(o, t, n);
  }
}
function st(e, t, n, s) {
  if (Q(e)) {
    const o = jn(e, t, n, s);
    return o && bi(o) && o.catch((i) => {
      gs(i, t, n);
    }), o;
  }
  if (J(e)) {
    const o = [];
    for (let i = 0; i < e.length; i++)
      o.push(st(e[i], t, n, s));
    return o;
  }
}
function gs(e, t, n, s = !0) {
  const o = t ? t.vnode : null, { errorHandler: i, throwUnhandledErrorInProduction: l } = t && t.appContext.config || ge;
  if (t) {
    let r = t.parent;
    const a = t.proxy, f = `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; r; ) {
      const c = r.ec;
      if (c) {
        for (let d = 0; d < c.length; d++)
          if (c[d](e, a, f) === !1)
            return;
      }
      r = r.parent;
    }
    if (i) {
      St(), jn(i, null, 10, [
        e,
        a,
        f
      ]), xt();
      return;
    }
  }
  Fr(e, n, o, s, l);
}
function Fr(e, t, n, s = !0, o = !1) {
  if (o)
    throw e;
  console.error(e);
}
const we = [];
let ct = -1;
const tn = [];
let It = null, Yt = 0;
const zi = /* @__PURE__ */ Promise.resolve();
let ts = null;
function fo(e) {
  const t = ts || zi;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function Rr(e) {
  let t = ct + 1, n = we.length;
  for (; t < n; ) {
    const s = t + n >>> 1, o = we[s], i = Nn(o);
    i < e || i === e && o.flags & 2 ? t = s + 1 : n = s;
  }
  return t;
}
function po(e) {
  if (!(e.flags & 1)) {
    const t = Nn(e), n = we[we.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(e.flags & 2) && t >= Nn(n) ? we.push(e) : we.splice(Rr(t), 0, e), e.flags |= 1, Wi();
  }
}
function Wi() {
  ts || (ts = zi.then(Ki));
}
function Dr(e) {
  J(e) ? tn.push(...e) : It && e.id === -1 ? It.splice(Yt + 1, 0, e) : e.flags & 1 || (tn.push(e), e.flags |= 1), Wi();
}
function Eo(e, t, n = ct + 1) {
  for (; n < we.length; n++) {
    const s = we[n];
    if (s && s.flags & 2) {
      if (e && s.id !== e.uid)
        continue;
      we.splice(n, 1), n--, s.flags & 4 && (s.flags &= -2), s(), s.flags & 4 || (s.flags &= -2);
    }
  }
}
function Ui(e) {
  if (tn.length) {
    const t = [...new Set(tn)].sort(
      (n, s) => Nn(n) - Nn(s)
    );
    if (tn.length = 0, It) {
      It.push(...t);
      return;
    }
    for (It = t, Yt = 0; Yt < It.length; Yt++) {
      const n = It[Yt];
      n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), n.flags &= -2;
    }
    It = null, Yt = 0;
  }
}
const Nn = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function Ki(e) {
  try {
    for (ct = 0; ct < we.length; ct++) {
      const t = we[ct];
      t && !(t.flags & 8) && (t.flags & 4 && (t.flags &= -2), jn(
        t,
        t.i,
        t.i ? 15 : 14
      ), t.flags & 4 || (t.flags &= -2));
    }
  } finally {
    for (; ct < we.length; ct++) {
      const t = we[ct];
      t && (t.flags &= -2);
    }
    ct = -1, we.length = 0, Ui(), ts = null, (we.length || tn.length) && Ki();
  }
}
let Le = null, Gi = null;
function ns(e) {
  const t = Le;
  return Le = e, Gi = e && e.type.__scopeId || null, t;
}
function ht(e, t = Le, n) {
  if (!t || e._n)
    return e;
  const s = (...o) => {
    s._d && is(-1);
    const i = ns(t);
    let l;
    try {
      l = e(...o);
    } finally {
      ns(i), s._d && is(1);
    }
    return l;
  };
  return s._n = !0, s._c = !0, s._d = !0, s;
}
function Ye(e, t) {
  if (Le === null)
    return e;
  const n = bs(Le), s = e.dirs || (e.dirs = []);
  for (let o = 0; o < t.length; o++) {
    let [i, l, r, a = ge] = t[o];
    i && (Q(i) && (i = {
      mounted: i,
      updated: i
    }), i.deep && Ct(l), s.push({
      dir: i,
      instance: n,
      value: l,
      oldValue: void 0,
      arg: r,
      modifiers: a
    }));
  }
  return e;
}
function Ft(e, t, n, s) {
  const o = e.dirs, i = t && t.dirs;
  for (let l = 0; l < o.length; l++) {
    const r = o[l];
    i && (r.oldValue = i[l].value);
    let a = r.dir[s];
    a && (St(), st(a, n, 8, [
      e.el,
      r,
      e,
      t
    ]), xt());
  }
}
const qi = Symbol("_vte"), Ji = (e) => e.__isTeleport, Tn = (e) => e && (e.disabled || e.disabled === ""), Ao = (e) => e && (e.defer || e.defer === ""), Mo = (e) => typeof SVGElement < "u" && e instanceof SVGElement, Io = (e) => typeof MathMLElement == "function" && e instanceof MathMLElement, Bs = (e, t) => {
  const n = e && e.to;
  return be(n) ? t ? t(n) : null : n;
}, Yi = {
  name: "Teleport",
  __isTeleport: !0,
  process(e, t, n, s, o, i, l, r, a, f) {
    const {
      mc: c,
      pc: d,
      pbc: m,
      o: { insert: v, querySelector: E, createText: S, createComment: I }
    } = f, _ = Tn(t.props);
    let { shapeFlag: g, children: C, dynamicChildren: b } = t;
    if (e == null) {
      const V = t.el = S(""), q = t.anchor = S("");
      v(V, n, s), v(q, n, s);
      const se = (z, ee) => {
        g & 16 && c(
          C,
          z,
          ee,
          o,
          i,
          l,
          r,
          a
        );
      }, te = () => {
        const z = t.target = Bs(t.props, E), ee = Xi(z, t, S, v);
        z && (l !== "svg" && Mo(z) ? l = "svg" : l !== "mathml" && Io(z) && (l = "mathml"), o && o.isCE && (o.ce._teleportTargets || (o.ce._teleportTargets = /* @__PURE__ */ new Set())).add(z), _ || (se(z, ee), Jn(t, !1)));
      };
      _ && (se(n, q), Jn(t, !0)), Ao(t.props) ? (t.el.__isMounted = !1, Oe(() => {
        te(), delete t.el.__isMounted;
      }, i)) : te();
    } else {
      if (Ao(t.props) && e.el.__isMounted === !1) {
        Oe(() => {
          Yi.process(
            e,
            t,
            n,
            s,
            o,
            i,
            l,
            r,
            a,
            f
          );
        }, i);
        return;
      }
      t.el = e.el, t.targetStart = e.targetStart;
      const V = t.anchor = e.anchor, q = t.target = e.target, se = t.targetAnchor = e.targetAnchor, te = Tn(e.props), z = te ? n : q, ee = te ? V : se;
      if (l === "svg" || Mo(q) ? l = "svg" : (l === "mathml" || Io(q)) && (l = "mathml"), b ? (m(
        e.dynamicChildren,
        b,
        z,
        o,
        i,
        l,
        r
      ), mo(e, t, !0)) : a || d(
        e,
        t,
        z,
        ee,
        o,
        i,
        l,
        r,
        !1
      ), _)
        te ? t.props && e.props && t.props.to !== e.props.to && (t.props.to = e.props.to) : Un(
          t,
          n,
          V,
          f,
          1
        );
      else if ((t.props && t.props.to) !== (e.props && e.props.to)) {
        const ce = t.target = Bs(
          t.props,
          E
        );
        ce && Un(
          t,
          ce,
          null,
          f,
          0
        );
      } else te && Un(
        t,
        q,
        se,
        f,
        1
      );
      Jn(t, _);
    }
  },
  remove(e, t, n, { um: s, o: { remove: o } }, i) {
    const {
      shapeFlag: l,
      children: r,
      anchor: a,
      targetStart: f,
      targetAnchor: c,
      target: d,
      props: m
    } = e;
    if (d && (o(f), o(c)), i && o(a), l & 16) {
      const v = i || !Tn(m);
      for (let E = 0; E < r.length; E++) {
        const S = r[E];
        s(
          S,
          t,
          n,
          v,
          !!S.dynamicChildren
        );
      }
    }
  },
  move: Un,
  hydrate: jr
};
function Un(e, t, n, { o: { insert: s }, m: o }, i = 2) {
  i === 0 && s(e.targetAnchor, t, n);
  const { el: l, anchor: r, shapeFlag: a, children: f, props: c } = e, d = i === 2;
  if (d && s(l, t, n), (!d || Tn(c)) && a & 16)
    for (let m = 0; m < f.length; m++)
      o(
        f[m],
        t,
        n,
        2
      );
  d && s(r, t, n);
}
function jr(e, t, n, s, o, i, {
  o: { nextSibling: l, parentNode: r, querySelector: a, insert: f, createText: c }
}, d) {
  function m(S, I, _, g) {
    I.anchor = d(
      l(S),
      I,
      r(S),
      n,
      s,
      o,
      i
    ), I.targetStart = _, I.targetAnchor = g;
  }
  const v = t.target = Bs(
    t.props,
    a
  ), E = Tn(t.props);
  if (v) {
    const S = v._lpa || v.firstChild;
    if (t.shapeFlag & 16)
      if (E)
        m(
          e,
          t,
          S,
          S && l(S)
        );
      else {
        t.anchor = l(e);
        let I = S;
        for (; I; ) {
          if (I && I.nodeType === 8) {
            if (I.data === "teleport start anchor")
              t.targetStart = I;
            else if (I.data === "teleport anchor") {
              t.targetAnchor = I, v._lpa = t.targetAnchor && l(t.targetAnchor);
              break;
            }
          }
          I = l(I);
        }
        t.targetAnchor || Xi(v, t, c, f), d(
          S && l(S),
          t,
          v,
          n,
          s,
          o,
          i
        );
      }
    Jn(t, E);
  } else E && t.shapeFlag & 16 && m(e, t, e, l(e));
  return t.anchor && l(t.anchor);
}
const Zi = Yi;
function Jn(e, t) {
  const n = e.ctx;
  if (n && n.ut) {
    let s, o;
    for (t ? (s = e.el, o = e.anchor) : (s = e.targetStart, o = e.targetAnchor); s && s !== o; )
      s.nodeType === 1 && s.setAttribute("data-v-owner", n.uid), s = s.nextSibling;
    n.ut();
  }
}
function Xi(e, t, n, s) {
  const o = t.targetStart = n(""), i = t.targetAnchor = n("");
  return o[qi] = i, e && (s(o, e), s(i, e)), i;
}
const _t = Symbol("_leaveCb"), Kn = Symbol("_enterCb");
function Hr() {
  const e = {
    isMounted: !1,
    isLeaving: !1,
    isUnmounting: !1,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  return wt(() => {
    e.isMounted = !0;
  }), ll(() => {
    e.isUnmounting = !0;
  }), e;
}
const Je = [Function, Array], Qi = {
  mode: String,
  appear: Boolean,
  persisted: Boolean,
  // enter
  onBeforeEnter: Je,
  onEnter: Je,
  onAfterEnter: Je,
  onEnterCancelled: Je,
  // leave
  onBeforeLeave: Je,
  onLeave: Je,
  onAfterLeave: Je,
  onLeaveCancelled: Je,
  // appear
  onBeforeAppear: Je,
  onAppear: Je,
  onAfterAppear: Je,
  onAppearCancelled: Je
}, el = (e) => {
  const t = e.subTree;
  return t.component ? el(t.component) : t;
}, Vr = {
  name: "BaseTransition",
  props: Qi,
  setup(e, { slots: t }) {
    const n = $l(), s = Hr();
    return () => {
      const o = t.default && sl(t.default(), !0);
      if (!o || !o.length)
        return;
      const i = tl(o), l = de(e), { mode: r } = l;
      if (s.isLeaving)
        return As(i);
      const a = Lo(i);
      if (!a)
        return As(i);
      let f = zs(
        a,
        l,
        s,
        n,
        // #11061, ensure enterHooks is fresh after clone
        (d) => f = d
      );
      a.type !== Ie && Pn(a, f);
      let c = n.subTree && Lo(n.subTree);
      if (c && c.type !== Ie && !Bt(c, a) && el(n).type !== Ie) {
        let d = zs(
          c,
          l,
          s,
          n
        );
        if (Pn(c, d), r === "out-in" && a.type !== Ie)
          return s.isLeaving = !0, d.afterLeave = () => {
            s.isLeaving = !1, n.job.flags & 8 || n.update(), delete d.afterLeave, c = void 0;
          }, As(i);
        r === "in-out" && a.type !== Ie ? d.delayLeave = (m, v, E) => {
          const S = nl(
            s,
            c
          );
          S[String(c.key)] = c, m[_t] = () => {
            v(), m[_t] = void 0, delete f.delayedLeave, c = void 0;
          }, f.delayedLeave = () => {
            E(), delete f.delayedLeave, c = void 0;
          };
        } : c = void 0;
      } else c && (c = void 0);
      return i;
    };
  }
};
function tl(e) {
  let t = e[0];
  if (e.length > 1) {
    for (const n of e)
      if (n.type !== Ie) {
        t = n;
        break;
      }
  }
  return t;
}
const Br = Vr;
function nl(e, t) {
  const { leavingVNodes: n } = e;
  let s = n.get(t.type);
  return s || (s = /* @__PURE__ */ Object.create(null), n.set(t.type, s)), s;
}
function zs(e, t, n, s, o) {
  const {
    appear: i,
    mode: l,
    persisted: r = !1,
    onBeforeEnter: a,
    onEnter: f,
    onAfterEnter: c,
    onEnterCancelled: d,
    onBeforeLeave: m,
    onLeave: v,
    onAfterLeave: E,
    onLeaveCancelled: S,
    onBeforeAppear: I,
    onAppear: _,
    onAfterAppear: g,
    onAppearCancelled: C
  } = t, b = String(e.key), V = nl(n, e), q = (z, ee) => {
    z && st(
      z,
      s,
      9,
      ee
    );
  }, se = (z, ee) => {
    const ce = ee[1];
    q(z, ee), J(z) ? z.every((A) => A.length <= 1) && ce() : z.length <= 1 && ce();
  }, te = {
    mode: l,
    persisted: r,
    beforeEnter(z) {
      let ee = a;
      if (!n.isMounted)
        if (i)
          ee = I || a;
        else
          return;
      z[_t] && z[_t](
        !0
        /* cancelled */
      );
      const ce = V[b];
      ce && Bt(e, ce) && ce.el[_t] && ce.el[_t](), q(ee, [z]);
    },
    enter(z) {
      let ee = f, ce = c, A = d;
      if (!n.isMounted)
        if (i)
          ee = _ || f, ce = g || c, A = C || d;
        else
          return;
      let F = !1;
      const D = z[Kn] = (ne) => {
        F || (F = !0, ne ? q(A, [z]) : q(ce, [z]), te.delayedLeave && te.delayedLeave(), z[Kn] = void 0);
      };
      ee ? se(ee, [z, D]) : D();
    },
    leave(z, ee) {
      const ce = String(e.key);
      if (z[Kn] && z[Kn](
        !0
        /* cancelled */
      ), n.isUnmounting)
        return ee();
      q(m, [z]);
      let A = !1;
      const F = z[_t] = (D) => {
        A || (A = !0, ee(), D ? q(S, [z]) : q(E, [z]), z[_t] = void 0, V[ce] === e && delete V[ce]);
      };
      V[ce] = e, v ? se(v, [z, F]) : F();
    },
    clone(z) {
      const ee = zs(
        z,
        t,
        n,
        s,
        o
      );
      return o && o(ee), ee;
    }
  };
  return te;
}
function As(e) {
  if (ms(e))
    return e = Ot(e), e.children = null, e;
}
function Lo(e) {
  if (!ms(e))
    return Ji(e.type) && e.children ? tl(e.children) : e;
  if (e.component)
    return e.component.subTree;
  const { shapeFlag: t, children: n } = e;
  if (n) {
    if (t & 16)
      return n[0];
    if (t & 32 && Q(n.default))
      return n.default();
  }
}
function Pn(e, t) {
  e.shapeFlag & 6 && e.component ? (e.transition = t, Pn(e.component.subTree, t)) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
function sl(e, t = !1, n) {
  let s = [], o = 0;
  for (let i = 0; i < e.length; i++) {
    let l = e[i];
    const r = n == null ? l.key : String(n) + String(l.key != null ? l.key : i);
    l.type === ae ? (l.patchFlag & 128 && o++, s = s.concat(
      sl(l.children, t, r)
    )) : (t || l.type !== Ie) && s.push(r != null ? Ot(l, { key: r }) : l);
  }
  if (o > 1)
    for (let i = 0; i < s.length; i++)
      s[i].patchFlag = -2;
  return s;
}
// @__NO_SIDE_EFFECTS__
function Ke(e, t) {
  return Q(e) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    Ee({ name: e.name }, t, { setup: e })
  ) : e;
}
function ol(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
const ss = /* @__PURE__ */ new WeakMap();
function kn(e, t, n, s, o = !1) {
  if (J(e)) {
    e.forEach(
      (E, S) => kn(
        E,
        t && (J(t) ? t[S] : t),
        n,
        s,
        o
      )
    );
    return;
  }
  if (nn(s) && !o) {
    s.shapeFlag & 512 && s.type.__asyncResolved && s.component.subTree.component && kn(e, t, n, s.component.subTree);
    return;
  }
  const i = s.shapeFlag & 4 ? bs(s.component) : s.el, l = o ? null : i, { i: r, r: a } = e, f = t && t.r, c = r.refs === ge ? r.refs = {} : r.refs, d = r.setupState, m = de(d), v = d === ge ? yi : (E) => fe(m, E);
  if (f != null && f !== a) {
    if (No(t), be(f))
      c[f] = null, v(f) && (d[f] = null);
    else if (Ne(f)) {
      f.value = null;
      const E = t;
      E.k && (c[E.k] = null);
    }
  }
  if (Q(a))
    jn(a, r, 12, [l, c]);
  else {
    const E = be(a), S = Ne(a);
    if (E || S) {
      const I = () => {
        if (e.f) {
          const _ = E ? v(a) ? d[a] : c[a] : a.value;
          if (o)
            J(_) && to(_, i);
          else if (J(_))
            _.includes(i) || _.push(i);
          else if (E)
            c[a] = [i], v(a) && (d[a] = c[a]);
          else {
            const g = [i];
            a.value = g, e.k && (c[e.k] = g);
          }
        } else E ? (c[a] = l, v(a) && (d[a] = l)) : S && (a.value = l, e.k && (c[e.k] = l));
      };
      if (l) {
        const _ = () => {
          I(), ss.delete(e);
        };
        _.id = -1, ss.set(e, _), Oe(_, n);
      } else
        No(e), I();
    }
  }
}
function No(e) {
  const t = ss.get(e);
  t && (t.flags |= 8, ss.delete(e));
}
ps().requestIdleCallback;
ps().cancelIdleCallback;
const nn = (e) => !!e.type.__asyncLoader, ms = (e) => e.type.__isKeepAlive;
function zr(e, t) {
  il(e, "a", t);
}
function Wr(e, t) {
  il(e, "da", t);
}
function il(e, t, n = Fe) {
  const s = e.__wdc || (e.__wdc = () => {
    let o = n;
    for (; o; ) {
      if (o.isDeactivated)
        return;
      o = o.parent;
    }
    return e();
  });
  if (vs(t, s, n), n) {
    let o = n.parent;
    for (; o && o.parent; )
      ms(o.parent.vnode) && Ur(s, t, n, o), o = o.parent;
  }
}
function Ur(e, t, n, s) {
  const o = vs(
    t,
    e,
    s,
    !0
    /* prepend */
  );
  fn(() => {
    to(s[t], o);
  }, n);
}
function vs(e, t, n = Fe, s = !1) {
  if (n) {
    const o = n[e] || (n[e] = []), i = t.__weh || (t.__weh = (...l) => {
      St();
      const r = Hn(n), a = st(t, n, e, l);
      return r(), xt(), a;
    });
    return s ? o.unshift(i) : o.push(i), i;
  }
}
const $t = (e) => (t, n = Fe) => {
  (!Fn || e === "sp") && vs(e, (...s) => t(...s), n);
}, Kr = $t("bm"), wt = $t("m"), Gr = $t(
  "bu"
), qr = $t("u"), ll = $t(
  "bum"
), fn = $t("um"), Jr = $t(
  "sp"
), Yr = $t("rtg"), Zr = $t("rtc");
function Xr(e, t = Fe) {
  vs("ec", e, t);
}
const Qr = Symbol.for("v-ndc");
function xe(e, t, n, s) {
  let o;
  const i = n, l = J(e);
  if (l || be(e)) {
    const r = l && Wt(e);
    let a = !1, f = !1;
    r && (a = !Ze(e), f = Tt(e), e = hs(e)), o = new Array(e.length);
    for (let c = 0, d = e.length; c < d; c++)
      o[c] = t(
        a ? f ? dn(nt(e[c])) : nt(e[c]) : e[c],
        c,
        void 0,
        i
      );
  } else if (typeof e == "number") {
    o = new Array(e);
    for (let r = 0; r < e; r++)
      o[r] = t(r + 1, r, void 0, i);
  } else if (ye(e))
    if (e[Symbol.iterator])
      o = Array.from(
        e,
        (r, a) => t(r, a, void 0, i)
      );
    else {
      const r = Object.keys(e);
      o = new Array(r.length);
      for (let a = 0, f = r.length; a < f; a++) {
        const c = r[a];
        o[a] = t(e[c], c, a, i);
      }
    }
  else
    o = [];
  return o;
}
function $n(e, t, n = {}, s, o) {
  if (Le.ce || Le.parent && nn(Le.parent) && Le.parent.ce) {
    const f = Object.keys(n).length > 0;
    return t !== "default" && (n.name = t), $(), We(
      ae,
      null,
      [Se("slot", n, s && s())],
      f ? -2 : 64
    );
  }
  let i = e[t];
  i && i._c && (i._d = !1), $();
  const l = i && rl(i(n)), r = n.key || // slot content array of a dynamic conditional slot may have a branch
  // key attached in the `createSlots` helper, respect that
  l && l.key, a = We(
    ae,
    {
      key: (r && !kt(r) ? r : `_${t}`) + // #7256 force differentiate fallback content from actual content
      (!l && s ? "_fb" : "")
    },
    l || (s ? s() : []),
    l && e._ === 1 ? 64 : -2
  );
  return i && i._c && (i._d = !0), a;
}
function rl(e) {
  return e.some((t) => wn(t) ? !(t.type === Ie || t.type === ae && !rl(t.children)) : !0) ? e : null;
}
const Ws = (e) => e ? El(e) ? bs(e) : Ws(e.parent) : null, En = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ Ee(/* @__PURE__ */ Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => Ws(e.parent),
    $root: (e) => Ws(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => cl(e),
    $forceUpdate: (e) => e.f || (e.f = () => {
      po(e.update);
    }),
    $nextTick: (e) => e.n || (e.n = fo.bind(e.proxy)),
    $watch: (e) => da.bind(e)
  })
), Ms = (e, t) => e !== ge && !e.__isScriptSetup && fe(e, t), ea = {
  get({ _: e }, t) {
    if (t === "__v_skip")
      return !0;
    const { ctx: n, setupState: s, data: o, props: i, accessCache: l, type: r, appContext: a } = e;
    if (t[0] !== "$") {
      const m = l[t];
      if (m !== void 0)
        switch (m) {
          case 1:
            return s[t];
          case 2:
            return o[t];
          case 4:
            return n[t];
          case 3:
            return i[t];
        }
      else {
        if (Ms(s, t))
          return l[t] = 1, s[t];
        if (o !== ge && fe(o, t))
          return l[t] = 2, o[t];
        if (fe(i, t))
          return l[t] = 3, i[t];
        if (n !== ge && fe(n, t))
          return l[t] = 4, n[t];
        Us && (l[t] = 0);
      }
    }
    const f = En[t];
    let c, d;
    if (f)
      return t === "$attrs" && Me(e.attrs, "get", ""), f(e);
    if (
      // css module (injected by vue-loader)
      (c = r.__cssModules) && (c = c[t])
    )
      return c;
    if (n !== ge && fe(n, t))
      return l[t] = 4, n[t];
    if (
      // global properties
      d = a.config.globalProperties, fe(d, t)
    )
      return d[t];
  },
  set({ _: e }, t, n) {
    const { data: s, setupState: o, ctx: i } = e;
    return Ms(o, t) ? (o[t] = n, !0) : s !== ge && fe(s, t) ? (s[t] = n, !0) : fe(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (i[t] = n, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: n, ctx: s, appContext: o, props: i, type: l }
  }, r) {
    let a;
    return !!(n[r] || e !== ge && r[0] !== "$" && fe(e, r) || Ms(t, r) || fe(i, r) || fe(s, r) || fe(En, r) || fe(o.config.globalProperties, r) || (a = l.__cssModules) && a[r]);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : fe(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
  }
};
function Po(e) {
  return J(e) ? e.reduce(
    (t, n) => (t[n] = null, t),
    {}
  ) : e;
}
let Us = !0;
function ta(e) {
  const t = cl(e), n = e.proxy, s = e.ctx;
  Us = !1, t.beforeCreate && Oo(t.beforeCreate, e, "bc");
  const {
    // state
    data: o,
    computed: i,
    methods: l,
    watch: r,
    provide: a,
    inject: f,
    // lifecycle
    created: c,
    beforeMount: d,
    mounted: m,
    beforeUpdate: v,
    updated: E,
    activated: S,
    deactivated: I,
    beforeDestroy: _,
    beforeUnmount: g,
    destroyed: C,
    unmounted: b,
    render: V,
    renderTracked: q,
    renderTriggered: se,
    errorCaptured: te,
    serverPrefetch: z,
    // public API
    expose: ee,
    inheritAttrs: ce,
    // assets
    components: A,
    directives: F,
    filters: D
  } = t;
  if (f && na(f, s, null), l)
    for (const ie in l) {
      const le = l[ie];
      Q(le) && (s[ie] = le.bind(n));
    }
  if (o) {
    const ie = o.call(n, n);
    ye(ie) && (e.data = Ce(ie));
  }
  if (Us = !0, i)
    for (const ie in i) {
      const le = i[ie], Ae = Q(le) ? le.bind(n, n) : Q(le.get) ? le.get.bind(n, n) : pt, Et = !Q(le) && Q(le.set) ? le.set.bind(n) : pt, qe = G({
        get: Ae,
        set: Et
      });
      Object.defineProperty(s, ie, {
        enumerable: !0,
        configurable: !0,
        get: () => qe.value,
        set: (Re) => qe.value = Re
      });
    }
  if (r)
    for (const ie in r)
      al(r[ie], s, n, ie);
  if (a) {
    const ie = Q(a) ? a.call(n) : a;
    Reflect.ownKeys(ie).forEach((le) => {
      aa(le, ie[le]);
    });
  }
  c && Oo(c, e, "c");
  function X(ie, le) {
    J(le) ? le.forEach((Ae) => ie(Ae.bind(n))) : le && ie(le.bind(n));
  }
  if (X(Kr, d), X(wt, m), X(Gr, v), X(qr, E), X(zr, S), X(Wr, I), X(Xr, te), X(Zr, q), X(Yr, se), X(ll, g), X(fn, b), X(Jr, z), J(ee))
    if (ee.length) {
      const ie = e.exposed || (e.exposed = {});
      ee.forEach((le) => {
        Object.defineProperty(ie, le, {
          get: () => n[le],
          set: (Ae) => n[le] = Ae,
          enumerable: !0
        });
      });
    } else e.exposed || (e.exposed = {});
  V && e.render === pt && (e.render = V), ce != null && (e.inheritAttrs = ce), A && (e.components = A), F && (e.directives = F), z && ol(e);
}
function na(e, t, n = pt) {
  J(e) && (e = Ks(e));
  for (const s in e) {
    const o = e[s];
    let i;
    ye(o) ? "default" in o ? i = on(
      o.from || s,
      o.default,
      !0
    ) : i = on(o.from || s) : i = on(o), Ne(i) ? Object.defineProperty(t, s, {
      enumerable: !0,
      configurable: !0,
      get: () => i.value,
      set: (l) => i.value = l
    }) : t[s] = i;
  }
}
function Oo(e, t, n) {
  st(
    J(e) ? e.map((s) => s.bind(t.proxy)) : e.bind(t.proxy),
    t,
    n
  );
}
function al(e, t, n, s) {
  let o = s.includes(".") ? fl(n, s) : () => n[s];
  if (be(e)) {
    const i = t[e];
    Q(i) && Xe(o, i);
  } else if (Q(e))
    Xe(o, e.bind(n));
  else if (ye(e))
    if (J(e))
      e.forEach((i) => al(i, t, n, s));
    else {
      const i = Q(e.handler) ? e.handler.bind(n) : t[e.handler];
      Q(i) && Xe(o, i, e);
    }
}
function cl(e) {
  const t = e.type, { mixins: n, extends: s } = t, {
    mixins: o,
    optionsCache: i,
    config: { optionMergeStrategies: l }
  } = e.appContext, r = i.get(t);
  let a;
  return r ? a = r : !o.length && !n && !s ? a = t : (a = {}, o.length && o.forEach(
    (f) => os(a, f, l, !0)
  ), os(a, t, l)), ye(t) && i.set(t, a), a;
}
function os(e, t, n, s = !1) {
  const { mixins: o, extends: i } = t;
  i && os(e, i, n, !0), o && o.forEach(
    (l) => os(e, l, n, !0)
  );
  for (const l in t)
    if (!(s && l === "expose")) {
      const r = sa[l] || n && n[l];
      e[l] = r ? r(e[l], t[l]) : t[l];
    }
  return e;
}
const sa = {
  data: wo,
  props: Fo,
  emits: Fo,
  // objects
  methods: bn,
  computed: bn,
  // lifecycle
  beforeCreate: Pe,
  created: Pe,
  beforeMount: Pe,
  mounted: Pe,
  beforeUpdate: Pe,
  updated: Pe,
  beforeDestroy: Pe,
  beforeUnmount: Pe,
  destroyed: Pe,
  unmounted: Pe,
  activated: Pe,
  deactivated: Pe,
  errorCaptured: Pe,
  serverPrefetch: Pe,
  // assets
  components: bn,
  directives: bn,
  // watch
  watch: ia,
  // provide / inject
  provide: wo,
  inject: oa
};
function wo(e, t) {
  return t ? e ? function() {
    return Ee(
      Q(e) ? e.call(this, this) : e,
      Q(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function oa(e, t) {
  return bn(Ks(e), Ks(t));
}
function Ks(e) {
  if (J(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++)
      t[e[n]] = e[n];
    return t;
  }
  return e;
}
function Pe(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function bn(e, t) {
  return e ? Ee(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Fo(e, t) {
  return e ? J(e) && J(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : Ee(
    /* @__PURE__ */ Object.create(null),
    Po(e),
    Po(t ?? {})
  ) : t;
}
function ia(e, t) {
  if (!e) return t;
  if (!t) return e;
  const n = Ee(/* @__PURE__ */ Object.create(null), e);
  for (const s in t)
    n[s] = Pe(e[s], t[s]);
  return n;
}
function ul() {
  return {
    app: null,
    config: {
      isNativeTag: yi,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let la = 0;
function ra(e, t) {
  return function(s, o = null) {
    Q(s) || (s = Ee({}, s)), o != null && !ye(o) && (o = null);
    const i = ul(), l = /* @__PURE__ */ new WeakSet(), r = [];
    let a = !1;
    const f = i.app = {
      _uid: la++,
      _component: s,
      _props: o,
      _container: null,
      _context: i,
      _instance: null,
      version: Ba,
      get config() {
        return i.config;
      },
      set config(c) {
      },
      use(c, ...d) {
        return l.has(c) || (c && Q(c.install) ? (l.add(c), c.install(f, ...d)) : Q(c) && (l.add(c), c(f, ...d))), f;
      },
      mixin(c) {
        return i.mixins.includes(c) || i.mixins.push(c), f;
      },
      component(c, d) {
        return d ? (i.components[c] = d, f) : i.components[c];
      },
      directive(c, d) {
        return d ? (i.directives[c] = d, f) : i.directives[c];
      },
      mount(c, d, m) {
        if (!a) {
          const v = f._ceVNode || Se(s, o);
          return v.appContext = i, m === !0 ? m = "svg" : m === !1 && (m = void 0), e(v, c, m), a = !0, f._container = c, c.__vue_app__ = f, bs(v.component);
        }
      },
      onUnmount(c) {
        r.push(c);
      },
      unmount() {
        a && (st(
          r,
          f._instance,
          16
        ), e(null, f._container), delete f._container.__vue_app__);
      },
      provide(c, d) {
        return i.provides[c] = d, f;
      },
      runWithContext(c) {
        const d = sn;
        sn = f;
        try {
          return c();
        } finally {
          sn = d;
        }
      }
    };
    return f;
  };
}
let sn = null;
function aa(e, t) {
  if (Fe) {
    let n = Fe.provides;
    const s = Fe.parent && Fe.parent.provides;
    s === n && (n = Fe.provides = Object.create(s)), n[e] = t;
  }
}
function on(e, t, n = !1) {
  const s = $l();
  if (s || sn) {
    let o = sn ? sn._context.provides : s ? s.parent == null || s.ce ? s.vnode.appContext && s.vnode.appContext.provides : s.parent.provides : void 0;
    if (o && e in o)
      return o[e];
    if (arguments.length > 1)
      return n && Q(t) ? t.call(s && s.proxy) : t;
  }
}
const ca = Symbol.for("v-scx"), ua = () => on(ca);
function Xe(e, t, n) {
  return dl(e, t, n);
}
function dl(e, t, n = ge) {
  const { immediate: s, deep: o, flush: i, once: l } = n, r = Ee({}, n), a = t && s || !t && i !== "post";
  let f;
  if (Fn) {
    if (i === "sync") {
      const v = ua();
      f = v.__watcherHandles || (v.__watcherHandles = []);
    } else if (!a) {
      const v = () => {
      };
      return v.stop = pt, v.resume = pt, v.pause = pt, v;
    }
  }
  const c = Fe;
  r.call = (v, E, S) => st(v, c, E, S);
  let d = !1;
  i === "post" ? r.scheduler = (v) => {
    Oe(v, c && c.suspense);
  } : i !== "sync" && (d = !0, r.scheduler = (v, E) => {
    E ? v() : po(v);
  }), r.augmentJob = (v) => {
    t && (v.flags |= 4), d && (v.flags |= 2, c && (v.id = c.uid, v.i = c));
  };
  const m = wr(e, t, r);
  return Fn && (f ? f.push(m) : a && m()), m;
}
function da(e, t, n) {
  const s = this.proxy, o = be(e) ? e.includes(".") ? fl(s, e) : () => s[e] : e.bind(s, s);
  let i;
  Q(t) ? i = t : (i = t.handler, n = t);
  const l = Hn(this), r = dl(o, i.bind(s), n);
  return l(), r;
}
function fl(e, t) {
  const n = t.split(".");
  return () => {
    let s = e;
    for (let o = 0; o < n.length && s; o++)
      s = s[n[o]];
    return s;
  };
}
const fa = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${Pt(t)}Modifiers`] || e[`${qt(t)}Modifiers`];
function pa(e, t, ...n) {
  if (e.isUnmounted) return;
  const s = e.vnode.props || ge;
  let o = n;
  const i = t.startsWith("update:"), l = i && fa(s, t.slice(7));
  l && (l.trim && (o = n.map((c) => be(c) ? c.trim() : c)), l.number && (o = n.map(so)));
  let r, a = s[r = xs(t)] || // also try camelCase event handler (#2249)
  s[r = xs(Pt(t))];
  !a && i && (a = s[r = xs(qt(t))]), a && st(
    a,
    e,
    6,
    o
  );
  const f = s[r + "Once"];
  if (f) {
    if (!e.emitted)
      e.emitted = {};
    else if (e.emitted[r])
      return;
    e.emitted[r] = !0, st(
      f,
      e,
      6,
      o
    );
  }
}
const ha = /* @__PURE__ */ new WeakMap();
function pl(e, t, n = !1) {
  const s = n ? ha : t.emitsCache, o = s.get(e);
  if (o !== void 0)
    return o;
  const i = e.emits;
  let l = {}, r = !1;
  if (!Q(e)) {
    const a = (f) => {
      const c = pl(f, t, !0);
      c && (r = !0, Ee(l, c));
    };
    !n && t.mixins.length && t.mixins.forEach(a), e.extends && a(e.extends), e.mixins && e.mixins.forEach(a);
  }
  return !i && !r ? (ye(e) && s.set(e, null), null) : (J(i) ? i.forEach((a) => l[a] = null) : Ee(l, i), ye(e) && s.set(e, l), l);
}
function ys(e, t) {
  return !e || !us(t) ? !1 : (t = t.slice(2).replace(/Once$/, ""), fe(e, t[0].toLowerCase() + t.slice(1)) || fe(e, qt(t)) || fe(e, t));
}
function Ro(e) {
  const {
    type: t,
    vnode: n,
    proxy: s,
    withProxy: o,
    propsOptions: [i],
    slots: l,
    attrs: r,
    emit: a,
    render: f,
    renderCache: c,
    props: d,
    data: m,
    setupState: v,
    ctx: E,
    inheritAttrs: S
  } = e, I = ns(e);
  let _, g;
  try {
    if (n.shapeFlag & 4) {
      const b = o || s, V = b;
      _ = ut(
        f.call(
          V,
          b,
          c,
          d,
          v,
          m,
          E
        )
      ), g = r;
    } else {
      const b = t;
      _ = ut(
        b.length > 1 ? b(
          d,
          { attrs: r, slots: l, emit: a }
        ) : b(
          d,
          null
        )
      ), g = t.props ? r : ga(r);
    }
  } catch (b) {
    An.length = 0, gs(b, e, 1), _ = Se(Ie);
  }
  let C = _;
  if (g && S !== !1) {
    const b = Object.keys(g), { shapeFlag: V } = C;
    b.length && V & 7 && (i && b.some(eo) && (g = ma(
      g,
      i
    )), C = Ot(C, g, !1, !0));
  }
  return n.dirs && (C = Ot(C, null, !1, !0), C.dirs = C.dirs ? C.dirs.concat(n.dirs) : n.dirs), n.transition && Pn(C, n.transition), _ = C, ns(I), _;
}
const ga = (e) => {
  let t;
  for (const n in e)
    (n === "class" || n === "style" || us(n)) && ((t || (t = {}))[n] = e[n]);
  return t;
}, ma = (e, t) => {
  const n = {};
  for (const s in e)
    (!eo(s) || !(s.slice(9) in t)) && (n[s] = e[s]);
  return n;
};
function va(e, t, n) {
  const { props: s, children: o, component: i } = e, { props: l, children: r, patchFlag: a } = t, f = i.emitsOptions;
  if (t.dirs || t.transition)
    return !0;
  if (n && a >= 0) {
    if (a & 1024)
      return !0;
    if (a & 16)
      return s ? Do(s, l, f) : !!l;
    if (a & 8) {
      const c = t.dynamicProps;
      for (let d = 0; d < c.length; d++) {
        const m = c[d];
        if (l[m] !== s[m] && !ys(f, m))
          return !0;
      }
    }
  } else
    return (o || r) && (!r || !r.$stable) ? !0 : s === l ? !1 : s ? l ? Do(s, l, f) : !0 : !!l;
  return !1;
}
function Do(e, t, n) {
  const s = Object.keys(t);
  if (s.length !== Object.keys(e).length)
    return !0;
  for (let o = 0; o < s.length; o++) {
    const i = s[o];
    if (t[i] !== e[i] && !ys(n, i))
      return !0;
  }
  return !1;
}
function ya({ vnode: e, parent: t }, n) {
  for (; t; ) {
    const s = t.subTree;
    if (s.suspense && s.suspense.activeBranch === e && (s.el = e.el), s === e)
      (e = t.vnode).el = n, t = t.parent;
    else
      break;
  }
}
const hl = {}, gl = () => Object.create(hl), ml = (e) => Object.getPrototypeOf(e) === hl;
function _a(e, t, n, s = !1) {
  const o = {}, i = gl();
  e.propsDefaults = /* @__PURE__ */ Object.create(null), vl(e, t, o, i);
  for (const l in e.propsOptions[0])
    l in o || (o[l] = void 0);
  n ? e.props = s ? o : Er(o) : e.type.props ? e.props = o : e.props = i, e.attrs = i;
}
function ba(e, t, n, s) {
  const {
    props: o,
    attrs: i,
    vnode: { patchFlag: l }
  } = e, r = de(o), [a] = e.propsOptions;
  let f = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (s || l > 0) && !(l & 16)
  ) {
    if (l & 8) {
      const c = e.vnode.dynamicProps;
      for (let d = 0; d < c.length; d++) {
        let m = c[d];
        if (ys(e.emitsOptions, m))
          continue;
        const v = t[m];
        if (a)
          if (fe(i, m))
            v !== i[m] && (i[m] = v, f = !0);
          else {
            const E = Pt(m);
            o[E] = Gs(
              a,
              r,
              E,
              v,
              e,
              !1
            );
          }
        else
          v !== i[m] && (i[m] = v, f = !0);
      }
    }
  } else {
    vl(e, t, o, i) && (f = !0);
    let c;
    for (const d in r)
      (!t || // for camelCase
      !fe(t, d) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((c = qt(d)) === d || !fe(t, c))) && (a ? n && // for camelCase
      (n[d] !== void 0 || // for kebab-case
      n[c] !== void 0) && (o[d] = Gs(
        a,
        r,
        d,
        void 0,
        e,
        !0
      )) : delete o[d]);
    if (i !== r)
      for (const d in i)
        (!t || !fe(t, d)) && (delete i[d], f = !0);
  }
  f && bt(e.attrs, "set", "");
}
function vl(e, t, n, s) {
  const [o, i] = e.propsOptions;
  let l = !1, r;
  if (t)
    for (let a in t) {
      if (Cn(a))
        continue;
      const f = t[a];
      let c;
      o && fe(o, c = Pt(a)) ? !i || !i.includes(c) ? n[c] = f : (r || (r = {}))[c] = f : ys(e.emitsOptions, a) || (!(a in s) || f !== s[a]) && (s[a] = f, l = !0);
    }
  if (i) {
    const a = de(n), f = r || ge;
    for (let c = 0; c < i.length; c++) {
      const d = i[c];
      n[d] = Gs(
        o,
        a,
        d,
        f[d],
        e,
        !fe(f, d)
      );
    }
  }
  return l;
}
function Gs(e, t, n, s, o, i) {
  const l = e[n];
  if (l != null) {
    const r = fe(l, "default");
    if (r && s === void 0) {
      const a = l.default;
      if (l.type !== Function && !l.skipFactory && Q(a)) {
        const { propsDefaults: f } = o;
        if (n in f)
          s = f[n];
        else {
          const c = Hn(o);
          s = f[n] = a.call(
            null,
            t
          ), c();
        }
      } else
        s = a;
      o.ce && o.ce._setProp(n, s);
    }
    l[
      0
      /* shouldCast */
    ] && (i && !r ? s = !1 : l[
      1
      /* shouldCastTrue */
    ] && (s === "" || s === qt(n)) && (s = !0));
  }
  return s;
}
const Ca = /* @__PURE__ */ new WeakMap();
function yl(e, t, n = !1) {
  const s = n ? Ca : t.propsCache, o = s.get(e);
  if (o)
    return o;
  const i = e.props, l = {}, r = [];
  let a = !1;
  if (!Q(e)) {
    const c = (d) => {
      a = !0;
      const [m, v] = yl(d, t, !0);
      Ee(l, m), v && r.push(...v);
    };
    !n && t.mixins.length && t.mixins.forEach(c), e.extends && c(e.extends), e.mixins && e.mixins.forEach(c);
  }
  if (!i && !a)
    return ye(e) && s.set(e, Qt), Qt;
  if (J(i))
    for (let c = 0; c < i.length; c++) {
      const d = Pt(i[c]);
      jo(d) && (l[d] = ge);
    }
  else if (i)
    for (const c in i) {
      const d = Pt(c);
      if (jo(d)) {
        const m = i[c], v = l[d] = J(m) || Q(m) ? { type: m } : Ee({}, m), E = v.type;
        let S = !1, I = !0;
        if (J(E))
          for (let _ = 0; _ < E.length; ++_) {
            const g = E[_], C = Q(g) && g.name;
            if (C === "Boolean") {
              S = !0;
              break;
            } else C === "String" && (I = !1);
          }
        else
          S = Q(E) && E.name === "Boolean";
        v[
          0
          /* shouldCast */
        ] = S, v[
          1
          /* shouldCastTrue */
        ] = I, (S || fe(v, "default")) && r.push(d);
      }
    }
  const f = [l, r];
  return ye(e) && s.set(e, f), f;
}
function jo(e) {
  return e[0] !== "$" && !Cn(e);
}
const ho = (e) => e === "_" || e === "_ctx" || e === "$stable", go = (e) => J(e) ? e.map(ut) : [ut(e)], Sa = (e, t, n) => {
  if (t._n)
    return t;
  const s = ht((...o) => go(t(...o)), n);
  return s._c = !1, s;
}, _l = (e, t, n) => {
  const s = e._ctx;
  for (const o in e) {
    if (ho(o)) continue;
    const i = e[o];
    if (Q(i))
      t[o] = Sa(o, i, s);
    else if (i != null) {
      const l = go(i);
      t[o] = () => l;
    }
  }
}, bl = (e, t) => {
  const n = go(t);
  e.slots.default = () => n;
}, Cl = (e, t, n) => {
  for (const s in t)
    (n || !ho(s)) && (e[s] = t[s]);
}, xa = (e, t, n) => {
  const s = e.slots = gl();
  if (e.vnode.shapeFlag & 32) {
    const o = t._;
    o ? (Cl(s, t, n), n && Ti(s, "_", o, !0)) : _l(t, s);
  } else t && bl(e, t);
}, Ta = (e, t, n) => {
  const { vnode: s, slots: o } = e;
  let i = !0, l = ge;
  if (s.shapeFlag & 32) {
    const r = t._;
    r ? n && r === 1 ? i = !1 : Cl(o, t, n) : (i = !t.$stable, _l(t, o)), l = t;
  } else t && (bl(e, t), l = { default: 1 });
  if (i)
    for (const r in o)
      !ho(r) && l[r] == null && delete o[r];
}, Oe = Ma;
function ka(e) {
  return $a(e);
}
function $a(e, t) {
  const n = ps();
  n.__VUE__ = !0;
  const {
    insert: s,
    remove: o,
    patchProp: i,
    createElement: l,
    createText: r,
    createComment: a,
    setText: f,
    setElementText: c,
    parentNode: d,
    nextSibling: m,
    setScopeId: v = pt,
    insertStaticContent: E
  } = e, S = (u, p, y, k = null, x = null, T = null, N = void 0, P = null, O = !!p.dynamicChildren) => {
    if (u === p)
      return;
    u && !Bt(u, p) && (k = ue(u), Re(u, x, T, !0), u = null), p.patchFlag === -2 && (O = !1, p.dynamicChildren = null);
    const { type: M, ref: K, shapeFlag: R } = p;
    switch (M) {
      case _s:
        I(u, p, y, k);
        break;
      case Ie:
        _(u, p, y, k);
        break;
      case Ls:
        u == null && g(p, y, k, N);
        break;
      case ae:
        A(
          u,
          p,
          y,
          k,
          x,
          T,
          N,
          P,
          O
        );
        break;
      default:
        R & 1 ? V(
          u,
          p,
          y,
          k,
          x,
          T,
          N,
          P,
          O
        ) : R & 6 ? F(
          u,
          p,
          y,
          k,
          x,
          T,
          N,
          P,
          O
        ) : (R & 64 || R & 128) && M.process(
          u,
          p,
          y,
          k,
          x,
          T,
          N,
          P,
          O,
          Be
        );
    }
    K != null && x ? kn(K, u && u.ref, T, p || u, !p) : K == null && u && u.ref != null && kn(u.ref, null, T, u, !0);
  }, I = (u, p, y, k) => {
    if (u == null)
      s(
        p.el = r(p.children),
        y,
        k
      );
    else {
      const x = p.el = u.el;
      p.children !== u.children && f(x, p.children);
    }
  }, _ = (u, p, y, k) => {
    u == null ? s(
      p.el = a(p.children || ""),
      y,
      k
    ) : p.el = u.el;
  }, g = (u, p, y, k) => {
    [u.el, u.anchor] = E(
      u.children,
      p,
      y,
      k,
      u.el,
      u.anchor
    );
  }, C = ({ el: u, anchor: p }, y, k) => {
    let x;
    for (; u && u !== p; )
      x = m(u), s(u, y, k), u = x;
    s(p, y, k);
  }, b = ({ el: u, anchor: p }) => {
    let y;
    for (; u && u !== p; )
      y = m(u), o(u), u = y;
    o(p);
  }, V = (u, p, y, k, x, T, N, P, O) => {
    if (p.type === "svg" ? N = "svg" : p.type === "math" && (N = "mathml"), u == null)
      q(
        p,
        y,
        k,
        x,
        T,
        N,
        P,
        O
      );
    else {
      const M = u.el && u.el._isVueCE ? u.el : null;
      try {
        M && M._beginPatch(), z(
          u,
          p,
          x,
          T,
          N,
          P,
          O
        );
      } finally {
        M && M._endPatch();
      }
    }
  }, q = (u, p, y, k, x, T, N, P) => {
    let O, M;
    const { props: K, shapeFlag: R, transition: U, dirs: Y } = u;
    if (O = u.el = l(
      u.type,
      T,
      K && K.is,
      K
    ), R & 8 ? c(O, u.children) : R & 16 && te(
      u.children,
      O,
      null,
      k,
      x,
      Is(u, T),
      N,
      P
    ), Y && Ft(u, null, k, "created"), se(O, u, u.scopeId, N, k), K) {
      for (const me in K)
        me !== "value" && !Cn(me) && i(O, me, null, K[me], T, k);
      "value" in K && i(O, "value", null, K.value, T), (M = K.onVnodeBeforeMount) && at(M, k, u);
    }
    Y && Ft(u, null, k, "beforeMount");
    const re = Ea(x, U);
    re && U.beforeEnter(O), s(O, p, y), ((M = K && K.onVnodeMounted) || re || Y) && Oe(() => {
      M && at(M, k, u), re && U.enter(O), Y && Ft(u, null, k, "mounted");
    }, x);
  }, se = (u, p, y, k, x) => {
    if (y && v(u, y), k)
      for (let T = 0; T < k.length; T++)
        v(u, k[T]);
    if (x) {
      let T = x.subTree;
      if (p === T || xl(T.type) && (T.ssContent === p || T.ssFallback === p)) {
        const N = x.vnode;
        se(
          u,
          N,
          N.scopeId,
          N.slotScopeIds,
          x.parent
        );
      }
    }
  }, te = (u, p, y, k, x, T, N, P, O = 0) => {
    for (let M = O; M < u.length; M++) {
      const K = u[M] = P ? Lt(u[M]) : ut(u[M]);
      S(
        null,
        K,
        p,
        y,
        k,
        x,
        T,
        N,
        P
      );
    }
  }, z = (u, p, y, k, x, T, N) => {
    const P = p.el = u.el;
    let { patchFlag: O, dynamicChildren: M, dirs: K } = p;
    O |= u.patchFlag & 16;
    const R = u.props || ge, U = p.props || ge;
    let Y;
    if (y && Rt(y, !1), (Y = U.onVnodeBeforeUpdate) && at(Y, y, p, u), K && Ft(p, u, y, "beforeUpdate"), y && Rt(y, !0), (R.innerHTML && U.innerHTML == null || R.textContent && U.textContent == null) && c(P, ""), M ? ee(
      u.dynamicChildren,
      M,
      P,
      y,
      k,
      Is(p, x),
      T
    ) : N || le(
      u,
      p,
      P,
      null,
      y,
      k,
      Is(p, x),
      T,
      !1
    ), O > 0) {
      if (O & 16)
        ce(P, R, U, y, x);
      else if (O & 2 && R.class !== U.class && i(P, "class", null, U.class, x), O & 4 && i(P, "style", R.style, U.style, x), O & 8) {
        const re = p.dynamicProps;
        for (let me = 0; me < re.length; me++) {
          const pe = re[me], je = R[pe], He = U[pe];
          (He !== je || pe === "value") && i(P, pe, je, He, x, y);
        }
      }
      O & 1 && u.children !== p.children && c(P, p.children);
    } else !N && M == null && ce(P, R, U, y, x);
    ((Y = U.onVnodeUpdated) || K) && Oe(() => {
      Y && at(Y, y, p, u), K && Ft(p, u, y, "updated");
    }, k);
  }, ee = (u, p, y, k, x, T, N) => {
    for (let P = 0; P < p.length; P++) {
      const O = u[P], M = p[P], K = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        O.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (O.type === ae || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !Bt(O, M) || // - In the case of a component, it could contain anything.
        O.shapeFlag & 198) ? d(O.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          y
        )
      );
      S(
        O,
        M,
        K,
        null,
        k,
        x,
        T,
        N,
        !0
      );
    }
  }, ce = (u, p, y, k, x) => {
    if (p !== y) {
      if (p !== ge)
        for (const T in p)
          !Cn(T) && !(T in y) && i(
            u,
            T,
            p[T],
            null,
            x,
            k
          );
      for (const T in y) {
        if (Cn(T)) continue;
        const N = y[T], P = p[T];
        N !== P && T !== "value" && i(u, T, P, N, x, k);
      }
      "value" in y && i(u, "value", p.value, y.value, x);
    }
  }, A = (u, p, y, k, x, T, N, P, O) => {
    const M = p.el = u ? u.el : r(""), K = p.anchor = u ? u.anchor : r("");
    let { patchFlag: R, dynamicChildren: U, slotScopeIds: Y } = p;
    Y && (P = P ? P.concat(Y) : Y), u == null ? (s(M, y, k), s(K, y, k), te(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      p.children || [],
      y,
      K,
      x,
      T,
      N,
      P,
      O
    )) : R > 0 && R & 64 && U && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    u.dynamicChildren ? (ee(
      u.dynamicChildren,
      U,
      y,
      x,
      T,
      N,
      P
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (p.key != null || x && p === x.subTree) && mo(
      u,
      p,
      !0
      /* shallow */
    )) : le(
      u,
      p,
      y,
      K,
      x,
      T,
      N,
      P,
      O
    );
  }, F = (u, p, y, k, x, T, N, P, O) => {
    p.slotScopeIds = P, u == null ? p.shapeFlag & 512 ? x.ctx.activate(
      p,
      y,
      k,
      N,
      O
    ) : D(
      p,
      y,
      k,
      x,
      T,
      N,
      O
    ) : ne(u, p, O);
  }, D = (u, p, y, k, x, T, N) => {
    const P = u.component = Fa(
      u,
      k,
      x
    );
    if (ms(u) && (P.ctx.renderer = Be), Ra(P, !1, N), P.asyncDep) {
      if (x && x.registerDep(P, X, N), !u.el) {
        const O = P.subTree = Se(Ie);
        _(null, O, p, y), u.placeholder = O.el;
      }
    } else
      X(
        P,
        u,
        p,
        y,
        x,
        T,
        N
      );
  }, ne = (u, p, y) => {
    const k = p.component = u.component;
    if (va(u, p, y))
      if (k.asyncDep && !k.asyncResolved) {
        ie(k, p, y);
        return;
      } else
        k.next = p, k.update();
    else
      p.el = u.el, k.vnode = p;
  }, X = (u, p, y, k, x, T, N) => {
    const P = () => {
      if (u.isMounted) {
        let { next: R, bu: U, u: Y, parent: re, vnode: me } = u;
        {
          const lt = Sl(u);
          if (lt) {
            R && (R.el = me.el, ie(u, R, N)), lt.asyncDep.then(() => {
              u.isUnmounted || P();
            });
            return;
          }
        }
        let pe = R, je;
        Rt(u, !1), R ? (R.el = me.el, ie(u, R, N)) : R = me, U && qn(U), (je = R.props && R.props.onVnodeBeforeUpdate) && at(je, re, R, me), Rt(u, !0);
        const He = Ro(u), it = u.subTree;
        u.subTree = He, S(
          it,
          He,
          // parent may have changed if it's in a teleport
          d(it.el),
          // anchor may have changed if it's in a fragment
          ue(it),
          u,
          x,
          T
        ), R.el = He.el, pe === null && ya(u, He.el), Y && Oe(Y, x), (je = R.props && R.props.onVnodeUpdated) && Oe(
          () => at(je, re, R, me),
          x
        );
      } else {
        let R;
        const { el: U, props: Y } = p, { bm: re, m: me, parent: pe, root: je, type: He } = u, it = nn(p);
        Rt(u, !1), re && qn(re), !it && (R = Y && Y.onVnodeBeforeMount) && at(R, pe, p), Rt(u, !0);
        {
          je.ce && // @ts-expect-error _def is private
          je.ce._def.shadowRoot !== !1 && je.ce._injectChildStyle(He);
          const lt = u.subTree = Ro(u);
          S(
            null,
            lt,
            y,
            k,
            u,
            x,
            T
          ), p.el = lt.el;
        }
        if (me && Oe(me, x), !it && (R = Y && Y.onVnodeMounted)) {
          const lt = p;
          Oe(
            () => at(R, pe, lt),
            x
          );
        }
        (p.shapeFlag & 256 || pe && nn(pe.vnode) && pe.vnode.shapeFlag & 256) && u.a && Oe(u.a, x), u.isMounted = !0, p = y = k = null;
      }
    };
    u.scope.on();
    const O = u.effect = new Ai(P);
    u.scope.off();
    const M = u.update = O.run.bind(O), K = u.job = O.runIfDirty.bind(O);
    K.i = u, K.id = u.uid, O.scheduler = () => po(K), Rt(u, !0), M();
  }, ie = (u, p, y) => {
    p.component = u;
    const k = u.vnode.props;
    u.vnode = p, u.next = null, ba(u, p.props, k, y), Ta(u, p.children, y), St(), Eo(u), xt();
  }, le = (u, p, y, k, x, T, N, P, O = !1) => {
    const M = u && u.children, K = u ? u.shapeFlag : 0, R = p.children, { patchFlag: U, shapeFlag: Y } = p;
    if (U > 0) {
      if (U & 128) {
        Et(
          M,
          R,
          y,
          k,
          x,
          T,
          N,
          P,
          O
        );
        return;
      } else if (U & 256) {
        Ae(
          M,
          R,
          y,
          k,
          x,
          T,
          N,
          P,
          O
        );
        return;
      }
    }
    Y & 8 ? (K & 16 && Z(M, x, T), R !== M && c(y, R)) : K & 16 ? Y & 16 ? Et(
      M,
      R,
      y,
      k,
      x,
      T,
      N,
      P,
      O
    ) : Z(M, x, T, !0) : (K & 8 && c(y, ""), Y & 16 && te(
      R,
      y,
      k,
      x,
      T,
      N,
      P,
      O
    ));
  }, Ae = (u, p, y, k, x, T, N, P, O) => {
    u = u || Qt, p = p || Qt;
    const M = u.length, K = p.length, R = Math.min(M, K);
    let U;
    for (U = 0; U < R; U++) {
      const Y = p[U] = O ? Lt(p[U]) : ut(p[U]);
      S(
        u[U],
        Y,
        y,
        null,
        x,
        T,
        N,
        P,
        O
      );
    }
    M > K ? Z(
      u,
      x,
      T,
      !0,
      !1,
      R
    ) : te(
      p,
      y,
      k,
      x,
      T,
      N,
      P,
      O,
      R
    );
  }, Et = (u, p, y, k, x, T, N, P, O) => {
    let M = 0;
    const K = p.length;
    let R = u.length - 1, U = K - 1;
    for (; M <= R && M <= U; ) {
      const Y = u[M], re = p[M] = O ? Lt(p[M]) : ut(p[M]);
      if (Bt(Y, re))
        S(
          Y,
          re,
          y,
          null,
          x,
          T,
          N,
          P,
          O
        );
      else
        break;
      M++;
    }
    for (; M <= R && M <= U; ) {
      const Y = u[R], re = p[U] = O ? Lt(p[U]) : ut(p[U]);
      if (Bt(Y, re))
        S(
          Y,
          re,
          y,
          null,
          x,
          T,
          N,
          P,
          O
        );
      else
        break;
      R--, U--;
    }
    if (M > R) {
      if (M <= U) {
        const Y = U + 1, re = Y < K ? p[Y].el : k;
        for (; M <= U; )
          S(
            null,
            p[M] = O ? Lt(p[M]) : ut(p[M]),
            y,
            re,
            x,
            T,
            N,
            P,
            O
          ), M++;
      }
    } else if (M > U)
      for (; M <= R; )
        Re(u[M], x, T, !0), M++;
    else {
      const Y = M, re = M, me = /* @__PURE__ */ new Map();
      for (M = re; M <= U; M++) {
        const ze = p[M] = O ? Lt(p[M]) : ut(p[M]);
        ze.key != null && me.set(ze.key, M);
      }
      let pe, je = 0;
      const He = U - re + 1;
      let it = !1, lt = 0;
      const hn = new Array(He);
      for (M = 0; M < He; M++) hn[M] = 0;
      for (M = Y; M <= R; M++) {
        const ze = u[M];
        if (je >= He) {
          Re(ze, x, T, !0);
          continue;
        }
        let rt;
        if (ze.key != null)
          rt = me.get(ze.key);
        else
          for (pe = re; pe <= U; pe++)
            if (hn[pe - re] === 0 && Bt(ze, p[pe])) {
              rt = pe;
              break;
            }
        rt === void 0 ? Re(ze, x, T, !0) : (hn[rt - re] = M + 1, rt >= lt ? lt = rt : it = !0, S(
          ze,
          p[rt],
          y,
          null,
          x,
          T,
          N,
          P,
          O
        ), je++);
      }
      const Co = it ? Aa(hn) : Qt;
      for (pe = Co.length - 1, M = He - 1; M >= 0; M--) {
        const ze = re + M, rt = p[ze], So = p[ze + 1], xo = ze + 1 < K ? (
          // #13559, fallback to el placeholder for unresolved async component
          So.el || So.placeholder
        ) : k;
        hn[M] === 0 ? S(
          null,
          rt,
          y,
          xo,
          x,
          T,
          N,
          P,
          O
        ) : it && (pe < 0 || M !== Co[pe] ? qe(rt, y, xo, 2) : pe--);
      }
    }
  }, qe = (u, p, y, k, x = null) => {
    const { el: T, type: N, transition: P, children: O, shapeFlag: M } = u;
    if (M & 6) {
      qe(u.component.subTree, p, y, k);
      return;
    }
    if (M & 128) {
      u.suspense.move(p, y, k);
      return;
    }
    if (M & 64) {
      N.move(u, p, y, Be);
      return;
    }
    if (N === ae) {
      s(T, p, y);
      for (let R = 0; R < O.length; R++)
        qe(O[R], p, y, k);
      s(u.anchor, p, y);
      return;
    }
    if (N === Ls) {
      C(u, p, y);
      return;
    }
    if (k !== 2 && M & 1 && P)
      if (k === 0)
        P.beforeEnter(T), s(T, p, y), Oe(() => P.enter(T), x);
      else {
        const { leave: R, delayLeave: U, afterLeave: Y } = P, re = () => {
          u.ctx.isUnmounted ? o(T) : s(T, p, y);
        }, me = () => {
          T._isLeaving && T[_t](
            !0
            /* cancelled */
          ), R(T, () => {
            re(), Y && Y();
          });
        };
        U ? U(T, re, me) : me();
      }
    else
      s(T, p, y);
  }, Re = (u, p, y, k = !1, x = !1) => {
    const {
      type: T,
      props: N,
      ref: P,
      children: O,
      dynamicChildren: M,
      shapeFlag: K,
      patchFlag: R,
      dirs: U,
      cacheIndex: Y
    } = u;
    if (R === -2 && (x = !1), P != null && (St(), kn(P, null, y, u, !0), xt()), Y != null && (p.renderCache[Y] = void 0), K & 256) {
      p.ctx.deactivate(u);
      return;
    }
    const re = K & 1 && U, me = !nn(u);
    let pe;
    if (me && (pe = N && N.onVnodeBeforeUnmount) && at(pe, p, u), K & 6)
      W(u.component, y, k);
    else {
      if (K & 128) {
        u.suspense.unmount(y, k);
        return;
      }
      re && Ft(u, null, p, "beforeUnmount"), K & 64 ? u.type.remove(
        u,
        p,
        y,
        Be,
        k
      ) : M && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !M.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (T !== ae || R > 0 && R & 64) ? Z(
        M,
        p,
        y,
        !1,
        !0
      ) : (T === ae && R & 384 || !x && K & 16) && Z(O, p, y), k && H(u);
    }
    (me && (pe = N && N.onVnodeUnmounted) || re) && Oe(() => {
      pe && at(pe, p, u), re && Ft(u, null, p, "unmounted");
    }, y);
  }, H = (u) => {
    const { type: p, el: y, anchor: k, transition: x } = u;
    if (p === ae) {
      j(y, k);
      return;
    }
    if (p === Ls) {
      b(u);
      return;
    }
    const T = () => {
      o(y), x && !x.persisted && x.afterLeave && x.afterLeave();
    };
    if (u.shapeFlag & 1 && x && !x.persisted) {
      const { leave: N, delayLeave: P } = x, O = () => N(y, T);
      P ? P(u.el, T, O) : O();
    } else
      T();
  }, j = (u, p) => {
    let y;
    for (; u !== p; )
      y = m(u), o(u), u = y;
    o(p);
  }, W = (u, p, y) => {
    const { bum: k, scope: x, job: T, subTree: N, um: P, m: O, a: M } = u;
    Ho(O), Ho(M), k && qn(k), x.stop(), T && (T.flags |= 8, Re(N, u, p, y)), P && Oe(P, p), Oe(() => {
      u.isUnmounted = !0;
    }, p);
  }, Z = (u, p, y, k = !1, x = !1, T = 0) => {
    for (let N = T; N < u.length; N++)
      Re(u[N], p, y, k, x);
  }, ue = (u) => {
    if (u.shapeFlag & 6)
      return ue(u.component.subTree);
    if (u.shapeFlag & 128)
      return u.suspense.next();
    const p = m(u.anchor || u.el), y = p && p[qi];
    return y ? m(y) : p;
  };
  let De = !1;
  const gt = (u, p, y) => {
    u == null ? p._vnode && Re(p._vnode, null, null, !0) : S(
      p._vnode || null,
      u,
      p,
      null,
      null,
      null,
      y
    ), p._vnode = u, De || (De = !0, Eo(), Ui(), De = !1);
  }, Be = {
    p: S,
    um: Re,
    m: qe,
    r: H,
    mt: D,
    mc: te,
    pc: le,
    pbc: ee,
    n: ue,
    o: e
  };
  return {
    render: gt,
    hydrate: void 0,
    createApp: ra(gt)
  };
}
function Is({ type: e, props: t }, n) {
  return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Rt({ effect: e, job: t }, n) {
  n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Ea(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function mo(e, t, n = !1) {
  const s = e.children, o = t.children;
  if (J(s) && J(o))
    for (let i = 0; i < s.length; i++) {
      const l = s[i];
      let r = o[i];
      r.shapeFlag & 1 && !r.dynamicChildren && ((r.patchFlag <= 0 || r.patchFlag === 32) && (r = o[i] = Lt(o[i]), r.el = l.el), !n && r.patchFlag !== -2 && mo(l, r)), r.type === _s && // avoid cached text nodes retaining detached dom nodes
      r.patchFlag !== -1 && (r.el = l.el), r.type === Ie && !r.el && (r.el = l.el);
    }
}
function Aa(e) {
  const t = e.slice(), n = [0];
  let s, o, i, l, r;
  const a = e.length;
  for (s = 0; s < a; s++) {
    const f = e[s];
    if (f !== 0) {
      if (o = n[n.length - 1], e[o] < f) {
        t[s] = o, n.push(s);
        continue;
      }
      for (i = 0, l = n.length - 1; i < l; )
        r = i + l >> 1, e[n[r]] < f ? i = r + 1 : l = r;
      f < e[n[i]] && (i > 0 && (t[s] = n[i - 1]), n[i] = s);
    }
  }
  for (i = n.length, l = n[i - 1]; i-- > 0; )
    n[i] = l, l = t[l];
  return n;
}
function Sl(e) {
  const t = e.subTree.component;
  if (t)
    return t.asyncDep && !t.asyncResolved ? t : Sl(t);
}
function Ho(e) {
  if (e)
    for (let t = 0; t < e.length; t++)
      e[t].flags |= 8;
}
const xl = (e) => e.__isSuspense;
function Ma(e, t) {
  t && t.pendingBranch ? J(e) ? t.effects.push(...e) : t.effects.push(e) : Dr(e);
}
const ae = Symbol.for("v-fgt"), _s = Symbol.for("v-txt"), Ie = Symbol.for("v-cmt"), Ls = Symbol.for("v-stc"), An = [];
let Ue = null;
function $(e = !1) {
  An.push(Ue = e ? null : []);
}
function Ia() {
  An.pop(), Ue = An[An.length - 1] || null;
}
let On = 1;
function is(e, t = !1) {
  On += e, e < 0 && Ue && t && (Ue.hasOnce = !0);
}
function Tl(e) {
  return e.dynamicChildren = On > 0 ? Ue || Qt : null, Ia(), On > 0 && Ue && Ue.push(e), e;
}
function L(e, t, n, s, o, i) {
  return Tl(
    h(
      e,
      t,
      n,
      s,
      o,
      i,
      !0
    )
  );
}
function We(e, t, n, s, o) {
  return Tl(
    Se(
      e,
      t,
      n,
      s,
      o,
      !0
    )
  );
}
function wn(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function Bt(e, t) {
  return e.type === t.type && e.key === t.key;
}
const kl = ({ key: e }) => e ?? null, Yn = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? be(e) || Ne(e) || Q(e) ? { i: Le, r: e, k: t, f: !!n } : e : null);
function h(e, t = null, n = null, s = 0, o = null, i = e === ae ? 0 : 1, l = !1, r = !1) {
  const a = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && kl(t),
    ref: t && Yn(t),
    scopeId: Gi,
    slotScopeIds: null,
    children: n,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: i,
    patchFlag: s,
    dynamicProps: o,
    dynamicChildren: null,
    appContext: null,
    ctx: Le
  };
  return r ? (vo(a, n), i & 128 && e.normalize(a)) : n && (a.shapeFlag |= be(n) ? 8 : 16), On > 0 && // avoid a block node from tracking itself
  !l && // has current parent block
  Ue && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (a.patchFlag > 0 || i & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  a.patchFlag !== 32 && Ue.push(a), a;
}
const Se = La;
function La(e, t = null, n = null, s = 0, o = null, i = !1) {
  if ((!e || e === Qr) && (e = Ie), wn(e)) {
    const r = Ot(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && vo(r, n), On > 0 && !i && Ue && (r.shapeFlag & 6 ? Ue[Ue.indexOf(e)] = r : Ue.push(r)), r.patchFlag = -2, r;
  }
  if (Va(e) && (e = e.__vccOpts), t) {
    t = Na(t);
    let { class: r, style: a } = t;
    r && !be(r) && (t.class = he(r)), ye(a) && (uo(a) && !J(a) && (a = Ee({}, a)), t.style = tt(a));
  }
  const l = be(e) ? 1 : xl(e) ? 128 : Ji(e) ? 64 : ye(e) ? 4 : Q(e) ? 2 : 0;
  return h(
    e,
    t,
    n,
    s,
    o,
    l,
    i,
    !0
  );
}
function Na(e) {
  return e ? uo(e) || ml(e) ? Ee({}, e) : e : null;
}
function Ot(e, t, n = !1, s = !1) {
  const { props: o, ref: i, patchFlag: l, children: r, transition: a } = e, f = t ? Pa(o || {}, t) : o, c = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: f,
    key: f && kl(f),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && i ? J(i) ? i.concat(Yn(t)) : [i, Yn(t)] : Yn(t)
    ) : i,
    scopeId: e.scopeId,
    slotScopeIds: e.slotScopeIds,
    children: r,
    target: e.target,
    targetStart: e.targetStart,
    targetAnchor: e.targetAnchor,
    staticCount: e.staticCount,
    shapeFlag: e.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: t && e.type !== ae ? l === -1 ? 16 : l | 16 : l,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: a,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && Ot(e.ssContent),
    ssFallback: e.ssFallback && Ot(e.ssFallback),
    placeholder: e.placeholder,
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce
  };
  return a && s && Pn(
    c,
    a.clone(c)
  ), c;
}
function ft(e = " ", t = 0) {
  return Se(_s, null, e, t);
}
function _e(e = "", t = !1) {
  return t ? ($(), We(Ie, null, e)) : Se(Ie, null, e);
}
function ut(e) {
  return e == null || typeof e == "boolean" ? Se(Ie) : J(e) ? Se(
    ae,
    null,
    // #3666, avoid reference pollution when reusing vnode
    e.slice()
  ) : wn(e) ? Lt(e) : Se(_s, null, String(e));
}
function Lt(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : Ot(e);
}
function vo(e, t) {
  let n = 0;
  const { shapeFlag: s } = e;
  if (t == null)
    t = null;
  else if (J(t))
    n = 16;
  else if (typeof t == "object")
    if (s & 65) {
      const o = t.default;
      o && (o._c && (o._d = !1), vo(e, o()), o._c && (o._d = !0));
      return;
    } else {
      n = 32;
      const o = t._;
      !o && !ml(t) ? t._ctx = Le : o === 3 && Le && (Le.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else Q(t) ? (t = { default: t, _ctx: Le }, n = 32) : (t = String(t), s & 64 ? (n = 16, t = [ft(t)]) : n = 8);
  e.children = t, e.shapeFlag |= n;
}
function Pa(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const s = e[n];
    for (const o in s)
      if (o === "class")
        t.class !== s.class && (t.class = he([t.class, s.class]));
      else if (o === "style")
        t.style = tt([t.style, s.style]);
      else if (us(o)) {
        const i = t[o], l = s[o];
        l && i !== l && !(J(i) && i.includes(l)) && (t[o] = i ? [].concat(i, l) : l);
      } else o !== "" && (t[o] = s[o]);
  }
  return t;
}
function at(e, t, n, s = null) {
  st(e, t, 7, [
    n,
    s
  ]);
}
const Oa = ul();
let wa = 0;
function Fa(e, t, n) {
  const s = e.type, o = (t ? t.appContext : e.appContext) || Oa, i = {
    uid: wa++,
    vnode: e,
    type: s,
    parent: t,
    appContext: o,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    job: null,
    scope: new rr(
      !0
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: t ? t.provides : Object.create(o.provides),
    ids: t ? t.ids : ["", 0, 0],
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: yl(s, o),
    emitsOptions: pl(s, o),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: ge,
    // inheritAttrs
    inheritAttrs: s.inheritAttrs,
    // state
    ctx: ge,
    data: ge,
    props: ge,
    attrs: ge,
    slots: ge,
    refs: ge,
    setupState: ge,
    setupContext: null,
    // suspense related
    suspense: n,
    suspenseId: n ? n.pendingId : 0,
    asyncDep: null,
    asyncResolved: !1,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: !1,
    isUnmounted: !1,
    isDeactivated: !1,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  return i.ctx = { _: i }, i.root = t ? t.root : i, i.emit = pa.bind(null, i), e.ce && e.ce(i), i;
}
let Fe = null;
const $l = () => Fe || Le;
let ls, qs;
{
  const e = ps(), t = (n, s) => {
    let o;
    return (o = e[n]) || (o = e[n] = []), o.push(s), (i) => {
      o.length > 1 ? o.forEach((l) => l(i)) : o[0](i);
    };
  };
  ls = t(
    "__VUE_INSTANCE_SETTERS__",
    (n) => Fe = n
  ), qs = t(
    "__VUE_SSR_SETTERS__",
    (n) => Fn = n
  );
}
const Hn = (e) => {
  const t = Fe;
  return ls(e), e.scope.on(), () => {
    e.scope.off(), ls(t);
  };
}, Vo = () => {
  Fe && Fe.scope.off(), ls(null);
};
function El(e) {
  return e.vnode.shapeFlag & 4;
}
let Fn = !1;
function Ra(e, t = !1, n = !1) {
  t && qs(t);
  const { props: s, children: o } = e.vnode, i = El(e);
  _a(e, s, i, t), xa(e, o, n || t);
  const l = i ? Da(e, t) : void 0;
  return t && qs(!1), l;
}
function Da(e, t) {
  const n = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, ea);
  const { setup: s } = n;
  if (s) {
    St();
    const o = e.setupContext = s.length > 1 ? Ha(e) : null, i = Hn(e), l = jn(
      s,
      e,
      0,
      [
        e.props,
        o
      ]
    ), r = bi(l);
    if (xt(), i(), (r || e.sp) && !nn(e) && ol(e), r) {
      if (l.then(Vo, Vo), t)
        return l.then((a) => {
          Bo(e, a);
        }).catch((a) => {
          gs(a, e, 0);
        });
      e.asyncDep = l;
    } else
      Bo(e, l);
  } else
    Al(e);
}
function Bo(e, t, n) {
  Q(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : ye(t) && (e.setupState = Bi(t)), Al(e);
}
function Al(e, t, n) {
  const s = e.type;
  e.render || (e.render = s.render || pt);
  {
    const o = Hn(e);
    St();
    try {
      ta(e);
    } finally {
      xt(), o();
    }
  }
}
const ja = {
  get(e, t) {
    return Me(e, "get", ""), e[t];
  }
};
function Ha(e) {
  const t = (n) => {
    e.exposed = n || {};
  };
  return {
    attrs: new Proxy(e.attrs, ja),
    slots: e.slots,
    emit: e.emit,
    expose: t
  };
}
function bs(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(Bi(Ar(e.exposed)), {
    get(t, n) {
      if (n in t)
        return t[n];
      if (n in En)
        return En[n](e);
    },
    has(t, n) {
      return n in t || n in En;
    }
  })) : e.proxy;
}
function Va(e) {
  return Q(e) && "__vccOpts" in e;
}
const G = (e, t) => Pr(e, t, Fn);
function Ml(e, t, n) {
  try {
    is(-1);
    const s = arguments.length;
    return s === 2 ? ye(t) && !J(t) ? wn(t) ? Se(e, null, [t]) : Se(e, t) : Se(e, null, t) : (s > 3 ? n = Array.prototype.slice.call(arguments, 2) : s === 3 && wn(n) && (n = [n]), Se(e, t, n));
  } finally {
    is(1);
  }
}
const Ba = "3.5.25";
/**
* @vue/runtime-dom v3.5.25
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let Js;
const zo = typeof window < "u" && window.trustedTypes;
if (zo)
  try {
    Js = /* @__PURE__ */ zo.createPolicy("vue", {
      createHTML: (e) => e
    });
  } catch {
  }
const Il = Js ? (e) => Js.createHTML(e) : (e) => e, za = "http://www.w3.org/2000/svg", Wa = "http://www.w3.org/1998/Math/MathML", yt = typeof document < "u" ? document : null, Wo = yt && /* @__PURE__ */ yt.createElement("template"), Ua = {
  insert: (e, t, n) => {
    t.insertBefore(e, n || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, n, s) => {
    const o = t === "svg" ? yt.createElementNS(za, e) : t === "mathml" ? yt.createElementNS(Wa, e) : n ? yt.createElement(e, { is: n }) : yt.createElement(e);
    return e === "select" && s && s.multiple != null && o.setAttribute("multiple", s.multiple), o;
  },
  createText: (e) => yt.createTextNode(e),
  createComment: (e) => yt.createComment(e),
  setText: (e, t) => {
    e.nodeValue = t;
  },
  setElementText: (e, t) => {
    e.textContent = t;
  },
  parentNode: (e) => e.parentNode,
  nextSibling: (e) => e.nextSibling,
  querySelector: (e) => yt.querySelector(e),
  setScopeId(e, t) {
    e.setAttribute(t, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(e, t, n, s, o, i) {
    const l = n ? n.previousSibling : t.lastChild;
    if (o && (o === i || o.nextSibling))
      for (; t.insertBefore(o.cloneNode(!0), n), !(o === i || !(o = o.nextSibling)); )
        ;
    else {
      Wo.innerHTML = Il(
        s === "svg" ? `<svg>${e}</svg>` : s === "mathml" ? `<math>${e}</math>` : e
      );
      const r = Wo.content;
      if (s === "svg" || s === "mathml") {
        const a = r.firstChild;
        for (; a.firstChild; )
          r.appendChild(a.firstChild);
        r.removeChild(a);
      }
      t.insertBefore(r, n);
    }
    return [
      // first
      l ? l.nextSibling : t.firstChild,
      // last
      n ? n.previousSibling : t.lastChild
    ];
  }
}, At = "transition", mn = "animation", Rn = Symbol("_vtc"), Ll = {
  name: String,
  type: String,
  css: {
    type: Boolean,
    default: !0
  },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String
}, Ka = /* @__PURE__ */ Ee(
  {},
  Qi,
  Ll
), Ga = (e) => (e.displayName = "Transition", e.props = Ka, e), Ys = /* @__PURE__ */ Ga(
  (e, { slots: t }) => Ml(Br, qa(e), t)
), Dt = (e, t = []) => {
  J(e) ? e.forEach((n) => n(...t)) : e && e(...t);
}, Uo = (e) => e ? J(e) ? e.some((t) => t.length > 1) : e.length > 1 : !1;
function qa(e) {
  const t = {};
  for (const A in e)
    A in Ll || (t[A] = e[A]);
  if (e.css === !1)
    return t;
  const {
    name: n = "v",
    type: s,
    duration: o,
    enterFromClass: i = `${n}-enter-from`,
    enterActiveClass: l = `${n}-enter-active`,
    enterToClass: r = `${n}-enter-to`,
    appearFromClass: a = i,
    appearActiveClass: f = l,
    appearToClass: c = r,
    leaveFromClass: d = `${n}-leave-from`,
    leaveActiveClass: m = `${n}-leave-active`,
    leaveToClass: v = `${n}-leave-to`
  } = e, E = Ja(o), S = E && E[0], I = E && E[1], {
    onBeforeEnter: _,
    onEnter: g,
    onEnterCancelled: C,
    onLeave: b,
    onLeaveCancelled: V,
    onBeforeAppear: q = _,
    onAppear: se = g,
    onAppearCancelled: te = C
  } = t, z = (A, F, D, ne) => {
    A._enterCancelled = ne, jt(A, F ? c : r), jt(A, F ? f : l), D && D();
  }, ee = (A, F) => {
    A._isLeaving = !1, jt(A, d), jt(A, v), jt(A, m), F && F();
  }, ce = (A) => (F, D) => {
    const ne = A ? se : g, X = () => z(F, A, D);
    Dt(ne, [F, X]), Ko(() => {
      jt(F, A ? a : i), vt(F, A ? c : r), Uo(ne) || Go(F, s, S, X);
    });
  };
  return Ee(t, {
    onBeforeEnter(A) {
      Dt(_, [A]), vt(A, i), vt(A, l);
    },
    onBeforeAppear(A) {
      Dt(q, [A]), vt(A, a), vt(A, f);
    },
    onEnter: ce(!1),
    onAppear: ce(!0),
    onLeave(A, F) {
      A._isLeaving = !0;
      const D = () => ee(A, F);
      vt(A, d), A._enterCancelled ? (vt(A, m), Yo(A)) : (Yo(A), vt(A, m)), Ko(() => {
        A._isLeaving && (jt(A, d), vt(A, v), Uo(b) || Go(A, s, I, D));
      }), Dt(b, [A, D]);
    },
    onEnterCancelled(A) {
      z(A, !1, void 0, !0), Dt(C, [A]);
    },
    onAppearCancelled(A) {
      z(A, !0, void 0, !0), Dt(te, [A]);
    },
    onLeaveCancelled(A) {
      ee(A), Dt(V, [A]);
    }
  });
}
function Ja(e) {
  if (e == null)
    return null;
  if (ye(e))
    return [Ns(e.enter), Ns(e.leave)];
  {
    const t = Ns(e);
    return [t, t];
  }
}
function Ns(e) {
  return er(e);
}
function vt(e, t) {
  t.split(/\s+/).forEach((n) => n && e.classList.add(n)), (e[Rn] || (e[Rn] = /* @__PURE__ */ new Set())).add(t);
}
function jt(e, t) {
  t.split(/\s+/).forEach((s) => s && e.classList.remove(s));
  const n = e[Rn];
  n && (n.delete(t), n.size || (e[Rn] = void 0));
}
function Ko(e) {
  requestAnimationFrame(() => {
    requestAnimationFrame(e);
  });
}
let Ya = 0;
function Go(e, t, n, s) {
  const o = e._endId = ++Ya, i = () => {
    o === e._endId && s();
  };
  if (n != null)
    return setTimeout(i, n);
  const { type: l, timeout: r, propCount: a } = Za(e, t);
  if (!l)
    return s();
  const f = l + "end";
  let c = 0;
  const d = () => {
    e.removeEventListener(f, m), i();
  }, m = (v) => {
    v.target === e && ++c >= a && d();
  };
  setTimeout(() => {
    c < a && d();
  }, r + 1), e.addEventListener(f, m);
}
function Za(e, t) {
  const n = window.getComputedStyle(e), s = (E) => (n[E] || "").split(", "), o = s(`${At}Delay`), i = s(`${At}Duration`), l = qo(o, i), r = s(`${mn}Delay`), a = s(`${mn}Duration`), f = qo(r, a);
  let c = null, d = 0, m = 0;
  t === At ? l > 0 && (c = At, d = l, m = i.length) : t === mn ? f > 0 && (c = mn, d = f, m = a.length) : (d = Math.max(l, f), c = d > 0 ? l > f ? At : mn : null, m = c ? c === At ? i.length : a.length : 0);
  const v = c === At && /\b(?:transform|all)(?:,|$)/.test(
    s(`${At}Property`).toString()
  );
  return {
    type: c,
    timeout: d,
    propCount: m,
    hasTransform: v
  };
}
function qo(e, t) {
  for (; e.length < t.length; )
    e = e.concat(e);
  return Math.max(...t.map((n, s) => Jo(n) + Jo(e[s])));
}
function Jo(e) {
  return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function Yo(e) {
  return (e ? e.ownerDocument : document).body.offsetHeight;
}
function Xa(e, t, n) {
  const s = e[Rn];
  s && (t = (t ? [t, ...s] : [...s]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
const rs = Symbol("_vod"), Nl = Symbol("_vsh"), Zo = {
  // used for prop mismatch check during hydration
  name: "show",
  beforeMount(e, { value: t }, { transition: n }) {
    e[rs] = e.style.display === "none" ? "" : e.style.display, n && t ? n.beforeEnter(e) : vn(e, t);
  },
  mounted(e, { value: t }, { transition: n }) {
    n && t && n.enter(e);
  },
  updated(e, { value: t, oldValue: n }, { transition: s }) {
    !t != !n && (s ? t ? (s.beforeEnter(e), vn(e, !0), s.enter(e)) : s.leave(e, () => {
      vn(e, !1);
    }) : vn(e, t));
  },
  beforeUnmount(e, { value: t }) {
    vn(e, t);
  }
};
function vn(e, t) {
  e.style.display = t ? e[rs] : "none", e[Nl] = !t;
}
const Qa = Symbol(""), ec = /(?:^|;)\s*display\s*:/;
function tc(e, t, n) {
  const s = e.style, o = be(n);
  let i = !1;
  if (n && !o) {
    if (t)
      if (be(t))
        for (const l of t.split(";")) {
          const r = l.slice(0, l.indexOf(":")).trim();
          n[r] == null && Zn(s, r, "");
        }
      else
        for (const l in t)
          n[l] == null && Zn(s, l, "");
    for (const l in n)
      l === "display" && (i = !0), Zn(s, l, n[l]);
  } else if (o) {
    if (t !== n) {
      const l = s[Qa];
      l && (n += ";" + l), s.cssText = n, i = ec.test(n);
    }
  } else t && e.removeAttribute("style");
  rs in e && (e[rs] = i ? s.display : "", e[Nl] && (s.display = "none"));
}
const Xo = /\s*!important$/;
function Zn(e, t, n) {
  if (J(n))
    n.forEach((s) => Zn(e, t, s));
  else if (n == null && (n = ""), t.startsWith("--"))
    e.setProperty(t, n);
  else {
    const s = nc(e, t);
    Xo.test(n) ? e.setProperty(
      qt(s),
      n.replace(Xo, ""),
      "important"
    ) : e[s] = n;
  }
}
const Qo = ["Webkit", "Moz", "ms"], Ps = {};
function nc(e, t) {
  const n = Ps[t];
  if (n)
    return n;
  let s = Pt(t);
  if (s !== "filter" && s in e)
    return Ps[t] = s;
  s = xi(s);
  for (let o = 0; o < Qo.length; o++) {
    const i = Qo[o] + s;
    if (i in e)
      return Ps[t] = i;
  }
  return t;
}
const ei = "http://www.w3.org/1999/xlink";
function ti(e, t, n, s, o, i = lr(t)) {
  s && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(ei, t.slice(6, t.length)) : e.setAttributeNS(ei, t, n) : n == null || i && !ki(n) ? e.removeAttribute(t) : e.setAttribute(
    t,
    i ? "" : kt(n) ? String(n) : n
  );
}
function ni(e, t, n, s, o) {
  if (t === "innerHTML" || t === "textContent") {
    n != null && (e[t] = t === "innerHTML" ? Il(n) : n);
    return;
  }
  const i = e.tagName;
  if (t === "value" && i !== "PROGRESS" && // custom elements may use _value internally
  !i.includes("-")) {
    const r = i === "OPTION" ? e.getAttribute("value") || "" : e.value, a = n == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      e.type === "checkbox" ? "on" : ""
    ) : String(n);
    (r !== a || !("_value" in e)) && (e.value = a), n == null && e.removeAttribute(t), e._value = n;
    return;
  }
  let l = !1;
  if (n === "" || n == null) {
    const r = typeof e[t];
    r === "boolean" ? n = ki(n) : n == null && r === "string" ? (n = "", l = !0) : r === "number" && (n = 0, l = !0);
  }
  try {
    e[t] = n;
  } catch {
  }
  l && e.removeAttribute(o || t);
}
function Zt(e, t, n, s) {
  e.addEventListener(t, n, s);
}
function sc(e, t, n, s) {
  e.removeEventListener(t, n, s);
}
const si = Symbol("_vei");
function oc(e, t, n, s, o = null) {
  const i = e[si] || (e[si] = {}), l = i[t];
  if (s && l)
    l.value = s;
  else {
    const [r, a] = ic(t);
    if (s) {
      const f = i[t] = ac(
        s,
        o
      );
      Zt(e, r, f, a);
    } else l && (sc(e, r, l, a), i[t] = void 0);
  }
}
const oi = /(?:Once|Passive|Capture)$/;
function ic(e) {
  let t;
  if (oi.test(e)) {
    t = {};
    let s;
    for (; s = e.match(oi); )
      e = e.slice(0, e.length - s[0].length), t[s[0].toLowerCase()] = !0;
  }
  return [e[2] === ":" ? e.slice(3) : qt(e.slice(2)), t];
}
let Os = 0;
const lc = /* @__PURE__ */ Promise.resolve(), rc = () => Os || (lc.then(() => Os = 0), Os = Date.now());
function ac(e, t) {
  const n = (s) => {
    if (!s._vts)
      s._vts = Date.now();
    else if (s._vts <= n.attached)
      return;
    st(
      cc(s, n.value),
      t,
      5,
      [s]
    );
  };
  return n.value = e, n.attached = rc(), n;
}
function cc(e, t) {
  if (J(t)) {
    const n = e.stopImmediatePropagation;
    return e.stopImmediatePropagation = () => {
      n.call(e), e._stopped = !0;
    }, t.map(
      (s) => (o) => !o._stopped && s && s(o)
    );
  } else
    return t;
}
const ii = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // lowercase letter
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, uc = (e, t, n, s, o, i) => {
  const l = o === "svg";
  t === "class" ? Xa(e, s, l) : t === "style" ? tc(e, n, s) : us(t) ? eo(t) || oc(e, t, n, s, i) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : dc(e, t, s, l)) ? (ni(e, t, s), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && ti(e, t, s, l, i, t !== "value")) : /* #11081 force set props for possible async custom element */ e._isVueCE && (/[A-Z]/.test(t) || !be(s)) ? ni(e, Pt(t), s, i, t) : (t === "true-value" ? e._trueValue = s : t === "false-value" && (e._falseValue = s), ti(e, t, s, l));
};
function dc(e, t, n, s) {
  if (s)
    return !!(t === "innerHTML" || t === "textContent" || t in e && ii(t) && Q(n));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (t === "width" || t === "height") {
    const o = e.tagName;
    if (o === "IMG" || o === "VIDEO" || o === "CANVAS" || o === "SOURCE")
      return !1;
  }
  return ii(t) && be(n) ? !1 : t in e;
}
const li = (e) => {
  const t = e.props["onUpdate:modelValue"] || !1;
  return J(t) ? (n) => qn(t, n) : t;
};
function fc(e) {
  e.target.composing = !0;
}
function ri(e) {
  const t = e.target;
  t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
const ws = Symbol("_assign");
function ai(e, t, n) {
  return t && (e = e.trim()), n && (e = so(e)), e;
}
const dt = {
  created(e, { modifiers: { lazy: t, trim: n, number: s } }, o) {
    e[ws] = li(o);
    const i = s || o.props && o.props.type === "number";
    Zt(e, t ? "change" : "input", (l) => {
      l.target.composing || e[ws](ai(e.value, n, i));
    }), (n || i) && Zt(e, "change", () => {
      e.value = ai(e.value, n, i);
    }), t || (Zt(e, "compositionstart", fc), Zt(e, "compositionend", ri), Zt(e, "change", ri));
  },
  // set value on mounted so it's after min/max for type="range"
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: s, trim: o, number: i } }, l) {
    if (e[ws] = li(l), e.composing) return;
    const r = (i || e.type === "number") && !/^0\d/.test(e.value) ? so(e.value) : e.value, a = t ?? "";
    r !== a && (document.activeElement === e && e.type !== "range" && (s && t === n || o && e.value.trim() === a) || (e.value = a));
  }
}, pc = ["ctrl", "shift", "alt", "meta"], hc = {
  stop: (e) => e.stopPropagation(),
  prevent: (e) => e.preventDefault(),
  self: (e) => e.target !== e.currentTarget,
  ctrl: (e) => !e.ctrlKey,
  shift: (e) => !e.shiftKey,
  alt: (e) => !e.altKey,
  meta: (e) => !e.metaKey,
  left: (e) => "button" in e && e.button !== 0,
  middle: (e) => "button" in e && e.button !== 1,
  right: (e) => "button" in e && e.button !== 2,
  exact: (e, t) => pc.some((n) => e[`${n}Key`] && !t.includes(n))
}, Te = (e, t) => {
  const n = e._withMods || (e._withMods = {}), s = t.join(".");
  return n[s] || (n[s] = ((o, ...i) => {
    for (let l = 0; l < t.length; l++) {
      const r = hc[t[l]];
      if (r && r(o, t)) return;
    }
    return e(o, ...i);
  }));
}, gc = /* @__PURE__ */ Ee({ patchProp: uc }, Ua);
let ci;
function mc() {
  return ci || (ci = ka(gc));
}
const Pl = ((...e) => {
  const t = mc().createApp(...e), { mount: n } = t;
  return t.mount = (s) => {
    const o = yc(s);
    if (!o) return;
    const i = t._component;
    !Q(i) && !i.render && !i.template && (i.template = o.innerHTML), o.nodeType === 1 && (o.textContent = "");
    const l = n(o, !1, vc(o));
    return o instanceof Element && (o.removeAttribute("v-cloak"), o.setAttribute("data-v-app", "")), l;
  }, t;
});
function vc(e) {
  if (e instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function yc(e) {
  return be(e) ? document.querySelector(e) : e;
}
function Ol(e) {
  const t = `[data-node-id="${e}"]`;
  let n = document.querySelectorAll(`.lg-node${t}`);
  n.length === 0 && (n = document.querySelectorAll(t));
  for (let s = 0; s < n.length; s++) {
    const o = n[s];
    if (o.offsetParent !== null)
      return o;
  }
  return n.length > 0 ? n[0] : null;
}
function _c(e) {
  const t = Ol(e);
  return t ? t.querySelector(".lg-node-widgets") : null;
}
function bc(e) {
  return Number.isFinite(e) ? Math.max(0, Math.min(1, e)) : 0;
}
function Cc(e) {
  const t = e.trim().match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+\s*)?\)$/i);
  return t ? { r: Number(t[1]), g: Number(t[2]), b: Number(t[3]) } : null;
}
function Sc(e) {
  const t = e.trim();
  if (!t.startsWith("#")) return null;
  const n = t.slice(1);
  if (n.length === 3) {
    const s = parseInt(n[0] + n[0], 16), o = parseInt(n[1] + n[1], 16), i = parseInt(n[2] + n[2], 16);
    return { r: s, g: o, b: i };
  }
  if (n.length === 6) {
    const s = parseInt(n.slice(0, 2), 16), o = parseInt(n.slice(2, 4), 16), i = parseInt(n.slice(4, 6), 16);
    return { r: s, g: o, b: i };
  }
  return null;
}
function Fs(e, t) {
  const n = bc(t);
  return `rgba(${e.r}, ${e.g}, ${e.b}, ${n})`;
}
function ui(e) {
  const t = e.trim().toLowerCase();
  return t === "transparent" || t === "rgba(0, 0, 0, 0)" || t === "rgba(0,0,0,0)";
}
function xc(e) {
  try {
    const t = getComputedStyle(e), n = [
      "--node-color",
      "--comfy-node-color",
      "--lg-node-color",
      "--node-accent",
      "--node-accent-color"
    ];
    for (const i of n) {
      const l = t.getPropertyValue(i).trim();
      if (l) return l;
    }
    const s = e.querySelector(".lg-node-header") ?? e.querySelector(".lg-node-titlebar") ?? e.querySelector(".lg-node-title");
    if (s) {
      const i = getComputedStyle(s).backgroundColor;
      if (i && !ui(i)) return i;
    }
    const o = t.borderTopColor || t.borderColor;
    if (o && !ui(o)) return o;
  } catch {
  }
  return null;
}
const Tc = { class: "header__title" }, kc = ["title"], $c = {
  key: 1,
  class: "header-actions"
}, Ec = { class: "body-wrap" }, Ac = /* @__PURE__ */ Ke({
  __name: "HikazeNodeFrame",
  props: {
    nodeId: {},
    title: {},
    error: {}
  },
  setup(e) {
    const t = e, n = B(null);
    let s = null, o = null;
    const i = B(null), l = G(() => {
      const d = i.value;
      return d ? Cc(d) ?? Sc(d) : null;
    }), r = G(() => {
      const d = l.value;
      return {
        position: "absolute",
        inset: "0",
        zIndex: "60",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        padding: "8px",
        borderRadius: "10px",
        background: "rgba(15, 17, 23, 0.92)",
        border: `1px solid ${d ? Fs(d, 0.65) : "rgba(255, 255, 255, 0.08)"}`,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        overflow: "hidden",
        "--hikaze-cell-size": "22px",
        "--hikaze-num-col-width": "5ch",
        color: "#e8ecf2",
        pointerEvents: "auto",
        cursor: "default"
      };
    }), a = G(() => {
      const d = l.value, m = d ? Fs(d, 0.22) : "rgba(255, 255, 255, 0.06)", v = d ? Fs(d, 0.35) : "rgba(255, 255, 255, 0.1)";
      return {
        background: m,
        border: `1px solid ${v}`
      };
    });
    function f(d = 100) {
      const m = _c(t.nodeId);
      if (m) {
        m.style.position = m.style.position || "relative", m.style.width = "100%", m.style.height = "100%", n.value = m, c();
        return;
      }
      d > 0 && (s = window.setTimeout(() => f(d - 1), 100));
    }
    function c() {
      const d = Ol(t.nodeId);
      d && (i.value = xc(d), o || (o = new MutationObserver(() => c()), o.observe(d, { attributes: !0, attributeFilter: ["style", "class"] })));
    }
    return wt(() => {
      f();
    }), fn(() => {
      s && clearTimeout(s), o && o.disconnect();
    }), (d, m) => n.value ? ($(), We(Zi, {
      key: 0,
      to: n.value
    }, [
      h("div", {
        class: "hikaze-node-frame",
        style: tt(r.value),
        onPointerdown: m[0] || (m[0] = Te(() => {
        }, ["stop"])),
        onPointermove: m[1] || (m[1] = Te(() => {
        }, ["stop"])),
        onPointerup: m[2] || (m[2] = Te(() => {
        }, ["stop"])),
        onContextmenu: m[3] || (m[3] = Te(() => {
        }, ["stop"]))
      }, [
        e.title ? ($(), L("div", {
          key: 0,
          class: "header",
          style: tt(a.value)
        }, [
          h("div", Tc, oe(e.title), 1),
          e.error ? ($(), L("div", {
            key: 0,
            class: "header__error",
            title: e.error
          }, oe(e.error), 9, kc)) : _e("", !0),
          d.$slots["header-actions"] ? ($(), L("div", $c, [
            $n(d.$slots, "header-actions", {}, void 0)
          ])) : _e("", !0)
        ], 4)) : _e("", !0),
        h("div", Ec, [
          $n(d.$slots, "default", {}, void 0)
        ])
      ], 36)
    ], 8, ["to"])) : _e("", !0);
  }
}), Ge = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, o] of t)
    n[s] = o;
  return n;
}, wl = /* @__PURE__ */ Ge(Ac, [["__scopeId", "data-v-476df293"]]), Mc = { class: "hikaze-checkpoint-content" }, Ic = ["title"], Lc = { class: "value" }, Nc = /* @__PURE__ */ Ke({
  __name: "HikazeCheckpointLoaderOverlay",
  props: {
    nodeId: {},
    payload: {},
    commit: { type: Function },
    title: {}
  },
  setup(e) {
    const t = e, n = on("openManager", null), s = G(() => {
      try {
        return JSON.parse(t.payload.value || "{}").ckpt_path || "";
      } catch {
        return "";
      }
    });
    async function o() {
      if (!n) {
        console.warn("openManager is not available");
        return;
      }
      const i = await n({
        mode: "single",
        initialTab: "checkpoints",
        title: "Select Checkpoint"
      });
      if (!i || typeof i != "object" || !("ckpt_path" in i))
        return;
      const l = i.ckpt_path, r = s.value;
      l && l !== r && t.commit(JSON.stringify({ ckpt_path: l }));
    }
    return (i, l) => ($(), We(wl, {
      "node-id": e.nodeId,
      title: "Hikaze Checkpoint Loader"
    }, {
      "header-actions": ht(() => [
        h("button", {
          type: "button",
          class: "btn header-action-btn",
          onClick: o
        }, " Select Checkpoint... ")
      ]),
      default: ht(() => [
        h("div", Mc, [
          h("div", {
            class: "path-display",
            title: s.value
          }, [
            l[0] || (l[0] = h("div", { class: "label" }, "Current Path:", -1)),
            h("div", Lc, oe(s.value || "(No path selected)"), 1)
          ], 8, Ic)
        ])
      ]),
      _: 1
    }, 8, ["node-id"]));
  }
}), Pc = /* @__PURE__ */ Ge(Nc, [["__scopeId", "data-v-4552b61a"]]), as = B(!1), yo = B(null);
let Xn = null;
const yn = Qn({
  isOpen: as,
  options: yo
});
function Oc(e) {
  return as.value && Xt(null), as.value = !0, yo.value = e, new Promise((t) => {
    Xn = t;
  });
}
function Xt(e) {
  as.value = !1, yo.value = null, Xn && (Xn(e), Xn = null);
}
const Rs = "hikaze_payload";
class Kt {
  constructor(t) {
    ke(this, "node");
    /** Reactive copy of the `hikaze_payload` widget value. */
    ke(this, "payloadRef", B("{}"));
    ke(this, "injectedMode", null);
    ke(this, "cleanupFns", []);
    ke(this, "vueApp", null);
    ke(this, "vueHost", null);
    ke(this, "vueMountRetryTimer", null);
    ke(this, "onWidgetChangedOriginal", null);
    ke(this, "onWidgetChangedWrapper", null);
    ke(this, "hydrationSyncTimers", []);
    this.node = t;
  }
  static register(t, n) {
    this.registry.set(t, n);
  }
  static resolve(t) {
    return this.registry.get(t);
  }
  /**
   * Provide the Vue component to render inside the frame.
   * Subclasses MUST implement this.
   */
  getComponent() {
    return null;
  }
  /**
   * Provide additional props for the component.
   * Default provides nothing; `nodeId`, `payload`, `commit` are passed automatically.
   */
  getComponentProps() {
    return {};
  }
  /** Override title if needed. Default is node.title. */
  getTitle() {
    var t;
    return ((t = this.node) == null ? void 0 : t.title) ?? "Hikaze Node";
  }
  inject(t) {
    if (this.node.id == null || this.node.id === -1) {
      setTimeout(() => this.inject(t), 200);
      return;
    }
    this.injectedMode && this.injectedMode !== t.mode && this.dispose(), this.ensureWidgetChangeHook(), this.syncFromWidget(), this.scheduleHydrationSync(t), t.mode === "vue" && this.ensureFrameMounted(t), this.injectedMode = t.mode;
  }
  reinject(t) {
    this.dispose(), this.inject(t);
  }
  dispose() {
    if (this.clearHydrationSync(), this.unhookWidgetChange(), this.vueMountRetryTimer != null && (window.clearTimeout(this.vueMountRetryTimer), this.vueMountRetryTimer = null), this.vueApp) {
      try {
        this.vueApp.unmount();
      } catch {
      }
      this.vueApp = null;
    }
    if (this.vueHost) {
      try {
        this.vueHost.remove();
      } catch {
      }
      this.vueHost = null;
    }
    this.cleanupFns.forEach((t) => {
      try {
        t();
      } catch {
      }
    }), this.cleanupFns = [], this.injectedMode = null;
  }
  findWidget(t) {
    var s;
    const n = (s = this.node) == null ? void 0 : s.widgets;
    return Array.isArray(n) ? n.find((o) => (o == null ? void 0 : o.name) === t) ?? null : null;
  }
  /**
   * Hook a legacy widget's mouse interaction to trigger a custom callback.
   * Returns true to prevent default behavior (e.g. preventing text edit mode).
   */
  hookLegacyWidgetClick(t, n) {
    const s = this.findWidget(t);
    if (!s) return;
    const o = s.mouse;
    s.mouse = (i, l, r) => {
      if (i.type === "pointerdown" || i.type === "mousedown") {
        const a = String(s.value ?? ""), f = n(a);
        return f !== null && f !== a && this.commitPayload(f), !0;
      }
      return o ? o.call(s, i, l, r) : void 0;
    }, this.cleanupFns.push(() => {
      s.mouse = o;
    });
  }
  setWidgetValue(t, n) {
    var o, i, l;
    const s = t == null ? void 0 : t.value;
    if (n !== s) {
      t.value = n;
      try {
        (o = t.callback) == null || o.call(t, t.value);
      } catch {
      }
      try {
        (l = (i = this.node) == null ? void 0 : i.onWidgetChanged) == null || l.call(i, t.name ?? "", t.value, s, t);
      } catch {
      }
      try {
        this.node.graph && this.node.graph.setDirtyCanvas(!0, !0);
      } catch {
      }
    }
  }
  /**
   * Commit a new JSON string to the payload widget.
   */
  commitPayload(t) {
    const n = this.findWidget(Rs);
    if (!n) return;
    const s = String(t ?? "{}");
    this.setWidgetValue(n, s), this.payloadRef.value = s;
  }
  // --- Widget Sync Logic ---
  ensureWidgetChangeHook() {
    const t = this.node;
    !t || typeof t != "object" || this.onWidgetChangedWrapper || (this.onWidgetChangedOriginal = t.onWidgetChanged, this.onWidgetChangedWrapper = (n, s, o, i) => {
      n === Rs && (this.payloadRef.value = String(s ?? "{}"));
      const l = this.onWidgetChangedOriginal;
      if (typeof l == "function")
        try {
          return l.call(t, n, s, o, i);
        } catch {
        }
    }, t.onWidgetChanged = this.onWidgetChangedWrapper);
  }
  unhookWidgetChange() {
    const t = this.node;
    !t || typeof t != "object" || (t.onWidgetChanged === this.onWidgetChangedWrapper && (t.onWidgetChanged = this.onWidgetChangedOriginal), this.onWidgetChangedOriginal = null, this.onWidgetChangedWrapper = null);
  }
  syncFromWidget() {
    const t = this.findWidget(Rs);
    t && (this.payloadRef.value = String(t.value ?? "{}"));
  }
  scheduleHydrationSync(t) {
    this.clearHydrationSync();
    const n = [0, 50, 150, 400, 800];
    for (const s of n) {
      const o = window.setTimeout(() => this.syncFromWidget(), s);
      this.hydrationSyncTimers.push(o);
    }
  }
  clearHydrationSync() {
    this.hydrationSyncTimers.forEach((t) => clearTimeout(t)), this.hydrationSyncTimers = [];
  }
  // --- Frame Mounting Logic ---
  ensureFrameMounted(t, n = 50) {
    var l;
    const s = (l = this.node) == null ? void 0 : l.id;
    if (s == null) {
      n > 0 && (this.vueMountRetryTimer = window.setTimeout(
        () => this.ensureFrameMounted(t, n - 1),
        50
      ));
      return;
    }
    if (this.vueApp) return;
    const o = document.createElement("div");
    o.style.display = "none", document.body.appendChild(o), this.vueHost = o;
    const i = Pl({
      render: () => Ml(this.getComponent(), {
        nodeId: s,
        title: this.getTitle(),
        // Pass title to Overlay if it wraps Frame
        ...this.getComponentProps(),
        // Standard props passed to all child components
        payload: this.payloadRef,
        commit: (r) => this.commitPayload(r)
      })
    });
    i.provide("openManager", Oc), i.mount(o), this.vueApp = i;
  }
}
ke(Kt, "registry", /* @__PURE__ */ new Map());
const wc = "HikazeCheckpointLoader";
class Fc extends Kt {
  getComponent() {
    return Pc;
  }
}
Kt.register(wc, Fc);
const Rc = ["title"], Dc = ["value"], jc = ["value"], Hc = { class: "center-chk" }, Vc = ["checked"], Bc = /* @__PURE__ */ Ke({
  __name: "HikazeLoraListElement",
  props: {
    seq: {},
    name: {},
    strength_model: {},
    strength_clip: {},
    enabled: { type: Boolean }
  },
  emits: ["update:strength_model", "update:strength_clip", "update:enabled", "update:delete"],
  setup(e, { emit: t }) {
    const n = e, s = G(
      () => {
        var f;
        return n.name && ((f = n.name.split(/[\\/]/).pop()) == null ? void 0 : f.replace(".safetensors", "")) || "";
      }
    ), o = t;
    function i(f) {
      const c = f.target;
      o("update:strength_model", n.seq, c.valueAsNumber);
    }
    function l(f) {
      const c = f.target;
      o("update:strength_clip", n.seq, c.valueAsNumber);
    }
    function r(f) {
      o("update:enabled", n.seq, f.target.checked);
    }
    function a(f) {
      o("update:delete", n.seq);
    }
    return (f, c) => ($(), L("tr", null, [
      h("td", null, [
        h("button", {
          class: "del-btn",
          onClick: a
        }, "🗑")
      ]),
      h("td", null, oe(n.seq + 1), 1),
      h("td", {
        title: s.value,
        class: "lora-name"
      }, oe(s.value), 9, Rc),
      h("td", null, [
        h("input", {
          class: "hikaze-reset-input",
          type: "number",
          value: n.strength_model,
          step: "0.05",
          onInput: i
        }, null, 40, Dc)
      ]),
      h("td", null, [
        h("input", {
          class: "hikaze-reset-input",
          type: "number",
          value: n.strength_clip,
          step: "0.05",
          onInput: l
        }, null, 40, jc)
      ]),
      h("td", Hc, [
        h("input", {
          class: "hikaze-reset-chk",
          type: "checkbox",
          checked: n.enabled,
          onInput: r
        }, null, 40, Vc)
      ])
    ]));
  }
}), zc = /* @__PURE__ */ Ge(Bc, [["__scopeId", "data-v-771e698c"]]);
function Fl(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function _n(e) {
  return typeof e == "string" ? e : null;
}
function Vt(e) {
  if (typeof e == "number" && Number.isFinite(e)) return e;
  if (typeof e == "string") {
    const t = Number(e);
    if (Number.isFinite(t)) return t;
  }
  return null;
}
function di(e) {
  return typeof e == "boolean" ? e : null;
}
function Rl(e) {
  if (!Fl(e)) return null;
  const t = _n(e.name) ?? "", n = _n(e.full_path) ?? _n(e.fullPath) ?? _n(e.path) ?? "", s = Vt(e.strength_model) ?? Vt(e.MStrength) ?? Vt(e.strengthModel) ?? 1, o = Vt(e.strength_clip) ?? Vt(e.CStrength) ?? Vt(e.strengthClip) ?? 1, i = di(e.enabled) ?? di(e.toggleOn) ?? !0, l = _n(e.sha256) ?? "";
  return {
    name: t,
    full_path: n,
    strength_model: s,
    strength_clip: o,
    sha256: l,
    enabled: i
  };
}
function Dl() {
  return { version: 2, loras: [] };
}
function Wc(e) {
  let t = 2, n = null;
  if (Array.isArray(e))
    n = e;
  else if (Fl(e)) {
    const o = Vt(e.version);
    o != null && (t = o), n = e.loras ?? e.LoRAs ?? e.LoRAList ?? e.loRAList ?? null;
  }
  if (!Array.isArray(n))
    return { version: t, loras: [] };
  const s = [];
  for (const o of n) {
    const i = Rl(o);
    i && s.push(i);
  }
  return { version: t, loras: s };
}
function jl(e) {
  const t = e.trim();
  if (!t) return Dl();
  let n;
  try {
    n = JSON.parse(t);
  } catch (s) {
    throw new Error(String((s == null ? void 0 : s.message) ?? s ?? "Invalid JSON"));
  }
  return Wc(n);
}
function fi(e) {
  return JSON.stringify(
    {
      version: Number(e.version) || 2,
      loras: e.loras.map((t) => ({
        name: String(t.name ?? ""),
        full_path: String(t.full_path ?? ""),
        strength_model: Number(t.strength_model) || 0,
        strength_clip: Number(t.strength_clip) || 0,
        sha256: String(t.sha256 ?? ""),
        enabled: !!t.enabled
      }))
    },
    null,
    2
  );
}
function Uc(e) {
  return Rl(e) ?? {
    full_path: "",
    strength_model: 1,
    strength_clip: 1,
    enabled: !0,
    name: "",
    sha256: ""
  };
}
const Kc = { class: "hikaze-lora-content" }, Gc = { class: "loRA-list-table" }, qc = {
  class: "header-chk-wrap",
  title: "Toggle All"
}, Jc = {
  key: 0,
  class: "empty-tip"
}, Yc = /* @__PURE__ */ Ke({
  __name: "HikazeLoraPowerLoaderOverlay",
  props: {
    nodeId: {},
    payload: {},
    commit: { type: Function }
  },
  setup(e) {
    const t = e, n = on("openManager", null), s = {
      version: 2,
      loras: [
        {
          name: "example_lora_1",
          full_path: "./example_lora_1.safetensors",
          strength_model: 1,
          strength_clip: 1,
          sha256: "0123456789abcdef0123456789abcdef",
          enabled: !0
        },
        {
          name: "example_lora_2",
          full_path: "./example_lora_2.safetensors",
          strength_model: 0.8,
          strength_clip: 0.6,
          sha256: "f123456789abcdef0123456789abcdef",
          enabled: !0
        }
      ]
    }, o = B({ version: 2, loras: [] }), i = B(null);
    Xe(
      () => {
        var v;
        return String(((v = t.payload) == null ? void 0 : v.value) ?? "");
      },
      (v) => {
        if (!(i.value != null && v === i.value))
          try {
            o.value = jl(v || "");
          } catch {
            console.error("Invalid JSON provided to Hikaze Lora Overlay"), o.value = JSON.parse(JSON.stringify(s));
          }
      },
      { immediate: !0 }
    ), Xe(o, () => {
      const v = fi(o.value);
      i.value = v, t.commit(v);
    }, { deep: !0 });
    function l(v, E) {
      var I;
      const S = (I = o.value.loras) == null ? void 0 : I[v];
      S && (S.strength_model = E);
    }
    function r(v, E) {
      var I;
      const S = (I = o.value.loras) == null ? void 0 : I[v];
      S && (S.strength_clip = E);
    }
    function a(v, E) {
      var I;
      const S = (I = o.value.loras) == null ? void 0 : I[v];
      S && (S.enabled = E);
    }
    function f(v) {
      var E;
      (E = o.value.loras) == null || E.splice(v, 1);
    }
    function c() {
      confirm("Delete all LoRAs?") && (o.value.loras = []);
    }
    function d(v) {
      if (!o.value.loras) return;
      const E = v.target.checked;
      o.value.loras.forEach((S) => {
        S.enabled = E;
      });
    }
    async function m() {
      if (!n) {
        console.warn("openManager is not available");
        return;
      }
      const v = await n({
        mode: "multi",
        initialTab: "loras",
        title: "Select LoRAs",
        payloadJson: t.payload.value
      });
      !v || typeof v != "object" || !("loras" in v) || t.commit(fi(v));
    }
    return (v, E) => ($(), We(wl, {
      "node-id": e.nodeId,
      title: "Hikaze LoRA Power Loader"
    }, {
      "header-actions": ht(() => [
        h("button", {
          type: "button",
          class: "btn header-action-btn",
          onClick: m
        }, " Select LoRAs... ")
      ]),
      default: ht(() => [
        h("div", Kc, [
          h("table", Gc, [
            h("thead", null, [
              h("th", null, [
                h("button", {
                  class: "header-btn",
                  onClick: c,
                  title: "Delete All"
                }, "🗑")
              ]),
              E[1] || (E[1] = h("th", null, "Seq", -1)),
              E[2] || (E[2] = h("th", null, "LoRA", -1)),
              E[3] || (E[3] = h("th", null, "Mstr", -1)),
              E[4] || (E[4] = h("th", null, "Cstr", -1)),
              h("th", null, [
                h("div", qc, [
                  E[0] || (E[0] = ft(" On ", -1)),
                  h("input", {
                    class: "hikaze-reset-chk",
                    type: "checkbox",
                    onChange: d
                  }, null, 32)
                ])
              ])
            ]),
            h("tbody", null, [
              ($(!0), L(ae, null, xe(o.value.loras, (S, I) => ($(), We(zc, {
                key: I,
                seq: I,
                name: S.full_path,
                strength_model: S.strength_model,
                strength_clip: S.strength_clip,
                enabled: S.enabled,
                "onUpdate:strength_model": l,
                "onUpdate:strength_clip": r,
                "onUpdate:enabled": a,
                "onUpdate:delete": f
              }, null, 8, ["seq", "name", "strength_model", "strength_clip", "enabled"]))), 128))
            ])
          ]),
          o.value.loras.length === 0 ? ($(), L("div", Jc, " No LoRAs loaded. ")) : _e("", !0)
        ])
      ]),
      _: 1
    }, 8, ["node-id"]));
  }
}), Zc = /* @__PURE__ */ Ge(Yc, [["__scopeId", "data-v-7bae3035"]]), Xc = "HikazeLoraPowerLoader";
class Qc extends Kt {
  getComponent() {
    return Zc;
  }
}
Kt.register(Xc, Qc);
const eu = "Hikaze", Hl = "Comfy.VueNodes.Enabled", tu = `${Hl}.change`, nu = Object.hasOwn ?? ((e, t) => Object.prototype.hasOwnProperty.call(e, t));
function pi(e, t) {
  return !e || typeof e != "object" && typeof e != "function" ? !1 : nu(e, t);
}
function hi(e, t, n = !0) {
  try {
    Object.defineProperty(e, t, {
      value: n,
      enumerable: !1,
      configurable: !0
    });
    return;
  } catch {
  }
  try {
    e[t] = n;
  } catch {
  }
}
function pn(e) {
  return {
    id: Number((e == null ? void 0 : e.id) ?? 0),
    name: String((e == null ? void 0 : e.name) ?? "")
  };
}
function Vl(e) {
  return {
    positive: String((e == null ? void 0 : e.positive) ?? ""),
    negative: String((e == null ? void 0 : e.negative) ?? "")
  };
}
function su(e) {
  return {
    description: String((e == null ? void 0 : e.description) ?? ""),
    community_links: String((e == null ? void 0 : e.community_links) ?? ""),
    images_count: Number((e == null ? void 0 : e.images_count) ?? 0),
    prompts: Vl(e == null ? void 0 : e.prompts)
  };
}
function ou(e) {
  return {
    description: String((e == null ? void 0 : e.description) ?? ""),
    community_links: String((e == null ? void 0 : e.community_links) ?? ""),
    images: Array.isArray(e == null ? void 0 : e.images) ? e.images.map((t) => String(t)) : [],
    prompts: Vl(e == null ? void 0 : e.prompts)
  };
}
function Bl(e) {
  return {
    sha256: String((e == null ? void 0 : e.sha256) ?? ""),
    path: String((e == null ? void 0 : e.path) ?? ""),
    name: String((e == null ? void 0 : e.name) ?? ""),
    type: String((e == null ? void 0 : e.type) ?? ""),
    size_bytes: Number((e == null ? void 0 : e.size_bytes) ?? 0),
    created_at: Number((e == null ? void 0 : e.created_at) ?? 0),
    meta_json: su(e == null ? void 0 : e.meta_json),
    tags: Array.isArray(e == null ? void 0 : e.tags) ? e.tags.map(pn) : []
  };
}
function iu(e) {
  return {
    id: Number((e == null ? void 0 : e.id) ?? 0),
    path: String((e == null ? void 0 : e.path) ?? ""),
    sha256: String((e == null ? void 0 : e.sha256) ?? ""),
    name: String((e == null ? void 0 : e.name) ?? ""),
    type: String((e == null ? void 0 : e.type) ?? ""),
    size_bytes: Number((e == null ? void 0 : e.size_bytes) ?? 0),
    created_at: Number((e == null ? void 0 : e.created_at) ?? 0),
    meta_json: ou(e == null ? void 0 : e.meta_json),
    tags: Array.isArray(e == null ? void 0 : e.tags) ? e.tags.map(pn) : []
  };
}
function lu(e) {
  return {
    sha256: String((e == null ? void 0 : e.sha256) ?? ""),
    name: String((e == null ? void 0 : e.name) ?? ""),
    images_count: Number((e == null ? void 0 : e.images_count) ?? 0),
    type: String((e == null ? void 0 : e.type) ?? ""),
    path: String((e == null ? void 0 : e.path) ?? ""),
    size_bytes: Number((e == null ? void 0 : e.size_bytes) ?? 0),
    created_at: Number((e == null ? void 0 : e.created_at) ?? 0),
    tags: Array.isArray(e == null ? void 0 : e.tags) ? e.tags.map(pn) : []
  };
}
function ru(e) {
  return {
    id: Number((e == null ? void 0 : e.id) ?? 0),
    name: String((e == null ? void 0 : e.name) ?? ""),
    image: String((e == null ? void 0 : e.image) ?? ""),
    type: String((e == null ? void 0 : e.type) ?? ""),
    tags: Array.isArray(e == null ? void 0 : e.tags) ? e.tags.map(pn) : []
  };
}
const cs = "__HIKAZE_API_PORT__", Zs = "__HIKAZE_API_BASE__", au = "__HIKAZE_EMBEDDED__", cu = (e) => new Promise((t) => setTimeout(t, e));
function Dn(e) {
  return globalThis[e];
}
function Xs(e, t) {
  globalThis[e] = t;
}
function _o() {
  return !!Dn(au);
}
function uu() {
  typeof Dn(cs) != "number" && Xs(cs, 0), typeof Dn(Zs) != "string" && Xs(Zs, "");
}
function zl() {
  const e = Dn(cs), t = Number(e ?? 0);
  return Number.isFinite(t) ? t : 0;
}
function du(e) {
  Xs(cs, e);
}
function fu() {
  const e = Dn(Zs);
  return typeof e == "string" ? e : "";
}
async function pu() {
  try {
    const e = await fetch("/api/hikaze/sniffer_port", { cache: "no-store" });
    if (!e.ok)
      return 0;
    const t = await e.json(), n = Number((t == null ? void 0 : t.port) ?? 0);
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}
let Mn = null;
async function Wl() {
  for (; ; ) {
    const e = await pu();
    if (e > 0)
      return du(e), e;
    await cu(1e3);
  }
}
function hu() {
  _o() && (Mn || (Mn = Wl()));
}
async function gu() {
  if (!_o())
    return 0;
  const e = zl();
  return e > 0 ? e : (Mn || (Mn = Wl()), Mn);
}
function Cs() {
  const e = fu();
  if (e)
    return e;
  if (!_o())
    return "";
  const t = zl();
  return t ? `http://${typeof window < "u" ? window.location.hostname : "127.0.0.1"}:${t}` : "";
}
async function mu() {
  const e = Cs();
  if (e)
    return e;
  const t = await gu();
  return t ? `http://${typeof window < "u" ? window.location.hostname : "127.0.0.1"}:${t}` : "";
}
async function Ul(e) {
  const t = await mu();
  return t ? `${t}${e}` : e;
}
async function ot(e, t) {
  const n = await Ul(e);
  return fetch(n, t);
}
async function vu() {
  const e = await ot("/api/models/get_types");
  if (!e.ok)
    throw new Error(`Failed to fetch model types: ${e.statusText}`);
  return ((await e.json()).types || []).map((n) => String(n));
}
async function yu() {
  const e = await ot("/api/tags");
  if (!e.ok)
    throw new Error(`Failed to fetch tags: ${e.statusText}`);
  return ((await e.json()).tags || []).map(pn);
}
async function _u(e) {
  const t = await ot("/api/tags_add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newtags: e })
  });
  if (!t.ok)
    throw new Error(`Failed to add tags: ${t.statusText}`);
  return ((await t.json()).tags || []).map(pn);
}
async function bu(e) {
  const t = await ot(`/api/models?type=${encodeURIComponent(e)}`);
  if (!t.ok)
    throw new Error(`Failed to fetch models: ${t.statusText}`);
  return ((await t.json()).models || []).map(lu);
}
async function Cu(e) {
  const t = await ot(`/api/models/${e}`);
  if (!t.ok)
    throw new Error(`Failed to fetch model details: ${t.statusText}`);
  const n = await t.json();
  return Bl(n);
}
async function Su(e, t) {
  const n = await ot(`/api/models/${e}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(t)
  });
  if (!n.ok)
    throw new Error(`Failed to update model: ${n.statusText}`);
  const s = await n.json();
  return Bl(s);
}
async function xu(e) {
  const t = await ot(`/api/images/get_img_count?sha256=${e}`);
  if (!t.ok)
    throw new Error(`Failed to fetch image count: ${t.statusText}`);
  const n = await t.json();
  return Number(n.count ?? 0);
}
async function Tu(e, t) {
  const n = await ot(`/api/images/delete?sha256=${e}&seq=${t}`, {
    method: "DELETE"
  });
  if (!n.ok)
    throw new Error(`Failed to delete image: ${n.statusText}`);
}
async function ku() {
  const e = await ot("/api/migration/pending_models");
  if (!e.ok)
    throw new Error(`Failed to fetch pending models: ${e.statusText}`);
  return ((await e.json()).models || []).map(ru);
}
async function $u(e) {
  const t = await ot(`/api/migration/pending_model?id=${encodeURIComponent(e)}`);
  if (!t.ok)
    throw new Error(`Failed to fetch pending model details: ${t.statusText}`);
  const n = await t.json();
  return iu(n);
}
async function gi(e, t) {
  const n = await ot("/api/migration/import_models", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: e, conflict_strategy: t })
  });
  if (!n.ok)
    throw new Error(`Failed to import models: ${n.statusText}`);
  return await n.json();
}
function ln(e) {
  return typeof e == "string" ? e : e.value;
}
function Eu() {
  const e = Ce({}), t = Ce({}), n = Ce({}), s = Ce({}), o = Ce({}), i = Ce({});
  async function l(g, C = !1) {
    if (g && !(e[g] && !C)) {
      t[g] = !0, n[g] = null;
      try {
        const b = await bu(g);
        e[g] = b;
      } catch (b) {
        console.error(`Error loading models for type ${g}:`, b), n[g] = (b == null ? void 0 : b.message) || "Failed to load models", e[g] || (e[g] = []);
      } finally {
        t[g] = !1;
      }
    }
  }
  async function r(g, C = !1) {
    if (g && !(s[g] && !C)) {
      o[g] = !0, i[g] = null;
      try {
        const b = await Cu(g);
        s[g] = b, a(b);
      } catch (b) {
        console.error(`Error loading model details for ${g}:`, b), i[g] = (b == null ? void 0 : b.message) || "Failed to load model details";
      } finally {
        o[g] = !1;
      }
    }
  }
  function a(g) {
    Object.keys(e).forEach((C) => {
      const b = e[C];
      if (!b || b.length === 0) return;
      const V = b.findIndex((se) => se.sha256 === g.sha256);
      if (V === -1) return;
      const q = b[V];
      q && (b[V] = {
        ...q,
        name: g.name,
        tags: g.tags
      });
    });
  }
  function f(g) {
    s[g.sha256] = g, a(g);
  }
  function c(g) {
    return G(() => e[ln(g)] || []);
  }
  function d(g) {
    return G(() => !!t[ln(g)]);
  }
  function m(g) {
    return G(() => n[ln(g)] || null);
  }
  function v(g) {
    return G(() => s[g] || null);
  }
  function E(g) {
    return G(() => !!o[g]);
  }
  function S(g) {
    return G(() => i[g] || null);
  }
  function I() {
    Object.keys(e).forEach((g) => delete e[g]), Object.keys(t).forEach((g) => delete t[g]), Object.keys(n).forEach((g) => delete n[g]), Object.keys(s).forEach((g) => delete s[g]), Object.keys(o).forEach((g) => delete o[g]), Object.keys(i).forEach((g) => delete i[g]);
  }
  function _(g) {
    if (!g) {
      I();
      return;
    }
    delete e[g], delete t[g], delete n[g];
  }
  return {
    loadModels: l,
    loadDetails: r,
    setDetails: f,
    getModels: c,
    isLoading: d,
    getError: m,
    getDetails: v,
    isDetailsLoading: E,
    getDetailsError: S,
    reset: I,
    invalidate: _
  };
}
function Au() {
  const e = Ce({}), t = Ce({}), n = Ce({}), s = Ce({}), o = Ce({}), i = Ce({});
  async function l(_, g = !1) {
    const C = _ || "pending";
    if (!(e[C] && !g)) {
      t[C] = !0, n[C] = null;
      try {
        e[C] = await ku();
      } catch (b) {
        console.error("Error loading pending models:", b), n[C] = (b == null ? void 0 : b.message) || "Failed to load pending models", e[C] || (e[C] = []);
      } finally {
        t[C] = !1;
      }
    }
  }
  async function r(_, g = !1) {
    const C = String(_ || "");
    if (C && !(s[C] && !g)) {
      o[C] = !0, i[C] = null;
      try {
        const b = await $u(Number(C));
        s[C] = b;
      } catch (b) {
        console.error(`Error loading pending model details for ${C}:`, b), i[C] = (b == null ? void 0 : b.message) || "Failed to load pending model details";
      } finally {
        o[C] = !1;
      }
    }
  }
  function a(_) {
    s[String(_.id)] = _;
  }
  function f(_) {
    const g = ln(_) || "pending";
    return G(() => e[g] || []);
  }
  function c(_) {
    const g = ln(_) || "pending";
    return G(() => !!t[g]);
  }
  function d(_) {
    const g = ln(_) || "pending";
    return G(() => n[g] || null);
  }
  function m(_) {
    return G(() => s[String(_)] || null);
  }
  function v(_) {
    return G(() => !!o[String(_)]);
  }
  function E(_) {
    return G(() => i[String(_)] || null);
  }
  function S() {
    Object.keys(e).forEach((_) => delete e[_]), Object.keys(t).forEach((_) => delete t[_]), Object.keys(n).forEach((_) => delete n[_]), Object.keys(s).forEach((_) => delete s[_]), Object.keys(o).forEach((_) => delete o[_]), Object.keys(i).forEach((_) => delete i[_]);
  }
  function I(_) {
    if (!_) {
      S();
      return;
    }
    delete e[_], delete t[_], delete n[_];
  }
  return {
    loadModels: l,
    getModels: f,
    isLoading: c,
    getError: d,
    reset: S,
    invalidate: I,
    loadDetails: r,
    setDetails: a,
    getDetails: m,
    isDetailsLoading: v,
    getDetailsError: E
  };
}
const Mu = Eu(), Iu = Au();
function Gt(e = "active") {
  return e === "pending" ? Iu : Mu;
}
const $e = Ce({
  items: [],
  loading: !1,
  error: null,
  loaded: !1
});
async function Lu(e = !1) {
  if (!($e.loaded && !e)) {
    $e.loading = !0, $e.error = null;
    try {
      const t = await yu();
      $e.items = [...t], $e.loaded = !0;
    } catch (t) {
      console.error("Error loading tags:", t), $e.error = (t == null ? void 0 : t.message) || "Failed to load tags", $e.items = [], $e.loaded = !1;
    } finally {
      $e.loading = !1;
    }
  }
}
function Nu(e) {
  if (!e.length) return;
  const t = new Map($e.items.map((n) => [n.id, n]));
  e.forEach((n) => {
    t.has(n.id) || t.set(n.id, n);
  }), $e.items = Array.from(t.values());
}
function Pu() {
  $e.items = [], $e.loaded = !1, $e.error = null, $e.loading = !1;
}
function Vn() {
  return {
    loadTags: Lu,
    mergeTags: Nu,
    resetTags: Pu,
    getTags: () => G(() => $e.items),
    isLoading: () => G(() => $e.loading),
    getError: () => G(() => $e.error)
  };
}
const Ou = {
  key: 0,
  class: "hikaze-header"
}, wu = {
  key: 0,
  class: "tabs-loading"
}, Fu = {
  key: 1,
  class: "tabs-error"
}, Ru = {
  key: 2,
  class: "type-tabs"
}, Du = ["onClick"], ju = {
  key: 3,
  class: "mode-indicator"
}, Hu = { class: "hikaze-pane-library" }, Vu = { class: "hikaze-pane-details" }, Bu = /* @__PURE__ */ Ke({
  __name: "HikazeManagerLayout",
  props: {
    embedded: { type: Boolean },
    initialTab: {},
    mode: {}
  },
  setup(e) {
    const t = e, n = Gt(), s = Vn(), o = B(""), i = B([]), l = B(!1), r = B(null), a = B(24), f = B(!1);
    function c(S) {
      o.value = S;
    }
    function d() {
      f.value = !0, document.addEventListener("mousemove", m), document.addEventListener("mouseup", v), document.body.style.cursor = "col-resize", document.body.style.userSelect = "none";
    }
    function m(S) {
      if (!f.value) return;
      const I = window.innerWidth, g = (I - S.clientX) / I * 100;
      g > 10 && g < 80 && (a.value = g);
    }
    function v() {
      f.value = !1, document.removeEventListener("mousemove", m), document.removeEventListener("mouseup", v), document.body.style.cursor = "", document.body.style.userSelect = "";
    }
    fn(() => {
      v();
    }), Xe(o, (S) => {
      S && n.loadModels(S);
    });
    async function E() {
      l.value = !0, r.value = null;
      try {
        const S = await vu();
        i.value = [...S, "Others"];
        const I = t.initialTab;
        if (I) {
          const _ = i.value.find((b) => b === I), g = i.value.find(
            (b) => b.toLowerCase() === I.toLowerCase()
          ), C = _ || g;
          if (C) {
            o.value = C;
            return;
          }
        }
        i.value.length > 0 && (o.value = i.value[0] || "");
      } catch (S) {
        r.value = S.message || "Failed to load model types";
      } finally {
        l.value = !1;
      }
    }
    return wt(() => {
      E(), s.loadTags();
    }), (S, I) => ($(), L("div", {
      class: he(["hikaze-layout", {
        "is-embedded": e.embedded,
        "has-initial-tab": !!e.initialTab,
        "is-pending": e.mode === "pending"
      }]),
      style: tt({ gridTemplateColumns: `1fr 4px ${a.value}%` })
    }, [
      !e.embedded && !e.initialTab ? ($(), L("header", Ou, [
        l.value ? ($(), L("div", wu, [...I[0] || (I[0] = [
          h("span", { class: "spinner" }, null, -1),
          ft(" Loading types... ", -1)
        ])])) : r.value ? ($(), L("div", Fu, [
          ft(oe(r.value) + " ", 1),
          h("button", {
            onClick: E,
            class: "btn-retry"
          }, "Retry")
        ])) : ($(), L("nav", Ru, [
          ($(!0), L(ae, null, xe(i.value, (_) => ($(), L("div", {
            key: _,
            class: he(["tab", { active: o.value === _ }]),
            onClick: (g) => c(_)
          }, oe(_), 11, Du))), 128))
        ])),
        e.mode === "pending" ? ($(), L("div", ju, "Pending Mode")) : _e("", !0)
      ])) : _e("", !0),
      h("main", Hu, [
        $n(S.$slots, "library", { activeTab: o.value }, () => [
          I[1] || (I[1] = ft("Library", -1))
        ])
      ]),
      h("div", {
        class: he(["layout-splitter", { dragging: f.value }]),
        onMousedown: d
      }, null, 34),
      h("aside", Vu, [
        $n(S.$slots, "details", {}, () => [
          I[2] || (I[2] = ft("Details", -1))
        ])
      ]),
      $n(S.$slots, "toolbar", { activeTab: o.value }, void 0)
    ], 6));
  }
}), zu = /* @__PURE__ */ Ge(Bu, [["__scopeId", "data-v-1eb3ed90"]]), Ut = Ce({}), rn = Ce({}), an = Ce({}), cn = Ce({});
function Wu(e) {
  cn[e] = (cn[e] ?? 0) + 1;
}
function Uu(e) {
  if (e) {
    delete Ut[e], delete rn[e], delete an[e], delete cn[e];
    return;
  }
  Object.keys(Ut).forEach((t) => delete Ut[t]), Object.keys(rn).forEach((t) => delete rn[t]), Object.keys(an).forEach((t) => delete an[t]), Object.keys(cn).forEach((t) => delete cn[t]);
}
async function Ku(e, t = !1) {
  if (e && !(Ut[e] != null && !t)) {
    rn[e] = !0, an[e] = null;
    try {
      Ut[e] = await xu(e);
    } catch (n) {
      console.error(`Error loading image count for ${e}:`, n), an[e] = (n == null ? void 0 : n.message) || "Failed to load image count", Ut[e] = 0;
    } finally {
      rn[e] = !1;
    }
  }
}
function Gu(e, t, n = "high") {
  const s = cn[e] ?? 0, o = Cs();
  return `${o ? `${o}` : ""}/api/images/${e}_${t}.webp?quality=${n}&rev=${s}`;
}
function bo() {
  return {
    loadImageCount: Ku,
    bumpRevision: Wu,
    resetImageCache: Uu,
    getImageUrl: Gu,
    getImageCount: (e) => G(() => Ut[e] ?? 0),
    isLoading: (e) => G(() => !!rn[e]),
    getError: (e) => G(() => an[e] ?? null)
  };
}
function qu(e, t = { root: null, rootMargin: "0px", threshold: 0.1 }) {
  return new IntersectionObserver((s) => {
    s.forEach((o) => {
      o.isIntersecting && e(o);
    });
  }, t);
}
const Ju = { class: "model-library" }, Yu = { class: "library-toolbar" }, Zu = { class: "search-box" }, Xu = { class: "controls-right" }, Qu = {
  key: 0,
  class: "column-control"
}, ed = { class: "view-switch" }, td = ["disabled"], nd = { class: "tag-filter" }, sd = {
  key: 0,
  class: "tag-dropdown"
}, od = {
  key: 0,
  class: "placeholder-msg"
}, id = {
  key: 1,
  class: "tag-list"
}, ld = ["onClick"], rd = {
  key: 0,
  class: "library-loading"
}, ad = {
  key: 1,
  class: "library-error"
}, cd = ["onClick", "onMouseenter", "onMouseleave"], ud = ["checked", "onChange"], dd = ["data-sha256"], fd = { class: "card-meta" }, pd = { class: "card-title" }, hd = { class: "card-tags" }, gd = { class: "tooltip-name" }, md = { class: "tooltip-tags" }, vd = {
  key: 3,
  class: "list-container"
}, yd = ["onClick"], _d = ["checked", "onChange"], bd = { class: "list-name" }, Cd = { class: "list-tags" }, Sd = /* @__PURE__ */ Ke({
  __name: "ModelLibrary",
  props: {
    activeTab: {},
    selectionMode: {},
    selectedIds: {},
    excludeSelected: { type: Boolean }
  },
  emits: ["select-model", "toggle-select"],
  setup(e, { emit: t }) {
    const n = e, s = t, o = Gt(), i = Vn(), l = bo(), r = B("card"), a = B(4), f = B(null), c = B("bottom"), d = B(!1), m = B(""), v = B(/* @__PURE__ */ new Map()), E = G(() => n.selectionMode === "lora"), S = G(() => new Set(n.selectedIds ?? [])), I = o.getModels(G(() => n.activeTab)), _ = o.isLoading(G(() => n.activeTab)), g = o.getError(G(() => n.activeTab)), C = Ce({}), b = /* @__PURE__ */ new Map();
    let V = null;
    function q() {
      V && V.disconnect(), V = qu((H) => {
        const j = H.target, W = j.dataset.sha256;
        if (!W) return;
        const Z = new Image(), ue = l.getImageUrl(W, 0, "medium");
        Z.onload = () => {
          j.classList.remove("lazy"), j.classList.add("loaded");
        }, Z.onerror = () => {
          j.classList.remove("lazy"), j.classList.add("error");
        }, Z.src = ue, V == null || V.unobserve(j);
      }), fo(() => {
        document.querySelectorAll(".card-image.lazy").forEach((j) => V == null ? void 0 : V.observe(j));
      });
    }
    const se = async (H) => {
      await l.loadImageCount(H);
      const j = l.getImageCount(H).value;
      if (j <= 1) return;
      C[H] || (C[H] = { current: 0 });
      const W = b.get(H);
      W && clearInterval(W);
      const Z = window.setInterval(() => {
        const ue = C[H];
        ue && (ue.current = (ue.current + 1) % j);
      }, 1e3);
      b.set(H, Z);
    }, te = (H) => {
      const j = b.get(H);
      j && (clearInterval(j), b.delete(H)), C[H] && (C[H].current = 0);
    }, z = (H) => {
      const j = C[H], W = j ? j.current : 0;
      return {
        backgroundImage: `url(${l.getImageUrl(H, W, "medium")})`
      };
    }, ee = (H, j) => {
      f.value = j;
      const Z = H.currentTarget.getBoundingClientRect(), ue = window.innerHeight - Z.bottom;
      c.value = ue < 250 ? "top" : "bottom", se(j);
    }, ce = (H) => {
      f.value = null, te(H);
    }, A = (H, j) => {
      s("toggle-select", H, j);
    }, F = (H) => {
      s("select-model", H), E.value && H.sha256 && !S.value.has(H.sha256) && A(H, !0);
    }, D = (H, j) => {
      const W = j.target;
      H.sha256 && A(H, W.checked);
    }, ne = i.getTags();
    wt(async () => {
      r.value === "card" && q();
      try {
        await i.loadTags();
        const H = ne.value.find((j) => j.name.toLowerCase() === "nsfw");
        H && v.value.set(H.id, "exclude");
      } catch (H) {
        console.error("Failed to load tags for auto-exclude:", H);
      }
    }), fn(() => {
      V && V.disconnect(), b.forEach((H) => clearInterval(H)), b.clear();
    });
    const X = G(() => {
      let H = I.value;
      if (m.value.trim()) {
        const j = m.value.toLowerCase();
        H = H.filter(
          (W) => W.name.toLowerCase().includes(j) || W.path.toLowerCase().includes(j)
        );
      }
      if (v.value.size > 0) {
        const j = Array.from(v.value.entries()).filter(([Z, ue]) => ue === "include").map(([Z]) => Z), W = Array.from(v.value.entries()).filter(([Z, ue]) => ue === "exclude").map(([Z]) => Z);
        H = H.filter((Z) => {
          const ue = new Set(Z.tags.map((Be) => Be.id)), De = j.every((Be) => ue.has(Be)), gt = !W.some((Be) => ue.has(Be));
          return De && gt;
        });
      }
      return n.excludeSelected && S.value.size > 0 && (H = H.filter((j) => !S.value.has(j.sha256))), H;
    }), ie = G(() => {
      const H = /* @__PURE__ */ new Map();
      X.value.forEach((ue) => {
        ue.tags.forEach((De) => {
          H.set(De.id, (H.get(De.id) ?? 0) + 1);
        });
      });
      const j = new Map(ne.value.map((ue) => [ue.id, ue])), W = [];
      v.value.forEach((ue, De) => {
        const gt = j.get(De);
        gt && W.push(gt);
      });
      const Z = ne.value.filter((ue) => !v.value.has(ue.id) && (H.get(ue.id) ?? 0) > 0).sort((ue, De) => ue.name.localeCompare(De.name));
      return [...W, ...Z];
    });
    Xe([X, r], () => {
      r.value === "card" && q();
    }, { deep: !0 });
    function le(H) {
      const j = v.value.get(H);
      j === "include" ? v.value.set(H, "exclude") : j === "exclude" ? v.value.delete(H) : v.value.set(H, "include");
    }
    function Ae() {
      v.value.clear();
    }
    function Et() {
      o.reset(), l.resetImageCache(), o.loadModels(n.activeTab, !0);
    }
    const qe = (H) => {
      r.value = H;
    }, Re = G(() => r.value !== "card" ? {} : {
      gridTemplateColumns: `repeat(${a.value}, 1fr)`
    });
    return (H, j) => ($(), L("div", Ju, [
      h("div", Yu, [
        h("div", Zu, [
          Ye(h("input", {
            type: "text",
            "onUpdate:modelValue": j[0] || (j[0] = (W) => m.value = W),
            placeholder: "Search models..."
          }, null, 512), [
            [dt, m.value]
          ])
        ]),
        h("div", Xu, [
          r.value === "card" ? ($(), L("div", Qu, [
            j[9] || (j[9] = h("label", { for: "col-count" }, "Cols:", -1)),
            Ye(h("input", {
              id: "col-count",
              type: "number",
              "onUpdate:modelValue": j[1] || (j[1] = (W) => a.value = W),
              min: "2",
              max: "10",
              step: "1"
            }, null, 512), [
              [
                dt,
                a.value,
                void 0,
                { number: !0 }
              ]
            ])
          ])) : _e("", !0),
          h("div", ed, [
            h("button", {
              class: he({ active: r.value === "card" }),
              onClick: j[2] || (j[2] = (W) => qe("card"))
            }, "Card", 2),
            h("button", {
              class: he({ active: r.value === "list" }),
              onClick: j[3] || (j[3] = (W) => qe("list"))
            }, "List", 2)
          ]),
          h("button", {
            class: "btn-refresh",
            onClick: Et,
            disabled: Qe(_),
            title: "Refresh model library"
          }, " Refresh ", 8, td),
          h("div", nd, [
            h("button", {
              class: he(["btn-filter", { active: v.value.size > 0 }]),
              onClick: j[4] || (j[4] = (W) => d.value = !d.value)
            }, " Tags Filter " + oe(v.value.size > 0 ? `(${v.value.size})` : ""), 3),
            d.value ? ($(), L("div", sd, [
              ie.value.length === 0 ? ($(), L("div", od, "No tags available")) : ($(), L("div", id, [
                ($(!0), L(ae, null, xe(ie.value, (W) => ($(), L("div", {
                  key: W.id,
                  class: he(["tag-item", v.value.get(W.id)]),
                  onClick: (Z) => le(W.id)
                }, oe(W.name), 11, ld))), 128)),
                h("div", { class: "tag-dropdown-actions" }, [
                  h("button", {
                    onClick: Ae,
                    class: "btn-clear"
                  }, "Clear All")
                ])
              ]))
            ])) : _e("", !0)
          ])
        ])
      ]),
      h("div", {
        class: he(["library-content", r.value]),
        style: tt(Re.value)
      }, [
        Qe(_) ? ($(), L("div", rd, [...j[10] || (j[10] = [
          h("span", { class: "spinner" }, null, -1),
          ft(" Loading models... ", -1)
        ])])) : Qe(g) ? ($(), L("div", ad, oe(Qe(g)), 1)) : r.value === "card" ? ($(!0), L(ae, { key: 2 }, xe(X.value, (W) => ($(), L("div", {
          key: W.sha256,
          class: he(["card-item", { "dense-view": a.value > 6 }]),
          onClick: (Z) => F(W),
          onMouseenter: (Z) => ee(Z, W.sha256),
          onMouseleave: (Z) => ce(W.sha256)
        }, [
          E.value ? ($(), L("label", {
            key: 0,
            class: "selection-checkbox",
            onClick: j[6] || (j[6] = Te(() => {
            }, ["stop"]))
          }, [
            h("input", {
              type: "checkbox",
              checked: S.value.has(W.sha256),
              onClick: j[5] || (j[5] = Te(() => {
              }, ["stop"])),
              onChange: (Z) => D(W, Z)
            }, null, 40, ud)
          ])) : _e("", !0),
          h("div", {
            class: "card-image lazy",
            "data-sha256": W.sha256,
            style: tt(z(W.sha256))
          }, null, 12, dd),
          h("div", fd, [
            h("div", pd, oe(W.name), 1),
            h("div", hd, [
              ($(!0), L(ae, null, xe(W.tags, (Z) => ($(), L("span", {
                key: Z.id,
                class: "tag"
              }, oe(Z.name), 1))), 128))
            ])
          ]),
          f.value === W.sha256 ? ($(), L("div", {
            key: 1,
            class: he(["card-tooltip", c.value])
          }, [
            h("div", gd, oe(W.name), 1),
            h("div", md, [
              ($(!0), L(ae, null, xe(W.tags, (Z) => ($(), L("span", {
                key: Z.id,
                class: "tag"
              }, oe(Z.name), 1))), 128))
            ])
          ], 2)) : _e("", !0)
        ], 42, cd))), 128)) : ($(), L("div", vd, [
          ($(!0), L(ae, null, xe(X.value, (W) => ($(), L("div", {
            key: W.sha256,
            class: "list-item",
            onClick: (Z) => F(W)
          }, [
            E.value ? ($(), L("label", {
              key: 0,
              class: "list-checkbox",
              onClick: j[8] || (j[8] = Te(() => {
              }, ["stop"]))
            }, [
              h("input", {
                type: "checkbox",
                checked: S.value.has(W.sha256),
                onClick: j[7] || (j[7] = Te(() => {
                }, ["stop"])),
                onChange: (Z) => D(W, Z)
              }, null, 40, _d)
            ])) : _e("", !0),
            h("div", bd, oe(W.name), 1),
            h("div", Cd, [
              ($(!0), L(ae, null, xe(W.tags, (Z) => ($(), L("span", {
                key: Z.id,
                class: "tag"
              }, oe(Z.name), 1))), 128))
            ])
          ], 8, yd))), 128))
        ]))
      ], 6)
    ]));
  }
}), xd = /* @__PURE__ */ Ge(Sd, [["__scopeId", "data-v-b5c4ff7b"]]), Td = { class: "main-display" }, kd = {
  key: 0,
  class: "loader"
}, $d = ["src"], Ed = { class: "nav-controls" }, Ad = { class: "action-overlay" }, Md = {
  key: 2,
  class: "no-images"
}, Id = {
  key: 0,
  class: "pagination"
}, Ld = ["onClick"], Nd = /* @__PURE__ */ Ke({
  __name: "HikazeImageGallery",
  props: {
    sha256: {}
  },
  emits: ["update"],
  setup(e, { emit: t }) {
    const n = e, s = t, o = bo(), i = B(0), l = B(0), r = B(!1), a = B(!1), f = B(null), c = async (_ = !1) => {
      if (n.sha256) {
        r.value = !0;
        try {
          await o.loadImageCount(n.sha256, _), i.value = o.getImageCount(n.sha256).value, l.value >= i.value && i.value > 0 ? l.value = i.value - 1 : i.value === 0 && (l.value = 0);
        } catch (g) {
          console.error("Failed to load image count:", g);
        } finally {
          r.value = !1;
        }
      }
    };
    Xe(() => n.sha256, () => {
      l.value = 0, c();
    }, { immediate: !0 });
    const d = () => {
      i.value > 0 && (l.value = (l.value + 1) % i.value);
    }, m = () => {
      i.value > 0 && (l.value = (l.value - 1 + i.value) % i.value);
    }, v = async () => {
      if (i.value !== 0 && confirm("Are you sure you want to delete this image?"))
        try {
          await Tu(n.sha256, l.value), o.bumpRevision(n.sha256), await c(!0), s("update");
        } catch {
          alert("Failed to delete image");
        }
    }, E = () => {
      var _;
      (_ = f.value) == null || _.click();
    }, S = async (_) => {
      var V;
      const g = _.target;
      if (!((V = g.files) != null && V.length)) return;
      const C = g.files[0];
      if (!C) return;
      const b = new FormData();
      b.append("image", C), b.append("sha256", n.sha256);
      try {
        const q = await Ul("/api/images/upload"), se = await fetch(q, {
          method: "POST",
          body: b
        });
        if (se.ok)
          o.bumpRevision(n.sha256), await c(!0), l.value = i.value - 1, s("update");
        else {
          const te = await se.json();
          alert(`Upload failed: ${te.error || se.statusText}`);
        }
      } catch {
        alert("Upload error");
      } finally {
        g.value = "";
      }
    }, I = (_) => o.getImageUrl(n.sha256, _, "high");
    return (_, g) => ($(), L("div", {
      class: "image-gallery",
      onMouseenter: g[0] || (g[0] = (C) => a.value = !0),
      onMouseleave: g[1] || (g[1] = (C) => a.value = !1)
    }, [
      h("div", Td, [
        r.value ? ($(), L("div", kd, "Loading...")) : i.value > 0 ? ($(), L(ae, { key: 1 }, [
          h("img", {
            src: I(l.value),
            class: "gallery-img"
          }, null, 8, $d),
          Se(Ys, { name: "fade" }, {
            default: ht(() => [
              Ye(h("div", Ed, [
                h("button", {
                  class: "nav-btn prev",
                  onClick: Te(m, ["stop"])
                }, "❮"),
                h("button", {
                  class: "nav-btn next",
                  onClick: Te(d, ["stop"])
                }, "❯")
              ], 512), [
                [Zo, a.value && i.value > 1]
              ])
            ]),
            _: 1
          }),
          Se(Ys, { name: "fade" }, {
            default: ht(() => [
              Ye(h("div", Ad, [
                h("button", {
                  class: "action-btn upload",
                  onClick: Te(E, ["stop"]),
                  title: "Add Image"
                }, "➕"),
                h("button", {
                  class: "action-btn delete",
                  onClick: Te(v, ["stop"]),
                  title: "Delete Current Image"
                }, "🗑️")
              ], 512), [
                [Zo, a.value]
              ])
            ]),
            _: 1
          })
        ], 64)) : ($(), L("div", Md, [
          g[2] || (g[2] = h("div", { class: "placeholder" }, "No Images", -1)),
          h("button", {
            class: "btn-upload-init",
            onClick: E
          }, "Upload Image")
        ]))
      ]),
      i.value > 1 ? ($(), L("div", Id, [
        ($(!0), L(ae, null, xe(i.value, (C) => ($(), L("div", {
          key: C - 1,
          class: he(["dot", { active: l.value === C - 1 }]),
          onClick: (b) => l.value = C - 1
        }, null, 10, Ld))), 128))
      ])) : _e("", !0),
      h("input", {
        type: "file",
        ref_key: "fileInput",
        ref: f,
        style: { display: "none" },
        accept: "image/*",
        onChange: S
      }, null, 544)
    ], 32));
  }
}), Pd = /* @__PURE__ */ Ge(Nd, [["__scopeId", "data-v-2b11a420"]]), Od = { class: "chips-wrapper" }, wd = ["onClick"], Fd = {
  key: 0,
  class: "suggestions-list"
}, Rd = ["onMousedown"], Dd = /* @__PURE__ */ Ke({
  __name: "HikazeTagInput",
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, s = t, o = Vn(), i = o.getTags(), l = B(""), r = B(!1), a = B(!1);
    wt(() => {
      o.loadTags();
    });
    const f = G(() => {
      const S = l.value.toLowerCase().trim();
      return S ? i.value.filter((I) => I.name.toLowerCase().includes(S) && !n.modelValue.find((_) => _.id === I.id)).slice(0, 10) : [];
    }), c = (S) => {
      const I = [...n.modelValue];
      I.splice(S, 1), s("update:modelValue", I);
    }, d = (S) => {
      n.modelValue.find((I) => I.id === S.id) || s("update:modelValue", [...n.modelValue, S]), l.value = "", a.value = !1;
    }, m = (S) => {
      if (S.key === "Enter" || S.key === ",") {
        S.preventDefault();
        const I = l.value.trim().replace(/,$/, "");
        if (!I) return;
        const _ = i.value.find((g) => g.name.toLowerCase() === I.toLowerCase());
        _ ? d(_) : (n.modelValue.find((g) => g.name.toLowerCase() === I.toLowerCase()) || s("update:modelValue", [...n.modelValue, { id: -1, name: I }]), l.value = ""), a.value = !1;
      } else S.key === "Backspace" && !l.value && n.modelValue.length > 0 && c(n.modelValue.length - 1);
    }, v = () => {
      a.value = !0;
    }, E = () => {
      setTimeout(() => {
        r.value = !1, a.value = !1;
      }, 200);
    };
    return (S, I) => ($(), L("div", {
      class: he(["tag-input-container", { focused: r.value }])
    }, [
      h("div", Od, [
        ($(!0), L(ae, null, xe(e.modelValue, (_, g) => ($(), L("div", {
          key: _.id === -1 ? _.name : _.id,
          class: he(["tag-chip", { new: _.id === -1 }])
        }, [
          ft(oe(_.name) + " ", 1),
          h("button", {
            class: "remove-btn",
            onClick: (C) => c(g)
          }, "×", 8, wd)
        ], 2))), 128)),
        Ye(h("input", {
          type: "text",
          "onUpdate:modelValue": I[0] || (I[0] = (_) => l.value = _),
          onKeydown: m,
          onInput: v,
          onFocus: I[1] || (I[1] = (_) => r.value = !0),
          onBlur: E,
          placeholder: "Add tags...",
          class: "input-field"
        }, null, 544), [
          [dt, l.value]
        ])
      ]),
      Se(Ys, { name: "slide-fade" }, {
        default: ht(() => [
          a.value && f.value.length > 0 ? ($(), L("div", Fd, [
            ($(!0), L(ae, null, xe(f.value, (_) => ($(), L("div", {
              key: _.id,
              class: "suggestion-item",
              onMousedown: (g) => d(_)
            }, oe(_.name), 41, Rd))), 128))
          ])) : _e("", !0)
        ]),
        _: 1
      })
    ], 2));
  }
}), jd = /* @__PURE__ */ Ge(Dd, [["__scopeId", "data-v-3daf8b7c"]]), Hd = {
  key: 0,
  class: "model-details"
}, Vd = { class: "gallery-wrapper" }, Bd = { class: "details-body" }, zd = { class: "field-group" }, Wd = { class: "field-group" }, Ud = ["title"], Kd = { class: "field-group" }, Gd = ["value"], qd = { class: "field-group" }, Jd = { class: "readonly-box" }, Yd = { class: "field-group" }, Zd = { class: "field-group" }, Xd = { class: "field-group" }, Qd = { class: "link-group" }, ef = { class: "field-group" }, tf = { class: "field-group" }, nf = { class: "actions" }, sf = ["disabled"], of = ["disabled"], lf = {
  key: 1,
  class: "empty-details"
}, rf = {
  key: 0,
  class: "loading-state"
}, af = { key: 1 }, cf = /* @__PURE__ */ Ke({
  __name: "ModelDetails",
  props: {
    model: {}
  },
  emits: ["update-list"],
  setup(e, { emit: t }) {
    const n = e, s = t, o = Gt(), i = Vn(), l = B(null), r = B(!1), a = B(!1), f = B(null), c = B(""), d = B(""), m = B(""), v = B(""), E = async (g, C = !1) => {
      r.value = !0;
      try {
        await o.loadDetails(g, C);
        const b = o.getDetails(g).value;
        if (l.value = b ? JSON.parse(JSON.stringify(b)) : null, l.value) {
          c.value = l.value.meta_json.description, d.value = l.value.meta_json.community_links, m.value = l.value.meta_json.prompts.positive, v.value = l.value.meta_json.prompts.negative, await fo();
          const V = f.value;
          if (V) {
            const q = V.getBoundingClientRect().width;
            q > 0 && (V.style.height = `${Math.round(q * 1.5)}px`);
          }
        }
      } catch (b) {
        console.error("Failed to load model details", b);
      } finally {
        r.value = !1;
      }
    };
    Xe(() => n.model, (g) => {
      g != null && g.sha256 ? E(g.sha256) : l.value = null;
    }, { immediate: !0 });
    const S = async () => {
      if (!(!l.value || !l.value.sha256)) {
        a.value = !0;
        try {
          const g = l.value.sha256, C = l.value.tags, b = C.filter((te) => te.id === -1).map((te) => te.name);
          let q = [...C.filter((te) => te.id !== -1)];
          if (b.length > 0) {
            const te = await _u(b);
            q = [...q, ...te], i.mergeTags(te);
          }
          l.value.tags = q, l.value.meta_json.description = c.value, l.value.meta_json.community_links = d.value, l.value.meta_json.prompts = {
            positive: m.value,
            negative: v.value
          };
          const se = await Su(g, l.value);
          o.setDetails(se), l.value = JSON.parse(JSON.stringify(se)), s("update-list"), alert("Saved successfully!");
        } catch (g) {
          alert(`Save failed: ${g}`);
        } finally {
          a.value = !1;
        }
      }
    }, I = () => {
      var g;
      (g = n.model) != null && g.sha256 && E(n.model.sha256, !0);
    }, _ = () => {
      d.value && window.open(d.value, "_blank");
    };
    return (g, C) => l.value ? ($(), L("div", Hd, [
      h("div", Vd, [
        Se(Pd, {
          sha256: l.value.sha256,
          onUpdate: C[0] || (C[0] = (b) => s("update-list"))
        }, null, 8, ["sha256"])
      ]),
      h("div", Bd, [
        h("div", zd, [
          C[7] || (C[7] = h("label", null, "Display Name", -1)),
          Ye(h("input", {
            type: "text",
            "onUpdate:modelValue": C[1] || (C[1] = (b) => l.value.name = b),
            placeholder: "Database alias..."
          }, null, 512), [
            [dt, l.value.name]
          ])
        ]),
        h("div", Wd, [
          C[8] || (C[8] = h("label", null, "Physical Path", -1)),
          h("div", {
            class: "readonly-box",
            title: l.value.path
          }, oe(l.value.path), 9, Ud)
        ]),
        h("div", Kd, [
          C[9] || (C[9] = h("label", null, "SHA256 Hash", -1)),
          h("input", {
            type: "text",
            value: l.value.sha256,
            disabled: "",
            class: "hash-input"
          }, null, 8, Gd)
        ]),
        h("div", qd, [
          C[10] || (C[10] = h("label", null, "Model Type", -1)),
          h("div", Jd, oe(l.value.type), 1)
        ]),
        h("div", Yd, [
          C[11] || (C[11] = h("label", null, "Tags", -1)),
          Se(jd, {
            modelValue: l.value.tags,
            "onUpdate:modelValue": C[2] || (C[2] = (b) => l.value.tags = b)
          }, null, 8, ["modelValue"])
        ]),
        h("div", Zd, [
          C[12] || (C[12] = h("label", null, "Description", -1)),
          Ye(h("textarea", {
            "onUpdate:modelValue": C[3] || (C[3] = (b) => c.value = b),
            placeholder: "Model description...",
            rows: "3",
            class: "resize-vertical",
            ref_key: "descriptionRef",
            ref: f
          }, null, 512), [
            [dt, c.value]
          ])
        ]),
        h("div", Xd, [
          C[13] || (C[13] = h("label", null, "Community Links", -1)),
          h("div", Qd, [
            Ye(h("input", {
              type: "text",
              "onUpdate:modelValue": C[4] || (C[4] = (b) => d.value = b),
              placeholder: "Link to Civitai, HuggingFace, etc...",
              class: "link-input"
            }, null, 512), [
              [dt, d.value]
            ]),
            h("button", {
              class: "btn-visit",
              onClick: _,
              title: "Visit Link"
            }, "🔗")
          ])
        ]),
        h("div", ef, [
          C[14] || (C[14] = h("label", null, "Positive Prompt", -1)),
          Ye(h("textarea", {
            "onUpdate:modelValue": C[5] || (C[5] = (b) => m.value = b),
            placeholder: "Recommended positive prompt...",
            rows: "3",
            class: "resize-vertical"
          }, null, 512), [
            [dt, m.value]
          ])
        ]),
        h("div", tf, [
          C[15] || (C[15] = h("label", null, "Negative Prompt", -1)),
          Ye(h("textarea", {
            "onUpdate:modelValue": C[6] || (C[6] = (b) => v.value = b),
            placeholder: "Recommended negative prompt...",
            rows: "3",
            class: "resize-vertical"
          }, null, 512), [
            [dt, v.value]
          ])
        ]),
        h("div", nf, [
          h("button", {
            class: "btn primary",
            onClick: S,
            disabled: a.value
          }, oe(a.value ? "Saving..." : "Save Changes"), 9, sf),
          h("button", {
            class: "btn secondary",
            onClick: I,
            disabled: a.value
          }, "Revert", 8, of)
        ])
      ])
    ])) : ($(), L("div", lf, [
      r.value ? ($(), L("div", rf, "Loading details...")) : ($(), L("div", af, [...C[16] || (C[16] = [
        h("div", { class: "placeholder-icon" }, "📭", -1),
        h("p", null, "Select a model from the library to view and edit details.", -1)
      ])]))
    ]));
  }
}), uf = /* @__PURE__ */ Ge(cf, [["__scopeId", "data-v-438634df"]]), df = { class: "selected-lora-bar" }, ff = {
  key: 0,
  class: "selected-lora-empty"
}, pf = ["onClick"], hf = ["onChange"], gf = { class: "selected-lora-meta" }, mf = ["title"], vf = {
  key: 0,
  class: "selected-lora-tags"
}, yf = /* @__PURE__ */ Ke({
  __name: "SelectedLoraBar",
  props: {
    items: {}
  },
  emits: ["toggle", "select"],
  setup(e, { emit: t }) {
    const n = e, s = t, o = bo(), i = (a, f) => {
      const c = f.target;
      s("toggle", a, c.checked);
    }, l = (a) => {
      s("select", a);
    }, r = (a) => a ? {
      backgroundImage: `url(${o.getImageUrl(a, 0, "medium")})`
    } : {};
    return (a, f) => ($(), L("div", df, [
      h("div", {
        class: he(["selected-lora-row", { empty: n.items.length === 0 }])
      }, [
        n.items.length === 0 ? ($(), L("div", ff, " No LoRAs selected. ")) : ($(!0), L(ae, { key: 1 }, xe(n.items, (c) => ($(), L("div", {
          key: c.sha256,
          class: "selected-lora-card",
          onClick: (d) => l(c)
        }, [
          h("label", {
            class: "selection-checkbox",
            onClick: f[1] || (f[1] = Te(() => {
            }, ["stop"]))
          }, [
            h("input", {
              type: "checkbox",
              checked: "",
              onClick: f[0] || (f[0] = Te(() => {
              }, ["stop"])),
              onChange: (d) => i(c.sha256, d)
            }, null, 40, hf)
          ]),
          h("div", {
            class: "selected-lora-image",
            style: tt(r(c.sha256))
          }, null, 4),
          h("div", gf, [
            h("div", {
              class: "selected-lora-name",
              title: c.name || c.path
            }, oe(c.name || c.path), 9, mf),
            c.tags.length > 0 ? ($(), L("div", vf, [
              ($(!0), L(ae, null, xe(c.tags, (d) => ($(), L("span", {
                key: d.id,
                class: "tag"
              }, oe(d.name), 1))), 128))
            ])) : _e("", !0)
          ])
        ], 8, pf))), 128))
      ], 2)
    ]));
  }
}), _f = /* @__PURE__ */ Ge(yf, [["__scopeId", "data-v-3c98d010"]]), bf = { class: "pending-library" }, Cf = { class: "library-toolbar" }, Sf = { class: "search-box" }, xf = { class: "controls-right" }, Tf = {
  key: 0,
  class: "column-control"
}, kf = { class: "view-switch" }, $f = ["disabled"], Ef = { class: "tag-filter" }, Af = {
  key: 0,
  class: "tag-dropdown"
}, Mf = {
  key: 0,
  class: "placeholder-msg"
}, If = {
  key: 1,
  class: "tag-list"
}, Lf = ["onClick"], Nf = {
  key: 0,
  class: "library-loading"
}, Pf = {
  key: 1,
  class: "library-error"
}, Of = ["onClick"], wf = ["checked", "onChange"], Ff = { class: "card-meta" }, Rf = { class: "card-title" }, Df = { class: "card-tags" }, jf = {
  key: 3,
  class: "list-container"
}, Hf = ["onClick"], Vf = ["checked", "onChange"], Bf = { class: "list-name" }, zf = { class: "list-tags" }, Wf = /* @__PURE__ */ Ke({
  __name: "PendingModelLibrary",
  props: {
    activeTab: {},
    selectedIds: {},
    excludeSelected: { type: Boolean }
  },
  emits: ["select-model", "toggle-select"],
  setup(e, { emit: t }) {
    const n = e, s = t, o = Gt("pending"), i = Vn(), l = B("card"), r = B(4), a = B(!1), f = B(""), c = B(/* @__PURE__ */ new Map()), d = G(() => new Set(n.selectedIds ?? [])), m = o.getModels("pending"), v = o.isLoading("pending"), E = o.getError("pending"), S = (A) => n.activeTab ? n.activeTab === "Others" ? !A.type : A.type === n.activeTab : !0, I = G(() => {
      let A = m.value;
      if (A = A.filter(S), f.value.trim()) {
        const F = f.value.toLowerCase();
        A = A.filter(
          (D) => D.name.toLowerCase().includes(F) || D.type.toLowerCase().includes(F)
        );
      }
      if (c.value.size > 0) {
        const F = Array.from(c.value.entries()).filter(([ne, X]) => X === "include").map(([ne]) => ne), D = Array.from(c.value.entries()).filter(([ne, X]) => X === "exclude").map(([ne]) => ne);
        A = A.filter((ne) => {
          const X = new Set(ne.tags.map((Ae) => Ae.id)), ie = F.every((Ae) => X.has(Ae)), le = !D.some((Ae) => X.has(Ae));
          return ie && le;
        });
      }
      return n.excludeSelected && d.value.size > 0 && (A = A.filter((F) => !d.value.has(F.id))), A;
    }), _ = i.getTags(), g = G(() => {
      const A = /* @__PURE__ */ new Map();
      I.value.forEach((X) => {
        X.tags.forEach((ie) => {
          A.set(ie.id, (A.get(ie.id) ?? 0) + 1);
        });
      });
      const F = new Map(_.value.map((X) => [X.id, X])), D = [];
      c.value.forEach((X, ie) => {
        const le = F.get(ie);
        le && D.push(le);
      });
      const ne = _.value.filter((X) => !c.value.has(X.id) && (A.get(X.id) ?? 0) > 0).sort((X, ie) => X.name.localeCompare(ie.name));
      return [...D, ...ne];
    }), C = (A) => {
      if (!A) return "";
      const D = A.replace(/\\/g, "/").split("/");
      return D[D.length - 1] || "";
    }, b = (A) => {
      const F = C(A);
      if (!F) return "";
      const D = Cs();
      return `${D ? `${D}` : ""}/api/images/pending/${encodeURIComponent(F)}`;
    }, V = () => {
      o.invalidate("pending"), o.loadModels("pending", !0);
    }, q = (A, F) => {
      const D = F.target;
      s("toggle-select", A, D.checked);
    }, se = (A) => {
      s("select-model", A);
    };
    function te(A) {
      const F = c.value.get(A);
      F === "include" ? c.value.set(A, "exclude") : F === "exclude" ? c.value.delete(A) : c.value.set(A, "include");
    }
    function z() {
      c.value.clear();
    }
    const ee = (A) => {
      l.value = A;
    }, ce = G(() => l.value !== "card" ? {} : {
      gridTemplateColumns: `repeat(${r.value}, 1fr)`
    });
    return wt(async () => {
      o.loadModels("pending");
      try {
        await i.loadTags();
        const A = _.value.find((F) => F.name.toLowerCase() === "nsfw");
        A && c.value.set(A.id, "exclude");
      } catch (A) {
        console.error("Failed to load tags for auto-exclude:", A);
      }
    }), (A, F) => ($(), L("div", bf, [
      h("div", Cf, [
        h("div", Sf, [
          Ye(h("input", {
            type: "text",
            "onUpdate:modelValue": F[0] || (F[0] = (D) => f.value = D),
            placeholder: "Search pending models..."
          }, null, 512), [
            [dt, f.value]
          ])
        ]),
        h("div", xf, [
          l.value === "card" ? ($(), L("div", Tf, [
            F[9] || (F[9] = h("label", { for: "pending-col-count" }, "Cols:", -1)),
            Ye(h("input", {
              id: "pending-col-count",
              type: "number",
              "onUpdate:modelValue": F[1] || (F[1] = (D) => r.value = D),
              min: "2",
              max: "10",
              step: "1"
            }, null, 512), [
              [
                dt,
                r.value,
                void 0,
                { number: !0 }
              ]
            ])
          ])) : _e("", !0),
          h("div", kf, [
            h("button", {
              class: he({ active: l.value === "card" }),
              onClick: F[2] || (F[2] = (D) => ee("card"))
            }, "Card", 2),
            h("button", {
              class: he({ active: l.value === "list" }),
              onClick: F[3] || (F[3] = (D) => ee("list"))
            }, "List", 2)
          ]),
          h("button", {
            class: "btn-refresh",
            onClick: V,
            disabled: Qe(v),
            title: "Refresh pending models"
          }, " Refresh ", 8, $f),
          h("div", Ef, [
            h("button", {
              class: he(["btn-filter", { active: c.value.size > 0 }]),
              onClick: F[4] || (F[4] = (D) => a.value = !a.value)
            }, " Tags Filter " + oe(c.value.size > 0 ? `(${c.value.size})` : ""), 3),
            a.value ? ($(), L("div", Af, [
              g.value.length === 0 ? ($(), L("div", Mf, "No tags available")) : ($(), L("div", If, [
                ($(!0), L(ae, null, xe(g.value, (D) => ($(), L("div", {
                  key: D.id,
                  class: he(["tag-item", c.value.get(D.id)]),
                  onClick: (ne) => te(D.id)
                }, oe(D.name), 11, Lf))), 128)),
                h("div", { class: "tag-dropdown-actions" }, [
                  h("button", {
                    onClick: z,
                    class: "btn-clear"
                  }, "Clear All")
                ])
              ]))
            ])) : _e("", !0)
          ])
        ])
      ]),
      h("div", {
        class: he(["library-content", l.value]),
        style: tt(ce.value)
      }, [
        Qe(v) ? ($(), L("div", Nf, [...F[10] || (F[10] = [
          h("span", { class: "spinner" }, null, -1),
          ft(" Loading pending models... ", -1)
        ])])) : Qe(E) ? ($(), L("div", Pf, oe(Qe(E)), 1)) : l.value === "card" ? ($(!0), L(ae, { key: 2 }, xe(I.value, (D) => ($(), L("div", {
          key: D.id,
          class: he(["card-item", { selected: d.value.has(D.id) }]),
          onClick: (ne) => se(D)
        }, [
          h("label", {
            class: "selection-checkbox",
            onClick: F[6] || (F[6] = Te(() => {
            }, ["stop"]))
          }, [
            h("input", {
              type: "checkbox",
              checked: d.value.has(D.id),
              onClick: F[5] || (F[5] = Te(() => {
              }, ["stop"])),
              onChange: (ne) => q(D, ne)
            }, null, 40, wf)
          ]),
          h("div", {
            class: he(["card-image", { empty: !D.image }]),
            style: tt(D.image ? { backgroundImage: `url(${b(D.image)})` } : {})
          }, null, 6),
          h("div", Ff, [
            h("div", Rf, oe(D.name), 1),
            h("div", Df, [
              ($(!0), L(ae, null, xe(D.tags, (ne) => ($(), L("span", {
                key: ne.id,
                class: "tag"
              }, oe(ne.name), 1))), 128))
            ])
          ])
        ], 10, Of))), 128)) : ($(), L("div", jf, [
          ($(!0), L(ae, null, xe(I.value, (D) => ($(), L("div", {
            key: D.id,
            class: he(["list-item", { selected: d.value.has(D.id) }]),
            onClick: (ne) => se(D)
          }, [
            h("label", {
              class: "list-checkbox",
              onClick: F[8] || (F[8] = Te(() => {
              }, ["stop"]))
            }, [
              h("input", {
                type: "checkbox",
                checked: d.value.has(D.id),
                onClick: F[7] || (F[7] = Te(() => {
                }, ["stop"])),
                onChange: (ne) => q(D, ne)
              }, null, 40, Vf)
            ]),
            h("div", Bf, oe(D.name), 1),
            h("div", zf, [
              ($(!0), L(ae, null, xe(D.tags, (ne) => ($(), L("span", {
                key: ne.id,
                class: "tag"
              }, oe(ne.name), 1))), 128))
            ])
          ], 10, Hf))), 128))
        ]))
      ], 6)
    ]));
  }
}), Uf = /* @__PURE__ */ Ge(Wf, [["__scopeId", "data-v-f9c58bd7"]]), Kf = {
  key: 0,
  class: "model-details"
}, Gf = { class: "gallery-wrapper" }, qf = { class: "pending-image-frame" }, Jf = ["src"], Yf = {
  key: 1,
  class: "pending-image-empty"
}, Zf = { class: "details-body" }, Xf = { class: "field-group" }, Qf = ["value"], ep = { class: "field-group" }, tp = ["title"], np = { class: "field-group" }, sp = ["value"], op = { class: "field-group" }, ip = { class: "readonly-box" }, lp = { class: "field-group" }, rp = { class: "tag-list" }, ap = { class: "field-group" }, cp = ["value"], up = { class: "field-group" }, dp = ["value"], fp = { class: "field-group" }, pp = ["value"], hp = { class: "field-group" }, gp = ["value"], mp = {
  key: 1,
  class: "empty-details"
}, vp = {
  key: 0,
  class: "loading-state"
}, yp = {
  key: 1,
  class: "loading-state"
}, _p = { key: 2 }, bp = /* @__PURE__ */ Ke({
  __name: "PendingModelDetails",
  props: {
    modelId: {}
  },
  setup(e) {
    const t = e, n = Gt("pending"), s = B(null), o = B(!1), i = B(null), l = B(!1), r = G(() => {
      var d, m;
      const c = (m = (d = s.value) == null ? void 0 : d.meta_json) == null ? void 0 : m.images;
      return Array.isArray(c) && c.length > 0;
    }), a = G(() => {
      if (!t.modelId || !r.value) return "";
      const c = Cs();
      return `${c ? `${c}` : ""}/api/images/pending/${t.modelId}`;
    }), f = async (c, d = !1) => {
      o.value = !0, i.value = null;
      try {
        await n.loadDetails(String(c), d);
        const m = n.getDetails(String(c)).value;
        s.value = m ? JSON.parse(JSON.stringify(m)) : null;
      } catch (m) {
        i.value = (m == null ? void 0 : m.message) || "Failed to load pending model details", s.value = null;
      } finally {
        o.value = !1;
      }
    };
    return Xe(() => t.modelId, (c) => {
      typeof c == "number" && !Number.isNaN(c) ? f(c) : s.value = null, l.value = !1;
    }, { immediate: !0 }), Xe(r, () => {
      l.value = !1;
    }), (c, d) => s.value ? ($(), L("div", Kf, [
      h("div", Gf, [
        h("div", qf, [
          a.value && !l.value ? ($(), L("img", {
            key: 0,
            src: a.value,
            alt: "Pending model preview",
            onError: d[0] || (d[0] = (m) => l.value = !0)
          }, null, 40, Jf)) : ($(), L("div", Yf, "No Image"))
        ])
      ]),
      h("div", Zf, [
        h("div", Xf, [
          d[1] || (d[1] = h("label", null, "Display Name", -1)),
          h("input", {
            type: "text",
            value: s.value.name,
            disabled: ""
          }, null, 8, Qf)
        ]),
        h("div", ep, [
          d[2] || (d[2] = h("label", null, "Physical Path", -1)),
          h("div", {
            class: "readonly-box",
            title: s.value.path
          }, oe(s.value.path), 9, tp)
        ]),
        h("div", np, [
          d[3] || (d[3] = h("label", null, "SHA256 Hash", -1)),
          h("input", {
            type: "text",
            value: s.value.sha256,
            disabled: "",
            class: "hash-input"
          }, null, 8, sp)
        ]),
        h("div", op, [
          d[4] || (d[4] = h("label", null, "Model Type", -1)),
          h("div", ip, oe(s.value.type), 1)
        ]),
        h("div", lp, [
          d[5] || (d[5] = h("label", null, "Tags", -1)),
          h("div", rp, [
            ($(!0), L(ae, null, xe(s.value.tags, (m) => ($(), L("span", {
              key: m.id,
              class: "tag"
            }, oe(m.name), 1))), 128))
          ])
        ]),
        h("div", ap, [
          d[6] || (d[6] = h("label", null, "Description", -1)),
          h("textarea", {
            value: s.value.meta_json.description,
            disabled: "",
            rows: "3"
          }, null, 8, cp)
        ]),
        h("div", up, [
          d[7] || (d[7] = h("label", null, "Community Links", -1)),
          h("textarea", {
            value: s.value.meta_json.community_links,
            disabled: "",
            rows: "2"
          }, null, 8, dp)
        ]),
        h("div", fp, [
          d[8] || (d[8] = h("label", null, "Positive Prompt", -1)),
          h("textarea", {
            value: s.value.meta_json.prompts.positive,
            disabled: "",
            rows: "3"
          }, null, 8, pp)
        ]),
        h("div", hp, [
          d[9] || (d[9] = h("label", null, "Negative Prompt", -1)),
          h("textarea", {
            value: s.value.meta_json.prompts.negative,
            disabled: "",
            rows: "3"
          }, null, 8, gp)
        ])
      ])
    ])) : ($(), L("div", mp, [
      o.value ? ($(), L("div", vp, "Loading details...")) : i.value ? ($(), L("div", yp, oe(i.value), 1)) : ($(), L("div", _p, [...d[10] || (d[10] = [
        h("div", { class: "placeholder-icon" }, "📭", -1),
        h("p", null, "Select a pending model to view details.", -1)
      ])]))
    ]));
  }
}), Cp = /* @__PURE__ */ Ge(bp, [["__scopeId", "data-v-f0f21e54"]]), Sp = { class: "hikaze-modal-toolbar" }, xp = { class: "modal-title" }, Tp = { class: "modal-actions" }, kp = {
  key: 0,
  class: "selection-count"
}, $p = {
  key: 0,
  class: "badge"
}, Ep = ["disabled"], Ap = ["disabled"], Mp = ["aria-label", "title"], Ip = ["disabled"], Lp = { class: "hikaze-modal-body" }, Np = { class: "lora-library-pane" }, Pp = { class: "lora-library-body" }, Op = /* @__PURE__ */ Ke({
  __name: "HikazeManagerModal",
  setup(e) {
    const t = B(void 0), n = B([]), s = B(!1), o = B([]), i = B({}), l = B({}), r = B(2), a = B("active"), f = B([]), c = B(void 0), d = B(!1), m = Gt(), v = Gt("pending"), E = v.getModels("pending"), S = G(() => E.value.length), I = G(() => S.value > 0), _ = G(() => a.value === "pending"), g = G(() => yn.options), C = G(() => {
      var w;
      return ((w = g.value) == null ? void 0 : w.mode) === "multi";
    }), b = G(() => {
      var u;
      const w = String(((u = g.value) == null ? void 0 : u.initialTab) || "").toLowerCase();
      return C.value && (w === "loras" || w === "lora");
    }), V = G(() => {
      var w;
      return ((w = g.value) == null ? void 0 : w.title) || (C.value ? "Select LoRAs" : "Select Checkpoint");
    }), q = G(() => b.value ? o.value.length : n.value.length), se = G(() => _.value ? !1 : C.value ? q.value > 0 : !!t.value), te = G(() => s.value ? "Exit fullscreen" : "Enter fullscreen"), z = G(() => o.value.map((w) => i.value[w]).filter((w) => !!w)), ee = (w) => {
      yn.isOpen && w.key === "Escape" && Xt(null);
    };
    wt(() => window.addEventListener("keydown", ee)), fn(() => window.removeEventListener("keydown", ee));
    const ce = () => {
      o.value = [], i.value = {}, l.value = {}, r.value = 2;
    }, A = () => {
      var u;
      if (ce(), !b.value) return;
      const w = ((u = g.value) == null ? void 0 : u.payloadJson) ?? "";
      try {
        const p = jl(w);
        r.value = Number(p.version) || 2;
        const y = {}, k = {}, x = [];
        p.loras.forEach((T) => {
          const N = String(T.sha256 || "").trim();
          !N || k[N] || (k[N] = T, x.push(N), y[N] = {
            sha256: N,
            name: T.name || T.full_path,
            path: T.full_path,
            tags: []
          });
        }), o.value = x, i.value = y, l.value = k;
      } catch (p) {
        console.warn("Failed to parse LoRA payload JSON", p);
        const y = Dl();
        r.value = Number(y.version) || 2;
      }
    };
    Xe(
      () => yn.isOpen,
      (w) => {
        w && (t.value = void 0, n.value = [], A()), s.value = !1, a.value = "active", f.value = [], c.value = void 0, v.loadModels("pending");
      }
    );
    const F = () => {
      Xt(null);
    }, D = (w, u) => {
      o.value.includes(w) || (o.value = [...o.value, w]), i.value = {
        ...i.value,
        [w]: u
      };
    }, ne = (w) => {
      if (!o.value.includes(w)) return;
      o.value = o.value.filter((p) => p !== w);
      const u = { ...i.value };
      delete u[w], i.value = u;
    }, X = (w, u) => {
      !b.value || !w.sha256 || (u ? D(w.sha256, {
        sha256: w.sha256,
        name: w.name || w.path,
        path: w.path,
        tags: w.tags
      }) : ne(w.sha256));
    }, ie = (w, u) => {
      b.value && (u || ne(w));
    }, le = (w) => ({
      sha256: w.sha256,
      name: w.name,
      path: w.path,
      tags: w.tags,
      images_count: 0,
      type: "lora",
      size_bytes: 0,
      created_at: 0
    }), Ae = (w) => {
      t.value = le(w);
    }, Et = () => {
      o.value = [], i.value = {};
    }, qe = (w) => {
      if (_.value)
        return;
      if (t.value = w, b.value) {
        w.sha256 && !o.value.includes(w.sha256) && D(w.sha256, {
          sha256: w.sha256,
          name: w.name || w.path,
          path: w.path,
          tags: w.tags
        });
        return;
      }
      if (!C.value) {
        n.value = [w];
        return;
      }
      n.value.find((p) => p.sha256 === w.sha256) ? n.value = n.value.filter((p) => p.sha256 !== w.sha256) : n.value = [...n.value, w];
    }, Re = (w) => {
      c.value = w;
    }, H = (w, u) => {
      if (u) {
        f.value.includes(w.id) || (f.value = [...f.value, w.id]);
        return;
      }
      f.value = f.value.filter((p) => p !== w.id);
    }, j = async () => {
      a.value = "pending", f.value = [], c.value = void 0, await v.loadModels("pending", !0);
    }, W = () => {
      a.value = "active", f.value = [], c.value = void 0;
    }, Z = () => {
      _.value ? W() : j();
    }, ue = (w) => {
      const u = new Map(E.value.map((p) => [p.id, p.name]));
      return w.map((p, y) => {
        var M, K, R, U;
        const k = (M = p.pending) == null ? void 0 : M.id, x = k !== void 0 ? u.get(k) : void 0, T = x ? `${x} (#${k})` : `#${k ?? "unknown"}`, N = (K = p.pending) != null && K.path ? ` | ${p.pending.path}` : "", P = ((R = p.existing) == null ? void 0 : R.id) ?? "unknown", O = (U = p.existing) != null && U.path ? ` | ${p.existing.path}` : "";
        return `${y + 1}. Pending: ${T}${N}
   Existing: ${P}${O}`;
      }).join(`
`);
    }, De = async () => {
      if (!(f.value.length === 0 || d.value)) {
        d.value = !0;
        try {
          const w = await gi(f.value, null);
          if (w.conflict.length > 0) {
            window.alert(`Conflicts detected:
${ue(w.conflict)}`);
            const u = ["override", "merge", "ignore", "delete"], p = (T) => u.includes(T);
            let y = null, k = [];
            const x = window.prompt(
              "Conflicts found. Choose strategy: override, merge, ignore, delete",
              "override"
            );
            if (x) {
              const T = x.trim().toLowerCase();
              p(T) ? (y = T, k = w.conflict.map((N) => {
                var P;
                return (P = N.pending) == null ? void 0 : P.id;
              }).filter((N) => typeof N == "number")) : window.alert("Invalid strategy. Please use override, merge, ignore, or delete.");
            }
            y && k.length > 0 && await gi(k, y);
          }
          f.value = [], c.value = void 0, await v.loadModels("pending", !0), m.invalidate();
        } catch (w) {
          window.alert((w == null ? void 0 : w.message) || "Failed to import pending models");
        } finally {
          d.value = !1;
        }
      }
    }, gt = () => {
      if (se.value)
        if (C.value) {
          if (b.value) {
            const u = o.value.map((y) => {
              const k = l.value[y];
              if (k) return k;
              const x = i.value[y];
              return Uc({
                name: (x == null ? void 0 : x.name) ?? "",
                full_path: (x == null ? void 0 : x.path) ?? "",
                strength_model: 1,
                strength_clip: 1,
                sha256: y,
                enabled: !0
              });
            }), p = {
              version: Number(r.value) || 2,
              loras: u
            };
            Xt(p);
            return;
          }
          const w = {
            version: 2,
            loras: n.value.map((u) => ({
              name: u.name || u.path,
              full_path: u.path,
              strength_model: 1,
              strength_clip: 1,
              sha256: u.sha256,
              enabled: !0
            }))
          };
          Xt(w);
        } else t.value && Xt({ ckpt_path: t.value.path });
    }, Be = () => {
      s.value = !s.value;
    };
    return (w, u) => {
      var p;
      return $(), We(Zi, { to: "body" }, [
        Qe(yn).isOpen ? ($(), L("div", {
          key: 0,
          class: he(["hikaze-modal-backdrop", { "is-fullscreen": s.value }]),
          onClick: Te(F, ["self"])
        }, [
          h("div", {
            class: he(["hikaze-modal-content", { "is-fullscreen": s.value, "is-pending": _.value }])
          }, [
            h("div", Sp, [
              h("div", xp, oe(V.value), 1),
              h("div", Tp, [
                C.value && !_.value ? ($(), L("div", kp, oe(q.value) + " selected ", 1)) : _e("", !0),
                h("button", {
                  class: he(["btn btn-secondary pending-toggle", { active: _.value }]),
                  type: "button",
                  onClick: Z
                }, [
                  u[0] || (u[0] = ft(" Pending ", -1)),
                  I.value ? ($(), L("span", $p, oe(S.value), 1)) : _e("", !0)
                ], 2),
                _.value ? ($(), L("button", {
                  key: 1,
                  class: "btn btn-secondary pending-import",
                  type: "button",
                  disabled: f.value.length === 0 || d.value,
                  onClick: De
                }, " Import Selected ", 8, Ep)) : _e("", !0),
                b.value && !_.value ? ($(), L("button", {
                  key: 2,
                  class: "btn btn-secondary",
                  type: "button",
                  disabled: q.value === 0,
                  onClick: Et
                }, " Clear selection ", 8, Ap)) : _e("", !0),
                h("button", {
                  class: "btn btn-secondary btn-icon",
                  type: "button",
                  "aria-label": te.value,
                  title: te.value,
                  onClick: Be
                }, " 🗗 ", 8, Mp),
                h("button", {
                  class: "btn btn-secondary",
                  onClick: F
                }, "Cancel"),
                h("button", {
                  class: "btn btn-primary",
                  disabled: !se.value,
                  onClick: gt
                }, "Confirm", 8, Ip)
              ])
            ]),
            h("div", Lp, [
              Se(zu, {
                embedded: !0,
                initialTab: (p = Qe(yn).options) == null ? void 0 : p.initialTab,
                mode: a.value
              }, {
                library: ht(({ activeTab: y }) => [
                  h("div", Np, [
                    b.value && !_.value ? ($(), We(_f, {
                      key: 0,
                      items: z.value,
                      onToggle: ie,
                      onSelect: Ae
                    }, null, 8, ["items"])) : _e("", !0),
                    h("div", Pp, [
                      _.value ? ($(), We(Uf, {
                        key: 0,
                        "active-tab": y,
                        "selected-ids": f.value,
                        onSelectModel: Re,
                        onToggleSelect: H
                      }, null, 8, ["active-tab", "selected-ids"])) : ($(), We(xd, {
                        key: 1,
                        "active-tab": y,
                        "selection-mode": b.value ? "lora" : void 0,
                        "selected-ids": o.value,
                        "exclude-selected": b.value,
                        onSelectModel: qe,
                        onToggleSelect: X
                      }, null, 8, ["active-tab", "selection-mode", "selected-ids", "exclude-selected"]))
                    ])
                  ])
                ]),
                details: ht(() => {
                  var y;
                  return [
                    _.value ? ($(), We(Cp, {
                      key: 0,
                      "model-id": (y = c.value) == null ? void 0 : y.id
                    }, null, 8, ["model-id"])) : ($(), We(uf, {
                      key: 1,
                      model: t.value
                    }, null, 8, ["model"]))
                  ];
                }),
                _: 1
              }, 8, ["initialTab", "mode"])
            ])
          ], 2)
        ], 2)) : _e("", !0)
      ]);
    };
  }
}), wp = /* @__PURE__ */ Ge(Op, [["__scopeId", "data-v-26ef2c02"]]), mi = "__hikazeCollapseHooked", vi = "__hikazeVueNodesSettingHooked";
class Fp {
  /**
   * Create the manager; call `install()` once ComfyUI app exists.
   */
  constructor(t) {
    ke(this, "extName");
    ke(this, "getComfyApp");
    ke(this, "controllersByNode", /* @__PURE__ */ new WeakMap());
    ke(this, "controllers", /* @__PURE__ */ new Set());
    ke(this, "graphChangeListenerInstalled", !1);
    ke(this, "collapseReinjectTimers", /* @__PURE__ */ new WeakMap());
    this.extName = t.extName, this.getComfyApp = t.getComfyApp;
  }
  /**
   * Install global event listeners (mode switches + graph switches).
   */
  install() {
    this.installVueNodesSettingListener(), this.installGraphChangeListener(), this.mountGlobalModal();
  }
  mountGlobalModal() {
    const t = document.createElement("div");
    t.setAttribute("data-hikaze-global-host", "1"), t.style.display = "none", document.body.appendChild(t), Pl(wp).mount(t);
  }
  /**
   * ComfyUI callback: user created a node (context menu / paste / etc).
   */
  onNodeCreated(t) {
    try {
      if (!this.isHikazeNode(t)) return;
      this.injectNode(t, "node-created");
    } catch (n) {
      console.error("[Hikaze] Error in onNodeCreated:", n);
    }
  }
  /**
   * ComfyUI callback: node created while loading a workflow/graph.
   */
  onLoadedGraphNode(t) {
    this.isHikazeNode(t) && this.injectNode(t, "loaded-graph-node");
  }
  /**
   * Reinject all Hikaze nodes in the active graph (debug/manual reload).
   */
  reinjectAll(t = "manual-reload") {
    this.reinjectAllForMode(this.getCurrentMode(), t);
  }
  /**
   * Reinject all Hikaze nodes for a specific UI mode.
   * Assumes graph is ready (called via setup/afterConfigureGraph).
   */
  reinjectAllForMode(t, n) {
    const s = this.getComfyApp(), o = this.getActiveGraph(s), i = { mode: t, reason: n, app: s, graph: o }, l = this.getGraphNodes(o);
    if (l)
      for (const r of l)
        this.isHikazeNode(r) && this.reinjectNode(r, i);
  }
  /**
   * Inject a single node by creating a context snapshot and delegating to its controller.
   */
  injectNode(t, n) {
    const s = this.getComfyApp(), o = this.getActiveGraph(s), i = {
      mode: this.getCurrentMode(),
      reason: n,
      app: s,
      graph: o
    };
    this.getOrCreateController(t).inject(i);
  }
  /**
   * Force re-injection of a node for an existing context.
   */
  reinjectNode(t, n) {
    this.getOrCreateController(t).reinject(n);
  }
  /**
   * Reinject a single node by constructing a fresh context snapshot.
   */
  reinjectSingleNode(t, n) {
    const s = this.getComfyApp(), o = this.getActiveGraph(s), i = {
      mode: this.getCurrentMode(),
      reason: n,
      app: s,
      graph: o
    };
    this.reinjectNode(t, i);
  }
  /**
   * If a node already has a controller, dispose it and release resources/DOM.
   */
  disposeControllerIfExists(t) {
    if (!t || typeof t != "object") return;
    const n = this.controllersByNode.get(t);
    if (n)
      try {
        n.dispose();
      } catch {
      }
  }
  /**
   * Schedule a reinjection on the next tick (debounced per-node).
   *
   * Used after un-collapsing a node: ComfyUI recreates DOM, then we mount overlays again.
   */
  scheduleReinjectSingleNode(t, n) {
    if (!t || typeof t != "object") return;
    const s = this.collapseReinjectTimers.get(t);
    if (s != null)
      try {
        window.clearTimeout(s);
      } catch {
      }
    const o = window.setTimeout(() => {
      var i;
      this.collapseReinjectTimers.delete(t), this.isHikazeNode(t) && ((i = t == null ? void 0 : t.flags) != null && i.collapsed || this.reinjectSingleNode(t, n));
    }, 0);
    this.collapseReinjectTimers.set(t, o);
  }
  /**
   * Resolve (and memoize) the controller for a node instance.
   * Controller type is looked up by node type name (`node.type` / `node.comfyClass`).
   */
  getOrCreateController(t) {
    if (this.ensureCollapseHook(t), t && typeof t == "object") {
      const i = this.controllersByNode.get(t);
      if (i) return i;
    }
    const n = this.getNodeType(t), s = (n ? Kt.resolve(n) : void 0) ?? Kt, o = new s(t);
    return t && typeof t == "object" && this.controllersByNode.set(t, o), this.controllers.add(o), o;
  }
  /**
   * Dispose every controller and clear the registry for the active graph.
   */
  disposeAllControllers() {
    for (const t of this.controllers)
      try {
        t.dispose();
      } catch {
      }
    this.controllers.clear(), this.controllersByNode = /* @__PURE__ */ new WeakMap();
    try {
      document.querySelectorAll("[data-hikaze-node-overlay-host='1']").forEach((t) => t.remove());
    } catch {
    }
  }
  /**
   * Listen to VueNodes setting changes and reinject nodes after mode switches.
   */
  installVueNodesSettingListener() {
    var s;
    const t = this.getComfyApp(), n = (s = t == null ? void 0 : t.ui) == null ? void 0 : s.settings;
    if (!n) {
      console.warn(`[${this.extName}] app.ui.settings missing, VueNodes listener skipped.`);
      return;
    }
    pi(n, vi) || (hi(n, vi), n.addEventListener(tu, (o) => {
      var r;
      const i = !!((r = o == null ? void 0 : o.detail) != null && r.value), l = i ? "vue" : "legacy";
      console.info(
        `[${this.extName}] ${Hl} -> ${String(i)}`
      ), this.disposeAllControllers(), window.setTimeout(() => {
        this.reinjectAllForMode(l, "mode-changed");
      }, 0);
    }));
  }
  /**
   * Listen to LiteGraph "graph changed" event and reinject for the new graph.
   */
  installGraphChangeListener() {
    var s;
    const t = this.getComfyApp(), n = (s = t == null ? void 0 : t.canvas) == null ? void 0 : s.canvas;
    if (!n) {
      console.warn(`[${this.extName}] app.canvas.canvas missing, graph listener skipped.`);
      return;
    }
    this.graphChangeListenerInstalled || (this.graphChangeListenerInstalled = !0, n.addEventListener(
      "litegraph:set-graph",
      (o) => {
        window.setTimeout(() => {
          this.disposeAllControllers(), this.reinjectAllForMode(this.getCurrentMode(), "graph-changed");
        }, 50);
      },
      { passive: !0 }
    ));
  }
  /**
   * Ensure collapse/un-collapse transitions are handled:
   * - on collapse: dispose overlays so we don't hold stale DOM references
   * - on un-collapse: schedule a reinject for the next tick
   */
  ensureCollapseHook(t) {
    if (!t || typeof t != "object" || pi(t, mi)) return;
    const n = t.collapse;
    typeof n == "function" && (hi(t, mi), t.collapse = (...s) => {
      var i, l;
      const o = !!((i = t == null ? void 0 : t.flags) != null && i.collapsed);
      try {
        return n.call(t, ...s);
      } finally {
        const r = !!((l = t == null ? void 0 : t.flags) != null && l.collapsed);
        o === r || (r ? this.disposeControllerIfExists(t) : this.scheduleReinjectSingleNode(t, "collapse-changed"));
      }
    });
  }
  /**
   * Detect current rendering mode (VueNodes vs legacy).
   */
  getCurrentMode() {
    var n;
    const t = (n = globalThis == null ? void 0 : globalThis.LiteGraph) == null ? void 0 : n.vueNodesMode;
    return typeof t == "boolean" ? t ? "vue" : "legacy" : document.querySelector("[data-testid='transform-pane']") ? "vue" : "legacy";
  }
  /**
   * Best-effort resolve the currently active graph.
   */
  getActiveGraph(t) {
    var n;
    return ((n = t == null ? void 0 : t.canvas) == null ? void 0 : n.graph) ?? (t == null ? void 0 : t.graph) ?? (globalThis == null ? void 0 : globalThis.graph) ?? null;
  }
  /**
   * Return node list for the given graph (LiteGraph uses different internal fields).
   */
  getGraphNodes(t) {
    const n = (t == null ? void 0 : t._nodes) ?? (t == null ? void 0 : t.nodes);
    return Array.isArray(n) ? n : null;
  }
  /**
   * Resolve node type name. ComfyUI may set `comfyClass` or `type` depending on the path.
   */
  getNodeType(t) {
    const n = (t == null ? void 0 : t.comfyClass) ?? (t == null ? void 0 : t.type);
    return typeof n == "string" && n.length ? n : null;
  }
  /**
   * Whether this node is managed by our injection system.
   * Convention: node type starts with `HIKAZE_NODE_TYPE_PREFIX`.
   */
  isHikazeNode(t) {
    const n = this.getNodeType(t);
    return !!n && n.startsWith(eu);
  }
}
const Rp = new URL("./hikaze-model-manager-2.css", import.meta.url), Ss = document.createElement("link");
Ss.rel = "stylesheet";
Ss.type = "text/css";
Ss.href = Rp.href;
document.head.appendChild(Ss);
const un = "Hikaze.ModelManager2";
console.info(`[${un}] loaded`);
const Dp = globalThis;
Dp.__HIKAZE_EMBEDDED__ = !0;
uu();
hu();
function Kl() {
  var t, n;
  const e = ((n = (t = globalThis == null ? void 0 : globalThis.comfyAPI) == null ? void 0 : t.app) == null ? void 0 : n.app) ?? (globalThis == null ? void 0 : globalThis.app);
  return e || console.warn(`[${un}] Failed to get app instance.`), e;
}
const Gn = new Fp({
  extName: un,
  getComfyApp: Kl
});
function Gl() {
  const e = Kl();
  if (!(e != null && e.registerExtension)) {
    setTimeout(Gl, 250);
    return;
  }
  e.registerExtension({
    name: un,
    /**
     * Called when the app is initialized and ready.
     * We install our global event listeners here.
     */
    async setup(t) {
      console.info(`[${un}] setup() called`), Gn.install();
    },
    /**
     * Called after a workflow is loaded (from file, API, or tab switch).
     * This is the ideal time to inject UI overlays for the entire graph.
     */
    async afterConfigureGraph(t) {
      Gn.reinjectAll("graph-loaded");
    },
    /**
     * Called when a new node is added (e.g. from menu).
     */
    nodeCreated(t) {
      Gn.onNodeCreated(t);
    },
    getCanvasMenuItems() {
      return [
        {
          content: "Reload Hikaze Node UI",
          // Manual reinjection is useful during development/debugging.
          callback: () => Gn.reinjectAll("manual-reload")
        }
      ];
    }
  }), console.info(`[${un}] registered`);
}
Gl();
//# sourceMappingURL=hikaze-model-manager.js.map
