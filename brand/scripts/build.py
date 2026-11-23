"""Build Pitchside logo SVGs. Run: python3 scripts/build.py"""
import os, sys, math
sys.path.insert(0, os.path.dirname(__file__))
import geometry as g
import wordmark as w

ROOT = os.path.join(os.path.dirname(__file__), '..')
CREAM = '#F6F6EE'
PITCH = '#0D1F17'


def true_bounds():
    """Exact ink bounds of the slanted symbol (samples the curves)."""
    xs, ys = [], []
    for segs in g.pieces().values():
        cur = None
        for s in segs:
            if s[0] in ('M', 'L'):
                cur = s[1]; x, y = g.shear(cur); xs.append(x); ys.append(y)
            elif s[0] == 'C':
                p0, c1, c2, p3 = cur, s[1], s[2], s[3]
                for i in range(41):
                    t = i / 40
                    pt = tuple((1-t)**3*p0[k] + 3*(1-t)**2*t*c1[k] + 3*(1-t)*t*t*c2[k] + t**3*p3[k] for k in (0, 1))
                    x, y = g.shear(pt); xs.append(x); ys.append(y)
                cur = p3
    return min(xs), min(ys), max(xs), max(ys)


SYM_X0, SYM_Y0, SYM_X1, SYM_Y1 = true_bounds()


def symbol_paths(dx=0, dy=0, scale=1, fill=CREAM, indent='  '):
    lines = []
    for name, segs in g.pieces().items():
        d = g.to_d(segs, dx=dx - SYM_X0 * scale, dy=dy, scale=scale)
        lines.append(f'{indent}<path id="tile-{name}" fill="{fill}" d="{d}"/>')
    return '\n'.join(lines)


def svg(w_, h_, body, title):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {fmt(w_)} {fmt(h_)}" '
            f'width="{fmt(w_)}" height="{fmt(h_)}" role="img" aria-labelledby="t">\n'
            f'  <title id="t">{title}</title>\n{body}\n</svg>\n')


def fmt(v):
    return (f"{v:.2f}".rstrip('0').rstrip('.')) or '0'


def write(rel, text):
    p = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, 'w').write(text)
    return p


# ---------------- Symbol ----------------
def build_symbol(fill=CREAM, path='logo/pitchside-symbol.svg'):
    W = SYM_X1 - SYM_X0
    body = f'  <g id="pitchside-symbol">\n{symbol_paths(fill=fill, indent="    ")}\n  </g>'
    return write(path, svg(W, g.H, body, 'Pitchside symbol'))


# ---------------- Lockups ----------------
LOCKUPS = {
    # name: (cap height in symbol units, baseline y in symbol units)
    'A-reference': (g.H / 1.8, g.BOWL),          # bowl sits on baseline, symbol = 1.8 x cap
    'B-grid-locked': (60.0, g.BOWL),              # bowl on baseline AND cut on cap mid-line
    'C-hero': (48.0, g.CUT + 24.0),               # cut on cap mid-line, symbol = 2 x cap
}
WORDMARKS = {
    'A-square-dot': {'i': w.square_tittle},   # faithful to the reference
    'B-tile-dot': {'i': w.tile_tittle},       # echoes the symbol
    'C-round-dot': {'i': w.round_tittle},     # stock Inter dot
}


def build_lockup(lockup='A-reference', wm='A-square-dot', fill=CREAM, path=None):
    cap, baseline = LOCKUPS[lockup]
    s = cap / w.CAP
    laid = w.layout(mods=WORDMARKS[wm])
    ink0, ink1 = w.ink_bounds(laid)
    sym_w = SYM_X1 - SYM_X0
    gap = 0.5 * cap
    wm_x = sym_w + gap - ink0 * s
    total_w = sym_w + gap + (ink1 - ink0) * s
    d = w.to_d(laid, s, wm_x, baseline)
    body = (f'  <g id="pitchside-symbol">\n{symbol_paths(fill=fill, indent="    ")}\n  </g>\n'
            f'  <path id="pitchside-wordmark" fill="{fill}" d="{d}"/>')
    path = path or f'logo/options/pitchside-lockup-{lockup}__wordmark-{wm}.svg'
    return write(path, svg(total_w, g.H, body, 'Pitchside'))


def build_wordmark(wm='A-square-dot', fill=CREAM, path='logo/pitchside-wordmark.svg'):
    cap = 100.0
    s = cap / w.CAP
    laid = w.layout(mods=WORDMARKS[wm])
    ink0, ink1 = w.ink_bounds(laid)
    # viewBox spans the i-dot top (1572) to the round overshoot (-19)
    asc, desc = 1572 * s, 19 * s
    d = w.to_d(laid, s, -ink0 * s, asc)
    return write(path, svg((ink1 - ink0) * s, asc + desc, f'  <path id="pitchside-wordmark" fill="{fill}" d="{d}"/>', 'Pitchside wordmark'))


if __name__ == '__main__':
    # Approval candidates (recommended)
    print(build_symbol())
    print(build_lockup('A-reference', 'A-square-dot', path='logo/pitchside-logo-primary.svg'))
    print(build_wordmark('A-square-dot'))
    # Decision 1: i-dot treatment (shown in the recommended lockup)
    for wm in WORDMARKS:
        print(build_lockup('A-reference', wm, path=f'logo/options/dot-{wm}.svg'))
    # Decision 2: symbol-to-wordmark proportion
    for lk in LOCKUPS:
        print(build_lockup(lk, 'A-square-dot', path=f'logo/options/lockup-{lk}.svg'))
    # Decision 3: stem length (the hero render shows a shorter stem)
    g.H = 90
    globals().update(dict(zip(('SYM_X0', 'SYM_Y0', 'SYM_X1', 'SYM_Y1'), true_bounds())))
    print(build_symbol(path='logo/options/symbol-short-stem.svg'))
