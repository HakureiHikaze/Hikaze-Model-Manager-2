var Jl = Object.defineProperty;
var Yl = (e, t, n) => t in e ? Jl(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var be = (e, t, n) => Yl(e, typeof t != "symbol" ? t + "" : t, n);
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
const ue = {}, Qt = [], lt = () => {
}, _i = () => !1, us = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), eo = (e) => e.startsWith("onUpdate:"), Se = Object.assign, to = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, Zl = Object.prototype.hasOwnProperty, re = (e, t) => Zl.call(e, t), G = Array.isArray, en = (e) => ds(e) === "[object Map]", bi = (e) => ds(e) === "[object Set]", Y = (e) => typeof e == "function", ge = (e) => typeof e == "string", Ct = (e) => typeof e == "symbol", pe = (e) => e !== null && typeof e == "object", Ci = (e) => (pe(e) || Y(e)) && Y(e.then) && Y(e.catch), Si = Object.prototype.toString, ds = (e) => Si.call(e), Xl = (e) => ds(e).slice(8, -1), xi = (e) => ds(e) === "[object Object]", no = (e) => ge(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Cn = /* @__PURE__ */ Qs(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), fs = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return ((n) => t[n] || (t[n] = e(n)));
}, Ql = /-\w/g, It = fs(
  (e) => e.replace(Ql, (t) => t.slice(1).toUpperCase())
), er = /\B([A-Z])/g, Gt = fs(
  (e) => e.replace(er, "-$1").toLowerCase()
), Ti = fs((e) => e.charAt(0).toUpperCase() + e.slice(1)), xs = fs(
  (e) => e ? `on${Ti(e)}` : ""
), At = (e, t) => !Object.is(e, t), qn = (e, ...t) => {
  for (let n = 0; n < e.length; n++)
    e[n](...t);
}, ki = (e, t, n, s = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: s,
    value: n
  });
}, so = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
}, tr = (e) => {
  const t = ge(e) ? Number(e) : NaN;
  return isNaN(t) ? e : t;
};
let To;
const ps = () => To || (To = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function Ue(e) {
  if (G(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const s = e[n], o = ge(s) ? ir(s) : Ue(s);
      if (o)
        for (const i in o)
          t[i] = o[i];
    }
    return t;
  } else if (ge(e) || pe(e))
    return e;
}
const nr = /;(?![^(]*\))/g, sr = /:([^]+)/, or = /\/\*[^]*?\*\//g;
function ir(e) {
  const t = {};
  return e.replace(or, "").split(nr).forEach((n) => {
    if (n) {
      const s = n.split(sr);
      s.length > 1 && (t[s[0].trim()] = s[1].trim());
    }
  }), t;
}
function ce(e) {
  let t = "";
  if (ge(e))
    t = e;
  else if (G(e))
    for (let n = 0; n < e.length; n++) {
      const s = ce(e[n]);
      s && (t += s + " ");
    }
  else if (pe(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
const lr = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", rr = /* @__PURE__ */ Qs(lr);
function $i(e) {
  return !!e || e === "";
}
const Ei = (e) => !!(e && e.__v_isRef === !0), ee = (e) => ge(e) ? e : e == null ? "" : G(e) || pe(e) && (e.toString === Si || !Y(e.toString)) ? Ei(e) ? ee(e.value) : JSON.stringify(e, Mi, 2) : String(e), Mi = (e, t) => Ei(t) ? Mi(e, t.value) : en(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (n, [s, o], i) => (n[Ts(s, i) + " =>"] = o, n),
    {}
  )
} : bi(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((n) => Ts(n))
} : Ct(t) ? Ts(t) : pe(t) && !G(t) && !xi(t) ? String(t) : t, Ts = (e, t = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    Ct(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e
  );
};
/**
* @vue/reactivity v3.5.25
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let Oe;
class ar {
  constructor(t = !1) {
    this.detached = t, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this.parent = Oe, !t && Oe && (this.index = (Oe.scopes || (Oe.scopes = [])).push(
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
      const n = Oe;
      try {
        return Oe = this, t();
      } finally {
        Oe = n;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = Oe, Oe = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    this._on > 0 && --this._on === 0 && (Oe = this.prevScope, this.prevScope = void 0);
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
function cr() {
  return Oe;
}
let fe;
const ks = /* @__PURE__ */ new WeakSet();
class Ai {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Oe && Oe.active && Oe.effects.push(this);
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
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Li(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, ko(this), Ni(this);
    const t = fe, n = qe;
    fe = this, qe = !0;
    try {
      return this.fn();
    } finally {
      Pi(this), fe = t, qe = n, this.flags &= -3;
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
let Ii = 0, Sn, xn;
function Li(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = xn, xn = e;
    return;
  }
  e.next = Sn, Sn = e;
}
function oo() {
  Ii++;
}
function io() {
  if (--Ii > 0)
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
function Ni(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Pi(e) {
  let t, n = e.depsTail, s = n;
  for (; s; ) {
    const o = s.prevDep;
    s.version === -1 ? (s === n && (n = o), lo(s), ur(s)) : t = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = o;
  }
  e.deps = t, e.depsTail = n;
}
function Ds(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (wi(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function wi(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === In) || (e.globalVersion = In, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Ds(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = fe, s = qe;
  fe = e, qe = !0;
  try {
    Ni(e);
    const o = e.fn(e._value);
    (t.version === 0 || At(o, e._value)) && (e.flags |= 128, e._value = o, t.version++);
  } catch (o) {
    throw t.version++, o;
  } finally {
    fe = n, qe = s, Pi(e), e.flags &= -3;
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
function ur(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
let qe = !0;
const Oi = [];
function yt() {
  Oi.push(qe), qe = !1;
}
function _t() {
  const e = Oi.pop();
  qe = e === void 0 ? !0 : e;
}
function ko(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = fe;
    fe = void 0;
    try {
      t();
    } finally {
      fe = n;
    }
  }
}
let In = 0;
class dr {
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
    if (!fe || !qe || fe === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== fe)
      n = this.activeLink = new dr(fe, this), fe.deps ? (n.prevDep = fe.depsTail, fe.depsTail.nextDep = n, fe.depsTail = n) : fe.deps = fe.depsTail = n, Fi(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const s = n.nextDep;
      s.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = s), n.prevDep = fe.depsTail, n.nextDep = void 0, fe.depsTail.nextDep = n, fe.depsTail = n, fe.deps === n && (fe.deps = s);
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
function Fi(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let s = t.deps; s; s = s.nextDep)
        Fi(s);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
  }
}
const js = /* @__PURE__ */ new WeakMap(), Bt = Symbol(
  ""
), Hs = Symbol(
  ""
), Ln = Symbol(
  ""
);
function Te(e, t, n) {
  if (qe && fe) {
    let s = js.get(e);
    s || js.set(e, s = /* @__PURE__ */ new Map());
    let o = s.get(n);
    o || (s.set(n, o = new ro()), o.map = s, o.key = n), o.track();
  }
}
function mt(e, t, n, s, o, i) {
  const l = js.get(e);
  if (!l) {
    In++;
    return;
  }
  const a = (c) => {
    c && c.trigger();
  };
  if (oo(), t === "clear")
    l.forEach(a);
  else {
    const c = G(e), p = c && no(n);
    if (c && n === "length") {
      const d = Number(s);
      l.forEach((f, y) => {
        (y === "length" || y === Ln || !Ct(y) && y >= d) && a(f);
      });
    } else
      switch ((n !== void 0 || l.has(void 0)) && a(l.get(n)), p && a(l.get(Ln)), t) {
        case "add":
          c ? p && a(l.get("length")) : (a(l.get(Bt)), en(e) && a(l.get(Hs)));
          break;
        case "delete":
          c || (a(l.get(Bt)), en(e) && a(l.get(Hs)));
          break;
        case "set":
          en(e) && a(l.get(Bt));
          break;
      }
  }
  io();
}
function Jt(e) {
  const t = le(e);
  return t === e ? t : (Te(t, "iterate", Ln), We(e) ? t : t.map(Je));
}
function hs(e) {
  return Te(e = le(e), "iterate", Ln), e;
}
function $t(e, t) {
  return bt(e) ? zt(e) ? dn(Je(t)) : dn(t) : Je(t);
}
const fr = {
  __proto__: null,
  [Symbol.iterator]() {
    return $s(this, Symbol.iterator, (e) => $t(this, e));
  },
  concat(...e) {
    return Jt(this).concat(
      ...e.map((t) => G(t) ? Jt(t) : t)
    );
  },
  entries() {
    return $s(this, "entries", (e) => (e[1] = $t(this, e[1]), e));
  },
  every(e, t) {
    return ft(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return ft(
      this,
      "filter",
      e,
      t,
      (n) => n.map((s) => $t(this, s)),
      arguments
    );
  },
  find(e, t) {
    return ft(
      this,
      "find",
      e,
      t,
      (n) => $t(this, n),
      arguments
    );
  },
  findIndex(e, t) {
    return ft(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return ft(
      this,
      "findLast",
      e,
      t,
      (n) => $t(this, n),
      arguments
    );
  },
  findLastIndex(e, t) {
    return ft(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return ft(this, "forEach", e, t, void 0, arguments);
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
    return ft(this, "map", e, t, void 0, arguments);
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
    return ft(this, "some", e, t, void 0, arguments);
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
    return $s(this, "values", (e) => $t(this, e));
  }
};
function $s(e, t, n) {
  const s = hs(e), o = s[t]();
  return s !== e && !We(e) && (o._next = o.next, o.next = () => {
    const i = o._next();
    return i.done || (i.value = n(i.value)), i;
  }), o;
}
const pr = Array.prototype;
function ft(e, t, n, s, o, i) {
  const l = hs(e), a = l !== e && !We(e), c = l[t];
  if (c !== pr[t]) {
    const f = c.apply(e, i);
    return a ? Je(f) : f;
  }
  let p = n;
  l !== e && (a ? p = function(f, y) {
    return n.call(this, $t(e, f), y, e);
  } : n.length > 2 && (p = function(f, y) {
    return n.call(this, f, y, e);
  }));
  const d = c.call(l, p, s);
  return a && o ? o(d) : d;
}
function $o(e, t, n, s) {
  const o = hs(e);
  let i = n;
  return o !== e && (We(e) ? n.length > 3 && (i = function(l, a, c) {
    return n.call(this, l, a, c, e);
  }) : i = function(l, a, c) {
    return n.call(this, l, $t(e, a), c, e);
  }), o[t](i, ...s);
}
function Es(e, t, n) {
  const s = le(e);
  Te(s, "iterate", Ln);
  const o = s[t](...n);
  return (o === -1 || o === !1) && uo(n[0]) ? (n[0] = le(n[0]), s[t](...n)) : o;
}
function gn(e, t, n = []) {
  yt(), oo();
  const s = le(e)[t].apply(e, n);
  return io(), _t(), s;
}
const hr = /* @__PURE__ */ Qs("__proto__,__v_isRef,__isVue"), Ri = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(Ct)
);
function gr(e) {
  Ct(e) || (e = String(e));
  const t = le(this);
  return Te(t, "has", e), t.hasOwnProperty(e);
}
class Di {
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
      return s === (o ? i ? kr : Bi : i ? Vi : Hi).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(s) ? t : void 0;
    const l = G(t);
    if (!o) {
      let c;
      if (l && (c = fr[n]))
        return c;
      if (n === "hasOwnProperty")
        return gr;
    }
    const a = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      Ee(t) ? t : s
    );
    if ((Ct(n) ? Ri.has(n) : hr(n)) || (o || Te(t, "get", n), i))
      return a;
    if (Ee(a)) {
      const c = l && no(n) ? a : a.value;
      return o && pe(c) ? Qn(c) : c;
    }
    return pe(a) ? o ? Qn(a) : me(a) : a;
  }
}
class ji extends Di {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, s, o) {
    let i = t[n];
    const l = G(t) && no(n);
    if (!this._isShallow) {
      const p = bt(i);
      if (!We(s) && !bt(s) && (i = le(i), s = le(s)), !l && Ee(i) && !Ee(s))
        return p || (i.value = s), !0;
    }
    const a = l ? Number(n) < t.length : re(t, n), c = Reflect.set(
      t,
      n,
      s,
      Ee(t) ? t : o
    );
    return t === le(o) && (a ? At(s, i) && mt(t, "set", n, s) : mt(t, "add", n, s)), c;
  }
  deleteProperty(t, n) {
    const s = re(t, n);
    t[n];
    const o = Reflect.deleteProperty(t, n);
    return o && s && mt(t, "delete", n, void 0), o;
  }
  has(t, n) {
    const s = Reflect.has(t, n);
    return (!Ct(n) || !Ri.has(n)) && Te(t, "has", n), s;
  }
  ownKeys(t) {
    return Te(
      t,
      "iterate",
      G(t) ? "length" : Bt
    ), Reflect.ownKeys(t);
  }
}
class mr extends Di {
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
const vr = /* @__PURE__ */ new ji(), yr = /* @__PURE__ */ new mr(), _r = /* @__PURE__ */ new ji(!0);
const Vs = (e) => e, Bn = (e) => Reflect.getPrototypeOf(e);
function br(e, t, n) {
  return function(...s) {
    const o = this.__v_raw, i = le(o), l = en(i), a = e === "entries" || e === Symbol.iterator && l, c = e === "keys" && l, p = o[e](...s), d = n ? Vs : t ? dn : Je;
    return !t && Te(
      i,
      "iterate",
      c ? Hs : Bt
    ), {
      // iterator protocol
      next() {
        const { value: f, done: y } = p.next();
        return y ? { value: f, done: y } : {
          value: a ? [d(f[0]), d(f[1])] : d(f),
          done: y
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
function Cr(e, t) {
  const n = {
    get(o) {
      const i = this.__v_raw, l = le(i), a = le(o);
      e || (At(o, a) && Te(l, "get", o), Te(l, "get", a));
      const { has: c } = Bn(l), p = t ? Vs : e ? dn : Je;
      if (c.call(l, o))
        return p(i.get(o));
      if (c.call(l, a))
        return p(i.get(a));
      i !== l && i.get(o);
    },
    get size() {
      const o = this.__v_raw;
      return !e && Te(le(o), "iterate", Bt), o.size;
    },
    has(o) {
      const i = this.__v_raw, l = le(i), a = le(o);
      return e || (At(o, a) && Te(l, "has", o), Te(l, "has", a)), o === a ? i.has(o) : i.has(o) || i.has(a);
    },
    forEach(o, i) {
      const l = this, a = l.__v_raw, c = le(a), p = t ? Vs : e ? dn : Je;
      return !e && Te(c, "iterate", Bt), a.forEach((d, f) => o.call(i, p(d), p(f), l));
    }
  };
  return Se(
    n,
    e ? {
      add: zn("add"),
      set: zn("set"),
      delete: zn("delete"),
      clear: zn("clear")
    } : {
      add(o) {
        !t && !We(o) && !bt(o) && (o = le(o));
        const i = le(this);
        return Bn(i).has.call(i, o) || (i.add(o), mt(i, "add", o, o)), this;
      },
      set(o, i) {
        !t && !We(i) && !bt(i) && (i = le(i));
        const l = le(this), { has: a, get: c } = Bn(l);
        let p = a.call(l, o);
        p || (o = le(o), p = a.call(l, o));
        const d = c.call(l, o);
        return l.set(o, i), p ? At(i, d) && mt(l, "set", o, i) : mt(l, "add", o, i), this;
      },
      delete(o) {
        const i = le(this), { has: l, get: a } = Bn(i);
        let c = l.call(i, o);
        c || (o = le(o), c = l.call(i, o)), a && a.call(i, o);
        const p = i.delete(o);
        return c && mt(i, "delete", o, void 0), p;
      },
      clear() {
        const o = le(this), i = o.size !== 0, l = o.clear();
        return i && mt(
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
    n[o] = br(o, e, t);
  }), n;
}
function ao(e, t) {
  const n = Cr(e, t);
  return (s, o, i) => o === "__v_isReactive" ? !e : o === "__v_isReadonly" ? e : o === "__v_raw" ? s : Reflect.get(
    re(n, o) && o in s ? n : s,
    o,
    i
  );
}
const Sr = {
  get: /* @__PURE__ */ ao(!1, !1)
}, xr = {
  get: /* @__PURE__ */ ao(!1, !0)
}, Tr = {
  get: /* @__PURE__ */ ao(!0, !1)
};
const Hi = /* @__PURE__ */ new WeakMap(), Vi = /* @__PURE__ */ new WeakMap(), Bi = /* @__PURE__ */ new WeakMap(), kr = /* @__PURE__ */ new WeakMap();
function $r(e) {
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
function Er(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : $r(Xl(e));
}
function me(e) {
  return bt(e) ? e : co(
    e,
    !1,
    vr,
    Sr,
    Hi
  );
}
function Mr(e) {
  return co(
    e,
    !1,
    _r,
    xr,
    Vi
  );
}
function Qn(e) {
  return co(
    e,
    !0,
    yr,
    Tr,
    Bi
  );
}
function co(e, t, n, s, o) {
  if (!pe(e) || e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const i = Er(e);
  if (i === 0)
    return e;
  const l = o.get(e);
  if (l)
    return l;
  const a = new Proxy(
    e,
    i === 2 ? s : n
  );
  return o.set(e, a), a;
}
function zt(e) {
  return bt(e) ? zt(e.__v_raw) : !!(e && e.__v_isReactive);
}
function bt(e) {
  return !!(e && e.__v_isReadonly);
}
function We(e) {
  return !!(e && e.__v_isShallow);
}
function uo(e) {
  return e ? !!e.__v_raw : !1;
}
function le(e) {
  const t = e && e.__v_raw;
  return t ? le(t) : e;
}
function Ar(e) {
  return !re(e, "__v_skip") && Object.isExtensible(e) && ki(e, "__v_skip", !0), e;
}
const Je = (e) => pe(e) ? me(e) : e, dn = (e) => pe(e) ? Qn(e) : e;
function Ee(e) {
  return e ? e.__v_isRef === !0 : !1;
}
function V(e) {
  return Ir(e, !1);
}
function Ir(e, t) {
  return Ee(e) ? e : new Lr(e, t);
}
class Lr {
  constructor(t, n) {
    this.dep = new ro(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? t : le(t), this._value = n ? t : Je(t), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(t) {
    const n = this._rawValue, s = this.__v_isShallow || We(t) || bt(t);
    t = s ? t : le(t), At(t, n) && (this._rawValue = t, this._value = s ? t : Je(t), this.dep.trigger());
  }
}
function Ge(e) {
  return Ee(e) ? e.value : e;
}
const Nr = {
  get: (e, t, n) => t === "__v_raw" ? e : Ge(Reflect.get(e, t, n)),
  set: (e, t, n, s) => {
    const o = e[t];
    return Ee(o) && !Ee(n) ? (o.value = n, !0) : Reflect.set(e, t, n, s);
  }
};
function zi(e) {
  return zt(e) ? e : new Proxy(e, Nr);
}
class Pr {
  constructor(t, n, s) {
    this.fn = t, this.setter = n, this._value = void 0, this.dep = new ro(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = In - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = s;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    fe !== this)
      return Li(this, !0), !0;
  }
  get value() {
    const t = this.dep.track();
    return wi(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
function wr(e, t, n = !1) {
  let s, o;
  return Y(e) ? s = e : (s = e.get, o = e.set), new Pr(s, o, n);
}
const Un = {}, es = /* @__PURE__ */ new WeakMap();
let jt;
function Or(e, t = !1, n = jt) {
  if (n) {
    let s = es.get(n);
    s || es.set(n, s = []), s.push(e);
  }
}
function Fr(e, t, n = ue) {
  const { immediate: s, deep: o, once: i, scheduler: l, augmentJob: a, call: c } = n, p = (C) => o ? C : We(C) || o === !1 || o === 0 ? vt(C, 1) : vt(C);
  let d, f, y, _, A = !1, k = !1;
  if (Ee(e) ? (f = () => e.value, A = We(e)) : zt(e) ? (f = () => p(e), A = !0) : G(e) ? (k = !0, A = e.some((C) => zt(C) || We(C)), f = () => e.map((C) => {
    if (Ee(C))
      return C.value;
    if (zt(C))
      return p(C);
    if (Y(C))
      return c ? c(C, 2) : C();
  })) : Y(e) ? t ? f = c ? () => c(e, 2) : e : f = () => {
    if (y) {
      yt();
      try {
        y();
      } finally {
        _t();
      }
    }
    const C = jt;
    jt = d;
    try {
      return c ? c(e, 3, [_]) : e(_);
    } finally {
      jt = C;
    }
  } : f = lt, t && o) {
    const C = f, H = o === !0 ? 1 / 0 : o;
    f = () => vt(C(), H);
  }
  const L = cr(), b = () => {
    d.stop(), L && L.active && to(L.effects, d);
  };
  if (i && t) {
    const C = t;
    t = (...H) => {
      C(...H), b();
    };
  }
  let v = k ? new Array(e.length).fill(Un) : Un;
  const T = (C) => {
    if (!(!(d.flags & 1) || !d.dirty && !C))
      if (t) {
        const H = d.run();
        if (o || A || (k ? H.some((B, Z) => At(B, v[Z])) : At(H, v))) {
          y && y();
          const B = jt;
          jt = d;
          try {
            const Z = [
              H,
              // pass undefined as the old value when it's changed for the first time
              v === Un ? void 0 : k && v[0] === Un ? [] : v,
              _
            ];
            v = H, c ? c(t, 3, Z) : (
              // @ts-expect-error
              t(...Z)
            );
          } finally {
            jt = B;
          }
        }
      } else
        d.run();
  };
  return a && a(T), d = new Ai(f), d.scheduler = l ? () => l(T, !1) : T, _ = (C) => Or(C, !1, d), y = d.onStop = () => {
    const C = es.get(d);
    if (C) {
      if (c)
        c(C, 4);
      else
        for (const H of C) H();
      es.delete(d);
    }
  }, t ? s ? T(!0) : v = d.run() : l ? l(T.bind(null, !0), !0) : d.run(), b.pause = d.pause.bind(d), b.resume = d.resume.bind(d), b.stop = b, b;
}
function vt(e, t = 1 / 0, n) {
  if (t <= 0 || !pe(e) || e.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t))
    return e;
  if (n.set(e, t), t--, Ee(e))
    vt(e.value, t, n);
  else if (G(e))
    for (let s = 0; s < e.length; s++)
      vt(e[s], t, n);
  else if (bi(e) || en(e))
    e.forEach((s) => {
      vt(s, t, n);
    });
  else if (xi(e)) {
    for (const s in e)
      vt(e[s], t, n);
    for (const s of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, s) && vt(e[s], t, n);
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
function Ye(e, t, n, s) {
  if (Y(e)) {
    const o = jn(e, t, n, s);
    return o && Ci(o) && o.catch((i) => {
      gs(i, t, n);
    }), o;
  }
  if (G(e)) {
    const o = [];
    for (let i = 0; i < e.length; i++)
      o.push(Ye(e[i], t, n, s));
    return o;
  }
}
function gs(e, t, n, s = !0) {
  const o = t ? t.vnode : null, { errorHandler: i, throwUnhandledErrorInProduction: l } = t && t.appContext.config || ue;
  if (t) {
    let a = t.parent;
    const c = t.proxy, p = `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; a; ) {
      const d = a.ec;
      if (d) {
        for (let f = 0; f < d.length; f++)
          if (d[f](e, c, p) === !1)
            return;
      }
      a = a.parent;
    }
    if (i) {
      yt(), jn(i, null, 10, [
        e,
        c,
        p
      ]), _t();
      return;
    }
  }
  Rr(e, n, o, s, l);
}
function Rr(e, t, n, s = !0, o = !1) {
  if (o)
    throw e;
  console.error(e);
}
const Le = [];
let nt = -1;
const tn = [];
let Et = null, Yt = 0;
const Ui = /* @__PURE__ */ Promise.resolve();
let ts = null;
function fo(e) {
  const t = ts || Ui;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function Dr(e) {
  let t = nt + 1, n = Le.length;
  for (; t < n; ) {
    const s = t + n >>> 1, o = Le[s], i = Nn(o);
    i < e || i === e && o.flags & 2 ? t = s + 1 : n = s;
  }
  return t;
}
function po(e) {
  if (!(e.flags & 1)) {
    const t = Nn(e), n = Le[Le.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(e.flags & 2) && t >= Nn(n) ? Le.push(e) : Le.splice(Dr(t), 0, e), e.flags |= 1, Wi();
  }
}
function Wi() {
  ts || (ts = Ui.then(Gi));
}
function jr(e) {
  G(e) ? tn.push(...e) : Et && e.id === -1 ? Et.splice(Yt + 1, 0, e) : e.flags & 1 || (tn.push(e), e.flags |= 1), Wi();
}
function Eo(e, t, n = nt + 1) {
  for (; n < Le.length; n++) {
    const s = Le[n];
    if (s && s.flags & 2) {
      if (e && s.id !== e.uid)
        continue;
      Le.splice(n, 1), n--, s.flags & 4 && (s.flags &= -2), s(), s.flags & 4 || (s.flags &= -2);
    }
  }
}
function Ki(e) {
  if (tn.length) {
    const t = [...new Set(tn)].sort(
      (n, s) => Nn(n) - Nn(s)
    );
    if (tn.length = 0, Et) {
      Et.push(...t);
      return;
    }
    for (Et = t, Yt = 0; Yt < Et.length; Yt++) {
      const n = Et[Yt];
      n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), n.flags &= -2;
    }
    Et = null, Yt = 0;
  }
}
const Nn = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function Gi(e) {
  try {
    for (nt = 0; nt < Le.length; nt++) {
      const t = Le[nt];
      t && !(t.flags & 8) && (t.flags & 4 && (t.flags &= -2), jn(
        t,
        t.i,
        t.i ? 15 : 14
      ), t.flags & 4 || (t.flags &= -2));
    }
  } finally {
    for (; nt < Le.length; nt++) {
      const t = Le[nt];
      t && (t.flags &= -2);
    }
    nt = -1, Le.length = 0, Ki(), ts = null, (Le.length || tn.length) && Gi();
  }
}
let $e = null, qi = null;
function ns(e) {
  const t = $e;
  return $e = e, qi = e && e.type.__scopeId || null, t;
}
function rt(e, t = $e, n) {
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
function ze(e, t) {
  if ($e === null)
    return e;
  const n = bs($e), s = e.dirs || (e.dirs = []);
  for (let o = 0; o < t.length; o++) {
    let [i, l, a, c = ue] = t[o];
    i && (Y(i) && (i = {
      mounted: i,
      updated: i
    }), i.deep && vt(l), s.push({
      dir: i,
      instance: n,
      value: l,
      oldValue: void 0,
      arg: a,
      modifiers: c
    }));
  }
  return e;
}
function Ot(e, t, n, s) {
  const o = e.dirs, i = t && t.dirs;
  for (let l = 0; l < o.length; l++) {
    const a = o[l];
    i && (a.oldValue = i[l].value);
    let c = a.dir[s];
    c && (yt(), Ye(c, n, 8, [
      e.el,
      a,
      e,
      t
    ]), _t());
  }
}
const Ji = Symbol("_vte"), Yi = (e) => e.__isTeleport, Tn = (e) => e && (e.disabled || e.disabled === ""), Mo = (e) => e && (e.defer || e.defer === ""), Ao = (e) => typeof SVGElement < "u" && e instanceof SVGElement, Io = (e) => typeof MathMLElement == "function" && e instanceof MathMLElement, Bs = (e, t) => {
  const n = e && e.to;
  return ge(n) ? t ? t(n) : null : n;
}, Zi = {
  name: "Teleport",
  __isTeleport: !0,
  process(e, t, n, s, o, i, l, a, c, p) {
    const {
      mc: d,
      pc: f,
      pbc: y,
      o: { insert: _, querySelector: A, createText: k, createComment: L }
    } = p, b = Tn(t.props);
    let { shapeFlag: v, children: T, dynamicChildren: C } = t;
    if (e == null) {
      const H = t.el = k(""), B = t.anchor = k("");
      _(H, n, s), _(B, n, s);
      const Z = (j, W) => {
        v & 16 && d(
          T,
          j,
          W,
          o,
          i,
          l,
          a,
          c
        );
      }, J = () => {
        const j = t.target = Bs(t.props, A), W = Qi(j, t, k, _);
        j && (l !== "svg" && Ao(j) ? l = "svg" : l !== "mathml" && Io(j) && (l = "mathml"), o && o.isCE && (o.ce._teleportTargets || (o.ce._teleportTargets = /* @__PURE__ */ new Set())).add(j), b || (Z(j, W), Jn(t, !1)));
      };
      b && (Z(n, B), Jn(t, !0)), Mo(t.props) ? (t.el.__isMounted = !1, Ie(() => {
        J(), delete t.el.__isMounted;
      }, i)) : J();
    } else {
      if (Mo(t.props) && e.el.__isMounted === !1) {
        Ie(() => {
          Zi.process(
            e,
            t,
            n,
            s,
            o,
            i,
            l,
            a,
            c,
            p
          );
        }, i);
        return;
      }
      t.el = e.el, t.targetStart = e.targetStart;
      const H = t.anchor = e.anchor, B = t.target = e.target, Z = t.targetAnchor = e.targetAnchor, J = Tn(e.props), j = J ? n : B, W = J ? H : Z;
      if (l === "svg" || Ao(B) ? l = "svg" : (l === "mathml" || Io(B)) && (l = "mathml"), C ? (y(
        e.dynamicChildren,
        C,
        j,
        o,
        i,
        l,
        a
      ), mo(e, t, !0)) : c || f(
        e,
        t,
        j,
        W,
        o,
        i,
        l,
        a,
        !1
      ), b)
        J ? t.props && e.props && t.props.to !== e.props.to && (t.props.to = e.props.to) : Wn(
          t,
          n,
          H,
          p,
          1
        );
      else if ((t.props && t.props.to) !== (e.props && e.props.to)) {
        const oe = t.target = Bs(
          t.props,
          A
        );
        oe && Wn(
          t,
          oe,
          null,
          p,
          0
        );
      } else J && Wn(
        t,
        B,
        Z,
        p,
        1
      );
      Jn(t, b);
    }
  },
  remove(e, t, n, { um: s, o: { remove: o } }, i) {
    const {
      shapeFlag: l,
      children: a,
      anchor: c,
      targetStart: p,
      targetAnchor: d,
      target: f,
      props: y
    } = e;
    if (f && (o(p), o(d)), i && o(c), l & 16) {
      const _ = i || !Tn(y);
      for (let A = 0; A < a.length; A++) {
        const k = a[A];
        s(
          k,
          t,
          n,
          _,
          !!k.dynamicChildren
        );
      }
    }
  },
  move: Wn,
  hydrate: Hr
};
function Wn(e, t, n, { o: { insert: s }, m: o }, i = 2) {
  i === 0 && s(e.targetAnchor, t, n);
  const { el: l, anchor: a, shapeFlag: c, children: p, props: d } = e, f = i === 2;
  if (f && s(l, t, n), (!f || Tn(d)) && c & 16)
    for (let y = 0; y < p.length; y++)
      o(
        p[y],
        t,
        n,
        2
      );
  f && s(a, t, n);
}
function Hr(e, t, n, s, o, i, {
  o: { nextSibling: l, parentNode: a, querySelector: c, insert: p, createText: d }
}, f) {
  function y(k, L, b, v) {
    L.anchor = f(
      l(k),
      L,
      a(k),
      n,
      s,
      o,
      i
    ), L.targetStart = b, L.targetAnchor = v;
  }
  const _ = t.target = Bs(
    t.props,
    c
  ), A = Tn(t.props);
  if (_) {
    const k = _._lpa || _.firstChild;
    if (t.shapeFlag & 16)
      if (A)
        y(
          e,
          t,
          k,
          k && l(k)
        );
      else {
        t.anchor = l(e);
        let L = k;
        for (; L; ) {
          if (L && L.nodeType === 8) {
            if (L.data === "teleport start anchor")
              t.targetStart = L;
            else if (L.data === "teleport anchor") {
              t.targetAnchor = L, _._lpa = t.targetAnchor && l(t.targetAnchor);
              break;
            }
          }
          L = l(L);
        }
        t.targetAnchor || Qi(_, t, d, p), f(
          k && l(k),
          t,
          _,
          n,
          s,
          o,
          i
        );
      }
    Jn(t, A);
  } else A && t.shapeFlag & 16 && y(e, t, e, l(e));
  return t.anchor && l(t.anchor);
}
const Xi = Zi;
function Jn(e, t) {
  const n = e.ctx;
  if (n && n.ut) {
    let s, o;
    for (t ? (s = e.el, o = e.anchor) : (s = e.targetStart, o = e.targetAnchor); s && s !== o; )
      s.nodeType === 1 && s.setAttribute("data-v-owner", n.uid), s = s.nextSibling;
    n.ut();
  }
}
function Qi(e, t, n, s) {
  const o = t.targetStart = n(""), i = t.targetAnchor = n("");
  return o[Ji] = i, e && (s(o, e), s(i, e)), i;
}
const gt = Symbol("_leaveCb"), Kn = Symbol("_enterCb");
function Vr() {
  const e = {
    isMounted: !1,
    isLeaving: !1,
    isUnmounting: !1,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  return Nt(() => {
    e.isMounted = !0;
  }), rl(() => {
    e.isUnmounting = !0;
  }), e;
}
const Be = [Function, Array], el = {
  mode: String,
  appear: Boolean,
  persisted: Boolean,
  // enter
  onBeforeEnter: Be,
  onEnter: Be,
  onAfterEnter: Be,
  onEnterCancelled: Be,
  // leave
  onBeforeLeave: Be,
  onLeave: Be,
  onAfterLeave: Be,
  onLeaveCancelled: Be,
  // appear
  onBeforeAppear: Be,
  onAppear: Be,
  onAfterAppear: Be,
  onAppearCancelled: Be
}, tl = (e) => {
  const t = e.subTree;
  return t.component ? tl(t.component) : t;
}, Br = {
  name: "BaseTransition",
  props: el,
  setup(e, { slots: t }) {
    const n = El(), s = Vr();
    return () => {
      const o = t.default && ol(t.default(), !0);
      if (!o || !o.length)
        return;
      const i = nl(o), l = le(e), { mode: a } = l;
      if (s.isLeaving)
        return Ms(i);
      const c = Lo(i);
      if (!c)
        return Ms(i);
      let p = zs(
        c,
        l,
        s,
        n,
        // #11061, ensure enterHooks is fresh after clone
        (f) => p = f
      );
      c.type !== ke && Pn(c, p);
      let d = n.subTree && Lo(n.subTree);
      if (d && d.type !== ke && !Vt(d, c) && tl(n).type !== ke) {
        let f = zs(
          d,
          l,
          s,
          n
        );
        if (Pn(d, f), a === "out-in" && c.type !== ke)
          return s.isLeaving = !0, f.afterLeave = () => {
            s.isLeaving = !1, n.job.flags & 8 || n.update(), delete f.afterLeave, d = void 0;
          }, Ms(i);
        a === "in-out" && c.type !== ke ? f.delayLeave = (y, _, A) => {
          const k = sl(
            s,
            d
          );
          k[String(d.key)] = d, y[gt] = () => {
            _(), y[gt] = void 0, delete p.delayedLeave, d = void 0;
          }, p.delayedLeave = () => {
            A(), delete p.delayedLeave, d = void 0;
          };
        } : d = void 0;
      } else d && (d = void 0);
      return i;
    };
  }
};
function nl(e) {
  let t = e[0];
  if (e.length > 1) {
    for (const n of e)
      if (n.type !== ke) {
        t = n;
        break;
      }
  }
  return t;
}
const zr = Br;
function sl(e, t) {
  const { leavingVNodes: n } = e;
  let s = n.get(t.type);
  return s || (s = /* @__PURE__ */ Object.create(null), n.set(t.type, s)), s;
}
function zs(e, t, n, s, o) {
  const {
    appear: i,
    mode: l,
    persisted: a = !1,
    onBeforeEnter: c,
    onEnter: p,
    onAfterEnter: d,
    onEnterCancelled: f,
    onBeforeLeave: y,
    onLeave: _,
    onAfterLeave: A,
    onLeaveCancelled: k,
    onBeforeAppear: L,
    onAppear: b,
    onAfterAppear: v,
    onAppearCancelled: T
  } = t, C = String(e.key), H = sl(n, e), B = (j, W) => {
    j && Ye(
      j,
      s,
      9,
      W
    );
  }, Z = (j, W) => {
    const oe = W[1];
    B(j, W), G(j) ? j.every((E) => E.length <= 1) && oe() : j.length <= 1 && oe();
  }, J = {
    mode: l,
    persisted: a,
    beforeEnter(j) {
      let W = c;
      if (!n.isMounted)
        if (i)
          W = L || c;
        else
          return;
      j[gt] && j[gt](
        !0
        /* cancelled */
      );
      const oe = H[C];
      oe && Vt(e, oe) && oe.el[gt] && oe.el[gt](), B(W, [j]);
    },
    enter(j) {
      let W = p, oe = d, E = f;
      if (!n.isMounted)
        if (i)
          W = b || p, oe = v || d, E = T || f;
        else
          return;
      let F = !1;
      const D = j[Kn] = (X) => {
        F || (F = !0, X ? B(E, [j]) : B(oe, [j]), J.delayedLeave && J.delayedLeave(), j[Kn] = void 0);
      };
      W ? Z(W, [j, D]) : D();
    },
    leave(j, W) {
      const oe = String(e.key);
      if (j[Kn] && j[Kn](
        !0
        /* cancelled */
      ), n.isUnmounting)
        return W();
      B(y, [j]);
      let E = !1;
      const F = j[gt] = (D) => {
        E || (E = !0, W(), D ? B(k, [j]) : B(A, [j]), j[gt] = void 0, H[oe] === e && delete H[oe]);
      };
      H[oe] = e, _ ? Z(_, [j, F]) : F();
    },
    clone(j) {
      const W = zs(
        j,
        t,
        n,
        s,
        o
      );
      return o && o(W), W;
    }
  };
  return J;
}
function Ms(e) {
  if (ms(e))
    return e = Lt(e), e.children = null, e;
}
function Lo(e) {
  if (!ms(e))
    return Yi(e.type) && e.children ? nl(e.children) : e;
  if (e.component)
    return e.component.subTree;
  const { shapeFlag: t, children: n } = e;
  if (n) {
    if (t & 16)
      return n[0];
    if (t & 32 && Y(n.default))
      return n.default();
  }
}
function Pn(e, t) {
  e.shapeFlag & 6 && e.component ? (e.transition = t, Pn(e.component.subTree, t)) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
function ol(e, t = !1, n) {
  let s = [], o = 0;
  for (let i = 0; i < e.length; i++) {
    let l = e[i];
    const a = n == null ? l.key : String(n) + String(l.key != null ? l.key : i);
    l.type === ie ? (l.patchFlag & 128 && o++, s = s.concat(
      ol(l.children, t, a)
    )) : (t || l.type !== ke) && s.push(a != null ? Lt(l, { key: a }) : l);
  }
  if (o > 1)
    for (let i = 0; i < s.length; i++)
      s[i].patchFlag = -2;
  return s;
}
// @__NO_SIDE_EFFECTS__
function je(e, t) {
  return Y(e) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    Se({ name: e.name }, t, { setup: e })
  ) : e;
}
function il(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
const ss = /* @__PURE__ */ new WeakMap();
function kn(e, t, n, s, o = !1) {
  if (G(e)) {
    e.forEach(
      (A, k) => kn(
        A,
        t && (G(t) ? t[k] : t),
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
  const i = s.shapeFlag & 4 ? bs(s.component) : s.el, l = o ? null : i, { i: a, r: c } = e, p = t && t.r, d = a.refs === ue ? a.refs = {} : a.refs, f = a.setupState, y = le(f), _ = f === ue ? _i : (A) => re(y, A);
  if (p != null && p !== c) {
    if (No(t), ge(p))
      d[p] = null, _(p) && (f[p] = null);
    else if (Ee(p)) {
      p.value = null;
      const A = t;
      A.k && (d[A.k] = null);
    }
  }
  if (Y(c))
    jn(c, a, 12, [l, d]);
  else {
    const A = ge(c), k = Ee(c);
    if (A || k) {
      const L = () => {
        if (e.f) {
          const b = A ? _(c) ? f[c] : d[c] : c.value;
          if (o)
            G(b) && to(b, i);
          else if (G(b))
            b.includes(i) || b.push(i);
          else if (A)
            d[c] = [i], _(c) && (f[c] = d[c]);
          else {
            const v = [i];
            c.value = v, e.k && (d[e.k] = v);
          }
        } else A ? (d[c] = l, _(c) && (f[c] = l)) : k && (c.value = l, e.k && (d[e.k] = l));
      };
      if (l) {
        const b = () => {
          L(), ss.delete(e);
        };
        b.id = -1, ss.set(e, b), Ie(b, n);
      } else
        No(e), L();
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
function Ur(e, t) {
  ll(e, "a", t);
}
function Wr(e, t) {
  ll(e, "da", t);
}
function ll(e, t, n = Ne) {
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
      ms(o.parent.vnode) && Kr(s, t, n, o), o = o.parent;
  }
}
function Kr(e, t, n, s) {
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
function vs(e, t, n = Ne, s = !1) {
  if (n) {
    const o = n[e] || (n[e] = []), i = t.__weh || (t.__weh = (...l) => {
      yt();
      const a = Hn(n), c = Ye(t, n, e, l);
      return a(), _t(), c;
    });
    return s ? o.unshift(i) : o.push(i), i;
  }
}
const St = (e) => (t, n = Ne) => {
  (!Fn || e === "sp") && vs(e, (...s) => t(...s), n);
}, Gr = St("bm"), Nt = St("m"), qr = St(
  "bu"
), Jr = St("u"), rl = St(
  "bum"
), fn = St("um"), Yr = St(
  "sp"
), Zr = St("rtg"), Xr = St("rtc");
function Qr(e, t = Ne) {
  vs("ec", e, t);
}
const ea = Symbol.for("v-ndc");
function ye(e, t, n, s) {
  let o;
  const i = n, l = G(e);
  if (l || ge(e)) {
    const a = l && zt(e);
    let c = !1, p = !1;
    a && (c = !We(e), p = bt(e), e = hs(e)), o = new Array(e.length);
    for (let d = 0, f = e.length; d < f; d++)
      o[d] = t(
        c ? p ? dn(Je(e[d])) : Je(e[d]) : e[d],
        d,
        void 0,
        i
      );
  } else if (typeof e == "number") {
    o = new Array(e);
    for (let a = 0; a < e; a++)
      o[a] = t(a + 1, a, void 0, i);
  } else if (pe(e))
    if (e[Symbol.iterator])
      o = Array.from(
        e,
        (a, c) => t(a, c, void 0, i)
      );
    else {
      const a = Object.keys(e);
      o = new Array(a.length);
      for (let c = 0, p = a.length; c < p; c++) {
        const d = a[c];
        o[c] = t(e[d], d, c, i);
      }
    }
  else
    o = [];
  return o;
}
function $n(e, t, n = {}, s, o) {
  if ($e.ce || $e.parent && nn($e.parent) && $e.parent.ce) {
    const p = Object.keys(n).length > 0;
    return t !== "default" && (n.name = t), M(), Re(
      ie,
      null,
      [ve("slot", n, s && s())],
      p ? -2 : 64
    );
  }
  let i = e[t];
  i && i._c && (i._d = !1), M();
  const l = i && al(i(n)), a = n.key || // slot content array of a dynamic conditional slot may have a branch
  // key attached in the `createSlots` helper, respect that
  l && l.key, c = Re(
    ie,
    {
      key: (a && !Ct(a) ? a : `_${t}`) + // #7256 force differentiate fallback content from actual content
      (!l && s ? "_fb" : "")
    },
    l || (s ? s() : []),
    l && e._ === 1 ? 64 : -2
  );
  return i && i._c && (i._d = !0), c;
}
function al(e) {
  return e.some((t) => On(t) ? !(t.type === ke || t.type === ie && !al(t.children)) : !0) ? e : null;
}
const Us = (e) => e ? Ml(e) ? bs(e) : Us(e.parent) : null, En = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ Se(/* @__PURE__ */ Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => Us(e.parent),
    $root: (e) => Us(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => ul(e),
    $forceUpdate: (e) => e.f || (e.f = () => {
      po(e.update);
    }),
    $nextTick: (e) => e.n || (e.n = fo.bind(e.proxy)),
    $watch: (e) => fa.bind(e)
  })
), As = (e, t) => e !== ue && !e.__isScriptSetup && re(e, t), ta = {
  get({ _: e }, t) {
    if (t === "__v_skip")
      return !0;
    const { ctx: n, setupState: s, data: o, props: i, accessCache: l, type: a, appContext: c } = e;
    if (t[0] !== "$") {
      const y = l[t];
      if (y !== void 0)
        switch (y) {
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
        if (As(s, t))
          return l[t] = 1, s[t];
        if (o !== ue && re(o, t))
          return l[t] = 2, o[t];
        if (re(i, t))
          return l[t] = 3, i[t];
        if (n !== ue && re(n, t))
          return l[t] = 4, n[t];
        Ws && (l[t] = 0);
      }
    }
    const p = En[t];
    let d, f;
    if (p)
      return t === "$attrs" && Te(e.attrs, "get", ""), p(e);
    if (
      // css module (injected by vue-loader)
      (d = a.__cssModules) && (d = d[t])
    )
      return d;
    if (n !== ue && re(n, t))
      return l[t] = 4, n[t];
    if (
      // global properties
      f = c.config.globalProperties, re(f, t)
    )
      return f[t];
  },
  set({ _: e }, t, n) {
    const { data: s, setupState: o, ctx: i } = e;
    return As(o, t) ? (o[t] = n, !0) : s !== ue && re(s, t) ? (s[t] = n, !0) : re(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (i[t] = n, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: n, ctx: s, appContext: o, props: i, type: l }
  }, a) {
    let c;
    return !!(n[a] || e !== ue && a[0] !== "$" && re(e, a) || As(t, a) || re(i, a) || re(s, a) || re(En, a) || re(o.config.globalProperties, a) || (c = l.__cssModules) && c[a]);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : re(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
  }
};
function Po(e) {
  return G(e) ? e.reduce(
    (t, n) => (t[n] = null, t),
    {}
  ) : e;
}
let Ws = !0;
function na(e) {
  const t = ul(e), n = e.proxy, s = e.ctx;
  Ws = !1, t.beforeCreate && wo(t.beforeCreate, e, "bc");
  const {
    // state
    data: o,
    computed: i,
    methods: l,
    watch: a,
    provide: c,
    inject: p,
    // lifecycle
    created: d,
    beforeMount: f,
    mounted: y,
    beforeUpdate: _,
    updated: A,
    activated: k,
    deactivated: L,
    beforeDestroy: b,
    beforeUnmount: v,
    destroyed: T,
    unmounted: C,
    render: H,
    renderTracked: B,
    renderTriggered: Z,
    errorCaptured: J,
    serverPrefetch: j,
    // public API
    expose: W,
    inheritAttrs: oe,
    // assets
    components: E,
    directives: F,
    filters: D
  } = t;
  if (p && sa(p, s, null), l)
    for (const te in l) {
      const ne = l[te];
      Y(ne) && (s[te] = ne.bind(n));
    }
  if (o) {
    const te = o.call(n, n);
    pe(te) && (e.data = me(te));
  }
  if (Ws = !0, i)
    for (const te in i) {
      const ne = i[te], xe = Y(ne) ? ne.bind(n, n) : Y(ne.get) ? ne.get.bind(n, n) : lt, at = !Y(ne) && Y(ne.set) ? ne.set.bind(n) : lt, Ve = K({
        get: xe,
        set: at
      });
      Object.defineProperty(s, te, {
        enumerable: !0,
        configurable: !0,
        get: () => Ve.value,
        set: (Me) => Ve.value = Me
      });
    }
  if (a)
    for (const te in a)
      cl(a[te], s, n, te);
  if (c) {
    const te = Y(c) ? c.call(n) : c;
    Reflect.ownKeys(te).forEach((ne) => {
      ca(ne, te[ne]);
    });
  }
  d && wo(d, e, "c");
  function Q(te, ne) {
    G(ne) ? ne.forEach((xe) => te(xe.bind(n))) : ne && te(ne.bind(n));
  }
  if (Q(Gr, f), Q(Nt, y), Q(qr, _), Q(Jr, A), Q(Ur, k), Q(Wr, L), Q(Qr, J), Q(Xr, B), Q(Zr, Z), Q(rl, v), Q(fn, C), Q(Yr, j), G(W))
    if (W.length) {
      const te = e.exposed || (e.exposed = {});
      W.forEach((ne) => {
        Object.defineProperty(te, ne, {
          get: () => n[ne],
          set: (xe) => n[ne] = xe,
          enumerable: !0
        });
      });
    } else e.exposed || (e.exposed = {});
  H && e.render === lt && (e.render = H), oe != null && (e.inheritAttrs = oe), E && (e.components = E), F && (e.directives = F), j && il(e);
}
function sa(e, t, n = lt) {
  G(e) && (e = Ks(e));
  for (const s in e) {
    const o = e[s];
    let i;
    pe(o) ? "default" in o ? i = on(
      o.from || s,
      o.default,
      !0
    ) : i = on(o.from || s) : i = on(o), Ee(i) ? Object.defineProperty(t, s, {
      enumerable: !0,
      configurable: !0,
      get: () => i.value,
      set: (l) => i.value = l
    }) : t[s] = i;
  }
}
function wo(e, t, n) {
  Ye(
    G(e) ? e.map((s) => s.bind(t.proxy)) : e.bind(t.proxy),
    t,
    n
  );
}
function cl(e, t, n, s) {
  let o = s.includes(".") ? pl(n, s) : () => n[s];
  if (ge(e)) {
    const i = t[e];
    Y(i) && Ke(o, i);
  } else if (Y(e))
    Ke(o, e.bind(n));
  else if (pe(e))
    if (G(e))
      e.forEach((i) => cl(i, t, n, s));
    else {
      const i = Y(e.handler) ? e.handler.bind(n) : t[e.handler];
      Y(i) && Ke(o, i, e);
    }
}
function ul(e) {
  const t = e.type, { mixins: n, extends: s } = t, {
    mixins: o,
    optionsCache: i,
    config: { optionMergeStrategies: l }
  } = e.appContext, a = i.get(t);
  let c;
  return a ? c = a : !o.length && !n && !s ? c = t : (c = {}, o.length && o.forEach(
    (p) => os(c, p, l, !0)
  ), os(c, t, l)), pe(t) && i.set(t, c), c;
}
function os(e, t, n, s = !1) {
  const { mixins: o, extends: i } = t;
  i && os(e, i, n, !0), o && o.forEach(
    (l) => os(e, l, n, !0)
  );
  for (const l in t)
    if (!(s && l === "expose")) {
      const a = oa[l] || n && n[l];
      e[l] = a ? a(e[l], t[l]) : t[l];
    }
  return e;
}
const oa = {
  data: Oo,
  props: Fo,
  emits: Fo,
  // objects
  methods: bn,
  computed: bn,
  // lifecycle
  beforeCreate: Ae,
  created: Ae,
  beforeMount: Ae,
  mounted: Ae,
  beforeUpdate: Ae,
  updated: Ae,
  beforeDestroy: Ae,
  beforeUnmount: Ae,
  destroyed: Ae,
  unmounted: Ae,
  activated: Ae,
  deactivated: Ae,
  errorCaptured: Ae,
  serverPrefetch: Ae,
  // assets
  components: bn,
  directives: bn,
  // watch
  watch: la,
  // provide / inject
  provide: Oo,
  inject: ia
};
function Oo(e, t) {
  return t ? e ? function() {
    return Se(
      Y(e) ? e.call(this, this) : e,
      Y(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function ia(e, t) {
  return bn(Ks(e), Ks(t));
}
function Ks(e) {
  if (G(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++)
      t[e[n]] = e[n];
    return t;
  }
  return e;
}
function Ae(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function bn(e, t) {
  return e ? Se(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Fo(e, t) {
  return e ? G(e) && G(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : Se(
    /* @__PURE__ */ Object.create(null),
    Po(e),
    Po(t ?? {})
  ) : t;
}
function la(e, t) {
  if (!e) return t;
  if (!t) return e;
  const n = Se(/* @__PURE__ */ Object.create(null), e);
  for (const s in t)
    n[s] = Ae(e[s], t[s]);
  return n;
}
function dl() {
  return {
    app: null,
    config: {
      isNativeTag: _i,
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
let ra = 0;
function aa(e, t) {
  return function(s, o = null) {
    Y(s) || (s = Se({}, s)), o != null && !pe(o) && (o = null);
    const i = dl(), l = /* @__PURE__ */ new WeakSet(), a = [];
    let c = !1;
    const p = i.app = {
      _uid: ra++,
      _component: s,
      _props: o,
      _container: null,
      _context: i,
      _instance: null,
      version: za,
      get config() {
        return i.config;
      },
      set config(d) {
      },
      use(d, ...f) {
        return l.has(d) || (d && Y(d.install) ? (l.add(d), d.install(p, ...f)) : Y(d) && (l.add(d), d(p, ...f))), p;
      },
      mixin(d) {
        return i.mixins.includes(d) || i.mixins.push(d), p;
      },
      component(d, f) {
        return f ? (i.components[d] = f, p) : i.components[d];
      },
      directive(d, f) {
        return f ? (i.directives[d] = f, p) : i.directives[d];
      },
      mount(d, f, y) {
        if (!c) {
          const _ = p._ceVNode || ve(s, o);
          return _.appContext = i, y === !0 ? y = "svg" : y === !1 && (y = void 0), e(_, d, y), c = !0, p._container = d, d.__vue_app__ = p, bs(_.component);
        }
      },
      onUnmount(d) {
        a.push(d);
      },
      unmount() {
        c && (Ye(
          a,
          p._instance,
          16
        ), e(null, p._container), delete p._container.__vue_app__);
      },
      provide(d, f) {
        return i.provides[d] = f, p;
      },
      runWithContext(d) {
        const f = sn;
        sn = p;
        try {
          return d();
        } finally {
          sn = f;
        }
      }
    };
    return p;
  };
}
let sn = null;
function ca(e, t) {
  if (Ne) {
    let n = Ne.provides;
    const s = Ne.parent && Ne.parent.provides;
    s === n && (n = Ne.provides = Object.create(s)), n[e] = t;
  }
}
function on(e, t, n = !1) {
  const s = El();
  if (s || sn) {
    let o = sn ? sn._context.provides : s ? s.parent == null || s.ce ? s.vnode.appContext && s.vnode.appContext.provides : s.parent.provides : void 0;
    if (o && e in o)
      return o[e];
    if (arguments.length > 1)
      return n && Y(t) ? t.call(s && s.proxy) : t;
  }
}
const ua = Symbol.for("v-scx"), da = () => on(ua);
function Ke(e, t, n) {
  return fl(e, t, n);
}
function fl(e, t, n = ue) {
  const { immediate: s, deep: o, flush: i, once: l } = n, a = Se({}, n), c = t && s || !t && i !== "post";
  let p;
  if (Fn) {
    if (i === "sync") {
      const _ = da();
      p = _.__watcherHandles || (_.__watcherHandles = []);
    } else if (!c) {
      const _ = () => {
      };
      return _.stop = lt, _.resume = lt, _.pause = lt, _;
    }
  }
  const d = Ne;
  a.call = (_, A, k) => Ye(_, d, A, k);
  let f = !1;
  i === "post" ? a.scheduler = (_) => {
    Ie(_, d && d.suspense);
  } : i !== "sync" && (f = !0, a.scheduler = (_, A) => {
    A ? _() : po(_);
  }), a.augmentJob = (_) => {
    t && (_.flags |= 4), f && (_.flags |= 2, d && (_.id = d.uid, _.i = d));
  };
  const y = Fr(e, t, a);
  return Fn && (p ? p.push(y) : c && y()), y;
}
function fa(e, t, n) {
  const s = this.proxy, o = ge(e) ? e.includes(".") ? pl(s, e) : () => s[e] : e.bind(s, s);
  let i;
  Y(t) ? i = t : (i = t.handler, n = t);
  const l = Hn(this), a = fl(o, i.bind(s), n);
  return l(), a;
}
function pl(e, t) {
  const n = t.split(".");
  return () => {
    let s = e;
    for (let o = 0; o < n.length && s; o++)
      s = s[n[o]];
    return s;
  };
}
const pa = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${It(t)}Modifiers`] || e[`${Gt(t)}Modifiers`];
function ha(e, t, ...n) {
  if (e.isUnmounted) return;
  const s = e.vnode.props || ue;
  let o = n;
  const i = t.startsWith("update:"), l = i && pa(s, t.slice(7));
  l && (l.trim && (o = n.map((d) => ge(d) ? d.trim() : d)), l.number && (o = n.map(so)));
  let a, c = s[a = xs(t)] || // also try camelCase event handler (#2249)
  s[a = xs(It(t))];
  !c && i && (c = s[a = xs(Gt(t))]), c && Ye(
    c,
    e,
    6,
    o
  );
  const p = s[a + "Once"];
  if (p) {
    if (!e.emitted)
      e.emitted = {};
    else if (e.emitted[a])
      return;
    e.emitted[a] = !0, Ye(
      p,
      e,
      6,
      o
    );
  }
}
const ga = /* @__PURE__ */ new WeakMap();
function hl(e, t, n = !1) {
  const s = n ? ga : t.emitsCache, o = s.get(e);
  if (o !== void 0)
    return o;
  const i = e.emits;
  let l = {}, a = !1;
  if (!Y(e)) {
    const c = (p) => {
      const d = hl(p, t, !0);
      d && (a = !0, Se(l, d));
    };
    !n && t.mixins.length && t.mixins.forEach(c), e.extends && c(e.extends), e.mixins && e.mixins.forEach(c);
  }
  return !i && !a ? (pe(e) && s.set(e, null), null) : (G(i) ? i.forEach((c) => l[c] = null) : Se(l, i), pe(e) && s.set(e, l), l);
}
function ys(e, t) {
  return !e || !us(t) ? !1 : (t = t.slice(2).replace(/Once$/, ""), re(e, t[0].toLowerCase() + t.slice(1)) || re(e, Gt(t)) || re(e, t));
}
function Ro(e) {
  const {
    type: t,
    vnode: n,
    proxy: s,
    withProxy: o,
    propsOptions: [i],
    slots: l,
    attrs: a,
    emit: c,
    render: p,
    renderCache: d,
    props: f,
    data: y,
    setupState: _,
    ctx: A,
    inheritAttrs: k
  } = e, L = ns(e);
  let b, v;
  try {
    if (n.shapeFlag & 4) {
      const C = o || s, H = C;
      b = st(
        p.call(
          H,
          C,
          d,
          f,
          _,
          y,
          A
        )
      ), v = a;
    } else {
      const C = t;
      b = st(
        C.length > 1 ? C(
          f,
          { attrs: a, slots: l, emit: c }
        ) : C(
          f,
          null
        )
      ), v = t.props ? a : ma(a);
    }
  } catch (C) {
    Mn.length = 0, gs(C, e, 1), b = ve(ke);
  }
  let T = b;
  if (v && k !== !1) {
    const C = Object.keys(v), { shapeFlag: H } = T;
    C.length && H & 7 && (i && C.some(eo) && (v = va(
      v,
      i
    )), T = Lt(T, v, !1, !0));
  }
  return n.dirs && (T = Lt(T, null, !1, !0), T.dirs = T.dirs ? T.dirs.concat(n.dirs) : n.dirs), n.transition && Pn(T, n.transition), b = T, ns(L), b;
}
const ma = (e) => {
  let t;
  for (const n in e)
    (n === "class" || n === "style" || us(n)) && ((t || (t = {}))[n] = e[n]);
  return t;
}, va = (e, t) => {
  const n = {};
  for (const s in e)
    (!eo(s) || !(s.slice(9) in t)) && (n[s] = e[s]);
  return n;
};
function ya(e, t, n) {
  const { props: s, children: o, component: i } = e, { props: l, children: a, patchFlag: c } = t, p = i.emitsOptions;
  if (t.dirs || t.transition)
    return !0;
  if (n && c >= 0) {
    if (c & 1024)
      return !0;
    if (c & 16)
      return s ? Do(s, l, p) : !!l;
    if (c & 8) {
      const d = t.dynamicProps;
      for (let f = 0; f < d.length; f++) {
        const y = d[f];
        if (l[y] !== s[y] && !ys(p, y))
          return !0;
      }
    }
  } else
    return (o || a) && (!a || !a.$stable) ? !0 : s === l ? !1 : s ? l ? Do(s, l, p) : !0 : !!l;
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
function _a({ vnode: e, parent: t }, n) {
  for (; t; ) {
    const s = t.subTree;
    if (s.suspense && s.suspense.activeBranch === e && (s.el = e.el), s === e)
      (e = t.vnode).el = n, t = t.parent;
    else
      break;
  }
}
const gl = {}, ml = () => Object.create(gl), vl = (e) => Object.getPrototypeOf(e) === gl;
function ba(e, t, n, s = !1) {
  const o = {}, i = ml();
  e.propsDefaults = /* @__PURE__ */ Object.create(null), yl(e, t, o, i);
  for (const l in e.propsOptions[0])
    l in o || (o[l] = void 0);
  n ? e.props = s ? o : Mr(o) : e.type.props ? e.props = o : e.props = i, e.attrs = i;
}
function Ca(e, t, n, s) {
  const {
    props: o,
    attrs: i,
    vnode: { patchFlag: l }
  } = e, a = le(o), [c] = e.propsOptions;
  let p = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (s || l > 0) && !(l & 16)
  ) {
    if (l & 8) {
      const d = e.vnode.dynamicProps;
      for (let f = 0; f < d.length; f++) {
        let y = d[f];
        if (ys(e.emitsOptions, y))
          continue;
        const _ = t[y];
        if (c)
          if (re(i, y))
            _ !== i[y] && (i[y] = _, p = !0);
          else {
            const A = It(y);
            o[A] = Gs(
              c,
              a,
              A,
              _,
              e,
              !1
            );
          }
        else
          _ !== i[y] && (i[y] = _, p = !0);
      }
    }
  } else {
    yl(e, t, o, i) && (p = !0);
    let d;
    for (const f in a)
      (!t || // for camelCase
      !re(t, f) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((d = Gt(f)) === f || !re(t, d))) && (c ? n && // for camelCase
      (n[f] !== void 0 || // for kebab-case
      n[d] !== void 0) && (o[f] = Gs(
        c,
        a,
        f,
        void 0,
        e,
        !0
      )) : delete o[f]);
    if (i !== a)
      for (const f in i)
        (!t || !re(t, f)) && (delete i[f], p = !0);
  }
  p && mt(e.attrs, "set", "");
}
function yl(e, t, n, s) {
  const [o, i] = e.propsOptions;
  let l = !1, a;
  if (t)
    for (let c in t) {
      if (Cn(c))
        continue;
      const p = t[c];
      let d;
      o && re(o, d = It(c)) ? !i || !i.includes(d) ? n[d] = p : (a || (a = {}))[d] = p : ys(e.emitsOptions, c) || (!(c in s) || p !== s[c]) && (s[c] = p, l = !0);
    }
  if (i) {
    const c = le(n), p = a || ue;
    for (let d = 0; d < i.length; d++) {
      const f = i[d];
      n[f] = Gs(
        o,
        c,
        f,
        p[f],
        e,
        !re(p, f)
      );
    }
  }
  return l;
}
function Gs(e, t, n, s, o, i) {
  const l = e[n];
  if (l != null) {
    const a = re(l, "default");
    if (a && s === void 0) {
      const c = l.default;
      if (l.type !== Function && !l.skipFactory && Y(c)) {
        const { propsDefaults: p } = o;
        if (n in p)
          s = p[n];
        else {
          const d = Hn(o);
          s = p[n] = c.call(
            null,
            t
          ), d();
        }
      } else
        s = c;
      o.ce && o.ce._setProp(n, s);
    }
    l[
      0
      /* shouldCast */
    ] && (i && !a ? s = !1 : l[
      1
      /* shouldCastTrue */
    ] && (s === "" || s === Gt(n)) && (s = !0));
  }
  return s;
}
const Sa = /* @__PURE__ */ new WeakMap();
function _l(e, t, n = !1) {
  const s = n ? Sa : t.propsCache, o = s.get(e);
  if (o)
    return o;
  const i = e.props, l = {}, a = [];
  let c = !1;
  if (!Y(e)) {
    const d = (f) => {
      c = !0;
      const [y, _] = _l(f, t, !0);
      Se(l, y), _ && a.push(..._);
    };
    !n && t.mixins.length && t.mixins.forEach(d), e.extends && d(e.extends), e.mixins && e.mixins.forEach(d);
  }
  if (!i && !c)
    return pe(e) && s.set(e, Qt), Qt;
  if (G(i))
    for (let d = 0; d < i.length; d++) {
      const f = It(i[d]);
      jo(f) && (l[f] = ue);
    }
  else if (i)
    for (const d in i) {
      const f = It(d);
      if (jo(f)) {
        const y = i[d], _ = l[f] = G(y) || Y(y) ? { type: y } : Se({}, y), A = _.type;
        let k = !1, L = !0;
        if (G(A))
          for (let b = 0; b < A.length; ++b) {
            const v = A[b], T = Y(v) && v.name;
            if (T === "Boolean") {
              k = !0;
              break;
            } else T === "String" && (L = !1);
          }
        else
          k = Y(A) && A.name === "Boolean";
        _[
          0
          /* shouldCast */
        ] = k, _[
          1
          /* shouldCastTrue */
        ] = L, (k || re(_, "default")) && a.push(f);
      }
    }
  const p = [l, a];
  return pe(e) && s.set(e, p), p;
}
function jo(e) {
  return e[0] !== "$" && !Cn(e);
}
const ho = (e) => e === "_" || e === "_ctx" || e === "$stable", go = (e) => G(e) ? e.map(st) : [st(e)], xa = (e, t, n) => {
  if (t._n)
    return t;
  const s = rt((...o) => go(t(...o)), n);
  return s._c = !1, s;
}, bl = (e, t, n) => {
  const s = e._ctx;
  for (const o in e) {
    if (ho(o)) continue;
    const i = e[o];
    if (Y(i))
      t[o] = xa(o, i, s);
    else if (i != null) {
      const l = go(i);
      t[o] = () => l;
    }
  }
}, Cl = (e, t) => {
  const n = go(t);
  e.slots.default = () => n;
}, Sl = (e, t, n) => {
  for (const s in t)
    (n || !ho(s)) && (e[s] = t[s]);
}, Ta = (e, t, n) => {
  const s = e.slots = ml();
  if (e.vnode.shapeFlag & 32) {
    const o = t._;
    o ? (Sl(s, t, n), n && ki(s, "_", o, !0)) : bl(t, s);
  } else t && Cl(e, t);
}, ka = (e, t, n) => {
  const { vnode: s, slots: o } = e;
  let i = !0, l = ue;
  if (s.shapeFlag & 32) {
    const a = t._;
    a ? n && a === 1 ? i = !1 : Sl(o, t, n) : (i = !t.$stable, bl(t, o)), l = t;
  } else t && (Cl(e, t), l = { default: 1 });
  if (i)
    for (const a in o)
      !ho(a) && l[a] == null && delete o[a];
}, Ie = Ia;
function $a(e) {
  return Ea(e);
}
function Ea(e, t) {
  const n = ps();
  n.__VUE__ = !0;
  const {
    insert: s,
    remove: o,
    patchProp: i,
    createElement: l,
    createText: a,
    createComment: c,
    setText: p,
    setElementText: d,
    parentNode: f,
    nextSibling: y,
    setScopeId: _ = lt,
    insertStaticContent: A
  } = e, k = (r, u, h, S = null, x = null, $ = null, N = void 0, w = null, O = !!u.dynamicChildren) => {
    if (r === u)
      return;
    r && !Vt(r, u) && (S = Tt(r), Me(r, x, $, !0), r = null), u.patchFlag === -2 && (O = !1, u.dynamicChildren = null);
    const { type: I, ref: U, shapeFlag: R } = u;
    switch (I) {
      case _s:
        L(r, u, h, S);
        break;
      case ke:
        b(r, u, h, S);
        break;
      case Ls:
        r == null && v(u, h, S, N);
        break;
      case ie:
        E(
          r,
          u,
          h,
          S,
          x,
          $,
          N,
          w,
          O
        );
        break;
      default:
        R & 1 ? H(
          r,
          u,
          h,
          S,
          x,
          $,
          N,
          w,
          O
        ) : R & 6 ? F(
          r,
          u,
          h,
          S,
          x,
          $,
          N,
          w,
          O
        ) : (R & 64 || R & 128) && I.process(
          r,
          u,
          h,
          S,
          x,
          $,
          N,
          w,
          O,
          dt
        );
    }
    U != null && x ? kn(U, r && r.ref, $, u || r, !u) : U == null && r && r.ref != null && kn(r.ref, null, $, r, !0);
  }, L = (r, u, h, S) => {
    if (r == null)
      s(
        u.el = a(u.children),
        h,
        S
      );
    else {
      const x = u.el = r.el;
      u.children !== r.children && p(x, u.children);
    }
  }, b = (r, u, h, S) => {
    r == null ? s(
      u.el = c(u.children || ""),
      h,
      S
    ) : u.el = r.el;
  }, v = (r, u, h, S) => {
    [r.el, r.anchor] = A(
      r.children,
      u,
      h,
      S,
      r.el,
      r.anchor
    );
  }, T = ({ el: r, anchor: u }, h, S) => {
    let x;
    for (; r && r !== u; )
      x = y(r), s(r, h, S), r = x;
    s(u, h, S);
  }, C = ({ el: r, anchor: u }) => {
    let h;
    for (; r && r !== u; )
      h = y(r), o(r), r = h;
    o(u);
  }, H = (r, u, h, S, x, $, N, w, O) => {
    if (u.type === "svg" ? N = "svg" : u.type === "math" && (N = "mathml"), r == null)
      B(
        u,
        h,
        S,
        x,
        $,
        N,
        w,
        O
      );
    else {
      const I = r.el && r.el._isVueCE ? r.el : null;
      try {
        I && I._beginPatch(), j(
          r,
          u,
          x,
          $,
          N,
          w,
          O
        );
      } finally {
        I && I._endPatch();
      }
    }
  }, B = (r, u, h, S, x, $, N, w) => {
    let O, I;
    const { props: U, shapeFlag: R, transition: z, dirs: q } = r;
    if (O = r.el = l(
      r.type,
      $,
      U && U.is,
      U
    ), R & 8 ? d(O, r.children) : R & 16 && J(
      r.children,
      O,
      null,
      S,
      x,
      Is(r, $),
      N,
      w
    ), q && Ot(r, null, S, "created"), Z(O, r, r.scopeId, N, S), U) {
      for (const de in U)
        de !== "value" && !Cn(de) && i(O, de, null, U[de], $, S);
      "value" in U && i(O, "value", null, U.value, $), (I = U.onVnodeBeforeMount) && tt(I, S, r);
    }
    q && Ot(r, null, S, "beforeMount");
    const se = Ma(x, z);
    se && z.beforeEnter(O), s(O, u, h), ((I = U && U.onVnodeMounted) || se || q) && Ie(() => {
      I && tt(I, S, r), se && z.enter(O), q && Ot(r, null, S, "mounted");
    }, x);
  }, Z = (r, u, h, S, x) => {
    if (h && _(r, h), S)
      for (let $ = 0; $ < S.length; $++)
        _(r, S[$]);
    if (x) {
      let $ = x.subTree;
      if (u === $ || Tl($.type) && ($.ssContent === u || $.ssFallback === u)) {
        const N = x.vnode;
        Z(
          r,
          N,
          N.scopeId,
          N.slotScopeIds,
          x.parent
        );
      }
    }
  }, J = (r, u, h, S, x, $, N, w, O = 0) => {
    for (let I = O; I < r.length; I++) {
      const U = r[I] = w ? Mt(r[I]) : st(r[I]);
      k(
        null,
        U,
        u,
        h,
        S,
        x,
        $,
        N,
        w
      );
    }
  }, j = (r, u, h, S, x, $, N) => {
    const w = u.el = r.el;
    let { patchFlag: O, dynamicChildren: I, dirs: U } = u;
    O |= r.patchFlag & 16;
    const R = r.props || ue, z = u.props || ue;
    let q;
    if (h && Ft(h, !1), (q = z.onVnodeBeforeUpdate) && tt(q, h, u, r), U && Ot(u, r, h, "beforeUpdate"), h && Ft(h, !0), (R.innerHTML && z.innerHTML == null || R.textContent && z.textContent == null) && d(w, ""), I ? W(
      r.dynamicChildren,
      I,
      w,
      h,
      S,
      Is(u, x),
      $
    ) : N || ne(
      r,
      u,
      w,
      null,
      h,
      S,
      Is(u, x),
      $,
      !1
    ), O > 0) {
      if (O & 16)
        oe(w, R, z, h, x);
      else if (O & 2 && R.class !== z.class && i(w, "class", null, z.class, x), O & 4 && i(w, "style", R.style, z.style, x), O & 8) {
        const se = u.dynamicProps;
        for (let de = 0; de < se.length; de++) {
          const ae = se[de], Pe = R[ae], we = z[ae];
          (we !== Pe || ae === "value") && i(w, ae, Pe, we, x, h);
        }
      }
      O & 1 && r.children !== u.children && d(w, u.children);
    } else !N && I == null && oe(w, R, z, h, x);
    ((q = z.onVnodeUpdated) || U) && Ie(() => {
      q && tt(q, h, u, r), U && Ot(u, r, h, "updated");
    }, S);
  }, W = (r, u, h, S, x, $, N) => {
    for (let w = 0; w < u.length; w++) {
      const O = r[w], I = u[w], U = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        O.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (O.type === ie || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !Vt(O, I) || // - In the case of a component, it could contain anything.
        O.shapeFlag & 198) ? f(O.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          h
        )
      );
      k(
        O,
        I,
        U,
        null,
        S,
        x,
        $,
        N,
        !0
      );
    }
  }, oe = (r, u, h, S, x) => {
    if (u !== h) {
      if (u !== ue)
        for (const $ in u)
          !Cn($) && !($ in h) && i(
            r,
            $,
            u[$],
            null,
            x,
            S
          );
      for (const $ in h) {
        if (Cn($)) continue;
        const N = h[$], w = u[$];
        N !== w && $ !== "value" && i(r, $, w, N, x, S);
      }
      "value" in h && i(r, "value", u.value, h.value, x);
    }
  }, E = (r, u, h, S, x, $, N, w, O) => {
    const I = u.el = r ? r.el : a(""), U = u.anchor = r ? r.anchor : a("");
    let { patchFlag: R, dynamicChildren: z, slotScopeIds: q } = u;
    q && (w = w ? w.concat(q) : q), r == null ? (s(I, h, S), s(U, h, S), J(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      u.children || [],
      h,
      U,
      x,
      $,
      N,
      w,
      O
    )) : R > 0 && R & 64 && z && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    r.dynamicChildren ? (W(
      r.dynamicChildren,
      z,
      h,
      x,
      $,
      N,
      w
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (u.key != null || x && u === x.subTree) && mo(
      r,
      u,
      !0
      /* shallow */
    )) : ne(
      r,
      u,
      h,
      U,
      x,
      $,
      N,
      w,
      O
    );
  }, F = (r, u, h, S, x, $, N, w, O) => {
    u.slotScopeIds = w, r == null ? u.shapeFlag & 512 ? x.ctx.activate(
      u,
      h,
      S,
      N,
      O
    ) : D(
      u,
      h,
      S,
      x,
      $,
      N,
      O
    ) : X(r, u, O);
  }, D = (r, u, h, S, x, $, N) => {
    const w = r.component = Ra(
      r,
      S,
      x
    );
    if (ms(r) && (w.ctx.renderer = dt), Da(w, !1, N), w.asyncDep) {
      if (x && x.registerDep(w, Q, N), !r.el) {
        const O = w.subTree = ve(ke);
        b(null, O, u, h), r.placeholder = O.el;
      }
    } else
      Q(
        w,
        r,
        u,
        h,
        x,
        $,
        N
      );
  }, X = (r, u, h) => {
    const S = u.component = r.component;
    if (ya(r, u, h))
      if (S.asyncDep && !S.asyncResolved) {
        te(S, u, h);
        return;
      } else
        S.next = u, S.update();
    else
      u.el = r.el, S.vnode = u;
  }, Q = (r, u, h, S, x, $, N) => {
    const w = () => {
      if (r.isMounted) {
        let { next: R, bu: z, u: q, parent: se, vnode: de } = r;
        {
          const Qe = xl(r);
          if (Qe) {
            R && (R.el = de.el, te(r, R, N)), Qe.asyncDep.then(() => {
              r.isUnmounted || w();
            });
            return;
          }
        }
        let ae = R, Pe;
        Ft(r, !1), R ? (R.el = de.el, te(r, R, N)) : R = de, z && qn(z), (Pe = R.props && R.props.onVnodeBeforeUpdate) && tt(Pe, se, R, de), Ft(r, !0);
        const we = Ro(r), Xe = r.subTree;
        r.subTree = we, k(
          Xe,
          we,
          // parent may have changed if it's in a teleport
          f(Xe.el),
          // anchor may have changed if it's in a fragment
          Tt(Xe),
          r,
          x,
          $
        ), R.el = we.el, ae === null && _a(r, we.el), q && Ie(q, x), (Pe = R.props && R.props.onVnodeUpdated) && Ie(
          () => tt(Pe, se, R, de),
          x
        );
      } else {
        let R;
        const { el: z, props: q } = u, { bm: se, m: de, parent: ae, root: Pe, type: we } = r, Xe = nn(u);
        Ft(r, !1), se && qn(se), !Xe && (R = q && q.onVnodeBeforeMount) && tt(R, ae, u), Ft(r, !0);
        {
          Pe.ce && // @ts-expect-error _def is private
          Pe.ce._def.shadowRoot !== !1 && Pe.ce._injectChildStyle(we);
          const Qe = r.subTree = Ro(r);
          k(
            null,
            Qe,
            h,
            S,
            r,
            x,
            $
          ), u.el = Qe.el;
        }
        if (de && Ie(de, x), !Xe && (R = q && q.onVnodeMounted)) {
          const Qe = u;
          Ie(
            () => tt(R, ae, Qe),
            x
          );
        }
        (u.shapeFlag & 256 || ae && nn(ae.vnode) && ae.vnode.shapeFlag & 256) && r.a && Ie(r.a, x), r.isMounted = !0, u = h = S = null;
      }
    };
    r.scope.on();
    const O = r.effect = new Ai(w);
    r.scope.off();
    const I = r.update = O.run.bind(O), U = r.job = O.runIfDirty.bind(O);
    U.i = r, U.id = r.uid, O.scheduler = () => po(U), Ft(r, !0), I();
  }, te = (r, u, h) => {
    u.component = r;
    const S = r.vnode.props;
    r.vnode = u, r.next = null, Ca(r, u.props, S, h), ka(r, u.children, h), yt(), Eo(r), _t();
  }, ne = (r, u, h, S, x, $, N, w, O = !1) => {
    const I = r && r.children, U = r ? r.shapeFlag : 0, R = u.children, { patchFlag: z, shapeFlag: q } = u;
    if (z > 0) {
      if (z & 128) {
        at(
          I,
          R,
          h,
          S,
          x,
          $,
          N,
          w,
          O
        );
        return;
      } else if (z & 256) {
        xe(
          I,
          R,
          h,
          S,
          x,
          $,
          N,
          w,
          O
        );
        return;
      }
    }
    q & 8 ? (U & 16 && ut(I, x, $), R !== I && d(h, R)) : U & 16 ? q & 16 ? at(
      I,
      R,
      h,
      S,
      x,
      $,
      N,
      w,
      O
    ) : ut(I, x, $, !0) : (U & 8 && d(h, ""), q & 16 && J(
      R,
      h,
      S,
      x,
      $,
      N,
      w,
      O
    ));
  }, xe = (r, u, h, S, x, $, N, w, O) => {
    r = r || Qt, u = u || Qt;
    const I = r.length, U = u.length, R = Math.min(I, U);
    let z;
    for (z = 0; z < R; z++) {
      const q = u[z] = O ? Mt(u[z]) : st(u[z]);
      k(
        r[z],
        q,
        h,
        null,
        x,
        $,
        N,
        w,
        O
      );
    }
    I > U ? ut(
      r,
      x,
      $,
      !0,
      !1,
      R
    ) : J(
      u,
      h,
      S,
      x,
      $,
      N,
      w,
      O,
      R
    );
  }, at = (r, u, h, S, x, $, N, w, O) => {
    let I = 0;
    const U = u.length;
    let R = r.length - 1, z = U - 1;
    for (; I <= R && I <= z; ) {
      const q = r[I], se = u[I] = O ? Mt(u[I]) : st(u[I]);
      if (Vt(q, se))
        k(
          q,
          se,
          h,
          null,
          x,
          $,
          N,
          w,
          O
        );
      else
        break;
      I++;
    }
    for (; I <= R && I <= z; ) {
      const q = r[R], se = u[z] = O ? Mt(u[z]) : st(u[z]);
      if (Vt(q, se))
        k(
          q,
          se,
          h,
          null,
          x,
          $,
          N,
          w,
          O
        );
      else
        break;
      R--, z--;
    }
    if (I > R) {
      if (I <= z) {
        const q = z + 1, se = q < U ? u[q].el : S;
        for (; I <= z; )
          k(
            null,
            u[I] = O ? Mt(u[I]) : st(u[I]),
            h,
            se,
            x,
            $,
            N,
            w,
            O
          ), I++;
      }
    } else if (I > z)
      for (; I <= R; )
        Me(r[I], x, $, !0), I++;
    else {
      const q = I, se = I, de = /* @__PURE__ */ new Map();
      for (I = se; I <= z; I++) {
        const Fe = u[I] = O ? Mt(u[I]) : st(u[I]);
        Fe.key != null && de.set(Fe.key, I);
      }
      let ae, Pe = 0;
      const we = z - se + 1;
      let Xe = !1, Qe = 0;
      const hn = new Array(we);
      for (I = 0; I < we; I++) hn[I] = 0;
      for (I = q; I <= R; I++) {
        const Fe = r[I];
        if (Pe >= we) {
          Me(Fe, x, $, !0);
          continue;
        }
        let et;
        if (Fe.key != null)
          et = de.get(Fe.key);
        else
          for (ae = se; ae <= z; ae++)
            if (hn[ae - se] === 0 && Vt(Fe, u[ae])) {
              et = ae;
              break;
            }
        et === void 0 ? Me(Fe, x, $, !0) : (hn[et - se] = I + 1, et >= Qe ? Qe = et : Xe = !0, k(
          Fe,
          u[et],
          h,
          null,
          x,
          $,
          N,
          w,
          O
        ), Pe++);
      }
      const Co = Xe ? Aa(hn) : Qt;
      for (ae = Co.length - 1, I = we - 1; I >= 0; I--) {
        const Fe = se + I, et = u[Fe], So = u[Fe + 1], xo = Fe + 1 < U ? (
          // #13559, fallback to el placeholder for unresolved async component
          So.el || So.placeholder
        ) : S;
        hn[I] === 0 ? k(
          null,
          et,
          h,
          xo,
          x,
          $,
          N,
          w,
          O
        ) : Xe && (ae < 0 || I !== Co[ae] ? Ve(et, h, xo, 2) : ae--);
      }
    }
  }, Ve = (r, u, h, S, x = null) => {
    const { el: $, type: N, transition: w, children: O, shapeFlag: I } = r;
    if (I & 6) {
      Ve(r.component.subTree, u, h, S);
      return;
    }
    if (I & 128) {
      r.suspense.move(u, h, S);
      return;
    }
    if (I & 64) {
      N.move(r, u, h, dt);
      return;
    }
    if (N === ie) {
      s($, u, h);
      for (let R = 0; R < O.length; R++)
        Ve(O[R], u, h, S);
      s(r.anchor, u, h);
      return;
    }
    if (N === Ls) {
      T(r, u, h);
      return;
    }
    if (S !== 2 && I & 1 && w)
      if (S === 0)
        w.beforeEnter($), s($, u, h), Ie(() => w.enter($), x);
      else {
        const { leave: R, delayLeave: z, afterLeave: q } = w, se = () => {
          r.ctx.isUnmounted ? o($) : s($, u, h);
        }, de = () => {
          $._isLeaving && $[gt](
            !0
            /* cancelled */
          ), R($, () => {
            se(), q && q();
          });
        };
        z ? z($, se, de) : de();
      }
    else
      s($, u, h);
  }, Me = (r, u, h, S = !1, x = !1) => {
    const {
      type: $,
      props: N,
      ref: w,
      children: O,
      dynamicChildren: I,
      shapeFlag: U,
      patchFlag: R,
      dirs: z,
      cacheIndex: q
    } = r;
    if (R === -2 && (x = !1), w != null && (yt(), kn(w, null, h, r, !0), _t()), q != null && (u.renderCache[q] = void 0), U & 256) {
      u.ctx.deactivate(r);
      return;
    }
    const se = U & 1 && z, de = !nn(r);
    let ae;
    if (de && (ae = N && N.onVnodeBeforeUnmount) && tt(ae, u, r), U & 6)
      qt(r.component, h, S);
    else {
      if (U & 128) {
        r.suspense.unmount(h, S);
        return;
      }
      se && Ot(r, null, u, "beforeUnmount"), U & 64 ? r.type.remove(
        r,
        u,
        h,
        dt,
        S
      ) : I && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !I.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      ($ !== ie || R > 0 && R & 64) ? ut(
        I,
        u,
        h,
        !1,
        !0
      ) : ($ === ie && R & 384 || !x && U & 16) && ut(O, u, h), S && xt(r);
    }
    (de && (ae = N && N.onVnodeUnmounted) || se) && Ie(() => {
      ae && tt(ae, u, r), se && Ot(r, null, u, "unmounted");
    }, h);
  }, xt = (r) => {
    const { type: u, el: h, anchor: S, transition: x } = r;
    if (u === ie) {
      ct(h, S);
      return;
    }
    if (u === Ls) {
      C(r);
      return;
    }
    const $ = () => {
      o(h), x && !x.persisted && x.afterLeave && x.afterLeave();
    };
    if (r.shapeFlag & 1 && x && !x.persisted) {
      const { leave: N, delayLeave: w } = x, O = () => N(h, $);
      w ? w(r.el, $, O) : O();
    } else
      $();
  }, ct = (r, u) => {
    let h;
    for (; r !== u; )
      h = y(r), o(r), r = h;
    o(u);
  }, qt = (r, u, h) => {
    const { bum: S, scope: x, job: $, subTree: N, um: w, m: O, a: I } = r;
    Ho(O), Ho(I), S && qn(S), x.stop(), $ && ($.flags |= 8, Me(N, r, u, h)), w && Ie(w, u), Ie(() => {
      r.isUnmounted = !0;
    }, u);
  }, ut = (r, u, h, S = !1, x = !1, $ = 0) => {
    for (let N = $; N < r.length; N++)
      Me(r[N], u, h, S, x);
  }, Tt = (r) => {
    if (r.shapeFlag & 6)
      return Tt(r.component.subTree);
    if (r.shapeFlag & 128)
      return r.suspense.next();
    const u = y(r.anchor || r.el), h = u && u[Ji];
    return h ? y(h) : u;
  };
  let Pt = !1;
  const wt = (r, u, h) => {
    r == null ? u._vnode && Me(u._vnode, null, null, !0) : k(
      u._vnode || null,
      r,
      u,
      null,
      null,
      null,
      h
    ), u._vnode = r, Pt || (Pt = !0, Eo(), Ki(), Pt = !1);
  }, dt = {
    p: k,
    um: Me,
    m: Ve,
    r: xt,
    mt: D,
    mc: J,
    pc: ne,
    pbc: W,
    n: Tt,
    o: e
  };
  return {
    render: wt,
    hydrate: void 0,
    createApp: aa(wt)
  };
}
function Is({ type: e, props: t }, n) {
  return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Ft({ effect: e, job: t }, n) {
  n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Ma(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function mo(e, t, n = !1) {
  const s = e.children, o = t.children;
  if (G(s) && G(o))
    for (let i = 0; i < s.length; i++) {
      const l = s[i];
      let a = o[i];
      a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = o[i] = Mt(o[i]), a.el = l.el), !n && a.patchFlag !== -2 && mo(l, a)), a.type === _s && // avoid cached text nodes retaining detached dom nodes
      a.patchFlag !== -1 && (a.el = l.el), a.type === ke && !a.el && (a.el = l.el);
    }
}
function Aa(e) {
  const t = e.slice(), n = [0];
  let s, o, i, l, a;
  const c = e.length;
  for (s = 0; s < c; s++) {
    const p = e[s];
    if (p !== 0) {
      if (o = n[n.length - 1], e[o] < p) {
        t[s] = o, n.push(s);
        continue;
      }
      for (i = 0, l = n.length - 1; i < l; )
        a = i + l >> 1, e[n[a]] < p ? i = a + 1 : l = a;
      p < e[n[i]] && (i > 0 && (t[s] = n[i - 1]), n[i] = s);
    }
  }
  for (i = n.length, l = n[i - 1]; i-- > 0; )
    n[i] = l, l = t[l];
  return n;
}
function xl(e) {
  const t = e.subTree.component;
  if (t)
    return t.asyncDep && !t.asyncResolved ? t : xl(t);
}
function Ho(e) {
  if (e)
    for (let t = 0; t < e.length; t++)
      e[t].flags |= 8;
}
const Tl = (e) => e.__isSuspense;
function Ia(e, t) {
  t && t.pendingBranch ? G(e) ? t.effects.push(...e) : t.effects.push(e) : jr(e);
}
const ie = Symbol.for("v-fgt"), _s = Symbol.for("v-txt"), ke = Symbol.for("v-cmt"), Ls = Symbol.for("v-stc"), Mn = [];
let De = null;
function M(e = !1) {
  Mn.push(De = e ? null : []);
}
function La() {
  Mn.pop(), De = Mn[Mn.length - 1] || null;
}
let wn = 1;
function is(e, t = !1) {
  wn += e, e < 0 && De && t && (De.hasOnce = !0);
}
function kl(e) {
  return e.dynamicChildren = wn > 0 ? De || Qt : null, La(), wn > 0 && De && De.push(e), e;
}
function P(e, t, n, s, o, i) {
  return kl(
    g(
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
function Re(e, t, n, s, o) {
  return kl(
    ve(
      e,
      t,
      n,
      s,
      o,
      !0
    )
  );
}
function On(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function Vt(e, t) {
  return e.type === t.type && e.key === t.key;
}
const $l = ({ key: e }) => e ?? null, Yn = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? ge(e) || Ee(e) || Y(e) ? { i: $e, r: e, k: t, f: !!n } : e : null);
function g(e, t = null, n = null, s = 0, o = null, i = e === ie ? 0 : 1, l = !1, a = !1) {
  const c = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && $l(t),
    ref: t && Yn(t),
    scopeId: qi,
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
    ctx: $e
  };
  return a ? (vo(c, n), i & 128 && e.normalize(c)) : n && (c.shapeFlag |= ge(n) ? 8 : 16), wn > 0 && // avoid a block node from tracking itself
  !l && // has current parent block
  De && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (c.patchFlag > 0 || i & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  c.patchFlag !== 32 && De.push(c), c;
}
const ve = Na;
function Na(e, t = null, n = null, s = 0, o = null, i = !1) {
  if ((!e || e === ea) && (e = ke), On(e)) {
    const a = Lt(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && vo(a, n), wn > 0 && !i && De && (a.shapeFlag & 6 ? De[De.indexOf(e)] = a : De.push(a)), a.patchFlag = -2, a;
  }
  if (Ba(e) && (e = e.__vccOpts), t) {
    t = Pa(t);
    let { class: a, style: c } = t;
    a && !ge(a) && (t.class = ce(a)), pe(c) && (uo(c) && !G(c) && (c = Se({}, c)), t.style = Ue(c));
  }
  const l = ge(e) ? 1 : Tl(e) ? 128 : Yi(e) ? 64 : pe(e) ? 4 : Y(e) ? 2 : 0;
  return g(
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
function Pa(e) {
  return e ? uo(e) || vl(e) ? Se({}, e) : e : null;
}
function Lt(e, t, n = !1, s = !1) {
  const { props: o, ref: i, patchFlag: l, children: a, transition: c } = e, p = t ? wa(o || {}, t) : o, d = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: p,
    key: p && $l(p),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && i ? G(i) ? i.concat(Yn(t)) : [i, Yn(t)] : Yn(t)
    ) : i,
    scopeId: e.scopeId,
    slotScopeIds: e.slotScopeIds,
    children: a,
    target: e.target,
    targetStart: e.targetStart,
    targetAnchor: e.targetAnchor,
    staticCount: e.staticCount,
    shapeFlag: e.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: t && e.type !== ie ? l === -1 ? 16 : l | 16 : l,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: c,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && Lt(e.ssContent),
    ssFallback: e.ssFallback && Lt(e.ssFallback),
    placeholder: e.placeholder,
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce
  };
  return c && s && Pn(
    d,
    c.clone(d)
  ), d;
}
function it(e = " ", t = 0) {
  return ve(_s, null, e, t);
}
function he(e = "", t = !1) {
  return t ? (M(), Re(ke, null, e)) : ve(ke, null, e);
}
function st(e) {
  return e == null || typeof e == "boolean" ? ve(ke) : G(e) ? ve(
    ie,
    null,
    // #3666, avoid reference pollution when reusing vnode
    e.slice()
  ) : On(e) ? Mt(e) : ve(_s, null, String(e));
}
function Mt(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : Lt(e);
}
function vo(e, t) {
  let n = 0;
  const { shapeFlag: s } = e;
  if (t == null)
    t = null;
  else if (G(t))
    n = 16;
  else if (typeof t == "object")
    if (s & 65) {
      const o = t.default;
      o && (o._c && (o._d = !1), vo(e, o()), o._c && (o._d = !0));
      return;
    } else {
      n = 32;
      const o = t._;
      !o && !vl(t) ? t._ctx = $e : o === 3 && $e && ($e.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else Y(t) ? (t = { default: t, _ctx: $e }, n = 32) : (t = String(t), s & 64 ? (n = 16, t = [it(t)]) : n = 8);
  e.children = t, e.shapeFlag |= n;
}
function wa(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const s = e[n];
    for (const o in s)
      if (o === "class")
        t.class !== s.class && (t.class = ce([t.class, s.class]));
      else if (o === "style")
        t.style = Ue([t.style, s.style]);
      else if (us(o)) {
        const i = t[o], l = s[o];
        l && i !== l && !(G(i) && i.includes(l)) && (t[o] = i ? [].concat(i, l) : l);
      } else o !== "" && (t[o] = s[o]);
  }
  return t;
}
function tt(e, t, n, s = null) {
  Ye(e, t, 7, [
    n,
    s
  ]);
}
const Oa = dl();
let Fa = 0;
function Ra(e, t, n) {
  const s = e.type, o = (t ? t.appContext : e.appContext) || Oa, i = {
    uid: Fa++,
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
    scope: new ar(
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
    propsOptions: _l(s, o),
    emitsOptions: hl(s, o),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: ue,
    // inheritAttrs
    inheritAttrs: s.inheritAttrs,
    // state
    ctx: ue,
    data: ue,
    props: ue,
    attrs: ue,
    slots: ue,
    refs: ue,
    setupState: ue,
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
  return i.ctx = { _: i }, i.root = t ? t.root : i, i.emit = ha.bind(null, i), e.ce && e.ce(i), i;
}
let Ne = null;
const El = () => Ne || $e;
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
    (n) => Ne = n
  ), qs = t(
    "__VUE_SSR_SETTERS__",
    (n) => Fn = n
  );
}
const Hn = (e) => {
  const t = Ne;
  return ls(e), e.scope.on(), () => {
    e.scope.off(), ls(t);
  };
}, Vo = () => {
  Ne && Ne.scope.off(), ls(null);
};
function Ml(e) {
  return e.vnode.shapeFlag & 4;
}
let Fn = !1;
function Da(e, t = !1, n = !1) {
  t && qs(t);
  const { props: s, children: o } = e.vnode, i = Ml(e);
  ba(e, s, i, t), Ta(e, o, n || t);
  const l = i ? ja(e, t) : void 0;
  return t && qs(!1), l;
}
function ja(e, t) {
  const n = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, ta);
  const { setup: s } = n;
  if (s) {
    yt();
    const o = e.setupContext = s.length > 1 ? Va(e) : null, i = Hn(e), l = jn(
      s,
      e,
      0,
      [
        e.props,
        o
      ]
    ), a = Ci(l);
    if (_t(), i(), (a || e.sp) && !nn(e) && il(e), a) {
      if (l.then(Vo, Vo), t)
        return l.then((c) => {
          Bo(e, c);
        }).catch((c) => {
          gs(c, e, 0);
        });
      e.asyncDep = l;
    } else
      Bo(e, l);
  } else
    Al(e);
}
function Bo(e, t, n) {
  Y(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : pe(t) && (e.setupState = zi(t)), Al(e);
}
function Al(e, t, n) {
  const s = e.type;
  e.render || (e.render = s.render || lt);
  {
    const o = Hn(e);
    yt();
    try {
      na(e);
    } finally {
      _t(), o();
    }
  }
}
const Ha = {
  get(e, t) {
    return Te(e, "get", ""), e[t];
  }
};
function Va(e) {
  const t = (n) => {
    e.exposed = n || {};
  };
  return {
    attrs: new Proxy(e.attrs, Ha),
    slots: e.slots,
    emit: e.emit,
    expose: t
  };
}
function bs(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(zi(Ar(e.exposed)), {
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
function Ba(e) {
  return Y(e) && "__vccOpts" in e;
}
const K = (e, t) => wr(e, t, Fn);
function Il(e, t, n) {
  try {
    is(-1);
    const s = arguments.length;
    return s === 2 ? pe(t) && !G(t) ? On(t) ? ve(e, null, [t]) : ve(e, t) : ve(e, null, t) : (s > 3 ? n = Array.prototype.slice.call(arguments, 2) : s === 3 && On(n) && (n = [n]), ve(e, t, n));
  } finally {
    is(1);
  }
}
const za = "3.5.25";
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
const Ll = Js ? (e) => Js.createHTML(e) : (e) => e, Ua = "http://www.w3.org/2000/svg", Wa = "http://www.w3.org/1998/Math/MathML", ht = typeof document < "u" ? document : null, Uo = ht && /* @__PURE__ */ ht.createElement("template"), Ka = {
  insert: (e, t, n) => {
    t.insertBefore(e, n || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, n, s) => {
    const o = t === "svg" ? ht.createElementNS(Ua, e) : t === "mathml" ? ht.createElementNS(Wa, e) : n ? ht.createElement(e, { is: n }) : ht.createElement(e);
    return e === "select" && s && s.multiple != null && o.setAttribute("multiple", s.multiple), o;
  },
  createText: (e) => ht.createTextNode(e),
  createComment: (e) => ht.createComment(e),
  setText: (e, t) => {
    e.nodeValue = t;
  },
  setElementText: (e, t) => {
    e.textContent = t;
  },
  parentNode: (e) => e.parentNode,
  nextSibling: (e) => e.nextSibling,
  querySelector: (e) => ht.querySelector(e),
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
      Uo.innerHTML = Ll(
        s === "svg" ? `<svg>${e}</svg>` : s === "mathml" ? `<math>${e}</math>` : e
      );
      const a = Uo.content;
      if (s === "svg" || s === "mathml") {
        const c = a.firstChild;
        for (; c.firstChild; )
          a.appendChild(c.firstChild);
        a.removeChild(c);
      }
      t.insertBefore(a, n);
    }
    return [
      // first
      l ? l.nextSibling : t.firstChild,
      // last
      n ? n.previousSibling : t.lastChild
    ];
  }
}, kt = "transition", mn = "animation", Rn = Symbol("_vtc"), Nl = {
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
}, Ga = /* @__PURE__ */ Se(
  {},
  el,
  Nl
), qa = (e) => (e.displayName = "Transition", e.props = Ga, e), Ys = /* @__PURE__ */ qa(
  (e, { slots: t }) => Il(zr, Ja(e), t)
), Rt = (e, t = []) => {
  G(e) ? e.forEach((n) => n(...t)) : e && e(...t);
}, Wo = (e) => e ? G(e) ? e.some((t) => t.length > 1) : e.length > 1 : !1;
function Ja(e) {
  const t = {};
  for (const E in e)
    E in Nl || (t[E] = e[E]);
  if (e.css === !1)
    return t;
  const {
    name: n = "v",
    type: s,
    duration: o,
    enterFromClass: i = `${n}-enter-from`,
    enterActiveClass: l = `${n}-enter-active`,
    enterToClass: a = `${n}-enter-to`,
    appearFromClass: c = i,
    appearActiveClass: p = l,
    appearToClass: d = a,
    leaveFromClass: f = `${n}-leave-from`,
    leaveActiveClass: y = `${n}-leave-active`,
    leaveToClass: _ = `${n}-leave-to`
  } = e, A = Ya(o), k = A && A[0], L = A && A[1], {
    onBeforeEnter: b,
    onEnter: v,
    onEnterCancelled: T,
    onLeave: C,
    onLeaveCancelled: H,
    onBeforeAppear: B = b,
    onAppear: Z = v,
    onAppearCancelled: J = T
  } = t, j = (E, F, D, X) => {
    E._enterCancelled = X, Dt(E, F ? d : a), Dt(E, F ? p : l), D && D();
  }, W = (E, F) => {
    E._isLeaving = !1, Dt(E, f), Dt(E, _), Dt(E, y), F && F();
  }, oe = (E) => (F, D) => {
    const X = E ? Z : v, Q = () => j(F, E, D);
    Rt(X, [F, Q]), Ko(() => {
      Dt(F, E ? c : i), pt(F, E ? d : a), Wo(X) || Go(F, s, k, Q);
    });
  };
  return Se(t, {
    onBeforeEnter(E) {
      Rt(b, [E]), pt(E, i), pt(E, l);
    },
    onBeforeAppear(E) {
      Rt(B, [E]), pt(E, c), pt(E, p);
    },
    onEnter: oe(!1),
    onAppear: oe(!0),
    onLeave(E, F) {
      E._isLeaving = !0;
      const D = () => W(E, F);
      pt(E, f), E._enterCancelled ? (pt(E, y), Yo(E)) : (Yo(E), pt(E, y)), Ko(() => {
        E._isLeaving && (Dt(E, f), pt(E, _), Wo(C) || Go(E, s, L, D));
      }), Rt(C, [E, D]);
    },
    onEnterCancelled(E) {
      j(E, !1, void 0, !0), Rt(T, [E]);
    },
    onAppearCancelled(E) {
      j(E, !0, void 0, !0), Rt(J, [E]);
    },
    onLeaveCancelled(E) {
      W(E), Rt(H, [E]);
    }
  });
}
function Ya(e) {
  if (e == null)
    return null;
  if (pe(e))
    return [Ns(e.enter), Ns(e.leave)];
  {
    const t = Ns(e);
    return [t, t];
  }
}
function Ns(e) {
  return tr(e);
}
function pt(e, t) {
  t.split(/\s+/).forEach((n) => n && e.classList.add(n)), (e[Rn] || (e[Rn] = /* @__PURE__ */ new Set())).add(t);
}
function Dt(e, t) {
  t.split(/\s+/).forEach((s) => s && e.classList.remove(s));
  const n = e[Rn];
  n && (n.delete(t), n.size || (e[Rn] = void 0));
}
function Ko(e) {
  requestAnimationFrame(() => {
    requestAnimationFrame(e);
  });
}
let Za = 0;
function Go(e, t, n, s) {
  const o = e._endId = ++Za, i = () => {
    o === e._endId && s();
  };
  if (n != null)
    return setTimeout(i, n);
  const { type: l, timeout: a, propCount: c } = Xa(e, t);
  if (!l)
    return s();
  const p = l + "end";
  let d = 0;
  const f = () => {
    e.removeEventListener(p, y), i();
  }, y = (_) => {
    _.target === e && ++d >= c && f();
  };
  setTimeout(() => {
    d < c && f();
  }, a + 1), e.addEventListener(p, y);
}
function Xa(e, t) {
  const n = window.getComputedStyle(e), s = (A) => (n[A] || "").split(", "), o = s(`${kt}Delay`), i = s(`${kt}Duration`), l = qo(o, i), a = s(`${mn}Delay`), c = s(`${mn}Duration`), p = qo(a, c);
  let d = null, f = 0, y = 0;
  t === kt ? l > 0 && (d = kt, f = l, y = i.length) : t === mn ? p > 0 && (d = mn, f = p, y = c.length) : (f = Math.max(l, p), d = f > 0 ? l > p ? kt : mn : null, y = d ? d === kt ? i.length : c.length : 0);
  const _ = d === kt && /\b(?:transform|all)(?:,|$)/.test(
    s(`${kt}Property`).toString()
  );
  return {
    type: d,
    timeout: f,
    propCount: y,
    hasTransform: _
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
function Qa(e, t, n) {
  const s = e[Rn];
  s && (t = (t ? [t, ...s] : [...s]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
const rs = Symbol("_vod"), Pl = Symbol("_vsh"), Zo = {
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
  e.style.display = t ? e[rs] : "none", e[Pl] = !t;
}
const ec = Symbol(""), tc = /(?:^|;)\s*display\s*:/;
function nc(e, t, n) {
  const s = e.style, o = ge(n);
  let i = !1;
  if (n && !o) {
    if (t)
      if (ge(t))
        for (const l of t.split(";")) {
          const a = l.slice(0, l.indexOf(":")).trim();
          n[a] == null && Zn(s, a, "");
        }
      else
        for (const l in t)
          n[l] == null && Zn(s, l, "");
    for (const l in n)
      l === "display" && (i = !0), Zn(s, l, n[l]);
  } else if (o) {
    if (t !== n) {
      const l = s[ec];
      l && (n += ";" + l), s.cssText = n, i = tc.test(n);
    }
  } else t && e.removeAttribute("style");
  rs in e && (e[rs] = i ? s.display : "", e[Pl] && (s.display = "none"));
}
const Xo = /\s*!important$/;
function Zn(e, t, n) {
  if (G(n))
    n.forEach((s) => Zn(e, t, s));
  else if (n == null && (n = ""), t.startsWith("--"))
    e.setProperty(t, n);
  else {
    const s = sc(e, t);
    Xo.test(n) ? e.setProperty(
      Gt(s),
      n.replace(Xo, ""),
      "important"
    ) : e[s] = n;
  }
}
const Qo = ["Webkit", "Moz", "ms"], Ps = {};
function sc(e, t) {
  const n = Ps[t];
  if (n)
    return n;
  let s = It(t);
  if (s !== "filter" && s in e)
    return Ps[t] = s;
  s = Ti(s);
  for (let o = 0; o < Qo.length; o++) {
    const i = Qo[o] + s;
    if (i in e)
      return Ps[t] = i;
  }
  return t;
}
const ei = "http://www.w3.org/1999/xlink";
function ti(e, t, n, s, o, i = rr(t)) {
  s && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(ei, t.slice(6, t.length)) : e.setAttributeNS(ei, t, n) : n == null || i && !$i(n) ? e.removeAttribute(t) : e.setAttribute(
    t,
    i ? "" : Ct(n) ? String(n) : n
  );
}
function ni(e, t, n, s, o) {
  if (t === "innerHTML" || t === "textContent") {
    n != null && (e[t] = t === "innerHTML" ? Ll(n) : n);
    return;
  }
  const i = e.tagName;
  if (t === "value" && i !== "PROGRESS" && // custom elements may use _value internally
  !i.includes("-")) {
    const a = i === "OPTION" ? e.getAttribute("value") || "" : e.value, c = n == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      e.type === "checkbox" ? "on" : ""
    ) : String(n);
    (a !== c || !("_value" in e)) && (e.value = c), n == null && e.removeAttribute(t), e._value = n;
    return;
  }
  let l = !1;
  if (n === "" || n == null) {
    const a = typeof e[t];
    a === "boolean" ? n = $i(n) : n == null && a === "string" ? (n = "", l = !0) : a === "number" && (n = 0, l = !0);
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
function oc(e, t, n, s) {
  e.removeEventListener(t, n, s);
}
const si = Symbol("_vei");
function ic(e, t, n, s, o = null) {
  const i = e[si] || (e[si] = {}), l = i[t];
  if (s && l)
    l.value = s;
  else {
    const [a, c] = lc(t);
    if (s) {
      const p = i[t] = cc(
        s,
        o
      );
      Zt(e, a, p, c);
    } else l && (oc(e, a, l, c), i[t] = void 0);
  }
}
const oi = /(?:Once|Passive|Capture)$/;
function lc(e) {
  let t;
  if (oi.test(e)) {
    t = {};
    let s;
    for (; s = e.match(oi); )
      e = e.slice(0, e.length - s[0].length), t[s[0].toLowerCase()] = !0;
  }
  return [e[2] === ":" ? e.slice(3) : Gt(e.slice(2)), t];
}
let ws = 0;
const rc = /* @__PURE__ */ Promise.resolve(), ac = () => ws || (rc.then(() => ws = 0), ws = Date.now());
function cc(e, t) {
  const n = (s) => {
    if (!s._vts)
      s._vts = Date.now();
    else if (s._vts <= n.attached)
      return;
    Ye(
      uc(s, n.value),
      t,
      5,
      [s]
    );
  };
  return n.value = e, n.attached = ac(), n;
}
function uc(e, t) {
  if (G(t)) {
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
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, dc = (e, t, n, s, o, i) => {
  const l = o === "svg";
  t === "class" ? Qa(e, s, l) : t === "style" ? nc(e, n, s) : us(t) ? eo(t) || ic(e, t, n, s, i) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : fc(e, t, s, l)) ? (ni(e, t, s), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && ti(e, t, s, l, i, t !== "value")) : /* #11081 force set props for possible async custom element */ e._isVueCE && (/[A-Z]/.test(t) || !ge(s)) ? ni(e, It(t), s, i, t) : (t === "true-value" ? e._trueValue = s : t === "false-value" && (e._falseValue = s), ti(e, t, s, l));
};
function fc(e, t, n, s) {
  if (s)
    return !!(t === "innerHTML" || t === "textContent" || t in e && ii(t) && Y(n));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (t === "width" || t === "height") {
    const o = e.tagName;
    if (o === "IMG" || o === "VIDEO" || o === "CANVAS" || o === "SOURCE")
      return !1;
  }
  return ii(t) && ge(n) ? !1 : t in e;
}
const li = (e) => {
  const t = e.props["onUpdate:modelValue"] || !1;
  return G(t) ? (n) => qn(t, n) : t;
};
function pc(e) {
  e.target.composing = !0;
}
function ri(e) {
  const t = e.target;
  t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
const Os = Symbol("_assign");
function ai(e, t, n) {
  return t && (e = e.trim()), n && (e = so(e)), e;
}
const ot = {
  created(e, { modifiers: { lazy: t, trim: n, number: s } }, o) {
    e[Os] = li(o);
    const i = s || o.props && o.props.type === "number";
    Zt(e, t ? "change" : "input", (l) => {
      l.target.composing || e[Os](ai(e.value, n, i));
    }), (n || i) && Zt(e, "change", () => {
      e.value = ai(e.value, n, i);
    }), t || (Zt(e, "compositionstart", pc), Zt(e, "compositionend", ri), Zt(e, "change", ri));
  },
  // set value on mounted so it's after min/max for type="range"
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: s, trim: o, number: i } }, l) {
    if (e[Os] = li(l), e.composing) return;
    const a = (i || e.type === "number") && !/^0\d/.test(e.value) ? so(e.value) : e.value, c = t ?? "";
    a !== c && (document.activeElement === e && e.type !== "range" && (s && t === n || o && e.value.trim() === c) || (e.value = c));
  }
}, hc = ["ctrl", "shift", "alt", "meta"], gc = {
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
  exact: (e, t) => hc.some((n) => e[`${n}Key`] && !t.includes(n))
}, _e = (e, t) => {
  const n = e._withMods || (e._withMods = {}), s = t.join(".");
  return n[s] || (n[s] = ((o, ...i) => {
    for (let l = 0; l < t.length; l++) {
      const a = gc[t[l]];
      if (a && a(o, t)) return;
    }
    return e(o, ...i);
  }));
}, mc = /* @__PURE__ */ Se({ patchProp: dc }, Ka);
let ci;
function vc() {
  return ci || (ci = $a(mc));
}
const wl = ((...e) => {
  const t = vc().createApp(...e), { mount: n } = t;
  return t.mount = (s) => {
    const o = _c(s);
    if (!o) return;
    const i = t._component;
    !Y(i) && !i.render && !i.template && (i.template = o.innerHTML), o.nodeType === 1 && (o.textContent = "");
    const l = n(o, !1, yc(o));
    return o instanceof Element && (o.removeAttribute("v-cloak"), o.setAttribute("data-v-app", "")), l;
  }, t;
});
function yc(e) {
  if (e instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function _c(e) {
  return ge(e) ? document.querySelector(e) : e;
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
function bc(e) {
  const t = Ol(e);
  return t ? t.querySelector(".lg-node-widgets") : null;
}
function Cc(e) {
  return Number.isFinite(e) ? Math.max(0, Math.min(1, e)) : 0;
}
function Sc(e) {
  const t = e.trim().match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+\s*)?\)$/i);
  return t ? { r: Number(t[1]), g: Number(t[2]), b: Number(t[3]) } : null;
}
function xc(e) {
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
  const n = Cc(t);
  return `rgba(${e.r}, ${e.g}, ${e.b}, ${n})`;
}
function ui(e) {
  const t = e.trim().toLowerCase();
  return t === "transparent" || t === "rgba(0, 0, 0, 0)" || t === "rgba(0,0,0,0)";
}
function Tc(e) {
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
const kc = { class: "header__title" }, $c = ["title"], Ec = {
  key: 1,
  class: "header-actions"
}, Mc = { class: "body-wrap" }, Ac = /* @__PURE__ */ je({
  __name: "HikazeNodeFrame",
  props: {
    nodeId: {},
    title: {},
    error: {}
  },
  setup(e) {
    const t = e, n = V(null);
    let s = null, o = null;
    const i = V(null), l = K(() => {
      const f = i.value;
      return f ? Sc(f) ?? xc(f) : null;
    }), a = K(() => {
      const f = l.value;
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
        border: `1px solid ${f ? Fs(f, 0.65) : "rgba(255, 255, 255, 0.08)"}`,
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
    }), c = K(() => {
      const f = l.value, y = f ? Fs(f, 0.22) : "rgba(255, 255, 255, 0.06)", _ = f ? Fs(f, 0.35) : "rgba(255, 255, 255, 0.1)";
      return {
        background: y,
        border: `1px solid ${_}`
      };
    });
    function p(f = 100) {
      const y = bc(t.nodeId);
      if (y) {
        y.style.position = y.style.position || "relative", y.style.width = "100%", y.style.height = "100%", n.value = y, d();
        return;
      }
      f > 0 && (s = window.setTimeout(() => p(f - 1), 100));
    }
    function d() {
      const f = Ol(t.nodeId);
      f && (i.value = Tc(f), o || (o = new MutationObserver(() => d()), o.observe(f, { attributes: !0, attributeFilter: ["style", "class"] })));
    }
    return Nt(() => {
      p();
    }), fn(() => {
      s && clearTimeout(s), o && o.disconnect();
    }), (f, y) => n.value ? (M(), Re(Xi, {
      key: 0,
      to: n.value
    }, [
      g("div", {
        class: "hikaze-node-frame",
        style: Ue(a.value),
        onPointerdown: y[0] || (y[0] = _e(() => {
        }, ["stop"])),
        onPointermove: y[1] || (y[1] = _e(() => {
        }, ["stop"])),
        onPointerup: y[2] || (y[2] = _e(() => {
        }, ["stop"])),
        onContextmenu: y[3] || (y[3] = _e(() => {
        }, ["stop"]))
      }, [
        e.title ? (M(), P("div", {
          key: 0,
          class: "header",
          style: Ue(c.value)
        }, [
          g("div", kc, ee(e.title), 1),
          e.error ? (M(), P("div", {
            key: 0,
            class: "header__error",
            title: e.error
          }, ee(e.error), 9, $c)) : he("", !0),
          f.$slots["header-actions"] ? (M(), P("div", Ec, [
            $n(f.$slots, "header-actions", {}, void 0)
          ])) : he("", !0)
        ], 4)) : he("", !0),
        g("div", Mc, [
          $n(f.$slots, "default", {}, void 0)
        ])
      ], 36)
    ], 8, ["to"])) : he("", !0);
  }
}), He = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, o] of t)
    n[s] = o;
  return n;
}, Fl = /* @__PURE__ */ He(Ac, [["__scopeId", "data-v-476df293"]]), Ic = { class: "hikaze-checkpoint-content" }, Lc = ["title"], Nc = { class: "value" }, Pc = /* @__PURE__ */ je({
  __name: "HikazeCheckpointLoaderOverlay",
  props: {
    nodeId: {},
    payload: {},
    commit: { type: Function },
    title: {}
  },
  setup(e) {
    const t = e, n = on("openManager", null), s = K(() => {
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
      const l = i.ckpt_path, a = s.value;
      l && l !== a && t.commit(JSON.stringify({ ckpt_path: l }));
    }
    return (i, l) => (M(), Re(Fl, {
      "node-id": e.nodeId,
      title: "Hikaze Checkpoint Loader"
    }, {
      "header-actions": rt(() => [
        g("button", {
          type: "button",
          class: "btn header-action-btn",
          onClick: o
        }, " Select Checkpoint... ")
      ]),
      default: rt(() => [
        g("div", Ic, [
          g("div", {
            class: "path-display",
            title: s.value
          }, [
            l[0] || (l[0] = g("div", { class: "label" }, "Current Path:", -1)),
            g("div", Nc, ee(s.value || "(No path selected)"), 1)
          ], 8, Lc)
        ])
      ]),
      _: 1
    }, 8, ["node-id"]));
  }
}), wc = /* @__PURE__ */ He(Pc, [["__scopeId", "data-v-3473ea37"]]), as = V(!1), yo = V(null);
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
class Wt {
  constructor(t) {
    be(this, "node");
    /** Reactive copy of the `hikaze_payload` widget value. */
    be(this, "payloadRef", V("{}"));
    be(this, "injectedMode", null);
    be(this, "cleanupFns", []);
    be(this, "vueApp", null);
    be(this, "vueHost", null);
    be(this, "vueMountRetryTimer", null);
    be(this, "onWidgetChangedOriginal", null);
    be(this, "onWidgetChangedWrapper", null);
    be(this, "hydrationSyncTimers", []);
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
    s.mouse = (i, l, a) => {
      if (i.type === "pointerdown" || i.type === "mousedown") {
        const c = String(s.value ?? ""), p = n(c);
        return p !== null && p !== c && this.commitPayload(p), !0;
      }
      return o ? o.call(s, i, l, a) : void 0;
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
    const i = wl({
      render: () => Il(this.getComponent(), {
        nodeId: s,
        title: this.getTitle(),
        // Pass title to Overlay if it wraps Frame
        ...this.getComponentProps(),
        // Standard props passed to all child components
        payload: this.payloadRef,
        commit: (a) => this.commitPayload(a)
      })
    });
    i.provide("openManager", Oc), i.mount(o), this.vueApp = i;
  }
}
be(Wt, "registry", /* @__PURE__ */ new Map());
const Fc = "HikazeCheckpointLoader";
class Rc extends Wt {
  getComponent() {
    return wc;
  }
}
Wt.register(Fc, Rc);
const Dc = ["title"], jc = ["value"], Hc = ["value"], Vc = { class: "center-chk" }, Bc = ["checked"], zc = /* @__PURE__ */ je({
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
    const n = e, s = K(
      () => {
        var p;
        return n.name && ((p = n.name.split(/[\\/]/).pop()) == null ? void 0 : p.replace(".safetensors", "")) || "";
      }
    ), o = t;
    function i(p) {
      const d = p.target;
      o("update:strength_model", n.seq, d.valueAsNumber);
    }
    function l(p) {
      const d = p.target;
      o("update:strength_clip", n.seq, d.valueAsNumber);
    }
    function a(p) {
      o("update:enabled", n.seq, p.target.checked);
    }
    function c(p) {
      o("update:delete", n.seq);
    }
    return (p, d) => (M(), P("tr", null, [
      g("td", null, [
        g("button", {
          class: "del-btn",
          onClick: c
        }, "🗑")
      ]),
      g("td", null, ee(n.seq + 1), 1),
      g("td", {
        title: s.value,
        class: "lora-name"
      }, ee(s.value), 9, Dc),
      g("td", null, [
        g("input", {
          class: "hikaze-reset-input",
          type: "number",
          value: n.strength_model,
          step: "0.05",
          onInput: i
        }, null, 40, jc)
      ]),
      g("td", null, [
        g("input", {
          class: "hikaze-reset-input",
          type: "number",
          value: n.strength_clip,
          step: "0.05",
          onInput: l
        }, null, 40, Hc)
      ]),
      g("td", Vc, [
        g("input", {
          class: "hikaze-reset-chk",
          type: "checkbox",
          checked: n.enabled,
          onInput: a
        }, null, 40, Bc)
      ])
    ]));
  }
}), Uc = /* @__PURE__ */ He(zc, [["__scopeId", "data-v-771e698c"]]);
function Rl(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function _n(e) {
  return typeof e == "string" ? e : null;
}
function Ht(e) {
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
function Dl(e) {
  if (!Rl(e)) return null;
  const t = _n(e.name) ?? "", n = _n(e.full_path) ?? _n(e.fullPath) ?? _n(e.path) ?? "", s = Ht(e.strength_model) ?? Ht(e.MStrength) ?? Ht(e.strengthModel) ?? 1, o = Ht(e.strength_clip) ?? Ht(e.CStrength) ?? Ht(e.strengthClip) ?? 1, i = di(e.enabled) ?? di(e.toggleOn) ?? !0, l = _n(e.sha256) ?? "";
  return {
    name: t,
    full_path: n,
    strength_model: s,
    strength_clip: o,
    sha256: l,
    enabled: i
  };
}
function jl() {
  return { version: 2, loras: [] };
}
function Wc(e) {
  let t = 2, n = null;
  if (Array.isArray(e))
    n = e;
  else if (Rl(e)) {
    const o = Ht(e.version);
    o != null && (t = o), n = e.loras ?? e.LoRAs ?? e.LoRAList ?? e.loRAList ?? null;
  }
  if (!Array.isArray(n))
    return { version: t, loras: [] };
  const s = [];
  for (const o of n) {
    const i = Dl(o);
    i && s.push(i);
  }
  return { version: t, loras: s };
}
function Hl(e) {
  const t = e.trim();
  if (!t) return jl();
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
function Kc(e) {
  return Dl(e) ?? {
    full_path: "",
    strength_model: 1,
    strength_clip: 1,
    enabled: !0,
    name: "",
    sha256: ""
  };
}
const Gc = { class: "hikaze-lora-content" }, qc = { class: "loRA-list-table" }, Jc = {
  class: "header-chk-wrap",
  title: "Toggle All"
}, Yc = {
  key: 0,
  class: "empty-tip"
}, Zc = /* @__PURE__ */ je({
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
    }, o = V({ version: 2, loras: [] }), i = V(null);
    Ke(
      () => {
        var _;
        return String(((_ = t.payload) == null ? void 0 : _.value) ?? "");
      },
      (_) => {
        if (!(i.value != null && _ === i.value))
          try {
            o.value = Hl(_ || "");
          } catch {
            console.error("Invalid JSON provided to Hikaze Lora Overlay"), o.value = JSON.parse(JSON.stringify(s));
          }
      },
      { immediate: !0 }
    ), Ke(o, () => {
      const _ = fi(o.value);
      i.value = _, t.commit(_);
    }, { deep: !0 });
    function l(_, A) {
      var L;
      const k = (L = o.value.loras) == null ? void 0 : L[_];
      k && (k.strength_model = A);
    }
    function a(_, A) {
      var L;
      const k = (L = o.value.loras) == null ? void 0 : L[_];
      k && (k.strength_clip = A);
    }
    function c(_, A) {
      var L;
      const k = (L = o.value.loras) == null ? void 0 : L[_];
      k && (k.enabled = A);
    }
    function p(_) {
      var A;
      (A = o.value.loras) == null || A.splice(_, 1);
    }
    function d() {
      confirm("Delete all LoRAs?") && (o.value.loras = []);
    }
    function f(_) {
      if (!o.value.loras) return;
      const A = _.target.checked;
      o.value.loras.forEach((k) => {
        k.enabled = A;
      });
    }
    async function y() {
      if (!n) {
        console.warn("openManager is not available");
        return;
      }
      const _ = await n({
        mode: "multi",
        initialTab: "loras",
        title: "Select LoRAs",
        payloadJson: t.payload.value
      });
      !_ || typeof _ != "object" || !("loras" in _) || t.commit(fi(_));
    }
    return (_, A) => (M(), Re(Fl, {
      "node-id": e.nodeId,
      title: "Hikaze LoRA Power Loader"
    }, {
      "header-actions": rt(() => [
        g("button", {
          type: "button",
          class: "btn header-action-btn",
          onClick: y
        }, " Select LoRAs... ")
      ]),
      default: rt(() => [
        g("div", Gc, [
          g("table", qc, [
            g("thead", null, [
              g("th", null, [
                g("button", {
                  class: "header-btn",
                  onClick: d,
                  title: "Delete All"
                }, "🗑")
              ]),
              A[1] || (A[1] = g("th", null, "Seq", -1)),
              A[2] || (A[2] = g("th", null, "LoRA", -1)),
              A[3] || (A[3] = g("th", null, "Mstr", -1)),
              A[4] || (A[4] = g("th", null, "Cstr", -1)),
              g("th", null, [
                g("div", Jc, [
                  A[0] || (A[0] = it(" On ", -1)),
                  g("input", {
                    class: "hikaze-reset-chk",
                    type: "checkbox",
                    onChange: f
                  }, null, 32)
                ])
              ])
            ]),
            g("tbody", null, [
              (M(!0), P(ie, null, ye(o.value.loras, (k, L) => (M(), Re(Uc, {
                key: L,
                seq: L,
                name: k.full_path,
                strength_model: k.strength_model,
                strength_clip: k.strength_clip,
                enabled: k.enabled,
                "onUpdate:strength_model": l,
                "onUpdate:strength_clip": a,
                "onUpdate:enabled": c,
                "onUpdate:delete": p
              }, null, 8, ["seq", "name", "strength_model", "strength_clip", "enabled"]))), 128))
            ])
          ]),
          o.value.loras.length === 0 ? (M(), P("div", Yc, " No LoRAs loaded. ")) : he("", !0)
        ])
      ]),
      _: 1
    }, 8, ["node-id"]));
  }
}), Xc = /* @__PURE__ */ He(Zc, [["__scopeId", "data-v-15c94417"]]), Qc = "HikazeLoraPowerLoader";
class eu extends Wt {
  getComponent() {
    return Xc;
  }
}
Wt.register(Qc, eu);
const tu = "Hikaze", Vl = "Comfy.VueNodes.Enabled", nu = `${Vl}.change`, su = Object.hasOwn ?? ((e, t) => Object.prototype.hasOwnProperty.call(e, t));
function pi(e, t) {
  return !e || typeof e != "object" && typeof e != "function" ? !1 : su(e, t);
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
function Bl(e) {
  return {
    positive: String((e == null ? void 0 : e.positive) ?? ""),
    negative: String((e == null ? void 0 : e.negative) ?? "")
  };
}
function ou(e) {
  return {
    description: String((e == null ? void 0 : e.description) ?? ""),
    community_links: String((e == null ? void 0 : e.community_links) ?? ""),
    images_count: Number((e == null ? void 0 : e.images_count) ?? 0),
    prompts: Bl(e == null ? void 0 : e.prompts)
  };
}
function iu(e) {
  return {
    description: String((e == null ? void 0 : e.description) ?? ""),
    community_links: String((e == null ? void 0 : e.community_links) ?? ""),
    images: Array.isArray(e == null ? void 0 : e.images) ? e.images.map((t) => String(t)) : [],
    prompts: Bl(e == null ? void 0 : e.prompts)
  };
}
function zl(e) {
  return {
    sha256: String((e == null ? void 0 : e.sha256) ?? ""),
    path: String((e == null ? void 0 : e.path) ?? ""),
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
    id: Number((e == null ? void 0 : e.id) ?? 0),
    path: String((e == null ? void 0 : e.path) ?? ""),
    sha256: String((e == null ? void 0 : e.sha256) ?? ""),
    name: String((e == null ? void 0 : e.name) ?? ""),
    type: String((e == null ? void 0 : e.type) ?? ""),
    size_bytes: Number((e == null ? void 0 : e.size_bytes) ?? 0),
    created_at: Number((e == null ? void 0 : e.created_at) ?? 0),
    meta_json: iu(e == null ? void 0 : e.meta_json),
    tags: Array.isArray(e == null ? void 0 : e.tags) ? e.tags.map(pn) : []
  };
}
function ru(e) {
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
function au(e) {
  return {
    id: Number((e == null ? void 0 : e.id) ?? 0),
    name: String((e == null ? void 0 : e.name) ?? ""),
    image: String((e == null ? void 0 : e.image) ?? ""),
    type: String((e == null ? void 0 : e.type) ?? ""),
    tags: Array.isArray(e == null ? void 0 : e.tags) ? e.tags.map(pn) : []
  };
}
const cs = "__HIKAZE_API_PORT__", Zs = "__HIKAZE_API_BASE__", cu = "__HIKAZE_EMBEDDED__", uu = (e) => new Promise((t) => setTimeout(t, e));
function Dn(e) {
  return globalThis[e];
}
function Xs(e, t) {
  globalThis[e] = t;
}
function _o() {
  return !!Dn(cu);
}
function du() {
  typeof Dn(cs) != "number" && Xs(cs, 0), typeof Dn(Zs) != "string" && Xs(Zs, "");
}
function Ul() {
  const e = Dn(cs), t = Number(e ?? 0);
  return Number.isFinite(t) ? t : 0;
}
function fu(e) {
  Xs(cs, e);
}
function pu() {
  const e = Dn(Zs);
  return typeof e == "string" ? e : "";
}
async function hu() {
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
let An = null;
async function Wl() {
  for (; ; ) {
    const e = await hu();
    if (e > 0)
      return fu(e), e;
    await uu(1e3);
  }
}
function gu() {
  _o() && (An || (An = Wl()));
}
async function mu() {
  if (!_o())
    return 0;
  const e = Ul();
  return e > 0 ? e : (An || (An = Wl()), An);
}
function Cs() {
  const e = pu();
  if (e)
    return e;
  if (!_o())
    return "";
  const t = Ul();
  return t ? `http://${typeof window < "u" ? window.location.hostname : "127.0.0.1"}:${t}` : "";
}
async function vu() {
  const e = Cs();
  if (e)
    return e;
  const t = await mu();
  return t ? `http://${typeof window < "u" ? window.location.hostname : "127.0.0.1"}:${t}` : "";
}
async function Kl(e) {
  const t = await vu();
  return t ? `${t}${e}` : e;
}
async function Ze(e, t) {
  const n = await Kl(e);
  return fetch(n, t);
}
async function yu() {
  const e = await Ze("/api/models/get_types");
  if (!e.ok)
    throw new Error(`Failed to fetch model types: ${e.statusText}`);
  return ((await e.json()).types || []).map((n) => String(n));
}
async function _u() {
  const e = await Ze("/api/tags");
  if (!e.ok)
    throw new Error(`Failed to fetch tags: ${e.statusText}`);
  return ((await e.json()).tags || []).map(pn);
}
async function bu(e) {
  const t = await Ze("/api/tags_add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newtags: e })
  });
  if (!t.ok)
    throw new Error(`Failed to add tags: ${t.statusText}`);
  return ((await t.json()).tags || []).map(pn);
}
async function Cu(e) {
  const t = await Ze(`/api/models?type=${encodeURIComponent(e)}`);
  if (!t.ok)
    throw new Error(`Failed to fetch models: ${t.statusText}`);
  return ((await t.json()).models || []).map(ru);
}
async function Su(e) {
  const t = await Ze(`/api/models/${e}`);
  if (!t.ok)
    throw new Error(`Failed to fetch model details: ${t.statusText}`);
  const n = await t.json();
  return zl(n);
}
async function xu(e, t) {
  const n = await Ze(`/api/models/${e}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(t)
  });
  if (!n.ok)
    throw new Error(`Failed to update model: ${n.statusText}`);
  const s = await n.json();
  return zl(s);
}
async function Tu(e) {
  const t = await Ze(`/api/images/get_img_count?sha256=${e}`);
  if (!t.ok)
    throw new Error(`Failed to fetch image count: ${t.statusText}`);
  const n = await t.json();
  return Number(n.count ?? 0);
}
async function ku(e, t) {
  const n = await Ze(`/api/images/delete?sha256=${e}&seq=${t}`, {
    method: "DELETE"
  });
  if (!n.ok)
    throw new Error(`Failed to delete image: ${n.statusText}`);
}
async function $u() {
  const e = await Ze("/api/migration/pending_models");
  if (!e.ok)
    throw new Error(`Failed to fetch pending models: ${e.statusText}`);
  return ((await e.json()).models || []).map(au);
}
async function Eu(e) {
  const t = await Ze(`/api/migration/pending_model?id=${encodeURIComponent(e)}`);
  if (!t.ok)
    throw new Error(`Failed to fetch pending model details: ${t.statusText}`);
  const n = await t.json();
  return lu(n);
}
async function gi(e, t) {
  const n = await Ze("/api/migration/import_models", {
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
function Mu() {
  const e = me({}), t = me({}), n = me({}), s = me({}), o = me({}), i = me({});
  async function l(v, T = !1) {
    if (v && !(e[v] && !T)) {
      t[v] = !0, n[v] = null;
      try {
        const C = await Cu(v);
        e[v] = C;
      } catch (C) {
        console.error(`Error loading models for type ${v}:`, C), n[v] = (C == null ? void 0 : C.message) || "Failed to load models", e[v] || (e[v] = []);
      } finally {
        t[v] = !1;
      }
    }
  }
  async function a(v, T = !1) {
    if (v && !(s[v] && !T)) {
      o[v] = !0, i[v] = null;
      try {
        const C = await Su(v);
        s[v] = C, c(C);
      } catch (C) {
        console.error(`Error loading model details for ${v}:`, C), i[v] = (C == null ? void 0 : C.message) || "Failed to load model details";
      } finally {
        o[v] = !1;
      }
    }
  }
  function c(v) {
    Object.keys(e).forEach((T) => {
      const C = e[T];
      if (!C || C.length === 0) return;
      const H = C.findIndex((Z) => Z.sha256 === v.sha256);
      if (H === -1) return;
      const B = C[H];
      B && (C[H] = {
        ...B,
        name: v.name,
        tags: v.tags
      });
    });
  }
  function p(v) {
    s[v.sha256] = v, c(v);
  }
  function d(v) {
    return K(() => e[ln(v)] || []);
  }
  function f(v) {
    return K(() => !!t[ln(v)]);
  }
  function y(v) {
    return K(() => n[ln(v)] || null);
  }
  function _(v) {
    return K(() => s[v] || null);
  }
  function A(v) {
    return K(() => !!o[v]);
  }
  function k(v) {
    return K(() => i[v] || null);
  }
  function L() {
    Object.keys(e).forEach((v) => delete e[v]), Object.keys(t).forEach((v) => delete t[v]), Object.keys(n).forEach((v) => delete n[v]), Object.keys(s).forEach((v) => delete s[v]), Object.keys(o).forEach((v) => delete o[v]), Object.keys(i).forEach((v) => delete i[v]);
  }
  function b(v) {
    if (!v) {
      L();
      return;
    }
    delete e[v], delete t[v], delete n[v];
  }
  return {
    loadModels: l,
    loadDetails: a,
    setDetails: p,
    getModels: d,
    isLoading: f,
    getError: y,
    getDetails: _,
    isDetailsLoading: A,
    getDetailsError: k,
    reset: L,
    invalidate: b
  };
}
function Au() {
  const e = me({}), t = me({}), n = me({}), s = me({}), o = me({}), i = me({});
  async function l(b, v = !1) {
    const T = b || "pending";
    if (!(e[T] && !v)) {
      t[T] = !0, n[T] = null;
      try {
        e[T] = await $u();
      } catch (C) {
        console.error("Error loading pending models:", C), n[T] = (C == null ? void 0 : C.message) || "Failed to load pending models", e[T] || (e[T] = []);
      } finally {
        t[T] = !1;
      }
    }
  }
  async function a(b, v = !1) {
    const T = String(b || "");
    if (T && !(s[T] && !v)) {
      o[T] = !0, i[T] = null;
      try {
        const C = await Eu(Number(T));
        s[T] = C;
      } catch (C) {
        console.error(`Error loading pending model details for ${T}:`, C), i[T] = (C == null ? void 0 : C.message) || "Failed to load pending model details";
      } finally {
        o[T] = !1;
      }
    }
  }
  function c(b) {
    s[String(b.id)] = b;
  }
  function p(b) {
    const v = ln(b) || "pending";
    return K(() => e[v] || []);
  }
  function d(b) {
    const v = ln(b) || "pending";
    return K(() => !!t[v]);
  }
  function f(b) {
    const v = ln(b) || "pending";
    return K(() => n[v] || null);
  }
  function y(b) {
    return K(() => s[String(b)] || null);
  }
  function _(b) {
    return K(() => !!o[String(b)]);
  }
  function A(b) {
    return K(() => i[String(b)] || null);
  }
  function k() {
    Object.keys(e).forEach((b) => delete e[b]), Object.keys(t).forEach((b) => delete t[b]), Object.keys(n).forEach((b) => delete n[b]), Object.keys(s).forEach((b) => delete s[b]), Object.keys(o).forEach((b) => delete o[b]), Object.keys(i).forEach((b) => delete i[b]);
  }
  function L(b) {
    if (!b) {
      k();
      return;
    }
    delete e[b], delete t[b], delete n[b];
  }
  return {
    loadModels: l,
    getModels: p,
    isLoading: d,
    getError: f,
    reset: k,
    invalidate: L,
    loadDetails: a,
    setDetails: c,
    getDetails: y,
    isDetailsLoading: _,
    getDetailsError: A
  };
}
const Iu = Mu(), Lu = Au();
function Kt(e = "active") {
  return e === "pending" ? Lu : Iu;
}
const Ce = me({
  items: [],
  loading: !1,
  error: null,
  loaded: !1
});
async function Nu(e = !1) {
  if (!(Ce.loaded && !e)) {
    Ce.loading = !0, Ce.error = null;
    try {
      const t = await _u();
      Ce.items = [...t], Ce.loaded = !0;
    } catch (t) {
      console.error("Error loading tags:", t), Ce.error = (t == null ? void 0 : t.message) || "Failed to load tags", Ce.items = [], Ce.loaded = !1;
    } finally {
      Ce.loading = !1;
    }
  }
}
function Pu(e) {
  if (!e.length) return;
  const t = new Map(Ce.items.map((n) => [n.id, n]));
  e.forEach((n) => {
    t.has(n.id) || t.set(n.id, n);
  }), Ce.items = Array.from(t.values());
}
function wu() {
  Ce.items = [], Ce.loaded = !1, Ce.error = null, Ce.loading = !1;
}
function Vn() {
  return {
    loadTags: Nu,
    mergeTags: Pu,
    resetTags: wu,
    getTags: () => K(() => Ce.items),
    isLoading: () => K(() => Ce.loading),
    getError: () => K(() => Ce.error)
  };
}
const Ou = {
  key: 0,
  class: "hikaze-header"
}, Fu = {
  key: 0,
  class: "tabs-loading"
}, Ru = {
  key: 1,
  class: "tabs-error"
}, Du = {
  key: 2,
  class: "type-tabs"
}, ju = ["onClick"], Hu = {
  key: 3,
  class: "mode-indicator"
}, Vu = { class: "hikaze-pane-library" }, Bu = { class: "hikaze-pane-details" }, zu = /* @__PURE__ */ je({
  __name: "HikazeManagerLayout",
  props: {
    embedded: { type: Boolean },
    initialTab: {},
    mode: {}
  },
  setup(e) {
    const t = e, n = Kt(), s = Vn(), o = V(""), i = V([]), l = V(!1), a = V(null), c = V(24), p = V(!1);
    function d(k) {
      o.value = k;
    }
    function f() {
      p.value = !0, document.addEventListener("mousemove", y), document.addEventListener("mouseup", _), document.body.style.cursor = "col-resize", document.body.style.userSelect = "none";
    }
    function y(k) {
      if (!p.value) return;
      const L = window.innerWidth, v = (L - k.clientX) / L * 100;
      v > 10 && v < 80 && (c.value = v);
    }
    function _() {
      p.value = !1, document.removeEventListener("mousemove", y), document.removeEventListener("mouseup", _), document.body.style.cursor = "", document.body.style.userSelect = "";
    }
    fn(() => {
      _();
    }), Ke(o, (k) => {
      k && n.loadModels(k);
    });
    async function A() {
      l.value = !0, a.value = null;
      try {
        const k = await yu();
        i.value = [...k, "Others"];
        const L = t.initialTab;
        if (L) {
          const b = i.value.find((C) => C === L), v = i.value.find(
            (C) => C.toLowerCase() === L.toLowerCase()
          ), T = b || v;
          if (T) {
            o.value = T;
            return;
          }
        }
        i.value.length > 0 && (o.value = i.value[0] || "");
      } catch (k) {
        a.value = k.message || "Failed to load model types";
      } finally {
        l.value = !1;
      }
    }
    return Nt(() => {
      A(), s.loadTags();
    }), (k, L) => (M(), P("div", {
      class: ce(["hikaze-layout", {
        "is-embedded": e.embedded,
        "has-initial-tab": !!e.initialTab,
        "is-pending": e.mode === "pending"
      }]),
      style: Ue({ gridTemplateColumns: `1fr 4px ${c.value}%` })
    }, [
      !e.embedded && !e.initialTab ? (M(), P("header", Ou, [
        l.value ? (M(), P("div", Fu, [...L[0] || (L[0] = [
          g("span", { class: "spinner" }, null, -1),
          it(" Loading types... ", -1)
        ])])) : a.value ? (M(), P("div", Ru, [
          it(ee(a.value) + " ", 1),
          g("button", {
            onClick: A,
            class: "btn-retry"
          }, "Retry")
        ])) : (M(), P("nav", Du, [
          (M(!0), P(ie, null, ye(i.value, (b) => (M(), P("div", {
            key: b,
            class: ce(["tab", { active: o.value === b }]),
            onClick: (v) => d(b)
          }, ee(b), 11, ju))), 128))
        ])),
        e.mode === "pending" ? (M(), P("div", Hu, "Pending Mode")) : he("", !0)
      ])) : he("", !0),
      g("main", Vu, [
        $n(k.$slots, "library", { activeTab: o.value }, () => [
          L[1] || (L[1] = it("Library", -1))
        ])
      ]),
      g("div", {
        class: ce(["layout-splitter", { dragging: p.value }]),
        onMousedown: f
      }, null, 34),
      g("aside", Bu, [
        $n(k.$slots, "details", {}, () => [
          L[2] || (L[2] = it("Details", -1))
        ])
      ]),
      $n(k.$slots, "toolbar", { activeTab: o.value }, void 0)
    ], 6));
  }
}), Uu = /* @__PURE__ */ He(zu, [["__scopeId", "data-v-886bfac7"]]), Ut = me({}), rn = me({}), an = me({}), cn = me({});
function Wu(e) {
  cn[e] = (cn[e] ?? 0) + 1;
}
function Ku(e) {
  if (e) {
    delete Ut[e], delete rn[e], delete an[e], delete cn[e];
    return;
  }
  Object.keys(Ut).forEach((t) => delete Ut[t]), Object.keys(rn).forEach((t) => delete rn[t]), Object.keys(an).forEach((t) => delete an[t]), Object.keys(cn).forEach((t) => delete cn[t]);
}
async function Gu(e, t = !1) {
  if (e && !(Ut[e] != null && !t)) {
    rn[e] = !0, an[e] = null;
    try {
      Ut[e] = await Tu(e);
    } catch (n) {
      console.error(`Error loading image count for ${e}:`, n), an[e] = (n == null ? void 0 : n.message) || "Failed to load image count", Ut[e] = 0;
    } finally {
      rn[e] = !1;
    }
  }
}
function qu(e, t, n = "high") {
  const s = cn[e] ?? 0, o = Cs();
  return `${o ? `${o}` : ""}/api/images/${e}_${t}.webp?quality=${n}&rev=${s}`;
}
function bo() {
  return {
    loadImageCount: Gu,
    bumpRevision: Wu,
    resetImageCache: Ku,
    getImageUrl: qu,
    getImageCount: (e) => K(() => Ut[e] ?? 0),
    isLoading: (e) => K(() => !!rn[e]),
    getError: (e) => K(() => an[e] ?? null)
  };
}
function Ju(e, t = { root: null, rootMargin: "0px", threshold: 0.1 }) {
  return new IntersectionObserver((s) => {
    s.forEach((o) => {
      o.isIntersecting && e(o);
    });
  }, t);
}
const Yu = { class: "model-library" }, Zu = { class: "library-toolbar" }, Xu = { class: "search-box" }, Qu = { class: "controls-right" }, ed = {
  key: 0,
  class: "column-control"
}, td = { class: "view-switch" }, nd = ["disabled"], sd = { class: "tag-filter" }, od = {
  key: 0,
  class: "tag-dropdown"
}, id = {
  key: 0,
  class: "placeholder-msg"
}, ld = {
  key: 1,
  class: "tag-list"
}, rd = ["onClick"], ad = {
  key: 0,
  class: "library-loading"
}, cd = {
  key: 1,
  class: "library-error"
}, ud = ["onClick", "onMouseenter"], dd = ["checked", "onChange"], fd = ["data-sha256"], pd = { class: "card-meta" }, hd = { class: "card-title" }, gd = { class: "card-tags" }, md = { class: "tooltip-name" }, vd = { class: "tooltip-tags" }, yd = {
  key: 3,
  class: "list-container"
}, _d = ["onClick"], bd = ["checked", "onChange"], Cd = { class: "list-name" }, Sd = { class: "list-tags" }, mi = 7e3, xd = 1500, Td = /* @__PURE__ */ je({
  __name: "ModelLibrary",
  props: {
    activeTab: {},
    selectionMode: {},
    selectedIds: {},
    excludeSelected: { type: Boolean }
  },
  emits: ["select-model", "toggle-select"],
  setup(e, { emit: t }) {
    const n = e, s = t, o = Kt(), i = Vn(), l = bo(), a = V("card"), c = V(4), p = V(null), d = V("bottom"), f = V(!1), y = V(""), _ = V(/* @__PURE__ */ new Map()), A = K(() => n.selectionMode === "lora"), k = K(() => new Set(n.selectedIds ?? [])), L = o.getModels(K(() => n.activeTab)), b = o.isLoading(K(() => n.activeTab)), v = o.getError(K(() => n.activeTab)), T = me({}), C = /* @__PURE__ */ new Map(), H = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map(), Z = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Set();
    let W = null;
    function oe() {
      W && W.disconnect(), W = Ju((m) => {
        const r = m.target, u = r.dataset.sha256;
        if (!u) return;
        const h = new Image(), S = l.getImageUrl(u, 0, "medium");
        h.onload = () => {
          r.classList.remove("lazy"), r.classList.add("loaded");
        }, h.onerror = () => {
          r.classList.remove("lazy"), r.classList.add("error");
        }, h.src = S, W == null || W.unobserve(r);
      }), fo(() => {
        document.querySelectorAll(".card-image.lazy").forEach((r) => W == null ? void 0 : W.observe(r));
      });
    }
    const E = (m, r) => {
      const u = Z.get(m);
      if (u) return u;
      const h = Promise.all(
        Array.from({ length: r }, (S, x) => new Promise(($) => {
          const N = new Image();
          N.onload = () => $(), N.onerror = () => $(), N.src = l.getImageUrl(m, x, "medium");
        }))
      ).then(() => {
      });
      return Z.set(m, h), h;
    }, F = (m, r) => {
      const u = T[m];
      if (!u || !u.active || u.next !== null || B.has(m))
        return;
      const h = (u.current + 1) % r;
      u.next = h;
      const S = window.setTimeout(() => {
        const x = T[m];
        if (!x || !x.active) {
          B.delete(m);
          return;
        }
        x.current = h, x.next = null, B.delete(m);
      }, xd);
      B.set(m, S);
    }, D = async (m) => {
      if (!(C.has(m) || H.has(m) || j.has(m))) {
        j.add(m), T[m] ? (T[m].active = !0, T[m].next = null) : T[m] = { current: 0, next: null, active: !0 };
        try {
          await l.loadImageCount(m);
          const r = l.getImageCount(m).value, u = T[m];
          if (!u || !u.active || r <= 1) return;
          await E(m, r);
          const h = J.get(m) ?? Math.floor(0.5 * Math.random() * mi);
          J.set(m, h);
          const S = window.setTimeout(() => {
            const x = window.setInterval(() => {
              F(m, r);
            }, mi);
            C.set(m, x), H.delete(m);
          }, h);
          H.set(m, S);
        } finally {
          j.delete(m);
        }
      }
    }, X = (m) => {
      const r = C.get(m);
      r && (clearInterval(r), C.delete(m));
      const u = H.get(m);
      u && (clearTimeout(u), H.delete(m));
      const h = B.get(m);
      h && (clearTimeout(h), B.delete(m)), J.delete(m), j.delete(m), T[m] && (T[m].current = 0, T[m].next = null, T[m].active = !1);
    }, Q = (m) => {
      const r = T[m], u = r ? r.current : 0;
      return {
        backgroundImage: `url(${l.getImageUrl(m, u, "medium")})`
      };
    }, te = (m) => {
      const r = T[m], u = r == null ? void 0 : r.next, h = typeof u == "number";
      return {
        backgroundImage: h ? `url(${l.getImageUrl(m, u, "medium")})` : "none",
        opacity: h ? "1" : "0"
      };
    }, ne = (m, r) => {
      p.value = r;
      const h = m.currentTarget.getBoundingClientRect(), S = window.innerHeight - h.bottom;
      d.value = S < 250 ? "top" : "bottom";
    }, xe = () => {
      p.value = null;
    }, at = (m, r) => {
      s("toggle-select", m, r);
    }, Ve = (m) => {
      s("select-model", m), A.value && m.sha256 && !k.value.has(m.sha256) && at(m, !0);
    }, Me = (m, r) => {
      const u = r.target;
      m.sha256 && at(m, u.checked);
    }, xt = i.getTags();
    Nt(async () => {
      a.value === "card" && oe();
      try {
        await i.loadTags();
        const m = xt.value.find((r) => r.name.toLowerCase() === "nsfw");
        m && _.value.set(m.id, "exclude");
      } catch (m) {
        console.error("Failed to load tags for auto-exclude:", m);
      }
    }), fn(() => {
      W && W.disconnect(), C.forEach((m) => clearInterval(m)), C.clear(), H.forEach((m) => clearTimeout(m)), H.clear(), B.forEach((m) => clearTimeout(m)), B.clear(), Z.clear(), J.clear(), j.clear();
    });
    const ct = K(() => {
      let m = L.value;
      if (y.value.trim()) {
        const r = y.value.toLowerCase();
        m = m.filter(
          (u) => u.name.toLowerCase().includes(r) || u.path.toLowerCase().includes(r)
        );
      }
      if (_.value.size > 0) {
        const r = Array.from(_.value.entries()).filter(([h, S]) => S === "include").map(([h]) => h), u = Array.from(_.value.entries()).filter(([h, S]) => S === "exclude").map(([h]) => h);
        m = m.filter((h) => {
          const S = new Set(h.tags.map((N) => N.id)), x = r.every((N) => S.has(N)), $ = !u.some((N) => S.has(N));
          return x && $;
        });
      }
      return n.excludeSelected && k.value.size > 0 && (m = m.filter((r) => !k.value.has(r.sha256))), m;
    }), qt = K(() => {
      const m = /* @__PURE__ */ new Map();
      ct.value.forEach((S) => {
        S.tags.forEach((x) => {
          m.set(x.id, (m.get(x.id) ?? 0) + 1);
        });
      });
      const r = new Map(xt.value.map((S) => [S.id, S])), u = [];
      _.value.forEach((S, x) => {
        const $ = r.get(x);
        $ && u.push($);
      });
      const h = xt.value.filter((S) => !_.value.has(S.id) && (m.get(S.id) ?? 0) > 0).sort((S, x) => S.name.localeCompare(x.name));
      return [...u, ...h];
    });
    Ke([ct, a], () => {
      if (a.value === "card") {
        oe();
        const m = new Set(ct.value.map((r) => r.sha256));
        m.forEach((r) => {
          r && D(r);
        }), C.forEach((r, u) => {
          m.has(u) || X(u);
        }), H.forEach((r, u) => {
          m.has(u) || X(u);
        });
      } else
        C.forEach((m, r) => X(r));
    }, { deep: !0 });
    function ut(m) {
      const r = _.value.get(m);
      r === "include" ? _.value.set(m, "exclude") : r === "exclude" ? _.value.delete(m) : _.value.set(m, "include");
    }
    function Tt() {
      _.value.clear();
    }
    function Pt() {
      o.reset(), l.resetImageCache(), o.loadModels(n.activeTab, !0);
    }
    const wt = (m) => {
      a.value = m;
    }, dt = K(() => a.value !== "card" ? {} : {
      gridTemplateColumns: `repeat(${c.value}, 1fr)`
    });
    return (m, r) => (M(), P("div", Yu, [
      g("div", Zu, [
        g("div", Xu, [
          ze(g("input", {
            type: "text",
            "onUpdate:modelValue": r[0] || (r[0] = (u) => y.value = u),
            placeholder: "Search models..."
          }, null, 512), [
            [ot, y.value]
          ])
        ]),
        g("div", Qu, [
          a.value === "card" ? (M(), P("div", ed, [
            r[9] || (r[9] = g("label", { for: "col-count" }, "Cols:", -1)),
            ze(g("input", {
              id: "col-count",
              type: "number",
              "onUpdate:modelValue": r[1] || (r[1] = (u) => c.value = u),
              min: "2",
              max: "10",
              step: "1"
            }, null, 512), [
              [
                ot,
                c.value,
                void 0,
                { number: !0 }
              ]
            ])
          ])) : he("", !0),
          g("div", td, [
            g("button", {
              class: ce({ active: a.value === "card" }),
              onClick: r[2] || (r[2] = (u) => wt("card"))
            }, "Card", 2),
            g("button", {
              class: ce({ active: a.value === "list" }),
              onClick: r[3] || (r[3] = (u) => wt("list"))
            }, "List", 2)
          ]),
          g("button", {
            class: "btn-refresh",
            onClick: Pt,
            disabled: Ge(b),
            title: "Refresh model library"
          }, " Refresh ", 8, nd),
          g("div", sd, [
            g("button", {
              class: ce(["btn-filter", { active: _.value.size > 0 }]),
              onClick: r[4] || (r[4] = (u) => f.value = !f.value)
            }, " Tags Filter " + ee(_.value.size > 0 ? `(${_.value.size})` : ""), 3),
            f.value ? (M(), P("div", od, [
              qt.value.length === 0 ? (M(), P("div", id, "No tags available")) : (M(), P("div", ld, [
                (M(!0), P(ie, null, ye(qt.value, (u) => (M(), P("div", {
                  key: u.id,
                  class: ce(["tag-item", _.value.get(u.id)]),
                  onClick: (h) => ut(u.id)
                }, ee(u.name), 11, rd))), 128)),
                g("div", { class: "tag-dropdown-actions" }, [
                  g("button", {
                    onClick: Tt,
                    class: "btn-clear"
                  }, "Clear All")
                ])
              ]))
            ])) : he("", !0)
          ])
        ])
      ]),
      g("div", {
        class: ce(["library-content", a.value]),
        style: Ue(dt.value)
      }, [
        Ge(b) ? (M(), P("div", ad, [...r[10] || (r[10] = [
          g("span", { class: "spinner" }, null, -1),
          it(" Loading models... ", -1)
        ])])) : Ge(v) ? (M(), P("div", cd, ee(Ge(v)), 1)) : a.value === "card" ? (M(!0), P(ie, { key: 2 }, ye(ct.value, (u) => (M(), P("div", {
          key: u.sha256,
          class: ce(["card-item", { "dense-view": c.value > 6 }]),
          onClick: (h) => Ve(u),
          onMouseenter: (h) => ne(h, u.sha256),
          onMouseleave: xe
        }, [
          A.value ? (M(), P("label", {
            key: 0,
            class: "selection-checkbox",
            onClick: r[6] || (r[6] = _e(() => {
            }, ["stop"]))
          }, [
            g("input", {
              type: "checkbox",
              checked: k.value.has(u.sha256),
              onClick: r[5] || (r[5] = _e(() => {
              }, ["stop"])),
              onChange: (h) => Me(u, h)
            }, null, 40, dd)
          ])) : he("", !0),
          g("div", {
            class: "card-image lazy",
            "data-sha256": u.sha256
          }, [
            g("div", {
              class: "card-image-layer base",
              style: Ue(Q(u.sha256))
            }, null, 4),
            g("div", {
              class: "card-image-layer next",
              style: Ue(te(u.sha256))
            }, null, 4)
          ], 8, fd),
          g("div", pd, [
            g("div", hd, ee(u.name), 1),
            g("div", gd, [
              (M(!0), P(ie, null, ye(u.tags, (h) => (M(), P("span", {
                key: h.id,
                class: "tag"
              }, ee(h.name), 1))), 128))
            ])
          ]),
          p.value === u.sha256 ? (M(), P("div", {
            key: 1,
            class: ce(["card-tooltip", d.value])
          }, [
            g("div", md, ee(u.name), 1),
            g("div", vd, [
              (M(!0), P(ie, null, ye(u.tags, (h) => (M(), P("span", {
                key: h.id,
                class: "tag"
              }, ee(h.name), 1))), 128))
            ])
          ], 2)) : he("", !0)
        ], 42, ud))), 128)) : (M(), P("div", yd, [
          (M(!0), P(ie, null, ye(ct.value, (u) => (M(), P("div", {
            key: u.sha256,
            class: "list-item",
            onClick: (h) => Ve(u)
          }, [
            A.value ? (M(), P("label", {
              key: 0,
              class: "list-checkbox",
              onClick: r[8] || (r[8] = _e(() => {
              }, ["stop"]))
            }, [
              g("input", {
                type: "checkbox",
                checked: k.value.has(u.sha256),
                onClick: r[7] || (r[7] = _e(() => {
                }, ["stop"])),
                onChange: (h) => Me(u, h)
              }, null, 40, bd)
            ])) : he("", !0),
            g("div", Cd, ee(u.name), 1),
            g("div", Sd, [
              (M(!0), P(ie, null, ye(u.tags, (h) => (M(), P("span", {
                key: h.id,
                class: "tag"
              }, ee(h.name), 1))), 128))
            ])
          ], 8, _d))), 128))
        ]))
      ], 6)
    ]));
  }
}), kd = /* @__PURE__ */ He(Td, [["__scopeId", "data-v-d1d01f45"]]), $d = { class: "main-display" }, Ed = {
  key: 0,
  class: "loader"
}, Md = ["src"], Ad = { class: "nav-controls" }, Id = { class: "action-overlay" }, Ld = {
  key: 2,
  class: "no-images"
}, Nd = {
  key: 0,
  class: "pagination"
}, Pd = ["onClick"], wd = /* @__PURE__ */ je({
  __name: "HikazeImageGallery",
  props: {
    sha256: {}
  },
  emits: ["update"],
  setup(e, { emit: t }) {
    const n = e, s = t, o = bo(), i = V(0), l = V(0), a = V(!1), c = V(!1), p = V(null), d = async (b = !1) => {
      if (n.sha256) {
        a.value = !0;
        try {
          await o.loadImageCount(n.sha256, b), i.value = o.getImageCount(n.sha256).value, l.value >= i.value && i.value > 0 ? l.value = i.value - 1 : i.value === 0 && (l.value = 0);
        } catch (v) {
          console.error("Failed to load image count:", v);
        } finally {
          a.value = !1;
        }
      }
    };
    Ke(() => n.sha256, () => {
      l.value = 0, d();
    }, { immediate: !0 });
    const f = () => {
      i.value > 0 && (l.value = (l.value + 1) % i.value);
    }, y = () => {
      i.value > 0 && (l.value = (l.value - 1 + i.value) % i.value);
    }, _ = async () => {
      if (i.value !== 0 && confirm("Are you sure you want to delete this image?"))
        try {
          await ku(n.sha256, l.value), o.bumpRevision(n.sha256), await d(!0), s("update");
        } catch {
          alert("Failed to delete image");
        }
    }, A = () => {
      var b;
      (b = p.value) == null || b.click();
    }, k = async (b) => {
      var H;
      const v = b.target;
      if (!((H = v.files) != null && H.length)) return;
      const T = v.files[0];
      if (!T) return;
      const C = new FormData();
      C.append("image", T), C.append("sha256", n.sha256);
      try {
        const B = await Kl("/api/images/upload"), Z = await fetch(B, {
          method: "POST",
          body: C
        });
        if (Z.ok)
          o.bumpRevision(n.sha256), await d(!0), l.value = i.value - 1, s("update");
        else {
          const J = await Z.json();
          alert(`Upload failed: ${J.error || Z.statusText}`);
        }
      } catch {
        alert("Upload error");
      } finally {
        v.value = "";
      }
    }, L = (b) => o.getImageUrl(n.sha256, b, "high");
    return (b, v) => (M(), P("div", {
      class: "image-gallery",
      onMouseenter: v[0] || (v[0] = (T) => c.value = !0),
      onMouseleave: v[1] || (v[1] = (T) => c.value = !1)
    }, [
      g("div", $d, [
        a.value ? (M(), P("div", Ed, "Loading...")) : i.value > 0 ? (M(), P(ie, { key: 1 }, [
          g("img", {
            src: L(l.value),
            class: "gallery-img"
          }, null, 8, Md),
          ve(Ys, { name: "fade" }, {
            default: rt(() => [
              ze(g("div", Ad, [
                g("button", {
                  class: "nav-btn prev",
                  onClick: _e(y, ["stop"])
                }, "❮"),
                g("button", {
                  class: "nav-btn next",
                  onClick: _e(f, ["stop"])
                }, "❯")
              ], 512), [
                [Zo, c.value && i.value > 1]
              ])
            ]),
            _: 1
          }),
          ve(Ys, { name: "fade" }, {
            default: rt(() => [
              ze(g("div", Id, [
                g("button", {
                  class: "action-btn upload",
                  onClick: _e(A, ["stop"]),
                  title: "Add Image"
                }, "➕"),
                g("button", {
                  class: "action-btn delete",
                  onClick: _e(_, ["stop"]),
                  title: "Delete Current Image"
                }, "🗑️")
              ], 512), [
                [Zo, c.value]
              ])
            ]),
            _: 1
          })
        ], 64)) : (M(), P("div", Ld, [
          v[2] || (v[2] = g("div", { class: "placeholder" }, "No Images", -1)),
          g("button", {
            class: "btn-upload-init",
            onClick: A
          }, "Upload Image")
        ]))
      ]),
      i.value > 1 ? (M(), P("div", Nd, [
        (M(!0), P(ie, null, ye(i.value, (T) => (M(), P("div", {
          key: T - 1,
          class: ce(["dot", { active: l.value === T - 1 }]),
          onClick: (C) => l.value = T - 1
        }, null, 10, Pd))), 128))
      ])) : he("", !0),
      g("input", {
        type: "file",
        ref_key: "fileInput",
        ref: p,
        style: { display: "none" },
        accept: "image/*",
        onChange: k
      }, null, 544)
    ], 32));
  }
}), Od = /* @__PURE__ */ He(wd, [["__scopeId", "data-v-14bb3169"]]), Fd = { class: "chips-wrapper" }, Rd = ["onClick"], Dd = {
  key: 0,
  class: "suggestions-list"
}, jd = ["onMousedown"], Hd = /* @__PURE__ */ je({
  __name: "HikazeTagInput",
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, s = t, o = Vn(), i = o.getTags(), l = V(""), a = V(!1), c = V(!1);
    Nt(() => {
      o.loadTags();
    });
    const p = K(() => {
      const k = l.value.toLowerCase().trim();
      return k ? i.value.filter((L) => L.name.toLowerCase().includes(k) && !n.modelValue.find((b) => b.id === L.id)).slice(0, 10) : [];
    }), d = (k) => {
      const L = [...n.modelValue];
      L.splice(k, 1), s("update:modelValue", L);
    }, f = (k) => {
      n.modelValue.find((L) => L.id === k.id) || s("update:modelValue", [...n.modelValue, k]), l.value = "", c.value = !1;
    }, y = (k) => {
      if (k.key === "Enter" || k.key === ",") {
        k.preventDefault();
        const L = l.value.trim().replace(/,$/, "");
        if (!L) return;
        const b = i.value.find((v) => v.name.toLowerCase() === L.toLowerCase());
        b ? f(b) : (n.modelValue.find((v) => v.name.toLowerCase() === L.toLowerCase()) || s("update:modelValue", [...n.modelValue, { id: -1, name: L }]), l.value = ""), c.value = !1;
      } else k.key === "Backspace" && !l.value && n.modelValue.length > 0 && d(n.modelValue.length - 1);
    }, _ = () => {
      c.value = !0;
    }, A = () => {
      setTimeout(() => {
        a.value = !1, c.value = !1;
      }, 200);
    };
    return (k, L) => (M(), P("div", {
      class: ce(["tag-input-container", { focused: a.value }])
    }, [
      g("div", Fd, [
        (M(!0), P(ie, null, ye(e.modelValue, (b, v) => (M(), P("div", {
          key: b.id === -1 ? b.name : b.id,
          class: ce(["tag-chip", { new: b.id === -1 }])
        }, [
          it(ee(b.name) + " ", 1),
          g("button", {
            class: "remove-btn",
            onClick: (T) => d(v)
          }, "×", 8, Rd)
        ], 2))), 128)),
        ze(g("input", {
          type: "text",
          "onUpdate:modelValue": L[0] || (L[0] = (b) => l.value = b),
          onKeydown: y,
          onInput: _,
          onFocus: L[1] || (L[1] = (b) => a.value = !0),
          onBlur: A,
          placeholder: "Add tags...",
          class: "input-field"
        }, null, 544), [
          [ot, l.value]
        ])
      ]),
      ve(Ys, { name: "slide-fade" }, {
        default: rt(() => [
          c.value && p.value.length > 0 ? (M(), P("div", Dd, [
            (M(!0), P(ie, null, ye(p.value, (b) => (M(), P("div", {
              key: b.id,
              class: "suggestion-item",
              onMousedown: (v) => f(b)
            }, ee(b.name), 41, jd))), 128))
          ])) : he("", !0)
        ]),
        _: 1
      })
    ], 2));
  }
}), Vd = /* @__PURE__ */ He(Hd, [["__scopeId", "data-v-16ad3138"]]), Bd = {
  key: 0,
  class: "model-details"
}, zd = { class: "gallery-wrapper" }, Ud = { class: "details-body" }, Wd = { class: "field-group" }, Kd = { class: "field-group" }, Gd = ["title"], qd = { class: "field-group" }, Jd = ["value"], Yd = { class: "field-group" }, Zd = { class: "readonly-box" }, Xd = { class: "field-group" }, Qd = { class: "field-group" }, ef = { class: "field-group" }, tf = { class: "link-group" }, nf = { class: "field-group" }, sf = { class: "field-group" }, of = { class: "actions" }, lf = ["disabled"], rf = ["disabled"], af = {
  key: 1,
  class: "empty-details"
}, cf = {
  key: 0,
  class: "loading-state"
}, uf = { key: 1 }, df = /* @__PURE__ */ je({
  __name: "ModelDetails",
  props: {
    model: {}
  },
  emits: ["update-list"],
  setup(e, { emit: t }) {
    const n = e, s = t, o = Kt(), i = Vn(), l = V(null), a = V(!1), c = V(!1), p = V(null), d = V(""), f = V(""), y = V(""), _ = V(""), A = async (v, T = !1) => {
      a.value = !0;
      try {
        await o.loadDetails(v, T);
        const C = o.getDetails(v).value;
        if (l.value = C ? JSON.parse(JSON.stringify(C)) : null, l.value) {
          d.value = l.value.meta_json.description, f.value = l.value.meta_json.community_links, y.value = l.value.meta_json.prompts.positive, _.value = l.value.meta_json.prompts.negative, await fo();
          const H = p.value;
          if (H) {
            const B = H.getBoundingClientRect().width;
            B > 0 && (H.style.height = `${Math.round(B * 1.5)}px`);
          }
        }
      } catch (C) {
        console.error("Failed to load model details", C);
      } finally {
        a.value = !1;
      }
    };
    Ke(() => n.model, (v) => {
      v != null && v.sha256 ? A(v.sha256) : l.value = null;
    }, { immediate: !0 });
    const k = async () => {
      if (!(!l.value || !l.value.sha256)) {
        c.value = !0;
        try {
          const v = l.value.sha256, T = l.value.tags, C = T.filter((J) => J.id === -1).map((J) => J.name);
          let B = [...T.filter((J) => J.id !== -1)];
          if (C.length > 0) {
            const J = await bu(C);
            B = [...B, ...J], i.mergeTags(J);
          }
          l.value.tags = B, l.value.meta_json.description = d.value, l.value.meta_json.community_links = f.value, l.value.meta_json.prompts = {
            positive: y.value,
            negative: _.value
          };
          const Z = await xu(v, l.value);
          o.setDetails(Z), l.value = JSON.parse(JSON.stringify(Z)), s("update-list"), alert("Saved successfully!");
        } catch (v) {
          alert(`Save failed: ${v}`);
        } finally {
          c.value = !1;
        }
      }
    }, L = () => {
      var v;
      (v = n.model) != null && v.sha256 && A(n.model.sha256, !0);
    }, b = () => {
      f.value && window.open(f.value, "_blank");
    };
    return (v, T) => l.value ? (M(), P("div", Bd, [
      g("div", zd, [
        ve(Od, {
          sha256: l.value.sha256,
          onUpdate: T[0] || (T[0] = (C) => s("update-list"))
        }, null, 8, ["sha256"])
      ]),
      g("div", Ud, [
        g("div", Wd, [
          T[7] || (T[7] = g("label", null, "Display Name", -1)),
          ze(g("input", {
            type: "text",
            "onUpdate:modelValue": T[1] || (T[1] = (C) => l.value.name = C),
            placeholder: "Database alias..."
          }, null, 512), [
            [ot, l.value.name]
          ])
        ]),
        g("div", Kd, [
          T[8] || (T[8] = g("label", null, "Physical Path", -1)),
          g("div", {
            class: "readonly-box",
            title: l.value.path
          }, ee(l.value.path), 9, Gd)
        ]),
        g("div", qd, [
          T[9] || (T[9] = g("label", null, "SHA256 Hash", -1)),
          g("input", {
            type: "text",
            value: l.value.sha256,
            disabled: "",
            class: "hash-input"
          }, null, 8, Jd)
        ]),
        g("div", Yd, [
          T[10] || (T[10] = g("label", null, "Model Type", -1)),
          g("div", Zd, ee(l.value.type), 1)
        ]),
        g("div", Xd, [
          T[11] || (T[11] = g("label", null, "Tags", -1)),
          ve(Vd, {
            modelValue: l.value.tags,
            "onUpdate:modelValue": T[2] || (T[2] = (C) => l.value.tags = C)
          }, null, 8, ["modelValue"])
        ]),
        g("div", Qd, [
          T[12] || (T[12] = g("label", null, "Description", -1)),
          ze(g("textarea", {
            "onUpdate:modelValue": T[3] || (T[3] = (C) => d.value = C),
            placeholder: "Model description...",
            rows: "3",
            class: "resize-vertical",
            ref_key: "descriptionRef",
            ref: p
          }, null, 512), [
            [ot, d.value]
          ])
        ]),
        g("div", ef, [
          T[13] || (T[13] = g("label", null, "Community Links", -1)),
          g("div", tf, [
            ze(g("input", {
              type: "text",
              "onUpdate:modelValue": T[4] || (T[4] = (C) => f.value = C),
              placeholder: "Link to Civitai, HuggingFace, etc...",
              class: "link-input"
            }, null, 512), [
              [ot, f.value]
            ]),
            g("button", {
              class: "btn-visit",
              onClick: b,
              title: "Visit Link"
            }, "🔗")
          ])
        ]),
        g("div", nf, [
          T[14] || (T[14] = g("label", null, "Positive Prompt", -1)),
          ze(g("textarea", {
            "onUpdate:modelValue": T[5] || (T[5] = (C) => y.value = C),
            placeholder: "Recommended positive prompt...",
            rows: "3",
            class: "resize-vertical"
          }, null, 512), [
            [ot, y.value]
          ])
        ]),
        g("div", sf, [
          T[15] || (T[15] = g("label", null, "Negative Prompt", -1)),
          ze(g("textarea", {
            "onUpdate:modelValue": T[6] || (T[6] = (C) => _.value = C),
            placeholder: "Recommended negative prompt...",
            rows: "3",
            class: "resize-vertical"
          }, null, 512), [
            [ot, _.value]
          ])
        ]),
        g("div", of, [
          g("button", {
            class: "btn primary",
            onClick: k,
            disabled: c.value
          }, ee(c.value ? "Saving..." : "Save Changes"), 9, lf),
          g("button", {
            class: "btn secondary",
            onClick: L,
            disabled: c.value
          }, "Revert", 8, rf)
        ])
      ])
    ])) : (M(), P("div", af, [
      a.value ? (M(), P("div", cf, "Loading details...")) : (M(), P("div", uf, [...T[16] || (T[16] = [
        g("div", { class: "placeholder-icon" }, "📭", -1),
        g("p", null, "Select a model from the library to view and edit details.", -1)
      ])]))
    ]));
  }
}), ff = /* @__PURE__ */ He(df, [["__scopeId", "data-v-0c0efeb5"]]), pf = { class: "selected-lora-bar" }, hf = {
  key: 0,
  class: "selected-lora-empty"
}, gf = ["onClick"], mf = ["onChange"], vf = { class: "selected-lora-meta" }, yf = ["title"], _f = {
  key: 0,
  class: "selected-lora-tags"
}, bf = /* @__PURE__ */ je({
  __name: "SelectedLoraBar",
  props: {
    items: {}
  },
  emits: ["toggle", "select"],
  setup(e, { emit: t }) {
    const n = e, s = t, o = bo(), i = (c, p) => {
      const d = p.target;
      s("toggle", c, d.checked);
    }, l = (c) => {
      s("select", c);
    }, a = (c) => c ? {
      backgroundImage: `url(${o.getImageUrl(c, 0, "medium")})`
    } : {};
    return (c, p) => (M(), P("div", pf, [
      g("div", {
        class: ce(["selected-lora-row", { empty: n.items.length === 0 }])
      }, [
        n.items.length === 0 ? (M(), P("div", hf, " No LoRAs selected. ")) : (M(!0), P(ie, { key: 1 }, ye(n.items, (d) => (M(), P("div", {
          key: d.sha256,
          class: "selected-lora-card",
          onClick: (f) => l(d)
        }, [
          g("label", {
            class: "selection-checkbox",
            onClick: p[1] || (p[1] = _e(() => {
            }, ["stop"]))
          }, [
            g("input", {
              type: "checkbox",
              checked: "",
              onClick: p[0] || (p[0] = _e(() => {
              }, ["stop"])),
              onChange: (f) => i(d.sha256, f)
            }, null, 40, mf)
          ]),
          g("div", {
            class: "selected-lora-image",
            style: Ue(a(d.sha256))
          }, null, 4),
          g("div", vf, [
            g("div", {
              class: "selected-lora-name",
              title: d.name || d.path
            }, ee(d.name || d.path), 9, yf),
            d.tags.length > 0 ? (M(), P("div", _f, [
              (M(!0), P(ie, null, ye(d.tags, (f) => (M(), P("span", {
                key: f.id,
                class: "tag"
              }, ee(f.name), 1))), 128))
            ])) : he("", !0)
          ])
        ], 8, gf))), 128))
      ], 2)
    ]));
  }
}), Cf = /* @__PURE__ */ He(bf, [["__scopeId", "data-v-a1906adb"]]), Sf = { class: "pending-library" }, xf = { class: "library-toolbar" }, Tf = { class: "search-box" }, kf = { class: "controls-right" }, $f = {
  key: 0,
  class: "column-control"
}, Ef = { class: "view-switch" }, Mf = ["disabled"], Af = { class: "tag-filter" }, If = {
  key: 0,
  class: "tag-dropdown"
}, Lf = {
  key: 0,
  class: "placeholder-msg"
}, Nf = {
  key: 1,
  class: "tag-list"
}, Pf = ["onClick"], wf = {
  key: 0,
  class: "library-loading"
}, Of = {
  key: 1,
  class: "library-error"
}, Ff = ["onClick"], Rf = ["checked", "onChange"], Df = { class: "card-meta" }, jf = { class: "card-title" }, Hf = { class: "card-tags" }, Vf = {
  key: 3,
  class: "list-container"
}, Bf = ["onClick"], zf = ["checked", "onChange"], Uf = { class: "list-name" }, Wf = { class: "list-tags" }, Kf = /* @__PURE__ */ je({
  __name: "PendingModelLibrary",
  props: {
    activeTab: {},
    selectedIds: {},
    excludeSelected: { type: Boolean }
  },
  emits: ["select-model", "toggle-select"],
  setup(e, { emit: t }) {
    const n = e, s = t, o = Kt("pending"), i = Vn(), l = V("card"), a = V(4), c = V(!1), p = V(""), d = V(/* @__PURE__ */ new Map()), f = K(() => new Set(n.selectedIds ?? [])), y = o.getModels("pending"), _ = o.isLoading("pending"), A = o.getError("pending"), k = (E) => n.activeTab ? n.activeTab === "Others" ? !E.type : E.type === n.activeTab : !0, L = K(() => {
      let E = y.value;
      if (E = E.filter(k), p.value.trim()) {
        const F = p.value.toLowerCase();
        E = E.filter(
          (D) => D.name.toLowerCase().includes(F) || D.type.toLowerCase().includes(F)
        );
      }
      if (d.value.size > 0) {
        const F = Array.from(d.value.entries()).filter(([X, Q]) => Q === "include").map(([X]) => X), D = Array.from(d.value.entries()).filter(([X, Q]) => Q === "exclude").map(([X]) => X);
        E = E.filter((X) => {
          const Q = new Set(X.tags.map((xe) => xe.id)), te = F.every((xe) => Q.has(xe)), ne = !D.some((xe) => Q.has(xe));
          return te && ne;
        });
      }
      return n.excludeSelected && f.value.size > 0 && (E = E.filter((F) => !f.value.has(F.id))), E;
    }), b = i.getTags(), v = K(() => {
      const E = /* @__PURE__ */ new Map();
      L.value.forEach((Q) => {
        Q.tags.forEach((te) => {
          E.set(te.id, (E.get(te.id) ?? 0) + 1);
        });
      });
      const F = new Map(b.value.map((Q) => [Q.id, Q])), D = [];
      d.value.forEach((Q, te) => {
        const ne = F.get(te);
        ne && D.push(ne);
      });
      const X = b.value.filter((Q) => !d.value.has(Q.id) && (E.get(Q.id) ?? 0) > 0).sort((Q, te) => Q.name.localeCompare(te.name));
      return [...D, ...X];
    }), T = (E) => {
      if (!E) return "";
      const D = E.replace(/\\/g, "/").split("/");
      return D[D.length - 1] || "";
    }, C = (E) => {
      const F = T(E);
      if (!F) return "";
      const D = Cs();
      return `${D ? `${D}` : ""}/api/images/pending/${encodeURIComponent(F)}`;
    }, H = () => {
      o.invalidate("pending"), o.loadModels("pending", !0);
    }, B = (E, F) => {
      const D = F.target;
      s("toggle-select", E, D.checked);
    }, Z = (E) => {
      s("select-model", E), f.value.has(E.id) || s("toggle-select", E, !0);
    };
    function J(E) {
      const F = d.value.get(E);
      F === "include" ? d.value.set(E, "exclude") : F === "exclude" ? d.value.delete(E) : d.value.set(E, "include");
    }
    function j() {
      d.value.clear();
    }
    const W = (E) => {
      l.value = E;
    }, oe = K(() => l.value !== "card" ? {} : {
      gridTemplateColumns: `repeat(${a.value}, 1fr)`
    });
    return Nt(async () => {
      o.loadModels("pending");
      try {
        await i.loadTags();
        const E = b.value.find((F) => F.name.toLowerCase() === "nsfw");
        E && d.value.set(E.id, "exclude");
      } catch (E) {
        console.error("Failed to load tags for auto-exclude:", E);
      }
    }), (E, F) => (M(), P("div", Sf, [
      g("div", xf, [
        g("div", Tf, [
          ze(g("input", {
            type: "text",
            "onUpdate:modelValue": F[0] || (F[0] = (D) => p.value = D),
            placeholder: "Search pending models..."
          }, null, 512), [
            [ot, p.value]
          ])
        ]),
        g("div", kf, [
          l.value === "card" ? (M(), P("div", $f, [
            F[9] || (F[9] = g("label", { for: "pending-col-count" }, "Cols:", -1)),
            ze(g("input", {
              id: "pending-col-count",
              type: "number",
              "onUpdate:modelValue": F[1] || (F[1] = (D) => a.value = D),
              min: "2",
              max: "10",
              step: "1"
            }, null, 512), [
              [
                ot,
                a.value,
                void 0,
                { number: !0 }
              ]
            ])
          ])) : he("", !0),
          g("div", Ef, [
            g("button", {
              class: ce({ active: l.value === "card" }),
              onClick: F[2] || (F[2] = (D) => W("card"))
            }, "Card", 2),
            g("button", {
              class: ce({ active: l.value === "list" }),
              onClick: F[3] || (F[3] = (D) => W("list"))
            }, "List", 2)
          ]),
          g("button", {
            class: "btn-refresh",
            onClick: H,
            disabled: Ge(_),
            title: "Refresh pending models"
          }, " Refresh ", 8, Mf),
          g("div", Af, [
            g("button", {
              class: ce(["btn-filter", { active: d.value.size > 0 }]),
              onClick: F[4] || (F[4] = (D) => c.value = !c.value)
            }, " Tags Filter " + ee(d.value.size > 0 ? `(${d.value.size})` : ""), 3),
            c.value ? (M(), P("div", If, [
              v.value.length === 0 ? (M(), P("div", Lf, "No tags available")) : (M(), P("div", Nf, [
                (M(!0), P(ie, null, ye(v.value, (D) => (M(), P("div", {
                  key: D.id,
                  class: ce(["tag-item", d.value.get(D.id)]),
                  onClick: (X) => J(D.id)
                }, ee(D.name), 11, Pf))), 128)),
                g("div", { class: "tag-dropdown-actions" }, [
                  g("button", {
                    onClick: j,
                    class: "btn-clear"
                  }, "Clear All")
                ])
              ]))
            ])) : he("", !0)
          ])
        ])
      ]),
      g("div", {
        class: ce(["library-content", l.value]),
        style: Ue(oe.value)
      }, [
        Ge(_) ? (M(), P("div", wf, [...F[10] || (F[10] = [
          g("span", { class: "spinner" }, null, -1),
          it(" Loading pending models... ", -1)
        ])])) : Ge(A) ? (M(), P("div", Of, ee(Ge(A)), 1)) : l.value === "card" ? (M(!0), P(ie, { key: 2 }, ye(L.value, (D) => (M(), P("div", {
          key: D.id,
          class: ce(["card-item", { selected: f.value.has(D.id) }]),
          onClick: (X) => Z(D)
        }, [
          g("label", {
            class: "selection-checkbox",
            onClick: F[6] || (F[6] = _e(() => {
            }, ["stop"]))
          }, [
            g("input", {
              type: "checkbox",
              checked: f.value.has(D.id),
              onClick: F[5] || (F[5] = _e(() => {
              }, ["stop"])),
              onChange: (X) => B(D, X)
            }, null, 40, Rf)
          ]),
          g("div", {
            class: ce(["card-image", { empty: !D.image }]),
            style: Ue(D.image ? { backgroundImage: `url(${C(D.image)})` } : {})
          }, null, 6),
          g("div", Df, [
            g("div", jf, ee(D.name), 1),
            g("div", Hf, [
              (M(!0), P(ie, null, ye(D.tags, (X) => (M(), P("span", {
                key: X.id,
                class: "tag"
              }, ee(X.name), 1))), 128))
            ])
          ])
        ], 10, Ff))), 128)) : (M(), P("div", Vf, [
          (M(!0), P(ie, null, ye(L.value, (D) => (M(), P("div", {
            key: D.id,
            class: ce(["list-item", { selected: f.value.has(D.id) }]),
            onClick: (X) => Z(D)
          }, [
            g("label", {
              class: "list-checkbox",
              onClick: F[8] || (F[8] = _e(() => {
              }, ["stop"]))
            }, [
              g("input", {
                type: "checkbox",
                checked: f.value.has(D.id),
                onClick: F[7] || (F[7] = _e(() => {
                }, ["stop"])),
                onChange: (X) => B(D, X)
              }, null, 40, zf)
            ]),
            g("div", Uf, ee(D.name), 1),
            g("div", Wf, [
              (M(!0), P(ie, null, ye(D.tags, (X) => (M(), P("span", {
                key: X.id,
                class: "tag"
              }, ee(X.name), 1))), 128))
            ])
          ], 10, Bf))), 128))
        ]))
      ], 6)
    ]));
  }
}), Gf = /* @__PURE__ */ He(Kf, [["__scopeId", "data-v-8fe2238e"]]), qf = {
  key: 0,
  class: "model-details"
}, Jf = { class: "gallery-wrapper" }, Yf = { class: "pending-image-frame" }, Zf = ["src"], Xf = {
  key: 1,
  class: "pending-image-empty"
}, Qf = { class: "details-body" }, ep = { class: "field-group" }, tp = ["value"], np = { class: "field-group" }, sp = ["title"], op = { class: "field-group" }, ip = ["value"], lp = { class: "field-group" }, rp = { class: "readonly-box" }, ap = { class: "field-group" }, cp = { class: "tag-list" }, up = { class: "field-group" }, dp = ["value"], fp = { class: "field-group" }, pp = ["value"], hp = { class: "field-group" }, gp = ["value"], mp = { class: "field-group" }, vp = ["value"], yp = {
  key: 1,
  class: "empty-details"
}, _p = {
  key: 0,
  class: "loading-state"
}, bp = {
  key: 1,
  class: "loading-state"
}, Cp = { key: 2 }, Sp = /* @__PURE__ */ je({
  __name: "PendingModelDetails",
  props: {
    modelId: {}
  },
  setup(e) {
    const t = e, n = Kt("pending"), s = V(null), o = V(!1), i = V(null), l = V(!1), a = K(() => {
      var f, y;
      const d = (y = (f = s.value) == null ? void 0 : f.meta_json) == null ? void 0 : y.images;
      return Array.isArray(d) && d.length > 0;
    }), c = K(() => {
      if (!t.modelId || !a.value) return "";
      const d = Cs();
      return `${d ? `${d}` : ""}/api/images/pending/${t.modelId}`;
    }), p = async (d, f = !1) => {
      o.value = !0, i.value = null;
      try {
        await n.loadDetails(String(d), f);
        const y = n.getDetails(String(d)).value;
        s.value = y ? JSON.parse(JSON.stringify(y)) : null;
      } catch (y) {
        i.value = (y == null ? void 0 : y.message) || "Failed to load pending model details", s.value = null;
      } finally {
        o.value = !1;
      }
    };
    return Ke(() => t.modelId, (d) => {
      typeof d == "number" && !Number.isNaN(d) ? p(d) : s.value = null, l.value = !1;
    }, { immediate: !0 }), Ke(a, () => {
      l.value = !1;
    }), (d, f) => s.value ? (M(), P("div", qf, [
      g("div", Jf, [
        g("div", Yf, [
          c.value && !l.value ? (M(), P("img", {
            key: 0,
            src: c.value,
            alt: "Pending model preview",
            onError: f[0] || (f[0] = (y) => l.value = !0)
          }, null, 40, Zf)) : (M(), P("div", Xf, "No Image"))
        ])
      ]),
      g("div", Qf, [
        g("div", ep, [
          f[1] || (f[1] = g("label", null, "Display Name", -1)),
          g("input", {
            type: "text",
            value: s.value.name,
            disabled: ""
          }, null, 8, tp)
        ]),
        g("div", np, [
          f[2] || (f[2] = g("label", null, "Physical Path", -1)),
          g("div", {
            class: "readonly-box",
            title: s.value.path
          }, ee(s.value.path), 9, sp)
        ]),
        g("div", op, [
          f[3] || (f[3] = g("label", null, "SHA256 Hash", -1)),
          g("input", {
            type: "text",
            value: s.value.sha256,
            disabled: "",
            class: "hash-input"
          }, null, 8, ip)
        ]),
        g("div", lp, [
          f[4] || (f[4] = g("label", null, "Model Type", -1)),
          g("div", rp, ee(s.value.type), 1)
        ]),
        g("div", ap, [
          f[5] || (f[5] = g("label", null, "Tags", -1)),
          g("div", cp, [
            (M(!0), P(ie, null, ye(s.value.tags, (y) => (M(), P("span", {
              key: y.id,
              class: "tag"
            }, ee(y.name), 1))), 128))
          ])
        ]),
        g("div", up, [
          f[6] || (f[6] = g("label", null, "Description", -1)),
          g("textarea", {
            value: s.value.meta_json.description,
            disabled: "",
            rows: "3"
          }, null, 8, dp)
        ]),
        g("div", fp, [
          f[7] || (f[7] = g("label", null, "Community Links", -1)),
          g("textarea", {
            value: s.value.meta_json.community_links,
            disabled: "",
            rows: "2"
          }, null, 8, pp)
        ]),
        g("div", hp, [
          f[8] || (f[8] = g("label", null, "Positive Prompt", -1)),
          g("textarea", {
            value: s.value.meta_json.prompts.positive,
            disabled: "",
            rows: "3"
          }, null, 8, gp)
        ]),
        g("div", mp, [
          f[9] || (f[9] = g("label", null, "Negative Prompt", -1)),
          g("textarea", {
            value: s.value.meta_json.prompts.negative,
            disabled: "",
            rows: "3"
          }, null, 8, vp)
        ])
      ])
    ])) : (M(), P("div", yp, [
      o.value ? (M(), P("div", _p, "Loading details...")) : i.value ? (M(), P("div", bp, ee(i.value), 1)) : (M(), P("div", Cp, [...f[10] || (f[10] = [
        g("div", { class: "placeholder-icon" }, "📭", -1),
        g("p", null, "Select a pending model to view details.", -1)
      ])]))
    ]));
  }
}), xp = /* @__PURE__ */ He(Sp, [["__scopeId", "data-v-564fd283"]]), Tp = { class: "hikaze-modal-toolbar" }, kp = { class: "modal-title" }, $p = { class: "modal-actions" }, Ep = {
  key: 0,
  class: "selection-count"
}, Mp = {
  key: 0,
  class: "badge"
}, Ap = ["disabled"], Ip = ["disabled"], Lp = ["aria-label", "title"], Np = ["disabled"], Pp = { class: "hikaze-modal-body" }, wp = { class: "lora-library-pane" }, Op = { class: "lora-library-body" }, Fp = /* @__PURE__ */ je({
  __name: "HikazeManagerModal",
  setup(e) {
    const t = V(void 0), n = V([]), s = V(!1), o = V([]), i = V({}), l = V({}), a = V(2), c = V("active"), p = V([]), d = V(void 0), f = V(!1), y = Kt(), _ = Kt("pending"), A = _.getModels("pending"), k = K(() => A.value.length), L = K(() => k.value > 0), b = K(() => c.value === "pending"), v = K(() => yn.options), T = K(() => {
      var m;
      return ((m = v.value) == null ? void 0 : m.mode) === "multi";
    }), C = K(() => {
      var r;
      const m = String(((r = v.value) == null ? void 0 : r.initialTab) || "").toLowerCase();
      return T.value && (m === "loras" || m === "lora");
    }), H = K(() => {
      var m;
      return ((m = v.value) == null ? void 0 : m.title) || (T.value ? "Select LoRAs" : "Select Checkpoint");
    }), B = K(() => C.value ? o.value.length : n.value.length), Z = K(() => b.value ? !1 : T.value ? B.value > 0 : !!t.value), J = K(() => s.value ? "Exit fullscreen" : "Enter fullscreen"), j = K(() => o.value.map((m) => i.value[m]).filter((m) => !!m)), W = (m) => {
      yn.isOpen && m.key === "Escape" && Xt(null);
    };
    Nt(() => window.addEventListener("keydown", W)), fn(() => window.removeEventListener("keydown", W));
    const oe = () => {
      o.value = [], i.value = {}, l.value = {}, a.value = 2;
    }, E = () => {
      var r;
      if (oe(), !C.value) return;
      const m = ((r = v.value) == null ? void 0 : r.payloadJson) ?? "";
      try {
        const u = Hl(m);
        a.value = Number(u.version) || 2;
        const h = {}, S = {}, x = [];
        u.loras.forEach(($) => {
          const N = String($.sha256 || "").trim();
          !N || S[N] || (S[N] = $, x.push(N), h[N] = {
            sha256: N,
            name: $.name || $.full_path,
            path: $.full_path,
            tags: []
          });
        }), o.value = x, i.value = h, l.value = S;
      } catch (u) {
        console.warn("Failed to parse LoRA payload JSON", u);
        const h = jl();
        a.value = Number(h.version) || 2;
      }
    };
    Ke(
      () => yn.isOpen,
      (m) => {
        m && (t.value = void 0, n.value = [], E()), s.value = !1, c.value = "active", p.value = [], d.value = void 0, _.loadModels("pending");
      }
    );
    const F = () => {
      Xt(null);
    }, D = (m, r) => {
      o.value.includes(m) || (o.value = [...o.value, m]), i.value = {
        ...i.value,
        [m]: r
      };
    }, X = (m) => {
      if (!o.value.includes(m)) return;
      o.value = o.value.filter((u) => u !== m);
      const r = { ...i.value };
      delete r[m], i.value = r;
    }, Q = (m, r) => {
      !C.value || !m.sha256 || (r ? D(m.sha256, {
        sha256: m.sha256,
        name: m.name || m.path,
        path: m.path,
        tags: m.tags
      }) : X(m.sha256));
    }, te = (m, r) => {
      C.value && (r || X(m));
    }, ne = (m) => ({
      sha256: m.sha256,
      name: m.name,
      path: m.path,
      tags: m.tags,
      images_count: 0,
      type: "lora",
      size_bytes: 0,
      created_at: 0
    }), xe = (m) => {
      t.value = ne(m);
    }, at = () => {
      o.value = [], i.value = {};
    }, Ve = (m) => {
      if (b.value)
        return;
      if (t.value = m, C.value) {
        m.sha256 && !o.value.includes(m.sha256) && D(m.sha256, {
          sha256: m.sha256,
          name: m.name || m.path,
          path: m.path,
          tags: m.tags
        });
        return;
      }
      if (!T.value) {
        n.value = [m];
        return;
      }
      n.value.find((u) => u.sha256 === m.sha256) ? n.value = n.value.filter((u) => u.sha256 !== m.sha256) : n.value = [...n.value, m];
    }, Me = (m) => {
      d.value = m;
    }, xt = (m, r) => {
      if (r) {
        p.value.includes(m.id) || (p.value = [...p.value, m.id]);
        return;
      }
      p.value = p.value.filter((u) => u !== m.id);
    }, ct = async () => {
      c.value = "pending", p.value = [], d.value = void 0, await _.loadModels("pending", !0);
    }, qt = () => {
      c.value = "active", p.value = [], d.value = void 0;
    }, ut = () => {
      b.value ? qt() : ct();
    }, Tt = (m) => {
      const r = new Map(A.value.map((u) => [u.id, u.name]));
      return m.map((u, h) => {
        var I, U, R, z;
        const S = (I = u.pending) == null ? void 0 : I.id, x = S !== void 0 ? r.get(S) : void 0, $ = x ? `${x} (#${S})` : `#${S ?? "unknown"}`, N = (U = u.pending) != null && U.path ? ` | ${u.pending.path}` : "", w = ((R = u.existing) == null ? void 0 : R.id) ?? "unknown", O = (z = u.existing) != null && z.path ? ` | ${u.existing.path}` : "";
        return `${h + 1}. Pending: ${$}${N}
   Existing: ${w}${O}`;
      }).join(`
`);
    }, Pt = async () => {
      if (!(p.value.length === 0 || f.value)) {
        f.value = !0;
        try {
          const m = await gi(p.value, null);
          if (m.conflict.length > 0) {
            window.alert(`Conflicts detected:
${Tt(m.conflict)}`);
            const r = ["override", "merge", "ignore", "delete"], u = ($) => r.includes($);
            let h = null, S = [];
            const x = window.prompt(
              "Conflicts found. Choose strategy: override, merge, ignore, delete",
              "override"
            );
            if (x) {
              const $ = x.trim().toLowerCase();
              u($) ? (h = $, S = m.conflict.map((N) => {
                var w;
                return (w = N.pending) == null ? void 0 : w.id;
              }).filter((N) => typeof N == "number")) : window.alert("Invalid strategy. Please use override, merge, ignore, or delete.");
            }
            h && S.length > 0 && await gi(S, h);
          }
          p.value = [], d.value = void 0, await _.loadModels("pending", !0), y.invalidate();
        } catch (m) {
          window.alert((m == null ? void 0 : m.message) || "Failed to import pending models");
        } finally {
          f.value = !1;
        }
      }
    }, wt = () => {
      if (Z.value)
        if (T.value) {
          if (C.value) {
            const r = o.value.map((h) => {
              const S = l.value[h];
              if (S) return S;
              const x = i.value[h];
              return Kc({
                name: (x == null ? void 0 : x.name) ?? "",
                full_path: (x == null ? void 0 : x.path) ?? "",
                strength_model: 1,
                strength_clip: 1,
                sha256: h,
                enabled: !0
              });
            }), u = {
              version: Number(a.value) || 2,
              loras: r
            };
            Xt(u);
            return;
          }
          const m = {
            version: 2,
            loras: n.value.map((r) => ({
              name: r.name || r.path,
              full_path: r.path,
              strength_model: 1,
              strength_clip: 1,
              sha256: r.sha256,
              enabled: !0
            }))
          };
          Xt(m);
        } else t.value && Xt({ ckpt_path: t.value.path });
    }, dt = () => {
      s.value = !s.value;
    };
    return (m, r) => {
      var u;
      return M(), Re(Xi, { to: "body" }, [
        Ge(yn).isOpen ? (M(), P("div", {
          key: 0,
          class: ce(["hikaze-modal-backdrop", { "is-fullscreen": s.value }]),
          onClick: _e(F, ["self"])
        }, [
          g("div", {
            class: ce(["hikaze-modal-content", { "is-fullscreen": s.value, "is-pending": b.value }])
          }, [
            g("div", Tp, [
              g("div", kp, ee(H.value), 1),
              g("div", $p, [
                T.value && !b.value ? (M(), P("div", Ep, ee(B.value) + " selected ", 1)) : he("", !0),
                g("button", {
                  class: ce(["btn btn-secondary pending-toggle", { active: b.value }]),
                  type: "button",
                  onClick: ut
                }, [
                  r[0] || (r[0] = it(" Pending ", -1)),
                  L.value ? (M(), P("span", Mp, ee(k.value), 1)) : he("", !0)
                ], 2),
                b.value ? (M(), P("button", {
                  key: 1,
                  class: "btn btn-secondary pending-import",
                  type: "button",
                  disabled: p.value.length === 0 || f.value,
                  onClick: Pt
                }, " Import Selected ", 8, Ap)) : he("", !0),
                C.value && !b.value ? (M(), P("button", {
                  key: 2,
                  class: "btn btn-secondary",
                  type: "button",
                  disabled: B.value === 0,
                  onClick: at
                }, " Clear selection ", 8, Ip)) : he("", !0),
                g("button", {
                  class: "btn btn-secondary btn-icon",
                  type: "button",
                  "aria-label": J.value,
                  title: J.value,
                  onClick: dt
                }, " 🗗 ", 8, Lp),
                g("button", {
                  class: "btn btn-secondary",
                  onClick: F
                }, "Cancel"),
                g("button", {
                  class: "btn btn-primary",
                  disabled: !Z.value,
                  onClick: wt
                }, "Confirm", 8, Np)
              ])
            ]),
            g("div", Pp, [
              ve(Uu, {
                embedded: !0,
                initialTab: (u = Ge(yn).options) == null ? void 0 : u.initialTab,
                mode: c.value
              }, {
                library: rt(({ activeTab: h }) => [
                  g("div", wp, [
                    C.value && !b.value ? (M(), Re(Cf, {
                      key: 0,
                      items: j.value,
                      onToggle: te,
                      onSelect: xe
                    }, null, 8, ["items"])) : he("", !0),
                    g("div", Op, [
                      b.value ? (M(), Re(Gf, {
                        key: 0,
                        "active-tab": h,
                        "selected-ids": p.value,
                        onSelectModel: Me,
                        onToggleSelect: xt
                      }, null, 8, ["active-tab", "selected-ids"])) : (M(), Re(kd, {
                        key: 1,
                        "active-tab": h,
                        "selection-mode": C.value ? "lora" : void 0,
                        "selected-ids": o.value,
                        "exclude-selected": C.value,
                        onSelectModel: Ve,
                        onToggleSelect: Q
                      }, null, 8, ["active-tab", "selection-mode", "selected-ids", "exclude-selected"]))
                    ])
                  ])
                ]),
                details: rt(() => {
                  var h;
                  return [
                    b.value ? (M(), Re(xp, {
                      key: 0,
                      "model-id": (h = d.value) == null ? void 0 : h.id
                    }, null, 8, ["model-id"])) : (M(), Re(ff, {
                      key: 1,
                      model: t.value
                    }, null, 8, ["model"]))
                  ];
                }),
                _: 1
              }, 8, ["initialTab", "mode"])
            ])
          ], 2)
        ], 2)) : he("", !0)
      ]);
    };
  }
}), Rp = /* @__PURE__ */ He(Fp, [["__scopeId", "data-v-85247d81"]]), vi = "__hikazeCollapseHooked", yi = "__hikazeVueNodesSettingHooked";
class Dp {
  /**
   * Create the manager; call `install()` once ComfyUI app exists.
   */
  constructor(t) {
    be(this, "extName");
    be(this, "getComfyApp");
    be(this, "controllersByNode", /* @__PURE__ */ new WeakMap());
    be(this, "controllers", /* @__PURE__ */ new Set());
    be(this, "graphChangeListenerInstalled", !1);
    be(this, "collapseReinjectTimers", /* @__PURE__ */ new WeakMap());
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
    t.setAttribute("data-hikaze-global-host", "1"), t.style.display = "none", document.body.appendChild(t), wl(Rp).mount(t);
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
      for (const a of l)
        this.isHikazeNode(a) && this.reinjectNode(a, i);
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
    const n = this.getNodeType(t), s = (n ? Wt.resolve(n) : void 0) ?? Wt, o = new s(t);
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
    pi(n, yi) || (hi(n, yi), n.addEventListener(nu, (o) => {
      var a;
      const i = !!((a = o == null ? void 0 : o.detail) != null && a.value), l = i ? "vue" : "legacy";
      console.info(
        `[${this.extName}] ${Vl} -> ${String(i)}`
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
    if (!t || typeof t != "object" || pi(t, vi)) return;
    const n = t.collapse;
    typeof n == "function" && (hi(t, vi), t.collapse = (...s) => {
      var i, l;
      const o = !!((i = t == null ? void 0 : t.flags) != null && i.collapsed);
      try {
        return n.call(t, ...s);
      } finally {
        const a = !!((l = t == null ? void 0 : t.flags) != null && l.collapsed);
        o === a || (a ? this.disposeControllerIfExists(t) : this.scheduleReinjectSingleNode(t, "collapse-changed"));
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
    return !!n && n.startsWith(tu);
  }
}
const jp = new URL("./hikaze-model-manager-2.css", import.meta.url), Ss = document.createElement("link");
Ss.rel = "stylesheet";
Ss.type = "text/css";
Ss.href = jp.href;
document.head.appendChild(Ss);
const un = "Hikaze.ModelManager2";
console.info(`[${un}] loaded`);
const Hp = globalThis;
Hp.__HIKAZE_EMBEDDED__ = !0;
du();
gu();
function Gl() {
  var t, n;
  const e = ((n = (t = globalThis == null ? void 0 : globalThis.comfyAPI) == null ? void 0 : t.app) == null ? void 0 : n.app) ?? (globalThis == null ? void 0 : globalThis.app);
  return e || console.warn(`[${un}] Failed to get app instance.`), e;
}
const Gn = new Dp({
  extName: un,
  getComfyApp: Gl
});
function ql() {
  const e = Gl();
  if (!(e != null && e.registerExtension)) {
    setTimeout(ql, 250);
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
ql();
//# sourceMappingURL=hikaze-model-manager.js.map
