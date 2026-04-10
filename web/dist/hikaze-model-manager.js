var Xl = Object.defineProperty;
var Zl = (e, t, n) => t in e ? Xl(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var fe = (e, t, n) => Zl(e, typeof t != "symbol" ? t + "" : t, n);
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
const ue = {}, nn = [], lt = () => {
}, bi = () => !1, ds = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), eo = (e) => e.startsWith("onUpdate:"), Se = Object.assign, to = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, Ql = Object.prototype.hasOwnProperty, re = (e, t) => Ql.call(e, t), q = Array.isArray, sn = (e) => fs(e) === "[object Map]", Ci = (e) => fs(e) === "[object Set]", Y = (e) => typeof e == "function", ve = (e) => typeof e == "string", St = (e) => typeof e == "symbol", pe = (e) => e !== null && typeof e == "object", Si = (e) => (pe(e) || Y(e)) && Y(e.then) && Y(e.catch), xi = Object.prototype.toString, fs = (e) => xi.call(e), er = (e) => fs(e).slice(8, -1), Ti = (e) => fs(e) === "[object Object]", no = (e) => ve(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, xn = /* @__PURE__ */ Qs(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), hs = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return ((n) => t[n] || (t[n] = e(n)));
}, tr = /-\w/g, It = hs(
  (e) => e.replace(tr, (t) => t.slice(1).toUpperCase())
), nr = /\B([A-Z])/g, Yt = hs(
  (e) => e.replace(nr, "-$1").toLowerCase()
), ki = hs((e) => e.charAt(0).toUpperCase() + e.slice(1)), Ts = hs(
  (e) => e ? `on${ki(e)}` : ""
), wt = (e, t) => !Object.is(e, t), Jn = (e, ...t) => {
  for (let n = 0; n < e.length; n++)
    e[n](...t);
}, Ei = (e, t, n, s = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: s,
    value: n
  });
}, so = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
}, sr = (e) => {
  const t = ve(e) ? Number(e) : NaN;
  return isNaN(t) ? e : t;
};
let To;
const ps = () => To || (To = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function Fe(e) {
  if (q(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const s = e[n], o = ve(s) ? rr(s) : Fe(s);
      if (o)
        for (const i in o)
          t[i] = o[i];
    }
    return t;
  } else if (ve(e) || pe(e))
    return e;
}
const or = /;(?![^(]*\))/g, ir = /:([^]+)/, lr = /\/\*[^]*?\*\//g;
function rr(e) {
  const t = {};
  return e.replace(lr, "").split(or).forEach((n) => {
    if (n) {
      const s = n.split(ir);
      s.length > 1 && (t[s[0].trim()] = s[1].trim());
    }
  }), t;
}
function ae(e) {
  let t = "";
  if (ve(e))
    t = e;
  else if (q(e))
    for (let n = 0; n < e.length; n++) {
      const s = ae(e[n]);
      s && (t += s + " ");
    }
  else if (pe(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
const ar = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", cr = /* @__PURE__ */ Qs(ar);
function $i(e) {
  return !!e || e === "";
}
const Ai = (e) => !!(e && e.__v_isRef === !0), Z = (e) => ve(e) ? e : e == null ? "" : q(e) || pe(e) && (e.toString === xi || !Y(e.toString)) ? Ai(e) ? Z(e.value) : JSON.stringify(e, Mi, 2) : String(e), Mi = (e, t) => Ai(t) ? Mi(e, t.value) : sn(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (n, [s, o], i) => (n[ks(s, i) + " =>"] = o, n),
    {}
  )
} : Ci(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((n) => ks(n))
} : St(t) ? ks(t) : pe(t) && !q(t) && !Ti(t) ? String(t) : t, ks = (e, t = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    St(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e
  );
};
/**
* @vue/reactivity v3.5.25
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let Ne;
class ur {
  constructor(t = !1) {
    this.detached = t, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this.parent = Ne, !t && Ne && (this.index = (Ne.scopes || (Ne.scopes = [])).push(
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
      const n = Ne;
      try {
        return Ne = this, t();
      } finally {
        Ne = n;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = Ne, Ne = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    this._on > 0 && --this._on === 0 && (Ne = this.prevScope, this.prevScope = void 0);
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
function dr() {
  return Ne;
}
let he;
const Es = /* @__PURE__ */ new WeakSet();
class wi {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Ne && Ne.active && Ne.effects.push(this);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, Es.has(this) && (Es.delete(this), this.trigger()));
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
    this.flags |= 2, ko(this), Oi(this);
    const t = he, n = Je;
    he = this, Je = !0;
    try {
      return this.fn();
    } finally {
      Pi(this), he = t, Je = n, this.flags &= -3;
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
    this.flags & 64 ? Es.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
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
let Ii = 0, Tn, kn;
function Li(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = kn, kn = e;
    return;
  }
  e.next = Tn, Tn = e;
}
function oo() {
  Ii++;
}
function io() {
  if (--Ii > 0)
    return;
  if (kn) {
    let t = kn;
    for (kn = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; Tn; ) {
    let t = Tn;
    for (Tn = void 0; t; ) {
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
function Oi(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Pi(e) {
  let t, n = e.depsTail, s = n;
  for (; s; ) {
    const o = s.prevDep;
    s.version === -1 ? (s === n && (n = o), lo(s), fr(s)) : t = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = o;
  }
  e.deps = t, e.depsTail = n;
}
function Ds(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (Ni(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function Ni(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === In) || (e.globalVersion = In, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Ds(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = he, s = Je;
  he = e, Je = !0;
  try {
    Oi(e);
    const o = e.fn(e._value);
    (t.version === 0 || wt(o, e._value)) && (e.flags |= 128, e._value = o, t.version++);
  } catch (o) {
    throw t.version++, o;
  } finally {
    he = n, Je = s, Pi(e), e.flags &= -3;
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
function fr(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
let Je = !0;
const Fi = [];
function _t() {
  Fi.push(Je), Je = !1;
}
function bt() {
  const e = Fi.pop();
  Je = e === void 0 ? !0 : e;
}
function ko(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = he;
    he = void 0;
    try {
      t();
    } finally {
      he = n;
    }
  }
}
let In = 0;
class hr {
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
    if (!he || !Je || he === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== he)
      n = this.activeLink = new hr(he, this), he.deps ? (n.prevDep = he.depsTail, he.depsTail.nextDep = n, he.depsTail = n) : he.deps = he.depsTail = n, Ri(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const s = n.nextDep;
      s.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = s), n.prevDep = he.depsTail, n.nextDep = void 0, he.depsTail.nextDep = n, he.depsTail = n, he.deps === n && (he.deps = s);
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
function Ri(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let s = t.deps; s; s = s.nextDep)
        Ri(s);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
  }
}
const Hs = /* @__PURE__ */ new WeakMap(), Wt = Symbol(
  ""
), js = Symbol(
  ""
), Ln = Symbol(
  ""
);
function Te(e, t, n) {
  if (Je && he) {
    let s = Hs.get(e);
    s || Hs.set(e, s = /* @__PURE__ */ new Map());
    let o = s.get(n);
    o || (s.set(n, o = new ro()), o.map = s, o.key = n), o.track();
  }
}
function vt(e, t, n, s, o, i) {
  const l = Hs.get(e);
  if (!l) {
    In++;
    return;
  }
  const r = (c) => {
    c && c.trigger();
  };
  if (oo(), t === "clear")
    l.forEach(r);
  else {
    const c = q(e), h = c && no(n);
    if (c && n === "length") {
      const d = Number(s);
      l.forEach((f, m) => {
        (m === "length" || m === Ln || !St(m) && m >= d) && r(f);
      });
    } else
      switch ((n !== void 0 || l.has(void 0)) && r(l.get(n)), h && r(l.get(Ln)), t) {
        case "add":
          c ? h && r(l.get("length")) : (r(l.get(Wt)), sn(e) && r(l.get(js)));
          break;
        case "delete":
          c || (r(l.get(Wt)), sn(e) && r(l.get(js)));
          break;
        case "set":
          sn(e) && r(l.get(Wt));
          break;
      }
  }
  io();
}
function Zt(e) {
  const t = le(e);
  return t === e ? t : (Te(t, "iterate", Ln), Ue(e) ? t : t.map(Ye));
}
function gs(e) {
  return Te(e = le(e), "iterate", Ln), e;
}
function $t(e, t) {
  return Ct(e) ? Ut(e) ? hn(Ye(t)) : hn(t) : Ye(t);
}
const pr = {
  __proto__: null,
  [Symbol.iterator]() {
    return $s(this, Symbol.iterator, (e) => $t(this, e));
  },
  concat(...e) {
    return Zt(this).concat(
      ...e.map((t) => q(t) ? Zt(t) : t)
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
    return As(this, "includes", e);
  },
  indexOf(...e) {
    return As(this, "indexOf", e);
  },
  join(e) {
    return Zt(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return As(this, "lastIndexOf", e);
  },
  map(e, t) {
    return ft(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return vn(this, "pop");
  },
  push(...e) {
    return vn(this, "push", e);
  },
  reduce(e, ...t) {
    return Eo(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return Eo(this, "reduceRight", e, t);
  },
  shift() {
    return vn(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return ft(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return vn(this, "splice", e);
  },
  toReversed() {
    return Zt(this).toReversed();
  },
  toSorted(e) {
    return Zt(this).toSorted(e);
  },
  toSpliced(...e) {
    return Zt(this).toSpliced(...e);
  },
  unshift(...e) {
    return vn(this, "unshift", e);
  },
  values() {
    return $s(this, "values", (e) => $t(this, e));
  }
};
function $s(e, t, n) {
  const s = gs(e), o = s[t]();
  return s !== e && !Ue(e) && (o._next = o.next, o.next = () => {
    const i = o._next();
    return i.done || (i.value = n(i.value)), i;
  }), o;
}
const gr = Array.prototype;
function ft(e, t, n, s, o, i) {
  const l = gs(e), r = l !== e && !Ue(e), c = l[t];
  if (c !== gr[t]) {
    const f = c.apply(e, i);
    return r ? Ye(f) : f;
  }
  let h = n;
  l !== e && (r ? h = function(f, m) {
    return n.call(this, $t(e, f), m, e);
  } : n.length > 2 && (h = function(f, m) {
    return n.call(this, f, m, e);
  }));
  const d = c.call(l, h, s);
  return r && o ? o(d) : d;
}
function Eo(e, t, n, s) {
  const o = gs(e);
  let i = n;
  return o !== e && (Ue(e) ? n.length > 3 && (i = function(l, r, c) {
    return n.call(this, l, r, c, e);
  }) : i = function(l, r, c) {
    return n.call(this, l, $t(e, r), c, e);
  }), o[t](i, ...s);
}
function As(e, t, n) {
  const s = le(e);
  Te(s, "iterate", Ln);
  const o = s[t](...n);
  return (o === -1 || o === !1) && uo(n[0]) ? (n[0] = le(n[0]), s[t](...n)) : o;
}
function vn(e, t, n = []) {
  _t(), oo();
  const s = le(e)[t].apply(e, n);
  return io(), bt(), s;
}
const mr = /* @__PURE__ */ Qs("__proto__,__v_isRef,__isVue"), Di = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(St)
);
function vr(e) {
  St(e) || (e = String(e));
  const t = le(this);
  return Te(t, "has", e), t.hasOwnProperty(e);
}
class Hi {
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
      return s === (o ? i ? $r : Bi : i ? Vi : zi).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(s) ? t : void 0;
    const l = q(t);
    if (!o) {
      let c;
      if (l && (c = pr[n]))
        return c;
      if (n === "hasOwnProperty")
        return vr;
    }
    const r = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      $e(t) ? t : s
    );
    if ((St(n) ? Di.has(n) : mr(n)) || (o || Te(t, "get", n), i))
      return r;
    if ($e(r)) {
      const c = l && no(n) ? r : r.value;
      return o && pe(c) ? es(c) : c;
    }
    return pe(r) ? o ? es(r) : ye(r) : r;
  }
}
class ji extends Hi {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, s, o) {
    let i = t[n];
    const l = q(t) && no(n);
    if (!this._isShallow) {
      const h = Ct(i);
      if (!Ue(s) && !Ct(s) && (i = le(i), s = le(s)), !l && $e(i) && !$e(s))
        return h || (i.value = s), !0;
    }
    const r = l ? Number(n) < t.length : re(t, n), c = Reflect.set(
      t,
      n,
      s,
      $e(t) ? t : o
    );
    return t === le(o) && (r ? wt(s, i) && vt(t, "set", n, s) : vt(t, "add", n, s)), c;
  }
  deleteProperty(t, n) {
    const s = re(t, n);
    t[n];
    const o = Reflect.deleteProperty(t, n);
    return o && s && vt(t, "delete", n, void 0), o;
  }
  has(t, n) {
    const s = Reflect.has(t, n);
    return (!St(n) || !Di.has(n)) && Te(t, "has", n), s;
  }
  ownKeys(t) {
    return Te(
      t,
      "iterate",
      q(t) ? "length" : Wt
    ), Reflect.ownKeys(t);
  }
}
class yr extends Hi {
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
const _r = /* @__PURE__ */ new ji(), br = /* @__PURE__ */ new yr(), Cr = /* @__PURE__ */ new ji(!0);
const zs = (e) => e, Bn = (e) => Reflect.getPrototypeOf(e);
function Sr(e, t, n) {
  return function(...s) {
    const o = this.__v_raw, i = le(o), l = sn(i), r = e === "entries" || e === Symbol.iterator && l, c = e === "keys" && l, h = o[e](...s), d = n ? zs : t ? hn : Ye;
    return !t && Te(
      i,
      "iterate",
      c ? js : Wt
    ), {
      // iterator protocol
      next() {
        const { value: f, done: m } = h.next();
        return m ? { value: f, done: m } : {
          value: r ? [d(f[0]), d(f[1])] : d(f),
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
function Wn(e) {
  return function(...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function xr(e, t) {
  const n = {
    get(o) {
      const i = this.__v_raw, l = le(i), r = le(o);
      e || (wt(o, r) && Te(l, "get", o), Te(l, "get", r));
      const { has: c } = Bn(l), h = t ? zs : e ? hn : Ye;
      if (c.call(l, o))
        return h(i.get(o));
      if (c.call(l, r))
        return h(i.get(r));
      i !== l && i.get(o);
    },
    get size() {
      const o = this.__v_raw;
      return !e && Te(le(o), "iterate", Wt), o.size;
    },
    has(o) {
      const i = this.__v_raw, l = le(i), r = le(o);
      return e || (wt(o, r) && Te(l, "has", o), Te(l, "has", r)), o === r ? i.has(o) : i.has(o) || i.has(r);
    },
    forEach(o, i) {
      const l = this, r = l.__v_raw, c = le(r), h = t ? zs : e ? hn : Ye;
      return !e && Te(c, "iterate", Wt), r.forEach((d, f) => o.call(i, h(d), h(f), l));
    }
  };
  return Se(
    n,
    e ? {
      add: Wn("add"),
      set: Wn("set"),
      delete: Wn("delete"),
      clear: Wn("clear")
    } : {
      add(o) {
        !t && !Ue(o) && !Ct(o) && (o = le(o));
        const i = le(this);
        return Bn(i).has.call(i, o) || (i.add(o), vt(i, "add", o, o)), this;
      },
      set(o, i) {
        !t && !Ue(i) && !Ct(i) && (i = le(i));
        const l = le(this), { has: r, get: c } = Bn(l);
        let h = r.call(l, o);
        h || (o = le(o), h = r.call(l, o));
        const d = c.call(l, o);
        return l.set(o, i), h ? wt(i, d) && vt(l, "set", o, i) : vt(l, "add", o, i), this;
      },
      delete(o) {
        const i = le(this), { has: l, get: r } = Bn(i);
        let c = l.call(i, o);
        c || (o = le(o), c = l.call(i, o)), r && r.call(i, o);
        const h = i.delete(o);
        return c && vt(i, "delete", o, void 0), h;
      },
      clear() {
        const o = le(this), i = o.size !== 0, l = o.clear();
        return i && vt(
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
    n[o] = Sr(o, e, t);
  }), n;
}
function ao(e, t) {
  const n = xr(e, t);
  return (s, o, i) => o === "__v_isReactive" ? !e : o === "__v_isReadonly" ? e : o === "__v_raw" ? s : Reflect.get(
    re(n, o) && o in s ? n : s,
    o,
    i
  );
}
const Tr = {
  get: /* @__PURE__ */ ao(!1, !1)
}, kr = {
  get: /* @__PURE__ */ ao(!1, !0)
}, Er = {
  get: /* @__PURE__ */ ao(!0, !1)
};
const zi = /* @__PURE__ */ new WeakMap(), Vi = /* @__PURE__ */ new WeakMap(), Bi = /* @__PURE__ */ new WeakMap(), $r = /* @__PURE__ */ new WeakMap();
function Ar(e) {
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
function Mr(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : Ar(er(e));
}
function ye(e) {
  return Ct(e) ? e : co(
    e,
    !1,
    _r,
    Tr,
    zi
  );
}
function wr(e) {
  return co(
    e,
    !1,
    Cr,
    kr,
    Vi
  );
}
function es(e) {
  return co(
    e,
    !0,
    br,
    Er,
    Bi
  );
}
function co(e, t, n, s, o) {
  if (!pe(e) || e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const i = Mr(e);
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
function Ut(e) {
  return Ct(e) ? Ut(e.__v_raw) : !!(e && e.__v_isReactive);
}
function Ct(e) {
  return !!(e && e.__v_isReadonly);
}
function Ue(e) {
  return !!(e && e.__v_isShallow);
}
function uo(e) {
  return e ? !!e.__v_raw : !1;
}
function le(e) {
  const t = e && e.__v_raw;
  return t ? le(t) : e;
}
function Ir(e) {
  return !re(e, "__v_skip") && Object.isExtensible(e) && Ei(e, "__v_skip", !0), e;
}
const Ye = (e) => pe(e) ? ye(e) : e, hn = (e) => pe(e) ? es(e) : e;
function $e(e) {
  return e ? e.__v_isRef === !0 : !1;
}
function V(e) {
  return Lr(e, !1);
}
function Lr(e, t) {
  return $e(e) ? e : new Or(e, t);
}
class Or {
  constructor(t, n) {
    this.dep = new ro(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? t : le(t), this._value = n ? t : Ye(t), this.__v_isShallow = n;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(t) {
    const n = this._rawValue, s = this.__v_isShallow || Ue(t) || Ct(t);
    t = s ? t : le(t), wt(t, n) && (this._rawValue = t, this._value = s ? t : Ye(t), this.dep.trigger());
  }
}
function qe(e) {
  return $e(e) ? e.value : e;
}
const Pr = {
  get: (e, t, n) => t === "__v_raw" ? e : qe(Reflect.get(e, t, n)),
  set: (e, t, n, s) => {
    const o = e[t];
    return $e(o) && !$e(n) ? (o.value = n, !0) : Reflect.set(e, t, n, s);
  }
};
function Wi(e) {
  return Ut(e) ? e : new Proxy(e, Pr);
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
    he !== this)
      return Li(this, !0), !0;
  }
  get value() {
    const t = this.dep.track();
    return Ni(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
function Fr(e, t, n = !1) {
  let s, o;
  return Y(e) ? s = e : (s = e.get, o = e.set), new Nr(s, o, n);
}
const Un = {}, ts = /* @__PURE__ */ new WeakMap();
let jt;
function Rr(e, t = !1, n = jt) {
  if (n) {
    let s = ts.get(n);
    s || ts.set(n, s = []), s.push(e);
  }
}
function Dr(e, t, n = ue) {
  const { immediate: s, deep: o, once: i, scheduler: l, augmentJob: r, call: c } = n, h = (S) => o ? S : Ue(S) || o === !1 || o === 0 ? yt(S, 1) : yt(S);
  let d, f, m, _, E = !1, T = !1;
  if ($e(e) ? (f = () => e.value, E = Ue(e)) : Ut(e) ? (f = () => h(e), E = !0) : q(e) ? (T = !0, E = e.some((S) => Ut(S) || Ue(S)), f = () => e.map((S) => {
    if ($e(S))
      return S.value;
    if (Ut(S))
      return h(S);
    if (Y(S))
      return c ? c(S, 2) : S();
  })) : Y(e) ? t ? f = c ? () => c(e, 2) : e : f = () => {
    if (m) {
      _t();
      try {
        m();
      } finally {
        bt();
      }
    }
    const S = jt;
    jt = d;
    try {
      return c ? c(e, 3, [_]) : e(_);
    } finally {
      jt = S;
    }
  } : f = lt, t && o) {
    const S = f, D = o === !0 ? 1 / 0 : o;
    f = () => yt(S(), D);
  }
  const N = dr(), C = () => {
    d.stop(), N && N.active && to(N.effects, d);
  };
  if (i && t) {
    const S = t;
    t = (...D) => {
      S(...D), C();
    };
  }
  let v = T ? new Array(e.length).fill(Un) : Un;
  const b = (S) => {
    if (!(!(d.flags & 1) || !d.dirty && !S))
      if (t) {
        const D = d.run();
        if (o || E || (T ? D.some((j, ee) => wt(j, v[ee])) : wt(D, v))) {
          m && m();
          const j = jt;
          jt = d;
          try {
            const ee = [
              D,
              // pass undefined as the old value when it's changed for the first time
              v === Un ? void 0 : T && v[0] === Un ? [] : v,
              _
            ];
            v = D, c ? c(t, 3, ee) : (
              // @ts-expect-error
              t(...ee)
            );
          } finally {
            jt = j;
          }
        }
      } else
        d.run();
  };
  return r && r(b), d = new wi(f), d.scheduler = l ? () => l(b, !1) : b, _ = (S) => Rr(S, !1, d), m = d.onStop = () => {
    const S = ts.get(d);
    if (S) {
      if (c)
        c(S, 4);
      else
        for (const D of S) D();
      ts.delete(d);
    }
  }, t ? s ? b(!0) : v = d.run() : l ? l(b.bind(null, !0), !0) : d.run(), C.pause = d.pause.bind(d), C.resume = d.resume.bind(d), C.stop = C, C;
}
function yt(e, t = 1 / 0, n) {
  if (t <= 0 || !pe(e) || e.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t))
    return e;
  if (n.set(e, t), t--, $e(e))
    yt(e.value, t, n);
  else if (q(e))
    for (let s = 0; s < e.length; s++)
      yt(e[s], t, n);
  else if (Ci(e) || sn(e))
    e.forEach((s) => {
      yt(s, t, n);
    });
  else if (Ti(e)) {
    for (const s in e)
      yt(e[s], t, n);
    for (const s of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, s) && yt(e[s], t, n);
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
    ms(o, t, n);
  }
}
function Xe(e, t, n, s) {
  if (Y(e)) {
    const o = jn(e, t, n, s);
    return o && Si(o) && o.catch((i) => {
      ms(i, t, n);
    }), o;
  }
  if (q(e)) {
    const o = [];
    for (let i = 0; i < e.length; i++)
      o.push(Xe(e[i], t, n, s));
    return o;
  }
}
function ms(e, t, n, s = !0) {
  const o = t ? t.vnode : null, { errorHandler: i, throwUnhandledErrorInProduction: l } = t && t.appContext.config || ue;
  if (t) {
    let r = t.parent;
    const c = t.proxy, h = `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; r; ) {
      const d = r.ec;
      if (d) {
        for (let f = 0; f < d.length; f++)
          if (d[f](e, c, h) === !1)
            return;
      }
      r = r.parent;
    }
    if (i) {
      _t(), jn(i, null, 10, [
        e,
        c,
        h
      ]), bt();
      return;
    }
  }
  Hr(e, n, o, s, l);
}
function Hr(e, t, n, s = !0, o = !1) {
  if (o)
    throw e;
  console.error(e);
}
const Ie = [];
let nt = -1;
const on = [];
let At = null, Qt = 0;
const Ui = /* @__PURE__ */ Promise.resolve();
let ns = null;
function fo(e) {
  const t = ns || Ui;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function jr(e) {
  let t = nt + 1, n = Ie.length;
  for (; t < n; ) {
    const s = t + n >>> 1, o = Ie[s], i = On(o);
    i < e || i === e && o.flags & 2 ? t = s + 1 : n = s;
  }
  return t;
}
function ho(e) {
  if (!(e.flags & 1)) {
    const t = On(e), n = Ie[Ie.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(e.flags & 2) && t >= On(n) ? Ie.push(e) : Ie.splice(jr(t), 0, e), e.flags |= 1, Ki();
  }
}
function Ki() {
  ns || (ns = Ui.then(qi));
}
function zr(e) {
  q(e) ? on.push(...e) : At && e.id === -1 ? At.splice(Qt + 1, 0, e) : e.flags & 1 || (on.push(e), e.flags |= 1), Ki();
}
function $o(e, t, n = nt + 1) {
  for (; n < Ie.length; n++) {
    const s = Ie[n];
    if (s && s.flags & 2) {
      if (e && s.id !== e.uid)
        continue;
      Ie.splice(n, 1), n--, s.flags & 4 && (s.flags &= -2), s(), s.flags & 4 || (s.flags &= -2);
    }
  }
}
function Gi(e) {
  if (on.length) {
    const t = [...new Set(on)].sort(
      (n, s) => On(n) - On(s)
    );
    if (on.length = 0, At) {
      At.push(...t);
      return;
    }
    for (At = t, Qt = 0; Qt < At.length; Qt++) {
      const n = At[Qt];
      n.flags & 4 && (n.flags &= -2), n.flags & 8 || n(), n.flags &= -2;
    }
    At = null, Qt = 0;
  }
}
const On = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function qi(e) {
  try {
    for (nt = 0; nt < Ie.length; nt++) {
      const t = Ie[nt];
      t && !(t.flags & 8) && (t.flags & 4 && (t.flags &= -2), jn(
        t,
        t.i,
        t.i ? 15 : 14
      ), t.flags & 4 || (t.flags &= -2));
    }
  } finally {
    for (; nt < Ie.length; nt++) {
      const t = Ie[nt];
      t && (t.flags &= -2);
    }
    nt = -1, Ie.length = 0, Gi(), ns = null, (Ie.length || on.length) && qi();
  }
}
let Ee = null, Ji = null;
function ss(e) {
  const t = Ee;
  return Ee = e, Ji = e && e.type.__scopeId || null, t;
}
function rt(e, t = Ee, n) {
  if (!t || e._n)
    return e;
  const s = (...o) => {
    s._d && ls(-1);
    const i = ss(t);
    let l;
    try {
      l = e(...o);
    } finally {
      ss(i), s._d && ls(1);
    }
    return l;
  };
  return s._n = !0, s._c = !0, s._d = !0, s;
}
function We(e, t) {
  if (Ee === null)
    return e;
  const n = Cs(Ee), s = e.dirs || (e.dirs = []);
  for (let o = 0; o < t.length; o++) {
    let [i, l, r, c = ue] = t[o];
    i && (Y(i) && (i = {
      mounted: i,
      updated: i
    }), i.deep && yt(l), s.push({
      dir: i,
      instance: n,
      value: l,
      oldValue: void 0,
      arg: r,
      modifiers: c
    }));
  }
  return e;
}
function Ft(e, t, n, s) {
  const o = e.dirs, i = t && t.dirs;
  for (let l = 0; l < o.length; l++) {
    const r = o[l];
    i && (r.oldValue = i[l].value);
    let c = r.dir[s];
    c && (_t(), Xe(c, n, 8, [
      e.el,
      r,
      e,
      t
    ]), bt());
  }
}
const Yi = Symbol("_vte"), Xi = (e) => e.__isTeleport, En = (e) => e && (e.disabled || e.disabled === ""), Ao = (e) => e && (e.defer || e.defer === ""), Mo = (e) => typeof SVGElement < "u" && e instanceof SVGElement, wo = (e) => typeof MathMLElement == "function" && e instanceof MathMLElement, Vs = (e, t) => {
  const n = e && e.to;
  return ve(n) ? t ? t(n) : null : n;
}, Zi = {
  name: "Teleport",
  __isTeleport: !0,
  process(e, t, n, s, o, i, l, r, c, h) {
    const {
      mc: d,
      pc: f,
      pbc: m,
      o: { insert: _, querySelector: E, createText: T, createComment: N }
    } = h, C = En(t.props);
    let { shapeFlag: v, children: b, dynamicChildren: S } = t;
    if (e == null) {
      const D = t.el = T(""), j = t.anchor = T("");
      _(D, n, s), _(j, n, s);
      const ee = (z, U) => {
        v & 16 && d(
          b,
          z,
          U,
          o,
          i,
          l,
          r,
          c
        );
      }, J = () => {
        const z = t.target = Vs(t.props, E), U = el(z, t, T, _);
        z && (l !== "svg" && Mo(z) ? l = "svg" : l !== "mathml" && wo(z) && (l = "mathml"), o && o.isCE && (o.ce._teleportTargets || (o.ce._teleportTargets = /* @__PURE__ */ new Set())).add(z), C || (ee(z, U), Yn(t, !1)));
      };
      C && (ee(n, j), Yn(t, !0)), Ao(t.props) ? (t.el.__isMounted = !1, we(() => {
        J(), delete t.el.__isMounted;
      }, i)) : J();
    } else {
      if (Ao(t.props) && e.el.__isMounted === !1) {
        we(() => {
          Zi.process(
            e,
            t,
            n,
            s,
            o,
            i,
            l,
            r,
            c,
            h
          );
        }, i);
        return;
      }
      t.el = e.el, t.targetStart = e.targetStart;
      const D = t.anchor = e.anchor, j = t.target = e.target, ee = t.targetAnchor = e.targetAnchor, J = En(e.props), z = J ? n : j, U = J ? D : ee;
      if (l === "svg" || Mo(j) ? l = "svg" : (l === "mathml" || wo(j)) && (l = "mathml"), S ? (m(
        e.dynamicChildren,
        S,
        z,
        o,
        i,
        l,
        r
      ), mo(e, t, !0)) : c || f(
        e,
        t,
        z,
        U,
        o,
        i,
        l,
        r,
        !1
      ), C)
        J ? t.props && e.props && t.props.to !== e.props.to && (t.props.to = e.props.to) : Kn(
          t,
          n,
          D,
          h,
          1
        );
      else if ((t.props && t.props.to) !== (e.props && e.props.to)) {
        const oe = t.target = Vs(
          t.props,
          E
        );
        oe && Kn(
          t,
          oe,
          null,
          h,
          0
        );
      } else J && Kn(
        t,
        j,
        ee,
        h,
        1
      );
      Yn(t, C);
    }
  },
  remove(e, t, n, { um: s, o: { remove: o } }, i) {
    const {
      shapeFlag: l,
      children: r,
      anchor: c,
      targetStart: h,
      targetAnchor: d,
      target: f,
      props: m
    } = e;
    if (f && (o(h), o(d)), i && o(c), l & 16) {
      const _ = i || !En(m);
      for (let E = 0; E < r.length; E++) {
        const T = r[E];
        s(
          T,
          t,
          n,
          _,
          !!T.dynamicChildren
        );
      }
    }
  },
  move: Kn,
  hydrate: Vr
};
function Kn(e, t, n, { o: { insert: s }, m: o }, i = 2) {
  i === 0 && s(e.targetAnchor, t, n);
  const { el: l, anchor: r, shapeFlag: c, children: h, props: d } = e, f = i === 2;
  if (f && s(l, t, n), (!f || En(d)) && c & 16)
    for (let m = 0; m < h.length; m++)
      o(
        h[m],
        t,
        n,
        2
      );
  f && s(r, t, n);
}
function Vr(e, t, n, s, o, i, {
  o: { nextSibling: l, parentNode: r, querySelector: c, insert: h, createText: d }
}, f) {
  function m(T, N, C, v) {
    N.anchor = f(
      l(T),
      N,
      r(T),
      n,
      s,
      o,
      i
    ), N.targetStart = C, N.targetAnchor = v;
  }
  const _ = t.target = Vs(
    t.props,
    c
  ), E = En(t.props);
  if (_) {
    const T = _._lpa || _.firstChild;
    if (t.shapeFlag & 16)
      if (E)
        m(
          e,
          t,
          T,
          T && l(T)
        );
      else {
        t.anchor = l(e);
        let N = T;
        for (; N; ) {
          if (N && N.nodeType === 8) {
            if (N.data === "teleport start anchor")
              t.targetStart = N;
            else if (N.data === "teleport anchor") {
              t.targetAnchor = N, _._lpa = t.targetAnchor && l(t.targetAnchor);
              break;
            }
          }
          N = l(N);
        }
        t.targetAnchor || el(_, t, d, h), f(
          T && l(T),
          t,
          _,
          n,
          s,
          o,
          i
        );
      }
    Yn(t, E);
  } else E && t.shapeFlag & 16 && m(e, t, e, l(e));
  return t.anchor && l(t.anchor);
}
const Qi = Zi;
function Yn(e, t) {
  const n = e.ctx;
  if (n && n.ut) {
    let s, o;
    for (t ? (s = e.el, o = e.anchor) : (s = e.targetStart, o = e.targetAnchor); s && s !== o; )
      s.nodeType === 1 && s.setAttribute("data-v-owner", n.uid), s = s.nextSibling;
    n.ut();
  }
}
function el(e, t, n, s) {
  const o = t.targetStart = n(""), i = t.targetAnchor = n("");
  return o[Yi] = i, e && (s(o, e), s(i, e)), i;
}
const gt = Symbol("_leaveCb"), Gn = Symbol("_enterCb");
function Br() {
  const e = {
    isMounted: !1,
    isLeaving: !1,
    isUnmounting: !1,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  return Ot(() => {
    e.isMounted = !0;
  }), al(() => {
    e.isUnmounting = !0;
  }), e;
}
const Be = [Function, Array], tl = {
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
}, nl = (e) => {
  const t = e.subTree;
  return t.component ? nl(t.component) : t;
}, Wr = {
  name: "BaseTransition",
  props: tl,
  setup(e, { slots: t }) {
    const n = Al(), s = Br();
    return () => {
      const o = t.default && il(t.default(), !0);
      if (!o || !o.length)
        return;
      const i = sl(o), l = le(e), { mode: r } = l;
      if (s.isLeaving)
        return Ms(i);
      const c = Io(i);
      if (!c)
        return Ms(i);
      let h = Bs(
        c,
        l,
        s,
        n,
        // #11061, ensure enterHooks is fresh after clone
        (f) => h = f
      );
      c.type !== ke && Pn(c, h);
      let d = n.subTree && Io(n.subTree);
      if (d && d.type !== ke && !Vt(d, c) && nl(n).type !== ke) {
        let f = Bs(
          d,
          l,
          s,
          n
        );
        if (Pn(d, f), r === "out-in" && c.type !== ke)
          return s.isLeaving = !0, f.afterLeave = () => {
            s.isLeaving = !1, n.job.flags & 8 || n.update(), delete f.afterLeave, d = void 0;
          }, Ms(i);
        r === "in-out" && c.type !== ke ? f.delayLeave = (m, _, E) => {
          const T = ol(
            s,
            d
          );
          T[String(d.key)] = d, m[gt] = () => {
            _(), m[gt] = void 0, delete h.delayedLeave, d = void 0;
          }, h.delayedLeave = () => {
            E(), delete h.delayedLeave, d = void 0;
          };
        } : d = void 0;
      } else d && (d = void 0);
      return i;
    };
  }
};
function sl(e) {
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
const Ur = Wr;
function ol(e, t) {
  const { leavingVNodes: n } = e;
  let s = n.get(t.type);
  return s || (s = /* @__PURE__ */ Object.create(null), n.set(t.type, s)), s;
}
function Bs(e, t, n, s, o) {
  const {
    appear: i,
    mode: l,
    persisted: r = !1,
    onBeforeEnter: c,
    onEnter: h,
    onAfterEnter: d,
    onEnterCancelled: f,
    onBeforeLeave: m,
    onLeave: _,
    onAfterLeave: E,
    onLeaveCancelled: T,
    onBeforeAppear: N,
    onAppear: C,
    onAfterAppear: v,
    onAppearCancelled: b
  } = t, S = String(e.key), D = ol(n, e), j = (z, U) => {
    z && Xe(
      z,
      s,
      9,
      U
    );
  }, ee = (z, U) => {
    const oe = U[1];
    j(z, U), q(z) ? z.every((A) => A.length <= 1) && oe() : z.length <= 1 && oe();
  }, J = {
    mode: l,
    persisted: r,
    beforeEnter(z) {
      let U = c;
      if (!n.isMounted)
        if (i)
          U = N || c;
        else
          return;
      z[gt] && z[gt](
        !0
        /* cancelled */
      );
      const oe = D[S];
      oe && Vt(e, oe) && oe.el[gt] && oe.el[gt](), j(U, [z]);
    },
    enter(z) {
      let U = h, oe = d, A = f;
      if (!n.isMounted)
        if (i)
          U = C || h, oe = v || d, A = b || f;
        else
          return;
      let R = !1;
      const H = z[Gn] = (Q) => {
        R || (R = !0, Q ? j(A, [z]) : j(oe, [z]), J.delayedLeave && J.delayedLeave(), z[Gn] = void 0);
      };
      U ? ee(U, [z, H]) : H();
    },
    leave(z, U) {
      const oe = String(e.key);
      if (z[Gn] && z[Gn](
        !0
        /* cancelled */
      ), n.isUnmounting)
        return U();
      j(m, [z]);
      let A = !1;
      const R = z[gt] = (H) => {
        A || (A = !0, U(), H ? j(T, [z]) : j(E, [z]), z[gt] = void 0, D[oe] === e && delete D[oe]);
      };
      D[oe] = e, _ ? ee(_, [z, R]) : R();
    },
    clone(z) {
      const U = Bs(
        z,
        t,
        n,
        s,
        o
      );
      return o && o(U), U;
    }
  };
  return J;
}
function Ms(e) {
  if (vs(e))
    return e = Lt(e), e.children = null, e;
}
function Io(e) {
  if (!vs(e))
    return Xi(e.type) && e.children ? sl(e.children) : e;
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
function il(e, t = !1, n) {
  let s = [], o = 0;
  for (let i = 0; i < e.length; i++) {
    let l = e[i];
    const r = n == null ? l.key : String(n) + String(l.key != null ? l.key : i);
    l.type === ie ? (l.patchFlag & 128 && o++, s = s.concat(
      il(l.children, t, r)
    )) : (t || l.type !== ke) && s.push(r != null ? Lt(l, { key: r }) : l);
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
function ll(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
const os = /* @__PURE__ */ new WeakMap();
function $n(e, t, n, s, o = !1) {
  if (q(e)) {
    e.forEach(
      (E, T) => $n(
        E,
        t && (q(t) ? t[T] : t),
        n,
        s,
        o
      )
    );
    return;
  }
  if (ln(s) && !o) {
    s.shapeFlag & 512 && s.type.__asyncResolved && s.component.subTree.component && $n(e, t, n, s.component.subTree);
    return;
  }
  const i = s.shapeFlag & 4 ? Cs(s.component) : s.el, l = o ? null : i, { i: r, r: c } = e, h = t && t.r, d = r.refs === ue ? r.refs = {} : r.refs, f = r.setupState, m = le(f), _ = f === ue ? bi : (E) => re(m, E);
  if (h != null && h !== c) {
    if (Lo(t), ve(h))
      d[h] = null, _(h) && (f[h] = null);
    else if ($e(h)) {
      h.value = null;
      const E = t;
      E.k && (d[E.k] = null);
    }
  }
  if (Y(c))
    jn(c, r, 12, [l, d]);
  else {
    const E = ve(c), T = $e(c);
    if (E || T) {
      const N = () => {
        if (e.f) {
          const C = E ? _(c) ? f[c] : d[c] : c.value;
          if (o)
            q(C) && to(C, i);
          else if (q(C))
            C.includes(i) || C.push(i);
          else if (E)
            d[c] = [i], _(c) && (f[c] = d[c]);
          else {
            const v = [i];
            c.value = v, e.k && (d[e.k] = v);
          }
        } else E ? (d[c] = l, _(c) && (f[c] = l)) : T && (c.value = l, e.k && (d[e.k] = l));
      };
      if (l) {
        const C = () => {
          N(), os.delete(e);
        };
        C.id = -1, os.set(e, C), we(C, n);
      } else
        Lo(e), N();
    }
  }
}
function Lo(e) {
  const t = os.get(e);
  t && (t.flags |= 8, os.delete(e));
}
ps().requestIdleCallback;
ps().cancelIdleCallback;
const ln = (e) => !!e.type.__asyncLoader, vs = (e) => e.type.__isKeepAlive;
function Kr(e, t) {
  rl(e, "a", t);
}
function Gr(e, t) {
  rl(e, "da", t);
}
function rl(e, t, n = Le) {
  const s = e.__wdc || (e.__wdc = () => {
    let o = n;
    for (; o; ) {
      if (o.isDeactivated)
        return;
      o = o.parent;
    }
    return e();
  });
  if (ys(t, s, n), n) {
    let o = n.parent;
    for (; o && o.parent; )
      vs(o.parent.vnode) && qr(s, t, n, o), o = o.parent;
  }
}
function qr(e, t, n, s) {
  const o = ys(
    t,
    e,
    s,
    !0
    /* prepend */
  );
  pn(() => {
    to(s[t], o);
  }, n);
}
function ys(e, t, n = Le, s = !1) {
  if (n) {
    const o = n[e] || (n[e] = []), i = t.__weh || (t.__weh = (...l) => {
      _t();
      const r = zn(n), c = Xe(t, n, e, l);
      return r(), bt(), c;
    });
    return s ? o.unshift(i) : o.push(i), i;
  }
}
const xt = (e) => (t, n = Le) => {
  (!Rn || e === "sp") && ys(e, (...s) => t(...s), n);
}, Jr = xt("bm"), Ot = xt("m"), Yr = xt(
  "bu"
), Xr = xt("u"), al = xt(
  "bum"
), pn = xt("um"), Zr = xt(
  "sp"
), Qr = xt("rtg"), ea = xt("rtc");
function ta(e, t = Le) {
  ys("ec", e, t);
}
const na = Symbol.for("v-ndc");
function be(e, t, n, s) {
  let o;
  const i = n, l = q(e);
  if (l || ve(e)) {
    const r = l && Ut(e);
    let c = !1, h = !1;
    r && (c = !Ue(e), h = Ct(e), e = gs(e)), o = new Array(e.length);
    for (let d = 0, f = e.length; d < f; d++)
      o[d] = t(
        c ? h ? hn(Ye(e[d])) : Ye(e[d]) : e[d],
        d,
        void 0,
        i
      );
  } else if (typeof e == "number") {
    o = new Array(e);
    for (let r = 0; r < e; r++)
      o[r] = t(r + 1, r, void 0, i);
  } else if (pe(e))
    if (e[Symbol.iterator])
      o = Array.from(
        e,
        (r, c) => t(r, c, void 0, i)
      );
    else {
      const r = Object.keys(e);
      o = new Array(r.length);
      for (let c = 0, h = r.length; c < h; c++) {
        const d = r[c];
        o[c] = t(e[d], d, c, i);
      }
    }
  else
    o = [];
  return o;
}
function Bt(e, t, n = {}, s, o) {
  if (Ee.ce || Ee.parent && ln(Ee.parent) && Ee.parent.ce) {
    const h = Object.keys(n).length > 0;
    return t !== "default" && (n.name = t), $(), De(
      ie,
      null,
      [_e("slot", n, s && s())],
      h ? -2 : 64
    );
  }
  let i = e[t];
  i && i._c && (i._d = !1), $();
  const l = i && cl(i(n)), r = n.key || // slot content array of a dynamic conditional slot may have a branch
  // key attached in the `createSlots` helper, respect that
  l && l.key, c = De(
    ie,
    {
      key: (r && !St(r) ? r : `_${t}`) + // #7256 force differentiate fallback content from actual content
      (!l && s ? "_fb" : "")
    },
    l || (s ? s() : []),
    l && e._ === 1 ? 64 : -2
  );
  return i && i._c && (i._d = !0), c;
}
function cl(e) {
  return e.some((t) => Fn(t) ? !(t.type === ke || t.type === ie && !cl(t.children)) : !0) ? e : null;
}
const Ws = (e) => e ? Ml(e) ? Cs(e) : Ws(e.parent) : null, An = (
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
    $parent: (e) => Ws(e.parent),
    $root: (e) => Ws(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => dl(e),
    $forceUpdate: (e) => e.f || (e.f = () => {
      ho(e.update);
    }),
    $nextTick: (e) => e.n || (e.n = fo.bind(e.proxy)),
    $watch: (e) => pa.bind(e)
  })
), ws = (e, t) => e !== ue && !e.__isScriptSetup && re(e, t), sa = {
  get({ _: e }, t) {
    if (t === "__v_skip")
      return !0;
    const { ctx: n, setupState: s, data: o, props: i, accessCache: l, type: r, appContext: c } = e;
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
        if (ws(s, t))
          return l[t] = 1, s[t];
        if (o !== ue && re(o, t))
          return l[t] = 2, o[t];
        if (re(i, t))
          return l[t] = 3, i[t];
        if (n !== ue && re(n, t))
          return l[t] = 4, n[t];
        Us && (l[t] = 0);
      }
    }
    const h = An[t];
    let d, f;
    if (h)
      return t === "$attrs" && Te(e.attrs, "get", ""), h(e);
    if (
      // css module (injected by vue-loader)
      (d = r.__cssModules) && (d = d[t])
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
    return ws(o, t) ? (o[t] = n, !0) : s !== ue && re(s, t) ? (s[t] = n, !0) : re(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (i[t] = n, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: n, ctx: s, appContext: o, props: i, type: l }
  }, r) {
    let c;
    return !!(n[r] || e !== ue && r[0] !== "$" && re(e, r) || ws(t, r) || re(i, r) || re(s, r) || re(An, r) || re(o.config.globalProperties, r) || (c = l.__cssModules) && c[r]);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : re(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
  }
};
function Oo(e) {
  return q(e) ? e.reduce(
    (t, n) => (t[n] = null, t),
    {}
  ) : e;
}
let Us = !0;
function oa(e) {
  const t = dl(e), n = e.proxy, s = e.ctx;
  Us = !1, t.beforeCreate && Po(t.beforeCreate, e, "bc");
  const {
    // state
    data: o,
    computed: i,
    methods: l,
    watch: r,
    provide: c,
    inject: h,
    // lifecycle
    created: d,
    beforeMount: f,
    mounted: m,
    beforeUpdate: _,
    updated: E,
    activated: T,
    deactivated: N,
    beforeDestroy: C,
    beforeUnmount: v,
    destroyed: b,
    unmounted: S,
    render: D,
    renderTracked: j,
    renderTriggered: ee,
    errorCaptured: J,
    serverPrefetch: z,
    // public API
    expose: U,
    inheritAttrs: oe,
    // assets
    components: A,
    directives: R,
    filters: H
  } = t;
  if (h && ia(h, s, null), l)
    for (const ne in l) {
      const se = l[ne];
      Y(se) && (s[ne] = se.bind(n));
    }
  if (o) {
    const ne = o.call(n, n);
    pe(ne) && (e.data = ye(ne));
  }
  if (Us = !0, i)
    for (const ne in i) {
      const se = i[ne], xe = Y(se) ? se.bind(n, n) : Y(se.get) ? se.get.bind(n, n) : lt, at = !Y(se) && Y(se.set) ? se.set.bind(n) : lt, Ve = K({
        get: xe,
        set: at
      });
      Object.defineProperty(s, ne, {
        enumerable: !0,
        configurable: !0,
        get: () => Ve.value,
        set: (Ae) => Ve.value = Ae
      });
    }
  if (r)
    for (const ne in r)
      ul(r[ne], s, n, ne);
  if (c) {
    const ne = Y(c) ? c.call(n) : c;
    Reflect.ownKeys(ne).forEach((se) => {
      da(se, ne[se]);
    });
  }
  d && Po(d, e, "c");
  function X(ne, se) {
    q(se) ? se.forEach((xe) => ne(xe.bind(n))) : se && ne(se.bind(n));
  }
  if (X(Jr, f), X(Ot, m), X(Yr, _), X(Xr, E), X(Kr, T), X(Gr, N), X(ta, J), X(ea, j), X(Qr, ee), X(al, v), X(pn, S), X(Zr, z), q(U))
    if (U.length) {
      const ne = e.exposed || (e.exposed = {});
      U.forEach((se) => {
        Object.defineProperty(ne, se, {
          get: () => n[se],
          set: (xe) => n[se] = xe,
          enumerable: !0
        });
      });
    } else e.exposed || (e.exposed = {});
  D && e.render === lt && (e.render = D), oe != null && (e.inheritAttrs = oe), A && (e.components = A), R && (e.directives = R), z && ll(e);
}
function ia(e, t, n = lt) {
  q(e) && (e = Ks(e));
  for (const s in e) {
    const o = e[s];
    let i;
    pe(o) ? "default" in o ? i = an(
      o.from || s,
      o.default,
      !0
    ) : i = an(o.from || s) : i = an(o), $e(i) ? Object.defineProperty(t, s, {
      enumerable: !0,
      configurable: !0,
      get: () => i.value,
      set: (l) => i.value = l
    }) : t[s] = i;
  }
}
function Po(e, t, n) {
  Xe(
    q(e) ? e.map((s) => s.bind(t.proxy)) : e.bind(t.proxy),
    t,
    n
  );
}
function ul(e, t, n, s) {
  let o = s.includes(".") ? pl(n, s) : () => n[s];
  if (ve(e)) {
    const i = t[e];
    Y(i) && Ke(o, i);
  } else if (Y(e))
    Ke(o, e.bind(n));
  else if (pe(e))
    if (q(e))
      e.forEach((i) => ul(i, t, n, s));
    else {
      const i = Y(e.handler) ? e.handler.bind(n) : t[e.handler];
      Y(i) && Ke(o, i, e);
    }
}
function dl(e) {
  const t = e.type, { mixins: n, extends: s } = t, {
    mixins: o,
    optionsCache: i,
    config: { optionMergeStrategies: l }
  } = e.appContext, r = i.get(t);
  let c;
  return r ? c = r : !o.length && !n && !s ? c = t : (c = {}, o.length && o.forEach(
    (h) => is(c, h, l, !0)
  ), is(c, t, l)), pe(t) && i.set(t, c), c;
}
function is(e, t, n, s = !1) {
  const { mixins: o, extends: i } = t;
  i && is(e, i, n, !0), o && o.forEach(
    (l) => is(e, l, n, !0)
  );
  for (const l in t)
    if (!(s && l === "expose")) {
      const r = la[l] || n && n[l];
      e[l] = r ? r(e[l], t[l]) : t[l];
    }
  return e;
}
const la = {
  data: No,
  props: Fo,
  emits: Fo,
  // objects
  methods: Sn,
  computed: Sn,
  // lifecycle
  beforeCreate: Me,
  created: Me,
  beforeMount: Me,
  mounted: Me,
  beforeUpdate: Me,
  updated: Me,
  beforeDestroy: Me,
  beforeUnmount: Me,
  destroyed: Me,
  unmounted: Me,
  activated: Me,
  deactivated: Me,
  errorCaptured: Me,
  serverPrefetch: Me,
  // assets
  components: Sn,
  directives: Sn,
  // watch
  watch: aa,
  // provide / inject
  provide: No,
  inject: ra
};
function No(e, t) {
  return t ? e ? function() {
    return Se(
      Y(e) ? e.call(this, this) : e,
      Y(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function ra(e, t) {
  return Sn(Ks(e), Ks(t));
}
function Ks(e) {
  if (q(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++)
      t[e[n]] = e[n];
    return t;
  }
  return e;
}
function Me(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function Sn(e, t) {
  return e ? Se(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Fo(e, t) {
  return e ? q(e) && q(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : Se(
    /* @__PURE__ */ Object.create(null),
    Oo(e),
    Oo(t ?? {})
  ) : t;
}
function aa(e, t) {
  if (!e) return t;
  if (!t) return e;
  const n = Se(/* @__PURE__ */ Object.create(null), e);
  for (const s in t)
    n[s] = Me(e[s], t[s]);
  return n;
}
function fl() {
  return {
    app: null,
    config: {
      isNativeTag: bi,
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
let ca = 0;
function ua(e, t) {
  return function(s, o = null) {
    Y(s) || (s = Se({}, s)), o != null && !pe(o) && (o = null);
    const i = fl(), l = /* @__PURE__ */ new WeakSet(), r = [];
    let c = !1;
    const h = i.app = {
      _uid: ca++,
      _component: s,
      _props: o,
      _container: null,
      _context: i,
      _instance: null,
      version: Ua,
      get config() {
        return i.config;
      },
      set config(d) {
      },
      use(d, ...f) {
        return l.has(d) || (d && Y(d.install) ? (l.add(d), d.install(h, ...f)) : Y(d) && (l.add(d), d(h, ...f))), h;
      },
      mixin(d) {
        return i.mixins.includes(d) || i.mixins.push(d), h;
      },
      component(d, f) {
        return f ? (i.components[d] = f, h) : i.components[d];
      },
      directive(d, f) {
        return f ? (i.directives[d] = f, h) : i.directives[d];
      },
      mount(d, f, m) {
        if (!c) {
          const _ = h._ceVNode || _e(s, o);
          return _.appContext = i, m === !0 ? m = "svg" : m === !1 && (m = void 0), e(_, d, m), c = !0, h._container = d, d.__vue_app__ = h, Cs(_.component);
        }
      },
      onUnmount(d) {
        r.push(d);
      },
      unmount() {
        c && (Xe(
          r,
          h._instance,
          16
        ), e(null, h._container), delete h._container.__vue_app__);
      },
      provide(d, f) {
        return i.provides[d] = f, h;
      },
      runWithContext(d) {
        const f = rn;
        rn = h;
        try {
          return d();
        } finally {
          rn = f;
        }
      }
    };
    return h;
  };
}
let rn = null;
function da(e, t) {
  if (Le) {
    let n = Le.provides;
    const s = Le.parent && Le.parent.provides;
    s === n && (n = Le.provides = Object.create(s)), n[e] = t;
  }
}
function an(e, t, n = !1) {
  const s = Al();
  if (s || rn) {
    let o = rn ? rn._context.provides : s ? s.parent == null || s.ce ? s.vnode.appContext && s.vnode.appContext.provides : s.parent.provides : void 0;
    if (o && e in o)
      return o[e];
    if (arguments.length > 1)
      return n && Y(t) ? t.call(s && s.proxy) : t;
  }
}
const fa = Symbol.for("v-scx"), ha = () => an(fa);
function Ke(e, t, n) {
  return hl(e, t, n);
}
function hl(e, t, n = ue) {
  const { immediate: s, deep: o, flush: i, once: l } = n, r = Se({}, n), c = t && s || !t && i !== "post";
  let h;
  if (Rn) {
    if (i === "sync") {
      const _ = ha();
      h = _.__watcherHandles || (_.__watcherHandles = []);
    } else if (!c) {
      const _ = () => {
      };
      return _.stop = lt, _.resume = lt, _.pause = lt, _;
    }
  }
  const d = Le;
  r.call = (_, E, T) => Xe(_, d, E, T);
  let f = !1;
  i === "post" ? r.scheduler = (_) => {
    we(_, d && d.suspense);
  } : i !== "sync" && (f = !0, r.scheduler = (_, E) => {
    E ? _() : ho(_);
  }), r.augmentJob = (_) => {
    t && (_.flags |= 4), f && (_.flags |= 2, d && (_.id = d.uid, _.i = d));
  };
  const m = Dr(e, t, r);
  return Rn && (h ? h.push(m) : c && m()), m;
}
function pa(e, t, n) {
  const s = this.proxy, o = ve(e) ? e.includes(".") ? pl(s, e) : () => s[e] : e.bind(s, s);
  let i;
  Y(t) ? i = t : (i = t.handler, n = t);
  const l = zn(this), r = hl(o, i.bind(s), n);
  return l(), r;
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
const ga = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${It(t)}Modifiers`] || e[`${Yt(t)}Modifiers`];
function ma(e, t, ...n) {
  if (e.isUnmounted) return;
  const s = e.vnode.props || ue;
  let o = n;
  const i = t.startsWith("update:"), l = i && ga(s, t.slice(7));
  l && (l.trim && (o = n.map((d) => ve(d) ? d.trim() : d)), l.number && (o = n.map(so)));
  let r, c = s[r = Ts(t)] || // also try camelCase event handler (#2249)
  s[r = Ts(It(t))];
  !c && i && (c = s[r = Ts(Yt(t))]), c && Xe(
    c,
    e,
    6,
    o
  );
  const h = s[r + "Once"];
  if (h) {
    if (!e.emitted)
      e.emitted = {};
    else if (e.emitted[r])
      return;
    e.emitted[r] = !0, Xe(
      h,
      e,
      6,
      o
    );
  }
}
const va = /* @__PURE__ */ new WeakMap();
function gl(e, t, n = !1) {
  const s = n ? va : t.emitsCache, o = s.get(e);
  if (o !== void 0)
    return o;
  const i = e.emits;
  let l = {}, r = !1;
  if (!Y(e)) {
    const c = (h) => {
      const d = gl(h, t, !0);
      d && (r = !0, Se(l, d));
    };
    !n && t.mixins.length && t.mixins.forEach(c), e.extends && c(e.extends), e.mixins && e.mixins.forEach(c);
  }
  return !i && !r ? (pe(e) && s.set(e, null), null) : (q(i) ? i.forEach((c) => l[c] = null) : Se(l, i), pe(e) && s.set(e, l), l);
}
function _s(e, t) {
  return !e || !ds(t) ? !1 : (t = t.slice(2).replace(/Once$/, ""), re(e, t[0].toLowerCase() + t.slice(1)) || re(e, Yt(t)) || re(e, t));
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
    emit: c,
    render: h,
    renderCache: d,
    props: f,
    data: m,
    setupState: _,
    ctx: E,
    inheritAttrs: T
  } = e, N = ss(e);
  let C, v;
  try {
    if (n.shapeFlag & 4) {
      const S = o || s, D = S;
      C = st(
        h.call(
          D,
          S,
          d,
          f,
          _,
          m,
          E
        )
      ), v = r;
    } else {
      const S = t;
      C = st(
        S.length > 1 ? S(
          f,
          { attrs: r, slots: l, emit: c }
        ) : S(
          f,
          null
        )
      ), v = t.props ? r : ya(r);
    }
  } catch (S) {
    Mn.length = 0, ms(S, e, 1), C = _e(ke);
  }
  let b = C;
  if (v && T !== !1) {
    const S = Object.keys(v), { shapeFlag: D } = b;
    S.length && D & 7 && (i && S.some(eo) && (v = _a(
      v,
      i
    )), b = Lt(b, v, !1, !0));
  }
  return n.dirs && (b = Lt(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && Pn(b, n.transition), C = b, ss(N), C;
}
const ya = (e) => {
  let t;
  for (const n in e)
    (n === "class" || n === "style" || ds(n)) && ((t || (t = {}))[n] = e[n]);
  return t;
}, _a = (e, t) => {
  const n = {};
  for (const s in e)
    (!eo(s) || !(s.slice(9) in t)) && (n[s] = e[s]);
  return n;
};
function ba(e, t, n) {
  const { props: s, children: o, component: i } = e, { props: l, children: r, patchFlag: c } = t, h = i.emitsOptions;
  if (t.dirs || t.transition)
    return !0;
  if (n && c >= 0) {
    if (c & 1024)
      return !0;
    if (c & 16)
      return s ? Do(s, l, h) : !!l;
    if (c & 8) {
      const d = t.dynamicProps;
      for (let f = 0; f < d.length; f++) {
        const m = d[f];
        if (l[m] !== s[m] && !_s(h, m))
          return !0;
      }
    }
  } else
    return (o || r) && (!r || !r.$stable) ? !0 : s === l ? !1 : s ? l ? Do(s, l, h) : !0 : !!l;
  return !1;
}
function Do(e, t, n) {
  const s = Object.keys(t);
  if (s.length !== Object.keys(e).length)
    return !0;
  for (let o = 0; o < s.length; o++) {
    const i = s[o];
    if (t[i] !== e[i] && !_s(n, i))
      return !0;
  }
  return !1;
}
function Ca({ vnode: e, parent: t }, n) {
  for (; t; ) {
    const s = t.subTree;
    if (s.suspense && s.suspense.activeBranch === e && (s.el = e.el), s === e)
      (e = t.vnode).el = n, t = t.parent;
    else
      break;
  }
}
const ml = {}, vl = () => Object.create(ml), yl = (e) => Object.getPrototypeOf(e) === ml;
function Sa(e, t, n, s = !1) {
  const o = {}, i = vl();
  e.propsDefaults = /* @__PURE__ */ Object.create(null), _l(e, t, o, i);
  for (const l in e.propsOptions[0])
    l in o || (o[l] = void 0);
  n ? e.props = s ? o : wr(o) : e.type.props ? e.props = o : e.props = i, e.attrs = i;
}
function xa(e, t, n, s) {
  const {
    props: o,
    attrs: i,
    vnode: { patchFlag: l }
  } = e, r = le(o), [c] = e.propsOptions;
  let h = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (s || l > 0) && !(l & 16)
  ) {
    if (l & 8) {
      const d = e.vnode.dynamicProps;
      for (let f = 0; f < d.length; f++) {
        let m = d[f];
        if (_s(e.emitsOptions, m))
          continue;
        const _ = t[m];
        if (c)
          if (re(i, m))
            _ !== i[m] && (i[m] = _, h = !0);
          else {
            const E = It(m);
            o[E] = Gs(
              c,
              r,
              E,
              _,
              e,
              !1
            );
          }
        else
          _ !== i[m] && (i[m] = _, h = !0);
      }
    }
  } else {
    _l(e, t, o, i) && (h = !0);
    let d;
    for (const f in r)
      (!t || // for camelCase
      !re(t, f) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((d = Yt(f)) === f || !re(t, d))) && (c ? n && // for camelCase
      (n[f] !== void 0 || // for kebab-case
      n[d] !== void 0) && (o[f] = Gs(
        c,
        r,
        f,
        void 0,
        e,
        !0
      )) : delete o[f]);
    if (i !== r)
      for (const f in i)
        (!t || !re(t, f)) && (delete i[f], h = !0);
  }
  h && vt(e.attrs, "set", "");
}
function _l(e, t, n, s) {
  const [o, i] = e.propsOptions;
  let l = !1, r;
  if (t)
    for (let c in t) {
      if (xn(c))
        continue;
      const h = t[c];
      let d;
      o && re(o, d = It(c)) ? !i || !i.includes(d) ? n[d] = h : (r || (r = {}))[d] = h : _s(e.emitsOptions, c) || (!(c in s) || h !== s[c]) && (s[c] = h, l = !0);
    }
  if (i) {
    const c = le(n), h = r || ue;
    for (let d = 0; d < i.length; d++) {
      const f = i[d];
      n[f] = Gs(
        o,
        c,
        f,
        h[f],
        e,
        !re(h, f)
      );
    }
  }
  return l;
}
function Gs(e, t, n, s, o, i) {
  const l = e[n];
  if (l != null) {
    const r = re(l, "default");
    if (r && s === void 0) {
      const c = l.default;
      if (l.type !== Function && !l.skipFactory && Y(c)) {
        const { propsDefaults: h } = o;
        if (n in h)
          s = h[n];
        else {
          const d = zn(o);
          s = h[n] = c.call(
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
    ] && (i && !r ? s = !1 : l[
      1
      /* shouldCastTrue */
    ] && (s === "" || s === Yt(n)) && (s = !0));
  }
  return s;
}
const Ta = /* @__PURE__ */ new WeakMap();
function bl(e, t, n = !1) {
  const s = n ? Ta : t.propsCache, o = s.get(e);
  if (o)
    return o;
  const i = e.props, l = {}, r = [];
  let c = !1;
  if (!Y(e)) {
    const d = (f) => {
      c = !0;
      const [m, _] = bl(f, t, !0);
      Se(l, m), _ && r.push(..._);
    };
    !n && t.mixins.length && t.mixins.forEach(d), e.extends && d(e.extends), e.mixins && e.mixins.forEach(d);
  }
  if (!i && !c)
    return pe(e) && s.set(e, nn), nn;
  if (q(i))
    for (let d = 0; d < i.length; d++) {
      const f = It(i[d]);
      Ho(f) && (l[f] = ue);
    }
  else if (i)
    for (const d in i) {
      const f = It(d);
      if (Ho(f)) {
        const m = i[d], _ = l[f] = q(m) || Y(m) ? { type: m } : Se({}, m), E = _.type;
        let T = !1, N = !0;
        if (q(E))
          for (let C = 0; C < E.length; ++C) {
            const v = E[C], b = Y(v) && v.name;
            if (b === "Boolean") {
              T = !0;
              break;
            } else b === "String" && (N = !1);
          }
        else
          T = Y(E) && E.name === "Boolean";
        _[
          0
          /* shouldCast */
        ] = T, _[
          1
          /* shouldCastTrue */
        ] = N, (T || re(_, "default")) && r.push(f);
      }
    }
  const h = [l, r];
  return pe(e) && s.set(e, h), h;
}
function Ho(e) {
  return e[0] !== "$" && !xn(e);
}
const po = (e) => e === "_" || e === "_ctx" || e === "$stable", go = (e) => q(e) ? e.map(st) : [st(e)], ka = (e, t, n) => {
  if (t._n)
    return t;
  const s = rt((...o) => go(t(...o)), n);
  return s._c = !1, s;
}, Cl = (e, t, n) => {
  const s = e._ctx;
  for (const o in e) {
    if (po(o)) continue;
    const i = e[o];
    if (Y(i))
      t[o] = ka(o, i, s);
    else if (i != null) {
      const l = go(i);
      t[o] = () => l;
    }
  }
}, Sl = (e, t) => {
  const n = go(t);
  e.slots.default = () => n;
}, xl = (e, t, n) => {
  for (const s in t)
    (n || !po(s)) && (e[s] = t[s]);
}, Ea = (e, t, n) => {
  const s = e.slots = vl();
  if (e.vnode.shapeFlag & 32) {
    const o = t._;
    o ? (xl(s, t, n), n && Ei(s, "_", o, !0)) : Cl(t, s);
  } else t && Sl(e, t);
}, $a = (e, t, n) => {
  const { vnode: s, slots: o } = e;
  let i = !0, l = ue;
  if (s.shapeFlag & 32) {
    const r = t._;
    r ? n && r === 1 ? i = !1 : xl(o, t, n) : (i = !t.$stable, Cl(t, o)), l = t;
  } else t && (Sl(e, t), l = { default: 1 });
  if (i)
    for (const r in o)
      !po(r) && l[r] == null && delete o[r];
}, we = La;
function Aa(e) {
  return Ma(e);
}
function Ma(e, t) {
  const n = ps();
  n.__VUE__ = !0;
  const {
    insert: s,
    remove: o,
    patchProp: i,
    createElement: l,
    createText: r,
    createComment: c,
    setText: h,
    setElementText: d,
    parentNode: f,
    nextSibling: m,
    setScopeId: _ = lt,
    insertStaticContent: E
  } = e, T = (u, a, p, y = null, x = null, k = null, I = void 0, P = null, O = !!a.dynamicChildren) => {
    if (u === a)
      return;
    u && !Vt(u, a) && (y = kt(u), Ae(u, x, k, !0), u = null), a.patchFlag === -2 && (O = !1, a.dynamicChildren = null);
    const { type: w, ref: W, shapeFlag: F } = a;
    switch (w) {
      case bs:
        N(u, a, p, y);
        break;
      case ke:
        C(u, a, p, y);
        break;
      case Ls:
        u == null && v(a, p, y, I);
        break;
      case ie:
        A(
          u,
          a,
          p,
          y,
          x,
          k,
          I,
          P,
          O
        );
        break;
      default:
        F & 1 ? D(
          u,
          a,
          p,
          y,
          x,
          k,
          I,
          P,
          O
        ) : F & 6 ? R(
          u,
          a,
          p,
          y,
          x,
          k,
          I,
          P,
          O
        ) : (F & 64 || F & 128) && w.process(
          u,
          a,
          p,
          y,
          x,
          k,
          I,
          P,
          O,
          dt
        );
    }
    W != null && x ? $n(W, u && u.ref, k, a || u, !a) : W == null && u && u.ref != null && $n(u.ref, null, k, u, !0);
  }, N = (u, a, p, y) => {
    if (u == null)
      s(
        a.el = r(a.children),
        p,
        y
      );
    else {
      const x = a.el = u.el;
      a.children !== u.children && h(x, a.children);
    }
  }, C = (u, a, p, y) => {
    u == null ? s(
      a.el = c(a.children || ""),
      p,
      y
    ) : a.el = u.el;
  }, v = (u, a, p, y) => {
    [u.el, u.anchor] = E(
      u.children,
      a,
      p,
      y,
      u.el,
      u.anchor
    );
  }, b = ({ el: u, anchor: a }, p, y) => {
    let x;
    for (; u && u !== a; )
      x = m(u), s(u, p, y), u = x;
    s(a, p, y);
  }, S = ({ el: u, anchor: a }) => {
    let p;
    for (; u && u !== a; )
      p = m(u), o(u), u = p;
    o(a);
  }, D = (u, a, p, y, x, k, I, P, O) => {
    if (a.type === "svg" ? I = "svg" : a.type === "math" && (I = "mathml"), u == null)
      j(
        a,
        p,
        y,
        x,
        k,
        I,
        P,
        O
      );
    else {
      const w = u.el && u.el._isVueCE ? u.el : null;
      try {
        w && w._beginPatch(), z(
          u,
          a,
          x,
          k,
          I,
          P,
          O
        );
      } finally {
        w && w._endPatch();
      }
    }
  }, j = (u, a, p, y, x, k, I, P) => {
    let O, w;
    const { props: W, shapeFlag: F, transition: B, dirs: G } = u;
    if (O = u.el = l(
      u.type,
      k,
      W && W.is,
      W
    ), F & 8 ? d(O, u.children) : F & 16 && J(
      u.children,
      O,
      null,
      y,
      x,
      Is(u, k),
      I,
      P
    ), G && Ft(u, null, y, "created"), ee(O, u, u.scopeId, I, y), W) {
      for (const de in W)
        de !== "value" && !xn(de) && i(O, de, null, W[de], k, y);
      "value" in W && i(O, "value", null, W.value, k), (w = W.onVnodeBeforeMount) && tt(w, y, u);
    }
    G && Ft(u, null, y, "beforeMount");
    const te = wa(x, B);
    te && B.beforeEnter(O), s(O, a, p), ((w = W && W.onVnodeMounted) || te || G) && we(() => {
      w && tt(w, y, u), te && B.enter(O), G && Ft(u, null, y, "mounted");
    }, x);
  }, ee = (u, a, p, y, x) => {
    if (p && _(u, p), y)
      for (let k = 0; k < y.length; k++)
        _(u, y[k]);
    if (x) {
      let k = x.subTree;
      if (a === k || kl(k.type) && (k.ssContent === a || k.ssFallback === a)) {
        const I = x.vnode;
        ee(
          u,
          I,
          I.scopeId,
          I.slotScopeIds,
          x.parent
        );
      }
    }
  }, J = (u, a, p, y, x, k, I, P, O = 0) => {
    for (let w = O; w < u.length; w++) {
      const W = u[w] = P ? Mt(u[w]) : st(u[w]);
      T(
        null,
        W,
        a,
        p,
        y,
        x,
        k,
        I,
        P
      );
    }
  }, z = (u, a, p, y, x, k, I) => {
    const P = a.el = u.el;
    let { patchFlag: O, dynamicChildren: w, dirs: W } = a;
    O |= u.patchFlag & 16;
    const F = u.props || ue, B = a.props || ue;
    let G;
    if (p && Rt(p, !1), (G = B.onVnodeBeforeUpdate) && tt(G, p, a, u), W && Ft(a, u, p, "beforeUpdate"), p && Rt(p, !0), (F.innerHTML && B.innerHTML == null || F.textContent && B.textContent == null) && d(P, ""), w ? U(
      u.dynamicChildren,
      w,
      P,
      p,
      y,
      Is(a, x),
      k
    ) : I || se(
      u,
      a,
      P,
      null,
      p,
      y,
      Is(a, x),
      k,
      !1
    ), O > 0) {
      if (O & 16)
        oe(P, F, B, p, x);
      else if (O & 2 && F.class !== B.class && i(P, "class", null, B.class, x), O & 4 && i(P, "style", F.style, B.style, x), O & 8) {
        const te = a.dynamicProps;
        for (let de = 0; de < te.length; de++) {
          const ce = te[de], Oe = F[ce], Pe = B[ce];
          (Pe !== Oe || ce === "value") && i(P, ce, Oe, Pe, x, p);
        }
      }
      O & 1 && u.children !== a.children && d(P, a.children);
    } else !I && w == null && oe(P, F, B, p, x);
    ((G = B.onVnodeUpdated) || W) && we(() => {
      G && tt(G, p, a, u), W && Ft(a, u, p, "updated");
    }, y);
  }, U = (u, a, p, y, x, k, I) => {
    for (let P = 0; P < a.length; P++) {
      const O = u[P], w = a[P], W = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        O.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (O.type === ie || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !Vt(O, w) || // - In the case of a component, it could contain anything.
        O.shapeFlag & 198) ? f(O.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          p
        )
      );
      T(
        O,
        w,
        W,
        null,
        y,
        x,
        k,
        I,
        !0
      );
    }
  }, oe = (u, a, p, y, x) => {
    if (a !== p) {
      if (a !== ue)
        for (const k in a)
          !xn(k) && !(k in p) && i(
            u,
            k,
            a[k],
            null,
            x,
            y
          );
      for (const k in p) {
        if (xn(k)) continue;
        const I = p[k], P = a[k];
        I !== P && k !== "value" && i(u, k, P, I, x, y);
      }
      "value" in p && i(u, "value", a.value, p.value, x);
    }
  }, A = (u, a, p, y, x, k, I, P, O) => {
    const w = a.el = u ? u.el : r(""), W = a.anchor = u ? u.anchor : r("");
    let { patchFlag: F, dynamicChildren: B, slotScopeIds: G } = a;
    G && (P = P ? P.concat(G) : G), u == null ? (s(w, p, y), s(W, p, y), J(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      a.children || [],
      p,
      W,
      x,
      k,
      I,
      P,
      O
    )) : F > 0 && F & 64 && B && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    u.dynamicChildren ? (U(
      u.dynamicChildren,
      B,
      p,
      x,
      k,
      I,
      P
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (a.key != null || x && a === x.subTree) && mo(
      u,
      a,
      !0
      /* shallow */
    )) : se(
      u,
      a,
      p,
      W,
      x,
      k,
      I,
      P,
      O
    );
  }, R = (u, a, p, y, x, k, I, P, O) => {
    a.slotScopeIds = P, u == null ? a.shapeFlag & 512 ? x.ctx.activate(
      a,
      p,
      y,
      I,
      O
    ) : H(
      a,
      p,
      y,
      x,
      k,
      I,
      O
    ) : Q(u, a, O);
  }, H = (u, a, p, y, x, k, I) => {
    const P = u.component = Ha(
      u,
      y,
      x
    );
    if (vs(u) && (P.ctx.renderer = dt), ja(P, !1, I), P.asyncDep) {
      if (x && x.registerDep(P, X, I), !u.el) {
        const O = P.subTree = _e(ke);
        C(null, O, a, p), u.placeholder = O.el;
      }
    } else
      X(
        P,
        u,
        a,
        p,
        x,
        k,
        I
      );
  }, Q = (u, a, p) => {
    const y = a.component = u.component;
    if (ba(u, a, p))
      if (y.asyncDep && !y.asyncResolved) {
        ne(y, a, p);
        return;
      } else
        y.next = a, y.update();
    else
      a.el = u.el, y.vnode = a;
  }, X = (u, a, p, y, x, k, I) => {
    const P = () => {
      if (u.isMounted) {
        let { next: F, bu: B, u: G, parent: te, vnode: de } = u;
        {
          const Qe = Tl(u);
          if (Qe) {
            F && (F.el = de.el, ne(u, F, I)), Qe.asyncDep.then(() => {
              u.isUnmounted || P();
            });
            return;
          }
        }
        let ce = F, Oe;
        Rt(u, !1), F ? (F.el = de.el, ne(u, F, I)) : F = de, B && Jn(B), (Oe = F.props && F.props.onVnodeBeforeUpdate) && tt(Oe, te, F, de), Rt(u, !0);
        const Pe = Ro(u), Ze = u.subTree;
        u.subTree = Pe, T(
          Ze,
          Pe,
          // parent may have changed if it's in a teleport
          f(Ze.el),
          // anchor may have changed if it's in a fragment
          kt(Ze),
          u,
          x,
          k
        ), F.el = Pe.el, ce === null && Ca(u, Pe.el), G && we(G, x), (Oe = F.props && F.props.onVnodeUpdated) && we(
          () => tt(Oe, te, F, de),
          x
        );
      } else {
        let F;
        const { el: B, props: G } = a, { bm: te, m: de, parent: ce, root: Oe, type: Pe } = u, Ze = ln(a);
        Rt(u, !1), te && Jn(te), !Ze && (F = G && G.onVnodeBeforeMount) && tt(F, ce, a), Rt(u, !0);
        {
          Oe.ce && // @ts-expect-error _def is private
          Oe.ce._def.shadowRoot !== !1 && Oe.ce._injectChildStyle(Pe);
          const Qe = u.subTree = Ro(u);
          T(
            null,
            Qe,
            p,
            y,
            u,
            x,
            k
          ), a.el = Qe.el;
        }
        if (de && we(de, x), !Ze && (F = G && G.onVnodeMounted)) {
          const Qe = a;
          we(
            () => tt(F, ce, Qe),
            x
          );
        }
        (a.shapeFlag & 256 || ce && ln(ce.vnode) && ce.vnode.shapeFlag & 256) && u.a && we(u.a, x), u.isMounted = !0, a = p = y = null;
      }
    };
    u.scope.on();
    const O = u.effect = new wi(P);
    u.scope.off();
    const w = u.update = O.run.bind(O), W = u.job = O.runIfDirty.bind(O);
    W.i = u, W.id = u.uid, O.scheduler = () => ho(W), Rt(u, !0), w();
  }, ne = (u, a, p) => {
    a.component = u;
    const y = u.vnode.props;
    u.vnode = a, u.next = null, xa(u, a.props, y, p), $a(u, a.children, p), _t(), $o(u), bt();
  }, se = (u, a, p, y, x, k, I, P, O = !1) => {
    const w = u && u.children, W = u ? u.shapeFlag : 0, F = a.children, { patchFlag: B, shapeFlag: G } = a;
    if (B > 0) {
      if (B & 128) {
        at(
          w,
          F,
          p,
          y,
          x,
          k,
          I,
          P,
          O
        );
        return;
      } else if (B & 256) {
        xe(
          w,
          F,
          p,
          y,
          x,
          k,
          I,
          P,
          O
        );
        return;
      }
    }
    G & 8 ? (W & 16 && ut(w, x, k), F !== w && d(p, F)) : W & 16 ? G & 16 ? at(
      w,
      F,
      p,
      y,
      x,
      k,
      I,
      P,
      O
    ) : ut(w, x, k, !0) : (W & 8 && d(p, ""), G & 16 && J(
      F,
      p,
      y,
      x,
      k,
      I,
      P,
      O
    ));
  }, xe = (u, a, p, y, x, k, I, P, O) => {
    u = u || nn, a = a || nn;
    const w = u.length, W = a.length, F = Math.min(w, W);
    let B;
    for (B = 0; B < F; B++) {
      const G = a[B] = O ? Mt(a[B]) : st(a[B]);
      T(
        u[B],
        G,
        p,
        null,
        x,
        k,
        I,
        P,
        O
      );
    }
    w > W ? ut(
      u,
      x,
      k,
      !0,
      !1,
      F
    ) : J(
      a,
      p,
      y,
      x,
      k,
      I,
      P,
      O,
      F
    );
  }, at = (u, a, p, y, x, k, I, P, O) => {
    let w = 0;
    const W = a.length;
    let F = u.length - 1, B = W - 1;
    for (; w <= F && w <= B; ) {
      const G = u[w], te = a[w] = O ? Mt(a[w]) : st(a[w]);
      if (Vt(G, te))
        T(
          G,
          te,
          p,
          null,
          x,
          k,
          I,
          P,
          O
        );
      else
        break;
      w++;
    }
    for (; w <= F && w <= B; ) {
      const G = u[F], te = a[B] = O ? Mt(a[B]) : st(a[B]);
      if (Vt(G, te))
        T(
          G,
          te,
          p,
          null,
          x,
          k,
          I,
          P,
          O
        );
      else
        break;
      F--, B--;
    }
    if (w > F) {
      if (w <= B) {
        const G = B + 1, te = G < W ? a[G].el : y;
        for (; w <= B; )
          T(
            null,
            a[w] = O ? Mt(a[w]) : st(a[w]),
            p,
            te,
            x,
            k,
            I,
            P,
            O
          ), w++;
      }
    } else if (w > B)
      for (; w <= F; )
        Ae(u[w], x, k, !0), w++;
    else {
      const G = w, te = w, de = /* @__PURE__ */ new Map();
      for (w = te; w <= B; w++) {
        const Re = a[w] = O ? Mt(a[w]) : st(a[w]);
        Re.key != null && de.set(Re.key, w);
      }
      let ce, Oe = 0;
      const Pe = B - te + 1;
      let Ze = !1, Qe = 0;
      const mn = new Array(Pe);
      for (w = 0; w < Pe; w++) mn[w] = 0;
      for (w = G; w <= F; w++) {
        const Re = u[w];
        if (Oe >= Pe) {
          Ae(Re, x, k, !0);
          continue;
        }
        let et;
        if (Re.key != null)
          et = de.get(Re.key);
        else
          for (ce = te; ce <= B; ce++)
            if (mn[ce - te] === 0 && Vt(Re, a[ce])) {
              et = ce;
              break;
            }
        et === void 0 ? Ae(Re, x, k, !0) : (mn[et - te] = w + 1, et >= Qe ? Qe = et : Ze = !0, T(
          Re,
          a[et],
          p,
          null,
          x,
          k,
          I,
          P,
          O
        ), Oe++);
      }
      const Co = Ze ? Ia(mn) : nn;
      for (ce = Co.length - 1, w = Pe - 1; w >= 0; w--) {
        const Re = te + w, et = a[Re], So = a[Re + 1], xo = Re + 1 < W ? (
          // #13559, fallback to el placeholder for unresolved async component
          So.el || So.placeholder
        ) : y;
        mn[w] === 0 ? T(
          null,
          et,
          p,
          xo,
          x,
          k,
          I,
          P,
          O
        ) : Ze && (ce < 0 || w !== Co[ce] ? Ve(et, p, xo, 2) : ce--);
      }
    }
  }, Ve = (u, a, p, y, x = null) => {
    const { el: k, type: I, transition: P, children: O, shapeFlag: w } = u;
    if (w & 6) {
      Ve(u.component.subTree, a, p, y);
      return;
    }
    if (w & 128) {
      u.suspense.move(a, p, y);
      return;
    }
    if (w & 64) {
      I.move(u, a, p, dt);
      return;
    }
    if (I === ie) {
      s(k, a, p);
      for (let F = 0; F < O.length; F++)
        Ve(O[F], a, p, y);
      s(u.anchor, a, p);
      return;
    }
    if (I === Ls) {
      b(u, a, p);
      return;
    }
    if (y !== 2 && w & 1 && P)
      if (y === 0)
        P.beforeEnter(k), s(k, a, p), we(() => P.enter(k), x);
      else {
        const { leave: F, delayLeave: B, afterLeave: G } = P, te = () => {
          u.ctx.isUnmounted ? o(k) : s(k, a, p);
        }, de = () => {
          k._isLeaving && k[gt](
            !0
            /* cancelled */
          ), F(k, () => {
            te(), G && G();
          });
        };
        B ? B(k, te, de) : de();
      }
    else
      s(k, a, p);
  }, Ae = (u, a, p, y = !1, x = !1) => {
    const {
      type: k,
      props: I,
      ref: P,
      children: O,
      dynamicChildren: w,
      shapeFlag: W,
      patchFlag: F,
      dirs: B,
      cacheIndex: G
    } = u;
    if (F === -2 && (x = !1), P != null && (_t(), $n(P, null, p, u, !0), bt()), G != null && (a.renderCache[G] = void 0), W & 256) {
      a.ctx.deactivate(u);
      return;
    }
    const te = W & 1 && B, de = !ln(u);
    let ce;
    if (de && (ce = I && I.onVnodeBeforeUnmount) && tt(ce, a, u), W & 6)
      Xt(u.component, p, y);
    else {
      if (W & 128) {
        u.suspense.unmount(p, y);
        return;
      }
      te && Ft(u, null, a, "beforeUnmount"), W & 64 ? u.type.remove(
        u,
        a,
        p,
        dt,
        y
      ) : w && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !w.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (k !== ie || F > 0 && F & 64) ? ut(
        w,
        a,
        p,
        !1,
        !0
      ) : (k === ie && F & 384 || !x && W & 16) && ut(O, a, p), y && Tt(u);
    }
    (de && (ce = I && I.onVnodeUnmounted) || te) && we(() => {
      ce && tt(ce, a, u), te && Ft(u, null, a, "unmounted");
    }, p);
  }, Tt = (u) => {
    const { type: a, el: p, anchor: y, transition: x } = u;
    if (a === ie) {
      ct(p, y);
      return;
    }
    if (a === Ls) {
      S(u);
      return;
    }
    const k = () => {
      o(p), x && !x.persisted && x.afterLeave && x.afterLeave();
    };
    if (u.shapeFlag & 1 && x && !x.persisted) {
      const { leave: I, delayLeave: P } = x, O = () => I(p, k);
      P ? P(u.el, k, O) : O();
    } else
      k();
  }, ct = (u, a) => {
    let p;
    for (; u !== a; )
      p = m(u), o(u), u = p;
    o(a);
  }, Xt = (u, a, p) => {
    const { bum: y, scope: x, job: k, subTree: I, um: P, m: O, a: w } = u;
    jo(O), jo(w), y && Jn(y), x.stop(), k && (k.flags |= 8, Ae(I, u, a, p)), P && we(P, a), we(() => {
      u.isUnmounted = !0;
    }, a);
  }, ut = (u, a, p, y = !1, x = !1, k = 0) => {
    for (let I = k; I < u.length; I++)
      Ae(u[I], a, p, y, x);
  }, kt = (u) => {
    if (u.shapeFlag & 6)
      return kt(u.component.subTree);
    if (u.shapeFlag & 128)
      return u.suspense.next();
    const a = m(u.anchor || u.el), p = a && a[Yi];
    return p ? m(p) : a;
  };
  let Pt = !1;
  const Nt = (u, a, p) => {
    u == null ? a._vnode && Ae(a._vnode, null, null, !0) : T(
      a._vnode || null,
      u,
      a,
      null,
      null,
      null,
      p
    ), a._vnode = u, Pt || (Pt = !0, $o(), Gi(), Pt = !1);
  }, dt = {
    p: T,
    um: Ae,
    m: Ve,
    r: Tt,
    mt: H,
    mc: J,
    pc: se,
    pbc: U,
    n: kt,
    o: e
  };
  return {
    render: Nt,
    hydrate: void 0,
    createApp: ua(Nt)
  };
}
function Is({ type: e, props: t }, n) {
  return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Rt({ effect: e, job: t }, n) {
  n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function wa(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function mo(e, t, n = !1) {
  const s = e.children, o = t.children;
  if (q(s) && q(o))
    for (let i = 0; i < s.length; i++) {
      const l = s[i];
      let r = o[i];
      r.shapeFlag & 1 && !r.dynamicChildren && ((r.patchFlag <= 0 || r.patchFlag === 32) && (r = o[i] = Mt(o[i]), r.el = l.el), !n && r.patchFlag !== -2 && mo(l, r)), r.type === bs && // avoid cached text nodes retaining detached dom nodes
      r.patchFlag !== -1 && (r.el = l.el), r.type === ke && !r.el && (r.el = l.el);
    }
}
function Ia(e) {
  const t = e.slice(), n = [0];
  let s, o, i, l, r;
  const c = e.length;
  for (s = 0; s < c; s++) {
    const h = e[s];
    if (h !== 0) {
      if (o = n[n.length - 1], e[o] < h) {
        t[s] = o, n.push(s);
        continue;
      }
      for (i = 0, l = n.length - 1; i < l; )
        r = i + l >> 1, e[n[r]] < h ? i = r + 1 : l = r;
      h < e[n[i]] && (i > 0 && (t[s] = n[i - 1]), n[i] = s);
    }
  }
  for (i = n.length, l = n[i - 1]; i-- > 0; )
    n[i] = l, l = t[l];
  return n;
}
function Tl(e) {
  const t = e.subTree.component;
  if (t)
    return t.asyncDep && !t.asyncResolved ? t : Tl(t);
}
function jo(e) {
  if (e)
    for (let t = 0; t < e.length; t++)
      e[t].flags |= 8;
}
const kl = (e) => e.__isSuspense;
function La(e, t) {
  t && t.pendingBranch ? q(e) ? t.effects.push(...e) : t.effects.push(e) : zr(e);
}
const ie = Symbol.for("v-fgt"), bs = Symbol.for("v-txt"), ke = Symbol.for("v-cmt"), Ls = Symbol.for("v-stc"), Mn = [];
let He = null;
function $(e = !1) {
  Mn.push(He = e ? null : []);
}
function Oa() {
  Mn.pop(), He = Mn[Mn.length - 1] || null;
}
let Nn = 1;
function ls(e, t = !1) {
  Nn += e, e < 0 && He && t && (He.hasOnce = !0);
}
function El(e) {
  return e.dynamicChildren = Nn > 0 ? He || nn : null, Oa(), Nn > 0 && He && He.push(e), e;
}
function L(e, t, n, s, o, i) {
  return El(
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
function De(e, t, n, s, o) {
  return El(
    _e(
      e,
      t,
      n,
      s,
      o,
      !0
    )
  );
}
function Fn(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function Vt(e, t) {
  return e.type === t.type && e.key === t.key;
}
const $l = ({ key: e }) => e ?? null, Xn = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? ve(e) || $e(e) || Y(e) ? { i: Ee, r: e, k: t, f: !!n } : e : null);
function g(e, t = null, n = null, s = 0, o = null, i = e === ie ? 0 : 1, l = !1, r = !1) {
  const c = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && $l(t),
    ref: t && Xn(t),
    scopeId: Ji,
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
    ctx: Ee
  };
  return r ? (vo(c, n), i & 128 && e.normalize(c)) : n && (c.shapeFlag |= ve(n) ? 8 : 16), Nn > 0 && // avoid a block node from tracking itself
  !l && // has current parent block
  He && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (c.patchFlag > 0 || i & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  c.patchFlag !== 32 && He.push(c), c;
}
const _e = Pa;
function Pa(e, t = null, n = null, s = 0, o = null, i = !1) {
  if ((!e || e === na) && (e = ke), Fn(e)) {
    const r = Lt(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && vo(r, n), Nn > 0 && !i && He && (r.shapeFlag & 6 ? He[He.indexOf(e)] = r : He.push(r)), r.patchFlag = -2, r;
  }
  if (Wa(e) && (e = e.__vccOpts), t) {
    t = Na(t);
    let { class: r, style: c } = t;
    r && !ve(r) && (t.class = ae(r)), pe(c) && (uo(c) && !q(c) && (c = Se({}, c)), t.style = Fe(c));
  }
  const l = ve(e) ? 1 : kl(e) ? 128 : Xi(e) ? 64 : pe(e) ? 4 : Y(e) ? 2 : 0;
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
function Na(e) {
  return e ? uo(e) || yl(e) ? Se({}, e) : e : null;
}
function Lt(e, t, n = !1, s = !1) {
  const { props: o, ref: i, patchFlag: l, children: r, transition: c } = e, h = t ? Fa(o || {}, t) : o, d = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: h,
    key: h && $l(h),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && i ? q(i) ? i.concat(Xn(t)) : [i, Xn(t)] : Xn(t)
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
  return _e(bs, null, e, t);
}
function ge(e = "", t = !1) {
  return t ? ($(), De(ke, null, e)) : _e(ke, null, e);
}
function st(e) {
  return e == null || typeof e == "boolean" ? _e(ke) : q(e) ? _e(
    ie,
    null,
    // #3666, avoid reference pollution when reusing vnode
    e.slice()
  ) : Fn(e) ? Mt(e) : _e(bs, null, String(e));
}
function Mt(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : Lt(e);
}
function vo(e, t) {
  let n = 0;
  const { shapeFlag: s } = e;
  if (t == null)
    t = null;
  else if (q(t))
    n = 16;
  else if (typeof t == "object")
    if (s & 65) {
      const o = t.default;
      o && (o._c && (o._d = !1), vo(e, o()), o._c && (o._d = !0));
      return;
    } else {
      n = 32;
      const o = t._;
      !o && !yl(t) ? t._ctx = Ee : o === 3 && Ee && (Ee.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else Y(t) ? (t = { default: t, _ctx: Ee }, n = 32) : (t = String(t), s & 64 ? (n = 16, t = [it(t)]) : n = 8);
  e.children = t, e.shapeFlag |= n;
}
function Fa(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const s = e[n];
    for (const o in s)
      if (o === "class")
        t.class !== s.class && (t.class = ae([t.class, s.class]));
      else if (o === "style")
        t.style = Fe([t.style, s.style]);
      else if (ds(o)) {
        const i = t[o], l = s[o];
        l && i !== l && !(q(i) && i.includes(l)) && (t[o] = i ? [].concat(i, l) : l);
      } else o !== "" && (t[o] = s[o]);
  }
  return t;
}
function tt(e, t, n, s = null) {
  Xe(e, t, 7, [
    n,
    s
  ]);
}
const Ra = fl();
let Da = 0;
function Ha(e, t, n) {
  const s = e.type, o = (t ? t.appContext : e.appContext) || Ra, i = {
    uid: Da++,
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
    scope: new ur(
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
    propsOptions: bl(s, o),
    emitsOptions: gl(s, o),
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
  return i.ctx = { _: i }, i.root = t ? t.root : i, i.emit = ma.bind(null, i), e.ce && e.ce(i), i;
}
let Le = null;
const Al = () => Le || Ee;
let rs, qs;
{
  const e = ps(), t = (n, s) => {
    let o;
    return (o = e[n]) || (o = e[n] = []), o.push(s), (i) => {
      o.length > 1 ? o.forEach((l) => l(i)) : o[0](i);
    };
  };
  rs = t(
    "__VUE_INSTANCE_SETTERS__",
    (n) => Le = n
  ), qs = t(
    "__VUE_SSR_SETTERS__",
    (n) => Rn = n
  );
}
const zn = (e) => {
  const t = Le;
  return rs(e), e.scope.on(), () => {
    e.scope.off(), rs(t);
  };
}, zo = () => {
  Le && Le.scope.off(), rs(null);
};
function Ml(e) {
  return e.vnode.shapeFlag & 4;
}
let Rn = !1;
function ja(e, t = !1, n = !1) {
  t && qs(t);
  const { props: s, children: o } = e.vnode, i = Ml(e);
  Sa(e, s, i, t), Ea(e, o, n || t);
  const l = i ? za(e, t) : void 0;
  return t && qs(!1), l;
}
function za(e, t) {
  const n = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, sa);
  const { setup: s } = n;
  if (s) {
    _t();
    const o = e.setupContext = s.length > 1 ? Ba(e) : null, i = zn(e), l = jn(
      s,
      e,
      0,
      [
        e.props,
        o
      ]
    ), r = Si(l);
    if (bt(), i(), (r || e.sp) && !ln(e) && ll(e), r) {
      if (l.then(zo, zo), t)
        return l.then((c) => {
          Vo(e, c);
        }).catch((c) => {
          ms(c, e, 0);
        });
      e.asyncDep = l;
    } else
      Vo(e, l);
  } else
    wl(e);
}
function Vo(e, t, n) {
  Y(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : pe(t) && (e.setupState = Wi(t)), wl(e);
}
function wl(e, t, n) {
  const s = e.type;
  e.render || (e.render = s.render || lt);
  {
    const o = zn(e);
    _t();
    try {
      oa(e);
    } finally {
      bt(), o();
    }
  }
}
const Va = {
  get(e, t) {
    return Te(e, "get", ""), e[t];
  }
};
function Ba(e) {
  const t = (n) => {
    e.exposed = n || {};
  };
  return {
    attrs: new Proxy(e.attrs, Va),
    slots: e.slots,
    emit: e.emit,
    expose: t
  };
}
function Cs(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(Wi(Ir(e.exposed)), {
    get(t, n) {
      if (n in t)
        return t[n];
      if (n in An)
        return An[n](e);
    },
    has(t, n) {
      return n in t || n in An;
    }
  })) : e.proxy;
}
function Wa(e) {
  return Y(e) && "__vccOpts" in e;
}
const K = (e, t) => Fr(e, t, Rn);
function Il(e, t, n) {
  try {
    ls(-1);
    const s = arguments.length;
    return s === 2 ? pe(t) && !q(t) ? Fn(t) ? _e(e, null, [t]) : _e(e, t) : _e(e, null, t) : (s > 3 ? n = Array.prototype.slice.call(arguments, 2) : s === 3 && Fn(n) && (n = [n]), _e(e, t, n));
  } finally {
    ls(1);
  }
}
const Ua = "3.5.25";
/**
* @vue/runtime-dom v3.5.25
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let Js;
const Bo = typeof window < "u" && window.trustedTypes;
if (Bo)
  try {
    Js = /* @__PURE__ */ Bo.createPolicy("vue", {
      createHTML: (e) => e
    });
  } catch {
  }
const Ll = Js ? (e) => Js.createHTML(e) : (e) => e, Ka = "http://www.w3.org/2000/svg", Ga = "http://www.w3.org/1998/Math/MathML", pt = typeof document < "u" ? document : null, Wo = pt && /* @__PURE__ */ pt.createElement("template"), qa = {
  insert: (e, t, n) => {
    t.insertBefore(e, n || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, n, s) => {
    const o = t === "svg" ? pt.createElementNS(Ka, e) : t === "mathml" ? pt.createElementNS(Ga, e) : n ? pt.createElement(e, { is: n }) : pt.createElement(e);
    return e === "select" && s && s.multiple != null && o.setAttribute("multiple", s.multiple), o;
  },
  createText: (e) => pt.createTextNode(e),
  createComment: (e) => pt.createComment(e),
  setText: (e, t) => {
    e.nodeValue = t;
  },
  setElementText: (e, t) => {
    e.textContent = t;
  },
  parentNode: (e) => e.parentNode,
  nextSibling: (e) => e.nextSibling,
  querySelector: (e) => pt.querySelector(e),
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
      Wo.innerHTML = Ll(
        s === "svg" ? `<svg>${e}</svg>` : s === "mathml" ? `<math>${e}</math>` : e
      );
      const r = Wo.content;
      if (s === "svg" || s === "mathml") {
        const c = r.firstChild;
        for (; c.firstChild; )
          r.appendChild(c.firstChild);
        r.removeChild(c);
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
}, Et = "transition", yn = "animation", Dn = Symbol("_vtc"), Ol = {
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
}, Ja = /* @__PURE__ */ Se(
  {},
  tl,
  Ol
), Ya = (e) => (e.displayName = "Transition", e.props = Ja, e), Ys = /* @__PURE__ */ Ya(
  (e, { slots: t }) => Il(Ur, Xa(e), t)
), Dt = (e, t = []) => {
  q(e) ? e.forEach((n) => n(...t)) : e && e(...t);
}, Uo = (e) => e ? q(e) ? e.some((t) => t.length > 1) : e.length > 1 : !1;
function Xa(e) {
  const t = {};
  for (const A in e)
    A in Ol || (t[A] = e[A]);
  if (e.css === !1)
    return t;
  const {
    name: n = "v",
    type: s,
    duration: o,
    enterFromClass: i = `${n}-enter-from`,
    enterActiveClass: l = `${n}-enter-active`,
    enterToClass: r = `${n}-enter-to`,
    appearFromClass: c = i,
    appearActiveClass: h = l,
    appearToClass: d = r,
    leaveFromClass: f = `${n}-leave-from`,
    leaveActiveClass: m = `${n}-leave-active`,
    leaveToClass: _ = `${n}-leave-to`
  } = e, E = Za(o), T = E && E[0], N = E && E[1], {
    onBeforeEnter: C,
    onEnter: v,
    onEnterCancelled: b,
    onLeave: S,
    onLeaveCancelled: D,
    onBeforeAppear: j = C,
    onAppear: ee = v,
    onAppearCancelled: J = b
  } = t, z = (A, R, H, Q) => {
    A._enterCancelled = Q, Ht(A, R ? d : r), Ht(A, R ? h : l), H && H();
  }, U = (A, R) => {
    A._isLeaving = !1, Ht(A, f), Ht(A, _), Ht(A, m), R && R();
  }, oe = (A) => (R, H) => {
    const Q = A ? ee : v, X = () => z(R, A, H);
    Dt(Q, [R, X]), Ko(() => {
      Ht(R, A ? c : i), ht(R, A ? d : r), Uo(Q) || Go(R, s, T, X);
    });
  };
  return Se(t, {
    onBeforeEnter(A) {
      Dt(C, [A]), ht(A, i), ht(A, l);
    },
    onBeforeAppear(A) {
      Dt(j, [A]), ht(A, c), ht(A, h);
    },
    onEnter: oe(!1),
    onAppear: oe(!0),
    onLeave(A, R) {
      A._isLeaving = !0;
      const H = () => U(A, R);
      ht(A, f), A._enterCancelled ? (ht(A, m), Yo(A)) : (Yo(A), ht(A, m)), Ko(() => {
        A._isLeaving && (Ht(A, f), ht(A, _), Uo(S) || Go(A, s, N, H));
      }), Dt(S, [A, H]);
    },
    onEnterCancelled(A) {
      z(A, !1, void 0, !0), Dt(b, [A]);
    },
    onAppearCancelled(A) {
      z(A, !0, void 0, !0), Dt(J, [A]);
    },
    onLeaveCancelled(A) {
      U(A), Dt(D, [A]);
    }
  });
}
function Za(e) {
  if (e == null)
    return null;
  if (pe(e))
    return [Os(e.enter), Os(e.leave)];
  {
    const t = Os(e);
    return [t, t];
  }
}
function Os(e) {
  return sr(e);
}
function ht(e, t) {
  t.split(/\s+/).forEach((n) => n && e.classList.add(n)), (e[Dn] || (e[Dn] = /* @__PURE__ */ new Set())).add(t);
}
function Ht(e, t) {
  t.split(/\s+/).forEach((s) => s && e.classList.remove(s));
  const n = e[Dn];
  n && (n.delete(t), n.size || (e[Dn] = void 0));
}
function Ko(e) {
  requestAnimationFrame(() => {
    requestAnimationFrame(e);
  });
}
let Qa = 0;
function Go(e, t, n, s) {
  const o = e._endId = ++Qa, i = () => {
    o === e._endId && s();
  };
  if (n != null)
    return setTimeout(i, n);
  const { type: l, timeout: r, propCount: c } = ec(e, t);
  if (!l)
    return s();
  const h = l + "end";
  let d = 0;
  const f = () => {
    e.removeEventListener(h, m), i();
  }, m = (_) => {
    _.target === e && ++d >= c && f();
  };
  setTimeout(() => {
    d < c && f();
  }, r + 1), e.addEventListener(h, m);
}
function ec(e, t) {
  const n = window.getComputedStyle(e), s = (E) => (n[E] || "").split(", "), o = s(`${Et}Delay`), i = s(`${Et}Duration`), l = qo(o, i), r = s(`${yn}Delay`), c = s(`${yn}Duration`), h = qo(r, c);
  let d = null, f = 0, m = 0;
  t === Et ? l > 0 && (d = Et, f = l, m = i.length) : t === yn ? h > 0 && (d = yn, f = h, m = c.length) : (f = Math.max(l, h), d = f > 0 ? l > h ? Et : yn : null, m = d ? d === Et ? i.length : c.length : 0);
  const _ = d === Et && /\b(?:transform|all)(?:,|$)/.test(
    s(`${Et}Property`).toString()
  );
  return {
    type: d,
    timeout: f,
    propCount: m,
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
function tc(e, t, n) {
  const s = e[Dn];
  s && (t = (t ? [t, ...s] : [...s]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
const as = Symbol("_vod"), Pl = Symbol("_vsh"), Xo = {
  // used for prop mismatch check during hydration
  name: "show",
  beforeMount(e, { value: t }, { transition: n }) {
    e[as] = e.style.display === "none" ? "" : e.style.display, n && t ? n.beforeEnter(e) : _n(e, t);
  },
  mounted(e, { value: t }, { transition: n }) {
    n && t && n.enter(e);
  },
  updated(e, { value: t, oldValue: n }, { transition: s }) {
    !t != !n && (s ? t ? (s.beforeEnter(e), _n(e, !0), s.enter(e)) : s.leave(e, () => {
      _n(e, !1);
    }) : _n(e, t));
  },
  beforeUnmount(e, { value: t }) {
    _n(e, t);
  }
};
function _n(e, t) {
  e.style.display = t ? e[as] : "none", e[Pl] = !t;
}
const nc = Symbol(""), sc = /(?:^|;)\s*display\s*:/;
function oc(e, t, n) {
  const s = e.style, o = ve(n);
  let i = !1;
  if (n && !o) {
    if (t)
      if (ve(t))
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
      const l = s[nc];
      l && (n += ";" + l), s.cssText = n, i = sc.test(n);
    }
  } else t && e.removeAttribute("style");
  as in e && (e[as] = i ? s.display : "", e[Pl] && (s.display = "none"));
}
const Zo = /\s*!important$/;
function Zn(e, t, n) {
  if (q(n))
    n.forEach((s) => Zn(e, t, s));
  else if (n == null && (n = ""), t.startsWith("--"))
    e.setProperty(t, n);
  else {
    const s = ic(e, t);
    Zo.test(n) ? e.setProperty(
      Yt(s),
      n.replace(Zo, ""),
      "important"
    ) : e[s] = n;
  }
}
const Qo = ["Webkit", "Moz", "ms"], Ps = {};
function ic(e, t) {
  const n = Ps[t];
  if (n)
    return n;
  let s = It(t);
  if (s !== "filter" && s in e)
    return Ps[t] = s;
  s = ki(s);
  for (let o = 0; o < Qo.length; o++) {
    const i = Qo[o] + s;
    if (i in e)
      return Ps[t] = i;
  }
  return t;
}
const ei = "http://www.w3.org/1999/xlink";
function ti(e, t, n, s, o, i = cr(t)) {
  s && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(ei, t.slice(6, t.length)) : e.setAttributeNS(ei, t, n) : n == null || i && !$i(n) ? e.removeAttribute(t) : e.setAttribute(
    t,
    i ? "" : St(n) ? String(n) : n
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
    const r = i === "OPTION" ? e.getAttribute("value") || "" : e.value, c = n == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      e.type === "checkbox" ? "on" : ""
    ) : String(n);
    (r !== c || !("_value" in e)) && (e.value = c), n == null && e.removeAttribute(t), e._value = n;
    return;
  }
  let l = !1;
  if (n === "" || n == null) {
    const r = typeof e[t];
    r === "boolean" ? n = $i(n) : n == null && r === "string" ? (n = "", l = !0) : r === "number" && (n = 0, l = !0);
  }
  try {
    e[t] = n;
  } catch {
  }
  l && e.removeAttribute(o || t);
}
function en(e, t, n, s) {
  e.addEventListener(t, n, s);
}
function lc(e, t, n, s) {
  e.removeEventListener(t, n, s);
}
const si = Symbol("_vei");
function rc(e, t, n, s, o = null) {
  const i = e[si] || (e[si] = {}), l = i[t];
  if (s && l)
    l.value = s;
  else {
    const [r, c] = ac(t);
    if (s) {
      const h = i[t] = dc(
        s,
        o
      );
      en(e, r, h, c);
    } else l && (lc(e, r, l, c), i[t] = void 0);
  }
}
const oi = /(?:Once|Passive|Capture)$/;
function ac(e) {
  let t;
  if (oi.test(e)) {
    t = {};
    let s;
    for (; s = e.match(oi); )
      e = e.slice(0, e.length - s[0].length), t[s[0].toLowerCase()] = !0;
  }
  return [e[2] === ":" ? e.slice(3) : Yt(e.slice(2)), t];
}
let Ns = 0;
const cc = /* @__PURE__ */ Promise.resolve(), uc = () => Ns || (cc.then(() => Ns = 0), Ns = Date.now());
function dc(e, t) {
  const n = (s) => {
    if (!s._vts)
      s._vts = Date.now();
    else if (s._vts <= n.attached)
      return;
    Xe(
      fc(s, n.value),
      t,
      5,
      [s]
    );
  };
  return n.value = e, n.attached = uc(), n;
}
function fc(e, t) {
  if (q(t)) {
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
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, hc = (e, t, n, s, o, i) => {
  const l = o === "svg";
  t === "class" ? tc(e, s, l) : t === "style" ? oc(e, n, s) : ds(t) ? eo(t) || rc(e, t, n, s, i) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : pc(e, t, s, l)) ? (ni(e, t, s), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && ti(e, t, s, l, i, t !== "value")) : /* #11081 force set props for possible async custom element */ e._isVueCE && (/[A-Z]/.test(t) || !ve(s)) ? ni(e, It(t), s, i, t) : (t === "true-value" ? e._trueValue = s : t === "false-value" && (e._falseValue = s), ti(e, t, s, l));
};
function pc(e, t, n, s) {
  if (s)
    return !!(t === "innerHTML" || t === "textContent" || t in e && ii(t) && Y(n));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (t === "width" || t === "height") {
    const o = e.tagName;
    if (o === "IMG" || o === "VIDEO" || o === "CANVAS" || o === "SOURCE")
      return !1;
  }
  return ii(t) && ve(n) ? !1 : t in e;
}
const li = (e) => {
  const t = e.props["onUpdate:modelValue"] || !1;
  return q(t) ? (n) => Jn(t, n) : t;
};
function gc(e) {
  e.target.composing = !0;
}
function ri(e) {
  const t = e.target;
  t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
const Fs = Symbol("_assign");
function ai(e, t, n) {
  return t && (e = e.trim()), n && (e = so(e)), e;
}
const ot = {
  created(e, { modifiers: { lazy: t, trim: n, number: s } }, o) {
    e[Fs] = li(o);
    const i = s || o.props && o.props.type === "number";
    en(e, t ? "change" : "input", (l) => {
      l.target.composing || e[Fs](ai(e.value, n, i));
    }), (n || i) && en(e, "change", () => {
      e.value = ai(e.value, n, i);
    }), t || (en(e, "compositionstart", gc), en(e, "compositionend", ri), en(e, "change", ri));
  },
  // set value on mounted so it's after min/max for type="range"
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: s, trim: o, number: i } }, l) {
    if (e[Fs] = li(l), e.composing) return;
    const r = (i || e.type === "number") && !/^0\d/.test(e.value) ? so(e.value) : e.value, c = t ?? "";
    r !== c && (document.activeElement === e && e.type !== "range" && (s && t === n || o && e.value.trim() === c) || (e.value = c));
  }
}, mc = ["ctrl", "shift", "alt", "meta"], vc = {
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
  exact: (e, t) => mc.some((n) => e[`${n}Key`] && !t.includes(n))
}, me = (e, t) => {
  const n = e._withMods || (e._withMods = {}), s = t.join(".");
  return n[s] || (n[s] = ((o, ...i) => {
    for (let l = 0; l < t.length; l++) {
      const r = vc[t[l]];
      if (r && r(o, t)) return;
    }
    return e(o, ...i);
  }));
}, yc = /* @__PURE__ */ Se({ patchProp: hc }, qa);
let ci;
function _c() {
  return ci || (ci = Aa(yc));
}
const Nl = ((...e) => {
  const t = _c().createApp(...e), { mount: n } = t;
  return t.mount = (s) => {
    const o = Cc(s);
    if (!o) return;
    const i = t._component;
    !Y(i) && !i.render && !i.template && (i.template = o.innerHTML), o.nodeType === 1 && (o.textContent = "");
    const l = n(o, !1, bc(o));
    return o instanceof Element && (o.removeAttribute("v-cloak"), o.setAttribute("data-v-app", "")), l;
  }, t;
});
function bc(e) {
  if (e instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function Cc(e) {
  return ve(e) ? document.querySelector(e) : e;
}
function Fl(e) {
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
function Sc(e) {
  const t = Fl(e);
  return t ? t.querySelector(".lg-node-widgets") : null;
}
function xc(e) {
  return Number.isFinite(e) ? Math.max(0, Math.min(1, e)) : 0;
}
function Tc(e) {
  const t = e.trim().match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+\s*)?\)$/i);
  return t ? { r: Number(t[1]), g: Number(t[2]), b: Number(t[3]) } : null;
}
function kc(e) {
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
function Rs(e, t) {
  const n = xc(t);
  return `rgba(${e.r}, ${e.g}, ${e.b}, ${n})`;
}
function ui(e) {
  const t = e.trim().toLowerCase();
  return t === "transparent" || t === "rgba(0, 0, 0, 0)" || t === "rgba(0,0,0,0)";
}
function Ec(e) {
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
const $c = { class: "header__title" }, Ac = ["title"], Mc = {
  key: 1,
  class: "header-actions"
}, wc = { class: "body-wrap" }, Ic = { class: "header__title" }, Lc = ["title"], Oc = {
  key: 1,
  class: "header-actions"
}, Pc = { class: "body-wrap" }, Nc = /* @__PURE__ */ je({
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
      return f ? Tc(f) ?? kc(f) : null;
    }), r = K(() => {
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
        border: `1px solid ${f ? Rs(f, 0.65) : "rgba(255, 255, 255, 0.08)"}`,
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
      const f = l.value, m = f ? Rs(f, 0.22) : "rgba(255, 255, 255, 0.06)", _ = f ? Rs(f, 0.35) : "rgba(255, 255, 255, 0.1)";
      return {
        background: m,
        border: `1px solid ${_}`
      };
    });
    function h(f = 100) {
      const m = Sc(t.nodeId);
      if (m) {
        m.style.position = m.style.position || "relative", m.style.width = "100%", m.style.height = "100%", n.value = m, d();
        return;
      }
      f > 0 && (s = window.setTimeout(() => h(f - 1), 100));
    }
    function d() {
      const f = Fl(t.nodeId);
      f && (i.value = Ec(f), o || (o = new MutationObserver(() => d()), o.observe(f, { attributes: !0, attributeFilter: ["style", "class"] })));
    }
    return Ot(() => {
      h();
    }), pn(() => {
      s && clearTimeout(s), o && o.disconnect();
    }), (f, m) => n.value ? ($(), De(Qi, {
      key: 0,
      to: n.value
    }, [
      g("div", {
        class: ae(["hikaze-node-frame", { "vue-mode": !0 }]),
        style: Fe(r.value),
        onPointerdown: m[0] || (m[0] = me(() => {
        }, ["stop"])),
        onPointermove: m[1] || (m[1] = me(() => {
        }, ["stop"])),
        onPointerup: m[2] || (m[2] = me(() => {
        }, ["stop"])),
        onContextmenu: m[3] || (m[3] = me(() => {
        }, ["stop"]))
      }, [
        e.title ? ($(), L("div", {
          key: 0,
          class: "header",
          style: Fe(c.value)
        }, [
          g("div", $c, Z(e.title), 1),
          e.error ? ($(), L("div", {
            key: 0,
            class: "header__error",
            title: e.error
          }, Z(e.error), 9, Ac)) : ge("", !0),
          f.$slots["header-actions"] ? ($(), L("div", Mc, [
            Bt(f.$slots, "header-actions", {}, void 0)
          ])) : ge("", !0)
        ], 4)) : ge("", !0),
        g("div", wc, [
          Bt(f.$slots, "default", {}, void 0)
        ])
      ], 36)
    ], 8, ["to"])) : ($(), L("div", {
      key: 1,
      class: ae(["hikaze-node-frame", { "legacy-mode": !0 }]),
      style: Fe(r.value),
      onPointerdown: m[4] || (m[4] = me(() => {
      }, ["stop"])),
      onPointermove: m[5] || (m[5] = me(() => {
      }, ["stop"])),
      onPointerup: m[6] || (m[6] = me(() => {
      }, ["stop"])),
      onContextmenu: m[7] || (m[7] = me(() => {
      }, ["stop"]))
    }, [
      e.title ? ($(), L("div", {
        key: 0,
        class: "header",
        style: Fe(c.value)
      }, [
        g("div", Ic, Z(e.title), 1),
        e.error ? ($(), L("div", {
          key: 0,
          class: "header__error",
          title: e.error
        }, Z(e.error), 9, Lc)) : ge("", !0),
        f.$slots["header-actions"] ? ($(), L("div", Oc, [
          Bt(f.$slots, "header-actions", {}, void 0)
        ])) : ge("", !0)
      ], 4)) : ge("", !0),
      g("div", Pc, [
        Bt(f.$slots, "default", {}, void 0)
      ])
    ], 36));
  }
}), ze = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, o] of t)
    n[s] = o;
  return n;
}, Rl = /* @__PURE__ */ ze(Nc, [["__scopeId", "data-v-c760ccec"]]), Fc = { class: "hikaze-checkpoint-content" }, Rc = ["title"], Dc = { class: "value" }, Hc = /* @__PURE__ */ je({
  __name: "HikazeCheckpointLoaderOverlay",
  props: {
    nodeId: {},
    payload: {},
    commit: { type: Function },
    title: {}
  },
  setup(e) {
    const t = e, n = an("openManager", null), s = K(() => {
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
    return (i, l) => ($(), De(Rl, {
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
        g("div", Fc, [
          g("div", {
            class: "path-display",
            title: s.value
          }, [
            l[0] || (l[0] = g("div", { class: "label" }, "Current Path:", -1)),
            g("div", Dc, Z(s.value || "(No path selected)"), 1)
          ], 8, Rc)
        ])
      ]),
      _: 1
    }, 8, ["node-id"]));
  }
}), jc = /* @__PURE__ */ ze(Hc, [["__scopeId", "data-v-3473ea37"]]);
class zc {
  constructor(t, n, s) {
    fe(this, "nodeId");
    fe(this, "node");
    fe(this, "app");
    this.nodeId = t, this.node = n, this.app = s;
  }
  /**
   * Get the current geometry for the overlay.
   * Returns null if the node cannot be found or measured.
   */
  getGeometry() {
    var h, d, f, m;
    const t = (h = this.node) == null ? void 0 : h.pos, n = (d = this.node) == null ? void 0 : d.size;
    if (!t || !n)
      return null;
    const [s, o] = t, [i, l] = n, r = (m = (f = this.node) == null ? void 0 : f.flags) != null && m.collapsed ? Math.min(l, 60) : l, c = this.canvasToScreen(s, o, i, r);
    return c || null;
  }
  /**
   * Transform canvas coordinates to screen pixel coordinates.
   * Uses LiteGraph's DragAndScale (ds) state for precise positioning.
   */
  canvasToScreen(t, n, s, o) {
    var E;
    const i = (E = this.app) == null ? void 0 : E.canvas;
    if (!i || !i.canvas)
      return null;
    const l = i.ds, r = (l == null ? void 0 : l.scale) ?? 1, c = (l == null ? void 0 : l.offset) ?? [0, 0], h = i.canvas.getBoundingClientRect(), d = h.left + (t + c[0]) * r, f = h.top + (n + c[1]) * r, m = s * r, _ = o * r;
    return {
      x: d,
      y: f,
      width: m,
      height: _
    };
  }
  /**
   * Get the geometry for just the widget area of the node (excluding IO slots).
   * In LiteGraph, the node body contains IO slots at the top and widgets below.
   * This method returns the geometry of only the widget area.
   */
  getWidgetAreaGeometry() {
    const t = this.getGeometry();
    if (!t) return null;
    const n = this.getWidgetsStartY(), s = this.getScale(), o = n * s, i = Math.max(0, t.height - o);
    return {
      x: t.x,
      y: t.y + o,
      width: t.width,
      height: i
    };
  }
  /**
   * Get the geometry for a specific widget, with inset to avoid covering resize handles.
   * Uses the widget's `last_y` property (set by LiteGraph during drawing) for precise positioning.
   *
   * @param widgetName - Name of the widget to align to
   * @param inset - Graph-space inset (pixels at scale=1) to shrink overlay from node edges
   */
  getTargetWidgetGeometry(t, n = 6) {
    var f, m, _, E;
    const s = (f = this.node) == null ? void 0 : f.pos, o = (m = this.node) == null ? void 0 : m.size;
    if (!s || !o || (E = (_ = this.node) == null ? void 0 : _.flags) != null && E.collapsed) return null;
    const i = Array.isArray(this.node.widgets) ? this.node.widgets.find((T) => (T == null ? void 0 : T.name) === t) : void 0, l = typeof (i == null ? void 0 : i.last_y) == "number" ? i.last_y : this.getWidgetsStartY(), r = s[0] + n, c = s[1] + l, h = Math.max(0, o[0] - 2 * n), d = Math.max(0, o[1] - l - n);
    return h <= 0 || d <= 0 ? null : this.canvasToScreen(r, c, h, d);
  }
  /**
   * Compute the Y offset (in canvas/graph space) where widgets start within the node body.
   * Prefers the LiteGraph-computed `widgets_start_y` property if available,
   * otherwise estimates from the number of IO slots.
   */
  getWidgetsStartY() {
    var i, l, r, c;
    if (typeof ((i = this.node) == null ? void 0 : i.widgets_start_y) == "number" && this.node.widgets_start_y > 0)
      return this.node.widgets_start_y;
    const t = Array.isArray((l = this.node) == null ? void 0 : l.inputs) ? this.node.inputs.length : 0, n = Array.isArray((r = this.node) == null ? void 0 : r.outputs) ? this.node.outputs.length : 0, s = Math.max(t, n);
    if (s === 0) return 0;
    const o = ((c = globalThis == null ? void 0 : globalThis.LiteGraph) == null ? void 0 : c.NODE_SLOT_HEIGHT) ?? 20;
    return s * o;
  }
  /**
   * Get the current scale of the canvas.
   */
  getScale() {
    var n, s;
    const t = (s = (n = this.app) == null ? void 0 : n.canvas) == null ? void 0 : s.ds;
    return (t == null ? void 0 : t.scale) ?? 1;
  }
  /**
   * Check if the node is currently visible on screen (not off-screen).
   */
  isVisible() {
    const t = this.getGeometry();
    if (!t)
      return !1;
    const n = window.innerWidth, s = window.innerHeight, o = window.scrollX, i = window.scrollY, l = t.x + t.width, r = t.y + t.height;
    return t.x < o + n && l > o && t.y < i + s && r > i;
  }
}
function Vc(e, t, n) {
  var i, l, r;
  const s = (i = n == null ? void 0 : n.canvas) == null ? void 0 : i.canvas;
  if (!s)
    return null;
  let o = (l = s.parentElement) == null ? void 0 : l.querySelector(
    "[data-hikaze-overlay-container='1']"
  );
  return o || (o = document.createElement("div"), o.setAttribute("data-hikaze-overlay-container", "1"), o.style.position = "fixed", o.style.top = "0", o.style.left = "0", o.style.width = "100%", o.style.height = "100%", o.style.pointerEvents = "none", o.style.zIndex = "100", (r = s.parentElement) == null || r.insertBefore(o, s.nextSibling)), o;
}
const cs = V(!1), yo = V(null);
let Qn = null;
const bn = es({
  isOpen: cs,
  options: yo
});
function Bc(e) {
  return cs.value && tn(null), cs.value = !0, yo.value = e, new Promise((t) => {
    Qn = t;
  });
}
function tn(e) {
  cs.value = !1, yo.value = null, Qn && (Qn(e), Qn = null);
}
const qn = "hikaze_payload";
class qt {
  constructor(t) {
    fe(this, "node");
    /** Reactive copy of the `hikaze_payload` widget value. */
    fe(this, "payloadRef", V("{}"));
    fe(this, "injectedMode", null);
    fe(this, "cleanupFns", []);
    fe(this, "vueApp", null);
    fe(this, "vueHost", null);
    fe(this, "vueMountRetryTimer", null);
    // Canvas mode overlay management
    fe(this, "canvasOverlayEl", null);
    fe(this, "positionAdapter", null);
    fe(this, "positionSyncTimer", null);
    fe(this, "resizeObserver", null);
    fe(this, "app", null);
    fe(this, "onWidgetChangedOriginal", null);
    fe(this, "onWidgetChangedWrapper", null);
    fe(this, "hydrationSyncTimers", []);
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
    this.injectedMode && this.injectedMode !== t.mode && this.dispose(), this.ensureWidgetChangeHook(), this.syncFromWidget(), this.scheduleHydrationSync(t), this.ensureFrameMounted(t), this.injectedMode = t.mode;
  }
  reinject(t) {
    this.dispose(), this.inject(t);
  }
  dispose() {
    if (this.clearHydrationSync(), this.unhookWidgetChange(), this.stopPositionSync(), this.vueMountRetryTimer != null && (window.clearTimeout(this.vueMountRetryTimer), this.vueMountRetryTimer = null), this.vueApp) {
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
    if (this.canvasOverlayEl) {
      try {
        this.canvasOverlayEl.remove();
      } catch {
      }
      this.canvasOverlayEl = null;
    }
    if (this.positionAdapter = null, this.resizeObserver) {
      try {
        this.resizeObserver.disconnect();
      } catch {
      }
      this.resizeObserver = null;
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
        const c = String(s.value ?? ""), h = n(c);
        return h !== null && h !== c && this.commitPayload(h), !0;
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
    const n = this.findWidget(qn);
    if (!n) return;
    const s = String(t ?? "{}");
    this.setWidgetValue(n, s), this.payloadRef.value = s;
  }
  // --- Widget Sync Logic ---
  ensureWidgetChangeHook() {
    const t = this.node;
    !t || typeof t != "object" || this.onWidgetChangedWrapper || (this.onWidgetChangedOriginal = t.onWidgetChanged, this.onWidgetChangedWrapper = (n, s, o, i) => {
      n === qn && (this.payloadRef.value = String(s ?? "{}"));
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
    const t = this.findWidget(qn);
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
  /**
   * Mount the Vue component overlay for the node.
   * Supports both VueNodes mode (Teleport into DOM) and Legacy Canvas mode (absolute overlay).
   * 
   * Key principle: Vue App is mounted ONCE to the correct target container.
   * No unmount -> remount cycle, which would violate Vue 3 lifecycle rules.
   */
  ensureFrameMounted(t, n = 50) {
    var i;
    const s = (i = this.node) == null ? void 0 : i.id;
    if (s == null) {
      n > 0 && (this.vueMountRetryTimer = window.setTimeout(
        () => this.ensureFrameMounted(t, n - 1),
        50
      ));
      return;
    }
    this.app = t.app;
    let o = null;
    if (t.mode === "legacy") {
      const l = Vc(s, "legacy", this.app);
      if (!l) {
        console.warn("[Hikaze] Failed to get overlay container for node", s);
        return;
      }
      let r = l.querySelector(
        `[data-hikaze-canvas-overlay][data-node-id="${s}"]`
      );
      r || (r = document.createElement("div"), r.setAttribute("data-hikaze-canvas-overlay", "1"), r.setAttribute("data-node-id", String(s)), r.style.position = "fixed", r.style.pointerEvents = "auto", r.style.zIndex = "1000", r.style.overflow = "hidden", l.appendChild(r)), this.canvasOverlayEl = r, o = r, this.startPositionSync();
    } else {
      let l = document.querySelector(
        `[data-hikaze-node-overlay-host][data-node-id="${s}"]`
      );
      l || (l = document.createElement("div"), l.setAttribute("data-hikaze-node-overlay-host", "1"), l.setAttribute("data-node-id", String(s)), l.style.display = "none", document.body.appendChild(l)), this.vueHost = l, o = l, this.stopPositionSync();
    }
    if (!this.vueApp) {
      const l = Nl({
        render: () => Il(this.getComponent(), {
          nodeId: s,
          title: this.getTitle(),
          ...this.getComponentProps(),
          payload: this.payloadRef,
          commit: (r) => this.commitPayload(r)
        })
      });
      l.provide("openManager", Bc), l.mount(o), this.vueApp = l, console.info(`[Hikaze] Mounted overlay for node ${s} in ${t.mode} mode`);
    }
  }
  /**
   * Start synchronizing overlay position with canvas node position.
   */
  startPositionSync() {
    var h, d;
    this.stopPositionSync(), this.syncOverlayPosition();
    let t = 0, n = 0, s = 0, o = null, i = null;
    const l = () => {
      var S, D;
      if (!this.canvasOverlayEl || !((D = (S = this.app) == null ? void 0 : S.canvas) != null && D.ds)) {
        this.positionSyncTimer = window.requestAnimationFrame(l);
        return;
      }
      const f = this.app.canvas.ds, m = f.scale ?? 1, _ = f.offset ?? [0, 0], E = this.node.pos, T = this.node.size, N = m !== t, C = _[0] !== n || _[1] !== s, v = !o || (E == null ? void 0 : E[0]) !== o[0] || (E == null ? void 0 : E[1]) !== o[1], b = !i || (T == null ? void 0 : T[0]) !== i[0] || (T == null ? void 0 : T[1]) !== i[1];
      (N || C || v || b) && (t = m, n = _[0], s = _[1], o = E ? [...E] : null, i = T ? [...T] : null, this.syncOverlayPosition()), this.positionSyncTimer = window.requestAnimationFrame(l);
    };
    this.positionSyncTimer = window.requestAnimationFrame(l);
    const r = () => {
      setTimeout(() => {
        t = 0, n = 0, s = 0, o = null, i = null, this.syncOverlayPosition();
      }, 16);
    };
    window.addEventListener("resize", r), window.addEventListener("scroll", r, !0);
    const c = (d = (h = this.app) == null ? void 0 : h.canvas) == null ? void 0 : d.canvas;
    c && (c.addEventListener("wheel", r, { passive: !0 }), c.addEventListener("pointerup", r, { passive: !0 }), c.addEventListener("dblclick", r, { passive: !0 })), this.cleanupFns.push(() => {
      window.removeEventListener("resize", r), window.removeEventListener("scroll", r, !0), c && (c.removeEventListener("wheel", r), c.removeEventListener("pointerup", r), c.removeEventListener("dblclick", r));
    });
  }
  /**
   * Stop position synchronization.
   */
  stopPositionSync() {
    this.positionSyncTimer != null && (window.cancelAnimationFrame(this.positionSyncTimer), this.positionSyncTimer = null);
  }
  /**
   * Update overlay position based on current canvas node position.
   */
  syncOverlayPosition() {
    if (!this.canvasOverlayEl || !this.app) return;
    this.positionAdapter = new zc(
      this.node.id,
      this.node,
      this.app
    );
    const t = this.positionAdapter.getTargetWidgetGeometry(qn);
    if (!t) {
      this.canvasOverlayEl.style.display = "none";
      return;
    }
    const n = this.positionAdapter.getScale();
    this.canvasOverlayEl.style.display = "block", this.canvasOverlayEl.style.left = `${t.x}px`, this.canvasOverlayEl.style.top = `${t.y}px`, this.canvasOverlayEl.style.width = `${t.width / n}px`, this.canvasOverlayEl.style.height = `${t.height / n}px`, this.canvasOverlayEl.style.transform = `scale(${n})`, this.canvasOverlayEl.style.transformOrigin = "0 0";
  }
}
fe(qt, "registry", /* @__PURE__ */ new Map());
const Wc = "HikazeCheckpointLoader";
class Uc extends qt {
  getComponent() {
    return jc;
  }
}
qt.register(Wc, Uc);
const Kc = ["title"], Gc = ["value"], qc = ["value"], Jc = { class: "center-chk" }, Yc = ["checked"], Xc = /* @__PURE__ */ je({
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
        var h;
        return n.name && ((h = n.name.split(/[\\/]/).pop()) == null ? void 0 : h.replace(".safetensors", "")) || "";
      }
    ), o = t;
    function i(h) {
      const d = h.target;
      o("update:strength_model", n.seq, d.valueAsNumber);
    }
    function l(h) {
      const d = h.target;
      o("update:strength_clip", n.seq, d.valueAsNumber);
    }
    function r(h) {
      o("update:enabled", n.seq, h.target.checked);
    }
    function c(h) {
      o("update:delete", n.seq);
    }
    return (h, d) => ($(), L("tr", null, [
      g("td", null, [
        g("button", {
          class: "del-btn",
          onClick: c
        }, "🗑")
      ]),
      g("td", null, Z(n.seq + 1), 1),
      g("td", {
        title: s.value,
        class: "lora-name"
      }, Z(s.value), 9, Kc),
      g("td", null, [
        g("input", {
          class: "hikaze-reset-input",
          type: "number",
          value: n.strength_model,
          step: "0.05",
          onInput: i
        }, null, 40, Gc)
      ]),
      g("td", null, [
        g("input", {
          class: "hikaze-reset-input",
          type: "number",
          value: n.strength_clip,
          step: "0.05",
          onInput: l
        }, null, 40, qc)
      ]),
      g("td", Jc, [
        g("input", {
          class: "hikaze-reset-chk",
          type: "checkbox",
          checked: n.enabled,
          onInput: r
        }, null, 40, Yc)
      ])
    ]));
  }
}), Zc = /* @__PURE__ */ ze(Xc, [["__scopeId", "data-v-771e698c"]]);
function Dl(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function Cn(e) {
  return typeof e == "string" ? e : null;
}
function zt(e) {
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
function Hl(e) {
  if (!Dl(e)) return null;
  const t = Cn(e.name) ?? "", n = Cn(e.full_path) ?? Cn(e.fullPath) ?? Cn(e.path) ?? "", s = zt(e.strength_model) ?? zt(e.MStrength) ?? zt(e.strengthModel) ?? 1, o = zt(e.strength_clip) ?? zt(e.CStrength) ?? zt(e.strengthClip) ?? 1, i = di(e.enabled) ?? di(e.toggleOn) ?? !0, l = Cn(e.sha256) ?? "";
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
function Qc(e) {
  let t = 2, n = null;
  if (Array.isArray(e))
    n = e;
  else if (Dl(e)) {
    const o = zt(e.version);
    o != null && (t = o), n = e.loras ?? e.LoRAs ?? e.LoRAList ?? e.loRAList ?? null;
  }
  if (!Array.isArray(n))
    return { version: t, loras: [] };
  const s = [];
  for (const o of n) {
    const i = Hl(o);
    i && s.push(i);
  }
  return { version: t, loras: s };
}
function zl(e) {
  const t = e.trim();
  if (!t) return jl();
  let n;
  try {
    n = JSON.parse(t);
  } catch (s) {
    throw new Error(String((s == null ? void 0 : s.message) ?? s ?? "Invalid JSON"));
  }
  return Qc(n);
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
function eu(e) {
  return Hl(e) ?? {
    full_path: "",
    strength_model: 1,
    strength_clip: 1,
    enabled: !0,
    name: "",
    sha256: ""
  };
}
const tu = { class: "hikaze-lora-content" }, nu = { class: "loRA-list-table" }, su = {
  class: "header-chk-wrap",
  title: "Toggle All"
}, ou = {
  key: 0,
  class: "empty-tip"
}, iu = /* @__PURE__ */ je({
  __name: "HikazeLoraPowerLoaderOverlay",
  props: {
    nodeId: {},
    payload: {},
    commit: { type: Function }
  },
  setup(e) {
    const t = e, n = an("openManager", null), s = {
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
            o.value = zl(_ || "");
          } catch {
            console.error("Invalid JSON provided to Hikaze Lora Overlay"), o.value = JSON.parse(JSON.stringify(s));
          }
      },
      { immediate: !0 }
    ), Ke(o, () => {
      const _ = fi(o.value);
      i.value = _, t.commit(_);
    }, { deep: !0 });
    function l(_, E) {
      var N;
      const T = (N = o.value.loras) == null ? void 0 : N[_];
      T && (T.strength_model = E);
    }
    function r(_, E) {
      var N;
      const T = (N = o.value.loras) == null ? void 0 : N[_];
      T && (T.strength_clip = E);
    }
    function c(_, E) {
      var N;
      const T = (N = o.value.loras) == null ? void 0 : N[_];
      T && (T.enabled = E);
    }
    function h(_) {
      var E;
      (E = o.value.loras) == null || E.splice(_, 1);
    }
    function d() {
      confirm("Delete all LoRAs?") && (o.value.loras = []);
    }
    function f(_) {
      if (!o.value.loras) return;
      const E = _.target.checked;
      o.value.loras.forEach((T) => {
        T.enabled = E;
      });
    }
    async function m() {
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
    return (_, E) => ($(), De(Rl, {
      "node-id": e.nodeId,
      title: "Hikaze LoRA Power Loader"
    }, {
      "header-actions": rt(() => [
        g("button", {
          type: "button",
          class: "btn header-action-btn",
          onClick: m
        }, " Select LoRAs... ")
      ]),
      default: rt(() => [
        g("div", tu, [
          g("table", nu, [
            g("thead", null, [
              g("th", null, [
                g("button", {
                  class: "header-btn",
                  onClick: d,
                  title: "Delete All"
                }, "🗑")
              ]),
              E[1] || (E[1] = g("th", null, "Seq", -1)),
              E[2] || (E[2] = g("th", null, "LoRA", -1)),
              E[3] || (E[3] = g("th", null, "Mstr", -1)),
              E[4] || (E[4] = g("th", null, "Cstr", -1)),
              g("th", null, [
                g("div", su, [
                  E[0] || (E[0] = it(" On ", -1)),
                  g("input", {
                    class: "hikaze-reset-chk",
                    type: "checkbox",
                    onChange: f
                  }, null, 32)
                ])
              ])
            ]),
            g("tbody", null, [
              ($(!0), L(ie, null, be(o.value.loras, (T, N) => ($(), De(Zc, {
                key: N,
                seq: N,
                name: T.full_path,
                strength_model: T.strength_model,
                strength_clip: T.strength_clip,
                enabled: T.enabled,
                "onUpdate:strength_model": l,
                "onUpdate:strength_clip": r,
                "onUpdate:enabled": c,
                "onUpdate:delete": h
              }, null, 8, ["seq", "name", "strength_model", "strength_clip", "enabled"]))), 128))
            ])
          ]),
          o.value.loras.length === 0 ? ($(), L("div", ou, " No LoRAs loaded. ")) : ge("", !0)
        ])
      ]),
      _: 1
    }, 8, ["node-id"]));
  }
}), lu = /* @__PURE__ */ ze(iu, [["__scopeId", "data-v-15c94417"]]), ru = "HikazeLoraPowerLoader";
class au extends qt {
  getComponent() {
    return lu;
  }
}
qt.register(ru, au);
const cu = "Hikaze", Vl = "Comfy.VueNodes.Enabled", uu = `${Vl}.change`, du = Object.hasOwn ?? ((e, t) => Object.prototype.hasOwnProperty.call(e, t));
function hi(e, t) {
  return !e || typeof e != "object" && typeof e != "function" ? !1 : du(e, t);
}
function pi(e, t, n = !0) {
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
function gn(e) {
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
function fu(e) {
  return {
    description: String((e == null ? void 0 : e.description) ?? ""),
    community_links: String((e == null ? void 0 : e.community_links) ?? ""),
    images_count: Number((e == null ? void 0 : e.images_count) ?? 0),
    prompts: Bl(e == null ? void 0 : e.prompts)
  };
}
function hu(e) {
  return {
    description: String((e == null ? void 0 : e.description) ?? ""),
    community_links: String((e == null ? void 0 : e.community_links) ?? ""),
    images: Array.isArray(e == null ? void 0 : e.images) ? e.images.map((t) => String(t)) : [],
    prompts: Bl(e == null ? void 0 : e.prompts)
  };
}
function Wl(e) {
  return {
    sha256: String((e == null ? void 0 : e.sha256) ?? ""),
    path: String((e == null ? void 0 : e.path) ?? ""),
    name: String((e == null ? void 0 : e.name) ?? ""),
    type: String((e == null ? void 0 : e.type) ?? ""),
    size_bytes: Number((e == null ? void 0 : e.size_bytes) ?? 0),
    created_at: Number((e == null ? void 0 : e.created_at) ?? 0),
    meta_json: fu(e == null ? void 0 : e.meta_json),
    tags: Array.isArray(e == null ? void 0 : e.tags) ? e.tags.map(gn) : []
  };
}
function pu(e) {
  return {
    id: Number((e == null ? void 0 : e.id) ?? 0),
    path: String((e == null ? void 0 : e.path) ?? ""),
    sha256: String((e == null ? void 0 : e.sha256) ?? ""),
    name: String((e == null ? void 0 : e.name) ?? ""),
    type: String((e == null ? void 0 : e.type) ?? ""),
    size_bytes: Number((e == null ? void 0 : e.size_bytes) ?? 0),
    created_at: Number((e == null ? void 0 : e.created_at) ?? 0),
    meta_json: hu(e == null ? void 0 : e.meta_json),
    tags: Array.isArray(e == null ? void 0 : e.tags) ? e.tags.map(gn) : []
  };
}
function gu(e) {
  return {
    sha256: String((e == null ? void 0 : e.sha256) ?? ""),
    name: String((e == null ? void 0 : e.name) ?? ""),
    images_count: Number((e == null ? void 0 : e.images_count) ?? 0),
    type: String((e == null ? void 0 : e.type) ?? ""),
    path: String((e == null ? void 0 : e.path) ?? ""),
    size_bytes: Number((e == null ? void 0 : e.size_bytes) ?? 0),
    created_at: Number((e == null ? void 0 : e.created_at) ?? 0),
    tags: Array.isArray(e == null ? void 0 : e.tags) ? e.tags.map(gn) : []
  };
}
function mu(e) {
  return {
    id: Number((e == null ? void 0 : e.id) ?? 0),
    name: String((e == null ? void 0 : e.name) ?? ""),
    image: String((e == null ? void 0 : e.image) ?? ""),
    type: String((e == null ? void 0 : e.type) ?? ""),
    tags: Array.isArray(e == null ? void 0 : e.tags) ? e.tags.map(gn) : []
  };
}
const us = "__HIKAZE_API_PORT__", Xs = "__HIKAZE_API_BASE__", vu = "__HIKAZE_EMBEDDED__", yu = (e) => new Promise((t) => setTimeout(t, e));
function Hn(e) {
  return globalThis[e];
}
function Zs(e, t) {
  globalThis[e] = t;
}
function _o() {
  return !!Hn(vu);
}
function _u() {
  typeof Hn(us) != "number" && Zs(us, 0), typeof Hn(Xs) != "string" && Zs(Xs, "");
}
function Ul() {
  const e = Hn(us), t = Number(e ?? 0);
  return Number.isFinite(t) ? t : 0;
}
function bu(e) {
  Zs(us, e);
}
function Cu() {
  const e = Hn(Xs);
  return typeof e == "string" ? e : "";
}
async function Su() {
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
let wn = null;
async function Kl() {
  for (; ; ) {
    const e = await Su();
    if (e > 0)
      return bu(e), e;
    await yu(1e3);
  }
}
function xu() {
  _o() && (wn || (wn = Kl()));
}
async function Tu() {
  if (!_o())
    return 0;
  const e = Ul();
  return e > 0 ? e : (wn || (wn = Kl()), wn);
}
function Ss() {
  const e = Cu();
  if (e)
    return e;
  if (!_o())
    return "";
  const t = Ul();
  return t ? `http://${typeof window < "u" ? window.location.hostname : "127.0.0.1"}:${t}` : "";
}
async function Gl() {
  const e = Ss();
  if (e)
    return e;
  const t = await Tu();
  return t ? `http://${typeof window < "u" ? window.location.hostname : "127.0.0.1"}:${t}` : "";
}
async function ql(e) {
  const t = await Gl();
  return t ? `${t}${e}` : e;
}
async function Ge(e, t) {
  const n = await ql(e);
  return fetch(n, t);
}
async function ku() {
  const e = await Ge("/api/scan");
  if (!e.ok) {
    const t = await e.json().catch(() => ({}));
    throw new Error(t.error || `Failed to scan models: ${e.statusText}`);
  }
  return await e.json();
}
async function Eu() {
  const e = await Ge("/api/models/get_types");
  if (!e.ok)
    throw new Error(`Failed to fetch model types: ${e.statusText}`);
  return ((await e.json()).types || []).map((n) => String(n));
}
async function $u() {
  const e = await Ge("/api/tags");
  if (!e.ok)
    throw new Error(`Failed to fetch tags: ${e.statusText}`);
  return ((await e.json()).tags || []).map(gn);
}
async function Au(e) {
  const t = await Ge("/api/tags_add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newtags: e })
  });
  if (!t.ok)
    throw new Error(`Failed to add tags: ${t.statusText}`);
  return ((await t.json()).tags || []).map(gn);
}
async function Mu(e) {
  const t = await Ge(`/api/models?type=${encodeURIComponent(e)}`);
  if (!t.ok)
    throw new Error(`Failed to fetch models: ${t.statusText}`);
  return ((await t.json()).models || []).map(gu);
}
async function wu(e) {
  const t = await Ge(`/api/models/${e}`);
  if (!t.ok)
    throw new Error(`Failed to fetch model details: ${t.statusText}`);
  const n = await t.json();
  return Wl(n);
}
async function Iu(e, t) {
  const n = await Ge(`/api/models/${e}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(t)
  });
  if (!n.ok)
    throw new Error(`Failed to update model: ${n.statusText}`);
  const s = await n.json();
  return Wl(s);
}
async function Lu(e) {
  const t = await Ge(`/api/images/get_img_count?sha256=${e}`);
  if (!t.ok)
    throw new Error(`Failed to fetch image count: ${t.statusText}`);
  const n = await t.json();
  return Number(n.count ?? 0);
}
async function Ou(e, t) {
  const n = await Ge(`/api/images/delete?sha256=${e}&seq=${t}`, {
    method: "DELETE"
  });
  if (!n.ok)
    throw new Error(`Failed to delete image: ${n.statusText}`);
}
async function Pu() {
  const e = await Ge("/api/migration/pending_models");
  if (!e.ok)
    throw new Error(`Failed to fetch pending models: ${e.statusText}`);
  return ((await e.json()).models || []).map(mu);
}
async function Nu(e) {
  const t = await Ge(`/api/migration/pending_model?id=${encodeURIComponent(e)}`);
  if (!t.ok)
    throw new Error(`Failed to fetch pending model details: ${t.statusText}`);
  const n = await t.json();
  return pu(n);
}
async function gi(e, t) {
  const n = await Ge("/api/migration/import_models", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: e, conflict_strategy: t })
  });
  if (!n.ok)
    throw new Error(`Failed to import models: ${n.statusText}`);
  return await n.json();
}
function cn(e) {
  return typeof e == "string" ? e : e.value;
}
function Fu() {
  const e = ye({}), t = ye({}), n = ye({}), s = ye({}), o = ye({}), i = ye({});
  async function l(v, b = !1) {
    if (v && !(e[v] && !b)) {
      t[v] = !0, n[v] = null;
      try {
        const S = await Mu(v);
        e[v] = S;
      } catch (S) {
        console.error(`Error loading models for type ${v}:`, S), n[v] = (S == null ? void 0 : S.message) || "Failed to load models", e[v] || (e[v] = []);
      } finally {
        t[v] = !1;
      }
    }
  }
  async function r(v, b = !1) {
    if (v && !(s[v] && !b)) {
      o[v] = !0, i[v] = null;
      try {
        const S = await wu(v);
        s[v] = S, c(S);
      } catch (S) {
        console.error(`Error loading model details for ${v}:`, S), i[v] = (S == null ? void 0 : S.message) || "Failed to load model details";
      } finally {
        o[v] = !1;
      }
    }
  }
  function c(v) {
    Object.keys(e).forEach((b) => {
      const S = e[b];
      if (!S || S.length === 0) return;
      const D = S.findIndex((ee) => ee.sha256 === v.sha256);
      if (D === -1) return;
      const j = S[D];
      j && (S[D] = {
        ...j,
        name: v.name,
        tags: v.tags
      });
    });
  }
  function h(v) {
    s[v.sha256] = v, c(v);
  }
  function d(v) {
    return K(() => e[cn(v)] || []);
  }
  function f(v) {
    return K(() => !!t[cn(v)]);
  }
  function m(v) {
    return K(() => n[cn(v)] || null);
  }
  function _(v) {
    return K(() => s[v] || null);
  }
  function E(v) {
    return K(() => !!o[v]);
  }
  function T(v) {
    return K(() => i[v] || null);
  }
  function N() {
    Object.keys(e).forEach((v) => delete e[v]), Object.keys(t).forEach((v) => delete t[v]), Object.keys(n).forEach((v) => delete n[v]), Object.keys(s).forEach((v) => delete s[v]), Object.keys(o).forEach((v) => delete o[v]), Object.keys(i).forEach((v) => delete i[v]);
  }
  function C(v) {
    if (!v) {
      N();
      return;
    }
    delete e[v], delete t[v], delete n[v];
  }
  return {
    loadModels: l,
    loadDetails: r,
    setDetails: h,
    getModels: d,
    isLoading: f,
    getError: m,
    getDetails: _,
    isDetailsLoading: E,
    getDetailsError: T,
    reset: N,
    invalidate: C
  };
}
function Ru() {
  const e = ye({}), t = ye({}), n = ye({}), s = ye({}), o = ye({}), i = ye({});
  async function l(C, v = !1) {
    const b = C || "pending";
    if (!(e[b] && !v)) {
      t[b] = !0, n[b] = null;
      try {
        e[b] = await Pu();
      } catch (S) {
        console.error("Error loading pending models:", S), n[b] = (S == null ? void 0 : S.message) || "Failed to load pending models", e[b] || (e[b] = []);
      } finally {
        t[b] = !1;
      }
    }
  }
  async function r(C, v = !1) {
    const b = String(C || "");
    if (b && !(s[b] && !v)) {
      o[b] = !0, i[b] = null;
      try {
        const S = await Nu(Number(b));
        s[b] = S;
      } catch (S) {
        console.error(`Error loading pending model details for ${b}:`, S), i[b] = (S == null ? void 0 : S.message) || "Failed to load pending model details";
      } finally {
        o[b] = !1;
      }
    }
  }
  function c(C) {
    s[String(C.id)] = C;
  }
  function h(C) {
    const v = cn(C) || "pending";
    return K(() => e[v] || []);
  }
  function d(C) {
    const v = cn(C) || "pending";
    return K(() => !!t[v]);
  }
  function f(C) {
    const v = cn(C) || "pending";
    return K(() => n[v] || null);
  }
  function m(C) {
    return K(() => s[String(C)] || null);
  }
  function _(C) {
    return K(() => !!o[String(C)]);
  }
  function E(C) {
    return K(() => i[String(C)] || null);
  }
  function T() {
    Object.keys(e).forEach((C) => delete e[C]), Object.keys(t).forEach((C) => delete t[C]), Object.keys(n).forEach((C) => delete n[C]), Object.keys(s).forEach((C) => delete s[C]), Object.keys(o).forEach((C) => delete o[C]), Object.keys(i).forEach((C) => delete i[C]);
  }
  function N(C) {
    if (!C) {
      T();
      return;
    }
    delete e[C], delete t[C], delete n[C];
  }
  return {
    loadModels: l,
    getModels: h,
    isLoading: d,
    getError: f,
    reset: T,
    invalidate: N,
    loadDetails: r,
    setDetails: c,
    getDetails: m,
    isDetailsLoading: _,
    getDetailsError: E
  };
}
const Du = Fu(), Hu = Ru();
function Jt(e = "active") {
  return e === "pending" ? Hu : Du;
}
const Ce = ye({
  items: [],
  loading: !1,
  error: null,
  loaded: !1
});
async function ju(e = !1) {
  if (!(Ce.loaded && !e)) {
    Ce.loading = !0, Ce.error = null;
    try {
      const t = await $u();
      Ce.items = [...t], Ce.loaded = !0;
    } catch (t) {
      console.error("Error loading tags:", t), Ce.error = (t == null ? void 0 : t.message) || "Failed to load tags", Ce.items = [], Ce.loaded = !1;
    } finally {
      Ce.loading = !1;
    }
  }
}
function zu(e) {
  if (!e.length) return;
  const t = new Map(Ce.items.map((n) => [n.id, n]));
  e.forEach((n) => {
    t.has(n.id) || t.set(n.id, n);
  }), Ce.items = Array.from(t.values());
}
function Vu() {
  Ce.items = [], Ce.loaded = !1, Ce.error = null, Ce.loading = !1;
}
function Vn() {
  return {
    loadTags: ju,
    mergeTags: zu,
    resetTags: Vu,
    getTags: () => K(() => Ce.items),
    isLoading: () => K(() => Ce.loading),
    getError: () => K(() => Ce.error)
  };
}
const Bu = {
  key: 0,
  class: "hikaze-header"
}, Wu = {
  key: 0,
  class: "tabs-loading"
}, Uu = {
  key: 1,
  class: "tabs-error"
}, Ku = {
  key: 2,
  class: "type-tabs"
}, Gu = ["onClick"], qu = {
  key: 3,
  class: "mode-indicator"
}, Ju = { class: "hikaze-pane-library" }, Yu = { class: "hikaze-pane-details" }, Xu = /* @__PURE__ */ je({
  __name: "HikazeManagerLayout",
  props: {
    embedded: { type: Boolean },
    initialTab: {},
    mode: {}
  },
  emits: ["tab-change"],
  setup(e, { emit: t }) {
    const n = e, s = Jt(), o = Vn(), i = t, l = V(""), r = V([]), c = V(!1), h = V(null), d = V(24), f = V(!1);
    function m(C) {
      l.value = C, i("tab-change", C);
    }
    function _() {
      f.value = !0, document.addEventListener("mousemove", E), document.addEventListener("mouseup", T), document.body.style.cursor = "col-resize", document.body.style.userSelect = "none";
    }
    function E(C) {
      if (!f.value) return;
      const v = window.innerWidth, S = (v - C.clientX) / v * 100;
      S > 10 && S < 80 && (d.value = S);
    }
    function T() {
      f.value = !1, document.removeEventListener("mousemove", E), document.removeEventListener("mouseup", T), document.body.style.cursor = "", document.body.style.userSelect = "";
    }
    pn(() => {
      T();
    }), Ke(l, (C) => {
      C && s.loadModels(C);
    });
    async function N() {
      c.value = !0, h.value = null;
      try {
        const C = await Eu();
        r.value = [...C, "Others"];
        const v = n.initialTab;
        if (v) {
          const b = r.value.find((j) => j === v), S = r.value.find(
            (j) => j.toLowerCase() === v.toLowerCase()
          ), D = b || S;
          if (D) {
            l.value = D, i("tab-change", D);
            return;
          }
        }
        r.value.length > 0 && (l.value = r.value[0] || "", i("tab-change", l.value));
      } catch (C) {
        h.value = C.message || "Failed to load model types";
      } finally {
        c.value = !1;
      }
    }
    return Ot(() => {
      N(), o.loadTags();
    }), (C, v) => ($(), L("div", {
      class: ae(["hikaze-layout", {
        "is-embedded": e.embedded,
        "has-initial-tab": !!e.initialTab,
        "is-pending": e.mode === "pending"
      }]),
      style: Fe({ gridTemplateColumns: `1fr 4px ${d.value}%` })
    }, [
      !e.embedded && !e.initialTab ? ($(), L("header", Bu, [
        c.value ? ($(), L("div", Wu, [...v[0] || (v[0] = [
          g("span", { class: "spinner" }, null, -1),
          it(" Loading types... ", -1)
        ])])) : h.value ? ($(), L("div", Uu, [
          it(Z(h.value) + " ", 1),
          g("button", {
            onClick: N,
            class: "btn-retry"
          }, "Retry")
        ])) : ($(), L("nav", Ku, [
          ($(!0), L(ie, null, be(r.value, (b) => ($(), L("div", {
            key: b,
            class: ae(["tab", { active: l.value === b }]),
            onClick: (S) => m(b)
          }, Z(b), 11, Gu))), 128))
        ])),
        e.mode === "pending" ? ($(), L("div", qu, "Pending Mode")) : ge("", !0)
      ])) : ge("", !0),
      g("main", Ju, [
        Bt(C.$slots, "library", { activeTab: l.value }, () => [
          v[1] || (v[1] = it("Library", -1))
        ])
      ]),
      g("div", {
        class: ae(["layout-splitter", { dragging: f.value }]),
        onMousedown: _
      }, null, 34),
      g("aside", Yu, [
        Bt(C.$slots, "details", {}, () => [
          v[2] || (v[2] = it("Details", -1))
        ])
      ]),
      Bt(C.$slots, "toolbar", { activeTab: l.value }, void 0)
    ], 6));
  }
}), Zu = /* @__PURE__ */ ze(Xu, [["__scopeId", "data-v-e2d6f855"]]), Kt = ye({}), un = ye({}), dn = ye({}), fn = ye({});
function Qu(e) {
  fn[e] = (fn[e] ?? 0) + 1;
}
function ed(e) {
  if (e) {
    delete Kt[e], delete un[e], delete dn[e], delete fn[e];
    return;
  }
  Object.keys(Kt).forEach((t) => delete Kt[t]), Object.keys(un).forEach((t) => delete un[t]), Object.keys(dn).forEach((t) => delete dn[t]), Object.keys(fn).forEach((t) => delete fn[t]);
}
async function td(e, t = !1) {
  if (e && !(Kt[e] != null && !t)) {
    un[e] = !0, dn[e] = null;
    try {
      Kt[e] = await Lu(e);
    } catch (n) {
      console.error(`Error loading image count for ${e}:`, n), dn[e] = (n == null ? void 0 : n.message) || "Failed to load image count", Kt[e] = 0;
    } finally {
      un[e] = !1;
    }
  }
}
function nd(e, t, n = "high") {
  const s = fn[e] ?? 0, o = Ss();
  return `${o ? `${o}` : ""}/api/images/${e}_${t}.webp?quality=${n}&rev=${s}`;
}
function bo() {
  return {
    loadImageCount: td,
    bumpRevision: Qu,
    resetImageCache: ed,
    getImageUrl: nd,
    getImageCount: (e) => K(() => Kt[e] ?? 0),
    isLoading: (e) => K(() => !!un[e]),
    getError: (e) => K(() => dn[e] ?? null)
  };
}
function sd(e, t = { root: null, rootMargin: "0px", threshold: 0.1 }) {
  return new IntersectionObserver((s) => {
    s.forEach((o) => {
      o.isIntersecting && e(o);
    });
  }, t);
}
const od = { class: "model-library" }, id = { class: "library-toolbar" }, ld = { class: "search-box" }, rd = { class: "controls-right" }, ad = {
  key: 0,
  class: "column-control"
}, cd = { class: "view-switch" }, ud = ["disabled"], dd = { class: "tag-filter" }, fd = {
  key: 0,
  class: "tag-dropdown"
}, hd = {
  key: 0,
  class: "placeholder-msg"
}, pd = {
  key: 1,
  class: "tag-list"
}, gd = ["onClick"], md = {
  key: 0,
  class: "library-loading"
}, vd = {
  key: 1,
  class: "library-error"
}, yd = ["onClick", "onMouseenter"], _d = ["checked", "onChange"], bd = ["data-sha256"], Cd = { class: "card-meta" }, Sd = { class: "card-title" }, xd = { class: "card-tags" }, Td = { class: "tooltip-name" }, kd = { class: "tooltip-tags" }, Ed = {
  key: 3,
  class: "list-container"
}, $d = ["onClick"], Ad = ["checked", "onChange"], Md = { class: "list-name" }, wd = { class: "list-tags" }, mi = 7e3, Id = 1500, Ld = /* @__PURE__ */ je({
  __name: "ModelLibrary",
  props: {
    activeTab: {},
    selectionMode: {},
    selectedIds: {},
    excludeSelected: { type: Boolean }
  },
  emits: ["select-model", "toggle-select"],
  setup(e, { emit: t }) {
    const n = e, s = t, o = Jt(), i = Vn(), l = bo(), r = V("card"), c = V(4), h = V(null), d = V("bottom"), f = V(!1), m = V(""), _ = V(/* @__PURE__ */ new Map()), E = K(() => n.selectionMode === "lora"), T = K(() => new Set(n.selectedIds ?? [])), N = o.getModels(K(() => n.activeTab)), C = o.isLoading(K(() => n.activeTab)), v = o.getError(K(() => n.activeTab)), b = ye({}), S = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), ee = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Set();
    let U = null;
    function oe() {
      U && U.disconnect(), U = sd((M) => {
        const u = M.target, a = u.dataset.sha256;
        if (!a) return;
        const p = new Image(), y = l.getImageUrl(a, 0, "medium");
        p.onload = () => {
          u.classList.remove("lazy"), u.classList.add("loaded");
        }, p.onerror = () => {
          u.classList.remove("lazy"), u.classList.add("error");
        }, p.src = y, U == null || U.unobserve(u);
      }), fo(() => {
        document.querySelectorAll(".card-image.lazy").forEach((u) => U == null ? void 0 : U.observe(u));
      });
    }
    const A = (M, u) => {
      const a = ee.get(M);
      if (a) return a;
      const p = Promise.all(
        Array.from({ length: u }, (y, x) => new Promise((k) => {
          const I = new Image();
          I.onload = () => k(), I.onerror = () => k(), I.src = l.getImageUrl(M, x, "medium");
        }))
      ).then(() => {
      });
      return ee.set(M, p), p;
    }, R = (M, u) => {
      const a = b[M];
      if (!a || !a.active || a.next !== null || j.has(M))
        return;
      const p = (a.current + 1) % u;
      a.next = p;
      const y = window.setTimeout(() => {
        const x = b[M];
        if (!x || !x.active) {
          j.delete(M);
          return;
        }
        x.current = p, x.next = null, j.delete(M);
      }, Id);
      j.set(M, y);
    }, H = async (M) => {
      if (!(S.has(M) || D.has(M) || z.has(M))) {
        z.add(M), b[M] ? (b[M].active = !0, b[M].next = null) : b[M] = { current: 0, next: null, active: !0 };
        try {
          await l.loadImageCount(M);
          const u = l.getImageCount(M).value, a = b[M];
          if (!a || !a.active || u <= 1) return;
          await A(M, u);
          const p = J.get(M) ?? Math.floor(0.5 * Math.random() * mi);
          J.set(M, p);
          const y = window.setTimeout(() => {
            const x = window.setInterval(() => {
              R(M, u);
            }, mi);
            S.set(M, x), D.delete(M);
          }, p);
          D.set(M, y);
        } finally {
          z.delete(M);
        }
      }
    }, Q = (M) => {
      const u = S.get(M);
      u && (clearInterval(u), S.delete(M));
      const a = D.get(M);
      a && (clearTimeout(a), D.delete(M));
      const p = j.get(M);
      p && (clearTimeout(p), j.delete(M)), J.delete(M), z.delete(M), b[M] && (b[M].current = 0, b[M].next = null, b[M].active = !1);
    }, X = (M) => {
      const u = b[M], a = u ? u.current : 0;
      return {
        backgroundImage: `url(${l.getImageUrl(M, a, "medium")})`
      };
    }, ne = (M) => {
      const u = b[M], a = u == null ? void 0 : u.next, p = typeof a == "number";
      return {
        backgroundImage: p ? `url(${l.getImageUrl(M, a, "medium")})` : "none",
        opacity: p ? "1" : "0"
      };
    }, se = (M, u) => {
      h.value = u;
      const p = M.currentTarget.getBoundingClientRect(), y = window.innerHeight - p.bottom;
      d.value = y < 250 ? "top" : "bottom";
    }, xe = () => {
      h.value = null;
    }, at = (M, u) => {
      s("toggle-select", M, u);
    }, Ve = (M) => {
      s("select-model", M), E.value && M.sha256 && !T.value.has(M.sha256) && at(M, !0);
    }, Ae = (M, u) => {
      const a = u.target;
      M.sha256 && at(M, a.checked);
    }, Tt = i.getTags();
    Ot(async () => {
      r.value === "card" && oe();
      try {
        await i.loadTags();
        const M = Tt.value.find((u) => u.name.toLowerCase() === "nsfw");
        M && _.value.set(M.id, "exclude");
      } catch (M) {
        console.error("Failed to load tags for auto-exclude:", M);
      }
    }), pn(() => {
      U && U.disconnect(), S.forEach((M) => clearInterval(M)), S.clear(), D.forEach((M) => clearTimeout(M)), D.clear(), j.forEach((M) => clearTimeout(M)), j.clear(), ee.clear(), J.clear(), z.clear();
    });
    const ct = K(() => {
      let M = N.value;
      if (m.value.trim()) {
        const u = m.value.toLowerCase();
        M = M.filter(
          (a) => a.name.toLowerCase().includes(u) || a.path.toLowerCase().includes(u)
        );
      }
      if (_.value.size > 0) {
        const u = Array.from(_.value.entries()).filter(([p, y]) => y === "include").map(([p]) => p), a = Array.from(_.value.entries()).filter(([p, y]) => y === "exclude").map(([p]) => p);
        M = M.filter((p) => {
          const y = new Set(p.tags.map((I) => I.id)), x = u.every((I) => y.has(I)), k = !a.some((I) => y.has(I));
          return x && k;
        });
      }
      return n.excludeSelected && T.value.size > 0 && (M = M.filter((u) => !T.value.has(u.sha256))), M;
    }), Xt = K(() => {
      const M = /* @__PURE__ */ new Map();
      ct.value.forEach((y) => {
        y.tags.forEach((x) => {
          M.set(x.id, (M.get(x.id) ?? 0) + 1);
        });
      });
      const u = new Map(Tt.value.map((y) => [y.id, y])), a = [];
      _.value.forEach((y, x) => {
        const k = u.get(x);
        k && a.push(k);
      });
      const p = Tt.value.filter((y) => !_.value.has(y.id) && (M.get(y.id) ?? 0) > 0).sort((y, x) => y.name.localeCompare(x.name));
      return [...a, ...p];
    });
    Ke([ct, r], () => {
      if (r.value === "card") {
        oe();
        const M = new Set(ct.value.map((u) => u.sha256));
        M.forEach((u) => {
          u && H(u);
        }), S.forEach((u, a) => {
          M.has(a) || Q(a);
        }), D.forEach((u, a) => {
          M.has(a) || Q(a);
        });
      } else
        S.forEach((M, u) => Q(u));
    }, { deep: !0 });
    function ut(M) {
      const u = _.value.get(M);
      u === "include" ? _.value.set(M, "exclude") : u === "exclude" ? _.value.delete(M) : _.value.set(M, "include");
    }
    function kt() {
      _.value.clear();
    }
    function Pt() {
      o.reset(), l.resetImageCache(), o.loadModels(n.activeTab, !0);
    }
    const Nt = (M) => {
      r.value = M;
    }, dt = K(() => r.value !== "card" ? {} : {
      gridTemplateColumns: `repeat(${c.value}, 1fr)`
    });
    return (M, u) => ($(), L("div", od, [
      g("div", id, [
        g("div", ld, [
          We(g("input", {
            type: "text",
            "onUpdate:modelValue": u[0] || (u[0] = (a) => m.value = a),
            placeholder: "Search models..."
          }, null, 512), [
            [ot, m.value]
          ])
        ]),
        g("div", rd, [
          r.value === "card" ? ($(), L("div", ad, [
            u[9] || (u[9] = g("label", { for: "col-count" }, "Cols:", -1)),
            We(g("input", {
              id: "col-count",
              type: "number",
              "onUpdate:modelValue": u[1] || (u[1] = (a) => c.value = a),
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
          ])) : ge("", !0),
          g("div", cd, [
            g("button", {
              class: ae({ active: r.value === "card" }),
              onClick: u[2] || (u[2] = (a) => Nt("card"))
            }, "Card", 2),
            g("button", {
              class: ae({ active: r.value === "list" }),
              onClick: u[3] || (u[3] = (a) => Nt("list"))
            }, "List", 2)
          ]),
          g("button", {
            class: "btn-refresh",
            onClick: Pt,
            disabled: qe(C),
            title: "Refresh model library"
          }, " Refresh ", 8, ud),
          g("div", dd, [
            g("button", {
              class: ae(["btn-filter", { active: _.value.size > 0 }]),
              onClick: u[4] || (u[4] = (a) => f.value = !f.value)
            }, " Tags Filter " + Z(_.value.size > 0 ? `(${_.value.size})` : ""), 3),
            f.value ? ($(), L("div", fd, [
              Xt.value.length === 0 ? ($(), L("div", hd, "No tags available")) : ($(), L("div", pd, [
                ($(!0), L(ie, null, be(Xt.value, (a) => ($(), L("div", {
                  key: a.id,
                  class: ae(["tag-item", _.value.get(a.id)]),
                  onClick: (p) => ut(a.id)
                }, Z(a.name), 11, gd))), 128)),
                g("div", { class: "tag-dropdown-actions" }, [
                  g("button", {
                    onClick: kt,
                    class: "btn-clear"
                  }, "Clear All")
                ])
              ]))
            ])) : ge("", !0)
          ])
        ])
      ]),
      g("div", {
        class: ae(["library-content", r.value]),
        style: Fe(dt.value)
      }, [
        qe(C) ? ($(), L("div", md, [...u[10] || (u[10] = [
          g("span", { class: "spinner" }, null, -1),
          it(" Loading models... ", -1)
        ])])) : qe(v) ? ($(), L("div", vd, Z(qe(v)), 1)) : r.value === "card" ? ($(!0), L(ie, { key: 2 }, be(ct.value, (a) => ($(), L("div", {
          key: a.sha256,
          class: ae(["card-item", { "dense-view": c.value > 6 }]),
          onClick: (p) => Ve(a),
          onMouseenter: (p) => se(p, a.sha256),
          onMouseleave: xe
        }, [
          E.value ? ($(), L("label", {
            key: 0,
            class: "selection-checkbox",
            onClick: u[6] || (u[6] = me(() => {
            }, ["stop"]))
          }, [
            g("input", {
              type: "checkbox",
              checked: T.value.has(a.sha256),
              onClick: u[5] || (u[5] = me(() => {
              }, ["stop"])),
              onChange: (p) => Ae(a, p)
            }, null, 40, _d)
          ])) : ge("", !0),
          g("div", {
            class: "card-image lazy",
            "data-sha256": a.sha256
          }, [
            g("div", {
              class: "card-image-layer base",
              style: Fe(X(a.sha256))
            }, null, 4),
            g("div", {
              class: "card-image-layer next",
              style: Fe(ne(a.sha256))
            }, null, 4)
          ], 8, bd),
          g("div", Cd, [
            g("div", Sd, Z(a.name), 1),
            g("div", xd, [
              ($(!0), L(ie, null, be(a.tags, (p) => ($(), L("span", {
                key: p.id,
                class: "tag"
              }, Z(p.name), 1))), 128))
            ])
          ]),
          h.value === a.sha256 ? ($(), L("div", {
            key: 1,
            class: ae(["card-tooltip", d.value])
          }, [
            g("div", Td, Z(a.name), 1),
            g("div", kd, [
              ($(!0), L(ie, null, be(a.tags, (p) => ($(), L("span", {
                key: p.id,
                class: "tag"
              }, Z(p.name), 1))), 128))
            ])
          ], 2)) : ge("", !0)
        ], 42, yd))), 128)) : ($(), L("div", Ed, [
          ($(!0), L(ie, null, be(ct.value, (a) => ($(), L("div", {
            key: a.sha256,
            class: "list-item",
            onClick: (p) => Ve(a)
          }, [
            E.value ? ($(), L("label", {
              key: 0,
              class: "list-checkbox",
              onClick: u[8] || (u[8] = me(() => {
              }, ["stop"]))
            }, [
              g("input", {
                type: "checkbox",
                checked: T.value.has(a.sha256),
                onClick: u[7] || (u[7] = me(() => {
                }, ["stop"])),
                onChange: (p) => Ae(a, p)
              }, null, 40, Ad)
            ])) : ge("", !0),
            g("div", Md, Z(a.name), 1),
            g("div", wd, [
              ($(!0), L(ie, null, be(a.tags, (p) => ($(), L("span", {
                key: p.id,
                class: "tag"
              }, Z(p.name), 1))), 128))
            ])
          ], 8, $d))), 128))
        ]))
      ], 6)
    ]));
  }
}), Od = /* @__PURE__ */ ze(Ld, [["__scopeId", "data-v-d1d01f45"]]), Pd = { class: "main-display" }, Nd = {
  key: 0,
  class: "loader"
}, Fd = ["src"], Rd = { class: "nav-controls" }, Dd = { class: "action-overlay" }, Hd = {
  key: 2,
  class: "no-images"
}, jd = {
  key: 0,
  class: "pagination"
}, zd = ["onClick"], Vd = /* @__PURE__ */ je({
  __name: "HikazeImageGallery",
  props: {
    sha256: {}
  },
  emits: ["update"],
  setup(e, { emit: t }) {
    const n = e, s = t, o = bo(), i = V(0), l = V(0), r = V(!1), c = V(!1), h = V(null), d = async (C = !1) => {
      if (n.sha256) {
        r.value = !0;
        try {
          await o.loadImageCount(n.sha256, C), i.value = o.getImageCount(n.sha256).value, l.value >= i.value && i.value > 0 ? l.value = i.value - 1 : i.value === 0 && (l.value = 0);
        } catch (v) {
          console.error("Failed to load image count:", v);
        } finally {
          r.value = !1;
        }
      }
    };
    Ke(() => n.sha256, () => {
      l.value = 0, d();
    }, { immediate: !0 });
    const f = () => {
      i.value > 0 && (l.value = (l.value + 1) % i.value);
    }, m = () => {
      i.value > 0 && (l.value = (l.value - 1 + i.value) % i.value);
    }, _ = async () => {
      if (i.value !== 0 && confirm("Are you sure you want to delete this image?"))
        try {
          await Ou(n.sha256, l.value), o.bumpRevision(n.sha256), await d(!0), s("update");
        } catch {
          alert("Failed to delete image");
        }
    }, E = () => {
      var C;
      (C = h.value) == null || C.click();
    }, T = async (C) => {
      var D;
      const v = C.target;
      if (!((D = v.files) != null && D.length)) return;
      const b = v.files[0];
      if (!b) return;
      const S = new FormData();
      S.append("image", b), S.append("sha256", n.sha256);
      try {
        const j = await ql("/api/images/upload"), ee = await fetch(j, {
          method: "POST",
          body: S
        });
        if (ee.ok)
          o.bumpRevision(n.sha256), await d(!0), l.value = i.value - 1, s("update");
        else {
          const J = await ee.json();
          alert(`Upload failed: ${J.error || ee.statusText}`);
        }
      } catch {
        alert("Upload error");
      } finally {
        v.value = "";
      }
    }, N = (C) => o.getImageUrl(n.sha256, C, "high");
    return (C, v) => ($(), L("div", {
      class: "image-gallery",
      onMouseenter: v[0] || (v[0] = (b) => c.value = !0),
      onMouseleave: v[1] || (v[1] = (b) => c.value = !1)
    }, [
      g("div", Pd, [
        r.value ? ($(), L("div", Nd, "Loading...")) : i.value > 0 ? ($(), L(ie, { key: 1 }, [
          g("img", {
            src: N(l.value),
            class: "gallery-img"
          }, null, 8, Fd),
          _e(Ys, { name: "fade" }, {
            default: rt(() => [
              We(g("div", Rd, [
                g("button", {
                  class: "nav-btn prev",
                  onClick: me(m, ["stop"])
                }, "❮"),
                g("button", {
                  class: "nav-btn next",
                  onClick: me(f, ["stop"])
                }, "❯")
              ], 512), [
                [Xo, c.value && i.value > 1]
              ])
            ]),
            _: 1
          }),
          _e(Ys, { name: "fade" }, {
            default: rt(() => [
              We(g("div", Dd, [
                g("button", {
                  class: "action-btn upload",
                  onClick: me(E, ["stop"]),
                  title: "Add Image"
                }, "➕"),
                g("button", {
                  class: "action-btn delete",
                  onClick: me(_, ["stop"]),
                  title: "Delete Current Image"
                }, "🗑️")
              ], 512), [
                [Xo, c.value]
              ])
            ]),
            _: 1
          })
        ], 64)) : ($(), L("div", Hd, [
          v[2] || (v[2] = g("div", { class: "placeholder" }, "No Images", -1)),
          g("button", {
            class: "btn-upload-init",
            onClick: E
          }, "Upload Image")
        ]))
      ]),
      i.value > 1 ? ($(), L("div", jd, [
        ($(!0), L(ie, null, be(i.value, (b) => ($(), L("div", {
          key: b - 1,
          class: ae(["dot", { active: l.value === b - 1 }]),
          onClick: (S) => l.value = b - 1
        }, null, 10, zd))), 128))
      ])) : ge("", !0),
      g("input", {
        type: "file",
        ref_key: "fileInput",
        ref: h,
        style: { display: "none" },
        accept: "image/*",
        onChange: T
      }, null, 544)
    ], 32));
  }
}), Bd = /* @__PURE__ */ ze(Vd, [["__scopeId", "data-v-14bb3169"]]), Wd = { class: "chips-wrapper" }, Ud = ["onClick"], Kd = {
  key: 0,
  class: "suggestions-list"
}, Gd = ["onMousedown"], qd = /* @__PURE__ */ je({
  __name: "HikazeTagInput",
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, s = t, o = Vn(), i = o.getTags(), l = V(""), r = V(!1), c = V(!1);
    Ot(() => {
      o.loadTags();
    });
    const h = K(() => {
      const T = l.value.toLowerCase().trim();
      return T ? i.value.filter((N) => N.name.toLowerCase().includes(T) && !n.modelValue.find((C) => C.id === N.id)).slice(0, 10) : [];
    }), d = (T) => {
      const N = [...n.modelValue];
      N.splice(T, 1), s("update:modelValue", N);
    }, f = (T) => {
      n.modelValue.find((N) => N.id === T.id) || s("update:modelValue", [...n.modelValue, T]), l.value = "", c.value = !1;
    }, m = (T) => {
      if (T.key === "Enter" || T.key === ",") {
        T.preventDefault();
        const N = l.value.trim().replace(/,$/, "");
        if (!N) return;
        const C = i.value.find((v) => v.name.toLowerCase() === N.toLowerCase());
        C ? f(C) : (n.modelValue.find((v) => v.name.toLowerCase() === N.toLowerCase()) || s("update:modelValue", [...n.modelValue, { id: -1, name: N }]), l.value = ""), c.value = !1;
      } else T.key === "Backspace" && !l.value && n.modelValue.length > 0 && d(n.modelValue.length - 1);
    }, _ = () => {
      c.value = !0;
    }, E = () => {
      setTimeout(() => {
        r.value = !1, c.value = !1;
      }, 200);
    };
    return (T, N) => ($(), L("div", {
      class: ae(["tag-input-container", { focused: r.value }])
    }, [
      g("div", Wd, [
        ($(!0), L(ie, null, be(e.modelValue, (C, v) => ($(), L("div", {
          key: C.id === -1 ? C.name : C.id,
          class: ae(["tag-chip", { new: C.id === -1 }])
        }, [
          it(Z(C.name) + " ", 1),
          g("button", {
            class: "remove-btn",
            onClick: (b) => d(v)
          }, "×", 8, Ud)
        ], 2))), 128)),
        We(g("input", {
          type: "text",
          "onUpdate:modelValue": N[0] || (N[0] = (C) => l.value = C),
          onKeydown: m,
          onInput: _,
          onFocus: N[1] || (N[1] = (C) => r.value = !0),
          onBlur: E,
          placeholder: "Add tags...",
          class: "input-field"
        }, null, 544), [
          [ot, l.value]
        ])
      ]),
      _e(Ys, { name: "slide-fade" }, {
        default: rt(() => [
          c.value && h.value.length > 0 ? ($(), L("div", Kd, [
            ($(!0), L(ie, null, be(h.value, (C) => ($(), L("div", {
              key: C.id,
              class: "suggestion-item",
              onMousedown: (v) => f(C)
            }, Z(C.name), 41, Gd))), 128))
          ])) : ge("", !0)
        ]),
        _: 1
      })
    ], 2));
  }
}), Jd = /* @__PURE__ */ ze(qd, [["__scopeId", "data-v-16ad3138"]]), Yd = {
  key: 0,
  class: "model-details"
}, Xd = { class: "gallery-wrapper" }, Zd = { class: "details-body" }, Qd = { class: "field-group" }, ef = { class: "field-group" }, tf = ["title"], nf = { class: "field-group" }, sf = ["value"], of = { class: "field-group" }, lf = { class: "readonly-box" }, rf = { class: "field-group" }, af = { class: "field-group" }, cf = { class: "field-group" }, uf = { class: "link-group" }, df = { class: "field-group" }, ff = { class: "field-group" }, hf = { class: "actions" }, pf = ["disabled"], gf = ["disabled"], mf = {
  key: 1,
  class: "empty-details"
}, vf = {
  key: 0,
  class: "loading-state"
}, yf = { key: 1 }, _f = /* @__PURE__ */ je({
  __name: "ModelDetails",
  props: {
    model: {}
  },
  emits: ["update-list"],
  setup(e, { emit: t }) {
    const n = e, s = t, o = Jt(), i = Vn(), l = V(null), r = V(!1), c = V(!1), h = V(null), d = V(""), f = V(""), m = V(""), _ = V(""), E = async (v, b = !1) => {
      r.value = !0;
      try {
        await o.loadDetails(v, b);
        const S = o.getDetails(v).value;
        if (l.value = S ? JSON.parse(JSON.stringify(S)) : null, l.value) {
          d.value = l.value.meta_json.description, f.value = l.value.meta_json.community_links, m.value = l.value.meta_json.prompts.positive, _.value = l.value.meta_json.prompts.negative, await fo();
          const D = h.value;
          if (D) {
            const j = D.getBoundingClientRect().width;
            j > 0 && (D.style.height = `${Math.round(j * 1.5)}px`);
          }
        }
      } catch (S) {
        console.error("Failed to load model details", S);
      } finally {
        r.value = !1;
      }
    };
    Ke(() => n.model, (v) => {
      v != null && v.sha256 ? E(v.sha256) : l.value = null;
    }, { immediate: !0 });
    const T = async () => {
      if (!(!l.value || !l.value.sha256)) {
        c.value = !0;
        try {
          const v = l.value.sha256, b = l.value.tags, S = b.filter((J) => J.id === -1).map((J) => J.name);
          let j = [...b.filter((J) => J.id !== -1)];
          if (S.length > 0) {
            const J = await Au(S);
            j = [...j, ...J], i.mergeTags(J);
          }
          l.value.tags = j, l.value.meta_json.description = d.value, l.value.meta_json.community_links = f.value, l.value.meta_json.prompts = {
            positive: m.value,
            negative: _.value
          };
          const ee = await Iu(v, l.value);
          o.setDetails(ee), l.value = JSON.parse(JSON.stringify(ee)), s("update-list"), alert("Saved successfully!");
        } catch (v) {
          alert(`Save failed: ${v}`);
        } finally {
          c.value = !1;
        }
      }
    }, N = () => {
      var v;
      (v = n.model) != null && v.sha256 && E(n.model.sha256, !0);
    }, C = () => {
      f.value && window.open(f.value, "_blank");
    };
    return (v, b) => l.value ? ($(), L("div", Yd, [
      g("div", Xd, [
        _e(Bd, {
          sha256: l.value.sha256,
          onUpdate: b[0] || (b[0] = (S) => s("update-list"))
        }, null, 8, ["sha256"])
      ]),
      g("div", Zd, [
        g("div", Qd, [
          b[7] || (b[7] = g("label", null, "Display Name", -1)),
          We(g("input", {
            type: "text",
            "onUpdate:modelValue": b[1] || (b[1] = (S) => l.value.name = S),
            placeholder: "Database alias..."
          }, null, 512), [
            [ot, l.value.name]
          ])
        ]),
        g("div", ef, [
          b[8] || (b[8] = g("label", null, "Physical Path", -1)),
          g("div", {
            class: "readonly-box",
            title: l.value.path
          }, Z(l.value.path), 9, tf)
        ]),
        g("div", nf, [
          b[9] || (b[9] = g("label", null, "SHA256 Hash", -1)),
          g("input", {
            type: "text",
            value: l.value.sha256,
            disabled: "",
            class: "hash-input"
          }, null, 8, sf)
        ]),
        g("div", of, [
          b[10] || (b[10] = g("label", null, "Model Type", -1)),
          g("div", lf, Z(l.value.type), 1)
        ]),
        g("div", rf, [
          b[11] || (b[11] = g("label", null, "Tags", -1)),
          _e(Jd, {
            modelValue: l.value.tags,
            "onUpdate:modelValue": b[2] || (b[2] = (S) => l.value.tags = S)
          }, null, 8, ["modelValue"])
        ]),
        g("div", af, [
          b[12] || (b[12] = g("label", null, "Description", -1)),
          We(g("textarea", {
            "onUpdate:modelValue": b[3] || (b[3] = (S) => d.value = S),
            placeholder: "Model description...",
            rows: "3",
            class: "resize-vertical",
            ref_key: "descriptionRef",
            ref: h
          }, null, 512), [
            [ot, d.value]
          ])
        ]),
        g("div", cf, [
          b[13] || (b[13] = g("label", null, "Community Links", -1)),
          g("div", uf, [
            We(g("input", {
              type: "text",
              "onUpdate:modelValue": b[4] || (b[4] = (S) => f.value = S),
              placeholder: "Link to Civitai, HuggingFace, etc...",
              class: "link-input"
            }, null, 512), [
              [ot, f.value]
            ]),
            g("button", {
              class: "btn-visit",
              onClick: C,
              title: "Visit Link"
            }, "🔗")
          ])
        ]),
        g("div", df, [
          b[14] || (b[14] = g("label", null, "Positive Prompt", -1)),
          We(g("textarea", {
            "onUpdate:modelValue": b[5] || (b[5] = (S) => m.value = S),
            placeholder: "Recommended positive prompt...",
            rows: "3",
            class: "resize-vertical"
          }, null, 512), [
            [ot, m.value]
          ])
        ]),
        g("div", ff, [
          b[15] || (b[15] = g("label", null, "Negative Prompt", -1)),
          We(g("textarea", {
            "onUpdate:modelValue": b[6] || (b[6] = (S) => _.value = S),
            placeholder: "Recommended negative prompt...",
            rows: "3",
            class: "resize-vertical"
          }, null, 512), [
            [ot, _.value]
          ])
        ]),
        g("div", hf, [
          g("button", {
            class: "btn primary",
            onClick: T,
            disabled: c.value
          }, Z(c.value ? "Saving..." : "Save Changes"), 9, pf),
          g("button", {
            class: "btn secondary",
            onClick: N,
            disabled: c.value
          }, "Revert", 8, gf)
        ])
      ])
    ])) : ($(), L("div", mf, [
      r.value ? ($(), L("div", vf, "Loading details...")) : ($(), L("div", yf, [...b[16] || (b[16] = [
        g("div", { class: "placeholder-icon" }, "📭", -1),
        g("p", null, "Select a model from the library to view and edit details.", -1)
      ])]))
    ]));
  }
}), bf = /* @__PURE__ */ ze(_f, [["__scopeId", "data-v-0c0efeb5"]]), Cf = { class: "selected-lora-bar" }, Sf = {
  key: 0,
  class: "selected-lora-empty"
}, xf = ["onClick"], Tf = ["onChange"], kf = { class: "selected-lora-meta" }, Ef = ["title"], $f = {
  key: 0,
  class: "selected-lora-tags"
}, Af = /* @__PURE__ */ je({
  __name: "SelectedLoraBar",
  props: {
    items: {}
  },
  emits: ["toggle", "select"],
  setup(e, { emit: t }) {
    const n = e, s = t, o = bo(), i = (c, h) => {
      const d = h.target;
      s("toggle", c, d.checked);
    }, l = (c) => {
      s("select", c);
    }, r = (c) => c ? {
      backgroundImage: `url(${o.getImageUrl(c, 0, "medium")})`
    } : {};
    return (c, h) => ($(), L("div", Cf, [
      g("div", {
        class: ae(["selected-lora-row", { empty: n.items.length === 0 }])
      }, [
        n.items.length === 0 ? ($(), L("div", Sf, " No LoRAs selected. ")) : ($(!0), L(ie, { key: 1 }, be(n.items, (d) => ($(), L("div", {
          key: d.sha256,
          class: "selected-lora-card",
          onClick: (f) => l(d)
        }, [
          g("label", {
            class: "selection-checkbox",
            onClick: h[1] || (h[1] = me(() => {
            }, ["stop"]))
          }, [
            g("input", {
              type: "checkbox",
              checked: "",
              onClick: h[0] || (h[0] = me(() => {
              }, ["stop"])),
              onChange: (f) => i(d.sha256, f)
            }, null, 40, Tf)
          ]),
          g("div", {
            class: "selected-lora-image",
            style: Fe(r(d.sha256))
          }, null, 4),
          g("div", kf, [
            g("div", {
              class: "selected-lora-name",
              title: d.name || d.path
            }, Z(d.name || d.path), 9, Ef),
            d.tags.length > 0 ? ($(), L("div", $f, [
              ($(!0), L(ie, null, be(d.tags, (f) => ($(), L("span", {
                key: f.id,
                class: "tag"
              }, Z(f.name), 1))), 128))
            ])) : ge("", !0)
          ])
        ], 8, xf))), 128))
      ], 2)
    ]));
  }
}), Mf = /* @__PURE__ */ ze(Af, [["__scopeId", "data-v-a1906adb"]]), wf = { class: "pending-library" }, If = { class: "library-toolbar" }, Lf = { class: "search-box" }, Of = { class: "controls-right" }, Pf = {
  key: 0,
  class: "column-control"
}, Nf = { class: "view-switch" }, Ff = ["disabled"], Rf = { class: "tag-filter" }, Df = {
  key: 0,
  class: "tag-dropdown"
}, Hf = {
  key: 0,
  class: "placeholder-msg"
}, jf = {
  key: 1,
  class: "tag-list"
}, zf = ["onClick"], Vf = {
  key: 0,
  class: "library-loading"
}, Bf = {
  key: 1,
  class: "library-error"
}, Wf = ["onClick"], Uf = ["checked", "onChange"], Kf = { class: "card-meta" }, Gf = { class: "card-title" }, qf = { class: "card-tags" }, Jf = {
  key: 3,
  class: "list-container"
}, Yf = ["onClick"], Xf = ["checked", "onChange"], Zf = { class: "list-name" }, Qf = { class: "list-tags" }, eh = /* @__PURE__ */ je({
  __name: "PendingModelLibrary",
  props: {
    activeTab: {},
    selectedIds: {},
    excludeSelected: { type: Boolean }
  },
  emits: ["select-model", "toggle-select"],
  setup(e, { emit: t }) {
    const n = e, s = t, o = Jt("pending"), i = Vn(), l = V("card"), r = V(4), c = V(!1), h = V(""), d = V(/* @__PURE__ */ new Map()), f = K(() => new Set(n.selectedIds ?? [])), m = o.getModels("pending"), _ = o.isLoading("pending"), E = o.getError("pending"), T = (A) => n.activeTab ? n.activeTab === "Others" ? !A.type : A.type === n.activeTab : !0, N = K(() => {
      let A = m.value;
      if (A = A.filter(T), h.value.trim()) {
        const R = h.value.toLowerCase();
        A = A.filter(
          (H) => H.name.toLowerCase().includes(R) || H.type.toLowerCase().includes(R)
        );
      }
      if (d.value.size > 0) {
        const R = Array.from(d.value.entries()).filter(([Q, X]) => X === "include").map(([Q]) => Q), H = Array.from(d.value.entries()).filter(([Q, X]) => X === "exclude").map(([Q]) => Q);
        A = A.filter((Q) => {
          const X = new Set(Q.tags.map((xe) => xe.id)), ne = R.every((xe) => X.has(xe)), se = !H.some((xe) => X.has(xe));
          return ne && se;
        });
      }
      return n.excludeSelected && f.value.size > 0 && (A = A.filter((R) => !f.value.has(R.id))), A;
    }), C = i.getTags(), v = K(() => {
      const A = /* @__PURE__ */ new Map();
      N.value.forEach((X) => {
        X.tags.forEach((ne) => {
          A.set(ne.id, (A.get(ne.id) ?? 0) + 1);
        });
      });
      const R = new Map(C.value.map((X) => [X.id, X])), H = [];
      d.value.forEach((X, ne) => {
        const se = R.get(ne);
        se && H.push(se);
      });
      const Q = C.value.filter((X) => !d.value.has(X.id) && (A.get(X.id) ?? 0) > 0).sort((X, ne) => X.name.localeCompare(ne.name));
      return [...H, ...Q];
    }), b = (A) => {
      if (!A) return "";
      const H = A.replace(/\\/g, "/").split("/");
      return H[H.length - 1] || "";
    }, S = (A) => {
      const R = b(A);
      if (!R) return "";
      const H = Ss();
      return `${H ? `${H}` : ""}/api/images/pending/${encodeURIComponent(R)}`;
    }, D = () => {
      o.invalidate("pending"), o.loadModels("pending", !0);
    }, j = (A, R) => {
      const H = R.target;
      s("toggle-select", A, H.checked);
    }, ee = (A) => {
      s("select-model", A), f.value.has(A.id) || s("toggle-select", A, !0);
    };
    function J(A) {
      const R = d.value.get(A);
      R === "include" ? d.value.set(A, "exclude") : R === "exclude" ? d.value.delete(A) : d.value.set(A, "include");
    }
    function z() {
      d.value.clear();
    }
    const U = (A) => {
      l.value = A;
    }, oe = K(() => l.value !== "card" ? {} : {
      gridTemplateColumns: `repeat(${r.value}, 1fr)`
    });
    return Ot(async () => {
      o.loadModels("pending");
      try {
        await i.loadTags();
        const A = C.value.find((R) => R.name.toLowerCase() === "nsfw");
        A && d.value.set(A.id, "exclude");
      } catch (A) {
        console.error("Failed to load tags for auto-exclude:", A);
      }
    }), (A, R) => ($(), L("div", wf, [
      g("div", If, [
        g("div", Lf, [
          We(g("input", {
            type: "text",
            "onUpdate:modelValue": R[0] || (R[0] = (H) => h.value = H),
            placeholder: "Search pending models..."
          }, null, 512), [
            [ot, h.value]
          ])
        ]),
        g("div", Of, [
          l.value === "card" ? ($(), L("div", Pf, [
            R[9] || (R[9] = g("label", { for: "pending-col-count" }, "Cols:", -1)),
            We(g("input", {
              id: "pending-col-count",
              type: "number",
              "onUpdate:modelValue": R[1] || (R[1] = (H) => r.value = H),
              min: "2",
              max: "10",
              step: "1"
            }, null, 512), [
              [
                ot,
                r.value,
                void 0,
                { number: !0 }
              ]
            ])
          ])) : ge("", !0),
          g("div", Nf, [
            g("button", {
              class: ae({ active: l.value === "card" }),
              onClick: R[2] || (R[2] = (H) => U("card"))
            }, "Card", 2),
            g("button", {
              class: ae({ active: l.value === "list" }),
              onClick: R[3] || (R[3] = (H) => U("list"))
            }, "List", 2)
          ]),
          g("button", {
            class: "btn-refresh",
            onClick: D,
            disabled: qe(_),
            title: "Refresh pending models"
          }, " Refresh ", 8, Ff),
          g("div", Rf, [
            g("button", {
              class: ae(["btn-filter", { active: d.value.size > 0 }]),
              onClick: R[4] || (R[4] = (H) => c.value = !c.value)
            }, " Tags Filter " + Z(d.value.size > 0 ? `(${d.value.size})` : ""), 3),
            c.value ? ($(), L("div", Df, [
              v.value.length === 0 ? ($(), L("div", Hf, "No tags available")) : ($(), L("div", jf, [
                ($(!0), L(ie, null, be(v.value, (H) => ($(), L("div", {
                  key: H.id,
                  class: ae(["tag-item", d.value.get(H.id)]),
                  onClick: (Q) => J(H.id)
                }, Z(H.name), 11, zf))), 128)),
                g("div", { class: "tag-dropdown-actions" }, [
                  g("button", {
                    onClick: z,
                    class: "btn-clear"
                  }, "Clear All")
                ])
              ]))
            ])) : ge("", !0)
          ])
        ])
      ]),
      g("div", {
        class: ae(["library-content", l.value]),
        style: Fe(oe.value)
      }, [
        qe(_) ? ($(), L("div", Vf, [...R[10] || (R[10] = [
          g("span", { class: "spinner" }, null, -1),
          it(" Loading pending models... ", -1)
        ])])) : qe(E) ? ($(), L("div", Bf, Z(qe(E)), 1)) : l.value === "card" ? ($(!0), L(ie, { key: 2 }, be(N.value, (H) => ($(), L("div", {
          key: H.id,
          class: ae(["card-item", { selected: f.value.has(H.id) }]),
          onClick: (Q) => ee(H)
        }, [
          g("label", {
            class: "selection-checkbox",
            onClick: R[6] || (R[6] = me(() => {
            }, ["stop"]))
          }, [
            g("input", {
              type: "checkbox",
              checked: f.value.has(H.id),
              onClick: R[5] || (R[5] = me(() => {
              }, ["stop"])),
              onChange: (Q) => j(H, Q)
            }, null, 40, Uf)
          ]),
          g("div", {
            class: ae(["card-image", { empty: !H.image }]),
            style: Fe(H.image ? { backgroundImage: `url(${S(H.image)})` } : {})
          }, null, 6),
          g("div", Kf, [
            g("div", Gf, Z(H.name), 1),
            g("div", qf, [
              ($(!0), L(ie, null, be(H.tags, (Q) => ($(), L("span", {
                key: Q.id,
                class: "tag"
              }, Z(Q.name), 1))), 128))
            ])
          ])
        ], 10, Wf))), 128)) : ($(), L("div", Jf, [
          ($(!0), L(ie, null, be(N.value, (H) => ($(), L("div", {
            key: H.id,
            class: ae(["list-item", { selected: f.value.has(H.id) }]),
            onClick: (Q) => ee(H)
          }, [
            g("label", {
              class: "list-checkbox",
              onClick: R[8] || (R[8] = me(() => {
              }, ["stop"]))
            }, [
              g("input", {
                type: "checkbox",
                checked: f.value.has(H.id),
                onClick: R[7] || (R[7] = me(() => {
                }, ["stop"])),
                onChange: (Q) => j(H, Q)
              }, null, 40, Xf)
            ]),
            g("div", Zf, Z(H.name), 1),
            g("div", Qf, [
              ($(!0), L(ie, null, be(H.tags, (Q) => ($(), L("span", {
                key: Q.id,
                class: "tag"
              }, Z(Q.name), 1))), 128))
            ])
          ], 10, Yf))), 128))
        ]))
      ], 6)
    ]));
  }
}), th = /* @__PURE__ */ ze(eh, [["__scopeId", "data-v-8fe2238e"]]), nh = {
  key: 0,
  class: "model-details"
}, sh = { class: "gallery-wrapper" }, oh = { class: "pending-image-frame" }, ih = ["src"], lh = {
  key: 1,
  class: "pending-image-empty"
}, rh = { class: "details-body" }, ah = { class: "field-group" }, ch = ["value"], uh = { class: "field-group" }, dh = ["title"], fh = { class: "field-group" }, hh = ["value"], ph = { class: "field-group" }, gh = { class: "readonly-box" }, mh = { class: "field-group" }, vh = { class: "tag-list" }, yh = { class: "field-group" }, _h = ["value"], bh = { class: "field-group" }, Ch = ["value"], Sh = { class: "field-group" }, xh = ["value"], Th = { class: "field-group" }, kh = ["value"], Eh = {
  key: 1,
  class: "empty-details"
}, $h = {
  key: 0,
  class: "loading-state"
}, Ah = {
  key: 1,
  class: "loading-state"
}, Mh = { key: 2 }, wh = /* @__PURE__ */ je({
  __name: "PendingModelDetails",
  props: {
    modelId: {}
  },
  setup(e) {
    const t = e, n = Jt("pending"), s = V(null), o = V(!1), i = V(null), l = V(!1), r = K(() => {
      var f, m;
      const d = (m = (f = s.value) == null ? void 0 : f.meta_json) == null ? void 0 : m.images;
      return Array.isArray(d) && d.length > 0;
    }), c = K(() => {
      if (!t.modelId || !r.value) return "";
      const d = Ss();
      return `${d ? `${d}` : ""}/api/images/pending/${t.modelId}`;
    }), h = async (d, f = !1) => {
      o.value = !0, i.value = null;
      try {
        await n.loadDetails(String(d), f);
        const m = n.getDetails(String(d)).value;
        s.value = m ? JSON.parse(JSON.stringify(m)) : null;
      } catch (m) {
        i.value = (m == null ? void 0 : m.message) || "Failed to load pending model details", s.value = null;
      } finally {
        o.value = !1;
      }
    };
    return Ke(() => t.modelId, (d) => {
      typeof d == "number" && !Number.isNaN(d) ? h(d) : s.value = null, l.value = !1;
    }, { immediate: !0 }), Ke(r, () => {
      l.value = !1;
    }), (d, f) => s.value ? ($(), L("div", nh, [
      g("div", sh, [
        g("div", oh, [
          c.value && !l.value ? ($(), L("img", {
            key: 0,
            src: c.value,
            alt: "Pending model preview",
            onError: f[0] || (f[0] = (m) => l.value = !0)
          }, null, 40, ih)) : ($(), L("div", lh, "No Image"))
        ])
      ]),
      g("div", rh, [
        g("div", ah, [
          f[1] || (f[1] = g("label", null, "Display Name", -1)),
          g("input", {
            type: "text",
            value: s.value.name,
            disabled: ""
          }, null, 8, ch)
        ]),
        g("div", uh, [
          f[2] || (f[2] = g("label", null, "Physical Path", -1)),
          g("div", {
            class: "readonly-box",
            title: s.value.path
          }, Z(s.value.path), 9, dh)
        ]),
        g("div", fh, [
          f[3] || (f[3] = g("label", null, "SHA256 Hash", -1)),
          g("input", {
            type: "text",
            value: s.value.sha256,
            disabled: "",
            class: "hash-input"
          }, null, 8, hh)
        ]),
        g("div", ph, [
          f[4] || (f[4] = g("label", null, "Model Type", -1)),
          g("div", gh, Z(s.value.type), 1)
        ]),
        g("div", mh, [
          f[5] || (f[5] = g("label", null, "Tags", -1)),
          g("div", vh, [
            ($(!0), L(ie, null, be(s.value.tags, (m) => ($(), L("span", {
              key: m.id,
              class: "tag"
            }, Z(m.name), 1))), 128))
          ])
        ]),
        g("div", yh, [
          f[6] || (f[6] = g("label", null, "Description", -1)),
          g("textarea", {
            value: s.value.meta_json.description,
            disabled: "",
            rows: "3"
          }, null, 8, _h)
        ]),
        g("div", bh, [
          f[7] || (f[7] = g("label", null, "Community Links", -1)),
          g("textarea", {
            value: s.value.meta_json.community_links,
            disabled: "",
            rows: "2"
          }, null, 8, Ch)
        ]),
        g("div", Sh, [
          f[8] || (f[8] = g("label", null, "Positive Prompt", -1)),
          g("textarea", {
            value: s.value.meta_json.prompts.positive,
            disabled: "",
            rows: "3"
          }, null, 8, xh)
        ]),
        g("div", Th, [
          f[9] || (f[9] = g("label", null, "Negative Prompt", -1)),
          g("textarea", {
            value: s.value.meta_json.prompts.negative,
            disabled: "",
            rows: "3"
          }, null, 8, kh)
        ])
      ])
    ])) : ($(), L("div", Eh, [
      o.value ? ($(), L("div", $h, "Loading details...")) : i.value ? ($(), L("div", Ah, Z(i.value), 1)) : ($(), L("div", Mh, [...f[10] || (f[10] = [
        g("div", { class: "placeholder-icon" }, "📭", -1),
        g("p", null, "Select a pending model to view details.", -1)
      ])]))
    ]));
  }
}), Ih = /* @__PURE__ */ ze(wh, [["__scopeId", "data-v-564fd283"]]), Lh = { class: "hikaze-modal-toolbar" }, Oh = { class: "modal-title" }, Ph = { class: "modal-actions" }, Nh = {
  key: 0,
  class: "selection-count"
}, Fh = ["disabled"], Rh = {
  key: 0,
  class: "badge"
}, Dh = ["disabled"], Hh = ["disabled"], jh = ["disabled"], zh = { class: "hikaze-modal-body" }, Vh = { class: "lora-library-pane" }, Bh = { class: "lora-library-body" }, Wh = /* @__PURE__ */ je({
  __name: "HikazeManagerModal",
  setup(e) {
    const t = V(void 0), n = V([]), s = V(!0), o = V([]), i = V({}), l = V({}), r = V(2), c = V("active"), h = V([]), d = V(void 0), f = V(!1), m = V(!1), _ = V(""), E = Jt(), T = Jt("pending"), N = T.getModels("pending"), C = K(() => N.value.length), v = K(() => C.value > 0), b = K(() => c.value === "pending"), S = K(() => bn.options), D = K(() => {
      var a;
      return ((a = S.value) == null ? void 0 : a.mode) === "multi";
    }), j = K(() => {
      var p;
      const a = String(((p = S.value) == null ? void 0 : p.initialTab) || "").toLowerCase();
      return D.value && (a === "loras" || a === "lora");
    }), ee = K(() => {
      var a;
      return ((a = S.value) == null ? void 0 : a.title) || (D.value ? "Select LoRAs" : "Select Checkpoint");
    }), J = K(() => j.value ? o.value.length : n.value.length), z = K(() => b.value ? !1 : D.value ? J.value > 0 : !!t.value), U = K(() => o.value.map((a) => i.value[a]).filter((a) => !!a)), oe = (a) => {
      bn.isOpen && a.key === "Escape" && tn(null);
    };
    Ot(() => window.addEventListener("keydown", oe)), pn(() => window.removeEventListener("keydown", oe));
    const A = () => {
      o.value = [], i.value = {}, l.value = {}, r.value = 2;
    }, R = () => {
      var p;
      if (A(), !j.value) return;
      const a = ((p = S.value) == null ? void 0 : p.payloadJson) ?? "";
      try {
        const y = zl(a);
        r.value = Number(y.version) || 2;
        const x = {}, k = {}, I = [];
        y.loras.forEach((P) => {
          const O = String(P.sha256 || "").trim();
          !O || k[O] || (k[O] = P, I.push(O), x[O] = {
            sha256: O,
            name: P.name || P.full_path,
            path: P.full_path,
            tags: []
          });
        }), o.value = I, i.value = x, l.value = k;
      } catch (y) {
        console.warn("Failed to parse LoRA payload JSON", y);
        const x = jl();
        r.value = Number(x.version) || 2;
      }
    };
    Ke(
      () => bn.isOpen,
      (a) => {
        a && (t.value = void 0, n.value = [], R()), c.value = "active", h.value = [], d.value = void 0, T.loadModels("pending");
      }
    );
    const H = () => {
      tn(null);
    }, Q = (a, p) => {
      o.value.includes(a) || (o.value = [...o.value, a]), i.value = {
        ...i.value,
        [a]: p
      };
    }, X = (a) => {
      if (!o.value.includes(a)) return;
      o.value = o.value.filter((y) => y !== a);
      const p = { ...i.value };
      delete p[a], i.value = p;
    }, ne = (a, p) => {
      !j.value || !a.sha256 || (p ? Q(a.sha256, {
        sha256: a.sha256,
        name: a.name || a.path,
        path: a.path,
        tags: a.tags
      }) : X(a.sha256));
    }, se = (a, p) => {
      j.value && (p || X(a));
    }, xe = (a) => ({
      sha256: a.sha256,
      name: a.name,
      path: a.path,
      tags: a.tags,
      images_count: 0,
      type: "lora",
      size_bytes: 0,
      created_at: 0
    }), at = (a) => {
      t.value = xe(a);
    }, Ve = () => {
      o.value = [], i.value = {};
    }, Ae = (a) => {
      if (b.value)
        return;
      if (t.value = a, j.value) {
        a.sha256 && !o.value.includes(a.sha256) && Q(a.sha256, {
          sha256: a.sha256,
          name: a.name || a.path,
          path: a.path,
          tags: a.tags
        });
        return;
      }
      if (!D.value) {
        n.value = [a];
        return;
      }
      n.value.find((y) => y.sha256 === a.sha256) ? n.value = n.value.filter((y) => y.sha256 !== a.sha256) : n.value = [...n.value, a];
    }, Tt = (a) => {
      d.value = a;
    }, ct = (a, p) => {
      if (p) {
        h.value.includes(a.id) || (h.value = [...h.value, a.id]);
        return;
      }
      h.value = h.value.filter((y) => y !== a.id);
    }, Xt = async () => {
      c.value = "pending", h.value = [], d.value = void 0, await T.loadModels("pending", !0);
    }, ut = () => {
      c.value = "active", h.value = [], d.value = void 0;
    }, kt = () => {
      b.value ? ut() : Xt();
    }, Pt = async (a) => {
      if (!(m.value || !window.confirm("Scan model directories for new files? This might take a moment."))) {
        m.value = !0;
        try {
          const y = await ku();
          window.alert(`Scan complete: ${y.added} new models found, ${y.scanned} scanned total.`), await T.loadModels("pending", !0), E.invalidate(), a && await E.loadModels(a, !0);
        } catch (y) {
          window.alert((y == null ? void 0 : y.message) || "Failed to scan models");
        } finally {
          m.value = !1;
        }
      }
    }, Nt = (a) => {
      const p = new Map(N.value.map((y) => [y.id, y.name]));
      return a.map((y, x) => {
        var F, B, G, te;
        const k = (F = y.pending) == null ? void 0 : F.id, I = k !== void 0 ? p.get(k) : void 0, P = I ? `${I} (#${k})` : `#${k ?? "unknown"}`, O = (B = y.pending) != null && B.path ? ` | ${y.pending.path}` : "", w = ((G = y.existing) == null ? void 0 : G.id) ?? "unknown", W = (te = y.existing) != null && te.path ? ` | ${y.existing.path}` : "";
        return `${x + 1}. Pending: ${P}${O}
   Existing: ${w}${W}`;
      }).join(`
`);
    }, dt = async () => {
      if (!(h.value.length === 0 || f.value)) {
        f.value = !0;
        try {
          const a = await gi(h.value, null);
          if (a.conflict.length > 0) {
            window.alert(`Conflicts detected:
${Nt(a.conflict)}`);
            const p = ["override", "merge", "ignore", "delete"], y = (P) => p.includes(P);
            let x = null, k = [];
            const I = window.prompt(
              "Conflicts found. Choose strategy: override, merge, ignore, delete",
              "override"
            );
            if (I) {
              const P = I.trim().toLowerCase();
              y(P) ? (x = P, k = a.conflict.map((O) => {
                var w;
                return (w = O.pending) == null ? void 0 : w.id;
              }).filter((O) => typeof O == "number")) : window.alert("Invalid strategy. Please use override, merge, ignore, or delete.");
            }
            x && k.length > 0 && await gi(k, x);
          }
          h.value = [], d.value = void 0, await T.loadModels("pending", !0), E.invalidate();
        } catch (a) {
          window.alert((a == null ? void 0 : a.message) || "Failed to import pending models");
        } finally {
          f.value = !1;
        }
      }
    }, M = () => {
      if (z.value)
        if (D.value) {
          if (j.value) {
            const p = o.value.map((x) => {
              const k = l.value[x];
              if (k) return k;
              const I = i.value[x];
              return eu({
                name: (I == null ? void 0 : I.name) ?? "",
                full_path: (I == null ? void 0 : I.path) ?? "",
                strength_model: 1,
                strength_clip: 1,
                sha256: x,
                enabled: !0
              });
            }), y = {
              version: Number(r.value) || 2,
              loras: p
            };
            tn(y);
            return;
          }
          const a = {
            version: 2,
            loras: n.value.map((p) => ({
              name: p.name || p.path,
              full_path: p.path,
              strength_model: 1,
              strength_clip: 1,
              sha256: p.sha256,
              enabled: !0
            }))
          };
          tn(a);
        } else t.value && tn({ ckpt_path: t.value.path });
    }, u = (a) => {
      _.value = a;
    };
    return (a, p) => {
      var y;
      return $(), De(Qi, { to: "body" }, [
        qe(bn).isOpen ? ($(), L("div", {
          key: 0,
          class: ae(["hikaze-modal-backdrop", { "is-fullscreen": s.value }]),
          onClick: me(H, ["self"])
        }, [
          g("div", {
            class: ae(["hikaze-modal-content", { "is-fullscreen": s.value, "is-pending": b.value }])
          }, [
            g("div", Lh, [
              g("div", Oh, Z(ee.value), 1),
              g("div", Ph, [
                D.value && !b.value ? ($(), L("div", Nh, Z(J.value) + " selected ", 1)) : ge("", !0),
                g("button", {
                  class: "btn btn-secondary",
                  type: "button",
                  onClick: p[0] || (p[0] = () => Pt(_.value)),
                  disabled: m.value,
                  title: "Scans disk for new models"
                }, Z(m.value ? "Scanning..." : "Scan"), 9, Fh),
                g("button", {
                  class: ae(["btn btn-secondary pending-toggle", { active: b.value }]),
                  type: "button",
                  onClick: kt
                }, [
                  p[1] || (p[1] = it(" Pending ", -1)),
                  v.value ? ($(), L("span", Rh, Z(C.value), 1)) : ge("", !0)
                ], 2),
                b.value ? ($(), L("button", {
                  key: 1,
                  class: "btn btn-secondary pending-import",
                  type: "button",
                  disabled: h.value.length === 0 || f.value,
                  onClick: dt
                }, " Import Selected ", 8, Dh)) : ge("", !0),
                j.value && !b.value ? ($(), L("button", {
                  key: 2,
                  class: "btn btn-secondary",
                  type: "button",
                  disabled: J.value === 0,
                  onClick: Ve
                }, " Clear selection ", 8, Hh)) : ge("", !0),
                g("button", {
                  class: "btn btn-secondary",
                  onClick: H
                }, "Cancel"),
                g("button", {
                  class: "btn btn-primary",
                  disabled: !z.value,
                  onClick: M
                }, "Confirm", 8, jh)
              ])
            ]),
            g("div", zh, [
              _e(Zu, {
                embedded: !0,
                initialTab: (y = qe(bn).options) == null ? void 0 : y.initialTab,
                mode: c.value,
                onTabChange: u
              }, {
                library: rt(({ activeTab: x }) => [
                  g("div", Vh, [
                    j.value && !b.value ? ($(), De(Mf, {
                      key: 0,
                      items: U.value,
                      onToggle: se,
                      onSelect: at
                    }, null, 8, ["items"])) : ge("", !0),
                    g("div", Bh, [
                      b.value ? ($(), De(th, {
                        key: 0,
                        "active-tab": x,
                        "selected-ids": h.value,
                        onSelectModel: Tt,
                        onToggleSelect: ct
                      }, null, 8, ["active-tab", "selected-ids"])) : ($(), De(Od, {
                        key: 1,
                        "active-tab": x,
                        "selection-mode": j.value ? "lora" : void 0,
                        "selected-ids": o.value,
                        "exclude-selected": j.value,
                        onSelectModel: Ae,
                        onToggleSelect: ne
                      }, null, 8, ["active-tab", "selection-mode", "selected-ids", "exclude-selected"]))
                    ])
                  ])
                ]),
                details: rt(() => {
                  var x;
                  return [
                    b.value ? ($(), De(Ih, {
                      key: 0,
                      "model-id": (x = d.value) == null ? void 0 : x.id
                    }, null, 8, ["model-id"])) : ($(), De(bf, {
                      key: 1,
                      model: t.value
                    }, null, 8, ["model"]))
                  ];
                }),
                _: 1
              }, 8, ["initialTab", "mode"])
            ])
          ], 2)
        ], 2)) : ge("", !0)
      ]);
    };
  }
}), Uh = /* @__PURE__ */ ze(Wh, [["__scopeId", "data-v-58d1bde3"]]), vi = "__hikazeCollapseHooked", yi = "__hikazeVueNodesSettingHooked";
class Kh {
  /**
   * Create the manager; call `install()` once ComfyUI app exists.
   */
  constructor(t) {
    fe(this, "extName");
    fe(this, "getComfyApp");
    fe(this, "controllersByNode", /* @__PURE__ */ new WeakMap());
    fe(this, "controllers", /* @__PURE__ */ new Set());
    fe(this, "graphChangeListenerInstalled", !1);
    fe(this, "collapseReinjectTimers", /* @__PURE__ */ new WeakMap());
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
    t.setAttribute("data-hikaze-global-host", "1"), t.style.display = "none", document.body.appendChild(t), Nl(Uh).mount(t);
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
   * ComfyUI callback: node is being removed from the graph.
   * Cleans up the controller and its associated DOM overlays.
   */
  onNodeRemoved(t) {
    try {
      if (!this.isHikazeNode(t)) return;
      this.disposeControllerIfExists(t);
    } catch (n) {
      console.error("[Hikaze] Error in onNodeRemoved:", n);
    }
  }
  /**
   * Reinject all Hikaze nodes in the active graph (debug/manual reload).
   */
  reinjectAll(t = "manual-reload") {
    this.disposeAllControllers(), this.reinjectAllForMode(this.getCurrentMode(), t);
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
    const n = this.getNodeType(t), s = (n ? qt.resolve(n) : void 0) ?? qt, o = new s(t);
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
    try {
      document.querySelectorAll("[data-hikaze-canvas-overlay]").forEach((t) => t.remove());
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
    hi(n, yi) || (pi(n, yi), n.addEventListener(uu, (o) => {
      var r;
      const i = !!((r = o == null ? void 0 : o.detail) != null && r.value), l = i ? "vue" : "legacy";
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
    if (!t || typeof t != "object" || hi(t, vi)) return;
    const n = t.collapse;
    typeof n == "function" && (pi(t, vi), t.collapse = (...s) => {
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
    return !!n && n.startsWith(cu);
  }
}
const Gh = new URL("./hikaze-model-manager-2.css", import.meta.url), xs = document.createElement("link");
xs.rel = "stylesheet";
xs.type = "text/css";
xs.href = Gh.href;
document.head.appendChild(xs);
const Gt = "Hikaze.ModelManager2";
console.info(`[${Gt}] loaded`);
const qh = globalThis;
qh.__HIKAZE_EMBEDDED__ = !0;
_u();
xu();
function Jl() {
  var t, n;
  const e = ((n = (t = globalThis == null ? void 0 : globalThis.comfyAPI) == null ? void 0 : t.app) == null ? void 0 : n.app) ?? (globalThis == null ? void 0 : globalThis.app);
  return e || console.warn(`[${Gt}] Failed to get app instance.`), e;
}
const mt = new Kh({
  extName: Gt,
  getComfyApp: Jl
});
function _i(e) {
  const t = e.onRemoved;
  e.onRemoved = function(...n) {
    var s;
    try {
      (s = mt.onNodeRemoved) == null || s.call(mt, e);
    } catch (o) {
      console.error(`[${Gt}] Error in onRemoved handler:`, o);
    }
    return t == null ? void 0 : t.call(this, ...n);
  };
}
function Yl() {
  const e = Jl();
  if (!(e != null && e.registerExtension)) {
    setTimeout(Yl, 250);
    return;
  }
  e.registerExtension({
    name: Gt,
    /**
     * Called when the app is initialized and ready.
     * We install our global event listeners here.
     */
    async setup(t) {
      console.info(`[${Gt}] setup() called`), mt.install();
    },
    /**
     * Called after a workflow is loaded (from file, API, or tab switch).
     * This is the ideal time to inject UI overlays for the entire graph.
     */
    async afterConfigureGraph(t) {
      mt.reinjectAll("graph-loaded");
    },
    /**
     * Called when a new node is added (e.g. from menu).
     */
    nodeCreated(t) {
      mt.isHikazeNode(t) && _i(t), mt.onNodeCreated(t);
    },
    /**
     * Called when a node is loaded from a saved workflow.
     * We also need to inject the onRemoved hook for these nodes.
     */
    loadedGraphNode(t) {
      mt.isHikazeNode(t) && _i(t);
    },
    getCanvasMenuItems() {
      return [
        {
          content: "Hikaze Model Manager (HMM)",
          callback: async () => {
            const t = await Gl();
            t ? window.open(t, "_blank") : alert("Hikaze Model Manager server port not found. Is the backend running?");
          }
        },
        {
          content: "Reload Hikaze Node UI",
          // Manual reinjection is useful during development/debugging.
          callback: () => mt.reinjectAll("manual-reload")
        }
      ];
    }
  }), console.info(`[${Gt}] registered`);
}
Yl();
//# sourceMappingURL=hikaze-model-manager.js.map
