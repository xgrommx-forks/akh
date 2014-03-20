/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/trans/dcont.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "nu-stream/stream", "../state", "../structure"], (function(require, exports, stream,
    State, __o) {
    "use strict";
    var first = stream["first"],
        rest = stream["rest"],
        isEmpty = stream["isEmpty"],
        Functor = __o["Functor"],
        Monad = __o["Monad"],
        DContT, Seg = (function(f) {
            var self = this;
            (self.frame = f);
        }),
        P = (function(t) {
            var self = this;
            (self.prompt = t);
        }),
        empty = stream.NIL,
        push = stream.cons,
        pushSeq = stream.append,
        pushP = (function(t, k) {
            return push(new(P)(t), k);
        }),
        pushSeg = (function(f, k) {
            return push(new(Seg)(f), k);
        }),
        splitSeq = (function(t, k) {
            if (isEmpty(k)) return [empty, empty];
            var x = first(k),
                xs = rest(k);
            if (((x instanceof P) && (x.prompt === t))) return [empty, xs];
            var __o = splitSeq(t, xs),
                a = __o[0],
                b = __o[1];
            return [push(x, a), b];
        }),
        unDContT = (function(m, k) {
            return m.run(k);
        }),
        runDContT = (function(m, k) {
            return State.evalState(unDContT(m, k), 1);
        }),
        appk = (function(k, x) {
            var c = k;
            do {
                if (((typeof c) === "function")) return State.of(c(x));
                var top = first(c);
                if ((top instanceof Seg)) return unDContT(top.frame(x), rest(c));
                (c = ((top instanceof P) ? rest(c) : top));
            }
            while (true);
        }),
        createPrompt = State.get.chain((function(x) {
            return State.put((x + 1))
                .chain((function() {
                    return State.of(x);
                }));
        }));
    (DContT = (function(m) {
        var Instance = (function(run) {
            var self = this;
            (self.run = run);
        });
        Monad(Instance, (function(x) {
            return new(Instance)((function(k) {
                return appk(k, x);
            }));
        }), (function(c, f) {
            return new(Instance)((function(k) {
                return unDContT(c, pushSeg(f, k));
            }));
        }));
        (Instance.lift = (function(t) {
            return new(Instance)((function(k) {
                return State.of(t.chain(appk.bind(null, k)));
            }));
        }));
        (Instance.newPrompt = (Instance.prototype.newPrompt = new(Instance)((function(k) {
            return createPrompt.chain(appk.bind(null, k));
        }))));
        (Instance.pushPrompt = (Instance.prototype.pushPrompt = (function(prompt, c) {
            return new(Instance)((function(k) {
                return unDContT(c, pushP(prompt, k));
            }));
        })));
        (Instance.withSubCont = (Instance.prototype.withSubCont = (function(prompt, f) {
            return new(Instance)((function(k) {
                var __o = splitSeq(prompt, k),
                    x = __o[0],
                    xs = __o[1];
                return unDContT(f(x), xs);
            }));
        })));
        (Instance.pushSubCont = (Instance.prototype.pushSubCont = (function(subk, c) {
            return new(Instance)((function(k) {
                return unDContT(c, pushSeq(subk, k));
            }));
        })));
        (Instance.reset = (Instance.prototype.reset = (function(f) {
            return Instance.newPrompt.chain((function(p) {
                return Instance.pushPrompt(p, f(p));
            }));
        })));
        (Instance.shift = (Instance.prototype.shift = (function(p, f) {
            var t = this;
            return t.withSubCont(p, (function(k) {
                return t.pushPrompt(p, f((function(c) {
                    return t.pushPrompt(p, t.pushSubCont(k, c));
                })));
            }));
        })));
        return Instance;
    }));
    (DContT.runDContT = (function(m, k) {
        return runDContT(m, push(k, empty));
    }));
    return DContT;
}));