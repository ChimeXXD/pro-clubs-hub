"""Pitchside symbol construction.

The symbol is drawn upright on a 96-unit grid, then slanted 15 degrees.
The slant is baked into the path coordinates so the SVG has no transforms.
"""
import math

H = 96            # symbol height (grid units)
STEM = 48         # stem / left column width
GAP = 6           # width of both cuts (the "grid lines")
RIGHT = 102       # right edge of the bowl
CUT = 42          # centre line of the horizontal cut
BOWL = 72         # bottom of the bowl (sits on the wordmark baseline)
R_TL = 24         # top-left corner radius
R_TR = 30         # top-right corner radius
R_BR = 30         # bottom-right corner radius
SLANT = 15        # degrees
T = math.tan(math.radians(SLANT))
K = 0.5522847498  # cubic bezier circle constant


def shear(p):
    x, y = p
    return (x + (H - y) * T, y)


def arc_pts(cx, cy, r, a0, a1, segs=None):
    """Cubic bezier approximation of a circular arc (degrees, y down)."""
    a0r, a1r = math.radians(a0), math.radians(a1)
    span = a1r - a0r
    n = segs or max(1, math.ceil(abs(span) / (math.pi / 2) - 1e-9))
    out = []
    for i in range(n):
        s = a0r + span * i / n
        e = a0r + span * (i + 1) / n
        k = 4 / 3 * math.tan((e - s) / 4) * r
        p0 = (cx + r * math.cos(s), cy + r * math.sin(s))
        p3 = (cx + r * math.cos(e), cy + r * math.sin(e))
        c1 = (p0[0] - k * math.sin(s), p0[1] + k * math.cos(s))
        c2 = (p3[0] + k * math.sin(e), p3[1] - k * math.cos(e))
        out.append((c1, c2, p3))
    return out


def pieces():
    """Return the four tiles as lists of path segments in upright space.
    Each segment is ('M',p) ('L',p) or ('C',c1,c2,p)."""
    top_end = CUT - GAP / 2      # 39
    low_start = CUT + GAP / 2    # 45
    col2 = STEM + GAP            # 54
    tiles = {}

    # Top-left tile: rounded top-left corner
    tl = [('M', (0, top_end)), ('L', (0, R_TL))]
    for c1, c2, p in arc_pts(R_TL, R_TL, R_TL, 180, 270):
        tl.append(('C', c1, c2, p))
    tl += [('L', (STEM, 0)), ('L', (STEM, top_end)), ('Z',)]
    tiles['top-left'] = tl

    # Top-right tile: rounded top-right corner
    cx = RIGHT - R_TR
    tr = [('M', (col2, top_end)), ('L', (col2, 0)), ('L', (cx, 0))]
    for c1, c2, p in arc_pts(cx, R_TR, R_TR, 270, 360):
        tr.append(('C', c1, c2, p))
    tr += [('L', (RIGHT, top_end)), ('Z',)]
    tiles['top-right'] = tr

    # Stem tile
    tiles['stem'] = [('M', (0, low_start)), ('L', (STEM, low_start)),
                     ('L', (STEM, H)), ('L', (0, H)), ('Z',)]

    # Bottom-right tile: the bowl's lower curve, centred on the cut line
    bcx, bcy = RIGHT - R_BR, BOWL - R_BR       # (72, 42)
    dy = low_start - bcy
    start_deg = math.degrees(math.asin(dy / R_BR))
    xs = bcx + math.sqrt(R_BR ** 2 - dy ** 2)
    br = [('M', (col2, low_start)), ('L', (xs, low_start))]
    for c1, c2, p in arc_pts(bcx, bcy, R_BR, start_deg, 90):
        br.append(('C', c1, c2, p))
    br += [('L', (col2, BOWL)), ('Z',)]
    tiles['bottom-right'] = br
    return tiles


def fmt(v):
    s = f"{v:.2f}".rstrip('0').rstrip('.')
    return '0' if s == '-0' else s


def to_d(segs, dx=0.0, dy=0.0, scale=1.0, slant=True):
    f = (lambda p: shear(p)) if slant else (lambda p: p)
    def P(p):
        x, y = f(p)
        return f"{fmt(x * scale + dx)} {fmt(y * scale + dy)}"
    out = []
    for s in segs:
        if s[0] == 'M': out.append('M' + P(s[1]))
        elif s[0] == 'L': out.append('L' + P(s[1]))
        elif s[0] == 'C': out.append('C' + ' '.join(P(q) for q in s[1:]))
        elif s[0] == 'Z': out.append('Z')
    return ''.join(out)


def bounds():
    xs, ys = [], []
    for segs in pieces().values():
        for s in segs:
            for p in s[1:]:
                x, y = shear(p); xs.append(x); ys.append(y)
    return min(xs), min(ys), max(xs), max(ys)
