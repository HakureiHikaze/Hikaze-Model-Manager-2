var Ur = Object.defineProperty;
var Kr = (e, t, n) => t in e ? Ur(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Ce = (e, t, n) => Kr(e, typeof t != "symbol" ? t + "" : t, n);
/**
* @vue/shared v3.5.25
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
// @__NO_SIDE_EFFECTS__
function Ys(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const fe = {}, Zt = [], rt = () => {
}, gi = () => !1, ls = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), Zs = (e) => e.startsWith("onUpdate:"), Ee = Object.assign, Xs = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, Gr = Object.prototype.hasOwnProperty, ae = (e, t) => Gr.call(e, t), z = Array.isArray, Xt = (e) => as(e) === "[object Map]", mi = (e) => as(e) === "[object Set]", q = (e) => typeof e == "function", ye = (e) => typeof e == "string", bt = (e) => typeof e == "symbol", me = (e) => e !== null && typeof e == "object", vi = (e) => (me(e) || q(e)) && q(e.then) && q(e.catch), yi = Object.prototype.toString, as = (e) => yi.call(e), qr = (e) => as(e).slice(8, -1), _i = (e) => as(e) === "[object Object]", Qs = (e) => ye(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, yn = /* @__PURE__ */ Ys(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), cs = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return ((n) => t[n] || (t[n] = e(n)));
}, Jr = /-\w/g, Lt = cs(
  (e) => e.replace(Jr, (t) => t.slice(1).toUpperCase())
), Yr = /\B([A-Z])/g, Ut = cs(
  (e) => e.replace(Yr, "-$1").toLowerCase()
), bi = cs((e) => e.charAt(0).toUpperCase() + e.slice(1)), bs = cs(
  (e) => e ? `on${bi(e)}` : ""
), $t = (e, t) => !Object.is(e, t), Un = (e, ...t) => {
  for (let n = 0; n < e.length; n++)
    e[n](...t);
}, Ci = (e, t, n, s = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: s,
    value: n
  });
}, eo = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
}, Zr = (e) => {
  const t = ye(e) ? Number(e) : NaN;
  return isNaN(t) ? e : t;
};
let So;
const us = () => So || (So = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function gt(e) {
  if (z(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const s = e[n], o = ye(s) ? tl(s) : gt(s);
      if (o)
        for (const i in o)
          t[i] = o[i];
    }
    return t;
  } else if (ye(e) || me(e))
    return e;
}
const Xr = /;(?![^(]*\))/g, Qr = /:([^]+)/, el = /\/\*[^]*?\*\//g;
function tl(e) {
  const t = {};
  return e.replace(el, "").split(Xr).forEach((n) => {
    if (n) {
      const s = n.split(Qr);
      s.length > 1 && (t[s[0].trim()] = s[1].trim());
    }
  }), t;
}
function be(e) {
  let t = "";
  if (ye(e))
    t = e;
  else if (z(e))
    for (let n = 0; n < e.length; n++) {
      const s = be(e[n]);
      s && (t += s + " ");
    }
  else if (me(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
const nl = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", sl = /* @__PURE__ */ Ys(nl);
function Si(e) {
  return !!e || e === "";
}
const Ti = (e) => !!(e && e.__v_isRef === !0), ge = (e) => ye(e) ? e : e == null ? "" : z(e) || me(e) && (e.toString === yi || !q(e.toString)) ? Ti(e) ? ge(e.value) : JSON.stringify(e, xi, 2) : String(e), xi = (e, t) => Ti(t) ? xi(e, t.value) : Xt(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (n, [s, o], i) => (n[Cs(s, i) + " =>"] = o, n),
    {}
  )
} : mi(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((n) => Cs(n))
} : bt(t) ? Cs(t) : me(t) && !z(t) && !_i(t) ? String(t) : t, Cs = (e, t = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    bt(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e
  );
};
/**
* @vue/reactivity v3.5.25
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let De;
class ol {
  constructor(t = !1) {
    this.detached = t, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this.parent = De, !t && De && (this.index = (De.scopes || (De.scopes = [])).push(
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
      const n = De;
      try {
        return De = this, t();
      } finally {
        De = n;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = De, De = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    this._on > 0 && --this._on === 0 && (De = this.prevScope, this.prevScope = void 0);
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
function il() {
  return De;
}
let pe;
const Ss = /* @__PURE__ */ new WeakSet();
class Ei {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, De && De.active && De.effects.push(this);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, Ss.has(this) && (Ss.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || ki(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, To(this), Mi(this);
    const t = pe, n = qe;
    pe = this, qe = !0;
    try {
      return this.fn();
    } finally {
      $i(this), pe = t, qe = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        so(t);
      this.deps = this.depsTail = void 0, To(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? Ss.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    Ps(this) && this.run();
  }
  get dirty() {
    return Ps(this);
  }
}
let Ai = 0, _n, bn;
function ki(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = bn, bn = e;
    return;
  }
  e.next = _n, _n = e;
}
function to() {
  Ai++;
}
function no() {
  if (--Ai > 0)
    return;
  if (bn) {
    let t = bn;
    for (bn = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; _n; ) {
    let t = _n;
    for (_n = void 0; t; ) {
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
function Mi(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function $i(e) {
  let t, n = e.depsTail, s = n;
  for (; s; ) {
    const o = s.prevDep;
    s.version === -1 ? (s === n && (n = o), so(s), rl(s)) : t = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = o;
  }
  e.deps = t, e.depsTail = n;
}
function Ps(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (Li(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function Li(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === kn) || (e.globalVersion = kn, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Ps(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = pe, s = qe;
  pe = e, qe = !0;
  try {
    Mi(e);
    const o = e.fn(e._value);
    (t.version === 0 || $t(o, e._value)) && (e.flags |= 128, e._value = o, t.version++);
  } catch (o) {
    throw t.version++, o;
  } finally {
    pe = n, qe = s, $i(e), e.flags &= -3;
  }
}
function so(e, t = !1) {
  const { dep: n, prevSub: s, nextSub: o } = e;
  if (s && (s.nextSub = o, e.prevSub = void 0), o && (o.prevSub = s, e.nextSub = void 0), n.subs === e && (n.subs = s, !s && n.computed)) {
    n.computed.flags &= -5;
    for (let i = n.computed.deps; i; i = i.nextDep)
      so(i, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function rl(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
let qe = !0;
const Ii = [];
function mt() {
  Ii.push(qe), qe = !1;
}
function vt() {
  const e = Ii.pop();
  qe = e === void 0 ? !0 : e;
}
function To(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = pe;
    pe = void 0;
    try {
      t();
    } finally {
      pe = n;
    }
  }
}
let kn = 0;
class ll {
  constructor(t, n) {
    this.sub = t, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class oo {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
  }
  track(t) {
    if (!pe || !qe || pe === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== pe)
      n = this.activeLink = new ll(pe, this), pe.deps ? (n.prevDep = pe.depsTail, pe.depsTail.nextDep = n, pe.depsTail = n) : pe.deps = pe.depsTail = n, wi(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const s = n.nextDep;
      s.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = s), n.prevDep = pe.depsTail, n.nextDep = void 0, pe.depsTail.nextDep = n, pe.depsTail = n, pe.deps === n && (pe.deps = s);
    }
    return n;
  }
  trigger(t) {
    this.version++, kn++, this.notify(t);
  }
  notify(t) {
    to();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      no();
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
const Fs = /* @__PURE__ */ new WeakMap(), Vt = Symbol(
  ""
), Rs = Symbol(
  ""
), Mn = Symbol(
  ""
);
function ke(e, t, n) {
  if (qe && pe) {
    let s = Fs.get(e);
    s || Fs.set(e, s = /* @__PURE__ */ new Map());
    let o = s.get(n);
    o || (s.set(n, o = new oo()), o.map = s, o.key = n), o.track();
  }
}
function ht(e, t, n, s, o, i) {
  const r = Fs.get(e);
  if (!r) {
    kn++;
    return;
  }
  const l = (a) => {
    a && a.trigger();
  };
  if (to(), t === "clear")
    r.forEach(l);
  else {
    const a = z(e), u = a && Qs(n);
    if (a && n === "length") {
      const c = Number(s);
      r.forEach((d, g) => {
        (g === "length" || g === Mn || !bt(g) && g >= c) && l(d);
      });
    } else
      switch ((n !== void 0 || r.has(void 0)) && l(r.get(n)), u && l(r.get(Mn)), t) {
        case "add":
          a ? u && l(r.get("length")) : (l(r.get(Vt)), Xt(e) && l(r.get(Rs)));
          break;
        case "delete":
          a || (l(r.get(Vt)), Xt(e) && l(r.get(Rs)));
          break;
        case "set":
          Xt(e) && l(r.get(Vt));
          break;
      }
  }
  no();
}
function Gt(e) {
  const t = ie(e);
  return t === e ? t : (ke(t, "iterate", Mn), Ke(e) ? t : t.map(Je));
}
function fs(e) {
  return ke(e = ie(e), "iterate", Mn), e;
}
function xt(e, t) {
  return yt(e) ? Bt(e) ? cn(Je(t)) : cn(t) : Je(t);
}
const al = {
  __proto__: null,
  [Symbol.iterator]() {
    return Ts(this, Symbol.iterator, (e) => xt(this, e));
  },
  concat(...e) {
    return Gt(this).concat(
      ...e.map((t) => z(t) ? Gt(t) : t)
    );
  },
  entries() {
    return Ts(this, "entries", (e) => (e[1] = xt(this, e[1]), e));
  },
  every(e, t) {
    return ct(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return ct(
      this,
      "filter",
      e,
      t,
      (n) => n.map((s) => xt(this, s)),
      arguments
    );
  },
  find(e, t) {
    return ct(
      this,
      "find",
      e,
      t,
      (n) => xt(this, n),
      arguments
    );
  },
  findIndex(e, t) {
    return ct(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return ct(
      this,
      "findLast",
      e,
      t,
      (n) => xt(this, n),
      arguments
    );
  },
  findLastIndex(e, t) {
    return ct(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return ct(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return xs(this, "includes", e);
  },
  indexOf(...e) {
    return xs(this, "indexOf", e);
  },
  join(e) {
    return Gt(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return xs(this, "lastIndexOf", e);
  },
  map(e, t) {
    return ct(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return dn(this, "pop");
  },
  push(...e) {
    return dn(this, "push", e);
  },
  reduce(e, ...t) {
    return xo(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return xo(this, "reduceRight", e, t);
  },
  shift() {
    return dn(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return ct(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return dn(this, "splice", e);
  },
  toReversed() {
    return Gt(this).toReversed();
  },
  toSorted(e) {
    return Gt(this).toSorted(e);
  },
  toSpliced(...e) {
    return Gt(this).toSpliced(...e);
  },
  unshift(...e) {
    return dn(this, "unshift", e);
  },
  values() {
    return Ts(this, "values", (e) => xt(this, e));
  }
};
function Ts(e, t, n) {
  const s = fs(e), o = s[t]();
  return s !== e && !Ke(e) && (o._next = o.next, o.next = () => {
    const i = o._next();
    return i.done || (i.value = n(i.value)), i;
  }), o;
}
const cl = Array.prototype;
function ct(e, t, n, s, o, i) {
  const r = fs(e), l = r !== e && !Ke(e), a = r[t];
  if (a !== cl[t]) {
    const d = a.apply(e, i);
    return l ? Je(d) : d;
  }
  let u = n;
  r !== e && (l ? u = function(d, g) {
    return n.call(this, xt(e, d), g, e);
  } : n.length > 2 && (u = function(d, g) {
    return n.call(this, d, g, e);
  }));
  const c = a.call(r, u, s);
  return l && o ? o(c) : c;
}
function xo(e, t, n, s) {
  const o = fs(e);
  let i = n;
  return o !== e && (Ke(e) ? n.length > 3 && (i = function(r, l, a) {
    return n.call(this, r, l, a, e);
  }) : i = function(r, l, a) {
    return n.call(this, r, xt(e, l), a, e);
  }), o[t](i, ...s);
}
function xs(e, t, n) {
  const s = ie(e);
  ke(s, "iterate", Mn);
  const o = s[t](...n);
  return (o === -1 || o === !1) && lo(n[0]) ? (n[0] = ie(n[0]), s[t](...n)) : o;
}
function dn(e, t, n = []) {
  mt(), to();
  const s = ie(e)[t].apply(e, n);
  return no(), vt(), s;
}
const ul = /* @__PURE__ */ Ys("__proto__,__v_isRef,__isVue"), Ni = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(bt)
);
function fl(e) {
  bt(e) || (e = String(e));
  const t = ie(this);
  return ke(t, "has", e), t.hasOwnProperty(e);
}
class Oi {
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
      return s === (o ? i ? Cl : Di : i ? Ri : Fi).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(s) ? t : void 0;
    const r = z(t);
    if (!o) {
      let a;
      if (r && (a = al[n]))
        return a;
      if (n === "hasOwnProperty")
        return fl;
    }
    const l = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      Le(t) ? t : s
    );
    if ((bt(n) ? Ni.has(n) : ul(n)) || (o || ke(t, "get", n), i))
      return l;
    if (Le(l)) {
      const a = r && Qs(n) ? l : l.value;
      return o && me(a) ? Yn(a) : a;
    }
    return me(l) ? o ? Yn(l) : Te(l) : l;
  }
}
class Pi extends Oi {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, s, o) {
    let i = t[n];
    const r = z(t) && Qs(n);
    if (!this._isShallow) {
      const u = yt(i);
      if (!Ke(s) && !yt(s) && (i = ie(i), s = ie(s)), !r && Le(i) && !Le(s))
        return u || (i.value = s), !0;
    }
    const l = r ? Number(n) < t.length : ae(t, n), a = Reflect.set(
      t,
      n,
      s,
      Le(t) ? t : o
    );
    return t === ie(o) && (l ? $t(s, i) && ht(t, "set", n, s) : ht(t, "add", n, s)), a;
  }
  deleteProperty(t, n) {
    const s = ae(t, n);
    t[n];
    const o = Reflect.deleteProperty(t, n);
    return o && s && ht(t, "delete", n, void 0), o;
  }
  has(t, n) {
    const s = Reflect.has(t, n);
    return (!bt(n) || !Ni.has(n)) && ke(t, "has", n), s;
  }
  ownKeys(t) {
    return ke(
      t,
      "iterate",
      z(t) ? "length" : Vt
    ), Reflect.ownKeys(t);
  }
}
class dl extends Oi {
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
const hl = /* @__PURE__ */ new Pi(), pl = /* @__PURE__ */ new dl(), gl = /* @__PURE__ */ new Pi(!0);
const Ds = (e) => e, jn = (e) => Reflect.getPrototypeOf(e);
function ml(e, t, n) {
  return function(...s) {
    const o = this.__v_raw, i = ie(o), r = Xt(i), l = e === "entries" || e === Symbol.iterator && r, a = e === "keys" && r, u = o[e](...s), c = n ? Ds : t ? cn : Je;
    return !t && ke(
      i,
      "iterate",
      a ? Rs : Vt
    ), {
      // iterator protocol
      next() {
        const { value: d, done: g } = u.next();
        return g ? { value: d, done: g } : {
          value: l ? [c(d[0]), c(d[1])] : c(d),
          done: g
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function Hn(e) {
  return function(...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function vl(e, t) {
  const n = {
    get(o) {
      const i = this.__v_raw, r = ie(i), l = ie(o);
      e || ($t(o, l) && ke(r, "get", o), ke(r, "get", l));
      const { has: a } = jn(r), u = t ? Ds : e ? cn : Je;
      if (a.call(r, o))
        return u(i.get(o));
      if (a.call(r, l))
        return u(i.get(l));
      i !== r && i.get(o);
    },
    get size() {
      const o = this.__v_raw;
      return !e && ke(ie(o), "iterate", Vt), o.size;
    },
    has(o) {
      const i = this.__v_raw, r = ie(i), l = ie(o);
      return e || ($t(o, l) && ke(r, "has", o), ke(r, "has", l)), o === l ? i.has(o) : i.has(o) || i.has(l);
    },
    forEach(o, i) {
      const r = this, l = r.__v_raw, a = ie(l), u = t ? Ds : e ? cn : Je;
      return !e && ke(a, "iterate", Vt), l.forEach((c, d) => o.call(i, u(c), u(d), r));
    }
  };
  return Ee(
    n,
    e ? {
      add: Hn("add"),
      set: Hn("set"),
      delete: Hn("delete"),
      clear: Hn("clear")
    } : {
      add(o) {
        !t && !Ke(o) && !yt(o) && (o = ie(o));
        const i = ie(this);
        return jn(i).has.call(i, o) || (i.add(o), ht(i, "add", o, o)), this;
      },
      set(o, i) {
        !t && !Ke(i) && !yt(i) && (i = ie(i));
        const r = ie(this), { has: l, get: a } = jn(r);
        let u = l.call(r, o);
        u || (o = ie(o), u = l.call(r, o));
        const c = a.call(r, o);
        return r.set(o, i), u ? $t(i, c) && ht(r, "set", o, i) : ht(r, "add", o, i), this;
      },
      delete(o) {
        const i = ie(this), { has: r, get: l } = jn(i);
        let a = r.call(i, o);
        a || (o = ie(o), a = r.call(i, o)), l && l.call(i, o);
        const u = i.delete(o);
        return a && ht(i, "delete", o, void 0), u;
      },
      clear() {
        const o = ie(this), i = o.size !== 0, r = o.clear();
        return i && ht(
          o,
          "clear",
          void 0,
          void 0
        ), r;
      }
    }
  ), [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ].forEach((o) => {
    n[o] = ml(o, e, t);
  }), n;
}
function io(e, t) {
  const n = vl(e, t);
  return (s, o, i) => o === "__v_isReactive" ? !e : o === "__v_isReadonly" ? e : o === "__v_raw" ? s : Reflect.get(
    ae(n, o) && o in s ? n : s,
    o,
    i
  );
}
const yl = {
  get: /* @__PURE__ */ io(!1, !1)
}, _l = {
  get: /* @__PURE__ */ io(!1, !0)
}, bl = {
  get: /* @__PURE__ */ io(!0, !1)
};
const Fi = /* @__PURE__ */ new WeakMap(), Ri = /* @__PURE__ */ new WeakMap(), Di = /* @__PURE__ */ new WeakMap(), Cl = /* @__PURE__ */ new WeakMap();
function Sl(e) {
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
function Tl(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : Sl(qr(e));
}
function Te(e) {
  return yt(e) ? e : ro(
    e,
    !1,
    hl,
    yl,
    Fi
  );
}
function xl(e) {
  return ro(
    e,
    !1,
    gl,
    _l,
    Ri
  );
}
function Yn(e) {
  return ro(
    e,
    !0,
    pl,
    bl,
    Di
  );
}
function ro(e, t, n, s, o) {
  if (!me(e) || e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const i = Tl(e);
  if (i === 0)
    return e;
  const r = o.get(e);
  if (r)
    return r;
  const l = new Proxy(
    e,
    i === 2 ? s : n
  );
  return o.set(e, l), l;
}
function Bt(e) {
  return yt(e) ? Bt(e.__v_raw) : !!(e && e.__v_isReactive);
}
function yt(e) {
  return !!(e && e.__v_isReadonly);
}
function Ke(e) {
  return !!(e && e.__v_isShallow);
}
function lo(e) {
  return e ? !!e.__v_raw : !1;
}
function ie(e) {
  const t = e && e.__v_raw;
  return t ? ie(t) : e;
}
function El(e) {
  return !ae(e, "__v_skip") && Object.isExtensible(e) && Ci(e, "__v_skip", !0), e;
}
const Je = (e) => me(e) ? Te(e) : e, cn = (e) => me(e) ? Yn(e) : e;
function Le(e) {
  return e ? e.__v_isRef === !0 : !1;
}
function G(e) {
  return Al(e, !1);
}
function Al(e, t) {
  return Le(e) ? e : new kl(e, t);
}
class kl {
  constructor(t, n) {
    this.dep = new oo(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? t : ie(t), this._value = n ? t : Je(t), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(t) {
    const n = this._rawValue, s = this.__v_isShallow || Ke(t) || yt(t);
    t = s ? t : ie(t), $t(t, n) && (this._rawValue = t, this._value = s ? t : Je(t), this.dep.trigger());
  }
}
function Ht(e) {
  return Le(e) ? e.value : e;
}
const Ml = {
  get: (e, t, n) => t === "__v_raw" ? e : Ht(Reflect.get(e, t, n)),
  set: (e, t, n, s) => {
    const o = e[t];
    return Le(o) && !Le(n) ? (o.value = n, !0) : Reflect.set(e, t, n, s);
  }
};
function ji(e) {
  return Bt(e) ? e : new Proxy(e, Ml);
}
class $l {
  constructor(t, n, s) {
    this.fn = t, this.setter = n, this._value = void 0, this.dep = new oo(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = kn - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = s;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    pe !== this)
      return ki(this, !0), !0;
  }
  get value() {
    const t = this.dep.track();
    return Li(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
function Ll(e, t, n = !1) {
  let s, o;
  return q(e) ? s = e : (s = e.get, o = e.set), new $l(s, o, n);
}
const Vn = {}, Zn = /* @__PURE__ */ new WeakMap();
let Rt;
function Il(e, t = !1, n = Rt) {
  if (n) {
    let s = Zn.get(n);
    s || Zn.set(n, s = []), s.push(e);
  }
}
function wl(e, t, n = fe) {
  const { immediate: s, deep: o, once: i, scheduler: r, augmentJob: l, call: a } = n, u = (b) => o ? b : Ke(b) || o === !1 || o === 0 ? pt(b, 1) : pt(b);
  let c, d, g, m, C = !1, _ = !1;
  if (Le(e) ? (d = () => e.value, C = Ke(e)) : Bt(e) ? (d = () => u(e), C = !0) : z(e) ? (_ = !0, C = e.some((b) => Bt(b) || Ke(b)), d = () => e.map((b) => {
    if (Le(b))
      return b.value;
    if (Bt(b))
      return u(b);
    if (q(b))
      return a ? a(b, 2) : b();
  })) : q(e) ? t ? d = a ? () => a(e, 2) : e : d = () => {
    if (g) {
      mt();
      try {
        g();
      } finally {
        vt();
      }
    }
    const b = Rt;
    Rt = c;
    try {
      return a ? a(e, 3, [m]) : e(m);
    } finally {
      Rt = b;
    }
  } : d = rt, t && o) {
    const b = d, j = o === !0 ? 1 / 0 : o;
    d = () => pt(b(), j);
  }
  const k = il(), M = () => {
    c.stop(), k && k.active && Xs(k.effects, c);
  };
  if (i && t) {
    const b = t;
    t = (...j) => {
      b(...j), M();
    };
  }
  let p = _ ? new Array(e.length).fill(Vn) : Vn;
  const T = (b) => {
    if (!(!(c.flags & 1) || !c.dirty && !b))
      if (t) {
        const j = c.run();
        if (o || C || (_ ? j.some((K, se) => $t(K, p[se])) : $t(j, p))) {
          g && g();
          const K = Rt;
          Rt = c;
          try {
            const se = [
              j,
              // pass undefined as the old value when it's changed for the first time
              p === Vn ? void 0 : _ && p[0] === Vn ? [] : p,
              m
            ];
            p = j, a ? a(t, 3, se) : (
              // @ts-expect-error
              t(...se)
            );
          } finally {
            Rt = K;
          }
        }
      } else
        c.run();
  };
  return l && l(T), c = new Ei(d), c.scheduler = r ? () => r(T, !1) : T, m = (b) => Il(b, !1, c), g = c.onStop = () => {
    const b = Zn.get(c);
    if (b) {
      if (a)
        a(b, 4);
      else
        for (const j of b) j();
      Zn.delete(c);
    }
  }, t ? s ? T(!0) : p = c.run() : r ? r(T.bind(null, !0), !0) : c.run(), M.pause = c.pause.bind(c), M.resume = c.resume.bind(c), M.stop = M, M;
}
function pt(e, t = 1 / 0, n) {
  if (t <= 0 || !me(e) || e.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t))
    return e;
  if (n.set(e, t), t--, Le(e))
    pt(e.value, t, n);
  else if (z(e))
    for (let s = 0; s < e.length; s++)
      pt(e[s], t, n);
  else if (mi(e) || Xt(e))
    e.forEach((s) => {
      pt(s, t, n);
    });
  else if (_i(e)) {
    for (const s in e)
      pt(e[s], t, n);
    for (const s of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, s) && pt(e[s], t, n);
  }
  return e;
}
/**
* @vue/runtime-core v3.5.25
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function Fn(e, t, n, s) {
  try {
    return s ? e(...s) : e();
  } catch (o) {
    ds(o, t, n);
  }
}
function Ye(e, t, n, s) {
  if (q(e)) {
    const o = Fn(e, t, n, s);
    return o && vi(o) && o.catch((i) => {
      ds(i, t, n);
    }), o;
  }
  if (z(e)) {
    const o = [];
    for (let i = 0; i < e.length; i++)
      o.push(Ye(e[i], t, n, s));
    return o;
  }
}
function ds(e, t, n, s = !0) {
  const o = t ? t.vnode : null, { errorHandler: i, throwUnhandledErrorInProduction: r } = t && t.appContext.config || fe;
  if (t) {
    let l = t.parent;
    const a = t.proxy, u = `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; l; ) {
      const c = l.ec;
      if (c) {
        for (let d = 0; d < c.length; d++)
          if (c[d](e, a, u) === !1)
            return;
      }
      l = l.parent;
    }
    if (i) {
      mt(), Fn(i, null, 10, [
        e,
        a,
        u
      ]), vt();
      return;
    }
  }
  Nl(e, n, o, s, r);
}
function Nl(e, t, n, s = !0, o = !1) {
  if (o)
    throw e;
  console.error(e);
}
const Ne = [];
let st = -1;
const Qt = [];
let Et = null, qt = 0;
const Hi = /* @__PURE__ */ Promise.resolve();
let Xn = null;
function ao(e) {
  const t = Xn || Hi;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function Ol(e) {
  let t = st + 1, n = Ne.length;
  for (; t < n; ) {
    const s = t + n >>> 1, o = Ne[s], i = $n(o);
    i < e || i === e && o.flags & 2 ? t = s + 1 : n = s;
  }
  return t;
}
function co(e) {
  if (!(e.flags & 1)) {
    const t = $n(e), n = Ne[Ne.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(e.flags & 2) && t >= $n(n) ? Ne.push(e) : Ne.splice(Ol(t), 0, e), e.flags |= 1, Vi();
  }
}
function Vi() {
  Xn || (Xn = Hi.then(Wi));
}
function Pl(e) {
  z(e) ? Qt.push(...e) : Et && e.id === -1 ? Et.splice(qt + 1, 0, e) : e.flags & 1 || (Qt.push(e), e.flags |= 1), Vi();
}
function Eo(e, t, n = st + 1) {
  for (; n < Ne.length; n++) {
    const s = Ne[n];
    if (s && s.flags & 2) {
      if (e && s.id !== e.uid)
        continue;
      Ne.splice(n, 1), n--, s.flags & 4 && (s.flags &= -2), s(), s.flags & 4 || (s.flags &= -2);
    }
  }
}
function Bi(e) {
  if (Qt.length) {
    const t = [...new Set(Qt)].sort(
      (n, s) => $n(n) - $n(s)
    );
    if (Qt.length = 0, Et) {
      Et.push(...t);
      return;
    }
    for (Et = t, qt = 0; qt < Et.length; qt++) {
      const n = Et[qt];
      n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), n.flags &= -2;
    }
    Et = null, qt = 0;
  }
}
const $n = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function Wi(e) {
  try {
    for (st = 0; st < Ne.length; st++) {
      const t = Ne[st];
      t && !(t.flags & 8) && (t.flags & 4 && (t.flags &= -2), Fn(
        t,
        t.i,
        t.i ? 15 : 14
      ), t.flags & 4 || (t.flags &= -2));
    }
  } finally {
    for (; st < Ne.length; st++) {
      const t = Ne[st];
      t && (t.flags &= -2);
    }
    st = -1, Ne.length = 0, Bi(), Xn = null, (Ne.length || Qt.length) && Wi();
  }
}
let $e = null, zi = null;
function Qn(e) {
  const t = $e;
  return $e = e, zi = e && e.type.__scopeId || null, t;
}
function at(e, t = $e, n) {
  if (!t || e._n)
    return e;
  const s = (...o) => {
    s._d && ns(-1);
    const i = Qn(t);
    let r;
    try {
      r = e(...o);
    } finally {
      Qn(i), s._d && ns(1);
    }
    return r;
  };
  return s._n = !0, s._c = !0, s._d = !0, s;
}
function it(e, t) {
  if ($e === null)
    return e;
  const n = vs($e), s = e.dirs || (e.dirs = []);
  for (let o = 0; o < t.length; o++) {
    let [i, r, l, a = fe] = t[o];
    i && (q(i) && (i = {
      mounted: i,
      updated: i
    }), i.deep && pt(r), s.push({
      dir: i,
      instance: n,
      value: r,
      oldValue: void 0,
      arg: l,
      modifiers: a
    }));
  }
  return e;
}
function Nt(e, t, n, s) {
  const o = e.dirs, i = t && t.dirs;
  for (let r = 0; r < o.length; r++) {
    const l = o[r];
    i && (l.oldValue = i[r].value);
    let a = l.dir[s];
    a && (mt(), Ye(a, n, 8, [
      e.el,
      l,
      e,
      t
    ]), vt());
  }
}
const Ui = Symbol("_vte"), Ki = (e) => e.__isTeleport, Cn = (e) => e && (e.disabled || e.disabled === ""), Ao = (e) => e && (e.defer || e.defer === ""), ko = (e) => typeof SVGElement < "u" && e instanceof SVGElement, Mo = (e) => typeof MathMLElement == "function" && e instanceof MathMLElement, js = (e, t) => {
  const n = e && e.to;
  return ye(n) ? t ? t(n) : null : n;
}, Gi = {
  name: "Teleport",
  __isTeleport: !0,
  process(e, t, n, s, o, i, r, l, a, u) {
    const {
      mc: c,
      pc: d,
      pbc: g,
      o: { insert: m, querySelector: C, createText: _, createComment: k }
    } = u, M = Cn(t.props);
    let { shapeFlag: p, children: T, dynamicChildren: b } = t;
    if (e == null) {
      const j = t.el = _(""), K = t.anchor = _("");
      m(j, n, s), m(K, n, s);
      const se = (H, X) => {
        p & 16 && c(
          T,
          H,
          X,
          o,
          i,
          r,
          l,
          a
        );
      }, Q = () => {
        const H = t.target = js(t.props, C), X = Ji(H, t, _, m);
        H && (r !== "svg" && ko(H) ? r = "svg" : r !== "mathml" && Mo(H) && (r = "mathml"), o && o.isCE && (o.ce._teleportTargets || (o.ce._teleportTargets = /* @__PURE__ */ new Set())).add(H), M || (se(H, X), Kn(t, !1)));
      };
      M && (se(n, K), Kn(t, !0)), Ao(t.props) ? (t.el.__isMounted = !1, we(() => {
        Q(), delete t.el.__isMounted;
      }, i)) : Q();
    } else {
      if (Ao(t.props) && e.el.__isMounted === !1) {
        we(() => {
          Gi.process(
            e,
            t,
            n,
            s,
            o,
            i,
            r,
            l,
            a,
            u
          );
        }, i);
        return;
      }
      t.el = e.el, t.targetStart = e.targetStart;
      const j = t.anchor = e.anchor, K = t.target = e.target, se = t.targetAnchor = e.targetAnchor, Q = Cn(e.props), H = Q ? n : K, X = Q ? j : se;
      if (r === "svg" || ko(K) ? r = "svg" : (r === "mathml" || Mo(K)) && (r = "mathml"), b ? (g(
        e.dynamicChildren,
        b,
        H,
        o,
        i,
        r,
        l
      ), ho(e, t, !0)) : a || d(
        e,
        t,
        H,
        X,
        o,
        i,
        r,
        l,
        !1
      ), M)
        Q ? t.props && e.props && t.props.to !== e.props.to && (t.props.to = e.props.to) : Bn(
          t,
          n,
          j,
          u,
          1
        );
      else if ((t.props && t.props.to) !== (e.props && e.props.to)) {
        const re = t.target = js(
          t.props,
          C
        );
        re && Bn(
          t,
          re,
          null,
          u,
          0
        );
      } else Q && Bn(
        t,
        K,
        se,
        u,
        1
      );
      Kn(t, M);
    }
  },
  remove(e, t, n, { um: s, o: { remove: o } }, i) {
    const {
      shapeFlag: r,
      children: l,
      anchor: a,
      targetStart: u,
      targetAnchor: c,
      target: d,
      props: g
    } = e;
    if (d && (o(u), o(c)), i && o(a), r & 16) {
      const m = i || !Cn(g);
      for (let C = 0; C < l.length; C++) {
        const _ = l[C];
        s(
          _,
          t,
          n,
          m,
          !!_.dynamicChildren
        );
      }
    }
  },
  move: Bn,
  hydrate: Fl
};
function Bn(e, t, n, { o: { insert: s }, m: o }, i = 2) {
  i === 0 && s(e.targetAnchor, t, n);
  const { el: r, anchor: l, shapeFlag: a, children: u, props: c } = e, d = i === 2;
  if (d && s(r, t, n), (!d || Cn(c)) && a & 16)
    for (let g = 0; g < u.length; g++)
      o(
        u[g],
        t,
        n,
        2
      );
  d && s(l, t, n);
}
function Fl(e, t, n, s, o, i, {
  o: { nextSibling: r, parentNode: l, querySelector: a, insert: u, createText: c }
}, d) {
  function g(_, k, M, p) {
    k.anchor = d(
      r(_),
      k,
      l(_),
      n,
      s,
      o,
      i
    ), k.targetStart = M, k.targetAnchor = p;
  }
  const m = t.target = js(
    t.props,
    a
  ), C = Cn(t.props);
  if (m) {
    const _ = m._lpa || m.firstChild;
    if (t.shapeFlag & 16)
      if (C)
        g(
          e,
          t,
          _,
          _ && r(_)
        );
      else {
        t.anchor = r(e);
        let k = _;
        for (; k; ) {
          if (k && k.nodeType === 8) {
            if (k.data === "teleport start anchor")
              t.targetStart = k;
            else if (k.data === "teleport anchor") {
              t.targetAnchor = k, m._lpa = t.targetAnchor && r(t.targetAnchor);
              break;
            }
          }
          k = r(k);
        }
        t.targetAnchor || Ji(m, t, c, u), d(
          _ && r(_),
          t,
          m,
          n,
          s,
          o,
          i
        );
      }
    Kn(t, C);
  } else C && t.shapeFlag & 16 && g(e, t, e, r(e));
  return t.anchor && r(t.anchor);
}
const qi = Gi;
function Kn(e, t) {
  const n = e.ctx;
  if (n && n.ut) {
    let s, o;
    for (t ? (s = e.el, o = e.anchor) : (s = e.targetStart, o = e.targetAnchor); s && s !== o; )
      s.nodeType === 1 && s.setAttribute("data-v-owner", n.uid), s = s.nextSibling;
    n.ut();
  }
}
function Ji(e, t, n, s) {
  const o = t.targetStart = n(""), i = t.targetAnchor = n("");
  return o[Ui] = i, e && (s(o, e), s(i, e)), i;
}
const dt = Symbol("_leaveCb"), Wn = Symbol("_enterCb");
function Rl() {
  const e = {
    isMounted: !1,
    isLeaving: !1,
    isUnmounting: !1,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  return Kt(() => {
    e.isMounted = !0;
  }), sr(() => {
    e.isUnmounting = !0;
  }), e;
}
const Ue = [Function, Array], Yi = {
  mode: String,
  appear: Boolean,
  persisted: Boolean,
  // enter
  onBeforeEnter: Ue,
  onEnter: Ue,
  onAfterEnter: Ue,
  onEnterCancelled: Ue,
  // leave
  onBeforeLeave: Ue,
  onLeave: Ue,
  onAfterLeave: Ue,
  onLeaveCancelled: Ue,
  // appear
  onBeforeAppear: Ue,
  onAppear: Ue,
  onAfterAppear: Ue,
  onAppearCancelled: Ue
}, Zi = (e) => {
  const t = e.subTree;
  return t.component ? Zi(t.component) : t;
}, Dl = {
  name: "BaseTransition",
  props: Yi,
  setup(e, { slots: t }) {
    const n = Tr(), s = Rl();
    return () => {
      const o = t.default && er(t.default(), !0);
      if (!o || !o.length)
        return;
      const i = Xi(o), r = ie(e), { mode: l } = r;
      if (s.isLeaving)
        return Es(i);
      const a = $o(i);
      if (!a)
        return Es(i);
      let u = Hs(
        a,
        r,
        s,
        n,
        // #11061, ensure enterHooks is fresh after clone
        (d) => u = d
      );
      a.type !== Me && Ln(a, u);
      let c = n.subTree && $o(n.subTree);
      if (c && c.type !== Me && !jt(c, a) && Zi(n).type !== Me) {
        let d = Hs(
          c,
          r,
          s,
          n
        );
        if (Ln(c, d), l === "out-in" && a.type !== Me)
          return s.isLeaving = !0, d.afterLeave = () => {
            s.isLeaving = !1, n.job.flags & 8 || n.update(), delete d.afterLeave, c = void 0;
          }, Es(i);
        l === "in-out" && a.type !== Me ? d.delayLeave = (g, m, C) => {
          const _ = Qi(
            s,
            c
          );
          _[String(c.key)] = c, g[dt] = () => {
            m(), g[dt] = void 0, delete u.delayedLeave, c = void 0;
          }, u.delayedLeave = () => {
            C(), delete u.delayedLeave, c = void 0;
          };
        } : c = void 0;
      } else c && (c = void 0);
      return i;
    };
  }
};
function Xi(e) {
  let t = e[0];
  if (e.length > 1) {
    for (const n of e)
      if (n.type !== Me) {
        t = n;
        break;
      }
  }
  return t;
}
const jl = Dl;
function Qi(e, t) {
  const { leavingVNodes: n } = e;
  let s = n.get(t.type);
  return s || (s = /* @__PURE__ */ Object.create(null), n.set(t.type, s)), s;
}
function Hs(e, t, n, s, o) {
  const {
    appear: i,
    mode: r,
    persisted: l = !1,
    onBeforeEnter: a,
    onEnter: u,
    onAfterEnter: c,
    onEnterCancelled: d,
    onBeforeLeave: g,
    onLeave: m,
    onAfterLeave: C,
    onLeaveCancelled: _,
    onBeforeAppear: k,
    onAppear: M,
    onAfterAppear: p,
    onAppearCancelled: T
  } = t, b = String(e.key), j = Qi(n, e), K = (H, X) => {
    H && Ye(
      H,
      s,
      9,
      X
    );
  }, se = (H, X) => {
    const re = X[1];
    K(H, X), z(H) ? H.every((P) => P.length <= 1) && re() : H.length <= 1 && re();
  }, Q = {
    mode: r,
    persisted: l,
    beforeEnter(H) {
      let X = a;
      if (!n.isMounted)
        if (i)
          X = k || a;
        else
          return;
      H[dt] && H[dt](
        !0
        /* cancelled */
      );
      const re = j[b];
      re && jt(e, re) && re.el[dt] && re.el[dt](), K(X, [H]);
    },
    enter(H) {
      let X = u, re = c, P = d;
      if (!n.isMounted)
        if (i)
          X = M || u, re = p || c, P = T || d;
        else
          return;
      let ce = !1;
      const $ = H[Wn] = (ee) => {
        ce || (ce = !0, ee ? K(P, [H]) : K(re, [H]), Q.delayedLeave && Q.delayedLeave(), H[Wn] = void 0);
      };
      X ? se(X, [H, $]) : $();
    },
    leave(H, X) {
      const re = String(e.key);
      if (H[Wn] && H[Wn](
        !0
        /* cancelled */
      ), n.isUnmounting)
        return X();
      K(g, [H]);
      let P = !1;
      const ce = H[dt] = ($) => {
        P || (P = !0, X(), $ ? K(_, [H]) : K(C, [H]), H[dt] = void 0, j[re] === e && delete j[re]);
      };
      j[re] = e, m ? se(m, [H, ce]) : ce();
    },
    clone(H) {
      const X = Hs(
        H,
        t,
        n,
        s,
        o
      );
      return o && o(X), X;
    }
  };
  return Q;
}
function Es(e) {
  if (hs(e))
    return e = It(e), e.children = null, e;
}
function $o(e) {
  if (!hs(e))
    return Ki(e.type) && e.children ? Xi(e.children) : e;
  if (e.component)
    return e.component.subTree;
  const { shapeFlag: t, children: n } = e;
  if (n) {
    if (t & 16)
      return n[0];
    if (t & 32 && q(n.default))
      return n.default();
  }
}
function Ln(e, t) {
  e.shapeFlag & 6 && e.component ? (e.transition = t, Ln(e.component.subTree, t)) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
function er(e, t = !1, n) {
  let s = [], o = 0;
  for (let i = 0; i < e.length; i++) {
    let r = e[i];
    const l = n == null ? r.key : String(n) + String(r.key != null ? r.key : i);
    r.type === de ? (r.patchFlag & 128 && o++, s = s.concat(
      er(r.children, t, l)
    )) : (t || r.type !== Me) && s.push(l != null ? It(r, { key: l }) : r);
  }
  if (o > 1)
    for (let i = 0; i < s.length; i++)
      s[i].patchFlag = -2;
  return s;
}
// @__NO_SIDE_EFFECTS__
function Ze(e, t) {
  return q(e) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    Ee({ name: e.name }, t, { setup: e })
  ) : e;
}
function tr(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
const es = /* @__PURE__ */ new WeakMap();
function Sn(e, t, n, s, o = !1) {
  if (z(e)) {
    e.forEach(
      (C, _) => Sn(
        C,
        t && (z(t) ? t[_] : t),
        n,
        s,
        o
      )
    );
    return;
  }
  if (en(s) && !o) {
    s.shapeFlag & 512 && s.type.__asyncResolved && s.component.subTree.component && Sn(e, t, n, s.component.subTree);
    return;
  }
  const i = s.shapeFlag & 4 ? vs(s.component) : s.el, r = o ? null : i, { i: l, r: a } = e, u = t && t.r, c = l.refs === fe ? l.refs = {} : l.refs, d = l.setupState, g = ie(d), m = d === fe ? gi : (C) => ae(g, C);
  if (u != null && u !== a) {
    if (Lo(t), ye(u))
      c[u] = null, m(u) && (d[u] = null);
    else if (Le(u)) {
      u.value = null;
      const C = t;
      C.k && (c[C.k] = null);
    }
  }
  if (q(a))
    Fn(a, l, 12, [r, c]);
  else {
    const C = ye(a), _ = Le(a);
    if (C || _) {
      const k = () => {
        if (e.f) {
          const M = C ? m(a) ? d[a] : c[a] : a.value;
          if (o)
            z(M) && Xs(M, i);
          else if (z(M))
            M.includes(i) || M.push(i);
          else if (C)
            c[a] = [i], m(a) && (d[a] = c[a]);
          else {
            const p = [i];
            a.value = p, e.k && (c[e.k] = p);
          }
        } else C ? (c[a] = r, m(a) && (d[a] = r)) : _ && (a.value = r, e.k && (c[e.k] = r));
      };
      if (r) {
        const M = () => {
          k(), es.delete(e);
        };
        M.id = -1, es.set(e, M), we(M, n);
      } else
        Lo(e), k();
    }
  }
}
function Lo(e) {
  const t = es.get(e);
  t && (t.flags |= 8, es.delete(e));
}
us().requestIdleCallback;
us().cancelIdleCallback;
const en = (e) => !!e.type.__asyncLoader, hs = (e) => e.type.__isKeepAlive;
function Hl(e, t) {
  nr(e, "a", t);
}
function Vl(e, t) {
  nr(e, "da", t);
}
function nr(e, t, n = Oe) {
  const s = e.__wdc || (e.__wdc = () => {
    let o = n;
    for (; o; ) {
      if (o.isDeactivated)
        return;
      o = o.parent;
    }
    return e();
  });
  if (ps(t, s, n), n) {
    let o = n.parent;
    for (; o && o.parent; )
      hs(o.parent.vnode) && Bl(s, t, n, o), o = o.parent;
  }
}
function Bl(e, t, n, s) {
  const o = ps(
    t,
    e,
    s,
    !0
    /* prepend */
  );
  un(() => {
    Xs(s[t], o);
  }, n);
}
function ps(e, t, n = Oe, s = !1) {
  if (n) {
    const o = n[e] || (n[e] = []), i = t.__weh || (t.__weh = (...r) => {
      mt();
      const l = Rn(n), a = Ye(t, n, e, r);
      return l(), vt(), a;
    });
    return s ? o.unshift(i) : o.push(i), i;
  }
}
const Ct = (e) => (t, n = Oe) => {
  (!Nn || e === "sp") && ps(e, (...s) => t(...s), n);
}, Wl = Ct("bm"), Kt = Ct("m"), zl = Ct(
  "bu"
), Ul = Ct("u"), sr = Ct(
  "bum"
), un = Ct("um"), Kl = Ct(
  "sp"
), Gl = Ct("rtg"), ql = Ct("rtc");
function Jl(e, t = Oe) {
  ps("ec", e, t);
}
const Yl = Symbol.for("v-ndc");
function He(e, t, n, s) {
  let o;
  const i = n, r = z(e);
  if (r || ye(e)) {
    const l = r && Bt(e);
    let a = !1, u = !1;
    l && (a = !Ke(e), u = yt(e), e = fs(e)), o = new Array(e.length);
    for (let c = 0, d = e.length; c < d; c++)
      o[c] = t(
        a ? u ? cn(Je(e[c])) : Je(e[c]) : e[c],
        c,
        void 0,
        i
      );
  } else if (typeof e == "number") {
    o = new Array(e);
    for (let l = 0; l < e; l++)
      o[l] = t(l + 1, l, void 0, i);
  } else if (me(e))
    if (e[Symbol.iterator])
      o = Array.from(
        e,
        (l, a) => t(l, a, void 0, i)
      );
    else {
      const l = Object.keys(e);
      o = new Array(l.length);
      for (let a = 0, u = l.length; a < u; a++) {
        const c = l[a];
        o[a] = t(e[c], c, a, i);
      }
    }
  else
    o = [];
  return o;
}
function Tn(e, t, n = {}, s, o) {
  if ($e.ce || $e.parent && en($e.parent) && $e.parent.ce) {
    const u = Object.keys(n).length > 0;
    return t !== "default" && (n.name = t), N(), _t(
      de,
      null,
      [ve("slot", n, s && s())],
      u ? -2 : 64
    );
  }
  let i = e[t];
  i && i._c && (i._d = !1), N();
  const r = i && or(i(n)), l = n.key || // slot content array of a dynamic conditional slot may have a branch
  // key attached in the `createSlots` helper, respect that
  r && r.key, a = _t(
    de,
    {
      key: (l && !bt(l) ? l : `_${t}`) + // #7256 force differentiate fallback content from actual content
      (!r && s ? "_fb" : "")
    },
    r || (s ? s() : []),
    r && e._ === 1 ? 64 : -2
  );
  return i && i._c && (i._d = !0), a;
}
function or(e) {
  return e.some((t) => wn(t) ? !(t.type === Me || t.type === de && !or(t.children)) : !0) ? e : null;
}
const Vs = (e) => e ? xr(e) ? vs(e) : Vs(e.parent) : null, xn = (
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
    $parent: (e) => Vs(e.parent),
    $root: (e) => Vs(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => rr(e),
    $forceUpdate: (e) => e.f || (e.f = () => {
      co(e.update);
    }),
    $nextTick: (e) => e.n || (e.n = ao.bind(e.proxy)),
    $watch: (e) => aa.bind(e)
  })
), As = (e, t) => e !== fe && !e.__isScriptSetup && ae(e, t), Zl = {
  get({ _: e }, t) {
    if (t === "__v_skip")
      return !0;
    const { ctx: n, setupState: s, data: o, props: i, accessCache: r, type: l, appContext: a } = e;
    if (t[0] !== "$") {
      const g = r[t];
      if (g !== void 0)
        switch (g) {
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
          return r[t] = 1, s[t];
        if (o !== fe && ae(o, t))
          return r[t] = 2, o[t];
        if (ae(i, t))
          return r[t] = 3, i[t];
        if (n !== fe && ae(n, t))
          return r[t] = 4, n[t];
        Bs && (r[t] = 0);
      }
    }
    const u = xn[t];
    let c, d;
    if (u)
      return t === "$attrs" && ke(e.attrs, "get", ""), u(e);
    if (
      // css module (injected by vue-loader)
      (c = l.__cssModules) && (c = c[t])
    )
      return c;
    if (n !== fe && ae(n, t))
      return r[t] = 4, n[t];
    if (
      // global properties
      d = a.config.globalProperties, ae(d, t)
    )
      return d[t];
  },
  set({ _: e }, t, n) {
    const { data: s, setupState: o, ctx: i } = e;
    return As(o, t) ? (o[t] = n, !0) : s !== fe && ae(s, t) ? (s[t] = n, !0) : ae(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (i[t] = n, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: n, ctx: s, appContext: o, props: i, type: r }
  }, l) {
    let a;
    return !!(n[l] || e !== fe && l[0] !== "$" && ae(e, l) || As(t, l) || ae(i, l) || ae(s, l) || ae(xn, l) || ae(o.config.globalProperties, l) || (a = r.__cssModules) && a[l]);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : ae(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
  }
};
function Io(e) {
  return z(e) ? e.reduce(
    (t, n) => (t[n] = null, t),
    {}
  ) : e;
}
let Bs = !0;
function Xl(e) {
  const t = rr(e), n = e.proxy, s = e.ctx;
  Bs = !1, t.beforeCreate && wo(t.beforeCreate, e, "bc");
  const {
    // state
    data: o,
    computed: i,
    methods: r,
    watch: l,
    provide: a,
    inject: u,
    // lifecycle
    created: c,
    beforeMount: d,
    mounted: g,
    beforeUpdate: m,
    updated: C,
    activated: _,
    deactivated: k,
    beforeDestroy: M,
    beforeUnmount: p,
    destroyed: T,
    unmounted: b,
    render: j,
    renderTracked: K,
    renderTriggered: se,
    errorCaptured: Q,
    serverPrefetch: H,
    // public API
    expose: X,
    inheritAttrs: re,
    // assets
    components: P,
    directives: ce,
    filters: $
  } = t;
  if (u && Ql(u, s, null), r)
    for (const te in r) {
      const ne = r[te];
      q(ne) && (s[te] = ne.bind(n));
    }
  if (o) {
    const te = o.call(n, n);
    me(te) && (e.data = Te(te));
  }
  if (Bs = !0, i)
    for (const te in i) {
      const ne = i[te], _e = q(ne) ? ne.bind(n, n) : q(ne.get) ? ne.get.bind(n, n) : rt, Be = !q(ne) && q(ne.set) ? ne.set.bind(n) : rt, Ae = Y({
        get: _e,
        set: Be
      });
      Object.defineProperty(s, te, {
        enumerable: !0,
        configurable: !0,
        get: () => Ae.value,
        set: (We) => Ae.value = We
      });
    }
  if (l)
    for (const te in l)
      ir(l[te], s, n, te);
  if (a) {
    const te = q(a) ? a.call(n) : a;
    Reflect.ownKeys(te).forEach((ne) => {
      ia(ne, te[ne]);
    });
  }
  c && wo(c, e, "c");
  function Z(te, ne) {
    z(ne) ? ne.forEach((_e) => te(_e.bind(n))) : ne && te(ne.bind(n));
  }
  if (Z(Wl, d), Z(Kt, g), Z(zl, m), Z(Ul, C), Z(Hl, _), Z(Vl, k), Z(Jl, Q), Z(ql, K), Z(Gl, se), Z(sr, p), Z(un, b), Z(Kl, H), z(X))
    if (X.length) {
      const te = e.exposed || (e.exposed = {});
      X.forEach((ne) => {
        Object.defineProperty(te, ne, {
          get: () => n[ne],
          set: (_e) => n[ne] = _e,
          enumerable: !0
        });
      });
    } else e.exposed || (e.exposed = {});
  j && e.render === rt && (e.render = j), re != null && (e.inheritAttrs = re), P && (e.components = P), ce && (e.directives = ce), H && tr(e);
}
function Ql(e, t, n = rt) {
  z(e) && (e = Ws(e));
  for (const s in e) {
    const o = e[s];
    let i;
    me(o) ? "default" in o ? i = nn(
      o.from || s,
      o.default,
      !0
    ) : i = nn(o.from || s) : i = nn(o), Le(i) ? Object.defineProperty(t, s, {
      enumerable: !0,
      configurable: !0,
      get: () => i.value,
      set: (r) => i.value = r
    }) : t[s] = i;
  }
}
function wo(e, t, n) {
  Ye(
    z(e) ? e.map((s) => s.bind(t.proxy)) : e.bind(t.proxy),
    t,
    n
  );
}
function ir(e, t, n, s) {
  let o = s.includes(".") ? cr(n, s) : () => n[s];
  if (ye(e)) {
    const i = t[e];
    q(i) && lt(o, i);
  } else if (q(e))
    lt(o, e.bind(n));
  else if (me(e))
    if (z(e))
      e.forEach((i) => ir(i, t, n, s));
    else {
      const i = q(e.handler) ? e.handler.bind(n) : t[e.handler];
      q(i) && lt(o, i, e);
    }
}
function rr(e) {
  const t = e.type, { mixins: n, extends: s } = t, {
    mixins: o,
    optionsCache: i,
    config: { optionMergeStrategies: r }
  } = e.appContext, l = i.get(t);
  let a;
  return l ? a = l : !o.length && !n && !s ? a = t : (a = {}, o.length && o.forEach(
    (u) => ts(a, u, r, !0)
  ), ts(a, t, r)), me(t) && i.set(t, a), a;
}
function ts(e, t, n, s = !1) {
  const { mixins: o, extends: i } = t;
  i && ts(e, i, n, !0), o && o.forEach(
    (r) => ts(e, r, n, !0)
  );
  for (const r in t)
    if (!(s && r === "expose")) {
      const l = ea[r] || n && n[r];
      e[r] = l ? l(e[r], t[r]) : t[r];
    }
  return e;
}
const ea = {
  data: No,
  props: Oo,
  emits: Oo,
  // objects
  methods: vn,
  computed: vn,
  // lifecycle
  beforeCreate: Ie,
  created: Ie,
  beforeMount: Ie,
  mounted: Ie,
  beforeUpdate: Ie,
  updated: Ie,
  beforeDestroy: Ie,
  beforeUnmount: Ie,
  destroyed: Ie,
  unmounted: Ie,
  activated: Ie,
  deactivated: Ie,
  errorCaptured: Ie,
  serverPrefetch: Ie,
  // assets
  components: vn,
  directives: vn,
  // watch
  watch: na,
  // provide / inject
  provide: No,
  inject: ta
};
function No(e, t) {
  return t ? e ? function() {
    return Ee(
      q(e) ? e.call(this, this) : e,
      q(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function ta(e, t) {
  return vn(Ws(e), Ws(t));
}
function Ws(e) {
  if (z(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++)
      t[e[n]] = e[n];
    return t;
  }
  return e;
}
function Ie(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function vn(e, t) {
  return e ? Ee(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Oo(e, t) {
  return e ? z(e) && z(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : Ee(
    /* @__PURE__ */ Object.create(null),
    Io(e),
    Io(t ?? {})
  ) : t;
}
function na(e, t) {
  if (!e) return t;
  if (!t) return e;
  const n = Ee(/* @__PURE__ */ Object.create(null), e);
  for (const s in t)
    n[s] = Ie(e[s], t[s]);
  return n;
}
function lr() {
  return {
    app: null,
    config: {
      isNativeTag: gi,
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
let sa = 0;
function oa(e, t) {
  return function(s, o = null) {
    q(s) || (s = Ee({}, s)), o != null && !me(o) && (o = null);
    const i = lr(), r = /* @__PURE__ */ new WeakSet(), l = [];
    let a = !1;
    const u = i.app = {
      _uid: sa++,
      _component: s,
      _props: o,
      _container: null,
      _context: i,
      _instance: null,
      version: ja,
      get config() {
        return i.config;
      },
      set config(c) {
      },
      use(c, ...d) {
        return r.has(c) || (c && q(c.install) ? (r.add(c), c.install(u, ...d)) : q(c) && (r.add(c), c(u, ...d))), u;
      },
      mixin(c) {
        return i.mixins.includes(c) || i.mixins.push(c), u;
      },
      component(c, d) {
        return d ? (i.components[c] = d, u) : i.components[c];
      },
      directive(c, d) {
        return d ? (i.directives[c] = d, u) : i.directives[c];
      },
      mount(c, d, g) {
        if (!a) {
          const m = u._ceVNode || ve(s, o);
          return m.appContext = i, g === !0 ? g = "svg" : g === !1 && (g = void 0), e(m, c, g), a = !0, u._container = c, c.__vue_app__ = u, vs(m.component);
        }
      },
      onUnmount(c) {
        l.push(c);
      },
      unmount() {
        a && (Ye(
          l,
          u._instance,
          16
        ), e(null, u._container), delete u._container.__vue_app__);
      },
      provide(c, d) {
        return i.provides[c] = d, u;
      },
      runWithContext(c) {
        const d = tn;
        tn = u;
        try {
          return c();
        } finally {
          tn = d;
        }
      }
    };
    return u;
  };
}
let tn = null;
function ia(e, t) {
  if (Oe) {
    let n = Oe.provides;
    const s = Oe.parent && Oe.parent.provides;
    s === n && (n = Oe.provides = Object.create(s)), n[e] = t;
  }
}
function nn(e, t, n = !1) {
  const s = Tr();
  if (s || tn) {
    let o = tn ? tn._context.provides : s ? s.parent == null || s.ce ? s.vnode.appContext && s.vnode.appContext.provides : s.parent.provides : void 0;
    if (o && e in o)
      return o[e];
    if (arguments.length > 1)
      return n && q(t) ? t.call(s && s.proxy) : t;
  }
}
const ra = Symbol.for("v-scx"), la = () => nn(ra);
function lt(e, t, n) {
  return ar(e, t, n);
}
function ar(e, t, n = fe) {
  const { immediate: s, deep: o, flush: i, once: r } = n, l = Ee({}, n), a = t && s || !t && i !== "post";
  let u;
  if (Nn) {
    if (i === "sync") {
      const m = la();
      u = m.__watcherHandles || (m.__watcherHandles = []);
    } else if (!a) {
      const m = () => {
      };
      return m.stop = rt, m.resume = rt, m.pause = rt, m;
    }
  }
  const c = Oe;
  l.call = (m, C, _) => Ye(m, c, C, _);
  let d = !1;
  i === "post" ? l.scheduler = (m) => {
    we(m, c && c.suspense);
  } : i !== "sync" && (d = !0, l.scheduler = (m, C) => {
    C ? m() : co(m);
  }), l.augmentJob = (m) => {
    t && (m.flags |= 4), d && (m.flags |= 2, c && (m.id = c.uid, m.i = c));
  };
  const g = wl(e, t, l);
  return Nn && (u ? u.push(g) : a && g()), g;
}
function aa(e, t, n) {
  const s = this.proxy, o = ye(e) ? e.includes(".") ? cr(s, e) : () => s[e] : e.bind(s, s);
  let i;
  q(t) ? i = t : (i = t.handler, n = t);
  const r = Rn(this), l = ar(o, i.bind(s), n);
  return r(), l;
}
function cr(e, t) {
  const n = t.split(".");
  return () => {
    let s = e;
    for (let o = 0; o < n.length && s; o++)
      s = s[n[o]];
    return s;
  };
}
const ca = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${Lt(t)}Modifiers`] || e[`${Ut(t)}Modifiers`];
function ua(e, t, ...n) {
  if (e.isUnmounted) return;
  const s = e.vnode.props || fe;
  let o = n;
  const i = t.startsWith("update:"), r = i && ca(s, t.slice(7));
  r && (r.trim && (o = n.map((c) => ye(c) ? c.trim() : c)), r.number && (o = n.map(eo)));
  let l, a = s[l = bs(t)] || // also try camelCase event handler (#2249)
  s[l = bs(Lt(t))];
  !a && i && (a = s[l = bs(Ut(t))]), a && Ye(
    a,
    e,
    6,
    o
  );
  const u = s[l + "Once"];
  if (u) {
    if (!e.emitted)
      e.emitted = {};
    else if (e.emitted[l])
      return;
    e.emitted[l] = !0, Ye(
      u,
      e,
      6,
      o
    );
  }
}
const fa = /* @__PURE__ */ new WeakMap();
function ur(e, t, n = !1) {
  const s = n ? fa : t.emitsCache, o = s.get(e);
  if (o !== void 0)
    return o;
  const i = e.emits;
  let r = {}, l = !1;
  if (!q(e)) {
    const a = (u) => {
      const c = ur(u, t, !0);
      c && (l = !0, Ee(r, c));
    };
    !n && t.mixins.length && t.mixins.forEach(a), e.extends && a(e.extends), e.mixins && e.mixins.forEach(a);
  }
  return !i && !l ? (me(e) && s.set(e, null), null) : (z(i) ? i.forEach((a) => r[a] = null) : Ee(r, i), me(e) && s.set(e, r), r);
}
function gs(e, t) {
  return !e || !ls(t) ? !1 : (t = t.slice(2).replace(/Once$/, ""), ae(e, t[0].toLowerCase() + t.slice(1)) || ae(e, Ut(t)) || ae(e, t));
}
function Po(e) {
  const {
    type: t,
    vnode: n,
    proxy: s,
    withProxy: o,
    propsOptions: [i],
    slots: r,
    attrs: l,
    emit: a,
    render: u,
    renderCache: c,
    props: d,
    data: g,
    setupState: m,
    ctx: C,
    inheritAttrs: _
  } = e, k = Qn(e);
  let M, p;
  try {
    if (n.shapeFlag & 4) {
      const b = o || s, j = b;
      M = ot(
        u.call(
          j,
          b,
          c,
          d,
          m,
          g,
          C
        )
      ), p = l;
    } else {
      const b = t;
      M = ot(
        b.length > 1 ? b(
          d,
          { attrs: l, slots: r, emit: a }
        ) : b(
          d,
          null
        )
      ), p = t.props ? l : da(l);
    }
  } catch (b) {
    En.length = 0, ds(b, e, 1), M = ve(Me);
  }
  let T = M;
  if (p && _ !== !1) {
    const b = Object.keys(p), { shapeFlag: j } = T;
    b.length && j & 7 && (i && b.some(Zs) && (p = ha(
      p,
      i
    )), T = It(T, p, !1, !0));
  }
  return n.dirs && (T = It(T, null, !1, !0), T.dirs = T.dirs ? T.dirs.concat(n.dirs) : n.dirs), n.transition && Ln(T, n.transition), M = T, Qn(k), M;
}
const da = (e) => {
  let t;
  for (const n in e)
    (n === "class" || n === "style" || ls(n)) && ((t || (t = {}))[n] = e[n]);
  return t;
}, ha = (e, t) => {
  const n = {};
  for (const s in e)
    (!Zs(s) || !(s.slice(9) in t)) && (n[s] = e[s]);
  return n;
};
function pa(e, t, n) {
  const { props: s, children: o, component: i } = e, { props: r, children: l, patchFlag: a } = t, u = i.emitsOptions;
  if (t.dirs || t.transition)
    return !0;
  if (n && a >= 0) {
    if (a & 1024)
      return !0;
    if (a & 16)
      return s ? Fo(s, r, u) : !!r;
    if (a & 8) {
      const c = t.dynamicProps;
      for (let d = 0; d < c.length; d++) {
        const g = c[d];
        if (r[g] !== s[g] && !gs(u, g))
          return !0;
      }
    }
  } else
    return (o || l) && (!l || !l.$stable) ? !0 : s === r ? !1 : s ? r ? Fo(s, r, u) : !0 : !!r;
  return !1;
}
function Fo(e, t, n) {
  const s = Object.keys(t);
  if (s.length !== Object.keys(e).length)
    return !0;
  for (let o = 0; o < s.length; o++) {
    const i = s[o];
    if (t[i] !== e[i] && !gs(n, i))
      return !0;
  }
  return !1;
}
function ga({ vnode: e, parent: t }, n) {
  for (; t; ) {
    const s = t.subTree;
    if (s.suspense && s.suspense.activeBranch === e && (s.el = e.el), s === e)
      (e = t.vnode).el = n, t = t.parent;
    else
      break;
  }
}
const fr = {}, dr = () => Object.create(fr), hr = (e) => Object.getPrototypeOf(e) === fr;
function ma(e, t, n, s = !1) {
  const o = {}, i = dr();
  e.propsDefaults = /* @__PURE__ */ Object.create(null), pr(e, t, o, i);
  for (const r in e.propsOptions[0])
    r in o || (o[r] = void 0);
  n ? e.props = s ? o : xl(o) : e.type.props ? e.props = o : e.props = i, e.attrs = i;
}
function va(e, t, n, s) {
  const {
    props: o,
    attrs: i,
    vnode: { patchFlag: r }
  } = e, l = ie(o), [a] = e.propsOptions;
  let u = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (s || r > 0) && !(r & 16)
  ) {
    if (r & 8) {
      const c = e.vnode.dynamicProps;
      for (let d = 0; d < c.length; d++) {
        let g = c[d];
        if (gs(e.emitsOptions, g))
          continue;
        const m = t[g];
        if (a)
          if (ae(i, g))
            m !== i[g] && (i[g] = m, u = !0);
          else {
            const C = Lt(g);
            o[C] = zs(
              a,
              l,
              C,
              m,
              e,
              !1
            );
          }
        else
          m !== i[g] && (i[g] = m, u = !0);
      }
    }
  } else {
    pr(e, t, o, i) && (u = !0);
    let c;
    for (const d in l)
      (!t || // for camelCase
      !ae(t, d) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((c = Ut(d)) === d || !ae(t, c))) && (a ? n && // for camelCase
      (n[d] !== void 0 || // for kebab-case
      n[c] !== void 0) && (o[d] = zs(
        a,
        l,
        d,
        void 0,
        e,
        !0
      )) : delete o[d]);
    if (i !== l)
      for (const d in i)
        (!t || !ae(t, d)) && (delete i[d], u = !0);
  }
  u && ht(e.attrs, "set", "");
}
function pr(e, t, n, s) {
  const [o, i] = e.propsOptions;
  let r = !1, l;
  if (t)
    for (let a in t) {
      if (yn(a))
        continue;
      const u = t[a];
      let c;
      o && ae(o, c = Lt(a)) ? !i || !i.includes(c) ? n[c] = u : (l || (l = {}))[c] = u : gs(e.emitsOptions, a) || (!(a in s) || u !== s[a]) && (s[a] = u, r = !0);
    }
  if (i) {
    const a = ie(n), u = l || fe;
    for (let c = 0; c < i.length; c++) {
      const d = i[c];
      n[d] = zs(
        o,
        a,
        d,
        u[d],
        e,
        !ae(u, d)
      );
    }
  }
  return r;
}
function zs(e, t, n, s, o, i) {
  const r = e[n];
  if (r != null) {
    const l = ae(r, "default");
    if (l && s === void 0) {
      const a = r.default;
      if (r.type !== Function && !r.skipFactory && q(a)) {
        const { propsDefaults: u } = o;
        if (n in u)
          s = u[n];
        else {
          const c = Rn(o);
          s = u[n] = a.call(
            null,
            t
          ), c();
        }
      } else
        s = a;
      o.ce && o.ce._setProp(n, s);
    }
    r[
      0
      /* shouldCast */
    ] && (i && !l ? s = !1 : r[
      1
      /* shouldCastTrue */
    ] && (s === "" || s === Ut(n)) && (s = !0));
  }
  return s;
}
const ya = /* @__PURE__ */ new WeakMap();
function gr(e, t, n = !1) {
  const s = n ? ya : t.propsCache, o = s.get(e);
  if (o)
    return o;
  const i = e.props, r = {}, l = [];
  let a = !1;
  if (!q(e)) {
    const c = (d) => {
      a = !0;
      const [g, m] = gr(d, t, !0);
      Ee(r, g), m && l.push(...m);
    };
    !n && t.mixins.length && t.mixins.forEach(c), e.extends && c(e.extends), e.mixins && e.mixins.forEach(c);
  }
  if (!i && !a)
    return me(e) && s.set(e, Zt), Zt;
  if (z(i))
    for (let c = 0; c < i.length; c++) {
      const d = Lt(i[c]);
      Ro(d) && (r[d] = fe);
    }
  else if (i)
    for (const c in i) {
      const d = Lt(c);
      if (Ro(d)) {
        const g = i[c], m = r[d] = z(g) || q(g) ? { type: g } : Ee({}, g), C = m.type;
        let _ = !1, k = !0;
        if (z(C))
          for (let M = 0; M < C.length; ++M) {
            const p = C[M], T = q(p) && p.name;
            if (T === "Boolean") {
              _ = !0;
              break;
            } else T === "String" && (k = !1);
          }
        else
          _ = q(C) && C.name === "Boolean";
        m[
          0
          /* shouldCast */
        ] = _, m[
          1
          /* shouldCastTrue */
        ] = k, (_ || ae(m, "default")) && l.push(d);
      }
    }
  const u = [r, l];
  return me(e) && s.set(e, u), u;
}
function Ro(e) {
  return e[0] !== "$" && !yn(e);
}
const uo = (e) => e === "_" || e === "_ctx" || e === "$stable", fo = (e) => z(e) ? e.map(ot) : [ot(e)], _a = (e, t, n) => {
  if (t._n)
    return t;
  const s = at((...o) => fo(t(...o)), n);
  return s._c = !1, s;
}, mr = (e, t, n) => {
  const s = e._ctx;
  for (const o in e) {
    if (uo(o)) continue;
    const i = e[o];
    if (q(i))
      t[o] = _a(o, i, s);
    else if (i != null) {
      const r = fo(i);
      t[o] = () => r;
    }
  }
}, vr = (e, t) => {
  const n = fo(t);
  e.slots.default = () => n;
}, yr = (e, t, n) => {
  for (const s in t)
    (n || !uo(s)) && (e[s] = t[s]);
}, ba = (e, t, n) => {
  const s = e.slots = dr();
  if (e.vnode.shapeFlag & 32) {
    const o = t._;
    o ? (yr(s, t, n), n && Ci(s, "_", o, !0)) : mr(t, s);
  } else t && vr(e, t);
}, Ca = (e, t, n) => {
  const { vnode: s, slots: o } = e;
  let i = !0, r = fe;
  if (s.shapeFlag & 32) {
    const l = t._;
    l ? n && l === 1 ? i = !1 : yr(o, t, n) : (i = !t.$stable, mr(t, o)), r = t;
  } else t && (vr(e, t), r = { default: 1 });
  if (i)
    for (const l in o)
      !uo(l) && r[l] == null && delete o[l];
}, we = Aa;
function Sa(e) {
  return Ta(e);
}
function Ta(e, t) {
  const n = us();
  n.__VUE__ = !0;
  const {
    insert: s,
    remove: o,
    patchProp: i,
    createElement: r,
    createText: l,
    createComment: a,
    setText: u,
    setElementText: c,
    parentNode: d,
    nextSibling: g,
    setScopeId: m = rt,
    insertStaticContent: C
  } = e, _ = (f, h, y, A = null, S = null, x = null, w = void 0, I = null, L = !!h.dynamicChildren) => {
    if (f === h)
      return;
    f && !jt(f, h) && (A = le(f), We(f, S, x, !0), f = null), h.patchFlag === -2 && (L = !1, h.dynamicChildren = null);
    const { type: E, ref: W, shapeFlag: O } = h;
    switch (E) {
      case ms:
        k(f, h, y, A);
        break;
      case Me:
        M(f, h, y, A);
        break;
      case Ms:
        f == null && p(h, y, A, w);
        break;
      case de:
        P(
          f,
          h,
          y,
          A,
          S,
          x,
          w,
          I,
          L
        );
        break;
      default:
        O & 1 ? j(
          f,
          h,
          y,
          A,
          S,
          x,
          w,
          I,
          L
        ) : O & 6 ? ce(
          f,
          h,
          y,
          A,
          S,
          x,
          w,
          I,
          L
        ) : (O & 64 || O & 128) && E.process(
          f,
          h,
          y,
          A,
          S,
          x,
          w,
          I,
          L,
          Ge
        );
    }
    W != null && S ? Sn(W, f && f.ref, x, h || f, !h) : W == null && f && f.ref != null && Sn(f.ref, null, x, f, !0);
  }, k = (f, h, y, A) => {
    if (f == null)
      s(
        h.el = l(h.children),
        y,
        A
      );
    else {
      const S = h.el = f.el;
      h.children !== f.children && u(S, h.children);
    }
  }, M = (f, h, y, A) => {
    f == null ? s(
      h.el = a(h.children || ""),
      y,
      A
    ) : h.el = f.el;
  }, p = (f, h, y, A) => {
    [f.el, f.anchor] = C(
      f.children,
      h,
      y,
      A,
      f.el,
      f.anchor
    );
  }, T = ({ el: f, anchor: h }, y, A) => {
    let S;
    for (; f && f !== h; )
      S = g(f), s(f, y, A), f = S;
    s(h, y, A);
  }, b = ({ el: f, anchor: h }) => {
    let y;
    for (; f && f !== h; )
      y = g(f), o(f), f = y;
    o(h);
  }, j = (f, h, y, A, S, x, w, I, L) => {
    if (h.type === "svg" ? w = "svg" : h.type === "math" && (w = "mathml"), f == null)
      K(
        h,
        y,
        A,
        S,
        x,
        w,
        I,
        L
      );
    else {
      const E = f.el && f.el._isVueCE ? f.el : null;
      try {
        E && E._beginPatch(), H(
          f,
          h,
          S,
          x,
          w,
          I,
          L
        );
      } finally {
        E && E._endPatch();
      }
    }
  }, K = (f, h, y, A, S, x, w, I) => {
    let L, E;
    const { props: W, shapeFlag: O, transition: B, dirs: U } = f;
    if (L = f.el = r(
      f.type,
      x,
      W && W.is,
      W
    ), O & 8 ? c(L, f.children) : O & 16 && Q(
      f.children,
      L,
      null,
      A,
      S,
      ks(f, x),
      w,
      I
    ), U && Nt(f, null, A, "created"), se(L, f, f.scopeId, w, A), W) {
      for (const he in W)
        he !== "value" && !yn(he) && i(L, he, null, W[he], x, A);
      "value" in W && i(L, "value", null, W.value, x), (E = W.onVnodeBeforeMount) && nt(E, A, f);
    }
    U && Nt(f, null, A, "beforeMount");
    const oe = xa(S, B);
    oe && B.beforeEnter(L), s(L, h, y), ((E = W && W.onVnodeMounted) || oe || U) && we(() => {
      E && nt(E, A, f), oe && B.enter(L), U && Nt(f, null, A, "mounted");
    }, S);
  }, se = (f, h, y, A, S) => {
    if (y && m(f, y), A)
      for (let x = 0; x < A.length; x++)
        m(f, A[x]);
    if (S) {
      let x = S.subTree;
      if (h === x || br(x.type) && (x.ssContent === h || x.ssFallback === h)) {
        const w = S.vnode;
        se(
          f,
          w,
          w.scopeId,
          w.slotScopeIds,
          S.parent
        );
      }
    }
  }, Q = (f, h, y, A, S, x, w, I, L = 0) => {
    for (let E = L; E < f.length; E++) {
      const W = f[E] = I ? At(f[E]) : ot(f[E]);
      _(
        null,
        W,
        h,
        y,
        A,
        S,
        x,
        w,
        I
      );
    }
  }, H = (f, h, y, A, S, x, w) => {
    const I = h.el = f.el;
    let { patchFlag: L, dynamicChildren: E, dirs: W } = h;
    L |= f.patchFlag & 16;
    const O = f.props || fe, B = h.props || fe;
    let U;
    if (y && Ot(y, !1), (U = B.onVnodeBeforeUpdate) && nt(U, y, h, f), W && Nt(h, f, y, "beforeUpdate"), y && Ot(y, !0), (O.innerHTML && B.innerHTML == null || O.textContent && B.textContent == null) && c(I, ""), E ? X(
      f.dynamicChildren,
      E,
      I,
      y,
      A,
      ks(h, S),
      x
    ) : w || ne(
      f,
      h,
      I,
      null,
      y,
      A,
      ks(h, S),
      x,
      !1
    ), L > 0) {
      if (L & 16)
        re(I, O, B, y, S);
      else if (L & 2 && O.class !== B.class && i(I, "class", null, B.class, S), L & 4 && i(I, "style", O.style, B.style, S), L & 8) {
        const oe = h.dynamicProps;
        for (let he = 0; he < oe.length; he++) {
          const ue = oe[he], Fe = O[ue], Re = B[ue];
          (Re !== Fe || ue === "value") && i(I, ue, Fe, Re, S, y);
        }
      }
      L & 1 && f.children !== h.children && c(I, h.children);
    } else !w && E == null && re(I, O, B, y, S);
    ((U = B.onVnodeUpdated) || W) && we(() => {
      U && nt(U, y, h, f), W && Nt(h, f, y, "updated");
    }, A);
  }, X = (f, h, y, A, S, x, w) => {
    for (let I = 0; I < h.length; I++) {
      const L = f[I], E = h[I], W = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        L.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (L.type === de || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !jt(L, E) || // - In the case of a component, it could contain anything.
        L.shapeFlag & 198) ? d(L.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          y
        )
      );
      _(
        L,
        E,
        W,
        null,
        A,
        S,
        x,
        w,
        !0
      );
    }
  }, re = (f, h, y, A, S) => {
    if (h !== y) {
      if (h !== fe)
        for (const x in h)
          !yn(x) && !(x in y) && i(
            f,
            x,
            h[x],
            null,
            S,
            A
          );
      for (const x in y) {
        if (yn(x)) continue;
        const w = y[x], I = h[x];
        w !== I && x !== "value" && i(f, x, I, w, S, A);
      }
      "value" in y && i(f, "value", h.value, y.value, S);
    }
  }, P = (f, h, y, A, S, x, w, I, L) => {
    const E = h.el = f ? f.el : l(""), W = h.anchor = f ? f.anchor : l("");
    let { patchFlag: O, dynamicChildren: B, slotScopeIds: U } = h;
    U && (I = I ? I.concat(U) : U), f == null ? (s(E, y, A), s(W, y, A), Q(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      h.children || [],
      y,
      W,
      S,
      x,
      w,
      I,
      L
    )) : O > 0 && O & 64 && B && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    f.dynamicChildren ? (X(
      f.dynamicChildren,
      B,
      y,
      S,
      x,
      w,
      I
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (h.key != null || S && h === S.subTree) && ho(
      f,
      h,
      !0
      /* shallow */
    )) : ne(
      f,
      h,
      y,
      W,
      S,
      x,
      w,
      I,
      L
    );
  }, ce = (f, h, y, A, S, x, w, I, L) => {
    h.slotScopeIds = I, f == null ? h.shapeFlag & 512 ? S.ctx.activate(
      h,
      y,
      A,
      w,
      L
    ) : $(
      h,
      y,
      A,
      S,
      x,
      w,
      L
    ) : ee(f, h, L);
  }, $ = (f, h, y, A, S, x, w) => {
    const I = f.component = Na(
      f,
      A,
      S
    );
    if (hs(f) && (I.ctx.renderer = Ge), Oa(I, !1, w), I.asyncDep) {
      if (S && S.registerDep(I, Z, w), !f.el) {
        const L = I.subTree = ve(Me);
        M(null, L, h, y), f.placeholder = L.el;
      }
    } else
      Z(
        I,
        f,
        h,
        y,
        S,
        x,
        w
      );
  }, ee = (f, h, y) => {
    const A = h.component = f.component;
    if (pa(f, h, y))
      if (A.asyncDep && !A.asyncResolved) {
        te(A, h, y);
        return;
      } else
        A.next = h, A.update();
    else
      h.el = f.el, A.vnode = h;
  }, Z = (f, h, y, A, S, x, w) => {
    const I = () => {
      if (f.isMounted) {
        let { next: O, bu: B, u: U, parent: oe, vnode: he } = f;
        {
          const et = _r(f);
          if (et) {
            O && (O.el = he.el, te(f, O, w)), et.asyncDep.then(() => {
              f.isUnmounted || I();
            });
            return;
          }
        }
        let ue = O, Fe;
        Ot(f, !1), O ? (O.el = he.el, te(f, O, w)) : O = he, B && Un(B), (Fe = O.props && O.props.onVnodeBeforeUpdate) && nt(Fe, oe, O, he), Ot(f, !0);
        const Re = Po(f), Qe = f.subTree;
        f.subTree = Re, _(
          Qe,
          Re,
          // parent may have changed if it's in a teleport
          d(Qe.el),
          // anchor may have changed if it's in a fragment
          le(Qe),
          f,
          S,
          x
        ), O.el = Re.el, ue === null && ga(f, Re.el), U && we(U, S), (Fe = O.props && O.props.onVnodeUpdated) && we(
          () => nt(Fe, oe, O, he),
          S
        );
      } else {
        let O;
        const { el: B, props: U } = h, { bm: oe, m: he, parent: ue, root: Fe, type: Re } = f, Qe = en(h);
        Ot(f, !1), oe && Un(oe), !Qe && (O = U && U.onVnodeBeforeMount) && nt(O, ue, h), Ot(f, !0);
        {
          Fe.ce && // @ts-expect-error _def is private
          Fe.ce._def.shadowRoot !== !1 && Fe.ce._injectChildStyle(Re);
          const et = f.subTree = Po(f);
          _(
            null,
            et,
            y,
            A,
            f,
            S,
            x
          ), h.el = et.el;
        }
        if (he && we(he, S), !Qe && (O = U && U.onVnodeMounted)) {
          const et = h;
          we(
            () => nt(O, ue, et),
            S
          );
        }
        (h.shapeFlag & 256 || ue && en(ue.vnode) && ue.vnode.shapeFlag & 256) && f.a && we(f.a, S), f.isMounted = !0, h = y = A = null;
      }
    };
    f.scope.on();
    const L = f.effect = new Ei(I);
    f.scope.off();
    const E = f.update = L.run.bind(L), W = f.job = L.runIfDirty.bind(L);
    W.i = f, W.id = f.uid, L.scheduler = () => co(W), Ot(f, !0), E();
  }, te = (f, h, y) => {
    h.component = f;
    const A = f.vnode.props;
    f.vnode = h, f.next = null, va(f, h.props, A, y), Ca(f, h.children, y), mt(), Eo(f), vt();
  }, ne = (f, h, y, A, S, x, w, I, L = !1) => {
    const E = f && f.children, W = f ? f.shapeFlag : 0, O = h.children, { patchFlag: B, shapeFlag: U } = h;
    if (B > 0) {
      if (B & 128) {
        Be(
          E,
          O,
          y,
          A,
          S,
          x,
          w,
          I,
          L
        );
        return;
      } else if (B & 256) {
        _e(
          E,
          O,
          y,
          A,
          S,
          x,
          w,
          I,
          L
        );
        return;
      }
    }
    U & 8 ? (W & 16 && J(E, S, x), O !== E && c(y, O)) : W & 16 ? U & 16 ? Be(
      E,
      O,
      y,
      A,
      S,
      x,
      w,
      I,
      L
    ) : J(E, S, x, !0) : (W & 8 && c(y, ""), U & 16 && Q(
      O,
      y,
      A,
      S,
      x,
      w,
      I,
      L
    ));
  }, _e = (f, h, y, A, S, x, w, I, L) => {
    f = f || Zt, h = h || Zt;
    const E = f.length, W = h.length, O = Math.min(E, W);
    let B;
    for (B = 0; B < O; B++) {
      const U = h[B] = L ? At(h[B]) : ot(h[B]);
      _(
        f[B],
        U,
        y,
        null,
        S,
        x,
        w,
        I,
        L
      );
    }
    E > W ? J(
      f,
      S,
      x,
      !0,
      !1,
      O
    ) : Q(
      h,
      y,
      A,
      S,
      x,
      w,
      I,
      L,
      O
    );
  }, Be = (f, h, y, A, S, x, w, I, L) => {
    let E = 0;
    const W = h.length;
    let O = f.length - 1, B = W - 1;
    for (; E <= O && E <= B; ) {
      const U = f[E], oe = h[E] = L ? At(h[E]) : ot(h[E]);
      if (jt(U, oe))
        _(
          U,
          oe,
          y,
          null,
          S,
          x,
          w,
          I,
          L
        );
      else
        break;
      E++;
    }
    for (; E <= O && E <= B; ) {
      const U = f[O], oe = h[B] = L ? At(h[B]) : ot(h[B]);
      if (jt(U, oe))
        _(
          U,
          oe,
          y,
          null,
          S,
          x,
          w,
          I,
          L
        );
      else
        break;
      O--, B--;
    }
    if (E > O) {
      if (E <= B) {
        const U = B + 1, oe = U < W ? h[U].el : A;
        for (; E <= B; )
          _(
            null,
            h[E] = L ? At(h[E]) : ot(h[E]),
            y,
            oe,
            S,
            x,
            w,
            I,
            L
          ), E++;
      }
    } else if (E > B)
      for (; E <= O; )
        We(f[E], S, x, !0), E++;
    else {
      const U = E, oe = E, he = /* @__PURE__ */ new Map();
      for (E = oe; E <= B; E++) {
        const je = h[E] = L ? At(h[E]) : ot(h[E]);
        je.key != null && he.set(je.key, E);
      }
      let ue, Fe = 0;
      const Re = B - oe + 1;
      let Qe = !1, et = 0;
      const fn = new Array(Re);
      for (E = 0; E < Re; E++) fn[E] = 0;
      for (E = U; E <= O; E++) {
        const je = f[E];
        if (Fe >= Re) {
          We(je, S, x, !0);
          continue;
        }
        let tt;
        if (je.key != null)
          tt = he.get(je.key);
        else
          for (ue = oe; ue <= B; ue++)
            if (fn[ue - oe] === 0 && jt(je, h[ue])) {
              tt = ue;
              break;
            }
        tt === void 0 ? We(je, S, x, !0) : (fn[tt - oe] = E + 1, tt >= et ? et = tt : Qe = !0, _(
          je,
          h[tt],
          y,
          null,
          S,
          x,
          w,
          I,
          L
        ), Fe++);
      }
      const _o = Qe ? Ea(fn) : Zt;
      for (ue = _o.length - 1, E = Re - 1; E >= 0; E--) {
        const je = oe + E, tt = h[je], bo = h[je + 1], Co = je + 1 < W ? (
          // #13559, fallback to el placeholder for unresolved async component
          bo.el || bo.placeholder
        ) : A;
        fn[E] === 0 ? _(
          null,
          tt,
          y,
          Co,
          S,
          x,
          w,
          I,
          L
        ) : Qe && (ue < 0 || E !== _o[ue] ? Ae(tt, y, Co, 2) : ue--);
      }
    }
  }, Ae = (f, h, y, A, S = null) => {
    const { el: x, type: w, transition: I, children: L, shapeFlag: E } = f;
    if (E & 6) {
      Ae(f.component.subTree, h, y, A);
      return;
    }
    if (E & 128) {
      f.suspense.move(h, y, A);
      return;
    }
    if (E & 64) {
      w.move(f, h, y, Ge);
      return;
    }
    if (w === de) {
      s(x, h, y);
      for (let O = 0; O < L.length; O++)
        Ae(L[O], h, y, A);
      s(f.anchor, h, y);
      return;
    }
    if (w === Ms) {
      T(f, h, y);
      return;
    }
    if (A !== 2 && E & 1 && I)
      if (A === 0)
        I.beforeEnter(x), s(x, h, y), we(() => I.enter(x), S);
      else {
        const { leave: O, delayLeave: B, afterLeave: U } = I, oe = () => {
          f.ctx.isUnmounted ? o(x) : s(x, h, y);
        }, he = () => {
          x._isLeaving && x[dt](
            !0
            /* cancelled */
          ), O(x, () => {
            oe(), U && U();
          });
        };
        B ? B(x, oe, he) : he();
      }
    else
      s(x, h, y);
  }, We = (f, h, y, A = !1, S = !1) => {
    const {
      type: x,
      props: w,
      ref: I,
      children: L,
      dynamicChildren: E,
      shapeFlag: W,
      patchFlag: O,
      dirs: B,
      cacheIndex: U
    } = f;
    if (O === -2 && (S = !1), I != null && (mt(), Sn(I, null, y, f, !0), vt()), U != null && (h.renderCache[U] = void 0), W & 256) {
      h.ctx.deactivate(f);
      return;
    }
    const oe = W & 1 && B, he = !en(f);
    let ue;
    if (he && (ue = w && w.onVnodeBeforeUnmount) && nt(ue, h, f), W & 6)
      V(f.component, y, A);
    else {
      if (W & 128) {
        f.suspense.unmount(y, A);
        return;
      }
      oe && Nt(f, null, h, "beforeUnmount"), W & 64 ? f.type.remove(
        f,
        h,
        y,
        Ge,
        A
      ) : E && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !E.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (x !== de || O > 0 && O & 64) ? J(
        E,
        h,
        y,
        !1,
        !0
      ) : (x === de && O & 384 || !S && W & 16) && J(L, h, y), A && D(f);
    }
    (he && (ue = w && w.onVnodeUnmounted) || oe) && we(() => {
      ue && nt(ue, h, f), oe && Nt(f, null, h, "unmounted");
    }, y);
  }, D = (f) => {
    const { type: h, el: y, anchor: A, transition: S } = f;
    if (h === de) {
      F(y, A);
      return;
    }
    if (h === Ms) {
      b(f);
      return;
    }
    const x = () => {
      o(y), S && !S.persisted && S.afterLeave && S.afterLeave();
    };
    if (f.shapeFlag & 1 && S && !S.persisted) {
      const { leave: w, delayLeave: I } = S, L = () => w(y, x);
      I ? I(f.el, x, L) : L();
    } else
      x();
  }, F = (f, h) => {
    let y;
    for (; f !== h; )
      y = g(f), o(f), f = y;
    o(h);
  }, V = (f, h, y) => {
    const { bum: A, scope: S, job: x, subTree: w, um: I, m: L, a: E } = f;
    Do(L), Do(E), A && Un(A), S.stop(), x && (x.flags |= 8, We(w, f, h, y)), I && we(I, h), we(() => {
      f.isUnmounted = !0;
    }, h);
  }, J = (f, h, y, A = !1, S = !1, x = 0) => {
    for (let w = x; w < f.length; w++)
      We(f[w], h, y, A, S);
  }, le = (f) => {
    if (f.shapeFlag & 6)
      return le(f.component.subTree);
    if (f.shapeFlag & 128)
      return f.suspense.next();
    const h = g(f.anchor || f.el), y = h && h[Ui];
    return y ? g(y) : h;
  };
  let ze = !1;
  const wt = (f, h, y) => {
    f == null ? h._vnode && We(h._vnode, null, null, !0) : _(
      h._vnode || null,
      f,
      h,
      null,
      null,
      null,
      y
    ), h._vnode = f, ze || (ze = !0, Eo(), Bi(), ze = !1);
  }, Ge = {
    p: _,
    um: We,
    m: Ae,
    r: D,
    mt: $,
    mc: Q,
    pc: ne,
    pbc: X,
    n: le,
    o: e
  };
  return {
    render: wt,
    hydrate: void 0,
    createApp: oa(wt)
  };
}
function ks({ type: e, props: t }, n) {
  return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Ot({ effect: e, job: t }, n) {
  n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function xa(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function ho(e, t, n = !1) {
  const s = e.children, o = t.children;
  if (z(s) && z(o))
    for (let i = 0; i < s.length; i++) {
      const r = s[i];
      let l = o[i];
      l.shapeFlag & 1 && !l.dynamicChildren && ((l.patchFlag <= 0 || l.patchFlag === 32) && (l = o[i] = At(o[i]), l.el = r.el), !n && l.patchFlag !== -2 && ho(r, l)), l.type === ms && // avoid cached text nodes retaining detached dom nodes
      l.patchFlag !== -1 && (l.el = r.el), l.type === Me && !l.el && (l.el = r.el);
    }
}
function Ea(e) {
  const t = e.slice(), n = [0];
  let s, o, i, r, l;
  const a = e.length;
  for (s = 0; s < a; s++) {
    const u = e[s];
    if (u !== 0) {
      if (o = n[n.length - 1], e[o] < u) {
        t[s] = o, n.push(s);
        continue;
      }
      for (i = 0, r = n.length - 1; i < r; )
        l = i + r >> 1, e[n[l]] < u ? i = l + 1 : r = l;
      u < e[n[i]] && (i > 0 && (t[s] = n[i - 1]), n[i] = s);
    }
  }
  for (i = n.length, r = n[i - 1]; i-- > 0; )
    n[i] = r, r = t[r];
  return n;
}
function _r(e) {
  const t = e.subTree.component;
  if (t)
    return t.asyncDep && !t.asyncResolved ? t : _r(t);
}
function Do(e) {
  if (e)
    for (let t = 0; t < e.length; t++)
      e[t].flags |= 8;
}
const br = (e) => e.__isSuspense;
function Aa(e, t) {
  t && t.pendingBranch ? z(e) ? t.effects.push(...e) : t.effects.push(e) : Pl(e);
}
const de = Symbol.for("v-fgt"), ms = Symbol.for("v-txt"), Me = Symbol.for("v-cmt"), Ms = Symbol.for("v-stc"), En = [];
let Ve = null;
function N(e = !1) {
  En.push(Ve = e ? null : []);
}
function ka() {
  En.pop(), Ve = En[En.length - 1] || null;
}
let In = 1;
function ns(e, t = !1) {
  In += e, e < 0 && Ve && t && (Ve.hasOnce = !0);
}
function Cr(e) {
  return e.dynamicChildren = In > 0 ? Ve || Zt : null, ka(), In > 0 && Ve && Ve.push(e), e;
}
function R(e, t, n, s, o, i) {
  return Cr(
    v(
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
function _t(e, t, n, s, o) {
  return Cr(
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
function wn(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function jt(e, t) {
  return e.type === t.type && e.key === t.key;
}
const Sr = ({ key: e }) => e ?? null, Gn = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? ye(e) || Le(e) || q(e) ? { i: $e, r: e, k: t, f: !!n } : e : null);
function v(e, t = null, n = null, s = 0, o = null, i = e === de ? 0 : 1, r = !1, l = !1) {
  const a = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && Sr(t),
    ref: t && Gn(t),
    scopeId: zi,
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
  return l ? (po(a, n), i & 128 && e.normalize(a)) : n && (a.shapeFlag |= ye(n) ? 8 : 16), In > 0 && // avoid a block node from tracking itself
  !r && // has current parent block
  Ve && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (a.patchFlag > 0 || i & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  a.patchFlag !== 32 && Ve.push(a), a;
}
const ve = Ma;
function Ma(e, t = null, n = null, s = 0, o = null, i = !1) {
  if ((!e || e === Yl) && (e = Me), wn(e)) {
    const l = It(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && po(l, n), In > 0 && !i && Ve && (l.shapeFlag & 6 ? Ve[Ve.indexOf(e)] = l : Ve.push(l)), l.patchFlag = -2, l;
  }
  if (Da(e) && (e = e.__vccOpts), t) {
    t = $a(t);
    let { class: l, style: a } = t;
    l && !ye(l) && (t.class = be(l)), me(a) && (lo(a) && !z(a) && (a = Ee({}, a)), t.style = gt(a));
  }
  const r = ye(e) ? 1 : br(e) ? 128 : Ki(e) ? 64 : me(e) ? 4 : q(e) ? 2 : 0;
  return v(
    e,
    t,
    n,
    s,
    o,
    r,
    i,
    !0
  );
}
function $a(e) {
  return e ? lo(e) || hr(e) ? Ee({}, e) : e : null;
}
function It(e, t, n = !1, s = !1) {
  const { props: o, ref: i, patchFlag: r, children: l, transition: a } = e, u = t ? La(o || {}, t) : o, c = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: u,
    key: u && Sr(u),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && i ? z(i) ? i.concat(Gn(t)) : [i, Gn(t)] : Gn(t)
    ) : i,
    scopeId: e.scopeId,
    slotScopeIds: e.slotScopeIds,
    children: l,
    target: e.target,
    targetStart: e.targetStart,
    targetAnchor: e.targetAnchor,
    staticCount: e.staticCount,
    shapeFlag: e.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: t && e.type !== de ? r === -1 ? 16 : r | 16 : r,
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
    ssContent: e.ssContent && It(e.ssContent),
    ssFallback: e.ssFallback && It(e.ssFallback),
    placeholder: e.placeholder,
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce
  };
  return a && s && Ln(
    c,
    a.clone(c)
  ), c;
}
function Mt(e = " ", t = 0) {
  return ve(ms, null, e, t);
}
function xe(e = "", t = !1) {
  return t ? (N(), _t(Me, null, e)) : ve(Me, null, e);
}
function ot(e) {
  return e == null || typeof e == "boolean" ? ve(Me) : z(e) ? ve(
    de,
    null,
    // #3666, avoid reference pollution when reusing vnode
    e.slice()
  ) : wn(e) ? At(e) : ve(ms, null, String(e));
}
function At(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : It(e);
}
function po(e, t) {
  let n = 0;
  const { shapeFlag: s } = e;
  if (t == null)
    t = null;
  else if (z(t))
    n = 16;
  else if (typeof t == "object")
    if (s & 65) {
      const o = t.default;
      o && (o._c && (o._d = !1), po(e, o()), o._c && (o._d = !0));
      return;
    } else {
      n = 32;
      const o = t._;
      !o && !hr(t) ? t._ctx = $e : o === 3 && $e && ($e.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else q(t) ? (t = { default: t, _ctx: $e }, n = 32) : (t = String(t), s & 64 ? (n = 16, t = [Mt(t)]) : n = 8);
  e.children = t, e.shapeFlag |= n;
}
function La(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const s = e[n];
    for (const o in s)
      if (o === "class")
        t.class !== s.class && (t.class = be([t.class, s.class]));
      else if (o === "style")
        t.style = gt([t.style, s.style]);
      else if (ls(o)) {
        const i = t[o], r = s[o];
        r && i !== r && !(z(i) && i.includes(r)) && (t[o] = i ? [].concat(i, r) : r);
      } else o !== "" && (t[o] = s[o]);
  }
  return t;
}
function nt(e, t, n, s = null) {
  Ye(e, t, 7, [
    n,
    s
  ]);
}
const Ia = lr();
let wa = 0;
function Na(e, t, n) {
  const s = e.type, o = (t ? t.appContext : e.appContext) || Ia, i = {
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
    scope: new ol(
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
    propsOptions: gr(s, o),
    emitsOptions: ur(s, o),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: fe,
    // inheritAttrs
    inheritAttrs: s.inheritAttrs,
    // state
    ctx: fe,
    data: fe,
    props: fe,
    attrs: fe,
    slots: fe,
    refs: fe,
    setupState: fe,
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
  return i.ctx = { _: i }, i.root = t ? t.root : i, i.emit = ua.bind(null, i), e.ce && e.ce(i), i;
}
let Oe = null;
const Tr = () => Oe || $e;
let ss, Us;
{
  const e = us(), t = (n, s) => {
    let o;
    return (o = e[n]) || (o = e[n] = []), o.push(s), (i) => {
      o.length > 1 ? o.forEach((r) => r(i)) : o[0](i);
    };
  };
  ss = t(
    "__VUE_INSTANCE_SETTERS__",
    (n) => Oe = n
  ), Us = t(
    "__VUE_SSR_SETTERS__",
    (n) => Nn = n
  );
}
const Rn = (e) => {
  const t = Oe;
  return ss(e), e.scope.on(), () => {
    e.scope.off(), ss(t);
  };
}, jo = () => {
  Oe && Oe.scope.off(), ss(null);
};
function xr(e) {
  return e.vnode.shapeFlag & 4;
}
let Nn = !1;
function Oa(e, t = !1, n = !1) {
  t && Us(t);
  const { props: s, children: o } = e.vnode, i = xr(e);
  ma(e, s, i, t), ba(e, o, n || t);
  const r = i ? Pa(e, t) : void 0;
  return t && Us(!1), r;
}
function Pa(e, t) {
  const n = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Zl);
  const { setup: s } = n;
  if (s) {
    mt();
    const o = e.setupContext = s.length > 1 ? Ra(e) : null, i = Rn(e), r = Fn(
      s,
      e,
      0,
      [
        e.props,
        o
      ]
    ), l = vi(r);
    if (vt(), i(), (l || e.sp) && !en(e) && tr(e), l) {
      if (r.then(jo, jo), t)
        return r.then((a) => {
          Ho(e, a);
        }).catch((a) => {
          ds(a, e, 0);
        });
      e.asyncDep = r;
    } else
      Ho(e, r);
  } else
    Er(e);
}
function Ho(e, t, n) {
  q(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : me(t) && (e.setupState = ji(t)), Er(e);
}
function Er(e, t, n) {
  const s = e.type;
  e.render || (e.render = s.render || rt);
  {
    const o = Rn(e);
    mt();
    try {
      Xl(e);
    } finally {
      vt(), o();
    }
  }
}
const Fa = {
  get(e, t) {
    return ke(e, "get", ""), e[t];
  }
};
function Ra(e) {
  const t = (n) => {
    e.exposed = n || {};
  };
  return {
    attrs: new Proxy(e.attrs, Fa),
    slots: e.slots,
    emit: e.emit,
    expose: t
  };
}
function vs(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(ji(El(e.exposed)), {
    get(t, n) {
      if (n in t)
        return t[n];
      if (n in xn)
        return xn[n](e);
    },
    has(t, n) {
      return n in t || n in xn;
    }
  })) : e.proxy;
}
function Da(e) {
  return q(e) && "__vccOpts" in e;
}
const Y = (e, t) => Ll(e, t, Nn);
function Ar(e, t, n) {
  try {
    ns(-1);
    const s = arguments.length;
    return s === 2 ? me(t) && !z(t) ? wn(t) ? ve(e, null, [t]) : ve(e, t) : ve(e, null, t) : (s > 3 ? n = Array.prototype.slice.call(arguments, 2) : s === 3 && wn(n) && (n = [n]), ve(e, t, n));
  } finally {
    ns(1);
  }
}
const ja = "3.5.25";
/**
* @vue/runtime-dom v3.5.25
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let Ks;
const Vo = typeof window < "u" && window.trustedTypes;
if (Vo)
  try {
    Ks = /* @__PURE__ */ Vo.createPolicy("vue", {
      createHTML: (e) => e
    });
  } catch {
  }
const kr = Ks ? (e) => Ks.createHTML(e) : (e) => e, Ha = "http://www.w3.org/2000/svg", Va = "http://www.w3.org/1998/Math/MathML", ft = typeof document < "u" ? document : null, Bo = ft && /* @__PURE__ */ ft.createElement("template"), Ba = {
  insert: (e, t, n) => {
    t.insertBefore(e, n || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, n, s) => {
    const o = t === "svg" ? ft.createElementNS(Ha, e) : t === "mathml" ? ft.createElementNS(Va, e) : n ? ft.createElement(e, { is: n }) : ft.createElement(e);
    return e === "select" && s && s.multiple != null && o.setAttribute("multiple", s.multiple), o;
  },
  createText: (e) => ft.createTextNode(e),
  createComment: (e) => ft.createComment(e),
  setText: (e, t) => {
    e.nodeValue = t;
  },
  setElementText: (e, t) => {
    e.textContent = t;
  },
  parentNode: (e) => e.parentNode,
  nextSibling: (e) => e.nextSibling,
  querySelector: (e) => ft.querySelector(e),
  setScopeId(e, t) {
    e.setAttribute(t, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(e, t, n, s, o, i) {
    const r = n ? n.previousSibling : t.lastChild;
    if (o && (o === i || o.nextSibling))
      for (; t.insertBefore(o.cloneNode(!0), n), !(o === i || !(o = o.nextSibling)); )
        ;
    else {
      Bo.innerHTML = kr(
        s === "svg" ? `<svg>${e}</svg>` : s === "mathml" ? `<math>${e}</math>` : e
      );
      const l = Bo.content;
      if (s === "svg" || s === "mathml") {
        const a = l.firstChild;
        for (; a.firstChild; )
          l.appendChild(a.firstChild);
        l.removeChild(a);
      }
      t.insertBefore(l, n);
    }
    return [
      // first
      r ? r.nextSibling : t.firstChild,
      // last
      n ? n.previousSibling : t.lastChild
    ];
  }
}, Tt = "transition", hn = "animation", On = Symbol("_vtc"), Mr = {
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
}, Wa = /* @__PURE__ */ Ee(
  {},
  Yi,
  Mr
), za = (e) => (e.displayName = "Transition", e.props = Wa, e), Gs = /* @__PURE__ */ za(
  (e, { slots: t }) => Ar(jl, Ua(e), t)
), Pt = (e, t = []) => {
  z(e) ? e.forEach((n) => n(...t)) : e && e(...t);
}, Wo = (e) => e ? z(e) ? e.some((t) => t.length > 1) : e.length > 1 : !1;
function Ua(e) {
  const t = {};
  for (const P in e)
    P in Mr || (t[P] = e[P]);
  if (e.css === !1)
    return t;
  const {
    name: n = "v",
    type: s,
    duration: o,
    enterFromClass: i = `${n}-enter-from`,
    enterActiveClass: r = `${n}-enter-active`,
    enterToClass: l = `${n}-enter-to`,
    appearFromClass: a = i,
    appearActiveClass: u = r,
    appearToClass: c = l,
    leaveFromClass: d = `${n}-leave-from`,
    leaveActiveClass: g = `${n}-leave-active`,
    leaveToClass: m = `${n}-leave-to`
  } = e, C = Ka(o), _ = C && C[0], k = C && C[1], {
    onBeforeEnter: M,
    onEnter: p,
    onEnterCancelled: T,
    onLeave: b,
    onLeaveCancelled: j,
    onBeforeAppear: K = M,
    onAppear: se = p,
    onAppearCancelled: Q = T
  } = t, H = (P, ce, $, ee) => {
    P._enterCancelled = ee, Ft(P, ce ? c : l), Ft(P, ce ? u : r), $ && $();
  }, X = (P, ce) => {
    P._isLeaving = !1, Ft(P, d), Ft(P, m), Ft(P, g), ce && ce();
  }, re = (P) => (ce, $) => {
    const ee = P ? se : p, Z = () => H(ce, P, $);
    Pt(ee, [ce, Z]), zo(() => {
      Ft(ce, P ? a : i), ut(ce, P ? c : l), Wo(ee) || Uo(ce, s, _, Z);
    });
  };
  return Ee(t, {
    onBeforeEnter(P) {
      Pt(M, [P]), ut(P, i), ut(P, r);
    },
    onBeforeAppear(P) {
      Pt(K, [P]), ut(P, a), ut(P, u);
    },
    onEnter: re(!1),
    onAppear: re(!0),
    onLeave(P, ce) {
      P._isLeaving = !0;
      const $ = () => X(P, ce);
      ut(P, d), P._enterCancelled ? (ut(P, g), qo(P)) : (qo(P), ut(P, g)), zo(() => {
        P._isLeaving && (Ft(P, d), ut(P, m), Wo(b) || Uo(P, s, k, $));
      }), Pt(b, [P, $]);
    },
    onEnterCancelled(P) {
      H(P, !1, void 0, !0), Pt(T, [P]);
    },
    onAppearCancelled(P) {
      H(P, !0, void 0, !0), Pt(Q, [P]);
    },
    onLeaveCancelled(P) {
      X(P), Pt(j, [P]);
    }
  });
}
function Ka(e) {
  if (e == null)
    return null;
  if (me(e))
    return [$s(e.enter), $s(e.leave)];
  {
    const t = $s(e);
    return [t, t];
  }
}
function $s(e) {
  return Zr(e);
}
function ut(e, t) {
  t.split(/\s+/).forEach((n) => n && e.classList.add(n)), (e[On] || (e[On] = /* @__PURE__ */ new Set())).add(t);
}
function Ft(e, t) {
  t.split(/\s+/).forEach((s) => s && e.classList.remove(s));
  const n = e[On];
  n && (n.delete(t), n.size || (e[On] = void 0));
}
function zo(e) {
  requestAnimationFrame(() => {
    requestAnimationFrame(e);
  });
}
let Ga = 0;
function Uo(e, t, n, s) {
  const o = e._endId = ++Ga, i = () => {
    o === e._endId && s();
  };
  if (n != null)
    return setTimeout(i, n);
  const { type: r, timeout: l, propCount: a } = qa(e, t);
  if (!r)
    return s();
  const u = r + "end";
  let c = 0;
  const d = () => {
    e.removeEventListener(u, g), i();
  }, g = (m) => {
    m.target === e && ++c >= a && d();
  };
  setTimeout(() => {
    c < a && d();
  }, l + 1), e.addEventListener(u, g);
}
function qa(e, t) {
  const n = window.getComputedStyle(e), s = (C) => (n[C] || "").split(", "), o = s(`${Tt}Delay`), i = s(`${Tt}Duration`), r = Ko(o, i), l = s(`${hn}Delay`), a = s(`${hn}Duration`), u = Ko(l, a);
  let c = null, d = 0, g = 0;
  t === Tt ? r > 0 && (c = Tt, d = r, g = i.length) : t === hn ? u > 0 && (c = hn, d = u, g = a.length) : (d = Math.max(r, u), c = d > 0 ? r > u ? Tt : hn : null, g = c ? c === Tt ? i.length : a.length : 0);
  const m = c === Tt && /\b(?:transform|all)(?:,|$)/.test(
    s(`${Tt}Property`).toString()
  );
  return {
    type: c,
    timeout: d,
    propCount: g,
    hasTransform: m
  };
}
function Ko(e, t) {
  for (; e.length < t.length; )
    e = e.concat(e);
  return Math.max(...t.map((n, s) => Go(n) + Go(e[s])));
}
function Go(e) {
  return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function qo(e) {
  return (e ? e.ownerDocument : document).body.offsetHeight;
}
function Ja(e, t, n) {
  const s = e[On];
  s && (t = (t ? [t, ...s] : [...s]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
const os = Symbol("_vod"), $r = Symbol("_vsh"), Jo = {
  // used for prop mismatch check during hydration
  name: "show",
  beforeMount(e, { value: t }, { transition: n }) {
    e[os] = e.style.display === "none" ? "" : e.style.display, n && t ? n.beforeEnter(e) : pn(e, t);
  },
  mounted(e, { value: t }, { transition: n }) {
    n && t && n.enter(e);
  },
  updated(e, { value: t, oldValue: n }, { transition: s }) {
    !t != !n && (s ? t ? (s.beforeEnter(e), pn(e, !0), s.enter(e)) : s.leave(e, () => {
      pn(e, !1);
    }) : pn(e, t));
  },
  beforeUnmount(e, { value: t }) {
    pn(e, t);
  }
};
function pn(e, t) {
  e.style.display = t ? e[os] : "none", e[$r] = !t;
}
const Ya = Symbol(""), Za = /(?:^|;)\s*display\s*:/;
function Xa(e, t, n) {
  const s = e.style, o = ye(n);
  let i = !1;
  if (n && !o) {
    if (t)
      if (ye(t))
        for (const r of t.split(";")) {
          const l = r.slice(0, r.indexOf(":")).trim();
          n[l] == null && qn(s, l, "");
        }
      else
        for (const r in t)
          n[r] == null && qn(s, r, "");
    for (const r in n)
      r === "display" && (i = !0), qn(s, r, n[r]);
  } else if (o) {
    if (t !== n) {
      const r = s[Ya];
      r && (n += ";" + r), s.cssText = n, i = Za.test(n);
    }
  } else t && e.removeAttribute("style");
  os in e && (e[os] = i ? s.display : "", e[$r] && (s.display = "none"));
}
const Yo = /\s*!important$/;
function qn(e, t, n) {
  if (z(n))
    n.forEach((s) => qn(e, t, s));
  else if (n == null && (n = ""), t.startsWith("--"))
    e.setProperty(t, n);
  else {
    const s = Qa(e, t);
    Yo.test(n) ? e.setProperty(
      Ut(s),
      n.replace(Yo, ""),
      "important"
    ) : e[s] = n;
  }
}
const Zo = ["Webkit", "Moz", "ms"], Ls = {};
function Qa(e, t) {
  const n = Ls[t];
  if (n)
    return n;
  let s = Lt(t);
  if (s !== "filter" && s in e)
    return Ls[t] = s;
  s = bi(s);
  for (let o = 0; o < Zo.length; o++) {
    const i = Zo[o] + s;
    if (i in e)
      return Ls[t] = i;
  }
  return t;
}
const Xo = "http://www.w3.org/1999/xlink";
function Qo(e, t, n, s, o, i = sl(t)) {
  s && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Xo, t.slice(6, t.length)) : e.setAttributeNS(Xo, t, n) : n == null || i && !Si(n) ? e.removeAttribute(t) : e.setAttribute(
    t,
    i ? "" : bt(n) ? String(n) : n
  );
}
function ei(e, t, n, s, o) {
  if (t === "innerHTML" || t === "textContent") {
    n != null && (e[t] = t === "innerHTML" ? kr(n) : n);
    return;
  }
  const i = e.tagName;
  if (t === "value" && i !== "PROGRESS" && // custom elements may use _value internally
  !i.includes("-")) {
    const l = i === "OPTION" ? e.getAttribute("value") || "" : e.value, a = n == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      e.type === "checkbox" ? "on" : ""
    ) : String(n);
    (l !== a || !("_value" in e)) && (e.value = a), n == null && e.removeAttribute(t), e._value = n;
    return;
  }
  let r = !1;
  if (n === "" || n == null) {
    const l = typeof e[t];
    l === "boolean" ? n = Si(n) : n == null && l === "string" ? (n = "", r = !0) : l === "number" && (n = 0, r = !0);
  }
  try {
    e[t] = n;
  } catch {
  }
  r && e.removeAttribute(o || t);
}
function Jt(e, t, n, s) {
  e.addEventListener(t, n, s);
}
function ec(e, t, n, s) {
  e.removeEventListener(t, n, s);
}
const ti = Symbol("_vei");
function tc(e, t, n, s, o = null) {
  const i = e[ti] || (e[ti] = {}), r = i[t];
  if (s && r)
    r.value = s;
  else {
    const [l, a] = nc(t);
    if (s) {
      const u = i[t] = ic(
        s,
        o
      );
      Jt(e, l, u, a);
    } else r && (ec(e, l, r, a), i[t] = void 0);
  }
}
const ni = /(?:Once|Passive|Capture)$/;
function nc(e) {
  let t;
  if (ni.test(e)) {
    t = {};
    let s;
    for (; s = e.match(ni); )
      e = e.slice(0, e.length - s[0].length), t[s[0].toLowerCase()] = !0;
  }
  return [e[2] === ":" ? e.slice(3) : Ut(e.slice(2)), t];
}
let Is = 0;
const sc = /* @__PURE__ */ Promise.resolve(), oc = () => Is || (sc.then(() => Is = 0), Is = Date.now());
function ic(e, t) {
  const n = (s) => {
    if (!s._vts)
      s._vts = Date.now();
    else if (s._vts <= n.attached)
      return;
    Ye(
      rc(s, n.value),
      t,
      5,
      [s]
    );
  };
  return n.value = e, n.attached = oc(), n;
}
function rc(e, t) {
  if (z(t)) {
    const n = e.stopImmediatePropagation;
    return e.stopImmediatePropagation = () => {
      n.call(e), e._stopped = !0;
    }, t.map(
      (s) => (o) => !o._stopped && s && s(o)
    );
  } else
    return t;
}
const si = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // lowercase letter
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, lc = (e, t, n, s, o, i) => {
  const r = o === "svg";
  t === "class" ? Ja(e, s, r) : t === "style" ? Xa(e, n, s) : ls(t) ? Zs(t) || tc(e, t, n, s, i) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : ac(e, t, s, r)) ? (ei(e, t, s), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Qo(e, t, s, r, i, t !== "value")) : /* #11081 force set props for possible async custom element */ e._isVueCE && (/[A-Z]/.test(t) || !ye(s)) ? ei(e, Lt(t), s, i, t) : (t === "true-value" ? e._trueValue = s : t === "false-value" && (e._falseValue = s), Qo(e, t, s, r));
};
function ac(e, t, n, s) {
  if (s)
    return !!(t === "innerHTML" || t === "textContent" || t in e && si(t) && q(n));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (t === "width" || t === "height") {
    const o = e.tagName;
    if (o === "IMG" || o === "VIDEO" || o === "CANVAS" || o === "SOURCE")
      return !1;
  }
  return si(t) && ye(n) ? !1 : t in e;
}
const oi = (e) => {
  const t = e.props["onUpdate:modelValue"] || !1;
  return z(t) ? (n) => Un(t, n) : t;
};
function cc(e) {
  e.target.composing = !0;
}
function ii(e) {
  const t = e.target;
  t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
const ws = Symbol("_assign");
function ri(e, t, n) {
  return t && (e = e.trim()), n && (e = eo(e)), e;
}
const kt = {
  created(e, { modifiers: { lazy: t, trim: n, number: s } }, o) {
    e[ws] = oi(o);
    const i = s || o.props && o.props.type === "number";
    Jt(e, t ? "change" : "input", (r) => {
      r.target.composing || e[ws](ri(e.value, n, i));
    }), (n || i) && Jt(e, "change", () => {
      e.value = ri(e.value, n, i);
    }), t || (Jt(e, "compositionstart", cc), Jt(e, "compositionend", ii), Jt(e, "change", ii));
  },
  // set value on mounted so it's after min/max for type="range"
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: s, trim: o, number: i } }, r) {
    if (e[ws] = oi(r), e.composing) return;
    const l = (i || e.type === "number") && !/^0\d/.test(e.value) ? eo(e.value) : e.value, a = t ?? "";
    l !== a && (document.activeElement === e && e.type !== "range" && (s && t === n || o && e.value.trim() === a) || (e.value = a));
  }
}, uc = ["ctrl", "shift", "alt", "meta"], fc = {
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
  exact: (e, t) => uc.some((n) => e[`${n}Key`] && !t.includes(n))
}, Pe = (e, t) => {
  const n = e._withMods || (e._withMods = {}), s = t.join(".");
  return n[s] || (n[s] = ((o, ...i) => {
    for (let r = 0; r < t.length; r++) {
      const l = fc[t[r]];
      if (l && l(o, t)) return;
    }
    return e(o, ...i);
  }));
}, dc = /* @__PURE__ */ Ee({ patchProp: lc }, Ba);
let li;
function hc() {
  return li || (li = Sa(dc));
}
const Lr = ((...e) => {
  const t = hc().createApp(...e), { mount: n } = t;
  return t.mount = (s) => {
    const o = gc(s);
    if (!o) return;
    const i = t._component;
    !q(i) && !i.render && !i.template && (i.template = o.innerHTML), o.nodeType === 1 && (o.textContent = "");
    const r = n(o, !1, pc(o));
    return o instanceof Element && (o.removeAttribute("v-cloak"), o.setAttribute("data-v-app", "")), r;
  }, t;
});
function pc(e) {
  if (e instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function gc(e) {
  return ye(e) ? document.querySelector(e) : e;
}
function Ir(e) {
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
function mc(e) {
  const t = Ir(e);
  return t ? t.querySelector(".lg-node-widgets") : null;
}
function vc(e) {
  return Number.isFinite(e) ? Math.max(0, Math.min(1, e)) : 0;
}
function yc(e) {
  const t = e.trim().match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+\s*)?\)$/i);
  return t ? { r: Number(t[1]), g: Number(t[2]), b: Number(t[3]) } : null;
}
function _c(e) {
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
function Ns(e, t) {
  const n = vc(t);
  return `rgba(${e.r}, ${e.g}, ${e.b}, ${n})`;
}
function ai(e) {
  const t = e.trim().toLowerCase();
  return t === "transparent" || t === "rgba(0, 0, 0, 0)" || t === "rgba(0,0,0,0)";
}
function bc(e) {
  try {
    const t = getComputedStyle(e), n = [
      "--node-color",
      "--comfy-node-color",
      "--lg-node-color",
      "--node-accent",
      "--node-accent-color"
    ];
    for (const i of n) {
      const r = t.getPropertyValue(i).trim();
      if (r) return r;
    }
    const s = e.querySelector(".lg-node-header") ?? e.querySelector(".lg-node-titlebar") ?? e.querySelector(".lg-node-title");
    if (s) {
      const i = getComputedStyle(s).backgroundColor;
      if (i && !ai(i)) return i;
    }
    const o = t.borderTopColor || t.borderColor;
    if (o && !ai(o)) return o;
  } catch {
  }
  return null;
}
const Cc = { class: "header__title" }, Sc = ["title"], Tc = {
  key: 1,
  class: "header-actions"
}, xc = { class: "body-wrap" }, Ec = /* @__PURE__ */ Ze({
  __name: "HikazeNodeFrame",
  props: {
    nodeId: {},
    title: {},
    error: {}
  },
  setup(e) {
    const t = e, n = G(null);
    let s = null, o = null;
    const i = G(null), r = Y(() => {
      const d = i.value;
      return d ? yc(d) ?? _c(d) : null;
    }), l = Y(() => {
      const d = r.value;
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
        border: `1px solid ${d ? Ns(d, 0.65) : "rgba(255, 255, 255, 0.08)"}`,
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
    }), a = Y(() => {
      const d = r.value, g = d ? Ns(d, 0.22) : "rgba(255, 255, 255, 0.06)", m = d ? Ns(d, 0.35) : "rgba(255, 255, 255, 0.1)";
      return {
        background: g,
        border: `1px solid ${m}`
      };
    });
    function u(d = 100) {
      const g = mc(t.nodeId);
      if (g) {
        g.style.position = g.style.position || "relative", g.style.width = "100%", g.style.height = "100%", n.value = g, c();
        return;
      }
      d > 0 && (s = window.setTimeout(() => u(d - 1), 100));
    }
    function c() {
      const d = Ir(t.nodeId);
      d && (i.value = bc(d), o || (o = new MutationObserver(() => c()), o.observe(d, { attributes: !0, attributeFilter: ["style", "class"] })));
    }
    return Kt(() => {
      u();
    }), un(() => {
      s && clearTimeout(s), o && o.disconnect();
    }), (d, g) => n.value ? (N(), _t(qi, {
      key: 0,
      to: n.value
    }, [
      v("div", {
        class: "hikaze-node-frame",
        style: gt(l.value),
        onPointerdown: g[0] || (g[0] = Pe(() => {
        }, ["stop"])),
        onPointermove: g[1] || (g[1] = Pe(() => {
        }, ["stop"])),
        onPointerup: g[2] || (g[2] = Pe(() => {
        }, ["stop"])),
        onContextmenu: g[3] || (g[3] = Pe(() => {
        }, ["stop"]))
      }, [
        e.title ? (N(), R("div", {
          key: 0,
          class: "header",
          style: gt(a.value)
        }, [
          v("div", Cc, ge(e.title), 1),
          e.error ? (N(), R("div", {
            key: 0,
            class: "header__error",
            title: e.error
          }, ge(e.error), 9, Sc)) : xe("", !0),
          d.$slots["header-actions"] ? (N(), R("div", Tc, [
            Tn(d.$slots, "header-actions", {}, void 0)
          ])) : xe("", !0)
        ], 4)) : xe("", !0),
        v("div", xc, [
          Tn(d.$slots, "default", {}, void 0)
        ])
      ], 36)
    ], 8, ["to"])) : xe("", !0);
  }
}), Xe = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, o] of t)
    n[s] = o;
  return n;
}, wr = /* @__PURE__ */ Xe(Ec, [["__scopeId", "data-v-476df293"]]), Ac = { class: "hikaze-checkpoint-content" }, kc = ["title"], Mc = { class: "value" }, $c = /* @__PURE__ */ Ze({
  __name: "HikazeCheckpointLoaderOverlay",
  props: {
    nodeId: {},
    payload: {},
    commit: { type: Function },
    title: {}
  },
  setup(e) {
    const t = e, n = nn("openManager", null), s = Y(() => {
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
      const r = i.ckpt_path, l = s.value;
      r && r !== l && t.commit(JSON.stringify({ ckpt_path: r }));
    }
    return (i, r) => (N(), _t(wr, {
      "node-id": e.nodeId,
      title: "Hikaze Checkpoint Loader"
    }, {
      "header-actions": at(() => [
        v("button", {
          type: "button",
          class: "btn header-action-btn",
          onClick: o
        }, " Select Checkpoint... ")
      ]),
      default: at(() => [
        v("div", Ac, [
          v("div", {
            class: "path-display",
            title: s.value
          }, [
            r[0] || (r[0] = v("div", { class: "label" }, "Current Path:", -1)),
            v("div", Mc, ge(s.value || "(No path selected)"), 1)
          ], 8, kc)
        ])
      ]),
      _: 1
    }, 8, ["node-id"]));
  }
}), Lc = /* @__PURE__ */ Xe($c, [["__scopeId", "data-v-4552b61a"]]), is = G(!1), go = G(null);
let Jn = null;
const gn = Yn({
  isOpen: is,
  options: go
});
function Ic(e) {
  return is.value && Yt(null), is.value = !0, go.value = e, new Promise((t) => {
    Jn = t;
  });
}
function Yt(e) {
  is.value = !1, go.value = null, Jn && (Jn(e), Jn = null);
}
const Os = "hikaze_payload";
class zt {
  constructor(t) {
    Ce(this, "node");
    /** Reactive copy of the `hikaze_payload` widget value. */
    Ce(this, "payloadRef", G("{}"));
    Ce(this, "injectedMode", null);
    Ce(this, "cleanupFns", []);
    Ce(this, "vueApp", null);
    Ce(this, "vueHost", null);
    Ce(this, "vueMountRetryTimer", null);
    Ce(this, "onWidgetChangedOriginal", null);
    Ce(this, "onWidgetChangedWrapper", null);
    Ce(this, "hydrationSyncTimers", []);
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
    s.mouse = (i, r, l) => {
      if (i.type === "pointerdown" || i.type === "mousedown") {
        const a = String(s.value ?? ""), u = n(a);
        return u !== null && u !== a && this.commitPayload(u), !0;
      }
      return o ? o.call(s, i, r, l) : void 0;
    }, this.cleanupFns.push(() => {
      s.mouse = o;
    });
  }
  setWidgetValue(t, n) {
    var o, i, r;
    const s = t == null ? void 0 : t.value;
    if (n !== s) {
      t.value = n;
      try {
        (o = t.callback) == null || o.call(t, t.value);
      } catch {
      }
      try {
        (r = (i = this.node) == null ? void 0 : i.onWidgetChanged) == null || r.call(i, t.name ?? "", t.value, s, t);
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
    const n = this.findWidget(Os);
    if (!n) return;
    const s = String(t ?? "{}");
    this.setWidgetValue(n, s), this.payloadRef.value = s;
  }
  // --- Widget Sync Logic ---
  ensureWidgetChangeHook() {
    const t = this.node;
    !t || typeof t != "object" || this.onWidgetChangedWrapper || (this.onWidgetChangedOriginal = t.onWidgetChanged, this.onWidgetChangedWrapper = (n, s, o, i) => {
      n === Os && (this.payloadRef.value = String(s ?? "{}"));
      const r = this.onWidgetChangedOriginal;
      if (typeof r == "function")
        try {
          return r.call(t, n, s, o, i);
        } catch {
        }
    }, t.onWidgetChanged = this.onWidgetChangedWrapper);
  }
  unhookWidgetChange() {
    const t = this.node;
    !t || typeof t != "object" || (t.onWidgetChanged === this.onWidgetChangedWrapper && (t.onWidgetChanged = this.onWidgetChangedOriginal), this.onWidgetChangedOriginal = null, this.onWidgetChangedWrapper = null);
  }
  syncFromWidget() {
    const t = this.findWidget(Os);
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
    var r;
    const s = (r = this.node) == null ? void 0 : r.id;
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
    const i = Lr({
      render: () => Ar(this.getComponent(), {
        nodeId: s,
        title: this.getTitle(),
        // Pass title to Overlay if it wraps Frame
        ...this.getComponentProps(),
        // Standard props passed to all child components
        payload: this.payloadRef,
        commit: (l) => this.commitPayload(l)
      })
    });
    i.provide("openManager", Ic), i.mount(o), this.vueApp = i;
  }
}
Ce(zt, "registry", /* @__PURE__ */ new Map());
const wc = "HikazeCheckpointLoader";
class Nc extends zt {
  getComponent() {
    return Lc;
  }
}
zt.register(wc, Nc);
const Oc = ["title"], Pc = ["value"], Fc = ["value"], Rc = { class: "center-chk" }, Dc = ["checked"], jc = /* @__PURE__ */ Ze({
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
    const n = e, s = Y(
      () => {
        var u;
        return n.name && ((u = n.name.split(/[\\/]/).pop()) == null ? void 0 : u.replace(".safetensors", "")) || "";
      }
    ), o = t;
    function i(u) {
      const c = u.target;
      o("update:strength_model", n.seq, c.valueAsNumber);
    }
    function r(u) {
      const c = u.target;
      o("update:strength_clip", n.seq, c.valueAsNumber);
    }
    function l(u) {
      o("update:enabled", n.seq, u.target.checked);
    }
    function a(u) {
      o("update:delete", n.seq);
    }
    return (u, c) => (N(), R("tr", null, [
      v("td", null, [
        v("button", {
          class: "del-btn",
          onClick: a
        }, "🗑")
      ]),
      v("td", null, ge(n.seq + 1), 1),
      v("td", {
        title: s.value,
        class: "lora-name"
      }, ge(s.value), 9, Oc),
      v("td", null, [
        v("input", {
          class: "hikaze-reset-input",
          type: "number",
          value: n.strength_model,
          step: "0.05",
          onInput: i
        }, null, 40, Pc)
      ]),
      v("td", null, [
        v("input", {
          class: "hikaze-reset-input",
          type: "number",
          value: n.strength_clip,
          step: "0.05",
          onInput: r
        }, null, 40, Fc)
      ]),
      v("td", Rc, [
        v("input", {
          class: "hikaze-reset-chk",
          type: "checkbox",
          checked: n.enabled,
          onInput: l
        }, null, 40, Dc)
      ])
    ]));
  }
}), Hc = /* @__PURE__ */ Xe(jc, [["__scopeId", "data-v-771e698c"]]);
function Nr(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function mn(e) {
  return typeof e == "string" ? e : null;
}
function Dt(e) {
  if (typeof e == "number" && Number.isFinite(e)) return e;
  if (typeof e == "string") {
    const t = Number(e);
    if (Number.isFinite(t)) return t;
  }
  return null;
}
function ci(e) {
  return typeof e == "boolean" ? e : null;
}
function Or(e) {
  if (!Nr(e)) return null;
  const t = mn(e.name) ?? "", n = mn(e.full_path) ?? mn(e.fullPath) ?? mn(e.path) ?? "", s = Dt(e.strength_model) ?? Dt(e.MStrength) ?? Dt(e.strengthModel) ?? 1, o = Dt(e.strength_clip) ?? Dt(e.CStrength) ?? Dt(e.strengthClip) ?? 1, i = ci(e.enabled) ?? ci(e.toggleOn) ?? !0, r = mn(e.sha256) ?? "";
  return {
    name: t,
    full_path: n,
    strength_model: s,
    strength_clip: o,
    sha256: r,
    enabled: i
  };
}
function Pr() {
  return { version: 2, loras: [] };
}
function Vc(e) {
  let t = 2, n = null;
  if (Array.isArray(e))
    n = e;
  else if (Nr(e)) {
    const o = Dt(e.version);
    o != null && (t = o), n = e.loras ?? e.LoRAs ?? e.LoRAList ?? e.loRAList ?? null;
  }
  if (!Array.isArray(n))
    return { version: t, loras: [] };
  const s = [];
  for (const o of n) {
    const i = Or(o);
    i && s.push(i);
  }
  return { version: t, loras: s };
}
function Fr(e) {
  const t = e.trim();
  if (!t) return Pr();
  let n;
  try {
    n = JSON.parse(t);
  } catch (s) {
    throw new Error(String((s == null ? void 0 : s.message) ?? s ?? "Invalid JSON"));
  }
  return Vc(n);
}
function ui(e) {
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
function Bc(e) {
  return Or(e) ?? {
    full_path: "",
    strength_model: 1,
    strength_clip: 1,
    enabled: !0,
    name: "",
    sha256: ""
  };
}
const Wc = { class: "hikaze-lora-content" }, zc = { class: "loRA-list-table" }, Uc = {
  class: "header-chk-wrap",
  title: "Toggle All"
}, Kc = {
  key: 0,
  class: "empty-tip"
}, Gc = /* @__PURE__ */ Ze({
  __name: "HikazeLoraPowerLoaderOverlay",
  props: {
    nodeId: {},
    payload: {},
    commit: { type: Function }
  },
  setup(e) {
    const t = e, n = nn("openManager", null), s = {
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
    }, o = G({ version: 2, loras: [] }), i = G(null);
    lt(
      () => {
        var m;
        return String(((m = t.payload) == null ? void 0 : m.value) ?? "");
      },
      (m) => {
        if (!(i.value != null && m === i.value))
          try {
            o.value = Fr(m || "");
          } catch {
            console.error("Invalid JSON provided to Hikaze Lora Overlay"), o.value = JSON.parse(JSON.stringify(s));
          }
      },
      { immediate: !0 }
    ), lt(o, () => {
      const m = ui(o.value);
      i.value = m, t.commit(m);
    }, { deep: !0 });
    function r(m, C) {
      var k;
      const _ = (k = o.value.loras) == null ? void 0 : k[m];
      _ && (_.strength_model = C);
    }
    function l(m, C) {
      var k;
      const _ = (k = o.value.loras) == null ? void 0 : k[m];
      _ && (_.strength_clip = C);
    }
    function a(m, C) {
      var k;
      const _ = (k = o.value.loras) == null ? void 0 : k[m];
      _ && (_.enabled = C);
    }
    function u(m) {
      var C;
      (C = o.value.loras) == null || C.splice(m, 1);
    }
    function c() {
      confirm("Delete all LoRAs?") && (o.value.loras = []);
    }
    function d(m) {
      if (!o.value.loras) return;
      const C = m.target.checked;
      o.value.loras.forEach((_) => {
        _.enabled = C;
      });
    }
    async function g() {
      if (!n) {
        console.warn("openManager is not available");
        return;
      }
      const m = await n({
        mode: "multi",
        initialTab: "loras",
        title: "Select LoRAs",
        payloadJson: t.payload.value
      });
      !m || typeof m != "object" || !("loras" in m) || t.commit(ui(m));
    }
    return (m, C) => (N(), _t(wr, {
      "node-id": e.nodeId,
      title: "Hikaze LoRA Power Loader"
    }, {
      "header-actions": at(() => [
        v("button", {
          type: "button",
          class: "btn header-action-btn",
          onClick: g
        }, " Select LoRAs... ")
      ]),
      default: at(() => [
        v("div", Wc, [
          v("table", zc, [
            v("thead", null, [
              v("th", null, [
                v("button", {
                  class: "header-btn",
                  onClick: c,
                  title: "Delete All"
                }, "🗑")
              ]),
              C[1] || (C[1] = v("th", null, "Seq", -1)),
              C[2] || (C[2] = v("th", null, "LoRA", -1)),
              C[3] || (C[3] = v("th", null, "Mstr", -1)),
              C[4] || (C[4] = v("th", null, "Cstr", -1)),
              v("th", null, [
                v("div", Uc, [
                  C[0] || (C[0] = Mt(" On ", -1)),
                  v("input", {
                    class: "hikaze-reset-chk",
                    type: "checkbox",
                    onChange: d
                  }, null, 32)
                ])
              ])
            ]),
            v("tbody", null, [
              (N(!0), R(de, null, He(o.value.loras, (_, k) => (N(), _t(Hc, {
                key: k,
                seq: k,
                name: _.full_path,
                strength_model: _.strength_model,
                strength_clip: _.strength_clip,
                enabled: _.enabled,
                "onUpdate:strength_model": r,
                "onUpdate:strength_clip": l,
                "onUpdate:enabled": a,
                "onUpdate:delete": u
              }, null, 8, ["seq", "name", "strength_model", "strength_clip", "enabled"]))), 128))
            ])
          ]),
          o.value.loras.length === 0 ? (N(), R("div", Kc, " No LoRAs loaded. ")) : xe("", !0)
        ])
      ]),
      _: 1
    }, 8, ["node-id"]));
  }
}), qc = /* @__PURE__ */ Xe(Gc, [["__scopeId", "data-v-7bae3035"]]), Jc = "HikazeLoraPowerLoader";
class Yc extends zt {
  getComponent() {
    return qc;
  }
}
zt.register(Jc, Yc);
const Zc = "Hikaze", Rr = "Comfy.VueNodes.Enabled", Xc = `${Rr}.change`, Qc = Object.hasOwn ?? ((e, t) => Object.prototype.hasOwnProperty.call(e, t));
function fi(e, t) {
  return !e || typeof e != "object" && typeof e != "function" ? !1 : Qc(e, t);
}
function di(e, t, n = !0) {
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
function Dn(e) {
  return {
    id: Number((e == null ? void 0 : e.id) ?? 0),
    name: String((e == null ? void 0 : e.name) ?? "")
  };
}
function eu(e) {
  return {
    positive: String((e == null ? void 0 : e.positive) ?? ""),
    negative: String((e == null ? void 0 : e.negative) ?? "")
  };
}
function tu(e) {
  return {
    description: String((e == null ? void 0 : e.description) ?? ""),
    community_links: String((e == null ? void 0 : e.community_links) ?? ""),
    images_count: Number((e == null ? void 0 : e.images_count) ?? 0),
    prompts: eu(e == null ? void 0 : e.prompts)
  };
}
function Dr(e) {
  return {
    sha256: String((e == null ? void 0 : e.sha256) ?? ""),
    path: String((e == null ? void 0 : e.path) ?? ""),
    name: String((e == null ? void 0 : e.name) ?? ""),
    type: String((e == null ? void 0 : e.type) ?? ""),
    size_bytes: Number((e == null ? void 0 : e.size_bytes) ?? 0),
    created_at: Number((e == null ? void 0 : e.created_at) ?? 0),
    meta_json: tu(e == null ? void 0 : e.meta_json),
    tags: Array.isArray(e == null ? void 0 : e.tags) ? e.tags.map(Dn) : []
  };
}
function nu(e) {
  return {
    sha256: String((e == null ? void 0 : e.sha256) ?? ""),
    name: String((e == null ? void 0 : e.name) ?? ""),
    images_count: Number((e == null ? void 0 : e.images_count) ?? 0),
    type: String((e == null ? void 0 : e.type) ?? ""),
    path: String((e == null ? void 0 : e.path) ?? ""),
    size_bytes: Number((e == null ? void 0 : e.size_bytes) ?? 0),
    created_at: Number((e == null ? void 0 : e.created_at) ?? 0),
    tags: Array.isArray(e == null ? void 0 : e.tags) ? e.tags.map(Dn) : []
  };
}
function su(e) {
  return {
    id: Number((e == null ? void 0 : e.id) ?? 0),
    name: String((e == null ? void 0 : e.name) ?? ""),
    image: String((e == null ? void 0 : e.image) ?? ""),
    type: String((e == null ? void 0 : e.type) ?? ""),
    tags: Array.isArray(e == null ? void 0 : e.tags) ? e.tags.map(Dn) : []
  };
}
const rs = "__HIKAZE_API_PORT__", qs = "__HIKAZE_API_BASE__", ou = "__HIKAZE_EMBEDDED__", iu = (e) => new Promise((t) => setTimeout(t, e));
function Pn(e) {
  return globalThis[e];
}
function Js(e, t) {
  globalThis[e] = t;
}
function mo() {
  return !!Pn(ou);
}
function ru() {
  typeof Pn(rs) != "number" && Js(rs, 0), typeof Pn(qs) != "string" && Js(qs, "");
}
function jr() {
  const e = Pn(rs), t = Number(e ?? 0);
  return Number.isFinite(t) ? t : 0;
}
function lu(e) {
  Js(rs, e);
}
function au() {
  const e = Pn(qs);
  return typeof e == "string" ? e : "";
}
async function cu() {
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
async function Hr() {
  for (; ; ) {
    const e = await cu();
    if (e > 0)
      return lu(e), e;
    await iu(1e3);
  }
}
function uu() {
  mo() && (An || (An = Hr()));
}
async function fu() {
  if (!mo())
    return 0;
  const e = jr();
  return e > 0 ? e : (An || (An = Hr()), An);
}
function Vr() {
  const e = au();
  if (e)
    return e;
  if (!mo())
    return "";
  const t = jr();
  return t ? `http://${typeof window < "u" ? window.location.hostname : "127.0.0.1"}:${t}` : "";
}
async function du() {
  const e = Vr();
  if (e)
    return e;
  const t = await fu();
  return t ? `http://${typeof window < "u" ? window.location.hostname : "127.0.0.1"}:${t}` : "";
}
async function Br(e) {
  const t = await du();
  return t ? `${t}${e}` : e;
}
async function St(e, t) {
  const n = await Br(e);
  return fetch(n, t);
}
async function hu() {
  const e = await St("/api/models/get_types");
  if (!e.ok)
    throw new Error(`Failed to fetch model types: ${e.statusText}`);
  return ((await e.json()).types || []).map((n) => String(n));
}
async function pu() {
  const e = await St("/api/tags");
  if (!e.ok)
    throw new Error(`Failed to fetch tags: ${e.statusText}`);
  return ((await e.json()).tags || []).map(Dn);
}
async function gu(e) {
  const t = await St("/api/tags_add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newtags: e })
  });
  if (!t.ok)
    throw new Error(`Failed to add tags: ${t.statusText}`);
  return ((await t.json()).tags || []).map(Dn);
}
async function mu(e) {
  const t = await St(`/api/models?type=${encodeURIComponent(e)}`);
  if (!t.ok)
    throw new Error(`Failed to fetch models: ${t.statusText}`);
  return ((await t.json()).models || []).map(nu);
}
async function vu(e) {
  const t = await St(`/api/models/${e}`);
  if (!t.ok)
    throw new Error(`Failed to fetch model details: ${t.statusText}`);
  const n = await t.json();
  return Dr(n);
}
async function yu(e, t) {
  const n = await St(`/api/models/${e}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(t)
  });
  if (!n.ok)
    throw new Error(`Failed to update model: ${n.statusText}`);
  const s = await n.json();
  return Dr(s);
}
async function _u(e) {
  const t = await St(`/api/images/get_img_count?sha256=${e}`);
  if (!t.ok)
    throw new Error(`Failed to fetch image count: ${t.statusText}`);
  const n = await t.json();
  return Number(n.count ?? 0);
}
async function bu(e, t) {
  const n = await St(`/api/images/delete?sha256=${e}&seq=${t}`, {
    method: "DELETE"
  });
  if (!n.ok)
    throw new Error(`Failed to delete image: ${n.statusText}`);
}
async function Cu() {
  const e = await St("/api/migration/pending_models");
  if (!e.ok)
    throw new Error(`Failed to fetch pending models: ${e.statusText}`);
  return ((await e.json()).models || []).map(su);
}
function sn(e) {
  return typeof e == "string" ? e : e.value;
}
function Su() {
  const e = Te({}), t = Te({}), n = Te({}), s = Te({}), o = Te({}), i = Te({});
  async function r(p, T = !1) {
    if (p && !(e[p] && !T)) {
      t[p] = !0, n[p] = null;
      try {
        const b = await mu(p);
        e[p] = b;
      } catch (b) {
        console.error(`Error loading models for type ${p}:`, b), n[p] = (b == null ? void 0 : b.message) || "Failed to load models", e[p] || (e[p] = []);
      } finally {
        t[p] = !1;
      }
    }
  }
  async function l(p, T = !1) {
    if (p && !(s[p] && !T)) {
      o[p] = !0, i[p] = null;
      try {
        const b = await vu(p);
        s[p] = b, a(b);
      } catch (b) {
        console.error(`Error loading model details for ${p}:`, b), i[p] = (b == null ? void 0 : b.message) || "Failed to load model details";
      } finally {
        o[p] = !1;
      }
    }
  }
  function a(p) {
    Object.keys(e).forEach((T) => {
      const b = e[T];
      if (!b || b.length === 0) return;
      const j = b.findIndex((se) => se.sha256 === p.sha256);
      if (j === -1) return;
      const K = b[j];
      K && (b[j] = {
        ...K,
        name: p.name,
        tags: p.tags
      });
    });
  }
  function u(p) {
    s[p.sha256] = p, a(p);
  }
  function c(p) {
    return Y(() => e[sn(p)] || []);
  }
  function d(p) {
    return Y(() => !!t[sn(p)]);
  }
  function g(p) {
    return Y(() => n[sn(p)] || null);
  }
  function m(p) {
    return Y(() => s[p] || null);
  }
  function C(p) {
    return Y(() => !!o[p]);
  }
  function _(p) {
    return Y(() => i[p] || null);
  }
  function k() {
    Object.keys(e).forEach((p) => delete e[p]), Object.keys(t).forEach((p) => delete t[p]), Object.keys(n).forEach((p) => delete n[p]), Object.keys(s).forEach((p) => delete s[p]), Object.keys(o).forEach((p) => delete o[p]), Object.keys(i).forEach((p) => delete i[p]);
  }
  function M(p) {
    if (!p) {
      k();
      return;
    }
    delete e[p], delete t[p], delete n[p];
  }
  return {
    loadModels: r,
    loadDetails: l,
    setDetails: u,
    getModels: c,
    isLoading: d,
    getError: g,
    getDetails: m,
    isDetailsLoading: C,
    getDetailsError: _,
    reset: k,
    invalidate: M
  };
}
function Tu() {
  const e = Te({}), t = Te({}), n = Te({});
  async function s(u, c = !1) {
    const d = u || "pending";
    if (!(e[d] && !c)) {
      t[d] = !0, n[d] = null;
      try {
        e[d] = await Cu();
      } catch (g) {
        console.error("Error loading pending models:", g), n[d] = (g == null ? void 0 : g.message) || "Failed to load pending models", e[d] || (e[d] = []);
      } finally {
        t[d] = !1;
      }
    }
  }
  function o(u) {
    const c = sn(u) || "pending";
    return Y(() => e[c] || []);
  }
  function i(u) {
    const c = sn(u) || "pending";
    return Y(() => !!t[c]);
  }
  function r(u) {
    const c = sn(u) || "pending";
    return Y(() => n[c] || null);
  }
  function l() {
    Object.keys(e).forEach((u) => delete e[u]), Object.keys(t).forEach((u) => delete t[u]), Object.keys(n).forEach((u) => delete n[u]);
  }
  function a(u) {
    if (!u) {
      l();
      return;
    }
    delete e[u], delete t[u], delete n[u];
  }
  return {
    loadModels: s,
    getModels: o,
    isLoading: i,
    getError: r,
    reset: l,
    invalidate: a,
    // Placeholder signatures for parity with active cache.
    loadDetails: async (u, c = !1) => {
    },
    setDetails: (u) => {
    },
    getDetails: (u) => Y(() => null),
    isDetailsLoading: (u) => Y(() => !1),
    getDetailsError: (u) => Y(() => null)
  };
}
const xu = Su(), Eu = Tu();
function vo(e = "active") {
  return e === "pending" ? Eu : xu;
}
const Se = Te({
  items: [],
  loading: !1,
  error: null,
  loaded: !1
});
async function Au(e = !1) {
  if (!(Se.loaded && !e)) {
    Se.loading = !0, Se.error = null;
    try {
      const t = await pu();
      Se.items = [...t], Se.loaded = !0;
    } catch (t) {
      console.error("Error loading tags:", t), Se.error = (t == null ? void 0 : t.message) || "Failed to load tags", Se.items = [], Se.loaded = !1;
    } finally {
      Se.loading = !1;
    }
  }
}
function ku(e) {
  if (!e.length) return;
  const t = new Map(Se.items.map((n) => [n.id, n]));
  e.forEach((n) => {
    t.has(n.id) || t.set(n.id, n);
  }), Se.items = Array.from(t.values());
}
function Mu() {
  Se.items = [], Se.loaded = !1, Se.error = null, Se.loading = !1;
}
function ys() {
  return {
    loadTags: Au,
    mergeTags: ku,
    resetTags: Mu,
    getTags: () => Y(() => Se.items),
    isLoading: () => Y(() => Se.loading),
    getError: () => Y(() => Se.error)
  };
}
const $u = {
  key: 0,
  class: "hikaze-header"
}, Lu = {
  key: 0,
  class: "tabs-loading"
}, Iu = {
  key: 1,
  class: "tabs-error"
}, wu = {
  key: 2,
  class: "type-tabs"
}, Nu = ["onClick"], Ou = { class: "hikaze-pane-library" }, Pu = { class: "hikaze-pane-details" }, Fu = /* @__PURE__ */ Ze({
  __name: "HikazeManagerLayout",
  props: {
    embedded: { type: Boolean },
    initialTab: {}
  },
  setup(e) {
    const t = e, n = vo(), s = ys(), o = G(""), i = G([]), r = G(!1), l = G(null), a = G(24), u = G(!1);
    function c(_) {
      o.value = _;
    }
    function d() {
      u.value = !0, document.addEventListener("mousemove", g), document.addEventListener("mouseup", m), document.body.style.cursor = "col-resize", document.body.style.userSelect = "none";
    }
    function g(_) {
      if (!u.value) return;
      const k = window.innerWidth, p = (k - _.clientX) / k * 100;
      p > 10 && p < 80 && (a.value = p);
    }
    function m() {
      u.value = !1, document.removeEventListener("mousemove", g), document.removeEventListener("mouseup", m), document.body.style.cursor = "", document.body.style.userSelect = "";
    }
    un(() => {
      m();
    }), lt(o, (_) => {
      _ && n.loadModels(_);
    });
    async function C() {
      r.value = !0, l.value = null;
      try {
        const _ = await hu();
        i.value = [..._, "Others"];
        const k = t.initialTab;
        if (k) {
          const M = i.value.find((b) => b === k), p = i.value.find(
            (b) => b.toLowerCase() === k.toLowerCase()
          ), T = M || p;
          if (T) {
            o.value = T;
            return;
          }
        }
        i.value.length > 0 && (o.value = i.value[0] || "");
      } catch (_) {
        l.value = _.message || "Failed to load model types";
      } finally {
        r.value = !1;
      }
    }
    return Kt(() => {
      C(), s.loadTags();
    }), (_, k) => (N(), R("div", {
      class: be(["hikaze-layout", { "is-embedded": e.embedded, "has-initial-tab": !!e.initialTab }]),
      style: gt({ gridTemplateColumns: `1fr 4px ${a.value}%` })
    }, [
      !e.embedded && !e.initialTab ? (N(), R("header", $u, [
        r.value ? (N(), R("div", Lu, [...k[0] || (k[0] = [
          v("span", { class: "spinner" }, null, -1),
          Mt(" Loading types... ", -1)
        ])])) : l.value ? (N(), R("div", Iu, [
          Mt(ge(l.value) + " ", 1),
          v("button", {
            onClick: C,
            class: "btn-retry"
          }, "Retry")
        ])) : (N(), R("nav", wu, [
          (N(!0), R(de, null, He(i.value, (M) => (N(), R("div", {
            key: M,
            class: be(["tab", { active: o.value === M }]),
            onClick: (p) => c(M)
          }, ge(M), 11, Nu))), 128))
        ]))
      ])) : xe("", !0),
      v("main", Ou, [
        Tn(_.$slots, "library", { activeTab: o.value }, () => [
          k[1] || (k[1] = Mt("Library", -1))
        ])
      ]),
      v("div", {
        class: be(["layout-splitter", { dragging: u.value }]),
        onMousedown: d
      }, null, 34),
      v("aside", Pu, [
        Tn(_.$slots, "details", {}, () => [
          k[2] || (k[2] = Mt("Details", -1))
        ])
      ]),
      Tn(_.$slots, "toolbar", { activeTab: o.value }, void 0)
    ], 6));
  }
}), Ru = /* @__PURE__ */ Xe(Fu, [["__scopeId", "data-v-7d9fc554"]]), Wt = Te({}), on = Te({}), rn = Te({}), ln = Te({});
function Du(e) {
  ln[e] = (ln[e] ?? 0) + 1;
}
function ju(e) {
  if (e) {
    delete Wt[e], delete on[e], delete rn[e], delete ln[e];
    return;
  }
  Object.keys(Wt).forEach((t) => delete Wt[t]), Object.keys(on).forEach((t) => delete on[t]), Object.keys(rn).forEach((t) => delete rn[t]), Object.keys(ln).forEach((t) => delete ln[t]);
}
async function Hu(e, t = !1) {
  if (e && !(Wt[e] != null && !t)) {
    on[e] = !0, rn[e] = null;
    try {
      Wt[e] = await _u(e);
    } catch (n) {
      console.error(`Error loading image count for ${e}:`, n), rn[e] = (n == null ? void 0 : n.message) || "Failed to load image count", Wt[e] = 0;
    } finally {
      on[e] = !1;
    }
  }
}
function Vu(e, t, n = "high") {
  const s = ln[e] ?? 0, o = Vr();
  return `${o ? `${o}` : ""}/api/images/${e}_${t}.webp?quality=${n}&rev=${s}`;
}
function yo() {
  return {
    loadImageCount: Hu,
    bumpRevision: Du,
    resetImageCache: ju,
    getImageUrl: Vu,
    getImageCount: (e) => Y(() => Wt[e] ?? 0),
    isLoading: (e) => Y(() => !!on[e]),
    getError: (e) => Y(() => rn[e] ?? null)
  };
}
function Bu(e, t = { root: null, rootMargin: "0px", threshold: 0.1 }) {
  return new IntersectionObserver((s) => {
    s.forEach((o) => {
      o.isIntersecting && e(o);
    });
  }, t);
}
const Wu = { class: "model-library" }, zu = { class: "library-toolbar" }, Uu = { class: "search-box" }, Ku = { class: "controls-right" }, Gu = {
  key: 0,
  class: "column-control"
}, qu = { class: "view-switch" }, Ju = ["disabled"], Yu = { class: "tag-filter" }, Zu = {
  key: 0,
  class: "tag-dropdown"
}, Xu = {
  key: 0,
  class: "placeholder-msg"
}, Qu = {
  key: 1,
  class: "tag-list"
}, ef = ["onClick"], tf = {
  key: 0,
  class: "library-loading"
}, nf = {
  key: 1,
  class: "library-error"
}, sf = ["onClick", "onMouseenter", "onMouseleave"], of = ["checked", "onChange"], rf = ["data-sha256"], lf = { class: "card-meta" }, af = { class: "card-title" }, cf = { class: "card-tags" }, uf = { class: "tooltip-name" }, ff = { class: "tooltip-tags" }, df = {
  key: 3,
  class: "list-container"
}, hf = ["onClick"], pf = ["checked", "onChange"], gf = { class: "list-name" }, mf = { class: "list-tags" }, vf = /* @__PURE__ */ Ze({
  __name: "ModelLibrary",
  props: {
    activeTab: {},
    selectionMode: {},
    selectedIds: {},
    excludeSelected: { type: Boolean }
  },
  emits: ["select-model", "toggle-select"],
  setup(e, { emit: t }) {
    const n = e, s = t, o = vo(), i = ys(), r = yo(), l = G("card"), a = G(4), u = G(null), c = G("bottom"), d = G(!1), g = G(""), m = G(/* @__PURE__ */ new Map()), C = Y(() => n.selectionMode === "lora"), _ = Y(() => new Set(n.selectedIds ?? [])), k = o.getModels(Y(() => n.activeTab)), M = o.isLoading(Y(() => n.activeTab)), p = o.getError(Y(() => n.activeTab)), T = Te({}), b = /* @__PURE__ */ new Map();
    let j = null;
    function K() {
      j && j.disconnect(), j = Bu((D) => {
        const F = D.target, V = F.dataset.sha256;
        if (!V) return;
        const J = new Image(), le = r.getImageUrl(V, 0, "medium");
        J.onload = () => {
          F.classList.remove("lazy"), F.classList.add("loaded");
        }, J.onerror = () => {
          F.classList.remove("lazy"), F.classList.add("error");
        }, J.src = le, j == null || j.unobserve(F);
      }), ao(() => {
        document.querySelectorAll(".card-image.lazy").forEach((F) => j == null ? void 0 : j.observe(F));
      });
    }
    const se = async (D) => {
      await r.loadImageCount(D);
      const F = r.getImageCount(D).value;
      if (F <= 1) return;
      T[D] || (T[D] = { current: 0 });
      const V = b.get(D);
      V && clearInterval(V);
      const J = window.setInterval(() => {
        const le = T[D];
        le && (le.current = (le.current + 1) % F);
      }, 1e3);
      b.set(D, J);
    }, Q = (D) => {
      const F = b.get(D);
      F && (clearInterval(F), b.delete(D)), T[D] && (T[D].current = 0);
    }, H = (D) => {
      const F = T[D], V = F ? F.current : 0;
      return {
        backgroundImage: `url(${r.getImageUrl(D, V, "medium")})`
      };
    }, X = (D, F) => {
      u.value = F;
      const J = D.currentTarget.getBoundingClientRect(), le = window.innerHeight - J.bottom;
      c.value = le < 250 ? "top" : "bottom", se(F);
    }, re = (D) => {
      u.value = null, Q(D);
    }, P = (D, F) => {
      s("toggle-select", D, F);
    }, ce = (D) => {
      s("select-model", D), C.value && D.sha256 && !_.value.has(D.sha256) && P(D, !0);
    }, $ = (D, F) => {
      const V = F.target;
      D.sha256 && P(D, V.checked);
    }, ee = i.getTags();
    Kt(async () => {
      l.value === "card" && K();
      try {
        await i.loadTags();
        const D = ee.value.find((F) => F.name.toLowerCase() === "nsfw");
        D && m.value.set(D.id, "exclude");
      } catch (D) {
        console.error("Failed to load tags for auto-exclude:", D);
      }
    }), un(() => {
      j && j.disconnect(), b.forEach((D) => clearInterval(D)), b.clear();
    });
    const Z = Y(() => {
      let D = k.value;
      if (g.value.trim()) {
        const F = g.value.toLowerCase();
        D = D.filter(
          (V) => V.name.toLowerCase().includes(F) || V.path.toLowerCase().includes(F)
        );
      }
      if (m.value.size > 0) {
        const F = Array.from(m.value.entries()).filter(([J, le]) => le === "include").map(([J]) => J), V = Array.from(m.value.entries()).filter(([J, le]) => le === "exclude").map(([J]) => J);
        D = D.filter((J) => {
          const le = new Set(J.tags.map((Ge) => Ge.id)), ze = F.every((Ge) => le.has(Ge)), wt = !V.some((Ge) => le.has(Ge));
          return ze && wt;
        });
      }
      return n.excludeSelected && _.value.size > 0 && (D = D.filter((F) => !_.value.has(F.sha256))), D;
    }), te = Y(() => {
      const D = /* @__PURE__ */ new Map();
      Z.value.forEach((le) => {
        le.tags.forEach((ze) => {
          D.set(ze.id, (D.get(ze.id) ?? 0) + 1);
        });
      });
      const F = new Map(ee.value.map((le) => [le.id, le])), V = [];
      m.value.forEach((le, ze) => {
        const wt = F.get(ze);
        wt && V.push(wt);
      });
      const J = ee.value.filter((le) => !m.value.has(le.id) && (D.get(le.id) ?? 0) > 0).sort((le, ze) => le.name.localeCompare(ze.name));
      return [...V, ...J];
    });
    lt([Z, l], () => {
      l.value === "card" && K();
    }, { deep: !0 });
    function ne(D) {
      const F = m.value.get(D);
      F === "include" ? m.value.set(D, "exclude") : F === "exclude" ? m.value.delete(D) : m.value.set(D, "include");
    }
    function _e() {
      m.value.clear();
    }
    function Be() {
      o.reset(), r.resetImageCache(), o.loadModels(n.activeTab, !0);
    }
    const Ae = (D) => {
      l.value = D;
    }, We = Y(() => l.value !== "card" ? {} : {
      gridTemplateColumns: `repeat(${a.value}, 1fr)`
    });
    return (D, F) => (N(), R("div", Wu, [
      v("div", zu, [
        v("div", Uu, [
          it(v("input", {
            type: "text",
            "onUpdate:modelValue": F[0] || (F[0] = (V) => g.value = V),
            placeholder: "Search models..."
          }, null, 512), [
            [kt, g.value]
          ])
        ]),
        v("div", Ku, [
          l.value === "card" ? (N(), R("div", Gu, [
            F[9] || (F[9] = v("label", { for: "col-count" }, "Cols:", -1)),
            it(v("input", {
              id: "col-count",
              type: "number",
              "onUpdate:modelValue": F[1] || (F[1] = (V) => a.value = V),
              min: "2",
              max: "10",
              step: "1"
            }, null, 512), [
              [
                kt,
                a.value,
                void 0,
                { number: !0 }
              ]
            ])
          ])) : xe("", !0),
          v("div", qu, [
            v("button", {
              class: be({ active: l.value === "card" }),
              onClick: F[2] || (F[2] = (V) => Ae("card"))
            }, "Card", 2),
            v("button", {
              class: be({ active: l.value === "list" }),
              onClick: F[3] || (F[3] = (V) => Ae("list"))
            }, "List", 2)
          ]),
          v("button", {
            class: "btn-refresh",
            onClick: Be,
            disabled: Ht(M),
            title: "Refresh model library"
          }, " Refresh ", 8, Ju),
          v("div", Yu, [
            v("button", {
              class: be(["btn-filter", { active: m.value.size > 0 }]),
              onClick: F[4] || (F[4] = (V) => d.value = !d.value)
            }, " Tags Filter " + ge(m.value.size > 0 ? `(${m.value.size})` : ""), 3),
            d.value ? (N(), R("div", Zu, [
              te.value.length === 0 ? (N(), R("div", Xu, "No tags available")) : (N(), R("div", Qu, [
                (N(!0), R(de, null, He(te.value, (V) => (N(), R("div", {
                  key: V.id,
                  class: be(["tag-item", m.value.get(V.id)]),
                  onClick: (J) => ne(V.id)
                }, ge(V.name), 11, ef))), 128)),
                v("div", { class: "tag-dropdown-actions" }, [
                  v("button", {
                    onClick: _e,
                    class: "btn-clear"
                  }, "Clear All")
                ])
              ]))
            ])) : xe("", !0)
          ])
        ])
      ]),
      v("div", {
        class: be(["library-content", l.value]),
        style: gt(We.value)
      }, [
        Ht(M) ? (N(), R("div", tf, [...F[10] || (F[10] = [
          v("span", { class: "spinner" }, null, -1),
          Mt(" Loading models... ", -1)
        ])])) : Ht(p) ? (N(), R("div", nf, ge(Ht(p)), 1)) : l.value === "card" ? (N(!0), R(de, { key: 2 }, He(Z.value, (V) => (N(), R("div", {
          key: V.sha256,
          class: be(["card-item", { "dense-view": a.value > 6 }]),
          onClick: (J) => ce(V),
          onMouseenter: (J) => X(J, V.sha256),
          onMouseleave: (J) => re(V.sha256)
        }, [
          C.value ? (N(), R("label", {
            key: 0,
            class: "selection-checkbox",
            onClick: F[6] || (F[6] = Pe(() => {
            }, ["stop"]))
          }, [
            v("input", {
              type: "checkbox",
              checked: _.value.has(V.sha256),
              onClick: F[5] || (F[5] = Pe(() => {
              }, ["stop"])),
              onChange: (J) => $(V, J)
            }, null, 40, of)
          ])) : xe("", !0),
          v("div", {
            class: "card-image lazy",
            "data-sha256": V.sha256,
            style: gt(H(V.sha256))
          }, null, 12, rf),
          v("div", lf, [
            v("div", af, ge(V.name), 1),
            v("div", cf, [
              (N(!0), R(de, null, He(V.tags, (J) => (N(), R("span", {
                key: J.id,
                class: "tag"
              }, ge(J.name), 1))), 128))
            ])
          ]),
          u.value === V.sha256 ? (N(), R("div", {
            key: 1,
            class: be(["card-tooltip", c.value])
          }, [
            v("div", uf, ge(V.name), 1),
            v("div", ff, [
              (N(!0), R(de, null, He(V.tags, (J) => (N(), R("span", {
                key: J.id,
                class: "tag"
              }, ge(J.name), 1))), 128))
            ])
          ], 2)) : xe("", !0)
        ], 42, sf))), 128)) : (N(), R("div", df, [
          (N(!0), R(de, null, He(Z.value, (V) => (N(), R("div", {
            key: V.sha256,
            class: "list-item",
            onClick: (J) => ce(V)
          }, [
            C.value ? (N(), R("label", {
              key: 0,
              class: "list-checkbox",
              onClick: F[8] || (F[8] = Pe(() => {
              }, ["stop"]))
            }, [
              v("input", {
                type: "checkbox",
                checked: _.value.has(V.sha256),
                onClick: F[7] || (F[7] = Pe(() => {
                }, ["stop"])),
                onChange: (J) => $(V, J)
              }, null, 40, pf)
            ])) : xe("", !0),
            v("div", gf, ge(V.name), 1),
            v("div", mf, [
              (N(!0), R(de, null, He(V.tags, (J) => (N(), R("span", {
                key: J.id,
                class: "tag"
              }, ge(J.name), 1))), 128))
            ])
          ], 8, hf))), 128))
        ]))
      ], 6)
    ]));
  }
}), yf = /* @__PURE__ */ Xe(vf, [["__scopeId", "data-v-b5c4ff7b"]]), _f = { class: "main-display" }, bf = {
  key: 0,
  class: "loader"
}, Cf = ["src"], Sf = { class: "nav-controls" }, Tf = { class: "action-overlay" }, xf = {
  key: 2,
  class: "no-images"
}, Ef = {
  key: 0,
  class: "pagination"
}, Af = ["onClick"], kf = /* @__PURE__ */ Ze({
  __name: "HikazeImageGallery",
  props: {
    sha256: {}
  },
  emits: ["update"],
  setup(e, { emit: t }) {
    const n = e, s = t, o = yo(), i = G(0), r = G(0), l = G(!1), a = G(!1), u = G(null), c = async (M = !1) => {
      if (n.sha256) {
        l.value = !0;
        try {
          await o.loadImageCount(n.sha256, M), i.value = o.getImageCount(n.sha256).value, r.value >= i.value && i.value > 0 ? r.value = i.value - 1 : i.value === 0 && (r.value = 0);
        } catch (p) {
          console.error("Failed to load image count:", p);
        } finally {
          l.value = !1;
        }
      }
    };
    lt(() => n.sha256, () => {
      r.value = 0, c();
    }, { immediate: !0 });
    const d = () => {
      i.value > 0 && (r.value = (r.value + 1) % i.value);
    }, g = () => {
      i.value > 0 && (r.value = (r.value - 1 + i.value) % i.value);
    }, m = async () => {
      if (i.value !== 0 && confirm("Are you sure you want to delete this image?"))
        try {
          await bu(n.sha256, r.value), o.bumpRevision(n.sha256), await c(!0), s("update");
        } catch {
          alert("Failed to delete image");
        }
    }, C = () => {
      var M;
      (M = u.value) == null || M.click();
    }, _ = async (M) => {
      var j;
      const p = M.target;
      if (!((j = p.files) != null && j.length)) return;
      const T = p.files[0];
      if (!T) return;
      const b = new FormData();
      b.append("image", T), b.append("sha256", n.sha256);
      try {
        const K = await Br("/api/images/upload"), se = await fetch(K, {
          method: "POST",
          body: b
        });
        if (se.ok)
          o.bumpRevision(n.sha256), await c(!0), r.value = i.value - 1, s("update");
        else {
          const Q = await se.json();
          alert(`Upload failed: ${Q.error || se.statusText}`);
        }
      } catch {
        alert("Upload error");
      } finally {
        p.value = "";
      }
    }, k = (M) => o.getImageUrl(n.sha256, M, "high");
    return (M, p) => (N(), R("div", {
      class: "image-gallery",
      onMouseenter: p[0] || (p[0] = (T) => a.value = !0),
      onMouseleave: p[1] || (p[1] = (T) => a.value = !1)
    }, [
      v("div", _f, [
        l.value ? (N(), R("div", bf, "Loading...")) : i.value > 0 ? (N(), R(de, { key: 1 }, [
          v("img", {
            src: k(r.value),
            class: "gallery-img"
          }, null, 8, Cf),
          ve(Gs, { name: "fade" }, {
            default: at(() => [
              it(v("div", Sf, [
                v("button", {
                  class: "nav-btn prev",
                  onClick: Pe(g, ["stop"])
                }, "❮"),
                v("button", {
                  class: "nav-btn next",
                  onClick: Pe(d, ["stop"])
                }, "❯")
              ], 512), [
                [Jo, a.value && i.value > 1]
              ])
            ]),
            _: 1
          }),
          ve(Gs, { name: "fade" }, {
            default: at(() => [
              it(v("div", Tf, [
                v("button", {
                  class: "action-btn upload",
                  onClick: Pe(C, ["stop"]),
                  title: "Add Image"
                }, "➕"),
                v("button", {
                  class: "action-btn delete",
                  onClick: Pe(m, ["stop"]),
                  title: "Delete Current Image"
                }, "🗑️")
              ], 512), [
                [Jo, a.value]
              ])
            ]),
            _: 1
          })
        ], 64)) : (N(), R("div", xf, [
          p[2] || (p[2] = v("div", { class: "placeholder" }, "No Images", -1)),
          v("button", {
            class: "btn-upload-init",
            onClick: C
          }, "Upload Image")
        ]))
      ]),
      i.value > 1 ? (N(), R("div", Ef, [
        (N(!0), R(de, null, He(i.value, (T) => (N(), R("div", {
          key: T - 1,
          class: be(["dot", { active: r.value === T - 1 }]),
          onClick: (b) => r.value = T - 1
        }, null, 10, Af))), 128))
      ])) : xe("", !0),
      v("input", {
        type: "file",
        ref_key: "fileInput",
        ref: u,
        style: { display: "none" },
        accept: "image/*",
        onChange: _
      }, null, 544)
    ], 32));
  }
}), Mf = /* @__PURE__ */ Xe(kf, [["__scopeId", "data-v-2b11a420"]]), $f = { class: "chips-wrapper" }, Lf = ["onClick"], If = {
  key: 0,
  class: "suggestions-list"
}, wf = ["onMousedown"], Nf = /* @__PURE__ */ Ze({
  __name: "HikazeTagInput",
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, s = t, o = ys(), i = o.getTags(), r = G(""), l = G(!1), a = G(!1);
    Kt(() => {
      o.loadTags();
    });
    const u = Y(() => {
      const _ = r.value.toLowerCase().trim();
      return _ ? i.value.filter((k) => k.name.toLowerCase().includes(_) && !n.modelValue.find((M) => M.id === k.id)).slice(0, 10) : [];
    }), c = (_) => {
      const k = [...n.modelValue];
      k.splice(_, 1), s("update:modelValue", k);
    }, d = (_) => {
      n.modelValue.find((k) => k.id === _.id) || s("update:modelValue", [...n.modelValue, _]), r.value = "", a.value = !1;
    }, g = (_) => {
      if (_.key === "Enter" || _.key === ",") {
        _.preventDefault();
        const k = r.value.trim().replace(/,$/, "");
        if (!k) return;
        const M = i.value.find((p) => p.name.toLowerCase() === k.toLowerCase());
        M ? d(M) : (n.modelValue.find((p) => p.name.toLowerCase() === k.toLowerCase()) || s("update:modelValue", [...n.modelValue, { id: -1, name: k }]), r.value = ""), a.value = !1;
      } else _.key === "Backspace" && !r.value && n.modelValue.length > 0 && c(n.modelValue.length - 1);
    }, m = () => {
      a.value = !0;
    }, C = () => {
      setTimeout(() => {
        l.value = !1, a.value = !1;
      }, 200);
    };
    return (_, k) => (N(), R("div", {
      class: be(["tag-input-container", { focused: l.value }])
    }, [
      v("div", $f, [
        (N(!0), R(de, null, He(e.modelValue, (M, p) => (N(), R("div", {
          key: M.id === -1 ? M.name : M.id,
          class: be(["tag-chip", { new: M.id === -1 }])
        }, [
          Mt(ge(M.name) + " ", 1),
          v("button", {
            class: "remove-btn",
            onClick: (T) => c(p)
          }, "×", 8, Lf)
        ], 2))), 128)),
        it(v("input", {
          type: "text",
          "onUpdate:modelValue": k[0] || (k[0] = (M) => r.value = M),
          onKeydown: g,
          onInput: m,
          onFocus: k[1] || (k[1] = (M) => l.value = !0),
          onBlur: C,
          placeholder: "Add tags...",
          class: "input-field"
        }, null, 544), [
          [kt, r.value]
        ])
      ]),
      ve(Gs, { name: "slide-fade" }, {
        default: at(() => [
          a.value && u.value.length > 0 ? (N(), R("div", If, [
            (N(!0), R(de, null, He(u.value, (M) => (N(), R("div", {
              key: M.id,
              class: "suggestion-item",
              onMousedown: (p) => d(M)
            }, ge(M.name), 41, wf))), 128))
          ])) : xe("", !0)
        ]),
        _: 1
      })
    ], 2));
  }
}), Of = /* @__PURE__ */ Xe(Nf, [["__scopeId", "data-v-3daf8b7c"]]), Pf = {
  key: 0,
  class: "model-details"
}, Ff = { class: "gallery-wrapper" }, Rf = { class: "details-body" }, Df = { class: "field-group" }, jf = { class: "field-group" }, Hf = ["title"], Vf = { class: "field-group" }, Bf = ["value"], Wf = { class: "field-group" }, zf = { class: "readonly-box" }, Uf = { class: "field-group" }, Kf = { class: "field-group" }, Gf = { class: "field-group" }, qf = { class: "link-group" }, Jf = { class: "field-group" }, Yf = { class: "field-group" }, Zf = { class: "actions" }, Xf = ["disabled"], Qf = ["disabled"], ed = {
  key: 1,
  class: "empty-details"
}, td = {
  key: 0,
  class: "loading-state"
}, nd = { key: 1 }, sd = /* @__PURE__ */ Ze({
  __name: "ModelDetails",
  props: {
    model: {}
  },
  emits: ["update-list"],
  setup(e, { emit: t }) {
    const n = e, s = t, o = vo(), i = ys(), r = G(null), l = G(!1), a = G(!1), u = G(null), c = G(""), d = G(""), g = G(""), m = G(""), C = async (p, T = !1) => {
      l.value = !0;
      try {
        await o.loadDetails(p, T);
        const b = o.getDetails(p).value;
        if (r.value = b ? JSON.parse(JSON.stringify(b)) : null, r.value) {
          c.value = r.value.meta_json.description, d.value = r.value.meta_json.community_links, g.value = r.value.meta_json.prompts.positive, m.value = r.value.meta_json.prompts.negative, await ao();
          const j = u.value;
          if (j) {
            const K = j.getBoundingClientRect().width;
            K > 0 && (j.style.height = `${Math.round(K * 1.5)}px`);
          }
        }
      } catch (b) {
        console.error("Failed to load model details", b);
      } finally {
        l.value = !1;
      }
    };
    lt(() => n.model, (p) => {
      p != null && p.sha256 ? C(p.sha256) : r.value = null;
    }, { immediate: !0 });
    const _ = async () => {
      if (!(!r.value || !r.value.sha256)) {
        a.value = !0;
        try {
          const p = r.value.sha256, T = r.value.tags, b = T.filter((Q) => Q.id === -1).map((Q) => Q.name);
          let K = [...T.filter((Q) => Q.id !== -1)];
          if (b.length > 0) {
            const Q = await gu(b);
            K = [...K, ...Q], i.mergeTags(Q);
          }
          r.value.tags = K, r.value.meta_json.description = c.value, r.value.meta_json.community_links = d.value, r.value.meta_json.prompts = {
            positive: g.value,
            negative: m.value
          };
          const se = await yu(p, r.value);
          o.setDetails(se), r.value = JSON.parse(JSON.stringify(se)), s("update-list"), alert("Saved successfully!");
        } catch (p) {
          alert(`Save failed: ${p}`);
        } finally {
          a.value = !1;
        }
      }
    }, k = () => {
      var p;
      (p = n.model) != null && p.sha256 && C(n.model.sha256, !0);
    }, M = () => {
      d.value && window.open(d.value, "_blank");
    };
    return (p, T) => r.value ? (N(), R("div", Pf, [
      v("div", Ff, [
        ve(Mf, {
          sha256: r.value.sha256,
          onUpdate: T[0] || (T[0] = (b) => s("update-list"))
        }, null, 8, ["sha256"])
      ]),
      v("div", Rf, [
        v("div", Df, [
          T[7] || (T[7] = v("label", null, "Display Name", -1)),
          it(v("input", {
            type: "text",
            "onUpdate:modelValue": T[1] || (T[1] = (b) => r.value.name = b),
            placeholder: "Database alias..."
          }, null, 512), [
            [kt, r.value.name]
          ])
        ]),
        v("div", jf, [
          T[8] || (T[8] = v("label", null, "Physical Path", -1)),
          v("div", {
            class: "readonly-box",
            title: r.value.path
          }, ge(r.value.path), 9, Hf)
        ]),
        v("div", Vf, [
          T[9] || (T[9] = v("label", null, "SHA256 Hash", -1)),
          v("input", {
            type: "text",
            value: r.value.sha256,
            disabled: "",
            class: "hash-input"
          }, null, 8, Bf)
        ]),
        v("div", Wf, [
          T[10] || (T[10] = v("label", null, "Model Type", -1)),
          v("div", zf, ge(r.value.type), 1)
        ]),
        v("div", Uf, [
          T[11] || (T[11] = v("label", null, "Tags", -1)),
          ve(Of, {
            modelValue: r.value.tags,
            "onUpdate:modelValue": T[2] || (T[2] = (b) => r.value.tags = b)
          }, null, 8, ["modelValue"])
        ]),
        v("div", Kf, [
          T[12] || (T[12] = v("label", null, "Description", -1)),
          it(v("textarea", {
            "onUpdate:modelValue": T[3] || (T[3] = (b) => c.value = b),
            placeholder: "Model description...",
            rows: "3",
            class: "resize-vertical",
            ref_key: "descriptionRef",
            ref: u
          }, null, 512), [
            [kt, c.value]
          ])
        ]),
        v("div", Gf, [
          T[13] || (T[13] = v("label", null, "Community Links", -1)),
          v("div", qf, [
            it(v("input", {
              type: "text",
              "onUpdate:modelValue": T[4] || (T[4] = (b) => d.value = b),
              placeholder: "Link to Civitai, HuggingFace, etc...",
              class: "link-input"
            }, null, 512), [
              [kt, d.value]
            ]),
            v("button", {
              class: "btn-visit",
              onClick: M,
              title: "Visit Link"
            }, "🔗")
          ])
        ]),
        v("div", Jf, [
          T[14] || (T[14] = v("label", null, "Positive Prompt", -1)),
          it(v("textarea", {
            "onUpdate:modelValue": T[5] || (T[5] = (b) => g.value = b),
            placeholder: "Recommended positive prompt...",
            rows: "3",
            class: "resize-vertical"
          }, null, 512), [
            [kt, g.value]
          ])
        ]),
        v("div", Yf, [
          T[15] || (T[15] = v("label", null, "Negative Prompt", -1)),
          it(v("textarea", {
            "onUpdate:modelValue": T[6] || (T[6] = (b) => m.value = b),
            placeholder: "Recommended negative prompt...",
            rows: "3",
            class: "resize-vertical"
          }, null, 512), [
            [kt, m.value]
          ])
        ]),
        v("div", Zf, [
          v("button", {
            class: "btn primary",
            onClick: _,
            disabled: a.value
          }, ge(a.value ? "Saving..." : "Save Changes"), 9, Xf),
          v("button", {
            class: "btn secondary",
            onClick: k,
            disabled: a.value
          }, "Revert", 8, Qf)
        ])
      ])
    ])) : (N(), R("div", ed, [
      l.value ? (N(), R("div", td, "Loading details...")) : (N(), R("div", nd, [...T[16] || (T[16] = [
        v("div", { class: "placeholder-icon" }, "📭", -1),
        v("p", null, "Select a model from the library to view and edit details.", -1)
      ])]))
    ]));
  }
}), od = /* @__PURE__ */ Xe(sd, [["__scopeId", "data-v-438634df"]]), id = { class: "selected-lora-bar" }, rd = {
  key: 0,
  class: "selected-lora-empty"
}, ld = ["onClick"], ad = ["onChange"], cd = { class: "selected-lora-meta" }, ud = ["title"], fd = {
  key: 0,
  class: "selected-lora-tags"
}, dd = /* @__PURE__ */ Ze({
  __name: "SelectedLoraBar",
  props: {
    items: {}
  },
  emits: ["toggle", "select"],
  setup(e, { emit: t }) {
    const n = e, s = t, o = yo(), i = (a, u) => {
      const c = u.target;
      s("toggle", a, c.checked);
    }, r = (a) => {
      s("select", a);
    }, l = (a) => a ? {
      backgroundImage: `url(${o.getImageUrl(a, 0, "medium")})`
    } : {};
    return (a, u) => (N(), R("div", id, [
      v("div", {
        class: be(["selected-lora-row", { empty: n.items.length === 0 }])
      }, [
        n.items.length === 0 ? (N(), R("div", rd, " No LoRAs selected. ")) : (N(!0), R(de, { key: 1 }, He(n.items, (c) => (N(), R("div", {
          key: c.sha256,
          class: "selected-lora-card",
          onClick: (d) => r(c)
        }, [
          v("label", {
            class: "selection-checkbox",
            onClick: u[1] || (u[1] = Pe(() => {
            }, ["stop"]))
          }, [
            v("input", {
              type: "checkbox",
              checked: "",
              onClick: u[0] || (u[0] = Pe(() => {
              }, ["stop"])),
              onChange: (d) => i(c.sha256, d)
            }, null, 40, ad)
          ]),
          v("div", {
            class: "selected-lora-image",
            style: gt(l(c.sha256))
          }, null, 4),
          v("div", cd, [
            v("div", {
              class: "selected-lora-name",
              title: c.name || c.path
            }, ge(c.name || c.path), 9, ud),
            c.tags.length > 0 ? (N(), R("div", fd, [
              (N(!0), R(de, null, He(c.tags, (d) => (N(), R("span", {
                key: d.id,
                class: "tag"
              }, ge(d.name), 1))), 128))
            ])) : xe("", !0)
          ])
        ], 8, ld))), 128))
      ], 2)
    ]));
  }
}), hd = /* @__PURE__ */ Xe(dd, [["__scopeId", "data-v-3c98d010"]]), pd = { class: "hikaze-modal-toolbar" }, gd = { class: "modal-title" }, md = { class: "modal-actions" }, vd = {
  key: 0,
  class: "selection-count"
}, yd = ["disabled"], _d = ["aria-label", "title"], bd = ["disabled"], Cd = { class: "hikaze-modal-body" }, Sd = { class: "lora-library-pane" }, Td = { class: "lora-library-body" }, xd = /* @__PURE__ */ Ze({
  __name: "HikazeManagerModal",
  setup(e) {
    const t = G(void 0), n = G([]), s = G(!1), o = G([]), i = G({}), r = G({}), l = G(2), a = Y(() => gn.options), u = Y(() => {
      var $;
      return (($ = a.value) == null ? void 0 : $.mode) === "multi";
    }), c = Y(() => {
      var ee;
      const $ = String(((ee = a.value) == null ? void 0 : ee.initialTab) || "").toLowerCase();
      return u.value && ($ === "loras" || $ === "lora");
    }), d = Y(() => {
      var $;
      return (($ = a.value) == null ? void 0 : $.title) || (u.value ? "Select LoRAs" : "Select Checkpoint");
    }), g = Y(() => c.value ? o.value.length : n.value.length), m = Y(() => u.value ? g.value > 0 : !!t.value), C = Y(() => s.value ? "Exit fullscreen" : "Enter fullscreen"), _ = Y(() => o.value.map(($) => i.value[$]).filter(($) => !!$)), k = ($) => {
      gn.isOpen && $.key === "Escape" && Yt(null);
    };
    Kt(() => window.addEventListener("keydown", k)), un(() => window.removeEventListener("keydown", k));
    const M = () => {
      o.value = [], i.value = {}, r.value = {}, l.value = 2;
    }, p = () => {
      var ee;
      if (M(), !c.value) return;
      const $ = ((ee = a.value) == null ? void 0 : ee.payloadJson) ?? "";
      try {
        const Z = Fr($);
        l.value = Number(Z.version) || 2;
        const te = {}, ne = {}, _e = [];
        Z.loras.forEach((Be) => {
          const Ae = String(Be.sha256 || "").trim();
          !Ae || ne[Ae] || (ne[Ae] = Be, _e.push(Ae), te[Ae] = {
            sha256: Ae,
            name: Be.name || Be.full_path,
            path: Be.full_path,
            tags: []
          });
        }), o.value = _e, i.value = te, r.value = ne;
      } catch (Z) {
        console.warn("Failed to parse LoRA payload JSON", Z);
        const te = Pr();
        l.value = Number(te.version) || 2;
      }
    };
    lt(
      () => gn.isOpen,
      ($) => {
        $ && (t.value = void 0, n.value = [], p()), s.value = !1;
      }
    );
    const T = () => {
      Yt(null);
    }, b = ($, ee) => {
      o.value.includes($) || (o.value = [...o.value, $]), i.value = {
        ...i.value,
        [$]: ee
      };
    }, j = ($) => {
      if (!o.value.includes($)) return;
      o.value = o.value.filter((Z) => Z !== $);
      const ee = { ...i.value };
      delete ee[$], i.value = ee;
    }, K = ($, ee) => {
      !c.value || !$.sha256 || (ee ? b($.sha256, {
        sha256: $.sha256,
        name: $.name || $.path,
        path: $.path,
        tags: $.tags
      }) : j($.sha256));
    }, se = ($, ee) => {
      c.value && (ee || j($));
    }, Q = ($) => ({
      sha256: $.sha256,
      name: $.name,
      path: $.path,
      tags: $.tags,
      images_count: 0,
      type: "lora",
      size_bytes: 0,
      created_at: 0
    }), H = ($) => {
      t.value = Q($);
    }, X = () => {
      o.value = [], i.value = {};
    }, re = ($) => {
      if (t.value = $, c.value) {
        $.sha256 && !o.value.includes($.sha256) && b($.sha256, {
          sha256: $.sha256,
          name: $.name || $.path,
          path: $.path,
          tags: $.tags
        });
        return;
      }
      if (!u.value) {
        n.value = [$];
        return;
      }
      n.value.find((Z) => Z.sha256 === $.sha256) ? n.value = n.value.filter((Z) => Z.sha256 !== $.sha256) : n.value = [...n.value, $];
    }, P = () => {
      if (m.value)
        if (u.value) {
          if (c.value) {
            const ee = o.value.map((te) => {
              const ne = r.value[te];
              if (ne) return ne;
              const _e = i.value[te];
              return Bc({
                name: (_e == null ? void 0 : _e.name) ?? "",
                full_path: (_e == null ? void 0 : _e.path) ?? "",
                strength_model: 1,
                strength_clip: 1,
                sha256: te,
                enabled: !0
              });
            }), Z = {
              version: Number(l.value) || 2,
              loras: ee
            };
            Yt(Z);
            return;
          }
          const $ = {
            version: 2,
            loras: n.value.map((ee) => ({
              name: ee.name || ee.path,
              full_path: ee.path,
              strength_model: 1,
              strength_clip: 1,
              sha256: ee.sha256,
              enabled: !0
            }))
          };
          Yt($);
        } else t.value && Yt({ ckpt_path: t.value.path });
    }, ce = () => {
      s.value = !s.value;
    };
    return ($, ee) => {
      var Z;
      return N(), _t(qi, { to: "body" }, [
        Ht(gn).isOpen ? (N(), R("div", {
          key: 0,
          class: be(["hikaze-modal-backdrop", { "is-fullscreen": s.value }]),
          onClick: Pe(T, ["self"])
        }, [
          v("div", {
            class: be(["hikaze-modal-content", { "is-fullscreen": s.value }])
          }, [
            v("div", pd, [
              v("div", gd, ge(d.value), 1),
              v("div", md, [
                u.value ? (N(), R("div", vd, ge(g.value) + " selected ", 1)) : xe("", !0),
                c.value ? (N(), R("button", {
                  key: 1,
                  class: "btn btn-secondary",
                  type: "button",
                  disabled: g.value === 0,
                  onClick: X
                }, " Clear selection ", 8, yd)) : xe("", !0),
                v("button", {
                  class: "btn btn-secondary btn-icon",
                  type: "button",
                  "aria-label": C.value,
                  title: C.value,
                  onClick: ce
                }, " 🗗 ", 8, _d),
                v("button", {
                  class: "btn btn-secondary",
                  onClick: T
                }, "Cancel"),
                v("button", {
                  class: "btn btn-primary",
                  disabled: !m.value,
                  onClick: P
                }, "Confirm", 8, bd)
              ])
            ]),
            v("div", Cd, [
              ve(Ru, {
                embedded: !0,
                initialTab: (Z = Ht(gn).options) == null ? void 0 : Z.initialTab
              }, {
                library: at(({ activeTab: te }) => [
                  v("div", Sd, [
                    c.value ? (N(), _t(hd, {
                      key: 0,
                      items: _.value,
                      onToggle: se,
                      onSelect: H
                    }, null, 8, ["items"])) : xe("", !0),
                    v("div", Td, [
                      ve(yf, {
                        "active-tab": te,
                        "selection-mode": c.value ? "lora" : void 0,
                        "selected-ids": o.value,
                        "exclude-selected": c.value,
                        onSelectModel: re,
                        onToggleSelect: K
                      }, null, 8, ["active-tab", "selection-mode", "selected-ids", "exclude-selected"])
                    ])
                  ])
                ]),
                details: at(() => [
                  ve(od, { model: t.value }, null, 8, ["model"])
                ]),
                _: 1
              }, 8, ["initialTab"])
            ])
          ], 2)
        ], 2)) : xe("", !0)
      ]);
    };
  }
}), Ed = /* @__PURE__ */ Xe(xd, [["__scopeId", "data-v-945e6f5c"]]), hi = "__hikazeCollapseHooked", pi = "__hikazeVueNodesSettingHooked";
class Ad {
  /**
   * Create the manager; call `install()` once ComfyUI app exists.
   */
  constructor(t) {
    Ce(this, "extName");
    Ce(this, "getComfyApp");
    Ce(this, "controllersByNode", /* @__PURE__ */ new WeakMap());
    Ce(this, "controllers", /* @__PURE__ */ new Set());
    Ce(this, "graphChangeListenerInstalled", !1);
    Ce(this, "collapseReinjectTimers", /* @__PURE__ */ new WeakMap());
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
    t.setAttribute("data-hikaze-global-host", "1"), t.style.display = "none", document.body.appendChild(t), Lr(Ed).mount(t);
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
    const s = this.getComfyApp(), o = this.getActiveGraph(s), i = { mode: t, reason: n, app: s, graph: o }, r = this.getGraphNodes(o);
    if (r)
      for (const l of r)
        this.isHikazeNode(l) && this.reinjectNode(l, i);
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
    const n = this.getNodeType(t), s = (n ? zt.resolve(n) : void 0) ?? zt, o = new s(t);
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
    fi(n, pi) || (di(n, pi), n.addEventListener(Xc, (o) => {
      var l;
      const i = !!((l = o == null ? void 0 : o.detail) != null && l.value), r = i ? "vue" : "legacy";
      console.info(
        `[${this.extName}] ${Rr} -> ${String(i)}`
      ), this.disposeAllControllers(), window.setTimeout(() => {
        this.reinjectAllForMode(r, "mode-changed");
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
    if (!t || typeof t != "object" || fi(t, hi)) return;
    const n = t.collapse;
    typeof n == "function" && (di(t, hi), t.collapse = (...s) => {
      var i, r;
      const o = !!((i = t == null ? void 0 : t.flags) != null && i.collapsed);
      try {
        return n.call(t, ...s);
      } finally {
        const l = !!((r = t == null ? void 0 : t.flags) != null && r.collapsed);
        o === l || (l ? this.disposeControllerIfExists(t) : this.scheduleReinjectSingleNode(t, "collapse-changed"));
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
    return !!n && n.startsWith(Zc);
  }
}
const kd = new URL("./hikaze-model-manager-2.css", import.meta.url), _s = document.createElement("link");
_s.rel = "stylesheet";
_s.type = "text/css";
_s.href = kd.href;
document.head.appendChild(_s);
const an = "Hikaze.ModelManager2";
console.info(`[${an}] loaded`);
const Md = globalThis;
Md.__HIKAZE_EMBEDDED__ = !0;
ru();
uu();
function Wr() {
  var t, n;
  const e = ((n = (t = globalThis == null ? void 0 : globalThis.comfyAPI) == null ? void 0 : t.app) == null ? void 0 : n.app) ?? (globalThis == null ? void 0 : globalThis.app);
  return e || console.warn(`[${an}] Failed to get app instance.`), e;
}
const zn = new Ad({
  extName: an,
  getComfyApp: Wr
});
function zr() {
  const e = Wr();
  if (!(e != null && e.registerExtension)) {
    setTimeout(zr, 250);
    return;
  }
  e.registerExtension({
    name: an,
    /**
     * Called when the app is initialized and ready.
     * We install our global event listeners here.
     */
    async setup(t) {
      console.info(`[${an}] setup() called`), zn.install();
    },
    /**
     * Called after a workflow is loaded (from file, API, or tab switch).
     * This is the ideal time to inject UI overlays for the entire graph.
     */
    async afterConfigureGraph(t) {
      zn.reinjectAll("graph-loaded");
    },
    /**
     * Called when a new node is added (e.g. from menu).
     */
    nodeCreated(t) {
      zn.onNodeCreated(t);
    },
    getCanvasMenuItems() {
      return [
        {
          content: "Reload Hikaze Node UI",
          // Manual reinjection is useful during development/debugging.
          callback: () => zn.reinjectAll("manual-reload")
        }
      ];
    }
  }), console.info(`[${an}] registered`);
}
zr();
//# sourceMappingURL=hikaze-model-manager.js.map
